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
        return (
          <Wrapper key={block.id}>
            <p className="text-lg">{block.content?.text || ''}</p>
          </Wrapper>
        );

      case 'image':
        return (
          <Wrapper key={block.id}>
            <img
              src={block.content?.url}
              alt={block.content?.alt || ''}
              className="w-full h-auto rounded-lg"
            />
          </Wrapper>
        );

      case 'button':
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
        return (
          <Wrapper key={block.id}>
            <div className="space-y-2">
              {block.content?.options?.map((option: any) => (
                <button
                  key={option.id}
                  onClick={() => {
                    handleAnswer(block.id, option.id);
                    handleNext();
                  }}
                  className="w-full p-4 text-left border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  {option.text}
                </button>
              ))}
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
