import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import * as quizStateModule from '@/hooks/useQuizState';
import QuizApp from '@/components/quiz/QuizApp';
import { QUIZ_STEPS } from '@/data/quizSteps';

/**
 * Testes de layout responsivo para etapas de perguntas:
 * - Perguntas com imagens devem aplicar grid de 1 coluna em mobile, 2 colunas em sm/md e 3 em desktop (classe lg:grid-cols-3)
 * - Perguntas somente texto devem manter 1 coluna em todos breakpoints (grid-cols-1)
 */

describe('Layout responsivo QuestionStep', () => {
    const realHook = quizStateModule.useQuizState;

    it('step-2 (com imagens) utiliza classes de múltiplas colunas', async () => {
        const mockStep2 = QUIZ_STEPS['step-2'];
        expect(mockStep2.options?.some(o => o.image)).toBe(true);

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
                getOfferKey: () => 'Montar looks com mais facilidade e confiança'
            } as any;
        });

        render(<QuizApp funnelId="quiz-estilo-21-steps" />);

        await waitFor(() => {
            expect(screen.queryByText(/Carregando Step step-02/i)).toBeNull();
        }, { timeout: 2000 });

        const grid = document.querySelector('[class*="grid-cols"]');
        expect(grid).toBeTruthy();
        const classList = grid?.className || '';
        expect(classList).toMatch(/grid-cols-1/); // base mobile
        expect(classList).toMatch(/sm:grid-cols-2/); // small/medium breakpoints
        expect(classList).toMatch(/lg:grid-cols-3/); // desktop 3 colunas
    });

    it('step-3 (somente texto) utiliza 1 coluna', async () => {
        vi.restoreAllMocks();
        const mockStep3 = QUIZ_STEPS['step-3'];
        expect(mockStep3.options?.some(o => o.image)).toBe(false);

        vi.spyOn(quizStateModule, 'useQuizState').mockImplementation(() => {
            const base = realHook('quiz-estilo-21-steps');
            return {
                ...base,
                currentStep: 'step-3',
                state: { currentStep: 'step-3', answers: {}, userProfile: { userName: 'Maria', resultStyle: '', secondaryStyles: [], strategicAnswers: {} }, scores: {} },
                currentStepData: mockStep3,
                progress: 10,
                nextStep: () => { },
                setUserName: () => { },
                addAnswer: () => { },
                addStrategicAnswer: () => { },
                getOfferKey: () => 'Montar looks com mais facilidade e confiança'
            } as any;
        });

        render(<QuizApp funnelId="quiz-estilo-21-steps" />);

        await waitFor(() => {
            expect(screen.queryByText(/Carregando Step step-03/i)).toBeNull();
        }, { timeout: 2000 });

        const grid = document.querySelector('[class*="grid-cols"]');
        expect(grid).toBeTruthy();
        const classList = grid?.className || '';
        // Deve conter apenas grid-cols-1 e não conter lg:grid-cols-3
        expect(classList).toMatch(/grid-cols-1/);
        expect(classList).not.toMatch(/lg:grid-cols-3/);
    });
});
