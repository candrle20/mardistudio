# Photo Editing & Rendering Roadmap

## Objective
Deliver an end-to-end workflow that: (1) ingests generated artwork, (2) extracts editable elements (text, floral clusters, backgrounds), (3) enables granular manipulation in the canvas (move/delete/replace/adjust), and (4) supports re-generation that respects user edits such as drawn masks or annotations.

## Guiding Principles
- **Non-destructive editing:** Maintain original assets while tracking edits as layers.
- **Template awareness:** Respect stationery layout guides (safe zones, bleed) when manipulating content.
- **User transparency:** Show clear visual feedback for extracted elements, masks, and generated updates.
- **Performance:** Optimize for quick parsing and canvas updates to keep the creative flow uninterrupted.

## Workstream A — Asset Parsing Pipeline
- **A1. Source analysis**
  - Evaluate generated PNG metadata (size, DPI) and existing prompt context to infer likely foreground vs background.
  - Decide on server-side vs client-side parsing responsibilities.
- **A2. Element segmentation**
  - Use ML/vision APIs (e.g., RemoveBG, Segment Anything, custom floral detector) to isolate floral clusters, typography, and background.
  - Store results as separate transparent PNG layers or vector approximations.
- **A3. Text extraction**
  - Run OCR (Google Vision, Tesseract) to detect text blocks, coordinates, and fonts.
  - Map OCR results to editable Fabric text objects; fallback to manual text layers when confidence < threshold.
- **A4. Data packaging**
  - Define JSON schema: `{ background, florals[], typography[], masks[] }`.
  - Persist parsed bundles alongside tab state for instant recall.

## Workstream B — Canvas Integration & Layer Management
- **B1. Layer import API**
  - Extend `addImage` to accept arrays of layers with metadata (z-index, mask, semantic tag).
  - Auto-group floral clusters; keep text layers distinct for direct editing.
- **B2. Layer controls**
  - In `CanvasSidebar`, add panels to select, hide, duplicate, replace, or delete extracted elements.
  - Provide quick actions: “Replace florals”, “Swap background”, “Edit headline text”.
- **B3. Mask editing tools**
  - Integrate drawing/eraser to define keep/remove regions.
  - Store user masks for re-generation and visual cues on canvas.
- **B4. Undo/redo aware state**
  - Ensure new layer operations hook into history stack; track origin (parsed vs. user-generated).

## Workstream C — Photo Manipulation Capabilities
- **C1. Floral element editing**
  - Implement drag/drop, scale, and rotation specifically tuned for clusters (snap to guides, maintain proportions).
  - Allow replacement from library or new AI generation (pass style + color constraints).
- **C2. Text editing**
  - Map OCR text into Fabric IText objects with detected font/size; fallback to default palette.
  - Add contextual toolbar for typography (font pairing presets, alignment, color swatches, spacing).
- **C3. Background & image adjustments**
  - Support image filters (brightness, hue) and quick cropping.
  - Add “lock background” toggle to prevent accidental moves.
- **C4. Asset library**
  - Catalog parsed florals and user uploads for reuse across tabs.

## Workstream D — Re-generation & Iterative Updates
- **D1. Editable regions definition**
  - Combine user masks, drawn annotations, and locked layers to generate new prompts/masks.
  - Provide guidance overlay highlighting the regeneration target region.
- **D2. Prompt augmentation**
  - Include user edits (e.g., “keep text, refresh florals along left border”) in AI payload.
  - Pass drawn mask as `mask` input for edit endpoints.
- **D3. Delta application**
  - After receiving updated artwork, repeat parsing pipeline; reconcile with existing layers (replace vs add new option).
  - Diff viewer to compare before/after.
- **D4. Version history**
  - Track regeneration iterations; allow rollback to previous states.

## Workstream E — Infrastructure & Storage
- **E1. Layer storage model**
  - Extend project persistence to handle multi-layer assets (S3 bucket structure, metadata DB).
- **E2. Caching strategy**
  - Cache parsed outputs per image hash to avoid reprocessing identical assets.
- **E3. Performance monitoring**
  - Instrument server timings for segmentation, OCR, and upload.
  - Add client metrics for layer load/render times.

## Workstream F — UX & QA
- **F1. User journey mapping**
  - Define flows: initial generate → parse → edit → regenerate; manual upload → parse → edit; etc.
- **F2. Onboarding & tooltips**
  - Provide inline guidance for new controls (e.g., “Draw mask to regenerate this area”).
- **F3. QA checklist**
  - Validate across template types: invitation, menu, sign, etc.
  - Test with multilingual text and complex floral arrangements.
- **F4. Accessibility**
  - Ensure keyboard shortcuts for selection, alignment, locking; provide high-contrast outlines for selected layers.

## Dependencies & Open Questions
- Evaluate available segmentation/OCR APIs vs. building custom models.
- Determine licensing implications for storing parsed assets separately.
- Decide on real-time vs. queued processing for large images.
- Confirm performance budget for client fabric canvas with multiple high-res layers.

## Milestones (Tentative)
1. **Week 1-2:** Prototype parsing pipeline (server script) + schema.
2. **Week 3:** Integrate layer import into canvas; basic layer management UI.
3. **Week 4:** Text editing & mask tooling enhancements.
4. **Week 5:** Regeneration loop with masks and delta application.
5. **Week 6:** Storage hardening, caching, QA, documentation.

## Success Metrics
- ≥80% of generated invitations produce editable text layers automatically.
- Floral clusters separable and movable in ≥70% of test images.
- Regeneration turnaround <10s for standard template with mask.
- Positive designer feedback on control granularity and usability.
