/**
 * 🎯 VALIDATION SYSTEM - UNIFIED EXPORT INDEX
 * 
 * Sistema unificado de validação consolidando:
 * - ValidationEngine (main validation logic)
 * - SanitizationUtils (cleaning and security)
 * - Legacy compatibility for existing validation files
 * 
 * ✅ USO:
 * ```typescript
 * import { 
 *   validateData, 
 *   sanitizeHtml,
 *   ValidationEngine 
 * } from '@/utils/validation';
 * ```
 */

// =============================================
// MAIN VALIDATION ENGINE
// =============================================
export {
    ValidationEngine,
    validationEngine,

    // Convenience functions
    validateData,
    validateBlockProperties,
    validateQuizData,
    validateFunnelPage
} from './ValidationEngine';

// =============================================
// SANITIZATION UTILITIES
// =============================================
export {
    // HTML sanitization
    sanitizeHtml,
    stripHtml,
    sanitizeRichText,

    // URL and email
    sanitizeUrl,
    sanitizeEmail,

    // Text and strings
    sanitizeText,
    sanitizeFileName,

    // Numbers and CSS
    sanitizeNumber,
    sanitizeCssUnit,

    // Object sanitization
    sanitizeObject,

    // Validation helpers
    isValidColor,
    isValidFontSize
} from './SanitizationUtils';

// =============================================
// TYPE RE-EXPORTS FROM CORE
// =============================================
export type {
    UnifiedValidationResult,
    ValidationResult,
    DetailedValidationResult,
    DetailedValidationError,
    ValidationOptions,
    ValidationRule,
    ValidationPerformance
} from '@/types/core';

export {
    ValidationContext,
    createSuccessResult,
    createErrorResult,
    combineValidationResults,
    convertLegacyErrors
} from '@/types/core';

// =============================================
// LEGACY COMPATIBILITY
// =============================================

/**
 * 🔄 LEGACY COMPATIBILITY LAYER
 * Maintains compatibility with existing validation code
 */

// For blockValidation.ts compatibility
export async function validateBlockProperties_legacy(
    blockType: string,
    properties: Record<string, any> | null,
    options?: { relatedBlocks?: any[]; context?: Record<string, any> }
): Promise<import('@/types/core').UnifiedValidationResult> {
    const { validateBlockProperties } = await import('./ValidationEngine');
    const { ValidationContext } = await import('@/types/core');

    return validateBlockProperties(properties || {}, {
        context: ValidationContext.BLOCK_PROPERTIES,
        relatedData: { blockType, ...options }
    });
}

// For schemaValidator.ts compatibility  
export async function validateFunnelPage_legacy(page: any): Promise<import('@/types/core').DetailedValidationError[]> {
    const { validateFunnelPage } = await import('./ValidationEngine');
    const result = await validateFunnelPage(page);

    // Convert to legacy DetailedValidationError format
    const errors: import('@/types/core').DetailedValidationError[] = [];

    result.errors.forEach(error => {
        errors.push({
            field: 'unknown',
            message: error,
            severity: 'error'
        });
    });

    result.warnings.forEach(warning => {
        errors.push({
            field: 'unknown',
            message: warning,
            severity: 'warning'
        });
    });

    return errors;
}

export async function validateQuizData_legacy(quizData: any): Promise<import('@/types/core').DetailedValidationError[]> {
    const { validateQuizData } = await import('./ValidationEngine');
    const result = await validateQuizData(quizData);

    // Convert to legacy format
    const errors: import('@/types/core').DetailedValidationError[] = [];

    result.errors.forEach(error => {
        errors.push({
            field: 'questions',
            message: error,
            severity: 'error'
        });
    });

    return errors;
}

// =============================================
// CONVENIENCE FUNCTIONS
// =============================================

/**
 * Quick validation for common use cases
 */
export const quickValidate = {
    /**
     * Validates and sanitizes user input
     */
    userInput: async (input: string) => {
        const { validateData } = await import('./ValidationEngine');
        const { sanitizeText } = await import('./SanitizationUtils');
        const { ValidationContext } = await import('@/types/core');

        const sanitized = sanitizeText(input, { maxLength: 1000 });
        const result = await validateData(sanitized, ValidationContext.USER_INPUT);

        return {
            isValid: result.isValid,
            sanitized,
            errors: result.errors
        };
    },

    /**
     * Validates email with sanitization
     */
    email: async (email: string) => {
        const { sanitizeEmail } = await import('./SanitizationUtils');
        const sanitized = sanitizeEmail(email);

        return {
            isValid: sanitized !== '',
            sanitized,
            errors: sanitized === '' ? ['Invalid email format'] : []
        };
    },

    /**
     * Validates URL with sanitization
     */
    url: async (url: string) => {
        const { sanitizeUrl } = await import('./SanitizationUtils');
        const sanitized = sanitizeUrl(url);

        return {
            isValid: sanitized !== '',
            sanitized,
            errors: sanitized === '' ? ['Invalid or unsafe URL'] : []
        };
    },

    /**
     * Validates color value
     */
    color: (color: string) => {
        const { isValidColor } = require('./SanitizationUtils');
        const isValid = isValidColor(color);

        return {
            isValid,
            value: color,
            errors: isValid ? [] : ['Invalid color format']
        };
    }
};

// =============================================
// MIGRATION HELPERS
// =============================================

/**
 * Helps migrate from old validation patterns to new system
 */
export const migrationHelpers = {
    /**
     * Converts old ValidationResult to new format
     */
    convertResult: (oldResult: { isValid: boolean; errors: string[]; warnings?: string[] }) => {
        return {
            isValid: oldResult.isValid,
            errors: oldResult.errors,
            warnings: oldResult.warnings || [],
            validatedAt: new Date()
        };
    },

    /**
     * Creates validation options from legacy parameters
     */
    createOptions: (strict = false, sanitize = true): import('@/types/core').ValidationOptions => ({
        strict,
        sanitize,
        stopOnFirstError: strict,
        measurePerformance: false
    })
};

// =============================================
// VERSION INFO
// =============================================
export const VALIDATION_SYSTEM_VERSION = '1.0.0';
export const VALIDATION_CONSOLIDATION_DATE = '2025-09-17';

export const VALIDATION_SYSTEM_INFO = {
    version: VALIDATION_SYSTEM_VERSION,
    consolidationDate: VALIDATION_CONSOLIDATION_DATE,
    filesConsolidated: [
        'src/utils/blockValidation.ts',
        'src/utils/schemaValidator.ts',
        'src/utils/calcResults.ts (validation parts)',
        'src/utils/validateDataSync.ts'
    ],
    features: [
        'Unified validation interface',
        'Advanced sanitization utilities',
        'Performance optimization with caching',
        'Extensible rule system',
        'Legacy compatibility layer',
        'Type-safe validation contexts'
    ],
    benefits: [
        'Consistent validation across entire application',
        'Reduced code duplication (~500 lines consolidated)',
        'Improved security with centralized sanitization',
        'Better performance with intelligent caching',
        'Easier testing and maintenance'
    ]
} as const;