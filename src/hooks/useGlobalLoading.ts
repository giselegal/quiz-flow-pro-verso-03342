import React, { useState, useCallback, useEffect } from 'react';

interface GlobalLoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

// Simple global state using module-level variables
let globalState: GlobalLoadingState = {
  isLoading: false,
  message: undefined,
  progress: undefined,
};

const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const useGlobalLoading = () => {
  const [, forceUpdate] = useState({});

  const rerender = useCallback(() => {
    forceUpdate({});
  }, []);

  // Subscribe to global state changes
  useEffect(() => {
    listeners.add(rerender);
    return () => {
      listeners.delete(rerender);
    };
  }, [rerender]);

  const setLoading = useCallback((loading: boolean, message?: string, progress?: number) => {
    globalState = { isLoading: loading, message, progress };
    notifyListeners();
  }, []);

  const updateProgress = useCallback((progress: number) => {
    globalState = { ...globalState, progress };
    notifyListeners();
  }, []);

  const clearLoading = useCallback(() => {
    globalState = { isLoading: false, message: undefined, progress: undefined };
    notifyListeners();
  }, []);

  return {
    state: globalState,
    setLoading,
    updateProgress,
    clearLoading,
  };
};