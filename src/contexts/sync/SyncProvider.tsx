/**
 * 🔄 SyncProvider - Sincronização com Backend
 * 
 * Responsabilidades:
 * - Sincronização com Supabase
 * - Modo offline/online
 * - Queue de operações pendentes
 * - Conflito de dados
 * 
 * Fase 2.1 - Provider Modular Independente
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline';

export interface PendingOperation {
    id: string;
    type: 'create' | 'update' | 'delete';
    entity: string;
    data: any;
    timestamp: number;
    retryCount: number;
}

export interface SyncState {
    status: SyncStatus;
    isOnline: boolean;
    lastSyncAt: number | null;
    pendingOperations: PendingOperation[];
    error: Error | null;
}

export interface SyncContextValue {
    // State
    state: SyncState;

    // Sync control
    sync: () => Promise<void>;
    syncEntity: (entity: string, id: string) => Promise<void>;
    forceSync: () => Promise<void>;

    // Offline queue
    queueOperation: (operation: Omit<PendingOperation, 'id' | 'timestamp' | 'retryCount'>) => void;
    clearQueue: () => void;
    getQueueSize: () => number;

    // Status
    setOnlineStatus: (isOnline: boolean) => void;
    isEntitySynced: (entity: string, id: string) => boolean;
}

interface SyncProviderProps {
    children: ReactNode;
    autoSync?: boolean;
    syncInterval?: number; // em ms
    onSyncComplete?: () => void;
    onSyncError?: (error: Error) => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const SyncContext = createContext<SyncContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

export function SyncProvider({
    children,
    autoSync = true,
    syncInterval = 30000, // 30 segundos
    onSyncComplete,
    onSyncError,
}: SyncProviderProps) {
    // State
    const [status, setStatus] = useState<SyncStatus>('idle');
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [lastSyncAt, setLastSyncAt] = useState<number | null>(null);
    const [pendingOperations, setPendingOperations] = useState<PendingOperation[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [syncedEntities, setSyncedEntities] = useState<Set<string>>(new Set());

    // Monitor online/offline status
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setStatus('idle');
            appLogger.info('Connection restored', 'SyncProvider');

            // Trigger sync when coming back online
            if (pendingOperations.length > 0) {
                sync();
            }
        };

        const handleOffline = () => {
            setIsOnline(false);
            setStatus('offline');
            appLogger.warn('Connection lost', 'SyncProvider');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [pendingOperations.length]);

    // Auto-sync interval
    useEffect(() => {
        if (!autoSync || !isOnline) return;

        const intervalId = setInterval(() => {
            if (pendingOperations.length > 0) {
                sync();
            }
        }, syncInterval);

        return () => clearInterval(intervalId);
    }, [autoSync, isOnline, syncInterval, pendingOperations.length]);

    // Sync operations
    const sync = useCallback(async (): Promise<void> => {
        if (!isOnline) {
            appLogger.warn('Cannot sync: offline', 'SyncProvider');
            return;
        }

        if (status === 'syncing') {
            appLogger.warn('Sync already in progress', 'SyncProvider');
            return;
        }

        if (pendingOperations.length === 0) {
            appLogger.debug('No pending operations to sync', 'SyncProvider');
            return;
        }

        setStatus('syncing');
        setError(null);

        try {
            appLogger.info('Starting sync', 'SyncProvider', {
                operations: pendingOperations.length
            });

            // Process each operation
            const results = await Promise.allSettled(
                pendingOperations.map(async (op) => {
                    // Simulated sync - replace with actual Supabase calls
                    await new Promise(resolve => setTimeout(resolve, 100));

                    appLogger.debug('Operation synced', 'SyncProvider', {
                        type: op.type,
                        entity: op.entity,
                    });

                    return op.id;
                })
            );

            // Remove successfully synced operations
            const succeededIds = results
                .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
                .map(r => r.value);

            setPendingOperations(prev =>
                prev.filter(op => !succeededIds.includes(op.id))
            );

            // Handle failures
            const failures = results.filter(r => r.status === 'rejected');
            if (failures.length > 0) {
                appLogger.warn('Some operations failed to sync', 'SyncProvider', {
                    failed: failures.length,
                });
            }

            setLastSyncAt(Date.now());
            setStatus('idle');

            if (onSyncComplete) {
                onSyncComplete();
            }

            appLogger.info('Sync completed', 'SyncProvider', {
                synced: succeededIds.length,
                failed: failures.length,
            });

        } catch (err) {
            const syncError = err instanceof Error ? err : new Error('Sync failed');
            setError(syncError);
            setStatus('error');

            if (onSyncError) {
                onSyncError(syncError);
            }

            appLogger.error('Sync failed', 'SyncProvider', { error: syncError });
        }
    }, [isOnline, status, pendingOperations, onSyncComplete, onSyncError]);

    const syncEntity = useCallback(async (entity: string, id: string): Promise<void> => {
        if (!isOnline) return;

        try {
            // Simulated entity sync
            await new Promise(resolve => setTimeout(resolve, 100));

            setSyncedEntities(prev => new Set(prev).add(`${entity}:${id}`));

            appLogger.info('Entity synced', 'SyncProvider', { entity, id });
        } catch (err) {
            appLogger.error('Entity sync failed', 'SyncProvider', { error: err, entity, id });
            throw err;
        }
    }, [isOnline]);

    const forceSync = useCallback(async (): Promise<void> => {
        setStatus('idle'); // Reset status to allow sync
        await sync();
    }, [sync]);

    // Queue operations
    const queueOperation = useCallback((
        operation: Omit<PendingOperation, 'id' | 'timestamp' | 'retryCount'>
    ) => {
        const newOperation: PendingOperation = {
            ...operation,
            id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            retryCount: 0,
        };

        setPendingOperations(prev => [...prev, newOperation]);

        appLogger.info('Operation queued', 'SyncProvider', {
            type: operation.type,
            entity: operation.entity,
        });

        // Trigger sync if online
        if (isOnline && autoSync) {
            setTimeout(() => sync(), 1000);
        }
    }, [isOnline, autoSync, sync]);

    const clearQueue = useCallback(() => {
        setPendingOperations([]);
        appLogger.info('Sync queue cleared', 'SyncProvider');
    }, []);

    const getQueueSize = useCallback((): number => {
        return pendingOperations.length;
    }, [pendingOperations]);

    // Status methods
    const setOnlineStatus = useCallback((online: boolean) => {
        setIsOnline(online);
        setStatus(online ? 'idle' : 'offline');
    }, []);

    const isEntitySynced = useCallback((entity: string, id: string): boolean => {
        return syncedEntities.has(`${entity}:${id}`);
    }, [syncedEntities]);

    // Build state object
    const state: SyncState = useMemo(() => ({
        status,
        isOnline,
        lastSyncAt,
        pendingOperations,
        error,
    }), [status, isOnline, lastSyncAt, pendingOperations, error]);

    // Context value with memoization
    const contextValue = useMemo<SyncContextValue>(() => ({
        state,
        sync,
        syncEntity,
        forceSync,
        queueOperation,
        clearQueue,
        getQueueSize,
        setOnlineStatus,
        isEntitySynced,
    }), [
        state,
        sync,
        syncEntity,
        forceSync,
        queueOperation,
        clearQueue,
        getQueueSize,
        setOnlineStatus,
        isEntitySynced,
    ]);

    return (
        <SyncContext.Provider value={contextValue}>
            {children}
        </SyncContext.Provider>
    );
}

// ============================================================================
// HOOK
// ============================================================================

export function useSync(): SyncContextValue {
    const context = useContext(SyncContext);

    if (!context) {
        throw new Error('useSync must be used within SyncProvider');
    }

    return context;
}

// Display name for debugging
SyncProvider.displayName = 'SyncProvider';
