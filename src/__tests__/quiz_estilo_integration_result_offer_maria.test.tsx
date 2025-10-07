import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { UnifiedStepRenderer, registerProductionSteps } from '@/components/editor/unified';

// Mock simples de indexedDB para evitar erros em hooks de imagem/cache
class IDBRequestMock {
    result: any = {};
    error: any = null;
    onsuccess: ((this: IDBRequestMock, ev: any) => any) | null = null;
    onerror: ((this: IDBRequestMock, ev: any) => any) | null = null;
    onupgradeneeded: ((this: IDBRequestMock, ev: any) => any) | null = null;
}
// @ts-ignore
global.indexedDB = {
    open: () => {
        const req = new IDBRequestMock();
        setTimeout(() => {
            req.onsuccess && req.onsuccess.call(req, {} as any);
        }, 0);
        return req as any;
    }
};

// Mock mínimo do console para evitar poluição
const originalLog = console.log;
beforeAll(() => {
    console.log = (..._args: any[]) => { }; // silenciar
    registerProductionSteps();
});

const baseQuizState = {
    currentStep: 20,
    userName: 'Maria',
    answers: {},
    strategicAnswers: {
        'Qual desses resultados você mais gostaria de alcançar?': 'montar-looks-facilidade'
    },
    resultStyle: 'elegante', // slug canônico usado no styleConfig (normalmente sem acento ou ajustado pelo resolve)
    secondaryStyles: ['natural']
};

describe('Integração UnifiedStepRenderer → Resultado e Oferta (Maria)', () => {
    it('renderiza step-20 (resultado) com nome e estilo', async () => {
        const { container } = render(
            <UnifiedStepRenderer
                stepId="step-20"
                mode="production"
                quizState={baseQuizState as any}
                stepProps={{
                    title: '{userName}, seu estilo predominante é:',
                    type: 'result'
                }}
            />
        );
        // Espera lazy adapter carregar (spinner some)
        await waitFor(() => {
            expect(screen.queryByText(/Carregando\s+Step step-20/i)).toBeNull();
        }, { timeout: 2000 });

        expect(screen.getByText(/Maria, seu estilo predominante é:/i)).toBeTruthy();
        expect(container.firstChild).toMatchSnapshot();
    });

    it('renderiza step-21 (oferta) e mostra CTA correto para objetivo montar looks', async () => {
        render(
            <UnifiedStepRenderer
                stepId="step-21"
                mode="production"
                quizState={baseQuizState as any}
                stepProps={{
                    type: 'offer',
                    offerMap: {
                        'Montar looks com mais facilidade e confiança': {
                            title: '{userName}, solução para montar looks',
                            description: 'Liberamos uma oferta especial para combinar suas peças.',
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

        expect(screen.getByText(/Maria, solução para montar looks/i)).toBeTruthy();
        expect(screen.getByText('Quero combinar minhas peças')).toBeInTheDocument();
    });

    afterAll(() => {
        console.log = originalLog;
    });
});
