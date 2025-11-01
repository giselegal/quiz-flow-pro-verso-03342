// Minimal hybrid cache implementation for canonical services
// Provides in-memory cache with optional TTL and named stores.

export type CacheOptions = {
  memoryStore?: string;
  diskStore?: string; // placeholder for future implementation
  ttl?: number; // milliseconds
};

type Entry = { value: unknown; expiresAt?: number };

export class HybridCacheStrategy {
  private static instance: HybridCacheStrategy;
  // storeName -> Map<key, Entry>
  private memory: Map<string, Map<string, Entry>> = new Map();

  private constructor() {}

  static getInstance(): HybridCacheStrategy {
    if (!HybridCacheStrategy.instance) {
      HybridCacheStrategy.instance = new HybridCacheStrategy();
    }
    return HybridCacheStrategy.instance;
  }

  private store(name?: string): Map<string, Entry> {
    const nm = name || 'default';
    let m = this.memory.get(nm);
    if (!m) {
      m = new Map();
      this.memory.set(nm, m);
    }
    return m;
  }

  async get<T = unknown>(key: string, opts?: CacheOptions): Promise<T | null> {
    const s = this.store(opts?.memoryStore);
    const ent = s.get(key);
    if (!ent) return null;
    if (ent.expiresAt && Date.now() > ent.expiresAt) {
      s.delete(key);
      return null;
    }
    return ent.value as T;
  }

  async set<T = unknown>(key: string, value: T, opts?: CacheOptions): Promise<void> {
    const s = this.store(opts?.memoryStore);
    const expiresAt = opts?.ttl ? Date.now() + opts.ttl : undefined;
    s.set(key, { value, expiresAt });
  }

  async del(key: string, opts?: CacheOptions): Promise<void> {
    const s = this.store(opts?.memoryStore);
    s.delete(key);
  }

  // Alias de compatibilidade com chamadas existentes
  async invalidate(key: string, opts?: CacheOptions): Promise<void> {
    return this.del(key, opts);
  }

  clear(storeName?: string): void {
    if (storeName) {
      this.store(storeName).clear();
      return;
    }
    for (const m of this.memory.values()) m.clear();
  }
}
