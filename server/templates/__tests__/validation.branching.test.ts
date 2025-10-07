import { describe, it, expect } from 'vitest';
import { templateService } from '../service';
import { templateRepo } from '../repo';

function createDraft(slug: string) {
    const base = templateService.createBase('Val', slug);
    return templateRepo.get(base.id)!;
}

describe('Validação branching (ciclos e alcançabilidade)', () => {
    it('detecta ciclo simples entre q1 e q2', () => {
        const d = createDraft('tpl-val-cycle');
        // inserir q2 antes do result
        d.stages.splice(2, 0, { id: 'stage_q2', type: 'question', order: 2, enabled: true, componentIds: [] });
        d.stages.forEach((s, idx) => s.order = idx);
        // criar ciclo: q1 -> q2, q2 -> q1
        d.logic.branching = [
            { fromStageId: 'stage_q1', toStageId: 'stage_q2', conditionTree: { scoreGte: 0 } },
            { fromStageId: 'stage_q2', toStageId: 'stage_q1', conditionTree: { scoreGte: 0 } }
        ];
        templateRepo.save(d);
        const result = templateService.validate(d.id);
        expect(result.errors).toContain('CYCLE_DETECTED');
    });

    it('marca estágio inalcançável com warning UNREACHABLE_STAGE', () => {
        const d = createDraft('tpl-val-unreach');
        // adicionar q2 e q3
        d.stages.splice(2, 0,
            { id: 'stage_q2', type: 'question', order: 2, enabled: true, componentIds: [] },
            { id: 'stage_q3', type: 'question', order: 3, enabled: true, componentIds: [] });
        d.stages.forEach((s, idx) => s.order = idx);
        // Branching força pular q2: q1 -> q3; sem fallback; linear depois para result
        d.logic.branching = [{ fromStageId: 'stage_q1', toStageId: 'stage_q3', conditionTree: { scoreGte: 0 } }];
        templateRepo.save(d);
        const result = templateService.validate(d.id);
        expect(result.warnings.some(w => w.includes('UNREACHABLE_STAGE:stage_q2'))).toBe(true);
    });
});
