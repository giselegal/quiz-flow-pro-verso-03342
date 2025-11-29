/**
 * ⚠️ DEPRECATED: UNIFIED TEMPLATE CACHE
 * 
 * @deprecated Este cache foi consolidado em UnifiedCacheService.
 * Use: import { unifiedCacheService } from '@/services/unified/UnifiedCacheService';
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ ANTES
 * import { unifiedCache } from '@/lib/utils/UnifiedTemplateCache';
 * 
 * // ✅ DEPOIS
 * import { unifiedCacheService } from '@/services/unified/UnifiedCacheService';
 * ```
 * 
 * Este arquivo será removido em versão futura.
 */

import { unifiedCacheService } from '@/services/unified/UnifiedCacheService';
import { multiLayerCache } from '@/services/core/MultiLayerCacheStrategy';
import type { CacheStore } from '@/services/canonical/CacheService';

export interface CacheStats {
  totalEntries: number;
  memoryUsage: number;
  hitCount: number;
  missCount: number;
}

export interface CacheConfig {
  maxEntries?: number;
  ttl?: number;
}

/**
 * @deprecated Use UnifiedCacheService
 */
export class UnifiedTemplateCache {
  private store: CacheStore = 'templates';
  private hitCount = 0;
  private missCount = 0;

  async get<T = any>(key: string): Promise<T | undefined> {
    const value = await multiLayerCache.get<T>(this.store, key);
    if (typeof value !== 'undefined' && value !== null) {
      this.hitCount++;
      return value as T;
    }
    this.missCount++;
    return undefined;
  }

  async set<T = any>(key: string, value: T): Promise<void> {
    await multiLayerCache.set(this.store, key, value, 10 * 60 * 1000);
  }

  async has(key: string): Promise<boolean> {
    return (await multiLayerCache.get(this.store, key)) != null;
  }

  async delete(key: string): Promise<boolean> {
    await multiLayerCache.delete(this.store, key);
    return true;
  }

  async clear(): Promise<void> {
    await multiLayerCache.clearStore(this.store);
  }

  keys(): string[] {
    // Não suportado diretamente; manter no-op para compat.
    return [];
  }

  // Métodos compatíveis com API antiga
  async getStepTemplate(stepNumber: number, funnelId?: string): Promise<any[]> {
    const key = funnelId ? `${funnelId}:step-${stepNumber}` : `step-${stepNumber}`;
    return (await this.get(key)) ?? [];
  }

  async invalidateStep(stepNumber: number, funnelId?: string): Promise<void> {
    const key = funnelId ? `${funnelId}:step-${stepNumber}` : `step-${stepNumber}`;
    await this.delete(key);
  }

  async preloadFunnel(funnelId: string): Promise<void> {
    // No-op por enquanto, pode ser implementado depois
  }

  async invalidateFunnel(funnelId: string): Promise<void> {
    const keysToDelete = this.keys().filter(k => k.startsWith(`${funnelId}:`));
    keysToDelete.forEach(k => this.delete(k));
  }

  async clearFunnel(funnelId: string): Promise<void> {
    // Sem listagem de chaves; limpar store atende cenário geral
    await this.clear();
  }

  async refreshCache(): Promise<void> {
    // No-op por enquanto
  }

  async clearCache(): Promise<void> {
    await this.clear();
  }

  getStats(): CacheStats {
    const stats = unifiedCacheService.getStats();
    return {
      totalEntries: stats.totalEntries,
      memoryUsage: stats.totalSize,
      hitCount: stats.hitCount,
      missCount: stats.missCount,
    };
  }

  getHitRate(): number {
    return unifiedCacheService.getHitRate();
  }
}

/** @deprecated Use unifiedCacheService from '@/services/unified/UnifiedCacheService' */
export const unifiedCache = new UnifiedTemplateCache();
