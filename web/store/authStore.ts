
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../api/types';

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => {
        set({ token, user });
      },
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (
            state.token !== null &&
            typeof state.token === 'object' &&
            state.token !== null &&
            state.token !== undefined &&
            'token' in state.token
          ) {
            state.token = (state.token as { token: string }).token;
          }
        }
      },
    }
  )
);
