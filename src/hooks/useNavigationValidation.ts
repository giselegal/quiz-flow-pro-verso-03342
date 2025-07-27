import { useState, useCallback, useEffect } from 'react';
import { SchemaDrivenFunnelData, SchemaDrivenPageData } from '../services/schemaDrivenFunnelService';

export interface ValidationError {
  field: string;
  message: string;
  type: 'required' | 'invalid' | 'incomplete';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  canProceed: boolean;
}

interface UseNavigationValidationOptions {
  enableAutoValidation?: boolean;
  validateOnStepChange?: boolean;
}

export const useNavigationValidation = (
  currentStep: number,
  funnelData: SchemaDrivenFunnelData,
  options: UseNavigationValidationOptions = {}
) => {
  const { enableAutoValidation = true, validateOnStepChange = true } = options;
  
  const [validationState, setValidationState] = useState<Record<number, ValidationResult>>({});
  const [isValidating, setIsValidating] = useState(false);

  // Validar uma etapa específica
  const validateStep = useCallback((stepNumber: number, data: StepData): ValidationResult => {
    const step = data.steps.find(s => s.stepNumber === stepNumber);
    
    if (!step) {
      return {
        isValid: false,
        errors: [{ field: 'step', message: 'Etapa não encontrada', type: 'invalid' }],
        canProceed: false
      };
    }

    const errors: ValidationError[] = [];

    // Validações baseadas no tipo de etapa
    switch (step.type) {
      case 'quiz-intro':
        // Validar se há título e descrição
        if (!step.content?.title?.trim()) {
          errors.push({
            field: 'title',
            message: 'Título é obrigatório',
            type: 'required'
          });
        }
        break;

      case 'quiz-question':
        // Validar pergunta
        if (!step.content?.question?.trim()) {
          errors.push({
            field: 'question',
            message: 'Pergunta é obrigatória',
            type: 'required'
          });
        }

        // Validar opções
        const options = step.content?.options || [];
        if (options.length < 2) {
          errors.push({
            field: 'options',
            message: 'Pelo menos 2 opções são necessárias',
            type: 'incomplete'
          });
        }

        // Verificar se todas as opções têm texto
        options.forEach((option, index) => {
          if (!option.text?.trim()) {
            errors.push({
              field: `option_${index}`,
              message: `Opção ${index + 1} não pode estar vazia`,
              type: 'required'
            });
          }
        });

        // Validar seleção do usuário (se necessário)
        const userSelection = step.userInput?.selectedOption;
        if (enableAutoValidation && userSelection === undefined) {
          errors.push({
            field: 'selection',
            message: 'Selecione uma opção para continuar',
            type: 'required'
          });
        }
        break;

      case 'quiz-result':
        // Validar título do resultado
        if (!step.content?.title?.trim()) {
          errors.push({
            field: 'title',
            message: 'Título do resultado é obrigatório',
            type: 'required'
          });
        }

        // Validar descrição
        if (!step.content?.description?.trim()) {
          errors.push({
            field: 'description',
            message: 'Descrição do resultado é obrigatória',
            type: 'required'
          });
        }
        break;

      case 'form-step':
        // Validar campos do formulário
        const formData = step.userInput?.formData || {};
        const requiredFields = step.content?.fields?.filter(f => f.required) || [];
        
        requiredFields.forEach(field => {
          if (!formData[field.name]?.trim()) {
            errors.push({
              field: field.name,
              message: `${field.label} é obrigatório`,
              type: 'required'
            });
          }
        });
        break;
    }

    // Verificar se há componentes necessários
    if (step.blocks && step.blocks.length === 0) {
      errors.push({
        field: 'blocks',
        message: 'Etapa precisa ter pelo menos um componente',
        type: 'incomplete'
      });
    }

    const isValid = errors.length === 0;
    const canProceed = enableAutoValidation ? isValid : true;

    return {
      isValid,
      errors,
      canProceed
    };
  }, [enableAutoValidation]);

  // Validar todas as etapas
  const validateAllSteps = useCallback(async (): Promise<Record<number, ValidationResult>> => {
    setIsValidating(true);
    
    const results: Record<number, ValidationResult> = {};
    
    stepData.steps.forEach(step => {
      results[step.stepNumber] = validateStep(step.stepNumber, stepData);
    });

    setValidationState(results);
    setIsValidating(false);
    
    return results;
  }, [stepData, validateStep]);

  // Validar antes de navegar para próxima etapa
  const validateForNavigation = useCallback((fromStep: number, toStep: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const currentStepValidation = validateStep(fromStep, stepData);
      
      // Atualizar estado de validação
      setValidationState(prev => ({
        ...prev,
        [fromStep]: currentStepValidation
      }));

      // Permitir navegação se a validação passou ou se não é obrigatória
      resolve(currentStepValidation.canProceed);
    });
  }, [stepData, validateStep]);

  // Obter resultado de validação para uma etapa
  const getStepValidation = useCallback((stepNumber: number): ValidationResult => {
    return validationState[stepNumber] || {
      isValid: true,
      errors: [],
      canProceed: true
    };
  }, [validationState]);

  // Verificar se todas as etapas são válidas
  const areAllStepsValid = useCallback((): boolean => {
    return Object.values(validationState).every(result => result.isValid);
  }, [validationState]);

  // Obter próxima etapa inválida
  const getNextInvalidStep = useCallback((): number | null => {
    const sortedSteps = stepData.steps.sort((a, b) => a.stepNumber - b.stepNumber);
    
    for (const step of sortedSteps) {
      const validation = validationState[step.stepNumber];
      if (validation && !validation.isValid) {
        return step.stepNumber;
      }
    }
    
    return null;
  }, [stepData, validationState]);

  // Calcular progresso de validação
  const getValidationProgress = useCallback((): { completed: number; total: number; percentage: number } => {
    const total = stepData.steps.length;
    const completed = Object.values(validationState).filter(result => result.isValid).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  }, [stepData, validationState]);

  // Auto-validar quando a etapa atual muda
  useEffect(() => {
    if (validateOnStepChange && currentStep) {
      const validation = validateStep(currentStep, stepData);
      setValidationState(prev => ({
        ...prev,
        [currentStep]: validation
      }));
    }
  }, [currentStep, stepData, validateOnStepChange, validateStep]);

  return {
    // Estados
    validationState,
    isValidating,
    
    // Funções de validação
    validateStep,
    validateAllSteps,
    validateForNavigation,
    
    // Getters
    getStepValidation,
    areAllStepsValid,
    getNextInvalidStep,
    getValidationProgress,
    
    // Helpers
    hasErrors: (stepNumber: number) => {
      const validation = getStepValidation(stepNumber);
      return validation.errors.length > 0;
    },
    
    canProceedFromStep: (stepNumber: number) => {
      const validation = getStepValidation(stepNumber);
      return validation.canProceed;
    },
    
    getStepErrors: (stepNumber: number) => {
      const validation = getStepValidation(stepNumber);
      return validation.errors;
    }
  };
};
