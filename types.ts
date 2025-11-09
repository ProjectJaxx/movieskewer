export interface MediaItem {
  title: string;
  year: number;
  plot: string;
  genre: string;
  posterUrl: string;
  actors: string[];
  director: string;
  trailerUrl?: string;
}

export interface MediaSuggestions {
  top: MediaItem[];
  random: MediaItem[];
}

export type SuggestionFlavor = 'default' | 'obscure' | 'international' | 'top-rated';

export interface SearchParams {
    description: string;
    startYear: number;
    endYear: number;
    mediaType: 'movie' | 'tv';
    flavor: SuggestionFlavor;
    genre: string;
}