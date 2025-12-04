/**
 * 🎯 CACHE CONSOLIDATION INDEX - FASE 3
 * 
 * Este arquivo exporta todas as interfaces de cache consolidadas.
 * 
 * ARQUITETURA DE CACHE CONSOLIDADA:
 * ================================
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │                    CANONICAL API                            │
 * │           cacheService (CacheService)                       │
 * │        Facade única para todas as operações                 │
 * └─────────────────────────────────────────────────────────────┘
 *                           │
 *                           ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │              MultiLayerCacheStrategy                        │
 * │     3 camadas: L1 Memory, L2 Session, L3 IndexedDB         │
 * └─────────────────────────────────────────────────────────────┘
 *          │              │              │
 *          ▼              ▼              ▼
 *     ┌────────┐    ┌───────────┐   ┌────────────┐
 *     │   L1   │    │    L2     │   │     L3     │
 *     │ Memory │    │ Session   │   │ IndexedDB  │
 *     │ (LRU)  │    │ Storage   │   │ Persistent │
 *     └────────┘    └───────────┘   └────────────┘
 * 
 * USO RECOMENDADO:
 * ```typescript
 * // ✅ CORRETO - Usar cacheService
 * import { cacheService } from '@/services/cache';
 * 
 * cacheService.templates.set('step-01', blocks);
 * const data = cacheService.templates.get('step-01');
 * 
 * // ✅ CORRETO - Usar multiLayerCache para operações avançadas
 * import { multiLayerCache } from '@/services/cache';
 * 
 * await multiLayerCache.set('templates', 'step-01', blocks, 600000);
 * const metrics = multiLayerCache.getMetrics();
 * ```
 * 
 * SISTEMAS DEPRECADOS (redirecionar para acima):
 * - HybridCacheStrategy → multiLayerCache
 * - UnifiedTemplateCache → cacheService.templates
 * - unifiedCache → cacheService
 */

// ==================== CANONICAL EXPORTS ====================

// Facade principal - use para operações de cache normais
export { cacheService, CacheService } from '@/services/canonical/CacheService';
export type { CacheStore, CacheStats, CacheSetOptions } from '@/services/canonical/CacheService';

// MultiLayer Strategy - use para operações avançadas e métricas
export { multiLayerCache, MultiLayerCacheStrategy } from '@/services/core/MultiLayerCacheStrategy';

// IndexedDB Cache (L3) - normalmente não usar diretamente
export { indexedDBCache } from '@/services/core/IndexedDBCache';

// ==================== HOOKS ====================

export { useUnifiedCache, useCacheMetrics, useStepCache } from '@/hooks/useUnifiedCache';

// ==================== DEPRECATED EXPORTS ====================
// Mantidos para compatibilidade - migrar para exports acima

/** @deprecated Use cacheService */
export { unifiedCacheService, unifiedCache } from '@/services/unified/UnifiedCacheService';

/** @deprecated Use multiLayerCache */
export { HybridCacheStrategy } from '@/services/core/HybridCacheStrategy';

/** @deprecated Use cacheService.templates */
export { UnifiedTemplateCache, unifiedCache as templateCache } from '@/lib/utils/UnifiedTemplateCache';
