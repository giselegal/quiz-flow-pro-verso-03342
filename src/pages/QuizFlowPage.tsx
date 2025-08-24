import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import QuizRunnerShell from '@/components/quiz/QuizRunnerShell';
import { useQuizFlow } from '@/hooks/core/useQuizFlow';
import { Block } from '@/types/editor';
import { TemplateManager } from '@/utils/TemplateManager';
import React, { useEffect, useState } from 'react';

/**
 * QuizFlowPage – Runner de produção sem colunas (21 etapas)
 * - Carrega blocos por etapa via TemplateManager (paridade com editor)
 * - Integra com useQuizFlow para progresso e validação
 * - Escuta eventos dos blocos (navigate-to-step, quiz-selection-change, quiz-input-change)
 */
const QuizFlowPage: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    quizState,
    actions: { goToStep, nextStep, prevStep, preloadTemplates, setStepValid },
  } = useQuizFlow({ mode: 'production', initialStep: 1 });

  const { currentStep, totalSteps, progress } = quizState;

  // Pré-carregar templates para transições suaves
  useEffect(() => {
    preloadTemplates?.();
  }, [preloadTemplates]);

  // Carregar blocos a cada etapa
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const stepBlocks = await TemplateManager.loadStepBlocks(`step-${currentStep}`);
        setBlocks(stepBlocks);
        // Delay curto p/ avaliar validação inicial
        setTimeout(() => {
          // Marca válida se etapa não exige seleção explícita
          const hasQuestion = stepBlocks.some(
            b => b.type === 'options-grid' || b.type === 'form-container'
          );
          setStepValid?.(currentStep, !hasQuestion);
        }, 0);
      } catch (e) {
        console.error('Erro ao carregar etapa', currentStep, e);
        setBlocks([]);
        setError(`Erro ao carregar etapa ${currentStep}`);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [currentStep, setStepValid]);

  // Expor etapa atual globalmente (usado por alguns blocos)
  useEffect(() => {
    (window as any).__quizCurrentStep = currentStep;
  }, [currentStep]);

  // Listeners globais para navegação/validação vindas dos blocos
  useEffect(() => {
    const parseStepNumber = (stepId: any): number | null => {
      if (typeof stepId === 'number') return stepId;
      if (typeof stepId !== 'string') return null;
      const digits = stepId.replace(/[^0-9]/g, '');
      const num = parseInt(digits || stepId, 10);
      return Number.isFinite(num) ? num : null;
    };

    const handleNavigate = (ev: Event) => {
      const e = ev as CustomEvent<{ stepId?: string | number; source?: string }>;
      const target = parseStepNumber(e.detail?.stepId);
      if (!target || target < 1 || target > 21) return;
      goToStep(target);
    };

    const handleSelectionChange = (ev: Event) => {
      const e = ev as CustomEvent<{ valid?: boolean }>;
      const valid = !!e.detail?.valid;
      setStepValid?.(currentStep, valid);
    };

    const handleInputChange = (ev: Event) => {
      const e = ev as CustomEvent<{ value?: string; valid?: boolean }>;
      const ok =
        typeof e.detail?.value === 'string' ? e.detail.value.trim().length > 0 : !!e.detail?.valid;
      setStepValid?.(currentStep, ok);
    };

    window.addEventListener('navigate-to-step', handleNavigate as EventListener);
    window.addEventListener('quiz-navigate-to-step', handleNavigate as EventListener);
    window.addEventListener('quiz-selection-change', handleSelectionChange as EventListener);
    window.addEventListener('quiz-input-change', handleInputChange as EventListener);
    return () => {
      window.removeEventListener('navigate-to-step', handleNavigate as EventListener);
      window.removeEventListener('quiz-navigate-to-step', handleNavigate as EventListener);
      window.removeEventListener('quiz-selection-change', handleSelectionChange as EventListener);
      window.removeEventListener('quiz-input-change', handleInputChange as EventListener);
    };
  }, [currentStep, goToStep, setStepValid]);

  const handlePropertyChange = (blockId: string, key: string, value: any) => {
    setBlocks(prev =>
      prev.map(b =>
        b.id === blockId ? { ...b, properties: { ...b.properties, [key]: value } } : b
      )
    );
  };

  return (
    <QuizRunnerShell
      currentStep={currentStep}
      totalSteps={totalSteps}
      progress={progress}
      onNext={nextStep}
      onPrev={prevStep}
      navPosition="bottom"
      canGoNext={!!quizState.stepValidation?.[currentStep]}
      canGoPrev={currentStep > 1}
    >
      {isLoading && (
        <div className="min-h-[480px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#B89B7A] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-stone-600">Carregando etapa {currentStep}...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="min-h-[480px] flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <div className="quiz-content p-8 space-y-6">
          {blocks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-stone-400 text-2xl">📝</span>
              </div>
              <h3 className="text-lg font-medium text-stone-800 mb-2">Etapa em construção</h3>
              <p className="text-stone-600">Esta etapa ainda não possui conteúdo.</p>
            </div>
          ) : (
            blocks.map(block => (
              <UniversalBlockRenderer
                key={block.id}
                block={block}
                mode="production"
                onClick={() => {}}
                onPropertyChange={(k: string, v: any) => handlePropertyChange(block.id, k, v)}
              />
            ))
          )}
        </div>
      )}
    </QuizRunnerShell>
  );
};

export default QuizFlowPage;
