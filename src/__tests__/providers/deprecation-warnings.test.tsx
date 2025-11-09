/**
 * 🧪 TESTE: Verificação de Warnings de Depreciação
 * 
 * Valida que providers deprecados exibem warnings apropriados
 * e que o provider canônico (UnifiedAppProvider) funciona corretamente.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { UnifiedAppProvider } from '@/providers/UnifiedAppProvider';
import { FunnelContext } from '@/core/contexts/FunnelContext';

describe('Provider Canonical (UnifiedAppProvider) Sem Depreciações', () => {
    let consoleWarnSpy: any;

    beforeEach(() => {
        consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
    });

    afterEach(() => {
        consoleWarnSpy.mockRestore();
    });

    describe('UnifiedAppProvider (Canônico)', () => {
        it('NÃO deve exibir warning (provider recomendado)', () => {
            render(
                <UnifiedAppProvider context={FunnelContext.EDITOR}>
                    <div>Test Content</div>
                </UnifiedAppProvider>,
            );

            // Pode haver outros warnings, mas não sobre depreciação
            const deprecationWarnings = consoleWarnSpy.mock.calls.filter((call: any) =>
                call[0]?.includes('deprecated'),
            );
            expect(deprecationWarnings).toHaveLength(0);
        });

        it('deve renderizar children normalmente', () => {
            const { getByText } = render(
                <UnifiedAppProvider context={FunnelContext.EDITOR}>
                    <div>Test Content</div>
                </UnifiedAppProvider>,
            );

            expect(getByText('Test Content')).toBeTruthy();
        });

        it('deve aceitar diferentes contextos', () => {
            const contexts = [
                FunnelContext.EDITOR,
                FunnelContext.PREVIEW,
                FunnelContext.TEMPLATES,
                FunnelContext.MY_FUNNELS,
            ];

            contexts.forEach((context) => {
                const { getByText } = render(
                    <UnifiedAppProvider context={context}>
                        <div>Context: {context}</div>
                    </UnifiedAppProvider>,
                );

                expect(getByText(`Context: ${context}`)).toBeTruthy();
            });
        });
    });

    it('não deve emitir warnings de depreciação após remoção dos legados', () => {
        render(
            <UnifiedAppProvider>
                <div>Unified</div>
            </UnifiedAppProvider>,
        );
        const deprecationWarnings = consoleWarnSpy.mock.calls.filter((call: any) =>
            call[0]?.includes('deprecated'),
        );
        expect(deprecationWarnings).toHaveLength(0);
    });
});
