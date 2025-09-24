/**
 * 🧠 INTELLIGENT CACHE SYSTEM - FASE 2: TEMPLATE CACHING
 * 
 * Sistema de cache inteligente que resolve:
 * - Cache ineficiente de templates
 * - Invalidação manual complexa
 * - Falta de priorização de cache
 * - Memory leaks em cache não limitado
 * 
 * ✅ Cache com TTL dinâmico
 * ✅ Invalidação automática inteligente
 * ✅ Priorização por uso
 * ✅ Limite de memória automático
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  size: number; // Estimated size in bytes
}

interface CacheStats {
  totalEntries: number;
  totalSize: string;
  hitRate: string;
  memoryUsage: string;
  oldestEntry: number;
  mostAccessed: string;
}

class IntelligentCacheSystem<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    invalidations: 0
  };
  
  // 🎛️ CONFIGURAÇÕES DINÂMICAS
  private readonly MAX_MEMORY_MB = 10; // 10MB limit
  private readonly MAX_ENTRIES = 1000;
  private readonly CLEANUP_INTERVAL = 60 * 1000; // 1 minute
  
  // 🎯 TTL DINÂMICO POR PRIORIDADE
  private readonly TTL_BY_PRIORITY = {
    critical: 30 * 60 * 1000, // 30 minutes
    high: 15 * 60 * 1000,     // 15 minutes
    medium: 5 * 60 * 1000,    // 5 minutes
    low: 2 * 60 * 1000        // 2 minutes
  };

  private cleanupTimer?: NodeJS.Timeout;

  constructor() {
    this.startPeriodicCleanup();
  }

  /**
   * 🔍 GET - Busca inteligente com stats
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      console.log(`❌ Cache miss: ${key}`);
      return null;
    }

    const now = Date.now();
    const isExpired = now - entry.timestamp > entry.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      this.stats.misses++;
      console.log(`⏰ Cache expired: ${key}`);
      return null;
    }

    // Update access stats
    entry.accessCount++;
    entry.lastAccessed = now;
    this.stats.hits++;
    
    console.log(`✅ Cache hit: ${key} (${entry.accessCount} accesses)`);
    return entry.data;
  }

  /**
   * 💾 SET - Armazenamento inteligente com priorização
   */
  set(
    key: string, 
    data: T, 
    options: {
      priority?: 'critical' | 'high' | 'medium' | 'low';
      customTTL?: number;
    } = {}
  ): void {
    const { priority = 'medium', customTTL } = options;
    const now = Date.now();
    const ttl = customTTL || this.TTL_BY_PRIORITY[priority];
    const size = this.estimateSize(data);

    // 🧹 CLEANUP PREVENTIVO
    if (this.cache.size >= this.MAX_ENTRIES || this.getTotalSizeBytes() + size > this.MAX_MEMORY_MB * 1024 * 1024) {
      this.evictLeastUsed();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      ttl,
      accessCount: 0,
      lastAccessed: now,
      priority,
      size
    };

    this.cache.set(key, entry);
    console.log(`💾 Cached: ${key} (${priority}, ${ttl}ms TTL, ${size} bytes)`);
  }

  /**
   * 🗑️ INVALIDATE - Invalidação inteligente
   */
  invalidate(pattern: string | RegExp | string[]): number {
    let invalidated = 0;

    if (Array.isArray(pattern)) {
      // Invalidar múltiplas chaves específicas
      pattern.forEach(key => {
        if (this.cache.delete(key)) {
          invalidated++;
        }
      });
    } else if (pattern instanceof RegExp) {
      // Invalidar por regex
      for (const [key] of this.cache) {
        if (pattern.test(key)) {
          this.cache.delete(key);
          invalidated++;
        }
      }
    } else {
      // Invalidar chave específica ou padrão wildcard
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        for (const [key] of this.cache) {
          if (regex.test(key)) {
            this.cache.delete(key);
            invalidated++;
          }
        }
      } else {
        if (this.cache.delete(pattern)) {
          invalidated++;
        }
      }
    }

    this.stats.invalidations += invalidated;
    console.log(`🗑️ Invalidated ${invalidated} entries for pattern: ${pattern}`);
    return invalidated;
  }

  /**
   * 🧹 EVICT LEAST USED - Remove itens menos usados
   */
  private evictLeastUsed(): void {
    const entries = Array.from(this.cache.entries());
    
    // Ordenar por: prioridade baixa -> menor accessCount -> mais antigo
    entries.sort(([, a], [, b]) => {
      const priorityScore = { low: 0, medium: 1, high: 2, critical: 3 };
      
      if (priorityScore[a.priority] !== priorityScore[b.priority]) {
        return priorityScore[a.priority] - priorityScore[b.priority];
      }
      
      if (a.accessCount !== b.accessCount) {
        return a.accessCount - b.accessCount;
      }
      
      return a.timestamp - b.timestamp;
    });

    // Remove os 10% menos importantes
    const toRemove = Math.ceil(entries.length * 0.1);
    for (let i = 0; i < toRemove && i < entries.length; i++) {
      const [key] = entries[i];
      this.cache.delete(key);
      this.stats.evictions++;
    }

    console.log(`🧹 Evicted ${toRemove} least used entries`);
  }

  /**
   * 📊 ESTIMATE SIZE - Estima tamanho do objeto
   */
  private estimateSize(data: T): number {
    try {
      return JSON.stringify(data).length * 2; // Rough UTF-16 estimation
    } catch {
      return 1000; // Default size if can't stringify
    }
  }

  /**
   * 📏 GET TOTAL SIZE - Calcula tamanho total do cache
   */
  private getTotalSizeBytes(): number {
    let total = 0;
    for (const [, entry] of this.cache) {
      total += entry.size;
    }
    return total;
  }

  /**
   * ⏰ PERIODIC CLEANUP - Limpeza automática
   */
  private startPeriodicCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpired();
    }, this.CLEANUP_INTERVAL);
  }

  private cleanupExpired(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} expired entries`);
    }
  }

  /**
   * 📊 GET STATS - Estatísticas do cache
   */
  getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const totalSize = this.getTotalSizeBytes();
    const hitRate = this.stats.hits + this.stats.misses > 0 
      ? ((this.stats.hits / (this.stats.hits + this.stats.misses)) * 100).toFixed(1)
      : '0.0';

    const mostAccessed = entries.length > 0
      ? Array.from(this.cache.entries())
          .sort(([, a], [, b]) => b.accessCount - a.accessCount)[0]?.[0] || 'none'
      : 'none';

    const oldestEntry = entries.length > 0 
      ? Math.min(...entries.map(e => e.timestamp))
      : Date.now();

    return {
      totalEntries: this.cache.size,
      totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
      hitRate: `${hitRate}%`,
      memoryUsage: `${((totalSize / (this.MAX_MEMORY_MB * 1024 * 1024)) * 100).toFixed(1)}%`,
      oldestEntry,
      mostAccessed
    };
  }

  /**
   * 🔄 REFRESH - Atualiza entrada existente mantendo stats
   */
  refresh(key: string, newData: T): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    entry.data = newData;
    entry.timestamp = Date.now();
    entry.size = this.estimateSize(newData);
    
    console.log(`🔄 Refreshed: ${key}`);
    return true;
  }

  /**
   * 🧹 CLEAR - Limpa todo o cache
   */
  clear(): void {
    const count = this.cache.size;
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, evictions: 0, invalidations: 0 };
    console.log(`🗑️ Cleared entire cache (${count} entries)`);
  }

  /**
   * 🛑 DESTROY - Cleanup completo
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clear();
  }
}

// 🎯 TEMPLATE CACHE SINGLETON
export const templateCache = new IntelligentCacheSystem();

// 🎯 COMPONENT CACHE SINGLETON  
export const componentCache = new IntelligentCacheSystem();

// 🎯 QUERY CACHE SINGLETON
export const queryCache = new IntelligentCacheSystem();

export default IntelligentCacheSystem;