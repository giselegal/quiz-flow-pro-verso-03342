// Hook leve de estado do editor (Fase 1.3)
// Próximos incrementos: desfazer/refazer, seleção, dirty-state, persistência.
import { useCallback, useMemo, useRef, useState } from 'react';

export type EditorState = {
  currentStepKey: string | null;
  isDirty: boolean;
  selectedBlockId: string | null;
};

export function useEditorState(initialStepKey?: string) {
  const [state, setState] = useState<EditorState>({
    currentStepKey: initialStepKey ?? null,
    isDirty: false,
    selectedBlockId: null,
  });

  const historyRef = useRef<EditorState[]>([]);
  const futureRef = useRef<EditorState[]>([]);

  const setStep = useCallback((stepKey: string | null) => {
    setState((prev) => {
      historyRef.current.push(prev);
      futureRef.current = [];
      return { ...prev, currentStepKey: stepKey };
    });
  }, []);

  const markDirty = useCallback((dirty = true) => {
    setState((prev) => ({ ...prev, isDirty: dirty }));
  }, []);

  const selectBlock = useCallback((blockId: string | null) => {
    setState((prev) => ({ ...prev, selectedBlockId: blockId }));
  }, []);

  const clearSelection = useCallback(() => {
    setState((prev) => ({ ...prev, selectedBlockId: null }));
  }, []);

  const canUndo = historyRef.current.length > 0;
  const canRedo = futureRef.current.length > 0;

  const undo = useCallback(() => {
    if (!historyRef.current.length) return;
    setState((prev) => {
      const last = historyRef.current.pop()!;
      futureRef.current.push(prev);
      console.log('🔙 Undo: restored state', { historySize: historyRef.current.length, futureSize: futureRef.current.length });
      return last;
    });
  }, []);

  const redo = useCallback(() => {
    if (!futureRef.current.length) return;
    setState((prev) => {
      const next = futureRef.current.pop()!;
      historyRef.current.push(prev);
      console.log('🔜 Redo: restored state', { historySize: historyRef.current.length, futureSize: futureRef.current.length });
      return next;
    });
  }, []);

  return {
    state,
    setStep,
    markDirty,
    selectBlock,
    clearSelection,
    undo,
    redo,
    canUndo,
    canRedo,
  } as const;
}
