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
export { UnifiedTemplateService } from './UnifiedTemplateService';
export { NavigationService, getNavigationService, createNavigationService } from './NavigationService';
export { TemplateRegistry } from './TemplateRegistry';
export { UnifiedTemplateRegistry } from './UnifiedTemplateRegistry';

// Cache Services
export { UnifiedCacheService } from './UnifiedCacheService';

// Storage Services
export { UnifiedStorageService } from './UnifiedStorageService';

// Configuration Services
export { SupabaseConfigurationStorage } from './SupabaseConfigurationStorage';

// Types
export type {
  StepNavigationInfo,
  NavigationMap,
  NavigationValidationResult,
  NavigationGraph,
} from './NavigationService';
