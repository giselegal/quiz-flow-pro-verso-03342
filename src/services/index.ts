// Services Index
// Legacy services - will be migrated to feature-specific locations

export * from './funnelService';
export * from './quizService';
export * from './templateService';

// TODO: Migrate remaining services to appropriate features

// ============================================================================
// Unified Services (Phase 1 - Consolidation)
// ============================================================================

// Template & Block Services
export { NavigationService, getNavigationService, createNavigationService } from './NavigationService';
export { TemplateRegistry } from './TemplateRegistry';
export { UnifiedTemplateRegistry } from './UnifiedTemplateRegistry';

// Cache Services
export { UnifiedCacheService } from './UnifiedCacheService';

// Storage Services
export { UnifiedStorageService } from './UnifiedStorageService';

// Configuration Services
export { SupabaseConfigurationStorage } from './SupabaseConfigurationStorage';

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
export type {
  StepNavigationInfo,
  NavigationMap,
  NavigationValidationResult,
  NavigationGraph,
} from './NavigationService';
