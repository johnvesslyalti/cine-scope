export interface User {
    id: number;
    name: string;
    email: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    setUser: (user: User | null, token: string) => void
    logout: () => void
}

interface WatchlistItem {
  id: string;
  movieId: string;
  title: string;
  posterUrl: string;
  createdAt: string;
}