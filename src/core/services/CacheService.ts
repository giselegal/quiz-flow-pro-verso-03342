/**
 * 🗄️ CACHE SERVICE - Canonical Facade (SINGLE SOURCE OF TRUTH)
 * 
 * ⭐ This is the ONLY canonical service for cache operations in the system.
 * All cache operations MUST go through this service.
 * 
 * Canonical service that exposes a simplified API for unified caching.
 * Abstracts the complexity of UnifiedCacheService for consumers.
 * 
 * ARCHITECTURE:
 * - Provides multi-store caching (generic, templates, funnels, steps, blocks)
 * - Integrates with React Query for server-side cache
 * - Supports localStorage and sessionStorage backends
 * - Implements TTL and cache invalidation strategies
 * 
 * @version 4.0.0 - Phase 4 Finalized
 * @status PRODUCTION-READY (Canonical Only)
 */

import { BaseCanonicalService, ServiceOptions, ServiceResult } from './types';
import { unifiedCache } from '@/services/unified/UnifiedCacheService';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Cache store types
 */
export type CacheStore = 'generic' | 'templates' | 'funnels' | 'steps' | 'blocks' | 'configs' | 'validation' | 'registry';

/**
 * Cache statistics por categoria
 */
export interface CacheStats {
  hitRate: number;
  totalHits: number;
  totalMisses: number;
  memoryUsage: number;
  entriesCount: number;
}

/**
 * Cache options para operações individuais
 */
export interface CacheSetOptions {
  /**
   * Time to live em milissegundos
   */
  ttl?: number;

  /**
   * Store específico (default: 'generic')
   */
  store?: CacheStore;
}

/**
 * Cache Service - Facade simplificado para UnifiedCacheService
 */
export class CacheService extends BaseCanonicalService {
  private static instance: CacheService;

  private constructor(options?: ServiceOptions) {
    super('CacheService', '1.0.0', options);
  }

  static getInstance(options?: ServiceOptions): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService(options);
    }
    return CacheService.instance;
  }

  protected async onInitialize(): Promise<void> {
    // UnifiedCacheService já é singleton e auto-inicializa
    this.log('CacheService facade initialized');
  }

  protected async onDispose(): Promise<void> {
    // Não destruir UnifiedCacheService (pode estar em uso por outros)
    this.log('CacheService facade disposed (underlying cache preserved)');
  }

  // ==================== PUBLIC API ====================

  /**
   * Armazenar valor no cache
   * 
   * @example
   * ```typescript
   * cacheService.set('user-123', userData, { ttl: 5 * 60 * 1000 });
   * ```
   */
  set<T = any>(
    key: string,
    value: T,
    options: CacheSetOptions = {},
  ): ServiceResult<void> {
    try {
      const store = options.store || 'generic';
      unifiedCache.set(store, key, value, options.ttl);
      return this.createResult(undefined);
    } catch (error) {
      this.error('set failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Recuperar valor do cache
   * 
   * @example
   * ```typescript
   * const result = cacheService.get<UserData>('user-123');
   * if (result.success) {
   *   console.log(result.data);
   * }
   * ```
   */
  get<T = any>(
    key: string,
    store: CacheStore = 'generic',
  ): ServiceResult<T | null> {
    try {
      const value = unifiedCache.get<T>(store, key);
      const normalized = typeof value === 'undefined' ? null : value;
      return this.createResult(normalized);
    } catch (error) {
      this.error('get failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Verificar se chave existe no cache
   */
  has(key: string, store: CacheStore = 'generic'): boolean {
    try {
      return unifiedCache.has(store, key);
    } catch (error) {
      this.error('has failed:', error);
      return false;
    }
  }

  /**
   * Deletar entrada do cache
   */
  delete(key: string, store: CacheStore = 'generic'): ServiceResult<boolean> {
    try {
      const deleted = unifiedCache.delete(store, key);
      return this.createResult(deleted);
    } catch (error) {
      this.error('delete failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Invalidar múltiplas entradas por prefixo
   * 
   * @example
   * ```typescript
   * // Invalidar todos os templates do step-01
   * cacheService.invalidateByPrefix('step-01', 'templates');
   * ```
   */
  invalidateByPrefix(
    prefix: string,
    store: CacheStore = 'generic',
  ): ServiceResult<number> {
    try {
      const count = unifiedCache.invalidateByPrefix(store, prefix);
      return this.createResult(count);
    } catch (error) {
      this.error('invalidateByPrefix failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Limpar store específico
   */
  clearStore(store: CacheStore): ServiceResult<void> {
    try {
      unifiedCache.clearStore(store);
      return this.createResult(undefined);
    } catch (error) {
      this.error('clearStore failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Limpar todos os stores
   */
  clearAll(): ServiceResult<void> {
    try {
      unifiedCache.clearAll();
      return this.createResult(undefined);
    } catch (error) {
      this.error('clearAll failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Obter estatísticas de um store específico
   */
  getStoreStats(store: CacheStore): ServiceResult<CacheStats> {
    try {
      const stats = unifiedCache.getStoreStats(store);
      return this.createResult({
        hitRate: stats.hitRate,
        totalHits: stats.hits,
        totalMisses: stats.misses,
        memoryUsage: stats.memoryUsage,
        entriesCount: stats.size,
      });
    } catch (error) {
      this.error('getStoreStats failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Obter estatísticas globais de todos os stores
   */
  getAllStats(): ServiceResult<Record<CacheStore, CacheStats>> {
    try {
      const allStats = unifiedCache.getAllStats();
      const result: Record<string, CacheStats> = {};

      for (const [store, stats] of Object.entries(allStats.stores)) {
        result[store] = {
          hitRate: stats.hitRate,
          totalHits: stats.hits,
          totalMisses: stats.misses,
          memoryUsage: stats.memoryUsage,
          entriesCount: stats.size,
        };
      }

      return this.createResult(result as Record<CacheStore, CacheStats>);
    } catch (error) {
      this.error('getAllStats failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Log estatísticas formatadas no console
   */
  logStats(): void {
    unifiedCache.logStats();
  }

  /**
   * Resetar estatísticas (útil para testes)
   */
  resetStats(): ServiceResult<void> {
    try {
      unifiedCache.resetStats();
      return this.createResult(undefined);
    } catch (error) {
      this.error('resetStats failed:', error);
      return this.createError(error as Error);
    }
  }

  // ==================== SPECIALIZED METHODS ====================

  /**
   * Cache para templates (TTL padrão: 10min)
   */
  templates = {
    set: <T,>(key: string, value: T, ttl = 10 * 60 * 1000) =>
      this.set(key, value, { store: 'templates', ttl }),

    get: <T,>(key: string) =>
      this.get<T>(key, 'templates'),

    invalidate: (key: string) =>
      this.delete(key, 'templates'),

    invalidateStep: (stepId: string) =>
      this.invalidateByPrefix(stepId, 'templates'),
  };

  /**
   * Cache para funnels (TTL padrão: 10min)
   */
  funnels = {
    set: <T,>(key: string, value: T, ttl = 10 * 60 * 1000) =>
      this.set(key, value, { store: 'funnels', ttl }),

    get: <T,>(key: string) =>
      this.get<T>(key, 'funnels'),

    invalidate: (funnelId: string) =>
      this.invalidateByPrefix(funnelId, 'funnels'),
  };

  /**
   * Cache para configurações (TTL padrão: 2min)
   */
  configs = {
    set: <T,>(key: string, value: T, ttl = 2 * 60 * 1000) =>
      this.set(key, value, { store: 'configs', ttl }),

    get: <T,>(key: string) =>
      this.get<T>(key, 'configs'),

    invalidate: (key: string) =>
      this.delete(key, 'configs'),
  };

  /**
   * Cache para blocks (TTL padrão: 5min)
   */
  blocks = {
    set: <T,>(key: string, value: T, ttl = 5 * 60 * 1000) =>
      this.set(key, value, { store: 'blocks', ttl }),

    get: <T,>(key: string) =>
      this.get<T>(key, 'blocks'),

    invalidate: (blockId: string) =>
      this.delete(blockId, 'blocks'),
  };

  // ==================== HEALTH CHECK ====================

  async healthCheck(): Promise<boolean> {
    try {
      // Test basic operations
      const testKey = '__health_check__';
      const testValue = { timestamp: Date.now() };

      this.set(testKey, testValue, { ttl: 1000 });
      const result = this.get(testKey);
      this.delete(testKey);

      return result.success && result.data !== null;
    } catch (error) {
      appLogger.warn('[CacheService] Health check falhou:', { data: [error] });
      return false;
    }
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Instância singleton do CacheService
 * 
 * @example
 * ```typescript
 * import { cacheService } from '@/services/canonical/CacheService';
 * 
 * // Uso básico
 * cacheService.set('key', value);
 * const result = cacheService.get('key');
 * 
 * // Uso especializado
 * cacheService.templates.set('step-01', templateData);
 * const template = cacheService.templates.get('step-01');
 * 
 * // Estatísticas
 * cacheService.logStats();
 * ```
 */
export const cacheService = CacheService.getInstance({ debug: false });

// Expor no window para debug
if (typeof window !== 'undefined') {
  (window as any).__canonicalCacheService = cacheService;
}
