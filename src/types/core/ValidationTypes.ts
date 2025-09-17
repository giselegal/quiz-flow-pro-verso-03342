/**
 * 🎯 UNIFIED VALIDATION TYPES - CONSOLIDAÇÃO FASE 1
 * 
 * Consolida todas as interfaces ValidationResult dispersas em:
 * - src/utils/blockValidation.ts
 * - src/utils/schemaValidator.ts  
 * - src/utils/calcResults.ts
 * - src/utils/validateDataSync.ts
 * 
 * ✅ BENEFÍCIOS:
 * - Interface única e consistente para todas as validações
 * - Evita duplicação de tipos de validação
 * - Suporte a diferentes níveis de severidade
 * - Extensível para novos tipos de validação
 */

// =============================================
// CORE VALIDATION INTERFACES
// =============================================

/**
 * 🎯 INTERFACE UNIFICADA - ValidationResult
 * 
 * Consolidação de todas as variações encontradas no código:
 * - Suporte a errors/warnings/info
 * - Dados sanitizados opcionais
 * - Context e metadata
 * - Compatibilidade backward
 */
export interface UnifiedValidationResult {
    // ===== CORE VALIDATION STATUS =====
    isValid: boolean;

    // ===== MESSAGES BY SEVERITY =====
    errors: string[];           // Blocking errors
    warnings: string[];         // Non-blocking warnings  
    info?: string[];           // Informational messages

    // ===== OPTIONAL ENHANCEMENTS =====
    sanitized?: Record<string, any>;     // Sanitized/corrected data
    suggestions?: string[];              // Improvement suggestions
    dataBindings?: string[];             // Data binding references

    // ===== METADATA =====
    validatedAt?: Date;                  // When validation occurred
    validationType?: ValidationContext;  // Type of validation performed
    performance?: ValidationPerformance; // Performance metrics

    // ===== EXTENSIBILITY =====
    metadata?: Record<string, any>;      // Custom metadata
}

// =============================================
// ENHANCED VALIDATION STRUCTURES
// =============================================

/**
 * Detailed validation error with field-level information
 * Consolidates SchemaValidationError functionality
 */
export interface DetailedValidationError {
    field: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    code?: string;              // Error code for programmatic handling
    value?: any;                // The invalid value
    expectedType?: string;      // Expected data type
    constraint?: string;        // Validation constraint that failed
}

/**
 * Enhanced validation result with detailed errors
 */
export interface DetailedValidationResult extends UnifiedValidationResult {
    detailedErrors: DetailedValidationError[];
    fieldCount: number;         // Total fields validated
    errorCount: number;         // Count by severity
    warningCount: number;
    infoCount: number;
}

// =============================================
// VALIDATION CONTEXT & PERFORMANCE
// =============================================

export enum ValidationContext {
    BLOCK_PROPERTIES = 'block-properties',
    SCHEMA_VALIDATION = 'schema-validation',
    QUIZ_DATA = 'quiz-data',
    FUNNEL_PAGE = 'funnel-page',
    FORM_INPUT = 'form-input',
    TEMPLATE_DATA = 'template-data',
    USER_INPUT = 'user-input',
    DATA_SYNC = 'data-sync',
    CUSTOM = 'custom'
}

export interface ValidationPerformance {
    startTime: number;
    endTime: number;
    duration: number;          // milliseconds
    rulesApplied: number;      // number of validation rules
    fieldsChecked: number;     // number of fields validated
}

// =============================================
// VALIDATION OPTIONS & CONFIG
// =============================================

export interface ValidationOptions {
    // ===== BEHAVIOR =====
    strict?: boolean;                    // Strict validation mode
    stopOnFirstError?: boolean;          // Stop at first error
    sanitize?: boolean;                  // Auto-sanitize data

    // ===== CONTEXT =====
    context?: ValidationContext;         // Validation context
    relatedData?: Record<string, any>;   // Related data for context validation

    // ===== PERFORMANCE =====
    timeout?: number;                    // Max validation time (ms)
    measurePerformance?: boolean;        // Collect performance metrics

    // ===== CUSTOMIZATION =====
    customRules?: ValidationRule[];      // Custom validation rules
    ignoreFields?: string[];             // Fields to skip
    requiredFields?: string[];           // Fields that must be present
}

export interface ValidationRule {
    name: string;
    field?: string;                      // Specific field (optional)
    validate: (value: any, data?: any) => boolean | string; // Return true or error message
    severity: 'error' | 'warning' | 'info';
    async?: boolean;                     // Async validation
}

// =============================================
// COMPATIBILITY ALIASES
// =============================================

/**
 * 🔄 BACKWARD COMPATIBILITY
 * Aliases para manter compatibilidade com código existente
 */

// Main alias for existing ValidationResult usage
export type ValidationResult = UnifiedValidationResult;

// Legacy specific aliases
export type SchemaValidationError = DetailedValidationError;
export type BlockValidationResult = UnifiedValidationResult;
export type QuizValidationResult = UnifiedValidationResult;

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Creates a successful validation result
 */
export function createSuccessResult(
    sanitized?: Record<string, any>,
    warnings: string[] = []
): UnifiedValidationResult {
    return {
        isValid: true,
        errors: [],
        warnings,
        sanitized,
        validatedAt: new Date(),
    };
}

/**
 * Creates a failed validation result
 */
export function createErrorResult(
    errors: string[],
    warnings: string[] = []
): UnifiedValidationResult {
    return {
        isValid: false,
        errors,
        warnings,
        validatedAt: new Date(),
    };
}

/**
 * Combines multiple validation results
 */
export function combineValidationResults(
    results: UnifiedValidationResult[]
): UnifiedValidationResult {
    const combined: UnifiedValidationResult = {
        isValid: results.every(r => r.isValid),
        errors: [],
        warnings: [],
        validatedAt: new Date(),
    };

    results.forEach(result => {
        combined.errors.push(...result.errors);
        combined.warnings.push(...result.warnings);
        if (result.info) {
            combined.info = combined.info || [];
            combined.info.push(...result.info);
        }
    });

    return combined;
}

/**
 * Converts legacy SchemaValidationError[] to UnifiedValidationResult
 */
export function convertLegacyErrors(
    legacyErrors: DetailedValidationError[]
): UnifiedValidationResult {
    const errors = legacyErrors.filter(e => e.severity === 'error').map(e => e.message);
    const warnings = legacyErrors.filter(e => e.severity === 'warning').map(e => e.message);
    const info = legacyErrors.filter(e => e.severity === 'info').map(e => e.message);

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        info: info.length > 0 ? info : undefined,
        validatedAt: new Date(),
    };
}

/**
 * Type guard to check if result has detailed errors
 */
export function hasDetailedErrors(
    result: UnifiedValidationResult
): result is DetailedValidationResult {
    return 'detailedErrors' in result;
}