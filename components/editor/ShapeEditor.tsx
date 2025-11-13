'use client';

import { useEffect, useState } from 'react';
import { useCanvasStore } from '@/stores/canvas-store';
import { fabric } from 'fabric';
import { HexColorPicker } from 'react-colorful';

interface ShapeEditorProps {
  selectedShape?: fabric.Object;
}

export function ShapeEditor({ selectedShape }: ShapeEditorProps) {
  const { canvas } = useCanvasStore();
  const [fillColor, setFillColor] = useState('#000000');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [cornerRadius, setCornerRadius] = useState(0);
  const [showFillPicker, setShowFillPicker] = useState(false);
  const [showStrokePicker, setShowStrokePicker] = useState(false);

  // Update state when selected shape changes
  useEffect(() => {
    if (selectedShape) {
      setFillColor((selectedShape.fill as string) || '#000000');
      setStrokeColor((selectedShape.stroke as string) || '#000000');
      setStrokeWidth(selectedShape.strokeWidth || 1);
      
      // Check if shape is a rect and has rx property
      if (selectedShape.type === 'rect') {
        const rect = selectedShape as fabric.Rect;
        setCornerRadius(rect.rx || 0);
      }
    }
  }, [selectedShape]);

  const updateShapeProperty = (property: string, value: any) => {
    if (!selectedShape || !canvas) return;
    selectedShape.set(property as keyof fabric.Object, value);
    canvas.renderAll();
  };

  const handleFillColorChange = (color: string) => {
    setFillColor(color);
    updateShapeProperty('fill', color);
  };

  const handleStrokeColorChange = (color: string) => {
    setStrokeColor(color);
    updateShapeProperty('stroke', color);
  };

  const handleStrokeWidthChange = (width: number) => {
    setStrokeWidth(width);
    updateShapeProperty('strokeWidth', width);
  };

  const handleCornerRadiusChange = (radius: number) => {
    setCornerRadius(radius);
    if (selectedShape && selectedShape.type === 'rect') {
      updateShapeProperty('rx', radius);
      updateShapeProperty('ry', radius);
    }
  };

  if (!selectedShape) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        Select a shape to edit properties
      </div>
    );
  }

  const isRect = selectedShape.type === 'rect';

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold mb-3">Shape Properties</h3>

      {/* Fill Color */}
      <div>
        <label className="text-xs text-gray-600 mb-2 block">Fill Color</label>
        <div className="relative">
          <button
            onClick={() => setShowFillPicker(!showFillPicker)}
            className="w-full px-3 py-2 border rounded text-sm flex items-center gap-2 hover:bg-gray-50"
          >
            <div
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundColor: fillColor }}
            />
            <span className="text-xs font-mono">{fillColor}</span>
          </button>
          {showFillPicker && (
            <div className="absolute z-50 mt-2 p-3 bg-white border rounded shadow-lg">
              <HexColorPicker color={fillColor} onChange={handleFillColorChange} />
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={fillColor}
                  onChange={(e) => handleFillColorChange(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded text-xs font-mono"
                  placeholder="#000000"
                />
                <button
                  onClick={() => setShowFillPicker(false)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stroke Color */}
      <div>
        <label className="text-xs text-gray-600 mb-2 block">Stroke Color</label>
        <div className="relative">
          <button
            onClick={() => setShowStrokePicker(!showStrokePicker)}
            className="w-full px-3 py-2 border rounded text-sm flex items-center gap-2 hover:bg-gray-50"
          >
            <div
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundColor: strokeColor }}
            />
            <span className="text-xs font-mono">{strokeColor}</span>
          </button>
          {showStrokePicker && (
            <div className="absolute z-50 mt-2 p-3 bg-white border rounded shadow-lg">
              <HexColorPicker color={strokeColor} onChange={handleStrokeColorChange} />
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={strokeColor}
                  onChange={(e) => handleStrokeColorChange(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded text-xs font-mono"
                  placeholder="#000000"
                />
                <button
                  onClick={() => setShowStrokePicker(false)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stroke Width */}
      <div>
        <label className="text-xs text-gray-600 mb-1 block">
          Stroke Width: {strokeWidth}px
        </label>
        <input
          type="range"
          min="0"
          max="20"
          value={strokeWidth}
          onChange={(e) => handleStrokeWidthChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0px</span>
          <span>20px</span>
        </div>
      </div>

      {/* Corner Radius (for rectangles only) */}
      {isRect && (
        <div>
          <label className="text-xs text-gray-600 mb-1 block">
            Corner Radius: {cornerRadius}px
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={cornerRadius}
            onChange={(e) => handleCornerRadiusChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0px</span>
            <span>50px</span>
          </div>
        </div>
      )}
    </div>
  );
}

