import { useCallback } from 'react';
import { useEditorCore } from '@/context/EditorCoreProvider';

/**
 * useCoreBatch
 * Wrapper simples para coreActions.batch fornecendo ergonomia e métricas leves.
 */
export function useCoreBatch() {
    const { coreActions } = useEditorCore();

    const runBatch = useCallback(<T>(fn: (api: typeof coreActions) => T): T => {
        if (!coreActions?.batch) return fn(coreActions);
        let result: T | undefined;
        coreActions.batch(() => {
            result = fn(coreActions);
        });
        return result as T;
    }, [coreActions]);

    return { batch: runBatch };
}

export default useCoreBatch;
