/**
 * 📦 TEMPLATE CACHE - FASE 4
 * 
 * Cache unificado para templates com:
 * - LRU eviction (Least Recently Used)
 * - Limite de tamanho configurável
 * - Cache hit/miss tracking
 * - Clear seletivo ou total
 */

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  hits: number;
}

class TemplateCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize: number;
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0
  };

  constructor(maxSize = 50) {
    this.maxSize = maxSize;
  }

  /**
   * Buscar valor do cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (entry) {
      // Atualizar stats e timestamp
      entry.hits++;
      entry.timestamp = Date.now();
      this.stats.hits++;
      
      if (import.meta.env.DEV) {
        console.log(`💾 Template cache hit: ${key} (${entry.hits} hits)`);
      }
      
      return entry.value as T;
    }
    
    this.stats.misses++;
    
    if (import.meta.env.DEV) {
      console.log(`❌ Template cache miss: ${key}`);
    }
    
    return null;
  }

  /**
   * Armazenar valor no cache
   */
  set<T>(key: string, value: T): void {
    // Se atingiu o limite, remover item menos usado
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      hits: 0
    });

    if (import.meta.env.DEV) {
      console.log(`💾 Template cached: ${key} (cache size: ${this.cache.size}/${this.maxSize})`);
    }
  }

  /**
   * Verificar se existe no cache
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Remover item específico
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Limpar todo o cache
   */
  clear(): void {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, evictions: 0 };
    
    if (import.meta.env.DEV) {
      console.log('🗑️ Template cache cleared');
    }
  }

  /**
   * Obter estatísticas do cache
   */
  getStats() {
    const hitRate = this.stats.hits + this.stats.misses > 0
      ? (this.stats.hits / (this.stats.hits + this.stats.misses)) * 100
      : 0;

    return {
      ...this.stats,
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: Math.round(hitRate * 100) / 100
    };
  }

  /**
   * Evict Least Recently Used item
   */
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    // Encontrar item mais antigo
    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.evictions++;
      
      if (import.meta.env.DEV) {
        console.log(`🗑️ Template cache evicted: ${oldestKey}`);
      }
    }
  }

  /**
   * Invalidar cache com pattern
   */
  invalidatePattern(pattern: RegExp): number {
    let count = 0;
    
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }
    
    if (import.meta.env.DEV && count > 0) {
      console.log(`🗑️ Invalidated ${count} cached templates matching ${pattern}`);
    }
    
    return count;
  }
}

// Singleton instance
export const templateCache = new TemplateCache(50);

// Helper functions
export const getCachedTemplate = <T>(key: string): T | null => {
  return templateCache.get<T>(key);
};

export const setCachedTemplate = <T>(key: string, value: T): void => {
  templateCache.set(key, value);
};

export const clearTemplateCache = (): void => {
  templateCache.clear();
};

export const getTemplateCacheStats = () => {
  return templateCache.getStats();
};

export default templateCache;
