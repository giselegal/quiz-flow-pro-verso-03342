import { useCallback, useState } from 'react';
import { ValidationProps, ValidationResult } from '../types/editor';

export function useValidation() {
  const [errors, setErrors] = useState<Array<{ path: string; message: string }>>([]);
  const [isValid, setIsValid] = useState(true);

  const validate = useCallback((value: unknown, validation: ValidationProps): ValidationResult => {
    const newErrors: Array<{ path: string; message: string }> = [];

    // Implementa validação baseada no tipo
    switch (validation.type) {
      case 'required':
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors.push({
            path: 'value',
            message: 'Campo obrigatório',
          });
        }
        break;

      case 'minLength':
        if (typeof value === 'string' && value.length < validation.properties.min) {
          newErrors.push({
            path: 'value',
            message: `Mínimo de ${validation.properties.min} caracteres`,
          });
        }
        break;

      case 'maxLength':
        if (typeof value === 'string' && value.length > validation.properties.max) {
          newErrors.push({
            path: 'value',
            message: `Máximo de ${validation.properties.max} caracteres`,
          });
        }
        break;

      case 'pattern':
        if (typeof value === 'string' && !new RegExp(validation.properties.regex).test(value)) {
          newErrors.push({
            path: 'value',
            message: validation.properties.message || 'Formato inválido',
          });
        }
        break;

      case 'custom':
        if (validation.properties.validator && !validation.properties.validator(value)) {
          newErrors.push({
            path: 'value',
            message: validation.properties.message || 'Validação customizada falhou',
          });
        }
        break;
    }

    setErrors(newErrors);
    setIsValid(newErrors.length === 0);

    return {
      success: newErrors.length === 0,
      errors: newErrors,
    };
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
    setIsValid(true);
  }, []);

  return {
    validate,
    errors,
    isValid,
    clearErrors,
  };
}
