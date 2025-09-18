import { devLog } from './editorUtils';

interface StorageQuotaInfo {
  quota: number;
  usage: number;
  available: number;
  usagePercentage: number;
}

export interface CompressedData {
  compressed: boolean;
  originalSize: number;
  compressedSize: number;
  timestamp: number;
  data: string;
}

/**
 * Sistema de otimização de LocalStorage com compressão e limpeza automática
 */
export class StorageOptimizer {
  private static instance: StorageOptimizer;
  private compressionThreshold = 1024; // 1KB
  private maxAge = 7 * 24 * 60 * 60 * 1000; // 7 dias
  private quotaThreshold = 0.8; // 80% da quota

  static getInstance(): StorageOptimizer {
    if (!StorageOptimizer.instance) {
      StorageOptimizer.instance = new StorageOptimizer();
    }
    return StorageOptimizer.instance;
  }

  /**
   * Obtém informações sobre a quota de armazenamento
   */
  async getStorageQuota(): Promise<StorageQuotaInfo> {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const quota = estimate.quota || 0;
        const usage = estimate.usage || 0;
        const available = quota - usage;
        const usagePercentage = quota > 0 ? (usage / quota) * 100 : 0;

        return {
          quota,
          usage,
          available,
          usagePercentage,
        };
      }
    } catch (error) {
      devLog('Error getting storage quota:', error);
    }

    // Fallback estimation
    const used = this.estimateLocalStorageSize();
    const estimatedQuota = 10 * 1024 * 1024; // 10MB estimate
    
    return {
      quota: estimatedQuota,
      usage: used,
      available: estimatedQuota - used,
      usagePercentage: (used / estimatedQuota) * 100,
    };
  }

  /**
   * Estima o tamanho usado no localStorage
   */
  private estimateLocalStorageSize(): number {
    let total = 0;
    try {
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
    } catch (error) {
      devLog('Error estimating localStorage size:', error);
    }
    return total * 2; // UTF-16 encoding
  }

  /**
   * Comprime dados usando algoritmo simples
   */
  private compress(data: string): string {
    try {
      // Compressão simples usando RLE (Run Length Encoding) para strings repetitivas
      return data.replace(/(.)\1{2,}/g, (match, char) => {
        return `${char}${match.length}${char}`;
      });
    } catch (error) {
      devLog('Compression failed:', error);
      return data;
    }
  }

  /**
   * Descomprime dados
   */
  private decompress(data: string): string {
    try {
      // Descompressão do RLE
      return data.replace(/(.)\d+\1/g, (match, char) => {
        const num = parseInt(match.slice(1, -1));
        return char.repeat(num);
      });
    } catch (error) {
      devLog('Decompression failed:', error);
      return data;
    }
  }

  /**
   * Salva dados no localStorage com compressão automática
   */
  async setItem(key: string, value: any): Promise<boolean> {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      const originalSize = stringValue.length;
      
      let finalData: CompressedData;
      
      if (originalSize > this.compressionThreshold) {
        const compressed = this.compress(stringValue);
        const compressedSize = compressed.length;
        
        if (compressedSize < originalSize * 0.9) { // Only use compression if saves >10%
          finalData = {
            compressed: true,
            originalSize,
            compressedSize,
            timestamp: Date.now(),
            data: compressed,
          };
        } else {
          finalData = {
            compressed: false,
            originalSize,
            compressedSize: originalSize,
            timestamp: Date.now(),
            data: stringValue,
          };
        }
      } else {
        finalData = {
          compressed: false,
          originalSize,
          compressedSize: originalSize,
          timestamp: Date.now(),
          data: stringValue,
        };
      }

      // Check quota before saving
      const quota = await this.getStorageQuota();
      if (quota.usagePercentage > this.quotaThreshold * 100) {
        await this.cleanup();
      }

      localStorage.setItem(key, JSON.stringify(finalData));
      
      if (process.env.NODE_ENV === 'development') {
        devLog(`Storage optimized save: ${key}`, {
          originalSize,
          finalSize: finalData.compressedSize,
          compressed: finalData.compressed,
          savings: originalSize > 0 ? Math.round((1 - finalData.compressedSize / originalSize) * 100) : 0,
        });
      }
      
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  }

  /**
   * Obtém dados do localStorage com descompressão automática
   */
  getItem(key: string): any {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      try {
        const parsed: CompressedData = JSON.parse(item);
        
        if (parsed && typeof parsed === 'object' && 'compressed' in parsed) {
          let data = parsed.data;
          
          if (parsed.compressed) {
            data = this.decompress(data);
          }
          
          // Try to parse as JSON, fallback to string
          try {
            return JSON.parse(data);
          } catch {
            return data;
          }
        } else {
          // Legacy data without compression
          return parsed;
        }
      } catch {
        // Fallback for plain string data
        return item;
      }
    } catch (error) {
      console.error('Failed to get from localStorage:', error);
      return null;
    }
  }

  /**
   * Remove itens antigos para liberar espaço
   */
  async cleanup(): Promise<number> {
    let cleaned = 0;
    const now = Date.now();
    
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        
        try {
          const item = localStorage.getItem(key);
          if (!item) continue;
          
          const parsed: CompressedData = JSON.parse(item);
          
          if (parsed && typeof parsed === 'object' && 'timestamp' in parsed) {
            const age = now - parsed.timestamp;
            
            if (age > this.maxAge) {
              keysToRemove.push(key);
            }
          }
        } catch {
          // Skip items that aren't in our format
          continue;
        }
      }
      
      // Remove old items
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        cleaned++;
      });
      
      if (cleaned > 0 && process.env.NODE_ENV === 'development') {
        devLog(`Storage cleanup: removed ${cleaned} old items`);
      }
      
      // If still over quota, remove oldest items regardless of age
      const quota = await this.getStorageQuota();
      if (quota.usagePercentage > this.quotaThreshold * 100) {
        const items: Array<{ key: string; timestamp: number }> = [];
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key) continue;
          
          try {
            const item = localStorage.getItem(key);
            if (!item) continue;
            
            const parsed: CompressedData = JSON.parse(item);
            if (parsed && typeof parsed === 'object' && 'timestamp' in parsed) {
              items.push({ key, timestamp: parsed.timestamp });
            }
          } catch {
            continue;
          }
        }
        
        // Sort by oldest first
        items.sort((a, b) => a.timestamp - b.timestamp);
        
        // Remove oldest 25% of items
        const toRemove = Math.ceil(items.length * 0.25);
        for (let i = 0; i < toRemove; i++) {
          localStorage.removeItem(items[i].key);
          cleaned++;
        }
        
        if (toRemove > 0 && process.env.NODE_ENV === 'development') {
          devLog(`Storage emergency cleanup: removed ${toRemove} oldest items`);
        }
      }
      
    } catch (error) {
      console.error('Storage cleanup failed:', error);
    }
    
    return cleaned;
  }

  /**
   * Remove um item específico
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  /**
   * Obtém estatísticas de uso do storage
   */
  async getStorageStats(): Promise<{
    quota: StorageQuotaInfo;
    itemCount: number;
    compressedItems: number;
    totalSavings: number;
  }> {
    const quota = await this.getStorageQuota();
    let itemCount = 0;
    let compressedItems = 0;
    let totalSavings = 0;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        
        try {
          const item = localStorage.getItem(key);
          if (!item) continue;
          
          const parsed: CompressedData = JSON.parse(item);
          if (parsed && typeof parsed === 'object' && 'compressed' in parsed) {
            itemCount++;
            if (parsed.compressed) {
              compressedItems++;
              totalSavings += parsed.originalSize - parsed.compressedSize;
            }
          }
        } catch {
          itemCount++; // Count legacy items too
        }
      }
    } catch (error) {
      console.error('Failed to get storage stats:', error);
    }

    return {
      quota,
      itemCount,
      compressedItems,
      totalSavings,
    };
  }
}

// Export singleton instance
export const storageOptimizer = StorageOptimizer.getInstance();

// Export utility functions
export const optimizedStorage = {
  setItem: (key: string, value: any) => storageOptimizer.setItem(key, value),
  getItem: (key: string) => storageOptimizer.getItem(key),
  removeItem: (key: string) => storageOptimizer.removeItem(key),
  cleanup: () => storageOptimizer.cleanup(),
  getStats: () => storageOptimizer.getStorageStats(),
};