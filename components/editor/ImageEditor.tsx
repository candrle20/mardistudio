'use client';

import { useEffect, useState } from 'react';
import { useCanvasStore } from '@/stores/canvas-store';
import { fabric } from 'fabric';
import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Crop, Image as ImageIcon, Filter } from 'lucide-react';

interface ImageEditorProps {
  selectedImage?: fabric.Image;
}

export function ImageEditor({ selectedImage }: ImageEditorProps) {
  const { canvas } = useCanvasStore();
  const [opacity, setOpacity] = useState(100);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);

  useEffect(() => {
    if (selectedImage) {
      setOpacity((selectedImage.opacity || 1) * 100);
      // Reset filters when image changes
      setBrightness(0);
      setContrast(0);
      setSaturation(0);
    }
  }, [selectedImage]);

  const updateImageProperty = (property: string, value: any) => {
    if (!selectedImage || !canvas) return;
    selectedImage.set(property as keyof fabric.Image, value);
    canvas.renderAll();
  };

  const applyFilter = (filterName: string, value: number) => {
    if (!selectedImage || !canvas) return;
    
    // Remove existing filters
    selectedImage.filters = selectedImage.filters?.filter(
      (f: any) => !f.type?.includes(filterName)
    ) || [];

    // Add new filter
    if (value !== 0) {
      if (filterName === 'brightness') {
        selectedImage.filters.push(new fabric.Image.filters.Brightness({ brightness: value / 100 }));
      } else if (filterName === 'contrast') {
        selectedImage.filters.push(new fabric.Image.filters.Contrast({ contrast: value / 100 }));
      } else if (filterName === 'saturation') {
        selectedImage.filters.push(new fabric.Image.filters.Saturation({ saturation: value / 100 }));
      }
    }

    selectedImage.applyFilters();
    canvas.renderAll();
  };

  const rotateImage = (degrees: number) => {
    if (!selectedImage || !canvas) return;
    const currentAngle = selectedImage.angle || 0;
    selectedImage.set('angle', currentAngle + degrees);
    canvas.renderAll();
  };

  const flipImage = (direction: 'horizontal' | 'vertical') => {
    if (!selectedImage || !canvas) return;
    if (direction === 'horizontal') {
      selectedImage.set('flipX', !selectedImage.flipX);
    } else {
      selectedImage.set('flipY', !selectedImage.flipY);
    }
    canvas.renderAll();
  };

  if (!selectedImage) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        Select an image to edit properties
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold mb-3">Image Properties</h3>

      {/* Transform Controls */}
      <div>
        <label className="text-xs text-gray-600 mb-2 block">Transform</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => rotateImage(-90)}
            className="px-3 py-2 border rounded text-sm hover:bg-gray-100 flex items-center justify-center gap-2"
            title="Rotate Left"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Rotate Left</span>
          </button>
          <button
            onClick={() => rotateImage(90)}
            className="px-3 py-2 border rounded text-sm hover:bg-gray-100 flex items-center justify-center gap-2"
            title="Rotate Right"
          >
            <RotateCw className="w-4 h-4" />
            <span>Rotate Right</span>
          </button>
          <button
            onClick={() => flipImage('horizontal')}
            className="px-3 py-2 border rounded text-sm hover:bg-gray-100 flex items-center justify-center gap-2"
            title="Flip Horizontal"
          >
            <FlipHorizontal className="w-4 h-4" />
            <span>Flip H</span>
          </button>
          <button
            onClick={() => flipImage('vertical')}
            className="px-3 py-2 border rounded text-sm hover:bg-gray-100 flex items-center justify-center gap-2"
            title="Flip Vertical"
          >
            <FlipVertical className="w-4 h-4" />
            <span>Flip V</span>
          </button>
        </div>
      </div>

      {/* Opacity */}
      <div>
        <label className="text-xs text-gray-600 mb-1 block">
          Opacity: {opacity}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={opacity}
          onChange={(e) => {
            const val = Number(e.target.value);
            setOpacity(val);
            updateImageProperty('opacity', val / 100);
          }}
          className="w-full"
        />
      </div>

      {/* Filters */}
      <div>
        <label className="text-xs text-gray-600 mb-2 block flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </label>
        
        <div className="space-y-3">
          {/* Brightness */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">
              Brightness: {brightness > 0 ? '+' : ''}{brightness}%
            </label>
            <input
              type="range"
              min="-100"
              max="100"
              value={brightness}
              onChange={(e) => {
                const val = Number(e.target.value);
                setBrightness(val);
                applyFilter('brightness', val);
              }}
              className="w-full"
            />
          </div>

          {/* Contrast */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">
              Contrast: {contrast > 0 ? '+' : ''}{contrast}%
            </label>
            <input
              type="range"
              min="-100"
              max="100"
              value={contrast}
              onChange={(e) => {
                const val = Number(e.target.value);
                setContrast(val);
                applyFilter('contrast', val);
              }}
              className="w-full"
            />
          </div>

          {/* Saturation */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">
              Saturation: {saturation > 0 ? '+' : ''}{saturation}%
            </label>
            <input
              type="range"
              min="-100"
              max="100"
              value={saturation}
              onChange={(e) => {
                const val = Number(e.target.value);
                setSaturation(val);
                applyFilter('saturation', val);
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Reset Filters */}
      <button
        onClick={() => {
          setBrightness(0);
          setContrast(0);
          setSaturation(0);
          if (selectedImage && canvas) {
            selectedImage.filters = [];
            selectedImage.applyFilters();
            canvas.renderAll();
          }
        }}
        className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
      >
        Reset Filters
      </button>
    </div>
  );
}

