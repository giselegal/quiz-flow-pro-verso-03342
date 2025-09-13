import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { Router } from 'wouter';
import React from 'react';
import MainEditorUnified from '../MainEditorUnified';

// Enhanced mocks para testing de fluxos críticos
const mockUseFunnelContext = vi.fn();
const mockTemplateLibraryService = {
    listBuiltins: vi.fn().mockReturnValue([
        { id: 'quiz-completo', name: 'Quiz Completo' },
        { id: 'template-custom', name: 'Template Customizado' }
    ])
};

// Mock do EditorRuntimeProviders
const MockEditorRuntimeProviders = vi.fn(({ children, funnelId, debugMode, supabaseConfig }) => (
    <div
        data-testid="editor-runtime-providers"
        data-funnel-id={funnelId}
        data-debug={debugMode}
        data-supabase={supabaseConfig?.enabled}
    >
        {children}
    </div>
));

vi.mock('@/context/EditorRuntimeProviders', () => ({
    EditorRuntimeProviders: MockEditorRuntimeProviders,
}));

// Mocks de componentes críticos
vi.mock('@/context/UnifiedFunnelContext', () => ({
    UnifiedFunnelProvider: ({ children }: any) => <div data-testid="unified-funnel">{children}</div>,
}));

vi.mock('@/context/FunnelsContext', () => ({
    FunnelsProvider: ({ children }: any) => <div data-testid="funnels">{children}</div>,
}));

vi.mock('@/components/editor/EditorProvider', () => ({
    EditorProvider: ({ children }: any) => <div data-testid="editor">{children}</div>,
}));

vi.mock('@/core/contexts/LegacyCompatibilityWrapper', () => ({
    LegacyCompatibilityWrapper: ({ children }: any) => <div data-testid="legacy">{children}</div>,
}));

vi.mock('@/context/EditorQuizContext', () => ({
    EditorQuizProvider: ({ children }: any) => <div data-testid="quiz">{children}</div>,
}));

vi.mock('@/components/quiz/Quiz21StepsProvider', () => ({
    Quiz21StepsProvider: ({ children }: any) => <div data-testid="steps">{children}</div>,
}));

vi.mock('@/context/QuizFlowProvider', () => ({
    QuizFlowProvider: ({ children }: any) => <div data-testid="flow">{children}</div>,
}));

// Mock dos hooks
vi.mock('@/hooks/useFunnelLoader', () => ({
    useFunnelContext: mockUseFunnelContext,
}));

vi.mock('@/services/templateLibraryService', () => ({
    templateLibraryService: mockTemplateLibraryService,
}));

// Mock do componente de fallback de funil
const MockFunnelFallback = vi.fn(({ errorType, funnelId, onRetry, onCreateNew }) => (
    <div
        data-testid="funnel-fallback"
        data-error-type={errorType}
        data-funnel-id={funnelId}
    >
        <button onClick={onRetry} data-testid="retry-button">Retry</button>
        <button onClick={onCreateNew} data-testid="create-new-button">Create New</button>
    </div>
));

vi.mock('@/components/editor/FunnelFallback', () => ({
    default: MockFunnelFallback,
}));

// Mock do Editor Unificado com controle de carregamento
let shouldUnifiedEditorFail = false;
let unifiedEditorDelay = 0;

const MockUnifiedEditor = () => <div data-testid="unified-editor">Unified Editor Loaded</div>;

vi.mock('../components/editor/UnifiedEditor', () => ({
    default: () => {
        if (shouldUnifiedEditorFail) {
            throw new Error('UnifiedEditor failed to load');
        }
        return MockUnifiedEditor();
    },
}));

// Mock do Editor Pro (fallback)
const MockEditorPro = () => <div data-testid="editor-pro">EditorPro Fallback</div>;

vi.mock('../components/editor/EditorPro', () => ({
    default: MockEditorPro,
}));

// Mock do ErrorBoundary
vi.mock('../components/editor/ErrorBoundary', () => ({
    ErrorBoundary: ({ children }: any) => <div data-testid="error-boundary">{children}</div>,
}));

describe('MainEditorUnified - Fluxos Críticos', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Reset flags
        shouldUnifiedEditorFail = false;
        unifiedEditorDelay = 0;

        // Mock environment variables
        (import.meta as any).env = {
            VITE_ENABLE_SUPABASE: 'false',
            VITE_SUPABASE_FUNNEL_ID: 'test-funnel',
            VITE_SUPABASE_QUIZ_ID: 'test-quiz',
        };

        // Mock successful funnel context por padrão
        mockUseFunnelContext.mockReturnValue({
            isReady: true,
            isLoading: false,
            isError: false,
            canEdit: true,
            funnel: { id: 'test-funnel', name: 'Test Funnel' }
        });

        // Mock location
        Object.defineProperty(window, 'location', {
            value: {
                href: 'http://localhost:3000/editor',
                pathname: '/editor',
                search: '',
            },
            writable: true,
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('Feature Flag - Provider Refactor', () => {
        it('deve usar EditorRuntimeProviders quando providerRefactor=true', () => {
            // Mock URL com feature flag
            Object.defineProperty(window, 'location', {
                value: {
                    href: 'http://localhost:3000/editor?providerRefactor=true',
                    search: '?providerRefactor=true'
                },
                writable: true,
            });

            render(
                <Router>
                    <MainEditorUnified />
                </Router>
            );

            expect(screen.getByTestId('editor-runtime-providers')).toBeInTheDocument();
            expect(MockEditorRuntimeProviders).toHaveBeenCalledWith(
                expect.objectContaining({
                    funnelId: undefined,
                    debugMode: false,
                    supabaseConfig: expect.objectContaining({
                        enabled: false,
                    })
                }),
                {}
            );
        });

        it('deve usar providers legacy por padrão', () => {
            render(
                <Router>
                    <MainEditorUnified />
                </Router>
            );

            expect(screen.getByTestId('unified-funnel')).toBeInTheDocument();
            expect(screen.getByTestId('funnels')).toBeInTheDocument();
            expect(screen.queryByTestId('editor-runtime-providers')).not.toBeInTheDocument();
        });

        it('deve passar configurações corretas para EditorRuntimeProviders', () => {
            Object.defineProperty(window, 'location', {
                value: {
                    href: 'http://localhost:3000/editor?providerRefactor=true&funnel=test-123&step=5&debug=true',
                    search: '?providerRefactor=true&funnel=test-123&step=5&debug=true'
                },
                writable: true,
            });

            (import.meta as any).env.VITE_ENABLE_SUPABASE = 'true';

            render(
                <Router>
                    <MainEditorUnified />
                </Router>
            );

            expect(MockEditorRuntimeProviders).toHaveBeenCalledWith(
                expect.objectContaining({
                    funnelId: 'test-123',
                    initialStep: 5,
                    debugMode: true,
                    supabaseConfig: expect.objectContaining({
                        enabled: true,
                    })
                }),
                {}
            );
        });
    });

    describe('Carregamento de Funil', () => {
        it('deve mostrar loading durante validação do funil', () => {
            mockUseFunnelContext.mockReturnValue({
                isReady: false,
                isLoading: true,
                isError: false,
            });

            render(
                <Router>
                    <MainEditorUnified />
                </Router>
            );

            expect(screen.getByText('Validando acesso ao funil...')).toBeInTheDocument();
        });

        it('deve mostrar fallback quando funil não existe', () => {
            mockUseFunnelContext.mockReturnValue({
                isReady: false,
                isLoading: false,
                isError: true,
                errorType: 'NOT_FOUND',
                error: 'Funil não encontrado'
            });

            Object.defineProperty(window, 'location', {
                value: {
                    search: '?funnel=non-existent-funnel'
                },
                writable: true,
            });

            render(
                <Router>
                    <MainEditorUnified />
                </Router>
            );

            expect(screen.getByTestId('funnel-fallback')).toBeInTheDocument();
            expect(MockFunnelFallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    errorType: 'NOT_FOUND',
                    funnelId: 'non-existent-funnel'
                }),
                {}
            );
        });

        it('deve prosseguir sem validação quando não há funnelId', async () => {
            render(
                <Router>
                    <MainEditorUnified />
                </Router>
            );

            await waitFor(() => {
                expect(screen.getByTestId('unified-editor')).toBeInTheDocument();
            });
        });
    });

    describe('Carregamento do Editor', () => {
        it('deve carregar UnifiedEditor com sucesso', async () => {
            render(
                <Router>
                    <MainEditorUnified />
                </Router>
            );

            await waitFor(() => {
                expect(screen.getByTestId('unified-editor')).toBeInTheDocument();
            });
        });

        it('deve fazer fallback para EditorPro quando UnifiedEditor falha', async () => {
            shouldUnifiedEditorFail = true;
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            render(
                <Router>
                    <MainEditorUnified />
                </Router>
            );

            await waitFor(() => {
                expect(screen.getByTestId('editor-pro')).toBeInTheDocument();
            });

            expect(screen.queryByTestId('unified-editor')).not.toBeInTheDocument();
            consoleSpy.mockRestore();
        });

        it('deve mostrar erro quando ambos editores falham', async () => {
            shouldUnifiedEditorFail = true;

            // Mock EditorPro também falhando
            vi.doMock('../components/editor/EditorPro', () => ({
                default: () => {
                    throw new Error('EditorPro also failed');
                },
            }));

            render(
                <Router>
                    <MainEditorUnified />
                </Router>
            );

            await waitFor(() => {
                expect(screen.getByText(/Erro ao Carregar Editor/)).toBeInTheDocument();
            });
        });

        it('deve mostrar timeout warning após 10 segundos', async () => {
            vi.useFakeTimers();

            render(
                <Router>
                    <MainEditorUnified />
                </Router>
            );

            // Simular delay longo
            act(() => {
                vi.advanceTimersByTime(11000);
            });

            await waitFor(() => {
                expect(screen.getByText(/Timeout após/)).toBeInTheDocument();
            });

            vi.useRealTimers();
        });
    });

    describe('Template Loading', () => {
        it('deve carregar template específico quando fornecido', async () => {
            Object.defineProperty(window, 'location', {
                value: {
                    search: '?template=quiz-completo'
                },
                writable: true,
            });

            render(
                <Router>
                    <MainEditorUnified />
                </Router>
            );

            await waitFor(() => {
                expect(mockTemplateLibraryService.listBuiltins).toHaveBeenCalled();
            });
        });

        it('deve lidar com template não encontrado', async () => {
            mockTemplateLibraryService.listBuiltins.mockReturnValue([]);

            Object.defineProperty(window, 'location', {
                value: {
                    search: '?template=non-existent-template'
                },
                writable: true,
            });

            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

            render(
                <Router>
                    <MainEditorUnified />
                </Router>
            );

            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalledWith(
                    expect.stringContaining('Template não encontrado')
                );
            });

            consoleSpy.mockRestore();
        });
    });

    describe('Debug Mode', () => {
        it('deve ativar debug mode quando solicitado via URL', () => {
            Object.defineProperty(window, 'location', {
                value: {
                    search: '?debug=true'
                },
                writable: true,
            });

            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

            render(
                <Router>
                    <MainEditorUnified />
                </Router>
            );

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('MainEditorUnified modo debug ativo')
            );

            consoleSpy.mockRestore();
        });

        it('deve mostrar informações debug nos componentes de erro', async () => {
            shouldUnifiedEditorFail = true;

            Object.defineProperty(window, 'location', {
                value: {
                    search: '?debug=true&template=test-template&funnel=test-funnel'
                },
                writable: true,
            });

            render(
                <Router>
                    <MainEditorUnified />
                </Router>
            );

            await waitFor(() => {
                expect(screen.getByText('Debug Info:')).toBeInTheDocument();
                expect(screen.getByText('Template: test-template')).toBeInTheDocument();
                expect(screen.getByText('Funnel: test-funnel')).toBeInTheDocument();
            });
        });
    });

    describe('Error Recovery', () => {
        it('deve permitir retry após erro', async () => {
            mockUseFunnelContext.mockReturnValueOnce({
                isReady: false,
                isLoading: false,
                isError: true,
                errorType: 'NETWORK_ERROR',
                retry: vi.fn()
            });

            Object.defineProperty(window, 'location', {
                value: {
                    search: '?funnel=test-funnel'
                },
                writable: true,
            });

            render(
                <Router>
                    <MainEditorUnified />
                </Router>
            );

            const retryButton = screen.getByTestId('retry-button');
            expect(retryButton).toBeInTheDocument();
        });

        it('deve limpar storage local e retentar quando solicitado', async () => {
            const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
            const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => { });

            shouldUnifiedEditorFail = true;

            render(
                <Router>
                    <MainEditorUnified />
                </Router>
            );

            await waitFor(() => {
                const resetButton = screen.getByText(/Limpar Dados e Tentar Novamente/);
                resetButton.click();
            });

            expect(removeItemSpy).toHaveBeenCalled();
            expect(reloadSpy).toHaveBeenCalled();

            removeItemSpy.mockRestore();
            reloadSpy.mockRestore();
        });
    });

    describe('Configuração Supabase', () => {
        it('deve configurar Supabase quando habilitado', () => {
            (import.meta as any).env.VITE_ENABLE_SUPABASE = 'true';
            (import.meta as any).env.VITE_SUPABASE_FUNNEL_ID = 'supabase-funnel';

            Object.defineProperty(window, 'location', {
                value: {
                    search: '?funnel=url-funnel'
                },
                writable: true,
            });

            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

            render(
                <Router>
                    <MainEditorUnified />
                </Router>
            );

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('MainEditorUnified iniciado:'),
                expect.objectContaining({
                    supabaseConfig: expect.objectContaining({
                        enabled: true,
                        funnelId: 'url-funnel' // URL override environment
                    })
                })
            );

            consoleSpy.mockRestore();
        });
    });
});
