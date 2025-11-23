'use client';

import { useEffect, useState } from 'react';
import { useCanvasStore } from '@/stores/canvas-store';
import { fabric } from 'fabric';
import { Keyboard, X } from 'lucide-react';

interface Shortcut {
  keys: string[];
  description: string;
  action: string;
}

const shortcuts: Shortcut[] = [
  { keys: ['⌘/Ctrl', 'C'], description: 'Copy selected object', action: 'copy' },
  { keys: ['⌘/Ctrl', 'V'], description: 'Paste object', action: 'paste' },
  { keys: ['⌘/Ctrl', 'D'], description: 'Duplicate selected', action: 'duplicate' },
  { keys: ['⌘/Ctrl', 'Z'], description: 'Undo', action: 'undo' },
  { keys: ['⌘/Ctrl', 'Shift', 'Z'], description: 'Redo', action: 'redo' },
  { keys: ['Delete/Backspace'], description: 'Delete selected', action: 'delete' },
  { keys: ['⌘/Ctrl', 'A'], description: 'Select all', action: 'selectAll' },
  { keys: ['Esc'], description: 'Deselect all', action: 'deselect' },
  { keys: ['⌘/Ctrl', ']'], description: 'Bring forward', action: 'forward' },
  { keys: ['⌘/Ctrl', '['], description: 'Send backward', action: 'backward' },
  { keys: ['⌘/Ctrl', 'Shift', ']'], description: 'Bring to front', action: 'toFront' },
  { keys: ['⌘/Ctrl', 'Shift', '['], description: 'Send to back', action: 'toBack' },
  { keys: ['Arrow Keys'], description: 'Move object by 1px', action: 'move' },
  { keys: ['Shift', 'Arrow'], description: 'Move object by 10px', action: 'moveShift' },
  { keys: ['⌘/Ctrl', 'S'], description: 'Save project', action: 'save' },
  { keys: ['⌘/Ctrl', 'E'], description: 'Export as image', action: 'export' },
  { keys: ['⌘/Ctrl', 'L'], description: 'Lock/Unlock object', action: 'lock' },
  { keys: ['⌘/Ctrl', 'H'], description: 'Hide/Show object', action: 'visibility' },
  { keys: ['T'], description: 'Text tool', action: 'text' },
  { keys: ['R'], description: 'Rectangle tool', action: 'rectangle' },
  { keys: ['C'], description: 'Circle tool', action: 'circle' },
  { keys: ['P'], description: 'Pen/Draw tool', action: 'pen' },
  { keys: ['V'], description: 'Select tool', action: 'select' },
  { keys: ['H'], description: 'Hand/Pan tool', action: 'hand' },
  { keys: ['Space'], description: 'Hold for hand tool', action: 'tempHand' },
  { keys: ['⌘/Ctrl', '+'], description: 'Zoom in', action: 'zoomIn' },
  { keys: ['⌘/Ctrl', '-'], description: 'Zoom out', action: 'zoomOut' },
  { keys: ['⌘/Ctrl', '0'], description: 'Reset zoom', action: 'zoomReset' },
  { keys: ['?'], description: 'Show keyboard shortcuts', action: 'help' },
];

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const { canvas, deleteSelected, duplicateSelected } = useCanvasStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const cmdOrCtrl = e.metaKey || e.ctrlKey;
      const shift = e.shiftKey;

      // Show keyboard shortcuts with ?
      if (e.key === '?' && !cmdOrCtrl && !shift) {
        e.preventDefault();
        setIsOpen(true);
        return;
      }

      if (!canvas) return;

      const activeObject = canvas.getActiveObject();

      // Delete/Backspace - Delete selected
      if ((e.key === 'Delete' || e.key === 'Backspace') && activeObject) {
        e.preventDefault();
        deleteSelected();
      }

      // Cmd/Ctrl + D - Duplicate
      if (cmdOrCtrl && e.key === 'd' && activeObject) {
        e.preventDefault();
        duplicateSelected();
      }

      // Cmd/Ctrl + Z - Undo
      if (cmdOrCtrl && e.key === 'z' && !shift) {
        e.preventDefault();
        // Undo functionality would go here
        console.log('Undo (not implemented yet)');
      }

      // Cmd/Ctrl + Shift + Z - Redo
      if (cmdOrCtrl && e.key === 'z' && shift) {
        e.preventDefault();
        // Redo functionality would go here
        console.log('Redo (not implemented yet)');
      }

      // Escape - Deselect
      if (e.key === 'Escape') {
        canvas.discardActiveObject();
        canvas.renderAll();
      }

      // Cmd/Ctrl + A - Select All
      if (cmdOrCtrl && e.key === 'a') {
        e.preventDefault();
        const selection = new (fabric as any).ActiveSelection(canvas.getObjects(), {
          canvas: canvas,
        });
        canvas.setActiveObject(selection);
        canvas.renderAll();
      }

      // Arrow keys - Move object
      if (activeObject && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const step = shift ? 10 : 1;
        const left = activeObject.left || 0;
        const top = activeObject.top || 0;

        switch (e.key) {
          case 'ArrowUp':
            activeObject.set('top', top - step);
            break;
          case 'ArrowDown':
            activeObject.set('top', top + step);
            break;
          case 'ArrowLeft':
            activeObject.set('left', left - step);
            break;
          case 'ArrowRight':
            activeObject.set('left', left + step);
            break;
        }
        activeObject.setCoords();
        canvas.renderAll();
      }

      // Cmd/Ctrl + ] - Bring forward
      if (cmdOrCtrl && e.key === ']' && !shift && activeObject) {
        e.preventDefault();
        canvas.bringForward(activeObject);
        canvas.renderAll();
      }

      // Cmd/Ctrl + [ - Send backward
      if (cmdOrCtrl && e.key === '[' && !shift && activeObject) {
        e.preventDefault();
        canvas.sendBackwards(activeObject);
        canvas.renderAll();
      }

      // Cmd/Ctrl + Shift + ] - Bring to front
      if (cmdOrCtrl && e.key === ']' && shift && activeObject) {
        e.preventDefault();
        canvas.bringToFront(activeObject);
        canvas.renderAll();
      }

      // Cmd/Ctrl + Shift + [ - Send to back
      if (cmdOrCtrl && e.key === '[' && shift && activeObject) {
        e.preventDefault();
        canvas.sendToBack(activeObject);
        canvas.renderAll();
      }

      // Cmd/Ctrl + L - Lock/Unlock
      if (cmdOrCtrl && e.key === 'l' && activeObject) {
        e.preventDefault();
        const isLocked = activeObject.lockMovementX;
        activeObject.set({
          lockMovementX: !isLocked,
          lockMovementY: !isLocked,
          lockRotation: !isLocked,
          lockScalingX: !isLocked,
          lockScalingY: !isLocked,
        });
        canvas.renderAll();
      }

      // Cmd/Ctrl + H - Hide/Show
      if (cmdOrCtrl && e.key === 'h' && activeObject) {
        e.preventDefault();
        activeObject.set('visible', !activeObject.visible);
        canvas.renderAll();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [canvas, deleteSelected, duplicateSelected]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-white border border-gray-300 rounded-full shadow-lg hover:shadow-xl transition-shadow z-40"
        title="Keyboard Shortcuts (Press ?)"
      >
        <Keyboard className="w-5 h-5 text-gray-700" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-100"
              >
                <span className="text-sm text-gray-700">{shortcut.description}</span>
                <div className="flex gap-1">
                  {shortcut.keys.map((key, keyIndex) => (
                    <kbd
                      key={keyIndex}
                      className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono text-gray-800 min-w-[2rem] text-center"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 text-center">
          <p className="text-xs text-gray-600">
            Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs font-mono">?</kbd> to
            toggle this dialog
          </p>
        </div>
      </div>
    </div>
  );
}

