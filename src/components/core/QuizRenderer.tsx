import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import { useQuizFlow } from '@/hooks/core/useQuizFlow';
import { Block } from '@/types/editor';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
// Validação centralizada cobre regras por etapa
import { useCentralizedStepValidation } from '@/hooks/useCentralizedStepValidation';

interface QuizRendererProps {
  mode?: 'production' | 'preview' | 'editor';
  onStepChange?: (step: number) => void;
  initialStep?: number;
  className?: string;
  // Overrides para uso no editor: renderizar blocos reais do EditorProvider e sincronizar etapa
  blocksOverride?: Block[];
  currentStepOverride?: number;
  // Callback opcional para seleção de bloco no modo editor
  onBlockClick?: (blockId: string) => void;
  // Permitir seleção e uso de overrides também em preview (sem mudar o visual)
  previewEditable?: boolean;
  // Id do bloco selecionado (para destacar com moldura no preview editável)
  selectedBlockId?: string | null;
  // Conteúdo customizado para substituir a renderização dos blocos (ex.: Canvas do editor)
  contentOverride?: React.ReactNode;
}

/**
 * 🎨 RENDERIZADOR UNIVERSAL DO QUIZ
 *
 * Renderiza etapas usando dados reais do template
 * Funciona idêntico em produção e preview
 */
export const QuizRenderer: React.FC<QuizRendererProps> = React.memo(({
  mode = 'production',
  onStepChange,
  initialStep = 1,
  className = '',
  blocksOverride,
  currentStepOverride,
  onBlockClick,
  previewEditable = false,
  selectedBlockId = null,
  contentOverride,
}) => {
  // Memoize the quiz flow configuration to prevent re-initialization
  const quizFlowConfig = useMemo(() => ({
    mode,
    onStepChange,
    initialStep,
  }), [mode, onStepChange, initialStep]);
  
  const { quizState, actions } = useQuizFlow(quizFlowConfig);

  const { currentStep, totalSteps, progress, isLoading } = quizState;
  const { prevStep, nextStep, getStepData, setStepValid, goToStep } = actions;
  const [previewSessionData, setPreviewSessionData] = useState<Record<string, any>>({});

  // Buscar dados da etapa atual
  const canUseOverrides =
    (mode === 'editor' || (mode === 'preview' && previewEditable)) && Array.isArray(blocksOverride);

  // Memoize step data to prevent unnecessary recalculations
  const stepBlocks = useMemo(() => {
    return canUseOverrides ? (blocksOverride as Block[]) : getStepData();
  }, [canUseOverrides, blocksOverride, getStepData]);

  // Stable step synchronization
  const handleStepSync = useCallback(() => {
    if (typeof currentStepOverride === 'number' && currentStepOverride !== currentStep) {
      try {
        goToStep?.(currentStepOverride);
      } catch { }
    }
  }, [currentStepOverride, currentStep, goToStep]);

  // 🔄 Sincronizar passo interno com o passo do Editor/Preview
  useEffect(() => {
    if (typeof currentStepOverride === 'number' && currentStepOverride !== currentStep) {
      try {
        goToStep?.(currentStepOverride);
      } catch { }
    }
  }, [currentStepOverride, currentStep, goToStep]);

  // Metadata da etapa (se necessário futuramente)
  // const stepData: StepData = {
  //   blocks: stepBlocks,
  //   stepNumber: currentStepOverride ?? currentStep,
  //   stepType: ((): StepData['stepType'] => {
  //     if (currentStep === 1) return 'form';
  //     if (currentStep >= 2 && currentStep <= 11) return 'question';
  //     if (currentStep === 12 || currentStep === 19) return 'transition';
  //     if (currentStep >= 13 && currentStep <= 18) return 'question';
  //     if (currentStep === 20) return 'result';
  //     if (currentStep === 21) return 'offer';
  //     return 'question';
  //   })(),
  // };

  // 🎨 Fundo configurável por etapa (store NoCode)
  const { stepConfig } = useMemo(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const store = require('@/stores/useStepNavigationStore');
      const stepNum = currentStepOverride ?? currentStep;
      const cfg = store.useStepNavigationStore.getState().getStepConfig(`step-${stepNum}`);
      return { stepConfig: cfg } as any;
    } catch {
      return { stepConfig: undefined } as any;
    }
  }, [currentStep, currentStepOverride]);

  const bgStyle = useMemo(() => {
    const from = stepConfig?.backgroundFrom || '#FAF9F7';
    const via = stepConfig?.backgroundVia || '#F5F2E9';
    const to = stepConfig?.backgroundTo || '#EEEBE1';
    return { from, via, to };
  }, [stepConfig?.backgroundFrom, stepConfig?.backgroundVia, stepConfig?.backgroundTo]);

  // 🔄 Hidratação do resultado em modos editor/preview
  useEffect(() => {
    try {
      const stepNum = currentStepOverride ?? currentStep;
      const isResultStep = stepNum === 20 || stepNum === 21;
      const isEditLike = mode === 'editor' || (mode === 'preview' && previewEditable);
      if (!isResultStep || !isEditLike) return;

      // Se não houver resultado persistido, cria um básico a partir do estado atual
      const hasResult = (() => {
        try {
          const r = (require('@/services/core/StorageService') as any).StorageService.safeGetJSON('quizResult');
          return !!r && !!r.primaryStyle;
        } catch { return false; }
      })();

      if (!hasResult) {
        try {
          // Instanciar hook fora de React não é possível; em vez disso, tenta reaproveitar estado salvo
          // Fallback: cria um resultado mínimo neutro para não quebrar renderização
          const Storage = (require('@/services/core/StorageService') as any).StorageService;
          const name = Storage.safeGetString('userName') || Storage.safeGetString('quizUserName') || '';
          const minimal = {
            primaryStyle: { category: 'Neutro', style: 'neutro', score: 0, points: 0, percentage: 0, rank: 1 },
            secondaryStyles: [],
            totalQuestions: 0,
            completedAt: new Date(),
            scores: {},
            userData: { name, completionTime: new Date(), strategicAnswersCount: 0 },
          };
          Storage.safeSetJSON('quizResult', minimal);
        } catch { }
      }
    } catch { }
  }, [mode, previewEditable, currentStep, currentStepOverride]); // Proper dependency array

  // Gating passa a ser feito via validação centralizada (quizState.stepValidation)

  // Expor etapa atual globalmente (editor/preview dependem de window.__quizCurrentStep)
  useEffect(() => {
    try {
      const stepNum = currentStepOverride ?? currentStep;
      (window as any).__quizCurrentStep = stepNum;
    } catch { }
  }, [currentStep, currentStepOverride]);

  // Escutar eventos globais de blocos - STABLE VERSION
  useEffect(() => {
    const handleSelectionChange = (ev: Event) => {
      const e = ev as CustomEvent<{ isValid?: boolean; valid?: boolean; selectionCount?: number }>;
      const valid = (e.detail?.isValid ?? e.detail?.valid) ?? false;
      if (setStepValid) setStepValid(currentStep, valid);
    };
    const handleInputChange = (ev: Event) => {
      const e = ev as CustomEvent<{ value?: string; valid?: boolean }>;
      const ok = typeof e.detail?.value === 'string' ? (e.detail.value?.trim().length ?? 0) > 0 : !!e.detail?.valid;
      if (setStepValid) setStepValid(currentStep, ok);
    };
    window.addEventListener('quiz-selection-change', handleSelectionChange as EventListener);
    window.addEventListener('quiz-input-change', handleInputChange as EventListener);
    return () => {
      window.removeEventListener('quiz-selection-change', handleSelectionChange as EventListener);
      window.removeEventListener('quiz-input-change', handleInputChange as EventListener);
    };
  }, [currentStep, setStepValid]); // Added setStepValid to dependencies

  // Memoize stepBlocks to prevent infinite re-renders
  const stableStepBlocks = useMemo(() => stepBlocks || [], [stepBlocks]);

  // ✅ Validação centralizada (alinha com EditorPro)
  useCentralizedStepValidation({
    currentStep,
    // Passa um RawStepBlocks mínimo com a etapa atual
    stepBlocks: { [`step-${currentStep}`]: stableStepBlocks } as any,
    setStepValid,
  });

  const isStepValid = !!quizState.stepValidation?.[currentStep];
  const mustBeValid = stepConfig?.enableButtonOnlyWhenValid !== false;
  const nextDisabled = (currentStep === totalSteps) || (mustBeValid && !isStepValid);
  const nextLabel = currentStep === totalSteps
    ? 'Finalizado'
    : (!isStepValid && mustBeValid ? 'Complete a etapa' : (stepConfig?.nextButtonText || 'Próxima →'));

  // Header (alinhado ao /quiz)
  const renderHeader = () => (
    <div className="bg-white/90 backdrop-blur-sm border border-stone-200/50 shadow-sm rounded-lg mb-6 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-stone-800">Quiz Style Challenge</h2>
          <div className="text-sm text-stone-600">Etapa {currentStep} de {totalSteps}</div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-48">
            <div className="bg-stone-200 rounded-full h-2 w-full">
              <div
                className="bg-gradient-to-r from-[#B89B7A] to-[#8B7355] h-2 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="text-sm font-medium text-stone-700">{progress}%</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={cn('px-3 py-2 text-sm rounded border', currentStep === 1 ? 'bg-stone-100 text-stone-400' : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200')}
          >
            ← Anterior
          </button>
          <button
            onClick={() => !nextDisabled && nextStep()}
            disabled={nextDisabled}
            className={cn('px-3 py-2 text-sm rounded', nextDisabled ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#B89B7A] to-[#8B7355] text-white hover:from-[#A08966] hover:to-[#7A6B4D] shadow')}
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  );

  // Renderizar conteúdo da etapa
  const renderStepContent = () => {
    // Loading state
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Calculando seus resultados...</h2>
          <p className="text-gray-600">Analisando suas respostas...</p>
        </div>
      );
    }

    // Se conteúdo customizado foi passado (modo edição), usar ele dentro do mesmo wrapper
    if (contentOverride) {
      return (
        <div className="step-content p-8 space-y-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-stone-200/40 border border-stone-200/30 ring-1 ring-stone-100/20 overflow-hidden">
          {contentOverride}
        </div>
      );
    }

    // Renderizar blocos da etapa usando UniversalBlockRenderer
    const handleBlockClick = (_e: React.MouseEvent, block: any) => {
      const isSelectable = mode === 'editor' || (mode === 'preview' && previewEditable);
      // 1) Seleção de bloco em preview/edit
      if (isSelectable && block.id && onBlockClick) {
        onBlockClick(String(block.id));
      }

      // 2) Bridge de navegação no preview editável para botões inline
      if (mode === 'preview' && previewEditable) {
        const action = block?.properties?.action || block?.content?.action;
        if (block?.type === 'button-inline' && action) {
          const step = currentStepOverride ?? currentStep;
          let target = step;
          if (action === 'next-step') {
            target = Math.min(totalSteps, step + 1);
          } else if (action === 'prev-step') {
            target = Math.max(1, step - 1);
          } else if (action === 'go-to-step') {
            const nextId = block?.properties?.nextStepId || block?.content?.nextStepId;
            if (typeof nextId === 'string') {
              const match = nextId.match(/(\d+)/);
              if (match) target = Math.max(1, Math.min(totalSteps, parseInt(match[1], 10)));
            } else if (typeof nextId === 'number') {
              target = Math.max(1, Math.min(totalSteps, nextId));
            }
          }
          if (target !== step) onStepChange?.(target);
        }
      }
    };

    return (
      <div className="step-content p-8 space-y-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-stone-200/40 border border-stone-200/30 ring-1 ring-stone-100/20 overflow-hidden">
        {stepBlocks.map((block: any, index: number) => {
          const isSelectable = mode === 'editor' || (mode === 'preview' && previewEditable);
          const isSelected = isSelectable && selectedBlockId === block.id;
          // Injeção de callbacks/session para preview com comportamento real
          const injectedProps = (mode === 'preview')
            ? {
              onNext: () => nextStep(),
              onUpdateSessionData: (key: string, value: any) =>
                setPreviewSessionData(prev => ({ ...prev, [key]: value })),
              sessionData: previewSessionData,
            }
            : {};
          return (
            <div
              key={block.id || index}
              className={
                'block-container relative transition-all ' +
                (isSelected ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg' : '')
              }
              onMouseDown={() => {
                if (isSelectable && block.id && onBlockClick) {
                  onBlockClick(String(block.id));
                }
              }}
              onClick={e => handleBlockClick(e, block)}
            >
              <UniversalBlockRenderer
                block={{
                  ...block,
                  // Passar callbacks via properties para componentes que leem de lá
                  properties: {
                    ...(block.properties || {}),
                    ...(injectedProps as any),
                  },
                }}
                isSelected={isSelected}
                mode={mode}
                onClick={() => {
                  // Mantém seleção ao clicar no próprio componente
                  if (isSelectable && block.id && onBlockClick) {
                    onBlockClick(String(block.id));
                  }
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`quiz-renderer min-h-screen bg-gradient-to-br ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${bgStyle.from}, ${bgStyle.via}, ${bgStyle.to})`,
      }}
    >
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {renderHeader()}
        {/* Header secundário de etapa */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-sm text-stone-500">Etapa {currentStep} de {totalSteps}</div>
            <div className="w-32 bg-stone-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-[#B89B7A] to-[#8B7355] h-2 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-sm text-stone-600">{progress}%</div>
          </div>
        </div>
        {renderStepContent()}
      </div>
    </div>
  );
});

// Display name for debugging
QuizRenderer.displayName = 'QuizRenderer';
