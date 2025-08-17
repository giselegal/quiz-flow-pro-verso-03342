import React, { createContext, useCallback, useContext, useState } from 'react';
import { ValidationProps, ValidationResult } from '../types/editor';

interface ValidationContextType {
  validateField: (
    fieldId: string,
    value: unknown,
    validations: ValidationProps[]
  ) => ValidationResult;
  getFieldErrors: (fieldId: string) => Array<{ path: string; message: string }>;
  clearFieldErrors: (fieldId: string) => void;
  hasErrors: boolean;
  allErrors: Record<string, Array<{ path: string; message: string }>>;
}

const ValidationContext = createContext<ValidationContextType | null>(null);

export function ValidationProvider({ children }: { children: React.ReactNode }) {
  const [errors, setErrors] = useState<Record<string, Array<{ path: string; message: string }>>>(
    {}
  );

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

          case 'custom':
            if (validation.properties.validator && !validation.properties.validator(value)) {
              fieldErrors.push({
                path: fieldId,
                message: validation.properties.message || 'Validação customizada falhou',
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
        }
      });

      setErrors(prev => ({
        ...prev,
        [fieldId]: fieldErrors,
      }));

      return {
        success: fieldErrors.length === 0,
        errors: fieldErrors,
      };
    },
    []
  );

  const getFieldErrors = useCallback(
    (fieldId: string) => {
      return errors[fieldId] || [];
    },
    [errors]
  );

  const clearFieldErrors = useCallback((fieldId: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldId];
      return newErrors;
    });
  }, []);

  const hasErrors = Object.values(errors).some(fieldErrors => fieldErrors.length > 0);

  const value = {
    validateField,
    getFieldErrors,
    clearFieldErrors,
    hasErrors,
    allErrors: errors,
  };

  return <ValidationContext.Provider value={value}>{children}</ValidationContext.Provider>;
}

export function useValidationContext() {
  const context = useContext(ValidationContext);
  if (!context) {
    throw new Error('useValidationContext deve ser usado dentro de um ValidationProvider');
  }
  return context;
}
