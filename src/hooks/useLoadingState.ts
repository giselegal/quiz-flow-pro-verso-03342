import { useState, useCallback } from "react";

interface LoadingStateOptions {
  initialState?: boolean;
  timeout?: number;
}

export const useLoadingState = (options: LoadingStateOptions = {}) => {
  const { initialState = false, timeout } = options;
  const [isLoading, setIsLoading] = useState(initialState);
  const [error, setError] = useState<string | null>(null);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
    if (loading) {
      setError(null);
    }
  }, []);

  const setLoadingWithTimeout = useCallback(
    (loading: boolean, timeoutMs?: number) => {
      setLoading(loading);

      const timeoutValue = timeoutMs || timeout;
      if (loading && timeoutValue) {
        setTimeout(() => {
          setLoading(false);
        }, timeoutValue);
      }
    },
    [setLoading, timeout]
  );

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    setLoading,
    setLoadingWithTimeout,
    handleError,
    clearError: () => setError(null),
  };
};
