import axios from 'axios';

interface WatchlistPayload {
  id: string;
  title: string;
  poster_path: string;
}

export const addToWatchlist = async (payload: WatchlistPayload) => {
  const response = await axios.post('/api/watchlist', payload);
  return response.data;
};

export const deleteFromWatchlist = async (movieId: string) => {
  const response = await axios.delete('/api/watchlist', {
    data: { movieId },
  });
  return response.data;
};

export const getWatchlist = async () => {
  const response = await axios.get('/api/watchlist');
  return response.data;
};
