import { apiClient, signIn, signUp, signOut, getMe } from '@/lib/apiClient';
import type { LoginCredentials, SignUpCredentials, AuthSession, AuthUser } from '../types';

export const authApi = {
  signIn: async (credentials: LoginCredentials) => {
    return await signIn(credentials);
  },

  signUp: async (credentials: SignUpCredentials) => {
    return await signUp(credentials);
  },

  signOut: async () => {
    return await signOut();
  },

  getMe: async (): Promise<AuthUser> => {
    const res = await getMe();
    return res.user ?? res;
  },
};
