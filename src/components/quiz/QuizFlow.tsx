/**
 * QuizFlow Component - Complete Quiz Implementation
 *
 * This component demonstrates the full quiz flow using our new hooks
 * and interfaces. It serves as a reference implementation for the
 * 21-step quiz system.
 */

import React, { useEffect } from 'react';
import { useQuizState } from '@/hooks/useQuizState';
import { useQuizNavigation } from '@/hooks/useQuizNavigation';
import { useQuizValidation } from '@/hooks/useQuizValidation';
import { useQuizAnalytics } from '@/hooks/useQuizAnalytics';
import { renderQuizBlock } from '@/components/editor/quiz/QuizBlockRegistry';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { UserAnswer } from '@/types/quizCore';

export interface QuizFlowProps {
  className?: string;
  onComplete?: (result: any) => void;
}

export const QuizFlow: React.FC<QuizFlowProps> = ({ className = '', onComplete }) => {
  // Initialize hooks
  const { state, updateState } = useQuizState();
  const {
    // navigation, // unused for now
    nextStep,
    previousStep,
    // goToStep, // unused for now
    canAdvance,
    isFirstStep,
    isLastStep,
  } = useQuizNavigation(state.currentStepNumber, state.totalSteps, stepNumber => {
    updateState({
      currentStepNumber: stepNumber,
      currentStepId: `step-${stepNumber}`,
    });
  });

  const {
    // validateStep, // unused for now
    isStepValid,
  } = useQuizValidation(state.userAnswers, state.sessionData);

  const { trackStepStart, trackStepComplete, trackQuizComplete } = useQuizAnalytics();

  // Track step start when step changes
  useEffect(() => {
    trackStepStart(state.currentStepId);
  }, [state.currentStepId, trackStepStart]);

  // Get current step template
  const currentStepTemplate = QUIZ_STYLE_21_STEPS_TEMPLATE[state.currentStepId];

  // Handle step completion
  const handleStepComplete = (stepData: any) => {
    const { stepId, selections, selectedOptionDetails } = stepData;

    // Create user answer
    const userAnswer: UserAnswer = {
      stepId,
      questionId: stepData.questionId || stepId,
      selectedOptions: selections || [],
      selectedOptionDetails: selectedOptionDetails || [],
      answeredAt: new Date(),
      timeSpent: 0, // Will be calculated by analytics
    };

    // Update state with new answer
    const updatedAnswers = [
      ...state.userAnswers.filter(answer => answer.stepId !== stepId),
      userAnswer,
    ];

    updateState({ userAnswers: updatedAnswers });

    // Track completion
    trackStepComplete(stepId, updatedAnswers);

    // Auto-advance if enabled
    if (stepData.autoAdvance && canAdvance) {
      setTimeout(() => {
        nextStep();
      }, stepData.autoAdvanceDelay || 1500);
    }
  };

  // Handle name submission (step 1)
  const handleNameSubmit = (name: string) => {
    updateState({
      userName: name,
      sessionData: { ...state.sessionData, userName: name },
    });

    // Auto-advance to next step
    setTimeout(() => {
      nextStep();
    }, 500);
  };

  // Handle quiz completion
  const handleQuizComplete = () => {
    // Calculate final result
    const result = {
      id: `result-${Date.now()}`,
      userId: state.userName || 'anonymous',
      quizId: 'style-quiz-21-steps',
      styleCategory: calculatePrimaryStyle(state.scores),
      primaryStyle: calculatePrimaryStyle(state.scores),
      secondaryStyles: calculateSecondaryStyles(state.scores),
      scores: state.scores,
      percentages: calculatePercentages(state.scores),
      userAnswers: state.userAnswers,
      completedAt: new Date(),
      totalScore: Object.values(state.scores).reduce((sum, score) => sum + score, 0),
    };

    updateState({ result, isCompleted: true });
    trackQuizComplete(result);

    if (onComplete) {
      onComplete(result);
    }
  };

  // Check if current step is valid
  const currentStepValid = isStepValid(state.currentStepId);

  // Handle navigation
  const handleNext = () => {
    if (isLastStep) {
      handleQuizComplete();
    } else if (currentStepValid) {
      nextStep();
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      previousStep();
    }
  };

  // Handle session data updates (from blocks)
  const handleUpdateSessionData = (key: string, value: any) => {
    updateState({
      sessionData: {
        ...state.sessionData,
        [key]: value,
      },
    });
  };

  // Render current step blocks
  const renderStepBlocks = () => {
    if (!currentStepTemplate) {
      return (
        <div className="text-center p-8">
          <p className="text-gray-600">Etapa não encontrada: {state.currentStepId}</p>
        </div>
      );
    }

    return currentStepTemplate.map((block, index) => {
      // Create enhanced props for the block
      const blockProps = {
        block,
        key: block.id || index,
        isPreviewMode: true,
        onNext: handleNext,
        onUpdateSessionData: handleUpdateSessionData,
        onStepComplete: handleStepComplete,
        sessionData: state.sessionData,
        userAnswers: state.userAnswers,
        onNameSubmit: state.currentStepNumber === 1 ? handleNameSubmit : undefined,
      };

      // Render using the registry
      const renderedBlock = renderQuizBlock(block.type, blockProps);

      if (renderedBlock) {
        return renderedBlock;
      }

      // Fallback for unknown block types
      return (
        <div key={block.id || index} className="p-4 border border-gray-200 rounded mb-4">
          <p className="text-sm text-gray-500">Tipo de bloco não suportado: {block.type}</p>
          <pre className="text-xs text-gray-400 mt-2">{JSON.stringify(block, null, 2)}</pre>
        </div>
      );
    });
  };

  return (
    <div className={`quiz-flow min-h-screen bg-gray-50 ${className}`}>
      {/* Progress Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Etapa {state.currentStepNumber} de {state.totalSteps}
            </span>
            <span className="text-sm text-gray-600">{Math.round(state.progress)}% completo</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">{renderStepBlocks()}</div>

      {/* Navigation */}
      {state.currentStepNumber > 1 && state.currentStepNumber < 20 && (
        <div className="fixed bottom-4 left-4 right-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Voltar
            </button>

            <button
              onClick={handleNext}
              disabled={!currentStepValid}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLastStep ? 'Finalizar' : 'Continuar'}
            </button>
          </div>
        </div>
      )}

      {/* Debug Info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black text-white p-4 rounded text-xs max-w-sm">
          <h4 className="font-bold mb-2">Debug Info</h4>
          <p>Step: {state.currentStepId}</p>
          <p>Valid: {currentStepValid ? 'Yes' : 'No'}</p>
          <p>Answers: {state.userAnswers.length}</p>
          <p>User: {state.userName || 'None'}</p>
        </div>
      )}
    </div>
  );
};

// Helper functions for result calculation
function calculatePrimaryStyle(scores: Record<string, number>): string {
  const sortedStyles = Object.entries(scores).sort(([, a], [, b]) => b - a);
  return sortedStyles[0]?.[0] || 'natural';
}

function calculateSecondaryStyles(scores: Record<string, number>): string[] {
  const sortedStyles = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(1, 4) // Top 3 secondary styles
    .map(([style]) => style);
  return sortedStyles;
}

function calculatePercentages(scores: Record<string, number>): Record<string, number> {
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const percentages: Record<string, number> = {};

  Object.entries(scores).forEach(([style, score]) => {
    percentages[style] = total > 0 ? (score / total) * 100 : 0;
  });

  return percentages;
}

export default QuizFlow;
