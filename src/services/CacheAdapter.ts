/**
 * 🎯 CACHE ADAPTER - FASE 4
 * 
 * Unifica acesso a múltiplos sistemas de cache em um único ponto
 * Depreca fragmentação e inconsistências entre caches
 * 
 * CONSOLIDAÇÃO:
 * - UnifiedTemplateCache (primário)
 * - TemplateCache → redirect
 * - TemplateLoader.cache → redirect
 * - EditorCacheService → redirect
 */

import { unifiedCache } from '@/utils/UnifiedTemplateCache';

type CacheValue = any;

class CacheAdapterClass {
  private static instance: CacheAdapterClass | null = null;
  private metrics = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0
  };

  private constructor() {
    console.log('🎯 [CacheAdapter] Singleton iniciado - unificando caches');
  }

  static getInstance(): CacheAdapterClass {
    if (!CacheAdapterClass.instance) {
      CacheAdapterClass.instance = new CacheAdapterClass();
    }
    return CacheAdapterClass.instance;
  }

  /**
   * GET - obtém valor do cache unificado
   */
  get<T = CacheValue>(key: string): T | null {
    const value = unifiedCache.get(key);
    
    if (value !== null) {
      this.metrics.hits++;
      console.log(`✅ [CacheAdapter] HIT: ${key}`);
    } else {
      this.metrics.misses++;
      console.log(`❌ [CacheAdapter] MISS: ${key}`);
    }

    return value as T;
  }

  /**
   * SET - armazena valor no cache unificado
   */
  set(key: string, value: CacheValue): void {
    unifiedCache.set(key, value);
    this.metrics.sets++;
    console.log(`💾 [CacheAdapter] SET: ${key}`);
  }

  /**
   * DELETE - remove chave do cache
   */
  delete(key: string): void {
    unifiedCache.delete(key);
    this.metrics.deletes++;
    console.log(`🗑️ [CacheAdapter] DELETE: ${key}`);
  }

  /**
   * HAS - verifica existência de chave
   */
  has(key: string): boolean {
    return unifiedCache.has(key);
  }

  /**
   * CLEAR - limpa todo o cache
   */
  clear(): void {
    unifiedCache.clear();
    console.log('🗑️ [CacheAdapter] Cache unificado limpo');
  }

  /**
   * METRICS - retorna métricas de uso
   */
  getMetrics() {
    const hitRate = this.metrics.hits + this.metrics.misses > 0
      ? (this.metrics.hits / (this.metrics.hits + this.metrics.misses) * 100).toFixed(2)
      : '0.00';

    return {
      ...this.metrics,
      hitRate: `${hitRate}%`,
      cacheSize: unifiedCache.keys().length
    };
  }

  /**
   * RESET METRICS - reseta contadores
   */
  resetMetrics(): void {
    this.metrics = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    };
    console.log('📊 [CacheAdapter] Métricas resetadas');
  }
}

// Singleton export
export const CacheAdapter = CacheAdapterClass.getInstance();

// Aliases para compatibilidade com código legado
export const getFromCache = <T = any>(key: string): T | null => CacheAdapter.get<T>(key);
export const setToCache = (key: string, value: any): void => CacheAdapter.set(key, value);
export const deleteFromCache = (key: string): void => CacheAdapter.delete(key);
export const clearAllCache = (): void => CacheAdapter.clear();
export const hasCacheKey = (key: string): boolean => CacheAdapter.has(key);
