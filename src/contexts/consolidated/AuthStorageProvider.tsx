/**
 * 🔐💾 AUTH STORAGE PROVIDER - FASE 3 CONSOLIDAÇÃO
 * 
 * Provider consolidado que unifica AuthProvider + StorageProvider
 * para gerenciamento integrado de autenticação e persistência.
 * 
 * RESPONSABILIDADES UNIFICADAS:
 * - Autenticação de usuários (login/logout/signup)
 * - Gestão de sessão
 * - Persistência local (localStorage/sessionStorage)
 * - Cache de dados do usuário
 * - Token management
 * 
 * BENEFÍCIOS DA CONSOLIDAÇÃO:
 * - Redução de providers: 2 → 1
 * - Gestão integrada de auth + storage
 * - Menos re-renders (estado unificado)
 * - API mais coesa
 * 
 * @version 3.0.0
 * @phase FASE-3
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react';
import { supabase } from '@/services/integrations/supabase/customClient';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES - AUTH
// ============================================================================

export interface User {
    id: string;
    email?: string;
    name?: string;
    avatar?: string;
    role?: 'owner' | 'editor' | 'viewer';
    created_at?: string;
    metadata?: Record<string, any>;
    user_metadata?: Record<string, any>;
    app_metadata?: Record<string, any>;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// ============================================================================
// TYPES - STORAGE
// ============================================================================

export type StorageType = 'local' | 'session';

export interface StorageItem<T = any> {
    value: T;
    timestamp: number;
    expiresAt?: number;
}

export interface StorageOptions {
    type?: StorageType;
    namespace?: string;
    ttl?: number;
}

// ============================================================================
// UNIFIED CONTEXT VALUE
// ============================================================================

export interface AuthStorageContextValue {
    // Auth properties
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Auth methods
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    signOut: () => Promise<void>;
    signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
    updateUser: (updates: Partial<User>) => Promise<void>;
    refreshSession: () => Promise<void>;
    clearError: () => void;
    resetPassword: (email: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;

    // Storage methods
    set: <T = any>(key: string, value: T, options?: StorageOptions) => boolean;
    get: <T = any>(key: string, options?: StorageOptions) => T | null;
    remove: (key: string, options?: StorageOptions) => boolean;
    clear: (options?: StorageOptions) => boolean;
    has: (key: string, options?: StorageOptions) => boolean;
    keys: (options?: StorageOptions) => string[];
    size: (options?: StorageOptions) => number;

    // Integrated methods (auth + storage)
    persistUserData: (data: any) => boolean;
    getUserData: <T = any>() => T | null;
    clearUserData: () => boolean;
}

// ============================================================================
// CONTEXT
// ============================================================================

const AuthStorageContext = createContext<AuthStorageContextValue | null>(null);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getStorage(type: StorageType): Storage {
    return type === 'local' ? localStorage : sessionStorage;
}

function buildKey(key: string, namespace?: string): string {
    return namespace ? `${namespace}:${key}` : key;
}

function safeJSONParse<T>(value: string): T | null {
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}

function safeJSONStringify(value: any): string | null {
    try {
        return JSON.stringify(value);
    } catch {
        return null;
    }
}

// ============================================================================
// PROVIDER
// ============================================================================

interface AuthStorageProviderProps {
    children: ReactNode;
    defaultNamespace?: string;
    defaultStorageType?: StorageType;
}

export const AuthStorageProvider: React.FC<AuthStorageProviderProps> = ({
    children,
    defaultNamespace = 'quiz-flow',
    defaultStorageType = 'local',
}) => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
    });

    // ============================================================================
    // AUTH METHODS
    // ============================================================================

    const login = useCallback(async (email: string, password: string) => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            appLogger.info('🔐 [AuthStorage] Iniciando login...', { email });

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                appLogger.error('❌ [AuthStorage] Erro no login:', { error: error.message, status: error.status });
                throw error;
            }

            if (!data?.user) {
                appLogger.error('❌ [AuthStorage] Login retornou sem usuário');
                throw new Error('Login falhou: sem dados de usuário');
            }

            appLogger.info('✅ [AuthStorage] Resposta do Supabase recebida:', { userId: data.user.id, hasSession: !!data.session });

            const user: User = {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.name,
                avatar: data.user.user_metadata?.avatar,
                metadata: data.user.user_metadata,
                user_metadata: data.user.user_metadata,
                app_metadata: data.user.app_metadata,
            };

            setAuthState({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            // Persist user data to storage
            persistUserData(user);

            appLogger.info('✅ [AuthStorage] Login bem-sucedido e estado atualizado');
        } catch (err: any) {
            const errorMsg = err.message || 'Erro ao fazer login';
            setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: errorMsg,
            });
            appLogger.error('❌ [AuthStorage] Erro no login:', err);
            throw err;
        }
    }, []);

    const logout = useCallback(async () => {
        setAuthState(prev => ({ ...prev, isLoading: true }));
        try {
            appLogger.info('🚪 [AuthStorage] Fazendo logout...');

            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });

            // Clear user data from storage
            clearUserData();

            appLogger.info('✅ [AuthStorage] Logout bem-sucedido');
        } catch (err: any) {
            const errorMsg = err.message || 'Erro ao fazer logout';
            setAuthState(prev => ({ ...prev, isLoading: false, error: errorMsg }));
            appLogger.error('❌ [AuthStorage] Erro no logout:', err);
            throw err;
        }
    }, []);

    const signUp = useCallback(async (email: string, password: string, metadata?: Record<string, any>) => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            appLogger.info('📝 [AuthStorage] Criando conta...');

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
                const user: User = {
                    id: data.user.id,
                    email: data.user.email,
                    name: metadata?.name,
                    metadata,
                    user_metadata: data.user.user_metadata,
                    app_metadata: data.user.app_metadata,
                };

                setAuthState({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });

                persistUserData(user);
            }

            appLogger.info('✅ [AuthStorage] Conta criada com sucesso');
        } catch (err: any) {
            const errorMsg = err.message || 'Erro ao criar conta';
            setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: errorMsg,
            });
            appLogger.error('❌ [AuthStorage] Erro no signup:', err);
            throw err;
        }
    }, []);

    const updateUser = useCallback(async (updates: Partial<User>) => {
        if (!authState.user) {
            throw new Error('Nenhum usuário autenticado');
        }

        try {
            appLogger.info('🔄 [AuthStorage] Atualizando usuário...');

            const { data, error } = await supabase.auth.updateUser({
                data: { ...authState.user.metadata, ...updates },
            });

            if (error) throw error;

            const updatedUser: User = {
                ...authState.user,
                ...updates,
                metadata: { ...authState.user.metadata, ...updates },
            };

            setAuthState(prev => ({ ...prev, user: updatedUser }));
            persistUserData(updatedUser);

            appLogger.info('✅ [AuthStorage] Usuário atualizado');
        } catch (err: any) {
            appLogger.error('❌ [AuthStorage] Erro ao atualizar usuário:', err);
            throw err;
        }
    }, [authState.user]);

    const refreshSession = useCallback(async () => {
        try {
            const { data, error } = await supabase.auth.refreshSession();
            if (error) throw error;

            if (data.user) {
                const user: User = {
                    id: data.user.id,
                    email: data.user.email,
                    metadata: data.user.user_metadata,
                    user_metadata: data.user.user_metadata,
                    app_metadata: data.user.app_metadata,
                };

                setAuthState(prev => ({ ...prev, user, isAuthenticated: true }));
                persistUserData(user);
            }
        } catch (err: any) {
            appLogger.error('❌ [AuthStorage] Erro ao atualizar sessão:', err);
        }
    }, []);

    const clearError = useCallback(() => {
        setAuthState(prev => ({ ...prev, error: null }));
    }, []);

    const resetPassword = useCallback(async (email: string) => {
        try {
            appLogger.info('🔑 [AuthStorage] Enviando email de reset de senha...');

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (error) throw error;

            appLogger.info('✅ [AuthStorage] Email de reset enviado com sucesso');
        } catch (err: any) {
            const errorMsg = err.message || 'Erro ao enviar email de reset';
            appLogger.error('❌ [AuthStorage] Erro no reset de senha:', err);
            throw err;
        }
    }, []);

    const signInWithGoogle = useCallback(async () => {
        try {
            appLogger.info('🔐 [AuthStorage] Iniciando login com Google...');
            const params = new URLSearchParams(window.location.search);
            const redirectParam = params.get('redirect');
            const safeRedirectPath = (redirectParam && redirectParam.startsWith('/')) ? redirectParam : '/admin';
            const redirectTo = `${window.location.origin}${safeRedirectPath}`;

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });

            if (error) {
                appLogger.error('❌ [AuthStorage] Erro OAuth:', { error: error.message, status: error.status });

                // Erro específico: provider não habilitado no Supabase
                if (error.message?.includes('Provider') || error.message?.includes('not enabled')) {
                    throw new Error('Google OAuth não está configurado. Configure no Supabase Dashboard: Authentication → Providers → Google');
                }
                throw error;
            }

            if (data?.url) {
                appLogger.info('✅ [AuthStorage] Redirecionando para:', data.url);
                // Redirecionar imediatamente
                window.location.href = data.url;
            } else {
                appLogger.warn('⚠️ [AuthStorage] OAuth não retornou URL de redirect');
            }
        } catch (err: any) {
            const errorMsg = err.message || 'Erro no login com Google';
            setAuthState(prev => ({ ...prev, error: errorMsg }));
            appLogger.error('❌ [AuthStorage] Erro no Google OAuth:', err);
            throw err;
        }
    }, []);

    // ============================================================================
    // STORAGE METHODS
    // ============================================================================

    const set = useCallback(<T = any>(key: string, value: T, options?: StorageOptions): boolean => {
        try {
            const storage = getStorage(options?.type || defaultStorageType);
            const fullKey = buildKey(key, options?.namespace || defaultNamespace);

            const item: StorageItem<T> = {
                value,
                timestamp: Date.now(),
                expiresAt: options?.ttl ? Date.now() + options.ttl : undefined,
            };

            const serialized = safeJSONStringify(item);
            if (!serialized) return false;

            storage.setItem(fullKey, serialized);
            return true;
        } catch (err) {
            appLogger.error('❌ [AuthStorage] Erro ao salvar:', err);
            return false;
        }
    }, [defaultNamespace, defaultStorageType]);

    const get = useCallback(<T = any>(key: string, options?: StorageOptions): T | null => {
        try {
            const storage = getStorage(options?.type || defaultStorageType);
            const fullKey = buildKey(key, options?.namespace || defaultNamespace);

            const raw = storage.getItem(fullKey);
            if (!raw) return null;

            const item = safeJSONParse<StorageItem<T>>(raw);
            if (!item) return null;

            // Check expiration
            if (item.expiresAt && Date.now() > item.expiresAt) {
                storage.removeItem(fullKey);
                return null;
            }

            return item.value;
        } catch (err) {
            appLogger.error('❌ [AuthStorage] Erro ao carregar:', err);
            return null;
        }
    }, [defaultNamespace, defaultStorageType]);

    const remove = useCallback((key: string, options?: StorageOptions): boolean => {
        try {
            const storage = getStorage(options?.type || defaultStorageType);
            const fullKey = buildKey(key, options?.namespace || defaultNamespace);
            storage.removeItem(fullKey);
            return true;
        } catch (err) {
            appLogger.error('❌ [AuthStorage] Erro ao remover:', err);
            return false;
        }
    }, [defaultNamespace, defaultStorageType]);

    const clear = useCallback((options?: StorageOptions): boolean => {
        try {
            const storage = getStorage(options?.type || defaultStorageType);
            const namespace = options?.namespace || defaultNamespace;

            if (!namespace) {
                storage.clear();
                return true;
            }

            // Clear only items with namespace
            const keysToRemove: string[] = [];
            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                if (key?.startsWith(`${namespace}:`)) {
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach(key => storage.removeItem(key));
            return true;
        } catch (err) {
            appLogger.error('❌ [AuthStorage] Erro ao limpar:', err);
            return false;
        }
    }, [defaultNamespace, defaultStorageType]);

    const has = useCallback((key: string, options?: StorageOptions): boolean => {
        const value = get(key, options);
        return value !== null;
    }, [get]);

    const keys = useCallback((options?: StorageOptions): string[] => {
        try {
            const storage = getStorage(options?.type || defaultStorageType);
            const namespace = options?.namespace || defaultNamespace;
            const prefix = `${namespace}:`;

            const result: string[] = [];
            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                if (key?.startsWith(prefix)) {
                    result.push(key.substring(prefix.length));
                }
            }
            return result;
        } catch (err) {
            appLogger.error('❌ [AuthStorage] Erro ao listar chaves:', err);
            return [];
        }
    }, [defaultNamespace, defaultStorageType]);

    const size = useCallback((options?: StorageOptions): number => {
        return keys(options).length;
    }, [keys]);

    // ============================================================================
    // INTEGRATED METHODS (Auth + Storage)
    // ============================================================================

    const persistUserData = useCallback((data: any): boolean => {
        return set('user-data', data, { type: 'local' });
    }, [set]);

    const getUserData = useCallback(<T = any>(): T | null => {
        return get<T>('user-data', { type: 'local' });
    }, [get]);

    const clearUserData = useCallback((): boolean => {
        return remove('user-data', { type: 'local' });
    }, [remove]);

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

    useEffect(() => {
        // Check for existing session on mount
        const checkSession = async () => {
            try {
                appLogger.info('🔍 [AuthStorage] Verificando sessão existente...');
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    appLogger.error('❌ [AuthStorage] Erro ao obter sessão:', error);
                    setAuthState(prev => ({ ...prev, isLoading: false, error: error.message }));
                    return;
                }

                if (session?.user) {
                    appLogger.info('✅ [AuthStorage] Sessão encontrada:', { userId: session.user.id, email: session.user.email });
                    const user: User = {
                        id: session.user.id,
                        email: session.user.email,
                        metadata: session.user.user_metadata,
                        user_metadata: session.user.user_metadata,
                        app_metadata: session.user.app_metadata,
                    };

                    setAuthState({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } else {
                    appLogger.info('ℹ️ [AuthStorage] Nenhuma sessão ativa encontrada');
                    setAuthState(prev => ({ ...prev, isLoading: false }));
                }
            } catch (err) {
                appLogger.error('❌ [AuthStorage] Erro ao verificar sessão:', err);
                setAuthState(prev => ({ ...prev, isLoading: false }));
            }
        };

        checkSession();

        // Listen for auth changes
        appLogger.info('👂 [AuthStorage] Iniciando listener de mudanças de autenticação');
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
            appLogger.info('🔔 [AuthStorage] Evento de auth:', { event, userId: session?.user?.id });

            if (session?.user) {
                const user: User = {
                    id: session.user.id,
                    email: session.user.email,
                    metadata: session.user.user_metadata,
                    user_metadata: session.user.user_metadata,
                    app_metadata: session.user.app_metadata,
                };

                appLogger.info('✅ [AuthStorage] Usuário autenticado via evento:', { userId: user.id, event });
                setAuthState({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
            } else {
                appLogger.info('ℹ️ [AuthStorage] Usuário desautenticado via evento:', { event });
                setAuthState({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                });
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // ============================================================================
    // CONTEXT VALUE
    // ============================================================================

    const contextValue = useMemo<AuthStorageContextValue>(
        () => ({
            // Auth
            ...authState,
            login,
            logout,
            signOut: logout, // Alias
            signUp,
            updateUser,
            refreshSession,
            clearError,
            resetPassword,
            signInWithGoogle,

            // Storage
            set,
            get,
            remove,
            clear,
            has,
            keys,
            size,

            // Integrated
            persistUserData,
            getUserData,
            clearUserData,
        }),
        [
            authState,
            login,
            logout,
            signUp,
            updateUser,
            refreshSession,
            clearError,
            resetPassword,
            signInWithGoogle,
            set,
            get,
            remove,
            clear,
            has,
            keys,
            size,
            persistUserData,
            getUserData,
            clearUserData,
        ]
    );

    return (
        <AuthStorageContext.Provider value={contextValue}>
            {children}
        </AuthStorageContext.Provider>
    );
};

// ============================================================================
// HOOK
// ============================================================================

export const useAuthStorage = (): AuthStorageContextValue => {
    const context = useContext(AuthStorageContext);

    if (!context) {
        throw new Error('useAuthStorage deve ser usado dentro de AuthStorageProvider');
    }

    return context;
};

// Aliases for backward compatibility
export const useAuth = useAuthStorage;
export const useStorage = useAuthStorage;
