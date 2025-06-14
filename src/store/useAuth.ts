import { AuthState } from '@/types'
import { create } from 'zustand'
import { persist, StorageValue } from 'zustand/middleware'

const customStorage = {
  getItem: (name: string): StorageValue<AuthState> | null => {
    const item = localStorage.getItem(name)
    return item ? JSON.parse(item) : null
  },
  setItem: (name: string, value: StorageValue<AuthState>) => {
    localStorage.setItem(name, JSON.stringify(value))
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name)
  },
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'cine-scope-auth',
      storage: customStorage, 
    }
  )
)
