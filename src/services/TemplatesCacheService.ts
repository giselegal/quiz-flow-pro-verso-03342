import { appLogger } from '@/lib/utils/appLogger';
import { multiLayerCache } from '@/services/core/MultiLayerCacheStrategy';
import type { CacheStore } from '@/services/canonical/CacheService';

/**
 * 🔄 REDIRECT: TemplatesCacheService → MultiLayerCacheStrategy
 * 
 * @deprecated Use `multiLayerCache` com store 'templates'
 */

export const TEMPLATES_STORE: CacheStore = 'templates';
export const templatesCache = {
  get: <T>(key: string) => multiLayerCache.get<T>(TEMPLATES_STORE, key),
  set: <T>(key: string, value: T, ttl?: number) => multiLayerCache.set(TEMPLATES_STORE, key, value, ttl),
  delete: (key: string) => multiLayerCache.delete(TEMPLATES_STORE, key),
  clear: () => multiLayerCache.clearStore(TEMPLATES_STORE),
};

export { multiLayerCache };

if (typeof window !== 'undefined') {
  appLogger.warn('[DEPRECATED] TemplatesCacheService → use MultiLayerCacheStrategy (store: templates)');
}
