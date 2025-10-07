import { describe, it, expect, beforeEach } from 'vitest';
import { templateService } from '../service';
import { templateRepo } from '../repo';

function setupTemplateWithBranching() {
    const tpl = templateService.createBase('Branching', 'tpl-branching');
    const draft = templateRepo.get(tpl.id)!;
    // Adicionar segundo stage de pergunta e um stage de pergunta adicional para branch target
    // Base já tem: stage_intro, stage_q1, stage_result
    // Vamos inserir manualmente stage_q2 e stage_q3 ANTES do stage_result para garantir ordem: intro, q1, q2, q3, result
    draft.stages.splice(
        2,
        0,
        { id: 'stage_q2', type: 'question', order: 2, enabled: true, componentIds: [] },
        { id: 'stage_q3', type: 'question', order: 3, enabled: true, componentIds: [] }
    );
    // Ajustar order coerente
    draft.stages.forEach((s, idx) => (s.order = idx));
    // Pesos de scoring
    draft.logic.scoring.weights['stage_q1:optA'] = 5; // score menor
    draft.logic.scoring.weights['stage_q1:optB'] = 15; // score maior
    // Branch rule: se score >= 10 após stage_q1, pular para stage_q3; caso contrário fallback stage_q2
    draft.logic.branching = [
        {
            fromStageId: 'stage_q1',
            toStageId: 'stage_q3',
            fallbackStageId: 'stage_q2',
            conditionTree: { scoreGte: 10 }
        }
    ];
    templateRepo.save(draft);
    templateService.publish(draft.id);
    return templateRepo.get(draft.id)!;
}

describe('Branching simples por score', () => {
    let published: any;
    beforeEach(() => {
        published = setupTemplateWithBranching();
    });

    it('quando condição satisfeita (score >= 10) vai para stage_q3', () => {
        const start = templateService.startRuntime(published.slug);
        // intro -> q1
        templateService.answerRuntime(published.slug, start.sessionId, 'stage_intro', []);
        const ans = templateService.answerRuntime(published.slug, start.sessionId, 'stage_q1', ['optB']); // score 15
        expect(ans.branched).toBe(true);
        expect(ans.nextStageId).toBe('stage_q3');
    });

    it('quando condição não satisfeita vai para fallback stage_q2', () => {
        const start = templateService.startRuntime(published.slug);
        templateService.answerRuntime(published.slug, start.sessionId, 'stage_intro', []);
        const ans = templateService.answerRuntime(published.slug, start.sessionId, 'stage_q1', ['optA']); // score 5
        expect(ans.branched).toBe(true);
        expect(ans.nextStageId).toBe('stage_q2');
    });

    it('na ausência de regra (ex: respondendo stage_q2) segue linear', () => {
        const start = templateService.startRuntime(published.slug);
        templateService.answerRuntime(published.slug, start.sessionId, 'stage_intro', []);
        // primeira resposta força ir para q2 (score baixo)
        templateService.answerRuntime(published.slug, start.sessionId, 'stage_q1', ['optA']);
        const ans = templateService.answerRuntime(published.slug, start.sessionId, 'stage_q2', []);
        expect(ans.branched).toBe(false);
        // Linearmente após q2 deveria vir stage_q3 (porque ordem q2 -> q3 -> result )
        expect(ans.nextStageId).toBe('stage_q3');
    });
});
