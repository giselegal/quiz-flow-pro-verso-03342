/**
 * 🎯 SERVIÇO DE CACHE DE RESULTADOS - PHASE 1
 * 
 * Implementa cache inteligente para evitar recálculos desnecessários
 * dos resultados do quiz, resolvendo o gargalo de cálculos redundantes.
 */

import { StorageService } from './StorageService';

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
  private readonly CACHE_KEY = 'quizResultCache';
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos
  private readonly DEFAULT_MAX_SIZE = 10;

  /**
   * Obtém resultado do cache se válido
   */
  get(selectionsByQuestion: Record<string, string[]>, userName?: string): any | null {
    try {
      const cache = this.loadCache();
      const selectionsHash = this.generateHash(selectionsByQuestion);
      const cacheKey = this.generateCacheKey(selectionsHash, userName);
      
      const entry = cache[cacheKey];
      if (!entry) {
        console.log('🔍 Cache miss - entrada não encontrada');
        return null;
      }

      // Verificar TTL
      const now = Date.now();
      if (now - entry.timestamp > this.DEFAULT_TTL) {
        console.log('🕐 Cache miss - entrada expirada');
        this.remove(cacheKey);
        return null;
      }

      console.log('✅ Cache hit - resultado recuperado do cache');
      return entry.result;
    } catch (error) {
      console.warn('⚠️ Erro ao recuperar do cache:', error);
      return null;
    }
  }

  /**
   * Armazena resultado no cache
   */
  set(
    selectionsByQuestion: Record<string, string[]>, 
    result: any, 
    userName?: string,
    options: CacheOptions = {}
  ): boolean {
    try {
      const cache = this.loadCache();
      const selectionsHash = this.generateHash(selectionsByQuestion);
      const cacheKey = this.generateCacheKey(selectionsHash, userName);

      const entry: CacheEntry = {
        result,
        timestamp: Date.now(),
        selectionsHash,
        userName
      };

      cache[cacheKey] = entry;

      // Limpar cache se exceder tamanho máximo
      this.cleanupCache(cache, options.maxSize || this.DEFAULT_MAX_SIZE);

      // Salvar cache atualizado
      const success = StorageService.safeSetJSON(this.CACHE_KEY, cache);
      
      if (success) {
        console.log('💾 Resultado armazenado no cache');
      }
      
      return success;
    } catch (error) {
      console.warn('⚠️ Erro ao armazenar no cache:', error);
      return false;
    }
  }

  /**
   * Remove entrada específica do cache
   */
  remove(cacheKey: string): boolean {
    try {
      const cache = this.loadCache();
      delete cache[cacheKey];
      return StorageService.safeSetJSON(this.CACHE_KEY, cache);
    } catch (error) {
      console.warn('⚠️ Erro ao remover do cache:', error);
      return false;
    }
  }

  /**
   * Limpa todo o cache
   */
  clear(): boolean {
    try {
      return StorageService.safeRemove(this.CACHE_KEY);
    } catch (error) {
      console.warn('⚠️ Erro ao limpar cache:', error);
      return false;
    }
  }

  /**
   * Verifica se existe entrada válida no cache
   */
  has(selectionsByQuestion: Record<string, string[]>, userName?: string): boolean {
    return this.get(selectionsByQuestion, userName) !== null;
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
        entry => now - entry.timestamp <= this.DEFAULT_TTL
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
          : null
      };
    } catch (error) {
      console.warn('⚠️ Erro ao obter estatísticas do cache:', error);
      return {
        totalEntries: 0,
        validEntries: 0,
        expiredEntries: 0,
        cacheSize: 0,
        oldestEntry: null,
        newestEntry: null
      };
    }
  }

  // ===== MÉTODOS PRIVADOS =====

  private loadCache(): Record<string, CacheEntry> {
    return StorageService.safeGetJSON<Record<string, CacheEntry>>(this.CACHE_KEY) || {};
  }

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
        ([, a], [, b]) => a.timestamp - b.timestamp
      );
      
      const toRemove = sortedByAge.slice(0, remainingEntries.length - maxSize);
      toRemove.forEach(([key]) => delete cache[key]);
    }
  }
}

export const resultCacheService = new ResultCacheService();
export default resultCacheService;