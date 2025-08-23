import axios from 'axios';

interface WatchlistPayload {
  id: number;
  title: string;
  poster_path?: string;
}

export const addToWatchlist = async (payload: WatchlistPayload) => {
  const res = await axios.post('/api/watchlist', payload);
  return res.data;
};

export const deleteFromWatchlist = async (movieId: string) => {
  const res = await axios.delete('/api/watchlist', { data: { movieId } });
  return res.data;
};

export const getWatchlist = async () => {
  const res = await axios.get('/api/watchlist');
  return res.data;
};
