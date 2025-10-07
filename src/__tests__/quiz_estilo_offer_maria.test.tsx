import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import QuizEstiloPessoalPage from '@/pages/QuizEstiloPessoalPage';
import * as useQuizStateModule from '@/hooks/useQuizState';

// Mock Helmet para evitar necessidade de provider
vi.mock('react-helmet-async', () => ({
    Helmet: ({ children }: any) => <>{children}</>,
    HelmetProvider: ({ children }: any) => <>{children}</>
}));

// Mock UnifiedStepRenderer para simular step de oferta (step-21)
vi.mock('@/components/editor/unified', () => {
    return {
        UnifiedStepRenderer: ({ quizState, stepProps }: any) => {
            const offerKey = 'Montar looks com mais facilidade e confiança';
            const offer = stepProps?.offerMap?.[offerKey];
            return (
                <div data-testid="offer-step-mock">
                    <h2>{offer?.title?.replace('{userName}', quizState?.userName)}</h2>
                    <p data-testid="offer-description">{offer?.description}</p>
                    <button>{offer?.buttonText}</button>
                </div>
            );
        },
        registerProductionSteps: vi.fn(),
    };
});

describe('Rota /quiz-estilo - step-21 oferta personalizada para Maria', () => {
    it('renderiza oferta correta baseada na resposta estratégica e nome', () => {
        const strategicQuestion = 'Qual desses resultados você mais gostaria de alcançar?';
        const strategicAnswerId = 'montar-looks-facilidade';
        const mappedOfferKey = 'Montar looks com mais facilidade e confiança';

        // Mock do hook para simular estado na etapa final (step-21)
        vi.spyOn(useQuizStateModule, 'useQuizState').mockReturnValue({
            state: {
                currentStep: 'step-21',
                userProfile: {
                    userName: 'Maria',
                    resultStyle: 'Elegante',
                    secondaryStyles: ['Natural'],
                    strategicAnswers: {
                        [strategicQuestion]: strategicAnswerId
                    }
                },
                answers: {},
            },
            currentStepData: {
                type: 'offer',
                offerMap: {
                    [mappedOfferKey]: {
                        title: '{userName}, encontramos a solução para **combinar as suas peças com confiança!**',
                        description: 'Chega de incertezas. Liberamos uma oferta especial que vai te guiar passo a passo para criar looks harmoniosos e incríveis, usando o que você já tem.',
                        buttonText: 'Quero aprender a combinar as minhas peças agora!',
                        testimonial: { quote: 'Ok', author: 'Tester' }
                    }
                }
            },
            progress: 100,
            nextStep: vi.fn(),
            setUserName: vi.fn(),
            addAnswer: vi.fn(),
            addStrategicAnswer: vi.fn(),
            getOfferKey: () => mappedOfferKey,
            currentStep: 'step-21',
            userName: 'Maria',
            answers: {},
            strategicAnswers: { [strategicQuestion]: strategicAnswerId },
            resultStyle: 'Elegante',
            secondaryStyles: ['Natural']
        } as any);

        render(<QuizEstiloPessoalPage />);

        expect(screen.getByTestId('offer-step-mock')).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2 }).textContent).toMatch(/^Maria, encontramos a solução/);
        expect(screen.getByTestId('offer-description').textContent).toContain('oferta especial');
        expect(screen.getByText('Quero aprender a combinar as minhas peças agora!')).toBeInTheDocument();
    });
});
