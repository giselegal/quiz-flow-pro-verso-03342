import { useCallback, useEffect, useState } from 'react';

/**
 * HOOK DE VALIDAÇÃO UNIFICADO PARA FORMULÁRIOS
 * Integra com sistema de navegação e eventos do editor
 */

interface ValidationResult {
  isValid: boolean;
  message: string;
}

interface FormValidationState {
  [fieldName: string]: ValidationResult;
}

export const useFormValidation = (formData: Record<string, string>) => {
  const [validationState, setValidationState] = useState<FormValidationState>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Regras de validação por tipo de campo
  const validateField = useCallback((fieldName: string, value: string): ValidationResult => {
    const trimmedValue = value.trim();
    
    switch (fieldName) {
      case 'name':
        return {
          isValid: trimmedValue.length >= 2,
          message: trimmedValue.length < 2 ? 'Nome deve ter pelo menos 2 caracteres' : ''
        };
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(trimmedValue);
        return {
          isValid: isValidEmail,
          message: isValidEmail ? '' : 'E-mail inválido'
        };
      
      case 'phone':
        const phoneDigits = trimmedValue.replace(/\D/g, '');
        const isValidPhone = phoneDigits.length >= 10;
        return {
          isValid: isValidPhone,
          message: isValidPhone ? '' : 'Telefone deve ter pelo menos 10 dígitos'
        };
      
      case 'whatsapp':
        const whatsappDigits = trimmedValue.replace(/\D/g, '');
        const isValidWhatsapp = whatsappDigits.length >= 10;
        return {
          isValid: isValidWhatsapp,
          message: isValidWhatsapp ? '' : 'WhatsApp deve ter pelo menos 10 dígitos'
        };
      
      default:
        return {
          isValid: trimmedValue.length > 0,
          message: trimmedValue.length === 0 ? 'Campo obrigatório' : ''
        };
    }
  }, []);

  // Validar todos os campos quando formData mudar
  useEffect(() => {
    const newValidationState: FormValidationState = {};

    Object.entries(formData).forEach(([fieldName, value]) => {
      const validation = validateField(fieldName, value);
      newValidationState[fieldName] = validation;
    });

    // Verificar se todos os campos obrigatórios estão preenchidos e válidos
    const hasAllRequiredFields = Object.entries(formData).every(([fieldName, value]) => {
      const validation = newValidationState[fieldName];
      return validation.isValid && value.trim().length > 0;
    });

    setValidationState(newValidationState);
    setIsFormValid(hasAllRequiredFields);
  }, [formData, validateField]);

  // Validar campo individual
  const validateSingleField = useCallback((fieldName: string, value: string) => {
    return validateField(fieldName, value);
  }, [validateField]);

  // Obter mensagem de validação de um campo
  const getFieldValidation = useCallback((fieldName: string): ValidationResult => {
    return validationState[fieldName] || { isValid: false, message: '' };
  }, [validationState]);

  // Verificar se um campo específico é válido
  const isFieldValid = useCallback((fieldName: string): boolean => {
    return validationState[fieldName]?.isValid || false;
  }, [validationState]);

  // Obter resumo da validação
  const getValidationSummary = useCallback(() => {
    const totalFields = Object.keys(formData).length;
    const validFields = Object.values(validationState).filter(v => v.isValid).length;
    const invalidFields = Object.entries(validationState)
      .filter(([_, validation]) => !validation.isValid)
      .map(([fieldName, validation]) => ({ fieldName, message: validation.message }));

    return {
      totalFields,
      validFields,
      invalidFields,
      isComplete: isFormValid,
      completionPercentage: totalFields > 0 ? Math.round((validFields / totalFields) * 100) : 0
    };
  }, [formData, validationState, isFormValid]);

  return {
    // Estado da validação
    validationState,
    isFormValid,

    // Funções de validação
    validateSingleField,
    getFieldValidation,
    isFieldValid,
    getValidationSummary,

    // Utilities
    hasErrors: Object.values(validationState).some(v => !v.isValid && v.message.length > 0)
  };
};

export default useFormValidation;