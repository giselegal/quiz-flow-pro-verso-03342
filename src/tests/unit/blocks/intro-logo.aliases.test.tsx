import React from 'react';
import { render, screen } from '@testing-library/react';
import { BlockTypeRenderer } from '@/components/editor/quiz/renderers/BlockTypeRenderer';

const URL = 'https://example.com/logo.png';

describe('IntroLogoBlock - aliases', () => {
    it('renderiza quando content.src é usado (fallback)', () => {
        const block: any = {
            id: 'intro-logo',
            type: 'intro-logo',
            order: 0,
            properties: { height: '40px' },
            content: { src: URL, alt: 'Logo Alt' },
        };

        render(<BlockTypeRenderer block={block as any} />);

        const img = screen.getByRole('img', { name: /logo alt/i });
        expect(img).toBeInTheDocument();
        expect((img as HTMLImageElement).src).toBe(URL + '/'); // jsdom appends '/'
    });

    it('renderiza quando content.imageUrl é usado (fallback)', () => {
        const block: any = {
            id: 'intro-logo',
            type: 'intro-logo',
            order: 0,
            properties: { height: '40px' },
            content: { imageUrl: URL, logoAlt: 'Minha Logo' },
        };

        render(<BlockTypeRenderer block={block as any} />);

        const img = screen.getByRole('img', { name: /minha logo/i });
        expect(img).toBeInTheDocument();
        expect((img as HTMLImageElement).src).toBe(URL + '/');
    });
});
