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
        hm.push(1); hm.push(2); hm.push(3); hm.push(4); // 4 pushes + initial
        // Past deve conter no máximo 3 entradas
        // Não há API direta para ler tamanho; testamos via undo chain
        const vals: number[] = [];
        while (hm.canUndo()) {
            const v = hm.undo();
            if (v !== null) vals.push(v);
        }
        // Esperamos recuperar 3 valores (4,3,2) e não alcançar o inicial 0 porque limite truncou
        expect(vals).toEqual([3, 2, 1].map((_, i) => [4, 3, 2][i])); // simplificado
    });
});
