/**
 * 🧪 TESTE: Verificação de Warnings de Depreciação
 * 
 * Valida que providers deprecados exibem warnings apropriados
 * e que o provider canônico (UnifiedAppProvider) funciona corretamente.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { ConsolidatedProvider } from '@/providers/ConsolidatedProvider';
import { FunnelMasterProvider } from '@/providers/FunnelMasterProvider';
import { UnifiedAppProvider } from '@/providers/UnifiedAppProvider';
import { FunnelContext } from '@/core/contexts/FunnelContext';

describe('Provider Deprecation Warnings', () => {
    let consoleWarnSpy: any;

    beforeEach(() => {
        consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
    });

    afterEach(() => {
        consoleWarnSpy.mockRestore();
    });

    describe('ConsolidatedProvider', () => {
        it('deve exibir warning de depreciação', () => {
            render(
                <ConsolidatedProvider>
                    <div>Test Content</div>
                </ConsolidatedProvider>,
            );

            expect(consoleWarnSpy).toHaveBeenCalled();
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                expect.stringContaining('ConsolidatedProvider is deprecated'),
            );
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                expect.stringContaining('UnifiedAppProvider'),
            );
        });

        it('deve renderizar children normalmente (backward compatibility)', () => {
            const { getByText } = render(
                <ConsolidatedProvider>
                    <div>Test Content</div>
                </ConsolidatedProvider>,
            );

            expect(getByText('Test Content')).toBeTruthy();
        });
    });

    describe('FunnelMasterProvider', () => {
        it('deve exibir warning de depreciação', () => {
            render(
                <FunnelMasterProvider>
                    <div>Test Content</div>
                </FunnelMasterProvider>,
            );

            expect(consoleWarnSpy).toHaveBeenCalled();
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                expect.stringContaining('FunnelMasterProvider is deprecated'),
            );
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                expect.stringContaining('UnifiedAppProvider'),
            );
        });

        it('deve renderizar children normalmente (backward compatibility)', () => {
            const { getByText } = render(
                <FunnelMasterProvider>
                    <div>Test Content</div>
                </FunnelMasterProvider>,
            );

            expect(getByText('Test Content')).toBeTruthy();
        });
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

    describe('Comparação de Providers', () => {
        it('deve confirmar que UnifiedAppProvider é o único sem warnings', () => {
            const results = {
                consolidated: false,
                funnelMaster: false,
                unified: false,
            };

            // Test ConsolidatedProvider
            consoleWarnSpy.mockClear();
            render(
                <ConsolidatedProvider>
                    <div>1</div>
                </ConsolidatedProvider>,
            );
            results.consolidated = consoleWarnSpy.mock.calls.some((call: any) =>
                call[0]?.includes('deprecated'),
            );

            // Test FunnelMasterProvider
            consoleWarnSpy.mockClear();
            render(
                <FunnelMasterProvider>
                    <div>2</div>
                </FunnelMasterProvider>,
            );
            results.funnelMaster = consoleWarnSpy.mock.calls.some((call: any) =>
                call[0]?.includes('deprecated'),
            );

            // Test UnifiedAppProvider
            consoleWarnSpy.mockClear();
            render(
                <UnifiedAppProvider>
                    <div>3</div>
                </UnifiedAppProvider>,
            );
            results.unified = consoleWarnSpy.mock.calls.some((call: any) =>
                call[0]?.includes('deprecated'),
            );

            // Assertions
            expect(results.consolidated).toBe(true); // Deve ter warning
            expect(results.funnelMaster).toBe(true); // Deve ter warning
            expect(results.unified).toBe(false); // NÃO deve ter warning
        });
    });
});
