/**
 * 🎯 FASE 2 - STEP VALIDATION HOOK
 * 
 * Sistema de validação integrado que replica as regras
 * da versão de produção para o editor
 */

import { useState, useCallback, useEffect } from 'react';
import { z } from 'zod';

// Schemas de validação baseados nas regras reais do quiz21StepsComplete
const stepValidationSchemas = {
  // Step 1 - Nome obrigatório
  1: z.object({
    name: z.string()
      .trim()
      .min(2, 'Nome deve ter pelo menos 2 caracteres')
      .max(100, 'Nome deve ter no máximo 100 caracteres')
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços')
  }),
  
  // Steps 2-11 - Questões pontuadas (3 seleções obrigatórias)
  ...Object.fromEntries(
    Array.from({ length: 10 }, (_, i) => [
      i + 2,
      z.object({
        selectedOptions: z.array(z.string())
          .min(3, 'Selecione exatamente 3 opções')
          .max(3, 'Selecione exatamente 3 opções')
      })
    ])
  ),
  
  // Steps 13-18 - Questões estratégicas (1 seleção obrigatória)
  ...Object.fromEntries(
    Array.from({ length: 6 }, (_, i) => [
      i + 13,
      z.object({
        selectedOptions: z.array(z.string())
          .min(1, 'Selecione uma opção')
          .max(1, 'Selecione apenas uma opção')
      })
    ])
  ),
};

export type ValidationState = 'valid' | 'invalid' | 'warning' | 'pending' | 'none';
export type ValidationResult = {
  isValid: boolean;
  state: ValidationState;
  message?: string;
  errors: string[];
};

export interface StepValidationConfig {
  stepNumber: number;
  funnelId?: string;
  autoAdvanceEnabled?: boolean;
  autoAdvanceDelay?: number;
}

export interface ValidationHookReturn {
  // Estados
  validationResult: ValidationResult;
  isValidating: boolean;
  
  // Dados do step atual
  currentData: any;
  
  // Ações
  validateStep: (data: any) => ValidationResult;
  updateStepData: (data: any) => void;
  clearValidation: () => void;
  
  // Auto-advance
  canAutoAdvance: boolean;
  timeToAutoAdvance: number;
  
  // Helpers para componentes
  getFieldError: (field: string) => string | undefined;
  isFieldValid: (field: string) => boolean;
}

/**
 * Hook principal de validação de steps
 */
export const useStepValidation = (config: StepValidationConfig): ValidationHookReturn => {
  const { stepNumber, autoAdvanceEnabled = false, autoAdvanceDelay = 1500 } = config;
  
  const [currentData, setCurrentData] = useState<any>({});
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: false,
    state: 'none',
    errors: []
  });
  const [isValidating, setIsValidating] = useState(false);
  const [timeToAutoAdvance, setTimeToAutoAdvance] = useState(0);

  // Obter schema de validação para o step atual
  const getStepSchema = useCallback((step: number) => {
    return stepValidationSchemas[step as keyof typeof stepValidationSchemas];
  }, []);

  // Validar dados usando Zod schema
  const validateStep = useCallback((data: any): ValidationResult => {
    const schema = getStepSchema(stepNumber);
    
    if (!schema) {
      return {
        isValid: true,
        state: 'valid',
        errors: []
      };
    }

    try {
      schema.parse(data);
      return {
        isValid: true,
        state: 'valid',
        errors: []
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => err.message);
        return {
          isValid: false,
          state: 'invalid',
          message: errors[0], // Primeira mensagem de erro
          errors
        };
      }
      
      return {
        isValid: false,
        state: 'invalid',
        message: 'Erro de validação',
        errors: ['Erro de validação desconhecido']
      };
    }
  }, [stepNumber, getStepSchema]);

  // Atualizar dados e validar
  const updateStepData = useCallback((data: any) => {
    setCurrentData(data);
    setIsValidating(true);
    
    // Simular delay de validação para UX realística
    setTimeout(() => {
      const result = validateStep(data);
      setValidationResult(result);
      setIsValidating(false);
    }, 100);
  }, [validateStep]);

  // Limpar validação
  const clearValidation = useCallback(() => {
    setValidationResult({
      isValid: false,
      state: 'none',
      errors: []
    });
    setTimeToAutoAdvance(0);
  }, []);

  // Auto-advance logic
  const canAutoAdvance = validationResult.isValid && autoAdvanceEnabled;

  useEffect(() => {
    if (canAutoAdvance) {
      setTimeToAutoAdvance(autoAdvanceDelay);
      
      const interval = setInterval(() => {
        setTimeToAutoAdvance(prev => {
          if (prev <= 100) {
            clearInterval(interval);
            // Disparar evento de auto-advance
            window.dispatchEvent(new CustomEvent('quiz-auto-advance', {
              detail: { 
                fromStep: stepNumber,
                toStep: stepNumber + 1,
                source: 'validation-auto-advance'
              }
            }));
            return 0;
          }
          return prev - 100;
        });
      }, 100);
      
      return () => clearInterval(interval);
    } else {
      setTimeToAutoAdvance(0);
    }
  }, [canAutoAdvance, autoAdvanceDelay, stepNumber]);

  // Helpers para campos específicos
  const getFieldError = useCallback((field: string): string | undefined => {
    if (!validationResult.errors.length) return undefined;
    
    // Mapear erros específicos baseados no schema
    const fieldErrorMap: Record<string, string> = {
      'name': validationResult.errors.find(err => err.includes('Nome')) || validationResult.errors[0],
      'selectedOptions': validationResult.errors.find(err => err.includes('Selecione')) || validationResult.errors[0],
    };
    
    return fieldErrorMap[field];
  }, [validationResult.errors]);

  const isFieldValid = useCallback((field: string): boolean => {
    if (!currentData || validationResult.state === 'none') return false;
    
    // Validação específica por campo
    switch (field) {
      case 'name':
        return !!(currentData.name && currentData.name.length >= 2);
      case 'selectedOptions':
        const expectedCount = stepNumber >= 2 && stepNumber <= 11 ? 3 : 1;
        return Array.isArray(currentData.selectedOptions) && 
               currentData.selectedOptions.length === expectedCount;
      default:
        return validationResult.isValid;
    }
  }, [currentData, validationResult.state, validationResult.isValid, stepNumber]);

  return {
    validationResult,
    isValidating,
    currentData,
    validateStep,
    updateStepData,
    clearValidation,
    canAutoAdvance,
    timeToAutoAdvance,
    getFieldError,
    isFieldValid
  };
};

/**
 * Hook simplificado para validação de campos individuais
 */
export const useFieldValidation = (fieldName: string, value: any, stepNumber: number) => {
  const validation = useStepValidation({ stepNumber, autoAdvanceEnabled: false });
  
  useEffect(() => {
    validation.updateStepData({ [fieldName]: value });
  }, [value, fieldName, validation]);

  return {
    isValid: validation.isFieldValid(fieldName),
    error: validation.getFieldError(fieldName),
    state: validation.validationResult.state
  };
};

export default useStepValidation;