import { GoogleGenAI, Type } from "@google/genai";
import { MovieSuggestions, SearchParams } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const movieSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'The full title of the movie.',
    },
    year: {
      type: Type.INTEGER,
      description: 'The year the movie was released.',
    },
    plot: {
      type: Type.STRING,
      description: 'A brief, engaging summary of the movie\'s plot.',
    },
    genre: {
      type: Type.STRING,
      description: 'The primary genre of the movie (e.g., Sci-Fi, Comedy, Drama).',
    },
  },
  required: ['title', 'year', 'plot', 'genre'],
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    top: {
      type: Type.ARRAY,
      description: "The top 2 most relevant movie suggestions based on the user's criteria.",
      items: movieSchema,
    },
    random: {
      type: Type.ARRAY,
      description: "3 additional, more varied or random movie suggestions that still fit the criteria.",
      items: movieSchema,
    }
  },
  required: ['top', 'random'],
  description: 'A list of movie suggestions categorized into top and random picks.',
};


export const getMovieSuggestions = async (params: SearchParams): Promise<MovieSuggestions> => {
  const { description, startYear, endYear } = params;

  const prompt = `
    Based on the following description, suggest some movies released between the years ${startYear} and ${endYear}.
    Description: "${description}"

    Please provide a diverse list of movies that fit the description, structured as follows:
    1.  Give me the top 2 best-fitting movie suggestions.
    2.  Give me 3 other random, but still relevant, suggestions to provide variety.

    For each movie, I need the title, release year, a short plot summary, and the main genre.
    If you can only find one or two movies in total, that's okay, just return what you can find in the 'top' category and leave 'random' empty.
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

    return suggestions as MovieSuggestions;
  } catch (error) {
    console.error("Error fetching movie suggestions:", error);
    throw new Error("Failed to get movie suggestions from the AI. Please check your query or API key.");
  }
};