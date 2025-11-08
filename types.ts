export interface Movie {
  title: string;
  year: number;
  plot: string;
  genre: string;
}

export interface MovieSuggestions {
  top: Movie[];
  random: Movie[];
}

export interface SearchParams {
    description: string;
    startYear: number;
    endYear: number;
}