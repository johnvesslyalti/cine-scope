import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Movie = {
  id: number;
  title: string;
  name?: string;
  poster_path: string;
  release_date: string;
  overview: string;
  vote_average?: number;
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
    }),
    {
      name: "cine-scope-storage", 
    }
  )
);
