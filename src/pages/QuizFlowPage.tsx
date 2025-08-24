import React, { useEffect, useState } from 'react';
import { useQuizFlow } from '@/hooks/core/useQuizFlow';
import { TemplateManager } from '@/utils/TemplateManager';
import { Block } from '@/types/editor';
import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import { cn } from '@/lib/utils';

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
    (window as any).__quizCurrentStep = `step-${currentStep}`;
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
      const e = ev as CustomEvent<{ valid?: boolean }>; // outros campos são irrelevantes aqui
      const valid = !!e.detail?.valid;
      setStepValid?.(currentStep, valid);
    };

    const handleInputChange = (ev: Event) => {
      const e = ev as CustomEvent<{ value?: string; valid?: boolean }>;
      const ok = typeof e.detail?.value === 'string'
        ? e.detail.value.trim().length > 0
        : !!e.detail?.valid;
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

  // onPropertyChange para permitir que blocos atualizem seu próprio estado local (ex.: selectedOptions)
  const handlePropertyChange = (blockId: string, key: string, value: any) => {
    setBlocks(prev => prev.map(b => (b.id === blockId ? { ...b, properties: { ...b.properties, [key]: value } } : b)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header progresso */}
          <div className="bg-white/90 backdrop-blur-sm border border-stone-200/50 shadow-sm rounded-lg mb-8 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-stone-800">Quiz Style Challenge</h2>
                <div className="text-sm text-stone-600">Etapa {currentStep} de {totalSteps}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-48 h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-[#B89B7A] to-[#8B7355]" style={{ width: `${progress}%` }} />
                </div>
                <div className="text-sm font-medium text-stone-700">{progress}%</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={cn('px-3 py-2 rounded border text-sm', currentStep === 1 && 'opacity-50 cursor-not-allowed')}
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  ← Anterior
                </button>
                <button
                  className={cn('px-3 py-2 rounded text-sm text-white transition-all', 'bg-gradient-to-r from-[#B89B7A] to-[#8B7355]')}
                  onClick={nextStep}
                  disabled={currentStep === 21}
                >
                  {currentStep === 21 ? 'Finalizado' : 'Próxima →'}
                </button>
              </div>
            </div>
          </div>

          {/* Área dos blocos */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-stone-200/40 border border-stone-200/30 ring-1 ring-stone-100/20 overflow-hidden">
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
                  <button onClick={() => window.location.reload()} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">Tentar novamente</button>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizFlowPage;
