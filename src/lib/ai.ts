import { GoogleGenAI } from "@google/genai";
import { prisma } from "./prisma";

export interface MovieRecommendation {
  movieId?: string; // Gemini won’t return TMDB id directly
  title: string;
  reason: string;
  confidence: number;
}

export interface MovieAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  themes: string[];
  targetAudience: string;
  contentWarnings: string[];
  summary: string;
}

export interface AISearchSuggestion {
  query: string;
  type: 'genre' | 'mood' | 'actor' | 'director' | 'year' | 'general';
  confidence: number;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });

export class AIServiceGemini {

  // Fetch user watchlist and generate recommendations
  static async getPersonalizedRecommendations(
    userId: string,
    userPreferences?: string
  ): Promise<MovieRecommendation[]> {
    try {
      // 1️⃣ Fetch watchlist from DB
      const watchlist = await prisma.watchlist.findMany({
        where: { userId },
      });

      if (!watchlist.length) return [];

      // 2️⃣ Map to AI format
      const watchlistTitles = watchlist.map(item => item.title).join(", ");

      // 3️⃣ Generate prompt
      const prompt = `
        Based on these movies: ${watchlistTitles}
        ${userPreferences ? `User preferences: ${userPreferences}` : ""}

        Recommend 5 movies the user might enjoy. Include:
        - title
        - reason
        - confidence (1-10)

        Format as JSON:
        { "recommendations": [{ "title": "...", "reason": "...", "confidence": 8 }] }
      `;

      // 4️⃣ Call Gemini
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const parsed = JSON.parse(response.text ?? "{}");
      return parsed.recommendations || [];
    } catch (err) {
      console.error("Gemini recommendation error:", err);
      return [];
    }
  }

  // Generate movie description
  static async generateMovieDescription(
    title: string,
    overview: string,
    genres: string[],
    releaseYear: number
  ): Promise<string> {
    const prompt = `
      Create a 2-3 sentence engaging movie description for "${title ?? ""}" (${releaseYear}).
      Original overview: ${overview ?? ""}
      Genres: ${genres.join(", ")}
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      return response.text ?? overview;
    } catch (err) {
      console.error("Gemini description error:", err);
      return overview;
    }
  }

  // Analyze movie content
  static async analyzeMovie(
    title: string,
    overview: string,
    genres: string[]
  ): Promise<MovieAnalysis> {
    const prompt = `
      Analyze the movie "${title ?? ""}" with overview: ${overview ?? ""} and genres: ${genres.join(", ")}.
      Provide JSON:
      {
        "sentiment": "positive/negative/neutral",
        "themes": ["theme1", "theme2"],
        "targetAudience": "audience description",
        "contentWarnings": ["warning1"],
        "summary": "brief summary"
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      return JSON.parse(response.text ?? "{}") as MovieAnalysis;
    } catch (err) {
      console.error("Gemini analysis error:", err);
      return {
        sentiment: "neutral",
        themes: [],
        targetAudience: "General",
        contentWarnings: [],
        summary: overview,
      };
    }
  }

  // AI search suggestions
  static async getSearchSuggestions(
    query: string,
    searchHistory: string[]
  ): Promise<AISearchSuggestion[]> {
    const prompt = `
      Based on search query "${query ?? ""}" and history: ${searchHistory.join(", ")},
      provide 3-5 suggestions in JSON:
      { "suggestions": [{"query": "term", "type": "genre", "confidence": 8}] }
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      const parsed = JSON.parse(response.text ?? "{}");
      return parsed.suggestions || [];
    } catch (err) {
      console.error("Gemini search suggestion error:", err);
      return [];
    }
  }

  // Natural language search
  static async processNaturalLanguageSearch(
    query: string
  ): Promise<{ searchTerm: string; filters: Record<string, string> }> {
    const prompt = `
      Process this search query: "${query ?? ""}".
      Extract main search term and filters (genre, year, rating) in JSON:
      { "searchTerm": "term", "filters": {"genre": "action"} }
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      return JSON.parse(response.text ?? "{}");
    } catch (err) {
      console.error("Gemini NL search error:", err);
      return { searchTerm: query, filters: {} };
    }
  }
}
