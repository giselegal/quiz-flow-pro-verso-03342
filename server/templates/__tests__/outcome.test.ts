import { describe, it, expect, beforeEach } from 'vitest';
import { templateService } from '../service';
import { templateRepo } from '../repo';

function setupTemplateWithOutcomes() {
    const tpl = templateService.createBase('Outcomes', 'tpl-outcomes');
    const draft = templateRepo.get(tpl.id)!;
    // Pesos e outcomes adicionais
    draft.logic.scoring.weights['stage_q1:optLow'] = 2;
    draft.logic.scoring.weights['stage_q1:optHigh'] = 20;
    // Substituir outcomes padrão por dois intervalos e um default (já existe out_default) => manter default como fallback.
    draft.outcomes = [
        { id: 'out_low', conditions: { scoreRange: { min: 0, max: 5 } }, template: 'Baixo: {{score}}' },
        { id: 'out_high', conditions: { scoreRange: { min: 10 } }, template: 'Alto: {{score}}' }
    ];
    templateRepo.save(draft);
    templateService.publish(draft.id);
    return templateRepo.get(draft.id)!;
}

describe('Seleção de Outcome por faixa de score', () => {
    let published: any;
    beforeEach(() => {
        published = setupTemplateWithOutcomes();
    });

    it('score baixo escolhe out_low', () => {
        const start = templateService.startRuntime(published.slug);
        templateService.answerRuntime(published.slug, start.sessionId, 'stage_intro', []);
        templateService.answerRuntime(published.slug, start.sessionId, 'stage_q1', ['optLow']);
        const done = templateService.completeRuntime(published.slug, start.sessionId);
        expect(done.outcome?.id).toBe('out_low');
    });

    it('score alto escolhe out_high', () => {
        const start = templateService.startRuntime(published.slug);
        templateService.answerRuntime(published.slug, start.sessionId, 'stage_intro', []);
        templateService.answerRuntime(published.slug, start.sessionId, 'stage_q1', ['optHigh']);
        const done = templateService.completeRuntime(published.slug, start.sessionId);
        expect(done.outcome?.id).toBe('out_high');
    });

    it('score em faixa sem outcome explícito cai no primeiro (out_low) se range cobre', () => {
        const start = templateService.startRuntime(published.slug);
        templateService.answerRuntime(published.slug, start.sessionId, 'stage_intro', []);
        // Nenhuma resposta -> score 0 então já coberto por out_low
        const done = templateService.completeRuntime(published.slug, start.sessionId);
        expect(done.outcome?.id).toBe('out_low');
    });
});
