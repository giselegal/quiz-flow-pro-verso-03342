/**
 * 🗄️ EDITOR CACHE SERVICE - DEPRECATED
 * 
 * @deprecated Use UnifiedCacheService instead
 * @see /src/services/UnifiedCacheService.ts
 * 
 * Este arquivo será removido após migração completa (2 semanas)
 * Atualmente redireciona para UnifiedCacheService
 */

import { cacheService } from './UnifiedCacheService';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class EditorCacheService {
  private static instance: EditorCacheService;
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

  private constructor() {
    console.warn('⚠️ EditorCacheService is deprecated. Use UnifiedCacheService instead.');
  }

  static getInstance(): EditorCacheService {
    if (!EditorCacheService.instance) {
      EditorCacheService.instance = new EditorCacheService();
    }
    return EditorCacheService.instance;
  }

  /**
   * @deprecated Use cacheService.set('blocks', key, data, ttl)
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    cacheService.set('blocks', key, data, ttl);
  }

  /**
   * @deprecated Use cacheService.get('blocks', key)
   */
  get<T>(key: string): T | null {
    return cacheService.get<T>('blocks', key);
  }

  /**
   * @deprecated Use cacheService.invalidate('blocks', key)
   */
  invalidate(key: string): void {
    cacheService.invalidate('blocks', key);
  }

  /**
   * @deprecated Use cacheService.invalidateByPrefix('blocks', prefix)
   */
  invalidateByPrefix(prefix: string): void {
    cacheService.invalidateByPrefix('blocks', prefix);
  }

  /**
   * @deprecated Use cacheService.clearStore('blocks')
   */
  clear(): void {
    cacheService.clearStore('blocks');
  }

  /**
   * @deprecated Use cacheService.getStats()
   */
  getStats(): { size: number; keys: string[] } {
    const stats = cacheService.getStats();
    return {
      size: stats.stores.blocks.size,
      keys: [], // LRU não expõe keys diretamente
    };
  }

  /**
   * @deprecated Garbage collection agora é automático via LRU
   */
  gc(): number {
    console.warn('⚠️ gc() is deprecated. UnifiedCacheService uses automatic LRU eviction.');
    return 0;
  }
}

// Exporta instância singleton para compatibilidade
export const editorCacheService = EditorCacheService.getInstance();


// Export singleton
export const editorCache = EditorCacheService.getInstance();

// Auto GC a cada 2 minutos
if (typeof window !== 'undefined') {
  setInterval(() => {
    editorCache.gc();
  }, 2 * 60 * 1000);
}
