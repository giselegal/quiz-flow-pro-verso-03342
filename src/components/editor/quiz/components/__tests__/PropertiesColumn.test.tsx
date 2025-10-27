import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertiesColumn, PropertyField } from '../PropertiesColumn';

describe('PropertiesColumn', () => {
    it('exibe alerta quando nenhum bloco está selecionado', () => {
        render(<PropertiesColumn />);
        expect(screen.getByTestId('properties-no-selection')).toBeInTheDocument();
    });

    it('renderiza campos e emite onFieldChange', () => {
        const fields: PropertyField[] = [
            { key: 'title', label: 'Título', type: 'text', value: '' },
            { key: 'enabled', label: 'Habilitado', type: 'boolean', value: true, description: 'Liga/Desliga' },
        ];
        const onFieldChange = vi.fn();

        render(
            <PropertiesColumn
                selectedBlockId="b1"
                selectedBlockType="text"
                fields={fields}
                onFieldChange={onFieldChange}
            />,
        );

        expect(screen.getByTestId('properties-selected-type')).toHaveTextContent('text');

        const input = screen.getByDisplayValue('');
        fireEvent.change(input, { target: { value: 'Novo título' } });
        expect(onFieldChange).toHaveBeenCalledWith('title', 'Novo título');
    });
});
