import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useQuizFlow } from '@/hooks/core/useQuizFlow';
import { useStep01Validation } from '@/hooks/useStep01Validation';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { loadStepBlocks, reloadTemplate } from '@/services/UnifiedTemplateLoader';
import React, { useEffect, useMemo, useState, Suspense } from 'react';
import { ResultEngine } from '@/services/core/ResultEngine';
import ResultOrchestrator from '@/services/core/ResultOrchestrator';
import { STYLE_KEYWORDS_MAPPING } from '@/utils/styleKeywordMap';
import { SelectionRules, FlowCore } from '@/services/core/FlowCore';
import OPTIMIZED_FUNNEL_CONFIG from '@/config/optimized21StepsFunnel';
import useOptimizedScheduler from '@/hooks/useOptimizedScheduler';
import { useStepNavigationStore } from '@/stores/useStepNavigationStore';

// Lazy-loaded components (evita require() no runtime ESM)
const Step20FallbackTemplate = React.lazy(() => import('@/components/quiz/Step20FallbackTemplate'));
const QuizResultMetrics = React.lazy(() => import('@/components/quiz/QuizResultMetrics'));
const QuizResultValidator = React.lazy(() => import('@/components/quiz/QuizResultValidator'));
import DevResultDebug from '@/components/dev/DevResultDebug';

/**
 * 🎯 QUIZ MODULAR - VERSÃO PRODUÇÃO COM ETAPAS DO EDITOR
 *
 * Características:
 * - Usa as mesmas 21 etapas do editor
 * - Renderização idêntica via UniversalBlockRenderer
 * - Layout limpo focado no usuário final
 * - Navegação entre etapas fluida
 * - Detecção automática de URL /step20
 */
export interface QuizModularPageProps {
  /** Etapa inicial opcional (1..21) vinda das rotas */
  initialStep?: number;
}

const normalizeStep = (n: any): number => {
  const num = parseInt(String(n ?? ''), 10);
  if (!Number.isFinite(num)) return 1;
  if (num < 1) return 1;
  if (num > 21) return 21;
  return num;
};

const detectInitialStepFromLocation = (): number => {
  try {
    if (typeof window === 'undefined') return 1;
    const p = window.location.pathname;
    // Suporta /step20 e /quiz/20 e /quiz/step20
    const direct = p.match(/(?:^|\/)step-?([0-9]{1,2})$/i);
    if (direct && direct[1]) return normalizeStep(direct[1]);
    const quizParam = p.match(/\/quiz\/(?:step)?([0-9]{1,2})$/i);
    if (quizParam && quizParam[1]) return normalizeStep(quizParam[1]);
  } catch { }
  return 1;
};

const QuizModularPage: React.FC<QuizModularPageProps> = ({ initialStep }) => {
  // Prioridade: prop > URL (fallback) > 1
  const resolvedInitialStep = normalizeStep(initialStep ?? detectInitialStepFromLocation());
  const [currentStep, setCurrentStep] = useState(resolvedInitialStep);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🎯 ESTADO DO QUIZ - Validação e Respostas
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});
  const [stepValidation, setStepValidation] = useState<Record<number, boolean>>({});
  const [userSelections, setUserSelections] = useState<Record<string, string[]>>({});
  // Scheduler otimizado (substitui setTimeout dispersos)
  const { schedule, debounce, cancelAll } = useOptimizedScheduler();

  // Hook para gerenciar o fluxo do quiz
  const {
    quizState,
    actions: {
      goToStep,
      nextStep,
      preloadTemplates,
      setStepValid,
      answerScoredQuestion,
      answerStrategy,
      saveName,
    },
  } = useQuizFlow({
    mode: 'production',
    initialStep: currentStep,
  });

  // Unificar validação do Step 1 via hook (habilita botão e marca etapa válida)
  useStep01Validation({
    buttonId: 'intro-cta-button',
    inputId: 'intro-name-input',
    onNameValid: isValid => {
      setStepValidation(prev => ({ ...prev, 1: isValid }));
      setStepValid?.(1, isValid);
    },
  });

  // Pré-carregar templates para suavizar transições
  useEffect(() => {
    preloadTemplates?.();
  }, [preloadTemplates]);

  // Carregar blocos da etapa atual (via TemplateManager para refletir atualizações do editor)
  useEffect(() => {
    const loadCurrentStepBlocks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Carregando blocos da etapa (silencioso em produção)

        // Carregar blocos usando UnifiedTemplateLoader (integra JSON/Editor)
        const stepId = `step-${currentStep}`;
        const stepBlocks = await loadStepBlocks(stepId);
        try {
          if (import.meta?.env?.DEV) {
            const sourceMeta = (stepBlocks as any)?.__source || (stepBlocks as any)?.[0]?.__source;
            console.log(`[QuizModular] Blocos carregados para ${stepId}:`, stepBlocks.length, 'source=', sourceMeta || 'desconhecido');
          }
        } catch { }
        setBlocks(stepBlocks);

        // Validar se a etapa já está completa (idle com timeout)
        schedule(
          `validate:step-${currentStep}`,
          () => {
            const isValid = validateStep(stepBlocks);
            setStepValidation(prev => ({ ...prev, [currentStep]: isValid }));
            setStepValid?.(currentStep, isValid);
          },
          100,
          'idle'
        );
      } catch (err) {
        // Log de erro reduzido
        if (import.meta?.env?.DEV) console.error(`Erro ao carregar etapa ${currentStep}:`, err);
        setError(`Erro ao carregar etapa ${currentStep}`);
        setBlocks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentStepBlocks();
    // Escuta atualizações publicadas pelo editor
    const onTemplateUpdated = async (ev: Event) => {
      const e = ev as CustomEvent<{ stepId?: string } | undefined>;
      const stepId = e?.detail?.stepId;
      const updatedStep =
        typeof stepId === 'string' ? parseInt(stepId.replace(/[^0-9]/g, ''), 10) : NaN;

      // Se o evento indicar uma etapa específica, recarregue se for a atual
      if (!Number.isNaN(updatedStep)) {
        if (updatedStep === currentStep) {
          const template = await reloadTemplate(currentStep);
          if (template?.blocks) {
            setBlocks(template.blocks);
          }
        }
        return;
      }

      // Caso o evento não traga stepId (atualização global), recarregue a etapa atual
      const template = await reloadTemplate(currentStep);
      if (template?.blocks) {
        setBlocks(template.blocks);
      }
    };
    window.addEventListener('quiz-template-updated', onTemplateUpdated as EventListener);
    return () => {
      window.removeEventListener('quiz-template-updated', onTemplateUpdated as EventListener);
    };
  }, [currentStep]);

  // Sincronizar step com hook do quiz
  useEffect(() => {
    if (quizState.currentStep !== currentStep) {
      setCurrentStep(quizState.currentStep);
    }
  }, [quizState.currentStep, currentStep]);

  // Expor etapa atual globalmente para blocos/efeitos que dependem disso
  useEffect(() => {
    (window as any).__quizCurrentStep = `step-${currentStep}`;
  }, [currentStep]);

  // Escutar eventos de navegação disparados pelos blocos (ex.: botão step 1, auto-advance)
  useEffect(() => {
    const parseStepNumber = (stepId: any): number | null => {
      if (typeof stepId === 'number') return stepId;
      if (typeof stepId !== 'string') return null;
      // Suporta formatos: 'step-2', 'step-02', '2'
      const digits = stepId.replace(/[^0-9]/g, '');
      const num = parseInt(digits || stepId, 10);
      return Number.isFinite(num) ? num : null;
    };

    const handleNavigate = (ev: Event) => {
      const e = ev as CustomEvent<{ stepId?: string | number; source?: string }>;
      const target = parseStepNumber(e.detail?.stepId);
      if (!target) return;
      if (target < 1 || target > 21) return;

      setCurrentStep(target);
      goToStep(target);
      if (import.meta?.env?.DEV) {
        // Navegação por evento (somente em ambiente de desenvolvimento)
        console.log('navigate-to-step:', e.detail?.stepId, '->', target, 'src:', e.detail?.source);
      }
    };

    window.addEventListener('navigate-to-step', handleNavigate as EventListener);
    window.addEventListener('quiz-navigate-to-step', handleNavigate as EventListener);

    // Sincronizar validação visual/funcional via eventos globais dos blocos
    const handleSelectionChange = (ev: Event) => {
      const e = ev as CustomEvent<{ selectionCount?: number; isValid?: boolean }>;
      const valid = !!e.detail?.isValid;
      setStepValidation(prev => ({ ...prev, [currentStep]: valid }));
      setStepValid?.(currentStep, valid);
    };

    const handleInputChange = (ev: Event) => {
      const e = ev as CustomEvent<{ value?: string; valid?: boolean }>;
      const value = e.detail?.value;
      const ok = typeof value === 'string' ? value.trim().length > 0 : !!e.detail?.valid;
      setStepValidation(prev => ({ ...prev, [currentStep]: ok }));
      setStepValid?.(currentStep, ok);

      // Etapa 1: capturar e persistir nome mesmo quando o bloco não conecta onInputChange
      try {
        if (currentStep === 1 && typeof value === 'string') {
          const v = value.trim();
          if (v.length > 0) {
            // Fluxo oficial
            try { saveName?.(v); } catch { }

            // Compatibilidade com outras partes do app
            try {
              localStorage.setItem('userName', v);
              localStorage.setItem('quizUserName', v);
            } catch { }

            // Armazenamento unificado (formData)
            try {
              import('@/services/core/UnifiedQuizStorage')
                .then(({ unifiedQuizStorage }) => unifiedQuizStorage.updateFormData('userName', v))
                .catch(() => { });
            } catch { }
          }
        }
      } catch { }
    };

    window.addEventListener('quiz-selection-change', handleSelectionChange as EventListener);
    window.addEventListener('quiz-input-change', handleInputChange as EventListener);
    // Capturar submissões completas de formulário (ex.: etapa 1 com form-container)
    const handleFormComplete = (ev: Event) => {
      const e = ev as CustomEvent<{ formData?: Record<string, string> }>;
      const formData = e.detail?.formData || {};
      const rawName = formData.name || formData.userName || '';
      const v = typeof rawName === 'string' ? rawName.trim() : '';
      if (currentStep === 1 && v.length > 0) {
        try { saveName?.(v); } catch { }
        try { localStorage.setItem('userName', v); localStorage.setItem('quizUserName', v); } catch { }
        try { import('@/services/core/UnifiedQuizStorage').then(({ unifiedQuizStorage }) => unifiedQuizStorage.updateFormData('userName', v)).catch(() => { }); } catch { }
        setStepValidation(prev => ({ ...prev, 1: true }));
        setStepValid?.(1, true);
      }
    };
    window.addEventListener('quiz-form-complete', handleFormComplete as EventListener);
    return () => {
      window.removeEventListener('navigate-to-step', handleNavigate as EventListener);
      window.removeEventListener('quiz-navigate-to-step', handleNavigate as EventListener);
      window.removeEventListener('quiz-selection-change', handleSelectionChange as EventListener);
      window.removeEventListener('quiz-input-change', handleInputChange as EventListener);
      window.removeEventListener('quiz-form-complete', handleFormComplete as EventListener);
    };
  }, [goToStep]);

  // 🔄 HANDLERS DE NAVEGAÇÃO
  const handleNext = () => {
    if (currentStep < 21) {
      const nextStepNum = currentStep + 1;
      setCurrentStep(nextStepNum);
      nextStep();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStepNum = currentStep - 1;
      setCurrentStep(prevStepNum);
      goToStep(prevStepNum);
    }
  };

  // (remoção de duplicidade: efeito acima já cuida do carregamento)
  // 🎯 FUNÇÕES DE VALIDAÇÃO E AVANÇO
  const validateStep = (currentBlocks: Block[]): boolean => {
    const questionBlocks = currentBlocks.filter(
      block => block.type === 'options-grid' || block.type === 'form-container'
    );

    if (questionBlocks.length === 0) return true; // Etapas sem perguntas são válidas

    return questionBlocks.every(block => {
      const questionId = block.properties?.questionId || block.id;
      const selections = userSelections[questionId] || [];

      if (block.type === 'form-container') {
        const answer = quizAnswers[block.content?.dataKey || 'default'];
        return block.content?.required ? !!answer && answer.trim().length > 0 : true;
      }

      // options-grid: usar regra centralizada considerando a fase da etapa
      const { isValid } = SelectionRules.computeSelectionValidity(
        currentStep,
        selections.length,
        {
          requiredSelections: block.properties?.requiredSelections as number | undefined,
          minSelections: block.properties?.minSelections as number | undefined,
        }
      );
      return isValid;
    });
  };

  const handleQuestionResponse = (questionId: string, optionId: string, blockConfig?: any) => {
    setUserSelections(prev => {
      const current = prev[questionId] || [];
      const maxSelections =
        (blockConfig?.maxSelections as number | undefined) ??
        (stepConfig?.maxSelections as number | undefined) ??
        3;

      let newSelections;
      if (current.includes(optionId)) {
        // Remove seleção
        newSelections = current.filter(id => id !== optionId);
      } else {
        // Adiciona seleção
        if (maxSelections === 1) {
          newSelections = [optionId];
        } else {
          newSelections =
            current.length >= maxSelections
              ? [...current.slice(1), optionId]
              : [...current, optionId];
        }
      }

      const updated = { ...prev, [questionId]: newSelections };

      // Integrar com o mecanismo oficial de respostas para o cálculo correto
      try {
        const isAdding = !current.includes(optionId);
        if (isAdding) {
          // Mapear etapa atual → id da questão esperada pelo motor (q1..q10)
          const mappedQuestionId = FlowCore.mapStepToQuestionId(currentStep);
          if (mappedQuestionId) {
            // Resposta com pontuação (2–11)
            answerScoredQuestion?.(mappedQuestionId, optionId);
          } else if (currentStep >= 13 && currentStep <= 18) {
            // Questões estratégicas (13–18) – para métricas/afinamentos
            answerStrategy?.(questionId, optionId);
          }
        }
      } catch {
        // silencioso em produção
      }

      // Persistir também uma versão compatível com o motor de cálculo (ids prefixados por estilo)
      try {
        // Mapeia cada optionId selecionado para o estilo dominante suportando múltiplos formatos de configuração
        const optionsArr = Array.isArray(blockConfig?.options) ? blockConfig.options : [];
        const scoreValues = blockConfig?.scoreValues || blockConfig?.properties?.scoreValues || {};

        const KNOWN_STYLES = ['natural', 'classico', 'contemporaneo', 'elegante', 'romantico', 'sexy', 'dramatico', 'criativo'];
        const normalize = (s: string) => (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
        const knownFromKeywords = Object.keys(STYLE_KEYWORDS_MAPPING);
        const detectStyleFromString = (txt: string | undefined): string | null => {
          const t = normalize(String(txt || ''));
          if (!t) return null;
          // primeiro: palavras-chave ricas (ex.: conforto -> natural)
          for (const kw of knownFromKeywords) {
            if (t.includes(kw)) return normalize(STYLE_KEYWORDS_MAPPING[kw]);
          }
          // fallback: estilos canônicos por substring
          for (const st of KNOWN_STYLES) if (t.includes(st)) return st;
          return null;
        };

        const derivePrefixed = (optId: string): string => {
          const opt: any = optionsArr.find((o: any) => String(o?.id) === String(optId)) || null;

          // 1) option.score como objeto { estilo: pontos }
          const scoreObj = (opt && typeof opt === 'object' && typeof opt.score === 'object') ? opt.score : null;
          if (scoreObj && Object.keys(scoreObj).length > 0) {
            let bestKey: string | null = null;
            let bestVal = -Infinity;
            for (const [k, v] of Object.entries(scoreObj)) {
              const val = typeof v === 'number' ? v : Number(v);
              if (!Number.isNaN(val) && val > bestVal) {
                bestVal = val;
                bestKey = k;
              }
            }
            if (bestKey) {
              return `${normalize(bestKey)}_${optId}`;
            }
            // sem melhor chave: não prefixar, deixe orquestrador lidar
            return String(optId);
          }

          // 2) properties.scoreValues pode vir em dois formatos:
          //    a) { [optionId]: { estilo: pontos } }
          //    b) { [optionId]: number } + uso de category/id/value para decidir estilo
          const svEntry = scoreValues?.[optId];
          if (svEntry) {
            if (typeof svEntry === 'object') {
              let bestKey: string | null = null;
              let bestVal = -Infinity;
              for (const [k, v] of Object.entries(svEntry)) {
                const val = typeof v === 'number' ? v : Number(v);
                if (!Number.isNaN(val) && val > bestVal) {
                  bestVal = val;
                  bestKey = k;
                }
              }
              const styleKey = bestKey ? normalize(bestKey) : (detectStyleFromString(opt?.category) || detectStyleFromString(opt?.id) || detectStyleFromString(opt?.value) || 'natural');
              return `${styleKey}_${optId}`;
            }
            if (typeof svEntry === 'number') {
              const styleKey = detectStyleFromString(opt?.category) || detectStyleFromString(opt?.id) || detectStyleFromString(opt?.value);
              if (styleKey) return `${styleKey}_${optId}`;
              // desconhecido: retornar original sem viés
              return String(optId);
            }
          }

          // 3) Sem score/scoreValues: tentar derivar do próprio option (category/id/value)
          const derived = detectStyleFromString(opt?.category) || detectStyleFromString(opt?.id) || detectStyleFromString(opt?.value);
          if (derived) return `${derived}_${optId}`;
          // Sem pista de estilo: manter id intacto (orquestrador fará fallback canônico)
          return String(optId);
        };

        const scoringMap = (() => {
          try {
            const raw = localStorage.getItem('userSelections');
            return (raw ? JSON.parse(raw) : {}) as Record<string, string[]>;
          } catch {
            return {} as Record<string, string[]>;
          }
        })();

        const prefixedSelections = (newSelections || []).map(derivePrefixed);
        // usar id canônico da questão (q1..q10) quando disponível
        const canonicalQid = (() => {
          try {
            const mqid = FlowCore.mapStepToQuestionId(currentStep);
            return mqid || null;
          } catch {
            return null;
          }
        })();
        const storageKey = canonicalQid || `step-${currentStep}-${questionId}`;
        const nextScoringMap = { ...scoringMap, [storageKey]: prefixedSelections };
        try {
          localStorage.setItem('userSelections', JSON.stringify(nextScoringMap));
        } catch { }

        // Sincronizar com armazenamento unificado para que o fallback do passo 20 use IDs prefixados
        try {
          import('@/services/core/UnifiedQuizStorage')
            .then(({ unifiedQuizStorage }) => unifiedQuizStorage.updateSelections(storageKey, prefixedSelections))
            .catch(() => { });
        } catch { }
      } catch { }

      // Notificar ouvintes que dependem do avanço das respostas
      try { window.dispatchEvent(new Event('quiz-answer-updated')); } catch { }

      // Verificar se a etapa está completa
      // Debounce curto para validação
      debounce(`validate:step-${currentStep}`, () => {
        const isValid = validateStep(blocks);
        setStepValidation(prev => ({ ...prev, [currentStep]: isValid }));
        setStepValid?.(currentStep, isValid);

        // Notificar mudança de seleção com status de validade consolidado
        try {
          const selectionCount = (updated[questionId] || []).length;
          window.dispatchEvent(new CustomEvent('quiz-selection-change', { detail: { selectionCount, isValid } }));
        } catch { }

        // Auto avanço se configurado (fallback para store)
        const auto = FlowCore.shouldAutoAdvance({ isValid, stepConfig, blockConfig });
        if (auto.proceed) {
          schedule(`auto-advance:step-${currentStep}`, () => handleNext(), auto.delay);
        }
      }, 120);

      return updated;
    });
  };

  const handleFormInput = (dataKey: string, value: string, blockConfig?: any) => {
    setQuizAnswers(prev => {
      const updated = { ...prev, [dataKey]: value };

      // Debounce curto para validação
      debounce(`validate:step-${currentStep}`, () => {
        const isValid = validateStep(blocks);
        setStepValidation(prev => ({ ...prev, [currentStep]: isValid }));
        setStepValid?.(currentStep, isValid);

        const shouldAutoAdvance =
          (blockConfig?.autoAdvanceOnComplete as boolean | undefined) ??
          (stepConfig?.autoAdvanceOnComplete as boolean | undefined) ??
          false;
        const delay =
          (blockConfig?.autoAdvanceDelay as number | undefined) ??
          (stepConfig?.autoAdvanceDelay as number | undefined) ??
          1500;

        if (isValid && shouldAutoAdvance) {
          schedule(`auto-advance:step-${currentStep}`, () => handleNext(), delay);
        }
      }, 120);

      // Conectar captura do nome (etapa 1) ao fluxo oficial
      try {
        if (currentStep === 1 && (dataKey === 'userName' || dataKey === 'name')) {
          if (typeof value === 'string' && value.trim().length > 0) {
            saveName?.(value.trim());
            // manter compat com outros blocos
            try {
              const v = value.trim();
              localStorage.setItem('userName', v);
              localStorage.setItem('quizUserName', v);
            } catch { }
          }
        }
      } catch { }

      // Sincronizar também com armazenamento unificado (formData)
      try {
        import('@/services/core/UnifiedQuizStorage')
          .then(({ unifiedQuizStorage }) => unifiedQuizStorage.updateFormData(dataKey, value))
          .catch(() => { });
      } catch { }

      return updated;
    });
  };

  // Cancela tarefas pendentes ao trocar de etapa (evita cross-step)
  useEffect(() => {
    cancelAll();
  }, [currentStep, cancelAll]);

  // Registrar progresso no armazenamento unificado ao trocar de etapa
  useEffect(() => {
    (async () => {
      try {
        const { unifiedQuizStorage } = await import('@/services/core/UnifiedQuizStorage');
        unifiedQuizStorage.updateProgress(currentStep);
      } catch { }
    })();
  }, [currentStep]);

  const progress = ((currentStep - 1) / 20) * 100;

  // 🎨 Fundo configurável por etapa (store NoCode)
  const { stepConfig } = (() => {
    try {
      const cfg = useStepNavigationStore.getState().getStepConfig(`step-${currentStep}`);
      return { stepConfig: cfg } as any;
    } catch {
      return { stepConfig: undefined } as any;
    }
  })();

  const bgStyle = useMemo(() => {
    const from = stepConfig?.backgroundFrom || '#FAF9F7';
    const via = stepConfig?.backgroundVia || '#F5F2E9';
    const to = stepConfig?.backgroundTo || '#EEEBE1';
    return { from, via, to };
  }, [stepConfig?.backgroundFrom, stepConfig?.backgroundVia, stepConfig?.backgroundTo]);

  // Detectar se o template já inclui um bloco de navegação premium
  const hasTemplateNavigation = useMemo(() => {
    try {
      return blocks.some(b => b.type === 'quiz-navigation');
    } catch {
      return false;
    }
  }, [blocks]);

  // Derivar o tipo de questão para a navegação
  const currentQuestionType: 'normal' | 'strategic' | 'final' = useMemo(() => {
    try {
      const step = currentStep;
      // Normal: 2–11 | Estratégica: 13–18 | Final: demais
      const isNormal = step >= 2 && step <= 11;
      const isStrategic = step >= 13 && step <= 18;
      if (isNormal) return 'normal';
      if (isStrategic) return 'strategic';
      return 'final';
    } catch {
      return 'final';
    }
  }, [currentStep]);

  // ===== ✅ CÁLCULO ROBUSTO E PERSISTÊNCIA DO RESULTADO =====
  const computeAndPersistResult = React.useCallback(async (): Promise<void> => {
    console.log('🔄 [QuizModular] Iniciando cálculo de resultado...');

    try {
      // ✅ 1. VALIDAÇÃO PRÉVIA: Garantir dados suficientes
      const { unifiedQuizStorage } = await import('@/services/core/UnifiedQuizStorage');
      const { StorageService } = await import('@/services/core/StorageService');

      if (!unifiedQuizStorage.hasEnoughDataForResult()) {
        const stats = unifiedQuizStorage.getDataStats();
        console.warn('⚠️ Dados insuficientes:', stats);

        if (stats.selectionsCount === 0) {
          throw new Error('Nenhuma resposta registrada para calcular resultado');
        }
      }

      // ✅ 2. CONSOLIDAR DADOS: Priorizar unificado, fallback para legado
      let selectionsForScoring: Record<string, string[]> = {};
      let userName = '';

      // Primeiro: tentar dados unificados
      const unifiedData = unifiedQuizStorage.loadData();
      if (Object.keys(unifiedData.selections).length > 0) {
        selectionsForScoring = unifiedData.selections;
        userName = unifiedData.formData.userName || unifiedData.formData.name || '';
        console.log('📦 Usando dados unificados:', Object.keys(selectionsForScoring).length, 'seleções');
      } else {
        // Fallback: dados legados
        selectionsForScoring = StorageService.safeGetJSON('userSelections') || userSelections || {};
        userName = quizAnswers.userName || StorageService.safeGetString('userName') || StorageService.safeGetString('quizUserName') || '';
        console.log('📦 Usando dados legados:', Object.keys(selectionsForScoring).length, 'seleções');
      }

      if (Object.keys(selectionsForScoring).length === 0) {
        throw new Error('Nenhuma seleção encontrada para processar');
      }

      // ✅ 3. EXECUTAR CÁLCULO ROBUSTO (via Orchestrator)
      const weightQuestions = (OPTIMIZED_FUNNEL_CONFIG as any)?.calculations?.scoreWeights?.questions;
      const { payload } = await ResultOrchestrator.run({
        selectionsByQuestion: selectionsForScoring,
        weightQuestions: typeof weightQuestions === 'number' ? weightQuestions : 1,
        userName: userName || 'Usuário',
        persistToSupabase: false,
        sessionId: null,
      });

      // ✅ 4. PERSISTIR EM AMBOS OS SISTEMAS (sincronização completa)
      ResultEngine.persist(payload);
      unifiedQuizStorage.saveResult(payload as any);

      // Persistir nome do usuário em locais compatíveis
      if (userName) {
        StorageService.safeSetString('quizUserName', userName);
        StorageService.safeSetString('userName', userName);
      }

      // ✅ FASE 4: Emitir eventos para métricas
      window.dispatchEvent(new CustomEvent('quiz-calculation-started', {
        detail: { step: currentStep, timestamp: Date.now() }
      }));

      console.log('✅ [QuizModular] Resultado calculado e salvo:', {
        primaryStyle: (payload as any).primaryStyle?.style,
        totalScores: Object.keys(((payload as any).scores || {})).length,
        userName: (payload as any)?.userData?.name || userName || 'Não informado'
      });

    } catch (error: any) {
      console.error('❌ [QuizModular] Erro no cálculo:', error);

      // ✅ FASE 4: Registrar falha nas métricas
      if ((window as any).__quizMetrics?.recordFailedCalculation) {
        (window as any).__quizMetrics.recordFailedCalculation((error as Error)?.message || 'Erro desconhecido');
      }

      // ✅ 5. FALLBACK ROBUSTO: Usar calculadora externa
      try {
        console.log('🔄 Tentando fallback com calculadora robusta...');
        const { calculateAndSaveQuizResult } = await import('@/utils/quizResultCalculator');
        await calculateAndSaveQuizResult();
        console.log('✅ Fallback bem-sucedido');
      } catch (fallbackError) {
        console.error('❌ Fallback também falhou:', fallbackError);

        // Registrar falha dupla nas métricas
        if ((window as any).__quizMetrics?.recordFailedCalculation) {
          (window as any).__quizMetrics.recordFailedCalculation('Fallback failed: ' + (fallbackError as Error)?.message);
        }

        throw new Error(`Falha completa no cálculo: ${(error as Error)?.message || 'Erro desconhecido'}`);
      }
    }
  }, [userSelections, quizAnswers.userName]);

  // ✅ CORREÇÃO CRÍTICA: Disparar cálculo SÍNCRONO na etapa 19
  useEffect(() => {
    if (currentStep === 19) {
      // ✅ CORREÇÃO: Aguardar cálculo completar com async/await correto
      const performCalculation = async () => {
        try {
          console.log('🎯 Iniciando cálculo obrigatório na etapa 19...');
          // ✅ CRÍTICO: Aguardar completion do cálculo
          await computeAndPersistResult();
          console.log('✅ Cálculo completado na etapa 19');

          // Emitir evento para confirmar que resultado está pronto
          window.dispatchEvent(new Event('quiz-result-updated'));
        } catch (error) {
          console.error('❌ Falha no cálculo da etapa 19:', error);

          // Fallback: tentar via calculadora robusta
          try {
            const { calculateAndSaveQuizResult } = await import('@/utils/quizResultCalculator');
            await calculateAndSaveQuizResult();
            console.log('✅ Fallback completado');
          } catch (fallbackError) {
            console.error('❌ Fallback também falhou:', fallbackError);
          }
        }
      };

      // ✅ CRÍTICO: Não bloquear thread, executar de forma independente
      performCalculation().catch(console.error);
    }
  }, [currentStep, computeAndPersistResult]);

  // ✅ CORREÇÃO CRÍTICA: Garantir resultado válido na etapa 20 com timeout
  useEffect(() => {
    if (currentStep === 20) {
      const ensureResult = async () => {
        try {
          const { StorageService } = await import('@/services/core/StorageService');
          const { unifiedQuizStorage } = await import('@/services/core/UnifiedQuizStorage');

          // Verificar múltiplas fontes de resultado
          const legacyResult = StorageService.safeGetJSON('quizResult');
          const unifiedResult = unifiedQuizStorage.loadData().result;

          if (!legacyResult && !unifiedResult) {
            console.log('⚠️ Nenhum resultado encontrado na etapa 20, recalculando...');
            await computeAndPersistResult();
          } else {
            console.log('✅ Resultado encontrado na etapa 20:', {
              legacy: Boolean(legacyResult),
              unified: Boolean(unifiedResult)
            });

            // Sincronizar sistemas se necessário
            if (legacyResult && !unifiedResult) {
              unifiedQuizStorage.saveResult(legacyResult);
            } else if (unifiedResult && !legacyResult) {
              StorageService.safeSetJSON('quizResult', unifiedResult);
            }
          }

          // Sempre notificar UI para reagir
          window.dispatchEvent(new Event('quiz-result-updated'));
          window.dispatchEvent(new Event('quiz-result-refresh'));
        } catch (error) {
          console.error('❌ Falha ao garantir resultado na etapa 20:', error);
        }
      };

      // ✅ CRÍTICO: Não bloquear thread, executar de forma independente  
      ensureResult().catch(console.error);
    }
  }, [currentStep, computeAndPersistResult]);

  // 📈 Estatísticas/feedback por etapa (contagem de seleções e mensagens)
  const selectedCount = useMemo(() => {
    try {
      return blocks.reduce((sum, block) => {
        if (block.type === 'options-grid') {
          const qid = (block as any).properties?.questionId || block.id;
          return sum + ((userSelections[qid] || []).length);
        }
        if (block.type === 'form-container') {
          const dataKey = (block as any).content?.dataKey || 'default';
          const required = !!(block as any).content?.required;
          const val = quizAnswers[dataKey];
          const has = required && typeof val === 'string' && val.trim().length > 0;
          return sum + (has ? 1 : 0);
        }
        return sum;
      }, 0);
    } catch {
      return 0;
    }
  }, [blocks, userSelections, quizAnswers]);

  const mustBeValid = stepConfig?.enableButtonOnlyWhenValid !== false;
  const isStepValid = !!stepValidation[currentStep];
  const nextDisabled = currentStep === 21 || (mustBeValid && !isStepValid);

  const formatMessage = (tpl?: string) =>
    (tpl || '')
      .replace('{count}', String(selectedCount))
      .replace('{required}', String(stepConfig?.requiredSelections ?? 0));

  const validationText = stepConfig?.validationMessage
    ? formatMessage(stepConfig.validationMessage)
    : 'Complete a etapa';
  const progressText = stepConfig?.progressMessage
    ? formatMessage(stepConfig.progressMessage)
    : undefined;

  const nextLabel = currentStep === 21
    ? 'Finalizado'
    : (!isStepValid && mustBeValid
      ? 'Complete a etapa'
      : (stepConfig?.nextButtonText || 'Próxima →'));

  // Página de produção: sem DnD nem sidebars de edição

  return (
    <>
      <div
        className={"min-h-screen bg-gradient-to-br"}
        style={{
          // Aplicar gradiente inline para refletir personalização por etapa
          backgroundImage: `linear-gradient(135deg, ${bgStyle.from}, ${bgStyle.via}, ${bgStyle.to})`,
        }}
      >
        {/* CONTEÚDO CENTRAL PARA USUÁRIO FINAL */}
        <div className="flex min-h-screen">
          <div className="flex-1 overflow-auto">
            <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-8">
              <div className="max-w-4xl mx-auto">

                {/* 📋 HEADER DA ETAPA (limpo: sem textos promocionais fixos) - Responsivo - REMOVIDO PARA EVITAR DUPLICAÇÃO */}
                {/* O cabeçalho principal já mostra essas informações, não precisamos duplicar */}
                {false && (
                  <div className="text-center mb-4 sm:mb-6 md:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                      <div className="text-xs sm:text-sm text-stone-500">Etapa {currentStep} de 21</div>
                      <div className="w-24 sm:w-32 bg-stone-200 rounded-full h-1.5 sm:h-2 mx-auto sm:mx-0">
                        <div
                          className="bg-gradient-to-r from-[#B89B7A] to-[#8B7355] h-1.5 sm:h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-xs sm:text-sm text-stone-600">{progress}%</div>
                    </div>
                    {(stepConfig?.showProgressMessage || stepConfig?.showSelectionCount) && (
                      <div className="text-xs sm:text-sm text-stone-600 px-4">
                        {stepConfig?.showProgressMessage
                          ? (progressText || '')
                          : `Você selecionou ${selectedCount} de ${stepConfig?.requiredSelections ?? 0} opções`}
                      </div>
                    )}
                  </div>
                )}

                {/* 🎯 MENSAGENS DE PROGRESSO/SELEÇÃO - Apenas quando necessário */}
                {(stepConfig?.showProgressMessage || stepConfig?.showSelectionCount) && (
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="text-xs sm:text-sm text-stone-600 px-4">
                      {stepConfig?.showProgressMessage
                        ? (progressText || '')
                        : `Você selecionou ${selectedCount} de ${stepConfig?.requiredSelections ?? 0} opções`}
                    </div>
                  </div>
                )}

                {/* 🚀 Navegação premium (fallback) — aparece quando o template não incluir 'quiz-navigation' */}
                {!hasTemplateNavigation && (
                  <div className="mb-4">
                    {(() => {
                      const QuizNavigation = React.lazy(() => import('@/components/quiz/QuizNavigation'));
                      return (
                        <Suspense fallback={null}>
                          <QuizNavigation
                            canProceed={!!stepValidation[currentStep]}
                            onNext={handleNext}
                            onPrevious={currentStep > 1 ? handlePrevious : undefined}
                            currentQuestionType={currentQuestionType}
                            selectedOptionsCount={selectedCount}
                            currentStep={currentStep}
                            totalSteps={21}
                            stepName={stepConfig?.title || `Etapa ${currentStep}`}
                            showUserInfo={false}
                          />
                        </Suspense>
                      );
                    })()}
                  </div>
                )}

                {/* 🎨 ÁREA DE RENDERIZAÇÃO DOS BLOCOS - Mobile Responsivo */}
                <div className="bg-white/95 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg md:shadow-xl md:shadow-stone-200/40 border border-stone-200/30 ring-1 ring-stone-100/20 overflow-hidden">
                  {/* Estado de loading */}
                  {isLoading && (
                    <div className="min-h-[400px] sm:min-h-[500px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-[#B89B7A] border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
                        <p className="text-stone-600 text-sm sm:text-base">Carregando etapa {currentStep}...</p>
                      </div>
                    </div>
                  )}

                  {/* Estado de erro */}
                  {error && (
                    <div className="min-h-[400px] sm:min-h-[500px] flex items-center justify-center">
                      <div className="text-center p-4 sm:p-8">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-red-600 text-xl sm:text-2xl">⚠️</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2">Erro ao carregar</h3>
                        <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
                        <button
                          onClick={() => window.location.reload()}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm sm:text-base"
                        >
                          Tentar novamente
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Renderização dos blocos - Otimizado para Mobile */}
                  {!isLoading && !error && (
                    <div className="quiz-content p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
                      {(() => {
                        // ✅ FASE 3: Template robusto para etapa 20 com fallback inteligente
                        if (currentStep === 20 && blocks.length === 0) {
                          return (
                            <div className="quiz-content p-3 sm:p-4 md:p-8">
                              <Suspense fallback={<div className="text-center p-6 text-sm sm:text-base">Carregando resultado…</div>}>
                                <Step20FallbackTemplate />
                              </Suspense>
                            </div>
                          );
                        }

                        // Renderização normal dos blocos
                        return blocks.map(block => (
                          <div
                            key={block.id}
                            className={cn(
                              'quiz-block',
                              // Sem animações/transições fora do Canvas
                            )}
                          >
                            <UniversalBlockRenderer
                              block={{
                                ...block,
                                // Adicionar callbacks para interação
                                properties: {
                                  ...block.properties,
                                  onOptionSelect: (optionId: string) => {
                                    const questionId = block.properties?.questionId || block.id;
                                    handleQuestionResponse(questionId, optionId, block.properties);
                                  },
                                  onInputChange: (value: string) => {
                                    const dataKey = block.content?.dataKey || 'default';
                                    handleFormInput(dataKey, value, block.content);
                                  },
                                  selectedOptions:
                                    userSelections[block.properties?.questionId || block.id] || [],
                                  inputValue: quizAnswers[block.content?.dataKey || 'default'] || '',
                                  isValid: stepValidation[currentStep] || false,
                                },
                              }}
                              isSelected={false}
                              onClick={() => { }}
                            />
                          </div>
                        ));
                      })()}
                    </div>
                  )}
                </div>

                {/* 🎮 CONTROLES DE NAVEGAÇÃO LIMPOS - Abaixo dos blocos */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-stone-200/30">

                  {/* Botão Anterior */}
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    ← Anterior
                  </Button>

                  {/* Informações de progresso no centro */}
                  <div className="text-center order-1 sm:order-2 flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                    <div className="text-sm text-stone-600">
                      Etapa <span className="font-semibold text-[#B89B7A]">{currentStep}</span> de <span className="font-semibold">21</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={progress} className="w-24 sm:w-32 h-2" />
                      <span className="text-sm font-medium text-stone-700">{progress}%</span>
                    </div>
                  </div>

                  {/* Botão Próximo/Finalizar */}
                  <div className="w-full sm:w-auto order-3">
                    <Button
                      onClick={handleNext}
                      disabled={nextDisabled}
                      className={cn(
                        'w-full sm:w-auto',
                        nextDisabled
                          ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#B89B7A] to-[#8B7355] text-white hover:from-[#A08966] hover:to-[#7A6B4D] shadow-md hover:shadow-lg'
                      )}
                    >
                      {nextLabel} →
                    </Button>

                    {/* Mensagem de validação abaixo do botão */}
                    {stepConfig?.showValidationFeedback && mustBeValid && !isStepValid && (
                      <div className="text-xs text-stone-500 mt-2 text-center">
                        {validationText}
                      </div>
                    )}
                  </div>
                </div>

                {/* Utilitário opcional de recarga */}
                <button
                  onClick={async () => {
                    const template = await reloadTemplate(currentStep);
                    if (template?.blocks) {
                      setBlocks(template.blocks);
                    }
                  }}
                  className="mt-4 px-4 py-3 rounded-lg font-medium bg-white text-stone-700 hover:bg-stone-50 border border-stone-200 shadow-sm hover:shadow"
                  title="Recarregar blocos da etapa"
                >
                  🔄 Recarregar etapa
                </button>
              </div>

              {/* 📊 FOOTER COM ESTATÍSTICAS */}
              <div className="text-center mt-12 text-sm text-stone-500">
                <div className="flex justify-center items-center space-x-6">
                  <div className="flex items-center gap-1">
                    <span>🎯</span> Etapa: {currentStep}/21
                  </div>
                  <div className="flex items-center gap-1">
                    <span>📊</span> Progresso: {progress}%
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🎨</span> Blocos: {blocks.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ FASE 4: Métricas e monitoramento avançado */}
      {import.meta?.env?.DEV && (
        <Suspense fallback={null}>
          <QuizResultMetrics />
        </Suspense>
      )}

      {/* Dev-only result debug widget */}
      <DevResultDebug />

      {/* ✅ Validador de resultado sempre ativo na etapa 20 */}
      {currentStep === 20 && (
        <Suspense fallback={null}>
          <QuizResultValidator />
        </Suspense>
      )}
    </>
  );
};

export default QuizModularPage;
