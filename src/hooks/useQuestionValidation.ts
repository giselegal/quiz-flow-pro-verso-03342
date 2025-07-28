import { useState, useEffect } from 'react';

export interface ValidationRules {
  isRequired?: boolean;
  minSelections?: number;
  maxSelections?: number;
  isMultipleChoice?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  canProceed: boolean;
}

export const useQuestionValidation = (
  selectedOptions: string[],
  rules: ValidationRules
) => {
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: false,
    errors: [],
    canProceed: false
  });

  useEffect(() => {
    const errors: string[] = [];
    const selectedCount = selectedOptions.length;

    // Verificar se é obrigatório
    if (rules.isRequired && selectedCount === 0) {
      errors.push('Selecione pelo menos uma opção para continuar');
    }

    // Verificar seleção mínima
    if (rules.minSelections && selectedCount < rules.minSelections) {
      errors.push(`Selecione pelo menos ${rules.minSelections} opç${rules.minSelections > 1 ? 'ões' : 'ão'}`);
    }

    // Verificar seleção máxima
    if (rules.maxSelections && selectedCount > rules.maxSelections) {
      errors.push(`Selecione no máximo ${rules.maxSelections} opç${rules.maxSelections > 1 ? 'ões' : 'ão'}`);
    }

    // Verificar múltipla escolha
    if (!rules.isMultipleChoice && selectedCount > 1) {
      errors.push('Selecione apenas uma opção');
    }

    const isValid = errors.length === 0;
    const canProceed = isValid && selectedCount > 0;

    setValidation({
      isValid,
      errors,
      canProceed
    });
  }, [selectedOptions, rules]);

  return validation;
};

export const validateQuestionResponse = (
  selectedOptions: string[],
  rules: ValidationRules
): ValidationResult => {
  const errors: string[] = [];
  const selectedCount = selectedOptions.length;

  if (rules.isRequired && selectedCount === 0) {
    errors.push('Selecione pelo menos uma opção para continuar');
  }

  if (rules.minSelections && selectedCount < rules.minSelections) {
    errors.push(`Selecione pelo menos ${rules.minSelections} opç${rules.minSelections > 1 ? 'ões' : 'ão'}`);
  }

  if (rules.maxSelections && selectedCount > rules.maxSelections) {
    errors.push(`Selecione no máximo ${rules.maxSelections} opç${rules.maxSelections > 1 ? 'ões' : 'ão'}`);
  }

  if (!rules.isMultipleChoice && selectedCount > 1) {
    errors.push('Selecione apenas uma opção');
  }

  return {
    isValid: errors.length === 0,
    errors,
    canProceed: errors.length === 0 && selectedCount > 0
  };
};
