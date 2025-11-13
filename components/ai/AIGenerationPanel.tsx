'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { useAIStore } from '@/stores/ai-store';
import { useTabStore } from '@/stores/tab-store';
import { useCanvasStore } from '@/stores/canvas-store';
import { useUIStore } from '@/stores/ui-store';
import {
  Sparkles,
  X,
  Loader2,
  RefreshCw,
  Settings,
  Upload,
  Trash2,
  Image as ImageIcon,
  Wand2,
} from 'lucide-react';
import { ARTIST_STYLES } from '@/lib/prompts/styles';
import type { AspectRatio, GenerationQuality, ReferenceImage, Style } from '@/types';

const promptSuggestions = [
  'Elegant watercolor floral design with soft pink roses',
  'Modern minimalist geometric patterns in gold and white',
  'Romantic botanical illustration with eucalyptus leaves',
  'Vintage art deco style with intricate borders',
  'Delicate calligraphy-style typography with floral accents',
  'Boho chic design with dreamcatchers and feathers',
  'Classic monogram design with elegant script',
  'Garden party theme with wildflowers and butterflies',
];

const aspectOptions: { label: string; value: AspectRatio }[] = [
  { label: '5×7', value: '5x7' },
  { label: '4×6', value: '4x6' },
  { label: 'Square', value: 'square' },
];

const qualityOptions: { label: string; value: GenerationQuality; description: string }[] = [
  { label: 'Preview', value: 'preview', description: 'Fast concept (~0.02 credits)' },
  { label: 'Proof', value: 'proof', description: 'High quality (~0.03 credits)' },
  { label: 'Print', value: 'print', description: 'Background for print (~0.04 credits)' },
];

const STYLE_LIST: Style[] = Object.values(ARTIST_STYLES);

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function AIGenerationPanel() {
  const { aiPanelOpen, toggleAIPanel } = useUIStore();
  const {
    prompt,
    setPrompt,
    selectedStyle,
    setStyle,
    aspectRatio,
    setAspectRatio,
    quality,
    setQuality,
    isGenerating,
    generate,
    regenerate,
    references,
    addReference,
    removeReference,
    clearReferences,
    baseImage,
    setBaseImage,
    mask,
    setMask,
    clearImageInputs,
    error,
    clearError,
    lastResult,
    setTemplateContext,
  } = useAIStore();
  const { getActiveTab, createVariantFromActive, updateTab } = useTabStore();
  const { addImage, exportToPNG, canvas } = useCanvasStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showCanvasAsBase, setShowCanvasAsBase] = useState(false);
  const [canvasWarning, setCanvasWarning] = useState(false);

  const handleGenerate = async () => {
    if (!prompt || !selectedStyle) return;

    // Check if canvas exists before generating
    if (!canvas) {
      console.error('[AIGenerationPanel] No canvas available - user needs to create a template first');
      setCanvasWarning(true);
      setTimeout(() => setCanvasWarning(false), 5000);
      return;
    }

    console.log('[AIGenerationPanel] Starting generation...');
    try {
      const activeTab = getActiveTab();
      if (activeTab) {
        setTemplateContext({
          type: activeTab.type,
          width: activeTab.width,
          height: activeTab.height,
          name: activeTab.name,
        });
      } else {
        setTemplateContext(null);
      }

      const result = await generate();
      console.log('[AIGenerationPanel] Generation completed:', result);
      if (result?.imageUrl) {
        console.log('[AIGenerationPanel] Adding image to canvas:', result.imageUrl);

        const variantTab = createVariantFromActive();
        const targetTab = variantTab ?? activeTab;
        if (targetTab) {
          setTemplateContext({
            type: targetTab.type,
            width: targetTab.width,
            height: targetTab.height,
            name: targetTab.name,
          });
          if (variantTab && result.processing?.metadataUrl) {
            updateTab(variantTab.id, { metadataUrl: result.processing.metadataUrl });
          } else if (result.processing?.metadataUrl) {
            updateTab(targetTab.id, { metadataUrl: result.processing.metadataUrl });
          }
        }

        // The background image will be loaded automatically from metadata
        // No need to manually add it - just close the panel
        console.log('[AIGenerationPanel] Generation complete, background will load from metadata');
        setTimeout(() => {
          toggleAIPanel();
          console.log('[AIGenerationPanel] Panel closed');
        }, 500);
      } else {
        console.error('[AIGenerationPanel] No imageUrl in result');
      }
    } catch (generationError) {
      console.error('[AIGenerationPanel] Generation failed:', generationError);
    }
  };

  const handleRegenerate = async () => {
    if (!prompt || !selectedStyle) return;

    console.log('[AIGenerationPanel] Starting regeneration...');
    try {
      const activeTab = getActiveTab();
      if (activeTab) {
        setTemplateContext({
          type: activeTab.type,
          width: activeTab.width,
          height: activeTab.height,
          name: activeTab.name,
        });
      } else {
        setTemplateContext(null);
      }

      const result = await regenerate();
      console.log('[AIGenerationPanel] Regeneration completed:', result);
      if (result?.imageUrl) {
        console.log('[AIGenerationPanel] Adding image to canvas:', result.imageUrl);
        const variantTab = createVariantFromActive();
        const targetTab = variantTab ?? getActiveTab();
        if (targetTab) {
          setTemplateContext({
            type: targetTab.type,
            width: targetTab.width,
            height: targetTab.height,
            name: targetTab.name,
          });
          if (variantTab && result.processing?.metadataUrl) {
            updateTab(variantTab.id, { metadataUrl: result.processing.metadataUrl });
          } else if (result.processing?.metadataUrl) {
            updateTab(targetTab.id, { metadataUrl: result.processing.metadataUrl });
          }
        }

        // The background image will be loaded automatically from metadata
        // No need to manually add it
        console.log('[AIGenerationPanel] Regeneration complete, background will load from metadata');
      } else {
        console.error('[AIGenerationPanel] No imageUrl in result');
      }
    } catch (error) {
      console.error('[AIGenerationPanel] Regeneration failed:', error);
    }
  };

  const onDropReferences = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles.slice(0, 3)) {
        const dataUrl = await fileToDataUrl(file);
        const reference: ReferenceImage = {
          id: uuidv4(),
          dataUrl,
          fileName: file.name,
          mimeType: file.type,
        };
        addReference(reference);
      }
    },
    [addReference]
  );

  const onDropMask = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      const file = acceptedFiles[0];
      const dataUrl = await fileToDataUrl(file);
      setMask({
        id: uuidv4(),
        dataUrl,
        fileName: file.name,
        mimeType: file.type,
      });
    },
    [setMask]
  );

  const onDropBaseImage = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      const file = acceptedFiles[0];
      const dataUrl = await fileToDataUrl(file);
      setShowCanvasAsBase(false);
      setBaseImage({
        id: uuidv4(),
        dataUrl,
        fileName: file.name,
        mimeType: file.type,
      });
    },
    [setBaseImage]
  );

  const referenceDropzone = useDropzone({
    onDrop: onDropReferences,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    disabled: isGenerating,
  });

  const baseImageDropzone = useDropzone({
    onDrop: onDropBaseImage,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    disabled: isGenerating,
  });

  const maskDropzone = useDropzone({
    onDrop: onDropMask,
    accept: {
      'image/png': ['.png'],
    },
    maxFiles: 1,
    disabled: isGenerating,
  });

  const handleUseCanvasAsBase = useCallback(async () => {
    if (!exportToPNG) return;
    try {
      const blob = await exportToPNG(2);
      const dataUrl = await blobToDataUrl(blob);
      setShowCanvasAsBase(true);
      setBaseImage({
        id: 'canvas-base',
        dataUrl,
        fileName: 'canvas-base.png',
        mimeType: blob.type || 'image/png',
      });
    } catch (err) {
      console.error('Failed to capture canvas as base image', err);
    }
  }, [exportToPNG, setBaseImage]);

  const disableGenerate = !prompt.trim() || !selectedStyle || isGenerating;

  if (!aiPanelOpen) return null;

  const selectedStyleDetails = STYLE_LIST.find((style) => style.id === selectedStyle?.id);

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="h-16 border-b px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Generation</h2>
        </div>
        <button
          onClick={toggleAIPanel}
          className="p-2 hover:bg-gray-100 rounded"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Style Selector */}
        <div>
          <label className="text-sm font-semibold mb-2 block">Style</label>
          <select
            value={selectedStyle?.id || ''}
            onChange={(e) => {
              const style = STYLE_LIST.find((s) => s.id === e.target.value);
              if (style) setStyle(style);
            }}
            className="w-full px-3 py-2 border rounded text-sm"
          >
            <option value="">Select a style...</option>
            {STYLE_LIST.map((style) => (
              <option key={style.id} value={style.id}>
                {style.name} by {style.artistName}
              </option>
            ))}
          </select>
          {selectedStyleDetails && (
            <div className="mt-2 p-3 bg-gray-50 rounded text-xs">
              <p className="font-medium">{selectedStyleDetails.name}</p>
              <p className="text-gray-600">
                Powered by {selectedStyleDetails.artistName}
              </p>
            </div>
          )}
        </div>

        {/* Prompt Input */}
        <div>
          <label className="text-sm font-semibold mb-2 block">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the design you want to generate..."
            className="w-full px-3 py-2 border rounded text-sm min-h-[120px] resize-none"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">{prompt.length}/500</span>
            <button
              onClick={() => {
                const suggestion = promptSuggestions[Math.floor(Math.random() * promptSuggestions.length)];
                setPrompt(suggestion);
              }}
              className="text-xs text-primary hover:underline"
            >
              💡 Get suggestion
            </button>
          </div>

          {/* Prompt Suggestions */}
          <div className="mt-2 flex flex-wrap gap-2">
            {promptSuggestions.slice(0, 3).map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(suggestion)}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              >
                {suggestion.substring(0, 30)}...
              </button>
            ))}
          </div>
        </div>

        {/* Warnings and Errors */}
        {canvasWarning && (
          <div className="p-3 border border-yellow-200 bg-yellow-50 text-xs text-yellow-800 rounded">
            <div className="flex items-center gap-2">
              <span className="font-semibold">⚠️ No canvas found!</span>
            </div>
            <p className="mt-1">Please create a template first by clicking "New" at the top or refreshing the page.</p>
          </div>
        )}
        
        {error && (
          <div className="p-3 border border-red-200 bg-red-50 text-xs text-red-700 rounded">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button onClick={clearError} className="text-red-600 hover:underline">
                Clear
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full px-3 py-2 border rounded text-sm flex items-center justify-between hover:bg-gray-50"
        >
          <span className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Advanced Settings
          </span>
          <span className="text-xs text-gray-500">{showSettings ? 'Hide' : 'Show'}</span>
        </button>

        {/* Advanced Settings */}
        {showSettings && (
          <div className="space-y-3 p-3 bg-gray-50 rounded">
            {/* Aspect Ratio */}
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {aspectOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAspectRatio(option.value)}
                    className={`px-3 py-2 border rounded text-xs ${
                      aspectRatio === option.value
                        ? 'bg-primary text-white border-primary'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality */}
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Quality</label>
              <div className="grid grid-cols-3 gap-2">
                {qualityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setQuality(option.value)}
                    className={`px-3 py-2 border rounded text-xs text-left ${
                      quality === option.value
                        ? 'bg-primary text-white border-primary'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-medium block">{option.label}</span>
                    <span className="text-[10px] opacity-80">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reference Images */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold">Style References (optional)</label>
            {references.length > 0 && (
              <button onClick={clearReferences} className="text-xs text-primary hover:underline">
                Clear
              </button>
            )}
          </div>
          <div
            {...referenceDropzone.getRootProps()}
            className="border-2 border-dashed border-gray-200 rounded p-3 text-center text-xs text-gray-500 cursor-pointer hover:border-primary transition"
          >
            <input {...referenceDropzone.getInputProps()} />
            <div className="flex flex-col items-center gap-1">
              <Upload className="w-4 h-4" />
              <span>Drop up to 3 inspiration images</span>
              <span className="text-[10px]">PNG, JPG, or WEBP</span>
            </div>
          </div>
          {references.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {references.map((ref) => (
                <div key={ref.id} className="relative group">
                  <img
                    src={ref.dataUrl}
                    alt={ref.fileName || 'Reference'}
                    className="w-full h-20 object-cover rounded border"
                  />
                  <button
                    onClick={() => removeReference(ref.id)}
                    className="absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow hover:bg-white"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Image-to-Image */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-primary" />
              Use existing artwork
            </label>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={handleUseCanvasAsBase}
                className="px-2 py-1 border rounded hover:bg-gray-50 flex items-center gap-1"
              >
                <ImageIcon className="w-3 h-3" />
                Use canvas
              </button>
              {baseImage && (
                <button
                  onClick={() => {
                    clearImageInputs();
                    setShowCanvasAsBase(false);
                  }}
                  className="px-2 py-1 border rounded hover:bg-gray-50 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3 text-red-500" />
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div
              {...baseImageDropzone.getRootProps()}
              className="border-2 border-dashed border-gray-200 rounded p-3 text-center text-xs text-gray-500 cursor-pointer hover:border-primary transition"
            >
              <input {...baseImageDropzone.getInputProps()} />
              <span>Base image</span>
              {baseImage && <span className="block text-[10px] text-primary">Selected</span>}
            </div>
            <div
              {...maskDropzone.getRootProps()}
              className="border-2 border-dashed border-gray-200 rounded p-3 text-center text-xs text-gray-500 cursor-pointer hover:border-primary transition"
            >
              <input {...maskDropzone.getInputProps()} />
              <span>Mask (PNG)</span>
              {mask && <span className="block text-[10px] text-primary">Selected</span>}
            </div>
          </div>

          {(baseImage || showCanvasAsBase) && (
            <div className="border rounded p-2 bg-gray-50">
              <p className="text-xs text-gray-600 mb-1">
                Editable regions will exclude text layers when mask is provided.
              </p>
              {baseImage && (
                <img
                  src={baseImage.dataUrl}
                  alt="Base preview"
                  className="w-full h-32 object-cover rounded border"
                />
              )}
            </div>
          )}
        </div>

        {/* Generation Status */}
        {isGenerating && (
          <div className="p-4 bg-blue-50 rounded border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Generating high-quality artwork…
              </span>
            </div>
            <p className="text-xs text-blue-700">
              This usually takes ~4 seconds. Please keep the tab open.
            </p>
          </div>
        )}

        {lastResult && !isGenerating && (
          <div className="p-3 border rounded bg-green-50 text-xs text-green-700">
            <div className="flex items-center justify-between">
              <span>Last generation complete - background loaded from metadata.</span>
            </div>
            {lastResult.metadata?.quality && (
              <p>Quality: {lastResult.metadata.quality.toUpperCase()}</p>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-t p-4 space-y-2">
        <button
          onClick={handleGenerate}
          disabled={disableGenerate}
          className="w-full px-4 py-3 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Design
            </>
          )}
        </button>
        {prompt && selectedStyle && !isGenerating && (
          <button
            onClick={handleRegenerate}
            className="w-full px-4 py-2 border rounded hover:bg-gray-50 flex items-center justify-center gap-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </button>
        )}
      </div>
    </div>
  );
}

