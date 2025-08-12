import { useState, useEffect } from 'react';
import { StyleResult } from '@/types/quiz';

export const useQuizResult = () => {
  const [primaryStyle, setPrimaryStyle] = useState<StyleResult | null>(null);
  const [secondaryStyles, setSecondaryStyles] = useState<StyleResult[]>([]);

  useEffect(() => {
    try {
      const savedResult = localStorage.getItem('quizResult');
      if (savedResult) {
        const parsedResult = JSON.parse(savedResult);
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
