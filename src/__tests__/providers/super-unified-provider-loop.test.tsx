/**
 * 🧪 TESTE AUTOMATIZADO: Loop Infinito no SuperUnifiedProvider
 * 
 * Detecta e previne o erro "Maximum update depth exceeded"
 * causado por dependências circulares em useEffect
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { SuperUnifiedProvider, useSuperUnified } from '@/contexts/providers/SuperUnifiedProvider';
import React from 'react';

// Mock do hierarchicalTemplateSource
vi.mock('@/services/hierarchical-template-source', () => ({
    hierarchicalTemplateSource: {
        getPrimary: vi.fn().mockResolvedValue({ data: [] }),
        setPrimary: vi.fn().mockResolvedValue(true),
        invalidate: vi.fn().mockResolvedValue(true),
    }
}));

// Mock do supabase
vi.mock('@/lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
            onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
        },
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: null, error: null })
        }))
    }
}));

describe('🧪 SuperUnifiedProvider - Teste de Loop Infinito', () => {
    let consoleErrorSpy: any;
    let consoleWarnSpy: any;
    let renderCount = 0;

    beforeEach(() => {
        renderCount = 0;
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

        // Limpar localStorage
        if (typeof window !== 'undefined') {
            window.localStorage.clear();
        }
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
        consoleWarnSpy.mockRestore();
        vi.clearAllMocks();
    });

    it('✅ NÃO deve causar loop infinito ao carregar steps', async () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <SuperUnifiedProvider>
                {children}
            </SuperUnifiedProvider>
        );

        const { result, rerender } = renderHook(() => {
            renderCount++;
            return useSuperUnified();
        }, { wrapper });

        // Aguardar renders iniciais (mount + effects)
        await waitFor(() => {
            expect(result.current.state.editor.stepBlocks).toBeDefined();
        }, { timeout: 3000 });

        // ✅ ASSERT: Deve ter menos de 50 renders em 2 segundos
        // (Normal: ~5-10 renders no mount, problema: 100+)
        expect(renderCount).toBeLessThan(50);

        // ✅ ASSERT: Não deve ter erro "Maximum update depth"
        const maxDepthErrors = consoleErrorSpy.mock.calls.filter((call: any[]) =>
            call[0]?.includes?.('Maximum update depth exceeded')
        );
        expect(maxDepthErrors.length).toBe(0);

        // ✅ ASSERT: Estado deve estar consistente
        expect(result.current.state.editor.currentStep).toBe(1);
        expect(result.current.state.editor.totalSteps).toBe(21);
    });

    it('✅ NÃO deve causar loop ao mudar de step', async () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <SuperUnifiedProvider>
                {children}
            </SuperUnifiedProvider>
        );

        const { result } = renderHook(() => {
            renderCount++;
            return useSuperUnified();
        }, { wrapper });

        // Aguardar inicialização
        await waitFor(() => {
            expect(result.current.state.editor.stepBlocks).toBeDefined();
        });

        const rendersBefore = renderCount;

        // Mudar de step
        act(() => {
            result.current.setCurrentStep(2);
        });

        // Aguardar estabilização
        await waitFor(() => {
            expect(result.current.state.editor.currentStep).toBe(2);
        }, { timeout: 2000 });

        const rendersAfter = renderCount;
        const rendersDelta = rendersAfter - rendersBefore;

        // ✅ ASSERT: Deve ter menos de 10 renders após mudar step
        expect(rendersDelta).toBeLessThan(10);

        // ✅ ASSERT: Não deve ter erro "Maximum update depth"
        const maxDepthErrors = consoleErrorSpy.mock.calls.filter((call: any[]) =>
            call[0]?.includes?.('Maximum update depth exceeded')
        );
        expect(maxDepthErrors.length).toBe(0);
    });

    it('✅ NÃO deve causar loop ao adicionar bloco', async () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <SuperUnifiedProvider>
                {children}
            </SuperUnifiedProvider>
        );

        const { result } = renderHook(() => {
            renderCount++;
            return useSuperUnified();
        }, { wrapper });

        // Aguardar inicialização
        await waitFor(() => {
            expect(result.current.state.editor.stepBlocks).toBeDefined();
        });

        const rendersBefore = renderCount;

        // Adicionar bloco
        act(() => {
            result.current.addBlock(1, {
                id: 'test-block',
                type: 'text',
                content: { text: 'Test content' },
                order: 0,
                properties: {}
            });
        });

        // Aguardar estabilização
        await waitFor(() => {
            const blocks = result.current.getStepBlocks(1);
            expect(blocks.length).toBeGreaterThan(0);
        }, { timeout: 2000 });

        const rendersAfter = renderCount;
        const rendersDelta = rendersAfter - rendersBefore;

        // ✅ ASSERT: Deve ter menos de 10 renders após adicionar bloco
        expect(rendersDelta).toBeLessThan(10);

        // ✅ ASSERT: Não deve ter erro "Maximum update depth"
        const maxDepthErrors = consoleErrorSpy.mock.calls.filter((call: any[]) =>
            call[0]?.includes?.('Maximum update depth exceeded')
        );
        expect(maxDepthErrors.length).toBe(0);
    });
});

describe('🧪 SuperUnifiedProvider - Performance', () => {
    it('✅ DEVE inicializar em menos de 1 segundo', async () => {
        const startTime = performance.now();

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <SuperUnifiedProvider>
                {children}
            </SuperUnifiedProvider>
        );

        const { result } = renderHook(() => useSuperUnified(), { wrapper });

        await waitFor(() => {
            expect(result.current.state.editor.stepBlocks).toBeDefined();
        });

        const endTime = performance.now();
        const duration = endTime - startTime;

        // ✅ ASSERT: Deve inicializar em menos de 1 segundo
        expect(duration).toBeLessThan(1000);
    });
});
