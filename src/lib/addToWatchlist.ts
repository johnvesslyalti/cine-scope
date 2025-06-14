import { WatchListMovie } from "@/types";
import axios from "axios"

export const addToWatchlist = async (movie: WatchListMovie, token: string | null) => {
    try {
        const res = await axios.post('api/watchlist', {
            movieId: movie.id,
            title: movie.title,
            posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
         }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error: any) {
        console.error(error);
        throw error;
    }
}