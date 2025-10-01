import { describe, it, expect } from 'vitest';
import { mapStepToBlocks } from '../stepToBlocksMapper';
import type { CanonicalStep } from '../QuizEstiloLoaderGateway';

function mk(step: Partial<CanonicalStep> & { id: string; kind: CanonicalStep['kind'] }): CanonicalStep {
    return {
        title: 'Titulo',
        ...step
    } as CanonicalStep;
}

describe('mapStepToBlocks', () => {
    it('mapeia intro', () => {
        const blocks = mapStepToBlocks(mk({ id: 'step-1', kind: 'intro' }));
        expect(blocks[0].type).toBe('heading');
    });
    it('mapeia question', () => {
        const blocks = mapStepToBlocks(mk({ id: 'step-2', kind: 'question', options: [] }));
        expect(blocks[0].type).toBe('quiz-question-inline');
    });
    it('mapeia transition', () => {
        const blocks = mapStepToBlocks(mk({ id: 'step-12', kind: 'transition' }));
        expect(blocks[0].type).toBe('quiz-transition');
    });
    it('mapeia result', () => {
        const blocks = mapStepToBlocks(mk({ id: 'step-20', kind: 'result' }));
        expect(blocks[0].type).toBe('quiz-result');
    });
    it('mapeia offer', () => {
        const blocks = mapStepToBlocks(mk({ id: 'step-21', kind: 'offer' }));
        expect(blocks[0].type).toBe('quiz-offer');
    });
});
