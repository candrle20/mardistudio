'use client';

import { useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvas-store';
import { fabric } from 'fabric';

export function useTextEditing() {
  const { canvas } = useCanvasStore();

  useEffect(() => {
    if (!canvas) return;

    // Enable inline editing for IText objects
    const handleDoubleClick = (e: fabric.IEvent) => {
      const obj = e.target;
      if (obj && (obj.type === 'i-text' || obj.type === 'text')) {
        // Enter editing mode
        if (obj.type === 'i-text') {
          (obj as fabric.IText).enterEditing();
        } else {
          // Convert Text to IText for editing
          const text = obj as fabric.Text;
          const iText = new fabric.IText(text.text || '', {
            left: text.left,
            top: text.top,
            fontSize: text.fontSize,
            fontFamily: text.fontFamily,
            fill: text.fill,
            textAlign: text.textAlign,
            lineHeight: text.lineHeight,
            charSpacing: text.charSpacing,
            fontWeight: text.fontWeight,
            fontStyle: text.fontStyle,
            textDecoration: text.textDecoration,
          });
          
          canvas.remove(text);
          canvas.add(iText);
          canvas.setActiveObject(iText);
          iText.enterEditing();
          canvas.renderAll();
        }
      }
    };

    canvas.on('mouse:dblclick', handleDoubleClick);

    return () => {
      canvas.off('mouse:dblclick', handleDoubleClick);
    };
  }, [canvas]);
}

