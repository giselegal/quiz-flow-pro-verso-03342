// =============================================================================
// HOOK DE AUTENTICAÇÃO - SUPABASE AUTH
// Sistema de Quiz Quest Challenge Verse
// =============================================================================

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, createProfile } from '@shared/lib/supabase';
import { Profile } from '@shared/types/supabase';

// =============================================================================
// TIPOS
// =============================================================================

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
}

export interface AuthContextType extends AuthState {
  // Autenticação
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, userData?: Partial<Profile>) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  
  // OAuth
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithGithub: () => Promise<{ error: AuthError | null }>;
  
  // Recuperação de senha
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>;
  
  // Perfil
  updateProfile: (updates: Partial<Profile>) => Promise<Profile | null>;
  refreshProfile: () => Promise<void>;
  
  // Utilitários
  isAdmin: () => boolean;
  canEdit: (resourceUserId: string) => boolean;
}

// =============================================================================
// CONTEXT
// =============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// =============================================================================
// HOOK PRINCIPAL
// =============================================================================

export const useAuthState = (): AuthContextType => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    initialized: false,
  });

  // =============================================================================
  // INICIALIZAÇÃO
  // =============================================================================

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Verificar sessão existente
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao obter sessão:', error);
        }

        if (isMounted) {
          if (session?.user) {
            await loadUserProfile(session.user);
          }
          
          setState(prev => ({
            ...prev,
            user: session?.user || null,
            session: session,
            loading: false,
            initialized: true,
          }));
        }
      } catch (error) {
        console.error('Erro na inicialização da auth:', error);
        if (isMounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            initialized: true,
          }));
        }
      }
    };

    initializeAuth();

    // Listener para mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        console.log('Auth state changed:', event, session?.user?.email);

        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user);
          setState(prev => ({
            ...prev,
            user: session.user,
            session: session,
            loading: false,
          }));
        } else if (event === 'SIGNED_OUT') {
          setState(prev => ({
            ...prev,
            user: null,
            profile: null,
            session: null,
            loading: false,
          }));
        } else if (event === 'TOKEN_REFRESHED' && session) {
          setState(prev => ({
            ...prev,
            session: session,
          }));
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // =============================================================================
  // FUNÇÕES AUXILIARES
  // =============================================================================

  const loadUserProfile = async (user: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Perfil não existe, criar um novo
        const newProfile = await createProfile(user);
        setState(prev => ({ ...prev, profile: newProfile }));
      } else if (error) {
        console.error('Erro ao carregar perfil:', error);
      } else {
        setState(prev => ({ ...prev, profile }));
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error);
    }
  };

  // =============================================================================
  // MÉTODOS DE AUTENTICAÇÃO
  // =============================================================================

  const signIn = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true }));
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      // O estado será atualizado pelo listener onAuthStateChange
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }

    return { error };
  }, []);

  const signUp = useCallback(async (email: string, password: string, userData?: Partial<Profile>) => {
    setState(prev => ({ ...prev, loading: true }));

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData?.full_name || null,
          avatar_url: userData?.avatar_url || null,
        },
      },
    });

    if (!error) {
      // O usuário receberá um email de confirmação
      // O estado será atualizado quando ele confirmar
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }

    return { error };
  }, []);

  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    const { error } = await supabase.auth.signOut();
    
    // O estado será atualizado pelo listener onAuthStateChange
    return { error };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setState(prev => ({ ...prev, loading: false }));
    }

    return { error };
  }, []);

  const signInWithGithub = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setState(prev => ({ ...prev, loading: false }));
    }

    return { error };
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    return { error };
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    return { error };
  }, []);

  // =============================================================================
  // MÉTODOS DE PERFIL
  // =============================================================================

  const updateProfile = useCallback(async (updates: Partial<Profile>): Promise<Profile | null> => {
    if (!state.user) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', state.user.id)
        .select()
        .single();

      if (error) throw error;

      setState(prev => ({ ...prev, profile: data }));
      return data;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return null;
    }
  }, [state.user]);

  const refreshProfile = useCallback(async () => {
    if (state.user) {
      await loadUserProfile(state.user);
    }
  }, [state.user]);

  // =============================================================================
  // UTILITÁRIOS
  // =============================================================================

  const isAdmin = useCallback(() => {
    return state.profile?.role === 'admin';
  }, [state.profile]);

  const canEdit = useCallback((resourceUserId: string) => {
    if (!state.user) return false;
    return state.user.id === resourceUserId || isAdmin();
  }, [state.user, isAdmin]);

  // =============================================================================
  // RETURN
  // =============================================================================

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithGithub,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshProfile,
    isAdmin,
    canEdit,
  };
};

// =============================================================================
// PROVIDER
// =============================================================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthState();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
