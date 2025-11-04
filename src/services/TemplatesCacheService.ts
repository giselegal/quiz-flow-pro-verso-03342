/**
 * 🔄 REDIRECT: TemplatesCacheService → UnifiedCacheService
 * 
 * @deprecated Use @/utils/UnifiedTemplateCache
 */

export { unifiedCache as templatesCacheService } from '@/utils/UnifiedTemplateCache';

if (typeof window !== 'undefined') {
  console.warn('[DEPRECATED] TemplatesCacheService → use @/utils/UnifiedTemplateCache');
}
