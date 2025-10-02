import React, { useEffect, useState } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QuizRuntimeRegistryProvider, useQuizRuntimeRegistry } from '@/runtime/quiz/QuizRuntimeRegistry';
import { useQuizState } from '@/hooks/useQuizState';

// Mapa de steps override mínimo
const OVERRIDE_STEPS = {
    'step-1': { id: 'step-1', type: 'intro', nextStep: 'step-2', title: 'Intro Test', buttonText: 'Go' },
    'step-2': { id: 'step-2', type: 'question', nextStep: 'step-3', questionText: 'Pergunta?', requiredSelections: 1, options: [{ id: 'natural', text: 'Natural' }] },
};

const SmokeHarness: React.FC = () => {
    const { steps, setSteps } = useQuizRuntimeRegistry();
    const quiz = useQuizState('dummy-funnel', steps);
    const [advanced, setAdvanced] = useState(false);

    useEffect(() => { setSteps(OVERRIDE_STEPS as any); }, [setSteps]);

    useEffect(() => {
        // Avança automaticamente quando override carregado na primeira etapa
        if (!advanced && quiz.currentStep === 'step-1' && steps['step-1']) {
            quiz.nextStep();
            setAdvanced(true);
        }
    }, [advanced, quiz.currentStep, steps, quiz]);

    return <div data-testid="smoke-step" data-step={quiz.currentStep}></div>;
};

describe('QuizRuntimeRegistry + useQuizState integration', () => {
    it('navega usando nextStep do override registry', async () => {
        render(
            <QuizRuntimeRegistryProvider>
                <SmokeHarness />
            </QuizRuntimeRegistryProvider>
        );

        // Deve eventualmente avançar para step-2 via nextStep do override
        await waitFor(() => {
            const el = screen.getByTestId('smoke-step');
            expect(el.getAttribute('data-step')).toBe('step-2');
        });
    });
});
