import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { UnifiedStepRenderer, registerProductionSteps } from '@/components/editor/unified';

// Registrar steps antes dos testes
registerProductionSteps();

describe('Step-12 (Transição Estratégica) - botão manual de continuar', () => {
    it('exibe botão Continuar habilitado e permite avançar', async () => {
        const onNext = vi.fn();

        render(
            <UnifiedStepRenderer
                stepId="step-12"
                mode="production"
                quizState={{ currentStep: 12, userName: 'Maria' } as any}
                stepProps={{
                    type: 'transition',
                    title: '🕐 Enquanto calculamos o seu resultado...',
                    text: 'Mensagem de teste',
                    showContinueButton: true,
                    continueButtonText: 'Continuar',
                    nextStep: 'step-13'
                }}
                onNext={onNext}
            />
        );

            // Esperar carregamento do componente real (lazy)
            await waitFor(() => {
                expect(screen.queryByText(/Carregando Step step-12/i)).toBeNull();
            }, { timeout: 2000 });

            // Título visível após lazy load
            expect(screen.getByText(/Enquanto calculamos o seu resultado/i)).toBeInTheDocument();

        // Botão aparece
        const btn = await screen.findByRole('button', { name: /continuar/i });
        expect(btn).toBeEnabled();

        fireEvent.click(btn);
        expect(onNext).toHaveBeenCalledTimes(1);
    });
});
