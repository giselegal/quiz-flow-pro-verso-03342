// src/components/quiz/QuizRenderer.tsx
// Renderizador principal do quiz seguindo a nova configuração modular

import { QuizIntroHeaderBlock } from '@/components/editor/quiz/QuizIntroHeaderBlock';
import QuizQuestionBlock from '@/components/editor/quiz/QuizQuestionBlock';
import { QuizContainer } from '@/components/quiz/QuizContainer';
import { IntroBlock } from '@/components/steps/step01/IntroBlock';
import { Button } from '@/components/ui/button';
import { QUIZ_CONFIGURATION } from '@/config/quizConfiguration';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';

interface QuizRendererProps {
  className?: string;
  style?: React.CSSProperties;
}

export const QuizRenderer: React.FC<QuizRendererProps> = ({ className = '', style = {} }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [quizData, setQuizData] = useState<any>({});

  // Obter a ordem dos componentes da configuração
  const componentOrder = QUIZ_CONFIGURATION.order || [
    'quiz-intro-header',
    'intro',
    'questions',
    'mainTransition',
    'strategicQuestions',
    'finalTransition',
    'result',
  ];

  const currentComponent = componentOrder[currentStepIndex];

  // Função para avançar para o próximo componente
  const handleNext = () => {
    if (currentStepIndex < componentOrder.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  // Função para voltar ao componente anterior
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  // Função para atualizar dados do quiz
  const handleUpdateQuizData = (componentType: string, data: any) => {
    setQuizData(prev => ({
      ...prev,
      [componentType]: data,
    }));
  };

  // Renderizar componente baseado no tipo
  const renderComponent = (componentType: string) => {
    const componentConfig = QUIZ_CONFIGURATION.components?.[componentType];

    switch (componentType) {
      case 'quiz-intro-header':
        return (
          <QuizIntroHeaderBlock
            id="quiz-intro-header"
            properties={componentConfig?.props || {}}
            isEditing={false}
          />
        );

      case 'intro':
        return (
          <IntroBlock
            id="intro"
            properties={{
              ...componentConfig?.props,
              onDataUpdate: (data: any) => handleUpdateQuizData('intro', data),
            }}
            isEditing={false}
          />
        );

      case 'questions':
        return (
          <QuizQuestionBlock
            id="questions"
            properties={{
              stepIndex: 1, // Primeira questão
              showProgress: true,
              columns: 2,
              ...componentConfig?.props,
            }}
            isEditing={false}
            onUpdate={(id, updates) => handleUpdateQuizData('questions', updates)}
          />
        );

      case 'strategicQuestions':
        return (
          <QuizQuestionBlock
            id="strategicQuestions"
            properties={{
              stepIndex: 11, // Primeira questão estratégica
              showProgress: true,
              columns: 1,
              ...componentConfig?.props,
            }}
            isEditing={false}
            onUpdate={(id, updates) => handleUpdateQuizData('strategicQuestions', updates)}
          />
        );

      case 'mainTransition':
        return (
          <div className="text-center p-8 space-y-4">
            <h2
              className="text-2xl font-semibold"
              style={{ color: QUIZ_CONFIGURATION.design.secondaryColor }}
            >
              Analisando suas respostas...
            </h2>
            <p className="text-lg" style={{ color: QUIZ_CONFIGURATION.design.primaryColor }}>
              Agora vamos para perguntas mais específicas sobre seu estilo.
            </p>
          </div>
        );

      case 'finalTransition':
        return (
          <div className="text-center p-8 space-y-4">
            <h2
              className="text-2xl font-semibold"
              style={{ color: QUIZ_CONFIGURATION.design.secondaryColor }}
            >
              Finalizando análise...
            </h2>
            <p className="text-lg" style={{ color: QUIZ_CONFIGURATION.design.primaryColor }}>
              Preparando seu resultado personalizado.
            </p>
          </div>
        );

      case 'result':
        return (
          <QuizQuestionBlock
            id="result"
            properties={{
              stepIndex: QUIZ_CONFIGURATION.steps.length - 1, // Último step (resultado)
              showProgress: false,
              ...componentConfig?.props,
            }}
            isEditing={false}
          />
        );

      default:
        return (
          <div className="text-center p-8">
            <p style={{ color: QUIZ_CONFIGURATION.design.secondaryColor }}>
              Componente "{componentType}" não encontrado.
            </p>
          </div>
        );
    }
  };

  // Calcular progresso
  const progressPercent = (currentStepIndex / (componentOrder.length - 1)) * 100;

  return (
    <QuizContainer>
      <div
        className={`quiz-renderer ${className}`}
        style={{
          backgroundColor: QUIZ_CONFIGURATION.design.backgroundColor,
          fontFamily: QUIZ_CONFIGURATION.design.fontFamily,
          ...style,
        }}
      >
        {/* Renderizar componente atual */}
        <div className="min-h-[500px]">{renderComponent(currentComponent)}</div>

        {/* Barra de progresso */}
        {currentComponent !== 'quiz-intro-header' && (
          <div className="mt-6 space-y-2">
            <div
              className="flex justify-between text-sm"
              style={{ color: QUIZ_CONFIGURATION.design.secondaryColor }}
            >
              <span>Progresso</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div
              className="w-full rounded-full overflow-hidden"
              style={{
                height: QUIZ_CONFIGURATION.design.progressBar.height,
                backgroundColor: QUIZ_CONFIGURATION.design.progressBar.background,
              }}
            >
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: QUIZ_CONFIGURATION.design.progressBar.color,
                }}
              />
            </div>
          </div>
        )}

        {/* Controles de navegação */}
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            style={{
              borderColor: QUIZ_CONFIGURATION.design.primaryColor,
              color: QUIZ_CONFIGURATION.design.secondaryColor,
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <div className="text-sm" style={{ color: QUIZ_CONFIGURATION.design.secondaryColor }}>
            {currentStepIndex + 1} de {componentOrder.length}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentStepIndex === componentOrder.length - 1}
            style={{
              background: QUIZ_CONFIGURATION.design.button.background,
              color: QUIZ_CONFIGURATION.design.button.textColor,
              borderRadius: QUIZ_CONFIGURATION.design.button.borderRadius,
              boxShadow: QUIZ_CONFIGURATION.design.button.shadow,
            }}
          >
            Próximo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Debug info (apenas em desenvolvimento) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
            <strong>Debug:</strong> Componente atual: {currentComponent} | Índice:{' '}
            {currentStepIndex} | Dados: {JSON.stringify(quizData, null, 2)}
          </div>
        )}
      </div>
    </QuizContainer>
  );
};

export default QuizRenderer;
