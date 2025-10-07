import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import * as quizStateModule from '@/hooks/useQuizState';
import QuizApp from '@/components/quiz/QuizApp';
import { QUIZ_STEPS } from '@/data/quizSteps';

// Testa se após a correção do simplified template a step-2 não vira mais intro.

describe('Fluxo quiz-estilo - Step 2 não deve ser intro', () => {
    it('garante que step-2 tenha tipo question do QUIZ_STEPS e não herdou type intro', async () => {
        // Renderizamos o QuizApp e em seguida forçamos avançar para step-2 usando o hook real.
        // Estratégia: mock leve do hook para injetar estado atual em step-2 e currentStepData de QUIZ_STEPS.

        const realHook = quizStateModule.useQuizState;
        const mockStep2 = QUIZ_STEPS['step-2'];
        expect(mockStep2).toBeTruthy();
        expect(mockStep2.type).toBe('question');

        // Mock do hook substituindo apenas o currentStep e currentStepData
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

        // Esperar o lazy load do adapter (spinner some)
        await waitFor(() => {
            expect(screen.queryByText(/Carregando Step step-02/i)).toBeNull();
        }, { timeout: 2000 });

        // Garantir que questionText da step-2 aparece
        expect(screen.getByText(/QUAL O SEU TIPO DE ROUPA FAVORITA\?/i)).toBeInTheDocument();

        // Não deve exibir placeholder de nome (indicador de intro incorreta)
        expect(screen.queryByPlaceholderText(/Digite seu primeiro nome aqui/i)).toBeNull();

        // Não deve conter parte do HTML estilizado da intro
        expect(screen.queryByText(/Chega de um guarda-roupa lotado/i)).toBeNull();
    });
});
