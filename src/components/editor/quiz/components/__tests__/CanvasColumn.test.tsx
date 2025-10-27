import React from 'react';
import { render, screen } from '@testing-library/react';
import { CanvasColumn, CanvasBlock } from '../CanvasColumn';

describe('CanvasColumn', () => {
    it('mostra alerta quando não há blocos', () => {
        render(<CanvasColumn blocks={[]} />);
        expect(
            screen.getByText('Arraste componentes da biblioteca para começar a construir sua etapa'),
        ).toBeInTheDocument();
    });

    it('renderiza blocos quando fornecidos', () => {
        const blocks: CanvasBlock[] = [
            { id: 'b1', type: 'text', label: 'Título', order: 0 },
        ];

        render(<CanvasColumn blocks={blocks} />);

        expect(screen.getByText('Canvas')).toBeInTheDocument();
        expect(screen.getByText('Título')).toBeInTheDocument();
        expect(screen.getByText('1 bloco')).toBeInTheDocument();
    });
});
