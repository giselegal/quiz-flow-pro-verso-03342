import { useEditor } from '@/context/EditorContext';
import { ValidationResult } from '@/types/validation';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { InteractiveBlockRenderer } from './InteractiveBlockRenderer';
import { QuizHeader } from './QuizHeader';
import { QuizNavigation } from './QuizNavigation';
import { QuizTheme } from './styles/QuizThemes';

interface QuizAnswer {
  questionId: string;
  selectedOptions: string[];
  timestamp: Date;
  stepId: string;
}

interface InteractiveQuizCanvasProps {
  className?: string;
  theme?: QuizTheme;
}

/**
 * 🎮 CANVAS INTERATIVO DE QUIZ
 *
 * Transforma o canvas do editor em um ambiente de quiz totalmente funcional:
 * - Responder perguntas em tempo real
 * - Validação como na produção
 * - Pontuação automática
 * - Navegação entre etapas
 * - Estado persistido
 */
export const InteractiveQuizCanvas: React.FC<InteractiveQuizCanvasProps> = memo(
  ({ className = '', theme = 'default' }) => {
    const {
      computed: { currentBlocks },
      activeStageId,
      quizState,
      isPreviewing,
    } = useEditor();

    // Estado local do quiz interativo
    const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
    const [currentValidation, setCurrentValidation] = useState<ValidationResult | null>(null);
    const [scores, setScores] = useState<Record<string, number>>({});

    // Carregar respostas do localStorage
    useEffect(() => {
      const savedAnswers = localStorage.getItem('interactive-quiz-answers');
      if (savedAnswers) {
        try {
          setQuizAnswers(JSON.parse(savedAnswers));
        } catch (error) {
          console.error('❌ Erro ao carregar respostas salvas:', error);
        }
      }
    }, []);

    // Salvar respostas no localStorage
    useEffect(() => {
      if (quizAnswers.length > 0) {
        localStorage.setItem('interactive-quiz-answers', JSON.stringify(quizAnswers));
      }
    }, [quizAnswers]);

    // Handler para resposta de pergunta
    const handleQuizAnswer = useCallback(
      (answer: {
        questionId: string;
        selectedOptions: string[];
        validation: ValidationResult;
        scoreValues?: Record<string, number>;
      }) => {
        const { questionId, selectedOptions, validation, scoreValues } = answer;

        console.log('🎯 Quiz Answer:', { questionId, selectedOptions, validation });

        // Atualizar respostas
        setQuizAnswers(prev => {
          const existing = prev.findIndex(a => a.questionId === questionId);
          const newAnswer: QuizAnswer = {
            questionId,
            selectedOptions,
            timestamp: new Date(),
            stepId: `step-${activeStageId}`,
          };

          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = newAnswer;
            return updated;
          } else {
            return [...prev, newAnswer];
          }
        });

        // Atualizar validação atual
        setCurrentValidation(validation);

        // Calcular e atualizar pontuação
        if (scoreValues) {
          calculateAndUpdateScores(selectedOptions, scoreValues);
        }

        // Atualizar estado global do quiz
        quizState.answerStrategicQuestion?.(
          questionId,
          selectedOptions.join(','),
          selectedOptions.length
        );
      },
      [activeStageId, quizState]
    );

    // Calcular pontuação
    const calculateAndUpdateScores = useCallback(
      (selectedOptions: string[], scoreValues: Record<string, number>) => {
        const newScores = { ...scores };

        selectedOptions.forEach(optionId => {
          Object.entries(scoreValues).forEach(([category, points]) => {
            const categoryKey = category.split('_')[0]; // ex: 'natural_q2' -> 'natural'
            if (optionId.includes(categoryKey)) {
              newScores[categoryKey] = (newScores[categoryKey] || 0) + points;
            }
          });
        });

        setScores(newScores);
        console.log('📊 Updated Scores:', newScores);
      },
      [scores]
    );

    // Verificar se pode avançar para próxima etapa
    const canProceedToNext = useCallback(() => {
      return currentValidation?.isValid || false;
    }, [currentValidation]);

    // Navegar para próxima etapa
    const handleNextStep = useCallback(() => {
      if (!canProceedToNext()) return;

      const currentStep = parseInt(activeStageId);
      const nextStep = Math.min(currentStep + 1, 21);

      console.log('➡️ Advancing to step:', nextStep);

      // Aqui você conectaria com o stageActions do editor
      // stageActions.setActiveStage(nextStep.toString());
    }, [activeStageId, canProceedToNext]);

    // Navegar para etapa anterior
    const handlePreviousStep = useCallback(() => {
      const currentStep = parseInt(activeStageId);
      const prevStep = Math.max(currentStep - 1, 1);

      console.log('⬅️ Going back to step:', prevStep);

      // stageActions.setActiveStage(prevStep.toString());
    }, [activeStageId]);

    // Obter respostas para uma pergunta específica
    const getAnswersForQuestion = useCallback(
      (questionId: string) => {
        const answer = quizAnswers.find(a => a.questionId === questionId);
        return answer?.selectedOptions || [];
      },
      [quizAnswers]
    );

    // Se não está em modo preview, retornar canvas normal
    if (!isPreviewing) {
      return null;
    }

    return (
      <div className={`interactive-quiz-canvas ${className}`}>
        {/* Header do Quiz */}
        <QuizHeader
          userName={quizState.userName || 'Usuário'}
          currentStep={parseInt(activeStageId)}
          totalSteps={21}
          scores={scores}
        />

        {/* Conteúdo Principal */}
        <div className="quiz-content min-h-[600px] p-6">
          {currentBlocks.map((block, index) => (
            <InteractiveBlockRenderer
              key={`${block.id}-${activeStageId}`}
              block={block}
              onAnswer={handleQuizAnswer}
              selectedAnswers={getAnswersForQuestion(block.properties?.questionId)}
              isLiveMode={isPreviewing}
              quizContext={{
                userName: quizState.userName,
                currentStep: parseInt(activeStageId),
                scores: scores,
                totalAnswers: quizAnswers.length,
              }}
            />
          ))}

          {/* Mensagem se não houver blocos */}
          {currentBlocks.length === 0 && (
            <div className="empty-state text-center py-12">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Esta etapa está vazia</h3>
              <p className="text-gray-500">
                Adicione componentes para criar uma pergunta interativa
              </p>
            </div>
          )}
        </div>

        {/* Navegação */}
        <QuizNavigation
          currentStep={parseInt(activeStageId)}
          totalSteps={21}
          canProceed={canProceedToNext()}
          onNext={handleNextStep}
          onPrevious={handlePreviousStep}
          validation={currentValidation}
        />

        {/* Debug Info (apenas em desenvolvimento) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="debug-panel fixed bottom-4 right-4 bg-white/90 p-4 rounded-lg shadow-lg max-w-sm">
            <h4 className="font-semibold mb-2">🔍 Debug Info</h4>
            <div className="text-xs space-y-1">
              <div>
                <strong>Step:</strong> {activeStageId}
              </div>
              <div>
                <strong>Blocks:</strong> {currentBlocks.length}
              </div>
              <div>
                <strong>Answers:</strong> {quizAnswers.length}
              </div>
              <div>
                <strong>Valid:</strong> {currentValidation?.isValid ? '✅' : '❌'}
              </div>
              <div>
                <strong>Scores:</strong>
              </div>
              <div className="ml-2">
                {Object.entries(scores).map(([category, score]) => (
                  <div key={category}>
                    {category}: {score}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

InteractiveQuizCanvas.displayName = 'InteractiveQuizCanvas';

export default InteractiveQuizCanvas;
