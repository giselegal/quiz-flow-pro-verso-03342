// Services Index
// Legacy services - will be migrated to feature-specific locations

export * from './funnelService';
// quizService moved to deprecated - use quizDataService or quizSupabaseService instead
export * from './templateService';

// TODO: Migrate remaining services to appropriate features

// ============================================================================
// Unified Services (Phase 1 - Consolidation)
// ============================================================================

// Template & Block Services
// NavigationService moved to canonical - use: import { navigationService } from '@/services/canonical/NavigationService';
export { TemplateRegistry } from './TemplateRegistry';
export { UnifiedTemplateRegistry } from './UnifiedTemplateRegistry';

// Cache Services
export { UnifiedCacheService } from './UnifiedCacheService';

// Storage Services
// UnifiedStorageService removed - use canonical/StorageService instead

// Configuration Services
// STUB: Legacy import - needs refactoring
// export { SupabaseConfigurationStorage } from './SupabaseConfigurationStorage';

// Quiz Navigation Configuration
export {
  QUIZ_NAV_CONFIG,
  QUIZ_STRUCTURE,
  getConfiguredNextStep,
  isOptionalStep,
  getEnabledSteps,
  isStepEnabled,
} from '../config/quizNavigation';

// Types
// NavigationService types moved to canonical
export type {
  StepNavigationInfo,
  NavigationMap,
  NavigationValidationResult,
  NavigationGraph,
} from './canonical/NavigationService';
