/**
 * Utilitário para preencher automaticamente campos nextStep ausentes
 * em uma lista ordenada de etapas.
 */
export interface StepLike {
    id: string;
    order: number;
    nextStep?: string;
    [key: string]: any;
}

export interface AutoFillResult<T extends StepLike> {
    steps: T[];
    adjusted: boolean;
    filledCount: number;
}

export function autoFillNextSteps<T extends StepLike>(input: T[]): AutoFillResult<T> {
    if (!Array.isArray(input) || input.length === 0) {
        return { steps: [...input], adjusted: false, filledCount: 0 };
    }
    const stepsSorted = [...input].sort((a, b) => a.order - b.order);
    let adjusted = false;
    let filledCount = 0;
    const result: T[] = stepsSorted.map((s, idx) => {
        if (!s.nextStep && idx < stepsSorted.length - 1) {
            adjusted = true;
            filledCount++;
            return { ...s, nextStep: stepsSorted[idx + 1].id };
        }
        return { ...s };
    });
    return { steps: result, adjusted, filledCount };
}

export default autoFillNextSteps;
