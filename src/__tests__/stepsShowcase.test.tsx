import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import StepsShowcase from '@/pages/StepsShowcase';

describe('StepsShowcase', () => {
    it('renderiza 21 seções (uma por etapa)', async () => {
        render(<StepsShowcase />);

        // Cada section tem aria-label "Etapa N"
        const sections = screen.getAllByRole('region');
        // tolera pequenas variações mas espera 21
        expect(sections.length).toBe(21);

        // Verifica cabeçalhos numerados
        const first = sections[0];
        expect(within(first).getByText(/Etapa\s*1/i)).toBeTruthy();
    });
});
