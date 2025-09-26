/**
 * 🗃️ INDEXEDDB SERVICE - SISTEMA DE STORAGE AVANÇADO
 * 
 * Sistema robusto para armazenamento de dados com IndexedDB
 */

interface StorageItem {
  id: string;
  data: any;
  timestamp: number;
  metadata?: {
    userId?: string;
    context?: string;
    tags?: string[];
  };
}

class IndexedDBService {
  private dbName = 'QuizQuestStorage';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('❌ Erro ao abrir IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ IndexedDB inicializado com sucesso');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Criar object store para funis se não existir
        if (!db.objectStoreNames.contains('funnels')) {
          const store = db.createObjectStore('funnels', { keyPath: 'id' });
          store.createIndex('userId', 'metadata.userId', { unique: false });
          store.createIndex('context', 'metadata.context', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Criar object store para cache se não existir
        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'id' });
          cacheStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        console.log('✅ IndexedDB schema atualizado');
      };
    });
  }

  async save(storeName: string, key: string, data: any, metadata?: any): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);

      const item: StorageItem = {
        id: key,
        data,
        timestamp: Date.now(),
        metadata
      };

      const request = store.put(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async load(storeName: string, key: string): Promise<any> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, key: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async list(storeName: string, filters?: { userId?: string; context?: string }): Promise<any[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        let results = request.result || [];

        // Aplicar filtros se fornecidos
        if (filters) {
          results = results.filter(item => {
            if (filters.userId && item.metadata?.userId !== filters.userId) return false;
            if (filters.context && item.metadata?.context !== filters.context) return false;
            return true;
          });
        }

        // Ordenar por timestamp (mais recente primeiro)
        results.sort((a, b) => b.timestamp - a.timestamp);

        resolve(results.map(item => item.data));
      };
      request.onerror = () => reject(request.error);
    });
  }

  async cleanup(storeName: string, maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    if (!this.db) await this.init();

    const cutoffTime = Date.now() - maxAge;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const index = store.index('timestamp');
      const range = IDBKeyRange.upperBound(cutoffTime);

      const request = index.openCursor(range);

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }
}

export const indexedDBService = new IndexedDBService();
export default indexedDBService;