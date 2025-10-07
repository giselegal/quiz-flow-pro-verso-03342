import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import QuizEstiloPessoalPage from '@/pages/QuizEstiloPessoalPage';
import * as useQuizStateModule from '@/hooks/useQuizState';
import { UnifiedStepRenderer } from '@/components/editor/unified';

// Mock Helmet para evitar necessidade de provider no ambiente de teste
vi.mock('react-helmet-async', () => ({
    Helmet: ({ children }: any) => <>{children}</>,
    HelmetProvider: ({ children }: any) => <>{children}</>
}));

// Mock UnifiedStepRenderer para controlar exatamente o que é exibido
vi.mock('@/components/editor/unified', () => {
    return {
        UnifiedStepRenderer: ({ quizState }: any) => (
            <div data-testid="result-step-mock">
                <h1>{quizState?.userName}, seu estilo predominante é:</h1>
                <span data-testid="primary-style">{quizState?.resultStyle}</span>
            </div>
        ),
        registerProductionSteps: vi.fn(),
    };
});

// Helper para criar estado simulado já na etapa de resultado
const makeResultState = (userName: string, resultStyle: string) => ({
    currentStep: 'step-20',
    answers: {},
    scores: {},
    strategicAnswers: {},
    resultStyle,
    secondaryStyles: ['natural', 'clássico'],
    userProfile: {
        userName,
        resultStyle,
        secondaryStyles: ['natural', 'clássico'],
        strategicAnswers: {}
    }
});

describe('Rota /quiz-estilo - exibição de resultado com nome Maria', () => {
    it('renderiza resultado com o nome Maria e estilo Elegante', () => {
        // Mock do hook useQuizState para já retornar estado de resultado
        vi.spyOn(useQuizStateModule, 'useQuizState').mockReturnValue({
            state: {
                currentStep: 'step-20',
                userProfile: { userName: 'Maria', resultStyle: 'Elegante', secondaryStyles: ['Natural'], strategicAnswers: {} },
                answers: {},
            },
            currentStepData: { type: 'result', title: '{userName}, seu estilo predominante é:' },
            progress: 95,
            nextStep: vi.fn(),
            setUserName: vi.fn(),
            addAnswer: vi.fn(),
            addStrategicAnswer: vi.fn(),
            getOfferKey: vi.fn(),
            // Campos simplificados compatíveis com QuizApp
            currentStep: 'step-20',
            userName: 'Maria',
            answers: {},
            strategicAnswers: {},
            resultStyle: 'Elegante',
            secondaryStyles: ['Natural'],
        } as any);

        render(<QuizEstiloPessoalPage />);

        // Validações
        expect(screen.getByTestId('result-step-mock')).toBeInTheDocument();
        expect(screen.getByText(/Maria, seu estilo predominante é:/i)).toBeInTheDocument();
        const styleEl = screen.getByTestId('primary-style');
        expect(styleEl.textContent).toBe('Elegante');
    });
});
