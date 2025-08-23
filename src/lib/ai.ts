import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface MovieRecommendation {
  movieId: string;
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

export class AIService {
  // Generate personalized movie recommendations based on user's watchlist
  static async getPersonalizedRecommendations(
    watchlistMovies: Array<{ title: string; genre_ids: number[] }>,
    userPreferences?: string
  ): Promise<MovieRecommendation[]> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
      }

      const watchlistTitles = watchlistMovies.map(m => m.title).join(', ');
      
      const prompt = `
        Based on the following movies in the user's watchlist: ${watchlistTitles}
        ${userPreferences ? `User preferences: ${userPreferences}` : ''}
        
        Please recommend 5 movies that the user would likely enjoy. For each recommendation:
        1. Provide a movie title that exists in TMDB database
        2. Give a brief reason why this movie would appeal to them
        3. Rate your confidence (1-10) in this recommendation
        
        Format your response as JSON:
        {
          "recommendations": [
            {
              "title": "Movie Title",
              "reason": "Brief explanation",
              "confidence": 8
            }
          ]
        }
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) throw new Error('No response from AI');

      const parsed = JSON.parse(response);
      return parsed.recommendations || [];
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }

  // Generate enhanced movie descriptions
  static async generateMovieDescription(
    title: string,
    overview: string,
    genres: string[],
    releaseYear: number
  ): Promise<string> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return overview; // Fallback to original overview
      }

      const prompt = `
        Create an engaging, detailed movie description for "${title}" (${releaseYear}).
        
        Original overview: ${overview}
        Genres: ${genres.join(', ')}
        
        Write a compelling 2-3 sentence description that:
        - Captures the essence and appeal of the movie
        - Highlights what makes it special
        - Uses engaging language that would make someone want to watch it
        - Maintains accuracy to the original content
        
        Keep it concise but impactful.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 150,
      });

      return completion.choices[0]?.message?.content || overview;
    } catch (error) {
      console.error('Error generating description:', error);
      return overview; // Fallback to original overview
    }
  }

  // Analyze movie content and provide insights
  static async analyzeMovie(
    title: string,
    overview: string,
    genres: string[]
  ): Promise<MovieAnalysis> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return {
          sentiment: 'neutral',
          themes: [],
          targetAudience: 'General',
          contentWarnings: [],
          summary: overview
        };
      }

      const prompt = `
        Analyze the movie "${title}" with the following information:
        Overview: ${overview}
        Genres: ${genres.join(', ')}
        
        Provide analysis in JSON format:
        {
          "sentiment": "positive/negative/neutral",
          "themes": ["theme1", "theme2", "theme3"],
          "targetAudience": "description of ideal audience",
          "contentWarnings": ["warning1", "warning2"],
          "summary": "brief analysis summary"
        }
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) throw new Error('No response from AI');

      return JSON.parse(response);
    } catch (error) {
      console.error('Error analyzing movie:', error);
      return {
        sentiment: 'neutral',
        themes: [],
        targetAudience: 'General',
        contentWarnings: [],
        summary: overview
      };
    }
  }

  // Generate AI-powered search suggestions
  static async getSearchSuggestions(
    query: string,
    searchHistory: string[]
  ): Promise<AISearchSuggestion[]> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return [];
      }

      const prompt = `
        Based on the search query "${query}" and recent search history: ${searchHistory.join(', ')}
        
        Generate 3-5 search suggestions that would help the user find movies. Consider:
        - Genre-specific searches
        - Mood-based searches
        - Actor/director searches
        - Year-based searches
        
        Format as JSON:
        {
          "suggestions": [
            {
              "query": "search term",
              "type": "genre/mood/actor/director/year/general",
              "confidence": 8
            }
          ]
        }
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) throw new Error('No response from AI');

      const parsed = JSON.parse(response);
      return parsed.suggestions || [];
    } catch (error) {
      console.error('Error generating search suggestions:', error);
      return [];
    }
  }

  // Natural language search processing
  static async processNaturalLanguageSearch(
    query: string
  ): Promise<{ searchTerm: string; filters: Record<string, any> }> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return { searchTerm: query, filters: {} };
      }

      const prompt = `
        Process this natural language movie search query: "${query}"
        
        Extract the search term and any filters (genre, year, rating, etc.)
        
        Return as JSON:
        {
          "searchTerm": "main search term",
          "filters": {
            "genre": "action",
            "year": 2020,
            "rating": 8
          }
        }
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) throw new Error('No response from AI');

      return JSON.parse(response);
    } catch (error) {
      console.error('Error processing natural language search:', error);
      return { searchTerm: query, filters: {} };
    }
  }
}

