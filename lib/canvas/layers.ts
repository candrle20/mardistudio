import { fabric } from 'fabric';
'use client';

import { fabric } from 'fabric';
import { useCanvasStore } from '@/stores/canvas-store';
import type { CanvasLayerInput, ImageLayerInput, LayerSemanticTag } from '@/types/canvas';
import type { ParsedLayer, ParsedImageLayers } from '@/types/image-processing';

export interface LayerImportOptions {
  canvas: fabric.Canvas;
  layers: ParsedImageLayers;
}

export async function importParsedLayers({ canvas, layers }: LayerImportOptions): Promise<void> {
  if (!canvas) return;
  const { importLayers } = useCanvasStore.getState();
  if (!importLayers) return;

  const canvasWidth = canvas.getWidth() ?? 0;
  const canvasHeight = canvas.getHeight() ?? 0;

  const resolvedLayers: CanvasLayerInput[] = [];
  let zIndex = 0;

  const semanticTagSet = new Set<LayerSemanticTag>([
    'background',
    'floral',
    'typography',
    'mask',
    'graphic',
    'misc',
    'user',
  ]);

  const coerceSemanticTag = (value: unknown, fallback: LayerSemanticTag = 'misc'): LayerSemanticTag => {
    if (typeof value === 'string' && semanticTagSet.has(value as LayerSemanticTag)) {
      return value as LayerSemanticTag;
    }
    return fallback;
  };

  const makeMetadata = (layer: ParsedLayer, semanticTag: LayerSemanticTag) => ({
    parsedLayerId: layer.id,
    confidence: layer.confidence,
    payload: layer.payload,
    bounds: layer.bounds,
    originalKind: layer.kind,
  });

  const pushImageLayer = (
    source: string | undefined,
    semanticTag: LayerSemanticTag,
    layer: ParsedLayer | null,
    overrides?: Partial<ImageLayerInput>
  ) => {
    if (!source) return;
    const width =
      overrides?.size?.width ??
      layer?.bounds.width ??
      (semanticTag === 'background' ? canvasWidth : undefined);
    const height =
      overrides?.size?.height ??
      layer?.bounds.height ??
      (semanticTag === 'background' ? canvasHeight : undefined);

    resolvedLayers.push({
      type: 'image',
      source,
      semanticTag,
      origin: 'parsed',
      position: {
        x: layer?.bounds.x ?? 0,
        y: layer?.bounds.y ?? 0,
      },
      size:
        width !== undefined || height !== undefined
          ? {
              width,
              height,
            }
          : undefined,
      metadata: layer ? makeMetadata(layer, semanticTag) : undefined,
      groupId:
        (layer?.payload?.clusterId as string | undefined) ??
        (layer?.payload?.groupId as string | undefined) ??
        undefined,
      zIndex: zIndex++,
      maskUrl: layer?.payload?.maskUrl as string | undefined,
      ...overrides,
    });
  };

  if (layers.background?.imageUrl) {
    pushImageLayer(layers.background.imageUrl, 'background', null, {
      position: { x: 0, y: 0 },
      size: { width: canvasWidth, height: canvasHeight },
      name: 'Background',
    });
  }

  for (const floral of layers.florals) {
    const source = floral.payload?.imageUrl as string | undefined;
    pushImageLayer(source, 'floral', floral, {
      name: floral.payload?.label as string | undefined,
    });
  }

  for (const textLayer of layers.typography) {
    const textContent = (textLayer.payload?.text as string | undefined) ?? '';
    const textAlign =
      (textLayer.payload?.textAlign as 'left' | 'center' | 'right' | 'justify' | undefined) ??
      'center';

    resolvedLayers.push({
      type: 'text',
      text: textContent,
      semanticTag: 'typography',
      origin: 'parsed',
      position: {
        x: textLayer.bounds.x,
        y: textLayer.bounds.y,
      },
      fontFamily: (textLayer.payload?.fontFamily as string | undefined) ?? 'Playfair Display',
      fontSize: (textLayer.payload?.fontSize as number | undefined) ?? 48,
      fontWeight: (textLayer.payload?.fontWeight as 'normal' | 'bold' | 'lighter' | undefined) ?? 'normal',
      lineHeight: (textLayer.payload?.lineHeight as number | undefined) ?? 1.2,
      textAlign,
      fill: (textLayer.payload?.color as string | undefined) ?? '#1f1f1f',
      metadata: makeMetadata(textLayer, 'typography'),
      zIndex: zIndex++,
      name: textLayer.payload?.label as string | undefined,
    });
  }

  for (const miscLayer of layers.misc) {
    const tag = coerceSemanticTag(miscLayer.payload?.semanticTag, 'misc');
    if (miscLayer.kind === 'typography') {
      const miscText = (miscLayer.payload?.text as string | undefined) ?? '';
      const miscTextAlign =
        (miscLayer.payload?.textAlign as 'left' | 'center' | 'right' | 'justify' | undefined) ??
        'center';

      resolvedLayers.push({
        type: 'text',
        text: miscText,
        semanticTag: tag,
        origin: 'parsed',
        position: {
          x: miscLayer.bounds.x,
          y: miscLayer.bounds.y,
        },
        fontFamily: (miscLayer.payload?.fontFamily as string | undefined) ?? 'Inter',
        fontSize: (miscLayer.payload?.fontSize as number | undefined) ?? 36,
        fill: (miscLayer.payload?.color as string | undefined) ?? '#000000',
        textAlign: miscTextAlign,
        metadata: makeMetadata(miscLayer, tag),
        zIndex: zIndex++,
      });
      continue;
    }

    const source = miscLayer.payload?.imageUrl as string | undefined;
    pushImageLayer(source, tag, miscLayer);
  }

  if (resolvedLayers.length === 0) {
    console.warn('[layers] No parsed layers to import');
    return;
  }

  canvas.backgroundImage = undefined;
  canvas.backgroundColor = '#ffffff';

  await importLayers(resolvedLayers, { clearExisting: true });
}

