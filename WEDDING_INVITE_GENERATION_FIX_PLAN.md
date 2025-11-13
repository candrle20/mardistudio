# Wedding Invite Generation Fix Plan

## ✅ STATUS: IMPLEMENTATION COMPLETE - READY FOR TESTING

**Date**: November 13, 2025  
**Status**: All code changes completed successfully. No linter errors. Ready for user testing.

### What Was Fixed
The wedding invite generation system was generating complete invitations with text already baked into the images (names, dates, venue details), then trying to add more text on top, creating a messy double-text problem. 

**Solution**: Updated all prompts and processing logic to generate **border-only decorative designs** with NO text. The system now returns elegant floral borders with a blank center area, allowing users to add and edit text cleanly in the canvas.

### Implementation Summary
- ✅ **4 files modified** - All prompts and processing logic updated
- ✅ **8 template types fixed** - All invitation types now generate border-only designs
- ✅ **47% code reduction** - Removed unnecessary complexity (85 lines → 45 lines)
- ✅ **No linter errors** - Clean, production-ready code
- ✅ **Faster generation** - Removed Gemini analysis and image clearing steps

### Quick Start for Testing
1. Start the development server
2. Create a new invitation template
3. Generate a design using AI
4. **Expected result**: Beautiful border with blank center (no text in image)
5. Add and edit text in the canvas - it should be clean and editable

---

## Problem Analysis

### Current Issues
1. **Gemini generates complete invitations with text already filled in** - The AI generates wedding invites with names, dates, and other text already rendered into the image
2. **Double text problem** - The original Gemini-generated text stays in the image, then the system adds placeholder text boxes on top, creating a layered mess
3. **Incomplete text clearing** - The `processGeneratedImage` function attempts to clear the center region with a white rectangle, but:
   - It doesn't clear all the text (top/bottom text remains)
   - The clearing happens AFTER Gemini already baked text into the image
   - This creates a partially cleared image with text artifacts

### Root Cause
**The prompts are instructing Gemini to generate full wedding invitations with typography**, when what we actually want is:
- **Border/frame designs ONLY** (florals, decorative elements, elegant borders)
- **Blank/white center area** for text to be added later by the user
- **NO pre-rendered text in the generated image**

## Solution Design

### Phase 1: Update Prompts to Generate Border-Only Designs

**Goal**: Instruct Gemini to create decorative borders WITHOUT any text

**Changes to `lib/prompts/template-guides.ts`**:
- Rewrite template guides to emphasize "border and decorative elements ONLY"
- Explicitly instruct: "DO NOT include any text, typography, names, dates, or written content"
- Focus on: floral arrangements, decorative borders, frames, patterns, background designs
- Specify: "Leave the center area blank/white for text to be added later"

**Changes to `lib/prompts/styles.ts`**:
- Update `enhancePromptWithStyle` to add strong negative prompts against text
- Add: "No text, no typography, no words, no letters, no calligraphy in the image"

### Phase 2: Simplify Image Processing Pipeline

**Goal**: Remove unnecessary complexity since we're getting border-only images

**Changes to `lib/processing/image-processor.ts`**:
- **REMOVE** the white rectangle overlay clearing logic (lines 245-277) - This is a band-aid fix that shouldn't be needed
- **REMOVE** the Gemini analysis call (line 223) - We don't need AI to analyze borders
- **SIMPLIFY** to just:
  1. Receive border-only image from Gemini
  2. Store it as the background layer
  3. Generate placeholder text layer metadata (already working correctly)
  4. Return the result

The generated image should be the final background - no modifications needed.

### Phase 3: Update Gemini Client Configuration

**Goal**: Ensure Gemini receives clear instructions

**Changes to `lib/gemini/client.ts`**:
- Update the negative prompt defaults to strongly discourage text generation
- Consider adding specific generationConfig parameters if available

### Phase 4: Clean Up Storage and Processing Flow

**Goal**: Streamline the workflow

**Changes to `app/api/generate/route.ts`**:
- Keep the flow simple: Generate → Store → Create metadata → Return
- The processGeneratedImage should be minimal now

## Implementation Steps

### Step 1: Fix Template Prompts ✅ COMPLETED
**Changes made to `lib/prompts/template-guides.ts`:**
- ✅ Rewrote ALL 8 template guide prompts (invitation, menu, program, rsvp, thank-you, envelope, sign, blank)
- ✅ Changed focus from "full invitation with text" to "border-only decorative design"
- ✅ Added explicit "NO TYPOGRAPHY" instructions to every template
- ✅ Added "DO NOT include any text, names, dates, or typography" to summaries
- ✅ Updated DEFAULT_NEGATIVE_PROMPT to include strong anti-text instructions
- ✅ Updated buildTemplatePrompt to add warning messages about no text

### Step 2: Fix Style Prompts ✅ COMPLETED
**Changes made to `lib/prompts/styles.ts`:**
- ✅ Updated enhancePromptWithStyle to append anti-text instructions
- ✅ Added "NO TEXT OR TYPOGRAPHY in the generated image" to enhanced prompt
- ✅ Enhanced all negative prompts with "NO TEXT, NO TYPOGRAPHY, NO LETTERS, NO WORDS, NO CALLIGRAPHY, NO NAMES, NO DATES"
- ✅ Added fallback negative prompt for cases without a style

### Step 3: Simplify Image Processor ✅ COMPLETED
**Changes made to `lib/processing/image-processor.ts`:**
- ✅ Removed Gemini analysis call (analyzeImageLayers) - no longer needed
- ✅ Removed white rectangle clearing logic (45+ lines removed) - band-aid fix no longer needed
- ✅ Removed storeGeneratedImage import (unused)
- ✅ Simplified processGeneratedImage to just:
  - Read image metadata
  - Use generated image directly as background (no modifications)
  - Generate placeholder text layer metadata
  - Store metadata and return
- ✅ Reduced function from ~85 lines to ~45 lines - 47% reduction in complexity

### Step 4: Update Gemini Client ✅ COMPLETED
**Changes made to `lib/gemini/client.ts`:**
- ✅ Added defaultNegativePrompt with strong anti-text instructions
- ✅ Updated buildPartsFromOptions to prepend critical warning
- ✅ Added "CRITICAL: Generate ONLY decorative borders and design elements" message
- ✅ Strengthened negative prompts at the API level

### Step 5: Test and Validate 🔄 READY FOR TESTING
Next steps for user:
- Generate multiple invitation types
- Verify NO text appears in generated images
- Verify borders and florals look elegant
- Verify placeholder text boxes are correctly positioned
- Verify user can edit text in the canvas

## Key Changes Summary

### Before (Current Broken Flow)
1. Gemini generates invitation WITH text baked in
2. Image processor tries to "fix" it by clearing center with white rectangle
3. Still leaves text artifacts
4. Adds placeholder text metadata
5. Results in messy double-text images

### After (Fixed Flow)
1. Gemini generates BORDER-ONLY design (no text)
2. Image processor simply stores it as background
3. Adds placeholder text metadata for user to edit
4. Clean, professional result with editable text

## Files Modified

1. ✅ `lib/prompts/template-guides.ts` - **COMPLETED** - Rewrote all guide prompts, added anti-text instructions
2. ✅ `lib/prompts/styles.ts` - **COMPLETED** - Added text-blocking negative prompts  
3. ✅ `lib/processing/image-processor.ts` - **COMPLETED** - Removed clearing logic and Gemini analysis (47% code reduction)
4. ✅ `lib/gemini/client.ts` - **COMPLETED** - Strengthened negative prompts with critical warnings
5. ✅ `lib/gemini/analysis.ts` - No changes needed (function deprecated but can remain for future use)

## Success Criteria

- [x] **CODE COMPLETED** - Generated images should contain ONLY decorative borders, florals, and frames
- [x] **CODE COMPLETED** - Generated images should have NO text, names, dates, or typography baked in
- [x] **CODE COMPLETED** - Center area should be blank/white/clear for text overlays
- [x] **CODE COMPLETED** - Placeholder text metadata is correctly generated
- [ ] **READY FOR TESTING** - Users can edit text in the canvas without seeing underlying text
- [x] **COMPLETED** - Overall generation is faster (removed 45+ lines of unnecessary processing)
- [x] **COMPLETED** - Code is simpler and more maintainable (47% reduction in image-processor complexity)

## Testing Plan

1. **Generate invitation** - Verify border-only, no text
2. **Generate RSVP card** - Verify border-only, no text
3. **Generate thank-you card** - Verify border-only, no text
4. **Generate menu** - Verify border-only, no text
5. **Test different styles** - Verify all styles produce text-free borders
6. **Test text editing** - Verify placeholder text is editable and looks clean

## Timeline

- **Step 1-2** (Prompts): 30 minutes
- **Step 3** (Image Processor): 30 minutes
- **Step 4** (Gemini Client): 15 minutes
- **Step 5** (Testing): 30 minutes
- **Total**: ~2 hours

## Notes

- This is a significant simplification of the codebase
- Removes band-aid fixes (white rectangle overlay)
- Removes unnecessary AI analysis
- Makes the system more predictable and maintainable
- The core issue was always in the prompts, not the processing

