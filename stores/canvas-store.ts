import { create } from 'zustand';
import { fabric } from 'fabric';
import type { CanvasLayerInput, CanvasLayerMetadata, LayerSemanticTag } from '@/types/canvas';

type MaskMode = 'keep' | 'remove' | null;

const LAYER_NAME_FALLBACK: Record<LayerSemanticTag, string> = {
  background: 'Background',
  floral: 'Florals',
  typography: 'Typography',
  mask: 'Mask',
  graphic: 'Graphic',
  misc: 'Layer',
  user: 'Layer',
};

function createLayerId(tag: LayerSemanticTag) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${tag}-${crypto.randomUUID()}`;
  }
  return `${tag}-${Math.random().toString(36).slice(2, 11)}`;
}

function buildLayerMetadata(
  input: CanvasLayerInput,
  overrides: Partial<CanvasLayerMetadata> = {}
): CanvasLayerMetadata {
  const now = new Date().toISOString();
  const id = overrides.id ?? input.id ?? createLayerId(input.semanticTag);

  const baseMetadata: CanvasLayerMetadata = {
    id,
    name: overrides.name ?? input.name ?? LAYER_NAME_FALLBACK[input.semanticTag],
    semanticTag: input.semanticTag,
    origin: overrides.origin ?? input.origin ?? 'parsed',
    zIndex: overrides.zIndex ?? input.zIndex ?? 0,
    groupId: overrides.groupId ?? input.groupId,
    source: input.type === 'image' ? input.source : overrides.source,
    text: input.type === 'text' ? input.text : overrides.text,
    maskUrl: overrides.maskUrl ?? input.maskUrl,
    createdAt: overrides.createdAt ?? now,
    locked: overrides.locked ?? input.locked,
    additional: {
      ...(input.metadata ?? {}),
      ...(overrides.additional ?? {}),
    },
    isGroup: overrides.isGroup ?? false,
  };

  return baseMetadata;
}

function applyMetadataToObject(object: fabric.Object, metadata: CanvasLayerMetadata) {
  object.set('data', metadata);
  object.set('name', metadata.name);
}

function applyTransformToObject(
  object: fabric.Object,
  input: CanvasLayerInput
) {
  const { position, size, opacity, locked, selectable, evented } = input;

  if (position?.x !== undefined) {
    object.set('left', position.x);
  }
  if (position?.y !== undefined) {
    object.set('top', position.y);
  }

  if (size) {
    if (size.width !== undefined && object.width) {
      const scaleX = size.width / object.width;
      object.set('scaleX', scaleX);
    }
    if (size.height !== undefined && object.height) {
      const scaleY = size.height / object.height;
      object.set('scaleY', scaleY);
    }
    if (size.scaleX !== undefined) {
      object.set('scaleX', size.scaleX);
    }
    if (size.scaleY !== undefined) {
      object.set('scaleY', size.scaleY);
    }
  }

  if (opacity !== undefined) {
    object.set('opacity', opacity);
  }

  // Apply selectable and evented properties before locked check
  if (selectable !== undefined) {
    object.set('selectable', selectable);
  }
  if (evented !== undefined) {
    object.set('evented', evented);
  }

  if (locked) {
    object.set({
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      lockScalingX: true,
      lockScalingY: true,
      selectable: false,
    });
  }
}

async function createImageObject(
  input: CanvasLayerInput & { type: 'image' }
): Promise<fabric.Image> {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(
      input.source,
      ((img: fabric.Image, isError: boolean) => {
        if (isError) {
          reject(
            new Error(
              `[importLayers] Failed to load image layer ${input.source}`
            )
          );
          return;
        }
        if (!img) {
          reject(new Error('[importLayers] Image object is null'));
          return;
        }

        img.set({
          originX: 'left',
          originY: 'top',
        });

        resolve(img);
      }) as any,
      { crossOrigin: 'anonymous' }
    );
  });
}

const TEXT_SELECTION_VISUALS = {
  borderColor: '#1d4ed8',
  cornerColor: '#1d4ed8',
  cornerStrokeColor: '#ffffff',
  cornerStyle: 'circle' as 'rect' | 'circle',
  cornerSize: 14,
  transparentCorners: false,
  padding: 12,
  borderDashArray: undefined as number[] | undefined,
};

function applyTextSelectionVisuals(text: fabric.IText) {
  text.set({
    ...TEXT_SELECTION_VISUALS,
    hoverCursor: 'text',
  });
}

function createTextObject(
  input: CanvasLayerInput & { type: 'text' }
): fabric.IText {
  const textObject = new fabric.IText(input.text, {
    fontFamily: input.fontFamily ?? 'Playfair Display',
    fontSize: input.fontSize ?? 48,
    fontWeight: input.fontWeight ?? 'normal',
    lineHeight: input.lineHeight ?? 1.6,
    textAlign: input.textAlign ?? 'center',
    fill: input.fill ?? '#2d2d2d',
    originX: 'left',
    originY: 'top',
    editable: true,
    selectable: true,
    evented: true,
    hasControls: true,
    hasBorders: true,
    lockScalingFlip: true,
  });

  applyTextSelectionVisuals(textObject);
  return textObject;
}

function findObjectByLayerId(
  canvas: fabric.Canvas,
  layerId: string
): fabric.Object | null {
  const objects = canvas.getObjects();
  for (const obj of objects) {
    const data = obj.data as CanvasLayerMetadata | undefined;
    if (data?.id === layerId) {
      return obj;
    }
    if (obj.type === 'group') {
      const group = obj as fabric.Group;
      const nested = group.getObjects();
      for (const child of nested) {
        const childData = child.data as CanvasLayerMetadata | undefined;
        if (childData?.id === layerId) {
          return child.group ?? group ?? child;
        }
      }
    }
  }
  return null;
}


interface CanvasStore {
  // Canvas instance
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
  
  // Layer import & metadata
  importLayers: (layers: CanvasLayerInput[], options?: { clearExisting?: boolean }) => Promise<void>;
  selectLayer: (layerId: string) => void;
  setLayerVisibility: (layerId: string, visible: boolean) => void;
  toggleLayerVisibilityById: (layerId: string) => void;
  deleteLayerById: (layerId: string) => void;
  duplicateLayerById: (layerId: string) => void;
  
  // Selected objects
  selectedObjects: fabric.Object[];
  setSelectedObjects: (objects: fabric.Object[]) => void;
  
  // Canvas state
  zoom: number;
  setZoom: (zoom: number) => void;
  panX: number;
  panY: number;
  setPan: (x: number, y: number) => void;
  
  // View settings
  showGrid: boolean;
  toggleGrid: () => void;
  showGuides: boolean;
  toggleGuides: () => void;
  showRulers: boolean;
  toggleRulers: () => void;
  snapEnabled: boolean;
  toggleSnap: () => void;
  
  // Active tool
  activeTool: 'select' | 'text' | 'image' | 'shape' | 'crop' | 'hand' | 'draw';
  setActiveTool: (tool: 'select' | 'text' | 'image' | 'shape' | 'crop' | 'hand' | 'draw') => void;
  
  // Canvas size
  canvasWidth: number;
  canvasHeight: number;
  setCanvasSize: (width: number, height: number) => void;
  
  // Drawing settings
  brushColor: string;
  brushWidth: number;
  setBrushColor: (color: string) => void;
  setBrushWidth: (width: number) => void;
  maskMode: MaskMode;
  setMaskMode: (mode: MaskMode) => void;
  clearMaskLayers: (mode?: Exclude<MaskMode, null>) => void;
  registerMaskPath: (path: fabric.Path, mode: Exclude<MaskMode, null>) => void;
  
  // Canvas operations
  addText: (text: string, options?: { x?: number; y?: number; fontSize?: number; fontFamily?: string; color?: string }) => void;
  addImage: (
    urlOrLayers: string | CanvasLayerInput[],
    options?: { x?: number; y?: number; width?: number; height?: number }
  ) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  groupSelected: () => void;
  ungroupSelected: () => void;
  
  // Export
  exportToPNG: (scale?: number) => Promise<Blob>;
  exportToPDF: () => Promise<Blob>;
  exportToJSON: () => string;
  
  // Undo/Redo history
  history: string[];
  historyIndex: number;
  saveHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  canvas: null,
  setCanvas: (canvas) => {
    set({ canvas });
    // Initialize history with empty canvas state
    if (canvas) {
      const initialState = JSON.stringify(canvas.toJSON());
      set({ history: [initialState], historyIndex: 0 });
    }
  },
  
  importLayers: async (layers, options = {}) => {
    const { canvas, saveHistory } = get();
    if (!canvas || !Array.isArray(layers) || layers.length === 0) {
      return;
    }

    const { clearExisting = false } = options;

    if (clearExisting) {
      const existingObjects = canvas.getObjects();
      existingObjects.forEach((obj) => canvas.remove(obj));
    }

    const normalized = layers.map((layer, index) => ({
      layer,
      metadata: buildLayerMetadata(layer, { zIndex: layer.zIndex ?? index }),
    }));

    const createdObjects: fabric.Object[] = [];

    for (const item of normalized) {
      try {
        const object =
          item.layer.type === 'image'
            ? await createImageObject(item.layer)
            : createTextObject(item.layer);

        applyTransformToObject(object, item.layer);
        applyMetadataToObject(object, item.metadata);
        createdObjects.push(object);
      } catch (error) {
        console.error('[importLayers] Skipped layer due to error:', error);
      }
    }

    if (createdObjects.length === 0) {
      return;
    }

    const groupedChildIds = new Set<string>();
    const floralGroupObjects: fabric.Object[] = [];
    const floralBuckets = new Map<string, fabric.Object[]>();

    createdObjects.forEach((object) => {
      const metadata = object.data as CanvasLayerMetadata | undefined;
      if (metadata?.semanticTag === 'floral') {
        const key = metadata.groupId ?? 'floral';
        const existing = floralBuckets.get(key) ?? [];
        existing.push(object);
        floralBuckets.set(key, existing);
      }
    });

    floralBuckets.forEach((objects, groupKey) => {
      if (objects.length <= 1) {
        return;
      }

      const childIds = objects
        .map((obj) => (obj.data as CanvasLayerMetadata | undefined)?.id)
        .filter((id): id is string => Boolean(id));

      childIds.forEach((id) => groupedChildIds.add(id));

      const referenceMeta = (objects[0].data as CanvasLayerMetadata)!;
      const zIndex = Math.min(
        ...objects.map(
          (obj) =>
            ((obj.data as CanvasLayerMetadata | undefined)?.zIndex ??
              referenceMeta.zIndex)
        )
      );

      const group = new fabric.Group(objects, {});
      const groupMetadata: CanvasLayerMetadata = {
        ...referenceMeta,
        id: createLayerId('floral'),
        name: referenceMeta.name ?? 'Floral Cluster',
        zIndex,
        groupId: groupKey,
        isGroup: true,
        additional: {
          ...(referenceMeta.additional ?? {}),
          groupedChildIds: childIds,
        },
      };

      applyMetadataToObject(group, groupMetadata);
      floralGroupObjects.push(group);
    });

    const filteredObjects = createdObjects.filter((object) => {
      const metadata = object.data as CanvasLayerMetadata | undefined;
      return metadata?.id ? !groupedChildIds.has(metadata.id) : true;
    });

    const finalObjects = [...filteredObjects, ...floralGroupObjects];

    finalObjects.sort((a, b) => {
      const metaA = a.data as CanvasLayerMetadata | undefined;
      const metaB = b.data as CanvasLayerMetadata | undefined;
      return (metaA?.zIndex ?? 0) - (metaB?.zIndex ?? 0);
    });

    finalObjects.forEach((object) => {
      canvas.add(object);
      const metadata = object.data as CanvasLayerMetadata | undefined;
      if (metadata) {
        canvas.moveTo(object, metadata.zIndex);
      }
    });

    canvas.discardActiveObject();
    set({ selectedObjects: [] });

    const canvasEl = canvas.getElement();
    const ctx = canvasEl?.getContext('2d');
    if (ctx) {
      canvas.renderAll();
    }

    saveHistory();
  },

  selectLayer: (layerId) => {
    const { canvas } = get();
    if (!canvas) return;
    const object = findObjectByLayerId(canvas, layerId);
    if (!object) return;

    canvas.discardActiveObject();
    canvas.setActiveObject(object);
    const canvasEl = canvas.getElement();
    const ctx = canvasEl?.getContext('2d');
    if (ctx) {
      canvas.renderAll();
    }
    set({ selectedObjects: [object] });
  },

  setLayerVisibility: (layerId, visible) => {
    const { canvas, saveHistory } = get();
    if (!canvas) return;
    const object = findObjectByLayerId(canvas, layerId);
    if (!object) return;

    object.set('visible', visible);
    const canvasEl = canvas.getElement();
    const ctx = canvasEl?.getContext('2d');
    if (ctx) {
      canvas.renderAll();
    }
    saveHistory();
  },

  toggleLayerVisibilityById: (layerId) => {
    const { canvas } = get();
    if (!canvas) return;
    const object = findObjectByLayerId(canvas, layerId);
    if (!object) return;
    const isVisible = object.visible ?? true;
    get().setLayerVisibility(layerId, !isVisible);
  },

  deleteLayerById: (layerId) => {
    const { canvas, saveHistory } = get();
    if (!canvas) return;
    const object = findObjectByLayerId(canvas, layerId);
    if (!object) return;

    canvas.remove(object);
    const canvasEl = canvas.getElement();
    const ctx = canvasEl?.getContext('2d');
    if (ctx) {
      canvas.renderAll();
    }

    set({ selectedObjects: [] });
    saveHistory();
  },

  duplicateLayerById: (layerId) => {
    const { canvas, saveHistory } = get();
    if (!canvas) return;
    const object = findObjectByLayerId(canvas, layerId);
    if (!object) return;

    object.clone((cloned: fabric.Object) => {
      const metadata = object.data as CanvasLayerMetadata | undefined;
      const now = new Date().toISOString();

      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
      });

      if (metadata) {
        const duplicatedMetadata: CanvasLayerMetadata = {
          ...metadata,
          id: createLayerId(metadata.semanticTag),
          name: `${metadata.name ?? 'Layer'} Copy`,
          origin: 'user',
          zIndex: metadata.zIndex + 1,
          createdAt: now,
          additional: {
            ...(metadata.additional ?? {}),
            duplicatedFrom: metadata.id,
          },
        };
        applyMetadataToObject(cloned, duplicatedMetadata);
      }

      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      const canvasEl = canvas.getElement();
      const ctx = canvasEl?.getContext('2d');
      if (ctx) {
        canvas.renderAll();
      }
      saveHistory();
      set({ selectedObjects: [cloned] });
    });
  },
  
  selectedObjects: [],
  setSelectedObjects: (objects) => set({ selectedObjects: objects }),
  
  zoom: 1,
  setZoom: (zoom) => {
    // Don't change Fabric.js zoom - we use CSS scale for visual zoom
    // Fabric.js stays at zoom 1 for accurate mouse coordinates
    set({ zoom });
  },
  
  panX: 0,
  panY: 0,
  setPan: (x, y) => {
    // Only update state - CSS transforms handle visual panning
    // This keeps Fabric.js coordinates stable
    set({ panX: x, panY: y });
  },
  
  showGrid: false,
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  
  showGuides: false,
  toggleGuides: () => set((state) => ({ showGuides: !state.showGuides })),
  
  showRulers: false,
  toggleRulers: () => set((state) => ({ showRulers: !state.showRulers })),
  
  snapEnabled: true,
  toggleSnap: () => set((state) => ({ snapEnabled: !state.snapEnabled })),
  
  // Active tool
  activeTool: 'select' as const,
  setActiveTool: (tool) => set({ activeTool: tool }),
  
  // Canvas size
  canvasWidth: 1500,
  canvasHeight: 2100,
  setCanvasSize: (width, height) => {
    const { canvas } = get();
    if (canvas) {
      canvas.setWidth(width);
      canvas.setHeight(height);
      
      // Check if canvas has valid context before rendering
      const canvasEl = canvas.getElement();
      const ctx = canvasEl?.getContext('2d');
      if (ctx) {
        canvas.renderAll();
      }
    }
    set({ canvasWidth: width, canvasHeight: height });
  },
  
  // Drawing settings
  brushColor: '#000000',
  brushWidth: 5,
  setBrushColor: (color) => set({ brushColor: color }),
  setBrushWidth: (width) => set({ brushWidth: width }),
  maskMode: null,
  setMaskMode: (mode) => {
    set({ maskMode: mode });
    if (mode) {
      const { setActiveTool } = get();
      setActiveTool('draw');
    }
  },
  clearMaskLayers: (mode) => {
    const { canvas, saveHistory } = get();
    if (!canvas) return;
    const candidates = canvas.getObjects().filter((object) => {
      const data = object.data as CanvasLayerMetadata | undefined;
      if (data?.semanticTag !== 'mask') {
        return false;
      }
      if (!mode) return true;
      const maskMode = data.additional?.maskMode as MaskMode | undefined;
      return maskMode === mode;
    });
    if (candidates.length === 0) {
      return;
    }

    candidates.forEach((object) => canvas.remove(object));
    const canvasEl = canvas.getElement();
    const ctx = canvasEl?.getContext('2d');
    if (ctx) {
      canvas.renderAll();
    }
    set({ selectedObjects: [] });
    saveHistory();
  },
  registerMaskPath: (path, mode) => {
    const { canvas } = get();
    if (!canvas) return;
    const metadata: CanvasLayerMetadata = {
      id: createLayerId('mask'),
      name: mode === 'keep' ? 'Mask Keep' : 'Mask Remove',
      semanticTag: 'mask',
      origin: 'user',
      zIndex: canvas.getObjects().length,
      createdAt: new Date().toISOString(),
      additional: {
        maskMode: mode,
      },
      isGroup: false,
    };

    path.set({
      fill: mode === 'keep' ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)',
      stroke: mode === 'keep' ? '#22c55e' : '#ef4444',
      strokeWidth: Math.max(path.strokeWidth ?? 1, 6),
      opacity: 0.85,
      selectable: true,
      evented: true,
    });

    path.set('data', metadata);
    path.set('name', metadata.name);
    canvas.moveTo(path, metadata.zIndex);
  },
  
  addText: (text, options = {}) => {
    const { canvas, saveHistory } = get();
    if (!canvas) return;

    const positionX = options.x ?? canvas.width! / 2 - 100;
    const positionY = options.y ?? canvas.height! / 2;

    const layerInput: CanvasLayerInput = {
      type: 'text',
      text,
      semanticTag: 'typography',
      origin: 'user',
      position: { x: positionX, y: positionY },
      fontFamily: options.fontFamily,
      fontSize: options.fontSize,
      fill: options.color,
    };

    const textObject = createTextObject(layerInput);
    textObject.set({
      left: positionX,
      top: positionY,
    });

    const metadata = buildLayerMetadata(layerInput, {
      zIndex: canvas.getObjects().length,
      name: 'Text',
      origin: 'user',
      text,
    });
    applyMetadataToObject(textObject, metadata);

    canvas.add(textObject);
    canvas.setActiveObject(textObject);

    const canvasEl = canvas.getElement();
    const ctx = canvasEl?.getContext('2d');
    if (ctx) {
      canvas.renderAll();
    }

    set({ selectedObjects: [textObject] });
    saveHistory();
    return textObject;
  },
  
  addImage: (urlOrLayers, options = {}) => {
    if (Array.isArray(urlOrLayers)) {
      void get().importLayers(urlOrLayers);
      return;
    }

    const url = urlOrLayers;
    const { canvas, saveHistory } = get();
    if (!canvas) {
      console.error('[addImage] Canvas not initialized');
      return;
    }
    
    const resolvedUrl = (() => {
      if (typeof window !== 'undefined' && url.startsWith('/')) {
        try {
          return new URL(url, window.location.origin).toString();
        } catch (error) {
          console.warn('[addImage] Failed to resolve absolute URL, falling back to original path:', error);
        }
      }
      return url;
    })();
    
    fabric.Image.fromURL(
      resolvedUrl,
      ((img: fabric.Image, isError: boolean) => {
        if (isError) {
          console.error('[addImage] Failed to load image:', resolvedUrl, isError);
          return;
        }
        
        if (!img) {
          console.error('[addImage] Image object is null');
          return;
        }
        
        img.set({
          originX: 'left',
          originY: 'top',
        });

        if (options.width) {
          img.scaleToWidth(options.width);
        } else if (options.height) {
          img.scaleToHeight(options.height);
        } else if (img.width && img.height && canvas.width && canvas.height) {
          const scaleX = canvas.width / img.width;
          const scaleY = canvas.height / img.height;
          const coverScale = Math.max(scaleX, scaleY);
          img.scale(coverScale);
          img.set({
            left: (canvas.width - (img.width * coverScale)) / 2,
            top: (canvas.height - (img.height * coverScale)) / 2,
          });
        }
        
        if (options.x !== undefined) img.set('left', options.x);
        if (options.y !== undefined) img.set('top', options.y);
        
        if (options.x === undefined && options.y === undefined) {
          const scaledWidth = (img.width || 0) * (img.scaleX || 1);
          const scaledHeight = (img.height || 0) * (img.scaleY || 1);
          img.set({
            left: (canvas.width! - scaledWidth) / 2,
            top: (canvas.height! - scaledHeight) / 2,
          });
        }
        
        img.set({
          opacity: 1,
          visible: true,
          selectable: true,
          evented: true,
        });

        const metadata = buildLayerMetadata(
          {
            type: 'image',
            source: resolvedUrl,
            semanticTag: 'user',
            origin: 'user',
            position: { x: img.left ?? 0, y: img.top ?? 0 },
            size: {
              scaleX: img.scaleX ?? 1,
              scaleY: img.scaleY ?? 1,
            },
          },
          {
            zIndex: canvas.getObjects().length,
            source: resolvedUrl,
          }
        );
        applyMetadataToObject(img, metadata);
        
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.moveTo(img, metadata.zIndex);
        
        const canvasEl = canvas.getElement();
        const ctx = canvasEl?.getContext('2d');
        if (ctx) {
          canvas.renderAll();
        }
        
        set({ selectedObjects: [img] });
        saveHistory();
      }) as any,
      { crossOrigin: 'anonymous' }
    );
  },
  
  deleteSelected: () => {
    const { canvas, selectedObjects, saveHistory } = get();
    if (!canvas || selectedObjects.length === 0) return;
    
    selectedObjects.forEach((obj) => canvas.remove(obj));
    
    // Check if canvas has valid context before rendering
    const canvasEl = canvas.getElement();
    const ctx = canvasEl?.getContext('2d');
    if (ctx) {
      canvas.renderAll();
    }
    
    set({ selectedObjects: [] });
    saveHistory();
  },
  
  duplicateSelected: () => {
    const { canvas, selectedObjects, saveHistory } = get();
    if (!canvas || selectedObjects.length === 0) return;

    const clonePromises = selectedObjects.map(
      (obj) =>
        new Promise<fabric.Object>((resolve, reject) => {
          obj.clone((cloned: fabric.Object) => {
            if (!cloned) {
              reject(new Error('Clone failed'));
              return;
            }
            resolve(cloned);
          });
        })
    );

    Promise.all(clonePromises)
      .then((clonedObjects) => {
        const now = new Date().toISOString();
        clonedObjects.forEach((cloned, index) => {
          const original = selectedObjects[index];
          const metadata = original.data as CanvasLayerMetadata | undefined;

          cloned.set({
            left: (cloned.left || 0) + 20,
            top: (cloned.top || 0) + 20,
          });

          if (metadata) {
            const duplicateMeta: CanvasLayerMetadata = {
              ...metadata,
              id: createLayerId(metadata.semanticTag),
              name: `${metadata.name ?? 'Layer'} Copy`,
              origin: 'user',
              zIndex: metadata.zIndex + 1,
              createdAt: now,
              additional: {
                ...(metadata.additional ?? {}),
                duplicatedFrom: metadata.id,
              },
            };
            applyMetadataToObject(cloned, duplicateMeta);
          }

          canvas.add(cloned);
          canvas.moveTo(
            cloned,
            (metadata?.zIndex ?? canvas.getObjects().length - 1) + 1
          );
        });

        const lastClone = clonedObjects[clonedObjects.length - 1];
        if (lastClone) {
          canvas.setActiveObject(lastClone);
          set({ selectedObjects: [lastClone] });
        }

        const canvasEl = canvas.getElement();
        const ctx = canvasEl?.getContext('2d');
        if (ctx) {
          canvas.renderAll();
        }

        saveHistory();
      })
      .catch((error) => {
        console.error('[duplicateSelected] Failed to duplicate objects:', error);
      });
  },
  
  groupSelected: () => {
    const { canvas, selectedObjects, saveHistory } = get();
    if (!canvas || selectedObjects.length < 2) return;

    const group = new fabric.Group(selectedObjects, {});
    const childIds = selectedObjects
      .map((obj) => (obj.data as CanvasLayerMetadata | undefined)?.id)
      .filter((id): id is string => Boolean(id));
    const zIndex = Math.min(
      ...selectedObjects.map((obj) => {
        const meta = obj.data as CanvasLayerMetadata | undefined;
        if (meta?.zIndex !== undefined) {
          return meta.zIndex;
        }
        return canvas.getObjects().indexOf(obj);
      })
    );
    const referenceMeta =
      (selectedObjects[0].data as CanvasLayerMetadata | undefined) ?? null;

    const metadata: CanvasLayerMetadata = {
      id: createLayerId(referenceMeta?.semanticTag ?? 'misc'),
      name: referenceMeta?.name
        ? `${referenceMeta.name} Group`
        : 'Layer Group',
      semanticTag: referenceMeta?.semanticTag ?? 'misc',
      origin: referenceMeta?.origin ?? 'user',
      zIndex: Number.isFinite(zIndex) ? zIndex : canvas.getObjects().length,
      groupId: referenceMeta?.groupId,
      source: undefined,
      text: undefined,
      maskUrl: undefined,
      createdAt: new Date().toISOString(),
      locked: false,
      additional: {
        ...(referenceMeta?.additional ?? {}),
        groupedChildIds: childIds,
      },
      isGroup: true,
    };

    applyMetadataToObject(group, metadata);

    canvas.remove(...selectedObjects);
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.moveTo(group, metadata.zIndex);

    const canvasEl = canvas.getElement();
    const ctx = canvasEl?.getContext('2d');
    if (ctx) {
      canvas.renderAll();
    }

    set({ selectedObjects: [group] });
    saveHistory();
  },
  
  ungroupSelected: () => {
    const { canvas, selectedObjects, saveHistory } = get();
    if (!canvas || selectedObjects.length === 0) return;
    
    const activeObject = selectedObjects[0];
    if (activeObject.type === 'group') {
      const group = activeObject as fabric.Group;
      const objects = group.getObjects();
      canvas.remove(group);
      objects.forEach((obj) => {
        obj.set({
          left: (obj.left || 0) + (group.left || 0),
          top: (obj.top || 0) + (group.top || 0),
        });
        canvas.add(obj);
        const metadata = obj.data as CanvasLayerMetadata | undefined;
        if (metadata?.zIndex !== undefined) {
          canvas.moveTo(obj, metadata.zIndex);
        }
      });
      
      // Check if canvas has valid context before rendering
      const canvasEl = canvas.getElement();
      const ctx = canvasEl?.getContext('2d');
      if (ctx) {
        canvas.renderAll();
      }
      
      set({ selectedObjects: [] });
      saveHistory();
    }
  },
  
  // Undo/Redo history
  history: [],
  historyIndex: -1,
  
  saveHistory: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas) return;
    
    const state = JSON.stringify(canvas.toJSON());
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    
    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    const newIndex = newHistory.length - 1;
    set({
      history: newHistory,
      historyIndex: newIndex,
      canUndo: newIndex > 0,
      canRedo: false,
    });
  },
  
  undo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex <= 0) {
      set({ canUndo: false });
      return;
    }
    
    const newIndex = historyIndex - 1;
    const state = history[newIndex];
    canvas.loadFromJSON(state, () => {
      // Check if canvas has valid context before rendering
      const canvasEl = canvas.getElement();
      const ctx = canvasEl?.getContext('2d');
      if (ctx) {
        canvas.renderAll();
      }
      set({ 
        historyIndex: newIndex,
        canUndo: newIndex > 0,
        canRedo: true,
      });
    });
  },
  
  redo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex >= history.length - 1) {
      set({ canRedo: false });
      return;
    }
    
    const newIndex = historyIndex + 1;
    const state = history[newIndex];
    canvas.loadFromJSON(state, () => {
      // Check if canvas has valid context before rendering
      const canvasEl = canvas.getElement();
      const ctx = canvasEl?.getContext('2d');
      if (ctx) {
        canvas.renderAll();
      }
      set({ 
        historyIndex: newIndex,
        canUndo: true,
        canRedo: newIndex < history.length - 1,
      });
    });
  },
  
  canUndo: false,
  canRedo: false,
  
  exportToPNG: async (scale = 1) => {
    const { canvas } = get();
    if (!canvas) throw new Error('Canvas not initialized');
    
    return new Promise<Blob>((resolve, reject) => {
      try {
        const dataUrl = canvas.toDataURL({
          format: 'png',
          multiplier: scale,
        });
        fetch(dataUrl)
          .then((res) => res.blob())
          .then(resolve)
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  },
  
  exportToPDF: async () => {
    const { canvas } = get();
    if (!canvas) throw new Error('Canvas not initialized');

    const canvasJson = JSON.stringify(canvas.toJSON(['type', 'left', 'top', 'width', 'height', 'fill', 'stroke']));

    const response = await fetch('/api/export/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ canvasJson }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.error || 'Print-ready export not yet available.');
    }

    const buffer = await response.arrayBuffer();
    return new Blob([buffer], { type: 'application/pdf' });
  },
  
  exportToJSON: () => {
    const { canvas } = get();
    if (!canvas) return '';
    return JSON.stringify(canvas.toJSON());
  },
}));

