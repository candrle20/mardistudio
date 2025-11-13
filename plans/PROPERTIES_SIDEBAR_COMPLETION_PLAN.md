# Properties Sidebar Completion Plan

**Status:** In Progress  
**Date:** November 11, 2025

---

## 📋 Current State Analysis

### ✅ Already Implemented

**Object Properties (Generic)**
- ✅ Position (X, Y) - Read-only display
- ✅ Size (Width, Height) - Read-only display
- ✅ Opacity - Read-only slider display

**Text Editor** (`components/editor/TextEditor.tsx`)
- ✅ Font Family - 10 Google Fonts
- ✅ Font Size - Slider (8-144pt)
- ✅ Font Weight - Bold toggle
- ✅ Font Style - Italic toggle
- ✅ Text Decoration - Underline toggle
- ✅ Text Alignment - Left, Center, Right, Justify
- ✅ Text Color - Color picker with hex input
- ✅ Line Height - Slider (0.8-3.0)
- ✅ Letter Spacing - Slider (-50 to 200px)

**Image Editor** (`components/editor/ImageEditor.tsx`)
- ✅ Transform Controls (Rotate, Flip)
- ✅ Opacity slider
- ✅ Image Filters (Brightness, Contrast, Saturation)

**Sidebar** (`components/canvas/CanvasSidebar.tsx`)
- ✅ Properties/Layers tabs
- ✅ Collapse/Expand functionality
- ✅ Duplicate/Delete actions
- ✅ Drawing tool controls (brush color, width)

---

## 🔧 Issues to Fix

### 1. Font Size Control Issues

**Current Problems:**
- ❌ Slider-only control is imprecise for exact sizing
- ❌ No direct input for exact pixel values
- ❌ Common font sizes not easily accessible
- ❌ No font size presets

**Solution:**
- Add number input field alongside slider
- Add quick size presets (8, 10, 12, 14, 16, 18, 24, 36, 48, 72pt)
- Allow typing exact values
- Add increment/decrement buttons (+/- 1pt)

### 2. Font Styling Issues

**Current Problems:**
- ❌ Limited styling options (only bold, italic, underline)
- ❌ No strikethrough option
- ❌ No text transform (uppercase, lowercase, capitalize)
- ❌ No text shadow/outline options
- ❌ Font weight limited to bold/normal (no 100-900 scale)

**Solution:**
- Add strikethrough button
- Add text transform dropdown
- Add text shadow controls (color, blur, offset)
- Add text stroke/outline controls
- Add full font weight selector (100, 200, ..., 900)

### 3. Missing Object Properties

**Current Problems:**
- ❌ Object properties are read-only
- ❌ No position editing
- ❌ No size editing (width/height)
- ❌ No rotation control
- ❌ No opacity editing
- ❌ No lock/unlock toggle
- ❌ No visibility toggle
- ❌ No z-index (bring to front/back)

**Solution:**
- Make position inputs editable
- Add size inputs with aspect ratio lock
- Add rotation slider (-180° to 180°)
- Add opacity slider (0-100%)
- Add lock/unlock button
- Add visibility eye icon
- Add layer order buttons

### 4. Missing Advanced Text Properties

**Current Problems:**
- ❌ No text background/highlight
- ❌ No vertical alignment
- ❌ No text wrapping options
- ❌ No paragraph spacing
- ❌ No list formatting
- ❌ No superscript/subscript

**Solution:**
- Add background color picker for text
- Add vertical align (top, middle, bottom)
- Add text wrapping controls
- Add paragraph spacing controls
- Consider adding basic list support
- Add superscript/subscript toggles

### 5. Missing Shape Properties

**Current Problems:**
- ❌ No shape editor component
- ❌ No fill color control
- ❌ No stroke color control
- ❌ No stroke width control
- ❌ No corner radius for rectangles

**Solution:**
- Create `ShapeEditor.tsx` component
- Add fill color picker
- Add stroke color picker
- Add stroke width slider
- Add corner radius slider for rectangles

---

## 🎯 Implementation Priority

### Phase 1: Critical Fixes (Immediate)
1. **Fix Font Size Control**
   - Add number input
   - Add size presets
   - Add increment/decrement buttons
2. **Make Object Properties Editable**
   - Enable position editing
   - Enable size editing
   - Add rotation control
   - Add opacity control

### Phase 2: Enhanced Text Editing
1. **Add Missing Text Styles**
   - Strikethrough
   - Text transform
   - Full font weight range
2. **Add Text Effects**
   - Text shadow
   - Text stroke/outline
   - Background highlight

### Phase 3: Complete Property Coverage
1. **Add Shape Editor**
   - Fill color
   - Stroke properties
   - Corner radius
2. **Add Object Controls**
   - Lock/unlock
   - Visibility toggle
   - Layer ordering

### Phase 4: Advanced Features
1. **Add Advanced Text Properties**
   - Vertical alignment
   - Text wrapping
   - Paragraph spacing
2. **Add Layers Panel**
   - Layer list
   - Drag to reorder
   - Quick actions

---

## 📐 Component Structure

### Updated TextEditor Structure
```typescript
<TextEditor>
  <FontSection>
    <FontFamilySelect />
    <FontSizeControl>
      <SizePresets />      // 8, 10, 12, 14, 16, 18, 24, 36, 48, 72
      <SizeSlider />       // 8-144pt
      <SizeInput />        // Direct input
      <IncrementButtons /> // +1/-1
    </FontSizeControl>
    <FontWeightSelect />   // 100-900
  </FontSection>
  
  <StyleSection>
    <StyleButtons>       // Bold, Italic, Underline, Strikethrough
    <TextTransform />    // None, Uppercase, Lowercase, Capitalize
  </StyleSection>
  
  <AlignmentSection>
    <TextAlign />        // Left, Center, Right, Justify
    <VerticalAlign />    // Top, Middle, Bottom
  </AlignmentSection>
  
  <ColorSection>
    <TextColor />
    <BackgroundColor />  // Optional highlight
  </ColorSection>
  
  <EffectsSection>
    <TextShadow>
      <ShadowColor />
      <ShadowBlur />
      <ShadowOffset />
    </TextShadow>
    <TextStroke>
      <StrokeColor />
      <StrokeWidth />
    </TextStroke>
  </EffectsSection>
  
  <SpacingSection>
    <LineHeight />
    <LetterSpacing />
    <ParagraphSpacing /> // Optional
  </SpacingSection>
</TextEditor>
```

### New ShapeEditor Structure
```typescript
<ShapeEditor selectedShape={shape}>
  <FillSection>
    <FillColor />
    <FillOpacity />
  </FillSection>
  
  <StrokeSection>
    <StrokeColor />
    <StrokeWidth />      // 0-20px
    <StrokeDashArray />  // Solid, Dashed, Dotted
  </StrokeSection>
  
  <CornerSection>       // For rectangles
    <CornerRadius />     // 0-50px
  </CornerSection>
</ShapeEditor>
```

### Enhanced ObjectProperties Structure
```typescript
<ObjectProperties>
  <PositionSection>
    <PositionInput label="X" />  // Editable
    <PositionInput label="Y" />  // Editable
    <LockButton />               // Lock position
  </PositionSection>
  
  <SizeSection>
    <SizeInput label="W" />      // Editable
    <SizeInput label="H" />      // Editable
    <AspectRatioLock />          // Maintain aspect ratio
  </SizeSection>
  
  <TransformSection>
    <RotationSlider />           // -180 to 180 degrees
    <OpacitySlider />            // 0-100%
  </TransformSection>
  
  <LayerSection>
    <VisibilityToggle />         // Show/hide
    <LockToggle />               // Lock/unlock
    <ZIndexButtons>
      <BringToFront />
      <SendToBack />
      <BringForward />
      <SendBackward />
    </ZIndexButtons>
  </LayerSection>
</ObjectProperties>
```

---

## 🎨 UI/UX Improvements

### Font Size Control
```
┌─────────────────────────────────────┐
│ Font Size                           │
│ ┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐             │
│ │8│10│12│14│16│18│24│36│48│72│ pt  │
│ └─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘             │
│                                     │
│ [━━━━━━━━━━━━━━━━] 24pt           │
│                                     │
│ [-] [24] [+]                       │
└─────────────────────────────────────┘
```

### Object Properties
```
┌─────────────────────────────────────┐
│ Position & Size          [🔓] [👁]  │
│ X: [100]  Y: [200]                  │
│ W: [500]  H: [700]  [🔗]           │
│                                     │
│ Rotation: [0°]     ━━━━━━━━━━━━   │
│ Opacity:  [100%]   ━━━━━━━━━━━━   │
│                                     │
│ [⬆ Front] [⬇ Back] [↑ +1] [↓ -1]  │
└─────────────────────────────────────┘
```

---

## ✅ Success Criteria

### Phase 1 Complete When:
- [ ] Font size has input field + presets + increment buttons
- [ ] Object position is editable (X, Y inputs work)
- [ ] Object size is editable (W, H inputs work)
- [ ] Rotation slider works (-180° to 180°)
- [ ] Opacity slider is editable (0-100%)

### Phase 2 Complete When:
- [ ] Strikethrough button works
- [ ] Text transform dropdown works
- [ ] Font weight selector (100-900) works
- [ ] Text shadow controls work
- [ ] Text stroke controls work

### Phase 3 Complete When:
- [ ] ShapeEditor component created
- [ ] Fill/stroke controls work for shapes
- [ ] Lock/unlock object works
- [ ] Visibility toggle works
- [ ] Layer ordering buttons work

### Phase 4 Complete When:
- [ ] All advanced text properties work
- [ ] Layers panel shows all objects
- [ ] Drag-to-reorder layers works
- [ ] All quick actions in layers work

---

## 🚀 Next Steps

1. **Start with Phase 1 - Critical Fixes**
   - Fix TextEditor font size control
   - Fix ObjectProperties to be editable
2. **Test thoroughly with real canvas objects**
3. **Move to Phase 2 once Phase 1 is stable**
4. **Document all new features as they're added**

---

## 📚 References

- Fabric.js Text API: http://fabricjs.com/docs/fabric.Text.html
- Fabric.js Object API: http://fabricjs.com/docs/fabric.Object.html
- React Colorful: https://github.com/omgovich/react-colorful
- Lucide Icons: https://lucide.dev/


