import { describe, it, expect } from 'vitest';
import { getEffectiveRequiredSelections } from '@/lib/quiz/requiredSelections';

const baseQuestion = { type: 'question' };
const baseStrategic = { type: 'strategic-question' };

describe('getEffectiveRequiredSelections', () => {
    it('prioriza currentStepConfig.requiredSelections', () => {
        const r = getEffectiveRequiredSelections({ step: baseQuestion, mergedConfig: {}, currentStepConfig: { requiredSelections: 5 } });
        expect(r).toBe(5);
    });
    it('usa step.requiredSelections quando config API ausente', () => {
        const r = getEffectiveRequiredSelections({ step: { ...baseQuestion, requiredSelections: 4 }, mergedConfig: {}, currentStepConfig: {} });
        expect(r).toBe(4);
    });
    it('usa regra global steps2to11 quando anteriores ausentes', () => {
        const r = getEffectiveRequiredSelections({ step: baseQuestion, mergedConfig: { steps2to11: { requiredSelections: 6 } }, currentStepConfig: {} });
        expect(r).toBe(6);
    });
    it('fallback question = 3', () => {
        const r = getEffectiveRequiredSelections({ step: baseQuestion, mergedConfig: {}, currentStepConfig: {} });
        expect(r).toBe(3);
    });
    it('fallback strategic-question = 1', () => {
        const r = getEffectiveRequiredSelections({ step: baseStrategic, mergedConfig: {}, currentStepConfig: {} });
        expect(r).toBe(1);
    });
});
