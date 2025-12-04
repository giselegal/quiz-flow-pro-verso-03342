/**
 * ⚠️ DEPRECATED: HybridCacheStrategy
 * 
 * @deprecated Este cache foi consolidado em MultiLayerCacheStrategy.
 * Use: import { multiLayerCache } from '@/services/core/MultiLayerCacheStrategy';
 * 
 * Este arquivo agora redireciona para MultiLayerCacheStrategy para manter
 * compatibilidade com código existente.
 */

import { multiLayerCache } from '@/services/core/MultiLayerCacheStrategy';
import type { CacheStore } from '@/services/canonical/CacheService';

export type CacheOptions = {
  memoryStore?: string;
  diskStore?: string;
  ttl?: number;
};

/**
 * @deprecated Use multiLayerCache from '@/services/core/MultiLayerCacheStrategy'
 */
export class HybridCacheStrategy {
  private static instance: HybridCacheStrategy;

  private constructor() {}

  static getInstance(): HybridCacheStrategy {
    if (!HybridCacheStrategy.instance) {
      HybridCacheStrategy.instance = new HybridCacheStrategy();
    }
    return HybridCacheStrategy.instance;
  }

  async get<T = unknown>(key: string, opts?: CacheOptions): Promise<T | null> {
    const store = (opts?.memoryStore || 'generic') as CacheStore;
    return multiLayerCache.get<T>(store, key);
  }

  async set<T = unknown>(key: string, value: T, opts?: CacheOptions): Promise<void> {
    const store = (opts?.memoryStore || 'generic') as CacheStore;
    const ttl = opts?.ttl ?? 10 * 60 * 1000;
    await multiLayerCache.set(store, key, value, ttl);
  }

  async del(key: string, opts?: CacheOptions): Promise<void> {
    const store = (opts?.memoryStore || 'generic') as CacheStore;
    await multiLayerCache.delete(store, key);
  }

  async invalidate(key: string, opts?: CacheOptions): Promise<void> {
    return this.del(key, opts);
  }

  clear(storeName?: string): void {
    if (storeName) {
      multiLayerCache.clearStore(storeName as CacheStore);
    } else {
      multiLayerCache.clearAll();
    }
  }
}

/** @deprecated Use multiLayerCache from '@/services/core/MultiLayerCacheStrategy' */
export const hybridCacheStrategy = HybridCacheStrategy.getInstance();
