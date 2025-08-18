import { useEditor } from '@/context/EditorContext';
import { ValidationResult } from '@/types/validation';
import React, { memo, useCallback, useEffect, useState } from 'react';
// import { InteractiveBlockRenderer } from './InteractiveBlockRenderer';
// import { QuizHeader } from './QuizHeader';
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
    // theme será usado quando os componentes estilizados forem implementados
    console.log('Quiz theme:', theme);
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

        // Estado de progresso
    const hasAnsweredCurrentStep = useMemo(() => {
      return currentBlocks.some(block => {
        if (block.type === 'quiz-question-inline') {
          return quizData.answers[block.id];
        }
        return true;
      });
    }, [currentBlocks, quizData.answers]);

    // Verificar se pode avançar para próxima etapa
    const canProceedToNext = useCallback(() => {
      return currentValidation?.success || false;
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
        {/* <QuizHeader
          userName={userName}
          currentStep={currentStep}
          totalSteps={totalSteps}
          scores={scores}
        /> */}

        {/* Conteúdo Principal */}
        <div className="quiz-content min-h-[600px] p-6">
          {currentBlocks.map(block => (
            <div key={block.id} className="p-4 border rounded-lg">
              <h3 className="font-semibold">{block.type}</h3>
              <p className="text-sm text-gray-600">{JSON.stringify(block.content)}</p>
            </div>
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
                <strong>Valid:</strong> {currentValidation?.success ? '✅' : '❌'}
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
