import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configurar listener de auth PRIMEIRO
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session?.user) {
        // Buscar dados do profile se disponível - defer to avoid deadlock
        setTimeout(async () => {
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: profile?.name || session.user.user_metadata?.name,
            });
          } catch (error) {
            // Fallback para dados básicos do usuário
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name,
            });
          }
        }, 0);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    // DEPOIS verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
        });
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
        localStorage.removeItem(key);
      }
    });
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      cleanupAuthState();
      try {
        await supabase.auth.signOut({ scope: "global" });
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
      await supabase.auth.signOut({ scope: "global" });
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Logout error:", error);
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
    session,
    loading,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
