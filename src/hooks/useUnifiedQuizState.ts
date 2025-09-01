/**
 * 🎯 HOOK DE ESTADO UNIFICADO - FASE 3
 * 
 * Hook que gerencia todo o estado do quiz de forma unificada,
 * substituindo o uso separado de userSelections e quizAnswers
 */

import { useState, useEffect, useCallback } from 'react';
import { unifiedQuizStorage, UnifiedQuizData } from '@/services/core/UnifiedQuizStorage';

export const useUnifiedQuizState = () => {
  const [data, setData] = useState<UnifiedQuizData>(() => unifiedQuizStorage.loadData());
  const [isLoading, setIsLoading] = useState(false);

  // Recarregar dados quando houver mudanças
  const reloadData = useCallback(() => {
    const newData = unifiedQuizStorage.loadData();
    setData(newData);
  }, []);

  // Effect para escutar mudanças
  useEffect(() => {
    const handleDataChange = () => reloadData();
    
    window.addEventListener('unified-quiz-data-updated', handleDataChange);
    window.addEventListener('storage', handleDataChange);
    
    return () => {
      window.removeEventListener('unified-quiz-data-updated', handleDataChange);
      window.removeEventListener('storage', handleDataChange);
    };
  }, [reloadData]);

  // Funções para atualizar diferentes tipos de dados
  const updateSelections = useCallback((questionId: string, selectedOptions: string[]) => {
    setIsLoading(true);
    const success = unifiedQuizStorage.updateSelections(questionId, selectedOptions);
    if (success) {
      reloadData();
    }
    setIsLoading(false);
    return success;
  }, [reloadData]);

  const updateFormData = useCallback((key: string, value: any) => {
    setIsLoading(true);
    const success = unifiedQuizStorage.updateFormData(key, value);
    if (success) {
      reloadData();
    }
    setIsLoading(false);
    return success;
  }, [reloadData]);

  const updateProgress = useCallback((currentStep: number) => {
    return unifiedQuizStorage.updateProgress(currentStep);
  }, []);

  const saveResult = useCallback((result: any) => {
    const success = unifiedQuizStorage.saveResult(result);
    if (success) {
      reloadData();
    }
    return success;
  }, [reloadData]);

  const clearAll = useCallback(() => {
    setIsLoading(true);
    const success = unifiedQuizStorage.clearAll();
    if (success) {
      reloadData();
    }
    setIsLoading(false);
    return success;
  }, [reloadData]);

  // Getters convenientes para compatibilidade com código existente
  const getUserSelections = useCallback((): Record<string, string[]> => {
    return data.selections;
  }, [data.selections]);

  const getQuizAnswers = useCallback((): Record<string, any> => {
    return data.formData;
  }, [data.formData]);

  const getCurrentStep = useCallback((): number => {
    return data.metadata.currentStep;
  }, [data.metadata.currentStep]);

  const getCompletedSteps = useCallback((): number[] => {
    return data.metadata.completedSteps;
  }, [data.metadata.completedSteps]);

  const hasEnoughDataForResult = useCallback((): boolean => {
    return unifiedQuizStorage.hasEnoughDataForResult();
  }, []);

  const getDataStats = useCallback(() => {
    return unifiedQuizStorage.getDataStats();
  }, []);

  return {
    // Estado atual
    data,
    isLoading,
    
    // Ações
    updateSelections,
    updateFormData,
    updateProgress,
    saveResult,
    clearAll,
    reloadData,
    
    // Getters (compatibilidade)
    getUserSelections,
    getQuizAnswers,
    getCurrentStep,
    getCompletedSteps,
    hasEnoughDataForResult,
    getDataStats,
    
    // Dados diretos (para acesso mais simples)
    selections: data.selections,
    formData: data.formData,
    metadata: data.metadata,
    result: data.result,
  };
};