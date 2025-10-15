/**
 * useQuizResult Stub - Returns mock data with proper types
 */
export function useQuizResult() {
  return {
    primaryStyle: {
      style: 'Natural',
      category: 'Natural',
      percentage: 85,
      description: 'Mock style description'
    },
    secondaryStyles: [
      { style: 'Romantic', category: 'Romantic', percentage: 10 },
      { style: 'Classic', category: 'Classic', percentage: 5 }
    ],
    hasResult: true,
    isLoading: false,
    error: null,
    retry: () => {},
  };
}
