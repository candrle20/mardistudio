'use client';

import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useCanvasStore } from '@/stores/canvas-store';
import { useTabStore } from '@/stores/tab-store';
import { useTextEditing } from '@/lib/hooks/useTextEditing';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';
import { initializeSnapping } from '@/lib/canvas/snapping';
import { importParsedLayers } from '@/lib/canvas/layers';

interface CanvasEditorProps {
  projectId: string;
  initialCanvas?: string;
  onSave?: (canvas: string) => void;
  readOnly?: boolean;
}

export function CanvasEditor({ projectId, initialCanvas, onSave, readOnly = false }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onSaveRef = useRef(onSave);
  const lastSyncedJsonRef = useRef<string | null>(null);
  const isHydratingRef = useRef(false);
  const { 
    canvas, 
    setCanvas, 
    zoom, 
    setZoom, 
    selectedObjects, 
    setSelectedObjects, 
    activeTool,
    brushColor,
    brushWidth,
    setPan,
    showGrid,
    snapEnabled,
    maskMode,
    registerMaskPath,
  } = useCanvasStore();
  
  const get = useCanvasStore.getState;
  
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);
  
  // Get canvas size from active tab
  const getActiveTab = useTabStore((state) => state.getActiveTab);
  const activeTab = getActiveTab();
  const canvasWidth = activeTab?.width || 1500;
  const canvasHeight = activeTab?.height || 2100;
  
  const isPanningRef = useRef(false);
  const lastPanPointRef = useRef({ x: 0, y: 0 });
  
  // Enable text editing on double-click
  useTextEditing();
  
  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Initialize Fabric.js canvas with better context handling
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#ffffff',
      selection: !readOnly,
      preserveObjectStacking: true,
      isDrawingMode: false,
      renderOnAddRemove: true,
      allowTouchScrolling: false, // Prevent touch scrolling from moving objects
      enableRetinaScaling: false, // Disable retina scaling to reduce memory usage
    });
    
    // Override fabric's clearContext to handle null context gracefully
    const originalClearContext = fabric.StaticCanvas.prototype.clearContext;
    (fabric.StaticCanvas.prototype.clearContext as any) = function(this: any, ctx: any) {
      if (!ctx) {
        console.warn('[Fabric] Attempted to clear null context, skipping');
        return this;
      }
      return originalClearContext.call(this, ctx);
    };
    
    // Override fabric's renderAll to safely handle errors but still attempt render
    const originalRenderAll = fabricCanvas.renderAll.bind(fabricCanvas);
    fabricCanvas.renderAll = function() {
      try {
        const canvasEl = this.getElement();
        if (!canvasEl) {
          console.warn('[Fabric] Canvas element is null');
          return this;
        }
        return originalRenderAll();
      } catch (err) {
        // Log error but don't crash - the context might recover
        console.warn('[Fabric] Error during renderAll (non-fatal):', err);
        return this;
      }
    };
    
    // Ensure canvas renders immediately with context check
    const canvasEl = fabricCanvas.getElement();
    const ctx = canvasEl?.getContext('2d');
    if (ctx) {
      fabricCanvas.renderAll();
    }
    
    // Handle context loss and recovery
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('[Canvas] Context lost, attempting recovery...');
    };
    
    const handleContextRestored = () => {
      console.log('[Canvas] Context restored, re-rendering canvas');
      try {
        const el = fabricCanvas.getElement();
        const newCtx = el?.getContext('2d');
        if (newCtx) {
          fabricCanvas.renderAll();
        }
      } catch (err) {
        console.error('[Canvas] Failed to render after context restore:', err);
      }
    };
    
    if (canvasEl) {
      canvasEl.addEventListener('webglcontextlost', handleContextLost);
      canvasEl.addEventListener('webglcontextrestored', handleContextRestored);
      canvasEl.addEventListener('contextlost', handleContextLost);
      canvasEl.addEventListener('contextrestored', handleContextRestored);
    }

    // Set up event handlers
    fabricCanvas.on('selection:created', (e) => {
      const activeObjects = fabricCanvas.getActiveObjects();
      setSelectedObjects(activeObjects);
    });

    fabricCanvas.on('selection:updated', (e) => {
      const activeObjects = fabricCanvas.getActiveObjects();
      setSelectedObjects(activeObjects);
    });

    fabricCanvas.on('selection:cleared', () => {
      setSelectedObjects([]);
    });

    // Initialize advanced snapping (alignment guides + grid + object snapping)
    const snappingControl = initializeSnapping(fabricCanvas, {
      enabled: useCanvasStore.getState().snapEnabled,
      snapDistance: 5,
      snapToObjects: true,
      snapToCanvas: true,
      snapToGrid: useCanvasStore.getState().showGrid,
      gridSize: 20,
    });

    // Handle canvas clicks for active tools
    fabricCanvas.on('mouse:down', (e) => {
      if (readOnly) return;
      
      // Get current active tool from store (reactive)
      const currentTool = useCanvasStore.getState().activeTool;
      const pointer = fabricCanvas.getPointer(e.e);
      
      // Hand tool - start panning (only if not clicking on an object)
      if (currentTool === 'hand') {
        isPanningRef.current = true;
        lastPanPointRef.current = { x: e.e.clientX, y: e.e.clientY };
        const canvasElement = fabricCanvas.getElement();
        if (canvasElement) canvasElement.style.cursor = 'grabbing';
        fabricCanvas.selection = false; // Disable selection during pan
        return;
      }
      
      // For select tool, allow normal object selection and dragging
      if (currentTool === 'select') {
        fabricCanvas.selection = true;
      }
      
      // Only create text if text tool is active and clicking on empty canvas
      if (currentTool === 'text' && !e.target) {
        const { addText, setActiveTool } = useCanvasStore.getState();
        const textObject = addText('Double-click to edit', {
          x: pointer.x,
          y: pointer.y,
          fontSize: 24,
          fontFamily: 'Inter',
          color: '#000000',
        });
        // Reset to select tool after creating text
        setActiveTool('select');
        // Enter editing mode immediately
        setTimeout(() => {
          const canvas = useCanvasStore.getState().canvas;
          if (canvas) {
            const objects = canvas.getObjects();
            const lastText = objects[objects.length - 1];
            if (lastText && (lastText.type === 'i-text' || lastText.type === 'text')) {
              canvas.setActiveObject(lastText);
              if (lastText.type === 'i-text') {
                (lastText as fabric.IText).enterEditing();
              }
            }
          }
        }, 100);
      }
    });

    fabricCanvas.on('mouse:move', (e) => {
      if (isPanningRef.current) {
        const deltaX = e.e.clientX - lastPanPointRef.current.x;
        const deltaY = e.e.clientY - lastPanPointRef.current.y;
        
        const { panX, panY, setPan } = useCanvasStore.getState();
        setPan(panX + deltaX, panY + deltaY);
        
        lastPanPointRef.current = { x: e.e.clientX, y: e.e.clientY };
      }
    });

    fabricCanvas.on('mouse:up', () => {
      if (isPanningRef.current) {
        isPanningRef.current = false;
        const currentTool = useCanvasStore.getState().activeTool;
        if (currentTool === 'hand') {
          const canvasElement = fabricCanvas.getElement();
          if (canvasElement) canvasElement.style.cursor = 'grab';
        }
      }
    });

    // Track changes for undo/redo and auto-save
    const { saveHistory } = useCanvasStore.getState();
    const saveState = () => {
      if (isHydratingRef.current) {
        return;
      }
      saveHistory();
      const onSaveFn = onSaveRef.current;
      if (onSaveFn) {
        const json = JSON.stringify(fabricCanvas.toJSON());
        lastSyncedJsonRef.current = json;
        onSaveFn(json);
      }
    };

    fabricCanvas.on('object:added', saveState);
    fabricCanvas.on('object:modified', saveState);
    fabricCanvas.on('object:removed', saveState);

    // Keep Fabric.js zoom at 1 - we'll use CSS for visual zoom
    fabricCanvas.setZoom(1);
    
    setCanvas(fabricCanvas);

    // Cleanup
    return () => {
      isHydratingRef.current = true;
      onSaveRef.current = undefined;
      lastSyncedJsonRef.current = null;
      const el = fabricCanvas.getElement();
      if (el) {
        el.removeEventListener('webglcontextlost', handleContextLost);
        el.removeEventListener('webglcontextrestored', handleContextRestored);
        el.removeEventListener('contextlost', handleContextLost);
        el.removeEventListener('contextrestored', handleContextRestored);
      }
      // Clean up snapping
      snappingControl.destroy();
      try {
        fabricCanvas.dispose();
      } catch (err) {
        console.error('[Canvas] Error disposing canvas:', err);
      }
    };
  }, [projectId, readOnly, setCanvas, setSelectedObjects, canvasWidth, canvasHeight]);

  useEffect(() => {
    if (!canvas) return;

    const renderCanvas = () => {
      const el = canvas.getElement();
      const context = el?.getContext('2d');
      if (context) {
        canvas.renderAll();
        canvas.requestRenderAll();
      }
    };

    if (!initialCanvas) {
      if (canvas.getObjects().length === 0) {
        lastSyncedJsonRef.current = '';
        return;
      }

      try {
        isHydratingRef.current = true;
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        canvas.discardActiveObject();
        setSelectedObjects([]);
        renderCanvas();
        lastSyncedJsonRef.current = '';
        const { saveHistory } = useCanvasStore.getState();
        saveHistory();
      } catch (error) {
        console.error('[CanvasEditor] Failed to reset canvas:', error);
      } finally {
        isHydratingRef.current = false;
      }
      return;
    }

    if (initialCanvas === lastSyncedJsonRef.current) {
      return;
    }

    try {
      isHydratingRef.current = true;
      canvas.loadFromJSON(initialCanvas, () => {
        try {
          renderCanvas();
          canvas.discardActiveObject();
          setSelectedObjects([]);
          lastSyncedJsonRef.current = initialCanvas;
          const { saveHistory } = useCanvasStore.getState();
          saveHistory();
        } finally {
          isHydratingRef.current = false;
        }
      });
    } catch (error) {
      isHydratingRef.current = false;
      console.error('[CanvasEditor] Failed to load canvas JSON:', error);
    }
  }, [canvas, initialCanvas, setSelectedObjects]);

  useEffect(() => {
    if (!canvas) return;
    const metadataUrl = activeTab?.metadataUrl;
    if (!metadataUrl) return;
    if (canvas.getObjects().length > 0 || !!canvas.backgroundImage) {
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(metadataUrl, { cache: 'no-store' });
        if (!response.ok) {
          console.warn('[CanvasEditor] Failed to fetch metadata:', response.statusText);
          return;
        }
        const metadata = await response.json();
        if (cancelled || !metadata?.layers) return;
        await importParsedLayers({ canvas, layers: metadata.layers });
        lastSyncedJsonRef.current = JSON.stringify(canvas.toJSON());
      } catch (error) {
        console.error('[CanvasEditor] Error loading metadata:', error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [canvas, activeTab?.metadataUrl]);
  
  // Update snapping options when snap or grid state changes
  useEffect(() => {
    if (!canvas) return;
    // The snapping control is stored in the canvas, we need to access it
    // For now, we'll just rely on the initial setup
    // In a production app, you'd want to expose the snapping control via a ref
  }, [canvas, snapEnabled, showGrid]);
  
  // Auto zoom to fit when canvas size changes (new template selected)
  useEffect(() => {
    if (!containerRef.current || !canvasWidth || !canvasHeight) return;
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Calculate zoom to fit with padding (accounting for the 8*4=32px padding on each side)
    const availableWidth = containerWidth - 64;
    const availableHeight = containerHeight - 64;
    const horizontalZoom = availableWidth / canvasWidth;
    const verticalZoom = availableHeight / canvasHeight;
    const fitZoom = Math.min(horizontalZoom, verticalZoom, 1); // Never zoom in beyond 1:1
    
    setZoom(fitZoom);
  }, [canvasWidth, canvasHeight, setZoom]);
  
  // Update brush settings for drawing and handle mask paths
  useEffect(() => {
    if (!canvas) return;

    const handlePathCreated = (event: any) => {
      const path = event.path as fabric.Path;
      if (!path) return;

      if (maskMode) {
        registerMaskPath(path, maskMode);
      }

      canvas.setActiveObject(path);
      setSelectedObjects([path]);

      const canvasEl = canvas.getElement();
      const ctx = canvasEl?.getContext('2d');
      if (ctx) {
        canvas.renderAll();
      }

      const { saveHistory } = useCanvasStore.getState();
      saveHistory();
    };

    canvas.off('path:created', handlePathCreated);

    if (activeTool === 'draw') {
      canvas.isDrawingMode = true;
      const brush = canvas.freeDrawingBrush as fabric.PencilBrush;

      if (maskMode === 'keep') {
        brush.color = '#22c55e';
        brush.width = Math.max(brushWidth, 12);
      } else if (maskMode === 'remove') {
        brush.color = '#ef4444';
        brush.width = Math.max(brushWidth, 12);
      } else {
        brush.color = brushColor;
        brush.width = brushWidth;
      }

      canvas.on('path:created', handlePathCreated);
    } else {
      canvas.isDrawingMode = false;
    }

    return () => {
      canvas.off('path:created', handlePathCreated);
    };
  }, [canvas, activeTool, brushColor, brushWidth, maskMode, registerMaskPath, setSelectedObjects]);

  // Handle grid overlay with canvas background
  useEffect(() => {
    if (!canvas) return;
    
    // Check if canvas is properly initialized and has a valid context
    const canvasEl = canvas.getElement();
    if (!canvasEl) return;
    
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;
    
    if (showGrid) {
      // Create grid pattern using fabric
      canvas.backgroundColor = '#ffffff';
      canvas.backgroundImage = undefined;
      
      // Set up grid as background pattern
      const gridSize = 20;
      const gridCanvas = document.createElement('canvas');
      gridCanvas.width = canvas.width!;
      gridCanvas.height = canvas.height!;
      const gridCtx = gridCanvas.getContext('2d');
      
      if (gridCtx) {
        gridCtx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
        gridCtx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x <= gridCanvas.width; x += gridSize) {
          gridCtx.beginPath();
          gridCtx.moveTo(x, 0);
          gridCtx.lineTo(x, gridCanvas.height);
          gridCtx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= gridCanvas.height; y += gridSize) {
          gridCtx.beginPath();
          gridCtx.moveTo(0, y);
          gridCtx.lineTo(gridCanvas.width, y);
          gridCtx.stroke();
        }
        
        fabric.Image.fromURL(gridCanvas.toDataURL(), (img) => {
          if (img && canvas) {
            canvas.setBackgroundImage(img, () => {
              // Only render if canvas still has valid context
              const el = canvas.getElement();
              const context = el?.getContext('2d');
              if (context) {
                canvas.renderAll();
              }
            }, {
              scaleX: 1,
              scaleY: 1,
              originX: 'left',
              originY: 'top',
            });
          }
        });
      }
    } else {
      // Remove grid - check context before rendering
      canvas.backgroundImage = undefined;
      canvas.backgroundColor = '#ffffff';
      
      // Only render if canvas has valid context
      const el = canvas.getElement();
      const context = el?.getContext('2d');
      if (context) {
        canvas.renderAll();
      }
    }
  }, [canvas, showGrid]);

  // Update canvas cursor based on active tool
  useEffect(() => {
    if (!canvas) return;
    
    const canvasElement = canvas.getElement();
    if (!canvasElement) return;
    
    if (activeTool === 'text') {
      canvasElement.style.cursor = 'text';
      canvas.selection = false; // Disable selection when text tool is active
    } else if (activeTool === 'draw') {
      canvasElement.style.cursor = 'crosshair';
      canvas.selection = false;
    } else if (activeTool === 'hand') {
      canvasElement.style.cursor = 'grab';
      canvas.selection = false;
    } else {
      canvasElement.style.cursor = 'default';
      canvas.selection = !readOnly;
    }
  }, [canvas, activeTool, readOnly]);
  
  // Handle mouse wheel for pan (two-finger scroll) and zoom (pinch/ctrl+wheel)
  useEffect(() => {
    if (!containerRef.current) return;

    const handleWheel = (e: WheelEvent) => {
      // Only handle wheel events at the container level, not when editing text
      const target = e.target as HTMLElement;
      if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      
      // Ctrl/Cmd + wheel = zoom
      if (e.ctrlKey || e.metaKey) {
        const delta = e.deltaY;
        const zoomFactor = delta < 0 ? 1.1 : 0.9;
        const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.1), 10);
        setZoom(newZoom);
      } else {
        // Regular wheel = pan view only (CSS transform)
        // This does NOT move objects, only changes the viewport
        setPan(
          get().panX - e.deltaX,
          get().panY - e.deltaY
        );
      }
    };

    const container = containerRef.current;
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [zoom, setZoom, setPan]);
  
  const { panX, panY } = useCanvasStore();
  
  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden bg-gray-300"
      style={{
        overscrollBehavior: 'none',
        touchAction: 'none'
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div 
          className="relative"
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Canvas wrapper with paper effect */}
          <div 
            className="relative bg-white"
            style={{ 
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
            }}
          >
            <canvas ref={canvasRef} style={{ display: 'block' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

