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
      const ls = window.localStorage?.getItem('VITE_ENABLE_INDEXEDDB_CACHE');
      if (ls != null) return ls === 'true';
    }
    // @ts-ignore
    const vite = (import.meta as any)?.env?.VITE_ENABLE_INDEXEDDB_CACHE;
    if (typeof vite === 'string') return vite === 'true';
    const node = (typeof process !== 'undefined') ? (process as any).env?.VITE_ENABLE_INDEXEDDB_CACHE : undefined;
    if (typeof node === 'string') return node === 'true';
  } catch {}
  return false;
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
