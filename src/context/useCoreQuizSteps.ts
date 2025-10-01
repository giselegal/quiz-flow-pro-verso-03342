import { useEditorCore } from './EditorCoreProvider';
import { useMemo } from 'react';

/**
 * useCoreQuizSteps
 * Retorna steps derivados (quizSteps) + hash estrutural para permitir memoização externa.
 * Futuro: poderá incluir diffs incrementais (added/removed/updated) se necessário.
 */
export function useCoreQuizSteps() {
    const { state } = useEditorCore();
    const { quizSteps = [], stepBlocksHash } = state;

    // Expor objeto estável para evitar re-render em consumidores que só precisam do array
    const value = useMemo(() => ({ steps: quizSteps, hash: stepBlocksHash }), [quizSteps, stepBlocksHash]);
    return value;
}
