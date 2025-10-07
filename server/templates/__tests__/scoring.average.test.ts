import { describe, it, expect } from 'vitest';
import { templateService } from '../service';
import { templateRepo } from '../repo';

function setupTemplate(slug: string) {
    const tpl = templateService.createBase('Score', slug);
    const draft = templateRepo.get(tpl.id)!;
    // Pesos em q1
    draft.logic.scoring.weights['stage_q1:optA'] = 10;
    draft.logic.scoring.weights['stage_q1:optB'] = 5;
    // Adicionar segunda pergunta para ter mais de um stage com respostas
    draft.stages.splice(2, 0, { id: 'stage_q2', type: 'question', order: 2, enabled: true, componentIds: [] });
    draft.logic.scoring.weights['stage_q2:optX'] = 3;
    draft.logic.scoring.weights['stage_q2:optY'] = 9;
    draft.stages.forEach((s, idx) => s.order = idx);
    templateRepo.save(draft);
    templateService.publish(draft.id);
    return templateRepo.get(draft.id)!;
}

describe('Scoring average', () => {
    it('sum vs average (dois picks) produz valores diferentes esperados', () => {
        const published = setupTemplate('tpl-score-avg-1');
        // SUM
        let start = templateService.startRuntime(published.slug);
        templateService.answerRuntime(published.slug, start.sessionId, 'stage_intro', []);
        // responder q1 com optA (10)
        templateService.answerRuntime(published.slug, start.sessionId, 'stage_q1', ['optA']);
        // responder q2 com optY (9)
        const ans2 = templateService.answerRuntime(published.slug, start.sessionId, 'stage_q2', ['optY']);
        expect(ans2.score).toBe(19);

        // AVERAGE
        const published2 = setupTemplate('tpl-score-avg-2');
        const draft2 = templateRepo.get(published2.id)!;
        draft2.logic.scoring.mode = 'average';
        templateRepo.save(draft2); templateService.publish(draft2.id);
        start = templateService.startRuntime(draft2.slug);
        templateService.answerRuntime(draft2.slug, start.sessionId, 'stage_intro', []);
        templateService.answerRuntime(draft2.slug, start.sessionId, 'stage_q1', ['optA']);
        const ans2avg = templateService.answerRuntime(draft2.slug, start.sessionId, 'stage_q2', ['optY']);
        expect(ans2avg.score).toBe(19 / 2);
    });

    it('average com três respostas produz média decimal correta', () => {
        const published = setupTemplate('tpl-score-avg-3');
        const draft = templateRepo.get(published.id)!;
        draft.logic.scoring.mode = 'average';
        templateRepo.save(draft); templateService.publish(draft.id);
        const start = templateService.startRuntime(draft.slug);
        templateService.answerRuntime(draft.slug, start.sessionId, 'stage_intro', []);
        templateService.answerRuntime(draft.slug, start.sessionId, 'stage_q1', ['optA', 'optB']); // 10 + 5
        const ans = templateService.answerRuntime(draft.slug, start.sessionId, 'stage_q2', ['optX']); // +3 => total 18 / 3 respostas = 6
        expect(ans.score).toBe(6);
    });
});
