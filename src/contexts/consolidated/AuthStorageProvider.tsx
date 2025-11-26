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
            appLogger.info('🔐 [AuthStorage] Fazendo login...');

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

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

            appLogger.info('✅ [AuthStorage] Login bem-sucedido');
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
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
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
                    setAuthState(prev => ({ ...prev, isLoading: false }));
                }
            } catch (err) {
                appLogger.error('❌ [AuthStorage] Erro ao verificar sessão:', err);
                setAuthState(prev => ({ ...prev, isLoading: false }));
            }
        };

        checkSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
            if (session?.user) {
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
