/**
 * 🎯 CONTEXTOS GLOBAIS SINCRONIZADOS - Sistema de Estado Distribuído
 * 
 * Sistema de contextos React sincronizados entre tabs e workers
 * Substitui useState/useEffect por estado persistente e reativo
 */

import React, {
    createContext,
    useReducer,
    useEffect,
    useCallback,
    useMemo,
    ReactNode
} from 'react';
import { advancedStorage, StorageChangeEvent } from './AdvancedStorageSystem';

// ========================================
// TYPES E INTERFACES
// ========================================

export interface SyncedState<T = any> {
    data: T;
    loading: boolean;
    error: string | null;
    lastSync: number;
    version: number;
}

export interface SyncConfig {
    namespace: string;
    key: string;
    ttl?: number;
    syncInterval?: number;
    optimistic?: boolean;
    compression?: boolean;
}

export interface SyncedContextConfig<T = any> {
    namespace: string;
    initialData: T;
    syncInterval?: number;
    compression?: boolean;
    validator?: (data: any) => data is T;
    transformer?: {
        serialize?: (data: T) => any;
        deserialize?: (data: any) => T;
    };
}

type SyncAction<T> =
    | { type: 'SET_DATA'; payload: T }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_LAST_SYNC'; payload: number }
    | { type: 'INCREMENT_VERSION' }
    | { type: 'RESET' };

// ========================================
// REDUCER E STATE MANAGEMENT  
// ========================================

function syncedReducer<T>(state: SyncedState<T>, action: SyncAction<T>): SyncedState<T> {
    switch (action.type) {
        case 'SET_DATA':
            return {
                ...state,
                data: action.payload,
                loading: false,
                error: null,
                lastSync: Date.now()
            };

        case 'SET_LOADING':
            return { ...state, loading: action.payload };

        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };

        case 'SET_LAST_SYNC':
            return { ...state, lastSync: action.payload };

        case 'INCREMENT_VERSION':
            return { ...state, version: state.version + 1 };

        case 'RESET':
            return {
                data: state.data, // Manter dados, resetar apenas flags
                loading: false,
                error: null,
                lastSync: 0,
                version: 0
            };

        default:
            return state;
    }
}

// ========================================
// CONTEXTO SINCRONIZADO GENÉRICO
// ========================================

interface SyncedContextValue<T> {
    state: SyncedState<T>;
    updateData: (data: Partial<T> | T, optimistic?: boolean) => Promise<void>;
    refreshData: () => Promise<void>;
    resetState: () => void;
    isStale: boolean;
}

function createSyncedContext<T>(config: SyncedContextConfig<T>) {
    const Context = createContext<SyncedContextValue<T> | null>(null);

    const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
        const initialState: SyncedState<T> = {
            data: config.initialData,
            loading: false,
            error: null,
            lastSync: 0,
            version: 0
        };

        const [state, dispatch] = useReducer(syncedReducer<T>, initialState);

        // Carregar dados iniciais do storage
        useEffect(() => {
            loadFromStorage();
        }, []);

        // Sincronização periódica
        useEffect(() => {
            if (config.syncInterval && config.syncInterval > 0) {
                const interval = setInterval(loadFromStorage, config.syncInterval);
                return () => clearInterval(interval);
            }
        }, [config.syncInterval]);

        // Escutar mudanças de outras tabs
        useEffect(() => {
            const unsubscribe = advancedStorage.onStorageChange((event: StorageChangeEvent) => {
                if (event.namespace === config.namespace && event.type === 'set') {
                    loadFromStorage();
                }
            });
            return unsubscribe;
        }, []);

        const loadFromStorage = useCallback(async () => {
            try {
                dispatch({ type: 'SET_LOADING', payload: true });

                const stored = await advancedStorage.getItem<T>(
                    'context-data',
                    config.namespace
                );

                if (stored) {
                    // Validar dados se validator fornecido
                    if (config.validator && !config.validator(stored)) {
                        console.warn(`Dados inválidos no contexto ${config.namespace}`, stored);
                        return;
                    }

                    // Transformar dados se transformer fornecido
                    const finalData = config.transformer?.deserialize
                        ? config.transformer.deserialize(stored)
                        : stored;

                    dispatch({ type: 'SET_DATA', payload: finalData });
                }
            } catch (error) {
                console.error(`Erro ao carregar contexto ${config.namespace}:`, error);
                dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Erro desconhecido' });
            }
        }, []);

        const updateData = useCallback(async (
            newData: Partial<T> | T,
            optimistic: boolean = true
        ) => {
            try {
                const mergedData = typeof newData === 'object' && newData !== null
                    ? { ...state.data, ...newData }
                    : newData;

                // Update otimista (UI first)
                if (optimistic) {
                    dispatch({ type: 'SET_DATA', payload: mergedData });
                    dispatch({ type: 'INCREMENT_VERSION' });
                }

                // Transformar para armazenamento
                const dataToStore = config.transformer?.serialize
                    ? config.transformer.serialize(mergedData)
                    : mergedData;

                // Salvar no storage
                await advancedStorage.setItem('context-data', dataToStore, {
                    namespace: config.namespace,
                    compress: config.compression,
                    tags: ['context', 'synced']
                });

                // Update pessimista (storage first) 
                if (!optimistic) {
                    dispatch({ type: 'SET_DATA', payload: mergedData });
                    dispatch({ type: 'INCREMENT_VERSION' });
                }

            } catch (error) {
                console.error(`Erro ao salvar contexto ${config.namespace}:`, error);
                dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Erro ao salvar' });

                // Reverter update otimista em caso de erro
                if (optimistic) {
                    await loadFromStorage();
                }
            }
        }, [state.data]);

        const refreshData = useCallback(async () => {
            await loadFromStorage();
        }, [loadFromStorage]);

        const resetState = useCallback(() => {
            dispatch({ type: 'RESET' });
        }, []);

        // Verificar se dados estão desatualizados
        const isStale = useMemo(() => {
            if (!config.syncInterval) return false;
            return Date.now() - state.lastSync > config.syncInterval * 1.5;
        }, [state.lastSync, config.syncInterval]);

        const contextValue: SyncedContextValue<T> = {
            state,
            updateData,
            refreshData,
            resetState,
            isStale
        };

        return (
            <Context.Provider value={contextValue}>
                {children}
            </Context.Provider>
        );
    };

    const useContext = () => {
        const context = React.useContext(Context);
        if (!context) {
            throw new Error(`useSynced${config.namespace} deve ser usado dentro do ${config.namespace}Provider`);
        }
        return context;
    };

    return { Provider, useContext };
}

// ========================================
// CONTEXTOS ESPECÍFICOS DO EDITOR
// ========================================

/**
 * 📝 CONTEXTO DO EDITOR - Estado do editor sincronizado
 */
interface EditorState {
    currentFunnelId: string | null;
    currentPageId: string | null;
    selectedBlockId: string | null;
    editorMode: 'edit' | 'preview' | 'publish';
    blocks: any[];
    pages: any[];
    settings: {
        theme: string;
        primaryColor: string;
        fontFamily: string;
        [key: string]: any;
    };
    history: {
        undoStack: any[];
        redoStack: any[];
        canUndo: boolean;
        canRedo: boolean;
    };
}

const editorContextConfig: SyncedContextConfig<EditorState> = {
    namespace: 'editor',
    initialData: {
        currentFunnelId: null,
        currentPageId: null,
        selectedBlockId: null,
        editorMode: 'edit',
        blocks: [],
        pages: [],
        settings: {
            theme: 'elegant-brown',
            primaryColor: '#B89B7A',
            fontFamily: 'Inter'
        },
        history: {
            undoStack: [],
            redoStack: [],
            canUndo: false,
            canRedo: false
        }
    },
    syncInterval: 2000, // Sincronizar a cada 2s
    compression: true,
    validator: (data): data is EditorState => {
        return typeof data === 'object' &&
            data !== null &&
            'editorMode' in data &&
            'blocks' in data;
    }
};

export const { Provider: EditorSyncProvider, useContext: useEditorSync } =
    createSyncedContext(editorContextConfig);

/**
 * 👤 CONTEXTO DO USUÁRIO - Dados do usuário sincronizados
 */
interface UserState {
    name: string | null;
    email: string | null;
    preferences: {
        theme: 'light' | 'dark';
        language: string;
        notifications: boolean;
        [key: string]: any;
    };
    session: {
        isAuthenticated: boolean;
        lastActivity: number;
        [key: string]: any;
    };
}

const userContextConfig: SyncedContextConfig<UserState> = {
    namespace: 'user',
    initialData: {
        name: null,
        email: null,
        preferences: {
            theme: 'light',
            language: 'pt-BR',
            notifications: true
        },
        session: {
            isAuthenticated: false,
            lastActivity: Date.now()
        }
    },
    syncInterval: 5000, // Sincronizar a cada 5s
    compression: false // Dados pequenos, não comprimir
};

export const { Provider: UserSyncProvider, useContext: useUserSync } =
    createSyncedContext(userContextConfig);

/**
 * 🎯 CONTEXTO DE FUNIL - Estado do funil ativo
 */
interface FunnelState {
    id: string | null;
    name: string;
    description: string;
    pages: Array<{
        id: string;
        name: string;
        blocks: any[];
        settings: any;
    }>;
    globalSettings: {
        theme: string;
        colors: { primary: string; secondary: string };
        fonts: { primary: string; secondary: string };
        seo: any;
        domain: any;
        pixels: any;
    };
    publishedAt: string | null;
    isDraft: boolean;
}

const funnelContextConfig: SyncedContextConfig<FunnelState> = {
    namespace: 'funnel',
    initialData: {
        id: null,
        name: '',
        description: '',
        pages: [],
        globalSettings: {
            theme: 'elegant-brown',
            colors: { primary: '#B89B7A', secondary: '#432818' },
            fonts: { primary: 'Inter', secondary: 'Playfair Display' },
            seo: {},
            domain: {},
            pixels: {}
        },
        publishedAt: null,
        isDraft: true
    },
    syncInterval: 3000, // Sincronizar a cada 3s
    compression: true,
    transformer: {
        serialize: (data) => ({
            ...data,
            lastModified: new Date().toISOString()
        }),
        deserialize: (data) => {
            const { lastModified, ...rest } = data;
            return rest;
        }
    }
};

export const { Provider: FunnelSyncProvider, useContext: useFunnelSync } =
    createSyncedContext(funnelContextConfig);

// ========================================
// PROVIDER COMPOSTO E HOOKS UTILITÁRIOS
// ========================================

/**
 * 🏗️ PROVIDER RAIZ - Combina todos os contextos sincronizados
 */
export const SyncedContextsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <UserSyncProvider>
            <EditorSyncProvider>
                <FunnelSyncProvider>
                    {children}
                </FunnelSyncProvider>
            </EditorSyncProvider>
        </UserSyncProvider>
    );
};

/**
 * 🎣 HOOKS UTILITÁRIOS
 */

// Hook para acessar múltiplos contextos
export const useAllSyncedContexts = () => {
    const editor = useEditorSync();
    const user = useUserSync();
    const funnel = useFunnelSync();

    return { editor, user, funnel };
};

// Hook para verificar se algum contexto está carregando
export const useSyncedLoading = () => {
    const { editor, user, funnel } = useAllSyncedContexts();

    return editor.state.loading || user.state.loading || funnel.state.loading;
};

// Hook para verificar se algum contexto tem erro
export const useSyncedErrors = () => {
    const { editor, user, funnel } = useAllSyncedContexts();

    const errors = [
        editor.state.error,
        user.state.error,
        funnel.state.error
    ].filter(Boolean);

    return errors.length > 0 ? errors : null;
};

// Hook para refrescar todos os contextos
export const useRefreshAll = () => {
    const { editor, user, funnel } = useAllSyncedContexts();

    return useCallback(async () => {
        await Promise.all([
            editor.refreshData(),
            user.refreshData(),
            funnel.refreshData()
        ]);
    }, [editor, user, funnel]);
};

// Hook para verificar se dados estão desatualizados
export const useStaleData = () => {
    const { editor, user, funnel } = useAllSyncedContexts();

    return editor.isStale || user.isStale || funnel.isStale;
};

// ========================================
// MIGRAÇÃO E COMPATIBILIDADE
// ========================================

/**
 * 🔄 HOOK PARA MIGRAÇÃO DE LOCALSTORAGE
 */
export const useMigrateFromLocalStorage = () => {
    return useCallback(async () => {
        try {
            console.log('🔄 Iniciando migração do localStorage...');

            const migrated = await advancedStorage.migrateFromLocalStorage([
                'editor_',
                'funnel_',
                'user_',
                'quiz_'
            ], false); // Não deletar ainda, manter backup

            console.log(`✅ Migração concluída: ${migrated} itens migrados`);

            return migrated;
        } catch (error) {
            console.error('❌ Erro na migração:', error);
            return 0;
        }
    }, []);
};

/**
 * 🧹 HOOK PARA LIMPEZA SEGURA
 */
export const useSafeStorageCleanup = () => {
    return useCallback(async (options: {
        namespace?: string;
        maxAge?: number;
        preserveEssential?: boolean;
    } = {}) => {
        try {
            console.log('🧹 Iniciando limpeza segura do storage...');

            const cleaned = await advancedStorage.cleanup({
                maxAge: options.maxAge || 7 * 24 * 60 * 60 * 1000, // 7 dias
                namespace: options.namespace,
                preserveEssential: options.preserveEssential !== false
            });

            console.log(`✅ Limpeza concluída: ${cleaned} itens removidos`);

            return cleaned;
        } catch (error) {
            console.error('❌ Erro na limpeza:', error);
            return 0;
        }
    }, []);
};

export default {
    SyncedContextsProvider,
    useAllSyncedContexts,
    useMigrateFromLocalStorage,
    useSafeStorageCleanup,
    useEditorSync,
    useUserSync,
    useFunnelSync
};
