import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createAuthClient } from "better-auth/react";
import React from 'react';

// Create Better Auth client
export const authClient = createAuthClient({
  // you can pass client configuration here
});

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (provider?: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (provider = 'google') => {
        console.log('Auth store login called with provider:', provider);
        set({ isLoading: true });
        try {
          console.log('Calling signIn...');
          const result = await authClient.signIn.social({
            provider: provider as any,
            callbackURL: '/'
          });
          console.log('signIn result:', result);
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                window.location.href = '/';
              }
            }
          });
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Hook to sync Better Auth session with Zustand store
export const useAuthSync = () => {
  const { data: session, isPending } = authClient.useSession();
  const { setUser } = useAuth();

  React.useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      setUser({
        id: session.user.id || '',
        name: session.user.name || '',
        email: session.user.email || '',
        image: session.user.image || undefined,
      });
    } else {
      setUser(null);
    }
  }, [session, isPending, setUser]);
};