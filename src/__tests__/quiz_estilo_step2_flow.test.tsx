import { describe, it, expect } from 'vitest';
import TemplateLoader from '@/services/editor/TemplateLoader';

// Testa se após a correção o step-02 é tratado como pergunta (blocks corretos) e não intro.

describe('Fluxo quiz-estilo - Step 02 (hidratação de pergunta)', () => {
    it('step-02 deve conter blocks de pergunta e não conter intro-form', async () => {
        const loader = new TemplateLoader();
        const { blocks } = await loader.loadStep('step-02');

        expect(Array.isArray(blocks)).toBe(true);
        const types = blocks.map(b => String((b as any).type || ''));

        // Deve ter blocos essenciais de pergunta
        // Aceita variações canônicas: question-title ou question-hero, e question-navigation
        expect(types).toContain('options-grid');
        expect(types.some(t => t === 'question-title' || t === 'question-hero' || t === 'question-text')).toBe(true);
        expect(types.some(t => t === 'question-navigation' || t === 'quiz-navigation')).toBe(true);

        // Não deve ter bloco de intro neste step
        expect(types).not.toContain('intro-form');

        // options-grid deve ter opções
        const grid = blocks.find(b => (b as any).type === 'options-grid') as any;
        const options = (grid?.content?.options || grid?.properties?.options) as any[];
        expect(Array.isArray(options)).toBe(true);
        expect(options.length).toBeGreaterThan(0);
    });
});
