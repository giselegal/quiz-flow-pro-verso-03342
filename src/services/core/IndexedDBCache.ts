/**
 * 📦 IndexedDBCache (L3) - Fallback Stub
 *
 * Implementação mínima para ambientes onde IndexedDB não está disponível
 * ou ainda não foi implementado. Evita falhas de import no Vite.
 */

import type { CacheStore } from '../canonical/CacheService';

const isBrowser = typeof window !== 'undefined' && typeof indexedDB !== 'undefined';

export const indexedDBCache = {
  async get<T>(store: CacheStore, key: string): Promise<T | null> {
    // TODO: Implementar real IndexedDB store por store
    return null;
  },
  async set<T>(store: CacheStore, key: string, value: T, ttl?: number): Promise<void> {
    // No-op por enquanto
  },
  async delete(store: CacheStore, key: string): Promise<void> {
    // No-op por enquanto
  },
  async clear(store?: CacheStore): Promise<void> {
    // No-op por enquanto
  },
};

export default indexedDBCache;
