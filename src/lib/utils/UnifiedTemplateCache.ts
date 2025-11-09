/**
 * ⚠️ DEPRECATED: UNIFIED TEMPLATE CACHE
 * 
 * @deprecated Este cache foi consolidado em UnifiedCacheService.
 * Use: import { unifiedCacheService } from '@/services/unified/UnifiedCacheService';
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ ANTES
 * import { unifiedCache } from '@/utils/UnifiedTemplateCache';
 * 
 * // ✅ DEPOIS
 * import { unifiedCacheService } from '@/services/unified/UnifiedCacheService';
 * ```
 * 
 * Este arquivo será removido em versão futura.
 */

import { unifiedCacheService } from '@/services/unified/UnifiedCacheService';

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
  private cache = new Map<string, any>();
  private hitCount = 0;
  private missCount = 0;

  get<T = any>(key: string): T | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      this.hitCount++;
    } else {
      this.missCount++;
    }
    return value;
  }

  set<T = any>(key: string, value: T): void {
    this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Métodos compatíveis com API antiga
  async getStepTemplate(stepNumber: number, funnelId?: string): Promise<any[]> {
    const key = funnelId ? `${funnelId}:step-${stepNumber}` : `step-${stepNumber}`;
    return this.get(key) ?? [];
  }

  invalidateStep(stepNumber: number, funnelId?: string): void {
    const key = funnelId ? `${funnelId}:step-${stepNumber}` : `step-${stepNumber}`;
    this.delete(key);
  }

  async preloadFunnel(funnelId: string): Promise<void> {
    // No-op por enquanto, pode ser implementado depois
  }

  async invalidateFunnel(funnelId: string): Promise<void> {
    const keysToDelete = this.keys().filter(k => k.startsWith(`${funnelId}:`));
    keysToDelete.forEach(k => this.delete(k));
  }

  clearFunnel(funnelId: string): void {
    const keysToDelete = this.keys().filter(k => k.startsWith(`${funnelId}:`));
    keysToDelete.forEach(k => this.delete(k));
  }

  async refreshCache(): Promise<void> {
    // No-op por enquanto
  }

  clearCache(): void {
    this.clear();
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
