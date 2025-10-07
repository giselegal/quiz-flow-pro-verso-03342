import { describe, it, expect, beforeEach } from 'vitest';
import { templateService } from '../service';
import { templateRepo } from '../repo';

/* Cenários cobertos:
 * 1. Primeira regra válida ganha (mesmo que segunda também passaria).
 * 2. Regra 1 falha condição -> aplica fallback da regra 1 (sem avaliar regra 2 se fallback aplicado).
 * 3. Todas as regras falham e sem fallback válido -> segue linear.
 */
function setupMultiBranchTemplate() {
    const tpl = templateService.createBase('Multi', 'tpl-branch-multi');
    const draft = templateRepo.get(tpl.id)!;
    // Inserir q2 e q3 antes do result para fluxo linear q1 -> q2 -> q3 -> result
    draft.stages.splice(2, 0,
        { id: 'stage_q2', type: 'question', order: 2, enabled: true, componentIds: [] },
        { id: 'stage_q3', type: 'question', order: 3, enabled: true, componentIds: [] },
    );
    draft.stages.forEach((s, idx) => s.order = idx);
    // Pesos para simular diferentes scores na mesma pergunta q1
    draft.logic.scoring.weights['stage_q1:optLow'] = 5;
    draft.logic.scoring.weights['stage_q1:optMid'] = 12;
    draft.logic.scoring.weights['stage_q1:optHigh'] = 30;
    /* Regras (todas from stage_q1): ordem importa
       R1: score >= 10 -> vai para q3, fallback q2
       R2: score >= 25 -> iria para result (exemplo), fallback q3
       R3: score <= 8  -> vai para q2, fallback q3
       Esperado precedence: para optHigh (score 30), R1 já passa e ganha antes de R2.
    */
    draft.logic.branching = [
        { fromStageId: 'stage_q1', toStageId: 'stage_q3', fallbackStageId: 'stage_q2', conditionTree: { scoreGte: 10 } },
        { fromStageId: 'stage_q1', toStageId: 'stage_result', fallbackStageId: 'stage_q3', conditionTree: { scoreGte: 25 } },
        { fromStageId: 'stage_q1', toStageId: 'stage_q2', fallbackStageId: 'stage_q3', conditionTree: { scoreLte: 8 } }
    ];
    templateRepo.save(draft);
    templateService.publish(draft.id);
    return templateRepo.get(draft.id)!;
}

describe('Multi-branching precedence', () => {
    let published: any;
    beforeEach(() => { published = setupMultiBranchTemplate(); });

    it('primeira regra que passa vence (score 30 aciona apenas regra 1)', () => {
        const start = templateService.startRuntime(published.slug);
        templateService.answerRuntime(published.slug, start.sessionId, 'stage_intro', []);
        const ans = templateService.answerRuntime(published.slug, start.sessionId, 'stage_q1', ['optHigh']);
        expect(ans.branched).toBe(true);
        expect(ans.nextStageId).toBe('stage_q3'); // não deve ir direto para result (regra 2 ignorada)
    });

    it('falha condição da primeira mas aplica fallback da primeira sem avaliar seguintes', () => {
        const start = templateService.startRuntime(published.slug);
        templateService.answerRuntime(published.slug, start.sessionId, 'stage_intro', []);
        // score 5 < 10 -> R1 falha condição -> fallback q2 aplicado; não deveria testar R3 (apesar de score <=8) porque fallback já aplicado
        const ans = templateService.answerRuntime(published.slug, start.sessionId, 'stage_q1', ['optLow']);
        expect(ans.branched).toBe(true);
        expect(ans.nextStageId).toBe('stage_q2');
    });

    it('stage sem regras (stage_q2) avança linearmente', () => {
        const start = templateService.startRuntime(published.slug);
        templateService.answerRuntime(published.slug, start.sessionId, 'stage_intro', []);
        // score baixo leva via fallback da R1 para q2 (branched true nesse passo)
        templateService.answerRuntime(published.slug, start.sessionId, 'stage_q1', ['optLow']);
        // agora stage_q2 não tem regras -> avanço linear para q3 com branched false
        const ans = templateService.answerRuntime(published.slug, start.sessionId, 'stage_q2', []);
        expect(ans.branched).toBe(false);
        expect(ans.nextStageId).toBe('stage_q3');
    });
});
