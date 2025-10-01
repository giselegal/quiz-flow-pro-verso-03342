import { useMemo } from 'react';

interface UseDerivedStepsParams {
    quizBridge: any;
    unifiedEditor: any;
}

/**
 * useDerivedSteps
 * Unifica a lógica que calcula os steps mostrados na sidebar.
 * Ordem de precedência:
 *  1. Se quizBridge ativo e possui steps → usar passos do quiz (modo quiz-sync)
 *  2. Caso contrário, se unifiedEditor.stepBlocks (array) → mapear blocks
 *  3. Fallback: lista vazia
 */
export function useDerivedSteps({ quizBridge, unifiedEditor }: UseDerivedStepsParams) {
    return useMemo(() => {
        const quizSteps: any[] = quizBridge?.steps || [];
        if (quizBridge?.active && quizSteps.length) {
            return quizSteps.map((s: any, idx: number) => ({
                id: s.id || s.key || `step-${idx}`,
                label: s.title || s.id || s.key || `Step ${idx + 1}`,
                type: s.type || 'unknown'
            }));
        }
        if (unifiedEditor?.stepBlocks?.length) {
            return unifiedEditor.stepBlocks.map((b: any, idx: number) => ({
                id: b.id || `block-${idx}`,
                label: b.type || `Block ${idx + 1}`,
                type: b.type || 'block'
            }));
        }
        return [] as any[];
    }, [quizBridge?.active, quizBridge?.steps, unifiedEditor?.stepBlocks]);
}

export default useDerivedSteps;