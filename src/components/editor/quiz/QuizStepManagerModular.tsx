/**
 * 🏗️ GERENCIADOR MODULAR DE ETAPAS DO QUIZ - VERSÃO COMPLETA
 *
 * Carrega templates do quiz21StepsComplete.ts com renderização fidedigna à produção
 */

import { useQuizFlow } from '@/hooks/core/useQuizFlow';
import { Block } from '@/types/editor';
import { getStepInfo, isValidStep, loadStepBlocks } from '@/utils/quiz21StepsRenderer';
import React, { useMemo } from 'react';

interface QuizStepManagerProps {
  children: (stepData: {
    currentStep: any;
    blocks: Block[];
    isValid: boolean;
    progress: number;
  }) => React.ReactNode;
}

export const QuizStepManagerModular: React.FC<QuizStepManagerProps> = ({ children }) => {
  const { quizState } = useQuizFlow();
  const { currentStep: currentStepNumber, totalSteps } = quizState;

  // Carregar dados reais da etapa usando o novo sistema
  const stepBlocks = useMemo(() => {
    if (!isValidStep(currentStepNumber)) {
      console.warn(`❌ Etapa ${currentStepNumber} é inválida`);
      return [];
    }

    return loadStepBlocks(currentStepNumber);
  }, [currentStepNumber]);

  // Informações da etapa atual
  const currentStepData = useMemo(() => {
    return getStepInfo(currentStepNumber);
  }, [currentStepNumber]);

  // Validação de etapa
  const isStepValid = useMemo(() => {
    // Para etapas de questão, verificar se há seleções suficientes
    if (currentStepData.type === 'question' && currentStepData.maxSelections) {
      // TODO: Implementar validação real baseada nas respostas do usuário
      return true;
    }
    return true;
  }, [currentStepData]);

  // Progresso
  const progress = useMemo(() => {
    return Math.round((currentStepNumber / totalSteps) * 100);
  }, [currentStepNumber, totalSteps]);

  const stepData = {
    currentStep: currentStepData,
    blocks: stepBlocks,
    isValid: isStepValid,
    progress,
  };

  // Log para debug
  console.log(`🎯 QuizStepManagerModular - Etapa ${currentStepNumber}:`, {
    stepData: currentStepData,
    blocksCount: stepBlocks.length,
    isValid: isStepValid,
    progress,
  });

  return <>{children(stepData)}</>;
};
