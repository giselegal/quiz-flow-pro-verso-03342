/**
 * 🎯 CORE TYPES - UNIFIED EXPORT INDEX
 * 
 * Ponto de entrada único para todos os tipos consolidados:
 * - Block interfaces unificadas
 * - Validation types unificadas  
 * - Legacy adapters para compatibilidade
 * - Utility functions e type guards
 * 
 * ✅ USO:
 * ```typescript
 * import { 
 *   UnifiedBlockComponentProps,
 *   ValidationResult,
 *   createSuccessResult 
 * } from '@/types/core';
 * ```
 */

// =============================================
// BLOCK INTERFACES
// =============================================
export type {
    // Core data structures
    BlockData,
    BlockDefinition,

    // Component props (UNIFIED)
    UnifiedBlockComponentProps,
    BlockComponentProps,
    BlockComponent,

    // Specialized props
    TypedBlockComponentProps,
    EditableBlockComponentProps,
    QuizBlockComponentProps,

    // Legacy compatibility
    LegacyBlockComponentProps
} from './BlockInterfaces';

export {
    // Component utilities
    asBlockComponent,
    createBlockComponent,

    // Type guards
    isQuizBlockProps,
    isEditableBlockProps
} from './BlockInterfaces';

// =============================================
// VALIDATION TYPES
// =============================================
export type {
    // Core validation (UNIFIED)
    UnifiedValidationResult,
    ValidationResult,

    // Enhanced validation
    DetailedValidationResult,
    DetailedValidationError,

    // Configuration
    ValidationOptions,
    ValidationRule,
    ValidationPerformance,

    // Legacy aliases
    SchemaValidationError,
    BlockValidationResult,
    QuizValidationResult
} from './ValidationTypes';

export {
    // Enums (not type-only)
    ValidationContext,

    // Factory functions
    createSuccessResult,
    createErrorResult,
    combineValidationResults,

    // Conversion utilities
    convertLegacyErrors,
    hasDetailedErrors
} from './ValidationTypes';

// =============================================
// LEGACY ADAPTERS
// =============================================
export type {
    // Legacy types (temporary)
    LegacyBlockProps,
    LegacyValidationResult
} from './LegacyTypeAdapters';

export {
    // Migration functions
    migrateLegacyBlockProps,
    migrateLegacyValidationResult,

    // Component wrappers
    withUnifiedProps,

    // Migration utilities
    checkMigrationReadiness,
    getMigrationStepsForFile,

    // Temporary compatibility
    convertLegacyBlockProps,
    convertLegacyValidationResult
} from './LegacyTypeAdapters';

// =============================================
// CONVENIENCE RE-EXPORTS
// =============================================

// Most commonly used types for easy access
export type {
    BlockData as Block
} from './BlockInterfaces';

export type {
    UnifiedBlockComponentProps as BlockProps
} from './BlockInterfaces';

export type {
    UnifiedValidationResult as Validation
} from './ValidationTypes';

// =============================================
// VERSION & METADATA
// =============================================
export const CORE_TYPES_VERSION = '1.0.0';
export const CONSOLIDATION_DATE = '2025-09-17';
export const MIGRATION_STATUS = 'PHASE_1_COMPLETE';

/**
 * Information about the consolidation
 */
export const CONSOLIDATION_INFO = {
    version: CORE_TYPES_VERSION,
    date: CONSOLIDATION_DATE,
    phase: 'PHASE_1_TYPES_AND_VALIDATION',
    filesConsolidated: [
        'src/types/blocks.ts (BlockComponentProps)',
        'src/types/blockComponentProps.ts (BlockComponentProps)',
        'src/utils/blockValidation.ts (ValidationResult)',
        'src/utils/schemaValidator.ts (SchemaValidationError)',
        'src/utils/calcResults.ts (ValidationResult)',
        'src/utils/validateDataSync.ts (ValidationResult)'
    ],
    benefits: [
        'Resolved TypeScript conflicts between duplicate interfaces',
        'Unified validation types across all utils',
        'Maintained backward compatibility with legacy code',
        'Reduced code duplication by ~200 lines',
        'Established foundation for Phase 2 consolidations'
    ],
    nextPhase: 'PHASE_2_SERVICES_AND_HOOKS'
} as const;