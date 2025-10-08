import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLiveScoring } from '@/hooks/useLiveScoring';

describe('useLiveScoring', () => {
    it('agrega scores corretamente', () => {
        const scoringMap = {
            blk1: {
                optA: { classico: 2, urbano: 1 },
                optB: { urbano: 3 }
            },
            blk2: {
                optX: { classico: 5 }
            }
        } as any;
        const { result, rerender } = renderHook(({ selections }) => useLiveScoring({ selections, scoringMap }), {
            initialProps: { selections: { blk1: ['optA'], blk2: ['optX'] } }
        });
        expect(result.current.scores.classico).toBe(7);
        expect(result.current.scores.urbano).toBe(1);
        expect(result.current.topStyle).toBe('classico');

        // Atualiza seleções
        rerender({ selections: { blk1: ['optB'], blk2: [] } });
        expect(result.current.scores.urbano).toBe(3);
        expect(result.current.topStyle).toBe('urbano');
    });
});
