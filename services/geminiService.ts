import { GoogleGenAI, Type } from "@google/genai";
import { MediaSuggestions, SearchParams, SuggestionFlavor } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const mediaSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'The full title of the movie or TV show.',
    },
    year: {
      type: Type.INTEGER,
      description: 'The year the movie or TV show was first released.',
    },
    plot: {
      type: Type.STRING,
      description: "A brief, engaging summary of the movie's plot.",
    },
    genre: {
      type: Type.STRING,
      description: 'The primary genre of the movie (e.g., Sci-Fi, Comedy, Drama).',
    },
    posterUrl: {
      type: Type.STRING,
      description: "A direct URL to a high-quality poster image.",
    },
    actors: {
        type: Type.ARRAY,
        description: "A list of the main actors.",
        items: { type: Type.STRING },
    },
    director: {
        type: Type.STRING,
        description: "The director (for movies) or the primary creator/showrunner (for TV shows).",
    },
    trailerUrl: {
        type: Type.STRING,
        description: "A direct URL to an official YouTube trailer. Should start with 'https://www.youtube.com/'. Can be empty if no official trailer is found.",
    }
  },
  required: ['title', 'year', 'plot', 'genre', 'posterUrl', 'actors', 'director'],
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    top: {
      type: Type.ARRAY,
      description: "The top 2 most relevant suggestions based on the user's criteria.",
      items: mediaSchema,
    },
    random: {
      type: Type.ARRAY,
      description: "3 additional, more varied suggestions that still fit the criteria.",
      items: mediaSchema,
    }
  },
  required: ['top', 'random'],
  description: 'A list of movie or TV show suggestions categorized into top and random picks.',
};

const getFlavorPromptSegment = (flavor: SuggestionFlavor): string => {
    switch (flavor) {
        case 'obscure':
            return "Crucially, focus on more obscure, indie, or lesser-known titles that are not mainstream blockbusters.";
        case 'international':
            return "Crucially, prioritize international and non-Hollywood films from a diverse range of countries.";
        case 'top-rated':
            return "Crucially, focus only on critically acclaimed, award-winning, and top-rated suggestions.";
        case 'default':
        default:
            return "Provide a balanced mix of popular and interesting suggestions.";
    }
}

const getGenrePromptSegment = (genre: string): string => {
    if (genre && genre !== 'Any Genre') {
        return `The suggestions must belong to the '${genre}' genre.`;
    }
    return '';
}

export const getMediaSuggestions = async (params: SearchParams): Promise<MediaSuggestions> => {
  const { description, startYear, endYear, mediaType, flavor, genre } = params;
  const mediaTypeString = mediaType === 'movie' ? 'movies' : 'TV shows';
  const flavorSegment = getFlavorPromptSegment(flavor);
  const genreSegment = getGenrePromptSegment(genre);

  const prompt = `
    Based on the following description, suggest some ${mediaTypeString} released between the years ${startYear} and ${endYear}.
    Description: "${description}"

    ${genreSegment}
    ${flavorSegment}

    Please provide a diverse list of ${mediaTypeString} that fit the description, structured as follows:
    1.  Give me the top 2 best-fitting suggestions.
    2.  Give me 3 other random, but still relevant, suggestions to provide variety.

    For each suggestion, I need the title, release year, a short plot summary, the main genre, the director (or creator for TV shows), a list of the top 3-4 main actors, a direct URL for a high-quality poster image, and a direct URL to its official YouTube trailer.
    If you can only find one or two suggestions in total, that's okay, just return what you can find in the 'top' category and leave 'random' empty.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const suggestions = JSON.parse(jsonText);
    
    // Ensure the response has the expected structure
    if (!suggestions.top || !suggestions.random) {
        throw new Error("AI response did not match the expected format.");
    }

    return suggestions as MediaSuggestions;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    throw new Error("Failed to get suggestions from the AI. Please check your query or API key.");
  }
};