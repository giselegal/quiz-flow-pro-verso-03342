import { useQuizLogic } from '@/hooks/useQuizLogic';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { useCallback, useEffect, useState } from 'react';

interface QuizFlowProps {
  mode?: 'production' | 'preview' | 'editor';
  onStepChange?: (step: number) => void;
  initialStep?: number;
}

/**
 * 🎯 ORQUESTRADOR PRINCIPAL DO QUIZ
 *
 * Controla fluxo das 21 etapas usando dados reais
 * Funciona tanto em produção quanto no editor
 */
export const useQuizFlow = ({
  mode = 'production',
  onStepChange,
  initialStep = 1,
}: QuizFlowProps) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    answers,
    answerQuestion,
    answerStrategicQuestion,
    setUserNameFromInput,
    completeQuiz,
    quizResult,
  } = useQuizLogic();

  // Navegar para próxima etapa
  const nextStep = useCallback(() => {
    if (currentStep < 21) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);
    }
  }, [currentStep, onStepChange]);

  // Voltar etapa
  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);
    }
  }, [currentStep, onStepChange]);

  // Salvar nome na etapa 1
  const saveName = useCallback(
    (name: string) => {
      setUserName(name);
      setUserNameFromInput(name);
      nextStep();
    },
    [nextStep, setUserNameFromInput]
  );

  // Responder pergunta com pontuação
  const answerScoredQuestion = useCallback(
    (questionId: string, optionId: string) => {
      answerQuestion(questionId, optionId);
      setTimeout(nextStep, 500); // UX delay
    },
    [answerQuestion, nextStep]
  );

  // Responder pergunta estratégica
  const answerStrategy = useCallback(
    (questionId: string, optionId: string) => {
      answerStrategicQuestion(questionId, optionId, 'strategic', 'tracking');
      setTimeout(nextStep, 500);
    },
    [answerStrategicQuestion, nextStep]
  );

  // Auto-avançar na etapa 19 (calculando)
  useEffect(() => {
    if (currentStep === 19) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        completeQuiz();
        setIsLoading(false);
        nextStep();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, completeQuiz, nextStep]);

  // Buscar dados da etapa atual
  const getStepData = useCallback(() => {
    const stepKey = `step-${currentStep}`;
    return QUIZ_STYLE_21_STEPS_TEMPLATE[stepKey] || [];
  }, [currentStep]);

  // Estado atual do quiz
  const quizState = {
    currentStep,
    totalSteps: 21,
    userName,
    answers,
    quizResult,
    isLoading,
    mode,
    progress: Math.round((currentStep / 21) * 100),
  };

  // Ações disponíveis
  const actions = {
    nextStep,
    prevStep,
    saveName,
    answerScoredQuestion,
    answerStrategy,
    getStepData,
  };

  return { quizState, actions };
};
