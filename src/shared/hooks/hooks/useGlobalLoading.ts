import React, { useState, useCallback, createContext, useContext } from 'react';

interface GlobalLoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

interface GlobalLoadingContextType extends GlobalLoadingState {
  setLoading: (loading: boolean, message?: string, progress?: number) => void;
  updateProgress: (progress: number) => void;
  clearLoading: () => void;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

export const GlobalLoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<GlobalLoadingState>({
    isLoading: false,
    message: undefined,
    progress: undefined,
  });

  const setLoading = useCallback((loading: boolean, message?: string, progress?: number) => {
    setState({ isLoading: loading, message, progress });
  }, []);

  const updateProgress = useCallback((progress: number) => {
    setState(prev => ({ ...prev, progress }));
  }, []);

  const clearLoading = useCallback(() => {
    setState({ isLoading: false, message: undefined, progress: undefined });
  }, []);

  const contextValue = {
    ...state,
    setLoading,
    updateProgress,
    clearLoading,
  };

  return React.createElement(GlobalLoadingContext.Provider, { value: contextValue }, children);
};

export const useGlobalLoading = () => {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within GlobalLoadingProvider');
  }

  return {
    state: {
      isLoading: context.isLoading,
      message: context.message,
      progress: context.progress,
    },
    setLoading: context.setLoading,
    updateProgress: context.updateProgress,
    clearLoading: context.clearLoading,
  };
};
