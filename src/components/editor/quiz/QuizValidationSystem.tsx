/**
 * ✅ SISTEMA DE VALIDAÇÃO DO QUIZ
 *
 * QuizValidationSystem.tsx - Valida respostas, gerencia regras e feedback
 * Sistema modular e extensível para diferentes tipos de validação
 */

import React, { useEffect, useState } from 'react';

export interface QuizValidationSystemProps {
  stepData: any;
  formData: Record<string, any>;
  onValidationChange: (results: Record<string, boolean>) => void;
  mode: 'editor' | 'preview' | 'production';
  rules?: {
    required?: string[];
    minLength?: Record<string, number>;
    patterns?: Record<string, RegExp>;
    custom?: Record<string, (value: any) => boolean>;
  };
}

export const QuizValidationSystem: React.FC<QuizValidationSystemProps> = ({
  stepData,
  formData,
  onValidationChange,
  mode,
  rules = {},
}) => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(true);

  // Executar validação
  useEffect(() => {
    if (!stepData?.blocks) return;

    const errors: Record<string, string> = {};
    let hasErrors = false;

    // Validar cada bloco que precisa de validação
    stepData.blocks.forEach((block: any) => {
      const value = formData[block.id];
      const blockErrors = validateBlock(block, value, rules);
      
      if (blockErrors.length > 0) {
        errors[block.id] = blockErrors[0]; // Primeiro erro apenas
        hasErrors = true;
      }
    });

    setValidationErrors(errors);
    setIsValid(!hasErrors);
    
    // Notificar resultado da validação
    onValidationChange({ [`step_${stepData.id}`]: !hasErrors });

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

  // Não renderizar se não houver dados para validar ou no modo produção
  if (!stepData?.blocks || mode === 'production') {
    return null;
  }

  return (
    <div className="quiz-validation-system fixed top-4 right-4 z-50">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center">
            <span className="mr-2">🔍</span>
            Sistema de Validação
          </h3>
          <div className={`text-xs px-3 py-1 rounded-full font-medium ${
            isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isValid ? '✅ Válido' : '❌ Inválido'}
          </div>
        </div>

        {/* Estatísticas principais */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-blue-600">{status.total}</div>
            <div className="text-xs text-blue-700">Total</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-green-600">{status.valid}</div>
            <div className="text-xs text-green-700">Válidos</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-red-600">{status.invalid}</div>
            <div className="text-xs text-red-700">Erros</div>
          </div>
        </div>

        {/* Barra de progresso da validação */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>Progresso da Validação</span>
            <span>{status.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                status.percentage === 100 ? 'bg-green-500' : status.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${status.percentage}%` }}
            />
          </div>
        </div>

        {/* Lista de erros */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="space-y-2 mb-4">
            <h4 className="text-xs font-medium text-red-700 flex items-center">
              <span className="mr-1">⚠️</span>
              Erros encontrados:
            </h4>
            <div className="space-y-1 max-h-32 overflow-auto">
              {Object.entries(validationErrors).map(([blockId, error]) => (
                <div key={blockId} className="text-xs bg-red-50 border border-red-200 rounded p-2">
                  <div className="font-medium text-red-700">{blockId}:</div>
                  <div className="text-red-600">{error}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resumo de validação por tipo */}
        {status.total > 0 && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <h4 className="text-xs font-medium text-gray-700 mb-2">
              📊 Resumo por Campo:
            </h4>
            <div className="space-y-1">
              {stepData.blocks
                .filter((block: any) => ['quiz-question-block', 'form-input'].includes(block.type))
                .map((block: any) => {
                  const hasError = !!validationErrors[block.id];
                  const hasValue = !!formData[block.id];
                  
                  return (
                    <div key={block.id} className="flex items-center justify-between text-xs">
                      <span className="truncate flex-1 mr-2" title={block.id}>
                        {block.props?.question || block.id}
                      </span>
                      <div className="flex items-center gap-1">
                        {hasValue && <span className="text-blue-500">📝</span>}
                        {hasError ? (
                          <span className="text-red-500">❌</span>
                        ) : hasValue ? (
                          <span className="text-green-500">✅</span>
                        ) : (
                          <span className="text-gray-400">⭕</span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Modo debug (apenas no editor) */}
        {mode === 'editor' && (
          <details className="mt-4">
            <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700 font-medium">
              🔧 Debug & Configurações
            </summary>
            <div className="mt-2 space-y-2">
              <div className="bg-gray-100 rounded p-2 text-xs">
                <div className="font-medium mb-1">Regras de Validação:</div>
                <pre className="text-xs overflow-auto max-h-16">
                  {JSON.stringify(rules, null, 2)}
                </pre>
              </div>
              <div className="bg-gray-100 rounded p-2 text-xs">
                <div className="font-medium mb-1">Dados do Formulário:</div>
                <pre className="text-xs overflow-auto max-h-16">
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </div>
              <div className="bg-gray-100 rounded p-2 text-xs">
                <div className="font-medium mb-1">Erros de Validação:</div>
                <pre className="text-xs overflow-auto max-h-16">
                  {JSON.stringify(validationErrors, null, 2)}
                </pre>
              </div>
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default QuizValidationSystem;
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
    const totalFields =
      stepData?.blocks?.filter((block: any) =>
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
          <h3 className="text-sm font-semibold text-gray-800">🔍 Validação</h3>
          <div
            className={`text-xs px-2 py-1 rounded ${
              isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
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
          <div className="text-center text-xs text-gray-500">{status.percentage}% válido</div>
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
            <summary className="cursor-pointer text-gray-500 hover:text-gray-700">Debug</summary>
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
