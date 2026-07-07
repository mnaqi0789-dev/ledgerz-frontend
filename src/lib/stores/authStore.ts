import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "maker" | "manager" | "admin";
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  hasHydrated: boolean;
  setUser: (user: AuthUser, token: string) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hasHydrated: false,
      setUser: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "ledgerz-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
