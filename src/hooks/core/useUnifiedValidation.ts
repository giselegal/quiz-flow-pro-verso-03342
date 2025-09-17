/**
 * 🎯 UNIFIED VALIDATION HOOK - CONSOLIDATED VALIDATION SYSTEM
 * 
 * Consolidates fragmented validation hooks:
 * - useValidation.ts (generic validation)
 * - useEditorFieldValidation.ts (field validation)
 * - useQuizValidation.ts (quiz-specific validation)
 * - useCentralizedStepValidation.ts (step validation)
 * - Various validation utilities
 * 
 * Benefits:
 * ✅ Single validation interface
 * ✅ Consistent error handling
 * ✅ Type-safe validation rules
 * ✅ Performance optimized
 * ✅ Async validation support
 * ✅ Conditional validation
 * ✅ Real-time validation
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { z } from 'zod';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

export enum ValidationSeverity {
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info'
}

export enum ValidationType {
    REQUIRED = 'required',
    MIN_LENGTH = 'minLength',
    MAX_LENGTH = 'maxLength',
    PATTERN = 'pattern',
    EMAIL = 'email',
    URL = 'url',
    NUMBER = 'number',
    RANGE = 'range',
    CUSTOM = 'custom',
    ASYNC = 'async'
}

export interface ValidationRule {
    type: ValidationType;
    severity: ValidationSeverity;
    message: string;
    value?: any;
    condition?: (value: any, context?: any) => boolean;
    validator?: (value: any, context?: any) => boolean | Promise<boolean>;
}

export interface ValidationError {
    field: string;
    type: ValidationType;
    severity: ValidationSeverity;
    message: string;
    value?: any;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
    infos: ValidationError[];
    touchedFields: Set<string>;
}

export interface ValidationSchema {
    [fieldKey: string]: ValidationRule[];
}

export interface UnifiedValidationState {
    isValidating: boolean;
    validationResult: ValidationResult;
    schemas: Map<string, ValidationSchema>;
    asyncValidators: Map<string, Promise<boolean>>;
}

export interface UnifiedValidationActions {
    // Schema Management
    registerSchema: (schemaId: string, schema: ValidationSchema) => void;
    unregisterSchema: (schemaId: string) => void;

    // Field Validation
    validateField: (field: string, value: any, schemaId?: string) => Promise<ValidationError[]>;
    validateAllFields: (data: Record<string, any>, schemaId?: string) => Promise<ValidationResult>;

    // Form Validation
    validateForm: (formData: Record<string, any>, schemaId: string) => Promise<ValidationResult>;

    // Block Validation (Editor specific)
    validateBlock: (block: any) => Promise<ValidationResult>;
    validateStep: (step: any) => Promise<ValidationResult>;
    validateFunnel: (funnel: any) => Promise<ValidationResult>;

    // Utility methods
    clearValidation: (field?: string) => void;
    markFieldTouched: (field: string) => void;
    isFieldTouched: (field: string) => boolean;
    getFieldErrors: (field: string) => ValidationError[];
    hasErrors: () => boolean;
    hasWarnings: () => boolean;
}

// =============================================================================
// DEFAULT VALIDATION SCHEMAS
// =============================================================================

export const DEFAULT_SCHEMAS = {
    // Basic field validations
    text: {
        content: [
            {
                type: ValidationType.REQUIRED,
                severity: ValidationSeverity.ERROR,
                message: 'Content is required'
            }
        ]
    },

    // Email validation
    email: {
        email: [
            {
                type: ValidationType.REQUIRED,
                severity: ValidationSeverity.ERROR,
                message: 'Email is required'
            },
            {
                type: ValidationType.EMAIL,
                severity: ValidationSeverity.ERROR,
                message: 'Please enter a valid email address'
            }
        ]
    },

    // URL validation
    url: {
        url: [
            {
                type: ValidationType.URL,
                severity: ValidationSeverity.ERROR,
                message: 'Please enter a valid URL'
            }
        ]
    },

    // Quiz validation
    quiz: {
        title: [
            {
                type: ValidationType.REQUIRED,
                severity: ValidationSeverity.ERROR,
                message: 'Quiz title is required'
            },
            {
                type: ValidationType.MIN_LENGTH,
                severity: ValidationSeverity.WARNING,
                message: 'Title should be at least 5 characters',
                value: 5
            }
        ],
        description: [
            {
                type: ValidationType.MIN_LENGTH,
                severity: ValidationSeverity.INFO,
                message: 'Consider adding a description',
                value: 10
            }
        ]
    },

    // Block validation
    block: {
        type: [
            {
                type: ValidationType.REQUIRED,
                severity: ValidationSeverity.ERROR,
                message: 'Block type is required'
            }
        ],
        properties: [
            {
                type: ValidationType.CUSTOM,
                severity: ValidationSeverity.ERROR,
                message: 'Block properties are invalid',
                validator: (properties: any) => {
                    return typeof properties === 'object' && properties !== null;
                }
            }
        ]
    }
} as Record<string, ValidationSchema>;

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

const validateRequired = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
};

const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
};

const validateURL = (value: string): boolean => {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
};

const validatePattern = (value: string, pattern: string): boolean => {
    const regex = new RegExp(pattern);
    return regex.test(value);
};

// =============================================================================
// MAIN HOOK IMPLEMENTATION
// =============================================================================

export const useUnifiedValidation = () => {
    const [state, setState] = useState<UnifiedValidationState>({
        isValidating: false,
        validationResult: {
            isValid: true,
            errors: [],
            warnings: [],
            infos: [],
            touchedFields: new Set()
        },
        schemas: new Map(Object.entries(DEFAULT_SCHEMAS)),
        asyncValidators: new Map()
    });

    const asyncTimeoutRef = useRef<NodeJS.Timeout>();

    // Performance optimization: debounce validation
    const debouncedValidation = useCallback((fn: () => void, delay = 300) => {
        if (asyncTimeoutRef.current) {
            clearTimeout(asyncTimeoutRef.current);
        }

        asyncTimeoutRef.current = setTimeout(fn, delay);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (asyncTimeoutRef.current) {
                clearTimeout(asyncTimeoutRef.current);
            }
        };
    }, []);

    // Register validation schema
    const registerSchema = useCallback((schemaId: string, schema: ValidationSchema) => {
        setState(prev => {
            const newSchemas = new Map(prev.schemas);
            newSchemas.set(schemaId, schema);
            return { ...prev, schemas: newSchemas };
        });
    }, []);

    // Unregister validation schema
    const unregisterSchema = useCallback((schemaId: string) => {
        setState(prev => {
            const newSchemas = new Map(prev.schemas);
            newSchemas.delete(schemaId);
            return { ...prev, schemas: newSchemas };
        });
    }, []);

    // Validate a single field
    const validateField = useCallback(async (
        field: string,
        value: any,
        schemaId?: string
    ): Promise<ValidationError[]> => {
        const schema = schemaId ? state.schemas.get(schemaId) : DEFAULT_SCHEMAS.block;
        if (!schema || !schema[field]) return [];

        const rules = schema[field];
        const errors: ValidationError[] = [];

        for (const rule of rules) {
            // Check condition if exists
            if (rule.condition && !rule.condition(value)) continue;

            let isValid = true;

            switch (rule.type) {
                case ValidationType.REQUIRED:
                    isValid = validateRequired(value);
                    break;

                case ValidationType.MIN_LENGTH:
                    isValid = typeof value === 'string' && value.length >= (rule.value || 0);
                    break;

                case ValidationType.MAX_LENGTH:
                    isValid = typeof value === 'string' && value.length <= (rule.value || Infinity);
                    break;

                case ValidationType.EMAIL:
                    isValid = typeof value === 'string' && validateEmail(value);
                    break;

                case ValidationType.URL:
                    isValid = typeof value === 'string' && validateURL(value);
                    break;

                case ValidationType.PATTERN:
                    isValid = typeof value === 'string' && rule.value && validatePattern(value, rule.value);
                    break;

                case ValidationType.NUMBER:
                    isValid = !isNaN(Number(value));
                    break;

                case ValidationType.RANGE:
                    const num = Number(value);
                    const { min = -Infinity, max = Infinity } = rule.value || {};
                    isValid = !isNaN(num) && num >= min && num <= max;
                    break;

                case ValidationType.CUSTOM:
                    if (rule.validator) {
                        isValid = await Promise.resolve(rule.validator(value));
                    }
                    break;

                case ValidationType.ASYNC:
                    if (rule.validator) {
                        // Handle async validation with caching
                        const cacheKey = `${field}_${JSON.stringify(value)}`;
                        if (state.asyncValidators.has(cacheKey)) {
                            isValid = await state.asyncValidators.get(cacheKey)!;
                        } else {
                            const validationPromise = Promise.resolve(rule.validator(value));
                            setState(prev => {
                                const newAsyncValidators = new Map(prev.asyncValidators);
                                newAsyncValidators.set(cacheKey, validationPromise);
                                return { ...prev, asyncValidators: newAsyncValidators };
                            });
                            isValid = await validationPromise;
                        }
                    }
                    break;
            }

            if (!isValid) {
                errors.push({
                    field,
                    type: rule.type,
                    severity: rule.severity,
                    message: rule.message,
                    value
                });
            }
        }

        return errors;
    }, [state.schemas, state.asyncValidators]);

    // Validate all fields
    const validateAllFields = useCallback(async (
        data: Record<string, any>,
        schemaId?: string
    ): Promise<ValidationResult> => {
        setState(prev => ({ ...prev, isValidating: true }));

        const allErrors: ValidationError[] = [];
        const fields = Object.keys(data);

        // Validate all fields concurrently
        const validationPromises = fields.map(field =>
            validateField(field, data[field], schemaId)
        );

        const fieldErrors = await Promise.all(validationPromises);
        fieldErrors.forEach(errors => allErrors.push(...errors));

        // Categorize errors by severity
        const errors = allErrors.filter(e => e.severity === ValidationSeverity.ERROR);
        const warnings = allErrors.filter(e => e.severity === ValidationSeverity.WARNING);
        const infos = allErrors.filter(e => e.severity === ValidationSeverity.INFO);

        const result: ValidationResult = {
            isValid: errors.length === 0,
            errors,
            warnings,
            infos,
            touchedFields: new Set(fields)
        };

        setState(prev => ({
            ...prev,
            isValidating: false,
            validationResult: result
        }));

        return result;
    }, [validateField]);

    // Validate form
    const validateForm = useCallback(async (
        formData: Record<string, any>,
        schemaId: string
    ): Promise<ValidationResult> => {
        return validateAllFields(formData, schemaId);
    }, [validateAllFields]);

    // Validate block (Editor specific)
    const validateBlock = useCallback(async (block: any): Promise<ValidationResult> => {
        if (!block || typeof block !== 'object') {
            return {
                isValid: false,
                errors: [{
                    field: 'block',
                    type: ValidationType.REQUIRED,
                    severity: ValidationSeverity.ERROR,
                    message: 'Block is required'
                }],
                warnings: [],
                infos: [],
                touchedFields: new Set(['block'])
            };
        }

        return validateAllFields(block, 'block');
    }, [validateAllFields]);

    // Validate step (Editor specific)
    const validateStep = useCallback(async (step: any): Promise<ValidationResult> => {
        if (!step || !Array.isArray(step.blocks)) {
            return {
                isValid: false,
                errors: [{
                    field: 'step',
                    type: ValidationType.REQUIRED,
                    severity: ValidationSeverity.ERROR,
                    message: 'Step must have blocks array'
                }],
                warnings: [],
                infos: [],
                touchedFields: new Set(['step'])
            };
        }

        // Validate all blocks in step
        const blockValidations = await Promise.all(
            step.blocks.map((block: any) => validateBlock(block))
        );

        const allErrors = blockValidations.flatMap(result => result.errors);
        const allWarnings = blockValidations.flatMap(result => result.warnings);
        const allInfos = blockValidations.flatMap(result => result.infos);

        return {
            isValid: allErrors.length === 0,
            errors: allErrors,
            warnings: allWarnings,
            infos: allInfos,
            touchedFields: new Set(['step', ...step.blocks.map((_: any, i: number) => `block_${i}`)])
        };
    }, [validateBlock]);

    // Validate funnel (Editor specific)
    const validateFunnel = useCallback(async (funnel: any): Promise<ValidationResult> => {
        if (!funnel || !Array.isArray(funnel.steps)) {
            return {
                isValid: false,
                errors: [{
                    field: 'funnel',
                    type: ValidationType.REQUIRED,
                    severity: ValidationSeverity.ERROR,
                    message: 'Funnel must have steps array'
                }],
                warnings: [],
                infos: [],
                touchedFields: new Set(['funnel'])
            };
        }

        // Validate all steps in funnel
        const stepValidations = await Promise.all(
            funnel.steps.map((step: any) => validateStep(step))
        );

        const allErrors = stepValidations.flatMap(result => result.errors);
        const allWarnings = stepValidations.flatMap(result => result.warnings);
        const allInfos = stepValidations.flatMap(result => result.infos);

        return {
            isValid: allErrors.length === 0,
            errors: allErrors,
            warnings: allWarnings,
            infos: allInfos,
            touchedFields: new Set(['funnel', ...funnel.steps.map((_: any, i: number) => `step_${i}`)])
        };
    }, [validateStep]);

    // Clear validation
    const clearValidation = useCallback((field?: string) => {
        setState(prev => {
            if (field) {
                const newTouchedFields = new Set(prev.validationResult.touchedFields);
                newTouchedFields.delete(field);

                const newErrors = prev.validationResult.errors.filter(e => e.field !== field);
                const newWarnings = prev.validationResult.warnings.filter(e => e.field !== field);
                const newInfos = prev.validationResult.infos.filter(e => e.field !== field);

                return {
                    ...prev,
                    validationResult: {
                        ...prev.validationResult,
                        touchedFields: newTouchedFields,
                        errors: newErrors,
                        warnings: newWarnings,
                        infos: newInfos,
                        isValid: newErrors.length === 0
                    }
                };
            } else {
                return {
                    ...prev,
                    validationResult: {
                        isValid: true,
                        errors: [],
                        warnings: [],
                        infos: [],
                        touchedFields: new Set()
                    }
                };
            }
        });
    }, []);

    // Mark field as touched
    const markFieldTouched = useCallback((field: string) => {
        setState(prev => {
            const newTouchedFields = new Set(prev.validationResult.touchedFields);
            newTouchedFields.add(field);
            return {
                ...prev,
                validationResult: {
                    ...prev.validationResult,
                    touchedFields: newTouchedFields
                }
            };
        });
    }, []);

    // Check if field is touched
    const isFieldTouched = useCallback((field: string): boolean => {
        return state.validationResult.touchedFields.has(field);
    }, [state.validationResult.touchedFields]);

    // Get errors for specific field
    const getFieldErrors = useCallback((field: string): ValidationError[] => {
        return state.validationResult.errors.filter(error => error.field === field);
    }, [state.validationResult.errors]);

    // Check if there are any errors
    const hasErrors = useCallback((): boolean => {
        return state.validationResult.errors.length > 0;
    }, [state.validationResult.errors]);

    // Check if there are any warnings
    const hasWarnings = useCallback((): boolean => {
        return state.validationResult.warnings.length > 0;
    }, [state.validationResult.warnings]);

    // Memoized actions object
    const actions: UnifiedValidationActions = useMemo(() => ({
        registerSchema,
        unregisterSchema,
        validateField,
        validateAllFields,
        validateForm,
        validateBlock,
        validateStep,
        validateFunnel,
        clearValidation,
        markFieldTouched,
        isFieldTouched,
        getFieldErrors,
        hasErrors,
        hasWarnings
    }), [
        registerSchema,
        unregisterSchema,
        validateField,
        validateAllFields,
        validateForm,
        validateBlock,
        validateStep,
        validateFunnel,
        clearValidation,
        markFieldTouched,
        isFieldTouched,
        getFieldErrors,
        hasErrors,
        hasWarnings
    ]);

    return {
        // State
        isValidating: state.isValidating,
        validationResult: state.validationResult,
        schemas: state.schemas,

        // Actions
        ...actions
    };
};

export default useUnifiedValidation;