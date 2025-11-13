# Wedding Stationery Prompt & Rendering Improvement Plan

## Goals
- Align AI prompt generation with each stationery template type (invitation, menu, sign, etc.)
- Produce text-rich outputs where required and decorative imagery where appropriate
- Ensure generated artwork respects template dimensions and auto-fills the canvas gracefully
- Deliver consistent, elegant wedding aesthetics across all generated assets

## Current Gaps
- Prompts do not account for template type specifics (e.g., signage vs. menus)
- Generated images may not match template aspect ratios
- Added images require manual resizing/positioning, leading to layout inconsistencies
- Lack of refinements for wedding-specific styling (typography hierarchy, borders, motifs)

## Workstream 1: Prompt Strategy Per Template
- **Template Audit**: Catalog all template types (`invitation`, `menu`, `program`, `thank-you`, `envelope`, `sign`, etc.) with their preferred content structure.
- **Prompt Framework**:
  - Define primary objective (e.g., "large readable welcome text", "multi-course menu layout").
  - Specify visual elements (borders, flourishes, illustrations) tailored to each type.
  - Outline typography guidance (headline vs body copy, script vs serif).
  - Include color palettes and material cues (e.g., "soft ivory paper", "gold foil accents").
- **Dynamic Prompt Builder**: Implement prompt templates that accept runtime variables (names, date, venue) and template metadata (size, orientation).
- **Validation & Iteration**: Set up a prompt review checklist with design stakeholders to fine-tune outputs.

## Workstream 2: Aspect Ratio & Image Generation
- **Canvas Metadata**: Extend template data to expose width, height, DPI.
- **AI Request Payload**: Pass explicit size guidance (aspect ratio, resolution) into generation API.
- **Fallback Logic**: When the API cannot meet exact dimensions, generate slightly oversized art and crop/stretch conservatively client-side.
- **Testing Matrix**: Validate each template type across common device breakpoints.

## Workstream 3: Auto Layout on Import
- **Smart Placement Rules**:
  - For full-bleed backgrounds: scale image to cover entire canvas while maintaining aspect ratio.
  - For decorative overlays: center and constrain within safe margins.
  - For typography-heavy outputs: auto-align to grids defined per template.
- **Snap-to-Template**: Enhance `addImage` to detect template framing guides and snap edges/baselines.
- **User Overrides**: Preserve manual control—allow dragging while showing guideline overlays.

## Workstream 4: Wedding Aesthetic System
- **Style Library Refresh**: Curate a set of wedding-specific style presets (romantic floral, modern minimalist, art deco, rustic chic).
- **Typography Pairings**: Recommend headline + body font combos, include casing guidance.
- **Illustration Pack**: Build/star curated SVG/PNG motifs ready for layering (florals, monograms, borders).
- **Linguistic Tone**: Craft prompt additions to encourage language like "celebrate", "honor", "joyfully invite".

## Workstream 5: QA & Tooling
- **Design Review Loop**: Bi-weekly review of generated outputs vs. design checklists.
- **Automated Visual Diff**: Capture snapshots pre/post prompt update to track improvements.
- **Analytics**: Log prompt template usage, success rates, and manual edits post-generation.
- **Documentation**: Update internal wiki with prompt recipes and implementation notes.

## Deliverables & Timeline
1. **Week 1**: Template audit + draft prompt framework.
2. **Week 2**: Implement dynamic prompt builder; expose template metadata to AI payload.
3. **Week 3**: Auto-layout enhancements & snap logic; update style library.
4. **Week 4**: QA cycle, analytics instrumentation, documentation rollout.

## Success Metrics
- ≥90% of generated invitations/signs usable without manual resizing.
- 50% reduction in manual text edits per generated menu.
- Positive qualitative feedback from design reviewers on wedding aesthetic alignment.
