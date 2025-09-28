/**
 * 🎯 CONTROLADOR CENTRAL DO FLUXO DO QUIZ
 *
 * Gerencia estado global da  const editorS  const editorState = useMemo(() => {
    try {
      return useEditor();
    } catch {
      return null; // Editor não disponível
    }
  }, []);

  // Note: quizState removed as it was unused - using useQuizNavigation directly
  const {
    navigationState,
    goToStep,
    nextStep: navNext,
    previousStep: navPrev,
  } = useQuizNavigation(currentStepNumber, totalSteps, (step: number) => {
    setCurrentStepNumber(step); => {
    try {
      return useEditor();
    } catch {
      return null; // Editor não disponível
    }
  }, []);

  // Note: quizState removed as it was unused - using useQuizNavigation directly
  const {
    navigationState,
    goToStep,
    nextStep: navNext,
    previousStep: navPrev,
  } = useQuizNavigation(currentStepNumber, totalSteps, (step: number) => {
    setCurrentStepNumber(step);dena navegação
 * e sincroniza com providers existentes.
 */

import { useEditor } from '@/components/editor/EditorProviderMigrationAdapter';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { useQuizNavigation } from '@/hooks/useQuizNavigation';
import { loadStepBlocks, getStepInfo } from '@/utils/quiz21StepsRenderer';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface CurrentStepInfoShape {
  stepId: string;
  type: string;
  isRequired: boolean;
  maxSelections: number;
}

interface QuizFlowContextType {
  // Current state
  currentStep: CurrentStepInfoShape;
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
  const totalSteps = Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).length || 21;
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

  // Note: quizState removed as it was unused - using useQuizNavigation directly
  const {
    navigationState,
    goToStep,
    nextStep: navNext,
    previousStep: navPrev,
  } = useQuizNavigation(currentStepNumber, totalSteps, (step: number) => {
    setCurrentStepNumber(step);
    onStepChange?.(step);
  });

  const currentStepId = `step-${currentStepNumber}`;
  const currentStepMeta = getStepInfo(currentStepNumber);
  const currentStep: CurrentStepInfoShape = {
    stepId: currentStepId,
    type: currentStepMeta.type,
    isRequired: !!currentStepMeta.isRequired,
    maxSelections: currentStepMeta.maxSelections ?? 0,
  };

  // Sync with quiz state
  useEffect(() => {
    // TODO: Replace updateState with specific actions from useQuizState
    // updateState({
    //   currentStep: currentStepNumber,
    //   progress: (currentStepNumber / totalSteps) * 100,
    //   isCompleted: currentStepNumber >= totalSteps,
    // });
  }, [currentStepNumber, userAnswers, currentStep, totalSteps]);

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
      const match = stepId.match(/step-(\d+)/);
      const stepNum = match ? parseInt(match[1], 10) : NaN;
      if (!stepNum) return true;
      const meta = getStepInfo(stepNum);
      if (meta.type !== 'question' && meta.type !== 'strategic') return true;
      const answers = getAnswer(stepId);
      if (meta.isRequired && answers.length === 0) return false;
      if (meta.maxSelections && answers.length > meta.maxSelections) return false;
      return true;
    },
    [getAnswer]
  );

  type TemplateOption = { id: string; text: string; imageUrl?: string } & { points?: Record<string, number> };

  const getOptionsForStep = (stepNumber: number): TemplateOption[] => {
    const blocks = QUIZ_STYLE_21_STEPS_TEMPLATE[`step-${stepNumber}`] || [];
    const optionsGrid = blocks.find(b => b.type === 'options-grid');
    // content shape varies by block type, using type assertion for options
    return (optionsGrid?.content?.options as TemplateOption[]) || [];
  };

  const calculateScores = useCallback(() => {
    const scores: Record<string, number> = {};

    Object.entries(userAnswers).forEach(([stepId, optionIds]) => {
      const match = stepId.match(/step-(\d+)/);
      const stepNum = match ? parseInt(match[1], 10) : NaN;
      if (!stepNum) return;
      const options = getOptionsForStep(stepNum);
      optionIds.forEach(optionId => {
        const option = options.find(o => (o as any).id === optionId || (o as any).value === optionId) as TemplateOption | undefined;
        const pts = option?.points;
        if (pts) {
          Object.entries(pts).forEach(([style, p]) => {
            scores[style] = (scores[style] || 0) + (p || 0);
          });
        }
      });
    });

    return scores;
  }, [userAnswers]);

  const scores = calculateScores();

  // ✨ Intelligent editor integration
  const loadStepIntoEditor = useCallback(
    (stepNumber: number) => {
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
    },
    [editorContext, syncWithEditor]
  );

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
    totalSteps,
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
