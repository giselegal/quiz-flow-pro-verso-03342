/**
 * 🔥 DYNAMIC VALIDATION SYSTEM
 * Inspirado no Formium e melhorado com insights do Strapi
 * 
 * Sistema avançado de validação para templates:
 * - Validação por etapa
 * - Validação condicional
 * - Plugins de validação
 * - Feedback em tempo real
 */

import { templateEventSystem } from '../events/TemplateEventSystem';

export interface ValidationRule {
    id: string;
    field: string;
    type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom' | 'conditional';
    message: string;
    value?: any;
    condition?: (formData: any) => boolean;
    validator?: (value: any, formData: any) => boolean | Promise<boolean>;
}

export interface ValidationError {
    field: string;
    message: string;
    ruleId: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings?: string[];
}

export interface StepValidationConfig {
    stepId: string;
    rules: ValidationRule[];
    required: boolean;
    dependencies?: string[]; // IDs de outros steps
}

/**
 * Sistema de validação dinâmica para templates
 */
class DynamicValidationSystem {
    private stepValidations: Map<string, StepValidationConfig> = new Map();
    private customValidators: Map<string, Function> = new Map();

    /**
     * Registrar validação para um step
     */
    registerStepValidation(config: StepValidationConfig): void {
        this.stepValidations.set(config.stepId, config);

        templateEventSystem.emit('validation:registered', {
            stepId: config.stepId,
            rulesCount: config.rules.length
        }, 'system');
    }

    /**
     * Registrar validador customizado
     */
    registerCustomValidator(
        id: string,
        validator: (value: any, formData: any) => boolean | Promise<boolean>
    ): void {
        this.customValidators.set(id, validator);
    }

    /**
     * Validar um step específico
     */
    async validateStep(
        stepId: string,
        formData: any,
        templateId: string
    ): Promise<ValidationResult> {
        const config = this.stepValidations.get(stepId);

        if (!config) {
            return { isValid: true, errors: [] };
        }

        const errors: ValidationError[] = [];
        const warnings: string[] = [];

        // Verificar dependências primeiro
        if (config.dependencies) {
            for (const depStepId of config.dependencies) {
                const depResult = await this.validateStep(depStepId, formData, templateId);
                if (!depResult.isValid) {
                    warnings.push(`Step ${depStepId} deve ser válido primeiro`);
                }
            }
        }

        // Validar regras do step
        for (const rule of config.rules) {
            const fieldValue = this.getFieldValue(formData, rule.field);

            // Verificar condição se existir
            if (rule.condition && !rule.condition(formData)) {
                continue; // Pular validação se condição não for atendida
            }

            const isValid = await this.validateRule(rule, fieldValue, formData);

            if (!isValid) {
                errors.push({
                    field: rule.field,
                    message: rule.message,
                    ruleId: rule.id
                });
            }
        }

        const result: ValidationResult = {
            isValid: errors.length === 0,
            errors,
            warnings: warnings.length > 0 ? warnings : undefined
        };

        // Emitir evento
        templateEventSystem.emit(
            result.isValid ? 'validation:success' : 'validation:error',
            { stepId, result },
            templateId
        );

        return result;
    }

    /**
     * Validar template inteiro
     */
    async validateTemplate(formData: any, templateId: string): Promise<ValidationResult> {
        const allErrors: ValidationError[] = [];
        const allWarnings: string[] = [];

        for (const [stepId, config] of this.stepValidations.entries()) {
            if (!config.required) continue;

            const stepResult = await this.validateStep(stepId, formData, templateId);

            if (!stepResult.isValid) {
                allErrors.push(...stepResult.errors);
            }

            if (stepResult.warnings) {
                allWarnings.push(...stepResult.warnings);
            }
        }

        return {
            isValid: allErrors.length === 0,
            errors: allErrors,
            warnings: allWarnings.length > 0 ? allWarnings : undefined
        };
    }

    /**
     * Validar uma regra específica
     */
    private async validateRule(
        rule: ValidationRule,
        value: any,
        formData: any
    ): Promise<boolean> {
        switch (rule.type) {
            case 'required':
                return this.validateRequired(value);

            case 'minLength':
                return this.validateMinLength(value, rule.value);

            case 'maxLength':
                return this.validateMaxLength(value, rule.value);

            case 'pattern':
                return this.validatePattern(value, rule.value);

            case 'custom':
                if (rule.validator) {
                    return await rule.validator(value, formData);
                }
                const customValidator = this.customValidators.get(rule.id);
                if (customValidator) {
                    return await customValidator(value, formData);
                }
                return true;

            case 'conditional':
                if (rule.condition) {
                    return rule.condition(formData);
                }
                return true;

            default:
                return true;
        }
    }

    private validateRequired(value: any): boolean {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string' && value.trim() === '') return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
    }

    private validateMinLength(value: any, minLength: number): boolean {
        if (!value) return true; // Se não é obrigatório
        return String(value).length >= minLength;
    }

    private validateMaxLength(value: any, maxLength: number): boolean {
        if (!value) return true;
        return String(value).length <= maxLength;
    }

    private validatePattern(value: any, pattern: string | RegExp): boolean {
        if (!value) return true;
        const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
        return regex.test(String(value));
    }

    private getFieldValue(formData: any, fieldPath: string): any {
        return fieldPath.split('.').reduce((obj, key) => obj?.[key], formData);
    }

    /**
     * Limpar validações
     */
    clearValidations(): void {
        this.stepValidations.clear();
        this.customValidators.clear();
    }

    /**
     * Remover validação de um step
     */
    removeStepValidation(stepId: string): void {
        this.stepValidations.delete(stepId);
    }
}

// Instância global do sistema de validação
export const dynamicValidationSystem = new DynamicValidationSystem();

/**
 * Hook para usar validação em componentes React
 */
import { useState, useCallback } from 'react';
import { useTemplateEvents } from '../events/TemplateEventSystem';

export function useStepValidation(stepId: string, templateId: string) {
    const [validationResult, setValidationResult] = useState<ValidationResult>({
        isValid: true,
        errors: []
    });

    // Escutar eventos de validação
    useTemplateEvents('validation:success', (event: any) => {
        if (event.payload.stepId === stepId) {
            setValidationResult(event.payload.result);
        }
    });

    useTemplateEvents('validation:error', (event: any) => {
        if (event.payload.stepId === stepId) {
            setValidationResult(event.payload.result);
        }
    });

    const validateStep = useCallback(async (formData: any) => {
        const result = await dynamicValidationSystem.validateStep(stepId, formData, templateId);
        setValidationResult(result);
        return result;
    }, [stepId, templateId]);

    return {
        validationResult,
        validateStep,
        isValid: validationResult.isValid,
        errors: validationResult.errors,
        warnings: validationResult.warnings
    };
}