'use client';

import { useCanvasStore } from '@/stores/canvas-store';
import { useUIStore } from '@/stores/ui-store';
import { useTabStore } from '@/stores/tab-store';
import { ZoomIn, ZoomOut, Maximize, Grid, Ruler, Save, Sparkles, Undo2, Redo2, Magnet } from 'lucide-react';
import { AIGenerationPanel } from '@/components/ai/AIGenerationPanel';

export function CanvasToolbar() {
  const { zoom, setZoom, showGrid, toggleGrid, showRulers, toggleRulers, snapEnabled, toggleSnap, exportToJSON, undo, redo, canUndo, canRedo } = useCanvasStore();
  const { toast, toggleAIPanel } = useUIStore();
  const { getActiveTab } = useTabStore();

  const handleZoomIn = () => {
    setZoom(Math.min(zoom * 1.2, 10));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom / 1.2, 0.1));
  };

  const handleZoomFit = () => {
    setZoom(1);
    // Reset pan position
    const { setPan } = useCanvasStore.getState();
    setPan(0, 0);
  };

  const handleSave = async () => {
    try {
      const json = exportToJSON();
      const activeTab = getActiveTab();
      if (activeTab) {
        const { updateTab } = useTabStore.getState();
        updateTab(activeTab.id, { canvasData: json, isDirty: false });
      }
      toast('Project saved', 'success');
    } catch (error) {
      toast('Failed to save project', 'error');
    }
  };

  return (
    <>
      <div className="h-16 border-b bg-white px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold font-heading">Mardi Studio Pro</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Generation Button */}
          <button
            onClick={toggleAIPanel}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 flex items-center gap-2"
            title="AI Generation (Ctrl+K)"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden md:inline">Generate</span>
          </button>

          {/* Undo/Redo */}
          <div className="flex items-center gap-1 border-r pr-2 mr-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 border-r pr-2 mr-2">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-100 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-sm font-mono min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-100 rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomFit}
              className="p-2 hover:bg-gray-100 rounded ml-1"
              title="Fit to Screen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-1 border-r pr-2 mr-2">
            <button
              onClick={toggleGrid}
              className={`p-2 rounded ${showGrid ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              title="Toggle Grid"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={toggleRulers}
              className={`p-2 rounded ${showRulers ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              title="Toggle Rulers"
            >
              <Ruler className="w-4 h-4" />
            </button>
            <button
              onClick={toggleSnap}
              className={`p-2 rounded ${snapEnabled ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              title="Toggle Snapping (Alignment Guides)"
            >
              <Magnet className="w-4 h-4" />
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            <Save className="w-4 h-4 inline mr-2" />
            Save
          </button>
        </div>
      </div>
      <AIGenerationPanel />
    </>
  );
}

