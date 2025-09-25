/**
 * 🗃️ HYBRID STORAGE SERVICE - SISTEMA REAL RESTAURADO
 * 
 * Serviço híbrido que combina localStorage, IndexedDB e cache em memória
 * para máxima performance e persistência de dados do editor
 */

interface StorageItem {
  data: any;
  timestamp: number;
  ttl?: number;
}

interface HybridStorageConfig {
  useIndexedDB: boolean;
  useLocalStorage: boolean;
  memoryCache: boolean;
  defaultTTL: number;
}

class HybridStorageService {
  private memoryCache = new Map<string, StorageItem>();
  private indexedDBReady = false;
  private dbName = 'FunnelEditorDB';
  private dbVersion = 1;
  private storeName = 'templates';
  
  private config: HybridStorageConfig = {
    useIndexedDB: true,
    useLocalStorage: true,
    memoryCache: true,
    defaultTTL: 30 * 60 * 1000 // 30 minutos
  };

  /**
   * 🚀 INICIALIZAÇÃO DO SISTEMA HÍBRIDO
   */
  async init(): Promise<void> {
    console.log('🚀 Inicializando HybridStorageService...');
    
    if (this.config.useIndexedDB) {
      await this.initIndexedDB();
    }
    
    // Limpar cache expirado na inicialização
    this.cleanupExpiredCache();
    
    console.log('✅ HybridStorageService inicializado com sucesso');
  }

  /**
   * 🗄️ INICIALIZAR INDEXEDDB
   */
  private async initIndexedDB(): Promise<void> {
    try {
      return new Promise((resolve) => {
        const request = indexedDB.open(this.dbName, this.dbVersion);
        
        request.onerror = () => {
          console.warn('⚠️ IndexedDB não disponível, usando apenas localStorage');
          resolve();
        };
        
        request.onsuccess = () => {
          this.indexedDBReady = true;
          console.log('✅ IndexedDB inicializado');
          resolve();
        };
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, { keyPath: 'key' });
          }
        };
      });
    } catch (error) {
      console.warn('⚠️ Erro ao inicializar IndexedDB:', error);
    }
  }

  /**
   * 💾 SALVAR DADOS - ESTRATÉGIA HÍBRIDA
   */
  async saveData(key: string, data: any, ttl?: number): Promise<void> {
    const item: StorageItem = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL
    };

    // 1. Cache em memória (mais rápido)
    if (this.config.memoryCache) {
      this.memoryCache.set(key, item);
    }

    // 2. LocalStorage (compatibilidade)
    if (this.config.useLocalStorage) {
      try {
        localStorage.setItem(`funnel_${key}`, JSON.stringify(item));
      } catch (error) {
        console.warn('⚠️ Erro ao salvar no localStorage:', error);
      }
    }

    // 3. IndexedDB (persistência robusta)
    if (this.config.useIndexedDB && this.indexedDBReady) {
      try {
        await this.saveToIndexedDB(key, item);
      } catch (error) {
        console.warn('⚠️ Erro ao salvar no IndexedDB:', error);
      }
    }

    console.log(`💾 Dados salvos: ${key}`);
  }

  /**
   * 📥 CARREGAR DADOS - ESTRATÉGIA HÍBRIDA COM FALLBACKS
   */
  async loadData(key: string): Promise<any | null> {
    // 1. Verificar cache em memória primeiro
    if (this.config.memoryCache) {
      const cached = this.memoryCache.get(key);
      if (cached && this.isItemValid(cached)) {
        console.log(`⚡ Cache hit (memória): ${key}`);
        return cached.data;
      }
    }

    // 2. Verificar IndexedDB
    if (this.config.useIndexedDB && this.indexedDBReady) {
      try {
        const item = await this.loadFromIndexedDB(key);
        if (item && this.isItemValid(item)) {
          // Restaurar para cache em memória
          if (this.config.memoryCache) {
            this.memoryCache.set(key, item);
          }
          console.log(`💾 Carregado do IndexedDB: ${key}`);
          return item.data;
        }
      } catch (error) {
        console.warn('⚠️ Erro ao carregar do IndexedDB:', error);
      }
    }

    // 3. Fallback para localStorage
    if (this.config.useLocalStorage) {
      try {
        const stored = localStorage.getItem(`funnel_${key}`);
        if (stored) {
          const item: StorageItem = JSON.parse(stored);
          if (this.isItemValid(item)) {
            // Restaurar para cache em memória
            if (this.config.memoryCache) {
              this.memoryCache.set(key, item);
            }
            console.log(`📦 Carregado do localStorage: ${key}`);
            return item.data;
          }
        }
      } catch (error) {
        console.warn('⚠️ Erro ao carregar do localStorage:', error);
      }
    }

    console.log(`❌ Dados não encontrados: ${key}`);
    return null;
  }

  /**
   * 🗑️ DELETAR DADOS
   */
  async deleteData(key: string): Promise<void> {
    // Remover de todos os storages
    this.memoryCache.delete(key);
    
    try {
      localStorage.removeItem(`funnel_${key}`);
    } catch (error) {
      console.warn('⚠️ Erro ao remover do localStorage:', error);
    }

    if (this.indexedDBReady) {
      try {
        await this.deleteFromIndexedDB(key);
      } catch (error) {
        console.warn('⚠️ Erro ao remover do IndexedDB:', error);
      }
    }

    console.log(`🗑️ Dados removidos: ${key}`);
  }

  /**
   * 🧹 LIMPEZA DE CACHE
   */
  cleanup(): void {
    this.cleanupExpiredCache();
    console.log('🧹 Limpeza de cache executada');
  }

  // ========================
  // MÉTODOS PRIVADOS
  // ========================

  private async saveToIndexedDB(key: string, item: StorageItem): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        
        store.put({ key, ...item });
        
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  private async loadFromIndexedDB(key: string): Promise<StorageItem | null> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const getRequest = store.get(key);
        
        getRequest.onsuccess = () => {
          const result = getRequest.result;
          if (result) {
            const { key: _, ...item } = result;
            resolve(item as StorageItem);
          } else {
            resolve(null);
          }
        };
        
        getRequest.onerror = () => reject(getRequest.error);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  private async deleteFromIndexedDB(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        
        store.delete(key);
        
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  private isItemValid(item: StorageItem): boolean {
    if (!item.ttl) return true;
    return (Date.now() - item.timestamp) < item.ttl;
  }

  private cleanupExpiredCache(): void {
    const expired: string[] = [];
    
    this.memoryCache.forEach((item, key) => {
      if (!this.isItemValid(item)) {
        expired.push(key);
      }
    });
    
    expired.forEach(key => {
      this.memoryCache.delete(key);
    });
    
    if (expired.length > 0) {
      console.log(`🧹 Removidos ${expired.length} itens expirados do cache`);
    }
  }
}

// Instância singleton
const hybridStorageInstance = new HybridStorageService();

export const hybridStorage = {
  init: () => hybridStorageInstance.init(),
  saveData: (key: string, data: any, ttl?: number) => hybridStorageInstance.saveData(key, data, ttl),
  loadData: (key: string) => hybridStorageInstance.loadData(key),
  deleteData: (key: string) => hybridStorageInstance.deleteData(key),
  cleanup: () => hybridStorageInstance.cleanup()
};

export default hybridStorage;