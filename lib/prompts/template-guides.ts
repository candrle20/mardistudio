import type { StationeryTemplateType } from '@/types/stationery';

interface TemplatePromptGuide {
  label: string;
  summary: string;
  layout: string;
  typography: string; // Note: We instruct model NOT to generate text, but this helps define the *space* for it
  imagery: string;
  finishingTouches: string;
  tone: string;
}

export interface TemplatePromptOptions {
  basePrompt: string;
  templateType: StationeryTemplateType;
  templateName?: string;
  width?: number;
  height?: number;
}

const TEMPLATE_PROMPT_GUIDES: Record<StationeryTemplateType, TemplatePromptGuide> = {
  invitation: {
    label: 'wedding invitation border',
    summary: 'A sophisticated wedding invitation design featuring a decorative border/frame. The center must remain completely blank white space for text.',
    layout: 'Structured border layout (rectangular or arch) with balanced negative space in the center.',
    typography: 'Leave space for elegant serif or script typography (do not generate actual text).',
    imagery: 'Floral arrangements, botanicals, or architectural details integrated into the border frame.',
    finishingTouches: 'Subtle watercolor textures, metallic foil accents, or letterpress details.',
    tone: 'Romantic, timeless, and elegant.',
  },
  menu: {
    label: 'wedding menu card',
    summary: 'A refined wedding menu card design with top/bottom or side accents. The center body must remain blank for menu items.',
    layout: 'Vertical list format with header/footer decoration or slim side borders.',
    typography: 'Space for header and list items (do not generate text).',
    imagery: 'Minimalist botanical sprigs, fine line art, or crest details.',
    finishingTouches: 'Textured paper background, clean lines.',
    tone: 'Appetizing, polished, and organized.',
  },
  program: {
    label: 'ceremony program fan or card',
    summary: 'A wedding ceremony program design. Focus on readable layout with decorative header or border.',
    layout: 'Clean vertical layout with distinct sections defined by whitespace.',
    typography: 'Space for order of events (do not generate text).',
    imagery: 'Soft floral vignettes or monogram crest at the top.',
    finishingTouches: 'Soft color washes, airy composition.',
    tone: 'Informative but graceful.',
  },
  rsvp: {
    label: 'RSVP response card',
    summary: 'A compact RSVP card design. Decorative elements should be minimal to allow writing space.',
    layout: 'Small format (often 4x6 or 3.5x5), open layout.',
    typography: 'Space for form fields (do not generate text).',
    imagery: 'Small corner accents or a bottom border.',
    finishingTouches: 'Cohesive with the main invitation suite.',
    tone: 'Prompt and polite.',
  },
  'thank-you': {
    label: 'thank you note',
    summary: 'A folded or flat thank you card design. Visuals should be warm and personal.',
    layout: 'Simple border or top-centered focal point.',
    typography: 'Large open space for handwritten notes.',
    imagery: 'Single flower stem, monogram, or "Thank You" calligraphy style banner (optional).',
    finishingTouches: 'Warm tones, personal feel.',
    tone: 'Gratitude and warmth.',
  },
  envelope: {
    label: 'envelope liner or corner design',
    summary: 'Decorative design for an envelope liner or exterior corner.',
    layout: 'Patterned fill for liner, or isolated corner motif for exterior.',
    typography: 'No text.',
    imagery: 'Repeating patterns, vintage stamps, or calligraphy flourishes.',
    finishingTouches: 'Vintage paper texture, wax seal aesthetics.',
    tone: 'Anticipation and preview.',
  },
  sign: {
    label: 'large format welcome sign',
    summary: 'A large wedding welcome sign design. Bold and legible from a distance.',
    layout: 'Poster format with large central void.',
    typography: 'Space for large header names.',
    imagery: 'Large scale floral swags or corner arrangements.',
    finishingTouches: 'Easel texture, acrylic or wood background simulation.',
    tone: 'Grand and welcoming.',
  },
  blank: {
    label: 'stationery border',
    summary: 'A versatile general-purpose stationery design with a decorative frame.',
    layout: 'Classic frame or border.',
    typography: 'Open central area.',
    imagery: 'Decorative motifs suitable for various uses.',
    finishingTouches: 'High quality print finish simulation.',
    tone: 'Adaptable and stylish.',
  },
};

const DEFAULT_NEGATIVE_PROMPT =
  'text, typography, letters, words, writing, font, signature, watermark, copyright, blurry, low quality, distorted, ugly, pixelated, cartoon, anime, 3d render, bright neon colors';

export function buildTemplatePrompt({
  basePrompt,
  templateType,
  templateName,
  width,
  height,
}: TemplatePromptOptions): { prompt: string; negativePrompt: string } {
  const guide = TEMPLATE_PROMPT_GUIDES[templateType] ?? TEMPLATE_PROMPT_GUIDES.blank;
  const cleanedBase = basePrompt.trim();
  const orientation = width && height ? (width >= height ? 'landscape' : 'portrait') : 'portrait';
  
  // Construct a structured prompt for Nano Banana
  const instructions = [
    `TASK: Design a ${guide.label}${templateName ? ` named "${templateName}"` : ''}.`,
    `STYLE & TONE: ${guide.tone}`,
    `LAYOUT RULE: ${guide.layout}`,
    `IMAGERY GUIDANCE: ${guide.imagery}`,
    `FINISHING: ${guide.finishingTouches}`,
    `\nCRITICAL CONSTRAINT: ${guide.summary}`,
  ];

  if (cleanedBase) {
    instructions.push(`\nUSER REQUEST: "${cleanedBase}"`);
    instructions.push(`INSTRUCTION: Prioritize the User Request while maintaining the structural constraints of a ${guide.label}.`);
  }

  // Add explicit blending instructions
  instructions.push(`\nSYNTHESIS INSTRUCTION: Combine the structural composition of the LAYOUT REFERENCE with the specific DECORATIVE ELEMENTS provided.`);
  instructions.push(`1. Extract the border shape, white space distribution, and color palette from the LAYOUT REFERENCE.`);
  instructions.push(`2. Populate that structure using ONLY the visual style and subject matter of the DECORATIVE ELEMENTS (e.g., if elements are watercolors, paint the border in watercolor; if they are gold foil, use gold foil).`);
  instructions.push(`3. Ensure the center remains 100% BLANK for future text.`);

  return {
    prompt: instructions.join('\n'),
    negativePrompt: DEFAULT_NEGATIVE_PROMPT,
  };
}
