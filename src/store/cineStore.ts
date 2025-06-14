import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Movie = {
  id: number;
  title: string;
  name?: string;
  poster_path: string;
  release_date: string;
  overview: string;
  genre_ids: number[];
};

type CineStore = {
  popularMovies: Movie[];
  searchResults: Movie[];
  selectedMovie: Movie | null;
  trending: Movie[];
  isLoading: boolean;
  watchlist: Movie[];

  setPopularMovies: (movies: Movie[]) => void;
  setSearchResults: (movies: Movie[]) => void;
  setSelectedMovie: (movie: Movie) => void;
  setTrending: (movies: Movie[]) => void;
  setLoading: (loading: boolean) => void;
  resetSearch: () => void;

  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
};

export const useCineStore = create<CineStore>()(
  persist(
    (set, get) => ({
      popularMovies: [],
      searchResults: [],
      selectedMovie: null,
      trending: [],
      isLoading: false,
      watchlist: [],

      setPopularMovies: (movies) => set({ popularMovies: movies }),
      setSearchResults: (movies) => set({ searchResults: movies }),
      setSelectedMovie: (movie) => set({ selectedMovie: movie }),
      setTrending: (movies) => set({ trending: movies }),
      setLoading: (loading) => set({ isLoading: loading }),
      resetSearch: () => set({ searchResults: [] }),

      addToWatchlist: (movie) => {
        const current = get().watchlist;
        if (!current.find((m) => m.id === movie.id)) {
          set({ watchlist: [...current, movie] });
        }
      },
      removeFromWatchlist: (movieId) => {
        const filtered = get().watchlist.filter((m) => m.id !== movieId);
        set({ watchlist: filtered });
      },
    }),
    {
      name: "cine-scope-storage", 
    }
  )
);
