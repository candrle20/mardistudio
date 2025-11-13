import { v4 as uuidv4 } from 'uuid';
import type { ParsedImageLayers, ParsedLayer } from '@/types/image-processing';

const ANALYSIS_MODEL = process.env.GOOGLE_GEMINI_ANALYSIS_MODEL ?? 'gemini-1.5-flash-001';
const ANALYSIS_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

interface GeminiAnalysisResponse {
  layers?: {
    background?: { notes?: string };
    florals?: GeminiRawLayer[];
    typography?: GeminiRawLayer[];
    misc?: GeminiRawLayer[];
  };
}

interface GeminiRawLayer {
  id?: string;
  kind?: string;
  confidence?: number;
  bounds?: { x?: number; y?: number; width?: number; height?: number };
  payload?: Record<string, unknown>;
  notes?: string;
}

function getApiKey(): string {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_GEMINI_API_KEY is not set');
  }
  return apiKey;
}

function extractJsonFromText(text: string): string | null {
  const fencedMatch = text.match(/```json\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1];
  }
  const braceIndex = text.indexOf('{');
  if (braceIndex >= 0) {
    const lastBraceIndex = text.lastIndexOf('}');
    if (lastBraceIndex > braceIndex) {
      return text.slice(braceIndex, lastBraceIndex + 1);
    }
  }
  return null;
}

function toNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function clampBounds(bounds: GeminiRawLayer['bounds']): { x: number; y: number; width: number; height: number } | null {
  if (!bounds) return null;
  const width = toNumber(bounds.width);
  const height = toNumber(bounds.height);
  if (width <= 0 || height <= 0) return null;
  return {
    x: toNumber(bounds.x),
    y: toNumber(bounds.y),
    width,
    height,
  };
}

function normaliseLayer(raw: GeminiRawLayer, fallbackKind: ParsedLayer['kind']): ParsedLayer | null {
  const bounds = clampBounds(raw.bounds);
  if (!bounds) return null;

  const layer: ParsedLayer = {
    id: raw.id ?? `gemini-${uuidv4()}`,
    kind: (raw.kind as ParsedLayer['kind']) ?? fallbackKind,
    confidence: Math.min(Math.max(toNumber(raw.confidence, 0.6), 0), 1),
    bounds,
    payload: raw.payload ?? {},
  };

  if (raw.notes) {
    layer.notes = raw.notes;
  }

  return layer;
}

function sanitiseLayers(rawLayers: GeminiRawLayer[] | undefined, fallbackKind: ParsedLayer['kind']): ParsedLayer[] {
  if (!rawLayers?.length) {
    return [];
  }

  const seen = new Set<string>();
  const layers: ParsedLayer[] = [];

  for (const raw of rawLayers) {
    const normalised = normaliseLayer(raw, fallbackKind);
    if (!normalised) continue;

    const key = `${normalised.bounds.x}-${normalised.bounds.y}-${normalised.bounds.width}-${normalised.bounds.height}-${normalised.kind}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    layers.push(normalised);
  }

  return layers;
}

export async function analyzeImageLayers(buffer: Buffer, mimeType = 'image/png'): Promise<ParsedImageLayers | null> {
  const apiKey = getApiKey();
  const imageBase64 = buffer.toString('base64');

  const prompt = `
You are an expert stationery designer. Analyse the provided image and return a concise JSON description of detected layers.

Guidelines:
- Identify background, floral clusters, typography (text blocks), and other decorative elements.
- Provide approximate bounding boxes (x, y, width, height in pixels) relative to the original image dimensions.
- Give a confidence score between 0 and 1.
- For typography, include the detected text in payload.text.
- Keep JSON compact, no commentary outside JSON.

Return JSON in this shape:
{
  "layers": {
    "background": { "notes": "optional summary" },
    "florals": [
      { "id": "...", "bounds": { "x": 100, "y": 200, "width": 320, "height": 180 }, "confidence": 0.85, "payload": { "palette": ["#..."] } }
    ],
    "typography": [
      { "id": "...", "bounds": { ... }, "confidence": 0.92, "payload": { "text": "Sample", "fontHints": ["serif"] } }
    ],
    "misc": [
      { "id": "...", "bounds": { ... }, "confidence": 0.7, "payload": { "category": "ribbon" } }
    ]
  }
}
`;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType,
            },
          },
          { text: prompt.trim() },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ['text'],
      temperature: 0.2,
    },
  };

  const url = `${ANALYSIS_ENDPOINT}/${ANALYSIS_MODEL}:generateContent?key=${apiKey}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
  } catch (error) {
    console.warn('[Gemini analysis] network error:', error);
    return null;
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unable to read error response');
    console.warn('[Gemini analysis] API error:', errorText);
    return null;
  }

  let data: any;
  try {
    data = await response.json();
  } catch (error) {
    console.warn('[Gemini analysis] JSON parse error:', error);
    return null;
  }

  const textPart = data.candidates?.[0]?.content?.parts?.find((part: any) => typeof part.text === 'string')?.text;
  if (!textPart) {
    console.warn('[Gemini analysis] No text content in response');
    return null;
  }

  const jsonString = extractJsonFromText(textPart);
  if (!jsonString) {
    console.warn('[Gemini analysis] Failed to extract JSON from response text:', textPart.slice(0, 200));
    return null;
  }

  let parsed: GeminiAnalysisResponse;
  try {
    parsed = JSON.parse(jsonString);
  } catch (error) {
    console.warn('[Gemini analysis] Invalid JSON:', error);
    return null;
  }

  const result: ParsedImageLayers = {
    florals: [],
    typography: [],
    misc: [],
  };

  if (parsed.layers?.background) {
    result.background = {
      imageUrl: '',
      notes: parsed.layers.background.notes,
    };
  }

  if (parsed.layers?.florals) {
    result.florals = sanitiseLayers(parsed.layers.florals, 'floral');
  }

  if (parsed.layers?.typography) {
    result.typography = sanitiseLayers(parsed.layers.typography, 'typography');
  }

  if (parsed.layers?.misc) {
    result.misc = sanitiseLayers(parsed.layers.misc, 'misc');
  }

  return result;
}


