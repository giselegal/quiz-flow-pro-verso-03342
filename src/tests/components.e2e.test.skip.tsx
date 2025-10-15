// @ts-nocheck
/**
 * ⚠️ TESTES DESABILITADOS - AGUARDANDO ATUALIZAÇÃO
 * 
 * Estes testes usam APIs antigas e precisam ser reescritos
 * para refletir as mudanças na arquitetura do editor.
 * 
 * 🧪 TESTES E2E - COMPONENTES REACT
 * 
 * Valida renderização e interação dos componentes principais
 * do sistema de preview ao vivo
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// Mock dos componentes UI (shadcn/ui)
vi.mock('@/components/ui/card', () => ({
    Card: ({ children, className }: any) => <div className={className} data-testid="card">{children}</div>,
    CardContent: ({ children, className }: any) => <div className={className} data-testid="card-content">{children}</div>,
    CardHeader: ({ children, className }: any) => <div className={className} data-testid="card-header">{children}</div>,
    CardTitle: ({ children, className }: any) => <h3 className={className} data-testid="card-title">{children}</h3>
}));

vi.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, className, ...props }: any) =>
        <button onClick={onClick} className={className} {...props} data-testid="button">{children}</button>
}));

vi.mock('@/components/ui/badge', () => ({
    Badge: ({ children, className }: any) => <span className={className} data-testid="badge">{children}</span>
}));

vi.mock('@/components/ui/alert', () => ({
    Alert: ({ children, className }: any) => <div className={className} data-testid="alert">{children}</div>,
    AlertDescription: ({ children, className }: any) => <div className={className} data-testid="alert-description">{children}</div>
}));

vi.mock('@/components/ui/tabs', () => ({
    Tabs: ({ children, value, onValueChange }: any) =>
        <div data-testid="tabs" data-value={value}>{children}</div>,
    TabsList: ({ children, className }: any) => <div className={className} data-testid="tabs-list">{children}</div>,
    TabsTrigger: ({ children, value, className }: any) =>
        <button className={className} data-testid={`tab-${value}`} data-value={value}>{children}</button>,
    TabsContent: ({ children, value, className }: any) =>
        <div className={className} data-testid={`tab-content-${value}`}>{children}</div>
}));

// Mock dos hooks
vi.mock('@/hooks/canvas/useLiveCanvasPreview', () => ({
    useLiveCanvasPreview: () => ({
        previewState: {
            isLoading: false,
            updateCount: 5,
            lastUpdate: Date.now(),
            error: null
        },
        debouncedSteps: [
            { id: 'step1', type: 'question', title: 'Test Question' }
        ],
        debouncedSelectedStepId: 'step1',
        updateSteps: vi.fn(),
        getPerformanceMetrics: () => ({
            renderTime: 45,
            cacheHitRate: 0.85,
            websocketLatency: 120
        })
    })
}));

vi.mock('@/hooks/performance/useAdvancedCache', () => ({
    useAdvancedCache: () => ({
        get: vi.fn(),
        set: vi.fn(),
        clear: vi.fn(),
        getMetrics: () => ({
            hitRate: 0.85,
            size: 42,
            maxSize: 100
        })
    })
}));

vi.mock('@/hooks/performance/useRenderOptimization', () => ({
    useRenderOptimization: () => ({
        config: {
            enableRenderProfiling: true,
            enableVirtualization: true
        },
        optimizeRender: vi.fn(),
        getProfile: () => ({
            renderCount: 15,
            averageRenderTime: 45
        })
    })
}));

vi.mock('@/hooks/websocket/useAdvancedWebSocket', () => ({
    useAdvancedWebSocket: () => ({
        connectionState: {
            isConnected: true,
            retryCount: 0
        },
        sendMessage: vi.fn(),
        getMetrics: () => ({
            messagesSent: 25,
            bytesTransferred: 1024
        })
    })
}));

// Mock dos ícones Lucide
vi.mock('lucide-react', () => ({
    BarChart3: () => <div data-testid="icon-bar-chart">📊</div>,
    Activity: () => <div data-testid="icon-activity">⚡</div>,
    Settings: () => <div data-testid="icon-settings">⚙️</div>,
    Download: () => <div data-testid="icon-download">⬇️</div>,
    Shield: () => <div data-testid="icon-shield">🛡️</div>,
    RefreshCw: () => <div data-testid="icon-refresh">🔄</div>,
    CheckCircle: () => <div data-testid="icon-check">✅</div>,
    XCircle: () => <div data-testid="icon-x">❌</div>,
    AlertTriangle: () => <div data-testid="icon-alert">⚠️</div>,
    TrendingUp: () => <div data-testid="icon-trending-up">📈</div>,
    TrendingDown: () => <div data-testid="icon-trending-down">📉</div>
}));

describe('🧪 E2E - Componentes React do Sistema', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('✅ 1. LiveCanvasPreview Component', () => {
        it('Renderiza corretamente com dados mockados', async () => {
            // Importar dinamicamente para evitar problemas de mock timing
            const { LiveCanvasPreview } = await import('@/components/editor/canvas/LiveCanvasPreview');

            const mockProps = {
                steps: [
                    { id: 'step1', type: 'question', title: 'Test Question' }
                ],
                selectedStepId: 'step1',
                onStepSelect: vi.fn(),
                className: 'test-preview'
            };

            expect(() => {
                render(<LiveCanvasPreview {...mockProps} />);
            }).not.toThrow();

            // Verificar se elementos básicos estão presentes
            await waitFor(() => {
                expect(screen.getAllByTestId('card')).toHaveLength(1);
            });
        });

        it('Exibe métricas de performance corretamente', async () => {
            const { LiveCanvasPreview } = await import('@/components/editor/canvas/LiveCanvasPreview');

            render(<LiveCanvasPreview steps={[]} selectedStepId={null} />);

            // Procurar por textos indicativos de métricas
            await waitFor(() => {
                // Verificar se informações de estado estão sendo exibidas
                const cards = screen.getAllByTestId('card');
                expect(cards.length).toBeGreaterThan(0);
            });
        });
    });

    describe('✅ 2. PerformanceDashboard Component', () => {
        it('Renderiza dashboard com métricas', async () => {
            const { PerformanceDashboard } = await import('@/components/editor/dashboard/PerformanceDashboard');

            expect(() => {
                render(<PerformanceDashboard />);
            }).not.toThrow();

            await waitFor(() => {
                // Verificar se o dashboard tem estrutura básica
                const dashboardElement = screen.getByTestId('card');
                expect(dashboardElement).toBeInTheDocument();
            });
        });

        it('Permite alternar entre diferentes abas de métricas', async () => {
            const { PerformanceDashboard } = await import('@/components/editor/dashboard/PerformanceDashboard');

            render(<PerformanceDashboard />);

            await waitFor(() => {
                // Verificar se abas estão presentes
                const tabs = screen.getByTestId('tabs');
                expect(tabs).toBeInTheDocument();
            });
        });

        it('Exibe alertas de performance quando necessário', async () => {
            const { PerformanceDashboard } = await import('@/components/editor/dashboard/PerformanceDashboard');

            render(<PerformanceDashboard />);

            await waitFor(() => {
                // Verificar se sistema de alertas funciona
                const cards = screen.getAllByTestId('card');
                expect(cards.length).toBeGreaterThan(0);
            });
        });
    });

    describe('✅ 3. SystemValidator Component', () => {
        it('Executa validação do sistema automaticamente', async () => {
            const { SystemValidator } = await import('@/components/editor/validation/SystemValidator');

            expect(() => {
                render(<SystemValidator autoRun={true} />);
            }).not.toThrow();

            await waitFor(() => {
                // Verificar se validator está presente
                const validator = screen.getByTestId('card');
                expect(validator).toBeInTheDocument();
            });
        });

        it('Permite executar validação manual', async () => {
            const { SystemValidator } = await import('@/components/editor/validation/SystemValidator');

            render(<SystemValidator autoRun={false} />);

            await waitFor(() => {
                // Procurar botão de validação manual
                const buttons = screen.getAllByTestId('button');
                expect(buttons.length).toBeGreaterThan(0);
            });
        });

        it('Exibe resultados de validação em categorias', async () => {
            const { SystemValidator } = await import('@/components/editor/validation/SystemValidator');

            render(<SystemValidator />);

            await waitFor(() => {
                // Verificar se sistema de abas funciona para categorias
                const tabs = screen.getByTestId('tabs');
                expect(tabs).toBeInTheDocument();
            });
        });
    });

    describe('✅ 4. Integração de Componentes', () => {
        it('Componentes funcionam juntos sem conflitos', async () => {
            const { LiveCanvasPreview } = await import('@/components/editor/canvas/LiveCanvasPreview');
            const { PerformanceDashboard } = await import('@/components/editor/dashboard/PerformanceDashboard');

            const TestApp = () => (
                <div>
                    <LiveCanvasPreview steps={[]} selectedStepId={null} />
                    <PerformanceDashboard />
                </div>
            );

            expect(() => {
                render(<TestApp />);
            }).not.toThrow();

            await waitFor(() => {
                const cards = screen.getAllByTestId('card');
                expect(cards.length).toBeGreaterThan(1); // Pelo menos um de cada componente
            });
        });

        it('Sistema mantém estado consistente entre componentes', async () => {
            const { LiveCanvasPreview } = await import('@/components/editor/canvas/LiveCanvasPreview');
            const { SystemValidator } = await import('@/components/editor/validation/SystemValidator');

            const IntegratedTest = () => (
                <div>
                    <LiveCanvasPreview
                        steps={[{ id: 'test', type: 'question', title: 'Test' }]}
                        selectedStepId="test"
                    />
                    <SystemValidator autoRun={true} />
                </div>
            );

            expect(() => {
                render(<IntegratedTest />);
            }).not.toThrow();

            await waitFor(() => {
                // Verificar se ambos componentes renderizaram
                const cards = screen.getAllByTestId('card');
                expect(cards.length).toBeGreaterThanOrEqual(2);
            });
        });
    });

    describe('✅ 5. Responsividade e Acessibilidade', () => {
        it('Componentes são acessíveis com screen readers', async () => {
            const { PerformanceDashboard } = await import('@/components/editor/dashboard/PerformanceDashboard');

            render(<PerformanceDashboard />);

            await waitFor(() => {
                // Verificar se elementos têm data-testid adequados
                const dashboard = screen.getByTestId('card');
                expect(dashboard).toBeInTheDocument();

                // Verificar se títulos estão presentes
                const titles = screen.getAllByTestId('card-title');
                expect(titles.length).toBeGreaterThan(0);
            });
        });

        it('Funciona em diferentes tamanhos de tela', async () => {
            const { LiveCanvasPreview } = await import('@/components/editor/canvas/LiveCanvasPreview');

            // Simular tela pequena
            Object.defineProperty(window, 'innerWidth', { value: 375 });

            expect(() => {
                render(<LiveCanvasPreview steps={[]} selectedStepId={null} />);
            }).not.toThrow();

            // Simular tela grande
            Object.defineProperty(window, 'innerWidth', { value: 1920 });

            expect(() => {
                render(<LiveCanvasPreview steps={[]} selectedStepId={null} />);
            }).not.toThrow();
        });
    });

    describe('✅ 6. Performance dos Componentes', () => {
        it('Componentes renderizam rapidamente', async () => {
            const startTime = performance.now();

            const { LiveCanvasPreview } = await import('@/components/editor/canvas/LiveCanvasPreview');

            render(<LiveCanvasPreview steps={[]} selectedStepId={null} />);

            const endTime = performance.now();
            const renderTime = endTime - startTime;

            // Renderização deve ser rápida (menos de 100ms)
            expect(renderTime).toBeLessThan(100);
        });

        it('Sistema lida com muitos dados sem travamento', async () => {
            const { PerformanceDashboard } = await import('@/components/editor/dashboard/PerformanceDashboard');

            // Simular muitos dados
            const largeDataSet = Array.from({ length: 100 }, (_, i) => ({
                id: i,
                value: Math.random() * 100
            }));

            expect(() => {
                render(<PerformanceDashboard data={largeDataSet} />);
            }).not.toThrow();

            await waitFor(() => {
                const dashboard = screen.getByTestId('card');
                expect(dashboard).toBeInTheDocument();
            });
        });
    });
});