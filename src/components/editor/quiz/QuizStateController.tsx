/**
 * 🎯 CONTROLADOR CENTRAL DO FLUXO DO QUIZ
 *
 * Gerencia estado global das 21 etapas, coordena navegação
 * e sincroniza com providers existentes.
 */

import {
  QUIZ_21_STEPS_COMPLETE,
  QuizStepData,
} from '@/features/quiz/templates/templates/quiz21StepsComplete';
import { useQuizNavigation } from '@/hooks/useQuizNavigation';
import { useQuizState } from '@/hooks/useQuizState';
import { useEditor } from '@/context/EditorContext';
import { loadStepBlocks } from '@/utils/quiz21StepsRenderer';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface QuizFlowContextType {
  // Current state
  currentStep: QuizStepData;
  currentStepNumber: number;
  totalSteps: number;

  // Navigation
  goToStep: (stepNumber: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;

  // User answers
  userAnswers: Record<string, string[]>;
  setAnswer: (stepId: string, optionIds: string[]) => void;
  getAnswer: (stepId: string) => string[];

  // Validation
  isStepValid: (stepId: string) => boolean;

  // Score calculation
  scores: Record<string, number>;
  calculateScores: () => Record<string, number>;

  // Mode management
  mode: 'editor' | 'preview' | 'production';
  setMode: (mode: 'editor' | 'preview' | 'production') => void;

  // ✨ Editor integration
  syncWithEditor: boolean;
  setSyncWithEditor: (sync: boolean) => void;
  loadStepIntoEditor: (stepNumber: number) => void;
}

const QuizFlowContext = createContext<QuizFlowContextType | undefined>(undefined);

interface QuizFlowControllerProps {
  children: React.ReactNode;
  initialStep?: number;
  mode?: 'editor' | 'preview' | 'production';
  onStepChange?: (stepNumber: number) => void;
}

export const QuizFlowController: React.FC<QuizFlowControllerProps> = ({
  children,
  initialStep = 1,
  mode = 'editor',
  onStepChange,
}) => {
  const [currentStepNumber, setCurrentStepNumber] = useState(initialStep);
  const [currentMode, setCurrentMode] = useState(mode);
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
  const [syncWithEditor, setSyncWithEditor] = useState(mode === 'editor');

  // ✨ Editor integration - apenas se disponível
  const editorContext = React.useMemo(() => {
    try {
      return useEditor();
    } catch {
      return null; // Editor não disponível
    }
  }, []);

  const { updateState } = useQuizState();
  const {
    navigationState,
    goToStep,
    nextStep: navNext,
    previousStep: navPrev,
  } = useQuizNavigation(currentStepNumber, QUIZ_21_STEPS_COMPLETE.length, (step: number) => {
    setCurrentStepNumber(step);
    onStepChange?.(step);
  });

  const currentStep = QUIZ_21_STEPS_COMPLETE[currentStepNumber - 1];

  // Sync with quiz state
  useEffect(() => {
    updateState({
      currentStep: currentStepNumber,
      progress: (currentStepNumber / QUIZ_21_STEPS_COMPLETE.length) * 100,
      isCompleted: currentStepNumber >= QUIZ_21_STEPS_COMPLETE.length,
    });
  }, [currentStepNumber, userAnswers, currentStep, updateState]);

  const setAnswer = useCallback((stepId: string, optionIds: string[]) => {
    setUserAnswers(prev => ({
      ...prev,
      [stepId]: optionIds,
    }));
  }, []);

  const getAnswer = useCallback(
    (stepId: string) => {
      return userAnswers[stepId] || [];
    },
    [userAnswers]
  );

  const isStepValid = useCallback(
    (stepId: string) => {
      const step = QUIZ_21_STEPS_COMPLETE.find(s => s.stepId === stepId);
      if (!step || step.type !== 'question') return true;

      const answers = getAnswer(stepId);
      if (step.isRequired && answers.length === 0) return false;
      if (step.maxSelections && answers.length > step.maxSelections) return false;

      return true;
    },
    [getAnswer]
  );

  const calculateScores = useCallback(() => {
    const scores: Record<string, number> = {};

    Object.entries(userAnswers).forEach(([stepId, optionIds]) => {
      const step = QUIZ_21_STEPS_COMPLETE.find(s => s.stepId === stepId);
      if (!step?.options) return;

      optionIds.forEach(optionId => {
        const option = step.options?.find(o => o.id === optionId);
        if (option?.points) {
          Object.entries(option.points).forEach(([style, points]) => {
            scores[style] = (scores[style] || 0) + points;
          });
        }
      });
    });

    return scores;
  }, [userAnswers]);

  const scores = calculateScores();

  // ✨ Intelligent editor integration
  const loadStepIntoEditor = useCallback((stepNumber: number) => {
    if (!editorContext || !syncWithEditor) return;
    
    try {
      console.log(`🔄 QuizStateController: Carregando etapa ${stepNumber} no editor...`);
      const stepBlocks = loadStepBlocks(stepNumber);
      
      if (stepBlocks.length > 0) {
        editorContext.blockActions.replaceBlocks(stepBlocks);
        console.log(`✅ Etapa ${stepNumber} carregada: ${stepBlocks.length} blocos`);
      } else {
        console.warn(`⚠️ Nenhum bloco encontrado para etapa ${stepNumber}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao carregar etapa ${stepNumber}:`, error);
    }
  }, [editorContext, syncWithEditor]);

  // Auto-sync quando a etapa muda (se habilitado)
  useEffect(() => {
    if (syncWithEditor && mode === 'editor') {
      loadStepIntoEditor(currentStepNumber);
    }
  }, [currentStepNumber, syncWithEditor, mode, loadStepIntoEditor]);

  const nextStep = useCallback(() => {
    if (isStepValid(currentStep.stepId)) {
      navNext();
    }
  }, [isStepValid, currentStep.stepId, navNext]);

  const previousStep = useCallback(() => {
    navPrev();
  }, [navPrev]);

  const value: QuizFlowContextType = {
    currentStep,
    currentStepNumber,
    totalSteps: QUIZ_21_STEPS_COMPLETE.length,
    goToStep,
    nextStep,
    previousStep,
    canGoNext: navigationState.canGoNext && isStepValid(currentStep.stepId),
    canGoPrevious: navigationState.canGoPrevious,
    userAnswers,
    setAnswer,
    getAnswer,
    isStepValid,
    scores,
    calculateScores,
    mode: currentMode,
    setMode: setCurrentMode,
    // ✨ Editor integration
    syncWithEditor,
    setSyncWithEditor,
    loadStepIntoEditor,
  };

  return <QuizFlowContext.Provider value={value}>{children}</QuizFlowContext.Provider>;
};

export const useQuizFlow = (): QuizFlowContextType => {
  const context = useContext(QuizFlowContext);
  if (!context) {
    throw new Error('useQuizFlow must be used within QuizFlowController');
  }
  return context;
};
