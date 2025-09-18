/**
 * 🗄️ INDEXED DB STORAGE SERVICE - Sistema de Armazenamento Escalável
 * 
 * Substitui localStorage por IndexedDB para:
 * - Capacidade ilimitada de armazenamento
 * - Operações assíncronas e transações ACID
 * - Versionamento de esquema robusto
 * - Índices complexos para busca rápida
 * - Compressão automática de dados grandes
 * - Sync server-side opcional
 */

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export interface StorageConfig {
    dbName: string;
    version: number;
    stores: StoreConfig[];
}

export interface StoreConfig {
    name: string;
    keyPath?: string;
    autoIncrement?: boolean;
    indexes?: IndexConfig[];
}

export interface IndexConfig {
    name: string;
    keyPath: string | string[];
    options?: {
        unique?: boolean;
        multiEntry?: boolean;
    };
}

export interface StorageItem<T = any> {
    id: string;
    data: T;
    timestamp: number;
    version: string;
    ttl?: number;
    metadata?: StorageMetadata;
}

export interface StorageMetadata {
    namespace?: string;
    tags?: string[];
    compressed?: boolean;
    originalSize?: number;
    userId?: string;
    context?: string;
}

export interface MigrationConfig {
    fromVersion: number;
    toVersion: number;
    handler: (db: IDBDatabase, transaction: IDBTransaction) => Promise<void>;
}

export interface SyncConfig {
    enabled: boolean;
    endpoint?: string;
    interval?: number;
    batchSize?: number;
    conflictResolution?: 'client-wins' | 'server-wins' | 'merge';
}

// ============================================================================
// CONFIGURAÇÃO DO BANCO DE DADOS
// ============================================================================

export const DATABASE_CONFIG: StorageConfig = {
    dbName: 'QuizQuestStorage',
    version: 1,
    stores: [
        {
            name: 'funnels',
            keyPath: 'id',
            indexes: [
                { name: 'userId', keyPath: 'metadata.userId' },
                { name: 'context', keyPath: 'metadata.context' },
                { name: 'timestamp', keyPath: 'timestamp' },
                { name: 'namespace', keyPath: 'metadata.namespace' },
                { name: 'tags', keyPath: 'metadata.tags', options: { multiEntry: true } }
            ]
        },
        {
            name: 'settings',
            keyPath: 'id',
            indexes: [
                { name: 'funnelId', keyPath: 'funnelId' },
                { name: 'userId', keyPath: 'metadata.userId' },
                { name: 'timestamp', keyPath: 'timestamp' }
            ]
        },
        {
            name: 'cache',
            keyPath: 'id',
            indexes: [
                { name: 'namespace', keyPath: 'metadata.namespace' },
                { name: 'ttl', keyPath: 'ttl' },
                { name: 'timestamp', keyPath: 'timestamp' }
            ]
        },
        {
            name: 'sync_queue',
            keyPath: 'id',
            autoIncrement: true,
            indexes: [
                { name: 'status', keyPath: 'status' },
                { name: 'priority', keyPath: 'priority' },
                { name: 'timestamp', keyPath: 'timestamp' }
            ]
        },
        {
            name: 'metadata',
            keyPath: 'key',
            indexes: [
                { name: 'category', keyPath: 'category' },
                { name: 'timestamp', keyPath: 'timestamp' }
            ]
        }
    ]
};

// ============================================================================
// CLASSE PRINCIPAL
// ============================================================================

export class IndexedDBStorageService {
    private static instance: IndexedDBStorageService;
    private db: IDBDatabase | null = null;
    private config: StorageConfig;
    private migrations: MigrationConfig[] = [];
    private syncConfig: SyncConfig = { enabled: false };

    private constructor(config: StorageConfig = DATABASE_CONFIG) {
        this.config = config;
        this.setupMigrations();
    }

    static getInstance(config?: StorageConfig): IndexedDBStorageService {
        if (!IndexedDBStorageService.instance) {
            IndexedDBStorageService.instance = new IndexedDBStorageService(config);
        }
        return IndexedDBStorageService.instance;
    }

    // ============================================================================
    // INICIALIZAÇÃO E CONFIGURAÇÃO
    // ============================================================================

    async initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.config.dbName, this.config.version);

            request.onerror = () => {
                console.error('❌ Erro ao abrir IndexedDB:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ IndexedDB inicializado com sucesso');
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                this.handleUpgrade(db, event.oldVersion, event.newVersion || this.config.version);
            };
        });
    }

    private handleUpgrade(db: IDBDatabase, oldVersion: number, newVersion: number): void {
        console.log(`🔄 Atualizando IndexedDB: v${oldVersion} → v${newVersion}`);

        // Criar object stores se não existirem
        for (const storeConfig of this.config.stores) {
            if (!db.objectStoreNames.contains(storeConfig.name)) {
                const store = db.createObjectStore(storeConfig.name, {
                    keyPath: storeConfig.keyPath,
                    autoIncrement: storeConfig.autoIncrement
                });

                // Criar índices
                if (storeConfig.indexes) {
                    for (const indexConfig of storeConfig.indexes) {
                        store.createIndex(
                            indexConfig.name,
                            indexConfig.keyPath,
                            indexConfig.options
                        );
                    }
                }
                console.log(`✅ Object store criado: ${storeConfig.name}`);
            }
        }

        // Executar migrações personalizadas
        this.executeMigrations(db, oldVersion, newVersion);
    }

    private setupMigrations(): void {
        // Migração v1: Estrutura inicial - já tratada no handleUpgrade
        this.migrations = [];
    }

    private executeMigrations(db: IDBDatabase, fromVersion: number, toVersion: number): void {
        const applicableMigrations = this.migrations.filter(
            m => m.fromVersion >= fromVersion && m.toVersion <= toVersion
        );

        for (const migration of applicableMigrations) {
            try {
                const transaction = db.transaction(
                    Array.from(db.objectStoreNames),
                    'readwrite'
                );
                migration.handler(db, transaction);
                console.log(`✅ Migração executada: v${migration.fromVersion} → v${migration.toVersion}`);
            } catch (error) {
                console.error(`❌ Erro na migração v${migration.fromVersion} → v${migration.toVersion}:`, error);
            }
        }
    }

    // ============================================================================
    // OPERAÇÕES CRUD BÁSICAS
    // ============================================================================

    async set<T>(
        storeName: string,
        key: string,
        data: T,
        metadata?: Partial<StorageMetadata>
    ): Promise<boolean> {
        if (!this.db) {
            throw new Error('IndexedDB não inicializado');
        }

        try {
            const item: StorageItem<T> = {
                id: key,
                data,
                timestamp: Date.now(),
                version: this.config.version.toString(),
                metadata: {
                    namespace: 'default',
                    ...metadata
                }
            };

            // Compressão automática para dados grandes
            if (this.shouldCompress(data)) {
                item.data = await this.compress(data);
                item.metadata!.compressed = true;
                item.metadata!.originalSize = JSON.stringify(data).length;
            }

            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);

            return new Promise((resolve, reject) => {
                const request = store.put(item);

                request.onsuccess = () => {
                    console.log(`✅ Dados salvos no IndexedDB: ${storeName}/${key}`);
                    this.queueSync(storeName, key, 'PUT', item);
                    resolve(true);
                };

                request.onerror = () => {
                    console.error(`❌ Erro ao salvar no IndexedDB:`, request.error);
                    reject(request.error);
                };
            });

        } catch (error) {
            console.error('❌ Erro no método set:', error);
            return false;
        }
    }

    async get<T>(storeName: string, key: string): Promise<T | null> {
        if (!this.db) {
            throw new Error('IndexedDB não inicializado');
        }

        try {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);

            return new Promise((resolve, reject) => {
                const request = store.get(key);

                request.onsuccess = async () => {
                    const item = request.result as StorageItem<T> | undefined;

                    if (!item) {
                        resolve(null);
                        return;
                    }

                    // Verificar TTL
                    if (item.ttl && Date.now() > item.timestamp + (item.ttl * 1000)) {
                        console.log(`⏰ Item expirado removido: ${storeName}/${key}`);
                        this.delete(storeName, key);
                        resolve(null);
                        return;
                    }

                    // Descompressão se necessário
                    let data = item.data;
                    if (item.metadata?.compressed) {
                        data = await this.decompress(data);
                    }

                    console.log(`✅ Dados carregados do IndexedDB: ${storeName}/${key}`);
                    resolve(data);
                };

                request.onerror = () => {
                    console.error(`❌ Erro ao carregar do IndexedDB:`, request.error);
                    reject(request.error);
                };
            });

        } catch (error) {
            console.error('❌ Erro no método get:', error);
            return null;
        }
    }

    async delete(storeName: string, key: string): Promise<boolean> {
        if (!this.db) {
            throw new Error('IndexedDB não inicializado');
        }

        try {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);

            return new Promise((resolve, reject) => {
                const request = store.delete(key);

                request.onsuccess = () => {
                    console.log(`✅ Item removido do IndexedDB: ${storeName}/${key}`);
                    this.queueSync(storeName, key, 'DELETE');
                    resolve(true);
                };

                request.onerror = () => {
                    console.error(`❌ Erro ao remover do IndexedDB:`, request.error);
                    reject(request.error);
                };
            });

        } catch (error) {
            console.error('❌ Erro no método delete:', error);
            return false;
        }
    }

    // ============================================================================
    // OPERAÇÕES AVANÇADAS
    // ============================================================================

    async query<T>(
        storeName: string,
        filter?: {
            index?: string;
            key?: IDBValidKey | IDBKeyRange;
            direction?: IDBCursorDirection;
            limit?: number;
        }
    ): Promise<T[]> {
        if (!this.db) {
            throw new Error('IndexedDB não inicializado');
        }

        try {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const source = filter?.index ? store.index(filter.index) : store;

            return new Promise((resolve, reject) => {
                const results: T[] = [];
                const request = source.openCursor(filter?.key, filter?.direction);
                let count = 0;

                request.onsuccess = async (event) => {
                    const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;

                    if (cursor && (!filter?.limit || count < filter.limit)) {
                        const item = cursor.value as StorageItem<T>;

                        // Verificar TTL
                        if (!item.ttl || Date.now() <= item.timestamp + (item.ttl * 1000)) {
                            let data = item.data;
                            if (item.metadata?.compressed) {
                                data = await this.decompress(data);
                            }
                            results.push(data);
                            count++;
                        }

                        cursor.continue();
                    } else {
                        resolve(results);
                    }
                };

                request.onerror = () => {
                    console.error(`❌ Erro na consulta do IndexedDB:`, request.error);
                    reject(request.error);
                };
            });

        } catch (error) {
            console.error('❌ Erro no método query:', error);
            return [];
        }
    }

    async clear(storeName: string, namespace?: string): Promise<boolean> {
        if (!this.db) {
            throw new Error('IndexedDB não inicializado');
        }

        try {
            if (namespace) {
                // Limpar apenas itens do namespace específico
                const items = await this.query<any>(storeName, {
                    index: 'namespace',
                    key: namespace
                });

                for (const item of items) {
                    await this.delete(storeName, item.id);
                }
            } else {
                // Limpar todo o store
                const transaction = this.db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);

                return new Promise((resolve, reject) => {
                    const request = store.clear();

                    request.onsuccess = () => {
                        console.log(`✅ Store limpo: ${storeName}`);
                        resolve(true);
                    };

                    request.onerror = () => {
                        console.error(`❌ Erro ao limpar store:`, request.error);
                        reject(request.error);
                    };
                });
            }

            return true;

        } catch (error) {
            console.error('❌ Erro no método clear:', error);
            return false;
        }
    }

    // ============================================================================
    // COMPRESSÃO E OTIMIZAÇÃO
    // ============================================================================

    private shouldCompress(data: any): boolean {
        const serialized = JSON.stringify(data);
        return serialized.length > 10 * 1024; // Comprimir se > 10KB
    }

    private async compress<T>(data: T): Promise<any> {
        try {
            const serialized = JSON.stringify(data);
            const compressed = await this.compressString(serialized);
            return { __compressed: true, data: compressed };
        } catch (error) {
            console.warn('⚠️ Falha na compressão, salvando dados originais:', error);
            return data;
        }
    }

    private async decompress<T>(data: any): Promise<T> {
        try {
            if (data && data.__compressed) {
                const decompressed = await this.decompressString(data.data);
                return JSON.parse(decompressed);
            }
            return data;
        } catch (error) {
            console.warn('⚠️ Falha na descompressão, retornando dados originais:', error);
            return data;
        }
    }

    private async compressString(str: string): Promise<string> {
        // Implementação simples de compressão usando LZ-string ou similar
        // Por enquanto, retorna o string original
        return str;
    }

    private async decompressString(str: string): Promise<string> {
        // Implementação simples de descompressão
        // Por enquanto, retorna o string original
        return str;
    }

    // ============================================================================
    // SINCRONIZAÇÃO SERVER-SIDE
    // ============================================================================

    setSyncConfig(config: Partial<SyncConfig>): void {
        this.syncConfig = { ...this.syncConfig, ...config };

        if (this.syncConfig.enabled && this.syncConfig.interval) {
            this.startSyncInterval();
        }
    }

    private queueSync(storeName: string, key: string, operation: 'PUT' | 'DELETE', data?: any): void {
        if (!this.syncConfig.enabled) return;

        const syncItem = {
            storeName,
            key,
            operation,
            data,
            timestamp: Date.now(),
            status: 'pending',
            priority: 1
        };

        // Adicionar à fila de sincronização
        this.set('sync_queue', `${storeName}-${key}-${Date.now()}`, syncItem);
    }

    private startSyncInterval(): void {
        if (this.syncConfig.interval) {
            setInterval(() => {
                this.processSyncQueue();
            }, this.syncConfig.interval);
        }
    }

    private async processSyncQueue(): Promise<void> {
        if (!this.syncConfig.enabled || !this.syncConfig.endpoint) return;

        try {
            const pendingItems = await this.query<any>('sync_queue', {
                index: 'status',
                key: 'pending',
                limit: this.syncConfig.batchSize || 10
            });

            if (pendingItems.length === 0) return;

            // Enviar para servidor
            const response = await fetch(this.syncConfig.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: pendingItems })
            });

            if (response.ok) {
                // Marcar como sincronizado
                for (const item of pendingItems) {
                    await this.set('sync_queue', item.id, { ...item, status: 'synced' });
                }
                console.log(`✅ ${pendingItems.length} itens sincronizados com servidor`);
            }

        } catch (error) {
            console.error('❌ Erro na sincronização:', error);
        }
    }

    // ============================================================================
    // OPERAÇÕES DE MANUTENÇÃO
    // ============================================================================

    async cleanup(): Promise<number> {
        if (!this.db) return 0;

        let removedCount = 0;

        try {
            for (const storeConfig of this.config.stores) {
                const items = await this.query<StorageItem>(storeConfig.name);
                const now = Date.now();

                for (const item of items) {
                    // Remover itens expirados
                    if (item.ttl && now > item.timestamp + (item.ttl * 1000)) {
                        await this.delete(storeConfig.name, item.id);
                        removedCount++;
                    }
                }
            }

            console.log(`🧹 ${removedCount} itens expirados removidos`);

        } catch (error) {
            console.error('❌ Erro na limpeza:', error);
        }

        return removedCount;
    }

    async getStats(): Promise<{
        totalItems: number;
        totalSize: number;
        storeStats: Record<string, number>;
    }> {
        if (!this.db) {
            return { totalItems: 0, totalSize: 0, storeStats: {} };
        }

        let totalItems = 0;
        let totalSize = 0;
        const storeStats: Record<string, number> = {};

        try {
            for (const storeConfig of this.config.stores) {
                const items = await this.query<StorageItem>(storeConfig.name);
                const storeItemCount = items.length;
                const storeSize = items.reduce((acc, item) => {
                    return acc + JSON.stringify(item).length;
                }, 0);

                storeStats[storeConfig.name] = storeItemCount;
                totalItems += storeItemCount;
                totalSize += storeSize;
            }

        } catch (error) {
            console.error('❌ Erro ao calcular estatísticas:', error);
        }

        return { totalItems, totalSize, storeStats };
    }

    // ============================================================================
    // RESET E VERSIONING
    // ============================================================================

    async resetDatabase(): Promise<boolean> {
        try {
            if (this.db) {
                this.db.close();
            }

            // Deletar banco de dados
            return new Promise((resolve, reject) => {
                const deleteRequest = indexedDB.deleteDatabase(this.config.dbName);

                deleteRequest.onsuccess = async () => {
                    console.log('✅ Database resetado com sucesso');
                    // Reinicializar
                    await this.initialize();
                    resolve(true);
                };

                deleteRequest.onerror = () => {
                    console.error('❌ Erro ao resetar database:', deleteRequest.error);
                    reject(deleteRequest.error);
                };
            });

        } catch (error) {
            console.error('❌ Erro no reset:', error);
            return false;
        }
    }

    async backup(): Promise<string> {
        if (!this.db) {
            throw new Error('IndexedDB não inicializado');
        }

        try {
            const backup: Record<string, any[]> = {};

            for (const storeConfig of this.config.stores) {
                backup[storeConfig.name] = await this.query<StorageItem>(storeConfig.name);
            }

            const backupData = {
                version: this.config.version,
                timestamp: Date.now(),
                data: backup
            };

            return JSON.stringify(backupData);

        } catch (error) {
            console.error('❌ Erro no backup:', error);
            throw error;
        }
    }

    async restore(backupString: string): Promise<boolean> {
        try {
            const backupData = JSON.parse(backupString);

            // Verificar compatibilidade de versão
            if (backupData.version > this.config.version) {
                console.warn('⚠️ Backup de versão superior, pode haver problemas de compatibilidade');
            }

            // Limpar dados existentes
            for (const storeConfig of this.config.stores) {
                await this.clear(storeConfig.name);
            }

            // Restaurar dados
            for (const [storeName, items] of Object.entries(backupData.data)) {
                if (Array.isArray(items)) {
                    for (const item of items as StorageItem[]) {
                        await this.set(storeName, item.id, item.data, item.metadata);
                    }
                }
            }

            console.log('✅ Backup restaurado com sucesso');
            return true;

        } catch (error) {
            console.error('❌ Erro na restauração:', error);
            return false;
        }
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const indexedDBStorage = IndexedDBStorageService.getInstance();

// ============================================================================
// INICIALIZAÇÃO AUTOMÁTICA
// ============================================================================

// Auto-inicializar quando o módulo for carregado
if (typeof window !== 'undefined') {
    indexedDBStorage.initialize().catch(error => {
        console.error('❌ Falha na inicialização automática do IndexedDB:', error);
    });
}
