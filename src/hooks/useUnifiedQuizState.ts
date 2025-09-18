import { useState, useEffect } from 'react';
import { UnifiedQuizStorage } from '@/services/core/UnifiedQuizStorage';

export interface UnifiedQuizState {
  currentStep: number;
  responses: Record<string, any>;
  calculatedStyles: any[];
  userName?: string;
}

export const useUnifiedQuizState = () => {
  const [state, setState] = useState<UnifiedQuizState>({
    currentStep: 1,
    responses: {},
    calculatedStyles: [],
    userName: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    setLoading(true);
    try {
      const quizData = await UnifiedQuizStorage.getQuizData();
      setState({
        currentStep: quizData.currentStep || 1,
        responses: quizData.responses || {},
        calculatedStyles: quizData.calculatedStyles || [],
        userName: quizData.userName || ''
      });
    } catch (error) {
      console.error('Error loading quiz state:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateState = async (updates: Partial<UnifiedQuizState>) => {
    const newState = { ...state, ...updates };
    setState(newState);
    
    try {
      await UnifiedQuizStorage.saveQuizData(newState);
    } catch (error) {
      console.error('Error saving quiz state:', error);
    }
  };

  return {
    ...state,
    loading,
    updateState,
    refetch: loadState,
    getCurrentStep: () => state.currentStep
  };
};