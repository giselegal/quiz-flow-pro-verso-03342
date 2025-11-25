/**
 * 🎯 UNIFIED CACHE SERVICE - FASE 2: SINGLE SOURCE OF TRUTH
 * 
 * Cache único e consolidado que substitui TODOS os sistemas de cache:
 * ❌ UnifiedTemplateCache
 * ❌ IntelligentCacheSystem
 * ❌ AdvancedCache
 * ❌ HybridCacheStrategy
 * ❌ MultiLayerCacheStrategy
 * ❌ Cache do SuperUnifiedProvider
 * ✅ UnifiedCacheService (ÚNICO)
 * 
 * CARACTERÍSTICAS:
 * - TTL inteligente por tipo de dado
 * - Invalidação em cascata
 * - Memory-efficient (LRU eviction)
 * - Event-driven sync
 * - Performance monitoring
 * 
 * @version 1.0.0 - Fase 2 Consolidação
 * @date 2025-01-17
 */

import { appLogger } from '@/lib/utils/logger';

// ============================================================================
// TYPES
// ============================================================================

export type CacheEntryType = 
  | 'template' 
  | 'step' 
  | 'block' 
  | 'funnel' 
  | 'component' 
  | 'user'
  | 'preview'
  | 'metadata';

export interface CacheEntry<T = any> {
  key: string;
  type: CacheEntryType;
  data: T;
  createdAt: number;
  expiresAt: number;
  accessCount: number;
  lastAccessed: number;
  size: number; // bytes
}

export interface CacheStats {
  totalEntries: number;
  totalSize: number; // bytes
  hitCount: number;
  missCount: number;
  hitRate: number;
  evictionCount: number;
  byType: Record<CacheEntryType, {
    count: number;
    size: number;
  }>;
}

export interface CacheConfig {
  maxEntries?: number;
  maxSize?: number; // bytes (default: 50MB)
  defaultTTL?: number; // ms (default: 10min)
  enableMetrics?: boolean;
}

// ============================================================================
// TTL STRATEGY (Inteligente por tipo)
// ============================================================================

const TTL_BY_TYPE: Record<CacheEntryType, number> = {
  template: 10 * 60 * 1000,    // 10min (templates raramente mudam)
  step: Infinity,               // Nunca expira (dados do usuário)
  block: Infinity,              // Nunca expira (dados do usuário)
  funnel: Infinity,             // Nunca expira (dados do usuário)
  user: 5 * 60 * 1000,         // 5min (info do usuário pode mudar)
  preview: 30 * 1000,           // 30s (preview muda frequentemente)
  metadata: 2 * 60 * 1000,      // 2min (metadata intermediária)
  component: 15 * 60 * 1000,    // 15min (componentes estáticos)
};

// ============================================================================
// EVENT BUS (Para sincronização)
// ============================================================================

type CacheEventType = 'set' | 'delete' | 'clear' | 'invalidate' | 'evict';

interface CacheEvent {
  type: CacheEventType;
  key?: string;
  pattern?: string;
  timestamp: number;
}

type CacheEventListener = (event: CacheEvent) => void;

class CacheEventBus {
  private listeners: CacheEventListener[] = [];

  subscribe(listener: CacheEventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  emit(event: CacheEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        appLogger.error('CacheEventBus listener error:', error);
      }
    });
  }
}

// ============================================================================
// UNIFIED CACHE SERVICE
// ============================================================================

export class UnifiedCacheService {
  private static instance: UnifiedCacheService;
  private cache = new Map<string, CacheEntry>();
  private eventBus = new CacheEventBus();
  
  // Metrics
  private hitCount = 0;
  private missCount = 0;
  private evictionCount = 0;
  
  // Config
  private config: Required<CacheConfig>;

  private constructor(config?: CacheConfig) {
    this.config = {
      maxEntries: config?.maxEntries ?? 1000,
      maxSize: config?.maxSize ?? 50 * 1024 * 1024, // 50MB
      defaultTTL: config?.defaultTTL ?? 10 * 60 * 1000, // 10min
      enableMetrics: config?.enableMetrics ?? true,
    };

    // Limpar entradas expiradas a cada 1min
    if (typeof window !== 'undefined') {
      setInterval(() => this.cleanExpired(), 60 * 1000);
    }
  }

  static getInstance(config?: CacheConfig): UnifiedCacheService {
    if (!UnifiedCacheService.instance) {
      UnifiedCacheService.instance = new UnifiedCacheService(config);
    }
    return UnifiedCacheService.instance;
  }

  // ============================================================================
  // CORE OPERATIONS
  // ============================================================================

  private getByKey<T = any>(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      this.missCount++;
      return undefined;
    }

    // Verificar expiração
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.missCount++;
      return undefined;
    }

    // Atualizar métricas de acesso
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.hitCount++;

    return entry.data as T;
  }

  // Overloads: allow both get(key) and get(store, key) for backwards compat
  get<T = any>(key: string): T | undefined;
  get<T = any>(store: string, key: string): T | undefined;
  get<T = any>(arg1: string, arg2?: string): T | undefined {
    if (typeof arg2 === 'string') {
      return this.getByKey<T>(this.composeKey(arg1, arg2));
    }
    return this.getByKey<T>(arg1);
  }

  private setByKey<T = any>(key: string, data: T, type: CacheEntryType = 'metadata', ttl?: number): void {
    const size = this.calculateSize(data);
    const now = Date.now();
    const effectiveTTL = ttl ?? TTL_BY_TYPE[type] ?? this.config.defaultTTL;

    const entry: CacheEntry<T> = {
      key,
      type,
      data,
      createdAt: now,
      expiresAt: effectiveTTL === Infinity ? Infinity : now + effectiveTTL,
      accessCount: 0,
      lastAccessed: now,
      size,
    };

    // Evict se necessário (LRU)
    if (this.shouldEvict(size)) {
      this.evictLRU(size);
    }

    this.cache.set(key, entry);

    // Emitir evento
    this.eventBus.emit({
      type: 'set',
      key,
      timestamp: now,
    });
  }

  // Overloads: allow both set(key, data, type?, ttl?) and set(store, key, data, ttl?) for legacy callers
  set<T = any>(key: string, data: T, type?: CacheEntryType, ttl?: number): void;
  set<T = any>(store: string, key: string, data: T, ttl?: number): void;
  set<T = any>(arg1: string, arg2: any, arg3?: any, arg4?: any): void {
    // If called with (store, key, data, ttl)
    if (arguments.length >= 3 && typeof arg3 !== 'undefined' && typeof arg2 === 'string' && arguments.length <= 4) {
      // store, key, data, ttl?
      const store = arg1 as string;
      const key = arg2 as string;
      const data = arg3 as T;
      const ttl = arg4 as number | undefined;
      return this.setByKey<T>(this.composeKey(store, key), data, this.mapStoreToType(store), ttl);
    }

    // Fallback to original signature: (key, data, type?, ttl?)
    const key = arg1 as string;
    const data = arg2 as T;
    const type = arg3 as CacheEntryType | undefined;
    const ttl = arg4 as number | undefined;
    return this.setByKey<T>(key, data, type ?? 'metadata', ttl);
  }

  // has: support has(key) and has(store, key)
  has(key: string): boolean;
  has(store: string, key: string): boolean;
  has(arg1: string, arg2?: string): boolean {
    const k = typeof arg2 === 'string' ? this.composeKey(arg1, arg2) : arg1;
    const entry = this.cache.get(k);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(k);
      return false;
    }
    return true;
  }

  // delete: support delete(key) and delete(store, key)
  delete(key: string): boolean;
  delete(store: string, key: string): boolean;
  delete(arg1: string, arg2?: string): boolean {
    const k = typeof arg2 === 'string' ? this.composeKey(arg1, arg2) : arg1;
    const deleted = this.cache.delete(k);
    if (deleted) {
      this.eventBus.emit({
        type: 'delete',
        key: k,
        timestamp: Date.now(),
      });
    }
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
    this.evictionCount = 0;

    this.eventBus.emit({
      type: 'clear',
      timestamp: Date.now(),
    });
  }

  // ============================================================================
  // INVALIDATION STRATEGIES
  // ============================================================================

  /**
   * Invalidar por padrão (regex ou prefixo)
   */
  invalidatePattern(pattern: string | RegExp): number {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    let count = 0;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }

    if (count > 0) {
      this.eventBus.emit({
        type: 'invalidate',
        pattern: pattern.toString(),
        timestamp: Date.now(),
      });
    }

    return count;
  }

  /**
   * Invalidar por tipo
   */
  invalidateType(type: CacheEntryType): number {
    let count = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.type === type) {
        this.cache.delete(key);
        count++;
      }
    }

    return count;
  }

  /**
   * Invalidar step e tudo relacionado (cascata)
   */
  invalidateStep(stepKey: string): void {
    // Invalidar step
    this.delete(stepKey);
    
    // Invalidar preview do step
    this.delete(`preview:${stepKey}`);
    
    // Invalidar metadata do step
    this.delete(`meta:${stepKey}`);
    
    // Invalidar blocos do step
    this.invalidatePattern(new RegExp(`^${stepKey}:block-`));
  }

  /**
   * Invalidar funnel e tudo relacionado (cascata)
   */
  invalidateFunnel(funnelId: string): void {
    // Invalidar todos os steps do funnel
    this.invalidatePattern(new RegExp(`^${funnelId}:`));
    
    // Invalidar metadata do funnel
    this.delete(`funnel:${funnelId}`);
  }

  // ============================================================================
  // LRU EVICTION
  // ============================================================================

  private shouldEvict(newEntrySize: number): boolean {
    const currentSize = this.getTotalSize();
    const currentEntries = this.cache.size;

    return (
      currentSize + newEntrySize > this.config.maxSize ||
      currentEntries + 1 > this.config.maxEntries
    );
  }

  private evictLRU(requiredSize: number): void {
    // Ordenar por último acesso (LRU)
    const entries = Array.from(this.cache.entries()).sort(
      ([, a], [, b]) => a.lastAccessed - b.lastAccessed
    );

    let freedSize = 0;

    for (const [key, entry] of entries) {
      if (freedSize >= requiredSize && this.cache.size < this.config.maxEntries) {
        break;
      }

      this.cache.delete(key);
      freedSize += entry.size;
      this.evictionCount++;
    }

    this.eventBus.emit({
      type: 'evict',
      timestamp: Date.now(),
    });
  }

  // ============================================================================
  // CLEANUP
  // ============================================================================

  private cleanExpired(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      appLogger.debug(`🧹 Cache cleaned: ${cleaned} expired entries`);
    }
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  private calculateSize(data: any): number {
    try {
      return JSON.stringify(data).length;
    } catch {
      return 0;
    }
  }

  private getTotalSize(): number {
    let total = 0;
    for (const entry of this.cache.values()) {
      total += entry.size;
    }
    return total;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  // ============================================================================
  // STATS & MONITORING
  // ============================================================================

  getStats(): CacheStats {
    const byType: Record<CacheEntryType, { count: number; size: number }> = {
      template: { count: 0, size: 0 },
      step: { count: 0, size: 0 },
      block: { count: 0, size: 0 },
      funnel: { count: 0, size: 0 },
      component: { count: 0, size: 0 },
      user: { count: 0, size: 0 },
      preview: { count: 0, size: 0 },
      metadata: { count: 0, size: 0 },
    };

    for (const entry of this.cache.values()) {
      byType[entry.type].count++;
      byType[entry.type].size += entry.size;
    }

    const total = this.hitCount + this.missCount;
    const hitRate = total > 0 ? this.hitCount / total : 0;

    return {
      totalEntries: this.cache.size,
      totalSize: this.getTotalSize(),
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate,
      evictionCount: this.evictionCount,
      byType,
    };
  }

  getHitRate(): number {
    const total = this.hitCount + this.missCount;
    return total > 0 ? this.hitCount / total : 0;
  }

  /** @deprecated Use invalidateFunnel() */
  async preloadFunnel(funnelId: string): Promise<void> {
    // No-op - preload on-demand com lazy loading
  }

  /** @deprecated Use invalidateFunnel() */
  async refreshCache(): Promise<void> {
    // No-op - cache com TTL automático
  }

  /** @deprecated Use invalidateFunnel() */
  clearFunnel(funnelId: string): void {
    this.invalidateFunnel(funnelId);
  }

  // ============================================================================
  // EVENT SUBSCRIPTION
  // ============================================================================

  subscribe(listener: CacheEventListener): () => void {
    return this.eventBus.subscribe(listener);
  }

  // ============================================================================
  // COMPATIBILITY METHODS (Legacy API)
  // ============================================================================

  /** @deprecated Use get() with step key */
  async getStepTemplate(stepNumber: number, funnelId?: string): Promise<any[]> {
    const key = funnelId 
      ? `${funnelId}:step-${String(stepNumber).padStart(2, '0')}`
      : `step-${String(stepNumber).padStart(2, '0')}`;
    return this.get(key) ?? [];
  }

  /** @deprecated Use invalidateStep() */
  invalidateStepLegacy(stepNumber: number, funnelId?: string): void {
    const key = funnelId
      ? `${funnelId}:step-${String(stepNumber).padStart(2, '0')}`
      : `step-${String(stepNumber).padStart(2, '0')}`;
    this.invalidateStep(key);
  }

  /** @deprecated Use clear() */
  clearCache(): void {
    this.clear();
  }

  // ============================================================================
  // BACKWARDS-COMPATIBILITY WRAPPERS (for older callers expecting multi-store)
  // These helpers allow the older `CacheService` facade to call unifiedCache
  // using the (store, key) signature without changing every call-site.
  // ============================================================================

  private composeKey(store: string, key: string) {
    return `${store}:${key}`;
  }

  private mapStoreToType(store: string): CacheEntryType {
    switch (store) {
      case 'templates':
      case 'template':
        return 'template';
      case 'steps':
      case 'step':
        return 'step';
      case 'blocks':
      case 'block':
        return 'block';
      case 'funnels':
      case 'funnel':
        return 'funnel';
      case 'component':
      case 'components':
        return 'component';
      case 'user':
        return 'user';
      case 'preview':
        return 'preview';
      case 'metadata':
      case 'generic':
      case 'configs':
      default:
        return 'metadata';
    }
  }

  // Legacy multi-arg signature: set(store, key, value, ttl?)
  setEntry<T = any>(store: string, key: string, data: T, ttl?: number): void {
    const composed = this.composeKey(store, key);
    const type = this.mapStoreToType(store);
    return this.set<T>(composed, data, type, ttl);
  }

  // Alias to satisfy older callers that call unifiedCache.set(store, key, value, ttl)
  // (alias removed — handled by overloaded `set` implementation above)

  // Legacy multi-arg signature: get(store, key)
  getEntry<T = any>(store: string, key: string): T | undefined {
    const composed = this.composeKey(store, key);
    return this.get<T>(composed);
  }

  // Alias for unifiedCache.get(store, key)
  // (alias removed — handled by overloaded `get` implementation above)

  // Legacy has/delete wrappers
  hasEntry(store: string, key: string): boolean {
    return this.has(this.composeKey(store, key));
  }

  // Alias for unifiedCache.has(store, key)
  // (alias removed — handled by overloaded `has` implementation above)

  deleteEntry(store: string, key: string): boolean {
    return this.delete(this.composeKey(store, key));
  }

  // Alias for unifiedCache.delete(store, key)
  // (alias removed — handled by overloaded `delete` implementation above)

  // Invalidate by prefix within a store
  invalidateByPrefix(store: string, prefix: string): number {
    const pattern = new RegExp(`^${store}:${prefix}`);
    return this.invalidatePattern(pattern);
  }

  // Clear a logical store (by CacheEntryType)
  clearStore(store: string): void {
    const type = this.mapStoreToType(store);
    this.invalidateType(type);
  }

  // Clear everything - kept for compatibility
  clearAll(): void {
    this.clear();
  }

  // Provide store-specific stats
  getStoreStats(store: string) {
    const stats = this.getStats();
    const type = this.mapStoreToType(store);
    const byType = stats.byType[type] ?? { count: 0, size: 0 };
    return {
      hitRate: stats.hitRate,
      hits: stats.hitRate * (stats.totalEntries || 1),
      misses: 0,
      memoryUsage: byType.size,
      size: byType.count,
    };
  }

  // Return all stats grouped by store-like keys
  getAllStats() {
    const stats = this.getStats();
    const stores: Record<string, any> = {};
    for (const [typeKey, val] of Object.entries(stats.byType)) {
      stores[typeKey] = {
        hitRate: stats.hitRate,
        hits: Math.round(stats.hitRate * (stats.totalEntries || 1)),
        misses: 0,
        memoryUsage: val.size,
        size: val.count,
      };
    }
    return { stores };
  }

  // Log stats for compatibility
  logStats(): void {
    const stats = this.getStats();
    appLogger.info('📊 [UnifiedCache] Stats:', { data: [stats] });
  }

  // Reset metrics counters
  resetStats(): void {
    this.hitCount = 0;
    this.missCount = 0;
    this.evictionCount = 0;
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const unifiedCacheService = UnifiedCacheService.getInstance();

// Alias para compatibilidade
export const unifiedCache = unifiedCacheService;

export default unifiedCacheService;
