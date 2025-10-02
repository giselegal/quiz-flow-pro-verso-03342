import { describe, it, expect, beforeEach } from 'vitest';
import { emitQuizEvent, getQuizEvents, clearQuizEvents, getQuizMetrics, flushQuizEvents, flushQuizEventsWithRetry } from '../quizAnalytics';

function mockFetch(success = true) {
    // @ts-ignore
    global.fetch = async () => {
        if (!success) throw new Error('fail');
        return { ok: true } as any;
    };
}

describe('quizAnalytics', () => {
    beforeEach(() => {
        clearQuizEvents();
    });

    it('valida e persiste step_view', () => {
        emitQuizEvent({ type: 'step_view', stepId: 's1', stepType: 'intro', position: 0 });
        const evts = getQuizEvents();
        expect(evts.length).toBe(1);
        expect(evts[0].type).toBe('step_view');
    });

    it('descarta evento inválido', () => {
        // missing stepId
        emitQuizEvent({ type: 'step_view', stepType: 'intro', position: 1 });
        expect(getQuizEvents().length).toBe(0);
    });

    it('calcula métricas básicas', () => {
        emitQuizEvent({ type: 'step_view', stepId: 'a', stepType: 'intro', position: 0 });
        emitQuizEvent({ type: 'result_compute', primary: 'estilo1', answersCount: 5 });
        emitQuizEvent({ type: 'offer_view', offerKey: 'estilo1' });
        emitQuizEvent({ type: 'cta_click', offerKey: 'estilo1', url: 'https://x.com' });
        const m = getQuizMetrics();
        expect(m.totalSteps).toBe(1);
        expect(m.totalResultComputes).toBe(1);
        expect(m.totalOffers).toBe(1);
        expect(m.totalCtaClicks).toBe(1);
    });

    it('enriquece com userId e conta distinctUsers', () => {
        // mock userProfile
        // @ts-ignore
        global.localStorage = {
            store: {} as Record<string, string>,
            getItem(k: string) { return this.store[k] || null; },
            setItem(k: string, v: string) { this.store[k] = v; },
            removeItem(k: string) { delete this.store[k]; }
        };
        localStorage.setItem('userProfile', JSON.stringify({ userId: 'user-123' }));
        emitQuizEvent({ type: 'step_view', stepId: 'a', stepType: 'intro', position: 0 });
        // second user
        localStorage.setItem('userProfile', JSON.stringify({ userId: 'user-456' }));
        emitQuizEvent({ type: 'result_compute', primary: 'x', answersCount: 2 });
        const evts = getQuizEvents();
        expect(evts.every(e => e.userId)).toBe(true);
        const m = getQuizMetrics();
        expect(m.distinctUsers).toBe(2);
    });

    it('flush com retry/backoff envia batches mesmo após falhas iniciais', async () => {
        clearQuizEvents();
        for (let i = 0; i < 3; i++) emitQuizEvent({ type: 'step_view', stepId: 's' + i, stepType: 'q', position: i });
        let call = 0;
        // @ts-ignore
        global.fetch = async () => {
            call++;
            if (call < 2) return { ok: false, status: 500 }; // primeira tentativa falha
            return { ok: true, status: 200 };
        };
        const res = await flushQuizEventsWithRetry({ endpoint: 'https://api.test/quiz-events', batchSize: 2, maxRetries: 3, backoffBaseMs: 1 });
        expect(res.flushed).toBeGreaterThan(0);
    });

    it('flush remove eventos enviados', async () => {
        emitQuizEvent({ type: 'step_view', stepId: 'a', stepType: 'intro', position: 0 });
        emitQuizEvent({ type: 'step_view', stepId: 'b', stepType: 'question', position: 1 });
        mockFetch();
        const res = await flushQuizEvents({ endpoint: 'https://api.test/quiz-events', batchSize: 1 });
        expect(res.flushed).toBe(2);
        expect(getQuizEvents().length).toBe(0);
    });
});
