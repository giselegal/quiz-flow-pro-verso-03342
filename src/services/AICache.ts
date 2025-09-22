/**
 * 🧠 AI CACHE SERVICE - OTIMIZAÇÃO DE PERFORMANCE
 * 
 * Cache inteligente para respostas IA que:
 * ✅ Reduz chamadas desnecessárias para APIs
 * ✅ Melhora tempo de resposta
 * ✅ Implementa TTL (Time To Live)
 * ✅ Suporte a invalidação seletiva
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hash: string;
}

interface CacheStats {
  hits: number;
  misses: number;
  totalRequests: number;
  hitRate: number;
}

export class AICache {
  private cache = new Map<string, CacheEntry<any>>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    totalRequests: 0,
    hitRate: 0
  };

  constructor(private maxSize = 100) { }

  /**
   * Gera hash para chave de cache baseada em parâmetros
   */
  private generateHash(input: any): string {
    return btoa(JSON.stringify(input)).slice(0, 16);
  }

  /**
   * Verifica se uma entrada está expirada
   */
  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Obtém dados do cache
   */
  get<T>(key: string, params?: any): T | null {
    this.stats.totalRequests++;

    const hash = params ? this.generateHash(params) : '';
    const fullKey = `ai_cache_${hash ? `${key}_${hash}` : key}`;

    // Tenta carregar do localStorage se não estiver no cache em memória
    if (!this.cache.has(fullKey)) {
      const storedItem = localStorage.getItem(fullKey);
      if (storedItem) {
        try {
          const entry = JSON.parse(storedItem);
          if (!this.isExpired(entry)) {
            this.cache.set(fullKey, entry);
          } else {
            localStorage.removeItem(fullKey);
          }
        } catch (e) {
          localStorage.removeItem(fullKey);
        }
      }
    }

    const entry = this.cache.get(fullKey);

    if (!entry || this.isExpired(entry)) {
      this.stats.misses++;
      if (entry) {
        this.cache.delete(fullKey);
        localStorage.removeItem(fullKey);
      }
      this.updateHitRate();
      return null;
    }

    this.stats.hits++;
    this.updateHitRate();
    return entry.data;
  }

  /**
   * Armazena dados no cache
   */
  set<T>(key: string, data: T, ttlMs = 5 * 60 * 1000, params?: any): void {
    if (data === undefined || data === null) {
      return;
    }

    const hash = params ? this.generateHash(params) : '';
    const fullKey = `ai_cache_${hash ? `${key}_${hash}` : key}`;

    // Limpar cache se atingiu tamanho máximo
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    const entry = {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
      hash
    };

    this.cache.set(fullKey, entry);

    try {
      localStorage.setItem(fullKey, JSON.stringify(entry));
    } catch (e) {
      console.error("Falha ao persistir no localStorage:", e);
    }

    console.log(`🧠 AICache: Cached '${key}' (TTL: ${ttlMs}ms)`);
  }

  /**
   * Remove entrada mais antiga do cache
   */
  private evictOldest(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Invalida cache por padrão de chave
   */
  invalidate(keyPattern: string): number {
    let removed = 0;
    const keysToRemove: string[] = [];

    for (const key of this.cache.keys()) {
      if (key.includes(keyPattern)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => {
      this.cache.delete(key);
      removed++;
    });

    console.log(`🧠 AICache: Invalidated ${removed} entries matching '${keyPattern}'`);
    return removed;
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      totalRequests: 0,
      hitRate: 0
    };
    console.log('🧠 AICache: Cache cleared');
  }

  /**
   * Atualiza taxa de acerto
   */
  private updateHitRate(): void {
    this.stats.hitRate = this.stats.totalRequests > 0
      ? (this.stats.hits / this.stats.totalRequests) * 100
      : 0;
  }

  /**
   * Obtém estatísticas do cache
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Obtém informações detalhadas do cache
   */
  getInfo() {
    const entries: Array<{ key: string; size: number; age: number; ttl: number }> = [];

    for (const [key, entry] of this.cache.entries()) {
      entries.push({
        key,
        size: JSON.stringify(entry.data).length,
        age: Date.now() - entry.timestamp,
        ttl: entry.ttl
      });
    }

    return {
      stats: this.getStats(),
      size: this.cache.size,
      maxSize: this.maxSize,
      entries: entries.sort((a, b) => b.age - a.age)
    };
  }
}

// Instância global do cache
export const aiCache = new AICache(50);

/**
 * Decorator para cache automático de funções IA
 */
export function cached(
  key: string,
  ttlMs = 5 * 60 * 1000
) {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cached = aiCache.get(key, args);
      if (cached) {
        console.log(`🎯 Cache hit for ${key}`);
        return cached;
      }

      console.log(`⚡ Cache miss for ${key}, calling AI...`);
      const result = await originalMethod.apply(this, args);
      aiCache.set(key, result, ttlMs, args);
      return result;
    };

    return descriptor;
  };
}

export default aiCache;