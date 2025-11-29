/**
 * 📦 IndexedDBCache (L3) - Implementação básica
 *
 * Armazena valores por `CacheStore` em stores separados no IndexedDB.
 * Cada entrada contém valor e metadados mínimos. TTL é verificado na leitura.
 */

import type { CacheStore } from '../canonical/CacheService';

type CacheEntry<T = any> = {
  key: string;
  value: T;
  expiresAt?: number; // epoch ms; ausência significa sem TTL
  createdAt: number;
};

const DB_NAME = 'quizflow-cache-v1';
const DB_VERSION = 1;

const STORES: CacheStore[] = [
  'generic', 'templates', 'funnels', 'steps', 'blocks', 'configs', 'validation', 'registry',
];

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof indexedDB !== 'undefined';
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) {
      reject(new Error('IndexedDB not available'));
      return;
    }

    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const storeName of STORES) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'key' });
        }
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Abre o DB atual para ler a versão e depois reabre com versão incrementada
async function upgradeDBWithStores(newStores: Array<CacheStore | string>): Promise<void> {
  if (!isBrowser()) return;
  // Abrir para obter versão atual
  const current = await new Promise<IDBDatabase>((resolve, reject) => {
    const r = indexedDB.open(DB_NAME);
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
  const nextVersion = (current as any).version + 1;
  current.close();

  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, nextVersion);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const storeName of newStores) {
        const name = storeName as string;
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: 'key' });
        }
      }
    };
    req.onsuccess = () => {
      req.result.close();
      resolve();
    };
    req.onerror = () => reject(req.error);
  });
}

function tx(db: IDBDatabase, store: CacheStore | string, mode: IDBTransactionMode) {
  const target = db.objectStoreNames.contains(store as string) ? store : 'generic';
  return db.transaction(target, mode).objectStore(target);
}

export const indexedDBCache = {
  // API de migração: cria novos stores promovendo a versão do DB
  async registerStores(stores: Array<CacheStore | string>): Promise<void> {
    try {
      await upgradeDBWithStores(stores);
    } catch {
      // no-op
    }
  },
  async get<T>(store: CacheStore | string, key: string): Promise<T | null> {
    try {
      const db = await openDB();
      const storeObj = tx(db, store, 'readonly');
      const entry = await new Promise<CacheEntry<T> | undefined>((resolve, reject) => {
        const req = storeObj.get(key);
        req.onsuccess = () => resolve(req.result as CacheEntry<T> | undefined);
        req.onerror = () => reject(req.error);
      });

      db.close();

      if (!entry) return null;
      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        // Expirado: apagar e retornar null
        await this.delete(store, key);
        return null;
      }
      return entry.value as T;
    } catch {
      return null;
    }
  },

  async set<T>(store: CacheStore | string, key: string, value: T, ttl?: number): Promise<void> {
    try {
      const db = await openDB();
      const storeObj = tx(db, store, 'readwrite');
      const entry: CacheEntry<T> = {
        key,
        value,
        createdAt: Date.now(),
        expiresAt: typeof ttl === 'number' && ttl > 0 ? Date.now() + ttl : undefined,
      };
      await new Promise<void>((resolve, reject) => {
        const req = storeObj.put(entry);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      db.close();
    } catch {
      // no-op
    }
  },

  async delete(store: CacheStore | string, key: string): Promise<void> {
    try {
      const db = await openDB();
      const storeObj = tx(db, store, 'readwrite');
      await new Promise<void>((resolve, reject) => {
        const req = storeObj.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      db.close();
    } catch {
      // no-op
    }
  },

  async clear(store?: CacheStore | string): Promise<void> {
    try {
      const db = await openDB();
      if (store) {
        const storeObj = tx(db, store, 'readwrite');
        await new Promise<void>((resolve, reject) => {
          const req = storeObj.clear();
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      } else {
        // Limpar todos os stores
        for (const s of STORES) {
          const storeObj = tx(db, s, 'readwrite');
          await new Promise<void>((resolve, reject) => {
            const req = storeObj.clear();
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
          });
        }
      }
      db.close();
    } catch {
      // no-op
    }
  },
};

export default indexedDBCache;
