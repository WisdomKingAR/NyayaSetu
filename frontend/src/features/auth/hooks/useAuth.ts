'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { authApi } from '../api/auth.api';
import type { LoginCredentials, SignUpCredentials } from '../types';

export function useAuth() {
  const router = useRouter();
  const { user, accessToken, setSession, signOut: clearSession, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.signIn(credentials);
      const sessionData = response.data || response;

      setSession({
        user: sessionData.user,
        accessToken: sessionData.access_token || sessionData.accessToken,
        refreshToken: sessionData.refresh_token || sessionData.refreshToken,
      });

      router.push('/dashboard');
      return sessionData;
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        'Authentication failed. Please check your credentials.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: SignUpCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.signUp(credentials);
      const sessionData = response.data || response;

      if (sessionData.access_token || sessionData.accessToken) {
        setSession({
          user: sessionData.user,
          accessToken: sessionData.access_token || sessionData.accessToken,
          refreshToken: sessionData.refresh_token || sessionData.refreshToken,
        });
      }

      router.push('/dashboard');
      return sessionData;
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        'Registration failed. Please try again.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.signOut();
    } catch {
      // Ignore network errors on logout
    } finally {
      clearSession();
      router.push('/auth/login');
    }
  };

  return {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    loading,
    error,
    login,
    register,
    logout,
    setUser,
  };
}
