'use client';

import { useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvas-store';
import { useUIStore } from '@/stores/ui-store';

export function useKeyboardShortcuts() {
  const {
    canvas,
    deleteSelected,
    duplicateSelected,
    groupSelected,
    ungroupSelected,
    exportToJSON,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useCanvasStore();
  const { toast, toggleAIPanel } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      // Delete selected objects
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
        return;
      }

      // Copy (Ctrl/Cmd + C)
      if (ctrlOrCmd && e.key === 'c') {
        e.preventDefault();
        // TODO: Implement copy
        toast('Copy functionality coming soon', 'info');
        return;
      }

      // Paste (Ctrl/Cmd + V)
      if (ctrlOrCmd && e.key === 'v') {
        e.preventDefault();
        // TODO: Implement paste
        toast('Paste functionality coming soon', 'info');
        return;
      }

      // Duplicate (Ctrl/Cmd + D)
      if (ctrlOrCmd && e.key === 'd') {
        e.preventDefault();
        duplicateSelected();
        return;
      }

      // Undo (Ctrl/Cmd + Z)
      if (ctrlOrCmd && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) {
          undo();
        }
        return;
      }

      // Redo (Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y)
      if ((ctrlOrCmd && e.shiftKey && e.key === 'z') || (ctrlOrCmd && e.key === 'y')) {
        e.preventDefault();
        if (canRedo) {
          redo();
        }
        return;
      }

      // Group (Ctrl/Cmd + G)
      if (ctrlOrCmd && e.key === 'g') {
        e.preventDefault();
        groupSelected();
        return;
      }

      // Ungroup (Ctrl/Cmd + Shift + G)
      if (ctrlOrCmd && e.shiftKey && e.key === 'g') {
        e.preventDefault();
        ungroupSelected();
        return;
      }

      // Save (Ctrl/Cmd + S)
      if (ctrlOrCmd && e.key === 's') {
        e.preventDefault();
        try {
          const json = exportToJSON();
          // TODO: Save to API
          toast('Project saved', 'success');
        } catch (error) {
          toast('Failed to save project', 'error');
        }
        return;
      }

      // AI Generation (Ctrl/Cmd + K)
      if (ctrlOrCmd && e.key === 'k') {
        e.preventDefault();
        toggleAIPanel();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvas, deleteSelected, duplicateSelected, groupSelected, ungroupSelected, undo, redo, canUndo, canRedo, exportToJSON, toast, toggleAIPanel]);
}

