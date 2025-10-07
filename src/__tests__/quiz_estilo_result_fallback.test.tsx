import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { UnifiedStepRenderer, registerProductionSteps } from '@/components/editor/unified';

// Registrar steps reais
registerProductionSteps();

describe('Fallback de resultStyle inexistente', () => {
    it('usa primeiro estilo disponível (Clássico) quando resultStyle não existe', () => {
        const { container } = render(
            <UnifiedStepRenderer
                stepId="step-20"
                mode="production"
                quizState={{
                    currentStep: 20,
                    userName: 'Maria',
                    answers: {},
                    strategicAnswers: {},
                    resultStyle: 'inexistente-total',
                    secondaryStyles: []
                } as any}
                stepProps={{ title: '{userName}, seu estilo predominante é:' }}
            />
        );

        // Verifica interpolação do título
        expect(screen.getByText(/Maria, seu estilo predominante é:/i)).toBeTruthy();
        // Como fallback pega o primeiro estilo (classico → Clássico) deve renderizar o nome Clássico em algum local
        expect(container.textContent).toMatch(/Clássico/);
    });
});
