import { GoogleGenAI } from "@google/genai";
import { prisma } from "./prisma";

export interface MovieRecommendation {
  movieId?: string; // Gemini won't return TMDB ID directly
  title: string;
  reason: string;
  confidence: number;
}

export interface MovieAnalysis {
  sentiment: "positive" | "negative" | "neutral";
  themes: string[];
  targetAudience: string;
  contentWarnings: string[];
  summary: string;
}

export interface AISearchSuggestion {
  query: string;
  type: "genre" | "mood" | "actor" | "director" | "year" | "general";
  confidence: number;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Helper to safely parse JSON responses from Gemini
function safeParseJSON<T>(text: string | undefined, fallback: T): T {
  if (!text) return fallback;
  try {
    // Remove Markdown code blocks (```json ... ```)
    const cleaned = text.replace(/```(?:json)?/g, "").trim();
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.error("Failed to parse JSON:", err, text);
    return fallback;
  }
}

// Type for Gemini API error
interface GeminiError {
  error?: {
    status?: string;
    details?: Array<{ retryDelay?: string }>;
  };
}

// Generic helper to call Gemini with retry on quota errors
async function callGeminiWithRetry<T>(
  prompt: string,
  model: string = "gemini-2.5-flash",
  maxRetries = 3
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });
      return safeParseJSON<T>(response.text!, {} as T);
    } catch (err: unknown) {
      const geminiErr = err as GeminiError;
      if (
        geminiErr.error?.status === "RESOURCE_EXHAUSTED" &&
        attempt < maxRetries
      ) {
        const retryDelay =
          parseFloat(geminiErr.error.details?.[0]?.retryDelay?.replace("s", "")) || 5;
        console.warn(
          `Quota hit. Retrying in ${retryDelay}s (attempt ${attempt})...`
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay * 1000));
      } else {
        console.error("Gemini API error:", err);
        return {} as T;
      }
    }
  }
  return {} as T;
}

export class AIServiceGemini {
  // Fetch user watchlist and generate recommendations
  static async getPersonalizedRecommendations(
    userId: string,
    userPreferences?: string
  ): Promise<MovieRecommendation[]> {
    const watchlist = await prisma.watchlist.findMany({ where: { userId } });
    if (!watchlist.length) return [];

    const titles = watchlist.map((item) => item.title).join(", ");

    const prompt = `
      Based on these movies: ${titles}
      ${userPreferences ? `User preferences: ${userPreferences}` : ""}

      Recommend 5 movies the user might enjoy. Include:
      - title
      - reason
      - confidence (1-10)

      Format as JSON:
      { "recommendations": [{ "title": "...", "reason": "...", "confidence": 8 }] }
    `;

    const result = await callGeminiWithRetry<{ recommendations: MovieRecommendation[] }>(
      prompt
    );

    return result.recommendations ?? [];
  }

  // Generate a short movie description
  static async generateMovieDescription(
    title: string,
    overview: string,
    genres: string[],
    releaseYear: number
  ): Promise<string> {
    const prompt = `
      Create a 2-3 sentence engaging movie description for "${title}" (${releaseYear}).
      Original overview: ${overview}
      Genres: ${genres.join(", ")}
    `;

    const result = await callGeminiWithRetry<{ description: string }>(prompt);
    return result.description ?? overview;
  }

  // Analyze movie content
  static async analyzeMovie(
    title: string,
    overview: string,
    genres: string[]
  ): Promise<MovieAnalysis> {
    const prompt = `
      Analyze the movie "${title}" with overview: ${overview} and genres: ${genres.join(", ")}.
      Provide JSON:
      {
        "sentiment": "positive/negative/neutral",
        "themes": ["theme1", "theme2"],
        "targetAudience": "audience description",
        "contentWarnings": ["warning1"],
        "summary": "brief summary"
      }
    `;

    const result = await callGeminiWithRetry<MovieAnalysis>(prompt);

    return {
      sentiment: result.sentiment ?? "neutral",
      themes: result.themes ?? [],
      targetAudience: result.targetAudience ?? "General",
      contentWarnings: result.contentWarnings ?? [],
      summary: result.summary ?? overview,
    };
  }

  // Get AI search suggestions
  static async getSearchSuggestions(
    query: string,
    searchHistory: string[]
  ): Promise<AISearchSuggestion[]> {
    const prompt = `
      Based on search query "${query}" and history: ${searchHistory.join(", ")},
      provide 3-5 suggestions in JSON:
      { "suggestions": [{"query": "term", "type": "genre", "confidence": 8}] }
    `;

    const result = await callGeminiWithRetry<{ suggestions: AISearchSuggestion[] }>(
      prompt
    );

    return result.suggestions ?? [];
  }

  // Process natural language search
  static async processNaturalLanguageSearch(
    query: string
  ): Promise<{ searchTerm: string; filters: Record<string, string> }> {
    const prompt = `
      Process this search query: "${query}".
      Extract main search term and filters (genre, year, rating) in JSON:
      { "searchTerm": "term", "filters": {"genre": "action"} }
    `;

    const result = await callGeminiWithRetry<{ searchTerm: string; filters: Record<string, string> }>(
      prompt
    );

    return {
      searchTerm: result.searchTerm ?? query,
      filters: result.filters ?? {},
    };
  }
}