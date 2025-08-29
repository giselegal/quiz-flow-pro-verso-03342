import { useState, useEffect } from 'react';
import { StyleResult } from '@/types/quiz';
import { StorageService } from '@/services/core/StorageService';

export const useQuizResult = () => {
  const [primaryStyle, setPrimaryStyle] = useState<StyleResult | null>(null);
  const [secondaryStyles, setSecondaryStyles] = useState<StyleResult[]>([]);

  useEffect(() => {
    try {
      const parsedResult = StorageService.safeGetJSON<any>('quizResult');
      if (parsedResult) {
        setPrimaryStyle(parsedResult.primaryStyle);
        setSecondaryStyles(parsedResult.secondaryStyles || []);
      }
    } catch (error) {
      console.error('Error loading quiz result:', error);
    }
  }, []);

  return {
    primaryStyle,
    secondaryStyles,
  };
};
