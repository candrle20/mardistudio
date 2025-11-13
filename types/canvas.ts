export type LayerSemanticTag =
  | 'background'
  | 'floral'
  | 'typography'
  | 'mask'
  | 'graphic'
  | 'misc'
  | 'user';

export type LayerOrigin = 'parsed' | 'user' | 'generated';

export interface LayerPosition {
  x?: number;
  y?: number;
}

export interface LayerSize {
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
}

interface BaseLayerInput {
  id?: string;
  name?: string;
  semanticTag: LayerSemanticTag;
  origin?: LayerOrigin;
  zIndex?: number;
  groupId?: string;
  locked?: boolean;
  opacity?: number;
  position?: LayerPosition;
  size?: LayerSize;
  metadata?: Record<string, unknown>;
  maskUrl?: string;
}

export interface ImageLayerInput extends BaseLayerInput {
  type: 'image';
  source: string;
}

export interface TextLayerInput extends BaseLayerInput {
  type: 'text';
  text: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | 'lighter';
  lineHeight?: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  fill?: string;
}

export type CanvasLayerInput = ImageLayerInput | TextLayerInput;

export interface CanvasLayerMetadata {
  id: string;
  name?: string;
  semanticTag: LayerSemanticTag;
  origin: LayerOrigin;
  zIndex: number;
  groupId?: string;
  source?: string;
  text?: string;
  maskUrl?: string;
  createdAt: string;
  locked?: boolean;
  additional?: Record<string, unknown>;
  isGroup?: boolean;
}


