/**
 * 🎯 HOOK INTEGRADO: QUIZ STEPS + TEMPLATE LOADING
 *
 * useQuizStepsWithTemplates.ts - Sistema integrado que combina:
 * - Navegação das etapas (baseado no useQuizSteps)
 * - Carregamento automático dos templates (templateService)
 * - Sincronização com o estado do editor
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Block } from '../types/editor';
import templateService from '../services/templateService';

interface QuizStepWithTemplate {
  stepNumber: number;
  isCompleted: boolean;
  isValid: boolean;
  answers: Record<string, any>;
  blocks: Block[];
  isLoading: boolean;
  timestamp?: number;
}

interface UseQuizStepsWithTemplatesConfig {
  totalSteps?: number;
  initialStep?: number;
  enableValidation?: boolean;
  autoLoadTemplates?: boolean;
  onBlocksChange?: (step: number, blocks: Block[]) => void;
}

interface UseQuizStepsWithTemplatesReturn {
  // Estado atual
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;

  // Dados das etapas com templates
  stepData: Record<number, QuizStepWithTemplate>;
  currentStepData: QuizStepWithTemplate | null;
  currentBlocks: Block[];

  // Navegação
  canGoNext: boolean;
  canGoBack: boolean;
  canJumpTo: (step: number) => boolean;

  // Ações
  goToNext: () => void;
  goToPrevious: () => void;
  jumpToStep: (step: number) => void;
  markStepCompleted: (step: number, answers?: Record<string, any>) => void;
  reloadCurrentTemplate: () => Promise<void>;
  restart: () => void;

  // Template management
  loadTemplateForStep: (step: number) => Promise<Block[]>;
  
  // Configuração para QuizStepsNavigation
  getNavigationConfig: () => any;

  // Progresso
  progress: {
    percentage: number;
    completedSteps: number;
    validSteps: number;
    remainingSteps: number;
    loadedSteps: number;
  };
}

export const useQuizStepsWithTemplates = (
  config: UseQuizStepsWithTemplatesConfig
): UseQuizStepsWithTemplatesReturn => {
  const {
    totalSteps = 21,
    initialStep = 1,
    enableValidation = true,
    autoLoadTemplates = true,
    onBlocksChange,
  } = config;

  // ========================================
  // Estados
  // ========================================
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isLoading, setIsLoading] = useState(false);
  const [stepData, setStepData] = useState<Record<number, QuizStepWithTemplate>>({});

  // ========================================
  // Dados computados
  // ========================================
  const currentStepData = useMemo(() => {
    return stepData[currentStep] || null;
  }, [stepData, currentStep]);

  const currentBlocks = useMemo(() => {
    return currentStepData?.blocks || [];
  }, [currentStepData]);

  const progress = useMemo(() => {
    const completedSteps = Object.keys(stepData).filter(
      step => stepData[parseInt(step)]?.isCompleted
    ).length;

    const validSteps = Object.keys(stepData).filter(
      step => stepData[parseInt(step)]?.isValid
    ).length;

    const loadedSteps = Object.keys(stepData).filter(
      step => stepData[parseInt(step)]?.blocks.length > 0
    ).length;

    return {
      percentage: Math.round((currentStep / totalSteps) * 100),
      completedSteps,
      validSteps,
      remainingSteps: totalSteps - currentStep,
      loadedSteps,
    };
  }, [stepData, currentStep, totalSteps]);

  // ========================================
  // Template Loading
  // ========================================
  const loadTemplateForStep = useCallback(async (step: number): Promise<Block[]> => {
    if (step < 1 || step > totalSteps) {
      console.warn(`⚠️ loadTemplateForStep(${step}): Etapa inválida`);
      return [];
    }

    try {
      console.log(`🔄 loadTemplateForStep(${step}): Carregando template...`);

      // Marcar etapa como carregando
      setStepData(prev => ({
        ...prev,
        [step]: {
          ...prev[step],
          stepNumber: step,
          isCompleted: prev[step]?.isCompleted || false,
          isValid: prev[step]?.isValid || true,
          answers: prev[step]?.answers || {},
          blocks: prev[step]?.blocks || [],
          isLoading: true,
        },
      }));

      const template = await templateService.getTemplateByStep(step);
      
      if (template && template.blocks && template.blocks.length > 0) {
        const blocks = templateService.convertTemplateBlocksToEditorBlocks(template.blocks);
        
        console.log(`✅ Template carregado para etapa ${step}: ${blocks.length} blocos`);

        // Atualizar dados da etapa
        setStepData(prev => ({
          ...prev,
          [step]: {
            ...prev[step],
            stepNumber: step,
            isCompleted: prev[step]?.isCompleted || false,
            isValid: true,
            answers: prev[step]?.answers || {},
            blocks,
            isLoading: false,
            timestamp: Date.now(),
          },
        }));

        // Notificar mudança se for a etapa atual
        if (step === currentStep && onBlocksChange) {
          onBlocksChange(step, blocks);
        }

        return blocks;
      } else {
        console.warn(`⚠️ Nenhum template encontrado para etapa ${step}`);
        
        // Marcar como não carregando, mas sem blocos
        setStepData(prev => ({
          ...prev,
          [step]: {
            ...prev[step],
            stepNumber: step,
            isCompleted: prev[step]?.isCompleted || false,
            isValid: prev[step]?.isValid || true,
            answers: prev[step]?.answers || {},
            blocks: [],
            isLoading: false,
          },
        }));

        return [];
      }
    } catch (error) {
      console.error(`❌ Erro ao carregar template da etapa ${step}:`, error);
      
      // Marcar erro
      setStepData(prev => ({
        ...prev,
        [step]: {
          ...prev[step],
          stepNumber: step,
          isCompleted: prev[step]?.isCompleted || false,
          isValid: false,
          answers: prev[step]?.answers || {},
          blocks: [],
          isLoading: false,
        },
      }));
      
      return [];
    }
  }, [totalSteps, currentStep, onBlocksChange]);

  // ========================================
  // Auto-load templates
  // ========================================
  useEffect(() => {
    if (autoLoadTemplates && !stepData[currentStep]?.blocks.length && !stepData[currentStep]?.isLoading) {
      console.log(`🚀 Auto-carregando template para etapa ${currentStep}`);
      loadTemplateForStep(currentStep);
    }
  }, [currentStep, autoLoadTemplates, stepData, loadTemplateForStep]);

  // ========================================
  // Validações de navegação
  // ========================================
  const canGoNext = useMemo(() => {
    if (currentStep >= totalSteps) return false;
    if (!enableValidation) return true;

    const current = stepData[currentStep];
    return current?.isValid !== false;
  }, [currentStep, totalSteps, stepData, enableValidation]);

  const canGoBack = useMemo(() => {
    return currentStep > 1;
  }, [currentStep]);

  const canJumpTo = useCallback(
    (step: number): boolean => {
      if (step < 1 || step > totalSteps) return false;
      if (!enableValidation) return true;

      if (step <= currentStep) return true;
      if (step === currentStep + 1) return canGoNext;

      return false;
    },
    [currentStep, totalSteps, canGoNext, enableValidation]
  );

  // ========================================
  // Ações de navegação
  // ========================================
  const goToNext = useCallback(async () => {
    if (!canGoNext) return;

    setIsLoading(true);

    try {
      const nextStep = Math.min(currentStep + 1, totalSteps);
      console.log(`🧭 Navegando: ${currentStep} → ${nextStep}`);
      
      setCurrentStep(nextStep);

      // Auto-carregar template da próxima etapa se não estiver carregado
      if (autoLoadTemplates && !stepData[nextStep]?.blocks.length) {
        await loadTemplateForStep(nextStep);
      }
    } finally {
      setIsLoading(false);
    }
  }, [canGoNext, currentStep, totalSteps, autoLoadTemplates, stepData, loadTemplateForStep]);

  const goToPrevious = useCallback(async () => {
    if (!canGoBack) return;

    setIsLoading(true);

    try {
      const prevStep = Math.max(currentStep - 1, 1);
      console.log(`🧭 Navegando: ${currentStep} → ${prevStep}`);
      
      setCurrentStep(prevStep);

      // Auto-carregar template da etapa anterior se não estiver carregado
      if (autoLoadTemplates && !stepData[prevStep]?.blocks.length) {
        await loadTemplateForStep(prevStep);
      }
    } finally {
      setIsLoading(false);
    }
  }, [canGoBack, currentStep, autoLoadTemplates, stepData, loadTemplateForStep]);

  const jumpToStep = useCallback(
    async (step: number) => {
      if (!canJumpTo(step)) return;

      setIsLoading(true);

      try {
        console.log(`🧭 Saltando: ${currentStep} → ${step}`);
        setCurrentStep(step);

        // Auto-carregar template da etapa destino se não estiver carregado
        if (autoLoadTemplates && !stepData[step]?.blocks.length) {
          await loadTemplateForStep(step);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [canJumpTo, currentStep, autoLoadTemplates, stepData, loadTemplateForStep]
  );

  const markStepCompleted = useCallback((step: number, answers?: Record<string, any>) => {
    setStepData(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        stepNumber: step,
        isCompleted: true,
        isValid: true,
        answers: answers || prev[step]?.answers || {},
        blocks: prev[step]?.blocks || [],
        isLoading: false,
        timestamp: Date.now(),
      },
    }));
  }, []);

  const reloadCurrentTemplate = useCallback(async (): Promise<void> => {
    console.log(`🔄 Recarregando template da etapa ${currentStep}`);
    await loadTemplateForStep(currentStep);
  }, [currentStep, loadTemplateForStep]);

  const restart = useCallback(() => {
    console.log('🔄 Reiniciando quiz');
    setCurrentStep(1);
    setStepData({});
    setIsLoading(false);
  }, []);

  // ========================================
  // Configuração para QuizStepsNavigation
  // ========================================
  const getNavigationConfig = useCallback(() => {
    const stepValidation = Object.keys(stepData).reduce(
      (acc, step) => {
        acc[parseInt(step)] = stepData[parseInt(step)]?.isValid || false;
        return acc;
      },
      {} as Record<number, boolean>
    );

    return {
      mode: 'editor' as const,
      quizState: {
        currentStep,
        totalSteps,
        sessionData: {},
        stepValidation,
      },
      navigation: {
        onNext: goToNext,
        onPrevious: goToPrevious,
        onStepJump: jumpToStep,
        canGoNext: canGoNext && !isLoading,
        canGoBack: canGoBack && !isLoading,
      },
      theme: {
        primaryColor: '#B89B7A',
        backgroundColor: '#FEFEFE',
        textColor: '#432818',
      },
    };
  }, [
    currentStep,
    totalSteps,
    stepData,
    goToNext,
    goToPrevious,
    jumpToStep,
    canGoNext,
    canGoBack,
    isLoading,
  ]);

  return {
    // Estado atual
    currentStep,
    totalSteps,
    isLoading,

    // Dados das etapas com templates
    stepData,
    currentStepData,
    currentBlocks,

    // Navegação
    canGoNext,
    canGoBack,
    canJumpTo,

    // Ações
    goToNext,
    goToPrevious,
    jumpToStep,
    markStepCompleted,
    reloadCurrentTemplate,
    restart,

    // Template management
    loadTemplateForStep,

    // Configuração
    getNavigationConfig,

    // Progresso
    progress,
  };
};

export default useQuizStepsWithTemplates;
