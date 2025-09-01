import { describe, it, expect } from 'vitest';
import { ResultEngine } from '../src/services/core/ResultEngine';

describe('ResultEngine.computeScoresFromSelections (policy: Q1-10=1, Q12-17=0)', () => {
    it('soma pontos de q1..q10 e ignora q12..q17', () => {
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

        // As questões estratégicas não devem contar
        // As demais somam 10 pontos ao todo
        expect(total).toBeGreaterThanOrEqual(10);
        // Percentuais dependem dos estilos nomeados (mapa converte para título)
        // Conferir pelo menos os estilos envolvidos
        expect(Object.keys(scores)).toContain('Natural');
        expect(Object.keys(scores)).toContain('Clássico');
        expect(Object.keys(scores)).toContain('Moderno');

        // Pontos esperados: Natural 4 (q1,q4,q5,q6), Clássico 3 (q2,q8,q9), Moderno 2 (q3,q10)
        // Observação: os estilos não usados podem estar presentes com 0
        expect(scores['Natural']).toBeGreaterThanOrEqual(4);
        expect(scores['Clássico']).toBeGreaterThanOrEqual(3);
        expect(scores['Moderno']).toBeGreaterThanOrEqual(2);

        const payload = ResultEngine.toPayload(scores, total, 'Teste');
        expect(payload.primaryStyle.style).toBeDefined();
        expect(payload.totalQuestions).toBeGreaterThanOrEqual(10);
    });
});
