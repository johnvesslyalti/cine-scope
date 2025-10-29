import { prisma } from "./prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface MovieRecommendation {
  movieId?: string;
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

// ✅ Initialize Gemini client (fail-fast on missing key)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

if (!GEMINI_API_KEY) {
  console.error("❌ Missing GEMINI_API_KEY in environment variables");
}

const ai = new GoogleGenerativeAI(GEMINI_API_KEY || "");

function ensureGeminiConfigured() {
  if (!GEMINI_API_KEY) {
    const error = new Error("GEMINI_NOT_CONFIGURED: Missing GEMINI_API_KEY");
    // Avoid noisy stack traces in logs; the message is enough for handlers
    throw error;
  }
}

// ✅ Helper to safely parse Gemini responses
function safeParseJSON<T>(text: string | undefined, fallback: T): T {
  if (!text) return fallback;

  const stripFences = (t: string) => t.replace(/```(?:json)?/g, "").trim();

  const tryBalancedExtraction = (t: string): string | null => {
    const s = stripFences(t);
    const start = s.indexOf("{");
    if (start === -1) return null;
    let depth = 0;
    for (let i = start; i < s.length; i++) {
      const ch = s[i];
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          return s.slice(start, i + 1);
        }
      }
    }
    return null;
  };

  try {
    const cleaned = stripFences(text);
    return JSON.parse(cleaned) as T;
  } catch (_) {
    try {
      const extracted = tryBalancedExtraction(text);
      if (extracted) {
        return JSON.parse(extracted) as T;
      }
    } catch (err2) {
      console.error("❌ Failed to parse Gemini JSON (extracted):", err2);
    }
    console.error("❌ Failed to parse Gemini JSON (raw):", text);
    return fallback;
  }
}

// ✅ Gemini API call with retry logic
async function callGeminiWithRetry<T>(
  prompt: string,
  modelName = GEMINI_MODEL,
  maxRetries = 2
): Promise<T> {
  // Fail fast if not configured
  ensureGeminiConfigured();

  const model = ai.getGenerativeModel({ model: modelName });

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🤖 Sending request to Gemini (attempt ${attempt})...`);
      const result = await model.generateContent(prompt);

      const text = result.response.text();
      return safeParseJSON<T>(text, {} as T);
    } catch (err: unknown) {
      const error = err as { status?: string; message?: string };
      const status = (error?.status || error?.message || "unknown").toString();
      console.error(`⚠️ Gemini API error (attempt ${attempt}):`, status);

      const isRateLimited = status.includes("429") || status.includes("RESOURCE_EXHAUSTED");
      const isAuthOrConfig =
        status.includes("401") ||
        status.toLowerCase().includes("invalid") ||
        status.includes("GEMINI_NOT_CONFIGURED");

      if (isAuthOrConfig) {
        // Do not retry configuration/auth errors
        throw err;
      }

      if (isRateLimited && attempt < maxRetries) {
        const delay = 5 * attempt;
        console.warn(`⏳ Rate limited. Retrying in ${delay}s...`);
        await new Promise((r) => setTimeout(r, delay * 1000));
        continue;
      }

      if (attempt === maxRetries) {
        throw err;
      }
    }
  }

  return {} as T;
}

export class AIServiceGemini {
  // 🧠 Personalized movie recommendations
  static async getPersonalizedRecommendations(
    userId: string,
    userPreferences?: string
  ): Promise<MovieRecommendation[]> {
    const watchlist = await prisma.watchlist.findMany({ where: { userId } });
    if (!watchlist.length) return [];

    const titles = watchlist.map((item) => item.title).join(", ");

    const prompt = `
      You are a movie recommendation AI.
      Based on these movies: ${titles}
      ${userPreferences ? `User preferences: ${userPreferences}` : ""}

      Recommend 5 movies the user might enjoy.
      Return valid JSON only in this format:

      {
        "recommendations": [
          { "title": "Movie Title", "reason": "Because...", "confidence": 8 }
        ]
      }
    `;

    const result = await callGeminiWithRetry<{
      recommendations: MovieRecommendation[];
    }>(prompt);

    return result.recommendations ?? [];
  }

  // 🎬 Generate short movie description
  static async generateMovieDescription(
    title: string,
    overview: string,
    genres: string[],
    releaseYear: number
  ): Promise<string> {
    const prompt = `
      Create a short, engaging 2-3 sentence description for the movie "${title}" (${releaseYear}).
      Use this overview: ${overview}
      Genres: ${genres.join(", ")}
      
      Respond in JSON:
      { "description": "..." }
    `;

    const result = await callGeminiWithRetry<{ description: string }>(prompt);
    return result.description ?? overview;
  }

  // 🔍 Analyze movie details
  static async analyzeMovie(
    title: string,
    overview: string,
    genres: string[]
  ): Promise<MovieAnalysis> {
    const prompt = `
      Analyze the movie "${title}" with overview: ${overview} and genres: ${genres.join(
      ", "
    )}.
      Respond strictly as JSON:
      {
        "sentiment": "positive" | "negative" | "neutral",
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
      targetAudience: result.targetAudience ?? "General audience",
      contentWarnings: result.contentWarnings ?? [],
      summary: result.summary ?? overview,
    };
  }

  // 🔎 Search suggestions
  static async getSearchSuggestions(
    query: string,
    searchHistory: string[]
  ): Promise<AISearchSuggestion[]> {
    const prompt = `
      Based on search query "${query}" and search history: ${searchHistory.join(
      ", "
    )},
      provide 3-5 search suggestions.

      Respond as JSON:
      {
        "suggestions": [
          { "query": "term", "type": "genre", "confidence": 9 }
        ]
      }
    `;

    const result = await callGeminiWithRetry<{
      suggestions: AISearchSuggestion[];
    }>(prompt);

    return result.suggestions ?? [];
  }

  // 💬 Process natural language search
  static async processNaturalLanguageSearch(
    query: string
  ): Promise<{ searchTerm: string; filters: Record<string, string> }> {
    const prompt = `
      Process this search query: "${query}".
      Extract main search term and filters (genre, year, rating).

      Respond strictly as JSON:
      {
        "searchTerm": "term",
        "filters": { "genre": "action" }
      }
    `;

    const result = await callGeminiWithRetry<{
      searchTerm: string;
      filters: Record<string, string>;
    }>(prompt);

    return {
      searchTerm: result.searchTerm ?? query,
      filters: result.filters ?? {},
    };
  }
}
