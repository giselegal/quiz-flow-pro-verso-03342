/**
 * 🏗️ GERENCIADOR MODULAR DE ETAPAS DO QUIZ
 * 
 * Carrega templates dinamicamente, gerencia cache e validações
 */

import React, { useMemo } from 'react';
import { useQuizFlow } from './QuizFlowController';
import { Block } from '@/types/editor';

interface QuizStepManagerProps {
  children: (stepData: {
    currentStep: any;
    blocks: Block[];
    isValid: boolean;
    progress: number;
  }) => React.ReactNode;
}

export const QuizStepManagerModular: React.FC<QuizStepManagerProps> = ({ 
  children 
}) => {
  const { 
    currentStep, 
    currentStepNumber, 
    totalSteps, 
    isStepValid 
  } = useQuizFlow();

  // Convert step data to blocks format
  const blocks = useMemo(() => {
    const stepBlocks: Block[] = [];
    
    // Header block
    stepBlocks.push({
      id: `header-${currentStep.stepId}`,
      type: 'headline',
      order: 0,
      content: {
        title: currentStep.title,
        subtitle: currentStep.subtitle,
        textAlign: 'center',
        fontSize: '2xl',
        fontWeight: 'bold',
        color: currentStep.textColor || '#333333'
      }
    });

    // Question and options for question type steps
    if (currentStep.type === 'question' && currentStep.options) {
      stepBlocks.push({
        id: `question-${currentStep.stepId}`,
        type: 'options-grid',
        order: 1,
        content: {
          question: currentStep.question || currentStep.title,
          options: currentStep.options.map(option => ({
            id: option.id,
            text: option.text,
            imageUrl: option.imageUrl
          })),
          maxSelections: currentStep.maxSelections || 1,
          isRequired: currentStep.isRequired || false
        }
      });
    }

    // Navigation block
    stepBlocks.push({
      id: `navigation-${currentStep.stepId}`,
      type: 'quiz-navigation',
      order: 2,
      content: {
        currentStep: currentStepNumber,
        totalSteps: totalSteps,
        showProgress: true,
        showStepNumbers: true
      }
    });

    return stepBlocks;
  }, [currentStep, currentStepNumber, totalSteps]);

  const stepData = {
    currentStep,
    blocks,
    isValid: isStepValid(currentStep.stepId),
    progress: Math.round((currentStepNumber / totalSteps) * 100)
  };

  return <>{children(stepData)}</>;
};