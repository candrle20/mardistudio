import { fabric } from 'fabric';

const FLORAL_LAYER_TAGS = new Set(['floral']);

export function isFloralObject(obj: fabric.Object | undefined | null): boolean {
  if (!obj) return false;
  const data = obj.get('data');
  const tag = data?.semanticTag ?? data?.layerKind;
  return Boolean(tag && FLORAL_LAYER_TAGS.has(tag));
}

export function enrichFloralObject(obj: fabric.Object) {
  obj.set({
    lockScalingFlip: true,
    cornerStyle: 'circle',
    borderColor: '#6366f1',
    cornerColor: '#312e81',
    cornerStrokeColor: '#ffffff',
    transparentCorners: false,
  });
}

export function applySnappingGuides(canvas: fabric.Canvas, targets: fabric.Object[]) {
  // Placeholder: extend with snapping to guides or other florals
  targets.forEach((target) => {
    if (isFloralObject(target)) {
      enrichFloralObject(target);
    }
  });
  canvas.renderAll();
}

