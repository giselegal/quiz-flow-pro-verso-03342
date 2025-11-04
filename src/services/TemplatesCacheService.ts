/**
 * 🔄 REDIRECT: TemplatesCacheService → UnifiedCacheService
 * 
 * @deprecated Use @/utils/UnifiedTemplateCache
 */

export { unifiedCache as templatesCacheService } from '@/utils/UnifiedTemplateCache';
export type { CacheConfig, CacheStats } from '@/utils/UnifiedTemplateCache';

if (typeof window !== 'undefined') {
  console.warn('[DEPRECATED] TemplatesCacheService → use @/utils/UnifiedTemplateCache');
}
