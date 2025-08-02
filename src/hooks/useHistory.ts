
import { useState, useCallback } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export const useHistory = <T>(initialState: T) => {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: []
  });

  const saveState = useCallback((newState: T) => {
    setHistory(currentHistory => ({
      past: [...currentHistory.past, currentHistory.present],
      present: newState,
      future: []
    }));
  }, []);

  const undo = useCallback(() => {
    setHistory(currentHistory => {
      if (currentHistory.past.length === 0) return currentHistory;
      
      const previous = currentHistory.past[currentHistory.past.length - 1];
      const newPast = currentHistory.past.slice(0, currentHistory.past.length - 1);
      
      return {
        past: newPast,
        present: previous,
        future: [currentHistory.present, ...currentHistory.future]
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
        future: newFuture
      };
    });
  }, []);

  return {
    past: history.past,
    present: history.present,
    future: history.future,
    saveState,
    undo,
    redo
  };
};
