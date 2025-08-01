
import React, { useState, useCallback } from 'react';

export const useHistory = <T>(initialState: T) => {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initialState);
  const [future, setFuture] = useState<T[]>([]);

  const saveState = useCallback((newState: T) => {
    setPast(prev => [...prev, present]);
    setPresent(newState);
    setFuture([]);
  }, [present]);

  const undo = useCallback(() => {
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setPast(newPast);
    setPresent(previous);
    setFuture([present, ...future]);
  }, [past, present, future]);

  const redo = useCallback(() => {
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    setPast([...past, present]);
    setPresent(next);
    setFuture(newFuture);
  }, [past, present, future]);

  return { past, present, future, saveState, undo, redo };
};
