/**
 * ✅ ValidationProvider - Sistema de Validação
 * 
 * Responsabilidades:
 * - Validação de formulários
 * - Regras de negócio
 * - Validação assíncrona
 * - Mensagens de erro customizadas
 * 
 * Fase 2.1 - Provider Modular Independente
 */

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type ValidatorFunction = (value: any, context?: any) => boolean | string | Promise<boolean | string>;

export interface ValidationRule {
    validator: ValidatorFunction;
    message?: string;
}

export interface FieldValidation {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    touched: boolean;
    validating: boolean;
}

export interface ValidationState {
    fields: Record<string, FieldValidation>;
    isValidating: boolean;
    isFormValid: boolean;
    touchedCount: number;
    errorCount: number;
}

export interface ValidationContextValue {
    // State
    state: ValidationState;

    // Field validation
    validateField: (fieldId: string, value: any, rules: ValidationRule[], context?: any) => Promise<FieldValidation>;
    getFieldValidation: (fieldId: string) => FieldValidation | undefined;
    setFieldTouched: (fieldId: string, touched: boolean) => void;
    clearFieldValidation: (fieldId: string) => void;

    // Form validation
    validateForm: (fields: Record<string, { value: any; rules: ValidationRule[] }>) => Promise<boolean>;
    isFormValid: () => boolean;
    getFormErrors: () => Record<string, string[]>;

    // Bulk operations
    clearAllValidations: () => void;
    touchAllFields: () => void;

    // Custom validators
    registerValidator: (name: string, validator: ValidatorFunction) => void;
    getValidator: (name: string) => ValidatorFunction | undefined;
}

interface ValidationProviderProps {
    children: ReactNode;
}

// ============================================================================
// CONTEXT
// ============================================================================

const ValidationContext = createContext<ValidationContextValue | undefined>(undefined);

// ============================================================================
// BUILT-IN VALIDATORS
// ============================================================================

const BUILT_IN_VALIDATORS: Record<string, ValidatorFunction> = {
    required: (value: any) => {
        if (value === null || value === undefined || value === '') {
            return 'Campo obrigatório';
        }
        return true;
    },

    email: (value: string) => {
        if (!value) return true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) || 'Email inválido';
    },

    minLength: (min: number) => (value: string) => {
        if (!value) return true;
        return value.length >= min || `Mínimo de ${min} caracteres`;
    },

    maxLength: (max: number) => (value: string) => {
        if (!value) return true;
        return value.length <= max || `Máximo de ${max} caracteres`;
    },

    pattern: (regex: RegExp, message = 'Formato inválido') => (value: string) => {
        if (!value) return true;
        return regex.test(value) || message;
    },

    numeric: (value: any) => {
        if (value === '' || value === null || value === undefined) return true;
        return !isNaN(Number(value)) || 'Deve ser um número';
    },

    url: (value: string) => {
        if (!value) return true;
        try {
            new URL(value);
            return true;
        } catch {
            return 'URL inválida';
        }
    },
};

// ============================================================================
// PROVIDER
// ============================================================================

export function ValidationProvider({ children }: ValidationProviderProps) {
    // State
    const [fields, setFields] = useState<Record<string, FieldValidation>>({});
    const [isValidating, setIsValidating] = useState(false);
    const [customValidators, setCustomValidators] = useState<Record<string, ValidatorFunction>>({});

    // Derived state
    const { isFormValid, touchedCount, errorCount } = useMemo(() => {
        const fieldValues = Object.values(fields);
        const allValid = fieldValues.every(f => f.isValid);
        const touched = fieldValues.filter(f => f.touched).length;
        const errors = fieldValues.reduce((sum, f) => sum + f.errors.length, 0);

        return {
            isFormValid: allValid && fieldValues.length > 0,
            touchedCount: touched,
            errorCount: errors,
        };
    }, [fields]);

    // Field validation
    const validateField = useCallback(async (
        fieldId: string,
        value: any,
        rules: ValidationRule[],
        context?: any
    ): Promise<FieldValidation> => {
        // Set validating state
        setFields(prev => ({
            ...prev,
            [fieldId]: {
                ...prev[fieldId],
                validating: true,
                touched: true,
            },
        }));

        const errors: string[] = [];
        const warnings: string[] = [];

        try {
            // Run all validators
            for (const rule of rules) {
                const result = await Promise.resolve(rule.validator(value, context));

                if (result !== true) {
                    const errorMessage = typeof result === 'string' ? result : rule.message || 'Validação falhou';
                    errors.push(errorMessage);
                }
            }

            const validation: FieldValidation = {
                isValid: errors.length === 0,
                errors,
                warnings,
                touched: true,
                validating: false,
            };

            setFields(prev => ({
                ...prev,
                [fieldId]: validation,
            }));

            appLogger.debug('Field validated', 'ValidationProvider', {
                fieldId,
                isValid: validation.isValid,
                errorCount: errors.length,
            });

            return validation;

        } catch (error) {
            const validation: FieldValidation = {
                isValid: false,
                errors: ['Erro na validação'],
                warnings: [],
                touched: true,
                validating: false,
            };

            setFields(prev => ({
                ...prev,
                [fieldId]: validation,
            }));

            appLogger.error('Field validation failed', 'ValidationProvider', { error, fieldId });
            return validation;
        }
    }, []);

    const getFieldValidation = useCallback((fieldId: string): FieldValidation | undefined => {
        return fields[fieldId];
    }, [fields]);

    const setFieldTouched = useCallback((fieldId: string, touched: boolean) => {
        setFields(prev => {
            if (!prev[fieldId]) return prev;

            return {
                ...prev,
                [fieldId]: {
                    ...prev[fieldId],
                    touched,
                },
            };
        });
    }, []);

    const clearFieldValidation = useCallback((fieldId: string) => {
        setFields(prev => {
            const newFields = { ...prev };
            delete newFields[fieldId];
            return newFields;
        });
        appLogger.debug('Field validation cleared', 'ValidationProvider', { fieldId });
    }, []);

    // Form validation
    const validateForm = useCallback(async (
        formFields: Record<string, { value: any; rules: ValidationRule[] }>
    ): Promise<boolean> => {
        setIsValidating(true);

        try {
            const validations = await Promise.all(
                Object.entries(formFields).map(([fieldId, { value, rules }]) =>
                    validateField(fieldId, value, rules)
                )
            );

            const allValid = validations.every(v => v.isValid);

            appLogger.info('Form validated', 'ValidationProvider', {
                fields: Object.keys(formFields).length,
                isValid: allValid,
            });

            return allValid;

        } finally {
            setIsValidating(false);
        }
    }, [validateField]);

    const isFormValidCallback = useCallback((): boolean => {
        return isFormValid;
    }, [isFormValid]);

    const getFormErrors = useCallback((): Record<string, string[]> => {
        const errors: Record<string, string[]> = {};

        Object.entries(fields).forEach(([fieldId, validation]) => {
            if (validation.errors.length > 0) {
                errors[fieldId] = validation.errors;
            }
        });

        return errors;
    }, [fields]);

    // Bulk operations
    const clearAllValidations = useCallback(() => {
        setFields({});
        appLogger.info('All validations cleared', 'ValidationProvider');
    }, []);

    const touchAllFields = useCallback(() => {
        setFields(prev => {
            const updated: Record<string, FieldValidation> = {};
            Object.entries(prev).forEach(([fieldId, validation]) => {
                updated[fieldId] = { ...validation, touched: true };
            });
            return updated;
        });
    }, []);

    // Custom validators
    const registerValidator = useCallback((name: string, validator: ValidatorFunction) => {
        setCustomValidators(prev => ({
            ...prev,
            [name]: validator,
        }));
        appLogger.info('Custom validator registered', 'ValidationProvider', { name });
    }, []);

    const getValidator = useCallback((name: string): ValidatorFunction | undefined => {
        return customValidators[name] || BUILT_IN_VALIDATORS[name];
    }, [customValidators]);

    // Build state object
    const state: ValidationState = useMemo(() => ({
        fields,
        isValidating,
        isFormValid,
        touchedCount,
        errorCount,
    }), [fields, isValidating, isFormValid, touchedCount, errorCount]);

    // Context value with memoization
    const contextValue = useMemo<ValidationContextValue>(() => ({
        state,
        validateField,
        getFieldValidation,
        setFieldTouched,
        clearFieldValidation,
        validateForm,
        isFormValid: isFormValidCallback,
        getFormErrors,
        clearAllValidations,
        touchAllFields,
        registerValidator,
        getValidator,
    }), [
        state,
        validateField,
        getFieldValidation,
        setFieldTouched,
        clearFieldValidation,
        validateForm,
        isFormValidCallback,
        getFormErrors,
        clearAllValidations,
        touchAllFields,
        registerValidator,
        getValidator,
    ]);

    return (
        <ValidationContext.Provider value={contextValue}>
            {children}
        </ValidationContext.Provider>
    );
}

// ============================================================================
// HOOK
// ============================================================================

export function useValidation(): ValidationContextValue {
    const context = useContext(ValidationContext);

    if (!context) {
        throw new Error('useValidation must be used within ValidationProvider');
    }

    return context;
}

// Export built-in validators for convenience
export const validators = BUILT_IN_VALIDATORS;

// Display name for debugging
ValidationProvider.displayName = 'ValidationProvider';
