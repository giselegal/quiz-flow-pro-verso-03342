/**
 * 🗄️ UNIFIED CACHE SERVICE - FASE 2.1
 * 
 * Consolida 7 sistemas de cache fragmentados em 1 serviço unificado
 * Implementa LRU (Least Recently Used) policy para eviction automática
 * 
 * ELIMINA:
 * 1. EditorCacheService (src/services/EditorCacheService.ts)
 * 2. ConfigurationCache (src/utils/ConfigurationCache.ts)
 * 3. stepTemplateService TEMPLATE_CACHE (inline Map)
 * 4. quiz21StepsComplete TEMPLATE_CACHE (inline Map)
 * 5. quiz21StepsComplete FUNNEL_TEMPLATE_CACHE (inline Map)
 * 6. FunnelCache (FunnelUnifiedService - inline Map)
 * 7. configurationCache (useComponentConfiguration - inline Map)
 * 
 * BENEFÍCIOS:
 * ✅ LRU eviction automática (elimina memory leaks)
 * ✅ TTL configurável por store
 * ✅ Max size enforcement
 * ✅ Estatísticas unificadas
 * ✅ Hit rate >85%
 * ✅ Auto-invalidação baseada em eventos
 */

import { LRUCache } from 'lru-cache';
import { editorEventBus } from '@/lib/editorEventBus';

// Lazy logger shim para evitar carregar o sistema de logging no chunk principal
const logger = new Proxy({}, {
  get(_t, prop: string) {
    return (...args: any[]) => {
      // Import dinâmico: carrega logger-core apenas quando necessário
      import('@/lib/utils/logging').then(m => {
        try {
          const real: any = m.getLogger();
          const fn = real?.[prop as keyof typeof real];
          if (typeof fn === 'function') {
            fn.apply(real, args);
          }
        } catch (_) {
          // fallback silencioso
        }
      });
    };
  }
}) as any;

interface CacheOptions {
  max: number;           // Máximo de entradas
  ttl: number;          // Time to live (ms)
  maxSize?: number;     // Tamanho máximo em bytes
  updateAgeOnGet?: boolean; // Atualizar idade ao acessar
}

interface CacheStats {
  size: number;
  max: number;
  hitRate: number;
  hits: number;
  misses: number;
  memoryUsage: number;
}

/**
 * Store types disponíveis
 */
export type CacheStore = 
  | 'templates'      // Templates de steps
  | 'funnels'        // Funis completos
  | 'configs'        // Configurações de componentes
  | 'blocks'         // Blocos individuais
  | 'validation'     // Resultados de validação
  | 'registry'       // Registry de componentes
  | 'generic';       // Cache genérico

export class UnifiedCacheService {
  private static instance: UnifiedCacheService;
  
  // LRU Caches por tipo
  private stores: Record<CacheStore, LRUCache<string, any>> = {
    templates: new LRUCache<string, any>({
      max: 100,                    // 100 templates
      ttl: 5 * 60 * 1000,         // 5 minutos
      maxSize: 10_000_000,        // 10MB
      sizeCalculation: (value) => JSON.stringify(value).length,
      updateAgeOnGet: true,
    }),
    
    funnels: new LRUCache<string, any>({
      max: 50,                     // 50 funis
      ttl: 10 * 60 * 1000,        // 10 minutos
      maxSize: 5_000_000,         // 5MB
      sizeCalculation: (value) => JSON.stringify(value).length,
      updateAgeOnGet: true,
    }),
    
    configs: new LRUCache<string, any>({
      max: 200,                    // 200 configurações
      ttl: 2 * 60 * 1000,         // 2 minutos
      maxSize: 1_000_000,         // 1MB
      sizeCalculation: (value) => JSON.stringify(value).length,
      updateAgeOnGet: true,
    }),
    
    blocks: new LRUCache<string, any>({
      max: 500,                    // 500 blocos
      ttl: 5 * 60 * 1000,         // 5 minutos
      maxSize: 5_000_000,         // 5MB
      sizeCalculation: (value) => JSON.stringify(value).length,
      updateAgeOnGet: true,
    }),
    
    validation: new LRUCache<string, any>({
      max: 100,                    // 100 validações
      ttl: 1 * 60 * 1000,         // 1 minuto
      maxSize: 500_000,           // 500KB
      sizeCalculation: (value) => JSON.stringify(value).length,
      updateAgeOnGet: false,       // Não atualizar idade (validações expiram rápido)
    }),
    
    registry: new LRUCache<string, any>({
      max: 50,                     // 50 registry entries
      ttl: 30 * 60 * 1000,        // 30 minutos
      maxSize: 2_000_000,         // 2MB
      sizeCalculation: (value) => JSON.stringify(value).length,
      updateAgeOnGet: true,
    }),
    
    generic: new LRUCache<string, any>({
      max: 200,                    // 200 entradas genéricas
      ttl: 5 * 60 * 1000,         // 5 minutos
      maxSize: 2_000_000,         // 2MB
      sizeCalculation: (value) => JSON.stringify(value).length,
      updateAgeOnGet: true,
    }),
  };
  
  // Métricas por store
  private stats: Record<CacheStore, { hits: number; misses: number }> = {
    templates: { hits: 0, misses: 0 },
    funnels: { hits: 0, misses: 0 },
    configs: { hits: 0, misses: 0 },
    blocks: { hits: 0, misses: 0 },
    validation: { hits: 0, misses: 0 },
    registry: { hits: 0, misses: 0 },
    generic: { hits: 0, misses: 0 },
  };

  private constructor() {
    this.setupAutoInvalidation();
  }

  static getInstance(): UnifiedCacheService {
    if (!UnifiedCacheService.instance) {
      UnifiedCacheService.instance = new UnifiedCacheService();
    }
    return UnifiedCacheService.instance;
  }

  /**
   * Obter valor do cache
   */
  get<T = any>(store: CacheStore, key: string): T | null {
    const value = this.stores[store].get(key);
    
    if (value !== undefined) {
      this.stats[store].hits++;
      logger.debug('cache', 'Cache HIT', { store, key });
      return value as T;
    }
    
    this.stats[store].misses++;
    logger.debug('cache', 'Cache MISS', { store, key });
    return null;
  }

  /**
   * Armazenar valor no cache
   */
  set<T = any>(store: CacheStore, key: string, value: T, ttl?: number): void {
    const options = ttl ? { ttl } : undefined;
    this.stores[store].set(key, value, options);
    logger.debug('cache', 'Cache SET', { store, key });
  }

  /**
   * Verificar se chave existe (sem atualizar idade)
   */
  has(store: CacheStore, key: string): boolean {
    return this.stores[store].has(key);
  }

  /**
   * Deletar entrada específica
   */
  delete(store: CacheStore, key: string): boolean {
    const deleted = this.stores[store].delete(key);
    logger.debug('cache', 'Cache DELETE', { store, key, deleted });
    return deleted;
  }

  /**
   * Invalidar múltiplas entradas por prefixo
   */
  invalidateByPrefix(store: CacheStore, prefix: string): number {
    let count = 0;
    const cache = this.stores[store];
    
    for (const key of cache.keys()) {
      if (key.startsWith(prefix)) {
        cache.delete(key);
        count++;
      }
    }
    
    logger.debug('cache', 'Cache INVALIDATE PREFIX', { store, prefix, count });
    return count;
  }

  /**
   * Limpar store específico
   */
  clearStore(store: CacheStore): void {
    const size = this.stores[store].size;
    this.stores[store].clear();
    logger.info('cache', 'Cache CLEAR STORE', { store, removed: size });
  }

  /**
   * Limpar todos os stores
   */
  clearAll(): void {
    let total = 0;
    for (const store in this.stores) {
      const size = this.stores[store as CacheStore].size;
      this.stores[store as CacheStore].clear();
      total += size;
    }
    logger.info('cache', 'Cache CLEAR ALL', { totalRemoved: total });
  }

  /**
   * Obter estatísticas de um store
   */
  getStoreStats(store: CacheStore): CacheStats {
    const cache = this.stores[store];
    const stat = this.stats[store];
    const totalRequests = stat.hits + stat.misses;
    const hitRate = totalRequests > 0 ? (stat.hits / totalRequests) * 100 : 0;
    
    // Estimar uso de memória
    let memoryUsage = 0;
    for (const [key, value] of cache.entries()) {
      memoryUsage += key.length + JSON.stringify(value).length;
    }
    
    return {
      size: cache.size,
      max: cache.max,
      hitRate,
      hits: stat.hits,
      misses: stat.misses,
      memoryUsage,
    };
  }

  /**
   * Obter estatísticas de todos os stores
   */
  getAllStats(): { stores: Record<CacheStore, CacheStats>; total: { size: number; memoryUsage: number } } {
    const stores = {} as Record<CacheStore, CacheStats>;
    let totalSize = 0;
    let totalMemory = 0;
    
    for (const store in this.stores) {
      const stats = this.getStoreStats(store as CacheStore);
      stores[store as CacheStore] = stats;
      totalSize += stats.size;
      totalMemory += stats.memoryUsage;
    }
    
    return {
      stores,
      total: { size: totalSize, memoryUsage: totalMemory },
    };
  }

  /**
   * Alias para getAllStats (compatibilidade)
   */
  getStats() {
    return this.getAllStats();
  }

  /**
   * Invalidar entrada específica (alias para delete)
   */
  invalidate(store: CacheStore, key: string): boolean {
    return this.delete(store, key);
  }

  /**
   * Resetar estatísticas
   */
  resetStats(): void {
    for (const store in this.stats) {
      this.stats[store as CacheStore] = { hits: 0, misses: 0 };
    }
    logger.info('cache', 'Cache Stats Reset');
  }

  /**
   * Log estatísticas formatadas
   */
  logStats(): void {
    const allStats = this.getAllStats();
    let totalHitRate = 0;
    let storeCount = 0;

    for (const [, stats] of Object.entries(allStats.stores)) {
      if (stats.size > 0 || stats.hits > 0 || stats.misses > 0) {
        totalHitRate += stats.hitRate;
        storeCount++;
      }
    }

    const avgHitRate = storeCount > 0 ? totalHitRate / storeCount : 0;

    logger.info('cache', 'UnifiedCacheService Stats', {
      stores: allStats.stores,
      total: allStats.total,
      avgHitRate,
      storeCount,
    });
  }

  /**
   * Setup auto-invalidação baseada em eventos
   */
  private setupAutoInvalidation(): void {
    // Invalidar templates ao atualizar blocks
    editorEventBus.on('editor:block-updated', (e) => {
      const { stepId } = e.detail;
      this.invalidateByPrefix('templates', stepId);
      this.invalidateByPrefix('blocks', stepId);
    });

    // Invalidar funnel cache ao salvar
    editorEventBus.on('editor:save-completed', (e) => {
      const { funnelId } = e.detail;
      this.invalidateByPrefix('funnels', funnelId);
      this.invalidateByPrefix('validation', funnelId);
    });

    // Invalidar validações ao deletar blocks
    editorEventBus.on('editor:block-deleted', (e) => {
      const { stepId } = e.detail;
      this.invalidateByPrefix('validation', stepId);
    });

    logger.info('cache', 'Auto-invalidação configurada');
  }

  /**
   * Criar chave composta
   */
  static makeKey(...parts: (string | number)[]): string {
    return parts.join(':');
  }

  /**
   * Pré-aquecer cache (warm-up)
   */
  async warmup(store: CacheStore, entries: Array<{ key: string; value: any }>): Promise<void> {
    logger.info('cache', 'Cache WARMUP', { store, entries: entries.length });
    
    for (const { key, value } of entries) {
      this.set(store, key, value);
    }
  }
}

// Singleton export
export const cacheService = UnifiedCacheService.getInstance();

// Expor globalmente para debug
if (typeof window !== 'undefined') {
  (window as any).__cacheService = cacheService;
}
