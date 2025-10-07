import { describe, it, expect } from 'vitest';
import { templateService } from '../../templates/service';
import { templateRepo } from '../../templates/repo';

describe('Runtime básico', () => {
    it('cria, publica e executa fluxo linear com score', () => {
        const agg = templateService.createBase('Quiz Base', 'quiz-base-runtime');
        // Ajusta pesos para stage_q1
        agg.draft.logic.scoring.weights['stage_q1:optA'] = 10;
        // Simula componente de question com opções (não necessário para scoring MVP mas mantemos)
        templateRepo.save(agg);
        const snap = templateService.publish(agg.draft.id);
        expect(snap.status).toBe('published');
        const start = templateService.startRuntime('quiz-base-runtime');
        expect(start.currentStageId).toBe('stage_intro');
        // Responder intro (sem opções)
        const ans1 = templateService.answerRuntime('quiz-base-runtime', start.sessionId, 'stage_intro', []);
        expect(ans1.nextStageId).toBe('stage_q1');
        // Responder pergunta com opção que tem peso
        const ans2 = templateService.answerRuntime('quiz-base-runtime', start.sessionId, 'stage_q1', ['optA']);
        // Próximo deve ser stage_result
        expect(ans2.nextStageId).toBe('stage_result');
        // Responder result (final)
        const ans3 = templateService.answerRuntime('quiz-base-runtime', start.sessionId, 'stage_result', []);
        expect(ans3.completed).toBe(true);
        expect(ans3.score).toBe(10);
        expect(ans3.outcomeId).toBeDefined();
    });
});
