/**
 * useQuizResult Stub - Returns mock data with proper types
 */
export interface QuizStyleResult {
  style: string;
  category: string;
  percentage: number;
  description?: string;
}

export interface UseQuizResultReturn {
  primaryStyle: QuizStyleResult | null;
  secondaryStyles: Array<{ style: string; category: string; percentage: number }>;
  hasResult: boolean;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export function useQuizResult(): UseQuizResultReturn {
  return {
    primaryStyle: {
      style: 'Natural',
      category: 'Natural',
      percentage: 85,
      description: 'Mock style description',
    },
    secondaryStyles: [
      { style: 'Romantic', category: 'Romantic', percentage: 10 },
      { style: 'Classic', category: 'Classic', percentage: 5 },
    ],
    hasResult: true,
    isLoading: false,
    error: null,
    retry: () => {},
  };
}
