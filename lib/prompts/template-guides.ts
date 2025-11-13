import type { StationeryTemplateType } from '@/types/stationery';

interface TemplatePromptGuide {
  label: string;
  summary: string;
  layout: string;
  typography: string;
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
    label: 'wedding invitation border (decorative only, no text)',
    summary:
      'Decorative border design with blank center. Border-only, no text/typography.',
    layout:
      '',
    typography:
      '',
    imagery:
      'Elegant florals, watercolor washes, metallic foil along borders and corners only. Blank center.',
    finishingTouches:
      'Optional corner monogram, letterpress texture, soft lighting.',
    tone: 'Luxurious, romantic',
  },
  menu: {
    label: 'menu border (decorative only, no text)',
    summary:
      'Decorative border for menu. Border-only, no text/menu items.',
    layout:
      '',
    typography:
      '',
    imagery:
      'Minimal botanical accents or line art along borders and corners. Blank center.',
    finishingTouches:
      'Paper grain, gold foil edging, gentle shadows.',
    tone: 'Refined, elegant',
  },
  program: {
    label: 'program border (decorative only, no text)',
    summary:
      'Decorative border for program. Border-only, no text/details.',
    layout:
      '',
    typography:
      '',
    imagery:
      'Delicate borders, filigree, crest at top/bottom edges. Light background, blank center.',
    finishingTouches:
      'Corner icons, soft gradient along borders.',
    tone: 'Graceful, elegant',
  },
  rsvp: {
    label: 'RSVP border (decorative only, no text)',
    summary:
      'Decorative border for RSVP. Border-only, no text/forms.',
    layout:
      '',
    typography:
      '',
    imagery:
      'Light floral or border motifs around edges. Blank center.',
    finishingTouches:
      'Letterpress texture, subtle embossing.',
    tone: 'Inviting, elegant',
  },
  'thank-you': {
    label: 'thank-you border (decorative only, no text)',
    summary:
      'Decorative border for thank-you card. Border-only, no text.',
    layout:
      '',
    typography:
      '',
    imagery:
      'Delicate floral sprays, watercolor, monogram along borders. Blank center.',
    finishingTouches:
      'Foil or deboss effects, soft shadows.',
    tone: 'Warm, gracious',
  },
  envelope: {
    label: 'envelope border (decorative only, no text)',
    summary:
      'Decorative corners for envelope. Border-only, no addresses.',
    layout:
      '',
    typography:
      '',
    imagery:
      'Corner florals, crest, border patterns in corners. Blank center.',
    finishingTouches:
      'Wax seal in corners, liner pattern hints.',
    tone: 'Gracious, polished',
  },
  sign: {
    label: 'welcome sign border (decorative only, no text)',
    summary:
      'Bold decorative border for sign. Border-only, no text.',
    layout:
      '',
    typography:
      '',
    imagery:
      'Statement florals, botanical wreaths framing edges. Wood/acrylic/canvas suitable. Blank center.',
    finishingTouches:
      'Wood/acrylic textures, greenery accents on edges.',
    tone: 'Bold, welcoming',
  },
  blank: {
    label: 'stationery border (decorative only, no text)',
    summary:
      'Versatile decorative border. Border-only, no text.',
    layout:
      '',
    typography:
      '',
    imagery:
      'Refined borders, elegant motifs along edges. Blank center.',
    finishingTouches:
      'Premium finishes, foil, embossing.',
    tone: 'Sophisticated, adaptable',
  },
};

const DEFAULT_NEGATIVE_PROMPT =
  'text, typography, letters, words, calligraphy, names, dates, writing, clutter, cartoon, bright primary colors, low resolution, watermark';

export function buildTemplatePrompt({
  basePrompt,
  templateType,
  templateName,
  width,
  height,
}: TemplatePromptOptions): { prompt: string; negativePrompt: string } {
  const guide = TEMPLATE_PROMPT_GUIDES[templateType] ?? TEMPLATE_PROMPT_GUIDES.blank;
  const cleanedBase = basePrompt.trim();
  const orientation = width && height ? (width >= height ? 'landscape' : 'portrait') : undefined;
  const aspectRatio = width && height ? (width / height).toFixed(2) : undefined;

  const segments: string[] = [
    `Create a ${guide.label}${templateName ? ` called "${templateName}"` : ''}. ${guide.tone}.`,
    guide.summary,
    guide.imagery,
    guide.finishingTouches,
    'Print-ready at 300 DPI with elegant wedding color palettes (ivories, blush, sage, gold, warm neutrals).',
  ];

  if (orientation) {
    segments.push(`Canvas orientation: ${orientation}.`);
  }

  if (aspectRatio) {
    segments.push(`Target aspect ratio: approximately ${aspectRatio}:1 to fit the template dimensions (${width}x${height} px).`);
  }

  if (cleanedBase) {
    segments.push(`Incorporate the client request: ${cleanedBase}.`);
  }

  segments.push('Deliver a cohesive composition where decorative elements frame or support the typography without obscuring readability.');
  segments.push(`Avoid the following: ${DEFAULT_NEGATIVE_PROMPT}.`);

  return {
    prompt: segments.join(' '),
    negativePrompt: DEFAULT_NEGATIVE_PROMPT,
  };
}
