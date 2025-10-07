import { describe, it, expect } from 'vitest';
import { templateService } from '../../../server/templates/service';
import { templateRepo } from '../../../server/templates/repo';

// Validação: gap entre outcomes deve bloquear publish (OUTCOME_GAP)

describe('Validation outcomes', () => {
    it('bloqueia publish com gap de outcomes', () => {
        const agg = templateService.createBase('ValOut', 'valout-slug');
        // outcomes base criados no template: substituímos por ranges com gap
        agg.draft.outcomes = [
            { id: 'o1', minScore: 0, maxScore: 10, template: 'A' },
            { id: 'o2', minScore: 20, maxScore: 30, template: 'B' } // gap 11-19
        ];
        templateRepo.save(agg);
        let error: any = null;
        try { templateService.publish(agg.draft.id); } catch (e) { error = e; }
        expect(error).toBeTruthy();
        expect(String(error)).toMatch(/OUTCOME_GAP/);
    });
});
