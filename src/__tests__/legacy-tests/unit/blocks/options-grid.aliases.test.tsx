import React from 'react';
import { render, screen } from '@testing-library/react';
import { BlockTypeRenderer } from '@/components/editor/quiz/renderers/BlockTypeRenderer';

describe('OptionsGridBlock - image alias', () => {
    it('usa option.image como fallback para imageUrl', () => {
        const block: any = {
            id: 'opts-1',
            type: 'options-grid',
            order: 0,
            properties: {},
            content: {
                options: [
                    { id: 'a', text: 'Opção A', image: 'https://example.com/a.jpg' },
                    { id: 'b', text: 'Opção B', imageUrl: 'https://example.com/b.jpg' },
                ],
            },
        };

        render(<BlockTypeRenderer block={block as any} />);

        // Deve renderizar 2 imagens (image + imageUrl)
        const imgs = screen.getAllByRole('img');
        expect(imgs.length).toBe(2);
        expect((imgs[0] as HTMLImageElement).src).toContain('https://example.com/a.jpg');
        expect((imgs[1] as HTMLImageElement).src).toContain('https://example.com/b.jpg');
    });
});
