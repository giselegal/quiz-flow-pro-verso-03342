/**
 * Validação do Step 01 (Nome) — Editor e Produção
 * - Habilita o botão via evento universal (com compatibilidade legacy)
 * - Atualiza validação global via useQuizFlow
 */
import { useQuizFlow } from '@/hooks/core/useQuizFlow';
import { useCallback, useEffect } from 'react';

export interface Step01ValidationEvents {
  buttonId?: string; // id do botão que será habilitado
  inputId?: string; // id do input de nome
  onNameValid?: (isValid: boolean, value: string) => void;
  onFormComplete?: (formData: Record<string, string>) => void;
  onButtonStateChange?: (enabled: boolean) => void;
}

export const useStep01Validation = ({
  buttonId = 'intro-cta-button',
  inputId = 'intro-name-input',
  onNameValid,
  onFormComplete,
  onButtonStateChange,
}: Step01ValidationEvents = {}) => {
  const { quizState, actions } = useQuizFlow?.() || ({} as any);

  const resolveCurrentStep = () => {
    return quizState?.currentStep || (window as any)?.__quizCurrentStep || 'step-1';
  };

  const validateName = useCallback((name: string): boolean => {
    return (name ?? '').trim().length >= 2;
  }, []);

  const emitButtonState = useCallback(
    (enabled: boolean) => {
      // Evento universal
      window.dispatchEvent(
        new CustomEvent('quiz-button-state-change', {
          detail: { buttonId, enabled, disabled: !enabled },
        })
      );
      // Compatibilidade com implementação anterior
      window.dispatchEvent(
        new CustomEvent('step01-button-state-change', {
          detail: { buttonId, enabled, disabled: !enabled },
        })
      );
      if (onButtonStateChange) onButtonStateChange(enabled);
    },
    [buttonId, onButtonStateChange]
  );

  const handleNameValidation = useCallback(
    (event: Event) => {
      const e = event as CustomEvent<{
        blockId?: string;
        field?: string;
        value?: string;
        valid?: boolean;
      }>;
      const { blockId, field, value, valid: providedValid } = e.detail || {};
      if (blockId !== inputId && field !== 'name') return;

      const isValid =
        typeof providedValid === 'boolean' ? providedValid : validateName(String(value || ''));

      if (onNameValid) onNameValid(isValid, value || '');
      emitButtonState(isValid);

      const stepId = resolveCurrentStep();
      if (actions?.setStepValid) actions.setStepValid(stepId, isValid);
    },
    [actions, emitButtonState, inputId, onNameValid, validateName]
  );

  const handleFormComplete = useCallback(
    (event: Event) => {
      const e = event as CustomEvent<{ formData?: Record<string, string> }>;
      const formData = e.detail?.formData || {};
      if (onFormComplete) onFormComplete(formData);

      const name = formData?.name || '';
      const isValid = validateName(name);
      emitButtonState(isValid);
      const stepId = resolveCurrentStep();
      if (actions?.setStepValid) actions.setStepValid(stepId, isValid);
    },
    [actions, emitButtonState, onFormComplete, validateName]
  );

  useEffect(() => {
    window.addEventListener('quiz-input-change', handleNameValidation as EventListener);
    window.addEventListener('quiz-form-complete', handleFormComplete as EventListener);
    return () => {
      window.removeEventListener('quiz-input-change', handleNameValidation as EventListener);
      window.removeEventListener('quiz-form-complete', handleFormComplete as EventListener);
    };
  }, [handleNameValidation, handleFormComplete]);

  const dispatchNameValidation = useCallback(
    (name: string) => {
      const isValid = validateName(name);
      window.dispatchEvent(
        new CustomEvent('quiz-input-change', {
          detail: { blockId: inputId, field: 'name', value: name, valid: isValid },
        })
      );
    },
    [inputId, validateName]
  );

  return { validateName, dispatchNameValidation };
};

export default useStep01Validation;
