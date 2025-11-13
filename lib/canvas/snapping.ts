import { fabric } from 'fabric';

export interface SnapLine {
  x?: number;
  y?: number;
  type: 'vertical' | 'horizontal';
}

export interface SnappingOptions {
  enabled: boolean;
  snapDistance: number;
  snapToObjects: boolean;
  snapToCanvas: boolean;
  snapToGrid: boolean;
  gridSize: number;
}

const defaultOptions: SnappingOptions = {
  enabled: true,
  snapDistance: 5,
  snapToObjects: true,
  snapToCanvas: true,
  snapToGrid: false,
  gridSize: 20,
};

export function initializeSnapping(
  canvas: fabric.Canvas,
  options: Partial<SnappingOptions> = {}
) {
  const opts = { ...defaultOptions, ...options };
  let snapLines: SnapLine[] = [];

  // Draw snap lines
  const drawSnapLines = () => {
    // Remove existing snap lines
    const existingLines = canvas.getObjects().filter((obj: any) => obj.isSnapLine);
    existingLines.forEach((line) => canvas.remove(line));

    // Draw new snap lines
    snapLines.forEach((line) => {
      const fabricLine = new fabric.Line(
        line.type === 'vertical'
          ? [line.x!, 0, line.x!, canvas.height!]
          : [0, line.y!, canvas.width!, line.y!],
        {
          stroke: '#FF0066',
          strokeWidth: 1,
          strokeDashArray: [5, 5],
          selectable: false,
          evented: false,
          excludeFromExport: true,
        } as any
      );
      (fabricLine as any).isSnapLine = true;
      canvas.add(fabricLine);
    });
    canvas.renderAll();
  };

  // Clear snap lines
  const clearSnapLines = () => {
    snapLines = [];
    const existingLines = canvas.getObjects().filter((obj: any) => obj.isSnapLine);
    existingLines.forEach((line) => canvas.remove(line));
    canvas.renderAll();
  };

  // Get snap targets
  const getSnapTargets = (activeObject: fabric.Object) => {
    const targets: { x: number[]; y: number[] } = { x: [], y: [] };

    // Canvas edges
    if (opts.snapToCanvas) {
      targets.x.push(0, canvas.width! / 2, canvas.width!);
      targets.y.push(0, canvas.height! / 2, canvas.height!);
    }

    // Grid
    if (opts.snapToGrid) {
      for (let x = 0; x <= canvas.width!; x += opts.gridSize) {
        targets.x.push(x);
      }
      for (let y = 0; y <= canvas.height!; y += opts.gridSize) {
        targets.y.push(y);
      }
    }

    // Other objects
    if (opts.snapToObjects) {
      canvas.getObjects().forEach((obj) => {
        if (obj === activeObject || !obj.visible || (obj as any).isSnapLine) return;

        const objBounds = obj.getBoundingRect();
        // Left, center, right
        targets.x.push(objBounds.left, objBounds.left + objBounds.width / 2, objBounds.left + objBounds.width);
        // Top, center, bottom
        targets.y.push(objBounds.top, objBounds.top + objBounds.height / 2, objBounds.top + objBounds.height);
      });
    }

    return targets;
  };

  // Snap object to targets
  const snapObject = (obj: fabric.Object) => {
    if (!opts.enabled) return;

    const objBounds = obj.getBoundingRect();
    const targets = getSnapTargets(obj);
    const newSnapLines: SnapLine[] = [];

    // Object points to check
    const objPoints = {
      left: objBounds.left,
      centerX: objBounds.left + objBounds.width / 2,
      right: objBounds.left + objBounds.width,
      top: objBounds.top,
      centerY: objBounds.top + objBounds.height / 2,
      bottom: objBounds.top + objBounds.height,
    };

    let snappedX: number | null = null;
    let snappedY: number | null = null;
    let minDistanceX = opts.snapDistance;
    let minDistanceY = opts.snapDistance;
    let snapLineX: number | undefined;
    let snapLineY: number | undefined;

    // Check horizontal snapping (X)
    ['left', 'centerX', 'right'].forEach((point) => {
      const objX = objPoints[point as keyof typeof objPoints];
      targets.x.forEach((targetX) => {
        const distance = Math.abs(objX - targetX);
        if (distance < minDistanceX) {
          minDistanceX = distance;
          const offset = targetX - objX;
          snappedX = (obj.left || 0) + offset;
          snapLineX = targetX;
        }
      });
    });

    // Check vertical snapping (Y)
    ['top', 'centerY', 'bottom'].forEach((point) => {
      const objY = objPoints[point as keyof typeof objPoints];
      targets.y.forEach((targetY) => {
        const distance = Math.abs(objY - targetY);
        if (distance < minDistanceY) {
          minDistanceY = distance;
          const offset = targetY - objY;
          snappedY = (obj.top || 0) + offset;
          snapLineY = targetY;
        }
      });
    });

    // Apply snapping
    if (snappedX !== null) {
      obj.set('left', snappedX);
      if (snapLineX !== undefined) {
        newSnapLines.push({ x: snapLineX, type: 'vertical' });
      }
    }

    if (snappedY !== null) {
      obj.set('top', snappedY);
      if (snapLineY !== undefined) {
        newSnapLines.push({ y: snapLineY, type: 'horizontal' });
      }
    }

    obj.setCoords();
    snapLines = newSnapLines;
    drawSnapLines();
  };

  // Event handlers
  canvas.on('object:moving', (e) => {
    if (e.target) {
      snapObject(e.target);
    }
  });

  canvas.on('object:modified', () => {
    clearSnapLines();
  });

  canvas.on('selection:cleared', () => {
    clearSnapLines();
  });

  // Return cleanup function
  return {
    destroy: () => {
      canvas.off('object:moving');
      canvas.off('object:modified');
      canvas.off('selection:cleared');
      clearSnapLines();
    },
    setOptions: (newOptions: Partial<SnappingOptions>) => {
      Object.assign(opts, newOptions);
    },
    getOptions: () => ({ ...opts }),
  };
}

