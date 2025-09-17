/**
 * 🎯 VALIDATION ENGINE - CONSOLIDAÇÃO FASE 1
 * 
 * Sistema unificado de validação que consolida:
 * - src/utils/blockValidation.ts (block validation logic)
 * - src/utils/schemaValidator.ts (schema validation)  
 * - src/utils/calcResults.ts (validation patterns)
 * - src/utils/validateDataSync.ts (sync validation)
 * 
 * ✅ BENEFÍCIOS:
 * - Interface única para todas as validações
 * - Performance otimizada com cache
 * - Extensível com custom rules
 * - Sanitização automática
 * - Métricas de performance
 */

import {
    UnifiedValidationResult,
    ValidationOptions,
    ValidationRule,
    ValidationContext,
    createErrorResult
} from '@/types/core';

// =============================================
// MAIN VALIDATION ENGINE
// =============================================

export class ValidationEngine {
    private static instance: ValidationEngine;
    private ruleCache = new Map<string, ValidationRule[]>();
    private resultCache = new Map<string, { result: UnifiedValidationResult; timestamp: number }>();
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    private constructor() { }

    static getInstance(): ValidationEngine {
        if (!ValidationEngine.instance) {
            ValidationEngine.instance = new ValidationEngine();
        }
        return ValidationEngine.instance;
    }

    /**
     * 🎯 MAIN VALIDATION METHOD
     * Validates any data with unified interface
     */
    async validate(
        data: any,
        context: ValidationContext,
        options: ValidationOptions = {}
    ): Promise<UnifiedValidationResult> {
        const startTime = performance.now();

        try {
            // Check cache if enabled
            const cacheKey = this.getCacheKey(data, context, options);
            if (!options.strict && this.isValidCache(cacheKey)) {
                const cached = this.resultCache.get(cacheKey)!;
                return { ...cached.result, validatedAt: new Date() };
            }

            // Get validation rules
            const rules = await this.getRulesForContext(context, options);

            // Execute validation
            const result = await this.executeValidation(data, rules, options);

            // Add performance metrics if requested
            if (options.measurePerformance) {
                result.performance = {
                    startTime,
                    endTime: performance.now(),
                    duration: performance.now() - startTime,
                    rulesApplied: rules.length,
                    fieldsChecked: this.countFields(data)
                };
            }

            // Cache result
            this.cacheResult(cacheKey, result);

            return result;

        } catch (error) {
            return createErrorResult([
                `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            ]);
        }
    }

    /**
     * 🚀 BATCH VALIDATION
     * Validates multiple items efficiently
     */
    async validateBatch(
        items: Array<{ data: any; context: ValidationContext; options?: ValidationOptions }>,
        globalOptions: ValidationOptions = {}
    ): Promise<UnifiedValidationResult[]> {
        const promises = items.map(item =>
            this.validate(item.data, item.context, { ...globalOptions, ...item.options })
        );

        return Promise.all(promises);
    }

    /**
     * 🔧 CUSTOM RULE REGISTRATION
     */
    registerRule(context: ValidationContext, rule: ValidationRule): void {
        const existingRules = this.ruleCache.get(context) || [];
        this.ruleCache.set(context, [...existingRules, rule]);
    }

    /**
     * 🧹 CACHE MANAGEMENT
     */
    clearCache(): void {
        this.resultCache.clear();
        this.ruleCache.clear();
    }

    clearExpiredCache(): void {
        const now = Date.now();
        for (const [key, cached] of this.resultCache.entries()) {
            if (now - cached.timestamp > this.CACHE_TTL) {
                this.resultCache.delete(key);
            }
        }
    }

    // =============================================
    // PRIVATE METHODS
    // =============================================

    private async getRulesForContext(
        context: ValidationContext,
        options: ValidationOptions
    ): Promise<ValidationRule[]> {
        const baseRules = this.getBaseRulesForContext(context);
        const customRules = options.customRules || [];
        const cachedRules = this.ruleCache.get(context) || [];

        return [...baseRules, ...cachedRules, ...customRules];
    }

    private getBaseRulesForContext(context: ValidationContext): ValidationRule[] {
        const baseRules: Record<ValidationContext, ValidationRule[]> = {
            [ValidationContext.BLOCK_PROPERTIES]: this.getBlockValidationRules(),
            [ValidationContext.SCHEMA_VALIDATION]: this.getSchemaValidationRules(),
            [ValidationContext.QUIZ_DATA]: this.getQuizValidationRules(),
            [ValidationContext.FUNNEL_PAGE]: this.getFunnelPageValidationRules(),
            [ValidationContext.FORM_INPUT]: this.getFormInputValidationRules(),
            [ValidationContext.TEMPLATE_DATA]: this.getTemplateValidationRules(),
            [ValidationContext.USER_INPUT]: this.getUserInputValidationRules(),
            [ValidationContext.DATA_SYNC]: this.getDataSyncValidationRules(),
            [ValidationContext.CUSTOM]: []
        };

        return baseRules[context] || [];
    }

    private async executeValidation(
        data: any,
        rules: ValidationRule[],
        options: ValidationOptions
    ): Promise<UnifiedValidationResult> {
        const errors: string[] = [];
        const warnings: string[] = [];
        const info: string[] = [];
        let sanitized = options.sanitize ? { ...data } : undefined;

        for (const rule of rules) {
            // Skip ignored fields
            if (rule.field && options.ignoreFields?.includes(rule.field)) {
                continue;
            }

            // Get value to validate
            const value = rule.field ? data[rule.field] : data;

            try {
                const result = rule.async
                    ? await (rule.validate as any)(value, data)
                    : rule.validate(value, data);

                if (result !== true) {
                    const message = typeof result === 'string' ? result : `Validation failed for ${rule.name}`;

                    switch (rule.severity) {
                        case 'error':
                            errors.push(message);
                            if (options.stopOnFirstError) return createErrorResult([message]);
                            break;
                        case 'warning':
                            warnings.push(message);
                            break;
                        case 'info':
                            info.push(message);
                            break;
                    }
                }

                // Auto-sanitization if enabled
                if (options.sanitize && rule.field && sanitized) {
                    sanitized[rule.field] = this.sanitizeValue(value, rule);
                }

            } catch (error) {
                errors.push(`Rule "${rule.name}" failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                if (options.stopOnFirstError) {
                    return createErrorResult([errors[errors.length - 1]]);
                }
            }
        }

        const result: UnifiedValidationResult = {
            isValid: errors.length === 0,
            errors,
            warnings,
            info: info.length > 0 ? info : undefined,
            sanitized,
            validatedAt: new Date(),
            validationType: options.context
        };

        return result;
    }

    private sanitizeValue(value: any, _rule: ValidationRule): any {
        // Basic sanitization - can be extended
        if (typeof value === 'string') {
            return value.trim();
        }
        return value;
    }

    private getCacheKey(data: any, context: ValidationContext, options: ValidationOptions): string {
        return `${context}_${JSON.stringify(data)}_${JSON.stringify(options)}`;
    }

    private isValidCache(cacheKey: string): boolean {
        const cached = this.resultCache.get(cacheKey);
        if (!cached) return false;

        const isExpired = Date.now() - cached.timestamp > this.CACHE_TTL;
        if (isExpired) {
            this.resultCache.delete(cacheKey);
            return false;
        }

        return true;
    }

    private cacheResult(key: string, result: UnifiedValidationResult): void {
        this.resultCache.set(key, { result, timestamp: Date.now() });
    }

    private countFields(data: any): number {
        if (!data || typeof data !== 'object') return 1;
        return Object.keys(data).length;
    }

    // =============================================
    // CONTEXT-SPECIFIC RULES
    // =============================================

    private getBlockValidationRules(): ValidationRule[] {
        return [
            {
                name: 'required-id',
                field: 'id',
                validate: (value) => !!value || 'Block ID is required',
                severity: 'error'
            },
            {
                name: 'required-type',
                field: 'type',
                validate: (value) => !!value || 'Block type is required',
                severity: 'error'
            },
            {
                name: 'valid-order',
                field: 'order',
                validate: (value) => (typeof value === 'number' && value >= 0) || 'Order must be a non-negative number',
                severity: 'warning'
            }
        ];
    }

    private getSchemaValidationRules(): ValidationRule[] {
        return [
            {
                name: 'object-structure',
                validate: (value) => (typeof value === 'object' && value !== null) || 'Value must be an object',
                severity: 'error'
            }
        ];
    }

    private getQuizValidationRules(): ValidationRule[] {
        return [
            {
                name: 'has-questions',
                field: 'questions',
                validate: (value) => (Array.isArray(value) && value.length > 0) || 'Quiz must have at least one question',
                severity: 'error'
            }
        ];
    }

    private getFunnelPageValidationRules(): ValidationRule[] {
        return [
            {
                name: 'has-blocks',
                field: 'blocks',
                validate: (value) => Array.isArray(value) || 'Page must have blocks array',
                severity: 'error'
            }
        ];
    }

    private getFormInputValidationRules(): ValidationRule[] {
        return [
            {
                name: 'valid-email',
                validate: (value) => {
                    if (typeof value !== 'string') return true;
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(value) || 'Invalid email format';
                },
                severity: 'warning'
            }
        ];
    }

    private getTemplateValidationRules(): ValidationRule[] {
        return [
            {
                name: 'has-name',
                field: 'name',
                validate: (value) => !!value || 'Template must have a name',
                severity: 'error'
            }
        ];
    }

    private getUserInputValidationRules(): ValidationRule[] {
        return [
            {
                name: 'safe-content',
                validate: (value) => {
                    if (typeof value !== 'string') return true;
                    return !/<script|javascript:/i.test(value) || 'Potentially unsafe content detected';
                },
                severity: 'error'
            }
        ];
    }

    private getDataSyncValidationRules(): ValidationRule[] {
        return [
            {
                name: 'timestamp-valid',
                field: 'timestamp',
                validate: (value) => {
                    if (!value) return true;
                    const date = new Date(value);
                    return !isNaN(date.getTime()) || 'Invalid timestamp';
                },
                severity: 'warning'
            }
        ];
    }
}

// =============================================
// CONVENIENCE FUNCTIONS
// =============================================

/**
 * Quick validation function for common use cases
 */
export async function validateData(
    data: any,
    context: ValidationContext = ValidationContext.CUSTOM,
    options: ValidationOptions = {}
): Promise<UnifiedValidationResult> {
    return ValidationEngine.getInstance().validate(data, context, options);
}

/**
 * Validates block properties (most common use case)
 */
export async function validateBlockProperties(
    properties: Record<string, any>,
    options: ValidationOptions = {}
): Promise<UnifiedValidationResult> {
    return validateData(properties, ValidationContext.BLOCK_PROPERTIES, options);
}

/**
 * Validates quiz data
 */
export async function validateQuizData(
    quizData: any,
    options: ValidationOptions = {}
): Promise<UnifiedValidationResult> {
    return validateData(quizData, ValidationContext.QUIZ_DATA, options);
}

/**
 * Validates funnel page structure
 */
export async function validateFunnelPage(
    page: any,
    options: ValidationOptions = {}
): Promise<UnifiedValidationResult> {
    return validateData(page, ValidationContext.FUNNEL_PAGE, options);
}

// Export singleton instance for advanced usage
export const validationEngine = ValidationEngine.getInstance();