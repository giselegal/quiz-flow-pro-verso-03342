import React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

vi.mock('@/components/ui/card', () => ({
    Card: (p: any) => <div data-testid="card" {...p} />,
    CardHeader: (p: any) => <div data-testid="card-header" {...p} />,
    CardTitle: (p: any) => <div data-testid="card-title" {...p} />,
    CardContent: (p: any) => <div data-testid="card-content" {...p} />,
}));
vi.mock('@/components/ui/button', () => ({
    Button: (p: any) => <button data-testid="button" {...p} />
}));
vi.mock('@/components/ui/badge', () => ({
    Badge: (p: any) => <span data-testid="badge" {...p} />
}));
vi.mock('@/components/ui/progress', () => ({
    Progress: (p: any) => <div data-testid="progress" data-value={p.value}>Progress {p.value}%</div>
}));

const dashboardHookMock: ReturnType<typeof vi.fn> = vi.fn();
vi.mock('@/hooks/useDashboardMetrics', () => ({
    useDashboardMetrics: dashboardHookMock
}));

interface MockDashboardMetrics {
    totalSessions: number;
    completedSessions: number;
    conversionRate: number;
    averageCompletionTime: number;
    activeSessions: number;
    leadsGenerated: number;
    dropoffRate: number;
    topFunnels?: Array<{ funnelId: string; funnelName: string; conversionRate: number }>;
    stepPerformance?: Array<{ stepNumber: number; completionRate: number }>;
}

const getHookMock = () => dashboardHookMock;

async function loadPage() {
    const mod = await import('../admin/ConsolidatedOverviewPage.testable');
    return mod.default;
}

describe('ConsolidatedOverviewPage (integração)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
        vi.useRealTimers();
    });

    const baseMetrics: MockDashboardMetrics = {
        totalSessions: 850,
        completedSessions: 620,
        conversionRate: 72.9,
        averageCompletionTime: 12.5,
        activeSessions: 28,
        leadsGenerated: 520,
        dropoffRate: 27.1,
        topFunnels: [
            { funnelId: 'f1', funnelName: 'Funnel A', conversionRate: 85.2 },
            { funnelId: 'f2', funnelName: 'Funnel B', conversionRate: 78.5 },
        ],
        stepPerformance: [
            { stepNumber: 1, completionRate: 95.0 },
            { stepNumber: 2, completionRate: 88.3 },
            { stepNumber: 3, completionRate: 82.1 },
        ],
    };

    it('deve renderizar estado de carregamento', async () => {
        getHookMock().mockReturnValue({
            metrics: null,
            loading: true,
            error: null,
            refresh: vi.fn(),
            isStale: false,
        });
        const ConsolidatedOverviewPage = await loadPage();
        render(<ConsolidatedOverviewPage />);

        expect(screen.getByText(/Carregando dados.../i)).toBeInTheDocument();
    });

    it('deve renderizar estado de erro com botão retry', async () => {
        const refresh = vi.fn();
        getHookMock().mockReturnValue({
            metrics: null,
            loading: false,
            error: new Error('Falha ao buscar métricas'),
            refresh,
            isStale: false,
        });
        const ConsolidatedOverviewPage = await loadPage();
        render(<ConsolidatedOverviewPage />);

        expect(screen.getByText(/Erro ao carregar dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/Falha ao buscar métricas/i)).toBeInTheDocument();

        screen.getByRole('button', { name: /Tentar Novamente/i }).click();
        expect(refresh).toHaveBeenCalledTimes(1);
    });

    it('deve renderizar métricas principais do dashboard', async () => {
        getHookMock().mockReturnValue({
            metrics: baseMetrics,
            loading: false,
            error: null,
            refresh: vi.fn(),
            isStale: false,
        });
        const ConsolidatedOverviewPage = await loadPage();
        render(<ConsolidatedOverviewPage />);

        expect(screen.getByText(/Dashboard Quiz Quest/i)).toBeInTheDocument();
        expect(screen.getByText(/Pro Analytics/i)).toBeInTheDocument();
        expect(screen.getByText(/28 usuários online/i)).toBeInTheDocument();
        expect(screen.getByText(/Total de Sessões/i)).toBeInTheDocument();
        expect(screen.getByText('850')).toBeInTheDocument();
        expect(screen.getByText(/620 concluídas/i)).toBeInTheDocument();
    });

    it('deve renderizar taxa de conversão com progress bar', async () => {
        getHookMock().mockReturnValue({
            metrics: baseMetrics,
            loading: false,
            error: null,
            refresh: vi.fn(),
            isStale: false,
        });
        const ConsolidatedOverviewPage = await loadPage();
        render(<ConsolidatedOverviewPage />);

        expect(screen.getByText(/Taxa de Conversão/i)).toBeInTheDocument();
        // Verifica progress bar diretamente pelo testid para evitar colisão com texto duplicado
        const progress = screen.getByTestId('progress');
        expect(progress).toBeInTheDocument();
        expect(progress).toHaveAttribute('data-value', String(baseMetrics.conversionRate));
        expect(progress.textContent).toContain('72.9%');
    });

    it('deve renderizar tempo médio e leads gerados', async () => {
        getHookMock().mockReturnValue({
            metrics: baseMetrics,
            loading: false,
            error: null,
            refresh: vi.fn(),
            isStale: false,
        });
        const ConsolidatedOverviewPage = await loadPage();
        render(<ConsolidatedOverviewPage />);

        expect(screen.getByText(/Tempo Médio de Conclusão/i)).toBeInTheDocument();
        expect(screen.getByText(/12.5 min/i)).toBeInTheDocument();
        expect(screen.getByText(/Leads Gerados/i)).toBeInTheDocument();
        expect(screen.getByText('520')).toBeInTheDocument();
    });

    it('deve renderizar top funnels quando disponíveis', async () => {
        getHookMock().mockReturnValue({
            metrics: baseMetrics,
            loading: false,
            error: null,
            refresh: vi.fn(),
            isStale: false,
        });
        const ConsolidatedOverviewPage = await loadPage();
        render(<ConsolidatedOverviewPage />);

        expect(screen.getByText(/Top Funnels de Conversão/i)).toBeInTheDocument();
        expect(screen.getByText(/Funnel A/i)).toBeInTheDocument();
        expect(screen.getByText(/85.2%/i)).toBeInTheDocument();
        expect(screen.getByText(/Funnel B/i)).toBeInTheDocument();
    });

    it('deve renderizar performance por step', async () => {
        getHookMock().mockReturnValue({
            metrics: baseMetrics,
            loading: false,
            error: null,
            refresh: vi.fn(),
            isStale: false,
        });
        const ConsolidatedOverviewPage = await loadPage();
        render(<ConsolidatedOverviewPage />);

        expect(screen.getByText(/Performance por Step/i)).toBeInTheDocument();
        expect(screen.getByText(/Step 1/i)).toBeInTheDocument();
        expect(screen.getByText(/95.0%/i)).toBeInTheDocument();
        expect(screen.getByText(/Step 2/i)).toBeInTheDocument();
    });

    it('deve renderizar badge de dados desatualizados quando stale', async () => {
        getHookMock().mockReturnValue({
            metrics: baseMetrics,
            loading: false,
            error: null,
            refresh: vi.fn(),
            isStale: true,
        });
        const ConsolidatedOverviewPage = await loadPage();
        render(<ConsolidatedOverviewPage />);

        expect(screen.getByText(/Dados desatualizados/i)).toBeInTheDocument();
    });

    it('deve permitir atualização manual via botão', async () => {
        const refresh = vi.fn();
        getHookMock().mockReturnValue({
            metrics: baseMetrics,
            loading: false,
            error: null,
            refresh,
            isStale: false,
        });
        const ConsolidatedOverviewPage = await loadPage();
        render(<ConsolidatedOverviewPage />);

        screen.getByRole('button', { name: /Atualizar/i }).click();
        expect(refresh).toHaveBeenCalledTimes(1);
    });
});
