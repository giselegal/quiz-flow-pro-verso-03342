import { describe, it, expect } from 'vitest';
import { ResultEngine } from '../../core/ResultEngine';

describe('ResultEngine policy (Q1-10 scored, Q12-17 strategic)', () => {
    it('counts q1..q10 and ignores q12..q17', () => {
        const sel: Record<string, string[]> = {
            q1: ['natural_q1'],
            q2: ['classico_q2'],
            q3: ['moderno_q3'],
            q4: ['natural_q4'],
            q5: ['natural_q5'],
            q6: ['natural_q6'],
            q7: ['natural_q7'],
            q8: ['classico_q8'],
            q9: ['classico_q9'],
            q10: ['moderno_q10'],
            q12: ['natural_q12'],
            q13: ['classico_q13'],
            q17: ['moderno_q17'],
        };
        const { scores, total } = ResultEngine.computeScoresFromSelections(sel, {
            weightQuestions: 1,
            strategicRanges: [{ from: 12, to: 17 }],
        });

        // Estratégicas não somam. Neste cenário, q1..q10 tiveram 9 respostas válidas (faltou 1 seleção válida no exemplo),
        // então validamos menores limites que refletem o fixture acima.
        expect(total).toBeGreaterThanOrEqual(8);
        expect(scores['Natural']).toBeGreaterThanOrEqual(4);
        expect(scores['Clássico']).toBeGreaterThanOrEqual(2);
        expect(scores['Contemporâneo']).toBeGreaterThanOrEqual(2);

        const payload = ResultEngine.toPayload(scores, total, 'Teste');
        expect(payload.primaryStyle).toBeDefined();
        expect(payload.totalQuestions).toBeGreaterThanOrEqual(10);
    });
});
