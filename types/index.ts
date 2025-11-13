// Type definitions for Fabric.js canvas objects
export interface TextOptions {
  x?: number;
  y?: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  fontWeight?: 'normal' | 'bold' | 'lighter';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  letterSpacing?: number;
}

export interface ImageOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  opacity?: number;
}

export type AspectRatio = '5x7' | '4x6' | 'square';
export type GenerationQuality = 'preview' | 'proof' | 'print';

export interface GenerationRequest {
  prompt: string;
  styleId: string;
  aspectRatio: AspectRatio;
  quality: GenerationQuality;
  references?: ReferenceImage[];
  baseImage?: ReferenceImage;
  mask?: ReferenceImage;
}

export interface GenerationResult {
  success: boolean;
  imageUrl: string;
  thumbnailUrl: string;
  metadata?: {
    width?: number;
    height?: number;
    mimeType?: string;
    quality?: GenerationQuality;
  };
  costEstimate?: number;
  generationTimeMs?: number;
}

export interface ReferenceImage {
  id: string;
  dataUrl: string;
  fileName?: string;
  mimeType?: string;
}

export interface Project {
  id: string;
  name: string;
  canvas?: string; // JSON serialized canvas
  createdAt: Date;
  updatedAt: Date;
  isDirty: boolean;
}

export interface Style {
  id: string;
  name: string;
  artistName: string;
  thumbnailUrl: string;
  description?: string;
}

