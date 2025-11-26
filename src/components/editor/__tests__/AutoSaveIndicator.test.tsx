/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AutoSaveIndicator, AutoSaveIndicatorCompact, AutoSaveIndicatorWithTooltip } from '../AutoSaveIndicator';

describe('AutoSaveIndicator', () => {
    it('should render "Salvando..." when isSaving is true', () => {
        render(
            <AutoSaveIndicator
                isSaving={true}
                lastSaved={null}
                error={null}
            />
        );

        expect(screen.getByText('Salvando...')).toBeInTheDocument();
    });

    it('should render "Salvo" when lastSaved is provided', () => {
        const lastSaved = Date.now();

        render(
            <AutoSaveIndicator
                isSaving={false}
                lastSaved={lastSaved}
                error={null}
            />
        );

        expect(screen.getByText(/Salvo/)).toBeInTheDocument();
    });

    it('should render error message when error is provided', () => {
        const error = new Error('Failed to save');

        render(
            <AutoSaveIndicator
                isSaving={false}
                lastSaved={null}
                error={error}
            />
        );

        expect(screen.getByText('Erro ao salvar')).toBeInTheDocument();
    });

    it('should render "Auto-save ativo" when no state is provided', () => {
        render(
            <AutoSaveIndicator
                isSaving={false}
                lastSaved={null}
                error={null}
            />
        );

        expect(screen.getByText('Auto-save ativo')).toBeInTheDocument();
    });

    it('should update time since last save', async () => {
        const lastSaved = Date.now() - 10000; // 10 seconds ago

        render(
            <AutoSaveIndicator
                isSaving={false}
                lastSaved={lastSaved}
                error={null}
            />
        );

        // Should show seconds
        expect(screen.getByText(/\d+s atrás/)).toBeInTheDocument();
    });

    it('should not show text when showText is false', () => {
        render(
            <AutoSaveIndicator
                isSaving={true}
                lastSaved={null}
                error={null}
                showText={false}
            />
        );

        expect(screen.queryByText('Salvando...')).not.toBeInTheDocument();
    });

    it('should render compact variant', () => {
        const { container } = render(
            <AutoSaveIndicatorCompact
                isSaving={false}
                lastSaved={Date.now()}
                error={null}
            />
        );

        // Compact version should not have text
        expect(container.querySelector('span')).not.toBeInTheDocument();
    });

    it('should have correct aria attributes', () => {
        const { container } = render(
            <AutoSaveIndicator
                isSaving={true}
                lastSaved={null}
                error={null}
            />
        );

        const status = container.querySelector('[role="status"]');
        expect(status).toBeInTheDocument();
        expect(status).toHaveAttribute('aria-live', 'polite');
    });

    it('should apply custom className', () => {
        const { container } = render(
            <AutoSaveIndicator
                isSaving={false}
                lastSaved={Date.now()}
                error={null}
                className="custom-class"
            />
        );

        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should render with tooltip variant', () => {
        render(
            <AutoSaveIndicatorWithTooltip
                isSaving={false}
                lastSaved={Date.now()}
                error={null}
            />
        );

        // Tooltip variant should render compact version
        const status = screen.getByRole('status');
        expect(status).toBeInTheDocument();
    });
});
