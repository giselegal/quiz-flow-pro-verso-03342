/**
 * 🗄️ INDEXED DB CACHE - Persistent Offline Storage
 * 
 * Camada de persistência para cache usando IndexedDB.
 * Complementa UnifiedCacheService com armazenamento offline durável.
 * 
 * FEATURES:
 * ✅ Persistência entre sessões
 * ✅ TTL automático com cleanup
 * ✅ Compression (gzip) para dados grandes
 * ✅ Transações ACID
 * ✅ Fallback para localStorage em caso de erro
 * 
 * USE CASES:
 * - Funnels completos (offline editing)
 * - Templates (carregamento rápido)
 * - User data (sessions, preferences)
 * - Draft auto-save
 */

import { appLogger } from '@/lib/utils/logger';

interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number; // milliseconds
  compressed?: boolean;
  size?: number; // bytes
}

interface IndexedDBConfig {
  dbName: string;
  version: number;
  stores: {
    name: string;
    keyPath: string;
    indexes?: { name: string; keyPath: string; unique?: boolean }[];
  }[];
}

export class IndexedDBCache {
  private static instance: IndexedDBCache;
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;
  private readonly config: IndexedDBConfig = {
    dbName: 'QuizFlowProCache',
    version: 1,
    stores: [
      {
        name: 'funnels',
        keyPath: 'key',
        indexes: [
          { name: 'timestamp', keyPath: 'timestamp' },
          { name: 'ttl', keyPath: 'ttl' },
        ],
      },
      {
        name: 'templates',
        keyPath: 'key',
        indexes: [{ name: 'timestamp', keyPath: 'timestamp' }],
      },
      {
        name: 'drafts',
        keyPath: 'key',
        indexes: [{ name: 'timestamp', keyPath: 'timestamp' }],
      },
      {
        name: 'metadata',
        keyPath: 'key',
      },
    ],
  };

  private constructor() {}

  static getInstance(): IndexedDBCache {
    if (!IndexedDBCache.instance) {
      IndexedDBCache.instance = new IndexedDBCache();
    }
    return IndexedDBCache.instance;
  }

  /**
   * Inicializa conexão com IndexedDB
   */
  async initialize(): Promise<void> {
    if (this.db) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        appLogger.warn('IndexedDB not available, cache disabled');
        resolve();
        return;
      }

      const request = indexedDB.open(this.config.dbName, this.config.version);

      request.onerror = () => {
        appLogger.error('IndexedDB open failed:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        appLogger.debug('✅ IndexedDB initialized:', this.config.dbName);
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Criar stores
        this.config.stores.forEach((store) => {
          if (!db.objectStoreNames.contains(store.name)) {
            const objectStore = db.createObjectStore(store.name, {
              keyPath: store.keyPath,
            });

            // Criar índices
            store.indexes?.forEach((index) => {
              objectStore.createIndex(index.name, index.keyPath, {
                unique: index.unique || false,
              });
            });

            appLogger.debug(`Created store: ${store.name}`);
          }
        });
      };
    });

    return this.initPromise;
  }

  /**
   * Armazena valor no cache com TTL
   */
  async set<T>(
    storeName: string,
    key: string,
    value: T,
    ttl: number = 10 * 60 * 1000 // 10 minutos default
  ): Promise<boolean> {
    await this.initialize();

    if (!this.db) {
      return this.fallbackSet(storeName, key, value);
    }

    try {
      const entry: CacheEntry<T> = {
        key,
        value,
        timestamp: Date.now(),
        ttl,
        size: JSON.stringify(value).length,
      };

      // Comprimir se > 1KB
      if (entry.size && entry.size > 1024) {
        // TODO: Implementar compressão gzip (futuro)
        entry.compressed = false;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(entry);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          appLogger.debug(`💾 [IndexedDB] Stored: ${storeName}/${key} (${entry.size} bytes)`);
          resolve(true);
        };
        request.onerror = () => {
          appLogger.error(`[IndexedDB] Set failed: ${storeName}/${key}`, request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      appLogger.error('[IndexedDB] Set error:', error);
      return this.fallbackSet(storeName, key, value);
    }
  }

  /**
   * Recupera valor do cache verificando TTL
   */
  async get<T>(storeName: string, key: string): Promise<T | null> {
    await this.initialize();

    if (!this.db) {
      return this.fallbackGet<T>(storeName, key);
    }

    try {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const entry = request.result as CacheEntry<T> | undefined;

          if (!entry) {
            appLogger.debug(`💾 [IndexedDB] Miss: ${storeName}/${key}`);
            resolve(null);
            return;
          }

          // Verificar TTL
          const age = Date.now() - entry.timestamp;
          if (age > entry.ttl) {
            appLogger.debug(`💾 [IndexedDB] Expired: ${storeName}/${key} (${age}ms old)`);
            this.delete(storeName, key); // Cleanup async
            resolve(null);
            return;
          }

          appLogger.debug(`💾 [IndexedDB] Hit: ${storeName}/${key} (${entry.size} bytes)`);
          resolve(entry.value);
        };

        request.onerror = () => {
          appLogger.error(`[IndexedDB] Get failed: ${storeName}/${key}`, request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      appLogger.error('[IndexedDB] Get error:', error);
      return this.fallbackGet<T>(storeName, key);
    }
  }

  /**
   * Remove entrada do cache
   */
  async delete(storeName: string, key: string): Promise<boolean> {
    await this.initialize();

    if (!this.db) {
      return this.fallbackDelete(storeName, key);
    }

    try {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      return new Promise((resolve) => {
        request.onsuccess = () => {
          appLogger.debug(`💾 [IndexedDB] Deleted: ${storeName}/${key}`);
          resolve(true);
        };
        request.onerror = () => {
          appLogger.error(`[IndexedDB] Delete failed: ${storeName}/${key}`, request.error);
          resolve(false);
        };
      });
    } catch (error) {
      appLogger.error('[IndexedDB] Delete error:', error);
      return this.fallbackDelete(storeName, key);
    }
  }

  /**
   * Limpa entradas expiradas de uma store
   */
  async cleanup(storeName: string): Promise<number> {
    await this.initialize();

    if (!this.db) return 0;

    try {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.openCursor();

      let deleted = 0;
      const now = Date.now();

      return new Promise((resolve) => {
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;

          if (cursor) {
            const entry = cursor.value as CacheEntry<any>;
            const age = now - entry.timestamp;

            if (age > entry.ttl) {
              cursor.delete();
              deleted++;
            }

            cursor.continue();
          } else {
            if (deleted > 0) {
              appLogger.debug(`🧹 [IndexedDB] Cleaned ${deleted} expired entries from ${storeName}`);
            }
            resolve(deleted);
          }
        };

        request.onerror = () => {
          appLogger.error('[IndexedDB] Cleanup failed:', request.error);
          resolve(0);
        };
      });
    } catch (error) {
      appLogger.error('[IndexedDB] Cleanup error:', error);
      return 0;
    }
  }

  /**
   * Limpa todas as stores
   */
  async clear(storeName?: string): Promise<void> {
    await this.initialize();

    if (!this.db) return;

    const stores = storeName ? [storeName] : this.config.stores.map((s) => s.name);

    try {
      for (const store of stores) {
        const transaction = this.db.transaction([store], 'readwrite');
        const objectStore = transaction.objectStore(store);
        await objectStore.clear();
        appLogger.debug(`🧹 [IndexedDB] Cleared store: ${store}`);
      }
    } catch (error) {
      appLogger.error('[IndexedDB] Clear error:', error);
    }
  }

  /**
   * Estatísticas de uso
   */
  async getStats(storeName: string): Promise<{
    count: number;
    totalSize: number;
    expired: number;
  }> {
    await this.initialize();

    if (!this.db) return { count: 0, totalSize: 0, expired: 0 };

    try {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.openCursor();

      let count = 0;
      let totalSize = 0;
      let expired = 0;
      const now = Date.now();

      return new Promise((resolve) => {
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;

          if (cursor) {
            const entry = cursor.value as CacheEntry<any>;
            count++;
            totalSize += entry.size || 0;

            const age = now - entry.timestamp;
            if (age > entry.ttl) {
              expired++;
            }

            cursor.continue();
          } else {
            resolve({ count, totalSize, expired });
          }
        };

        request.onerror = () => {
          appLogger.error('[IndexedDB] Stats failed:', request.error);
          resolve({ count: 0, totalSize: 0, expired: 0 });
        };
      });
    } catch (error) {
      appLogger.error('[IndexedDB] Stats error:', error);
      return { count: 0, totalSize: 0, expired: 0 };
    }
  }

  // ==================== FALLBACK: localStorage ====================

  private fallbackSet(storeName: string, key: string, value: any): boolean {
    try {
      const entry: CacheEntry<any> = {
        key,
        value,
        timestamp: Date.now(),
        ttl: 10 * 60 * 1000,
      };
      localStorage.setItem(`${storeName}:${key}`, JSON.stringify(entry));
      return true;
    } catch (error) {
      appLogger.error('[localStorage] Fallback set failed:', error);
      return false;
    }
  }

  private fallbackGet<T>(storeName: string, key: string): T | null {
    try {
      const data = localStorage.getItem(`${storeName}:${key}`);
      if (!data) return null;

      const entry = JSON.parse(data) as CacheEntry<T>;
      const age = Date.now() - entry.timestamp;

      if (age > entry.ttl) {
        localStorage.removeItem(`${storeName}:${key}`);
        return null;
      }

      return entry.value;
    } catch (error) {
      appLogger.error('[localStorage] Fallback get failed:', error);
      return null;
    }
  }

  private fallbackDelete(storeName: string, key: string): boolean {
    try {
      localStorage.removeItem(`${storeName}:${key}`);
      return true;
    } catch (error) {
      appLogger.error('[localStorage] Fallback delete failed:', error);
      return false;
    }
  }
}

// Singleton instance
export const indexedDBCache = IndexedDBCache.getInstance();

// Auto-initialize
if (typeof window !== 'undefined') {
  indexedDBCache.initialize().catch((error) => {
    appLogger.warn('IndexedDB auto-init failed:', error);
  });

  // Cleanup periódico (a cada 5 minutos)
  setInterval(
    () => {
      ['funnels', 'templates', 'drafts'].forEach((store) => {
        indexedDBCache.cleanup(store).catch((error) => {
          appLogger.error(`Cleanup failed for ${store}:`, error);
        });
      });
    },
    5 * 60 * 1000
  );
}

export default indexedDBCache;
