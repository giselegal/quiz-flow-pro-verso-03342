import { useState, useEffect } from 'react';
import { StorageService } from '@/services/core/StorageService';

export interface QuizResult {
  styles: any[];
  primaryStyle: any;
  secondaryStyles: any[];
  userName?: string;
}

export const useQuizResult = () => {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(false);

  const loadResult = async () => {
    setLoading(true);
    try {
      const userData = await StorageService.getUserData();
      const styles = await StorageService.getCalculatedStyles();
      
      setResult({
        styles: styles || [],
        primaryStyle: styles?.[0] || {},
        secondaryStyles: styles?.slice(1) || [],
        userName: userData?.userName || 'Usuário'
      });
    } catch (error) {
      console.error('Error loading quiz result:', error);
      setResult({
        styles: [],
        primaryStyle: {},
        secondaryStyles: [],
        userName: 'Usuário'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResult();
  }, []);

  return {
    result,
    loading,
    refetch: loadResult,
    primaryStyle: result?.primaryStyle || {},
    secondaryStyles: result?.secondaryStyles || [],
    hasResult: !!result,
    isLoading: loading,
    error: null,
    retry: loadResult
  };
};