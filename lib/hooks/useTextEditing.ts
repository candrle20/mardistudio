'use client';

import { useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvas-store';
import { fabric } from 'fabric';

// Add type for the global flag
declare global {
  interface Window {
    fabricTextPatched?: boolean;
  }
}

export function useTextEditing() {
  const { canvas } = useCanvasStore();

  useEffect(() => {
    if (!canvas || typeof window === 'undefined' || typeof document === 'undefined') return;

    // Patch Fabric's text editing to prevent scrolling
    if (!window.fabricTextPatched) {
      const originalInitHiddenTextarea = fabric.IText.prototype.initHiddenTextarea;
      
      fabric.IText.prototype.initHiddenTextarea = function() {
        // Call original implementation
        // @ts-ignore - accessing private/internal method if needed, but mostly public on prototype
        const result = originalInitHiddenTextarea.call(this);
        
        // Apply strict positioning immediately after creation
        if (this.hiddenTextarea) {
          this.hiddenTextarea.setAttribute('data-fabric-hiddentextarea', 'true');
          this.hiddenTextarea.setAttribute('autocomplete', 'off');
          this.hiddenTextarea.setAttribute('autocorrect', 'off');
          this.hiddenTextarea.setAttribute('autocapitalize', 'off');
          
          // Force inline styles to ensure it's fixed/hidden before interaction
          this.hiddenTextarea.style.position = 'fixed';
          this.hiddenTextarea.style.top = '50%';
          this.hiddenTextarea.style.left = '50%';
          this.hiddenTextarea.style.transform = 'translate(-50%, -50%)';
          this.hiddenTextarea.style.opacity = '0';
          this.hiddenTextarea.style.pointerEvents = 'none';
          this.hiddenTextarea.style.zIndex = '-999';
          this.hiddenTextarea.style.height = '1px';
          this.hiddenTextarea.style.width = '1px';
          this.hiddenTextarea.style.overflow = 'hidden';
          
          // Override focus method to always use preventScroll
          const originalFocus = this.hiddenTextarea.focus;
          this.hiddenTextarea.focus = function(options?: FocusOptions) {
            originalFocus.call(this, { ...options, preventScroll: true });
          };
        }
        
        return result;
      };
      
      window.fabricTextPatched = true;
    }

    const handleDoubleClick = (e: fabric.IEvent) => {
      const obj = e.target;
      if (obj && (obj.type === 'i-text' || obj.type === 'text')) {
        if (obj.type === 'i-text') {
          (obj as fabric.IText).enterEditing();
        } else {
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
            // @ts-ignore - textDecoration missing in v5 types
            textDecoration: (text as any).textDecoration,
          });

          canvas.remove(text);
          canvas.add(iText);
          canvas.setActiveObject(iText);
          iText.enterEditing();
          canvas.renderAll();
        }
      }
    };

    // We still keep this as a backup, but the patch above is the primary fix
    const handleEditingEntered = () => {
      const hiddenTextarea = document.querySelector<HTMLTextAreaElement>('textarea[data-fabric-hiddentextarea="true"]');
      if (hiddenTextarea) {
        hiddenTextarea.focus({ preventScroll: true });
      }
    };

    const handleEditingExited = () => {
      // No cleanup needed
    };

    canvas.on('mouse:dblclick', handleDoubleClick);
    canvas.on('text:editing:entered', handleEditingEntered);
    canvas.on('text:editing:exited', handleEditingExited);

    return () => {
      canvas.off('mouse:dblclick', handleDoubleClick);
      canvas.off('text:editing:entered', handleEditingEntered);
      canvas.off('text:editing:exited', handleEditingExited);
    };
  }, [canvas]);
}
