import { WatchlistMovie } from "@/types";
import axios, { AxiosError } from "axios";

export const addToWatchlist = async (movie: WatchlistMovie, token: string | null) => {
  try {
    const res = await axios.post('/api/watchlist', {
      movieId: movie.id,
      title: movie.title,
      posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(err);
    throw err;
  }
};

export const deleteFromWatchlist = async (movieId: string, token: string | null) => {
  try {
    const res = await axios.delete('/api/watchlist', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        movieId,
      },
    });
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(err);
    throw err;
  }
};
