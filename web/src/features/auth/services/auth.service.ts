import { z } from 'zod';
import { apiClient } from '../../../lib/api-client';
import { authStorage } from '../../../lib/auth-storage';
import { useAuthStore } from '../../../store/auth-store';
import { loginFormSchema } from '../schemas';

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  user: PublicUser;
}

export interface PublicUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

const persistSession = (pair: TokenPair): void => {
  authStorage.setAccessToken(pair.accessToken);
  authStorage.setRefreshToken(pair.refreshToken);
  authStorage.setUser(pair.user);
  useAuthStore.getState().setSession(pair.user, pair.accessToken);
};

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = authStorage.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    const response = await fetch('http://localhost:3000/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      authStorage.clearSession();
      useAuthStore.getState().clearSession();
      return null;
    }

    const data = await response.json();
    authStorage.setAccessToken(data.accessToken);
    useAuthStore.getState().setAccessToken(data.accessToken);
    return data.accessToken;
  } catch (err) {
    console.error('Token refresh failed:', err);
    authStorage.clearSession();
    useAuthStore.getState().clearSession();
    return null;
  }
};

export const authService = {
  login: async (input: LoginFormValues): Promise<TokenPair> => {
    const response = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Login failed');
    }

    const pair = await response.json();
    persistSession(pair);
    return pair;
  },

  me: async (): Promise<PublicUser> => {
    const response = await fetch('http://localhost:3000/api/v1/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStorage.getAccessToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  },
};
