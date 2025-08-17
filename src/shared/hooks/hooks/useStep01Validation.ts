/**
 * HOOK DE INTEGRAÇÃO PARA EVENTOS DE FORMULÁRIO COM STEP-01
 * Específico para validação do campo nome no step inicial
 */
import { useCallback, useEffect } from 'react';

export interface Step01ValidationEvents {
  onNameValid?: (isValid: boolean, value: string) => void;
  onFormComplete?: (formData: Record<string, string>) => void;
  onButtonStateChange?: (enabled: boolean) => void;
}

export const useStep01Validation = ({
  onNameValid,
  onFormComplete,
  onButtonStateChange,
}: Step01ValidationEvents = {}) => {
  // Handler para validação do campo nome no step-01
  const handleNameValidation = useCallback(
    (event: CustomEvent) => {
      const { detail } = event;
      const { value, valid } = detail;

      console.log('📝 Step01 name validation:', { value, valid });

      if (onNameValid) {
        onNameValid(valid, value);
      }

      // Disparar evento de mudança de estado do botão
      if (onButtonStateChange) {
        onButtonStateChange(valid);
      }

      // Disparar evento nativo para o FormContainerBlock
      window.dispatchEvent(
        new CustomEvent('step01-button-state-change', {
          detail: {
            buttonId: 'cta-button-modular',
            enabled: valid,
            disabled: !valid,
          },
        })
      );
    },
    [onNameValid, onButtonStateChange]
  );

  // Handler para formulário completo no step-01
  const handleFormComplete = useCallback(
    (event: CustomEvent) => {
      const { detail } = event;
      console.log('✅ Step01 form complete:', detail);

      if (onFormComplete) {
        onFormComplete(detail.formData || {});
      }
    },
    [onFormComplete]
  );

  // Registrar event listeners
  useEffect(() => {
    window.addEventListener('quiz-input-change', handleNameValidation as EventListener);
    window.addEventListener('quiz-form-complete', handleFormComplete as EventListener);

    return () => {
      window.removeEventListener('quiz-input-change', handleNameValidation as EventListener);
      window.removeEventListener('quiz-form-complete', handleFormComplete as EventListener);
    };
  }, [handleNameValidation, handleFormComplete]);

  // Função para validar nome (compatível com step-01)
  const validateName = useCallback((name: string): boolean => {
    return name.trim().length >= 2;
  }, []);

  // Função para disparar eventos manualmente
  const dispatchNameValidation = useCallback((name: string, isValid: boolean) => {
    window.dispatchEvent(
      new CustomEvent('quiz-input-change', {
        detail: {
          blockId: 'intro-name-input',
          value: name,
          valid: isValid,
          field: 'name',
        },
      })
    );
  }, []);

  return {
    validateName,
    dispatchNameValidation,
  };
};

export default useStep01Validation;
