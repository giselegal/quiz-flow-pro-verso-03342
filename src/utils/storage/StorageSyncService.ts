// @ts-nocheck
/**
 * 🌐 STORAGE SYNC SERVICE - Sincronização Server-Side
 * 
 * Sistema de sincronização opcional com servidor:
 * - Backup automático em nuvem
 * - Sincronização entre dispositivos
 * - Resolução de conflitos inteligente
 * - Modo offline com sincronização diferida
 * - Controle de versão distribuído
 */

import { indexedDBStorage } from './IndexedDBStorageService';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export interface SyncConfig {
    endpoint: string;
    apiKey?: string;
    userId: string;
    deviceId: string;
    enabled: boolean;
    syncInterval: number; // em ms
    batchSize: number;
    conflictResolution: 'client-wins' | 'server-wins' | 'merge' | 'prompt-user';
    retryAttempts: number;
    retryDelay: number; // em ms
}

export interface SyncItem {
    id: string;
    storeName: string;
    operation: 'create' | 'update' | 'delete';
    data?: any;
    timestamp: number;
    version: number;
    deviceId: string;
    userId: string;
    checksum: string;
}

export interface SyncResponse {
    success: boolean;
    conflicts: SyncConflict[];
    serverItems: SyncItem[];
    lastSync: number;
    nextSync?: number;
}

export interface SyncConflict {
    itemId: string;
    storeName: string;
    clientItem: SyncItem;
    serverItem: SyncItem;
    conflictType: 'version' | 'timestamp' | 'checksum';
    resolution?: 'client' | 'server' | 'merge';
    mergedData?: any;
}

export interface SyncStats {
    lastSync: number;
    totalSynced: number;
    pendingSync: number;
    conflicts: number;
    errors: number;
    bandwidth: {
        upload: number;
        download: number;
    };
}

export interface OfflineQueueItem {
    id: string;
    syncItem: SyncItem;
    attempts: number;
    lastAttempt: number;
    error?: string;
}

// ============================================================================
// CLASSE PRINCIPAL
// ============================================================================

export class StorageSyncService {
    private static instance: StorageSyncService;
    private config: SyncConfig | null = null;
    private syncInterval: NodeJS.Timer | null = null;
    private isOnline: boolean = navigator.onLine;
    private stats: SyncStats = {
        lastSync: 0,
        totalSynced: 0,
        pendingSync: 0,
        conflicts: 0,
        errors: 0,
        bandwidth: { upload: 0, download: 0 }
    };

    static getInstance(): StorageSyncService {
        if (!StorageSyncService.instance) {
            StorageSyncService.instance = new StorageSyncService();
        }
        return StorageSyncService.instance;
    }

    constructor() {
        this.setupNetworkListeners();
    }

    // ============================================================================
    // CONFIGURAÇÃO E INICIALIZAÇÃO
    // ============================================================================

    async initialize(config: SyncConfig): Promise<void> {
        try {
            console.log('🌐 Inicializando serviço de sincronização...');

            this.config = config;

            // Validar configuração
            if (!this.validateConfig(config)) {
                throw new Error('Configuração de sync inválida');
            }

            // Verificar conectividade
            if (!this.isOnline) {
                console.log('📴 Modo offline - sincronização será diferida');
                return;
            }

            // Teste de conectividade com servidor
            const connected = await this.testServerConnection();
            if (!connected) {
                console.warn('⚠️ Servidor inacessível - funcionando em modo offline');
                return;
            }

            // Iniciar sincronização periódica se habilitada
            if (config.enabled) {
                this.startPeriodicSync();
            }

            // Sincronização inicial
            await this.fullSync();

            console.log('✅ Serviço de sincronização inicializado');

        } catch (error) {
            console.error('❌ Erro na inicialização do sync:', error);
            throw error;
        }
    }

    private validateConfig(config: SyncConfig): boolean {
        return !!(
            config.endpoint &&
            config.userId &&
            config.deviceId &&
            config.syncInterval > 0 &&
            config.batchSize > 0
        );
    }

    private async testServerConnection(): Promise<boolean> {
        try {
            const response = await fetch(`${this.config!.endpoint}/health`, {
                method: 'GET',
                headers: this.getHeaders(),
                signal: AbortSignal.timeout(5000) // Timeout 5s
            });

            return response.ok;

        } catch (error) {
            console.warn('⚠️ Teste de conectividade falhou:', error);
            return false;
        }
    }

    // ============================================================================
    // SINCRONIZAÇÃO PRINCIPAL
    // ============================================================================

    async fullSync(): Promise<SyncResponse> {
        if (!this.config || !this.isOnline) {
            throw new Error('Sync não configurado ou offline');
        }

        try {
            console.log('🔄 Iniciando sincronização completa...');
            const startTime = Date.now();

            // 1. Obter itens pendentes para upload
            const pendingItems = await this.getPendingItems();

            // 2. Preparar payload de sincronização
            const syncPayload = {
                userId: this.config.userId,
                deviceId: this.config.deviceId,
                lastSync: this.stats.lastSync,
                items: pendingItems
            };

            // 3. Enviar para servidor
            const response = await fetch(`${this.config.endpoint}/sync`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(syncPayload)
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const syncResponse: SyncResponse = await response.json();

            // 4. Processar resposta do servidor
            await this.processSyncResponse(syncResponse);

            // 5. Atualizar estatísticas
            this.updateSyncStats(syncResponse, Date.now() - startTime);

            console.log(`✅ Sincronização concluída: ${pendingItems.length} enviados, ${syncResponse.serverItems.length} recebidos`);

            return syncResponse;

        } catch (error) {
            console.error('❌ Erro na sincronização:', error);
            this.stats.errors++;
            throw error;
        }
    }

    private async getPendingItems(): Promise<SyncItem[]> {
        try {
            // Obter itens da fila de sincronização
            const queueItems = await indexedDBStorage.query<OfflineQueueItem>('sync_queue', {
                index: 'status',
                key: 'pending',
                limit: this.config!.batchSize
            });

            return queueItems.map(item => item.syncItem);

        } catch (error) {
            console.error('❌ Erro ao obter itens pendentes:', error);
            return [];
        }
    }

    private async processSyncResponse(response: SyncResponse): Promise<void> {
        // 1. Processar conflitos
        if (response.conflicts.length > 0) {
            await this.resolveConflicts(response.conflicts);
        }

        // 2. Aplicar atualizações do servidor
        for (const serverItem of response.serverItems) {
            await this.applyServerItem(serverItem);
        }

        // 3. Marcar itens como sincronizados
        await this.markItemsAsSynced(response);

        // 4. Atualizar timestamp da última sincronização
        this.stats.lastSync = response.lastSync;
        await this.saveStats();
    }

    // ============================================================================
    // RESOLUÇÃO DE CONFLITOS
    // ============================================================================

    private async resolveConflicts(conflicts: SyncConflict[]): Promise<void> {
        console.log(`⚠️ Resolvendo ${conflicts.length} conflitos...`);

        for (const conflict of conflicts) {
            try {
                let resolution: any;

                switch (this.config!.conflictResolution) {
                    case 'client-wins':
                        resolution = conflict.clientItem.data;
                        break;

                    case 'server-wins':
                        resolution = conflict.serverItem.data;
                        break;

                    case 'merge':
                        resolution = await this.mergeConflictData(conflict);
                        break;

                    case 'prompt-user':
                        resolution = await this.promptUserForResolution(conflict);
                        break;
                }

                // Aplicar resolução
                await indexedDBStorage.set(
                    conflict.storeName,
                    conflict.itemId,
                    resolution,
                    {
                        namespace: 'sync-resolved',
                        tags: ['conflict-resolved']
                    }
                );

                console.log(`✅ Conflito resolvido: ${conflict.itemId}`);

            } catch (error) {
                console.error(`❌ Erro ao resolver conflito ${conflict.itemId}:`, error);
                this.stats.conflicts++;
            }
        }
    }

    private async mergeConflictData(conflict: SyncConflict): Promise<any> {
        try {
            const clientData = conflict.clientItem.data;
            const serverData = conflict.serverItem.data;

            // Estratégia de merge simples: combinar propriedades
            // Priorizar dados mais recentes por campo
            const merged = { ...serverData };

            for (const [key, value] of Object.entries(clientData)) {
                // Se cliente tem timestamp mais recente para este campo, usar valor do cliente
                if (conflict.clientItem.timestamp > conflict.serverItem.timestamp) {
                    merged[key] = value;
                }
            }

            // Adicionar metadados de merge
            merged._mergeInfo = {
                clientTimestamp: conflict.clientItem.timestamp,
                serverTimestamp: conflict.serverItem.timestamp,
                mergedAt: Date.now(),
                deviceId: this.config!.deviceId
            };

            return merged;

        } catch (error) {
            console.error('❌ Erro no merge:', error);
            // Fallback: usar dados do servidor
            return conflict.serverItem.data;
        }
    }

    private async promptUserForResolution(conflict: SyncConflict): Promise<any> {
        // Implementação futura: UI para resolver conflitos
        // Por enquanto, usar estratégia client-wins
        console.log('👤 Resolução manual necessária, usando dados locais temporariamente');
        return conflict.clientItem.data;
    }

    // ============================================================================
    // OPERAÇÕES DE DADOS
    // ============================================================================

    async queueForSync(
        storeName: string,
        itemId: string,
        operation: 'create' | 'update' | 'delete',
        data?: any
    ): Promise<void> {
        if (!this.config) return;

        try {
            const syncItem: SyncItem = {
                id: `${storeName}_${itemId}_${Date.now()}`,
                storeName,
                operation,
                data,
                timestamp: Date.now(),
                version: 1,
                deviceId: this.config.deviceId,
                userId: this.config.userId,
                checksum: await this.calculateChecksum(data)
            };

            const queueItem: OfflineQueueItem = {
                id: syncItem.id,
                syncItem,
                attempts: 0,
                lastAttempt: 0
            };

            await indexedDBStorage.set('sync_queue', syncItem.id, queueItem);
            this.stats.pendingSync++;

            console.log(`📤 Item adicionado à fila de sync: ${storeName}/${itemId}`);

            // Tentar sincronizar imediatamente se online
            if (this.isOnline) {
                this.debouncedSync();
            }

        } catch (error) {
            console.error('❌ Erro ao adicionar item à fila:', error);
        }
    }

    private async applyServerItem(serverItem: SyncItem): Promise<void> {
        try {
            switch (serverItem.operation) {
                case 'create':
                case 'update':
                    await indexedDBStorage.set(
                        serverItem.storeName,
                        serverItem.id,
                        serverItem.data,
                        {
                            namespace: 'server-sync',
                            tags: ['server-origin']
                        }
                    );
                    break;

                case 'delete':
                    await indexedDBStorage.delete(serverItem.storeName, serverItem.id);
                    break;
            }

            this.stats.totalSynced++;

        } catch (error) {
            console.error(`❌ Erro ao aplicar item do servidor ${serverItem.id}:`, error);
        }
    }

    private async markItemsAsSynced(response: SyncResponse): Promise<void> {
        // Implementar lógica para marcar itens como sincronizados
        // e remover da fila offline
    }

    // ============================================================================
    // UTILITÁRIOS
    // ============================================================================

    private async calculateChecksum(data: any): Promise<string> {
        const serialized = JSON.stringify(data) || '';
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(serialized);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    private getHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'User-Agent': `QuizQuest-Storage/1.0`,
            'X-Device-ID': this.config!.deviceId,
            'X-User-ID': this.config!.userId
        };

        if (this.config!.apiKey) {
            headers['Authorization'] = `Bearer ${this.config!.apiKey}`;
        }

        return headers;
    }

    // ============================================================================
    // GERENCIAMENTO DE REDE
    // ============================================================================

    private setupNetworkListeners(): void {
        window.addEventListener('online', () => {
            console.log('🌐 Conectividade restaurada');
            this.isOnline = true;
            this.onNetworkRestore();
        });

        window.addEventListener('offline', () => {
            console.log('📴 Conectividade perdida - modo offline');
            this.isOnline = false;
            this.onNetworkLost();
        });
    }

    private onNetworkRestore(): void {
        if (this.config && this.config.enabled) {
            // Tentar sincronizar itens pendentes
            setTimeout(() => {
                this.fullSync().catch(error => {
                    console.error('❌ Erro na sincronização pós-reconexão:', error);
                });
            }, 1000);
        }
    }

    private onNetworkLost(): void {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }

    // ============================================================================
    // SINCRONIZAÇÃO PERIÓDICA
    // ============================================================================

    private startPeriodicSync(): void {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }

        this.syncInterval = setInterval(() => {
            if (this.isOnline) {
                this.fullSync().catch(error => {
                    console.error('❌ Erro na sincronização periódica:', error);
                });
            }
        }, this.config!.syncInterval);

        console.log(`⏰ Sincronização periódica iniciada (${this.config!.syncInterval}ms)`);
    }

    private debouncedSync = this.debounce(() => {
        if (this.isOnline) {
            this.fullSync().catch(error => {
                console.error('❌ Erro na sincronização debounced:', error);
            });
        }
    }, 2000);

    private debounce(func: Function, wait: number) {
        let timeout: NodeJS.Timeout;
        return function (...args: any[]) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // ============================================================================
    // ESTATÍSTICAS E MONITORAMENTO
    // ============================================================================

    private updateSyncStats(response: SyncResponse, duration: number): void {
        this.stats.totalSynced += response.serverItems.length;
        this.stats.conflicts += response.conflicts.length;
        this.stats.lastSync = Date.now();

        // Estimar bandwidth (aproximado)
        this.stats.bandwidth.download += JSON.stringify(response).length;
    }

    private async saveStats(): Promise<void> {
        try {
            await indexedDBStorage.set('metadata', 'sync_stats', this.stats);
        } catch (error) {
            console.error('❌ Erro ao salvar estatísticas:', error);
        }
    }

    // ============================================================================
    // API PÚBLICA
    // ============================================================================

    getStats(): SyncStats {
        return { ...this.stats };
    }

    isEnabled(): boolean {
        return this.config?.enabled || false;
    }

    isConfigured(): boolean {
        return this.config !== null;
    }

    async pause(): Promise<void> {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
        console.log('⏸️ Sincronização pausada');
    }

    async resume(): Promise<void> {
        if (this.config && this.config.enabled) {
            this.startPeriodicSync();
            console.log('▶️ Sincronização retomada');
        }
    }

    async forceSync(): Promise<SyncResponse> {
        return await this.fullSync();
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const storageSyncService = StorageSyncService.getInstance();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Configura e inicializa sincronização server-side
 */
export async function initializeSync(config: SyncConfig): Promise<void> {
    await storageSyncService.initialize(config);
}

/**
 * Adiciona item à fila de sincronização
 */
export async function syncItem(
    storeName: string,
    itemId: string,
    operation: 'create' | 'update' | 'delete',
    data?: any
): Promise<void> {
    await storageSyncService.queueForSync(storeName, itemId, operation, data);
}

/**
 * Obter estatísticas de sincronização
 */
export function getSyncStats(): SyncStats {
    return storageSyncService.getStats();
}
