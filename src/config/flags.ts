/**
 * 🚩 FEATURE FLAGS
 * 
 * Centralized feature flags for controlled feature rollout
 * and A/B testing capabilities.
 * 
 * ⭐ CANONICAL SERVICES MIGRATION FLAGS (Fase 1)
 * Flags para controlar migração gradual para serviços canônicos
 * conforme plano de consolidação 239 → 35 serviços
 */

export const featureFlags = {
  // ============================================================================
  // 🎯 CANONICAL SERVICES - PADRÃO OFICIAL (Fase 3)
  // ============================================================================
  
  /**
   * Flag global de rollback para serviços canônicos.
   * 
   * ⚠️ USO DE EMERGÊNCIA APENAS ⚠️
   * 
   * Quando true: força o uso de serviços legados mesmo que os canônicos estejam prontos
   * Quando false: usa serviços canônicos como padrão (comportamento normal)
   * 
   * 🎯 FASE 3: Rollback controlado para emergências
   * Esta flag inverte o modelo: canônicos são o padrão, legados são fallback
   * 
   * @default false (canônicos são o padrão)
   * @phase Fase 3 - Deprecação Forte
   */
  DISABLE_CANONICAL_SERVICES_GLOBAL: false,
  
  /**
   * Usar TemplateService canônico ao invés de serviços legados
   * 
   * Quando true: usa src/services/canonical/TemplateService.ts
   * Quando false: usa serviços legados (UnifiedTemplateRegistry, etc)
   * 
   * 🎯 FASE 3: PADRÃO OFICIAL - Habilitado para todos
   * 
   * @default true (padrão oficial)
   * @phase Fase 3 - Deprecação Forte
   */
  USE_CANONICAL_TEMPLATE_SERVICE: true,
  
  /**
   * Use canonical FunnelService instead of legacy services
   * 
   * When true: uses src/services/canonical/FunnelService.ts
   * When false: uses legacy services (FunnelUnifiedService, etc)
   * 
   * 🎯 PHASE 3: Planned for next iteration
   * 
   * @default false (still in migration)
   * @phase Phase 2 - Progressive Migration
   */
  USE_CANONICAL_FUNNEL_SERVICE: false,
  
  /**
   * Use canonical StorageService instead of legacy services
   * 
   * When true: uses src/services/canonical/StorageService.ts
   * When false: uses legacy services (LocalStorageService, etc)
   * 
   * 🎯 PHASE 3: Planned for next iteration
   * 
   * @default false (still in migration)
   * @phase Phase 2 - Progressive Migration
   */
  USE_CANONICAL_STORAGE_SERVICE: false,
  
  /**
   * Use canonical CacheService instead of direct access
   * 
   * When true: uses src/services/canonical/CacheService.ts
   * When false: uses localStorage/sessionStorage directly
   * 
   * 🎯 PHASE 3: Planned for next iteration
   * 
   * @default false (still in migration)
   * @phase Phase 2 - Progressive Migration
   */
  USE_CANONICAL_CACHE_SERVICE: false,
  
  // ============================================================================
  // 🔄 FONTE ÚNICA DE VERDADE - SUPABASE + REACT QUERY (Fase 3)
  // ============================================================================
  
  /**
   * Usar React Query hooks para templates ao invés de cache local
   * 
   * Quando true: usa useTemplate/useUpdateTemplate hooks
   * Quando false: usa TemplateService com cache interno
   * 
   * 🎯 FASE 3: PADRÃO OFICIAL - Habilitado para todos
   * React Query é agora a fonte única de verdade para templates
   * 
   * @default true (padrão oficial)
   * @phase Fase 3 - Deprecação Forte
   */
  USE_REACT_QUERY_TEMPLATES: true,
  
  /**
   * Use React Query hooks for funnels instead of local cache
   * 
   * When true: uses useFunnel/useUpdateFunnel hooks
   * When false: uses FunnelService with internal cache
   * 
   * 🎯 PHASE 3: Planned for next iteration
   * 
   * @default false (still in migration)
   * @phase Phase 2 - Progressive Migration
   */
  USE_REACT_QUERY_FUNNELS: false,
  
  // ============================================================================
  // 📦 EDITOR FEATURES
  // ============================================================================
  ENABLE_ADVANCED_EDITOR: true,
  ENABLE_TEMPLATE_IMPORT: true,
  ENABLE_TEMPLATE_EXPORT: true,
  ENABLE_BLOCK_REORDERING: true,
  
  // ============================================================================
  // 📊 ANALYTICS AND TRACKING
  // ============================================================================
  ENABLE_ANALYTICS: false,
  ENABLE_PERFORMANCE_MONITORING: true,
  ENABLE_ERROR_TRACKING: true,
  
  // ============================================================================
  // 👥 COLLABORATION FEATURES
  // ============================================================================
  ENABLE_COLLABORATION: false,
  ENABLE_REAL_TIME_SYNC: false,
  
  // ============================================================================
  // 🛠️ DEVELOPMENT AND DEBUGGING
  // ============================================================================
  DEBUG_MODE: process.env.NODE_ENV === 'development',
  ENABLE_CONSOLE_LOGS: process.env.NODE_ENV === 'development',
  ENABLE_REDUX_DEVTOOLS: process.env.NODE_ENV === 'development',
  
  // ============================================================================
  // 🌐 API AND DATA SOURCE PREFERENCES
  // ============================================================================
  PREFER_BUILT_IN_TEMPLATES: true,
  ENABLE_SUPABASE_SYNC: true,
  ENABLE_OFFLINE_MODE: false,
} as const;

export type FeatureFlags = typeof featureFlags;

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  return featureFlags[flag] === true;
}

/**
 * Get feature flag value
 */
export function getFeatureFlag<K extends keyof FeatureFlags>(
  flag: K
): FeatureFlags[K] {
  return featureFlags[flag];
}
