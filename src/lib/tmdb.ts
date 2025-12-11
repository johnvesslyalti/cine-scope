const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

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

export const TMDB_IMAGE = (path: string, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "/fallback-poster.jpg";

async function tmdbFetch(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("TMDB fetch failed");
  return res.json();
}

export async function getMovieDetails(id: string, lang = "en-US") {
  const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=${lang}&append_to_response=credits,videos`;
  return tmdbFetch(url);
}

export async function getSimilarMovies(id: string) {
  return tmdbFetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`);
}

export async function getMovieCredits(id: string) {
  return tmdbFetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`);
}

export async function getMovieVideos(id: string) {
  return tmdbFetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`);
}

export async function searchMovies(query: string) {
  return tmdbFetch(
    `${BASE_URL}/search/movie?query=${encodeURIComponent(
      query
    )}&api_key=${API_KEY}`
  );
}

export async function getTrendingMovies() {
  return tmdbFetch(`${BASE_URL}/trending/all/day?api_key=${API_KEY}`);
}

export async function getPopularMovies() {
  return tmdbFetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
}

export async function getUpcomingMovies() {
  return tmdbFetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
}
