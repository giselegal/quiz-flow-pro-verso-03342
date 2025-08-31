import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

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

export interface QuizFlowContextType extends QuizFlowState, QuizFlowActions { }

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
  const progress = useMemo(
    () => Math.round((currentStep / (totalSteps || 1)) * 100),
    [currentStep, totalSteps]
  );

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
            detail: {
              step: clamped,
              stepId: `step-${String(clamped).padStart(2, '0')}`,
              source: 'quiz-flow-provider',
            },
          })
        );
      } catch { }
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

  // Expor etapa atual globalmente para componentes que dependem (ex.: persistência de respostas)
  useEffect(() => {
    try {
      (window as any).__quizCurrentStep = currentStep;
    } catch { }
  }, [currentStep]);

  // 🧠 Cálculo de resultado integrado para fluxo genérico (produção/StepPage)
  useEffect(() => {
    // Dispara cálculo quando alcançar etapa 19 (processamento) ou garantindo na 20
    const shouldCompute = currentStep === 19 || currentStep === 20;
    if (!shouldCompute) return;

    const computeAndPersist = async () => {
      try {
        // Evitar recálculo contínuo se já existe
        const existing = (require('@/services/core/StorageService') as any).StorageService.safeGetJSON('quizResult');
        if (existing && existing.primaryStyle) {
          // Notificar listeners para sincronizar blocos
          try { window.dispatchEvent(new Event('quiz-result-updated')); } catch { }
          return;
        }

        const Storage = (require('@/services/core/StorageService') as any).StorageService;
        const raw = (Storage.safeGetJSON('quizResponses') as any) || {};
        // Transformar respostas incrementais para formato consumível pelo serviço central
        const transformed: Record<string, any> = {};
        Object.entries(raw).forEach(([step, questions]: any) => {
          const stepObj: Record<string, any> = {};
          Object.entries(questions || {}).forEach(([qid, entry]: any) => {
            if (Array.isArray(entry?.texts) && entry.texts.length > 0) {
              stepObj[qid] = entry.texts;
            } else if (Array.isArray(entry?.ids)) {
              stepObj[qid] = entry.ids;
            }
          });
          transformed[String(step)] = stepObj;
        });

        const sessionId = Storage.safeGetString('quizSessionId') || `local-${Date.now()}`;
        try { Storage.safeSetString('quizSessionId', sessionId); } catch { }

        // Tentar serviço central
        let scores: Record<string, number> | null = null;
        try {
          const { quizResultsService } = require('@/services/quizResultsService');
          const results = await quizResultsService.calculateResults({
            id: sessionId,
            session_id: sessionId,
            responses: transformed,
            current_step: currentStep,
          } as any);
          scores = (results?.styleProfile?.styleScores as any) || null;
        } catch (e) {
          // Fallback: pontuar pelo número de ocorrências de cada palavra-chave nas respostas
          scores = {};
          Object.values(transformed).forEach((stepObj: any) => {
            Object.values(stepObj || {}).forEach((ans: any) => {
              const arr = Array.isArray(ans) ? ans : [String(ans)];
              arr.forEach((s: any) => {
                const v = String(s || '').toLowerCase();
                if (!v) return;
                // Mapeamento leve por palavras-chave básicas
                if (/(natural|casual|conforto|descontra|jeans|tenis)/.test(v)) scores!['Natural'] = (scores!['Natural'] || 0) + 1;
                if (/(class|eleg|atemporal|social|blazer|refinad)/.test(v)) scores!['Clássico'] = (scores!['Clássico'] || 0) + 1;
                if (/(contempo|atual|versatil|funcional)/.test(v)) scores!['Contemporâneo'] = (scores!['Contemporâneo'] || 0) + 1;
                if (/(elegante|luxo|qualidade|distinto|premium)/.test(v)) scores!['Elegante'] = (scores!['Elegante'] || 0) + 1;
                if (/(romant|delic|femin|suave|floral|vestido)/.test(v)) scores!['Romântico'] = (scores!['Romântico'] || 0) + 1;
                if (/(sexy|sensual|ousad|empoder)/.test(v)) scores!['Sexy'] = (scores!['Sexy'] || 0) + 1;
                if (/(dramat|marcant|impact|statement|presen)/.test(v)) scores!['Dramático'] = (scores!['Dramático'] || 0) + 1;
                if (/(criativ|único|artist|original|express)/.test(v)) scores!['Criativo'] = (scores!['Criativo'] || 0) + 1;
              });
            });
          });
        }

        // Normalização mínima esperada pelos blocos
        const total = Object.values(scores || {}).reduce((a: number, b: any) => a + Number(b || 0), 0) || 1;
        const ordered = Object.entries(scores || {})
          .map(([category, score]) => ({
            category,
            style: category,
            score: Number(score) || 0,
            percentage: Math.round(((Number(score) || 0) / total) * 100),
          }))
          .sort((a, b) => b.score - a.score);
        const primary = ordered[0] || { category: 'Natural', style: 'Natural', score: 0, percentage: 0 };
        const secondary = ordered.slice(1);

        Storage.safeSetJSON('quizResult', {
          primaryStyle: primary,
          secondaryStyles: secondary,
          totalQuestions: total,
          completedAt: new Date(),
          scores: scores || {},
          userData: { name: Storage.safeGetString('userName') || Storage.safeGetString('quizUserName') || '' },
        });
        try { window.dispatchEvent(new Event('quiz-result-updated')); } catch { }
      } catch {
        // Último fallback: persistir um resultado neutro
        try {
          const Storage = (require('@/services/core/StorageService') as any).StorageService;
          Storage.safeSetJSON('quizResult', {
            primaryStyle: { category: 'Neutro', style: 'neutro', score: 0, percentage: 0, rank: 1 },
            secondaryStyles: [],
            totalQuestions: 0,
            completedAt: new Date(),
            scores: {},
            userData: { name: Storage.safeGetString('userName') || Storage.safeGetString('quizUserName') || '' },
          });
          try { window.dispatchEvent(new Event('quiz-result-updated')); } catch { }
        } catch { }
      }
    };

    // Pequeno atraso para permitir persistências anteriores estabilizarem
    const t = setTimeout(computeAndPersist, currentStep === 19 ? 400 : 0);
    return () => clearTimeout(t);
  }, [currentStep]);

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
      next: () => { },
      previous: () => { },
      goTo: () => { },
      setCanProceed: () => { },
    };
  }
  return ctx;
};

export default QuizFlowProvider;
