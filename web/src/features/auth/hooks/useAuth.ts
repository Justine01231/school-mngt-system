import { useAuthStore } from '../../../store/auth-store';

/**
 * Hook to access authentication state and methods
 * Use in React components to subscribe to auth changes
 */
export const useAuth = () => {
  return useAuthStore();
};

/**
 * Get auth state without subscribing (for non-React code)
 */
export const getAuthState = () => {
  return useAuthStore.getState();
};
