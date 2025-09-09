import { describe, it, expect } from 'vitest';
import {
    ENHANCED_BLOCK_REGISTRY,
    getEnhancedBlockComponent,
} from '@/components/editor/blocks/EnhancedBlockRegistry';
import { generateBlockDefinitions, getBlockComponent } from '@/config/enhancedBlockRegistry';

// Contrato simples:
// - Para cada definição gerada, deve existir uma entry correspondente no registry.
// - getBlockComponent(type) deve resolver para o mesmo componente do registry.
// - Fallbacks e normalizações (case/alias/prefixo) devem retornar um componente válido.

describe('enhancedBlockRegistry alignment', () => {
    it('all generated definitions map to registry and resolve to a component', () => {
        const defs = generateBlockDefinitions();
        expect(defs.length).toBeGreaterThan(0);

        for (const def of defs) {
            // Existe no registry
            expect(ENHANCED_BLOCK_REGISTRY).toHaveProperty(def.type);
            const fromRegistry = ENHANCED_BLOCK_REGISTRY[def.type];
            expect(fromRegistry).toBeTruthy();

            // getBlockComponent resolve
            const resolved = getBlockComponent(def.type);
            expect(resolved).toBeTruthy();

            // Em casos base, deve apontar para o mesmo componente
            expect(resolved).toBe(fromRegistry);

            // A definição já carrega o componente do registry
            expect(def.component).toBe(fromRegistry);
        }
    });

    it('applies prefix fallback for unknown variants (button-*, text-*, image-*)', () => {
        // Garantir que os fallbacks existem no registry
        expect(ENHANCED_BLOCK_REGISTRY['button-*']).toBeTruthy();
        expect(ENHANCED_BLOCK_REGISTRY['text-*']).toBeTruthy();
        expect(ENHANCED_BLOCK_REGISTRY['image-*']).toBeTruthy();

        const btnResolved = getBlockComponent('button-ghost');
        expect(btnResolved).toBe(ENHANCED_BLOCK_REGISTRY['button-*']);

        const textResolved = getBlockComponent('text-fancy');
        expect(textResolved).toBe(ENHANCED_BLOCK_REGISTRY['text-*']);

        const imgResolved = getBlockComponent('image-hero');
        expect(imgResolved).toBe(ENHANCED_BLOCK_REGISTRY['image-*']);
    });

    it('normalizes aliases and casing to canonical keys', () => {
        const canonical = ENHANCED_BLOCK_REGISTRY['text-inline'];
        expect(canonical).toBeTruthy();

        // Variações de casing e separadores
        expect(getBlockComponent('Text-Inline')).toBe(canonical);
        expect(getBlockComponent('TEXT_INLINE')).toBe(canonical);
        expect(getBlockComponent('textInline')).toBe(canonical);
    });
});
