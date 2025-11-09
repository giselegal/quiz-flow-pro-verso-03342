import React from 'react';
import { render, screen } from '@testing-library/react';
import { BlockTypeRenderer } from '@/components/editor/quiz/renderers/BlockTypeRenderer';

describe('IntroTitleBlock - HTML fallback', () => {
    it('renderiza HTML presente em content.title quando titleHtml não é fornecido', () => {
        const block: any = {
            id: 'intro-title',
            type: 'intro-title',
            order: 1,
            properties: { fontSize: 'text-2xl' },
            content: {
                title: '<span data-testid="inner-span">Chega</span> de um guarda-roupa lotado',
            },
        };

        render(<BlockTypeRenderer block={block as any} />);

        // O span interno deve existir (ou seja, HTML interpretado)
        const inner = screen.getByTestId('inner-span');
        expect(inner).toBeInTheDocument();
        expect(inner.textContent).toMatch(/Chega/i);
    });
});
