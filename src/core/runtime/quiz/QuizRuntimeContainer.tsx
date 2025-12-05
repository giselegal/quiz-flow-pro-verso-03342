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
   * Renderizar bloco - Suporte completo para v4 template (32+ tipos)
   */
  const renderBlock = (block: any) => {
    const wrapperClass = block.isSelected
      ? 'mb-4 ring-2 ring-blue-500 rounded-md cursor-pointer'
      : 'mb-4 cursor-pointer';
    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <div className={wrapperClass} onClickCapture={() => onBlockClick?.(block.id)}>{children}</div>
    );

    const content = block.content || {};
    const properties = block.properties || {};

    switch (block.type) {
      // =====================================================
      // INTRO BLOCKS (Step 1)
      // =====================================================
      case 'intro-logo-header':
        return (
          <Wrapper key={block.id}>
            <div className="text-center py-6">
              {content.logoUrl && (
                <img src={content.logoUrl} alt={content.title || 'Logo'} className="h-16 mx-auto mb-4" />
              )}
              <h1 className="text-3xl font-bold text-foreground">{content.title || 'Quiz de Estilo'}</h1>
              {content.subtitle && <p className="text-lg text-muted-foreground mt-2">{content.subtitle}</p>}
            </div>
          </Wrapper>
        );

      case 'intro-description':
        return (
          <Wrapper key={block.id}>
            <p className="text-center text-muted-foreground text-lg leading-relaxed">
              {content.text || content.description || ''}
            </p>
          </Wrapper>
        );

      case 'intro-button':
        return (
          <Wrapper key={block.id}>
            <div className="text-center">
              <button
                onClick={handleNext}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
              >
                {content.text || 'Começar Quiz'}
              </button>
            </div>
          </Wrapper>
        );

      // =====================================================
      // QUESTION BLOCKS (Steps 2-18)
      // =====================================================
      case 'question-progress':
        return (
          <Wrapper key={block.id}>
            <div className="mb-2 text-sm text-muted-foreground flex justify-between">
              <span>Etapa {currentStepIndex + 1} de {quizContent.steps.length}</span>
              <span>{Math.round(((currentStepIndex + 1) / quizContent.steps.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / quizContent.steps.length) * 100}%` }}
              />
            </div>
          </Wrapper>
        );

      case 'question-title':
        return (
          <Wrapper key={block.id}>
            <h2 className="text-2xl font-bold text-center text-foreground">
              {content.text || content.title || ''}
            </h2>
          </Wrapper>
        );

      case 'quiz-options':
      case 'options-grid':
        {
          const cfg = content || {};
          const multipleSelection = cfg?.multipleSelection !== false;
          const minSelections = Number(cfg?.minSelections ?? cfg?.requiredSelections ?? 1);
          const maxSelections = Number(cfg?.maxSelections ?? (content?.options?.length || 1));
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
              [currentStep.id]: { ...prev[currentStep.id], [block.id]: next },
            }));
            if (autoAdvance && next.length >= minSelections) {
              setTimeout(() => handleNext(), autoAdvanceDelay);
            }
          };

          const cols = (() => {
            const c = (properties?.gridColumns ?? content?.columns ?? 2) as number;
            if (c >= 4) return 4;
            if (c === 3) return 3;
            if (c === 1) return 1;
            return 2;
          })();
          const colsClass = cols === 4 ? 'grid-cols-4' : cols === 3 ? 'grid-cols-3' : cols === 1 ? 'grid-cols-1' : 'grid-cols-2';

          return (
            <Wrapper key={block.id}>
              {(!content?.options || content?.options?.length === 0) && (
                <div className="text-xs text-muted-foreground text-center py-4">Sem opções configuradas</div>
              )}
              <div className={`w-full max-w-lg mx-auto grid ${colsClass} gap-3`}>
                {content?.options?.map((option: any) => {
                  const isSelected = current.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      onClick={() => toggleSelect(option.id)}
                      className={`border-2 rounded-xl p-3 text-sm transition-all hover:border-primary ${
                        isSelected ? 'border-primary bg-primary/10' : 'border-border'
                      }`}
                    >
                      {option.imageUrl && (
                        <img src={option.imageUrl} alt={option.text || ''} className="w-full h-24 object-cover rounded-lg mb-2" />
                      )}
                      <span className="block font-medium">{option.text}</span>
                    </button>
                  );
                })}
              </div>
            </Wrapper>
          );
        }

      // =====================================================
      // TRANSITION BLOCKS (Step 19)
      // =====================================================
      case 'transition-title':
        return (
          <Wrapper key={block.id}>
            <h2 className="text-3xl font-bold text-center text-foreground animate-fade-in">
              {content.text || content.title || 'Analisando suas respostas...'}
            </h2>
          </Wrapper>
        );

      case 'transition-text':
        return (
          <Wrapper key={block.id}>
            <p className="text-center text-muted-foreground text-lg">
              {content.text || content.description || ''}
            </p>
          </Wrapper>
        );

      case 'urgency-timer':
        return (
          <Wrapper key={block.id}>
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-destructive/10 text-destructive rounded-full font-semibold">
                <span className="animate-pulse">⏰</span>
                <span>{content.text || 'Oferta expira em breve!'}</span>
              </div>
            </div>
          </Wrapper>
        );

      // =====================================================
      // RESULT BLOCKS (Step 20)
      // =====================================================
      case 'result-header':
        return (
          <Wrapper key={block.id}>
            <div className="text-center py-4">
              <h1 className="text-3xl font-bold text-foreground">
                {content.text || content.title || 'Seu Resultado'}
              </h1>
            </div>
          </Wrapper>
        );

      case 'result-description':
        return (
          <Wrapper key={block.id}>
            <p className="text-center text-muted-foreground text-lg leading-relaxed">
              {content.text || content.description || ''}
            </p>
          </Wrapper>
        );

      case 'result-image':
        return (
          <Wrapper key={block.id}>
            <div className="flex justify-center py-4">
              <img
                src={content.url || content.src || content.imageUrl || '/placeholder.svg'}
                alt={content.alt || 'Resultado'}
                className="max-w-md w-full rounded-xl shadow-lg"
              />
            </div>
          </Wrapper>
        );

      case 'result-share':
        return (
          <Wrapper key={block.id}>
            <div className="flex justify-center gap-3 py-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                📘 Facebook
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                📲 WhatsApp
              </button>
              <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
                📸 Instagram
              </button>
            </div>
          </Wrapper>
        );

      case 'result-display':
        return (
          <Wrapper key={block.id}>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="text-6xl mb-4">{content.icon || '🎯'}</div>
              <h3 className="text-2xl font-bold text-foreground mb-2">{content.title || 'Seu Perfil'}</h3>
              <p className="text-muted-foreground">{content.description || ''}</p>
            </div>
          </Wrapper>
        );

      // =====================================================
      // OFFER BLOCKS (Step 21)
      // =====================================================
      case 'offer-hero':
        return (
          <Wrapper key={block.id}>
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {content.title || 'Oferta Especial'}
              </h2>
              <p className="text-xl text-muted-foreground">{content.subtitle || ''}</p>
              {content.price && (
                <div className="mt-4">
                  <span className="text-4xl font-bold text-primary">{content.price}</span>
                </div>
              )}
            </div>
          </Wrapper>
        );

      case 'benefits-list':
        return (
          <Wrapper key={block.id}>
            <ul className="space-y-3 py-4">
              {(content.items || content.benefits || []).map((item: any, idx: number) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-foreground">{typeof item === 'string' ? item : item.text}</span>
                </li>
              ))}
            </ul>
          </Wrapper>
        );

      case 'cta-button':
        return (
          <Wrapper key={block.id}>
            <div className="text-center py-4">
              <button
                onClick={handleNext}
                className="px-10 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {content.text || 'Quero Aproveitar!'}
              </button>
            </div>
          </Wrapper>
        );

      case 'guarantee':
        return (
          <Wrapper key={block.id}>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
              <span className="text-2xl mb-2 block">🛡️</span>
              <p className="text-green-700 dark:text-green-300 font-medium">
                {content.text || 'Garantia de 7 dias ou seu dinheiro de volta'}
              </p>
            </div>
          </Wrapper>
        );

      // =====================================================
      // LEGACY/GENERIC BLOCKS
      // =====================================================
      case 'text':
      case 'headline':
      case 'quiz-question-header':
        return (
          <Wrapper key={block.id}>
            <p className="text-lg text-foreground">{content?.text || ''}</p>
          </Wrapper>
        );

      case 'image':
      case 'image-display-inline':
      case 'quiz-logo':
        return (
          <Wrapper key={block.id}>
            <img
              src={content?.url || content?.src || '/placeholder.svg'}
              alt={content?.alt || ''}
              className="w-full h-auto rounded-lg"
            />
          </Wrapper>
        );

      case 'button':
      case 'quiz-back-button':
        return (
          <Wrapper key={block.id}>
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              {content?.text || 'Continuar'}
            </button>
          </Wrapper>
        );

      case 'quiz-progress-bar':
      case 'progress-header':
        return (
          <Wrapper key={block.id}>
            <div className="mb-2 text-sm text-muted-foreground flex justify-between">
              <span>Etapa {content?.currentStep ?? currentStepIndex + 1} de {content?.totalSteps ?? quizContent.steps.length}</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((content?.currentStep ?? currentStepIndex + 1) / (content?.totalSteps ?? quizContent.steps.length)) * 100}%` }}
              />
            </div>
          </Wrapper>
        );

      default:
        return (
          <Wrapper key={block.id}>
            <div className="p-4 border border-dashed border-border rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground text-center">
                Bloco: <code className="bg-muted px-1 rounded">{block.type}</code>
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
