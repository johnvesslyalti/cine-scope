import { AuthState } from "@/types";
import { create } from "zustand";

export const useAuth = create<AuthState>((set) => ({
    user: null,
    token: null,
    setUser: (user, token) => {
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("token", token)
        set({ user, token })
    },
    logout: () => {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        set({ user: null, token: null })
    }
}))