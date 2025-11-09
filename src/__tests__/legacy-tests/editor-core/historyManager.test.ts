import { describe, it, expect } from 'vitest';
import { HistoryManager } from '@/utils/historyManager';

describe('HistoryManager', () => {
    it('realiza push e undo/redo básico', () => {
        const hm = new HistoryManager<number>(0);
        hm.push(1);
        hm.push(2);
        expect(hm.canUndo()).toBe(true);
        const u1 = hm.undo();
        expect(u1).toBe(1);
        const u2 = hm.undo();
        expect(u2).toBe(0);
        expect(hm.canUndo()).toBe(false);
        const r1 = hm.redo();
        expect(r1).toBe(1);
        const r2 = hm.redo();
        expect(r2).toBe(2);
        expect(hm.canRedo()).toBe(false);
    });

    it('limita histórico ao limite configurado', () => {
        const hm = new HistoryManager<number>(0, { limit: 3 });
        hm.push(1); hm.push(2); hm.push(3); hm.push(4);
        // Undo chain deve retornar apenas os 3 estados anteriores ao presente (3,2,1) — 0 caiu do buffer
        const vals: number[] = [];
        while (hm.canUndo()) {
            const v = hm.undo();
            if (v !== null) vals.push(v);
        }
        expect(vals).toEqual([3, 2, 1]);
    });
});
