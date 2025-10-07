import { describe, it, expect } from 'vitest';
import { validateTemplate } from '../../../server/templates/validation';
import { toTemplateDraft } from '../../../server/quiz-style/adapter';

// Testa as novas validações/warnings específicas do adapter legacy

describe('legacy adapter validation warnings', () => {
    it('emite warnings esperados para draft adaptado', async () => {
        const draft = await toTemplateDraft({ slug: 'quiz-style-test' });
        const agg: any = { draft };
        const report = validateTemplate(agg);
        const codes = [...report.warnings.map(w => w.code)];
        expect(codes).toContain('LEGACY_ADAPTER_SCHEMA');
        expect(codes).toContain('LEGACY_PLACEHOLDER_COMPONENTS');
        expect(codes).toContain('LEGACY_NO_SCORING_WEIGHTS');
        expect(codes).toContain('LEGACY_SINGLE_OUTCOME');
    });
});
