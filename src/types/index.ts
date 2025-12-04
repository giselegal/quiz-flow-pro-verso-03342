/**
 * 🎯 CANONICAL TYPES - MAIN BARREL EXPORT
 * 
 * Ponto único de importação para todos os tipos do projeto.
 * 
 * FASE 5: Consolidação de 60+ arquivos para ~15 arquivos core.
 * 
 * @example
 * ```typescript
 * import { Block, EditorState, QuizStep, UnifiedFunnel } from '@/types';
 * ```
 * 
 * @canonical
 * @version 5.0.0
 */

// =============================================================================
// CORE TYPES (Canonical) - Re-export everything from core/
// =============================================================================

export * from './core';

// =============================================================================
// BLOCK TYPES (from core/block.ts)
// =============================================================================

export type { 
  Block, 
  BlockType, 
  BlockContent, 
  BlockProperties,
  BlockOption,
  BlockValidation,
  BlockPosition,
  BlockComponentProps,
} from './core/block';

export { 
  BlockSchema,
  BlockContentSchema,
  BlockPropertiesSchema,
  isBlock,
  isBlockArray,
  normalizeBlock,
  createBlock,
} from './core/block';

// =============================================================================
// EDITOR TYPES (from core/editor.ts)
// =============================================================================

export type { 
  EditorState, 
  EditorActions, 
  EditorContextValue,
  EditorAPI,
  EditorMode,
  EditorHistory,
  EditorHistoryEntry,
  EditorValidationError,
  EditorValidationResult,
  PropertyType,
  PropertyDefinition,
  PropertySchema,
} from './core/editor';

export { 
  DEFAULT_EDITOR_STATE,
  isEditorState,
} from './core/editor';

// =============================================================================
// QUIZ TYPES (from core/quiz.ts)
// =============================================================================

export type { 
  QuizStep, 
  QuizOption,
  QuizStepType,
  QuizQuestion,
  QuizQuestionType,
  QuizResponse,
  QuizAnswer,
  QuizStage,
  QuizResult,
  QuizSession,
  QuizDefinition,
  QuizSettings,
  QuizOutcome,
  QuizFunnel,
  StyleResult,
  StyleType,
  OfferContent,
  // V3 compatibility
  QuizOptionV3,
  QuizStepV3,
  OfferContentV3,
  StepsRecordV3,
} from './core/quiz';

export {
  isQuizStep,
  isQuizOption,
  isQuizResult,
} from './core/quiz';

// =============================================================================
// FUNNEL TYPES (from core/funnel.ts)
// =============================================================================

export type { 
  UnifiedFunnel, 
  FunnelStep, 
  FunnelConfig,
  FunnelMetadata,
  FunnelStatus,
  FunnelType,
  FunnelStepSettings,
  FunnelAnalytics,
  FunnelTheme,
  FunnelDraft,
  FunnelProduction,
  TrackingConfig,
  PixelConfig,
  TrackingEvent,
  PublicationSettings,
  SEOSettings,
  Funnel,
} from './core/funnel';

export {
  isFunnelStep,
  isUnifiedFunnel,
} from './core/funnel';

// =============================================================================
// TEMPLATE TYPES (from core/template.ts)
// =============================================================================

export type { 
  Template, 
  TemplateV4,
  TemplateV3,
  NormalizedTemplate,
  TemplateStep,
  TemplateSource,
  TemplateSourceType,
  TemplateVersion,
  TemplateLoaderOptions,
  TemplateLoaderResult,
  TemplateCatalogEntry,
  TemplateCatalog,
  TemplateConversionOptions,
  TemplateConversionResult,
} from './core/template';

export {
  isTemplateV4,
  isTemplateV3,
  isNormalizedTemplate,
  normalizeTemplate,
} from './core/template';

// =============================================================================
// COMPONENT TYPES (from core/component.ts)
// =============================================================================

export type {
  ComponentDefinition,
  ComponentInstance,
  ComponentCategory,
  ComponentRegistry,
  ComponentPreset,
} from './core/component';

export {
  isComponentDefinition,
  isComponentInstance,
} from './core/component';

// =============================================================================
// STYLE TYPES (from core/style.ts)
// =============================================================================

export type {
  StyleProperties,
  Theme,
  ThemePreset,
  CSSVariables,
  Breakpoint,
  ResponsiveValue,
  ResponsiveStyles,
  AnimationConfig,
  TransitionConfig,
} from './core/style';

export { DEFAULT_THEME } from './core/style';

// =============================================================================
// ANALYTICS TYPES (from core/analytics.ts)
// =============================================================================

export type {
  AnalyticsEvent,
  AnalyticsEventType,
  AnalyticsMetrics,
  AnalyticsSession,
} from './core/analytics';

// =============================================================================
// USER TYPES (from core/user.ts)
// =============================================================================

export type {
  User,
  UserRole,
  UserStatus,
  UserPreferences,
} from './core/user';

// =============================================================================
// VALIDATION TYPES (from core/ValidationTypes.ts)
// =============================================================================

export type {
  UnifiedValidationResult,
  ValidationResult,
  DetailedValidationResult,
  DetailedValidationError,
  ValidationOptions,
  ValidationRule,
  ValidationPerformance,
} from './core/ValidationTypes';

export {
  ValidationContext,
  createSuccessResult,
  createErrorResult,
  combineValidationResults,
} from './core/ValidationTypes';

// =============================================================================
// BLOCK INTERFACES (from core/BlockInterfaces.ts)
// =============================================================================

export type {
  BlockData,
  BlockDefinition,
  UnifiedBlockComponentProps,
  TypedBlockComponentProps,
  EditableBlockComponentProps,
  QuizBlockComponentProps,
  LegacyBlockComponentProps,
} from './core/BlockInterfaces';

export {
  asBlockComponent,
  createBlockComponent,
  isQuizBlockProps,
  isEditableBlockProps,
} from './core/BlockInterfaces';

// =============================================================================
// LEGACY TYPE ADAPTERS (from core/LegacyTypeAdapters.ts)
// =============================================================================

export type {
  LegacyBlockProps,
  LegacyValidationResult,
} from './core/LegacyTypeAdapters';

export {
  migrateLegacyBlockProps,
  migrateLegacyValidationResult,
  withUnifiedProps,
  checkMigrationReadiness,
  getMigrationStepsForFile,
  convertLegacyBlockProps,
  convertLegacyValidationResult,
} from './core/LegacyTypeAdapters';

// =============================================================================
// METADATA
// =============================================================================

export const TYPES_VERSION = '5.0.0';
export const CONSOLIDATION_PHASE = 'PHASE_5_COMPLETE';
