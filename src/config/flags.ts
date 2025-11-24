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
  // 🎯 CANONICAL SERVICES - MIGRAÇÃO GRADUAL (Fase 1)
  // ============================================================================
  
  /**
   * Usar TemplateService canônico ao invés de serviços legados
   * 
   * Quando true: usa src/services/canonical/TemplateService.ts
   * Quando false: usa serviços legados (UnifiedTemplateRegistry, etc)
   * 
   * @default false (rollout gradual)
   * @phase Fase 1 - Fundação
   */
  USE_CANONICAL_TEMPLATE_SERVICE: false,
  
  /**
   * Usar FunnelService canônico ao invés de serviços legados
   * 
   * Quando true: usa src/services/canonical/FunnelService.ts
   * Quando false: usa serviços legados (FunnelUnifiedService, etc)
   * 
   * @default false (rollout gradual)
   * @phase Fase 1 - Fundação
   */
  USE_CANONICAL_FUNNEL_SERVICE: false,
  
  /**
   * Usar StorageService canônico ao invés de serviços legados
   * 
   * Quando true: usa src/services/canonical/StorageService.ts
   * Quando false: usa serviços legados (LocalStorageService, etc)
   * 
   * @default false (rollout gradual)
   * @phase Fase 1 - Fundação
   */
  USE_CANONICAL_STORAGE_SERVICE: false,
  
  /**
   * Usar CacheService canônico ao invés de acessos diretos
   * 
   * Quando true: usa src/services/canonical/CacheService.ts
   * Quando false: usa localStorage/sessionStorage direto
   * 
   * @default false (rollout gradual)
   * @phase Fase 1 - Fundação
   */
  USE_CANONICAL_CACHE_SERVICE: false,
  
  // ============================================================================
  // 🔄 FONTE ÚNICA DE VERDADE - SUPABASE + REACT QUERY (Fase 1)
  // ============================================================================
  
  /**
   * Usar React Query hooks para templates ao invés de cache local
   * 
   * Quando true: usa useTemplate/useUpdateTemplate hooks
   * Quando false: usa TemplateService com cache interno
   * 
   * @default false (rollout gradual)
   * @phase Fase 1 - Fundação
   */
  USE_REACT_QUERY_TEMPLATES: false,
  
  /**
   * Usar React Query hooks para funnels ao invés de cache local
   * 
   * Quando true: usa useFunnel/useUpdateFunnel hooks
   * Quando false: usa FunnelService com cache interno
   * 
   * @default false (rollout gradual)
   * @phase Fase 1 - Fundação
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
