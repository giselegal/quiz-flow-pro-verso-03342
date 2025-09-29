import { describe, it, expect, beforeAll, vi } from 'vitest';
import { quizEditingService } from '@/domain/quiz/QuizEditingService';
import { eventBus } from '@/core/events/eventBus';

// Helper para aguardar microtask (assinaturas async internas)
const tick = () => new Promise(r => setTimeout(r, 0));

describe('QuizEditingService', () => {
    let initialHash: string;
    const stepId = 'step-2';

    beforeAll(async () => {
        // garantir inicialização
        await tick();
        initialHash = quizEditingService.getState().hash;
    });

    it('atualiza step e muda hash', async () => {
        quizEditingService.updateStep(stepId, { title: 'Título Teste X' });
        await tick();
        const state = quizEditingService.getState();
        expect(state.steps.find(s => s.id === stepId)?.title).toBe('Título Teste X');
        expect(state.hash).not.toBe(initialHash);
    });

    it('aplica block override e mantém step', async () => {
        const before = quizEditingService.getState().hash;
        quizEditingService.updateBlock(stepId, 0, { highlight: true });
        await tick();
        const state = quizEditingService.getState();
        const blocks = state.blocks[stepId];
        expect(blocks[0].properties.highlight).toBe(true);
        expect(state.hash).not.toBe(before);
    });

    it('aplica root override (scoring) e propaga', async () => {
        const prev = quizEditingService.getState().definition.scoring.defaultWeight;
        (quizEditingService as any).updateScoring({ defaultWeight: prev + 1 });
        await tick();
        const current = quizEditingService.getState().definition.scoring.defaultWeight;
        expect(current).toBe(prev + 1);
    });

    it('save emite quiz.overrides.persisted', async () => {
        const spy = vi.fn();
        const off = eventBus.subscribe('quiz.overrides.persisted' as any, () => spy());
        quizEditingService.save();
        await tick();
        off();
        expect(spy).toHaveBeenCalled();
    });

    it('aplica root override (progress) rebuild completo', async () => {
        const before = { ...(quizEditingService.getState().definition.progress as any) };
        (quizEditingService as any).updateProgress({ totalSteps: (before.totalSteps || 0) + 1 });
        await tick();
        const after = quizEditingService.getState().definition.progress as any;
        expect(after.totalSteps).toBe((before.totalSteps || 0) + 1);
    });

    it('aplica root override (offerMapping)', async () => {
        const before = { ...(quizEditingService.getState().definition.offerMapping as any) };
        (quizEditingService as any).updateOfferMapping({ primaryOfferId: 'OFFER_TEST' });
        await tick();
        const after = quizEditingService.getState().definition.offerMapping as any;
        expect(after.primaryOfferId).toBe('OFFER_TEST');
        // preserva outras chaves
        Object.keys(before).forEach(k => {
            if (k !== 'primaryOfferId') expect(after[k]).toBe(before[k]);
        });
    });

    it('rebuild seletivo em updateStep publica changedSteps e não recria blocks de outro step', async () => {
        const anotherStep = quizEditingService.getState().steps.find(s => s.id !== stepId)!;
        const blocksBefore = quizEditingService.getState().blocks[anotherStep.id];
        const reloadSpy = vi.fn();
        const off = eventBus.subscribe('quiz.definition.reload' as any, (e: any) => reloadSpy(e));
        quizEditingService.updateStep(stepId, { title: 'Título Y' });
        await tick();
        off();
        const calls = reloadSpy.mock.calls.filter(c => c[0]?.changedSteps);
        expect(calls.length).toBeGreaterThan(0);
        const lastCall = calls[calls.length - 1];
        const lastEvent = lastCall && lastCall[0];
        expect(lastEvent?.changedSteps).toContain(stepId);
        // blocks de anotherStep devem ser mesma referência (não rebuild completo)
        const blocksAfter = quizEditingService.getState().blocks[anotherStep.id];
        expect(blocksAfter).toBe(blocksBefore);
    });

    it('publish emite version.published', async () => {
        const spy = vi.fn();
        const off = eventBus.subscribe('version.published' as any, (e: any) => spy(e));
        quizEditingService.publish();
        await tick();
        off();
        expect(spy).toHaveBeenCalled();
        const publishCalls = spy.mock.calls;
        const evt = publishCalls[publishCalls.length - 1]?.[0];
        expect(evt?.version).toBe(quizEditingService.getState().hash);
    });

    it('save no-op quando não dirty não emite persisted', async () => {
        // garantir estado limpo
        if (quizEditingService.isDirty()) quizEditingService.save();
        await tick();
        const spy = vi.fn();
        const off = eventBus.subscribe('quiz.overrides.persisted' as any, () => spy());
        quizEditingService.save(); // sem mudanças
        await tick();
        off();
        expect(spy).not.toHaveBeenCalled();
    });
});
