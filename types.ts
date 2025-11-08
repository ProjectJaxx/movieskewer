export interface MediaItem {
  title: string;
  year: number;
  plot: string;
  genre: string;
  posterUrl: string;
  actors: string[];
  director: string;
}

export interface MediaSuggestions {
  top: MediaItem[];
  random: MediaItem[];
}

export interface SearchParams {
    description: string;
    startYear: number;
    endYear: number;
    mediaType: 'movie' | 'tv';
}