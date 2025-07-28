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

  // Validar uma página específica
  const validatePage = useCallback((pageIndex: number, data: SchemaDrivenFunnelData): ValidationResult => {
    const page = data.pages[pageIndex];
    
    if (!page) {
      return {
        isValid: false,
        errors: [{ field: 'page', message: 'Página não encontrada', type: 'invalid' }],
        canProceed: false
      };
    }

    const errors: ValidationError[] = [];

    // Validações baseadas no tipo de página
    switch (page.type) {
      case 'intro':
        // Validar se há título
        if (!page.title?.trim()) {
          errors.push({
            field: 'title',
            message: 'Título é obrigatório',
            type: 'required'
          });
        }
        break;

      case 'question':
        // Validar se há blocos de pergunta
        const questionBlocks = page.blocks.filter(block => 
          block.type === 'options-grid' || 
          block.type === 'text-inline' || 
          block.type === 'heading-inline'
        );
        
        if (questionBlocks.length === 0) {
          errors.push({
            field: 'question',
            message: 'Página de pergunta precisa ter componentes de questão',
            type: 'required'
          });
        }

        // Verificar se há opções
        const optionsBlock = page.blocks.find(block => block.type === 'options-grid');
        if (optionsBlock && optionsBlock.properties?.options) {
          const options = optionsBlock.properties.options;
          if (options.length < 2) {
            errors.push({
              field: 'options',
              message: 'Pelo menos 2 opções são necessárias',
              type: 'incomplete'
            });
          }

          // Verificar se todas as opções têm texto
          options.forEach((option: any, index: number) => {
            if (!option.text?.trim()) {
              errors.push({
                field: `option_${index}`,
                message: `Opção ${index + 1} não pode estar vazia`,
                type: 'required'
              });
            }
          });
        }
        break;

      case 'result':
        // Validar título do resultado
        if (!page.title?.trim()) {
          errors.push({
            field: 'title',
            message: 'Título do resultado é obrigatório',
            type: 'required'
          });
        }

        // Verificar se há blocos de resultado
        const resultBlocks = page.blocks.filter(block => 
          block.type === 'result-header-inline' || 
          block.type === 'result-card-inline' ||
          block.type === 'style-card-inline'
        );
        
        if (resultBlocks.length === 0) {
          errors.push({
            field: 'result',
            message: 'Página de resultado precisa ter componentes de resultado',
            type: 'required'
          });
        }
        break;

      case 'offer':
      case 'thank-you':
        // Validar título
        if (!page.title?.trim()) {
          errors.push({
            field: 'title',
            message: 'Título é obrigatório',
            type: 'required'
          });
        }
        break;
    }

    // Verificar se há componentes
    if (page.blocks && page.blocks.length === 0) {
      errors.push({
        field: 'blocks',
        message: 'Página precisa ter pelo menos um componente',
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

  // Validar todas as páginas
  const validateAllPages = useCallback(async (): Promise<Record<number, ValidationResult>> => {
    setIsValidating(true);
    
    const results: Record<number, ValidationResult> = {};
    
    funnelData.pages.forEach((page, index) => {
      results[index] = validatePage(index, funnelData);
    });

    setValidationState(results);
    setIsValidating(false);
    
    return results;
  }, [funnelData, validatePage]);

  // Validar antes de navegar para próxima página
  const validateForNavigation = useCallback((fromPage: number, toPage: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const currentPageValidation = validatePage(fromPage, funnelData);
      
      // Atualizar estado de validação
      setValidationState(prev => ({
        ...prev,
        [fromPage]: currentPageValidation
      }));

      // Permitir navegação se a validação passou ou se não é obrigatória
      resolve(currentPageValidation.canProceed);
    });
  }, [funnelData, validatePage]);

  // Obter resultado de validação para uma página
  const getPageValidation = useCallback((pageIndex: number): ValidationResult => {
    return validationState[pageIndex] || {
      isValid: true,
      errors: [],
      canProceed: true
    };
  }, [validationState]);

  // Verificar se todas as páginas são válidas
  const areAllPagesValid = useCallback((): boolean => {
    return Object.values(validationState).every(result => result.isValid);
  }, [validationState]);

  // Obter próxima página inválida
  const getNextInvalidPage = useCallback((): number | null => {
    for (let i = 0; i < funnelData.pages.length; i++) {
      const validation = validationState[i];
      if (validation && !validation.isValid) {
        return i;
      }
    }
    
    return null;
  }, [funnelData, validationState]);

  // Calcular progresso de validação
  const getValidationProgress = useCallback((): { completed: number; total: number; percentage: number } => {
    const total = funnelData.pages.length;
    const completed = Object.values(validationState).filter(result => result.isValid).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  }, [funnelData, validationState]);

  // Auto-validar quando a página atual muda
  useEffect(() => {
    if (validateOnStepChange && currentStep !== undefined && currentStep >= 0) {
      const validation = validatePage(currentStep, funnelData);
      setValidationState(prev => ({
        ...prev,
        [currentStep]: validation
      }));
    }
  }, [currentStep, funnelData, validateOnStepChange, validatePage]);

  return {
    // Estados
    validationState,
    isValidating,
    
    // Funções de validação
    validatePage,
    validateAllPages,
    validateForNavigation,
    
    // Getters
    getPageValidation,
    areAllPagesValid,
    getNextInvalidPage,
    getValidationProgress,
    
    // Helpers
    hasErrors: (pageIndex: number) => {
      const validation = getPageValidation(pageIndex);
      return validation.errors.length > 0;
    },
    
    canProceedFromPage: (pageIndex: number) => {
      const validation = getPageValidation(pageIndex);
      return validation.canProceed;
    },
    
    getPageErrors: (pageIndex: number) => {
      const validation = getPageValidation(pageIndex);
      return validation.errors;
    }
  };
};
