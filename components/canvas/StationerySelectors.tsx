'use client';

import { STATIONERY_SIZES, STATIONERY_TEMPLATES, StationerySize, StationeryTemplate } from '@/types/stationery';
import { useCanvasStore } from '@/stores/canvas-store';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function StationerySizeSelector() {
  const { canvasWidth, canvasHeight, setCanvasSize } = useCanvasStore();
  const [isOpen, setIsOpen] = useState(false);

  const currentSize = STATIONERY_SIZES.find(
    (s) => s.width === canvasWidth && s.height === canvasHeight
  ) || STATIONERY_SIZES[0];

  const handleSizeChange = (size: StationerySize) => {
    setCanvasSize(size.width, size.height);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 border rounded text-sm flex items-center gap-2 hover:bg-gray-50"
        title="Select Stationery Size"
      >
        <span>{currentSize.name}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-20 min-w-[200px]">
            <div className="p-2 border-b">
              <span className="text-xs font-semibold text-gray-600">Stationery Sizes</span>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {STATIONERY_SIZES.map((size) => (
                <button
                  key={size.name}
                  onClick={() => handleSizeChange(size)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                    size.width === canvasWidth && size.height === canvasHeight
                      ? 'bg-primary/10 text-primary font-medium'
                      : ''
                  }`}
                >
                  <div className="font-medium">{size.name}</div>
                  <div className="text-xs text-gray-500">{size.description}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function StationeryTemplateSelector() {
  const { setCanvasSize } = useCanvasStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleTemplateSelect = (template: StationeryTemplate) => {
    setCanvasSize(template.size.width, template.size.height);
    // TODO: Load template design onto canvas
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 border rounded text-sm flex items-center gap-2 hover:bg-gray-50"
        title="Select Template"
      >
        <span>Templates</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-20 w-80">
            <div className="p-2 border-b">
              <span className="text-xs font-semibold text-gray-600">Stationery Templates</span>
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
              <div className="grid grid-cols-2 gap-2">
                {STATIONERY_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className="p-2 border rounded hover:border-primary hover:bg-primary/5 text-left"
                  >
                    <div className="w-full h-24 bg-gray-100 rounded mb-2 flex items-center justify-center text-xs text-gray-400">
                      {template.size.name}
                    </div>
                    <div className="text-xs font-medium">{template.name}</div>
                    <div className="text-xs text-gray-500">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

