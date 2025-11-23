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

// Single elegant text placeholder - users can add more if needed
const SINGLE_ELEGANT_TEXT = `Click to Edit Text

Add your invitation details here`;

const PLACEHOLDER_DEFINITIONS: PlaceholderDefinition[] = [
  { key: 'main', text: SINGLE_ELEGANT_TEXT, role: 'headline', region: 'center' },
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

  // Single elegant centered text box
  const columnLeft = Math.round(width * 0.15);
  const columnWidth = Math.round(width * 0.70);
  
  // Center vertically with generous space
  const textHeight = Math.round(height * 0.40);
  const y = Math.round((height - textHeight) / 2);

  const layers: ParsedLayer[] = [
    {
      id: `text-main-${uuidv4()}`,
      kind: 'typography',
      confidence: 1,
      bounds: { 
        x: columnLeft, 
        y, 
        width: columnWidth, 
        height: textHeight 
      },
      payload: {
        text: SINGLE_ELEGANT_TEXT,
        styleHints: {
          role: 'headline',
          fontSize: Math.round(height * 0.045), // Large, elegant size
          fontWeight: 400, // Regular weight for elegance
          fontFamily: 'Playfair Display', // Elegant serif font
          textAlign: 'center',
          lineHeight: 1.6,
          color: '#2d2d2d',
        },
      },
      notes: 'Elegant centered placeholder text - click to edit and customize.',
    },
  ];

  // No need to clear region - background is already blank in center
  return { layers, clearRegion: null };
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

