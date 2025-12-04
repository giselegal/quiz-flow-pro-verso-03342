/**
 * ⚠️ DEPRECATED: HYBRID CACHE STRATEGY
 * 
 * @deprecated Este cache foi parcialmente substituído por MultiLayerCacheStrategy.
 * Use: import { multiLayerCache } from '@/services/core/MultiLayerCacheStrategy';
 * 
 * MultiLayerCacheStrategy oferece 3 camadas (L1 Memory, L2 SessionStorage, L3 IndexedDB)
 * enquanto HybridCacheStrategy oferece apenas 2 (L1 Memory, L2 IndexedDB).
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ ANTES
 * import { hybridCache } from '@/services/core/HybridCacheStrategy';
 * await hybridCache.set('key', value, { memoryStore: 'templates' });
 * 
 * // ✅ DEPOIS
 * import { multiLayerCache } from '@/services/core/MultiLayerCacheStrategy';
 * await multiLayerCache.set('templates', 'key', value, 600000);
 * ```
 * 
 * Mantido para compatibilidade. Use MultiLayerCacheStrategy para novos códigos.
 */

import { UnifiedCacheService } from '../unified/UnifiedCacheService';
import type { CacheStore } from '../canonical/CacheService';
import { indexedDBCache } from './IndexedDBCache';
import { performanceProfiler } from '@/lib/utils/performanceProfiler';
import { appLogger } from '@/lib/utils/logger';

interface HybridCacheOptions {
  /**
   * TTL em milliseconds (default: 10 minutos)
   */
  ttl?: number;

  /**
   * Store L1 (memory)
   */
  memoryStore?: CacheStore;

  /**
   * Store L2 (disk)
   */
  diskStore?: string;

  /**
   * Persistir em disk automaticamente (default: true)
   */
  persistToDisk?: boolean;

  /**
   * Promover L2 hits para L1 (default: true)
   */
  promoteOnHit?: boolean;
}

interface CacheMetrics {
  l1Hits: number;
  l1Misses: number;
  l2Hits: number;
  l2Misses: number;
  writes: number;
  errors: number;
}

export class HybridCacheStrategy {
  private static instance: HybridCacheStrategy;
  private metrics: CacheMetrics = {
    l1Hits: 0,
    l1Misses: 0,
    l2Hits: 0,
    l2Misses: 0,
    writes: 0,
    errors: 0,
  };

  private constructor() {}

  static getInstance(): HybridCacheStrategy {
    if (!HybridCacheStrategy.instance) {
      HybridCacheStrategy.instance = new HybridCacheStrategy();
    }
    return HybridCacheStrategy.instance;
  }

  /**
   * Busca valor em cache híbrido (L1 → L2)
   */
  async get<T>(
    key: string,
    options: HybridCacheOptions = {}
  ): Promise<T | null> {
    const {
      memoryStore = 'generic',
      diskStore = 'funnels',
      promoteOnHit = true,
    } = options;

    const cache = UnifiedCacheService.getInstance();

    performanceProfiler.start(`hybridCache.get:${key}`, 'cache');

    try {
      // L1: Memory cache
      const l1Value = cache.get<T>(memoryStore, key);
      if (typeof l1Value !== 'undefined' && l1Value !== null) {
        this.metrics.l1Hits++;
        performanceProfiler.end(`hybridCache.get:${key}`);
        appLogger.debug(`💾 [L1 HIT] ${memoryStore}:${key}`);
        return l1Value as T;
      }

      this.metrics.l1Misses++;
      appLogger.debug(`💾 [L1 MISS] ${memoryStore}:${key} → checking L2`);

      // L2: IndexedDB
      const l2Value = await (indexedDBCache as any).get(diskStore, key) as T | null;
      if (typeof l2Value !== 'undefined' && l2Value !== null) {
        this.metrics.l2Hits++;
        appLogger.debug(`💾 [L2 HIT] ${diskStore}:${key}`);

        // Promover para L1
        if (promoteOnHit) {
          cache.set(memoryStore, key, l2Value);
          appLogger.debug(`💾 [L2→L1] Promoted ${key} to memory`);
        }

        performanceProfiler.end(`hybridCache.get:${key}`);
        return l2Value;
      }

      this.metrics.l2Misses++;
      appLogger.debug(`💾 [L2 MISS] ${diskStore}:${key}`);
      performanceProfiler.end(`hybridCache.get:${key}`);
      return null;
    } catch (error) {
      this.metrics.errors++;
      appLogger.error('[HybridCache] Get error:', error);
      performanceProfiler.end(`hybridCache.get:${key}`);
      return null;
    }
  }

  /**
   * Armazena valor em ambas as camadas
   */
  async set<T>(
    key: string,
    value: T,
    options: HybridCacheOptions = {}
  ): Promise<boolean> {
    const {
      ttl = 10 * 60 * 1000, // 10 minutos
      memoryStore = 'generic',
      diskStore = 'funnels',
      persistToDisk = true,
    } = options;

    performanceProfiler.start(`hybridCache.set:${key}`, 'cache');

    try {
      // L1: Memory (síncrono, rápido)
      const cache = UnifiedCacheService.getInstance();
      cache.set(memoryStore, key, value);
      appLogger.debug(`💾 [L1 SET] ${memoryStore}:${key}`);

      // L2: IndexedDB (assíncrono, persistente)
      if (persistToDisk) {
        await indexedDBCache.set(diskStore, key, value, ttl);
        appLogger.debug(`💾 [L2 SET] ${diskStore}:${key} (TTL: ${ttl}ms)`);
      }

      this.metrics.writes++;
      performanceProfiler.end(`hybridCache.set:${key}`);
      return true;
    } catch (error) {
      this.metrics.errors++;
      appLogger.error('[HybridCache] Set error:', error);
      performanceProfiler.end(`hybridCache.set:${key}`);
      return false;
    }
  }

  /**
   * Remove de ambas as camadas
   */
  async delete(
    key: string,
    options: HybridCacheOptions = {}
  ): Promise<boolean> {
    const {
      memoryStore = 'generic',
      diskStore = 'funnels',
    } = options;

    try {
      // L1
      const cache = UnifiedCacheService.getInstance();
      cache.delete(memoryStore, key);
      appLogger.debug(`💾 [L1 DEL] ${memoryStore}:${key}`);

      // L2
      await indexedDBCache.delete(diskStore, key);
      appLogger.debug(`💾 [L2 DEL] ${diskStore}:${key}`);

      return true;
    } catch (error) {
      this.metrics.errors++;
      appLogger.error('[HybridCache] Delete error:', error);
      return false;
    }
  }

  /**
   * Invalidate cache para uma chave específica
   */
  async invalidate(key: string, options: HybridCacheOptions = {}): Promise<void> {
    await this.delete(key, options);
  }

  /**
   * Pré-aquece cache carregando de L2 para L1
   */
  async warmup(
    keys: string[],
    options: HybridCacheOptions = {}
  ): Promise<number> {
    const {
      memoryStore = 'generic',
      diskStore = 'funnels',
    } = options;

    let warmedUp = 0;

    const cache = UnifiedCacheService.getInstance();
    
    for (const key of keys) {
      try {
        const value = await indexedDBCache.get(diskStore, key);
        if (value !== null) {
          cache.set(memoryStore, key, value);
          warmedUp++;
        }
      } catch (error) {
        appLogger.error(`[HybridCache] Warmup failed for ${key}:`, error);
      }
    }

    appLogger.debug(`🔥 [HybridCache] Warmed up ${warmedUp}/${keys.length} entries`);
    return warmedUp;
  }

  /**
   * Sincroniza L1 → L2 (persist dirty entries)
   */
  async sync(
    memoryStore: CacheStore = 'generic',
    diskStore: string = 'funnels'
  ): Promise<void> {
    // Implementação futura: sincronizar entradas modificadas
    appLogger.debug('[HybridCache] Sync not yet implemented');
  }

  /**
   * Limpa ambas as camadas
   */
  async clear(options: HybridCacheOptions = {}): Promise<void> {
    const {
      memoryStore = 'generic',
      diskStore = 'funnels',
    } = options;

    const cache = UnifiedCacheService.getInstance();
    // TODO: implementar cache.clear()
    await indexedDBCache.clear(diskStore);
    appLogger.debug(`🧹 [HybridCache] Cleared ${memoryStore} + ${diskStore}`);
  }

  /**
   * Estatísticas consolidadas
   */
  getMetrics(): CacheMetrics & {
    l1HitRate: number;
    l2HitRate: number;
    totalHitRate: number;
  } {
    const l1Total = this.metrics.l1Hits + this.metrics.l1Misses;
    const l2Total = this.metrics.l2Hits + this.metrics.l2Misses;
    const totalHits = this.metrics.l1Hits + this.metrics.l2Hits;
    const totalRequests = l1Total + l2Total;

    return {
      ...this.metrics,
      l1HitRate: l1Total > 0 ? (this.metrics.l1Hits / l1Total) * 100 : 0,
      l2HitRate: l2Total > 0 ? (this.metrics.l2Hits / l2Total) * 100 : 0,
      totalHitRate: totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0,
    };
  }

  /**
   * Reseta métricas
   */
  resetMetrics(): void {
    this.metrics = {
      l1Hits: 0,
      l1Misses: 0,
      l2Hits: 0,
      l2Misses: 0,
      writes: 0,
      errors: 0,
    };
  }

  /**
   * Relatório de performance
   */
  generateReport(): string {
    const metrics = this.getMetrics();

    return `
📊 HYBRID CACHE METRICS
${'='.repeat(50)}

L1 (Memory):
  Hits: ${metrics.l1Hits}
  Misses: ${metrics.l1Misses}
  Hit Rate: ${metrics.l1HitRate.toFixed(2)}%

L2 (IndexedDB):
  Hits: ${metrics.l2Hits}
  Misses: ${metrics.l2Misses}
  Hit Rate: ${metrics.l2HitRate.toFixed(2)}%

Overall:
  Total Writes: ${metrics.writes}
  Total Hit Rate: ${metrics.totalHitRate.toFixed(2)}%
  Errors: ${metrics.errors}
    `.trim();
  }
}

// Singleton instance
export const hybridCache = HybridCacheStrategy.getInstance();

// Expor para debugging
if (typeof window !== 'undefined') {
  (window as any).__hybridCache = hybridCache;
}

export default hybridCache;
