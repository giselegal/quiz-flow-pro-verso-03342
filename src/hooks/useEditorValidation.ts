import { useCallback } from 'react';
import { useValidationContext } from '../context/ValidationContext';
import { ValidationProps } from '../types/editor';

interface BlockValidations {
  [key: string]: ValidationProps[];
}

export function useEditorValidation() {
  const { validateField, getFieldErrors, clearFieldErrors, hasErrors, allErrors } = useValidationContext();

  const validateBlock = useCallback((blockId: string, values: Record<string, unknown>, validations: BlockValidations) => {
    const blockErrors: Record<string, Array<{path: string; message: string}>> = {};
    let isValid = true;

    Object.entries(validations).forEach(([fieldId, fieldValidations]) => {
      const fullFieldId = `${blockId}.${fieldId}`;
      const value = values[fieldId];
      
      const result = validateField(fullFieldId, value, fieldValidations);
      
      if (!result.success) {
        blockErrors[fieldId] = result.errors || [];
        isValid = false;
      }
    });

    return {
      isValid,
      errors: blockErrors
    };
  }, [validateField]);

  const validateStep = useCallback((stepId: string, blocks: Array<{id: string; type: string; values: Record<string, unknown>}>, validations: Record<string, BlockValidations>) => {
    const stepErrors: Record<string, Record<string, Array<{path: string; message: string}>>> = {};
    let isValid = true;

    blocks.forEach(block => {
      const blockValidations = validations[block.type];
      if (blockValidations) {
        const result = validateBlock(block.id, block.values, blockValidations);
        if (!result.isValid) {
          stepErrors[block.id] = result.errors;
          isValid = false;
        }
      }
    });

    return {
      isValid,
      errors: stepErrors
    };
  }, [validateBlock]);

  const getBlockErrors = useCallback((blockId: string) => {
    return Object.entries(allErrors)
      .filter(([key]) => key.startsWith(`${blockId}.`))
      .reduce((acc, [key, errors]) => {
        const fieldId = key.replace(`${blockId}.`, '');
        acc[fieldId] = errors;
        return acc;
      }, {} as Record<string, Array<{path: string; message: string}>>);
  }, [allErrors]);

  const clearBlockErrors = useCallback((blockId: string) => {
    Object.keys(allErrors)
      .filter(key => key.startsWith(`${blockId}.`))
      .forEach(key => clearFieldErrors(key));
  }, [allErrors, clearFieldErrors]);

  return {
    validateBlock,
    validateStep,
    getBlockErrors,
    clearBlockErrors,
    hasErrors
  };
}
