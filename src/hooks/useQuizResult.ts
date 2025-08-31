import { useState, useEffect, useCallback } from 'react';
import { StyleResult } from '@/types/quiz';
import { StorageService } from '@/services/core/StorageService';

export const useQuizResult = () => {
  const [primaryStyle, setPrimaryStyle] = useState<StyleResult | null>(null);
  const [secondaryStyles, setSecondaryStyles] = useState<StyleResult[]>([]);

  const loadFromStorage = useCallback(() => {
    try {
      const parsedResult = StorageService.safeGetJSON<any>('quizResult');
      if (parsedResult) {
        setPrimaryStyle(parsedResult.primaryStyle ?? null);
        setSecondaryStyles(parsedResult.secondaryStyles || []);
      }
    } catch (error) {
      console.error('Error loading quiz result:', error);
    }
  }, []);

  useEffect(() => {
    loadFromStorage();
    const handler = () => loadFromStorage();
    // Reage a mudanças do localStorage (em outras abas) e a eventos customizados internos
    window.addEventListener('storage', handler);
    window.addEventListener('quiz-result-updated', handler as EventListener);
    window.addEventListener('quiz-result-refresh', handler as EventListener);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('quiz-result-updated', handler as EventListener);
      window.removeEventListener('quiz-result-refresh', handler as EventListener);
    };
  }, [loadFromStorage]);

  return {
    primaryStyle,
    secondaryStyles,
  };
};
