import { create } from "zustand";

export type Movie = {
    id: number;
    title: string;
    name?: string;
    poster_path: string;
    release_date: string;
    overview: string;
    genre_ids: number[];
}

type CineStore = {
    popularMovies: Movie[];
    searchResults: Movie[];
    selectedMovie: Movie | null;
    trending: Movie[]
    isLoading: boolean;

    setPopularMovies: (movies: Movie[]) => void;
    setSearchResults: (movies: Movie[]) => void;
    setSelectedMovie: (movie: Movie) => void;
    setLoading: (loading: boolean) => void;
    setTrending: (movies: Movie[]) => void;
    resetSearch: () => void;
}

export const useCineStore = create<CineStore>((set) => ({
    popularMovies: [],
    searchResults: [],
    selectedMovie: null,
    trending: [],
    isLoading: false,

    setPopularMovies: (movies) => set({ popularMovies: movies }),
    setSearchResults: (movies) => set({ searchResults: movies }),
    setSelectedMovie: (movie) => set({ selectedMovie: movie }),
    setLoading: (loading) => set({ isLoading: loading }),
    setTrending: (movies) => set({ trending: movies }),
    resetSearch: () => set({ searchResults: []}),
}))