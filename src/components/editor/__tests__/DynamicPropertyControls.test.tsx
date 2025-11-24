import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DynamicPropertyControls } from '../DynamicPropertyControls';
import { schemaInterpreter } from '@/core/schema/SchemaInterpreter';

// Mock do schemaInterpreter
vi.mock('@/core/schema/SchemaInterpreter', () => ({
    schemaInterpreter: {
        getBlockSchema: vi.fn(),
    },
}));

// Mock dos componentes de UI para simplificar o teste e evitar problemas com dependências
vi.mock('@/components/ui/input', () => ({
    Input: ({ value, onChange, id, ...props }: any) => (
        <input
            id={id}
            data-testid="mock-input"
            value={value}
            onChange={onChange}
            {...props}
        />
    ),
}));

vi.mock('@/components/ui/label', () => ({
    Label: ({ children, htmlFor, ...props }: any) => (
        <label htmlFor={htmlFor} {...props}>
            {children}
        </label>
    ),
}));

vi.mock('@/components/ui/switch', () => ({
    Switch: ({ checked, onCheckedChange, id, ...props }: any) => (
        <button
            id={id}
            role="switch"
            aria-checked={checked}
            onClick={() => onCheckedChange(!checked)}
            {...props}
        >
            Switch
        </button>
    ),
}));

describe('DynamicPropertyControls', () => {
    const mockOnChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve renderizar mensagem de erro quando schema não é encontrado', () => {
        (schemaInterpreter.getBlockSchema as any).mockReturnValue(undefined);

        render(
            <DynamicPropertyControls
                elementType="unknown-block"
                properties={{}}
                onChange={mockOnChange}
            />
        );

        expect(screen.getByText(/Schema não encontrado/i)).not.toBeNull();
        expect(screen.getByText(/unknown-block/)).not.toBeNull();
    });

    it('deve renderizar controles baseados no schema', () => {
        const mockSchema = {
            type: 'test-block',
            label: 'Test Block',
            category: 'content',
            properties: {
                title: {
                    type: 'string',
                    control: 'text',
                    label: 'Título',
                    default: 'Default Title',
                },
                showDescription: {
                    type: 'boolean',
                    control: 'toggle',
                    label: 'Mostrar Descrição',
                    default: false,
                },
            },
        };

        (schemaInterpreter.getBlockSchema as any).mockReturnValue(mockSchema);

        const properties = {
            title: 'Meu Título',
            showDescription: true,
        };

        render(
            <DynamicPropertyControls
                elementType="test-block"
                properties={properties}
                onChange={mockOnChange}
            />
        );

        // Verifica se o label do título está presente
        expect(screen.getByLabelText('Título')).not.toBeNull();
        expect(screen.getByDisplayValue('Meu Título')).not.toBeNull();

        // Verifica se o toggle está presente
        expect(screen.getByText('Mostrar Descrição')).not.toBeNull();
        expect(screen.getByRole('switch')).not.toBeNull();
    }); it('deve chamar onChange quando um valor é alterado', () => {
        const mockSchema = {
            type: 'test-block',
            label: 'Test Block',
            category: 'content',
            properties: {
                title: {
                    type: 'string',
                    control: 'text',
                    label: 'Título',
                },
            },
        };

        (schemaInterpreter.getBlockSchema as any).mockReturnValue(mockSchema);

        const properties = {
            title: 'Old Title',
        };

        render(
            <DynamicPropertyControls
                elementType="test-block"
                properties={properties}
                onChange={mockOnChange}
            />
        );

        const input = screen.getByLabelText('Título');
        fireEvent.change(input, { target: { value: 'New Title' } });

        expect(mockOnChange).toHaveBeenCalledWith('title', 'New Title');
    });
});
