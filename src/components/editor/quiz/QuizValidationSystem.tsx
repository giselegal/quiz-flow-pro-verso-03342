/**
 * ✅ SISTEMA DE VALIDAÇÃO DO QUIZ
 *
 * QuizValidationSystem.tsx - Valida respostas, gerencia regras e feedback
 * Sistema modular e extensível para diferentes tipos de validação
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';

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
  stepData?: any;
  formData?: Record<string, any>;
  onValidationChange?: (results: Record<string, boolean>) => void;
}

export const QuizValidationSystem: React.FC<QuizValidationSystemProps> = ({
  config,
  customRules,
  enableRealTimeValidation = true,
  showValidationMessages = true,
  stepData,
  formData,
  onValidationChange,
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
                  message: '', // Removido: 'Selecione 3 opções para continuar'
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
                  message: '', // Removido: 'Máximo de 3 opções permitidas'
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

  // Executar validação em tempo real para o sistema de formulário
  useEffect(() => {
    if (!stepData?.blocks) return;

    const errors: Record<string, string> = {};
    let hasErrors = false;

    // Validar cada bloco que precisa de validação
    stepData.blocks.forEach((block: any) => {
      const value = formData?.[block.id];
      const blockErrors = validateBlock(block, value, rules);
      
      if (blockErrors.length > 0) {
        errors[block.id] = blockErrors[0]; // Primeiro erro apenas
        hasErrors = true;
      }
    });

    setValidationErrors(errors);
    setIsValid(!hasErrors);
    
    // Notificar resultado da validação
    if (onValidationChange) {
      onValidationChange({ [`step_${stepData.id}`]: !hasErrors });
    }

  }, [stepData, formData, rules, onValidationChange]);

  // Função para validar um bloco individual
  const validateBlock = (block: any, value: any, validationRules: any): string[] => {
    const errors: string[] = [];
    const blockId = block.id;

    // Pular validação para blocos que não precisam
    if (!['quiz-question-block', 'form-input'].includes(block.type)) {
      return errors;
    }

    // Validação de campo obrigatório
    if (validationRules.required?.includes(blockId) || block.props?.required) {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        errors.push('Este campo é obrigatório');
      }
    }

    // Validação de comprimento mínimo
    if (value && validationRules.minLength?.[blockId]) {
      const minLength = validationRules.minLength[blockId];
      if (value.toString().length < minLength) {
        errors.push(`Mínimo de ${minLength} caracteres`);
      }
    }

    // Validação de padrão (regex)
    if (value && validationRules.patterns?.[blockId]) {
      const pattern = validationRules.patterns[blockId];
      if (!pattern.test(value.toString())) {
        errors.push('Formato inválido');
      }
    }

    // Validação customizada
    if (value && validationRules.custom?.[blockId]) {
      const customValidator = validationRules.custom[blockId];
      if (!customValidator(value)) {
        errors.push('Valor inválido');
      }
    }

    // Validações específicas por tipo de bloco
    if (block.type === 'quiz-question-block') {
      if (block.props?.type === 'multiple-choice' && block.props?.required && !value) {
        errors.push('Selecione uma opção');
      }
      
      if (block.props?.type === 'text-input' && value) {
        // Validação de email se for campo de email
        if (block.props?.inputType === 'email') {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(value)) {
            errors.push('Email inválido');
          }
        }
        
        // Validação de telefone se for campo de telefone
        if (block.props?.inputType === 'phone') {
          const phonePattern = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
          if (!phonePattern.test(value)) {
            errors.push('Telefone inválido. Use o formato (11) 99999-9999');
          }
        }
      }
    }

    return errors;
  };

  // Obter status de validação para exibição
  const getValidationStatus = () => {
    const totalFields = stepData?.blocks?.filter((block: any) => 
      ['quiz-question-block', 'form-input'].includes(block.type)
    ).length || 0;
    
    const errorCount = Object.keys(validationErrors).length;
    const validCount = totalFields - errorCount;

    return {
      total: totalFields,
      valid: validCount,
      invalid: errorCount,
      percentage: totalFields > 0 ? Math.round((validCount / totalFields) * 100) : 100,
    };
  };

  const status = getValidationStatus();

  // Não renderizar se não houver dados para validar
  if (!stepData?.blocks || mode === 'production') {
    return null;
  }

  return (
    <div className="quiz-validation-system fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">
            🔍 Validação
          </h3>
          <div className={`text-xs px-2 py-1 rounded ${
            isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isValid ? '✅ Válido' : '❌ Inválido'}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Total de campos:</span>
            <span>{status.total}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Válidos:</span>
            <span className="text-green-600">{status.valid}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Com erro:</span>
            <span className="text-red-600">{status.invalid}</span>
          </div>
          
          {/* Barra de progresso */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                status.percentage === 100 ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${status.percentage}%` }}
            />
          </div>
          <div className="text-center text-xs text-gray-500">
            {status.percentage}% válido
          </div>
        </div>

        {/* Lista de erros */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-red-700">Erros encontrados:</h4>
            <div className="space-y-1">
              {Object.entries(validationErrors).map(([blockId, error]) => (
                <div key={blockId} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                  <span className="font-medium">{blockId}:</span> {error}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modo debug (apenas no editor) */}
        {mode === 'editor' && (
          <details className="mt-4 text-xs">
            <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
              Debug
            </summary>
            <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto max-h-24">
              {JSON.stringify({ formData, validationErrors, rules }, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default QuizValidationSystem;
