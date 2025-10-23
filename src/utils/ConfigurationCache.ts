/**
 * 🗄️ CONFIGURATION CACHE - DEPRECATED
 * 
 * @deprecated Use UnifiedCacheService instead
 * @see /src/services/UnifiedCacheService.ts
 * 
 * Este arquivo será removido após migração completa (2 semanas)
 * Atualmente redireciona para UnifiedCacheService
 */

import { cacheService } from '@/services/UnifiedCacheService';

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

class ConfigurationCache {
    private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

    constructor() {
        console.warn('⚠️ ConfigurationCache is deprecated. Use UnifiedCacheService instead.');
    }

    /**
     * @deprecated Use cacheService.get('configs', key)
     */
    get<T>(key: string): T | null {
        return cacheService.get<T>('configs', key);
    }

    /**
     * @deprecated Use cacheService.set('configs', key, data, ttl)
     */
    set<T>(key: string, data: T, ttl?: number): void {
        cacheService.set('configs', key, data, ttl || this.DEFAULT_TTL);
    }

    /**
     * @deprecated Use cacheService.has('configs', key)
     */
    has(key: string): boolean {
        return cacheService.has('configs', key);
    }

    /**
     * @deprecated Use cacheService.delete('configs', key)
     */
    delete(key: string): void {
        cacheService.delete('configs', key);
    }

    /**
     * @deprecated Use cacheService.clearStore('configs')
     */
    clear(): void {
        cacheService.clearStore('configs');
    }

    /**
     * @deprecated Garbage collection agora é automático via LRU
     */
    cleanup(): void {
        console.warn('⚠️ cleanup() is deprecated. UnifiedCacheService uses automatic LRU eviction.');
    }

    /**
     * @deprecated Use cacheService.getStoreStats('configs')
     */
    getStats() {
        const stats = cacheService.getStoreStats('configs');
        return {
            size: stats.size,
            keys: [], // LRU não expõe keys diretamente
            memoryUsage: `${(stats.memoryUsage / 1024).toFixed(1)} KB`
        };
    }
}

// Singleton instance
export const configurationCache = new ConfigurationCache();

export default configurationCache;
