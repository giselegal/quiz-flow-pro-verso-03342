/**
 * 🔄 CACHE MIGRATION ADAPTERS - FASE 2.1
 * 
 * Adaptadores temporários para manter compatibilidade durante migração
 * Redirecionam chamadas antigas para UnifiedCacheService
 * 
 * SERÁ REMOVIDO: Após migração completa (2 semanas)
 */

import { cacheService, CacheStore } from './UnifiedCacheService';

/**
 * @deprecated Use cacheService.get/set('configs', key, value) instead
 */
export class ConfigurationCache {
  get<T>(key: string): T | null {
    console.warn('⚠️ ConfigurationCache is deprecated. Use UnifiedCacheService instead.');
    return cacheService.get<T>('configs', key);
  }

  set<T>(key: string, data: T, ttl?: number): void {
    console.warn('⚠️ ConfigurationCache is deprecated. Use UnifiedCacheService instead.');
    cacheService.set('configs', key, data, ttl);
  }

  has(key: string): boolean {
    return cacheService.has('configs', key);
  }

  delete(key: string): void {
    cacheService.delete('configs', key);
  }

  clear(): void {
    cacheService.clearStore('configs');
  }

  getStats() {
    return cacheService.getStoreStats('configs');
  }
}

/**
 * @deprecated Use cacheService directly instead
 */
export const configurationCache = new ConfigurationCache();

/**
 * @deprecated Use cacheService.get/set('blocks', key, value) instead
 */
export class EditorCacheService {
  private static instance: EditorCacheService;

  static getInstance(): EditorCacheService {
    console.warn('⚠️ EditorCacheService is deprecated. Use UnifiedCacheService instead.');
    if (!EditorCacheService.instance) {
      EditorCacheService.instance = new EditorCacheService();
    }
    return EditorCacheService.instance;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    cacheService.set('blocks', key, data, ttl);
  }

  get<T>(key: string): T | null {
    return cacheService.get<T>('blocks', key);
  }

  invalidate(key: string): void {
    cacheService.delete('blocks', key);
  }

  invalidateByPrefix(prefix: string): void {
    cacheService.invalidateByPrefix('blocks', prefix);
  }

  clear(): void {
    cacheService.clearStore('blocks');
  }

  getStats() {
    return cacheService.getStoreStats('blocks');
  }
}

/**
 * Helper para criar TEMPLATE_CACHE inline (compatibilidade)
 * @deprecated Use cacheService.get/set('templates', key, value) instead
 */
export function createTemplateCacheAdapter() {
  console.warn('⚠️ TEMPLATE_CACHE is deprecated. Use UnifiedCacheService instead.');
  
  return {
    has(key: string | number): boolean {
      const normalizedKey = typeof key === 'number' ? `step-${key}` : key;
      return cacheService.has('templates', normalizedKey);
    },
    
    get<T>(key: string | number): T | undefined {
      const normalizedKey = typeof key === 'number' ? `step-${key}` : key;
      const value = cacheService.get<T>('templates', normalizedKey);
      return value ?? undefined;
    },
    
    set(key: string | number, value: any): void {
      const normalizedKey = typeof key === 'number' ? `step-${key}` : key;
      cacheService.set('templates', normalizedKey, value);
    },
    
    delete(key: string | number): boolean {
      const normalizedKey = typeof key === 'number' ? `step-${key}` : key;
      return cacheService.delete('templates', normalizedKey);
    },
    
    clear(): void {
      cacheService.clearStore('templates');
    },
    
    get size(): number {
      return cacheService.getStoreStats('templates').size;
    },
  };
}

/**
 * Helper para criar FUNNEL_TEMPLATE_CACHE inline (compatibilidade)
 * @deprecated Use cacheService.get/set('funnels', key, value) instead
 */
export function createFunnelCacheAdapter() {
  console.warn('⚠️ FUNNEL_TEMPLATE_CACHE is deprecated. Use UnifiedCacheService instead.');
  
  return {
    has(key: string): boolean {
      return cacheService.has('funnels', key);
    },
    
    get<T>(key: string): T | undefined {
      const value = cacheService.get<T>('funnels', key);
      return value ?? undefined;
    },
    
    set(key: string, value: any): void {
      cacheService.set('funnels', key, value);
    },
    
    delete(key: string): boolean {
      return cacheService.delete('funnels', key);
    },
    
    clear(): void {
      cacheService.clearStore('funnels');
    },
    
    get size(): number {
      return cacheService.getStoreStats('funnels').size;
    },
  };
}
