import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'editor' | 'admin';
  plan: 'free' | 'pro' | 'enterprise';
  avatar_url?: string;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  hasPermission: (action: string, resource?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  console.log('🔑 AuthProvider: INICIANDO');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔑 AuthProvider: Configurando listeners de autenticação');
    // Configurar listener de auth PRIMEIRO
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔑 AuthProvider: Estado de auth mudou:', {
        event: _event,
        hasSession: !!session,
      });
      setSession(session);

      if (session?.user) {
        // Definir usuário imediatamente
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
        });
        // Carregar profile em seguida
        loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }

      setLoading(false);
    });

    // DEPOIS verificar sessão existente
    console.log('🔑 AuthProvider: Verificando sessão existente...');
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔑 AuthProvider: Sessão obtida:', { hasSession: !!session });
      setSession(session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
        });
        loadUserProfile(session.user.id);
        console.log('🔑 AuthProvider: Usuário definido:', session.user.email);
      } else {
        console.log('🔑 AuthProvider: Nenhuma sessão ativa');
        setProfile(null);
      }
      setLoading(false);
      console.log('🔑 AuthProvider: Loading concluído');
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      
      if (data && !error) {
        const profileData: UserProfile = {
          id: data.id,
          email: data.email,
          name: data.name || undefined,
          role: 'user', // Padrão por enquanto
          plan: 'free', // Padrão por enquanto
          avatar_url: undefined,
          created_at: data.created_at
        };
        setProfile(profileData);
      } else {
        // Se não existe profile, criar um padrão
        const defaultProfile: UserProfile = {
          id: userId,
          email: user?.email || '',
          role: 'user',
          plan: 'free',
          created_at: new Date().toISOString()
        };
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Erro ao carregar profile:', error);
      // Profile padrão em caso de erro
      const defaultProfile: UserProfile = {
        id: userId,
        email: user?.email || '',
        role: 'user',
        plan: 'free',
        created_at: new Date().toISOString()
      };
      setProfile(defaultProfile);
    }
  };

  const hasPermission = (action: string, _resource?: string): boolean => {
    if (!profile) return false;

    // Permission matrix
    const permissions: Record<string, Record<string, boolean>> = {
      user: {
        'quiz.take': true,
        'quiz.view': true,
        'profile.edit': true,
      },
      editor: {
        'quiz.create': true,
        'quiz.edit': true,
        'quiz.delete': true,
        'template.use': true,
        'analytics.view': true,
        'editor.use': true,
      },
      admin: {
        'user.manage': true,
        'template.manage': true,
        'system.configure': true,
        'analytics.full': true,
        'editor.use': true,
      },
    };

    const userPermissions = permissions[profile.role] || {};
    return userPermissions[action] === true;
  };

  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      cleanupAuthState();
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue mesmo se falhar
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Forçar limpeza local mesmo com erro
      setUser(null);
      setSession(null);
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name || email,
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    login,
    logout,
    signup,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
