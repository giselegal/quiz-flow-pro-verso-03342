import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export interface QuizFlowState {
  currentStep: number;
  totalSteps: number;
  progress: number; // 0-100
  canProceed: boolean;
}

export interface QuizFlowActions {
  next: () => void;
  previous: () => void;
  goTo: (step: number) => void;
  setCanProceed: (val: boolean) => void;
}

export interface QuizFlowContextType extends QuizFlowState, QuizFlowActions {}

const QuizFlowContext = createContext<QuizFlowContextType | undefined>(undefined);

interface QuizFlowProviderProps {
  children: React.ReactNode;
  totalSteps?: number;
  initialStep?: number;
  autoAdvance?: boolean; // auto avançar quando canProceed ficar true
  onNavigate?: (step: number) => void; // opcional: integrar com router externo
}

export const QuizFlowProvider: React.FC<QuizFlowProviderProps> = ({
  children,
  totalSteps = 21,
  initialStep = 1,
  autoAdvance = false,
  onNavigate,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [canProceed, setCanProceed] = useState<boolean>(false);
  const progress = useMemo(() => Math.round((currentStep / (totalSteps || 1)) * 100), [currentStep, totalSteps]);

  // manter sync quando initialStep muda (ex.: mudança de rota externa)
  const lastInitialRef = useRef<number>(initialStep);
  useEffect(() => {
    if (initialStep !== lastInitialRef.current) {
      lastInitialRef.current = initialStep;
      setCurrentStep(initialStep);
    }
  }, [initialStep]);

  const safeClamp = useCallback((n: number) => Math.max(1, Math.min(totalSteps, n)), [totalSteps]);

  const goTo = useCallback(
    (step: number) => {
      const clamped = safeClamp(step);
      if (clamped === currentStep) return;
      setCurrentStep(clamped);
      // reset canProceed por padrão ao entrar numa etapa
      setCanProceed(false);

      // notificar integração externa (router)
      onNavigate?.(clamped);

      // evento global p/ consumidores legados
      try {
        window.dispatchEvent(
          new CustomEvent('quiz-navigate-to-step', {
            detail: { step: clamped, stepId: `step-${String(clamped).padStart(2, '0')}`, source: 'quiz-flow-provider' },
          })
        );
      } catch {}
    },
    [currentStep, onNavigate, safeClamp]
  );

  const next = useCallback(() => {
    if (currentStep < totalSteps) {
      goTo(currentStep + 1);
    }
  }, [currentStep, totalSteps, goTo]);

  const previous = useCallback(() => {
    if (currentStep > 1) {
      goTo(currentStep - 1);
    }
  }, [currentStep, goTo]);

  // Auto-avanço quando canProceed muda para true
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!autoAdvance) return;
    if (canProceed) {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = setTimeout(() => {
        next();
      }, 45);
    }
    return () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, [canProceed, autoAdvance, next]);

  // Listeners de eventos globais dos blocos
  useEffect(() => {
    const handleSelectionChange = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      // Respeitar 'valid' se presente; caso contrário usar min/max/count
      if (typeof detail.valid === 'boolean') {
        setCanProceed(!!detail.valid);
      } else if (typeof detail.count === 'number') {
        const min = typeof detail.min === 'number' ? detail.min : 1;
        const max = typeof detail.max === 'number' ? detail.max : undefined;
        const okMin = detail.count >= min;
        const okMax = typeof max === 'number' ? detail.count <= max : true;
        setCanProceed(okMin && okMax);
      }
    };

    const handleFormComplete = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      if (typeof detail.valid === 'boolean') {
        setCanProceed(!!detail.valid);
      } else {
        setCanProceed(true);
      }
    };

    const handleNavigateTo = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      let step: number | null = null;
      if (typeof detail.step === 'number') step = detail.step;
      else if (typeof detail.stepId === 'string') {
        const digits = parseInt(String(detail.stepId).replace(/\D/g, ''), 10);
        if (!isNaN(digits)) step = digits;
      }
      if (step) {
        goTo(step);
      }
    };

    window.addEventListener('quiz-selection-change', handleSelectionChange as EventListener);
    window.addEventListener('quiz-form-complete', handleFormComplete as EventListener);
    window.addEventListener('quiz-navigate-to-step', handleNavigateTo as EventListener);
    return () => {
      window.removeEventListener('quiz-selection-change', handleSelectionChange as EventListener);
      window.removeEventListener('quiz-form-complete', handleFormComplete as EventListener);
      window.removeEventListener('quiz-navigate-to-step', handleNavigateTo as EventListener);
    };
  }, [goTo]);

  const value: QuizFlowContextType = {
    currentStep,
    totalSteps,
    progress,
    canProceed,
    next,
    previous,
    goTo,
    setCanProceed,
  };

  return <QuizFlowContext.Provider value={value}>{children}</QuizFlowContext.Provider>;
};

export const useQuizFlow = (): QuizFlowContextType => {
  const ctx = useContext(QuizFlowContext);
  if (!ctx) {
    // fallback seguro
    return {
      currentStep: 1,
      totalSteps: 21,
      progress: Math.round((1 / 21) * 100),
      canProceed: false,
      next: () => {},
      previous: () => {},
      goTo: () => {},
      setCanProceed: () => {},
    };
  }
  return ctx;
};

export default QuizFlowProvider;
