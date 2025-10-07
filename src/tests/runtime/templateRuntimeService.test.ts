import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TemplateRuntimeService } from '@/services/TemplateRuntimeService';

// Mock global fetch
const g: any = globalThis;

describe('TemplateRuntimeService', () => {
    const service = new TemplateRuntimeService('/api/runtime/quiz');

    beforeEach(() => {
        g.fetch = vi.fn();
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('getSnapshot realiza fetch correto', async () => {
        g.fetch.mockResolvedValueOnce(new Response(JSON.stringify({ id: 't1', slug: 'slug', stages: [], components: {}, logic: {}, outcomes: [], publishedAt: 'now' }), { status: 200 }));
        const snap = await service.getSnapshot('slug');
        expect(g.fetch).toHaveBeenCalledWith('/api/runtime/quiz/slug', expect.any(Object));
        expect(snap.slug).toBe('slug');
    });

    it('start envia POST e retorna sessionId', async () => {
        g.fetch.mockResolvedValueOnce(new Response(JSON.stringify({ sessionId: 's1', currentStageId: 'stage_intro' }), { status: 200 }));
        const res = await service.start('abc');
        expect(g.fetch).toHaveBeenCalled();
        expect(res.sessionId).toBe('s1');
    });

    it('answer envia payload apropriado', async () => {
        g.fetch.mockResolvedValueOnce(new Response(JSON.stringify({ nextStageId: 'stage_q1', score: 10, branched: false }), { status: 200 }));
        const res = await service.answer('slug', 'sess1', 'stage_intro', []);
        expect(res.nextStageId).toBe('stage_q1');
    });

    it('complete retorna outcome', async () => {
        g.fetch.mockResolvedValueOnce(new Response(JSON.stringify({ outcome: { id: 'out1', template: 'Ok', score: 5 } }), { status: 200 }));
        const res = await service.complete('slug', 'sess1');
        expect(res.outcome?.id).toBe('out1');
    });

    it('propaga erro HTTP não OK', async () => {
        g.fetch.mockResolvedValueOnce(new Response('Boom', { status: 500, statusText: 'ERR' }));
        await expect(service.getSnapshot('fail')).rejects.toThrow(/HTTP 500/);
    });
});
