import { useCallback, useState } from 'react';
import { ValidationProps, ValidationResult } from '../types/editor';

// Interface para validações padrão do editor
export interface EditorValidations {
  [field: string]: ValidationProps[];
}

// Interface para estado de validação
export interface ValidationState {
  errors: Record<string, Array<{ path: string; message: string }>>;
  touched: Set<string>;
}

// Hook para validação do editor
export function useEditorFieldValidation() {
  const [validationState, setValidationState] = useState<ValidationState>({
    errors: {},
    touched: new Set(),
  });

  // Validar um campo específico
  const validateField = useCallback(
    (fieldId: string, value: unknown, validations: ValidationProps[]): ValidationResult => {
      const fieldErrors: Array<{ path: string; message: string }> = [];

      validations.forEach(validation => {
        switch (validation.type) {
          case 'required':
            if (!value || (Array.isArray(value) && value.length === 0)) {
              fieldErrors.push({
                path: fieldId,
                message: 'Campo obrigatório',
              });
            }
            break;

          case 'minLength':
            if (typeof value === 'string' && value.length < validation.properties.min) {
              fieldErrors.push({
                path: fieldId,
                message: `Mínimo de ${validation.properties.min} caracteres`,
              });
            }
            break;

          case 'maxLength':
            if (typeof value === 'string' && value.length > validation.properties.max) {
              fieldErrors.push({
                path: fieldId,
                message: `Máximo de ${validation.properties.max} caracteres`,
              });
            }
            break;

          case 'pattern':
            if (typeof value === 'string' && !new RegExp(validation.properties.regex).test(value)) {
              fieldErrors.push({
                path: fieldId,
                message: validation.properties.message || 'Formato inválido',
              });
            }
            break;

          case 'options':
            if (Array.isArray(value)) {
              const { min, max } = validation.properties;
              if (min && value.length < min) {
                fieldErrors.push({
                  path: fieldId,
                  message: `Selecione pelo menos ${min} opções`,
                });
              }
              if (max && value.length > max) {
                fieldErrors.push({
                  path: fieldId,
                  message: `Selecione no máximo ${max} opções`,
                });
              }
            }
            break;

          case 'custom':
            if (validation.properties.validator && !validation.properties.validator(value)) {
              fieldErrors.push({
                path: fieldId,
                message: validation.properties.message || 'Validação customizada falhou',
              });
            }
            break;
        }
      });

      setValidationState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [fieldId]: fieldErrors,
        },
        touched: new Set(prev.touched).add(fieldId),
      }));

      return {
        success: fieldErrors.length === 0,
        errors: fieldErrors,
      };
    },
    []
  );

  // Validar um bloco inteiro
  const validateBlock = useCallback(
    (
      blockId: string,
      values: Record<string, unknown>,
      validations: Record<string, ValidationProps[]>
    ) => {
      const blockErrors: Record<string, Array<{ path: string; message: string }>> = {};
      let isValid = true;

      Object.entries(validations).forEach(([fieldId, fieldValidations]) => {
        const value = values[fieldId];
        const result = validateField(`${blockId}.${fieldId}`, value, fieldValidations);

        if (!result.success) {
          blockErrors[fieldId] = result.errors || [];
          isValid = false;
        }
      });

      return {
        isValid,
        errors: blockErrors,
      };
    },
    [validateField]
  );

  // Limpar erros de um campo
  const clearFieldErrors = useCallback((fieldId: string) => {
    setValidationState(prev => {
      const newErrors = { ...prev.errors };
      delete newErrors[fieldId];
      return {
        ...prev,
        errors: newErrors,
      };
    });
  }, []);

  // Obter erros de um campo
  const getFieldErrors = useCallback(
    (fieldId: string) => {
      return validationState.errors[fieldId] || [];
    },
    [validationState.errors]
  );

  // Verificar se um campo foi tocado
  const isFieldTouched = useCallback(
    (fieldId: string) => {
      return validationState.touched.has(fieldId);
    },
    [validationState.touched]
  );

  // Verificar se há algum erro
  const hasErrors = Object.values(validationState.errors).some(errors => errors.length > 0);

  return {
    validateField,
    validateBlock,
    clearFieldErrors,
    getFieldErrors,
    isFieldTouched,
    hasErrors,
    errors: validationState.errors,
  };
}

// Validações padrão por tipo de bloco
export const defaultEditorValidations: Record<string, EditorValidations> = {
  text: {
    content: [
      { type: 'required', properties: {} },
      { type: 'minLength', properties: { min: 10 } },
    ],
  },
  options: {
    question: [{ type: 'required', properties: {} }],
    selected: [
      {
        type: 'options',
        properties: {
          min: 1,
          max: 3,
        },
      },
    ],
  },
  image: {
    src: [
      { type: 'required', properties: {} },
      {
        type: 'pattern',
        properties: {
          regex: '^https?://.+',
          message: 'URL inválida',
        },
      },
    ],
    alt: [{ type: 'required', properties: {} }],
  },
  // Adicione mais tipos de blocos conforme necessário
};
