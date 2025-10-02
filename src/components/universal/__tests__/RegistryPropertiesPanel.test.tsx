import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import RegistryPropertiesPanel from '../RegistryPropertiesPanel';

const mockBlock = {
    id: 'block-1',
    type: 'quiz-intro-header',
    properties: {
        title: 'Título Original',
        subtitle: 'Subtítulo',
        showLogo: true,
        logoUrl: '',
        textAlign: 'center'
    }
};

describe('RegistryPropertiesPanel', () => {
    it('renderiza mensagem quando nenhum bloco está selecionado', () => {
        const { getByText } = render(
            <RegistryPropertiesPanel
                selectedBlock={null as any}
                onUpdate={() => { }}
                onClose={() => { }}
                onDelete={() => { }}
            />
        );
        expect(getByText('Nenhum bloco selecionado')).toBeInTheDocument();
        expect(getByText('Clique em um elemento para editar suas propriedades')).toBeInTheDocument();
    });

    it('renderiza campos do bloco selecionado', () => {
        const { getByText, getAllByText } = render(
            <RegistryPropertiesPanel
                selectedBlock={mockBlock as any}
                onUpdate={() => { }}
                onClose={() => { }}
                onDelete={() => { }}
            />
        );
        // Novo header inclui prefixo e título derivado do registry
        expect(getByText(/API PANEL ATIVO/)).toBeInTheDocument();
        const tituloMatches = getAllByText(/Título/i);
        expect(tituloMatches.length).toBeGreaterThan(0);
    });

    it('dispara onUpdate ao alterar campo de texto', async () => {
        const onUpdate = vi.fn();
        const { container, getByTestId } = render(
            <RegistryPropertiesPanel
                selectedBlock={mockBlock as any}
                onUpdate={onUpdate}
                onClose={() => { }}
                onDelete={() => { }}
            />
        );
        // Localiza input de título via testid estável
        const input = getByTestId('prop-input-title') as HTMLInputElement;
        expect(input).toBeTruthy();
        fireEvent.change(input, { target: { value: 'Novo Título' } });
        await waitFor(() => expect(onUpdate).toHaveBeenCalled());
    });

    it('exibe valor inicial do campo de título (via value)', () => {
        const { container, getByDisplayValue } = render(
            <RegistryPropertiesPanel
                selectedBlock={mockBlock as any}
                onUpdate={() => { }}
                onClose={() => { }}
                onDelete={() => { }}
            />
        );
        // Prefer getByDisplayValue; se não existir, fallback manual
        const input = getByDisplayValue('Título Original') as HTMLInputElement | undefined;
        expect(input || container.querySelector('input[value="Título Original"]')).toBeTruthy();
    });

    it('renderiza botões de reset para campos específicos', () => {
        const { container } = render(
            <RegistryPropertiesPanel
                selectedBlock={mockBlock as any}
                onUpdate={() => { }}
                onClose={() => { }}
                onDelete={() => { }}
            />
        );

        // Verifica se os botões de reset estão presentes (procura por title)
        const resetButtons = container.querySelectorAll('[title="Resetar para valor padrão"]');
        expect(resetButtons.length).toBeGreaterThan(0);
    });
});
