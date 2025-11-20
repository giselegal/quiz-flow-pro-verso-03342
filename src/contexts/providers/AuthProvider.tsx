import React, { createContext, useContext, useReducer, ReactNode, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { appLogger } from '@/lib/utils/appLogger';

export interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialAuth: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export type AuthAction =
  | { type: 'SET_AUTH'; payload: Partial<AuthState> }
  | { type: 'LOGIN_SUCCESS'; payload: any }
  | { type: 'LOGOUT' }
  | { type: 'SET_ERROR'; payload: string | null };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_AUTH':
      return { ...state, ...action.payload };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false, error: null };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

interface AuthContextValue {
  state: AuthState;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setAuth: (updates: Partial<AuthState>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuth);

  const setAuth = useCallback((updates: Partial<AuthState>) => {
    dispatch({ type: 'SET_AUTH', payload: updates });
  }, []);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'SET_AUTH', payload: { isLoading: true } });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
    } catch (e: any) {
      appLogger.warn('[AuthProvider] Falha login', { data: [{ error: e?.message }] });
      dispatch({ type: 'SET_ERROR', payload: e?.message || 'Erro de autenticação' });
      dispatch({ type: 'SET_AUTH', payload: { isLoading: false } });
    }
  }, []);

  const logout = useCallback(async () => {
    try { await supabase.auth.signOut(); } catch { }
    dispatch({ type: 'LOGOUT' });
  }, []);

  const value = useMemo(() => ({ state, loginWithEmail, logout, setAuth }), [state, loginWithEmail, logout, setAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
