import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QuizFunnelEditingFacade, type FunnelSnapshot } from '@/editor/facade/FunnelEditingFacade';

const baseSnapshot: FunnelSnapshot = {
    steps: [
        { id: 's1', title: 'Intro', order: 0, blocks: [], meta: { type: 'intro', nextStep: 's2' } },
        { id: 's2', title: 'Pergunta', order: 1, blocks: [], meta: { type: 'question', nextStep: '' } }
    ],
    meta: { id: 'funnel-1', templateId: 'quiz-estilo', updatedAt: Date.now() }
};

describe('QuizFunnelEditingFacade (smoke)', () => {
    let persistSpy: ReturnType<typeof vi.fn>;
    beforeEach(() => {
        persistSpy = vi.fn(async () => { });
    });

    it('inicia com steps ordenados e seleção do primeiro', () => {
        const facade = new QuizFunnelEditingFacade(baseSnapshot, persistSpy);
        expect(facade.getSteps().map(s => s.id)).toEqual(['s1', 's2']);
        expect(facade.getSelectedStep()?.id).toBe('s1');
        expect(facade.isDirty()).toBe(false);
    });

    it('adiciona e remove step marcando dirty e emitindo eventos', () => {
        const facade = new QuizFunnelEditingFacade(baseSnapshot, persistSpy);
        let stepsChanged = 0;
        facade.on('steps/changed', () => { stepsChanged++; });
        const added = facade.addStep({ id: 's3', title: 'Nova', blocks: [], order: 10 });
        expect(added.id).toBe('s3');
        expect(facade.isDirty()).toBe(true);
        expect(facade.getSteps().length).toBe(3);
        facade.removeStep('s3');
        expect(facade.getSteps().length).toBe(2);
        expect(stepsChanged).toBeGreaterThanOrEqual(2);
    });

    it('atualiza step e bloco', () => {
        const facade = new QuizFunnelEditingFacade(baseSnapshot, persistSpy);
        facade.updateStep('s1', { title: 'Intro Editado' });
        expect(facade.getStep('s1')?.title).toBe('Intro Editado');
        const blk = facade.addBlock('s1', { type: 'text', data: { value: 'Hello' } })!;
        expect(blk.type).toBe('text');
        facade.updateBlock('s1', blk.id, { data: { value: 'World' } });
        expect(facade.getStep('s1')?.blocks[0].data.value).toBe('World');
    });

    it('reordena steps e blocks', () => {
        const facade = new QuizFunnelEditingFacade(baseSnapshot, persistSpy);
        facade.addStep({ id: 's3', title: 'Terceiro', blocks: [], order: 2 });
        facade.reorderSteps(['s2', 's1', 's3']);
        expect(facade.getSteps().map(s => s.id)).toEqual(['s2', 's1', 's3']);
        const blkA = facade.addBlock('s2', { type: 'text', data: {} })!;
        const blkB = facade.addBlock('s2', { type: 'image', data: {} })!;
        facade.reorderBlocks('s2', [blkB.id, blkA.id]);
        const reordered = facade.getStep('s2')!.blocks.map(b => b.id);
        expect(reordered).toEqual([blkB.id, blkA.id]);
    });

    it('executa save chamando persistFn e limpa dirty', async () => {
        const facade = new QuizFunnelEditingFacade(baseSnapshot, persistSpy);
        facade.addStep({ id: 'sX', title: 'Temp', blocks: [] });
        expect(facade.isDirty()).toBe(true);
        await facade.save();
        expect(persistSpy).toHaveBeenCalledTimes(1);
        expect(facade.isDirty()).toBe(false);
    });
});
