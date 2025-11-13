import { create } from 'zustand';
import { Style, GenerationResult, ReferenceImage, GenerationQuality, AspectRatio } from '@/types';
import type { StationeryTemplateType } from '@/types/stationery';
import { buildTemplatePrompt } from '@/lib/prompts/template-guides';

type TemplateContext = {
  type: StationeryTemplateType;
  width: number;
  height: number;
  name?: string;
};

interface AIStoreState {
  isGenerating: boolean;
  error: string | null;
  prompt: string;
  selectedStyle: Style | null;
  aspectRatio: AspectRatio;
  quality: GenerationQuality;
  references: ReferenceImage[];
  baseImage: ReferenceImage | null;
  mask: ReferenceImage | null;
  lastResult: GenerationResult | null;
  history: GenerationResult[];
  currentAbortController: AbortController | null;
  templateContext: TemplateContext | null;
}

interface AIStoreActions {
  setPrompt: (prompt: string) => void;
  setStyle: (style: Style | null) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setQuality: (quality: GenerationQuality) => void;
  addReference: (reference: ReferenceImage) => void;
  removeReference: (id: string) => void;
  clearReferences: () => void;
  setBaseImage: (image: ReferenceImage | null) => void;
  setMask: (mask: ReferenceImage | null) => void;
  clearImageInputs: () => void;
  clearError: () => void;
  generate: () => Promise<GenerationResult>;
  regenerate: () => Promise<GenerationResult>;
  cancelGeneration: () => void;
  setLastResult: (result: GenerationResult | null) => void;
  setTemplateContext: (context: TemplateContext | null) => void;
}

type AIStore = AIStoreState & AIStoreActions;

const MAX_REFERENCES = 3;

function parseDataSource(source: ReferenceImage): { data: string; mimeType: string } {
  if (source.dataUrl.startsWith('data:')) {
    const match = source.dataUrl.match(/^data:(.*?);base64,(.*)$/);
    if (!match) {
      throw new Error('Invalid data URL');
    }
    const [, mimeType, data] = match;
    return { data, mimeType };
  }

  return {
    data: source.dataUrl,
    mimeType: source.mimeType ?? 'image/png',
  };
}

async function fetchGeneration(
  endpoint: string,
  payload: Record<string, unknown>,
  signal?: AbortSignal
): Promise<GenerationResult> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });

  const result = await response.json();

  if (!response.ok) {
    const details = result?.details ? JSON.stringify(result.details) : '';
    throw new Error(result?.error ? `${result.error}${details ? ` - ${details}` : ''}` : 'Generation failed');
  }

  return result as GenerationResult;
}

export const useAIStore = create<AIStore>((set, get) => ({
  isGenerating: false,
  error: null,
  prompt: '',
  selectedStyle: null,
  aspectRatio: '5x7',
  quality: 'proof',
  references: [],
  baseImage: null,
  mask: null,
  lastResult: null,
  history: [],
  currentAbortController: null,
  templateContext: null,

  setPrompt: (prompt) => set({ prompt }),
  setStyle: (style) => set({ selectedStyle: style }),
  setAspectRatio: (aspectRatio) => set({ aspectRatio }),
  setQuality: (quality) => set({ quality }),

  addReference: (reference) =>
    set((state) => {
      const filtered = state.references.filter((ref) => ref.id !== reference.id);
      const next = [...filtered, reference].slice(-MAX_REFERENCES);
      return { references: next };
    }),

  removeReference: (id) =>
    set((state) => ({
      references: state.references.filter((ref) => ref.id !== id),
    })),

  clearReferences: () => set({ references: [] }),

  setBaseImage: (image) => set({ baseImage: image }),
  setMask: (mask) => set({ mask }),
  clearImageInputs: () => set({ baseImage: null, mask: null }),
  clearError: () => set({ error: null }),

  setLastResult: (result) => set({ lastResult: result }),

  setTemplateContext: (context) => {
    set({ templateContext: context });
  },

  cancelGeneration: () => {
    const controller = get().currentAbortController;
    if (controller) {
      controller.abort();
    }
    set({ isGenerating: false, currentAbortController: null });
  },

  generate: async () => {
    const {
      prompt,
      selectedStyle,
      references,
      baseImage,
      mask,
      aspectRatio,
      quality,
      history,
      currentAbortController,
      templateContext,
    } = get();

    if (currentAbortController) {
      currentAbortController.abort();
    }

    if (!prompt?.trim()) {
      throw new Error('Prompt is required');
    }

    if (!selectedStyle) {
      throw new Error('Please choose a style before generating.');
    }

    const controller = new AbortController();

    set({
      isGenerating: true,
      error: null,
      currentAbortController: controller,
    });

    try {
      const { prompt: templatePrompt } = buildTemplatePrompt({
        basePrompt: prompt,
        templateType: templateContext?.type ?? 'blank',
        templateName: templateContext?.name,
        width: templateContext?.width,
        height: templateContext?.height,
      });

      const MAX_TEMPLATE_DIMENSION = 4096;
      const templateSizePayload =
        templateContext && templateContext.width > 0 && templateContext.height > 0
          ? {
              width: Math.min(templateContext.width, MAX_TEMPLATE_DIMENSION),
              height: Math.min(templateContext.height, MAX_TEMPLATE_DIMENSION),
            }
          : undefined;

      const inferAspectRatio = (): AspectRatio => {
        if (!templateSizePayload) {
          return aspectRatio;
        }

        const ratio = templateSizePayload.width / templateSizePayload.height;
        const candidates: Array<{ key: AspectRatio; value: number }> = [
          { key: '5x7', value: 5 / 7 },
          { key: '4x6', value: 4 / 6 },
          { key: 'square', value: 1 },
        ];

        let closest = candidates[0];
        for (const candidate of candidates) {
          if (Math.abs(candidate.value - ratio) < Math.abs(closest.value - ratio)) {
            closest = candidate;
          }
        }

        return closest.key;
      };

      const basePayload = {
        prompt: templatePrompt,
        styleId: selectedStyle.id,
        aspectRatio: inferAspectRatio(),
        quality,
        templateSize: templateSizePayload,
        templateType: templateContext?.type,
        templateName: templateContext?.name,
      };

      let result: GenerationResult;

      if (baseImage || mask) {
        if (!baseImage) {
          throw new Error('Base image is required when using a mask.');
        }

        result = await fetchGeneration(
          '/api/generate/edit',
          {
            ...basePayload,
            baseImage: parseDataSource(baseImage),
            mask: mask ? parseDataSource(mask) : undefined,
          },
          controller.signal
        );
      } else {
        result = await fetchGeneration(
          '/api/generate',
          {
            ...basePayload,
            references: references.length > 0 ? references.map(parseDataSource) : undefined,
          },
          controller.signal
        );
      }

      set({
        isGenerating: false,
        lastResult: result,
        history: [result, ...history].slice(0, 50),
        currentAbortController: null,
      });

      return result;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        set({ isGenerating: false, currentAbortController: null });
        throw new Error('Generation cancelled');
      }

      const message = error instanceof Error ? error.message : 'Generation failed';

      set({
        isGenerating: false,
        error: message,
        currentAbortController: null,
      });

      throw new Error(message);
    }
  },

  regenerate: async () => {
    const { prompt, selectedStyle } = get();
    if (!prompt || !selectedStyle) {
      throw new Error('Prompt and style required to regenerate.');
    }
    return get().generate();
  },
}));
