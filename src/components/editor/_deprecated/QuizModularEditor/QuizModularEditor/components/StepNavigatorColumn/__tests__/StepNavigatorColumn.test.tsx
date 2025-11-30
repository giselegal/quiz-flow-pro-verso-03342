import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StepNavigatorColumn from '../index';

// Mock do templateService para o caso sem prop steps
vi.mock('@/services/canonical/TemplateService', () => ({
    templateService: {
        steps: {
            list: () => ({
                success: true,
                data: [
                    { id: 'step-01', name: 'Introdução', order: 1 },
                    { id: 'step-02', name: 'Pergunta', order: 2 },
                ],
            }),
        },
    },
}));

describe('StepNavigatorColumn (QM Editor)', () => {
    it('renderiza lista a partir da prop steps e emite onSelectStep ao clicar', () => {
        const onSelectStep = vi.fn();
        const steps = [
            { key: 'step-01', title: '01 - Introdução' },
            { key: 'step-02', title: '02 - Pergunta' },
        ];

        render(
            <StepNavigatorColumn
                steps={steps}
                currentStepKey={'step-01'}
                onSelectStep={onSelectStep}
            />,
        );

        // Render
        expect(screen.getByText('Navegação')).toBeInTheDocument();
        expect(screen.getByText('01 - Introdução')).toBeInTheDocument();
        expect(screen.getByText('02 - Pergunta')).toBeInTheDocument();

        // Click troca
        fireEvent.click(screen.getByText('02 - Pergunta'));
        expect(onSelectStep).toHaveBeenCalledWith('step-02');
    });

    it('quando não recebe steps, usa a fonte canônica e seleciona inicial', () => {
        const onSelectStep = vi.fn();

        render(
            <StepNavigatorColumn
                initialStepKey={undefined}
                currentStepKey={null}
                onSelectStep={onSelectStep}
            />,
        );

        // Deve renderizar itens do canônico
        expect(screen.getByText('01 - Introdução')).toBeInTheDocument();
        expect(screen.getByText('02 - Pergunta')).toBeInTheDocument();

        // Efeito inicial deve selecionar o primeiro item
        expect(onSelectStep).toHaveBeenCalledWith('step-01');
    });
});
