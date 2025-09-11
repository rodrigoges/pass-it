
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../api/types';

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

// Fix: Updated to use the curried `create<AuthState>()(...)` syntax for Zustand middleware.
// This is required for proper TypeScript type inference with Zustand v4+ and fixes the type error.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => {
        console.log('🔍 setAuth - Token recebido:', token);
        console.log('🔍 setAuth - Token tipo:', typeof token);
        set({ token, user });
      },
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage', // name of the item in storage (must be unique)
      onRehydrateStorage: () => (state) => {
        console.log('🔍 onRehydrateStorage - Estado:', state);
        if (state) {
          // Garantir que o token seja sempre uma string
          if (state.token && typeof state.token === 'object' && 'token' in state.token) {
            console.log('🔍 onRehydrateStorage - Corrigindo token de objeto para string');
            state.token = state.token.token;
          }
          console.log('🔍 onRehydrateStorage - Token final:', state.token);
          console.log('🔍 onRehydrateStorage - Token tipo final:', typeof state.token);
        }
      },
    }
  )
);
