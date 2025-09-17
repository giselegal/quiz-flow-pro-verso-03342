/**
 * 🔄 LEGACY TYPE ADAPTERS - CONSOLIDAÇÃO FASE 1
 * 
 * Adaptadores para migração sem quebrar compatibilidade:
 * - Mapeia tipos antigos para novos tipos unificados
 * - Garante compatibilidade backward
 * - Facilita migração gradual do código existente
 * - Evita breaking changes durante consolidação
 * 
 * ✅ STRATEGY:
 * - Re-export tipos antigos apontando para novos
 * - Funções de conversão automática
 * - Wrappers para componentes existentes
 * - Gradual migration path
 */

import React from 'react';

// =============================================
// BLOCK INTERFACES MIGRATION
// =============================================

// Re-exports from unified interfaces
export type {
    UnifiedBlockComponentProps,
    BlockComponentProps,
    LegacyBlockComponentProps,
    BlockComponent,
    BlockData,
    BlockDefinition,
    TypedBlockComponentProps,
    EditableBlockComponentProps,
    QuizBlockComponentProps
} from './BlockInterfaces';

export {
    asBlockComponent,
    createBlockComponent,
    isQuizBlockProps,
    isEditableBlockProps
} from './BlockInterfaces';

// =============================================
// VALIDATION TYPES MIGRATION  
// =============================================

// Re-exports from unified validation types
export type {
    UnifiedValidationResult,
    ValidationResult,
    DetailedValidationResult,
    DetailedValidationError,
    SchemaValidationError,
    BlockValidationResult,
    QuizValidationResult,
    ValidationContext,
    ValidationPerformance,
    ValidationOptions,
    ValidationRule
} from './ValidationTypes';

export {
    ValidationContext as ValidationType,
    createSuccessResult,
    createErrorResult,
    combineValidationResults,
    convertLegacyErrors,
    hasDetailedErrors
} from './ValidationTypes';

// =============================================
// LEGACY COMPATIBILITY FUNCTIONS
// =============================================

import {
    UnifiedBlockComponentProps
} from './BlockInterfaces';
import {
    UnifiedValidationResult
} from './ValidationTypes';

/**
 * 🔄 BLOCK PROPS MIGRATION
 * Converte props do formato antigo para o novo formato unificado
 */
export function migrateLegacyBlockProps(
    legacyProps: any
): UnifiedBlockComponentProps {
    // Se já está no formato novo, retorna como está
    if (isNewFormatProps(legacyProps)) {
        return legacyProps;
    }

    // Converte formato antigo para novo
    const migratedProps: UnifiedBlockComponentProps = {
        ...legacyProps,
    };

    // Handle specific migrations
    if (legacyProps.block && !legacyProps.properties) {
        migratedProps.properties = legacyProps.block.properties;
    }

    return migratedProps;
}

/**
 * Type guard to detect new format props
 */
function isNewFormatProps(props: any): props is UnifiedBlockComponentProps {
    // Simple heuristic - new props have better structure
    return props && (
        typeof props.isSelected === 'boolean' ||
        typeof props.onPropertyChange === 'function' ||
        props.containerWidth !== undefined
    );
}

/**
 * 🔄 VALIDATION RESULT MIGRATION
 * Converte results antigos para novo formato
 */
export function migrateLegacyValidationResult(
    legacyResult: any
): UnifiedValidationResult {
    // Se já está no formato novo, retorna como está
    if (isNewValidationResult(legacyResult)) {
        return legacyResult;
    }

    // Converte formato antigo
    const migratedResult: UnifiedValidationResult = {
        isValid: legacyResult.isValid ?? true,
        errors: Array.isArray(legacyResult.errors) ? legacyResult.errors : [],
        warnings: Array.isArray(legacyResult.warnings) ? legacyResult.warnings : [],
        validatedAt: new Date(),
    };

    // Handle detailed errors if present
    if (Array.isArray(legacyResult.detailedErrors)) {
        migratedResult.errors = legacyResult.detailedErrors
            .filter((e: any) => e.severity === 'error')
            .map((e: any) => e.message);

        migratedResult.warnings = legacyResult.detailedErrors
            .filter((e: any) => e.severity === 'warning')
            .map((e: any) => e.message);
    }

    // Preserve sanitized data
    if (legacyResult.sanitized) {
        migratedResult.sanitized = legacyResult.sanitized;
    }

    return migratedResult;
}

/**
 * Type guard to detect new format validation result
 */
function isNewValidationResult(result: any): result is UnifiedValidationResult {
    return result &&
        typeof result.isValid === 'boolean' &&
        Array.isArray(result.errors) &&
        Array.isArray(result.warnings);
}

// =============================================
// COMPONENT WRAPPERS
// =============================================

/**
 * HOC to wrap legacy components with new prop format
 */
export function withUnifiedProps<T extends Record<string, any>>(
    Component: React.ComponentType<T>
): React.ComponentType<UnifiedBlockComponentProps> {
    return function UnifiedPropsWrapper(props: UnifiedBlockComponentProps) {
        const legacyProps = convertToLegacyProps(props);
        return React.createElement(Component as React.ComponentType<any>, legacyProps);
    };
}

/**
 * Converts unified props back to legacy format if needed
 */
function convertToLegacyProps(unifiedProps: UnifiedBlockComponentProps): any {
    // This function would handle specific legacy prop conversions
    // For now, just pass through - most components should work
    return unifiedProps;
}

// =============================================
// GRADUAL MIGRATION HELPERS
// =============================================

/**
 * Checks if codebase is ready for full migration
 */
export function checkMigrationReadiness(): {
    ready: boolean;
    legacyUsages: string[];
    recommendations: string[];
} {
    // This would analyze the codebase for legacy usage patterns
    // For now, return optimistic result
    return {
        ready: true,
        legacyUsages: [],
        recommendations: [
            'Update import statements to use unified types',
            'Replace legacy prop patterns with unified interface',
            'Update validation calls to use unified ValidationResult'
        ]
    };
}

/**
 * Provides migration path for specific file
 */
export function getMigrationStepsForFile(filePath: string): string[] {
    // Analysis of specific file migration needs
    return [
        `Update imports in ${filePath}`,
        'Replace BlockComponentProps with UnifiedBlockComponentProps',
        'Update ValidationResult usage',
        'Test component functionality'
    ];
}

// =============================================
// TEMPORARY COMPATIBILITY EXPORTS
// =============================================

// During migration period, provide both old and new exports
// Remove these after migration is complete

// Legacy block props (will be deprecated)
export interface LegacyBlockProps {
    block: any;
    properties?: Record<string, any>;
    isSelected?: boolean;
    onClick?: () => void;
    className?: string;
}

// Legacy validation result (will be deprecated)  
export interface LegacyValidationResult {
    isValid: boolean;
    errors: string[];
    warnings?: string[];
}

// Conversion functions for temporary compatibility
export const convertLegacyBlockProps = migrateLegacyBlockProps;
export const convertLegacyValidationResult = migrateLegacyValidationResult;