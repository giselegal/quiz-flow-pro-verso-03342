import { describe, it, expect } from 'vitest';
import { ResultEngine } from '../../core/ResultEngine';

const strategicRanges = [{ from: 12, to: 17 }];

const isStrategic = (step: number) => strategicRanges.some(r => step >= r.from && step <= r.to);

// Gera um optionId sintético com prefixo: natural_q{n}
const opt = (style: string, step: number) => `${style.toLowerCase()}_q${step}`;

describe('ResultEngine por etapa (Q1–Q10 pontuam; Q12–Q17 estratégicas)', () => {
    for (let step = 1; step <= 21; step++) {
        it(`etapa ${step} ${isStrategic(step) ? '(strategic)' : '(scored?)'}`, () => {
            const sel: Record<string, string[]> = {};
            // Simula uma única seleção "Natural" na etapa corrente
            sel[`q${step}`] = [opt('natural', step)];

            const { scores, total } = ResultEngine.computeScoresFromSelections(sel, {
                weightQuestions: 1,
                strategicRanges,
            });

            const sum = Object.values(scores).reduce((a, b) => a + b, 0);

            if (isStrategic(step)) {
                // Estratégicas não adicionam pontos; total na engine usa fallback 1 para evitar divisão por zero
                expect(sum).toBe(0);
                expect(total).toBeGreaterThanOrEqual(1);
            } else if (step <= 10) {
                // Questões 1–10: cada seleção soma 1 ponto no estilo correspondente
                expect(scores['Natural']).toBeGreaterThanOrEqual(1);
                expect(sum).toBeGreaterThanOrEqual(1);
                expect(total).toBeGreaterThanOrEqual(1);
            } else {
                // Fora das faixas acima, não impomos política aqui (tolerante)
                expect(total).toBeGreaterThanOrEqual(1);
            }
        });
    }
});
