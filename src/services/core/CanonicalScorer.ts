import type { CanonicalQuiz, CanonicalQuestion } from '@/types/quizCanonical';

export type Answers = Record<string, string[]>; // questionId -> optionIds
export type ScoreTotals = Record<string, number>;

export function validateSelection(q: CanonicalQuestion, selected: string[]): boolean {
    const count = selected.length;
    if (typeof q.requiredSelections === 'number') return count === q.requiredSelections;
    if (typeof q.minSelections === 'number' && count < q.minSelections) return false;
    if (typeof q.maxSelections === 'number' && count > q.maxSelections) return false;
    return true;
}

export function accumulateScores(quiz: CanonicalQuiz, answers: Answers): ScoreTotals {
    const totals: ScoreTotals = {};
    for (const q of quiz.questions) {
        const picks = answers[q.id] ?? [];
        if (!validateSelection(q, picks)) continue;
        if (q.kind !== 'scored') continue;

        const byId = new Map(q.options.map(o => [o.id, o] as const));
        for (const oid of picks) {
            const opt = byId.get(oid);
            if (!opt || !opt.score) continue;
            for (const [style, pts] of Object.entries(opt.score)) {
                totals[style] = (totals[style] || 0) + (typeof pts === 'number' ? pts : 0);
            }
        }
    }
    return totals;
}
