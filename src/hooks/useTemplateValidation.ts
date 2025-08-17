import { useCallback } from 'react';
import { useEditorFieldValidation } from './useEditorFieldValidation';
import { templateValidations } from '../validations/templateValidations';

export interface TemplateValidationResult {
  isValid: boolean;
  errors: Record<string, Array<{path: string; message: string}>>;
}

export function useTemplateValidation() {
  const {
    validateField,
    validateBlock,
    getFieldErrors,
    hasErrors
  } = useEditorFieldValidation();

  // Valida um template inteiro
  const validateTemplate = useCallback((blocks: Array<{
    id: string;
    type: string;
    values: Record<string, unknown>;
  }>) => {
    const templateErrors: Record<string, Record<string, Array<{path: string; message: string}>>> = {};
    let isTemplateValid = true;

    blocks.forEach(block => {
      const blockValidations = templateValidations[block.type];
      if (blockValidations) {
        const result = validateBlock(block.id, block.values, blockValidations);
        if (!result.isValid) {
          templateErrors[block.id] = result.errors;
          isTemplateValid = false;
        }
      }
    });

    return {
      isValid: isTemplateValid,
      errors: templateErrors
    };
  }, [validateBlock]);

  // Valida uma etapa do quiz
  const validateStep = useCallback((stepId: string, blocks: Array<{
    id: string;
    type: string;
    values: Record<string, unknown>;
  }>) => {
    let hasRequiredBlocks = false;
    const stepErrors: Record<string, Record<string, Array<{path: string; message: string}>>> = {};
    let isStepValid = true;

    // Verificar blocos obrigatórios por etapa
    switch (stepId) {
      case 'step-1':
        // Etapa 1 requer pelo menos um bloco de texto e um de botão
        hasRequiredBlocks = blocks.some(b => b.type === 'text-block') &&
                          blocks.some(b => b.type === 'button-block');
        break;

      case 'step-2':
        // Etapa 2 requer pelo menos um bloco de pergunta
        hasRequiredBlocks = blocks.some(b => b.type === 'question-block');
        break;

      // Adicione mais regras por etapa conforme necessário
      default:
        hasRequiredBlocks = true;
    }

    if (!hasRequiredBlocks) {
      return {
        isValid: false,
        errors: {
          step: [{
            path: stepId,
            message: 'Blocos obrigatórios faltando nesta etapa'
          }]
        }
      };
    }

    // Validar cada bloco da etapa
    blocks.forEach(block => {
      const blockValidations = templateValidations[block.type];
      if (blockValidations) {
        const result = validateBlock(block.id, block.values, blockValidations);
        if (!result.isValid) {
          stepErrors[block.id] = result.errors;
          isStepValid = false;
        }
      }
    });

    return {
      isValid: isStepValid && hasRequiredBlocks,
      errors: stepErrors
    };
  }, [validateBlock]);

  // Valida campos individuais de um bloco
  const validateTemplateField = useCallback((
    blockId: string,
    fieldId: string,
    value: unknown,
    blockType: string
  ) => {
    const blockValidations = templateValidations[blockType];
    if (!blockValidations || !blockValidations[fieldId]) {
      return { success: true };
    }

    return validateField(`${blockId}.${fieldId}`, value, blockValidations[fieldId]);
  }, [validateField]);

  return {
    validateTemplate,
    validateStep,
    validateTemplateField,
    getFieldErrors,
    hasErrors
  };
}
