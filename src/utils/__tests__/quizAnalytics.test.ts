import { describe, it, expect, beforeEach } from 'vitest';
import { emitQuizEvent, getQuizEvents, clearQuizEvents, getQuizMetrics, flushQuizEvents } from '../quizAnalytics';

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

    it('flush remove eventos enviados', async () => {
        emitQuizEvent({ type: 'step_view', stepId: 'a', stepType: 'intro', position: 0 });
        emitQuizEvent({ type: 'step_view', stepId: 'b', stepType: 'question', position: 1 });
        mockFetch();
        const res = await flushQuizEvents({ endpoint: 'https://api.test/quiz-events', batchSize: 1 });
        expect(res.flushed).toBe(2);
        expect(getQuizEvents().length).toBe(0);
    });
});
