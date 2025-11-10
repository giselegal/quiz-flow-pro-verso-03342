import { appLogger } from '@/lib/utils/appLogger';
/**
 * 🔄 REDIRECT: TemplatesCacheService → UnifiedCacheService
 * 
 * @deprecated Use @/services/unified/UnifiedCacheService
 */

export { unifiedCacheService as unifiedCacheService } from '@/services/unified/UnifiedCacheService';
export type { CacheConfig, CacheStats } from '@/services/unified/UnifiedCacheService';

if (typeof window !== 'undefined') {
  appLogger.warn('[DEPRECATED] TemplatesCacheService → use @/services/unified/UnifiedCacheService');
}
