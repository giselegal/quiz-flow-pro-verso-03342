/**
 * 🗄️ CONFIGURATION CACHE - DEPRECATED
 * 
 * @deprecated Use UnifiedCacheService instead
 * @see /src/services/UnifiedCacheService.ts
 * 
 * Este arquivo será removido após migração completa (2 semanas)
 * Atualmente redireciona para UnifiedCacheService
 */

import { cacheService } from '@/services/canonical';
import { appLogger } from '@/lib/utils/appLogger';

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

class ConfigurationCache {
    private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

    constructor() {
        appLogger.warn('⚠️ ConfigurationCache is deprecated. Use UnifiedCacheService instead.');
    }

    /**
     * @deprecated Use cacheService.get('configs', key)
     */
    get<T>(key: string): T | null {
        const result = cacheService.get<T>(key, 'configs');
        if (result && result.success) return result.data;
        return null;
    }

    /**
     * @deprecated Use cacheService.set('configs', key, data, ttl)
     */
    set<T>(key: string, data: T, ttl?: number): void {
        cacheService.set(key, data, { store: 'configs', ttl: ttl || this.DEFAULT_TTL });
    }

    /**
     * @deprecated Use cacheService.has('configs', key)
     */
    has(key: string): boolean {
        return cacheService.has(key, 'configs');
    }

    /**
     * @deprecated Use cacheService.delete('configs', key)
     */
    delete(key: string): void {
        cacheService.delete(key, 'configs');
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
        appLogger.warn('⚠️ cleanup() is deprecated. UnifiedCacheService uses automatic LRU eviction.');
    }

    /**
     * @deprecated Use cacheService.getStoreStats('configs')
     */
    getStats() {
        const res = cacheService.getStoreStats('configs');
        if (res && res.success && res.data) {
            const stats = res.data as any;
            return {
                size: stats.entriesCount ?? stats.size ?? 0,
                keys: [], // LRU não expõe keys diretamente
                memoryUsage: `${((stats.memoryUsage ?? 0) / 1024).toFixed(1)} KB`,
            };
        }
        return { size: 0, keys: [], memoryUsage: '0.0 KB' };
    }
}

// Singleton instance
export const configurationCache = new ConfigurationCache();

export default configurationCache;
