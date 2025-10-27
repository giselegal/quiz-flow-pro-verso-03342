import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SafeBoundary from '@/components/common/SafeBoundary';

const Boom: React.FC = () => {
    throw new Error('boom');
};

describe('SafeBoundary', () => {
    it('exibe fallback quando um filho lança erro', () => {
        render(
            <SafeBoundary label="Falhou bloco X">
                <Boom />
            </SafeBoundary>,
        );
        expect(screen.getByRole('alert')).toHaveTextContent('Falhou bloco X');
    });

    it('usa fallback customizado quando fornecido', () => {
        render(
            <SafeBoundary fallback={<div data-testid="fb">fallback</div>}>
                <Boom />
            </SafeBoundary>,
        );
        expect(screen.getByTestId('fb')).toHaveTextContent('fallback');
    });

    it('chama onError quando ocorre erro', () => {
        const onError = vi.fn();
        render(
            <SafeBoundary onError={onError}>
                <Boom />
            </SafeBoundary>,
        );
        expect(onError).toHaveBeenCalled();
    });
});
