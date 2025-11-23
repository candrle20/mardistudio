'use client';

import { useCallback, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { useAIStore } from '@/stores/ai-store';
import { useTabStore } from '@/stores/tab-store';
import { useCanvasStore } from '@/stores/canvas-store';
import { useUIStore } from '@/stores/ui-store';
import { useInspirationStore, STATIONERY_TYPES, ELEMENT_CATEGORIES } from '@/stores/inspiration-store';
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
  CheckCircle2,
  Filter,
} from 'lucide-react';
import type { AspectRatio, GenerationQuality, ReferenceImage } from '@/types';
import Link from 'next/link';

// Updated prompt suggestions that are more generic since style comes from inspiration
const promptSuggestions = [
  'Wedding invitation with elegant floral border',
  'Minimalist save the date card',
  'Art deco style dinner menu',
  'Botanical themed rsvp card',
  'Modern geometric party invitation',
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

const IMAGE_EXTENSION_PATTERN = /\.(avif|bmp|gif|jfif|jpeg|jpg|png|tif|tiff|webp)$/i;

function isValidImageFile(file: File): boolean {
  const hasImageMime = file.type?.startsWith('image/');
  const hasImageExt = IMAGE_EXTENSION_PATTERN.test(file.name || '');
  return Boolean(hasImageMime || hasImageExt);
}

function extractFilesFromDataTransfer(dataTransfer?: DataTransfer | null): File[] {
  if (!dataTransfer) return [];

  const fromItems =
    dataTransfer.items && dataTransfer.items.length
      ? Array.from(dataTransfer.items)
          .map((item) => (item.kind === 'file' ? item.getAsFile() : null))
          .filter((file): file is File => Boolean(file))
      : [];

  if (fromItems.length > 0) {
    return fromItems;
  }

  if (dataTransfer.files?.length) {
    return Array.from(dataTransfer.files);
  }

  return [];
}

export function AIGenerationPanel() {
  const { aiPanelOpen, toggleAIPanel } = useUIStore();
  const references = useAIStore((state) => state.references);
  const addReference = useAIStore((state) => state.addReference);
  const removeReference = useAIStore((state) => state.removeReference);
  const clearReferences = useAIStore((state) => state.clearReferences);
  const prompt = useAIStore((state) => state.prompt);
  const setPrompt = useAIStore((state) => state.setPrompt);
  
  const selectedInspirations = useAIStore((state) => state.selectedInspirations);
  const toggleInspiration = useAIStore((state) => state.toggleInspiration);
  
  const selectedElements = useAIStore((state) => state.selectedElements);
  const toggleElement = useAIStore((state) => state.toggleElement);
  const aspectRatio = useAIStore((state) => state.aspectRatio);
  const setAspectRatio = useAIStore((state) => state.setAspectRatio);
  const quality = useAIStore((state) => state.quality);
  const setQuality = useAIStore((state) => state.setQuality);
  const isGenerating = useAIStore((state) => state.isGenerating);
  const generate = useAIStore((state) => state.generate);
  const regenerate = useAIStore((state) => state.regenerate);
  const baseImage = useAIStore((state) => state.baseImage);
  const setBaseImage = useAIStore((state) => state.setBaseImage);
  const mask = useAIStore((state) => state.mask);
  const setMask = useAIStore((state) => state.setMask);
  const clearImageInputs = useAIStore((state) => state.clearImageInputs);
  const error = useAIStore((state) => state.error);
  const setError = useAIStore((state) => state.setError);
  const clearError = useAIStore((state) => state.clearError);
  const lastResult = useAIStore((state) => state.lastResult);
  const setTemplateContext = useAIStore((state) => state.setTemplateContext);
  const { getActiveTab, createVariantFromActive, updateTab } = useTabStore();
  const { exportToPNG, canvas } = useCanvasStore();
  const { getLikedInspirations, getFilteredInspirations, inspirations } = useInspirationStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showCanvasAsBase, setShowCanvasAsBase] = useState(false);
  const [canvasWarning, setCanvasWarning] = useState(false);
  const referenceInputRef = useRef<HTMLInputElement | null>(null);
  const referenceDragCounter = useRef(0);
  const [isReferenceDragActive, setReferenceDragActive] = useState(false);

  // Filter state
  const [stationeryFilter, setStationeryFilter] = useState<string | null>(null);
  const [elementFilter, setElementFilter] = useState<string | null>(null);

  // Logic for selecting elements/inspirations
  const likedInspirations = getLikedInspirations();
  
  // Filter designs (type 'design')
  // Always start with all inspirations to ensure consistent data availability
  let displayDesigns = inspirations.filter(i => i.type === 'design');

  // Apply Stationery Filter
  if (stationeryFilter) {
    displayDesigns = displayDesigns.filter(img => img.tags && img.tags.includes(stationeryFilter));
  }

  // Sort: Liked items first
  displayDesigns.sort((a, b) => {
      const aLiked = likedInspirations.some(l => l.id === a.id);
      const bLiked = likedInspirations.some(l => l.id === b.id);
      if (aLiked && !bLiked) return -1;
      if (!aLiked && bLiked) return 1;
      return 0;
  });

  // Filter elements (type 'element')
  // Always start with all elements
  let displayElements = inspirations.filter(i => i.type === 'element');

  // Apply Element Filter
  if (elementFilter) {
      displayElements = displayElements.filter(img => img.tags && img.tags.includes(elementFilter));
  }
  
  // Sort: Liked items first
  displayElements.sort((a, b) => {
      const aLiked = likedInspirations.some(l => l.id === a.id);
      const bLiked = likedInspirations.some(l => l.id === b.id);
      if (aLiked && !bLiked) return -1;
      if (!aLiked && bLiked) return 1;
      return 0;
  });
    
  const hasLikedElements = likedInspirations.length > 0;
  
  // Expand panel width if elements are selected
  const isExpanded = selectedElements.length > 0;
  const panelWidthClass = isExpanded ? 'w-[600px]' : 'w-96';

  const handleGenerate = async () => {
    if (!prompt) return;

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
    if (!prompt) return;

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

        console.log('[AIGenerationPanel] Regeneration complete, background will load from metadata');
      } else {
        console.error('[AIGenerationPanel] No imageUrl in result');
      }
    } catch (error) {
      console.error('[AIGenerationPanel] Regeneration failed:', error);
    }
  };

  const handleReferenceFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return;

      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of files) {
        if (!isValidImageFile(file)) {
          errors.push(`${file.name || 'Unnamed file'} is not an image`);
          continue;
        }
        validFiles.push(file);
      }

      if (errors.length > 0) {
        setError(`Upload issues: ${errors.join(', ')}`);
      } else {
        clearError();
      }

      if (validFiles.length === 0) return;

      const filesToProcess = validFiles.slice(0, 3);

      for (const file of filesToProcess) {
        try {
          const dataUrl = await fileToDataUrl(file);
          const reference: ReferenceImage = {
            id: uuidv4(),
            dataUrl,
            fileName: file.name,
            mimeType: file.type || 'application/octet-stream',
          };

          addReference(reference);
        } catch (error) {
          console.error('Failed to process file:', file.name, error);
          setError(`Failed to process ${file.name}`);
        }
      }
    },
    [addReference, clearError, setError]
  );

  const handleReferenceInputChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files?.length) return;
      await handleReferenceFiles(Array.from(files));
      event.target.value = '';
    },
    [handleReferenceFiles]
  );

  const openReferenceFileDialog = useCallback(() => {
    referenceInputRef.current?.click();
  }, []);

  const handleReferenceDragEnter = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (isGenerating) return;
      referenceDragCounter.current += 1;
      setReferenceDragActive(true);
    },
    [isGenerating]
  );

  const handleReferenceDragLeave = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (isGenerating) return;
      referenceDragCounter.current = Math.max(referenceDragCounter.current - 1, 0);
      if (referenceDragCounter.current === 0) {
        setReferenceDragActive(false);
      }
    },
    [isGenerating]
  );

  const handleReferenceDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (isGenerating) return;
      event.dataTransfer.dropEffect = 'copy';
    },
    [isGenerating]
  );

  const handleReferenceDrop = useCallback(
    async (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      referenceDragCounter.current = 0;
      setReferenceDragActive(false);

      if (isGenerating) return;

      const files = extractFilesFromDataTransfer(event.dataTransfer);
      await handleReferenceFiles(files);
    },
    [handleReferenceFiles, isGenerating]
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

  const disableGenerate = !prompt.trim() || isGenerating;

  if (!aiPanelOpen) return null;

  return (
    <div 
      className={`fixed inset-y-0 right-0 ${panelWidthClass} bg-white border-l shadow-xl z-50 flex flex-col transition-all duration-300 ease-in-out`}
    >
      {/* Header */}
      <div className="h-16 border-b px-4 flex items-center justify-between flex-shrink-0">
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
      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {/* 1. TEMPLATE SELECTION (Stationery Type) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold block flex items-center gap-2">
              1. Select Template Type
            </label>
            <span className="text-xs text-gray-500">
              {stationeryFilter 
                ? STATIONERY_TYPES.find(t => t.id === stationeryFilter)?.label 
                : 'All Types'}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
            <button
               onClick={() => setStationeryFilter(null)}
               className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                   stationeryFilter === null
                   ? 'bg-black text-white'
                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
               }`}
            >
               All
            </button>
            {STATIONERY_TYPES.map((type) => (
               <button
                   key={type.id}
                   onClick={() => setStationeryFilter(stationeryFilter === type.id ? null : type.id)}
                   className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                       stationeryFilter === type.id
                       ? 'bg-black text-white'
                       : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                   }`}
               >
                   {type.label}
               </button>
            ))}
          </div>
        </div>
        
        {/* 2. LAYOUT SELECTION (Multi Select) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold block flex items-center gap-2">
              2. Select Layout Inspiration
            </label>
            <span className="text-xs text-gray-500">
              {selectedInspirations.length > 0 ? `${selectedInspirations.length} selected` : 'Choose multiple'}
            </span>
          </div>
          
          <div className="w-full overflow-x-auto pb-2 -mx-2 px-2">
            <div className="flex gap-2" style={{ minWidth: 'min-content' }}>
              {displayDesigns.map((design) => {
                const isSelected = selectedInspirations.some(i => i.id === design.id);
                return (
                  <button
                    key={design.id}
                    onClick={() => toggleInspiration(design)}
                    className={`relative w-32 aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 group ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20 scale-105 shadow-md'
                        : 'border-transparent hover:border-gray-300 hover:shadow-sm'
                    }`}
                    title={design.title}
                  >
                    <img
                      src={design.url}
                      alt={design.title}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 transition-colors ${isSelected ? 'bg-primary/10' : 'bg-transparent group-hover:bg-black/5'}`} />
                    
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary fill-white" />
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                       <p className="text-[10px] text-white truncate">{design.title}</p>
                    </div>
                  </button>
                );
              })}
              {displayDesigns.length === 0 && (
                <div className="w-full py-6 text-center bg-gray-50 rounded border border-dashed">
                  <p className="text-xs text-gray-500">
                    {stationeryFilter 
                        ? `No ${STATIONERY_TYPES.find(t => t.id === stationeryFilter)?.label} designs found.`
                        : "No designs available."}
                  </p>
                </div>
              )}
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-1 italic">
            These define the structure/layout of your design. Select multiple to combine structures.
          </p>
        </div>

        {/* 3. ELEMENT SELECTION (Multi Select) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold block flex items-center gap-2">
              3. Select Decorative Elements
            </label>
            <span className="text-xs text-gray-500">
              {selectedElements.length > 0 ? `${selectedElements.length} selected` : 'Select multiple'}
            </span>
          </div>

          {/* Element Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide mb-2">
            <button
               onClick={() => setElementFilter(null)}
               className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                   elementFilter === null
                   ? 'bg-black text-white'
                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
               }`}
            >
               All
            </button>
            {ELEMENT_CATEGORIES.map((cat) => (
               <button
                   key={cat.id}
                   onClick={() => setElementFilter(elementFilter === cat.id ? null : cat.id)}
                   className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                       elementFilter === cat.id
                       ? 'bg-black text-white'
                       : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                   }`}
               >
                   {cat.label}
               </button>
            ))}
          </div>
          
          <div className="w-full overflow-x-auto pb-2 -mx-2 px-2">
            <div className="flex gap-2" style={{ minWidth: 'min-content' }}>
              {displayElements.map((element) => {
                const isSelected = selectedElements.some(e => e.id === element.id);
                return (
                  <button
                    key={element.id}
                    onClick={() => toggleElement(element)}
                    className={`relative w-20 aspect-square rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 group ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20 scale-105 shadow-md'
                        : 'border-transparent hover:border-gray-300 hover:shadow-sm'
                    }`}
                    title={element.title}
                  >
                    <img
                      src={element.url}
                      alt={element.title}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 transition-colors ${isSelected ? 'bg-primary/10' : 'bg-transparent group-hover:bg-black/5'}`} />
                    
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-sm">
                        <CheckCircle2 className="w-3 h-3 text-primary fill-white" />
                      </div>
                    )}
                  </button>
                );
              })}
              {displayElements.length === 0 && (
                <div className="w-full py-6 text-center bg-gray-50 rounded border border-dashed">
                  <p className="text-xs text-gray-500">No elements available.</p>
                </div>
              )}
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-1 italic">
            These items (flowers, icons, etc.) will be woven into the layout.
          </p>
        </div>

        {/* Prompt Input */}
        <div>
          <label className="text-sm font-semibold mb-2 block">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe specific details (e.g., 'Use a watercolor style', 'Add gold foil accents')..."
            className="w-full px-3 py-2 border rounded text-sm min-h-[100px] resize-none"
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
      <div className="border-t p-4 space-y-2 flex-shrink-0">
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
        {prompt && !isGenerating && (
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
