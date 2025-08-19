/**
 * ✅ SISTEMA DE VALIDAÇÃO DO QUIZ
 *
 * QuizValidationSystem.tsx - Valida respostas, gerencia regras e feedback
 * Sistema modular e extensível para diferentes tipos de validação
 */

import React, { useCallback, useEffect, useMemo } from 'react';

interface ValidationRule {
  id: string;
  type: 'required' | 'minSelections' | 'maxSelections' | 'pattern' | 'custom';
  message: string;
  value?: any;
  customValidator?: (data: any) => boolean;
}

interface StepValidationConfig {
  stepNumber: number;
  rules: ValidationRule[];
  autoValidate?: boolean;
  showFeedback?: boolean;
}

interface QuizValidationSystemConfig {
  mode: 'editor' | 'preview' | 'production';
  quizState: {
    currentStep: number;
    sessionData: Record<string, any>;
    userAnswers: Record<string, any>;
    stepValidation: Record<number, boolean>;
  };
  validation: {
    onStepValidation: (stepNumber: number, isValid: boolean) => void;
  };
}

interface QuizValidationSystemProps {
  config: QuizValidationSystemConfig;
  customRules?: Record<number, StepValidationConfig>;
  enableRealTimeValidation?: boolean;
  showValidationMessages?: boolean;
}

export const QuizValidationSystem: React.FC<QuizValidationSystemProps> = ({
  config,
  customRules,
  enableRealTimeValidation = true,
  showValidationMessages = true,
}) => {
  const { mode, quizState, validation } = config;

  // ========================================
  // Regras de Validação Padrão
  // ========================================
  const defaultValidationRules = useMemo<Record<number, StepValidationConfig>>(
    () => ({
      // Etapa 1: Nome obrigatório
      1: {
        stepNumber: 1,
        rules: [
          {
            id: 'name-required',
            type: 'required',
            message: 'Por favor, digite seu nome para continuar',
            customValidator: data => !!data.sessionData?.userName?.trim(),
          },
          {
            id: 'name-min-length',
            type: 'custom',
            message: 'Nome deve ter pelo menos 2 caracteres',
            customValidator: data => (data.sessionData?.userName?.trim()?.length || 0) >= 2,
          },
        ],
        autoValidate: true,
        showFeedback: true,
      },

      // Etapas 2-11: Questões com 3 seleções obrigatórias
      ...Object.fromEntries(
        Array.from({ length: 10 }, (_, i) => {
          const stepNumber = i + 2;
          const questionId = `q${stepNumber - 1}`;

          return [
            stepNumber,
            {
              stepNumber,
              rules: [
                {
                  id: `${questionId}-min-selections`,
                  type: 'minSelections',
                  message: 'Selecione 3 opções para continuar',
                  value: 3,
                  customValidator: data => {
                    const answers = Object.keys(data.userAnswers || {}).filter(key =>
                      key.startsWith(`${questionId}_`)
                    );
                    return answers.length >= 3;
                  },
                },
                {
                  id: `${questionId}-max-selections`,
                  type: 'maxSelections',
                  message: 'Máximo de 3 opções permitidas',
                  value: 3,
                  customValidator: data => {
                    const answers = Object.keys(data.userAnswers || {}).filter(key =>
                      key.startsWith(`${questionId}_`)
                    );
                    return answers.length <= 3;
                  },
                },
              ],
              autoValidate: true,
              showFeedback: true,
            },
          ];
        })
      ),

      // Etapa 12: Transição (sempre válida)
      12: {
        stepNumber: 12,
        rules: [
          {
            id: 'transition-always-valid',
            type: 'custom',
            message: '',
            customValidator: () => true,
          },
        ],
        autoValidate: true,
        showFeedback: false,
      },

      // Etapas 13-18: Questões estratégicas (1 seleção obrigatória)
      ...Object.fromEntries(
        Array.from({ length: 6 }, (_, i) => {
          const stepNumber = i + 13;
          const questionId = `qs${stepNumber - 12}`;

          return [
            stepNumber,
            {
              stepNumber,
              rules: [
                {
                  id: `${questionId}-required`,
                  type: 'required',
                  message: 'Selecione 1 opção para continuar',
                  customValidator: data => {
                    const answers = Object.keys(data.userAnswers || {}).filter(key =>
                      key.startsWith(`${questionId}_`)
                    );
                    return answers.length >= 1;
                  },
                },
              ],
              autoValidate: true,
              showFeedback: true,
            },
          ];
        })
      ),

      // Etapa 19: Transição (sempre válida)
      19: {
        stepNumber: 19,
        rules: [
          {
            id: 'calculation-transition',
            type: 'custom',
            message: '',
            customValidator: () => true,
          },
        ],
        autoValidate: true,
        showFeedback: false,
      },

      // Etapas 20-21: Resultado e oferta (sempre válidas)
      20: {
        stepNumber: 20,
        rules: [
          {
            id: 'result-always-valid',
            type: 'custom',
            message: '',
            customValidator: () => true,
          },
        ],
        autoValidate: true,
        showFeedback: false,
      },

      21: {
        stepNumber: 21,
        rules: [
          {
            id: 'offer-always-valid',
            type: 'custom',
            message: '',
            customValidator: () => true,
          },
        ],
        autoValidate: true,
        showFeedback: false,
      },
    }),
    []
  );

  // ========================================
  // Combinar regras padrão com customizadas
  // ========================================
  const validationRules = useMemo(
    () => ({
      ...defaultValidationRules,
      ...customRules,
    }),
    [defaultValidationRules, customRules]
  );

  // ========================================
  // Validar Etapa Específica
  // ========================================
  const validateStep = useCallback(
    (stepNumber: number, data: typeof quizState) => {
      const stepConfig = validationRules[stepNumber];
      if (!stepConfig) {
        console.warn(`⚠️ No validation rules found for step ${stepNumber}`);
        return { isValid: true, errors: [] };
      }

      const errors: string[] = [];
      let isValid = true;

      for (const rule of stepConfig.rules) {
        let ruleValid = false;

        try {
          if (rule.customValidator) {
            ruleValid = rule.customValidator(data);
          } else {
            // Validações básicas por tipo
            switch (rule.type) {
              case 'required':
                ruleValid = !!data.sessionData?.userName?.trim();
                break;
              case 'minSelections':
              case 'maxSelections':
                // Implementado via customValidator
                ruleValid = true;
                break;
              default:
                ruleValid = true;
            }
          }
        } catch (error) {
          console.error(`❌ Validation error for rule ${rule.id}:`, error);
          ruleValid = false;
        }

        if (!ruleValid) {
          isValid = false;
          if (rule.message && stepConfig.showFeedback) {
            errors.push(rule.message);
          }
        }
      }

      return { isValid, errors };
    },
    [validationRules]
  );

  // ========================================
  // Auto-validação em tempo real
  // ========================================
  useEffect(() => {
    if (enableRealTimeValidation) {
      const result = validateStep(quizState.currentStep, quizState);
      validation.onStepValidation(quizState.currentStep, result.isValid);

      // Log de debug em modo editor
      if (mode === 'editor' && result.errors.length > 0) {
        console.log(`🔍 Validation errors for step ${quizState.currentStep}:`, result.errors);
      }
    }
  }, [quizState, enableRealTimeValidation, validateStep, validation, mode]);

  // ========================================
  // Validação de todas as etapas (útil para debug)
  // ========================================
  const validateAllSteps = useCallback(() => {
    const results: Record<number, { isValid: boolean; errors: string[] }> = {};

    for (let step = 1; step <= 21; step++) {
      results[step] = validateStep(step, quizState);
    }

    return results;
  }, [validateStep, quizState]);

  // ========================================
  // Expor métodos para debug (modo editor)
  // ========================================
  useEffect(() => {
    if (mode === 'editor' && typeof window !== 'undefined') {
      (window as any).quizValidation = {
        validateStep: (step: number) => validateStep(step, quizState),
        validateAllSteps,
        getCurrentStepRules: () => validationRules[quizState.currentStep],
        getAllRules: () => validationRules,
        getCurrentValidation: () => ({
          step: quizState.currentStep,
          isValid: quizState.stepValidation[quizState.currentStep],
          rules: validationRules[quizState.currentStep],
        }),
      };
    }
  }, [mode, validateStep, quizState, validateAllSteps, validationRules]);

  // ========================================
  // Feedback Visual (em modo editor)
  // ========================================
  useEffect(() => {
    if (mode === 'editor' && showValidationMessages) {
      const result = validateStep(quizState.currentStep, quizState);

      if (result.errors.length > 0) {
        // Aqui você pode implementar um sistema de notificações
        console.log(`📋 Step ${quizState.currentStep} validation:`, {
          isValid: result.isValid,
          errors: result.errors,
        });
      }
    }
  }, [mode, showValidationMessages, quizState, validateStep]);

  // ========================================
  // Performance: Debounce para validações complexas
  // ========================================
  useEffect(() => {
    if (enableRealTimeValidation) {
      const timeoutId = setTimeout(() => {
        // Validação com debounce para evitar múltiplas execuções
        const result = validateStep(quizState.currentStep, quizState);

        // Analytics de validação (apenas em produção)
        if (mode === 'production') {
          // Registrar eventos de validação para analytics
          if (typeof window !== 'undefined' && (window as any).dataLayer) {
            (window as any).dataLayer.push({
              event: 'quiz_validation',
              quiz_step: quizState.currentStep,
              is_valid: result.isValid,
              error_count: result.errors.length,
            });
          }
        }
      }, 300); // Debounce de 300ms

      return () => clearTimeout(timeoutId);
    }
  }, [
    quizState.userAnswers,
    quizState.sessionData,
    mode,
    enableRealTimeValidation,
    validateStep,
    quizState.currentStep,
  ]);

  // Este componente não renderiza nada visível
  return null;
};

export default QuizValidationSystem;
