import { QuizDefinition, StyleId, styleIds } from './types';

export type StyleScores = Record<StyleId, number>;

export function emptyScores(): StyleScores {
    return styleIds.reduce((acc, id) => { (acc as any)[id] = 0; return acc; }, {} as StyleScores);
}

interface ComputeScoresParams {
    def: QuizDefinition;
    answers: Record<string, string[]>; // stepId -> option ids
}

/**
 * Computa pontuações cumulativas considerando:
 * - Apenas steps type=question
 * - Cada seleção soma weight (defaultWeight ou weight da option)
 * - Futuro: def.scoring.perStep pode customizar (placeholder já previsto)
 */
export function computeScores({ def, answers }: ComputeScoresParams): StyleScores {
    const scores = emptyScores();
    const defaultWeight = def.scoring.defaultWeight;

    def.steps.filter(s => s.type === 'question').forEach(step => {
        const selections = answers[step.id];
        if (!selections) return;
        selections.forEach(selId => {
            // weight base
            const option = (step as any).options?.find((o: any) => o.id === selId);
            const weight = option?.weight ?? defaultWeight;
            if (selId in scores) {
                (scores as any)[selId] += weight;
            }
        });
    });

    return scores;
}
