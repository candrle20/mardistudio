import styles from '@/config/artist-styles.json';

type StyleKey = keyof typeof styles;

export interface ArtistStyle {
  id: string;
  name: string;
  artistName: string;
  promptModifier: string;
  negativePrompt?: string;
  thumbnailUrl?: string;
}

export const ARTIST_STYLES: Record<string, ArtistStyle> = styles as Record<string, ArtistStyle>;

export function getStyle(styleId: string): ArtistStyle | undefined {
  return ARTIST_STYLES[styleId as StyleKey];
}

export function enhancePromptWithStyle(
  prompt: string,
  styleId: string
): { prompt: string; negativePrompt?: string } {
  const style = getStyle(styleId);
  if (!style) {
    return { 
      prompt,
      negativePrompt: 'text, typography, letters, words, calligraphy, names, dates'
    };
  }

  const enhancedPrompt = `${prompt.trim()}, ${style.promptModifier}. Wedding stationery border design with blank center - no text.`;

  const enhancedNegativePrompt = style.negativePrompt 
    ? `${style.negativePrompt}, text, typography, letters, words, names, dates`
    : 'text, typography, letters, words, calligraphy, names, dates';

  return {
    prompt: enhancedPrompt,
    negativePrompt: enhancedNegativePrompt,
  };
}

