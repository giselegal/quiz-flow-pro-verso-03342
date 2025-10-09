import type { Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/integrations/supabase/supabaseLazy';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
const DISABLE = import.meta.env.VITE_DISABLE_SUPABASE === 'true';
const ENABLE = import.meta.env.VITE_ENABLE_SUPABASE !== 'false';
let authSupabase: any | null = null;
async function ensureSupabase() {
  if (authSupabase) return authSupabase;
  if (DISABLE || !ENABLE) return null;
  try { authSupabase = await getSupabaseClient(); } catch { authSupabase = null; }
  return authSupabase;
}

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
  if (import.meta.env.DEV) console.log('🔑 AuthProvider: INICIANDO');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (OFFLINE) {
      // Modo offline: não conectar no Supabase, criar perfil padrão
      setUser(null);
      setProfile({
        id: 'offline-user',
        email: '',
        role: 'user',
        plan: 'free',
        created_at: new Date().toISOString(),
      });
      setSession(null);
      setLoading(false);
      return;
    }
    if (import.meta.env.DEV) console.log('🔑 AuthProvider: Configurando listeners de autenticação');
    // Configurar listener de auth PRIMEIRO
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (import.meta.env.DEV)
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
    if (import.meta.env.DEV) console.log('🔑 AuthProvider: Verificando sessão existente...');
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (import.meta.env.DEV)
        console.log('🔑 AuthProvider: Sessão obtida:', { hasSession: !!session });
      setSession(session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
        });
        loadUserProfile(session.user.id);
        if (import.meta.env.DEV)
          console.log('🔑 AuthProvider: Usuário definido:', session.user.email);
      } else {
        if (import.meta.env.DEV) console.log('🔑 AuthProvider: Nenhuma sessão ativa');
        setProfile(null);
      }
      setLoading(false);
      if (import.meta.env.DEV) console.log('🔑 AuthProvider: Loading concluído');
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
          created_at: data.created_at,
        };
        setProfile(profileData);
      } else {
        // Se não existe profile, criar um padrão
        const defaultProfile: UserProfile = {
          id: userId,
          email: user?.email || '',
          role: 'user',
          plan: 'free',
          created_at: new Date().toISOString(),
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
        created_at: new Date().toISOString(),
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
      // Suporte a login local (sem Supabase) via variáveis de ambiente
      const LOCAL_EMAIL = (import.meta as any)?.env?.VITE_LOCAL_ADMIN_EMAIL as string | undefined;
      const LOCAL_PASSWORD = (import.meta as any)?.env?.VITE_LOCAL_ADMIN_PASSWORD as
        | string
        | undefined;

      // Se credenciais locais estiverem definidas e baterem, autentica localmente
      if (
        LOCAL_EMAIL &&
        LOCAL_PASSWORD &&
        email?.toLowerCase() === LOCAL_EMAIL.toLowerCase() &&
        password === LOCAL_PASSWORD
      ) {
        const fakeId = 'local-admin';
        setUser({ id: fakeId, email: LOCAL_EMAIL, name: 'Admin Local' });
        setProfile({
          id: fakeId,
          email: LOCAL_EMAIL,
          name: 'Admin Local',
          role: 'admin',
          plan: 'pro',
          created_at: new Date().toISOString(),
        });
        setSession(null);
        setLoading(false);
        return;
      }

      // Suporte adicional: credenciais específicas fornecidas pelo cliente
      if (email?.toLowerCase() === 'gralouback@gmail.com' && password === 'Gr@06091425') {
        const fakeId = 'admin-gralouback';
        setUser({ id: fakeId, email: 'gralouback@gmail.com', name: 'Admin' });
        setProfile({
          id: fakeId,
          email: 'gralouback@gmail.com',
          name: 'Admin',
          role: 'admin',
          plan: 'pro',
          created_at: new Date().toISOString(),
        });
        setSession(null);
        setLoading(false);
        return;
      }

      // Se Supabase estiver desabilitado, mas sem credenciais locais válidas
      if (OFFLINE) {
        throw new Error(
          'Autenticação offline: defina VITE_LOCAL_ADMIN_EMAIL e VITE_LOCAL_ADMIN_PASSWORD para login local.'
        );
      }

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
