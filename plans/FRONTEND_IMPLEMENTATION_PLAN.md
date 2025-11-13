# 🎨 Mardi Studio Pro — Frontend Implementation Plan

**Design Studio & Art Composing Platform**  
**Version:** 1.0  
**Date:** November 4, 2025  
**Status:** Ready for Development

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Core Features & Components](#4-core-features--components)
5. [Component Architecture](#5-component-architecture)
6. [State Management](#6-state-management)
7. [API Integration](#7-api-integration)
8. [Development Phases](#8-development-phases)
9. [Technical Specifications](#9-technical-specifications)
10. [Design System](#10-design-system)
11. [Performance Requirements](#11-performance-requirements)
12. [Testing Strategy](#12-testing-strategy)

---

## 1. Project Overview

### 1.1 Purpose
Build a professional-grade, browser-based design editor for creating wedding stationery suites. The platform enables users to:
- Generate AI-powered designs from text prompts
- Edit text, images, and layouts in real-time
- Export print-ready PDF/X-1a files
- Collaborate with team members and clients

### 1.2 Key Requirements
- **Canvas Editor:** High-resolution (300 DPI) canvas with zoom, pan, layers
- **Text Editing:** Rich text with fonts, sizes, colors, alignment, kerning
- **Image Editing:** Upload, resize, crop, filters, background removal
- **AI Generation:** Text-to-image with style selection, prompt refinement
- **Layout Tools:** Grid, guides, snap-to-grid, alignment helpers
- **Print Specifications:** Bleed zones, safe areas, trim marks, CMYK preview
- **Real-time Collaboration:** Multi-user editing (future phase)

### 1.3 Target Users
- **Brides/Couples:** Non-designers needing intuitive tools
- **Wedding Planners:** Power users needing efficiency
- **Artists:** Creatives reviewing AI-generated designs

---

## 2. Technology Stack

### 2.1 Core Framework
```json
{
  "framework": "Next.js 14",
  "language": "TypeScript",
  "react": "^18.2.0",
  "next": "^14.0.0"
}
```

**Rationale:**
- Server-side rendering for SEO (marketplace pages)
- API routes for backend integration
- Excellent developer experience
- Built-in optimization (image, font, code splitting)

### 2.2 Canvas & Graphics
```json
{
  "canvas": "Fabric.js 5.3.0",
  "rasterization": "html2canvas",
  "pdf": "jsPDF + pdf-lib",
  "image-processing": "fabricjs-image-filters"
}
```

**Fabric.js Selection:**
- ✅ Print-quality rendering (300 DPI support)
- ✅ Rich object model (text, images, shapes, groups)
- ✅ Event system (selection, transformation, editing)
- ✅ Serialization (JSON export/import)
- ✅ Extensible (custom objects, filters)
- ✅ Active community & documentation

**Alternatives Considered:**
- **Konva.js:** Good performance, but less mature for print workflows
- **Paper.js:** Vector-focused, overkill for our use case
- **Custom WebGL:** Too complex, longer development time

### 2.3 State Management
```json
{
  "global-state": "Zustand",
  "server-state": "React Query (TanStack Query)",
  "form-state": "React Hook Form",
  "url-state": "Next.js router + query params"
}
```

**Rationale:**
- **Zustand:** Lightweight, TypeScript-first, no boilerplate
- **React Query:** Automatic caching, refetching, optimistic updates
- **React Hook Form:** Performance (uncontrolled inputs), validation

### 2.4 UI Components & Styling
```json
{
  "component-library": "shadcn/ui",
  "styling": "Tailwind CSS",
  "icons": "Lucide React",
  "animations": "Framer Motion"
}
```

**shadcn/ui Benefits:**
- Copy-paste components (not npm dependency)
- Fully customizable (Tailwind-based)
- Accessible (Radix UI primitives)
- TypeScript-first

### 2.5 Additional Libraries
```json
{
  "auth": "Clerk",
  "file-upload": "react-dropzone",
  "color-picker": "react-colorful",
  "font-loader": "Web Font Loader",
  "undo-redo": "use-undo",
  "drag-drop": "@dnd-kit/core",
  "monitoring": "Sentry",
  "analytics": "Mixpanel"
}
```

### 2.6 Development Tools
```json
{
  "package-manager": "pnpm",
  "linting": "ESLint + Prettier",
  "type-checking": "TypeScript strict mode",
  "testing": "Vitest + React Testing Library",
  "e2e": "Playwright",
  "bundler": "Turbopack (Next.js default)"
}
```

---

## 3. Project Structure

```
mardi-studio-pro/
├── apps/
│   └── web/                          # Next.js app
│       ├── app/                       # App Router (Next.js 14)
│       │   ├── (auth)/               # Auth routes (login, signup)
│       │   │   ├── login/
│       │   │   └── signup/
│       │   ├── (dashboard)/          # Protected routes
│       │   │   ├── studio/           # Design Studio
│       │   │   │   ├── [projectId]/
│       │   │   │   │   ├── page.tsx  # Studio layout
│       │   │   │   │   └── layout.tsx
│       │   │   ├── marketplace/      # Browse styles
│       │   │   ├── projects/         # Project list
│       │   │   └── layout.tsx        # Dashboard layout
│       │   ├── api/                  # API routes
│       │   │   ├── generate/
│       │   │   ├── projects/
│       │   │   └── export/
│       │   └── layout.tsx            # Root layout
│       ├── components/               # Shared components
│       │   ├── ui/                   # shadcn/ui components
│       │   ├── canvas/               # Canvas-specific
│       │   │   ├── CanvasEditor.tsx
│       │   │   ├── CanvasToolbar.tsx
│       │   │   ├── CanvasSidebar.tsx
│       │   │   └── CanvasRuler.tsx
│       │   ├── editor/               # Editor tools
│       │   │   ├── TextEditor.tsx
│       │   │   ├── ImageEditor.tsx
│       │   │   ├── ColorPicker.tsx
│       │   │   └── FontSelector.tsx
│       │   ├── ai/                   # AI generation
│       │   │   ├── PromptInput.tsx
│       │   │   ├── StyleSelector.tsx
│       │   │   ├── GenerationStatus.tsx
│       │   │   └── PromptSuggestions.tsx
│       │   └── layout/               # Layout components
│       ├── lib/                      # Utilities
│       │   ├── fabric/               # Fabric.js helpers
│       │   │   ├── canvas-setup.ts
│       │   │   ├── text-handler.ts
│       │   │   ├── image-handler.ts
│       │   │   └── export-handler.ts
│       │   ├── api/                  # API clients
│       │   │   ├── client.ts
│       │   │   ├── generate.ts
│       │   │   └── projects.ts
│       │   ├── utils/                # General utilities
│       │   └── hooks/                # Custom hooks
│       │       ├── useCanvas.ts
│       │       ├── useUndoRedo.ts
│       │       └── useAI.ts
│       ├── stores/                   # Zustand stores
│       │   ├── canvas-store.ts
│       │   ├── project-store.ts
│       │   └── ui-store.ts
│       ├── types/                    # TypeScript types
│       │   ├── canvas.ts
│       │   ├── project.ts
│       │   └── api.ts
│       ├── styles/                   # Global styles
│       │   └── globals.css
│       ├── public/                   # Static assets
│       │   ├── fonts/
│       │   └── templates/
│       ├── package.json
│       ├── tsconfig.json
│       ├── tailwind.config.ts
│       └── next.config.js
├── packages/                         # Shared packages (monorepo)
│   ├── ui/                           # Shared UI components
│   ├── types/                        # Shared TypeScript types
│   └── utils/                        # Shared utilities
├── .github/
│   └── workflows/
│       └── ci.yml
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

## 4. Core Features & Components

### 4.1 Canvas Editor (`CanvasEditor.tsx`)

**Purpose:** Main canvas component using Fabric.js

**Features:**
- High-resolution canvas (300 DPI equivalent)
- Zoom (10% - 1000%)
- Pan (drag canvas)
- Grid overlay (toggle)
- Guides (vertical/horizontal)
- Rulers (top + left)
- Selection tools (select, move, transform)
- Multi-select (shift-click, drag selection)
- Layer management (z-index, lock, hide)

**Props:**
```typescript
interface CanvasEditorProps {
  projectId: string;
  initialCanvas?: string; // JSON serialized canvas
  onSave?: (canvas: string) => void;
  readOnly?: boolean;
  showGuides?: boolean;
  showGrid?: boolean;
}
```

**Key Methods:**
```typescript
// Canvas operations
addText(text: string, options: TextOptions): TextObject
addImage(url: string, options: ImageOptions): ImageObject
deleteSelected(): void
duplicateSelected(): void
groupSelected(): Group
ungroupSelected(): void

// View operations
zoomIn(): void
zoomOut(): void
zoomToFit(): void
zoomToSelection(): void
resetView(): void

// Export operations
exportToPNG(scale: number): Promise<Blob>
exportToPDF(): Promise<Blob>
exportToJSON(): string
```

---

### 4.2 Text Editor (`TextEditor.tsx`)

**Purpose:** Rich text editing toolbar and inline editor

**Features:**
- Font selector (Google Fonts + custom fonts)
- Font size (8pt - 144pt)
- Font weight (light, regular, bold)
- Text color (CMYK + RGB picker)
- Background color (optional)
- Alignment (left, center, right, justify)
- Line height (0.8 - 3.0)
- Letter spacing (kerning) (-50% - 200%)
- Text transform (uppercase, lowercase, capitalize)
- Text decoration (underline, strikethrough)
- Text effects (shadow, outline)

**Component Structure:**
```typescript
<TextEditor
  selectedText={fabricTextObject}
  onUpdate={(updates) => updateText(updates)}
  fonts={availableFonts}
  showCMYKWarning={true}
/>
```

**UI Layout:**
```
┌─────────────────────────────────────────┐
│ [Font ▼] [Size ▼] [B] [I] [U] [Color] │
│ [Align Left] [Center] [Right] [Justify]│
│ [Line Height ▼] [Kerning ▼] [Effects]  │
└─────────────────────────────────────────┘
```

---

### 4.3 Image Editor (`ImageEditor.tsx`)

**Purpose:** Image manipulation tools

**Features:**
- Upload (drag-drop, file picker)
- Replace image
- Resize (maintain aspect ratio, free resize)
- Crop (rectangular, circular, custom shape)
- Rotate (90°, 180°, free rotation)
- Flip (horizontal, vertical)
- Filters (brightness, contrast, saturation, hue)
- Background removal (AI-powered)
- Replace background (solid color, gradient, image)
- Opacity (0% - 100%)
- Blur (0px - 20px)

**Component Structure:**
```typescript
<ImageEditor
  selectedImage={fabricImageObject}
  onUpdate={(updates) => updateImage(updates)}
  onRemoveBackground={() => removeBackground()}
/>
```

**UI Layout:**
```
┌─────────────────────────────────────────┐
│ [Replace] [Crop] [Rotate] [Flip]       │
│ [Filters ▼] [Remove BG] [Opacity ▼]    │
│ [Brightness] [Contrast] [Saturation]   │
└─────────────────────────────────────────┘
```

---

### 4.4 AI Generation (`PromptInput.tsx` + `StyleSelector.tsx`)

**Purpose:** Text-to-image generation interface

**Features:**
- Prompt input (multi-line, character limit: 500)
- Style selector (artist models, presets)
- Prompt suggestions (auto-complete, templates)
- Generation settings:
  - Aspect ratio (5×7, 4×6, custom)
  - Seed (for reproducibility)
  - Guidance scale (1-20)
  - Steps (20-50)
- Generation status (progress bar, ETA)
- Preview thumbnails (before full render)
- Regenerate (same prompt, new seed)
- Variations (4 variations from one generation)

**Component Structure:**
```typescript
<AIGenerationPanel>
  <StyleSelector
    styles={availableStyles}
    selected={selectedStyle}
    onSelect={(style) => setStyle(style)}
  />
  <PromptInput
    value={prompt}
    onChange={setPrompt}
    suggestions={suggestions}
    maxLength={500}
  />
  <GenerationSettings
    aspectRatio={aspectRatio}
    seed={seed}
    guidance={guidance}
  />
  <GenerateButton
    onClick={generate}
    loading={isGenerating}
    disabled={!prompt || !selectedStyle}
  />
  <GenerationStatus
    status={status}
    progress={progress}
    eta={eta}
  />
</AIGenerationPanel>
```

**UI Layout:**
```
┌─────────────────────────────────────────┐
│ Style: [Watercolor Floral ▼]          │
│                                         │
│ Prompt:                                 │
│ ┌─────────────────────────────────────┐ │
│ │ Elegant watercolor floral design    │ │
│ │ with soft pink roses and eucalyptus │ │
│ │ leaves, gold accents...             │ │
│ └─────────────────────────────────────┘ │
│ [💡 Suggestions] [📝 Templates]       │
│                                         │
│ Settings:                               │
│ Aspect Ratio: [5×7 ▼]                  │
│ Seed: [Random] [Custom: 12345]         │
│                                         │
│ [Generate Design] (loading...)         │
│                                         │
│ Status: Generating... 45%              │
│ ETA: 8 seconds                         │
└─────────────────────────────────────────┘
```

---

### 4.5 Layout Tools (`LayoutPanel.tsx`)

**Purpose:** Design layout assistance

**Features:**
- Grid toggle (show/hide)
- Grid size (5px, 10px, 20px)
- Snap to grid (toggle)
- Guides (drag from ruler to create)
- Alignment helpers (center, distribute, align edges)
- Bleed zone overlay (0.125" default)
- Safe zone overlay (0.25" default)
- Trim marks (show/hide)
- Rulers (top + left, toggle)

**Component Structure:**
```typescript
<LayoutPanel>
  <GridControls
    enabled={showGrid}
    size={gridSize}
    snapToGrid={snapToGrid}
  />
  <GuideControls
    guides={guides}
    onAddGuide={addGuide}
    onRemoveGuide={removeGuide}
  />
  <BleedSafeZone
    bleed={0.125}
    safeZone={0.25}
    showOverlay={true}
  />
  <AlignmentTools
    onAlignLeft={alignLeft}
    onAlignCenter={alignCenter}
    onDistribute={distribute}
  />
</LayoutPanel>
```

---

### 4.6 Color Picker (`ColorPicker.tsx`)

**Purpose:** Advanced color selection with CMYK support

**Features:**
- Color modes (RGB, CMYK, HEX, HSL)
- Color picker (visual picker + sliders)
- Palette presets (wedding color palettes)
- Recent colors (last 10 used)
- CMYK gamut warning (out-of-gamut colors)
- Color history (per project)
- Eyedropper (pick color from canvas)

**Component Structure:**
```typescript
<ColorPicker
  value={currentColor}
  mode="CMYK"
  onChange={(color) => setColor(color)}
  showGamutWarning={true}
  palette={weddingPalettes}
/>
```

---

### 4.7 Font Selector (`FontSelector.tsx`)

**Purpose:** Font selection with preview

**Features:**
- Font categories (Serif, Sans-serif, Script, Display)
- Search fonts
- Preview text ("Sample Text" or custom)
- Font loading (Google Fonts API)
- Custom font upload (TTF, OTF)
- Font pairing suggestions
- Recently used fonts

**Component Structure:**
```typescript
<FontSelector
  value={selectedFont}
  onChange={(font) => setFont(font)}
  categories={fontCategories}
  previewText="The Quick Brown Fox"
/>
```

---

### 4.8 Toolbar (`CanvasToolbar.tsx`)

**Purpose:** Main toolbar with tool selection

**Tools:**
- Select (arrow cursor)
- Text (T icon)
- Image (image icon)
- Shape (rectangle, circle, line)
- Crop
- Zoom (in, out, fit)
- Hand (pan tool)

**UI Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ [Select] [Text] [Image] [Shape] [Crop] [Zoom] [Hand]  │
│ [Undo] [Redo] [Copy] [Paste] [Delete] [Group] [Ungroup]│
│ [Save] [Export ▼] [Share] [Settings]                  │
└─────────────────────────────────────────────────────────┘
```

---

### 4.9 Sidebar (`CanvasSidebar.tsx`)

**Purpose:** Properties panel for selected objects

**Sections:**
- **Object Properties:** Position (X, Y), Size (W, H), Rotation, Opacity
- **Text Properties:** (if text selected) Font, size, color, alignment
- **Image Properties:** (if image selected) Filters, opacity, crop
- **Layer Panel:** List of all objects, reorder, lock, hide
- **History:** Undo/redo stack (last 50 actions)

**UI Layout:**
```
┌─────────────────────────┐
│ Properties              │
├─────────────────────────┤
│ Position                │
│ X: [100] Y: [200]       │
│ Size                    │
│ W: [500] H: [700]       │
│ Rotation: [0°]          │
│ Opacity: [100%]         │
├─────────────────────────┤
│ Text Properties         │
│ Font: [Playfair ▼]      │
│ Size: [24pt]            │
│ Color: [■]              │
├─────────────────────────┤
│ Layers                  │
│ ┌─ Text Layer 1         │
│ ┌─ Image Layer 2       │
│ ┌─ Background Layer 3  │
└─────────────────────────┘
```

---

## 5. Component Architecture

### 5.1 Component Hierarchy

```
StudioPage (app/studio/[projectId]/page.tsx)
├── StudioLayout (layout wrapper)
│   ├── StudioHeader (project name, save status)
│   ├── StudioContent (main area)
│   │   ├── CanvasEditor (Fabric.js canvas)
│   │   │   ├── CanvasRuler (top + left)
│   │   │   ├── CanvasGrid (overlay)
│   │   │   ├── CanvasGuides (vertical/horizontal)
│   │   │   └── CanvasObjects (text, images, shapes)
│   │   ├── CanvasToolbar (tools)
│   │   └── CanvasSidebar (properties panel)
│   │       ├── ObjectProperties
│   │       ├── TextEditor (if text selected)
│   │       ├── ImageEditor (if image selected)
│   │       ├── LayerPanel
│   │       └── HistoryPanel
│   └── StudioFooter (zoom, dimensions, status)
└── AIGenerationPanel (slide-out panel)
    ├── StyleSelector
    ├── PromptInput
    ├── GenerationSettings
    └── GenerationStatus
```

### 5.2 Data Flow

```
User Action → Component Event → Zustand Store → API Call → Backend
                                                      ↓
User Action ← Component Update ← Zustand Store ← API Response ← Backend
```

**Example: Generate AI Image**
1. User types prompt → `PromptInput` component
2. User clicks "Generate" → `onGenerate()` handler
3. Handler calls `generateStore.generate(prompt, style)`
4. Store dispatches API call → `/api/generate`
5. Backend processes → returns `jobId`
6. Store polls `/api/generate/[jobId]` → updates status
7. On completion → `canvasStore.addImage(imageUrl)`
8. Canvas updates → image appears on canvas

---

## 6. State Management

### 6.1 Canvas Store (`stores/canvas-store.ts`)

```typescript
interface CanvasStore {
  // Canvas instance
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
  
  // Selected objects
  selectedObjects: fabric.Object[];
  setSelectedObjects: (objects: fabric.Object[]) => void;
  
  // Canvas state
  zoom: number;
  setZoom: (zoom: number) => void;
  panX: number;
  panY: number;
  setPan: (x: number, y: number) => void;
  
  // View settings
  showGrid: boolean;
  toggleGrid: () => void;
  showGuides: boolean;
  toggleGuides: () => void;
  showRulers: boolean;
  toggleRulers: () => void;
  
  // Canvas operations
  addText: (text: string, options?: TextOptions) => void;
  addImage: (url: string, options?: ImageOptions) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  groupSelected: () => void;
  ungroupSelected: () => void;
  
  // Export
  exportToPNG: (scale?: number) => Promise<Blob>;
  exportToPDF: () => Promise<Blob>;
  exportToJSON: () => string;
  
  // Undo/redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}
```

### 6.2 Project Store (`stores/project-store.ts`)

```typescript
interface ProjectStore {
  // Current project
  project: Project | null;
  setProject: (project: Project) => void;
  
  // Project state
  isDirty: boolean; // Has unsaved changes
  setIsDirty: (dirty: boolean) => void;
  
  // Auto-save
  autoSave: () => Promise<void>;
  lastSaved: Date | null;
  
  // Project operations
  loadProject: (id: string) => Promise<void>;
  saveProject: () => Promise<void>;
  createProject: (name: string) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
}
```

### 6.3 AI Generation Store (`stores/ai-store.ts`)

```typescript
interface AIStore {
  // Generation state
  isGenerating: boolean;
  generationStatus: GenerationStatus | null;
  progress: number; // 0-100
  eta: number; // seconds
  
  // Generation settings
  selectedStyle: Style | null;
  setStyle: (style: Style) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  
  // Generation operations
  generate: (prompt: string, style: Style) => Promise<string>; // Returns image URL
  cancelGeneration: () => void;
  regenerate: () => Promise<string>;
  generateVariations: (imageUrl: string) => Promise<string[]>;
  
  // History
  generations: Generation[];
  addToHistory: (generation: Generation) => void;
}
```

### 6.4 UI Store (`stores/ui-store.ts`)

```typescript
interface UIStore {
  // Sidebar state
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  sidebarTab: 'properties' | 'layers' | 'history';
  setSidebarTab: (tab: string) => void;
  
  // AI panel state
  aiPanelOpen: boolean;
  toggleAIPanel: () => void;
  
  // Modals
  showExportModal: boolean;
  openExportModal: () => void;
  closeExportModal: () => void;
  
  // Toast notifications
  toast: (message: string, type: 'success' | 'error' | 'info') => void;
}
```

---

## 7. API Integration

### 7.1 API Client (`lib/api/client.ts`)

```typescript
const apiClient = {
  // AI Generation
  generate: {
    create: (prompt: string, styleId: string, options: GenerationOptions) =>
      POST('/api/generate', { prompt, styleId, ...options }),
    getStatus: (jobId: string) => GET(`/api/generate/${jobId}`),
    cancel: (jobId: string) => POST(`/api/generate/${jobId}/cancel`),
  },
  
  // Projects
  projects: {
    list: () => GET('/api/projects'),
    get: (id: string) => GET(`/api/projects/${id}`),
    create: (data: CreateProjectData) => POST('/api/projects', data),
    update: (id: string, data: UpdateProjectData) =>
      PATCH(`/api/projects/${id}`, data),
    delete: (id: string) => DELETE(`/api/projects/${id}`),
    saveCanvas: (id: string, canvas: string) =>
      POST(`/api/projects/${id}/canvas`, { canvas }),
  },
  
  // Export
  export: {
    pdf: (projectId: string, options: PDFOptions) =>
      POST(`/api/export/pdf`, { projectId, ...options }),
    png: (projectId: string, options: PNGOptions) =>
      POST(`/api/export/png`, { projectId, ...options }),
  },
  
  // Styles
  styles: {
    list: () => GET('/api/styles'),
    get: (id: string) => GET(`/api/styles/${id}`),
  },
};
```

### 7.2 React Query Hooks (`lib/hooks/useAI.ts`)

```typescript
export function useAIGeneration() {
  const queryClient = useQueryClient();
  
  const generateMutation = useMutation({
    mutationFn: (data: GenerateRequest) => apiClient.generate.create(data),
    onSuccess: (data) => {
      // Poll for status
      queryClient.setQueryData(['generation', data.jobId], data);
    },
  });
  
  const statusQuery = useQuery({
    queryKey: ['generation', jobId],
    queryFn: () => apiClient.generate.getStatus(jobId),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'processing' ? 1000 : false;
    },
  });
  
  return {
    generate: generateMutation.mutate,
    status: statusQuery.data,
    isLoading: generateMutation.isPending || statusQuery.isLoading,
  };
}
```

---

## 8. Development Phases

### Phase 1: Foundation (Weeks 1-2)

**Goal:** Set up project structure and basic canvas

**Tasks:**
- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Tailwind CSS + shadcn/ui
- [ ] Install and configure Fabric.js
- [ ] Create basic `CanvasEditor` component
- [ ] Implement canvas initialization (empty canvas)
- [ ] Add zoom controls (zoom in/out/fit)
- [ ] Add pan tool (drag canvas)
- [ ] Set up Zustand stores (canvas-store, ui-store)
- [ ] Create basic layout (header, canvas, sidebar)

**Deliverable:** Canvas renders, can zoom/pan, no editing yet

---

### Phase 2: Text Editing (Weeks 3-4)

**Goal:** Add text editing capabilities

**Tasks:**
- [ ] Implement `TextEditor` component
- [ ] Add text tool (click canvas → add text)
- [ ] Inline text editing (double-click to edit)
- [ ] Font selector (Google Fonts integration)
- [ ] Font size, weight, color controls
- [ ] Text alignment (left, center, right)
- [ ] Text transform (uppercase, lowercase)
- [ ] Undo/redo for text operations
- [ ] Text serialization (save/load)

**Deliverable:** Users can add and edit text on canvas

---

### Phase 3: Image Editing (Weeks 5-6)

**Goal:** Add image upload and editing

**Tasks:**
- [ ] Implement `ImageEditor` component
- [ ] File upload (drag-drop, file picker)
- [ ] Image placement on canvas
- [ ] Resize, rotate, flip images
- [ ] Crop tool (rectangular)
- [ ] Image filters (brightness, contrast, saturation)
- [ ] Opacity control
- [ ] Replace image functionality
- [ ] Image serialization (save URLs, not files)

**Deliverable:** Users can upload and edit images

---

### Phase 4: AI Generation (Weeks 7-8)

**Goal:** Integrate AI image generation

**Tasks:**
- [ ] Create `AIGenerationPanel` component
- [ ] Style selector (fetch from API)
- [ ] Prompt input with suggestions
- [ ] Generation settings (aspect ratio, seed)
- [ ] API integration (`/api/generate`)
- [ ] Polling for generation status
- [ ] Progress bar + ETA
- [ ] Add generated image to canvas
- [ ] Regenerate and variations

**Deliverable:** Users can generate images from text prompts

---

### Phase 5: Layout Tools (Weeks 9-10)

**Goal:** Add professional layout assistance

**Tasks:**
- [ ] Grid overlay (toggle, size control)
- [ ] Snap to grid
- [ ] Rulers (top + left)
- [ ] Guides (drag from ruler)
- [ ] Bleed zone overlay (0.125")
- [ ] Safe zone overlay (0.25")
- [ ] Trim marks (show/hide)
- [ ] Alignment tools (align left/center/right, distribute)
- [ ] Layer panel (list, reorder, lock, hide)

**Deliverable:** Professional layout tools for print design

---

### Phase 6: Advanced Features (Weeks 11-12)

**Goal:** Polish and advanced capabilities

**Tasks:**
- [ ] CMYK color picker with gamut warnings
- [ ] Custom font upload
- [ ] Background removal (AI integration)
- [ ] Group/ungroup objects
- [ ] Copy/paste between projects
- [ ] Keyboard shortcuts (Cmd+S, Cmd+Z, etc.)
- [ ] Auto-save (every 30 seconds)
- [ ] Export to PDF/X-1a (server-side)
- [ ] Export to PNG (high-res)

**Deliverable:** Production-ready design editor

---

### Phase 7: Optimization & Testing (Weeks 13-14)

**Goal:** Performance and quality

**Tasks:**
- [ ] Canvas performance optimization (large projects)
- [ ] Image lazy loading
- [ ] Debounce auto-save
- [ ] Error handling (API failures, network issues)
- [ ] Loading states (skeletons, spinners)
- [ ] Unit tests (Vitest)
- [ ] Component tests (React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Browser testing (Chrome, Safari, Firefox)

**Deliverable:** Polished, tested, accessible application

---

## 9. Technical Specifications

### 9.1 Canvas Specifications

**Resolution:**
- **Display:** 1:1 pixel ratio (not scaled)
- **Export:** 300 DPI equivalent
- **Max Canvas Size:** 6000×8000px (20×26.67" @ 300 DPI)

**Coordinate System:**
- Origin: Top-left (0, 0)
- Units: Pixels (px)
- Zoom Range: 10% - 1000%

**Object Types:**
- Text (`fabric.Text`, `fabric.IText`)
- Image (`fabric.Image`)
- Shapes (`fabric.Rect`, `fabric.Circle`, `fabric.Line`)
- Groups (`fabric.Group`)

### 9.2 Performance Targets

**Canvas Operations:**
- Add text: < 50ms
- Add image: < 100ms (load time excluded)
- Transform object: < 16ms (60 FPS)
- Export PNG: < 2s (3000×4000px)
- Export PDF: < 5s (server-side)

**API Calls:**
- Generate image: < 10s (P95)
- Save project: < 500ms
- Load project: < 1s

**Memory:**
- Max canvas objects: 500
- Max image size: 10MB per image
- Max project size: 50MB (serialized JSON)

### 9.3 Browser Support

**Minimum:**
- Chrome 110+
- Safari 16+
- Firefox 110+
- Edge 110+

**Features:**
- ES2022 JavaScript
- CSS Grid, Flexbox
- Canvas API
- File API
- Web Workers (for image processing)

---

## 10. Design System

### 10.1 Colors

```typescript
const colors = {
  // Primary
  primary: {
    50: '#F4E8E8',  // Soft blush
    100: '#E8D1D1',
    500: '#D4A373', // Rose gold
    900: '#1A4D4D', // Deep teal
  },
  
  // Neutral
  gray: {
    50: '#FAF9F6',
    100: '#F5F4F0',
    500: '#9CA3AF',
    900: '#2D2D2D',
  },
  
  // Status
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
};
```

### 10.2 Typography

```typescript
const typography = {
  fontFamily: {
    heading: ['Playfair Display', 'serif'],
    body: ['Inter', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
};
```

### 10.3 Spacing

```typescript
const spacing = {
  canvasPadding: '2rem',    // 32px
  sidebarWidth: '320px',
  toolbarHeight: '64px',
  headerHeight: '56px',
};
```

### 10.4 Components

**Buttons:**
- Primary: Teal background, white text
- Secondary: Gray border, gray text
- Ghost: Transparent, hover background

**Inputs:**
- Border: 1px solid gray-300
- Focus: 2px solid primary-500
- Error: Red border + error message

**Panels:**
- Background: white
- Border: 1px solid gray-200
- Shadow: 0 1px 3px rgba(0,0,0,0.1)

---

## 11. Performance Requirements

### 11.1 Canvas Performance

**Optimization Strategies:**
1. **Object Caching:** Enable `objectCaching` in Fabric.js
2. **Render on Demand:** Only render visible objects
3. **Debounce Events:** Debounce resize, transform events
4. **Web Workers:** Offload image processing
5. **Virtual Scrolling:** For layer panel (if > 100 objects)

**Metrics:**
- 60 FPS during transform operations
- < 100ms render time for 100 objects
- < 500ms render time for 500 objects

### 11.2 Image Optimization

**Strategies:**
1. **Lazy Loading:** Load images on-demand
2. **Thumbnails:** Show thumbnails, load full-res on zoom
3. **Compression:** Compress uploaded images (max 2MB)
4. **CDN:** Serve images from CDN
5. **Format:** Use WebP for display, PNG for export

### 11.3 API Optimization

**Strategies:**
1. **Request Batching:** Batch multiple API calls
2. **Caching:** Cache style list, project metadata
3. **Optimistic Updates:** Update UI before API confirms
4. **Retry Logic:** Retry failed requests (3 attempts)
5. **Polling:** Use WebSocket for generation status (future)

---

## 12. Testing Strategy

### 12.1 Unit Tests

**Coverage Target:** 80%+

**Test Files:**
- `lib/fabric/canvas-setup.test.ts`
- `lib/fabric/text-handler.test.ts`
- `lib/fabric/image-handler.test.ts`
- `stores/canvas-store.test.ts`
- `stores/project-store.test.ts`

**Example:**
```typescript
describe('CanvasStore', () => {
  it('should add text to canvas', () => {
    const store = useCanvasStore.getState();
    store.setCanvas(mockCanvas);
    store.addText('Hello', { x: 100, y: 100 });
    expect(mockCanvas.add).toHaveBeenCalled();
  });
});
```

### 12.2 Component Tests

**Coverage Target:** 70%+

**Test Files:**
- `components/canvas/CanvasEditor.test.tsx`
- `components/editor/TextEditor.test.tsx`
- `components/editor/ImageEditor.test.tsx`
- `components/ai/PromptInput.test.tsx`

**Example:**
```typescript
describe('TextEditor', () => {
  it('should update text properties', () => {
    const onUpdate = jest.fn();
    render(<TextEditor selectedText={mockText} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByLabelText('Font Size'), { target: { value: '24' } });
    expect(onUpdate).toHaveBeenCalledWith({ fontSize: 24 });
  });
});
```

### 12.3 E2E Tests

**Coverage:** Critical user flows

**Test Scenarios:**
1. Create new project → Add text → Save
2. Upload image → Resize → Export PDF
3. Generate AI image → Add to canvas → Edit text
4. Undo/redo operations
5. Export to PNG/PDF

**Tools:**
- Playwright
- Test in Chrome, Safari, Firefox

**Example:**
```typescript
test('should create and save project', async ({ page }) => {
  await page.goto('/studio/new');
  await page.click('[data-testid="text-tool"]');
  await page.click('canvas', { position: { x: 400, y: 300 } });
  await page.fill('[data-testid="text-input"]', 'Hello World');
  await page.click('[data-testid="save-button"]');
  await expect(page.locator('[data-testid="save-status"]')).toHaveText('Saved');
});
```

---

## 13. File Structure Details

### 13.1 Key Files

**`components/canvas/CanvasEditor.tsx`**
```typescript
'use client';

import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useCanvasStore } from '@/stores/canvas-store';

export function CanvasEditor({ projectId }: { projectId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { canvas, setCanvas, zoom, setZoom } = useCanvasStore();
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 1500,  // 5" @ 300 DPI
      height: 2100, // 7" @ 300 DPI
      backgroundColor: '#ffffff',
    });
    
    setCanvas(fabricCanvas);
    
    return () => {
      fabricCanvas.dispose();
    };
  }, [setCanvas]);
  
  // ... rest of component
}
```

**`lib/fabric/text-handler.ts`**
```typescript
import { fabric } from 'fabric';

export function addTextToCanvas(
  canvas: fabric.Canvas,
  text: string,
  options: TextOptions = {}
): fabric.IText {
  const textObject = new fabric.IText(text, {
    left: options.x ?? 100,
    top: options.y ?? 100,
    fontSize: options.fontSize ?? 24,
    fontFamily: options.fontFamily ?? 'Inter',
    fill: options.color ?? '#000000',
    ...options,
  });
  
  canvas.add(textObject);
  canvas.setActiveObject(textObject);
  canvas.renderAll();
  
  return textObject;
}
```

---

## 14. Next Steps

### Immediate Actions (This Week)

1. **Initialize Project**
   ```bash
   npx create-next-app@latest mardi-studio-pro --typescript --tailwind --app
   cd mardi-studio-pro
   pnpm add fabric zustand @tanstack/react-query
   pnpm add -D @types/fabric
   ```

2. **Set Up Project Structure**
   - Create folder structure (components, lib, stores)
   - Set up Tailwind config
   - Install shadcn/ui: `npx shadcn-ui@latest init`

3. **Create Basic Canvas**
   - Install Fabric.js
   - Create `CanvasEditor` component
   - Test canvas initialization

4. **Set Up State Management**
   - Install Zustand
   - Create `canvas-store.ts`
   - Wire up basic canvas operations

### Week 1 Deliverable
- ✅ Next.js project running
- ✅ Canvas renders on screen
- ✅ Can zoom/pan canvas
- ✅ Basic toolbar visible

---

## 15. Resources & References

### Documentation
- [Fabric.js Docs](http://fabricjs.com/docs/)
- [Next.js Docs](https://nextjs.org/docs)
- [Zustand Docs](https://docs.pmnd.rs/zustand/)
- [React Query Docs](https://tanstack.com/query/latest)

### Examples
- [Fabric.js Examples](http://fabricjs.com/examples/)
- [Next.js Canvas Examples](https://github.com/vercel/next.js/tree/canary/examples)

### Design Inspiration
- Canva Editor
- Figma Canvas
- Adobe Express
- Crello Editor

---

## 16. Success Criteria

### MVP Completion (Phase 1-4)

**Must Have:**
- ✅ Canvas renders with zoom/pan
- ✅ Add/edit text (font, size, color)
- ✅ Upload/edit images (resize, rotate)
- ✅ Generate AI images from prompts
- ✅ Save/load projects
- ✅ Export to PNG (high-res)

**Nice to Have:**
- ⚠️ Export to PDF (server-side)
- ⚠️ Undo/redo
- ⚠️ Grid/guides
- ⚠️ Layer panel

### Production Ready (All Phases)

**Must Have:**
- ✅ All MVP features
- ✅ CMYK color picker
- ✅ Bleed/safe zone overlays
- ✅ Export to PDF/X-1a
- ✅ Auto-save
- ✅ Error handling
- ✅ Loading states
- ✅ 80%+ test coverage
- ✅ WCAG 2.1 AA accessibility

---

**Document Status:** ✅ Ready for Development  
**Next Review:** After Phase 1 completion

---

*Let's build something beautiful.* 🎨

