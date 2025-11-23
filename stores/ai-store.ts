import { create } from 'zustand';
import { GenerationResult, ReferenceImage, GenerationQuality, AspectRatio } from '@/types';
import type { StationeryTemplateType } from '@/types/stationery';
import { buildTemplatePrompt } from '@/lib/prompts/template-guides';
import { InspirationImage } from './inspiration-store';

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
  selectedInspirations: InspirationImage[]; // Changed from single to array
  selectedElements: InspirationImage[];
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
  toggleInspiration: (inspiration: InspirationImage) => void; // Replaces setInspiration
  clearInspirations: () => void;
  toggleElement: (element: InspirationImage) => void;
  clearElements: () => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setQuality: (quality: GenerationQuality) => void;
  addReference: (reference: ReferenceImage) => void;
  removeReference: (id: string) => void;
  clearReferences: () => void;
  setBaseImage: (image: ReferenceImage | null) => void;
  setMask: (mask: ReferenceImage | null) => void;
  clearImageInputs: () => void;
  setError: (error: string) => void;
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
  selectedInspirations: [], // Initialize as array
  selectedElements: [],
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
  
  toggleInspiration: (inspiration) => set((state) => {
    const isSelected = state.selectedInspirations.some(i => i.id === inspiration.id);
    if (isSelected) {
      return { selectedInspirations: state.selectedInspirations.filter(i => i.id !== inspiration.id) };
    } else {
        // Limit number of layout inspirations if needed (e.g., max 3)
        if (state.selectedInspirations.length >= 3) {
            return state; 
        }
      return { selectedInspirations: [...state.selectedInspirations, inspiration] };
    }
  }),

  clearInspirations: () => set({ selectedInspirations: [] }),
  
  toggleElement: (element) => set((state) => {
    const isSelected = state.selectedElements.some(e => e.id === element.id);
    if (isSelected) {
      return { selectedElements: state.selectedElements.filter(e => e.id !== element.id) };
    } else {
      // Limit to 10 elements to allow for border/frame creation (4 corners + sides)
      if (state.selectedElements.length >= 10) {
        return state;
      }
      return { selectedElements: [...state.selectedElements, element] };
    }
  }),

  clearElements: () => set({ selectedElements: [] }),

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
  setError: (error) => set({ error }),
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
      selectedInspirations,
      selectedElements,
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

      const basePayload: any = {
        prompt: templatePrompt,
        aspectRatio: inferAspectRatio(),
        quality,
        templateSize: templateSizePayload,
        templateType: templateContext?.type,
        templateName: templateContext?.name,
      };

      if (selectedInspirations.length > 0) {
        // If API expects single, use first. If API updated to array, use map.
        // Based on previous turn, I'll update API next to support multiple
        // For now, I'll pass array, but assume I'll fix API in next step.
        basePayload.inspirationUrls = selectedInspirations.map(i => i.url);
        // Keep backward compat for now if needed
        basePayload.inspirationUrl = selectedInspirations[0].url;
      }

      if (selectedElements.length > 0) {
        basePayload.elementUrls = selectedElements.map(e => e.url);
      }

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
    const { prompt } = get();
    if (!prompt) {
      throw new Error('Prompt required to regenerate.');
    }
    return get().generate();
  },
}));
