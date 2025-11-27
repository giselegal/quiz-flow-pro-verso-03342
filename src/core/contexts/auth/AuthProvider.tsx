/**
 * 🔐 AUTH PROVIDER - Gerenciamento de Autenticação
 * 
 * Provider independente para autenticação e gerenciamento de usuário.
 * Extraído do SuperUnifiedProvider para reduzir acoplamento.
 * 
 * RESPONSABILIDADES:
 * - Login/Logout
 * - Gestão de sessão
 * - Estado do usuário
 * - Verificação de permissões
 * 
 * BENEFÍCIOS:
 * - Isolamento de responsabilidades
 * - Re-render apenas quando auth muda
 * - Fácil de testar e manter
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react';
import { supabase } from '@/services/integrations/supabase/customClient';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES
// ============================================================================

export interface User {
    id: string;
    email?: string;
    name?: string;
    avatar?: string;
    role?: 'owner' | 'editor' | 'viewer';
    created_at?: string;
    metadata?: Record<string, any>;
    // Aliases para compatibilidade com código legado
    user_metadata?: Record<string, any>;
    app_metadata?: Record<string, any>;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface AuthContextValue extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    signOut: () => Promise<void>; // Alias para logout (compatibilidade)
    signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
    updateUser: (updates: Partial<User>) => Promise<void>;
    refreshSession: () => Promise<void>;
    clearError: () => void;
}// ============================================================================
// CONTEXT
// ============================================================================

const AuthContext = createContext<AuthContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
    });

    // ============================================================================
    // ACTIONS
    // ============================================================================

    const setLoading = useCallback((isLoading: boolean) => {
        setState(prev => ({ ...prev, isLoading }));
    }, []);

    const setError = useCallback((error: string | null) => {
        setState(prev => ({ ...prev, error }));
    }, []);

    const setUser = useCallback((user: User | null) => {
        setState(prev => ({
            ...prev,
            user,
            isAuthenticated: !!user,
            isLoading: false,
            error: null,
        }));
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, [setError]);

    // ============================================================================
    // METHODS
    // ============================================================================

    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                setUser({
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.user_metadata?.name,
                    avatar: data.user.user_metadata?.avatar_url,
                    role: data.user.user_metadata?.role || 'viewer',
                    created_at: data.user.created_at,
                    metadata: data.user.user_metadata,
                    user_metadata: data.user.user_metadata,
                    app_metadata: (data.user as any).app_metadata,
                });

                appLogger.info('✅ Login realizado com sucesso', { userId: data.user.id });
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Erro ao fazer login';
            setError(errorMessage);
            appLogger.error('❌ Erro no login:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError, setUser]);

    const logout = useCallback(async () => {
        setLoading(true);

        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            setUser(null);
            appLogger.info('✅ Logout realizado com sucesso');
        } catch (error: any) {
            const errorMessage = error.message || 'Erro ao fazer logout';
            setError(errorMessage);
            appLogger.error('❌ Erro no logout:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError, setUser]);

    const signUp = useCallback(async (
        email: string,
        password: string,
        metadata?: Record<string, any>
    ) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: metadata,
                },
            });

            if (error) throw error;

            if (data.user) {
                setUser({
                    id: data.user.id,
                    email: data.user.email,
                    name: metadata?.name,
                    avatar: metadata?.avatar_url,
                    role: metadata?.role || 'viewer',
                    created_at: data.user.created_at,
                    metadata,
                    user_metadata: data.user.user_metadata,
                    app_metadata: (data.user as any).app_metadata,
                });

                appLogger.info('✅ Cadastro realizado com sucesso', { userId: data.user.id });
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Erro ao criar conta';
            setError(errorMessage);
            appLogger.error('❌ Erro no cadastro:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError, setUser]);

    const updateUser = useCallback(async (updates: Partial<User>) => {
        if (!state.user) {
            throw new Error('Nenhum usuário autenticado');
        }

        setLoading(true);

        try {
            const { data, error } = await supabase.auth.updateUser({
                data: updates,
            });

            if (error) throw error;

            if (data.user) {
                const updatedMetadata = {
                    ...state.user.metadata,
                    ...updates,
                };
                setUser({
                    ...state.user,
                    ...updates,
                    metadata: updatedMetadata,
                    user_metadata: updatedMetadata,
                    app_metadata: state.user.app_metadata,
                });

                appLogger.info('✅ Usuário atualizado com sucesso');
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Erro ao atualizar usuário';
            setError(errorMessage);
            appLogger.error('❌ Erro ao atualizar usuário:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [state.user, setLoading, setError, setUser]);

    const refreshSession = useCallback(async () => {
        try {
            const { data, error } = await supabase.auth.refreshSession();

            if (error) throw error;

            if (data.user) {
                setUser({
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.user_metadata?.name,
                    avatar: data.user.user_metadata?.avatar_url,
                    role: data.user.user_metadata?.role || 'viewer',
                    created_at: data.user.created_at,
                    metadata: data.user.user_metadata,
                    user_metadata: data.user.user_metadata,
                    app_metadata: (data.user as any).app_metadata,
                });
            }
        } catch (error: any) {
            appLogger.warn('⚠️ Erro ao atualizar sessão:', error);
            // Não seta erro aqui para não interromper a UX
        }
    }, [setUser]);

    // ============================================================================
    // EFFECTS
    // ============================================================================

    // Verificar sessão ao montar
    useEffect(() => {
        let mounted = true;

        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!mounted) return;

                if (session?.user) {
                    setUser({
                        id: session.user.id,
                        email: session.user.email,
                        name: session.user.user_metadata?.name,
                        avatar: session.user.user_metadata?.avatar_url,
                        role: session.user.user_metadata?.role || 'viewer',
                        created_at: session.user.created_at,
                        metadata: session.user.user_metadata,
                        user_metadata: session.user.user_metadata,
                        app_metadata: (session.user as any).app_metadata,
                    });
                } else {
                    setUser(null);
                }
            } catch (error) {
                appLogger.error('❌ Erro ao verificar sessão:', error);
                if (mounted) {
                    setUser(null);
                }
            }
        };

        checkSession();

        // Listener para mudanças de auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: any, session: any) => {
                if (!mounted) return;

                appLogger.debug(`🔐 Auth state changed: ${event}`);

                if (session?.user) {
                    setUser({
                        id: session.user.id,
                        email: session.user.email,
                        name: session.user.user_metadata?.name,
                        avatar: session.user.user_metadata?.avatar_url,
                        role: session.user.user_metadata?.role || 'viewer',
                        created_at: session.user.created_at,
                        metadata: session.user.user_metadata,
                        user_metadata: session.user.user_metadata,
                        app_metadata: (session.user as any).app_metadata,
                    });
                } else {
                    setUser(null);
                }
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [setUser]);

    // ============================================================================
    // CONTEXT VALUE
    // ============================================================================

    const contextValue = useMemo<AuthContextValue>(
        () => ({
            ...state,
            login,
            logout,
            signOut: logout, // Alias para compatibilidade
            signUp,
            updateUser,
            refreshSession,
            clearError,
        }),
        [state, login, logout, signUp, updateUser, refreshSession, clearError]
    ); return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// ============================================================================
// HOOK
// ============================================================================

export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }

    return context;
};
