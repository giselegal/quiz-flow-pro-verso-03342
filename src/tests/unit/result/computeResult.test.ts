import { describe, it, expect } from 'vitest';
import { computeResult } from '@/utils/result/computeResult';

describe('computeResult (basic)', () => {
    it('retorna fallback consistente quando não há respostas', () => {
        const res = computeResult({ answers: {} });
        expect(res.primaryStyleId).toBeTruthy();
        expect(Object.values(res.scores).every(v => v === 0)).toBe(true);
        expect(res.totalAnswers).toBe(0);
    });

    it('acumula pontos corretamente para um único estilo', () => {
        const res = computeResult({ answers: { 'step-02': ['natural', 'natural', 'natural'] } });
        expect(res.scores.natural).toBe(3);
        expect(res.primaryStyleId).toBe('natural');
        expect(res.secondaryStyleIds).not.toContain('natural');
    });

    it('ordena e calcula secundários', () => {
        const res = computeResult({ answers: { 'step-02': ['natural', 'classico', 'classico'] } });
        expect(res.primaryStyleId).toBe('classico');
        expect(res.secondaryStyleIds[0]).toBe('natural');
    });

    it('calcula porcentagens aproximadas', () => {
        const res = computeResult({ answers: { 'step-02': ['natural', 'classico', 'classico'] } });
        const pctNatural = res.percentages.natural;
        const pctClassico = res.percentages.classico;
        expect(Math.round(pctNatural + pctClassico)).toBe(100); // Como só dois estilos com pontos
    });
});
