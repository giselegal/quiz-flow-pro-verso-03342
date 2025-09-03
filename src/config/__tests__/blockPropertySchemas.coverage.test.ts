import { describe, it, expect } from 'vitest';
import { blockPropertySchemas } from '@/config/blockPropertySchemas';

// Este teste garante que a maioria dos tipos de bloco expostos pelo registry
// possuem um schema no blockPropertySchemas (ou um equivalente direto/alias).

describe('blockPropertySchemas coverage vs registry', () => {
    it('tem schema para os tipos centrais usados no editor/resultado', () => {
        const mustHave = [
            'text-inline',
            'heading-inline',
            'button-inline',
            'image-inline',
            'image-display-inline',
            'decorative-bar-inline',
            'quiz-intro-header',
            'result-header-inline',
            'style-card-inline',
            'options-grid',
            'lead-form',
            'connected-template-wrapper',
            'urgency-timer-inline',
            'value-anchoring',
        ];

        for (const key of mustHave) {
            expect(blockPropertySchemas[key], `schema ausente para ${key}`).toBeTruthy();
        }
    });
});
