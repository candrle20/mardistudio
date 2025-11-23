# Prompt Engineering Improvement Plan: Nano Banana Design Engine

## Current State Analysis

The current implementation (`app/api/generate/route.ts` and `lib/gemini/client.ts`) treats all input images identically as generic "references". 
- **Inspirations** (intended for layout/vibe) and **Elements** (specific assets to include) are flattened into a single list.
- The prompt logic (`lib/prompts/template-guides.ts`) generates a static description based on the template type (e.g., "wedding invitation border") but does not explicitly instruct the model on *how* to use the provided images.
- The Gemini client (`lib/gemini/client.ts`) simply appends all images at the start of the request without context.

## Objective

To achieve high-quality, controllable designs where:
1.  **Layout/Vibe** is derived strictly from the "Inspiration" image(s).
2.  **Specific Elements** (flowers, icons, etc.) are incorporated into that layout with high fidelity.
3.  **Styling** remains flexible based on the user's text prompt + inspiration, without arbitrary restrictions.

## Implementation Plan

### 1. Refactor Gemini Client (`lib/gemini/client.ts`)

We need to make the API request **Context-Aware** by structuring the multi-modal prompt. Instead of a flat list of images, we will separate them by role.

**New Interface Structure:**
```typescript
export interface GenerateImageOptions {
  prompt: string;
  layoutReference?: { mimeType: string; dataBase64: string }; // The "Inspiration"
  elementReferences?: Array<{ mimeType: string; dataBase64: string }>; // The "Elements"
  // ... existing fields
}
```

**New Prompt Construction Strategy (Interleaved):**
The `buildPartsFromOptions` function will be updated to construct a structured conversation:

1.  **Context (Text):** "You are Nano Banana, an expert stationery designer. Use the following image as your primary Layout and Style reference (Structure, Composition, Vibe):"
2.  **Image:** [Layout Reference Image]
3.  **Context (Text):** "Now, incorporate the following specific decorative elements into that design. You must include these elements, adapting their placement to fit the layout borders while maintaining their visual identity:"
4.  **Images:** [Element Reference 1, Element Reference 2, ...]
5.  **Final Prompt (Text):** [The user's detailed description + Template constraints]

### 2. Update Prompt Generation (`lib/prompts/template-guides.ts`)

We will rewrite `buildTemplatePrompt` to generate instructions that specifically leverage this new structure.

**Key Instructions to Add:**
*   "**Layout Strategy:** Strictly follow the composition of the Layout Reference. If it has a border, use that border structure."
*   "**Element Integration:** Take the provided Element images and weave them into the border design. Do not just paste them; blend them artistically (watercolor, foil, etc.) to match the Layout's style."
*   "**Constraint:** Keep the center blank for text. Do not generate text yourself."

### 3. Update API Route (`app/api/generate/route.ts`)

Update the route handler to map the incoming request data to the new `GenerateImageOptions` structure:
*   `inspirationUrl` -> `layoutReference`
*   `elementUrls` -> `elementReferences`

### 4. Nano Banana Persona

We will inject a specific system instruction or preamble to the prompt to enforce the "Nano Banana" persona:
> "Act as Nano Banana, a master designer. Your goal is to synthesize the user's Inspiration (Global Style) with their Selected Elements (Specific Content) into a cohesive, print-ready stationery design."

## Execution Steps

1.  **Modify `lib/gemini/client.ts`**: Update types and `buildPartsFromOptions` to support `layoutReference` vs `elementReferences`.
2.  **Modify `app/api/generate/route.ts`**: Pass the separated images correctly.
3.  **Modify `lib/prompts/template-guides.ts`**: Enhancing the text prompt to explicitly reference the "Layout Image" and "Element Images".
4.  **Test**: Verify with the Bulk Upload/Scrolldown UI to ensure elements are actually appearing in the generated borders.

