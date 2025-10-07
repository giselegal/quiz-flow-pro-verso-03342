import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import * as quizStateModule from '@/hooks/useQuizState';
import QuizApp from '@/components/quiz/QuizApp';
import { QUIZ_STEPS } from '@/data/quizSteps';

/**
 * Testes de layout responsivo para etapas de perguntas:
 * - Perguntas com imagens agora devem aplicar 2 colunas já no mobile (grid-cols-2) para maximizar uso do espaço visual
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
        expect(classList).toMatch(/grid-cols-2/); // base mobile já 2 colunas com imagens
        // Não esperamos mais classes responsivas adicionais específicas de colunas para imagens (layout fixo em 2 colunas)
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
        // Deve conter apenas grid-cols-1 (somente texto)
        expect(classList).toMatch(/grid-cols-1/);
        expect(classList).not.toMatch(/grid-cols-2/);
    });
});
