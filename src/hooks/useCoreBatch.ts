import { useCallback } from 'react';
import { useEditorCore } from '@/context/EditorCoreProvider';

/**
 * useCoreBatch
 * Wrapper simples para coreActions.batch fornecendo ergonomia e métricas leves.
 */
export function useCoreBatch() {
  const { coreActions } = useEditorCore();

  const runBatch = useCallback(<T>(fn: (api: typeof coreActions) => T): T | void => {
    if (!coreActions?.batch) return fn(coreActions);
    let result: T | void;
    coreActions.batch(draft => {
      // Expondo API de alto nível via mutações diretas ou reutilizando coreActions.
      // Como draft é Record<string, any[]>, permitimos manipulação direta se necessário.
      result = fn(coreActions);
    });
    return result;
  }, [coreActions]);

  return { batch: runBatch };
}

export default useCoreBatch;
