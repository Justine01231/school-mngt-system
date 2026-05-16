import { AUTH_CONFIG } from '../config/auth';

export const authStorage = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(AUTH_CONFIG.storage.accessTokenKey);
  },

  setAccessToken: (token: string): void => {
    localStorage.setItem(AUTH_CONFIG.storage.accessTokenKey, token);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(AUTH_CONFIG.storage.refreshTokenKey);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(AUTH_CONFIG.storage.refreshTokenKey, token);
  },

  getUser: (): any | null => {
    const userJson = localStorage.getItem(AUTH_CONFIG.storage.userKey);
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  },

  setUser: (user: any): void => {
    localStorage.setItem(AUTH_CONFIG.storage.userKey, JSON.stringify(user));
  },

  clearSession: (): void => {
    localStorage.removeItem(AUTH_CONFIG.storage.accessTokenKey);
    localStorage.removeItem(AUTH_CONFIG.storage.refreshTokenKey);
    localStorage.removeItem(AUTH_CONFIG.storage.userKey);
  },
};
