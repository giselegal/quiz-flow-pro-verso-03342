/**
 * 🚀 LRU CACHE IMPLEMENTATION
 * 
 * Cache LRU (Least Recently Used) para eliminar memory leaks
 * e otimizar performance do sistema de componentes
 * 
 * FUNCIONALIDADES:
 * ✅ Limite automático de capacidade
 * ✅ Eviction policy inteligente
 * ✅ Performance metrics integradas
 * ✅ Thread-safe operations
 * ✅ Type-safe generic implementation
 */

export interface CacheStats {
  size: number;
  capacity: number;
  hits: number;
  misses: number;
  evictions: number;
  hitRate: number;
}

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  accessCount: number;
}

/**
 * 🎯 LRU Cache com métricas de performance
 */
export class LRUCache<T> {
  private capacity: number;
  private cache = new Map<string, CacheEntry<T>>();
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0
  };

  constructor(capacity = 100) {
    this.capacity = Math.max(1, capacity);
  }

  /**
   * Obter valor do cache
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (entry) {
      // Atualizar timestamp e contador de acesso
      entry.timestamp = Date.now();
      entry.accessCount++;
      
      // Mover para o final (mais recente)
      this.cache.delete(key);
      this.cache.set(key, entry);
      
      this.stats.hits++;
      return entry.value;
    }
    
    this.stats.misses++;
    return null;
  }

  /**
   * Definir valor no cache
   */
  set(key: string, value: T): void {
    // Se a chave já existe, atualizar
    if (this.cache.has(key)) {
      const entry = this.cache.get(key)!;
      entry.value = value;
      entry.timestamp = Date.now();
      entry.accessCount++;
      
      // Mover para o final
      this.cache.delete(key);
      this.cache.set(key, entry);
      return;
    }

    // Se atingiu a capacidade, remover o menos recente
    if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
      this.stats.evictions++;
    }

    // Adicionar nova entrada
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      accessCount: 1
    };

    this.cache.set(key, entry);
  }

  /**
   * Remover chave específica
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Verificar se chave existe
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Limpar todo o cache
   */
  clear(): void {
    this.cache.clear();
    this.resetStats();
  }

  /**
   * Obter estatísticas do cache
   */
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;

    return {
      size: this.cache.size,
      capacity: this.capacity,
      hits: this.stats.hits,
      misses: this.stats.misses,
      evictions: this.stats.evictions,
      hitRate: Math.round(hitRate * 100) / 100
    };
  }

  /**
   * Resetar estatísticas
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0
    };
  }

  /**
   * Obter todas as chaves (ordenadas por uso)
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Obter todos os valores
   */
  values(): T[] {
    return Array.from(this.cache.values()).map(entry => entry.value);
  }

  /**
   * Iterar sobre entradas
   */
  entries(): Array<[string, T]> {
    return Array.from(this.cache.entries()).map(([key, entry]) => [key, entry.value]);
  }

  /**
   * Redimensionar capacidade do cache
   */
  resize(newCapacity: number): void {
    newCapacity = Math.max(1, newCapacity);
    
    if (newCapacity < this.capacity) {
      // Reduzir cache removendo entradas mais antigas
      while (this.cache.size > newCapacity) {
        const oldestKey = this.cache.keys().next().value;
        this.cache.delete(oldestKey);
        this.stats.evictions++;
      }
    }
    
    this.capacity = newCapacity;
  }

  /**
   * Obter métricas detalhadas por entrada
   */
  getDetailedMetrics(): Array<{
    key: string;
    accessCount: number;
    age: number;
    lastAccess: string;
  }> {
    const now = Date.now();
    return Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      accessCount: entry.accessCount,
      age: now - entry.timestamp,
      lastAccess: new Date(entry.timestamp).toISOString()
    }));
  }

  /**
   * Cleanup automático baseado em idade
   */
  cleanupExpired(maxAgeMs: number): number {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > maxAgeMs) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  /**
   * Prefetch com preloader
   */
  prefetch(keys: string[], loader: (key: string) => Promise<T>): Promise<void> {
    const missingKeys = keys.filter(key => !this.has(key));
    
    return Promise.all(
      missingKeys.map(async (key) => {
        try {
          const value = await loader(key);
          this.set(key, value);
        } catch (error) {
          console.warn(`Prefetch failed for key "${key}":`, error);
        }
      })
    ).then(() => {});
  }
}

/**
 * 🎯 CACHE MANAGER - Singleton para gerenciar múltiplos caches
 */
export class CacheManager {
  private static instance: CacheManager;
  private caches = new Map<string, LRUCache<any>>();

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * Criar ou obter cache nomeado
   */
  getCache<T>(name: string, capacity = 100): LRUCache<T> {
    if (!this.caches.has(name)) {
      this.caches.set(name, new LRUCache<T>(capacity));
    }
    return this.caches.get(name)!;
  }

  /**
   * Obter estatísticas de todos os caches
   */
  getAllStats(): Record<string, CacheStats> {
    const stats: Record<string, CacheStats> = {};
    for (const [name, cache] of this.caches.entries()) {
      stats[name] = cache.getStats();
    }
    return stats;
  }

  /**
   * Limpar todos os caches
   */
  clearAll(): void {
    for (const cache of this.caches.values()) {
      cache.clear();
    }
  }

  /**
   * Cleanup automático de todos os caches
   */
  cleanupAll(maxAgeMs = 5 * 60 * 1000): number { // 5 minutos default
    let totalCleaned = 0;
    for (const cache of this.caches.values()) {
      totalCleaned += cache.cleanupExpired(maxAgeMs);
    }
    return totalCleaned;
  }

  /**
   * Monitoramento de performance
   */
  getPerformanceReport(): {
    totalCaches: number;
    totalEntries: number;
    averageHitRate: number;
    totalEvictions: number;
  } {
    const allStats = this.getAllStats();
    const stats = Object.values(allStats);

    const totalEntries = stats.reduce((sum, s) => sum + s.size, 0);
    const totalEvictions = stats.reduce((sum, s) => sum + s.evictions, 0);
    const averageHitRate = stats.length > 0 
      ? stats.reduce((sum, s) => sum + s.hitRate, 0) / stats.length 
      : 0;

    return {
      totalCaches: stats.length,
      totalEntries,
      averageHitRate: Math.round(averageHitRate * 100) / 100,
      totalEvictions
    };
  }
}

// Exportar instância singleton
export const cacheManager = CacheManager.getInstance();

// Cleanup automático a cada 5 minutos
if (typeof window !== 'undefined') {
  setInterval(() => {
    const cleaned = cacheManager.cleanupAll();
    if (cleaned > 0) {
      console.log(`🗑️ Cache cleanup: ${cleaned} expired entries removed`);
    }
  }, 5 * 60 * 1000);
}