import { useMemo } from 'react';
import { mapEditorBlocksToQuizSteps } from '@/utils/mapEditorBlocksToQuizSteps';

interface UseRuntimeStepsParams {
    coreV2: boolean;
    coreQuiz: any;
    unifiedEditor: any;
    coreCtx?: any;
}

/**
 * useRuntimeSteps
 * Centraliza a derivação da lista de steps que alimenta:
 *  - Preview em tempo real (RealExperienceCanvas)
 *  - Badge de contagem de steps
 *  - Potenciais exportações / análises
 * Regras:
 *  - Se Core V2 ativo, usar steps vindos de coreQuiz
 *  - Caso contrário, tenta mapear stepBlocks legado para quiz steps
 */
export function useRuntimeSteps({ coreV2, coreQuiz, unifiedEditor }: UseRuntimeStepsParams) {
    return useMemo(() => {
        if (coreV2 && coreQuiz) {
            const steps = Array.isArray(coreQuiz.steps) ? coreQuiz.steps : [];
            return steps;
        }
        const sb = unifiedEditor?.state?.stepBlocks;
        const isPlainObject = sb && typeof sb === 'object' && !Array.isArray(sb);
        if (isPlainObject) {
            try {
                return mapEditorBlocksToQuizSteps(sb);
            } catch (e) {
                console.warn('[useRuntimeSteps][Legacy] Falha ao mapear stepBlocks -> quiz steps', e);
            }
        }
        return [] as any[];
    }, [coreV2, coreQuiz?.hash, unifiedEditor]);
}

export default useRuntimeSteps;