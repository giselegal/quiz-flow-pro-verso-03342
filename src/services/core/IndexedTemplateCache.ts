/**
 * 🗄️ INDEXED TEMPLATE CACHE
 * 
 * Cache de segundo nível (L2) usando IndexedDB para armazenamento persistente
 * de templates e blocos do editor.
 * 
 * ESTRUTURA:
 * - L1: Memory cache (no HierarchicalTemplateSource)
 * - L2: IndexedDB cache (este arquivo) - persistente entre sessões
 * - L3: Network/Database (Supabase)
 * 
 * @version 1.0.0
 * @phase CONSOLIDAÇÃO V3
 */

import { appLogger } from '@/lib/utils/appLogger';
import type { Block } from '@/types/editor';

const DB_NAME = 'quiz-flow-templates';
const DB_VERSION = 1;
const STORE_NAME = 'template-cache';

interface CacheRecord {
    key: string;
    blocks: Block[];
    savedAt: number;
    ttlMs: number;
    version: string;
}

/**
 * Abre a conexão com o IndexedDB
 */
function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (typeof indexedDB === 'undefined') {
            reject(new Error('IndexedDB not available'));
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            // Criar object store se não existir
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
                objectStore.createIndex('savedAt', 'savedAt', { unique: false });
                appLogger.info('[IndexedTemplateCache] Object store created');
            }
        };
    });
}

/**
 * Obtém um registro do cache
 */
async function get(key: string): Promise<CacheRecord | null> {
    try {
        const db = await openDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const objectStore = transaction.objectStore(STORE_NAME);
            const request = objectStore.get(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const result = request.result as CacheRecord | undefined;
                resolve(result || null);
            };

            transaction.oncomplete = () => db.close();
        });
    } catch (error) {
        appLogger.debug('[IndexedTemplateCache] get error:', { data: [error] });
        return null;
    }
}

/**
 * Define um registro no cache
 */
async function set(key: string, record: CacheRecord): Promise<void> {
    try {
        const db = await openDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const objectStore = transaction.objectStore(STORE_NAME);
            const request = objectStore.put(record);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();

            transaction.oncomplete = () => db.close();
        });
    } catch (error) {
        appLogger.debug('[IndexedTemplateCache] set error:', { data: [error] });
        throw error;
    }
}

/**
 * Remove um registro do cache
 */
async function remove(key: string): Promise<void> {
    try {
        const db = await openDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const objectStore = transaction.objectStore(STORE_NAME);
            const request = objectStore.delete(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();

            transaction.oncomplete = () => db.close();
        });
    } catch (error) {
        appLogger.debug('[IndexedTemplateCache] delete error:', { data: [error] });
        throw error;
    }
}

/**
 * Limpa todos os registros do cache
 */
async function clear(): Promise<void> {
    try {
        const db = await openDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const objectStore = transaction.objectStore(STORE_NAME);
            const request = objectStore.clear();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();

            transaction.oncomplete = () => db.close();
        });
    } catch (error) {
        appLogger.debug('[IndexedTemplateCache] clear error:', { data: [error] });
        throw error;
    }
}

/**
 * Remove registros expirados do cache
 */
async function cleanup(): Promise<number> {
    try {
        const db = await openDB();
        const now = Date.now();
        let deletedCount = 0;

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const objectStore = transaction.objectStore(STORE_NAME);
            const request = objectStore.openCursor();

            request.onerror = () => reject(request.error);
            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

                if (cursor) {
                    const record = cursor.value as CacheRecord;
                    const isExpired = (now - record.savedAt) > record.ttlMs;

                    if (isExpired) {
                        cursor.delete();
                        deletedCount++;
                    }

                    cursor.continue();
                } else {
                    // Cursor finished
                    resolve(deletedCount);
                }
            };

            transaction.oncomplete = () => db.close();
        });
    } catch (error) {
        appLogger.debug('[IndexedTemplateCache] cleanup error:', { data: [error] });
        return 0;
    }
}

/**
 * Exportação do serviço
 */
export const IndexedTemplateCache = {
    get,
    set,
    delete: remove,
    clear,
    cleanup,
};

// Cleanup automático periódico (a cada 5 minutos)
if (typeof window !== 'undefined') {
    setInterval(() => {
        IndexedTemplateCache.cleanup().then(count => {
            if (count > 0) {
                appLogger.info(`[IndexedTemplateCache] Cleaned up ${count} expired records`);
            }
        });
    }, 5 * 60 * 1000);
}
