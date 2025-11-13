export type StationerySize = {
  name: string;
  width: number; // pixels @ 300 DPI
  height: number;
  description: string;
};

export const STATIONERY_SIZES: StationerySize[] = [
  {
    name: '5×7 Invitation',
    width: 1500, // 5" @ 300 DPI
    height: 2100, // 7" @ 300 DPI
    description: 'Standard wedding invitation',
  },
  {
    name: '4×6 RSVP Card',
    width: 1200, // 4" @ 300 DPI
    height: 1800, // 6" @ 300 DPI
    description: 'RSVP response card',
  },
  {
    name: '4×6 Thank You',
    width: 1200,
    height: 1800,
    description: 'Thank you card',
  },
  {
    name: '5×7 Menu',
    width: 1500,
    height: 2100,
    description: 'Reception menu card',
  },
  {
    name: '4×9 Program',
    width: 1200,
    height: 2700, // 9" @ 300 DPI
    description: 'Wedding ceremony program',
  },
  {
    name: 'A7 Envelope',
    width: 1050, // 3.5" @ 300 DPI
    height: 1500, // 5" @ 300 DPI
    description: 'A7 envelope liner',
  },
];

export type StationeryTemplate = {
  id: string;
  name: string;
  type: 'invitation' | 'rsvp' | 'menu' | 'program' | 'thank-you' | 'envelope';
  size: StationerySize;
  preview: string; // URL or data URL
  description: string;
};

export const STATIONERY_TEMPLATES: StationeryTemplate[] = [
  {
    id: 'classic-elegant',
    name: 'Classic Elegant',
    type: 'invitation',
    size: STATIONERY_SIZES[0],
    preview: '',
    description: 'Timeless design with elegant typography',
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    type: 'invitation',
    size: STATIONERY_SIZES[0],
    preview: '',
    description: 'Clean lines and modern aesthetics',
  },
  {
    id: 'botanical-garden',
    name: 'Botanical Garden',
    type: 'invitation',
    size: STATIONERY_SIZES[0],
    preview: '',
    description: 'Floral and botanical illustrations',
  },
  {
    id: 'vintage-romance',
    name: 'Vintage Romance',
    type: 'invitation',
    size: STATIONERY_SIZES[0],
    preview: '',
    description: 'Romantic vintage-inspired design',
  },
  {
    id: 'rsvp-simple',
    name: 'Simple RSVP',
    type: 'rsvp',
    size: STATIONERY_SIZES[1],
    preview: '',
    description: 'Clean RSVP card design',
  },
  {
    id: 'menu-elegant',
    name: 'Elegant Menu',
    type: 'menu',
    size: STATIONERY_SIZES[3],
    preview: '',
    description: 'Formal menu card design',
  },
];

export type StationeryTemplateType =
  | 'invitation'
  | 'menu'
  | 'program'
  | 'rsvp'
  | 'thank-you'
  | 'envelope'
  | 'sign'
  | 'blank';

export interface TemplateDimensions {
  width: number;
  height: number;
}

