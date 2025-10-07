import { describe, it, expect, beforeEach } from 'vitest';
import { templateService } from '../../../server/templates/service';
import { templateRepo } from '../../../server/templates/repo';

let _slugCounter = 0;
function setupBase() {
    const slug = `tpl-ctree-${_slugCounter++}`;
    const aggregate = templateService.createBase('CTree', slug); // aggregate
    const draft = aggregate.draft;
    draft.stages.splice(2, 0, { id: 'stage_q2', type: 'question', order: 2, enabled: true, componentIds: [] });
    draft.stages.forEach((s, idx) => s.order = idx);
    draft.logic.scoring.weights['stage_q1:optLow'] = 5;
    draft.logic.scoring.weights['stage_q1:optMid'] = 15;
    draft.logic.scoring.weights['stage_q1:optHigh'] = 25;
    templateRepo.save(aggregate);
    return aggregate; // retornamos o aggregate completo
}

describe('conditionTree evaluator (src copy)', () => {
    let aggregate: any;
    beforeEach(() => { aggregate = setupBase(); });

    it('AND simples score entre faixa direciona para stage_q2', () => {
        aggregate.draft.logic.branching = [{ fromStageId: 'stage_q1', toStageId: 'stage_q2', fallbackStageId: 'stage_result', conditionTree: { op: 'AND', conditions: [{ scoreGte: 10 }, { scoreLte: 20 }] } }];
        templateRepo.save(aggregate); templateService.publish(aggregate.draft.id);
        const start = templateService.startRuntime(aggregate.draft.meta.slug);
        templateService.answerRuntime(aggregate.draft.meta.slug, start.sessionId, 'stage_intro', []);
        const ans = templateService.answerRuntime(aggregate.draft.meta.slug, start.sessionId, 'stage_q1', ['optMid']);
        expect(ans.branched).toBe(true);
        expect(ans.nextStageId).toBe('stage_q2');
    });

    it('AND falha (score fora da faixa) usa fallback', () => {
        aggregate.draft.logic.branching = [{ fromStageId: 'stage_q1', toStageId: 'stage_q2', fallbackStageId: 'stage_result', conditionTree: { op: 'AND', conditions: [{ scoreGte: 10 }, { scoreLte: 20 }] } }];
        templateRepo.save(aggregate); templateService.publish(aggregate.draft.id);
        const start = templateService.startRuntime(aggregate.draft.meta.slug);
        templateService.answerRuntime(aggregate.draft.meta.slug, start.sessionId, 'stage_intro', []);
        const ans = templateService.answerRuntime(aggregate.draft.meta.slug, start.sessionId, 'stage_q1', ['optHigh']);
        expect(ans.branched).toBe(true);
        expect(ans.nextStageId).toBe('stage_result');
    });

    it('OR passa quando scoreGte >= 20 mesmo se answeredIncludes falha', () => {
        aggregate.draft.logic.branching = [{ fromStageId: 'stage_q1', toStageId: 'stage_q2', fallbackStageId: 'stage_result', conditionTree: { op: 'OR', conditions: [{ scoreGte: 20 }, { answeredIncludes: { stageId: 'stage_q1', optionId: 'optX' } }] } }];
        templateRepo.save(aggregate); templateService.publish(aggregate.draft.id);
        const start = templateService.startRuntime(aggregate.draft.meta.slug);
        templateService.answerRuntime(aggregate.draft.meta.slug, start.sessionId, 'stage_intro', []);
        const ans = templateService.answerRuntime(aggregate.draft.meta.slug, start.sessionId, 'stage_q1', ['optHigh']);
        expect(ans.branched).toBe(true);
        expect(ans.nextStageId).toBe('stage_q2');
    });

    it('Nested AND/OR avalia corretamente', () => {
        aggregate.draft.logic.branching = [{ fromStageId: 'stage_q1', toStageId: 'stage_q2', fallbackStageId: 'stage_result', conditionTree: { op: 'AND', conditions: [{ scoreGte: 10 }, { op: 'OR', conditions: [{ scoreLte: 10 }, { answersCountGte: 1 }] }] } }];
        templateRepo.save(aggregate); templateService.publish(aggregate.draft.id);
        const start = templateService.startRuntime(aggregate.draft.meta.slug);
        templateService.answerRuntime(aggregate.draft.meta.slug, start.sessionId, 'stage_intro', []);
        const ans = templateService.answerRuntime(aggregate.draft.meta.slug, start.sessionId, 'stage_q1', ['optMid']);
        expect(ans.branched).toBe(true);
        expect(ans.nextStageId).toBe('stage_q2');
    });
});
