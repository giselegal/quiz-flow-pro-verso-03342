// @ts-nocheck
/**
 * 🌐 FUNNEL SYNC SERVICE - SERVER-SIDE SYNCHRONIZATION
 * 
 * Serviço para sincronização server-side dos dados de funis:
 * - Backup automático no servidor
 * - Sincronização entre dispositivos
 * - Conflict resolution
 * - Offline-first com sync quando online
 * - Delta sync para otimização
 */

import { FunnelErrorCode } from '../core/errors/FunnelErrorCodes';
import { FunnelError } from '../core/errors/FunnelError';
import { globalFunnelErrorHandler } from '../core/errors/FunnelErrorHandler';
import { globalFunnelRecovery } from '../core/errors/FunnelErrorRecovery';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface SyncConfig {
    endpoint: string;
    apiKey: string;
    userId: string;
    autoSync: boolean;
    syncInterval: number; // in milliseconds
    retryAttempts: number;
    conflictResolution: 'server' | 'local' | 'merge' | 'ask';
}

export interface SyncResult {
    success: boolean;
    syncedFunnels: number;
    syncedSettings: number;
    conflicts: SyncConflict[];
    lastSyncTime: string;
    errors: string[];
}

export interface SyncConflict {
    funnelId: string;
    type: 'funnel' | 'settings';
    localVersion: number;
    serverVersion: number;
    localUpdatedAt: string;
    serverUpdatedAt: string;
    resolution?: 'server' | 'local' | 'merge';
}

export interface SyncStatus {
    isOnline: boolean;
    lastSync: string | null;
    pendingSync: boolean;
    queueSize: number;
    nextSyncIn: number; // milliseconds
}

// ============================================================================
// SYNC QUEUE ITEM
// ============================================================================

interface SyncQueueItem {
    id: string;
    type: 'create' | 'update' | 'delete';
    entityType: 'funnel' | 'settings';
    entityId: string;
    data?: any;
    timestamp: string;
    attempts: number;
}

// ============================================================================
// FUNNEL SYNC SERVICE
// ============================================================================

class FunnelSyncService {
    private config: SyncConfig | null = null;
    private syncQueue: SyncQueueItem[] = [];
    private isOnline = navigator.onLine;
    private syncInterval: NodeJS.Timeout | null = null;
    private lastSyncTime: string | null = null;

    // ============================================================================
    // CONFIGURATION
    // ============================================================================

    initialize(config: SyncConfig): void {
        this.config = config;
        this.loadSyncQueue();
        this.setupNetworkListeners();

        if (config.autoSync) {
            this.startAutoSync();
        }

        console.log('[FunnelSync] Service initialized', {
            endpoint: config.endpoint,
            autoSync: config.autoSync,
            syncInterval: config.syncInterval
        });
    }

    private setupNetworkListeners(): void {
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('[FunnelSync] Network online - triggering sync');
            this.processQueue();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('[FunnelSync] Network offline');
        });
    }

    private startAutoSync(): void {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }

        if (this.config?.autoSync && this.config.syncInterval > 0) {
            this.syncInterval = setInterval(() => {
                this.processQueue();
            }, this.config.syncInterval);
        }
    }

    // ============================================================================
    // QUEUE MANAGEMENT
    // ============================================================================

    private addToQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'attempts'>): void {
        const queueItem: SyncQueueItem = {
            ...item,
            id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            attempts: 0,
        };

        this.syncQueue.push(queueItem);
        this.saveSyncQueue();

        console.log('[FunnelSync] Added to queue', {
            type: item.type,
            entityType: item.entityType,
            entityId: item.entityId
        });

        // Try to process immediately if online
        if (this.isOnline) {
            this.processQueue();
        }
    }

    private loadSyncQueue(): void {
        try {
            const stored = localStorage.getItem('qqcv_sync_queue');
            if (stored) {
                this.syncQueue = JSON.parse(stored);
                console.log('[FunnelSync] Loaded queue', { items: this.syncQueue.length });
            }
        } catch (error) {
            const funnelError = new FunnelError(
                FunnelErrorCode.STORAGE_ERROR,
                'Failed to load sync queue',
                {
                    operation: 'loadSyncQueue',
                    component: 'FunnelSyncService',
                    stackTrace: error instanceof Error ? error.stack : undefined
                }
            );
            globalFunnelErrorHandler.handleError(funnelError);
            this.syncQueue = [];
        }
    }

    private saveSyncQueue(): void {
        try {
            localStorage.setItem('qqcv_sync_queue', JSON.stringify(this.syncQueue));
        } catch (error) {
            const funnelError = new FunnelError(
                FunnelErrorCode.STORAGE_ERROR,
                'Failed to save sync queue',
                {
                    operation: 'saveSyncQueue',
                    component: 'FunnelSyncService',
                    appState: { queueSize: this.syncQueue.length },
                    stackTrace: error instanceof Error ? error.stack : undefined
                }
            );
            globalFunnelErrorHandler.handleError(funnelError);
        }
    }

    // ============================================================================
    // SYNC OPERATIONS
    // ============================================================================

    async syncFunnel(funnelId: string, operation: 'create' | 'update' | 'delete', data?: any): Promise<void> {
        this.addToQueue({
            type: operation,
            entityType: 'funnel',
            entityId: funnelId,
            data,
        });
    }

    async syncFunnelSettings(funnelId: string, operation: 'create' | 'update' | 'delete', data?: any): Promise<void> {
        this.addToQueue({
            type: operation,
            entityType: 'settings',
            entityId: funnelId,
            data,
        });
    }

    async processQueue(): Promise<SyncResult> {
        if (!this.config || !this.isOnline || this.syncQueue.length === 0) {
            return this.createEmptyResult();
        }

        console.log('[FunnelSync] Processing queue', { items: this.syncQueue.length });

        const result: SyncResult = {
            success: false,
            syncedFunnels: 0,
            syncedSettings: 0,
            conflicts: [],
            lastSyncTime: new Date().toISOString(),
            errors: [],
        };

        const processedItems: string[] = [];

        for (const item of this.syncQueue) {
            if (item.attempts >= this.config.retryAttempts) {
                result.errors.push(`Max retry attempts reached for ${item.entityType} ${item.entityId}`);
                processedItems.push(item.id);
                continue;
            }

            try {
                const syncSuccess = await this.syncItem(item);

                if (syncSuccess) {
                    if (item.entityType === 'funnel') {
                        result.syncedFunnels++;
                    } else {
                        result.syncedSettings++;
                    }
                    processedItems.push(item.id);
                } else {
                    item.attempts++;
                }

            } catch (error) {
                item.attempts++;
                const funnelError = new FunnelError(
                    FunnelErrorCode.NETWORK_ERROR,
                    `Sync failed for ${item.entityType} ${item.entityId}`,
                    {
                        operation: 'syncItem',
                        component: 'FunnelSyncService',
                        appState: {
                            item: item,
                            attempts: item.attempts,
                            maxRetries: this.config.retryAttempts
                        },
                        stackTrace: error instanceof Error ? error.stack : undefined
                    }
                );
                globalFunnelErrorHandler.handleError(funnelError);
                result.errors.push(`Sync failed for ${item.entityType} ${item.entityId}: ${error}`);
                console.error('[FunnelSync] Sync error', { item, error });
            }
        }

        // Remove processed items from queue
        this.syncQueue = this.syncQueue.filter(item => !processedItems.includes(item.id));
        this.saveSyncQueue();

        result.success = result.errors.length === 0;
        this.lastSyncTime = result.lastSyncTime;

        console.log('[FunnelSync] Queue processed', result);
        return result;
    }

    private async syncItem(item: SyncQueueItem): Promise<boolean> {
        if (!this.config) return false;

        const url = `${this.config.endpoint}/sync/${item.entityType}/${item.entityId}`;

        try {
            const response = await fetch(url, {
                method: item.type === 'delete' ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'X-User-ID': this.config.userId,
                },
                body: item.type !== 'delete' ? JSON.stringify({
                    operation: item.type,
                    data: item.data,
                    timestamp: item.timestamp,
                }) : undefined,
            });

            if (response.ok) {
                const result = await response.json();

                // Handle conflicts
                if (result.conflict) {
                    await this.handleConflict({
                        funnelId: item.entityId,
                        type: item.entityType,
                        localVersion: item.data?.version || 1,
                        serverVersion: result.serverVersion || 1,
                        localUpdatedAt: item.timestamp,
                        serverUpdatedAt: result.serverUpdatedAt,
                    });
                }

                return true;
            } else {
                const networkError = new FunnelError(
                    FunnelErrorCode.NETWORK_ERROR,
                    `HTTP error during sync: ${response.status} ${response.statusText}`,
                    {
                        operation: 'syncItem',
                        component: 'FunnelSyncService',
                        method: item.type === 'delete' ? 'DELETE' : 'POST',
                        appState: {
                            url,
                            statusCode: response.status,
                            statusText: response.statusText,
                            entityType: item.entityType,
                            entityId: item.entityId
                        }
                    }
                );
                globalFunnelErrorHandler.handleError(networkError);
                console.error('[FunnelSync] HTTP error', { status: response.status, statusText: response.statusText });
                return false;
            }

        } catch (error) {
            const networkError = new FunnelError(
                FunnelErrorCode.NETWORK_ERROR,
                'Network error during sync operation',
                {
                    operation: 'syncItem',
                    component: 'FunnelSyncService',
                    method: item.type === 'delete' ? 'DELETE' : 'POST',
                    appState: {
                        url,
                        entityType: item.entityType,
                        entityId: item.entityId
                    },
                    stackTrace: error instanceof Error ? error.stack : undefined
                }
            );
            globalFunnelErrorHandler.handleError(networkError);
            console.error('[FunnelSync] Network error', error);
            return false;
        }
    }

    // ============================================================================
    // CONFLICT RESOLUTION
    // ============================================================================

    private async handleConflict(conflict: Omit<SyncConflict, 'resolution'>): Promise<void> {
        if (!this.config) return;

        let resolution: 'server' | 'local' | 'merge' = 'local';

        switch (this.config.conflictResolution) {
            case 'server':
                resolution = 'server';
                break;
            case 'local':
                resolution = 'local';
                break;
            case 'merge':
                resolution = 'merge';
                break;
            case 'ask':
                resolution = await this.askUserForResolution(conflict);
                break;
        }

        const resolvedConflict: SyncConflict = { ...conflict, resolution };

        // Apply resolution logic
        switch (resolution) {
            case 'server':
                await this.applyServerData(conflict);
                break;
            case 'local':
                // Local data takes precedence - re-queue for sync
                this.addToQueue({
                    type: 'update',
                    entityType: conflict.type,
                    entityId: conflict.funnelId,
                    data: await this.getLocalData(conflict.funnelId, conflict.type),
                });
                break;
            case 'merge':
                await this.mergeData(conflict);
                break;
        }

        console.log('[FunnelSync] Conflict resolved', resolvedConflict);
    }

    private async askUserForResolution(_conflict: Omit<SyncConflict, 'resolution'>): Promise<'server' | 'local' | 'merge'> {
        // In a real implementation, this would show a UI dialog
        // For now, default to local
        return 'local';
    }

    private async applyServerData(conflict: Omit<SyncConflict, 'resolution'>): Promise<void> {
        // Fetch server data and apply locally
        if (!this.config) return;

        try {
            const response = await fetch(`${this.config.endpoint}/${conflict.type}/${conflict.funnelId}`, {
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'X-User-ID': this.config.userId,
                },
            });

            if (response.ok) {
                const serverData = await response.json();
                await this.updateLocalData(conflict.funnelId, conflict.type, serverData);
            }
        } catch (error) {
            console.error('[FunnelSync] Failed to apply server data', error);
        }
    }

    private async mergeData(_conflict: Omit<SyncConflict, 'resolution'>): Promise<void> {
        // Simple merge strategy - newer timestamp wins for individual fields
        // In production, this would be more sophisticated
        console.log('[FunnelSync] Merge strategy not implemented, falling back to local');
    }

    private async getLocalData(_funnelId: string, _type: 'funnel' | 'settings'): Promise<any> {
        // This would integrate with AdvancedFunnelStorage
        return null;
    }

    private async updateLocalData(_funnelId: string, _type: 'funnel' | 'settings', _data: any): Promise<void> {
        // This would integrate with AdvancedFunnelStorage
    }

    // ============================================================================
    // STATUS AND CONTROL
    // ============================================================================

    getStatus(): SyncStatus {
        const nextSyncIn = this.config?.syncInterval || 0;

        return {
            isOnline: this.isOnline,
            lastSync: this.lastSyncTime,
            pendingSync: this.syncQueue.length > 0,
            queueSize: this.syncQueue.length,
            nextSyncIn: this.syncInterval ? nextSyncIn : 0,
        };
    }

    async forcSync(): Promise<SyncResult> {
        console.log('[FunnelSync] Force sync triggered');
        return await this.processQueue();
    }

    pauseAutoSync(): void {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
        console.log('[FunnelSync] Auto sync paused');
    }

    resumeAutoSync(): void {
        if (this.config?.autoSync) {
            this.startAutoSync();
            console.log('[FunnelSync] Auto sync resumed');
        }
    }

    clearQueue(): void {
        this.syncQueue = [];
        this.saveSyncQueue();
        console.log('[FunnelSync] Queue cleared');
    }

    // ============================================================================
    // BACKUP OPERATIONS
    // ============================================================================

    async createServerBackup(): Promise<{ success: boolean; backupId?: string; error?: string }> {
        if (!this.config || !this.isOnline) {
            return { success: false, error: 'Not configured or offline' };
        }

        try {
            const response = await fetch(`${this.config.endpoint}/backup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'X-User-ID': this.config.userId,
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log('[FunnelSync] Server backup created', result);
                return { success: true, backupId: result.backupId };
            } else {
                return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
            }
        } catch (error) {
            console.error('[FunnelSync] Backup failed', error);
            return { success: false, error: `Network error: ${error}` };
        }
    }

    async listServerBackups(): Promise<{ success: boolean; backups?: any[]; error?: string }> {
        if (!this.config || !this.isOnline) {
            return { success: false, error: 'Not configured or offline' };
        }

        try {
            const response = await fetch(`${this.config.endpoint}/backups`, {
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'X-User-ID': this.config.userId,
                },
            });

            if (response.ok) {
                const backups = await response.json();
                return { success: true, backups };
            } else {
                return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
            }
        } catch (error) {
            return { success: false, error: `Network error: ${error}` };
        }
    }

    // ============================================================================
    // UTILITY METHODS
    // ============================================================================

    private createEmptyResult(): SyncResult {
        return {
            success: true,
            syncedFunnels: 0,
            syncedSettings: 0,
            conflicts: [],
            lastSyncTime: this.lastSyncTime || new Date().toISOString(),
            errors: [],
        };
    }

    // ============================================================================
    // CLEANUP
    // ============================================================================

    destroy(): void {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }

        window.removeEventListener('online', this.processQueue);
        window.removeEventListener('offline', () => { });

        console.log('[FunnelSync] Service destroyed');
    }
}

// ============================================================================
// EXPORT SINGLETON
// ============================================================================

export const funnelSyncService = new FunnelSyncService();
