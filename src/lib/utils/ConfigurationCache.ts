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
import { multiLayerCache } from '@/services/core/MultiLayerCacheStrategy';
import type { CacheStore } from '@/services/canonical/CacheService';
const STORE: CacheStore = 'configs';

class ConfigurationCache {
    private ttl = 2 * 60 * 1000; // 2 minutos
    private warnDeprecated = true;

    constructor() {
        if (typeof window !== 'undefined' && this.warnDeprecated) {
            appLogger.warn('⚠️ ConfigurationCache is deprecated. Use MultiLayerCacheStrategy (store: configs).');
        }
    }

    async set<T>(key: string, value: T, ttl?: number) {
        try {
            await multiLayerCache.set(STORE, key, value, ttl ?? this.ttl);
            return true;
        } catch (e) {
            appLogger.warn('ConfigurationCache.set failed', { data: [e] });
            return false;
        }
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const v = await multiLayerCache.get<T>(STORE, key);
            return v ?? null;
        } catch (e) {
            appLogger.warn('ConfigurationCache.get failed', { data: [e] });
            return null;
        }
    }

    async delete(key: string) {
        try {
            await multiLayerCache.delete(STORE, key);
            return true;
        } catch (e) {
            return false;
        }
    }

    async clear() {
        try {
            await multiLayerCache.clearStore(STORE);
            return true;
        } catch (e) {
            return false;
        }
    }

    getStats() {
        // Delegar para metrics do multiLayerCache L2
        const m = multiLayerCache.getMetrics();
        return { items: m.l2Items, estimatedSize: m.l2Size };
    }
}
export default configurationCache;
