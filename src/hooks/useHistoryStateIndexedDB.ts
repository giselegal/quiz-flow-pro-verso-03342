/**
 * 🚀 USE HISTORY STATE WITH INDEXEDDB
 * 
 * Versão melhorada do useHistoryState que usa IndexedDB ao invés de localStorage
 * Resolve problemas de:
 * - QuotaExceededError (localStorage ~5MB vs IndexedDB ~GBs)
 * - Performance com dados grandes (>500KB)
 * - Persistência mais robusta
 */

import { useCallback, useEffect, useState } from 'react';
import { AdvancedStorageManager } from '@/utils/storage/AdvancedStorageSystem';

export interface HistoryState<T> {
    past: T[];
    present: T;
    future: T[];
}

export interface UseHistoryStateOptions {
    historyLimit?: number;
    storageKey?: string;
    enablePersistence?: boolean;
    // Persist only the current present state (reduces payload drastically)
    persistPresentOnly?: boolean;
    // Debounce persistence to avoid excessive writes
    persistDebounceMs?: number;
    // Optional custom serializer to trim the present state
    serialize?: (present: any) => any;
    // IndexedDB specific options
    namespace?: string;
    compression?: boolean;
}

export const useHistoryStateIndexedDB = <T>(initialState: T, options: UseHistoryStateOptions = {}) => {
    const {
        historyLimit = 50,
        storageKey,
        enablePersistence = false,
        persistPresentOnly = false,
        persistDebounceMs = 300, // Increased default for IndexedDB
        serialize,
        namespace = 'editorHistory',
        compression = true,
    } = options;

    // Initialize IndexedDB storage manager
    const [storageManager, setStorageManager] = useState<AdvancedStorageManager | null>(null);

    useEffect(() => {
        if (enablePersistence) {
            try {
                const manager = AdvancedStorageManager.getInstance();
                setStorageManager(manager);
            } catch (error) {
                console.error('Failed to initialize IndexedDB storage:', error);
                // Fallback to localStorage behavior
            }
        }
    }, [enablePersistence]);

    // Initialize state from IndexedDB if persistence is enabled
    const getInitialState = useCallback(async (): Promise<HistoryState<T>> => {
        if (enablePersistence && storageKey && storageManager) {
            try {
                const saved = await storageManager.get(storageKey, { namespace });
                if (saved) {
                    return {
                        past: saved.past || [],
                        present: saved.present || initialState,
                        future: saved.future || [],
                    };
                }
            } catch (error) {
                console.warn('Failed to load history state from IndexedDB:', error);
            }
        }
        return {
            past: [],
            present: initialState,
            future: [],
        };
    }, [initialState, storageKey, enablePersistence, storageManager, namespace]);

    const [history, setHistory] = useState<HistoryState<T>>({
        past: [],
        present: initialState,
        future: [],
    });

    // Load initial state when storage manager is available
    useEffect(() => {
        if (storageManager) {
            getInitialState().then(initialState => {
                setHistory(initialState);
            });
        }
    }, [storageManager, getInitialState]);

    // Persist state to IndexedDB when it changes
    useEffect(() => {
        if (!enablePersistence || !storageKey || !storageManager) return;

        const toPersist = persistPresentOnly
            ? { present: serialize ? serialize(history.present) : history.present }
            : serialize
                ? serialize(history as any)
                : history;

        let timer: number | null = null;
        const save = async () => {
            try {
                await storageManager.set(storageKey, toPersist, {
                    namespace,
                    compression,
                    metadata: {
                        timestamp: Date.now(),
                        type: 'editorHistory',
                    }
                });
                console.log('✅ History state saved to IndexedDB');
            } catch (error: any) {
                console.error('❌ Failed to save history state to IndexedDB:', error);

                // Fallback to localStorage with size check
                try {
                    const serialized = JSON.stringify(toPersist);
                    if (serialized.length < 100_000) { // Reduced threshold for localStorage fallback
                        localStorage.setItem(storageKey + '_fallback', serialized);
                        console.warn('⚠️ Used localStorage fallback for history state');
                    } else {
                        console.warn('⚠️ History state too large for localStorage fallback, skipping persistence');
                    }
                } catch (fallbackError) {
                    console.error('❌ localStorage fallback also failed:', fallbackError);
                }
            }
        };

        if (persistDebounceMs && persistDebounceMs > 0) {
            timer = window.setTimeout(save, persistDebounceMs);
        } else {
            save();
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [history, enablePersistence, storageKey, storageManager, persistPresentOnly, persistDebounceMs, serialize, namespace, compression]);

    const push = useCallback((newState: T) => {
        setHistory(prevHistory => {
            const newPast = [...prevHistory.past, prevHistory.present].slice(-historyLimit);
            return {
                past: newPast,
                present: newState,
                future: [],
            };
        });
    }, [historyLimit]);

    const undo = useCallback(() => {
        setHistory(prevHistory => {
            if (prevHistory.past.length === 0) return prevHistory;

            const newPast = prevHistory.past.slice(0, -1);
            const newPresent = prevHistory.past[prevHistory.past.length - 1];
            const newFuture = [prevHistory.present, ...prevHistory.future];

            return {
                past: newPast,
                present: newPresent,
                future: newFuture,
            };
        });
    }, []);

    const redo = useCallback(() => {
        setHistory(prevHistory => {
            if (prevHistory.future.length === 0) return prevHistory;

            const newPast = [...prevHistory.past, prevHistory.present];
            const newPresent = prevHistory.future[0];
            const newFuture = prevHistory.future.slice(1);

            return {
                past: newPast,
                present: newPresent,
                future: newFuture,
            };
        });
    }, []);

    const reset = useCallback((resetState?: T) => {
        const stateToUse = resetState !== undefined ? resetState : initialState;
        setHistory({
            past: [],
            present: stateToUse,
            future: [],
        });
    }, [initialState]);

    const canUndo = history.past.length > 0;
    const canRedo = history.future.length > 0;

    return {
        state: history.present,
        setState: push,
        undo,
        redo,
        reset,
        canUndo,
        canRedo,
        history: history,
        // Additional utilities
        storageReady: !!storageManager,
        clearHistory: useCallback(() => {
            if (storageManager && storageKey) {
                storageManager.delete(storageKey, { namespace }).catch(console.error);
            }
            reset();
        }, [storageManager, storageKey, namespace, reset]),
    };
};