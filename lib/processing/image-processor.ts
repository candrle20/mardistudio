import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { storeGeneratedMetadata } from '@/lib/storage';
import type {
  GeneratedImageProcessingResult,
  ImageSourceMetadata,
  TemplateDescriptor,
  ParsedLayer,
} from '@/types/image-processing';

export interface ImageProcessingPayload {
  filename: string;
  buffer: Buffer;
  source: ImageSourceMetadata;
  template?: TemplateDescriptor | null;
}

const DEFAULT_TEXT_ROLES = ['headline', 'subtitle', 'body', 'details'] as const;

type PlaceholderDefinition = {
  key: string;
  text: string;
  role: (typeof DEFAULT_TEXT_ROLES)[number];
  region: 'center' | 'bottom' | 'top';
};

const PLACEHOLDER_DEFINITIONS: PlaceholderDefinition[] = [
  { key: 'title', text: 'Your Headline Here', role: 'headline', region: 'center' },
  { key: 'subtitle', text: 'Your secondary text', role: 'subtitle', region: 'center' },
  { key: 'body', text: 'Share event details, venue, or heartfelt message here.', role: 'body', region: 'center' },
  { key: 'dates', text: 'Saturday · 5:00 PM · Your City', role: 'details', region: 'center' },
];

function chooseTextRegion(template?: TemplateDescriptor | null): PlaceholderDefinition[] {
  if (!template?.type) {
    return PLACEHOLDER_DEFINITIONS;
  }

  switch (template.type) {
    case 'menu':
    case 'program':
      return PLACEHOLDER_DEFINITIONS.map((definition) => ({
        ...definition,
        region: 'top',
      }));
    case 'sign':
      return PLACEHOLDER_DEFINITIONS.map((definition) => ({
        ...definition,
        region: definition.role === 'body' ? 'center' : 'top',
      }));
    case 'invitation':
    case 'thank-you':
    case 'rsvp':
      return PLACEHOLDER_DEFINITIONS.map((definition) => ({
        ...definition,
        region: definition.role === 'details' ? 'bottom' : 'center',
      }));
    default:
      return PLACEHOLDER_DEFINITIONS;
  }
}

function computeRegionBounds(region: PlaceholderDefinition['region'], width: number, height: number) {
  switch (region) {
    case 'top':
      return {
        top: Math.round(height * 0.12),
        bottom: Math.round(height * 0.38),
      };
    case 'bottom':
      return {
        top: Math.round(height * 0.58),
        bottom: Math.round(height * 0.88),
      };
    case 'center':
    default:
      return {
        top: Math.round(height * 0.28),
        bottom: Math.round(height * 0.68),
      };
  }
}

interface PlaceholderLayout {
  layers: ParsedLayer[];
  clearRegion: { x: number; y: number; width: number; height: number } | null;
}

function buildPlaceholderTypography(
  canvasWidth: number | undefined,
  canvasHeight: number | undefined,
  template?: TemplateDescriptor | null
): PlaceholderLayout {
  const width = canvasWidth && canvasWidth > 0 ? canvasWidth : 1500;
  const height = canvasHeight && canvasHeight > 0 ? canvasHeight : 2100;

  const definitions = chooseTextRegion(template);
  const groups = new Map<PlaceholderDefinition['region'], PlaceholderDefinition[]>();
  for (const definition of definitions) {
    const collection = groups.get(definition.region) ?? [];
    collection.push(definition);
    groups.set(definition.region, collection);
  }

  const columnLeft = Math.round(width * 0.18);
  const columnWidth = Math.round(width * 0.64);
  let minTop = height;
  let maxBottom = 0;

  const layers: ParsedLayer[] = [];

  const fontScaleByRole: Record<(typeof DEFAULT_TEXT_ROLES)[number], number> = {
    headline: 0.055,
    subtitle: 0.035,
    body: 0.026,
    details: 0.03,
  };

  const fontWeightByRole: Record<(typeof DEFAULT_TEXT_ROLES)[number], number> = {
    headline: 700,
    subtitle: 500,
    body: 400,
    details: 600,
  };

  const orderedRegions: Array<PlaceholderDefinition['region']> = ['top', 'center', 'bottom'];

  for (const region of orderedRegions) {
    const regionalDefinitions = groups.get(region);
    if (!regionalDefinitions?.length) continue;

    const regionBounds = computeRegionBounds(region, width, height);
    const regionHeight = Math.max(1, regionBounds.bottom - regionBounds.top);

    regionalDefinitions.forEach((definition, index) => {
      const slotHeight = regionHeight / regionalDefinitions.length;
      const boxHeight = Math.round(slotHeight * (definition.role === 'body' ? 0.9 : 0.7));
      const x = columnLeft;
      const y = Math.round(regionBounds.top + slotHeight * index + (slotHeight - boxHeight) / 2);

      minTop = Math.min(minTop, y);
      maxBottom = Math.max(maxBottom, y + boxHeight);

      layers.push({
        id: `text-${definition.key}-${uuidv4()}`,
        kind: 'typography',
        confidence: 1,
        bounds: { x, y, width: columnWidth, height: boxHeight },
        payload: {
          text: definition.text,
          styleHints: {
            role: definition.role,
            fontSize: Math.round(height * fontScaleByRole[definition.role]),
            fontWeight: fontWeightByRole[definition.role],
            textAlign: 'center',
          },
        },
        notes: 'Generated placeholder text layer.',
      });
    });
  }

  const clearRegion =
    layers.length > 0
      ? {
          x: columnLeft,
          y: Math.max(0, Math.round(minTop - height * 0.02)),
          width: columnWidth,
          height: Math.min(height, Math.round(maxBottom - minTop + height * 0.04)),
        }
      : null;

  return { layers, clearRegion };
}

function buildMetadataSkeleton(payload: ImageProcessingPayload, dimensions?: { width?: number; height?: number }): GeneratedImageProcessingResult {
  const id = payload.filename.replace(/\.[^.]+$/, '');
  return {
    id,
    createdAt: new Date().toISOString(),
    status: 'pending',
    template: payload.template ?? null,
    source: {
      ...payload.source,
      width: dimensions?.width ?? payload.source.width,
      height: dimensions?.height ?? payload.source.height,
    },
    layers: {
      background: {
        imageUrl: payload.source.imageUrl,
      },
      florals: [],
      typography: [],
      misc: [],
    },
    notes: 'Parsing pipeline pending implementation.',
  };
}

export async function processGeneratedImage(payload: ImageProcessingPayload): Promise<GeneratedImageProcessingResult> {
  const { buffer, filename } = payload;

  let width: number | undefined;
  let height: number | undefined;

  try {
    const meta = await sharp(buffer).metadata();
    width = meta.width;
    height = meta.height;
  } catch (error) {
    console.warn('[image-processor] Failed to read image metadata:', error);
  }

  const skeleton = buildMetadataSkeleton(payload, { width, height });
  skeleton.status = 'completed';
  skeleton.notes = 'Generated border-only design with placeholder text layers ready for editing.';

  const metadataFilename = `${skeleton.id}.json`;
  const imageWidth = skeleton.source.width ?? width ?? 0;
  const imageHeight = skeleton.source.height ?? height ?? 0;

  // The generated image from Gemini is already a border-only design (no text)
  // We use it directly as the background without modification
  skeleton.layers.background = {
    imageUrl: payload.source.imageUrl,
    notes: 'Border-only decorative design generated by AI. Center area is blank for user text.',
  };

  // No florals extraction needed - they're part of the border design
  skeleton.layers.florals = [];
  skeleton.layers.misc = [];

  // Generate placeholder text layer metadata for the canvas editor
  const placeholderLayout = buildPlaceholderTypography(imageWidth, imageHeight, payload.template);
  skeleton.layers.typography = placeholderLayout.layers;

  // Store metadata
  const storageResult = await storeGeneratedMetadata(skeleton, metadataFilename);

  return {
    ...skeleton,
    metadataUrl: storageResult.metadataUrl,
  };
}

