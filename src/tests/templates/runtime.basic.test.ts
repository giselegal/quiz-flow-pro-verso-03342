import { describe, it, expect } from 'vitest';
import { templateService } from '@/../server/templates/service';
import { templateRepo } from '@/../server/templates/repo';

describe('Runtime básico (src copy)', () => {
    it('cria, publica e executa fluxo linear com score', () => {
        const agg = templateService.createBase('Quiz Base', 'quiz-base-runtime-src');
        agg.draft.logic.scoring.weights['stage_q1:optA'] = 10;
        templateRepo.save(agg);
        const snap = templateService.publish(agg.draft.id);
        expect(snap.status).toBe('published');
        const start = templateService.startRuntime('quiz-base-runtime-src');
        expect(start.currentStageId).toBe('stage_intro');
        const ans1 = templateService.answerRuntime('quiz-base-runtime-src', start.sessionId, 'stage_intro', []);
        expect(ans1.nextStageId).toBe('stage_q1');
        const ans2 = templateService.answerRuntime('quiz-base-runtime-src', start.sessionId, 'stage_q1', ['optA']);
        expect(ans2.nextStageId).toBe('stage_result');
        const ans3 = templateService.answerRuntime('quiz-base-runtime-src', start.sessionId, 'stage_result', []);
        expect(ans3.completed).toBe(true);
        expect(ans3.score).toBe(10);
        expect(ans3.outcomeId).toBeDefined();
    });
});
