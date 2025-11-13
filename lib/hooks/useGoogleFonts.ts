'use client';

import { useEffect } from 'react';

// Load Google Fonts dynamically
export function useGoogleFonts() {
  useEffect(() => {
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

    // Create link elements for each font
    fonts.forEach((font) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
      document.head.appendChild(link);
    });
  }, []);
}

