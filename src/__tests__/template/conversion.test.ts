import { describe, it, expect } from 'vitest';
import { convertTemplateToEditorBlocks } from '@/pages/editor/modern/logic/templateConversion';

describe('convertTemplateToEditorBlocks', () => {
    it('converte blocos adicionando metadados de step', () => {
        const template = {
            'step-1': [{ id: 'a', type: 'text-inline' }, { id: 'b', type: 'quiz-option' }],
            'step-2': [{ id: 'c', type: 'text-inline' }]
        } as Record<string, any[]>;

        const result = convertTemplateToEditorBlocks(template);
        expect(result.length).toBe(3);

        // IDs devem ser prefixados pelo step
        expect(result.find(b => b.id === 'step-1-a')).toBeTruthy();
        expect(result.find(b => b.id === 'step-2-c')).toBeTruthy();

        // Metadados
        const blockA = result.find(b => b.id === 'step-1-a');
        expect(blockA.stepId).toBe('step-1');
        expect(blockA.stepNumber).toBe(1);

        const blockC = result.find(b => b.id === 'step-2-c');
        expect(blockC.stepNumber).toBe(2);

        // Ordem monotônica agrupada por steps (multiplicador 100)
        const orders = result.map(b => b.order);
        expect(orders).toEqual([...orders].sort((a, b) => a - b));
        // Garantir separação de step 1 (<200) e step 2 (>=100)
        expect(orders.filter(o => o < 100).length).toBe(2);
        expect(orders.filter(o => o >= 100).length).toBe(1);
    });
});
