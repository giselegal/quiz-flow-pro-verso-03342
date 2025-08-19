// src/components/quiz/QuizRenderer.tsx
// Renderizador principal do quiz seguindo a nova configuração modular

import { QuizContainer } from '@/components/quiz/QuizContainer';
import { IntroBlock } from '@/components/steps/step01/IntroBlock';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QUIZ_CONFIGURATION } from '@/config/quizConfiguration';
import { ArrowLeft, ArrowRight, Circle } from 'lucide-react';
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
    const componentConfig =
      QUIZ_CONFIGURATION.components?.[componentType as keyof typeof QUIZ_CONFIGURATION.components];

    switch (componentType) {
      case 'quiz-intro-header':
        return (
          <div className="text-center p-6 space-y-4">
            <img
              src="https://res.cloudinary.com/dg3fsapzu/image/upload/v1723251877/LOGO_completa_white_clfcga.png"
              alt="Logo"
              className="mx-auto h-16 object-contain"
            />
            <div className="w-full h-1 bg-primary/20 rounded"></div>
          </div>
        );

      case 'intro':
        return (
          <IntroBlock
            block={{
              id: 'intro',
              type: 'intro',
              content: {},
              order: 0,
              properties: {
                ...componentConfig?.props,
                onDataUpdate: (data: any) => handleUpdateQuizData('intro', data),
              },
            }}
            isEditing={false}
          />
        );

      case 'questions':
      case 'strategicQuestions':
        const stepIndex = componentType === 'questions' ? 1 : 11;
        const currentStep = QUIZ_CONFIGURATION.steps[stepIndex - 1];

        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2" style={{ color: '#432818' }}>
                {currentStep?.title || 'Questão'}
              </h2>
              {currentStep?.description && (
                <p className="text-sm" style={{ color: '#6B4F43' }}>
                  {currentStep.description}
                </p>
              )}
            </div>

            {/* Progresso */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs" style={{ color: '#6B4F43' }}>
                <span>Progresso</span>
                <span>{Math.round((currentStepIndex / (componentOrder.length - 1)) * 100)}%</span>
              </div>
              <Progress
                value={(currentStepIndex / (componentOrder.length - 1)) * 100}
                className="h-2"
              />
            </div>

            {/* Opções simples */}
            <div className="grid gap-3">
              {['Opção 1', 'Opção 2', 'Opção 3'].map((option, index) => (
                <Card key={index} className="cursor-pointer border-2 hover:shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Circle className="h-4 w-4" style={{ color: '#E5DDD5' }} />
                      <span className="text-sm font-medium" style={{ color: '#432818' }}>
                        {option}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
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
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#432818' }}>
                Seu Estilo Pessoal
              </h2>

              <div className="grid gap-4 mb-6">
                <Card className="border" style={{ borderColor: '#E5DDD5' }}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-base mb-2" style={{ color: '#432818' }}>
                      Estilo Natural
                    </h3>
                    <p className="text-sm" style={{ color: '#6B4F43' }}>
                      Você prefere ambientes acolhedores e próximos à natureza.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Button
                size="lg"
                className="w-full"
                style={{ backgroundColor: '#B89B7A', color: '#FEFEFE' }}
              >
                Ver Resultado Completo
              </Button>
            </div>
          </div>
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
