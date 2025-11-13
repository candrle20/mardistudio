# 🚀 Quick Start Guide — Frontend Development

**Get the design studio running in 30 minutes**

---

## Step 1: Initialize Project (5 min)

```bash
# Create Next.js project
npx create-next-app@latest mardi-studio-pro --typescript --tailwind --app --use-pnpm

cd mardi-studio-pro

# Install core dependencies
pnpm add fabric zustand @tanstack/react-query react-hook-form
pnpm add react-colorful react-dropzone lucide-react
pnpm add -D @types/fabric
```

---

## Step 2: Set Up Project Structure (5 min)

Create the following folders:

```bash
mkdir -p app/studio/\[projectId\]
mkdir -p components/{canvas,editor,ai,ui}
mkdir -p lib/{fabric,api,hooks}
mkdir -p stores
mkdir -p types
```

---

## Step 3: Install shadcn/ui (5 min)

```bash
npx shadcn-ui@latest init
# Select: TypeScript, Tailwind, Default style, App directory

# Install essential components
npx shadcn-ui@latest add button input select slider dialog toast
```

---

## Step 4: Create Basic Canvas (10 min)

**`components/canvas/CanvasEditor.tsx`**

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

export function CanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 1500,  // 5" @ 300 DPI
      height: 2100, // 7" @ 300 DPI
      backgroundColor: '#ffffff',
    });

    fabricCanvasRef.current = canvas;

    // Add sample text
    const text = new fabric.IText('Hello, Mardi Studio!', {
      left: 100,
      top: 100,
      fontSize: 48,
      fontFamily: 'Inter',
      fill: '#1A4D4D',
    });
    canvas.add(text);

    return () => {
      canvas.dispose();
    };
  }, []);

  return (
    <div className="flex-1 relative">
      <canvas ref={canvasRef} className="border border-gray-200" />
    </div>
  );
}
```

**`app/studio/[projectId]/page.tsx`**

```typescript
import { CanvasEditor } from '@/components/canvas/CanvasEditor';

export default function StudioPage({ params }: { params: { projectId: string } }) {
  return (
    <div className="h-screen flex flex-col">
      <header className="h-14 border-b bg-white px-4 flex items-center">
        <h1 className="text-xl font-semibold">Mardi Studio Pro</h1>
      </header>
      <div className="flex-1 overflow-hidden">
        <CanvasEditor />
      </div>
    </div>
  );
}
```

---

## Step 5: Create Canvas Store (5 min)

**`stores/canvas-store.ts`**

```typescript
import { create } from 'zustand';
import { fabric } from 'fabric';

interface CanvasStore {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),
  zoom: 1,
  setZoom: (zoom) => set({ zoom }),
}));
```

---

## Step 6: Test It (5 min)

```bash
# Start dev server
pnpm dev

# Visit http://localhost:3000/studio/test-project
# You should see a canvas with "Hello, Mardi Studio!" text
```

---

## Next Steps

1. **Add Text Tool** → See Phase 2 in `FRONTEND_IMPLEMENTATION_PLAN.md`
2. **Add Image Upload** → See Phase 3
3. **Integrate AI Generation** → See Phase 4

---

## Troubleshooting

**Fabric.js not found?**
```bash
pnpm add fabric
pnpm add -D @types/fabric
```

**Canvas not rendering?**
- Check browser console for errors
- Ensure canvas element has explicit width/height
- Verify Fabric.js is imported correctly

**TypeScript errors?**
- Run `pnpm tsc --noEmit` to check types
- Install missing type definitions

---

**Ready to build!** 🎨

