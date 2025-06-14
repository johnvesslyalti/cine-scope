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

export interface WatchListMovie {
    id: string;
    title: string;
    poster_path: string;
}