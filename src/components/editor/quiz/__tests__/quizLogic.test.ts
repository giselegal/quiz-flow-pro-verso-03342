import { describe, it, expect, beforeEach, vi } from 'vitest';
import { computeResultAdvanced, selectOfferCandidate, detectCycle, persistResultPayload, persistOffer } from '../quizLogic';

// Mock para localStorage em ambiente de teste
function mockLocalStorage() {
    const store: Record<string, string> = {};
    return {
        getItem: (k: string) => (k in store ? store[k] : null),
        setItem: (k: string, v: string) => { store[k] = v; },
        removeItem: (k: string) => { delete store[k]; },
        clear: () => { Object.keys(store).forEach(k => delete store[k]); },
        _dump: () => store
    } as Storage & { _dump: () => Record<string, string> };
}

const baseQuestion = (id: string, questionNumber?: string) => ({
    id,
    type: 'question' as const,
    questionNumber,
    questionText: 'Q',
    requiredSelections: 1,
    options: [{ id: 'A', text: 'A' }, { id: 'B', text: 'B' }, { id: 'C', text: 'C' }],
    nextStep: undefined
});

describe('computeResultAdvanced', () => {
    it('retorna primary undefined quando sem respostas', () => {
        const steps = [baseQuestion('q1')];
        const res = computeResultAdvanced(steps as any, {});
        expect(res.primary).toBeUndefined();
        expect(res.secondary).toEqual([]);
    });

    it('aplica multiplicador de questionNumber (x2)', () => {
        const steps = [baseQuestion('q1', '1 de 3 (x2)')];
        const res = computeResultAdvanced(steps as any, { q1: ['A'] });
        expect(res.scores['A'].total).toBe(2);
    });

    it('desempata por diversidade de steps', () => {
        const steps = [baseQuestion('q1'), baseQuestion('q2')];
        const answers = { q1: ['A'], q2: ['A', 'B'] }; // A aparece em 2 steps, B somente em 1
        const res = computeResultAdvanced(steps as any, answers);
        expect(res.primary).toBe('A');
    });
});

describe('selectOfferCandidate', () => {
    const offerMap = {
        A: { title: 'Oferta A' },
        B: { title: 'Oferta B' },
        X: { title: 'Estratégica X' }
    };

    it('prioriza primary', () => {
        const chosen = selectOfferCandidate(offerMap, 'A', ['B']);
        expect(chosen?.title).toBe('Oferta A');
    });

    it('usa secondary caso primary não exista', () => {
        const chosen = selectOfferCandidate(offerMap, 'Z', ['B']);
        expect(chosen?.title).toBe('Oferta B');
    });

    it('usa resposta estratégica final se estilos não encontrados', () => {
        const chosen = selectOfferCandidate(offerMap, 'Z', ['Y'], { s1: 'X' });
        expect(chosen?.title).toBe('Estratégica X');
    });

    it('fallback primeira oferta', () => {
        const chosen = selectOfferCandidate({ A: { t: 1 }, B: { t: 2 } }, undefined, [], {});
        expect(chosen).toBeTruthy();
    });
});

describe('detectCycle', () => {
    it('detecta ciclo simples', () => {
        const steps = [
            { id: 'A', nextStep: 'B' },
            { id: 'B', nextStep: 'A' }
        ];
        const rep = detectCycle(steps);
        expect(rep.hasCycle).toBe(true);
        expect(rep.path.length).toBeGreaterThan(0);
    });

    it('sem ciclo retorna hasCycle false', () => {
        const steps = [
            { id: 'A', nextStep: 'B' },
            { id: 'B', nextStep: 'C' },
            { id: 'C', nextStep: undefined }
        ];
        const rep = detectCycle(steps);
        expect(rep.hasCycle).toBe(false);
    });
});

describe('persistência', () => {
    let ls: any;
    beforeEach(() => {
        ls = mockLocalStorage();
        // @ts-ignore
        global.localStorage = ls;
    });

    it('persistResultPayload salva dados básicos', () => {
        const ok = persistResultPayload('User', 'A', ['B']);
        expect(ok).toBe(true);
        const raw = ls.getItem('quizResultPayload');
        expect(raw).toBeTruthy();
        const parsed = JSON.parse(raw);
        expect(parsed.primaryStyle).toBe('A');
        expect(parsed.secondaryStyles).toEqual(['B']);
    });

    it('persistOffer salva oferta', () => {
        const ok = persistOffer({ title: 'Oferta A' });
        expect(ok).toBe(true);
        const parsed = JSON.parse(ls.getItem('quizSelectedOffer'));
        expect(parsed.title).toBe('Oferta A');
    });
});
