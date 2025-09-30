import { describe, it, expect } from 'vitest';
import { convertTemplateToEditorBlocks } from '@/pages/editor/modern/logic/templateConversion';

describe('template conversion round-trip', () => {
    it('reconstroi estrutura por steps a partir dos blocos convertidos', () => {
        const original = {
            'step-1': [{ id: 'x', type: 'text-inline', content: { t: 1 } }],
            'step-2': [{ id: 'y', type: 'quiz-option', properties: { label: 'Y' } }, { id: 'z', type: 'text-inline' }]
        } as Record<string, any[]>;

        const blocks = convertTemplateToEditorBlocks(original);

        // Reconstrução (round-trip simplificado)
        const reconstructed: Record<string, any[]> = {};
        for (const b of blocks) {
            if (!reconstructed[b.stepId]) reconstructed[b.stepId] = [];
            // Remover prefixo step-X- do id reconstruído
            const originalId = b.id.replace(`${b.stepId}-`, '');
            reconstructed[b.stepId].push({ id: originalId, type: b.type, content: b.content, properties: b.properties });
        }

        // Checar que todos os steps originais apareceram
        expect(Object.keys(reconstructed).sort()).toEqual(Object.keys(original).sort());

        // Verificar contagem de blocos por step
        for (const step of Object.keys(original)) {
            expect(reconstructed[step].length).toBe(original[step].length);
        }

        // Verificar que propriedades principais sobreviveram
        const y = reconstructed['step-2'].find(b => b.id === 'y');
        expect(y.properties.label).toBe('Y');
    });
});
