export type TemplateCategory = 'invitations' | 'cards' | 'menus' | 'programs' | 'signs' | 'signage' | 'details' | 'favor-tags' | 'seating';

export type WeddingTemplate = {
  id: string;
  name: string;
  category: TemplateCategory;
  width: number; // pixels @ 300 DPI
  height: number;
  description: string;
  popular?: boolean;
};

export const TEMPLATE_CATEGORIES = [
  { id: 'invitations', name: 'Invitations & Suites', icon: '💌' },
  { id: 'cards', name: 'Cards & Enclosures', icon: '🎴' },
  { id: 'menus', name: 'Menus & Programs', icon: '📋' },
  { id: 'signs', name: 'Welcome & Ceremony Signs', icon: '🪧' },
  { id: 'signage', name: 'Reception Signage', icon: '📍' },
  { id: 'details', name: 'Place Cards & Details', icon: '🏷️' },
  { id: 'favor-tags', name: 'Favor Tags & Labels', icon: '🎁' },
  { id: 'seating', name: 'Seating Charts', icon: '🪑' },
] as const;

export const WEDDING_TEMPLATES: WeddingTemplate[] = [
  // Invitations & Suites
  {
    id: 'invitation-5x7',
    name: '5×7 Invitation',
    category: 'invitations',
    width: 1500,
    height: 2100,
    description: 'Standard wedding invitation',
    popular: true,
  },
  {
    id: 'invitation-5.5x8.5',
    name: '5.5×8.5 Invitation',
    category: 'invitations',
    width: 1650,
    height: 2550,
    description: 'Tall invitation format',
  },
  {
    id: 'invitation-6x9',
    name: '6×9 Invitation',
    category: 'invitations',
    width: 1800,
    height: 2700,
    description: 'Large invitation',
  },
  {
    id: 'invitation-square-5.5',
    name: '5.5×5.5 Square Invitation',
    category: 'invitations',
    width: 1650,
    height: 1650,
    description: 'Modern square format',
  },
  {
    id: 'save-the-date-5x7',
    name: '5×7 Save the Date',
    category: 'invitations',
    width: 1500,
    height: 2100,
    description: 'Save the date card',
    popular: true,
  },

  // Cards & Enclosures
  {
    id: 'rsvp-4x6',
    name: '4×6 RSVP Card',
    category: 'cards',
    width: 1200,
    height: 1800,
    description: 'Standard RSVP response card',
    popular: true,
  },
  {
    id: 'rsvp-postcard',
    name: '4×6 RSVP Postcard',
    category: 'cards',
    width: 1200,
    height: 1800,
    description: 'Postcard-style RSVP',
  },
  {
    id: 'details-4x6',
    name: '4×6 Details Card',
    category: 'cards',
    width: 1200,
    height: 1800,
    description: 'Accommodation & directions',
  },
  {
    id: 'thank-you-4x6',
    name: '4×6 Thank You Card',
    category: 'cards',
    width: 1200,
    height: 1800,
    description: 'Post-wedding thank you',
  },
  {
    id: 'thank-you-5x7',
    name: '5×7 Thank You Card',
    category: 'cards',
    width: 1500,
    height: 2100,
    description: 'Folded thank you card',
  },

  // Menus & Programs
  {
    id: 'menu-4x9',
    name: '4×9 Menu',
    category: 'menus',
    width: 1200,
    height: 2700,
    description: 'Tall menu card',
    popular: true,
  },
  {
    id: 'menu-5x7',
    name: '5×7 Menu',
    category: 'menus',
    width: 1500,
    height: 2100,
    description: 'Standard menu card',
  },
  {
    id: 'menu-bifold',
    name: '5.5×8.5 Bifold Menu',
    category: 'menus',
    width: 1650,
    height: 2550,
    description: 'Folded menu',
  },
  {
    id: 'program-5x7',
    name: '5×7 Program',
    category: 'menus',
    width: 1500,
    height: 2100,
    description: 'Ceremony program',
  },
  {
    id: 'program-bifold',
    name: '5.5×8.5 Bifold Program',
    category: 'menus',
    width: 1650,
    height: 2550,
    description: 'Folded program',
  },

  // Welcome & Ceremony Signs
  {
    id: 'welcome-18x24',
    name: '18×24 Welcome Sign',
    category: 'signs',
    width: 5400,
    height: 7200,
    description: 'Large welcome sign',
    popular: true,
  },
  {
    id: 'welcome-24x36',
    name: '24×36 Welcome Sign',
    category: 'signs',
    width: 7200,
    height: 10800,
    description: 'Extra large welcome',
  },
  {
    id: 'ceremony-sign-16x20',
    name: '16×20 Ceremony Sign',
    category: 'signs',
    width: 4800,
    height: 6000,
    description: 'Ceremony entrance',
  },
  {
    id: 'unplugged-8x10',
    name: '8×10 Unplugged Ceremony',
    category: 'signs',
    width: 2400,
    height: 3000,
    description: 'No phones reminder',
  },

  // Reception Signage
  {
    id: 'bar-sign-11x14',
    name: '11×14 Bar Sign',
    category: 'signage',
    width: 3300,
    height: 4200,
    description: 'Bar menu sign',
    popular: true,
  },
  {
    id: 'bar-sign-16x20',
    name: '16×20 Bar Sign',
    category: 'signage',
    width: 4800,
    height: 6000,
    description: 'Large bar menu',
  },
  {
    id: 'signature-cocktail-5x7',
    name: '5×7 Signature Cocktail',
    category: 'signage',
    width: 1500,
    height: 2100,
    description: 'Cocktail description',
  },
  {
    id: 'dessert-sign-8x10',
    name: '8×10 Dessert Sign',
    category: 'signage',
    width: 2400,
    height: 3000,
    description: 'Dessert table sign',
  },
  {
    id: 'guestbook-8x10',
    name: '8×10 Guestbook Sign',
    category: 'signage',
    width: 2400,
    height: 3000,
    description: 'Guestbook instructions',
  },
  {
    id: 'favors-5x7',
    name: '5×7 Favors Sign',
    category: 'signage',
    width: 1500,
    height: 2100,
    description: 'Favor table sign',
  },

  // Place Cards & Details
  {
    id: 'place-card-2x3.5',
    name: '2×3.5 Place Card',
    category: 'details',
    width: 600,
    height: 1050,
    description: 'Guest name cards',
    popular: true,
  },
  {
    id: 'place-card-tent',
    name: '2×3.5 Tent Place Card',
    category: 'details',
    width: 1200,
    height: 1050,
    description: 'Folded place card',
  },
  {
    id: 'escort-card-2.5x3.5',
    name: '2.5×3.5 Escort Card',
    category: 'details',
    width: 750,
    height: 1050,
    description: 'Table assignment',
  },
  {
    id: 'table-number-4x6',
    name: '4×6 Table Number',
    category: 'details',
    width: 1200,
    height: 1800,
    description: 'Table number card',
  },
  {
    id: 'table-number-5x7',
    name: '5×7 Table Number',
    category: 'details',
    width: 1500,
    height: 2100,
    description: 'Large table number',
  },

  // Favor Tags & Labels
  {
    id: 'favor-tag-2x3',
    name: '2×3 Favor Tag',
    category: 'favor-tags',
    width: 600,
    height: 900,
    description: 'Gift tag',
  },
  {
    id: 'favor-tag-circle',
    name: '2.5" Round Favor Tag',
    category: 'favor-tags',
    width: 750,
    height: 750,
    description: 'Circular tag',
  },
  {
    id: 'bottle-label-3x4',
    name: '3×4 Bottle Label',
    category: 'favor-tags',
    width: 900,
    height: 1200,
    description: 'Wine/water label',
  },
  {
    id: 'sticker-2inch',
    name: '2" Round Sticker',
    category: 'favor-tags',
    width: 600,
    height: 600,
    description: 'Circular sticker',
  },

  // Seating Charts
  {
    id: 'seating-18x24',
    name: '18×24 Seating Chart',
    category: 'seating',
    width: 5400,
    height: 7200,
    description: 'Guest seating display',
    popular: true,
  },
  {
    id: 'seating-24x36',
    name: '24×36 Seating Chart',
    category: 'seating',
    width: 7200,
    height: 10800,
    description: 'Large seating chart',
  },
  {
    id: 'seating-30x40',
    name: '30×40 Seating Chart',
    category: 'seating',
    width: 9000,
    height: 12000,
    description: 'Extra large chart',
  },
];

