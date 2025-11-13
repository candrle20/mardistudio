'use client';

import { useEffect } from 'react';

export function GoogleFontsLoader() {
  useEffect(() => {
    const fonts = [
      'Inter',
      'Playfair+Display',
      'Cormorant+Garamond',
      'Dancing+Script',
      'Great+Vibes',
      'Montserrat',
      'Open+Sans',
      'Lato',
      'Roboto',
      'Poppins',
    ];

    // Load Google Fonts
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${fonts.map(f => `family=${f}:wght@300;400;500;600;700`).join('&')}&display=swap`;
    document.head.appendChild(link);
  }, []);

  return null;
}

