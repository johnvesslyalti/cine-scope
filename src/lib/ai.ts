import { prisma } from "./prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ------------------- Interfaces -------------------
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

// ------------------- Setup Gemini -------------------
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.0-flash-exp"; // Latest model

if (!GEMINI_API_KEY) {
  console.error("❌ Missing GEMINI_API_KEY in environment variables");
}

// ✅ Latest initialization for @google/generative-ai SDK
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");

function ensureGeminiConfigured(): void {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_NOT_CONFIGURED: Missing GEMINI_API_KEY");
  }
}

// ------------------- Safe JSON Parser -------------------
function safeParseJSON<T>(text: string | undefined, fallback: T): T {
  if (!text) return fallback;

  const stripFences = (t: string): string =>
    t.replace(/```(?:json)?/g, "").trim();

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
  } catch (error: unknown) {
    try {
      const extracted = tryBalancedExtraction(text);
      if (extracted) {
        return JSON.parse(extracted) as T;
      }
    } catch (err2) {
      console.error("❌ Failed to parse Gemini JSON (extracted):", error, err2);
    }
    console.error("❌ Failed to parse Gemini JSON (raw):", text);
    return fallback;
  }
}

// ------------------- Gemini API Wrapper -------------------
async function callGeminiWithRetry<T>(
  prompt: string,
  maxRetries = 2
): Promise<T> {
  ensureGeminiConfigured();

  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
    },
  });

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🤖 Sending request to Gemini (attempt ${attempt})...`);

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      console.log("🧠 Gemini raw text:", text);

      if (!text) {
        console.error(
          "⚠️ Empty response from Gemini:",
          JSON.stringify(result, null, 2)
        );
      }

      return safeParseJSON<T>(text, {} as T);
    } catch (err: unknown) {
      const error = err as {
        status?: number | string;
        message?: string;
        statusText?: string;
      };
      const status = (
        error?.status ||
        error?.statusText ||
        error?.message ||
        "unknown"
      ).toString();
      console.error(
        `⚠️ Gemini API error (attempt ${attempt}):`,
        status,
        error?.message
      );

      const isRateLimited =
        status.includes("429") ||
        status.includes("RESOURCE_EXHAUSTED") ||
        error?.message?.includes("quota");

      const isAuthOrConfig =
        status.includes("401") ||
        status.includes("403") ||
        status.toLowerCase().includes("invalid") ||
        status.includes("GEMINI_NOT_CONFIGURED") ||
        error?.message?.toLowerCase().includes("api key");

      if (isAuthOrConfig) throw err;

      if (isRateLimited && attempt < maxRetries) {
        const delay = 5 * attempt;
        console.warn(`⏳ Rate limited. Retrying in ${delay}s...`);
        await new Promise((r) => setTimeout(r, delay * 1000));
        continue;
      }

      if (attempt === maxRetries) throw err;
    }
  }

  return {} as T;
}

// ------------------- AI Service -------------------
export class AIServiceGemini {
  // 🎬 Personalized recommendations
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
      Return valid JSON only:
      { "recommendations": [{ "title": "Movie", "reason": "Because...", "confidence": 8 }] }
    `;

    const result = await callGeminiWithRetry<{
      recommendations: MovieRecommendation[];
    }>(prompt);
    return result.recommendations ?? [];
  }

  // 📝 Generate short movie description
  static async generateMovieDescription(
    title: string,
    overview: string,
    genres: string[],
    releaseYear: number
  ): Promise<string> {
    const prompt = `
      Create a short, engaging 2–3 sentence description for "${title}" (${releaseYear}).
      Overview: ${overview}
      Genres: ${genres.join(", ")}
      Respond in JSON: { "description": "..." }
    `;

    const result = await callGeminiWithRetry<{ description: string }>(prompt);
    return result.description ?? overview;
  }

  // 🔍 Analyze movie tone, themes, etc.
  static async analyzeMovie(
    title: string,
    overview: string,
    genres: string[]
  ): Promise<MovieAnalysis> {
    const prompt = `
      Analyze the movie "${title}".
      Overview: ${overview}
      Genres: ${genres.join(", ")}
      Respond strictly as JSON:
      {
        "sentiment": "positive" | "negative" | "neutral",
        "themes": ["theme1"],
        "targetAudience": "audience",
        "contentWarnings": ["warning"],
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

  // 🧭 Search suggestions based on history
  static async getSearchSuggestions(
    query: string,
    searchHistory: string[]
  ): Promise<AISearchSuggestion[]> {
    const prompt = `
      Based on query "${query}" and history: ${searchHistory.join(", ")},
      suggest 3–5 related searches.
      Respond as JSON:
      { "suggestions": [{ "query": "term", "type": "genre", "confidence": 9 }] }
    `;

    const result = await callGeminiWithRetry<{
      suggestions: AISearchSuggestion[];
    }>(prompt);
    return result.suggestions ?? [];
  }

  // 🗣️ Process natural language searches
  static async processNaturalLanguageSearch(
    query: string
  ): Promise<{ searchTerm: string; filters: Record<string, string> }> {
    const prompt = `
      Process this search: "${query}".
      Extract main term and filters (genre, year, etc).
      Respond strictly as JSON:
      { "searchTerm": "term", "filters": { "genre": "action" } }
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
