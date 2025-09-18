import { describe, it, expect } from 'vitest';
import { funnelTemplates } from '@/config/funnelTemplates';
import { cloneFunnelTemplate, deepClone } from '@/utils/cloneFunnel';

// Testa se duas instâncias clonadas não compartilham referências mutáveis

describe('cloneFunnelTemplate', () => {
    it('cria instâncias com IDs diferentes e blocos independentes', () => {
        const base = funnelTemplates[0];
        const a = cloneFunnelTemplate(base, 'Instância A');
        const b = cloneFunnelTemplate(base, 'Instância B');

        expect(a.id).not.toBe(b.id);
        expect(a.blocks.length).toBeGreaterThan(0);
        expect(a.blocks.length).toBe(b.blocks.length);

        // Alterar um bloco em A não altera B
        a.blocks[0].properties.title = 'Novo Título A';
        expect(b.blocks[0].properties.title).not.toBe('Novo Título A');
    });

    it('deepClone cria cópia independente', () => {
        const obj = { x: 1, nested: { y: 2 } };
        const c = deepClone(obj);
        c.nested.y = 999;
        expect(obj.nested.y).toBe(2);
    });
});
