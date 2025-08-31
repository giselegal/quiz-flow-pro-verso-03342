import { describe, it, expect } from 'vitest';
import { FlowCore } from '@/services/core/FlowCore';

describe('FlowCore', () => {
    it('mapStepToQuestionId mapeia 2..11 para q1..q10', () => {
        expect(FlowCore.mapStepToQuestionId(1)).toBeNull();
        expect(FlowCore.mapStepToQuestionId(2)).toBe('q1');
        expect(FlowCore.mapStepToQuestionId(3)).toBe('q2');
        expect(FlowCore.mapStepToQuestionId(11)).toBe('q10');
        expect(FlowCore.mapStepToQuestionId(12)).toBeNull();
    });

    it('shouldAutoAdvance respeita isValid e flags de etapa/bloco, com prioridade do bloco', () => {
        // Sem flags → não avança
        expect(
            FlowCore.shouldAutoAdvance({ isValid: true, stepConfig: {}, blockConfig: {} })
        ).toEqual({ proceed: false, delay: 1500 });

        // Flag na etapa
        expect(
            FlowCore.shouldAutoAdvance({
                isValid: true,
                stepConfig: { autoAdvanceOnComplete: true, autoAdvanceDelay: 800 },
                blockConfig: {},
            })
        ).toEqual({ proceed: true, delay: 800 });

        // Flag no bloco tem prioridade e substitui o delay
        expect(
            FlowCore.shouldAutoAdvance({
                isValid: true,
                stepConfig: { autoAdvanceOnComplete: true, autoAdvanceDelay: 800 },
                blockConfig: { autoAdvanceOnComplete: true, autoAdvanceDelay: 300 },
            })
        ).toEqual({ proceed: true, delay: 300 });

        // isValid = false → nunca avança
        expect(
            FlowCore.shouldAutoAdvance({
                isValid: false,
                stepConfig: { autoAdvanceOnComplete: true, autoAdvanceDelay: 100 },
                blockConfig: { autoAdvanceOnComplete: true, autoAdvanceDelay: 100 },
            })
        ).toEqual({ proceed: false, delay: 100 });
    });
});
