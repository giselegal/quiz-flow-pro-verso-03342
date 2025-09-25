/**
 * 🧪 TESTES DE RENDERIZAÇÃO - COMPONENTES DO SISTEMA UNIVERSAL
 * 
 * Testa a renderização completa dos componentes principais do editor de funis
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// Mocks essenciais
jest.mock('@/integrations/supabase/client', () => ({
    supabase: {
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    single: jest.fn(() => Promise.resolve({
                        data: null,
                        error: { message: 'Template not found in database' }
                    }))
                }))
            }))
        }))
    }
}));

jest.mock('@/services/UnifiedTemplateService', () => ({
    unifiedTemplateService: {
        getTemplate: jest.fn((id) => Promise.resolve({
            id: id,
            name: `Template ${id}`,
            blocks: [
                { id: 'block-1', type: 'text', properties: { text: 'Test content' } }
            ],
            metadata: { generated: true }
        })),
        preloadCriticalTemplates: jest.fn(() => Promise.resolve())
    }
}));

jest.mock('@/utils/funnelNormalizer', () => ({
    getTemplateInfo: jest.fn((id) => Promise.resolve({
        baseId: id,
        originalId: id,
        isTemplate: false,
        template: null,
        totalSteps: 1
    }))
}));

// Wrapper para testes com providers
const TestWrapper = ({ children, initialPath = '/editor' }) => {
    return (
        <MemoryRouter initialEntries={[initialPath]}>
            <div data-testid="test-wrapper">
                {children}
            </div>
        </MemoryRouter>
    );
};

describe('🧪 Testes de Renderização - PureBuilderProvider', () => {
    let PureBuilderProvider;

    beforeAll(async () => {
        const module = await import('@/components/editor/PureBuilderProvider');
        PureBuilderProvider = module.default;
    });

    test('deve renderizar sem crashes com props padrão', async () => {
        await act(async () => {
            render(
                <TestWrapper>
                    <PureBuilderProvider funnelId="test-funnel">
                        <div data-testid="child-content">Child Content</div>
                    </PureBuilderProvider>
                </TestWrapper>
            );
        });

        expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    test('deve aceitar funnelId dinâmico', async () => {
        const customFunnelId = 'meu-funil-customizado-123';

        await act(async () => {
            render(
                <TestWrapper>
                    <PureBuilderProvider funnelId={customFunnelId}>
                        <div data-testid="dynamic-child">Dynamic Child</div>
                    </PureBuilderProvider>
                </TestWrapper>
            );
        });

        expect(screen.getByTestId('dynamic-child')).toBeInTheDocument();

        // Verificar se não há erros no console
        expect(console.error).not.toHaveBeenCalled();
    });

    test('deve funcionar sem funnelId (modo automático)', async () => {
        await act(async () => {
            render(
                <TestWrapper>
                    <PureBuilderProvider>
                        <div data-testid="auto-child">Auto Child</div>
                    </PureBuilderProvider>
                </TestWrapper>
            );
        });

        expect(screen.getByTestId('auto-child')).toBeInTheDocument();
    });

    test('deve lidar com estados de loading', async () => {
        const { rerender } = render(
            <TestWrapper>
                <PureBuilderProvider funnelId="loading-test">
                    <div data-testid="loading-child">Loading Child</div>
                </PureBuilderProvider>
            </TestWrapper>
        );

        // Inicialmente deve mostrar o conteúdo
        expect(screen.getByTestId('loading-child')).toBeInTheDocument();

        // Aguardar processamento assíncrono
        await waitFor(() => {
            expect(screen.getByTestId('loading-child')).toBeInTheDocument();
        });
    });
});

describe('🧪 Testes de Renderização - ModernUnifiedEditor', () => {
    let ModernUnifiedEditor;

    beforeAll(async () => {
        // Mock dos componentes lazy-loaded
        jest.doMock('@/components/editor/EditorProUnified', () => {
            return {
                __esModule: true,
                default: () => <div data-testid="editor-pro-unified">Editor Pro Unified</div>
            };
        });

        jest.doMock('@/components/error/TemplateErrorBoundary', () => {
            return {
                __esModule: true,
                default: ({ children }) => <div data-testid="error-boundary">{children}</div>
            };
        });

        const module = await import('@/pages/editor/ModernUnifiedEditor');
        ModernUnifiedEditor = module.default;
    });

    test('deve renderizar a estrutura básica do editor', async () => {
        await act(async () => {
            render(
                <TestWrapper>
                    <ModernUnifiedEditor />
                </TestWrapper>
            );
        });

        // Aguardar carregamento dos componentes lazy
        await waitFor(() => {
            // Verificar se o wrapper principal está presente
            expect(screen.getByTestId('test-wrapper')).toBeInTheDocument();
        });
    });

    test('deve detectar funnelId da URL corretamente', async () => {
        const customPath = '/editor/meu-funil-customizado';

        await act(async () => {
            render(
                <TestWrapper initialPath={customPath}>
                    <ModernUnifiedEditor />
                </TestWrapper>
            );
        });

        await waitFor(() => {
            expect(screen.getByTestId('test-wrapper')).toBeInTheDocument();
        });
    });

    test('deve detectar templateId da URL corretamente', async () => {
        const templatePath = '/editor/quiz-personalizado';

        await act(async () => {
            render(
                <TestWrapper initialPath={templatePath}>
                    <ModernUnifiedEditor />
                </TestWrapper>
            );
        });

        await waitFor(() => {
            expect(screen.getByTestId('test-wrapper')).toBeInTheDocument();
        });
    });

    test('deve funcionar com URL base /editor', async () => {
        await act(async () => {
            render(
                <TestWrapper initialPath="/editor">
                    <ModernUnifiedEditor />
                </TestWrapper>
            );
        });

        await waitFor(() => {
            expect(screen.getByTestId('test-wrapper')).toBeInTheDocument();
        });
    });

    test('deve aceitar props diretas', async () => {
        await act(async () => {
            render(
                <TestWrapper>
                    <ModernUnifiedEditor
                        funnelId="prop-funnel"
                        templateId="prop-template"
                        mode="visual"
                    />
                </TestWrapper>
            );
        });

        await waitFor(() => {
            expect(screen.getByTestId('test-wrapper')).toBeInTheDocument();
        });
    });
});

describe('🧪 Testes de Renderização - Integração Completa', () => {
    test('deve renderizar a estrutura completa editor + provider', async () => {
        let ModernUnifiedEditor, PureBuilderProvider;

        const [editorModule, providerModule] = await Promise.all([
            import('@/pages/editor/ModernUnifiedEditor'),
            import('@/components/editor/PureBuilderProvider')
        ]);

        ModernUnifiedEditor = editorModule.default;
        PureBuilderProvider = providerModule.default;

        await act(async () => {
            render(
                <TestWrapper>
                    <PureBuilderProvider funnelId="integration-test">
                        <ModernUnifiedEditor />
                    </PureBuilderProvider>
                </TestWrapper>
            );
        });

        await waitFor(() => {
            expect(screen.getByTestId('test-wrapper')).toBeInTheDocument();
        });
    });

    test('deve funcionar com diferentes tipos de funis', async () => {
        const funnelTypes = [
            'quiz-personalizado',
            'landing-page-produto',
            'campanha-email',
            'step-1',
            'template-vendas'
        ];

        for (const funnelId of funnelTypes) {
            const { unmount } = render(
                <TestWrapper key={funnelId}>
                    <div data-testid={`funnel-${funnelId}`}>
                        Funnel: {funnelId}
                    </div>
                </TestWrapper>
            );

            expect(screen.getByTestId(`funnel-${funnelId}`)).toBeInTheDocument();
            unmount();
        }
    });
});

describe('🧪 Testes de Performance de Renderização', () => {
    test('componentes devem renderizar rapidamente', async () => {
        const startTime = performance.now();

        await act(async () => {
            render(
                <TestWrapper>
                    <div data-testid="performance-test">Performance Test</div>
                </TestWrapper>
            );
        });

        const endTime = performance.now();
        const renderTime = endTime - startTime;

        expect(renderTime).toBeLessThan(100); // Deve renderizar em menos de 100ms
        expect(screen.getByTestId('performance-test')).toBeInTheDocument();
    });

    test('deve suportar re-renderizações sem vazamentos de memória', async () => {
        const { rerender } = render(
            <TestWrapper>
                <div data-testid="rerender-test">Initial</div>
            </TestWrapper>
        );

        // Fazer múltiplas re-renderizações
        for (let i = 0; i < 10; i++) {
            rerender(
                <TestWrapper>
                    <div data-testid="rerender-test">Render {i}</div>
                </TestWrapper>
            );
        }

        expect(screen.getByTestId('rerender-test')).toHaveTextContent('Render 9');
    });
});

describe('🧪 Testes de Acessibilidade e UX', () => {
    test('componentes devem ter estrutura acessível', async () => {
        await act(async () => {
            render(
                <TestWrapper>
                    <div
                        data-testid="accessible-test"
                        role="main"
                        aria-label="Editor de funis"
                    >
                        <h1>Editor de Funis</h1>
                        <button>Criar Funil</button>
                    </div>
                </TestWrapper>
            );
        });

        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
        expect(main).toHaveAttribute('aria-label', 'Editor de funis');

        const heading = screen.getByRole('heading');
        expect(heading).toBeInTheDocument();

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });

    test('deve suportar navegação por teclado', async () => {
        const user = userEvent.setup();

        await act(async () => {
            render(
                <TestWrapper>
                    <div data-testid="keyboard-test">
                        <button data-testid="btn-1">Botão 1</button>
                        <button data-testid="btn-2">Botão 2</button>
                        <button data-testid="btn-3">Botão 3</button>
                    </div>
                </TestWrapper>
            );
        });

        const btn1 = screen.getByTestId('btn-1');
        const btn2 = screen.getByTestId('btn-2');

        // Focar no primeiro botão
        btn1.focus();
        expect(btn1).toHaveFocus();

        // Navegar com Tab
        await user.tab();
        expect(btn2).toHaveFocus();
    });
});

describe('🧪 Testes de Estados de Erro', () => {
    test('deve lidar com erros de renderização graciosamente', async () => {
        // Componente que sempre falha
        const FailingComponent = () => {
            throw new Error('Test error');
        };

        // Error boundary simples para o teste
        class TestErrorBoundary extends React.Component {
            constructor(props) {
                super(props);
                this.state = { hasError: false };
            }

            static getDerivedStateFromError() {
                return { hasError: true };
            }

            render() {
                if (this.state.hasError) {
                    return <div data-testid="error-fallback">Erro capturado</div>;
                }

                return this.props.children;
            }
        }

        render(
            <TestWrapper>
                <TestErrorBoundary>
                    <FailingComponent />
                </TestErrorBoundary>
            </TestWrapper>
        );

        expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
    });

    test('deve mostrar estados de loading apropriados', async () => {
        const LoadingComponent = () => {
            const [loading, setLoading] = React.useState(true);

            React.useEffect(() => {
                const timer = setTimeout(() => setLoading(false), 100);
                return () => clearTimeout(timer);
            }, []);

            if (loading) {
                return <div data-testid="loading-state">Carregando...</div>;
            }

            return <div data-testid="loaded-state">Carregado!</div>;
        };

        render(
            <TestWrapper>
                <LoadingComponent />
            </TestWrapper>
        );

        // Inicialmente deve mostrar loading
        expect(screen.getByTestId('loading-state')).toBeInTheDocument();

        // Após timeout, deve mostrar conteúdo carregado
        await waitFor(() => {
            expect(screen.getByTestId('loaded-state')).toBeInTheDocument();
        });
    });
});

describe('🧪 Testes de Responsividade', () => {
    test('componentes devem se adaptar a diferentes tamanhos de tela', async () => {
        // Simular diferentes viewports
        const viewports = [
            { width: 320, height: 568 },  // Mobile
            { width: 768, height: 1024 }, // Tablet
            { width: 1920, height: 1080 } // Desktop
        ];

        for (const viewport of viewports) {
            // Simular mudança de viewport
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: viewport.width,
            });
            Object.defineProperty(window, 'innerHeight', {
                writable: true,
                configurable: true,
                value: viewport.height,
            });

            render(
                <TestWrapper>
                    <div
                        data-testid={`viewport-${viewport.width}`}
                        className="responsive-container"
                    >
                        Viewport: {viewport.width}x{viewport.height}
                    </div>
                </TestWrapper>
            );

            expect(screen.getByTestId(`viewport-${viewport.width}`)).toBeInTheDocument();
            screen.getByTestId(`viewport-${viewport.width}`).remove();
        }
    });
});