import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuizState } from '@/hooks/useQuizState';

// Fake steps minimal for test overriding default QUIZ_STEPS
const TEST_STEPS: Record<string, any> = {
    'step-01': { id: 'step-01', type: 'intro', nextStep: 'step-02' },
    'step-02': { id: 'step-02', type: 'question', requiredSelections: 1, nextStep: 'step-03', options: [{ id: 'classico' }] },
    'step-03': { id: 'step-03', type: 'question', requiredSelections: 1, nextStep: 'step-04', options: [{ id: 'natural' }] },
    'step-04': { id: 'step-04', type: 'result' }
};

// Use fake timers
vi.useFakeTimers();

describe('Auto Advance', () => {
    it('avança automaticamente após selecionar opção', () => {
        const { result } = renderHook(() => useQuizState(undefined, TEST_STEPS, { enableAutoAdvance: true, autoAdvanceDelayMs: 200 }));

        // Forçar currentStep = step-02 (pular intro)
        act(() => {
            result.current.navigateToStep('step-02');
        });
        expect(result.current.currentStep).toBe('step-02');

        // Seleciona resposta
        act(() => {
            result.current.addAnswer('step-02', ['classico']);
        });

        // Ainda não avançou imediatamente
        expect(result.current.currentStep).toBe('step-02');

        // Avança após o delay
        act(() => {
            vi.advanceTimersByTime(210);
        });

        expect(result.current.currentStep).toBe('step-03');
    });
});
