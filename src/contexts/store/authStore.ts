/**
 * 🔐 AUTH STORE - Zustand Store para Autenticação
 * 
 * Gerencia todo o estado de autenticação:
 * - Usuário e sessão
 * - Login/Logout/SignUp
 * - Persistência de token
 * 
 * Substitui: AuthStorageProvider, AuthContext, 5+ hooks de auth
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '@/integrations/supabase/client';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES
// ============================================================================

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  role?: 'owner' | 'editor' | 'viewer' | 'admin' | 'moderator' | 'user';
  created_at?: string;
  metadata?: Record<string, any>;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
}

interface AuthActions {
  // Auth operations
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
  // Session management
  setUser: (user: User | null) => void;
  setSession: (session: any) => void;
  refreshSession: () => Promise<void>;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setInitialized: (initialized: boolean) => void;
  
  // Reset
  reset: () => void;
}

type AuthStore = AuthState & AuthActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  initialized: false,
};

// ============================================================================
// HELPER: Convert Supabase User to App User
// ============================================================================

function mapSupabaseUser(supabaseUser: any): User | null {
  if (!supabaseUser) return null;
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name,
    avatar: supabaseUser.user_metadata?.avatar_url,
    role: supabaseUser.app_metadata?.role || 'user',
    created_at: supabaseUser.created_at,
    metadata: supabaseUser.user_metadata,
    user_metadata: supabaseUser.user_metadata,
    app_metadata: supabaseUser.app_metadata,
  };
}

// ============================================================================
// STORE
// ============================================================================

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Auth operations
        login: async (email, password) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            appLogger.info('🔐 [AuthStore] Iniciando login...', { email });

            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (error) throw error;

            if (!data?.user) {
              throw new Error('Login falhou: sem dados de usuário');
            }

            const user = mapSupabaseUser(data.user);

            set((state) => {
              state.user = user;
              state.isAuthenticated = true;
              state.isLoading = false;
              state.error = null;
            });

            appLogger.info('✅ [AuthStore] Login bem-sucedido');
          } catch (err: any) {
            const errorMsg = err.message || 'Erro ao fazer login';
            set((state) => {
              state.user = null;
              state.isAuthenticated = false;
              state.isLoading = false;
              state.error = errorMsg;
            });
            appLogger.error('❌ [AuthStore] Erro no login:', err);
            throw err;
          }
        },

        signUp: async (email, password, metadata) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            appLogger.info('📝 [AuthStore] Criando conta...');

            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: metadata || {},
                emailRedirectTo: `${window.location.origin}/admin`,
              },
            });

            if (error) throw error;

            if (data.user) {
              const user = mapSupabaseUser(data.user);

              set((state) => {
                state.user = user;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.error = null;
              });
            }

            appLogger.info('✅ [AuthStore] Conta criada com sucesso');
          } catch (err: any) {
            const errorMsg = err.message || 'Erro ao criar conta';
            set((state) => {
              state.user = null;
              state.isAuthenticated = false;
              state.isLoading = false;
              state.error = errorMsg;
            });
            appLogger.error('❌ [AuthStore] Erro no signup:', err);
            throw err;
          }
        },

        logout: async () => {
          set((state) => {
            state.isLoading = true;
          });

          try {
            appLogger.info('🚪 [AuthStore] Fazendo logout...');

            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            set((state) => {
              state.user = null;
              state.isAuthenticated = false;
              state.isLoading = false;
              state.error = null;
            });

            appLogger.info('✅ [AuthStore] Logout bem-sucedido');
          } catch (err: any) {
            const errorMsg = err.message || 'Erro ao fazer logout';
            set((state) => {
              state.isLoading = false;
              state.error = errorMsg;
            });
            appLogger.error('❌ [AuthStore] Erro no logout:', err);
            throw err;
          }
        },

        resetPassword: async (email) => {
          try {
            appLogger.info('🔑 [AuthStore] Enviando email de reset...');

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (error) throw error;

            appLogger.info('✅ [AuthStore] Email de reset enviado');
          } catch (err: any) {
            appLogger.error('❌ [AuthStore] Erro no reset:', err);
            throw err;
          }
        },

        // Session management
        setUser: (user) =>
          set((state) => {
            state.user = user;
            state.isAuthenticated = !!user;
          }),

        setSession: (session) =>
          set((state) => {
            if (session?.user) {
              state.user = mapSupabaseUser(session.user);
              state.isAuthenticated = true;
            } else {
              state.user = null;
              state.isAuthenticated = false;
            }
            state.isLoading = false;
            state.initialized = true;
          }),

        refreshSession: async () => {
          try {
            const { data, error } = await supabase.auth.refreshSession();
            if (error) throw error;

            if (data.user) {
              const user = mapSupabaseUser(data.user);
              set((state) => {
                state.user = user;
                state.isAuthenticated = true;
              });
            }
          } catch (err: any) {
            appLogger.error('❌ [AuthStore] Erro ao atualizar sessão:', err);
          }
        },

        // State management
        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
          }),

        clearError: () =>
          set((state) => {
            state.error = null;
          }),

        setInitialized: (initialized) =>
          set((state) => {
            state.initialized = initialized;
          }),

        // Reset
        reset: () => set(initialState),
      })),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    { name: 'AuthStore' },
  ),
);

// ============================================================================
// SELECTORS
// ============================================================================

export const useUser = () => useAuthStore((state) => state.user);

export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);

export const useAuthLoading = () => useAuthStore((state) => state.isLoading);

export const useAuthError = () => useAuthStore((state) => state.error);

export const useAuthActions = () =>
  useAuthStore((state) => ({
    login: state.login,
    signUp: state.signUp,
    logout: state.logout,
    resetPassword: state.resetPassword,
    clearError: state.clearError,
  }));
