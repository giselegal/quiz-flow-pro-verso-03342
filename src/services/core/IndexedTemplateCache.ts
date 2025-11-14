/**
 * IndexedTemplateCache - cache persistente em IndexedDB para blocos de steps
 *
 * Objetivo: reduzir I/O (rede/disk) e evitar 404s repetidos, mantendo fonte única (JSON V3).
 * Opt-in via flag: VITE_ENABLE_INDEXEDDB_CACHE=true (ou localStorage['VITE_ENABLE_INDEXEDDB_CACHE']='true')
 */

import type { Block } from '@/types/editor';

const DB_NAME = 'quiz-templates-cache';
const STORE = 'steps';
const DB_VERSION = 1;

interface StepCacheRecord {
  key: string; // ex.: step-01[:funnelId]
  blocks: Block[];
  savedAt: number;
  ttlMs: number;
  version: string; // ex.: 'v3.0'
}

function isEnabled(): boolean {
  try {
    if (typeof window !== 'undefined') {
      const disable = window.localStorage?.getItem('VITE_DISABLE_INDEXEDDB_CACHE');
      if (disable === 'true') return false;
    }
    let viteDisable: any;
    try {
      // @ts-ignore
      viteDisable = (import.meta as any)?.env?.VITE_DISABLE_INDEXEDDB_CACHE;
    } catch {}
    if (typeof viteDisable === 'string' && viteDisable === 'true') return false;
    const nodeDisable = (typeof process !== 'undefined') ? (process as any).env?.VITE_DISABLE_INDEXEDDB_CACHE : undefined;
    if (typeof nodeDisable === 'string' && nodeDisable === 'true') return false;
    return true;
  } catch {
    return false;
  }
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const IndexedTemplateCache = {
  enabled: isEnabled,

  async get(key: string): Promise<StepCacheRecord | null> {
    if (!this.enabled() || typeof indexedDB === 'undefined') return null;
    try {
      const db = await openDb();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readonly');
        const store = tx.objectStore(STORE);
        const req = store.get(key);
        req.onsuccess = () => resolve((req.result as StepCacheRecord) || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return null;
    }
  },

  async set(key: string, value: StepCacheRecord): Promise<void> {
    if (!this.enabled() || typeof indexedDB === 'undefined') return;
    try {
      const db = await openDb();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite');
        const store = tx.objectStore(STORE);
        const req = store.put(value);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      // ignore
    }
  },

  async delete(key: string): Promise<void> {
    if (!this.enabled() || typeof indexedDB === 'undefined') return;
    try {
      const db = await openDb();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite');
        const store = tx.objectStore(STORE);
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      // ignore
    }
  },
};

export type { StepCacheRecord };
