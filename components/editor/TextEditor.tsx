'use client';

import { useEffect, useState } from 'react';
import { useCanvasStore } from '@/stores/canvas-store';
import { fabric } from 'fabric';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Underline, Strikethrough } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

interface TextEditorProps {
  selectedText?: fabric.IText | fabric.Text;
}

export function TextEditor({ selectedText }: TextEditorProps) {
  const { canvas } = useCanvasStore();
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState(24);
  const [fontWeight, setFontWeight] = useState<number | string>('normal');
  const [fontStyle, setFontStyle] = useState<'normal' | 'italic'>('normal');
  const [textDecoration, setTextDecoration] = useState<'none' | 'underline' | 'line-through'>('none');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [textColor, setTextColor] = useState('#000000');
  const [lineHeight, setLineHeight] = useState(1.2);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [textTransform, setTextTransform] = useState<'none' | 'uppercase' | 'lowercase' | 'capitalize'>('none');
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Text effects
  const [textShadow, setTextShadow] = useState({ enabled: false, color: '#000000', blur: 5, offsetX: 2, offsetY: 2 });
  const [textStroke, setTextStroke] = useState({ enabled: false, color: '#000000', width: 1 });
  const [textBackground, setTextBackground] = useState({ enabled: false, color: '#FFFF00' });
  const [showShadowColorPicker, setShowShadowColorPicker] = useState(false);
  const [showStrokeColorPicker, setShowStrokeColorPicker] = useState(false);
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(false);

  // Update state when selected text changes
  useEffect(() => {
    if (selectedText) {
      const text = selectedText as fabric.IText;
      setFontFamily(text.fontFamily || 'Inter');
      setFontSize(text.fontSize || 24);
      
      // Handle font weight - convert to number or keep as string
      const weight = text.fontWeight;
      if (typeof weight === 'number' || (weight && !isNaN(Number(weight)))) {
        setFontWeight(Number(weight));
      } else {
        setFontWeight(weight === 'bold' ? 'bold' : 'normal');
      }
      
      setFontStyle(text.fontStyle === 'italic' ? 'italic' : 'normal');
      // fabric.IText types are incomplete in v5
      const textObj = text as any;
      setTextDecoration(textObj.textDecoration || 'none');
      setTextAlign((text.textAlign || 'left') as 'left' | 'center' | 'right' | 'justify');
      setTextColor(text.fill as string || '#000000');
      setLineHeight(text.lineHeight || 1.2);
      setLetterSpacing(text.charSpacing || 0);
      setTextTransform('none'); // Reset on selection change
    }
  }, [selectedText]);

  const updateTextProperty = (property: string, value: any) => {
    if (!selectedText || !canvas) return;

    (selectedText as any).set(property, value);
    canvas.renderAll();
  };

  const handleFontFamilyChange = (font: string) => {
    setFontFamily(font);
    updateTextProperty('fontFamily', font);
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
    updateTextProperty('fontSize', size);
  };

  const handleColorChange = (color: string) => {
    setTextColor(color);
    updateTextProperty('fill', color);
  };

  const handleAlignmentChange = (align: 'left' | 'center' | 'right' | 'justify') => {
    setTextAlign(align);
    updateTextProperty('textAlign', align);
  };

  const handleFontWeightChange = (weight: number | string) => {
    setFontWeight(weight);
    updateTextProperty('fontWeight', weight);
  };

  const toggleBold = () => {
    const newWeight = fontWeight === 'bold' || fontWeight === 700 ? 'normal' : 'bold';
    setFontWeight(newWeight);
    updateTextProperty('fontWeight', newWeight);
  };

  const toggleItalic = () => {
    const newStyle = fontStyle === 'italic' ? 'normal' : 'italic';
    setFontStyle(newStyle);
    updateTextProperty('fontStyle', newStyle);
  };

  const toggleUnderline = () => {
    const newDecoration = textDecoration === 'underline' ? 'none' : 'underline';
    setTextDecoration(newDecoration);
    updateTextProperty('textDecoration', newDecoration);
  };

  const toggleStrikethrough = () => {
    const newDecoration = textDecoration === 'line-through' ? 'none' : 'line-through';
    setTextDecoration(newDecoration);
    updateTextProperty('textDecoration', newDecoration);
  };

  const handleTextTransform = (transform: 'none' | 'uppercase' | 'lowercase' | 'capitalize') => {
    if (!selectedText) return;
    
    setTextTransform(transform);
    const currentText = selectedText.text || '';
    let transformedText = currentText;
    
    switch (transform) {
      case 'uppercase':
        transformedText = currentText.toUpperCase();
        break;
      case 'lowercase':
        transformedText = currentText.toLowerCase();
        break;
      case 'capitalize':
        transformedText = currentText.replace(/\b\w/g, (char) => char.toUpperCase());
        break;
      case 'none':
      default:
        // Keep original text
        break;
    }
    
    updateTextProperty('text', transformedText);
  };

  const handleLineHeightChange = (height: number) => {
    setLineHeight(height);
    updateTextProperty('lineHeight', height);
  };

  const handleLetterSpacingChange = (spacing: number) => {
    setLetterSpacing(spacing);
    updateTextProperty('charSpacing', spacing);
  };

  // Text shadow handlers
  const toggleTextShadow = () => {
    const newEnabled = !textShadow.enabled;
    setTextShadow({ ...textShadow, enabled: newEnabled });
    
    if (newEnabled && selectedText) {
      const shadow = new fabric.Shadow({
        color: textShadow.color,
        blur: textShadow.blur,
        offsetX: textShadow.offsetX,
        offsetY: textShadow.offsetY,
      });
      updateTextProperty('shadow', shadow);
    } else {
      updateTextProperty('shadow', null);
    }
  };

  const updateTextShadow = (property: keyof typeof textShadow, value: any) => {
    const newShadow = { ...textShadow, [property]: value };
    setTextShadow(newShadow);
    
    if (newShadow.enabled && selectedText) {
      const shadow = new fabric.Shadow({
        color: newShadow.color,
        blur: newShadow.blur,
        offsetX: newShadow.offsetX,
        offsetY: newShadow.offsetY,
      });
      updateTextProperty('shadow', shadow);
    }
  };

  // Text stroke handlers
  const toggleTextStroke = () => {
    const newEnabled = !textStroke.enabled;
    setTextStroke({ ...textStroke, enabled: newEnabled });
    
    if (newEnabled && selectedText) {
      updateTextProperty('stroke', textStroke.color);
      updateTextProperty('strokeWidth', textStroke.width);
    } else {
      updateTextProperty('stroke', null);
      updateTextProperty('strokeWidth', 0);
    }
  };

  const updateTextStroke = (property: keyof typeof textStroke, value: any) => {
    const newStroke = { ...textStroke, [property]: value };
    setTextStroke(newStroke);
    
    if (newStroke.enabled && selectedText) {
      if (property === 'color') {
        updateTextProperty('stroke', value);
      } else if (property === 'width') {
        updateTextProperty('strokeWidth', value);
      }
    }
  };

  // Text background handlers
  const toggleTextBackground = () => {
    const newEnabled = !textBackground.enabled;
    setTextBackground({ ...textBackground, enabled: newEnabled });
    
    if (newEnabled && selectedText) {
      updateTextProperty('textBackgroundColor', textBackground.color);
    } else {
      updateTextProperty('textBackgroundColor', '');
    }
  };

  const updateTextBackground = (color: string) => {
    setTextBackground({ ...textBackground, color });
    
    if (textBackground.enabled && selectedText) {
      updateTextProperty('textBackgroundColor', color);
    }
  };

  if (!selectedText) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        Select a text object to edit properties
      </div>
    );
  }

  const fonts = [
    'Inter',
    'Playfair Display',
    'Cormorant Garamond',
    'Dancing Script',
    'Great Vibes',
    'Montserrat',
    'Open Sans',
    'Lato',
    'Roboto',
    'Poppins',
  ];

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold mb-3">Text Properties</h3>

      {/* Font Family */}
      <div>
        <label className="text-xs text-gray-600 mb-1 block">Font</label>
        <select
          value={fontFamily}
          onChange={(e) => handleFontFamilyChange(e.target.value)}
          className="w-full px-3 py-2 border rounded text-sm"
        >
          {fonts.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="text-xs text-gray-600 mb-2 block">Font Size</label>
        
        {/* Quick Size Presets */}
        <div className="flex flex-wrap gap-1 mb-2">
          {[8, 10, 12, 14, 16, 18, 24, 36, 48, 72].map((size) => (
            <button
              key={size}
              onClick={() => handleFontSizeChange(size)}
              className={`px-2 py-1 text-xs rounded border ${
                fontSize === size
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white hover:bg-gray-50 border-gray-300'
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Size Slider */}
        <input
          type="range"
          min="8"
          max="144"
          value={fontSize}
          onChange={(e) => handleFontSizeChange(Number(e.target.value))}
          className="w-full mb-2"
        />

        {/* Manual Input with Increment/Decrement */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleFontSizeChange(Math.max(8, fontSize - 1))}
            className="px-2 py-1 border rounded hover:bg-gray-100 text-sm font-bold"
            title="Decrease font size"
          >
            −
          </button>
          <div className="flex-1 relative">
            <input
              type="number"
              min="8"
              max="144"
              value={fontSize}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 8 && val <= 144) {
                  handleFontSizeChange(val);
                }
              }}
              className="w-full px-3 py-1 border rounded text-sm text-center"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
              pt
            </span>
          </div>
          <button
            onClick={() => handleFontSizeChange(Math.min(144, fontSize + 1))}
            className="px-2 py-1 border rounded hover:bg-gray-100 text-sm font-bold"
            title="Increase font size"
          >
            +
          </button>
        </div>
      </div>

      {/* Font Weight Selector */}
      <div>
        <label className="text-xs text-gray-600 mb-1 block">Font Weight</label>
        <select
          value={fontWeight}
          onChange={(e) => {
            const val = e.target.value;
            handleFontWeightChange(isNaN(Number(val)) ? val : Number(val));
          }}
          className="w-full px-3 py-2 border rounded text-sm"
        >
          <option value="100">Thin (100)</option>
          <option value="200">Extra Light (200)</option>
          <option value="300">Light (300)</option>
          <option value="normal">Normal (400)</option>
          <option value="500">Medium (500)</option>
          <option value="600">Semi Bold (600)</option>
          <option value="bold">Bold (700)</option>
          <option value="800">Extra Bold (800)</option>
          <option value="900">Black (900)</option>
        </select>
      </div>

      {/* Text Style Buttons */}
      <div>
        <label className="text-xs text-gray-600 mb-1 block">Text Style</label>
        <div className="flex gap-2">
          <button
            onClick={toggleBold}
            className={`flex-1 px-3 py-2 border rounded text-sm ${
              fontWeight === 'bold' || fontWeight === 700 ? 'bg-primary text-white border-primary' : 'hover:bg-gray-100'
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={toggleItalic}
            className={`flex-1 px-3 py-2 border rounded text-sm ${
              fontStyle === 'italic' ? 'bg-primary text-white border-primary' : 'hover:bg-gray-100'
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={toggleUnderline}
            className={`flex-1 px-3 py-2 border rounded text-sm ${
              textDecoration === 'underline' ? 'bg-primary text-white border-primary' : 'hover:bg-gray-100'
            }`}
            title="Underline"
          >
            <Underline className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={toggleStrikethrough}
            className={`flex-1 px-3 py-2 border rounded text-sm ${
              textDecoration === 'line-through' ? 'bg-primary text-white border-primary' : 'hover:bg-gray-100'
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4 mx-auto" />
          </button>
        </div>
      </div>

      {/* Text Transform */}
      <div>
        <label className="text-xs text-gray-600 mb-1 block">Text Transform</label>
        <select
          value={textTransform}
          onChange={(e) => handleTextTransform(e.target.value as any)}
          className="w-full px-3 py-2 border rounded text-sm"
        >
          <option value="none">None</option>
          <option value="uppercase">UPPERCASE</option>
          <option value="lowercase">lowercase</option>
          <option value="capitalize">Capitalize Each Word</option>
        </select>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="text-xs text-gray-600 mb-2 block">Alignment</label>
        <div className="flex gap-2">
          <button
            onClick={() => handleAlignmentChange('left')}
            className={`flex-1 px-3 py-2 border rounded text-sm ${
              textAlign === 'left' ? 'bg-primary text-white border-primary' : 'hover:bg-gray-100'
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={() => handleAlignmentChange('center')}
            className={`flex-1 px-3 py-2 border rounded text-sm ${
              textAlign === 'center' ? 'bg-primary text-white border-primary' : 'hover:bg-gray-100'
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={() => handleAlignmentChange('right')}
            className={`flex-1 px-3 py-2 border rounded text-sm ${
              textAlign === 'right' ? 'bg-primary text-white border-primary' : 'hover:bg-gray-100'
            }`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={() => handleAlignmentChange('justify')}
            className={`flex-1 px-3 py-2 border rounded text-sm ${
              textAlign === 'justify' ? 'bg-primary text-white border-primary' : 'hover:bg-gray-100'
            }`}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4 mx-auto" />
          </button>
        </div>
      </div>

      {/* Text Color */}
      <div>
        <label className="text-xs text-gray-600 mb-2 block">Text Color</label>
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-full px-3 py-2 border rounded text-sm flex items-center gap-2 hover:bg-gray-50"
          >
            <div
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundColor: textColor }}
            />
            <span className="text-xs font-mono">{textColor}</span>
          </button>
          {showColorPicker && (
            <div className="absolute z-50 mt-2 p-3 bg-white border rounded shadow-lg">
              <HexColorPicker color={textColor} onChange={handleColorChange} />
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded text-xs font-mono"
                  placeholder="#000000"
                />
                <button
                  onClick={() => setShowColorPicker(false)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Line Height */}
      <div>
        <label className="text-xs text-gray-600 mb-1 block">
          Line Height: {lineHeight.toFixed(1)}
        </label>
        <input
          type="range"
          min="0.8"
          max="3.0"
          step="0.1"
          value={lineHeight}
          onChange={(e) => handleLineHeightChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Letter Spacing (Kerning) */}
      <div>
        <label className="text-xs text-gray-600 mb-1 block">
          Letter Spacing: {letterSpacing}px
        </label>
        <input
          type="range"
          min="-50"
          max="200"
          value={letterSpacing}
          onChange={(e) => handleLetterSpacingChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>-50px</span>
          <span>200px</span>
        </div>
      </div>

      {/* Text Effects Section */}
      <div className="border-t pt-4 mt-4">
        <h4 className="text-xs font-semibold text-gray-700 mb-3">Text Effects</h4>

        {/* Text Shadow */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-gray-600">Text Shadow</label>
            <button
              onClick={toggleTextShadow}
              className={`px-2 py-1 rounded text-xs ${
                textShadow.enabled ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {textShadow.enabled ? 'On' : 'Off'}
            </button>
          </div>
          
          {textShadow.enabled && (
            <div className="space-y-2 pl-2 border-l-2 border-gray-200">
              {/* Shadow Color */}
              <div className="relative">
                <label className="text-xs text-gray-500 block mb-1">Color</label>
                <button
                  onClick={() => setShowShadowColorPicker(!showShadowColorPicker)}
                  className="w-full px-2 py-1 border rounded text-xs flex items-center gap-2 hover:bg-gray-50"
                >
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: textShadow.color }}
                  />
                  <span className="font-mono">{textShadow.color}</span>
                </button>
                {showShadowColorPicker && (
                  <div className="absolute z-50 mt-1 p-2 bg-white border rounded shadow-lg">
                    <HexColorPicker 
                      color={textShadow.color} 
                      onChange={(color) => updateTextShadow('color', color)} 
                    />
                    <button
                      onClick={() => setShowShadowColorPicker(false)}
                      className="mt-2 w-full px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              {/* Shadow Blur */}
              <div>
                <label className="text-xs text-gray-500 block mb-1">Blur: {textShadow.blur}px</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={textShadow.blur}
                  onChange={(e) => updateTextShadow('blur', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Shadow Offset */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">X: {textShadow.offsetX}</label>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    value={textShadow.offsetX}
                    onChange={(e) => updateTextShadow('offsetX', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Y: {textShadow.offsetY}</label>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    value={textShadow.offsetY}
                    onChange={(e) => updateTextShadow('offsetY', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Text Stroke */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-gray-600">Text Stroke</label>
            <button
              onClick={toggleTextStroke}
              className={`px-2 py-1 rounded text-xs ${
                textStroke.enabled ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {textStroke.enabled ? 'On' : 'Off'}
            </button>
          </div>
          
          {textStroke.enabled && (
            <div className="space-y-2 pl-2 border-l-2 border-gray-200">
              {/* Stroke Color */}
              <div className="relative">
                <label className="text-xs text-gray-500 block mb-1">Color</label>
                <button
                  onClick={() => setShowStrokeColorPicker(!showStrokeColorPicker)}
                  className="w-full px-2 py-1 border rounded text-xs flex items-center gap-2 hover:bg-gray-50"
                >
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: textStroke.color }}
                  />
                  <span className="font-mono">{textStroke.color}</span>
                </button>
                {showStrokeColorPicker && (
                  <div className="absolute z-50 mt-1 p-2 bg-white border rounded shadow-lg">
                    <HexColorPicker 
                      color={textStroke.color} 
                      onChange={(color) => updateTextStroke('color', color)} 
                    />
                    <button
                      onClick={() => setShowStrokeColorPicker(false)}
                      className="mt-2 w-full px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              {/* Stroke Width */}
              <div>
                <label className="text-xs text-gray-500 block mb-1">Width: {textStroke.width}px</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={textStroke.width}
                  onChange={(e) => updateTextStroke('width', Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Text Background */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-gray-600">Background Highlight</label>
            <button
              onClick={toggleTextBackground}
              className={`px-2 py-1 rounded text-xs ${
                textBackground.enabled ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {textBackground.enabled ? 'On' : 'Off'}
            </button>
          </div>
          
          {textBackground.enabled && (
            <div className="pl-2 border-l-2 border-gray-200">
              {/* Background Color */}
              <div className="relative">
                <label className="text-xs text-gray-500 block mb-1">Color</label>
                <button
                  onClick={() => setShowBackgroundColorPicker(!showBackgroundColorPicker)}
                  className="w-full px-2 py-1 border rounded text-xs flex items-center gap-2 hover:bg-gray-50"
                >
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: textBackground.color }}
                  />
                  <span className="font-mono">{textBackground.color}</span>
                </button>
                {showBackgroundColorPicker && (
                  <div className="absolute z-50 mt-1 p-2 bg-white border rounded shadow-lg">
                    <HexColorPicker 
                      color={textBackground.color} 
                      onChange={updateTextBackground} 
                    />
                    <button
                      onClick={() => setShowBackgroundColorPicker(false)}
                      className="mt-2 w-full px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

