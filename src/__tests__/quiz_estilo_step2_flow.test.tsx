import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import * as quizStateModule from '@/hooks/useQuizState';
import QuizApp from '@/components/quiz/QuizApp';
import { QUIZ_STEPS } from '@/data/quizSteps';

// Testa se após a correção do simplified template a step-2 não vira mais intro.

describe('Fluxo quiz-estilo - Step 2 não deve ser intro', () => {
    it('garante que step-2 tenha tipo question do QUIZ_STEPS e não herdou type intro', () => {
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
                    nextStep: () => {},
                    setUserName: () => {},
                    addAnswer: () => {},
                    addStrategicAnswer: () => {},
                    getOfferKey: () => 'Montar looks com mais facilidade e confiança'
                } as any;
            });

        render(<QuizApp funnelId="quiz-estilo-21-steps" />);

        // A step-2 original tem requiredSelections = 3 (assumido pelo quizSteps). Não deve ter campo de nome.
        // Verificamos ausência do placeholder de nome usado na step-1 simplificada.
        const namePlaceholder = screen.queryByPlaceholderText(/Digite seu primeiro nome aqui/i);
        expect(namePlaceholder).toBeNull();

        // Verifica que texto do título não contém HTML estilizado da intro simplificada
        expect(screen.queryByText(/Chega de um guarda-roupa lotado/i)).toBeNull();

        // Deve mostrar pelo menos uma opção de resposta (3 seleções) – usamos role genérico de button ou texto da opção.
        // Para robustez, inspecionamos options do step e garantimos que pelo menos uma aparece.
        const opt = mockStep2.options?.[0]?.text;
        if (opt) {
            expect(screen.getByText(opt, { exact: false })).toBeInTheDocument();
        }
    });
});
