const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export const TMDB_API = {
    trending: `${BASE_URL}/trending/all/day?api_key=${API_KEY}`,
    top_rated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`,
    popular: `${BASE_URL}/movie/popular?api_key=${API_KEY}`,
    upcoming: `${BASE_URL}/movie/upcoming?api_key=${API_KEY}`,
    nowplaying: `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`,

    /* Dynamic End Points */
    moviedetails: (id: string) => `${BASE_URL}/movie/${id}?api_key=${API_KEY}`,
    searchmovies: (query: string) => `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&api_key=${API_KEY}`,
    similarmovies: (id: string) => `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`,
    moviecredits: (id: string) => `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`,
    genres: `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
}