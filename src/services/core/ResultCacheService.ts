/**
 * 🎯 SERVIÇO DE CACHE DE RESULTADOS - PHASE 1
 * 
 * Implementa cache inteligente para evitar recálculos desnecessários
 * dos resultados do quiz, resolvendo o gargalo de cálculos redundantes.
 */

import { appLogger } from '@/lib/utils/appLogger';
import { multiLayerCache } from './MultiLayerCacheStrategy';
import type { CacheStore } from '../canonical/CacheService';

interface CacheEntry {
  result: any;
  timestamp: number;
  selectionsHash: string;
  userName?: string;
}

interface CacheOptions {
  ttl?: number; // Time to live em milissegundos (default: 5 minutos)
  maxSize?: number; // Máximo de entradas no cache (default: 10)
}

class ResultCacheService {
  private readonly STORE: CacheStore = 'results';
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

  /**
   * Obtém resultado do cache se válido
   */
  async get(selectionsByQuestion: Record<string, string[]>, userName?: string): Promise<any | null> {
    try {
      const selectionsHash = this.generateHash(selectionsByQuestion);
      const cacheKey = this.generateCacheKey(selectionsHash, userName);
      const entry = await multiLayerCache.get<CacheEntry>(this.STORE, cacheKey);
      if (!entry) {
        appLogger.info('🔍 Cache miss - entrada não encontrada');
        return null;
      }
      const now = Date.now();
      if (now - entry.timestamp > this.DEFAULT_TTL) {
        appLogger.info('🕐 Cache miss - entrada expirada');
        await this.remove(cacheKey);
        return null;
      }
      appLogger.info('✅ Cache hit - resultado recuperado do cache');
      return entry.result;
    } catch (error) {
      appLogger.warn('⚠️ Erro ao recuperar do cache:', { data: [error] });
      return null;
    }
  }

  /**
   * Armazena resultado no cache
   */
  async set(
    selectionsByQuestion: Record<string, string[]>, 
    result: any, 
    userName?: string,
    options: CacheOptions = {},
  ): Promise<boolean> {
    try {
      const selectionsHash = this.generateHash(selectionsByQuestion);
      const cacheKey = this.generateCacheKey(selectionsHash, userName);
      const entry: CacheEntry = {
        result,
        timestamp: Date.now(),
        selectionsHash,
        userName,
      };
      await multiLayerCache.set(this.STORE, cacheKey, entry, options.ttl ?? this.DEFAULT_TTL);
      appLogger.info('💾 Resultado armazenado no cache (L1+L2+L3)');
      return true;
    } catch (error) {
      appLogger.warn('⚠️ Erro ao armazenar no cache:', { data: [error] });
      return false;
    }
  }

  /**
   * Remove entrada específica do cache
   */
  async remove(cacheKey: string): Promise<boolean> {
    try {
      await multiLayerCache.delete(this.STORE, cacheKey);
      return true;
    } catch (error) {
      appLogger.warn('⚠️ Erro ao remover do cache:', { data: [error] });
      return false;
    }
  }

  /**
   * Limpa todo o cache
   */
  async clear(): Promise<boolean> {
    try {
      await multiLayerCache.clearStore(this.STORE);
      return true;
    } catch (error) {
      appLogger.warn('⚠️ Erro ao limpar cache:', { data: [error] });
      return false;
    }
  }

  /**
   * Verifica se existe entrada válida no cache
   */
  async has(selectionsByQuestion: Record<string, string[]>, userName?: string): Promise<boolean> {
    return (await this.get(selectionsByQuestion, userName)) !== null;
  }

  /**
   * Obtém estatísticas do cache
   */
  getStats() {
    try {
      const cache = this.loadCache();
      const entries = Object.values(cache);
      const now = Date.now();
      
      const validEntries = entries.filter(
        entry => now - entry.timestamp <= this.DEFAULT_TTL,
      );

      return {
        totalEntries: entries.length,
        validEntries: validEntries.length,
        expiredEntries: entries.length - validEntries.length,
        cacheSize: JSON.stringify(cache).length,
        oldestEntry: entries.length > 0 
          ? Math.min(...entries.map(e => e.timestamp))
          : null,
        newestEntry: entries.length > 0 
          ? Math.max(...entries.map(e => e.timestamp))
          : null,
      };
    } catch (error) {
      appLogger.warn('⚠️ Erro ao obter estatísticas do cache:', { data: [error] });
      return {
        totalEntries: 0,
        validEntries: 0,
        expiredEntries: 0,
        cacheSize: 0,
        oldestEntry: null,
        newestEntry: null,
      };
    }
  }

  // ===== MÉTODOS PRIVADOS =====

  // storage-based cache removido em favor do multiLayerCache

  private generateHash(data: Record<string, string[]>): string {
    // Criar hash simples baseado nas chaves e valores das seleções
    const sortedKeys = Object.keys(data).sort();
    const combined = sortedKeys.map(key => {
      const values = data[key] || [];
      return `${key}:${values.sort().join(',')}`;
    }).join('|');
    
    // Hash simples para browser compatibility
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private generateCacheKey(selectionsHash: string, userName?: string): string {
    return userName 
      ? `${selectionsHash}_${userName.toLowerCase().trim()}`
      : selectionsHash;
  }

  private cleanupCache(cache: Record<string, CacheEntry>, maxSize: number): void {
    const entries = Object.entries(cache);
    
    // Se não excedeu o limite, apenas remover entradas expiradas
    const now = Date.now();
    const expiredKeys = entries
      .filter(([, entry]) => now - entry.timestamp > this.DEFAULT_TTL)
      .map(([key]) => key);
    
    expiredKeys.forEach(key => delete cache[key]);

    // Se ainda excede o limite, remover as mais antigas
    const remainingEntries = Object.entries(cache);
    if (remainingEntries.length > maxSize) {
      const sortedByAge = remainingEntries.sort(
        ([, a], [, b]) => a.timestamp - b.timestamp,
      );
      
      const toRemove = sortedByAge.slice(0, remainingEntries.length - maxSize);
      toRemove.forEach(([key]) => delete cache[key]);
    }
  }
}

export const resultCacheService = new ResultCacheService();
export default resultCacheService;