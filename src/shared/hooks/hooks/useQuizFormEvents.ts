import { useCallback, useEffect } from 'react';

/**
 * HOOK PARA EVENTOS DE FORMULÁRIO DO QUIZ
 * Integra formulários com sistema de navegação
 */

interface QuizFormEventData {
  blockId: string;
  field?: string;
  value?: string;
  isValid?: boolean;
  formData?: Record<string, any>;
  data?: Record<string, any>;
}

interface QuizFormEventsOptions {
  onFormChange?: (data: QuizFormEventData) => void;
  onFormComplete?: (data: QuizFormEventData) => void;
  onInputChange?: (data: QuizFormEventData) => void;
}

export const useQuizFormEvents = ({
  onFormChange,
  onFormComplete,
  onInputChange,
}: QuizFormEventsOptions = {}) => {
  // Handler para mudanças no formulário
  const handleFormChange = useCallback(
    (event: CustomEvent<QuizFormEventData>) => {
      const { detail } = event;
      console.log('🎯 Quiz form change:', detail);

      if (onFormChange) {
        onFormChange(detail);
      }
    },
    [onFormChange]
  );

  // Handler para conclusão do formulário
  const handleFormComplete = useCallback(
    (event: CustomEvent<QuizFormEventData>) => {
      const { detail } = event;
      console.log('✅ Quiz form complete:', detail);

      if (onFormComplete) {
        onFormComplete(detail);
      }
    },
    [onFormComplete]
  );

  // Handler para mudanças em inputs individuais
  const handleInputChange = useCallback(
    (event: CustomEvent<QuizFormEventData>) => {
      const { detail } = event;
      console.log('📝 Quiz input change:', detail);

      if (onInputChange) {
        onInputChange(detail);
      }
    },
    [onInputChange]
  );

  // Registrar event listeners
  useEffect(() => {
    window.addEventListener('quiz-form-change', handleFormChange as EventListener);
    window.addEventListener('quiz-form-complete', handleFormComplete as EventListener);
    window.addEventListener('quiz-input-change', handleInputChange as EventListener);

    return () => {
      window.removeEventListener('quiz-form-change', handleFormChange as EventListener);
      window.removeEventListener('quiz-form-complete', handleFormComplete as EventListener);
      window.removeEventListener('quiz-input-change', handleInputChange as EventListener);
    };
  }, [handleFormChange, handleFormComplete, handleInputChange]);

  // Função para disparar eventos customizados
  const dispatchFormEvent = useCallback(
    (eventType: 'change' | 'complete' | 'input', data: QuizFormEventData) => {
      const eventName = `quiz-form-${eventType}`;
      window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    },
    []
  );

  // Função para disparar evento de mudança
  const dispatchFormChange = useCallback(
    (data: QuizFormEventData) => {
      dispatchFormEvent('change', data);
    },
    [dispatchFormEvent]
  );

  // Função para disparar evento de conclusão
  const dispatchFormComplete = useCallback(
    (data: QuizFormEventData) => {
      dispatchFormEvent('complete', data);
    },
    [dispatchFormEvent]
  );

  // Função para disparar evento de input
  const dispatchInputChange = useCallback(
    (data: QuizFormEventData) => {
      dispatchFormEvent('input', data);
    },
    [dispatchFormEvent]
  );

  return {
    // Dispatchers
    dispatchFormChange,
    dispatchFormComplete,
    dispatchInputChange,
    dispatchFormEvent,
  };
};

export default useQuizFormEvents;
