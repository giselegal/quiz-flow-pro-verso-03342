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

describe('computeResult (scoring config)', () => {
    it('aplica pesos por estilo corretamente', () => {
        // natural e classico com a mesma contagem de seleções, mas natural com peso maior
        const answers = { 'step-02': ['natural', 'classico'] } as Record<string, string[]>;
        const scoring = { weights: { natural: 2, classico: 1 } } as any;
        const res = computeResult({ answers, scoring });
        expect(res.scores.natural).toBe(2);
        expect(res.scores.classico).toBe(1);
        expect(res.primaryStyleId).toBe('natural');
    });

    it('desempata com natural-first quando configurado', () => {
        const answers = { 'step-02': ['natural', 'classico'] } as Record<string, string[]>;
        // sem pesos, fica 1x1; empata
        const scoring = { tieBreak: 'natural-first' } as any;
        const res = computeResult({ answers, scoring });
        expect(res.scores.natural).toBe(1);
        expect(res.scores.classico).toBe(1);
        expect(res.primaryStyleId).toBe('natural');
    });

    it('tieBreak random retorna um dos estilos empatados (não garante determinismo)', () => {
        const answers = { 'step-02': ['natural', 'classico'] } as Record<string, string[]>;
        const scoring = { tieBreak: 'random' } as any;
        const res = computeResult({ answers, scoring });
        expect(['natural', 'classico']).toContain(res.primaryStyleId);
    });

    it('tieBreak first preserva ordem de inserção quando empata (ex.: dramatico vs contemporaneo)', () => {
        // Ambos recebem 1 ponto. Em alphabetical, 'contemporaneo' vem antes de 'dramatico'.
        // Em 'first', deve manter a ordem de inserção (aliases: 'romantico', 'dramatico', 'contemporaneo'), então 'dramatico' vence.
        const answers = { 'step-02': ['dramatico', 'contemporaneo'] } as Record<string, string[]>;
        const resFirst = computeResult({ answers, scoring: { tieBreak: 'first' } as any });
        expect(resFirst.scores.dramatico).toBe(1);
        expect(resFirst.scores.contemporaneo).toBe(1);
        expect(resFirst.primaryStyleId).toBe('dramatico');

        const resAlpha = computeResult({ answers, scoring: { tieBreak: 'alphabetical' } as any });
        expect(resAlpha.primaryStyleId).toBe('contemporaneo');
    });
});
