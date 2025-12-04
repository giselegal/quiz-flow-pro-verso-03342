/**
 * 🔐 useAuth - Hook de Autenticação Unificado
 * 
 * Hook adapter que conecta ao authStore Zustand.
 * Mantém compatibilidade com código existente que usa useAuth/useAuthStorage.
 * 
 * @example
 * ```tsx
 * const { user, isAuthenticated, login, logout } = useAuth();
 * ```
 */

import { useAuthStore } from '@/contexts/store/authStore';
import { useMemo } from 'react';

export function useAuth() {
  const store = useAuthStore();

  return useMemo(
    () => ({
      // State
      user: store.user,
      isAuthenticated: store.isAuthenticated,
      isLoading: store.isLoading,
      error: store.error,

      // Actions
      login: store.login,
      signUp: store.signUp,
      logout: store.logout,
      signOut: store.logout, // Alias para compatibilidade
      resetPassword: store.resetPassword,
      refreshSession: store.refreshSession,
      clearError: store.clearError,
    }),
    [
      store.user,
      store.isAuthenticated,
      store.isLoading,
      store.error,
      store.login,
      store.signUp,
      store.logout,
      store.resetPassword,
      store.refreshSession,
      store.clearError,
    ],
  );
}

/**
 * Alias para compatibilidade com código que usa useAuthStorage
 */
export const useAuthStorage = useAuth;

export default useAuth;
