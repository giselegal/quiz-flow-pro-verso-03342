// Hook leve de estado do editor (Fase 1.3)
// Próximos incrementos: desfazer/refazer, seleção, dirty-state, persistência.
import { useCallback, useMemo, useRef, useState } from 'react';

export type EditorState = {
  currentStepKey: string | null;
  isDirty: boolean;
};

export function useEditorState(initialStepKey?: string) {
  const [state, setState] = useState<EditorState>({
    currentStepKey: initialStepKey ?? null,
    isDirty: false,
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

  const canUndo = useMemo(() => historyRef.current.length > 0, []);
  const canRedo = useMemo(() => futureRef.current.length > 0, []);

  const undo = useCallback(() => {
    if (!historyRef.current.length) return;
    setState((prev) => {
      const last = historyRef.current.pop()!;
      futureRef.current.push(prev);
      return last;
    });
  }, []);

  const redo = useCallback(() => {
    if (!futureRef.current.length) return;
    setState((prev) => {
      const next = futureRef.current.pop()!;
      historyRef.current.push(prev);
      return next;
    });
  }, []);

  return {
    state,
    setStep,
    markDirty,
    undo,
    redo,
    canUndo,
    canRedo,
  } as const;
}
