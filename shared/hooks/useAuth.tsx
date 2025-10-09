// =============================================================================
// HOOK DE AUTENTICAÇÃO
// Sistema de Quiz Quest Challenge Verse
// =============================================================================

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { User, Session, AuthError, SupabaseClient } from '@supabase/supabase-js';
import { supabase, createProfile, getCurrentProfile } from '../lib/supabase';
import { Profile, AuthState, AuthUser } from '../types/supabase';
import type { Database as SharedDB } from '../types/supabase';

// =============================================================================
// CONTEXTO DE AUTENTICAÇÃO
// =============================================================================

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =============================================================================
// PROVIDER DE AUTENTICAÇÃO
// =============================================================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // =============================================================================
  // EFEITOS
  // =============================================================================

  useEffect(() => {
    let mounted = true;

    // Função para obter sessão inicial
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Erro ao obter sessão:', error);
          if (mounted) {
            setUser(null);
            setIsLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          await setUserFromSession(session);
        } else if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Erro ao obter sessão inicial:', error);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    // Listener para mudanças de autenticação (protegido)
    let subscription: { unsubscribe: () => void } | null = null;
    if (typeof (supabase as any)?.auth?.onAuthStateChange === 'function') {
      const result = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.id);

        try {
          if (session?.user) {
            await setUserFromSession(session);
          } else {
            setUser(null);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Erro ao processar mudança de auth:', error);
          setUser(null);
          setIsLoading(false);
        }
      });
      subscription = (result as any)?.data?.subscription || null;
    }

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  // =============================================================================
  // FUNÇÕES AUXILIARES
  // =============================================================================

  const setUserFromSession = async (session: Session) => {
    try {
      setIsLoading(true);

      const authUser = session.user;
      let profile = await getCurrentProfile();

      // Se não há perfil, tentar criar um
      if (!profile && authUser) {
        try {
          profile = await createProfile(authUser);
        } catch (error) {
          console.error('Erro ao criar perfil:', error);
          // Continuar mesmo sem perfil
        }
      }

      const user: AuthUser = {
        id: authUser.id,
        email: authUser.email || '',
        profile: profile || undefined,
      };

      setUser(user);
    } catch (error) {
      console.error('Erro ao configurar usuário:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // =============================================================================
  // FUNÇÕES DE AUTENTICAÇÃO
  // =============================================================================

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        return { error };
      }

      // O listener onAuthStateChange cuidará de configurar o usuário
      return { error: null };
    } catch (error) {
      console.error('Erro no login:', error);
      setIsLoading(false);
      return { error: error as AuthError };
    }
  };

  const signUp = async (email: string, password: string, metadata = {}) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        setIsLoading(false);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Erro no registro:', error);
      setIsLoading(false);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Erro ao fazer logout:', error);
      }

      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      return { error };
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      return { error: error as AuthError };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) {
        return { error: 'Usuário não autenticado' };
      }

      // Usar cliente tipado para resolver o tipo 'never' no update
      const sb = supabase as unknown as SupabaseClient<SharedDB>;
      type ProfilesUpdate = SharedDB['public']['Tables']['profiles']['Update'];
      const { error } = await sb
        .from('profiles')
        .update(updates as ProfilesUpdate)
        .eq('id', user.id);

      if (error) {
        return { error: error.message };
      }

      // Atualizar o usuário local
      setUser(prev =>
        prev
          ? {
            ...prev,
            profile: prev.profile ? { ...prev.profile, ...updates } : undefined,
          }
          : null
      );

      return { error: null };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { error: 'Erro interno do servidor' };
    }
  };

  const refreshProfile = async () => {
    try {
      if (!user) return;

      const profile = await getCurrentProfile();

      setUser(prev =>
        prev
          ? {
            ...prev,
            profile: profile || undefined,
          }
          : null
      );
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  // =============================================================================
  // VALOR DO CONTEXTO
  // =============================================================================

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// =============================================================================
// HOOK PARA USAR AUTENTICAÇÃO
// =============================================================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

// =============================================================================
// HOOKS AUXILIARES
// =============================================================================

/**
 * Hook que garante que o usuário está autenticado
 */
export function useRequireAuth() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirecionar para login ou mostrar modal
      window.location.href = '/auth/login';
    }
  }, [user, isLoading]);

  return { user, isLoading, isAuthenticated: !!user };
}

/**
 * Hook para verificar permissões
 */
export function usePermissions() {
  const { user } = useAuth();

  const isAdmin = user?.profile?.role === 'admin';
  const isModerator = user?.profile?.role === 'moderator' || isAdmin;
  const isPro = user?.profile?.plan === 'pro' || user?.profile?.plan === 'enterprise';
  const isEnterprise = user?.profile?.plan === 'enterprise';

  const can = {
    createQuiz: !!user,
    editQuiz: (quizAuthorId: string) => user?.id === quizAuthorId || isAdmin,
    deleteQuiz: (quizAuthorId: string) => user?.id === quizAuthorId || isAdmin,
    moderateContent: isModerator,
    accessAnalytics: !!user,
    accessAdvancedFeatures: isPro,
    accessAdminPanel: isAdmin,
    uploadMedia: !!user,
    createTemplates: isPro,
    accessApi: isEnterprise,
  };

  return {
    isAdmin,
    isModerator,
    isPro,
    isEnterprise,
    can,
  };
}

/**
 * Hook para autenticação social
 */
export function useSocialAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const signInWithProvider = async (provider: 'google' | 'github' | 'facebook') => {
    try {
      setIsLoading(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error(`Erro no login com ${provider}:`, error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error(`Erro no login social:`, error);
      return { error: error as AuthError };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInWithProvider,
    isLoading,
  };
}

// =============================================================================
// UTILITÁRIOS
// =============================================================================

/**
 * Verifica se o usuário tem uma role específica
 */
export function hasRole(user: AuthUser | null, role: 'user' | 'admin' | 'moderator'): boolean {
  if (!user?.profile) return false;

  if (role === 'user') return true; // Qualquer usuário autenticado
  if (role === 'moderator') return ['moderator', 'admin'].includes(user.profile.role);
  if (role === 'admin') return user.profile.role === 'admin';

  return false;
}

/**
 * Verifica se o usuário tem um plano específico
 */
export function hasPlan(user: AuthUser | null, plan: 'free' | 'pro' | 'enterprise'): boolean {
  if (!user?.profile) return false;

  const userPlan = user.profile.plan;

  if (plan === 'free') return true; // Todos têm acesso ao free
  if (plan === 'pro') return ['pro', 'enterprise'].includes(userPlan);
  if (plan === 'enterprise') return userPlan === 'enterprise';

  return false;
}

export default useAuth;
