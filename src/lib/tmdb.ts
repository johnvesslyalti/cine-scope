// -----------------------------------------------------
// TMDB Service Layer for CineScope 2.0
// Works for BOTH: 
//   ✔ Frontend components (existing code)
//   ✔ Backend Server Components, Server Actions & API Routes
// -----------------------------------------------------

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
// IMPORTANT: This should NOT be NEXT_PUBLIC anymore. 
// Use server-side only: TMDB_API_KEY=.env

const BASE_URL = "https://api.themoviedb.org/3";

if (!API_KEY) {
  console.warn("⚠ Missing TMDB_API_KEY in .env");
}

// =====================================================
// 1️⃣ FRONTEND-COMPATIBLE API (YOUR ORIGINAL CODE)
// =====================================================
// This section STAYS EXACTLY as you had it so NOTHING breaks.

export const TMDB_API = {
  trending: `${BASE_URL}/trending/all/day?api_key=${API_KEY}`,
  top_rated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`,
  popular: `${BASE_URL}/movie/popular?api_key=${API_KEY}`,
  upcoming: `${BASE_URL}/movie/upcoming?api_key=${API_KEY}`,
  nowplaying: `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`,

  moviedetails: (id: string, lang = "en-US") =>
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=${lang}`,

  searchmovies: (query: string, lang = "en-US") =>
    `${BASE_URL}/search/movie?query=${encodeURIComponent(
      query
    )}&api_key=${API_KEY}&language=${lang}`,

  similarmovies: (id: string) =>
    `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`,

  moviecredits: (id: string) =>
    `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`,

  movievideos: (id: string) =>
    `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`,

  genres: `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`,
};

// FRONTEND IMAGE BUILDER
export const TMDB_IMAGE = (path: string, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "/fallback-poster.jpg";


// =====================================================
// 2️⃣ BACKEND SERVICE HELPERS (Server Components / Actions)
// =====================================================
// These do NOT break your frontend — they are NEW functions.

async function tmdbFetch(url: string) {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour (prevents rate-limit)
    });

    if (!res.ok) {
      console.error("TMDB Error:", res.status, res.statusText);
      throw new Error("Failed TMDB request");
    }

    return res.json();
  } catch (error) {
    console.error("TMDB Network Error:", error);
    throw error;
  }
}

// 📌 Full movie details (with credits + videos)
export async function getMovieDetails(id: string, lang = "en-US") {
  const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=${lang}&append_to_response=credits,videos`;
  return tmdbFetch(url);
}

// 📌 Similar movies
export async function getSimilarMovies(id: string) {
  return tmdbFetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`);
}

// 📌 Credits only (if you need separately)
export async function getMovieCredits(id: string) {
  return tmdbFetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`);
}

// 📌 Videos (trailers)
export async function getMovieVideos(id: string) {
  return tmdbFetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`);
}

// 📌 Search (server version)
export async function searchMovies(query: string) {
  return tmdbFetch(
    `${BASE_URL}/search/movie?query=${encodeURIComponent(
      query
    )}&api_key=${API_KEY}`
  );
}

// 📌 Category endpoints (server version)
export async function getTrendingMovies() {
  return tmdbFetch(`${BASE_URL}/trending/all/day?api_key=${API_KEY}`);
}

export async function getPopularMovies() {
  return tmdbFetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
}

export async function getUpcomingMovies() {
  return tmdbFetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
}
