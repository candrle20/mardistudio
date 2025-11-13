'use client';

import { useCanvasStore } from '@/stores/canvas-store';
import { useUIStore } from '@/stores/ui-store';
import { Type, Image as ImageIcon, Square, Crop, Hand, MousePointer, Pen } from 'lucide-react';

type Tool = 'select' | 'text' | 'image' | 'shape' | 'crop' | 'hand' | 'draw';

export function Toolbar() {
  const { activeTool, setActiveTool, canvas } = useCanvasStore();
  const { toast } = useUIStore();

  const handleTextTool = () => {
    setActiveTool('text');
    // Text will be created on canvas click
  };

  const handleImageTool = () => {
    setActiveTool('image');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        if (canvas) {
          // Image will be placed at click position
          // For now, keep existing behavior
          const { addImage } = useCanvasStore.getState();
          addImage(url, {
            x: canvas.width! / 2 - 200,
            y: canvas.height! / 2 - 200,
          });
        }
      }
      // Reset to select tool after image upload
      setActiveTool('select');
    };
    input.click();
  };

  return (
    <div className="w-16 border-r bg-white flex flex-col items-center py-4 gap-2">
      <button
        onClick={() => setActiveTool('select')}
        className={`p-3 rounded ${activeTool === 'select' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
        title="Select Tool"
      >
        <MousePointer className="w-5 h-5" />
      </button>

      <button
        onClick={handleTextTool}
        className={`p-3 rounded ${activeTool === 'text' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
        title="Text Tool (Click on canvas to add text)"
      >
        <Type className="w-5 h-5" />
      </button>

      <button
        onClick={() => setActiveTool('draw')}
        className={`p-3 rounded ${activeTool === 'draw' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
        title="Draw Tool (Freehand drawing)"
      >
        <Pen className="w-5 h-5" />
      </button>

      <button
        onClick={handleImageTool}
        className={`p-3 rounded ${activeTool === 'image' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
        title="Image Tool"
      >
        <ImageIcon className="w-5 h-5" />
      </button>

      <button
        onClick={() => setActiveTool('shape')}
        className={`p-3 rounded ${activeTool === 'shape' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
        title="Shape Tool"
      >
        <Square className="w-5 h-5" />
      </button>

      <button
        onClick={() => setActiveTool('crop')}
        className={`p-3 rounded ${activeTool === 'crop' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
        title="Crop Tool"
      >
        <Crop className="w-5 h-5" />
      </button>

      <button
        onClick={() => setActiveTool('hand')}
        className={`p-3 rounded ${activeTool === 'hand' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
        title="Hand Tool (Pan)"
      >
        <Hand className="w-5 h-5" />
      </button>
    </div>
  );
}

