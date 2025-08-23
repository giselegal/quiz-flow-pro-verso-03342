import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import { useQuizFlow } from '@/hooks/core/useQuizFlow';
import { Block } from '@/types/editor';
import React, { useEffect, useLayoutEffect, useRef } from 'react';

interface StepData {
  blocks: Block[];
  stepNumber: number;
  stepType: 'form' | 'question' | 'transition' | 'result' | 'offer';
}

interface QuizRendererProps {
  mode?: 'production' | 'preview' | 'editor';
  onStepChange?: (step: number) => void;
  initialStep?: number;
  className?: string;
  // Overrides para uso no editor: renderizar blocos reais do EditorProvider e sincronizar etapa
  blocksOverride?: Block[];
  currentStepOverride?: number;
  // Callback opcional: reporta layout real dos blocos (posições e tamanhos) relativos ao container de conteúdo
  onBlocksLayout?: (
    layouts: Array<{
      id: string;
      top: number;
      left: number;
      width: number;
      height: number;
    }>,
    meta: { contentTopViewport: number; contentLeftViewport: number }
  ) => void;
}

/**
 * 🎨 RENDERIZADOR UNIVERSAL DO QUIZ
 *
 * Renderiza etapas usando dados reais do template
 * Funciona idêntico em produção e preview
 */
export const QuizRenderer: React.FC<QuizRendererProps> = ({
  mode = 'production',
  onStepChange,
  initialStep = 1,
  className = '',
  blocksOverride,
  currentStepOverride,
  onBlocksLayout,
}) => {
  const { quizState, actions } = useQuizFlow({
    mode,
    onStepChange,
    initialStep,
  });

  const { currentStep, totalSteps, userName, progress, isLoading } = quizState;
  const { prevStep, getStepData } = actions; // nextStep removido pois não é usado

  // Buscar dados da etapa atual
  const stepBlocks =
    mode === 'editor' && Array.isArray(blocksOverride) ? blocksOverride : getStepData();

  // Determinar tipo da etapa
  const getStepType = (step: number): StepData['stepType'] => {
    if (step === 1) return 'form';
    if (step >= 2 && step <= 11) return 'question';
    if (step === 12 || step === 19) return 'transition';
    if (step >= 13 && step <= 18) return 'question';
    if (step === 20) return 'result';
    if (step === 21) return 'offer';
    return 'question';
  };

  const stepData: StepData = {
    blocks: stepBlocks,
    stepNumber: currentStepOverride ?? currentStep,
    stepType: getStepType(currentStep),
  };

  // Renderizar header com progresso
  const renderHeader = () => (
    <div className="quiz-header mb-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600">
          Etapa {currentStepOverride ?? currentStep} de {totalSteps}
        </span>
        {mode !== 'preview' && (
          <div className="flex gap-2">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              ← Voltar
            </button>
          </div>
        )}
      </div>

      {/* Barra de progresso */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );

  // Infra de medição de layout para editor: coleta refs dos blocos e reporta posições/tamanhos reais
  const contentRef = useRef<HTMLDivElement | null>(null);
  const blockRefs = useRef<Record<string, HTMLElement | null>>({});

  const setBlockRef = (id: string) => (el: HTMLElement | null) => {
    blockRefs.current[id] = el;
  };

  const measureAndReport = () => {
    if (!onBlocksLayout) return;
    const container = contentRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const layouts = (stepBlocks || []).map((block: any, index: number) => {
      const id = block.id || `block-${index}`;
      const el = blockRefs.current[id];
      const rect = el?.getBoundingClientRect();
      return {
        id,
        top: rect ? rect.top - containerRect.top : 0,
        left: rect ? rect.left - containerRect.left : 0,
        width: rect?.width || 0,
        height: rect?.height || 0,
      };
    });
    onBlocksLayout(layouts, {
      contentTopViewport: containerRect.top,
      contentLeftViewport: containerRect.left,
    });
  };

  useLayoutEffect(() => {
    // mede após render
    measureAndReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepBlocks, mode, currentStepOverride]);

  useEffect(() => {
    if (!onBlocksLayout) return;
    const container = contentRef.current;
    if (!container) return;
    // Observa mudanças de tamanho para re-medida
    const ro = new ResizeObserver(() => {
      measureAndReport();
    });
    ro.observe(container);
    // Window resize
    const onResize = () => measureAndReport();
    window.addEventListener('resize', onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onBlocksLayout]);

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

    // Renderizar blocos da etapa usando UniversalBlockRenderer
    return (
      <div ref={contentRef} className="step-content space-y-6">
        {stepBlocks.map((block: any, index: number) => {
          const id = block.id || `block-${index}`;
          return (
            <div
              key={id}
              ref={setBlockRef(id)}
              data-block-id={id}
              className="block-container"
            >
              <UniversalBlockRenderer
                block={block}
                isSelected={false}
                onClick={() => {
                  console.log(`Quiz block clicked: ${block.type}`, block);
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`quiz-renderer ${className}`}>
      <div className="max-w-4xl mx-auto p-6">
        {renderHeader()}
        {renderStepContent()}

        {/* Debug info em modo preview */}
        {mode === 'preview' && (
          <div className="mt-8 p-4 bg-gray-100 rounded text-sm">
            <strong>Debug:</strong> Step {currentStep} | Type: {stepData.stepType} | Blocks:{' '}
            {stepBlocks.length} | User: {userName || 'None'}
          </div>
        )}
      </div>
    </div>
  );
};
