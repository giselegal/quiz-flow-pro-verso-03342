/**
 * 🗄️ EDITOR CACHE SERVICE - Fase 2 (P1)
 * 
 * Cache unificado para Canvas, Preview e Templates
 * Elimina divergências causadas por múltiplos caches desincronizados
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class EditorCacheService {
  private static instance: EditorCacheService;
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

  private constructor() {}

  static getInstance(): EditorCacheService {
    if (!EditorCacheService.instance) {
      EditorCacheService.instance = new EditorCacheService();
    }
    return EditorCacheService.instance;
  }

  /**
   * Armazena valor no cache
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });

    console.log(`📦 Cache SET: ${key}`, { dataType: typeof data, ttl });
  }

  /**
   * Recupera valor do cache (null se expirado ou não existir)
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      console.log(`📦 Cache MISS: ${key}`);
      return null;
    }

    const age = Date.now() - entry.timestamp;
    if (age > entry.ttl) {
      console.log(`📦 Cache EXPIRED: ${key} (age: ${age}ms, ttl: ${entry.ttl}ms)`);
      this.cache.delete(key);
      return null;
    }

    console.log(`📦 Cache HIT: ${key} (age: ${age}ms)`);
    return entry.data as T;
  }

  /**
   * Invalida cache por chave exata
   */
  invalidate(key: string): void {
    const existed = this.cache.delete(key);
    console.log(`📦 Cache INVALIDATE: ${key} (existed: ${existed})`);
  }

  /**
   * Invalida cache por prefixo (ex: invalidar todos steps de um funnel)
   */
  invalidateByPrefix(prefix: string): void {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        count++;
      }
    }
    console.log(`📦 Cache INVALIDATE PREFIX: ${prefix} (${count} entries)`);
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`📦 Cache CLEAR: ${size} entries removed`);
  }

  /**
   * Retorna estatísticas do cache
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Remove entradas expiradas (garbage collection)
   */
  gc(): number {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        removed++;
      }
    }

    if (removed > 0) {
      console.log(`📦 Cache GC: ${removed} expired entries removed`);
    }

    return removed;
  }
}

// Export singleton
export const editorCache = EditorCacheService.getInstance();

// Auto GC a cada 2 minutos
if (typeof window !== 'undefined') {
  setInterval(() => {
    editorCache.gc();
  }, 2 * 60 * 1000);
}
