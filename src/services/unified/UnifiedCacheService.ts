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

import { appLogger } from '@/utils/logger';

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

  get<T = any>(key: string): T | undefined {
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

  set<T = any>(key: string, data: T, type: CacheEntryType = 'metadata', ttl?: number): void {
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

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    // Verificar expiração
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    
    if (deleted) {
      this.eventBus.emit({
        type: 'delete',
        key,
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
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const unifiedCacheService = UnifiedCacheService.getInstance();

// Alias para compatibilidade
export const unifiedCache = unifiedCacheService;

export default unifiedCacheService;
