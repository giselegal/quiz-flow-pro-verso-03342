/**
 * 🎯 FASE 1: QUIZ RUNTIME CONTAINER
 * 
 * Container 100% isolado para executar quiz
 * NUNCA importa código do editor
 * 
 * 🚀 FASE 3: Atualizado com suporte a lazy loading
 * Usa LazyQuizRuntimeContainer quando lazy loading está habilitado
 */

import { useState, useEffect, useCallback } from 'react';
import { LazyQuizRuntimeContainer } from './LazyQuizRuntimeContainer';

export interface QuizRuntimeContainerProps {
  quizContent?: {
    steps: Array<{
      id: string;
      type: string;
      order: number;
      blocks: any[];
    }>;
    metadata: Record<string, any>;
  };
  initialStepId?: string;
  onStepChange?: (stepId: string) => void;
  onComplete?: (results: any) => void;
  onBlockClick?: (blockId: string) => void;
  
  // 🚀 FASE 3: Lazy loading options
  enableLazyLoad?: boolean;
  funnelId?: string;
  totalSteps?: number;
  lazyLoadConfig?: {
    prefetchRadius?: number;
    maxCachedSteps?: number;
    prefetchDelay?: number;
  };
}

/**
 * Runtime isolado - apenas renderiza JSON
 * 🚀 FASE 3: Roteamento automático para lazy loading
 */
export const QuizRuntimeContainer: React.FC<QuizRuntimeContainerProps> = (props) => {
  const {
    quizContent,
    initialStepId,
    onStepChange,
    onComplete,
    enableLazyLoad = true,
    funnelId,
    totalSteps,
    lazyLoadConfig,
  } = props;
  
  // 🚀 FASE 3: Se lazy loading habilitado e sem quizContent pré-carregado, usar LazyQuizRuntimeContainer
  if (enableLazyLoad && !quizContent) {
    return (
      <LazyQuizRuntimeContainer
        funnelId={funnelId}
        initialStepId={initialStepId}
        totalSteps={totalSteps}
        onStepChange={onStepChange}
        onComplete={onComplete}
        enableLazyLoad={enableLazyLoad}
        lazyLoadConfig={lazyLoadConfig}
      />
    );
  }
  
  // Fallback: Renderização tradicional com quizContent completo
  return <TraditionalQuizRuntimeContainer {...props} />;
};

/**
 * Container tradicional (sem lazy loading)
 */
const TraditionalQuizRuntimeContainer: React.FC<QuizRuntimeContainerProps> = ({
  quizContent,
  initialStepId,
  onStepChange,
  onComplete,
  onBlockClick,
}) => {
  if (!quizContent) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Nenhum conteúdo disponível</p>
      </div>
    );
  }
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    if (!initialStepId) return 0;
    const index = quizContent.steps.findIndex(s => s.id === initialStepId);
    return index >= 0 ? index : 0;
  });

  const [answers, setAnswers] = useState<Record<string, any>>({});

  const currentStep = quizContent.steps[currentStepIndex];

  /**
   * Navegar para próximo step
   */
  const handleNext = useCallback(() => {
    if (currentStepIndex < quizContent.steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      onStepChange?.(quizContent.steps[nextIndex].id);
    } else {
      // Quiz completo
      onComplete?.(answers);
    }
  }, [currentStepIndex, quizContent.steps, answers, onStepChange, onComplete]);

  /**
   * Registrar resposta
   */
  const handleAnswer = useCallback((blockId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentStep.id]: {
        ...prev[currentStep.id],
        [blockId]: value,
      },
    }));
  }, [currentStep]);

  /**
   * Renderizar bloco
   */
  const renderBlock = (block: any) => {
    // Renderização simples baseada no tipo
    const wrapperClass = block.isSelected
      ? 'mb-4 ring-2 ring-blue-500 rounded-md cursor-pointer'
      : 'mb-4 cursor-pointer';
    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <div className={wrapperClass} onClickCapture={() => onBlockClick?.(block.id)}>{children}</div>
    );
    switch (block.type) {
      case 'text':
      case 'headline':
      case 'quiz-question-header':
        return (
          <Wrapper key={block.id}>
            <p className="text-lg">{block.content?.text || ''}</p>
          </Wrapper>
        );

      case 'image':
      case 'image-display-inline':
      case 'quiz-logo':
        {
          const base = (typeof import.meta !== 'undefined' && (import.meta as any).env?.BASE_URL) || '/';
          const stepId = quizContent.steps[currentStepIndex]?.id || 'step-01';
          const preferred = (block as any)?.content?.url || (block as any)?.content?.src;
          const seq = ['webp', 'jpg', 'png'];
          const initial = preferred || `${base}images/quiz21-steps/${String(stepId).toLowerCase()}.${seq[0]}`;
          return (
            <Wrapper key={block.id}>
              <img
                src={initial}
                alt={block.content?.alt || ''}
                data-i="0"
                className="w-full h-auto rounded-lg"
                onError={(e) => {
                  try {
                    const d = e.currentTarget.dataset;
                    const i = Number(d.i || '0');
                    if (i < seq.length - 1) {
                      const next = i + 1;
                      d.i = String(next);
                      e.currentTarget.src = `${base}images/quiz21-steps/${String(stepId).toLowerCase()}.${seq[next]}`;
                    }
                  } catch {}
                }}
              />
            </Wrapper>
          );
        }

      case 'button':
      case 'quiz-back-button':
        return (
          <Wrapper key={block.id}>
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              {block.content?.text || 'Continuar'}
            </button>
          </Wrapper>
        );

      case 'quiz-options':
      case 'options-grid':
        {
          const cfg = block?.content || {};
          const multipleSelection = cfg?.multipleSelection !== false;
          const minSelections = Number(cfg?.minSelections ?? cfg?.requiredSelections ?? 1);
          const maxSelections = Number(cfg?.maxSelections ?? (block.content?.options?.length || 1));
          const autoAdvance = cfg?.autoAdvance === true;
          const autoAdvanceDelay = Number(cfg?.autoAdvanceDelay ?? 800);

          const current = (answers[currentStep.id]?.[block.id] ?? []) as string[];
          const toggleSelect = (optId: string) => {
            let next: string[] = [];
            if (!multipleSelection) {
              next = [optId];
            } else {
              const exists = current.includes(optId);
              if (exists) {
                next = current.filter(id => id !== optId);
              } else {
                next = current.length < maxSelections ? [...current, optId] : current;
              }
            }
            setAnswers(prev => ({
              ...prev,
              [currentStep.id]: {
                ...prev[currentStep.id],
                [block.id]: next,
              },
            }));
            const canProceed = next.length >= minSelections;
            if (autoAdvance && canProceed) {
              setTimeout(() => handleNext(), autoAdvanceDelay);
            }
          };
          const cols = (() => {
            const c = (block.properties?.gridColumns ?? block.content?.columns ?? 2) as number;
            if (c >= 4) return 4;
            if (c === 3) return 3;
            if (c === 1) return 1;
            return 2;
          })();
          const colsClass = cols === 4 ? 'grid-cols-4' : cols === 3 ? 'grid-cols-3' : cols === 1 ? 'grid-cols-1' : 'grid-cols-2';
          return (
          <Wrapper key={block.id}>
            {(!block.content?.options || block.content?.options?.length === 0) && (
              <div className="text-xs text-gray-400 text-center py-4">Sem opções configuradas</div>
            )}
            <div className={`w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mx-auto grid ${colsClass} gap-2`}>
              {block.content?.options?.map((option: any) => {
                const base = (typeof import.meta !== 'undefined' && (import.meta as any).env?.BASE_URL) || '/';
                const stepId = quizContent.steps[currentStepIndex]?.id || 'step-01';
                const seq = ['webp', 'jpg', 'png'];
                const initial = option?.imageUrl || option?.url || option?.src || `${base}images/quiz21-steps/${String(stepId).toLowerCase()}-${String(option.id || '').toLowerCase()}.${seq[0]}`;
                return (
                  <button
                    key={option.id}
                    onClick={() => toggleSelect(option.id)}
                    className="border rounded-md p-2 text-sm transition hover:bg-accent"
                  >
                    {initial && (
                      <img
                        src={initial}
                        alt={option?.alt || ''}
                        data-i="0"
                        className="w-full h-24 object-cover rounded mb-1"
                        onError={(e) => {
                          try {
                            const d = e.currentTarget.dataset;
                            const i = Number(d.i || '0');
                            if (i < seq.length - 1) {
                              const next = i + 1;
                              d.i = String(next);
                              e.currentTarget.src = `${base}images/quiz21-steps/${String(stepId).toLowerCase()}-${String(option.id || '').toLowerCase()}.${seq[next]}`;
                            } else {
                              e.currentTarget.style.display = 'none';
                            }
                          } catch {}
                        }}
                      />
                    )}
                    <span className="block mt-1">{option.text}</span>
                  </button>
                );
              })}
            </div>
          </Wrapper>
          );
        }

      case 'quiz-progress-bar':
      case 'progress-header':
        return (
          <Wrapper key={block.id}>
            <div className="mb-2 text-sm text-muted-foreground flex justify-between">
              <span>
                Etapa {block.content?.currentStep ?? currentStepIndex + 1} de {block.content?.totalSteps ?? quizContent.steps.length}
              </span>
              {block.content?.showPercentage && (
                <span>
                  {Math.round(((block.content?.currentStep ?? currentStepIndex + 1) / (block.content?.totalSteps ?? quizContent.steps.length)) * 100)}%
                </span>
              )}
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: block.content?.backgroundColor || '#E5E7EB' }}>
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${(((block.content?.currentStep ?? currentStepIndex + 1) / (block.content?.totalSteps ?? quizContent.steps.length)) * 100)}%`,
                  backgroundColor: block.content?.barColor || 'var(--primary)',
                }}
              />
            </div>
          </Wrapper>
        );

      default:
        return (
          <Wrapper key={block.id}>
            <div className="p-4 border border-dashed border-border rounded-lg">
              <p className="text-sm text-muted-foreground">
                Bloco não suportado: {block.type}
              </p>
            </div>
          </Wrapper>
        );
    }
  };

  if (!currentStep) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Nenhum step disponível</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Etapa {currentStepIndex + 1} de {quizContent.steps.length}</span>
          <span>{Math.round(((currentStepIndex + 1) / quizContent.steps.length) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${((currentStepIndex + 1) / quizContent.steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Step title */}
      {currentStep.type && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            {currentStep.type === 'question' ? 'Pergunta' : 'Etapa'}
          </h2>
        </div>
      )}

      {/* Render blocks */}
      <div className="space-y-4">
        {currentStep.blocks?.map(renderBlock)}
      </div>
    </div>
  );
};

// Export ambos para compatibilidade
export { LazyQuizRuntimeContainer } from './LazyQuizRuntimeContainer';
