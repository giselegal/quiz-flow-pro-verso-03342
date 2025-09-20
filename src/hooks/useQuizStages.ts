/**
 * 🎯 HOOK DE ESTÁGIOS DE QUIZ - PLACEHOLDER
 * 
 * Hook temporário para resolver dependências de imports
 */

import { useState, useCallback } from 'react';

export interface QuizStage {
  id: string;
  name: string;
  type: 'intro' | 'question' | 'result' | 'offer';
  order: number;
  isActive: boolean;
  data: Record<string, any>;
}

export const useQuizStages = () => {
  const [stages, setStages] = useState<QuizStage[]>([]);
  const [currentStage, setCurrentStage] = useState<string | null>(null);

  const addStage = useCallback((stage: Omit<QuizStage, 'id'>) => {
    const newStage: QuizStage = {
      ...stage,
      id: `stage-${Date.now()}`
    };
    
    setStages(prev => [...prev, newStage]);
    console.log('➕ Stage adicionado:', newStage);
  }, []);

  const updateStage = useCallback((stageId: string, updates: Partial<QuizStage>) => {
    setStages(prev => prev.map(stage => 
      stage.id === stageId ? { ...stage, ...updates } : stage
    ));
    console.log('🔄 Stage atualizado:', stageId, updates);
  }, []);

  const removeStage = useCallback((stageId: string) => {
    setStages(prev => prev.filter(stage => stage.id !== stageId));
    console.log('🗑️ Stage removido:', stageId);
  }, []);

  const goToStage = useCallback((stageId: string) => {
    setCurrentStage(stageId);
    console.log('📍 Navegando para stage:', stageId);
  }, []);

  return {
    stages,
    currentStage,
    addStage,
    updateStage,
    removeStage,
    goToStage,
    totalStages: stages.length
  };
};

export default useQuizStages;