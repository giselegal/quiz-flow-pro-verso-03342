/**
 * 🔄 REDIRECT: TemplatesCacheService → UnifiedCacheService
 * 
 * @deprecated Use @/services/unified/UnifiedCacheService
 */

export { unifiedCacheService as templatesCacheService } from '@/services/unified/UnifiedCacheService';
export type { CacheConfig, CacheStats } from '@/services/unified/UnifiedCacheService';

if (typeof window !== 'undefined') {
  console.warn('[DEPRECATED] TemplatesCacheService → use @/services/unified/UnifiedCacheService');
}
