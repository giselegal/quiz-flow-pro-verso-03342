/**
 * 🎯 FASE 1: QUIZ RUNTIME CONTAINER
 * 
 * Container 100% isolado para executar quiz
 * NUNCA importa código do editor
 */

import { useState, useEffect, useCallback } from 'react';

export interface QuizRuntimeContainerProps {
  quizContent: {
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
}

/**
 * Runtime isolado - apenas renderiza JSON
 */
export const QuizRuntimeContainer: React.FC<QuizRuntimeContainerProps> = ({
  quizContent,
  initialStepId,
  onStepChange,
  onComplete,
}) => {
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
    switch (block.type) {
      case 'text':
      case 'headline':
        return (
          <div key={block.id} className="mb-4">
            <p className="text-lg">{block.content?.text || ''}</p>
          </div>
        );

      case 'image':
        return (
          <div key={block.id} className="mb-4">
            <img
              src={block.content?.url}
              alt={block.content?.alt || ''}
              className="w-full h-auto rounded-lg"
            />
          </div>
        );

      case 'button':
        return (
          <button
            key={block.id}
            onClick={handleNext}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {block.content?.text || 'Continuar'}
          </button>
        );

      case 'quiz-options':
        return (
          <div key={block.id} className="mb-6 space-y-2">
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
        );

      default:
        return (
          <div key={block.id} className="mb-4 p-4 border border-dashed border-border rounded-lg">
            <p className="text-sm text-muted-foreground">
              Bloco não suportado: {block.type}
            </p>
          </div>
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
