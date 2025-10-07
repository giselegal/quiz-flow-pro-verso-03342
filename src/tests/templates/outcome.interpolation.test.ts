import { describe, it, expect } from 'vitest';
import { templateService } from '../../../server/templates/service';
import { templateRepo } from '../../../server/templates/repo';

describe('Outcome interpolation', () => {
    it('substitui {{score}} no outcome final', () => {
        const agg = templateService.createBase('Interp', 'interp-slug');
        agg.draft.outcomes = [
            { id: 'out_all', minScore: 0, maxScore: 9999, template: 'Seu score foi {{score}} pontos' }
        ];
        agg.draft.logic.scoring.weights['stage_q1:optA'] = 42;
        templateRepo.save(agg);
        templateService.publish(agg.draft.id);
        const start = templateService.startRuntime('interp-slug');
        templateService.answerRuntime('interp-slug', start.sessionId, 'stage_intro', []);
        const ansQ = templateService.answerRuntime('interp-slug', start.sessionId, 'stage_q1', ['optA']);
        const ansR = templateService.answerRuntime('interp-slug', start.sessionId, 'stage_result', []);
        expect(ansR.completed).toBe(true);
        expect(ansR.outcomeText).toBe('Seu score foi 42 pontos');
    });
});
