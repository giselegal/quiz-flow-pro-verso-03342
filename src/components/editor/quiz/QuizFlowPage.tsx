/**
 * 🎯 COMPONENTE PRINCIPAL DE FLUXO DO QUIZ
 *
 * QuizFlowPage.tsx - Página principal que gerencia o fluxo completo das 21 etapas
 * Com preview e edição ao vivo idêntico ao modelo de produção
 */

import { cn } from '@/lib/utils';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { Block } from '@/types/editor';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { QuizDataManager } from './QuizDataManager';
import { QuizNavigationBlock } from './QuizNavigationBlock';
import { QuizScoreCalculator } from './QuizScoreCalculator';
import { QuizStepRenderer } from './QuizStepRenderer';
import { QuizValidationSystem } from './QuizValidationSystem';

interface QuizFlowPageProps {
  /** Modo de visualização: 'editor' | 'preview' | 'production' */
  mode?: 'editor' | 'preview' | 'production';
  /** Template de dados das 21 etapas */
  template?: typeof QUIZ_STYLE_21_STEPS_TEMPLATE;
  /** Callback para mudanças no editor */
  onBlocksChange?: (stepId: string, blocks: Block[]) => void;
  /** Estado inicial do quiz */
  initialData?: QuizFlowState;
  /** Configurações personalizadas */
  customConfig?: QuizFlowConfig;
}

interface QuizFlowState {
  currentStep: number;
  totalSteps: number;
  sessionData: Record<string, any>;
  userAnswers: Record<string, any>;
  stepValidation: Record<number, boolean>;
  calculatedScores: Record<string, number>;
  isCompleted: boolean;
}

interface QuizFlowConfig {
  enableLivePreview: boolean;
  enableValidation: boolean;
  enableScoring: boolean;
  enableAnalytics: boolean;
  theme: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
}

export const QuizFlowPage: React.FC<QuizFlowPageProps> = ({
  mode = 'preview',
  template = QUIZ_STYLE_21_STEPS_TEMPLATE,
  onBlocksChange,
  initialData,
  customConfig = {
    enableLivePreview: true,
    enableValidation: true,
    enableScoring: true,
    enableAnalytics: false,
    theme: {
      primaryColor: '#B89B7A',
      backgroundColor: '#FEFEFE',
      textColor: '#432818',
    },
  },
}) => {
  // ========================================
  // Estado do Quiz
  // ========================================
  const [quizState, setQuizState] = useState<QuizFlowState>({
    currentStep: 1,
    totalSteps: 21,
    sessionData: { userName: '' },
    userAnswers: {},
    stepValidation: {},
    calculatedScores: {},
    isCompleted: false,
    ...initialData,
  });

  // ========================================
  // Dados da Etapa Atual
  // ========================================
  const currentStepData = useMemo(() => {
    const stepKey = `step-${quizState.currentStep}`;
    return template[stepKey] || [];
  }, [quizState.currentStep, template]);

  // ========================================
  // Navegação
  // ========================================
  const handleNext = useCallback(() => {
    if (quizState.currentStep < quizState.totalSteps) {
      setQuizState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
      }));
    }
  }, [quizState.currentStep, quizState.totalSteps]);

  const handlePrevious = useCallback(() => {
    if (quizState.currentStep > 1) {
      setQuizState(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1,
      }));
    }
  }, [quizState.currentStep]);

  const handleStepJump = useCallback(
    (stepNumber: number) => {
      if (stepNumber >= 1 && stepNumber <= quizState.totalSteps) {
        setQuizState(prev => ({
          ...prev,
          currentStep: stepNumber,
        }));
      }
    },
    [quizState.totalSteps]
  );

  // ========================================
  // Gerenciamento de Dados
  // ========================================
  const handleDataUpdate = useCallback((key: string, value: any) => {
    setQuizState(prev => ({
      ...prev,
      sessionData: {
        ...prev.sessionData,
        [key]: value,
      },
    }));
  }, []);

  const handleAnswerUpdate = useCallback((questionId: string, answer: any) => {
    setQuizState(prev => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [questionId]: answer,
      },
    }));
  }, []);

  // ========================================
  // Validação e Scoring
  // ========================================
  const handleStepValidation = useCallback((stepNumber: number, isValid: boolean) => {
    setQuizState(prev => ({
      ...prev,
      stepValidation: {
        ...prev.stepValidation,
        [stepNumber]: isValid,
      },
    }));
  }, []);

  // ========================================
  // Edição de Blocos (Modo Editor)
  // ========================================
  const handleBlockUpdate = useCallback(
    (blockId: string, updates: Partial<Block>) => {
      if (mode === 'editor' && onBlocksChange) {
        const stepKey = `step-${quizState.currentStep}`;
        const updatedBlocks = currentStepData.map(block =>
          block.id === blockId ? { ...block, ...updates } : block
        );
        onBlocksChange(stepKey, updatedBlocks);
      }
    },
    [mode, onBlocksChange, quizState.currentStep, currentStepData]
  );

  // ========================================
  // Configuração de Contexto
  // ========================================
  const contextConfig = useMemo(
    () => ({
      ...customConfig,
      mode,
      quizState,
      currentStepData,
      navigation: {
        onNext: handleNext,
        onPrevious: handlePrevious,
        onStepJump: handleStepJump,
        canGoNext: quizState.stepValidation[quizState.currentStep] ?? false,
        canGoBack: quizState.currentStep > 1,
      },
      dataManager: {
        onDataUpdate: handleDataUpdate,
        onAnswerUpdate: handleAnswerUpdate,
      },
      validation: {
        onStepValidation: handleStepValidation,
      },
      editor: {
        onBlockUpdate: handleBlockUpdate,
      },
    }),
    [
      customConfig,
      mode,
      quizState,
      currentStepData,
      handleNext,
      handlePrevious,
      handleStepJump,
      handleDataUpdate,
      handleAnswerUpdate,
      handleStepValidation,
      handleBlockUpdate,
    ]
  );

  // ========================================
  // Efeito de Carregamento Inicial
  // ========================================
  useEffect(() => {
    if (template?.stages?.[quizState.currentStep - 1]?.blocks && onBlocksChange) {
      onBlocksChange(quizState.currentStep, template.stages[quizState.currentStep - 1].blocks);
    }
  }, [quizState.currentStep, template, onBlocksChange]);

  // ========================================
  // Render
  // ========================================
  return (
    <div
      className={cn(
        'quiz-flow-page min-h-screen',
        mode === 'editor' && 'bg-gray-50',
        mode === 'preview' && 'bg-white',
        mode === 'production' && 'bg-white'
      )}
    >
      {/* Header com informações do quiz */}
      <div className="quiz-flow-header bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Quiz Interativo - {quizState.totalSteps} Etapas
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Modo: {mode} | Etapa {quizState.currentStep} de {quizState.totalSteps}
            </p>
          </div>

          {mode === 'editor' && (
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-500">
                Validação: {customConfig.enableValidation ? '✅' : '❌'}
              </div>
              <div className="text-xs text-gray-500">
                Pontuação: {customConfig.enableScoring ? '✅' : '❌'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sistema de Navegação */}
      <QuizNavigationBlock config={contextConfig} showDebugInfo={mode === 'editor'} />

      {/* Renderizador da Etapa Atual */}
      <div className="quiz-flow-content flex-1 overflow-auto">
        <QuizStepRenderer blocks={currentStepData} config={contextConfig} />
      </div>

      {/* Gerenciador de Dados (Invisível) */}
      <QuizDataManager config={contextConfig} />

      {/* Sistema de Validação (Invisível) */}
      <QuizValidationSystem config={contextConfig} />

      {/* Calculadora de Score (Invisível) */}
      <QuizScoreCalculator config={contextConfig} />

      {/* Debug Panel (Modo Editor) */}
      {mode === 'editor' && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-sm">
          <h4 className="font-semibold mb-2">Debug Info</h4>
          <div className="text-xs space-y-1">
            <div>
              Etapa: {quizState.currentStep}/{quizState.totalSteps}
            </div>
            <div>Blocos: {currentStepData.length}</div>
            <div>Válida: {quizState.stepValidation[quizState.currentStep] ? '✅' : '❌'}</div>
            <div>Respostas: {Object.keys(quizState.userAnswers).length}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizFlowPage;
