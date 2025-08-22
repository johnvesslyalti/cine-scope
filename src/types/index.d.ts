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

type WatchlistMovie = {
  id: number;
  title: string;
  poster_path: string;
};

// NextAuth type extensions
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}