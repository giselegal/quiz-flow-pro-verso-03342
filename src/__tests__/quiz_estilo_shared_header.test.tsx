import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import * as quizStateModule from '@/hooks/useQuizState';
import QuizApp from '@/components/quiz/QuizApp';
import { QUIZ_STEPS } from '@/data/quizSteps';

/**
 * Testes para o SharedProgressHeader (steps 2-19).
 */

describe('SharedProgressHeader', () => {
    const realHook = quizStateModule.useQuizState;

    it('exibe header compartilhado na step-2 com progresso e logo', async () => {
        const mockStep2 = QUIZ_STEPS['step-2'];

        vi.spyOn(quizStateModule, 'useQuizState').mockImplementation(() => {
            const base = realHook('quiz-estilo-21-steps');
            return {
                ...base,
                currentStep: 'step-2',
                state: { currentStep: 'step-2', answers: {}, userProfile: { userName: 'Maria', resultStyle: '', secondaryStyles: [], strategicAnswers: {} }, scores: {} },
                currentStepData: mockStep2,
                progress: 5,
                nextStep: () => { },
                setUserName: () => { },
                addAnswer: () => { },
                addStrategicAnswer: () => { },
                getOfferKey: () => 'MockOffer'
            } as any;
        });

        render(<QuizApp funnelId="quiz-estilo-21-steps" />);

        await waitFor(() => {
            expect(screen.queryByText(/Carregando Step step-02/i)).toBeNull();
        }, { timeout: 2000 });

        const header = screen.getByTestId('shared-progress-header');
        expect(header).toBeInTheDocument();
        expect(header.textContent).toMatch(/Progresso:\s*5%/i);
        // Logo presente
        const logoImg = header.querySelector('img');
        expect(logoImg).not.toBeNull();
    });

    it('não exibe header compartilhado na step-20 (resultado)', async () => {
        vi.restoreAllMocks();
        const mockStep20 = QUIZ_STEPS['step-20'];

        vi.spyOn(quizStateModule, 'useQuizState').mockImplementation(() => {
            const base = realHook('quiz-estilo-21-steps');
            return {
                ...base,
                currentStep: 'step-20',
                state: { currentStep: 'step-20', answers: {}, userProfile: { userName: 'Maria', resultStyle: '', secondaryStyles: [], strategicAnswers: {} }, scores: {} },
                currentStepData: mockStep20,
                progress: 95,
                nextStep: () => { },
                setUserName: () => { },
                addAnswer: () => { },
                addStrategicAnswer: () => { },
                getOfferKey: () => 'MockOffer'
            } as any;
        });

        render(<QuizApp funnelId="quiz-estilo-21-steps" />);

        await waitFor(() => {
            expect(screen.queryByText(/Carregando Step step-20/i)).toBeNull();
        }, { timeout: 2500 });

        expect(screen.queryByTestId('shared-progress-header')).toBeNull();
    });
});
