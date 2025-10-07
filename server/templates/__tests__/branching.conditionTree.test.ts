import { describe, it, expect, beforeEach } from 'vitest';
import { templateService } from '../service';
import { templateRepo } from '../repo';

/* Cenários:
 * 1. AND: scoreGte e scoreLte ambos verdadeiros -> aplica regra.
 * 2. OR: answeredIncludes OU scoreGte -> aplica ainda que answeredIncludes falhe.
 * 3. Nested: AND( scoreGte , OR( scoreLte , answersCountGte ) )
 * 4. Fallback quando AND falha.
 */
let _slugCounter = 0;
function setupBase() {
    const slug = `tpl-ctree-${_slugCounter++}`;
    const tpl = templateService.createBase('CTree', slug);
    const draft = templateRepo.get(tpl.id)!;
    // Inserir stage_q2 para ser alvo
    draft.stages.splice(2, 0, { id: 'stage_q2', type: 'question', order: 2, enabled: true, componentIds: [] });
    draft.stages.forEach((s, idx) => s.order = idx);
    // Pesos para stage_q1
    draft.logic.scoring.weights['stage_q1:optLow'] = 5;
    draft.logic.scoring.weights['stage_q1:optMid'] = 15;
    draft.logic.scoring.weights['stage_q1:optHigh'] = 25;
    templateRepo.save(draft);
    return draft;
}

describe('conditionTree evaluator', () => {
    let draft: any;
    beforeEach(() => { draft = setupBase(); });

    it('AND simples score entre faixa direciona para stage_q2', () => {
        draft.logic.branching = [{ fromStageId: 'stage_q1', toStageId: 'stage_q2', fallbackStageId: 'stage_result', conditionTree: { op: 'AND', conditions: [{ scoreGte: 10 }, { scoreLte: 20 }] } }];
        templateRepo.save(draft); templateService.publish(draft.id);
        const start = templateService.startRuntime(draft.slug);
        templateService.answerRuntime(draft.slug, start.sessionId, 'stage_intro', []);
        const ans = templateService.answerRuntime(draft.slug, start.sessionId, 'stage_q1', ['optMid']); // score 15
        expect(ans.branched).toBe(true);
        expect(ans.nextStageId).toBe('stage_q2');
    });

    it('AND falha (score fora da faixa) usa fallback', () => {
        draft.logic.branching = [{ fromStageId: 'stage_q1', toStageId: 'stage_q2', fallbackStageId: 'stage_result', conditionTree: { op: 'AND', conditions: [{ scoreGte: 10 }, { scoreLte: 20 }] } }];
        templateRepo.save(draft); templateService.publish(draft.id);
        const start = templateService.startRuntime(draft.slug);
        templateService.answerRuntime(draft.slug, start.sessionId, 'stage_intro', []);
        const ans = templateService.answerRuntime(draft.slug, start.sessionId, 'stage_q1', ['optHigh']); // score 25
        expect(ans.branched).toBe(true);
        expect(ans.nextStageId).toBe('stage_result');
    });

    it('OR passa quando scoreGte >= 20 mesmo se answeredIncludes falha', () => {
        draft.logic.branching = [{ fromStageId: 'stage_q1', toStageId: 'stage_q2', fallbackStageId: 'stage_result', conditionTree: { op: 'OR', conditions: [{ scoreGte: 20 }, { answeredIncludes: { stageId: 'stage_q1', optionId: 'optX' } }] } }];
        templateRepo.save(draft); templateService.publish(draft.id);
        const start = templateService.startRuntime(draft.slug);
        templateService.answerRuntime(draft.slug, start.sessionId, 'stage_intro', []);
        const ans = templateService.answerRuntime(draft.slug, start.sessionId, 'stage_q1', ['optHigh']); // score 25, answeredIncludes falha mas scoreGte passa
        expect(ans.branched).toBe(true);
        expect(ans.nextStageId).toBe('stage_q2');
    });

    it('Nested AND/OR avalia corretamente', () => {
        draft.logic.branching = [{ fromStageId: 'stage_q1', toStageId: 'stage_q2', fallbackStageId: 'stage_result', conditionTree: { op: 'AND', conditions: [{ scoreGte: 10 }, { op: 'OR', conditions: [{ scoreLte: 10 }, { answersCountGte: 1 }] }] } }];
        templateRepo.save(draft); templateService.publish(draft.id);
        const start = templateService.startRuntime(draft.slug);
        templateService.answerRuntime(draft.slug, start.sessionId, 'stage_intro', []);
        // scoreGte:10 true, nested OR: scoreLte:10 false (score 15) mas answersCountGte:1 true -> branch
        const ans = templateService.answerRuntime(draft.slug, start.sessionId, 'stage_q1', ['optMid']);
        expect(ans.branched).toBe(true);
        expect(ans.nextStageId).toBe('stage_q2');
    });
});
