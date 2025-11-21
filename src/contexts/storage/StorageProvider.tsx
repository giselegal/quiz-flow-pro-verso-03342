/**
 * 💾 StorageProvider - Gerenciamento de Persistência Local
 * 
 * Responsabilidades:
 * - localStorage e sessionStorage abstraction
 * - Serialização/deserialização automática
 * - Namespace por domínio
 * - Limpeza e expiração
 * 
 * Fase 2.1 - Provider Modular Independente
 */

import React, { createContext, useContext, useCallback, useMemo, ReactNode } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES & INTERFACES
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
    ttl?: number; // Time to live in milliseconds
}

export interface StorageContextValue {
    // Basic operations
    set: <T = any>(key: string, value: T, options?: StorageOptions) => boolean;
    get: <T = any>(key: string, options?: StorageOptions) => T | null;
    remove: (key: string, options?: StorageOptions) => boolean;
    clear: (options?: StorageOptions) => boolean;

    // Advanced operations
    has: (key: string, options?: StorageOptions) => boolean;
    keys: (options?: StorageOptions) => string[];
    size: (options?: StorageOptions) => number;

    // Batch operations
    setMultiple: <T = any>(items: Record<string, T>, options?: StorageOptions) => boolean;
    getMultiple: <T = any>(keys: string[], options?: StorageOptions) => Record<string, T | null>;
    removeMultiple: (keys: string[], options?: StorageOptions) => boolean;

    // Utilities
    isExpired: (key: string, options?: StorageOptions) => boolean;
    cleanup: (options?: StorageOptions) => number; // Returns number of items removed
}

interface StorageProviderProps {
    children: ReactNode;
    defaultNamespace?: string;
    defaultType?: StorageType;
}

// ============================================================================
// CONTEXT
// ============================================================================

const StorageContext = createContext<StorageContextValue | undefined>(undefined);

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
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
}

function safeJSONStringify<T>(value: T): string | null {
    try {
        return JSON.stringify(value);
    } catch {
        return null;
    }
}

// ============================================================================
// PROVIDER
// ============================================================================

export function StorageProvider({
    children,
    defaultNamespace = 'app',
    defaultType = 'local',
}: StorageProviderProps) {

    // Basic operations
    const set = useCallback(<T = any>(
        key: string,
        value: T,
        options: StorageOptions = {}
    ): boolean => {
        const {
            type = defaultType,
            namespace = defaultNamespace,
            ttl,
        } = options;

        try {
            const storage = getStorage(type);
            const fullKey = buildKey(key, namespace);

            const item: StorageItem<T> = {
                value,
                timestamp: Date.now(),
                expiresAt: ttl ? Date.now() + ttl : undefined,
            };

            const serialized = safeJSONStringify(item);
            if (!serialized) {
                appLogger.error('Failed to serialize value', { component: 'StorageProvider', key });
                return false;
            }

            storage.setItem(fullKey, serialized);

            appLogger.debug('Item stored', {
                component: 'StorageProvider',
                key: fullKey,
                type,
                hasTTL: !!ttl
            });

            return true;
        } catch (error) {
            appLogger.error('Storage set failed', { component: 'StorageProvider', error, key });
            return false;
        }
    }, [defaultType, defaultNamespace]);

    const get = useCallback(<T = any>(
        key: string,
        options: StorageOptions = {}
    ): T | null => {
        const {
            type = defaultType,
            namespace = defaultNamespace,
        } = options;

        try {
            const storage = getStorage(type);
            const fullKey = buildKey(key, namespace);
            const serialized = storage.getItem(fullKey);

            if (!serialized) return null;

            const item = safeJSONParse<StorageItem<T>>(serialized);
            if (!item) return null;

            // Check expiration
            if (item.expiresAt && Date.now() > item.expiresAt) {
                storage.removeItem(fullKey);
                appLogger.debug('Expired item removed', { component: 'StorageProvider', key: fullKey });
                return null;
            }

            return item.value;
        } catch (error) {
            appLogger.error('Storage get failed', { component: 'StorageProvider', error, key });
            return null;
        }
    }, [defaultType, defaultNamespace]);

    const remove = useCallback((
        key: string,
        options: StorageOptions = {}
    ): boolean => {
        const {
            type = defaultType,
            namespace = defaultNamespace,
        } = options;

        try {
            const storage = getStorage(type);
            const fullKey = buildKey(key, namespace);
            storage.removeItem(fullKey);

            appLogger.debug('Item removed', { component: 'StorageProvider', key: fullKey });
            return true;
        } catch (error) {
            appLogger.error('Storage remove failed', { component: 'StorageProvider', error, key });
            return false;
        }
    }, [defaultType, defaultNamespace]);

    const clear = useCallback((options: StorageOptions = {}): boolean => {
        const {
            type = defaultType,
            namespace = defaultNamespace,
        } = options;

        try {
            const storage = getStorage(type);

            if (!namespace) {
                storage.clear();
                appLogger.info('Storage cleared', { component: 'StorageProvider', type });
                return true;
            }

            // Clear only namespaced items
            const prefix = `${namespace}:`;
            const keysToRemove: string[] = [];

            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                if (key && key.startsWith(prefix)) {
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach(key => storage.removeItem(key));

            appLogger.info('Namespaced storage cleared', {
                component: 'StorageProvider',
                type,
                namespace,
                removed: keysToRemove.length
            });

            return true;
        } catch (error) {
            appLogger.error('Storage clear failed', { component: 'StorageProvider', error });
            return false;
        }
    }, [defaultType, defaultNamespace]);

    // Advanced operations
    const has = useCallback((
        key: string,
        options: StorageOptions = {}
    ): boolean => {
        return get(key, options) !== null;
    }, [get]);

    const keys = useCallback((options: StorageOptions = {}): string[] => {
        const {
            type = defaultType,
            namespace = defaultNamespace,
        } = options;

        try {
            const storage = getStorage(type);
            const prefix = namespace ? `${namespace}:` : '';
            const result: string[] = [];

            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                if (key && (!prefix || key.startsWith(prefix))) {
                    result.push(prefix ? key.substring(prefix.length) : key);
                }
            }

            return result;
        } catch (error) {
            appLogger.error('Storage keys failed', 'StorageProvider', { error });
            return [];
        }
    }, [defaultType, defaultNamespace]);

    const size = useCallback((options: StorageOptions = {}): number => {
        return keys(options).length;
    }, [keys]);

    // Batch operations
    const setMultiple = useCallback(<T = any>(
        items: Record<string, T>,
        options: StorageOptions = {}
    ): boolean => {
        let success = true;
        Object.entries(items).forEach(([key, value]) => {
            if (!set(key, value, options)) {
                success = false;
            }
        });
        return success;
    }, [set]);

    const getMultiple = useCallback(<T = any>(
        keysArray: string[],
        options: StorageOptions = {}
    ): Record<string, T | null> => {
        const result: Record<string, T | null> = {};
        keysArray.forEach(key => {
            result[key] = get<T>(key, options);
        });
        return result;
    }, [get]);

    const removeMultiple = useCallback((
        keysArray: string[],
        options: StorageOptions = {}
    ): boolean => {
        let success = true;
        keysArray.forEach(key => {
            if (!remove(key, options)) {
                success = false;
            }
        });
        return success;
    }, [remove]);

    // Utilities
    const isExpired = useCallback((
        key: string,
        options: StorageOptions = {}
    ): boolean => {
        const {
            type = defaultType,
            namespace = defaultNamespace,
        } = options;

        try {
            const storage = getStorage(type);
            const fullKey = buildKey(key, namespace);
            const serialized = storage.getItem(fullKey);

            if (!serialized) return true;

            const item = safeJSONParse<StorageItem>(serialized);
            if (!item || !item.expiresAt) return false;

            return Date.now() > item.expiresAt;
        } catch {
            return true;
        }
    }, [defaultType, defaultNamespace]);

    const cleanup = useCallback((options: StorageOptions = {}): number => {
        const {
            type = defaultType,
            namespace = defaultNamespace,
        } = options;

        try {
            const storage = getStorage(type);
            const prefix = namespace ? `${namespace}:` : '';
            const keysToRemove: string[] = [];
            const now = Date.now();

            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                if (!key || (prefix && !key.startsWith(prefix))) continue;

                const serialized = storage.getItem(key);
                if (!serialized) continue;

                const item = safeJSONParse<StorageItem>(serialized);
                if (item?.expiresAt && now > item.expiresAt) {
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach(key => storage.removeItem(key));

            appLogger.info('Storage cleanup completed', {
                component: 'StorageProvider',
                type,
                namespace,
                removed: keysToRemove.length,
            });

            return keysToRemove.length;
        } catch (error) {
            appLogger.error('Storage cleanup failed', { component: 'StorageProvider', error });
            return 0;
        }
    }, [defaultType, defaultNamespace]);

    // Context value with memoization
    const contextValue = useMemo<StorageContextValue>(() => ({
        set,
        get,
        remove,
        clear,
        has,
        keys,
        size,
        setMultiple,
        getMultiple,
        removeMultiple,
        isExpired,
        cleanup,
    }), [
        set,
        get,
        remove,
        clear,
        has,
        keys,
        size,
        setMultiple,
        getMultiple,
        removeMultiple,
        isExpired,
        cleanup,
    ]);

    return (
        <StorageContext.Provider value={contextValue}>
            {children}
        </StorageContext.Provider>
    );
}

// ============================================================================
// HOOK
// ============================================================================

export function useStorage(): StorageContextValue {
    const context = useContext(StorageContext);

    if (!context) {
        throw new Error('useStorage must be used within StorageProvider');
    }

    return context;
}

// Display name for debugging
StorageProvider.displayName = 'StorageProvider';
