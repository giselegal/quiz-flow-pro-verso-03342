/**
 * 🚩 FEATURE FLAGS
 * 
 * Centralized feature flags for controlled feature rollout
 * and A/B testing capabilities.
 * 
 * 🎯 PHASE 4 COMPLETE: All canonical services migration flags removed.
 * Canonical services are now permanent and the only supported path.
 * Legacy services and migration helpers have been removed.
 * 
 * For rollback if needed: revert this PR via Git, do not use runtime flags.
 */

export const featureFlags = {
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
