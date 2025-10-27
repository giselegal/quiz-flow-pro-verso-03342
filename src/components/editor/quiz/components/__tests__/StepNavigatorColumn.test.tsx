import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StepNavigatorColumn, StepNavigatorItem } from '../StepNavigatorColumn';

describe('StepNavigatorColumn', () => {
    it('renderiza cabeçalho e lista de etapas', () => {
        const steps: StepNavigatorItem[] = [
            { id: 's1', label: 'Intro', isValid: true, blockCount: 2 },
            { id: 's2', label: 'Perguntas', isValid: false, blockCount: 5 },
        ];
        const onStepChange = vi.fn();

        render(
            <StepNavigatorColumn steps={steps} currentStep={steps[0].id} onStepChange={onStepChange} />,
        );

        expect(screen.getByText('Etapas')).toBeInTheDocument();
        expect(screen.getByText('2 etapas configuradas')).toBeInTheDocument();

        // Troca de etapa
        fireEvent.click(screen.getByText('Perguntas'));
        expect(onStepChange).toHaveBeenCalledWith('s2');
    });
});
