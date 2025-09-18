/**
 * useQuizValidation Hook - Input Validation and Feedback
 *
 * Provides validation logic for quiz steps, user inputs, and form data.
 * Includes real-time feedback and error handling capabilities.
 */

import { QuizValidationHook, UserAnswer, ValidationResult } from '@/types/quizCore';
import { useCallback } from 'react';

// NOTE: Default validation rules available for extension
/*
const defaultValidationRules: Record<string, ValidationRule[]> = {
  intro: [
    {
      type: 'required',
      message: 'Nome é obrigatório para continuar',
    },
    {
      type: 'minLength',
      value: 2,
      message: 'Nome deve ter pelo menos 2 caracteres',
    },
  ],
  question: [
    {
      type: 'required',
      message: 'Selecione pelo menos uma opção para continuar',
    },
  ],
  strategic: [
    {
      type: 'required',
      message: 'Selecione uma opção para continuar',
    },
  ],
};
*/

// Step-specific validation configurations with enhanced feedback
const stepValidationConfig: Record<string, any> = {
  'step-1': {
    type: 'intro',
    requiredFields: ['userName'],
    minLength: { userName: 2 },
    validation: {
      realTime: true,
      showVisualFeedback: true,
      customMessages: {
        required: 'Por favor, informe seu nome para continuar',
        minLength: 'Seu nome deve ter pelo menos 2 caracteres',
      },
    },
  },
  'step-2': {
    type: 'question',
    minSelections: 3,
    maxSelections: 3,
    requiredSelections: 3,
  },
  'step-3': {
    type: 'question',
    minSelections: 3,
    maxSelections: 3,
    requiredSelections: 3,
  },
  // Steps 4-11 follow similar pattern
  'step-4': { type: 'question', minSelections: 3, maxSelections: 3, requiredSelections: 3 },
  'step-5': { type: 'question', minSelections: 3, maxSelections: 3, requiredSelections: 3 },
  'step-6': { type: 'question', minSelections: 3, maxSelections: 3, requiredSelections: 3 },
  'step-7': { type: 'question', minSelections: 3, maxSelections: 3, requiredSelections: 3 },
  'step-8': { type: 'question', minSelections: 3, maxSelections: 3, requiredSelections: 3 },
  'step-9': { type: 'question', minSelections: 3, maxSelections: 3, requiredSelections: 3 },
  'step-10': { type: 'question', minSelections: 3, maxSelections: 3, requiredSelections: 3 },
  'step-11': { type: 'question', minSelections: 3, maxSelections: 3, requiredSelections: 3 },

  // Strategic questions (steps 13-18)
  'step-13': { type: 'strategic', minSelections: 1, maxSelections: 1, requiredSelections: 1 },
  'step-14': { type: 'strategic', minSelections: 1, maxSelections: 1, requiredSelections: 1 },
  'step-15': { type: 'strategic', minSelections: 1, maxSelections: 1, requiredSelections: 1 },
  'step-16': { type: 'strategic', minSelections: 1, maxSelections: 1, requiredSelections: 1 },
  'step-17': { type: 'strategic', minSelections: 1, maxSelections: 1, requiredSelections: 1 },
  'step-18': { type: 'strategic', minSelections: 1, maxSelections: 1, requiredSelections: 1 },
};

export const useQuizValidation = (
  userAnswers: UserAnswer[] = [],
  sessionData: Record<string, any> = {}
): QuizValidationHook => {
  // Validate a complete step
  const validateStep = useCallback(
    (stepId: string, answers: UserAnswer[]): ValidationResult => {
      const config = stepValidationConfig[stepId];
      const errors: string[] = [];
      const warnings: string[] = [];

      if (!config) {
        return {
          isValid: true,
          errors,
          warnings: ['⚠️ No validation config found for this step'],
        };
      }

      // Find answer for this step
      const stepAnswer = answers.find(answer => answer.stepId === stepId);

      // Validate based on step type
      if (config.type === 'intro') {
        // Validate name input
        const userName = sessionData.userName || '';

        if (!userName || userName.trim().length === 0) {
          errors.push('Nome é obrigatório para continuar');
        } else if (userName.trim().length < 2) {
          errors.push('Nome deve ter pelo menos 2 caracteres');
        }
      } else if (config.type === 'question' || config.type === 'strategic') {
        // Validate selections
        if (!stepAnswer) {
          errors.push('Nenhuma resposta encontrada para esta etapa');
        } else {
          const selectedCount = stepAnswer.selectedOptions.length;

          if (config.requiredSelections && selectedCount < config.requiredSelections) {
            errors.push(`Selecione ${config.requiredSelections} opções para continuar`);
          }

          if (config.minSelections && selectedCount < config.minSelections) {
            errors.push(`Selecione pelo menos ${config.minSelections} opções`);
          }

          if (config.maxSelections && selectedCount > config.maxSelections) {
            errors.push(`Selecione no máximo ${config.maxSelections} opções`);
          }
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    },
    [sessionData]
  );

  // Validate a single answer
  const validateAnswer = useCallback((answer: UserAnswer): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic answer validation
    if (!answer.stepId) {
      errors.push('ID da etapa é obrigatório');
    }

    if (!answer.questionId) {
      errors.push('ID da questão é obrigatório');
    }

    if (!answer.selectedOptions || answer.selectedOptions.length === 0) {
      errors.push('Pelo menos uma opção deve ser selecionada');
    }

    // Validate answer details
    if (answer.selectedOptions.length !== answer.selectedOptionDetails.length) {
      warnings.push('Inconsistência entre opções selecionadas e detalhes');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }, []);

  // Get errors for a specific step
  const getStepErrors = useCallback(
    (stepId: string): string[] => {
      const validation = validateStep(stepId, userAnswers);
      return validation.errors;
    },
    [validateStep, userAnswers]
  );

  // Check if a step is valid
  const isStepValid = useCallback(
    (stepId: string): boolean => {
      const validation = validateStep(stepId, userAnswers);
      return validation.isValid;
    },
    [validateStep, userAnswers]
  );

  return {
    validateStep,
    validateAnswer,
    getStepErrors,
    isStepValid,
  };
};

export default useQuizValidation;
