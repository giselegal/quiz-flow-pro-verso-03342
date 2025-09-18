import { describe, it, expect } from 'vitest';
import { ResultEngine, STYLES_ORDER } from '@/services/core/ResultEngine';

describe('ResultEngine tie-break', () => {
    it('aplica ordem determinística quando há empate', () => {
        const scores = STYLES_ORDER.reduce<Record<string, number>>((acc, name) => {
            acc[name] = 10; // todos empatados
            return acc;
        }, {});
        const payload = ResultEngine.toPayload(scores, 80, 'Teste');
        expect(payload.primaryStyle).toBeDefined();
        // Primeiro deve ser o primeiro da ordem canônica
        // @ts-ignore
        expect(payload.primaryStyle.style).toBe(STYLES_ORDER[0]);
        // Ranking global deve respeitar a ordem
        // @ts-ignore
        const ordered = [payload.primaryStyle, ...payload.secondaryStyles].map((s: any) => s.style);
        expect(ordered.join(',')).toContain(STYLES_ORDER.slice(0, 3).join(','));
    });
});
