/**
 * 🚩 FEATURE FLAGS
 * 
 * Centralized feature flags for controlled feature rollout
 * and A/B testing capabilities.
 */

export const featureFlags = {
  // Editor features
  ENABLE_ADVANCED_EDITOR: true,
  ENABLE_TEMPLATE_IMPORT: true,
  ENABLE_TEMPLATE_EXPORT: true,
  ENABLE_BLOCK_REORDERING: true,
  
  // Analytics and tracking
  ENABLE_ANALYTICS: false,
  ENABLE_PERFORMANCE_MONITORING: true,
  ENABLE_ERROR_TRACKING: true,
  
  // Collaboration features
  ENABLE_COLLABORATION: false,
  ENABLE_REAL_TIME_SYNC: false,
  
  // Development and debugging
  DEBUG_MODE: process.env.NODE_ENV === 'development',
  ENABLE_CONSOLE_LOGS: process.env.NODE_ENV === 'development',
  ENABLE_REDUX_DEVTOOLS: process.env.NODE_ENV === 'development',
  
  // API and data source preferences
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
