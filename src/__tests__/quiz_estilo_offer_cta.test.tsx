import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { UnifiedStepRenderer, registerProductionSteps } from '@/components/editor/unified';

beforeAll(() => {
    registerProductionSteps();
});

describe('CTA da oferta (step-21)', () => {
    it('renderiza link CTA com texto e atributos esperados', async () => {

        render(
            <UnifiedStepRenderer
                stepId="step-21"
                mode="production"
                quizState={{
                    currentStep: 21,
                    userName: 'Maria',
                    answers: {},
                    strategicAnswers: {
                        'Qual desses resultados você mais gostaria de alcançar?': 'montar-looks-facilidade'
                    },
                    resultStyle: 'classico',
                    secondaryStyles: []
                } as any}
                stepProps={{
                    type: 'offer',
                    offerMap: {
                        'Montar looks com mais facilidade e confiança': {
                            title: '{userName}, solução para montar looks',
                            description: 'Oferta teste',
                            buttonText: 'Quero combinar minhas peças',
                            testimonial: { quote: 'Ok', author: 'Tester' }
                        }
                    }
                }}
            />
        );

        await waitFor(() => {
            expect(screen.queryByText(/Carregando\s+Step step-21/i)).toBeNull();
        }, { timeout: 2000 });

        const btn = screen.getByRole('link', { name: /quero combinar minhas peças/i });
        expect(btn).toHaveAttribute('href');
        // Poderíamos validar target quando implementado
        // expect(btn).toHaveAttribute('target', '_blank'); (se adicionado futuramente)
    });
});
