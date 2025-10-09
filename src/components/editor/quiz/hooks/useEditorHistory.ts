import { useCallback, useRef, useState } from 'react';
import { HistoryManager } from '@/utils/historyManager';

export function useEditorHistory<T>(initial?: T) {
  const historyRef = useRef<HistoryManager<T> | null>(initial ? new HistoryManager<T>(initial) : null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const init = useCallback((value: T) => {
    historyRef.current = new HistoryManager<T>(value);
    setCanUndo(false);
    setCanRedo(false);
  }, []);

  const push = useCallback((snapshot: T) => {
    if (!historyRef.current) return;
    historyRef.current.push(snapshot);
    setCanUndo(historyRef.current.canUndo());
    setCanRedo(historyRef.current.canRedo());
  }, []);

  const undo = useCallback((): T | null => {
    if (!historyRef.current || !historyRef.current.canUndo()) return null;
    const snap = historyRef.current.undo();
    setCanUndo(historyRef.current.canUndo());
    setCanRedo(historyRef.current.canRedo());
    return snap;
  }, []);

  const redo = useCallback((): T | null => {
    if (!historyRef.current || !historyRef.current.canRedo()) return null;
    const snap = historyRef.current.redo();
    setCanUndo(historyRef.current.canUndo());
    setCanRedo(historyRef.current.canRedo());
    return snap;
  }, []);

  return { canUndo, canRedo, init, push, undo, redo };
}
