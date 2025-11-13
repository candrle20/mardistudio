import type { StationeryTemplateType } from './stationery';

export interface TemplateDescriptor {
  type?: StationeryTemplateType;
  name?: string;
  width?: number;
  height?: number;
}

export interface ImageSourceMetadata {
  filename: string;
  imageUrl: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  mimeType?: string;
}

export interface ParsedLayer {
  id: string;
  kind: 'background' | 'floral' | 'typography' | 'mask' | 'misc';
  confidence: number;
  bounds: { x: number; y: number; width: number; height: number };
  payload: Record<string, unknown>;
  notes?: string;
}

export interface ParsedImageLayers {
  background?: {
    imageUrl: string;
    notes?: string;
  };
  florals: ParsedLayer[];
  typography: ParsedLayer[];
  misc: ParsedLayer[];
}

export interface GeneratedImageProcessingResult {
  id: string;
  createdAt: string;
  status: 'pending' | 'completed' | 'failed';
  notes?: string;
  template: TemplateDescriptor | null;
  source: ImageSourceMetadata;
  layers: ParsedImageLayers;
  metadataUrl?: string;
}

