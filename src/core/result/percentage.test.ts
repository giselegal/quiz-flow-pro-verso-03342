import { describe, it, expect } from 'vitest';
import { computeEffectivePrimaryPercentage } from './percentage';

describe('result/percentage', () => {
    it('usa fallback quando válido', () => {
        expect(computeEffectivePrimaryPercentage({ score: 5 }, [{ score: 5 }], 70)).toBe(70);
    });

    it('calcula por score quando fallback é 0 e há scores', () => {
        expect(computeEffectivePrimaryPercentage({ score: 3 }, [{ score: 1 }, { score: 1 }], 0)).toBe(60);
    });

    it('usa restante até 100 quando só há percentuais secundários', () => {
        expect(computeEffectivePrimaryPercentage({}, [{ percentage: 20 }, { percentage: 30 }], 0)).toBe(50);
    });

    it('retorna 0 quando não há dados suficientes', () => {
        expect(computeEffectivePrimaryPercentage({}, [], 0)).toBe(0);
    });
});
