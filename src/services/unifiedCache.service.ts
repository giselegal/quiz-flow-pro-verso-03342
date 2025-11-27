/**
 * 💾 UNIFIED CACHE SERVICE - Sistema de Cache de 3 Camadas
 * 
 * Implementa cache hierárquico otimizado:
 * - L1 (Memory): Cache em memória RAM - 5 minutos - ultra rápido
 * - L2 (IndexedDB): Cache persistente local - 30 minutos - rápido
 * - L3 (Supabase): Fonte de verdade remota - sempre atualizado
 * 
 * ESTRATÉGIA:
 * 1. Buscar em L1 (memory) - se encontrar e válido, retorna
 * 2. Buscar em L2 (IndexedDB) - se encontrar e válido, popula L1 e retorna
 * 3. Buscar em L3 (Supabase) - popula L2 e L1, retorna
 * 
 * INVALIDAÇÃO:
 * - Writes sempre invalidam todas as camadas
 * - TTL diferente por camada (L1: 5min, L2: 30min)
 * - Invalidação coordenada entre abas (BroadcastChannel)
 * 
 * @version 1.0.0
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES
// ============================================================================

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiresAt: number;
    version: string;
}

interface CacheMetadata {
    key: string;
    size: number;
    hits: number;
    misses: number;
    lastAccessed: number;
}

interface CacheDBSchema extends DBSchema {
    'cache-entries': {
        key: string;
        value: CacheEntry<unknown>;
    };
    'cache-metadata': {
        key: string;
        value: CacheMetadata;
    };
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const CACHE_CONFIG = {
    L1_TTL: 5 * 60 * 1000,      // 5 minutos
    L2_TTL: 30 * 60 * 1000,     // 30 minutos
    L1_MAX_SIZE: 100,            // Máximo de entradas em memória
    DB_NAME: 'quiz-flow-cache',
    DB_VERSION: 1,
    BROADCAST_CHANNEL: 'cache-invalidation',
} as const;

// ============================================================================
// UNIFIED CACHE SERVICE
// ============================================================================

export class UnifiedCacheService {
    private static instance: UnifiedCacheService;
    private l1Cache: Map<string, CacheEntry<unknown>>;
    private db: IDBPDatabase<CacheDBSchema> | null = null;
    private broadcastChannel: BroadcastChannel | null = null;
    private initPromise: Promise<void> | null = null;

    private constructor() {
        this.l1Cache = new Map();
        this.initPromise = this.initialize();
    }

    static getInstance(): UnifiedCacheService {
        if (!UnifiedCacheService.instance) {
            UnifiedCacheService.instance = new UnifiedCacheService();
        }
        return UnifiedCacheService.instance;
    }

    /**
     * Inicializa IndexedDB e BroadcastChannel
     */
    private async initialize(): Promise<void> {
        try {
            // Inicializar IndexedDB
            this.db = await openDB<CacheDBSchema>(CACHE_CONFIG.DB_NAME, CACHE_CONFIG.DB_VERSION, {
                upgrade(db) {
                    // Store para entradas de cache
                    if (!db.objectStoreNames.contains('cache-entries')) {
                        db.createObjectStore('cache-entries');
                    }
                    // Store para metadata
                    if (!db.objectStoreNames.contains('cache-metadata')) {
                        db.createObjectStore('cache-metadata');
                    }
                },
            });

            // Inicializar BroadcastChannel para invalidação entre abas
            if (typeof BroadcastChannel !== 'undefined') {
                this.broadcastChannel = new BroadcastChannel(CACHE_CONFIG.BROADCAST_CHANNEL);
                this.broadcastChannel.onmessage = (event) => {
                    this.handleInvalidationMessage(event.data);
                };
            }

            appLogger.info('[UnifiedCache] Initialized successfully', {
                data: [{ l1MaxSize: CACHE_CONFIG.L1_MAX_SIZE, l2TTL: CACHE_CONFIG.L2_TTL }],
            });
        } catch (error) {
            appLogger.error('[UnifiedCache] Initialization failed', { error });
        }
    }

    /**
     * Aguarda inicialização antes de operações
     */
    private async ensureInitialized(): Promise<void> {
        if (this.initPromise) {
            await this.initPromise;
        }
    }

    /**
     * GET - Busca valor em cache (L1 → L2 → L3)
     */
    async get<T>(key: string, fetchFromL3?: () => Promise<T>): Promise<T | null> {
        await this.ensureInitialized();

        // 1. Tentar L1 (Memory)
        const l1Entry = this.getFromL1<T>(key);
        if (l1Entry) {
            this.updateMetadata(key, 'hit', 'L1');
            appLogger.debug(`[UnifiedCache] L1 HIT: ${key}`);
            return l1Entry;
        }

        // 2. Tentar L2 (IndexedDB)
        const l2Entry = await this.getFromL2<T>(key);
        if (l2Entry) {
            // Promover para L1
            this.setToL1(key, l2Entry, CACHE_CONFIG.L1_TTL);
            this.updateMetadata(key, 'hit', 'L2');
            appLogger.debug(`[UnifiedCache] L2 HIT: ${key}`);
            return l2Entry;
        }

        // 3. Buscar em L3 (Supabase) se callback fornecido
        if (fetchFromL3) {
            try {
                const l3Data = await fetchFromL3();
                // Armazenar em L2 e L1
                await this.set(key, l3Data);
                this.updateMetadata(key, 'hit', 'L3');
                appLogger.debug(`[UnifiedCache] L3 HIT: ${key}`);
                return l3Data;
            } catch (error) {
                appLogger.error(`[UnifiedCache] L3 FETCH ERROR: ${key}`, { error });
                return null;
            }
        }

        this.updateMetadata(key, 'miss', 'ALL');
        return null;
    }

    /**
     * SET - Armazena valor em todas as camadas
     */
    async set<T>(key: string, value: T, ttlOverride?: number): Promise<void> {
        await this.ensureInitialized();

        const l1TTL = ttlOverride || CACHE_CONFIG.L1_TTL;
        const l2TTL = ttlOverride || CACHE_CONFIG.L2_TTL;

        // Armazenar em L1
        this.setToL1(key, value, l1TTL);

        // Armazenar em L2
        await this.setToL2(key, value, l2TTL);

        // Broadcast invalidação para outras abas
        this.broadcastInvalidation(key, 'set');

        appLogger.debug(`[UnifiedCache] SET: ${key}`);
    }

    /**
     * INVALIDATE - Remove valor de todas as camadas
     */
    async invalidate(key: string): Promise<void> {
        await this.ensureInitialized();

        // Remover de L1
        this.l1Cache.delete(key);

        // Remover de L2
        if (this.db) {
            try {
                await this.db.delete('cache-entries', key);
                await this.db.delete('cache-metadata', key);
            } catch (error) {
                appLogger.error(`[UnifiedCache] L2 DELETE ERROR: ${key}`, { error });
            }
        }

        // Broadcast invalidação
        this.broadcastInvalidation(key, 'invalidate');

        appLogger.debug(`[UnifiedCache] INVALIDATED: ${key}`);
    }

    /**
     * CLEAR - Limpa todas as camadas
     */
    async clear(): Promise<void> {
        await this.ensureInitialized();

        // Limpar L1
        this.l1Cache.clear();

        // Limpar L2
        if (this.db) {
            try {
                await this.db.clear('cache-entries');
                await this.db.clear('cache-metadata');
            } catch (error) {
                appLogger.error('[UnifiedCache] CLEAR ERROR', { error });
            }
        }

        // Broadcast clear
        this.broadcastInvalidation('*', 'clear');

        appLogger.info('[UnifiedCache] CLEARED all caches');
    }

    /**
     * STATS - Retorna estatísticas do cache
     */
    async getStats(): Promise<{
        l1Size: number;
        l2Size: number;
        metadata: CacheMetadata[];
    }> {
        await this.ensureInitialized();

        const l1Size = this.l1Cache.size;
        let l2Size = 0;
        const metadata: CacheMetadata[] = [];

        if (this.db) {
            try {
                const keys = await this.db.getAllKeys('cache-entries');
                l2Size = keys.length;

                const metadataKeys = await this.db.getAllKeys('cache-metadata');
                for (const key of metadataKeys) {
                    const meta = await this.db.get('cache-metadata', key);
                    if (meta) metadata.push(meta);
                }
            } catch (error) {
                appLogger.error('[UnifiedCache] STATS ERROR', { error });
            }
        }

        return { l1Size, l2Size, metadata };
    }

    // ========================================================================
    // PRIVATE METHODS - L1 (Memory)
    // ========================================================================

    private getFromL1<T>(key: string): T | null {
        const entry = this.l1Cache.get(key) as CacheEntry<T> | undefined;
        
        if (!entry) return null;
        
        // Verificar expiração
        if (Date.now() > entry.expiresAt) {
            this.l1Cache.delete(key);
            return null;
        }

        return entry.data;
    }

    private setToL1<T>(key: string, value: T, ttl: number): void {
        // Limitar tamanho do cache
        if (this.l1Cache.size >= CACHE_CONFIG.L1_MAX_SIZE) {
            // Remover entrada mais antiga
            const firstKey = this.l1Cache.keys().next().value;
            if (firstKey) this.l1Cache.delete(firstKey);
        }

        const entry: CacheEntry<T> = {
            data: value,
            timestamp: Date.now(),
            expiresAt: Date.now() + ttl,
            version: '1.0',
        };

        this.l1Cache.set(key, entry as CacheEntry<unknown>);
    }

    // ========================================================================
    // PRIVATE METHODS - L2 (IndexedDB)
    // ========================================================================

    private async getFromL2<T>(key: string): Promise<T | null> {
        if (!this.db) return null;

        try {
            const entry = await this.db.get('cache-entries', key) as CacheEntry<T> | undefined;
            
            if (!entry) return null;
            
            // Verificar expiração
            if (Date.now() > entry.expiresAt) {
                await this.db.delete('cache-entries', key);
                return null;
            }

            return entry.data;
        } catch (error) {
            appLogger.error(`[UnifiedCache] L2 GET ERROR: ${key}`, { error });
            return null;
        }
    }

    private async setToL2<T>(key: string, value: T, ttl: number): Promise<void> {
        if (!this.db) return;

        try {
            const entry: CacheEntry<T> = {
                data: value,
                timestamp: Date.now(),
                expiresAt: Date.now() + ttl,
                version: '1.0',
            };

            await this.db.put('cache-entries', entry as CacheEntry<unknown>, key);
        } catch (error) {
            appLogger.error(`[UnifiedCache] L2 SET ERROR: ${key}`, { error });
        }
    }

    // ========================================================================
    // PRIVATE METHODS - Metadata & Broadcast
    // ========================================================================

    private async updateMetadata(
        key: string,
        action: 'hit' | 'miss',
        layer: 'L1' | 'L2' | 'L3' | 'ALL'
    ): Promise<void> {
        if (!this.db) return;

        try {
            let metadata = await this.db.get('cache-metadata', key);
            
            if (!metadata) {
                metadata = {
                    key,
                    size: 0,
                    hits: 0,
                    misses: 0,
                    lastAccessed: Date.now(),
                };
            }

            if (action === 'hit') {
                metadata.hits++;
            } else {
                metadata.misses++;
            }
            metadata.lastAccessed = Date.now();

            await this.db.put('cache-metadata', metadata, key);
        } catch (error) {
            appLogger.error(`[UnifiedCache] METADATA UPDATE ERROR: ${key}`, { error });
        }
    }

    private broadcastInvalidation(key: string, action: 'set' | 'invalidate' | 'clear'): void {
        if (this.broadcastChannel) {
            this.broadcastChannel.postMessage({ key, action, timestamp: Date.now() });
        }
    }

    private handleInvalidationMessage(message: { key: string; action: string; timestamp: number }): void {
        const { key, action } = message;

        if (action === 'clear') {
            this.l1Cache.clear();
        } else if (action === 'invalidate') {
            this.l1Cache.delete(key);
        }
        // 'set' não precisa de ação pois será buscado novamente se necessário
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const unifiedCache = UnifiedCacheService.getInstance();

// ============================================================================
// CONVENIENCE HOOKS/HELPERS
// ============================================================================

/**
 * Helper para criar chave de cache consistente
 */
export function createCacheKey(namespace: string, id: string | number): string {
    return `${namespace}:${id}`;
}

/**
 * Helper para invalidar namespace inteiro
 */
export async function invalidateNamespace(namespace: string): Promise<void> {
    const stats = await unifiedCache.getStats();
    const keysToInvalidate = stats.metadata
        .filter(m => m.key.startsWith(`${namespace}:`))
        .map(m => m.key);

    for (const key of keysToInvalidate) {
        await unifiedCache.invalidate(key);
    }
}
