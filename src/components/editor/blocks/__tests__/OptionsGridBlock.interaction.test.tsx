/* @vitest-environment jsdom */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OptionsGridBlock from '@/components/editor/blocks/OptionsGridBlock';

const baseBlock: any = {
    id: 'grid-02',
    type: 'options-grid',
    properties: {},
};

function renderGrid(overrides: any = {}) {
    const props: any = {
        block: { ...baseBlock, properties: { ...overrides.properties } },
        isPreviewMode: false,
        properties: {
            question: 'Pergunta de teste',
            options: [
                { id: 'opt-a', text: 'Opção A' },
                { id: 'opt-b', text: 'Opção B' },
            ],
            multipleSelection: !!overrides.multipleSelection,
            maxSelections: overrides.maxSelections ?? (overrides.multipleSelection ? 2 : 1),
            minSelections: overrides.minSelections ?? 1,
            allowDeselection: overrides.allowDeselection ?? true,
            selectedOptions: overrides.selectedOptions ?? [],
        },
        onPropertyChange: overrides.onPropertyChange || vi.fn(),
    };
    return render(<OptionsGridBlock {...props} />);
}

describe('OptionsGridBlock - interação básica (editor mode)', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('marca opção como selecionada ao clicar (single selection)', () => {
        const onPropertyChange = vi.fn();
        renderGrid({ multipleSelection: false, selectedOptions: [], onPropertyChange });

        const optA = screen.getByTestId('grid-option-opt-a');
        fireEvent.click(optA);

        expect(onPropertyChange).toHaveBeenCalledWith('selectedOption', 'opt-a');
    });

    it('adiciona e remove seleção (multi selection com allowDeselection)', () => {
        const onPropertyChange = vi.fn();
        renderGrid({ multipleSelection: true, selectedOptions: [], onPropertyChange, allowDeselection: true, maxSelections: 2 });

        const optA = screen.getByTestId('grid-option-opt-a');
        const optB = screen.getByTestId('grid-option-opt-b');

        fireEvent.click(optA);
        // Primeira seleção
        expect(onPropertyChange).toHaveBeenCalledWith('selectedOptions', ['opt-a']);

        // Simular atualização de prop selecionada
        onPropertyChange.mockClear();
        renderGrid({ multipleSelection: true, selectedOptions: ['opt-a'], onPropertyChange, allowDeselection: true, maxSelections: 2 });

        fireEvent.click(optB);
        // Segunda seleção
        expect(onPropertyChange).toHaveBeenCalledWith('selectedOptions', ['opt-a', 'opt-b']);

        // Simular atualização e remover A
        onPropertyChange.mockClear();
        renderGrid({ multipleSelection: true, selectedOptions: ['opt-a', 'opt-b'], onPropertyChange, allowDeselection: true, maxSelections: 2 });

        fireEvent.click(optA);
        expect(onPropertyChange).toHaveBeenCalledWith('selectedOptions', ['opt-b']);
    });
});
