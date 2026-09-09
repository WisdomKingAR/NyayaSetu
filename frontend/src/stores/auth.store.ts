'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser } from '@/lib/types';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;

  setUser: (user: AuthUser | null) => void;
  setSession: (
    sessionOrToken: string | { accessToken?: string; access_token?: string; refreshToken?: string; refresh_token?: string; user?: any },
    refreshToken?: string,
    user?: AuthUser,
  ) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setUser: (user) => set({ user }),

      setSession: (sessionOrToken, maybeRefreshToken, maybeUser) => {
        let token = '';
        let refToken: string | null = null;
        let usr: AuthUser | null = null;

        if (typeof sessionOrToken === 'object' && sessionOrToken !== null) {
          token = sessionOrToken.accessToken || sessionOrToken.access_token || '';
          refToken = sessionOrToken.refreshToken || sessionOrToken.refresh_token || null;
          usr = sessionOrToken.user || null;
        } else {
          token = sessionOrToken || '';
          refToken = maybeRefreshToken ?? null;
          usr = maybeUser ?? null;
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('nyaya_access_token', token);
          if (refToken) {
            localStorage.setItem('nyaya_refresh_token', refToken);
          }
        }
        set({ accessToken: token, refreshToken: refToken, user: usr });
      },

      signOut: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('nyaya_access_token');
          localStorage.removeItem('nyaya_refresh_token');
        }
        set({ user: null, accessToken: null, refreshToken: null });
      },
    }),
    {
      name: 'nyaya_auth',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
