import { ensureMovieExists } from "./ensureMovieExists";
import { getMovieDetails, getSimilarMovies } from "./tmdb";

export async function getFullMovieData(tmdbId: string) {
    const tmdbMovie = await getMovieDetails(tmdbId);
    const similar = await getSimilarMovies(tmdbId);

    const dbMovie = await ensureMovieExists(tmdbId);

    return {
        dbMovie,
        tmdbMovie,
        cast: tmdbMovie.credits?.cast?.slice(0, 10) || [],
        similar: similar.results?.slice(0, 6) || []
    }
}