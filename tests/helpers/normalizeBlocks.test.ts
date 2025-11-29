import { describe, it, expect } from 'vitest';
import { extractBlocksFromStepData } from '@/components/editor/quiz/QuizModularEditor/helpers/normalizeBlocks';

describe('extractBlocksFromStepData', () => {
    it('should parse array directly', () => {
        const arr = [{ id: 'a', type: 't' }, { id: 'b', type: 't2' }];
        expect(extractBlocksFromStepData(arr, 'step-01')).toHaveLength(2);
    });

    it('should parse { blocks: [...] }', () => {
        const raw = { blocks: [{ id: 'x', type: 't' }] };
        expect(extractBlocksFromStepData(raw, 'step-01')).toHaveLength(1);
    });

    it('should parse nested steps object', () => {
        const raw = { steps: { 'step-01': { blocks: [{ id: 's1', type: 't' }] } } };
        expect(extractBlocksFromStepData(raw, 'step-01')).toHaveLength(1);
    });

    it('should support steps array with id matching', () => {
        const raw = { steps: [{ id: 'step-02', blocks: [{ id: 's2', type: 't2' }] }] };
        expect(extractBlocksFromStepData(raw, 'step-02')).toHaveLength(1);
    });

    it('should return empty array for unknown shapes', () => {
        const raw = { unexpected: true };
        expect(extractBlocksFromStepData(raw, 'step-01')).toEqual([]);
    });
});
