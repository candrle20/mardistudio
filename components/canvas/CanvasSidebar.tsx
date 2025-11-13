'use client';

import { useCanvasStore } from '@/stores/canvas-store';
import { useUIStore } from '@/stores/ui-store';
import type { CanvasLayerMetadata } from '@/types/canvas';
import { TextEditor } from '@/components/editor/TextEditor';
import { ImageEditor } from '@/components/editor/ImageEditor';
import { ShapeEditor } from '@/components/editor/ShapeEditor';
import { X, Copy, Trash2, Layers, Lock, Unlock, Eye, EyeOff, ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, Link, Unlink, AlignHorizontalJustifyCenter, AlignVerticalJustifyCenter, Sparkles, Image as ImageIcon, Type, PenLine, Eraser } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { fabric } from 'fabric';
import { HexColorPicker } from 'react-colorful';

export function CanvasSidebar() {
  const { 
    selectedObjects, 
    deleteSelected, 
    duplicateSelected, 
    activeTool, 
    brushColor, 
    brushWidth, 
    setBrushColor, 
    setBrushWidth, 
    canvas,
    selectLayer,
    toggleLayerVisibilityById,
    duplicateLayerById,
    deleteLayerById,
    maskMode,
    setMaskMode,
    clearMaskLayers,
    setActiveTool,
  } = useCanvasStore();
  const { toast, toggleAIPanel, aiPanelOpen } = useUIStore();
  const [activeTab, setActiveTab] = useState<'properties' | 'layers'>('properties');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);
  const [layerVersion, setLayerVersion] = useState(0);

  const selectedObject = selectedObjects[0];

  useEffect(() => {
    if (!canvas) return;

    const markDirty = () => setLayerVersion((version) => version + 1);
    const events: Array<[string, (...args: any[]) => void]> = [
      ['object:added', markDirty],
      ['object:removed', markDirty],
      ['object:modified', markDirty],
      ['path:created', markDirty],
    ];

    events.forEach(([event, handler]) => canvas.on(event, handler));
    markDirty();

    return () => {
      events.forEach(([event, handler]) => canvas.off(event, handler));
    };
  }, [canvas]);

  const layers = useMemo(() => {
    if (!canvas) return [];
    const objects = canvas.getObjects();
    return objects
      .map((object, index) => {
        const metadata = object.get('data') as CanvasLayerMetadata | undefined;
        const metadataId = metadata?.id ?? null;
        return {
          id: metadataId,
          key: metadataId ?? `layer-${index}`,
          name: metadata?.name ?? (object.type || 'Layer'),
          metadata,
          object,
          visible: object.visible !== false,
          locked: Boolean(object.lockMovementX),
          isActive: selectedObjects.includes(object),
        };
      })
      .reverse();
  }, [canvas, layerVersion, selectedObjects]);

  const semanticLabels: Record<string, string> = {
    background: 'Background',
    floral: 'Florals',
    typography: 'Typography',
    mask: 'Mask',
    graphic: 'Graphic',
    misc: 'Layer',
    user: 'Layer',
  };

  const semanticDotClasses: Record<string, string> = {
    background: 'bg-blue-500',
    floral: 'bg-rose-500',
    typography: 'bg-amber-500',
    mask: 'bg-emerald-500',
    graphic: 'bg-slate-500',
    misc: 'bg-gray-400',
    user: 'bg-gray-400',
  };

  const handleLayerSelect = (layerId: string | null) => {
    if (!layerId) {
      toast('This layer is read-only and cannot be selected.', 'info');
      return;
    }
    selectLayer(layerId);
    setActiveTool('select');
  };

  const handleVisibilityToggle = (
    event: MouseEvent<HTMLButtonElement>,
    layerId: string | null
  ) => {
    event.stopPropagation();
    if (!layerId) return;
    toggleLayerVisibilityById(layerId);
  };

  const handleDuplicateLayer = (
    event: MouseEvent<HTMLButtonElement>,
    layerId: string | null
  ) => {
    event.stopPropagation();
    if (!layerId) return;
    duplicateLayerById(layerId);
  };

  const handleDeleteLayer = (
    event: MouseEvent<HTMLButtonElement>,
    layerId: string | null
  ) => {
    event.stopPropagation();
    if (!layerId) return;
    deleteLayerById(layerId);
  };

  const handleQuickAction = (
    action: 'florals' | 'background' | 'typography'
  ) => {
    const findLayerByTag = (tag: string, preferBottom = false) => {
      if (preferBottom) {
        for (let i = layers.length - 1; i >= 0; i -= 1) {
          if (layers[i].metadata?.semanticTag === tag) {
            return layers[i];
          }
        }
        return undefined;
      }
      return layers.find((layer) => layer.metadata?.semanticTag === tag);
    };

    let targetLayer:
      | {
          id: string;
          metadata?: CanvasLayerMetadata;
        }
      | undefined;

    if (action === 'florals') {
      targetLayer = findLayerByTag('floral');
    } else if (action === 'background') {
      targetLayer = findLayerByTag('background', true);
    } else {
      targetLayer = findLayerByTag('typography');
    }

    if (!targetLayer) {
      const message =
        action === 'florals'
          ? 'No floral layers detected on this canvas yet.'
          : action === 'background'
            ? 'No background layer found to swap.'
            : 'No editable headline text detected.';
      toast(message, 'info');
      return;
    }

    if (!targetLayer.id) {
      toast('Layer metadata missing; try reloading the project.', 'info');
      return;
    }

    selectLayer(targetLayer.id);
    setActiveTool('select');

    if (action === 'florals' && !aiPanelOpen) {
      toggleAIPanel();
    }
    if (action === 'typography') {
      setActiveTab('properties');
    }
  };

  const handleMaskToggle = (mode: 'keep' | 'remove') => {
    if (maskMode === mode) {
      setMaskMode(null);
      setActiveTool('select');
      return;
    }
    setMaskMode(mode);
  };

  const handleClearMasks = () => {
    clearMaskLayers();
    setMaskMode(null);
    setActiveTool('select');
  };

  // Update object property
  const updateObjectProperty = (property: keyof fabric.Object, value: any) => {
    if (!selectedObject || !canvas) return;
    selectedObject.set(property, value);
    selectedObject.setCoords();
    canvas.renderAll();
    const { saveHistory } = useCanvasStore.getState();
    saveHistory();
  };

  // Toggle object lock
  const toggleLock = () => {
    if (!selectedObject || !canvas) return;
    const isLocked = selectedObject.lockMovementX;
    selectedObject.set({
      lockMovementX: !isLocked,
      lockMovementY: !isLocked,
      lockRotation: !isLocked,
      lockScalingX: !isLocked,
      lockScalingY: !isLocked,
      selectable: isLocked, // If locked, make not selectable; if unlocked, make selectable
    });
    canvas.renderAll();
    const { saveHistory } = useCanvasStore.getState();
    saveHistory();
  };

  // Toggle object visibility
  const toggleVisibility = () => {
    if (!selectedObject || !canvas) return;
    selectedObject.set('visible', !selectedObject.visible);
    canvas.renderAll();
    const { saveHistory } = useCanvasStore.getState();
    saveHistory();
  };

  const alignCenterHorizontally = () => {
    if (!selectedObject || !canvas) return;
    const canvasWidth = canvas.getWidth() || 0;
    const objectWidth = (selectedObject.width || 0) * (selectedObject.scaleX || 1);
    selectedObject.set({
      left: (canvasWidth - objectWidth) / 2,
    });
    selectedObject.setCoords();
    canvas.renderAll();
  };

  const alignCenterVertically = () => {
    if (!selectedObject || !canvas) return;
    const canvasHeight = canvas.getHeight() || 0;
    const objectHeight = (selectedObject.height || 0) * (selectedObject.scaleY || 1);
    selectedObject.set({
      top: (canvasHeight - objectHeight) / 2,
    });
    selectedObject.setCoords();
    canvas.renderAll();
  };

  // Layer ordering functions
  const bringToFront = () => {
    if (!selectedObject || !canvas) return;
    console.log('[Layer] Bringing to front:', selectedObject.type);
    canvas.bringToFront(selectedObject);
    canvas.renderAll();
    const allObjects = canvas.getObjects();
    console.log('[Layer] New z-index:', allObjects.indexOf(selectedObject), 'of', allObjects.length);
  };

  const sendToBack = () => {
    if (!selectedObject || !canvas) return;
    console.log('[Layer] Sending to back:', selectedObject.type);
    canvas.sendToBack(selectedObject);
    canvas.renderAll();
    const allObjects = canvas.getObjects();
    console.log('[Layer] New z-index:', allObjects.indexOf(selectedObject), 'of', allObjects.length);
  };

  const bringForward = () => {
    if (!selectedObject || !canvas) return;
    console.log('[Layer] Bringing forward:', selectedObject.type);
    canvas.bringForward(selectedObject);
    canvas.renderAll();
    const allObjects = canvas.getObjects();
    console.log('[Layer] New z-index:', allObjects.indexOf(selectedObject), 'of', allObjects.length);
  };

  const sendBackward = () => {
    if (!selectedObject || !canvas) return;
    console.log('[Layer] Sending backward:', selectedObject.type);
    canvas.sendBackward(selectedObject);
    canvas.renderAll();
    const allObjects = canvas.getObjects();
    console.log('[Layer] New z-index:', allObjects.indexOf(selectedObject), 'of', allObjects.length);
  };

  // Show brush controls when draw tool is active
  if (activeTool === 'draw') {
    return (
      <div className={`border-l bg-white flex flex-col transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'}`}>
        <div className="p-4 border-b flex items-center justify-between">
          {!isCollapsed && <h2 className="text-lg font-semibold">Drawing Tools</h2>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 rounded"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <X className="w-5 h-5 rotate-180" /> : <X className="w-5 h-5" />}
          </button>
        </div>
        {!isCollapsed && (
          <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Brush Color</label>
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded border-2 border-gray-300 cursor-pointer"
                  style={{ backgroundColor: brushColor }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                />
                <input
                  type="text"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded text-sm"
                  placeholder="#000000"
                />
              </div>
              {showColorPicker && (
                <div className="mt-2 p-2 border rounded">
                  <HexColorPicker color={brushColor} onChange={setBrushColor} />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Brush Width: {brushWidth}px
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={brushWidth}
                onChange={(e) => setBrushWidth(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
        )}
      </div>
    );
  }

  return (
    <div className={`border-l bg-white flex flex-col transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'}`}>
      {/* Tabs and Collapse Button */}
      <div className="flex border-b">
        {!isCollapsed && (
          <>
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'properties'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Properties
            </button>
            <button
              onClick={() => setActiveTab('layers')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'layers'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Layers className="w-4 h-4 inline mr-2" />
              Layers
            </button>
          </>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="px-2 py-2 hover:bg-gray-100 text-gray-600"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="flex-1 overflow-auto p-4">
          {activeTab === 'properties' && (
          <div>
            {selectedObject ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">Object Properties</h3>
                    <div className="flex gap-1">
                      <button
                        onClick={toggleLock}
                        className={`p-1.5 rounded hover:bg-gray-100 ${
                          selectedObject.lockMovementX ? 'text-primary' : 'text-gray-600'
                        }`}
                        title={selectedObject.lockMovementX ? 'Unlock' : 'Lock'}
                      >
                        {selectedObject.lockMovementX ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <Unlock className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={toggleVisibility}
                        className={`p-1.5 rounded hover:bg-gray-100 ${
                          selectedObject.visible === false ? 'text-gray-400' : 'text-gray-600'
                        }`}
                        title={selectedObject.visible === false ? 'Show' : 'Hide'}
                      >
                        {selectedObject.visible === false ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {/* Position */}
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Position</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-gray-500">X</label>
                          <input
                            type="number"
                            value={Math.round(selectedObject.left || 0)}
                            onChange={(e) => updateObjectProperty('left', Number(e.target.value))}
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Y</label>
                          <input
                            type="number"
                            value={Math.round(selectedObject.top || 0)}
                            onChange={(e) => updateObjectProperty('top', Number(e.target.value))}
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                        </div>
                      </div>
                    </div>

                            {/* Size */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-xs text-gray-600">Size</label>
                                <button
                                  onClick={() => setAspectRatioLocked(!aspectRatioLocked)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                  title={aspectRatioLocked ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
                                >
                                  {aspectRatioLocked ? (
                                    <Link className="w-3.5 h-3.5 text-primary" />
                                  ) : (
                                    <Unlink className="w-3.5 h-3.5 text-gray-400" />
                                  )}
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-xs text-gray-500">W</label>
                                  <input
                                    type="number"
                                    value={Math.round((selectedObject.width || 0) * (selectedObject.scaleX || 1))}
                                    onChange={(e) => {
                                      const newWidth = Number(e.target.value);
                                      const scaleX = newWidth / (selectedObject.width || 1);
                                      
                                      if (aspectRatioLocked) {
                                        // Maintain aspect ratio
                                        updateObjectProperty('scaleX', scaleX);
                                        updateObjectProperty('scaleY', scaleX);
                                      } else {
                                        updateObjectProperty('scaleX', scaleX);
                                      }
                                    }}
                                    className="w-full px-2 py-1 border rounded text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500">H</label>
                                  <input
                                    type="number"
                                    value={Math.round((selectedObject.height || 0) * (selectedObject.scaleY || 1))}
                                    onChange={(e) => {
                                      const newHeight = Number(e.target.value);
                                      const scaleY = newHeight / (selectedObject.height || 1);
                                      
                                      if (aspectRatioLocked) {
                                        // Maintain aspect ratio
                                        updateObjectProperty('scaleX', scaleY);
                                        updateObjectProperty('scaleY', scaleY);
                                      } else {
                                        updateObjectProperty('scaleY', scaleY);
                                      }
                                    }}
                                    className="w-full px-2 py-1 border rounded text-sm"
                                  />
                                </div>
                              </div>
                            </div>

                    {/* Rotation */}
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">
                        Rotation: {Math.round(selectedObject.angle || 0)}°
                      </label>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={selectedObject.angle || 0}
                        onChange={(e) => updateObjectProperty('angle', Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>-180°</span>
                        <span>180°</span>
                      </div>
                    </div>

                    {/* Opacity */}
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">
                        Opacity: {Math.round((selectedObject.opacity || 1) * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={(selectedObject.opacity || 1) * 100}
                        onChange={(e) => updateObjectProperty('opacity', Number(e.target.value) / 100)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {selectedObject.type === 'i-text' || selectedObject.type === 'text' ? (
                  <div className="border-t pt-4 mt-4">
                    <TextEditor selectedText={selectedObject as fabric.IText | fabric.Text} />
                  </div>
                ) : selectedObject.type === 'image' ? (
                  <div className="border-t pt-4 mt-4">
                    <ImageEditor selectedImage={selectedObject as fabric.Image} />
                  </div>
                ) : (selectedObject.type === 'rect' || selectedObject.type === 'circle' || selectedObject.type === 'polygon' || selectedObject.type === 'path') ? (
                  <div className="border-t pt-4 mt-4">
                    <ShapeEditor selectedShape={selectedObject} />
                  </div>
                ) : null}

                {/* Layer Ordering */}
                <div className="border-t pt-4">
                  <label className="text-xs text-gray-600 mb-2 block">Align</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={alignCenterHorizontally}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-xs flex items-center justify-center gap-1"
                      title="Align Center Horizontally"
                    >
                      <AlignHorizontalJustifyCenter className="w-3.5 h-3.5" />
                      Center
                    </button>
                    <button
                      onClick={alignCenterVertically}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-xs flex items-center justify-center gap-1"
                      title="Align Middle Vertically"
                    >
                      <AlignVerticalJustifyCenter className="w-3.5 h-3.5" />
                      Middle
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <label className="text-xs text-gray-600 mb-2 block">Layer Order</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={bringToFront}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-xs flex items-center justify-center gap-1"
                      title="Bring to Front"
                    >
                      <ChevronsUp className="w-3.5 h-3.5" />
                      To Front
                    </button>
                    <button
                      onClick={sendToBack}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-xs flex items-center justify-center gap-1"
                      title="Send to Back"
                    >
                      <ChevronsDown className="w-3.5 h-3.5" />
                      To Back
                    </button>
                    <button
                      onClick={bringForward}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-xs flex items-center justify-center gap-1"
                      title="Bring Forward"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                      Forward
                    </button>
                    <button
                      onClick={sendBackward}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-xs flex items-center justify-center gap-1"
                      title="Send Backward"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                      Backward
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={duplicateSelected}
                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </button>
                  <button
                    onClick={deleteSelected}
                    className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded text-sm flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p className="text-sm">Select an object to edit properties</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">Canvas Layers</h3>
                <span className="text-xs text-gray-400">{layers.length} layers</span>
              </div>
              {layers.length === 0 ? (
                <p className="text-xs text-gray-500">
                  No layers yet. Add images or text to start building your composition.
                </p>
              ) : (
                <ul className="space-y-2">
                  {layers.map((layer) => {
                    const tag = layer.metadata?.semanticTag ?? 'user';
                    const label = semanticLabels[tag] ?? 'Layer';
                    const dotClass = semanticDotClasses[tag] ?? 'bg-gray-400';
                    return (
                      <li
                        key={layer.key}
                        onClick={() => handleLayerSelect(layer.id)}
                        className={`flex cursor-pointer items-center justify-between rounded border px-3 py-2 text-sm transition ${
                          layer.isActive
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${dotClass}`}
                            aria-hidden="true"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{layer.name}</p>
                            <p className="text-xs text-gray-500 capitalize">
                              {label}
                              {layer.metadata?.origin === 'parsed' ? ' · parsed' : ''}
                              {!layer.visible ? ' · hidden' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {layer.locked && (
                            <Lock className="h-3.5 w-3.5 text-gray-400" aria-label="Layer locked" />
                          )}
                          <button
                            onClick={(event) => handleVisibilityToggle(event, layer.id)}
                            disabled={!layer.id}
                            className={`rounded p-1.5 text-gray-600 hover:bg-gray-200 ${
                              !layer.id ? 'cursor-not-allowed opacity-50 hover:bg-transparent' : ''
                            }`}
                            title={layer.visible ? 'Hide layer' : 'Show layer'}
                          >
                            {layer.visible ? (
                              <Eye className="h-3.5 w-3.5" />
                            ) : (
                              <EyeOff className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <button
                            onClick={(event) => handleDuplicateLayer(event, layer.id)}
                            disabled={!layer.id}
                            className={`rounded p-1.5 text-gray-600 hover:bg-gray-200 ${
                              !layer.id ? 'cursor-not-allowed opacity-50 hover:bg-transparent' : ''
                            }`}
                            title="Duplicate layer"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(event) => handleDeleteLayer(event, layer.id)}
                            disabled={!layer.id}
                            className={`rounded p-1.5 text-red-500 hover:bg-red-100 ${
                              !layer.id ? 'cursor-not-allowed opacity-50 hover:bg-transparent' : ''
                            }`}
                            title="Delete layer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="border-t pt-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Quick Actions
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => handleQuickAction('florals')}
                  className="flex items-center justify-between rounded border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-medium text-primary transition hover:bg-primary/20"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    Replace florals
                  </span>
                </button>
                <button
                  onClick={() => handleQuickAction('background')}
                  className="flex items-center justify-between rounded border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  <span className="flex items-center gap-2">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Swap background
                  </span>
                </button>
                <button
                  onClick={() => handleQuickAction('typography')}
                  className="flex items-center justify-between rounded border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  <span className="flex items-center gap-2">
                    <Type className="h-3.5 w-3.5" />
                    Edit headline text
                  </span>
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Mask Editing
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => handleMaskToggle('keep')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded px-3 py-2 text-xs font-medium ${
                    maskMode === 'keep'
                      ? 'border border-emerald-200 bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <PenLine className="h-3.5 w-3.5" />
                  Keep area
                </button>
                <button
                  onClick={() => handleMaskToggle('remove')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded px-3 py-2 text-xs font-medium ${
                    maskMode === 'remove'
                      ? 'border border-rose-200 bg-rose-100 text-rose-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Eraser className="h-3.5 w-3.5" />
                  Remove area
                </button>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={handleClearMasks}
                  className="flex-1 rounded border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100"
                >
                  Clear masks
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Masks guide regeneration. Keep marks protected regions, remove flags areas for refresh.
              </p>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
}

