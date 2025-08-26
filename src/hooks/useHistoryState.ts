import { useCallback, useEffect, useState } from 'react';

export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export interface UseHistoryStateOptions {
  historyLimit?: number;
  storageKey?: string;
  enablePersistence?: boolean;
}

export const useHistoryState = <T>(initialState: T, options: UseHistoryStateOptions = {}) => {
  const { historyLimit = 50, storageKey, enablePersistence = false } = options;

  // Initialize state from localStorage if persistence is enabled
  const getInitialState = useCallback((): HistoryState<T> => {
    if (enablePersistence && storageKey && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            past: parsed.past || [],
            present: parsed.present || initialState,
            future: parsed.future || [],
          };
        }
      } catch (error) {
        console.warn('Failed to load history state from localStorage:', error);
      }
    }
    return {
      past: [],
      present: initialState,
      future: [],
    };
  }, [initialState, storageKey, enablePersistence]);

  const [history, setHistory] = useState<HistoryState<T>>(getInitialState);

  // Persist state to localStorage when it changes
  useEffect(() => {
    if (enablePersistence && storageKey && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(history));
      } catch (error) {
        console.warn('Failed to save history state to localStorage:', error);
      }
    }
  }, [history, storageKey, enablePersistence]);

  const setPresent = useCallback(
    (newStateOrUpdater: T | ((prev: T) => T)) => {
      setHistory(currentHistory => {
        const newPast = [...currentHistory.past, currentHistory.present];

        // Apply history limit
        if (newPast.length > historyLimit) {
          newPast.splice(0, newPast.length - historyLimit);
        }

        const nextPresent =
          typeof newStateOrUpdater === 'function'
            ? (newStateOrUpdater as (prev: T) => T)(currentHistory.present)
            : newStateOrUpdater;

        return {
          past: newPast,
          present: nextPresent,
          future: [],
        };
      });
    },
    [historyLimit]
  );

  const undo = useCallback(() => {
    setHistory(currentHistory => {
      if (currentHistory.past.length === 0) return currentHistory;

      const previous = currentHistory.past[currentHistory.past.length - 1];
      const newPast = currentHistory.past.slice(0, currentHistory.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [currentHistory.present, ...currentHistory.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory(currentHistory => {
      if (currentHistory.future.length === 0) return currentHistory;

      const next = currentHistory.future[0];
      const newFuture = currentHistory.future.slice(1);

      return {
        past: [...currentHistory.past, currentHistory.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const reset = useCallback(() => {
    setHistory({
      past: [],
      present: initialState,
      future: [],
    });
  }, [initialState]);

  const getPresent = useCallback(() => {
    return history.present;
  }, [history.present]);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  return {
    present: history.present,
    setPresent,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    getPresent,
    history,
  };
};
