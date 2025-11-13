# Mardi Studio Pro — Frontend Setup

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000
```

### Project Structure

```
app/
  ├── layout.tsx          # Root layout
  ├── page.tsx            # Homepage
  ├── globals.css         # Global styles
  └── studio/
      └── [projectId]/
          └── page.tsx    # Studio page

components/
  └── canvas/
      ├── CanvasEditor.tsx    # Main canvas component
      ├── CanvasToolbar.tsx   # Top toolbar
      ├── Toolbar.tsx         # Left tool panel
      └── CanvasSidebar.tsx   # Right properties panel

stores/
  ├── canvas-store.ts     # Canvas state (Fabric.js)
  ├── project-store.ts    # Project state
  ├── ai-store.ts        # AI generation state
  └── ui-store.ts        # UI state (modals, sidebar)

types/
  └── index.ts           # TypeScript type definitions
```

## Features Implemented

✅ **Phase 1: Foundation**
- Next.js 14 setup with TypeScript
- Fabric.js canvas integration
- Basic zoom/pan controls
- Toolbar with select, text, image tools
- Properties sidebar
- Zustand state management

## Next Steps

### Phase 2: Text Editing (Next)
- Rich text editor component
- Font selector with Google Fonts
- Text properties (size, color, alignment)
- Inline text editing (double-click)

### Phase 3: Image Editing
- Image upload (drag-drop)
- Resize, rotate, crop
- Image filters
- Background removal

### Phase 4: AI Generation
- Prompt input component
- Style selector
- Generation status/progress
- Add generated images to canvas

## Development Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Type check without building
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Canvas:** Fabric.js 5.3.0
- **State:** Zustand
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

## Notes

- Canvas is set to 1500×2100px (5"×7" @ 300 DPI)
- All components are client-side ('use client')
- API routes are placeholders (implement backend later)
- Auto-save functionality is ready but needs API integration

