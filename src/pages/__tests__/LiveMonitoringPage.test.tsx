import React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, within } from '@testing-library/react';

// Estratégia de isolamento idêntica ao AnalyticsPage.test.tsx
vi.mock('@/components/ui/card', () => ({
    Card: (p: any) => <div data-testid="card" {...p} />,
    CardHeader: (p: any) => <div data-testid="card-header" {...p} />,
    CardTitle: (p: any) => <div data-testid="card-title" {...p} />,
    CardDescription: (p: any) => <div data-testid="card-description" {...p} />,
    CardContent: (p: any) => <div data-testid="card-content" {...p} />,
}));
vi.mock('@/components/ui/button', () => ({
    Button: (p: any) => <button data-testid="button" {...p} />
}));
vi.mock('@/components/ui/badge', () => ({
    Badge: (p: any) => <span data-testid="badge" {...p} />
}));
vi.mock('@/components/ui/alert', () => ({
    Alert: (p: any) => <div data-testid="alert" {...p} />,
    AlertDescription: (p: any) => <div data-testid="alert-description" {...p} />,
    AlertTitle: (p: any) => <div data-testid="alert-title" {...p} />
}));

const realTimeHookMock: ReturnType<typeof vi.fn> = vi.fn();
vi.mock('@/hooks/useRealTimeAnalytics', () => ({
    useRealTimeAnalytics: realTimeHookMock
}));

interface MockLiveActivity {
    activeSessions: number;
    activeUsers: number;
    conversionsToday: number;
    liveConversionRate: number;
    lastUpdate: Date;
}

interface MockEvent {
    id: string;
    type: string;
    stepNumber: number;
    timestamp: Date;
}

interface MockDropoffAlert {
    id: string;
    stepNumber: number;
    dropoffRate: number;
    severity: string;
}

interface MockStepStat {
    stepNumber: number;
    activeUsers: number;
}

const getHookMock = () => realTimeHookMock;

async function loadPage() {
    const mod = await import('../dashboard/LiveMonitoringPage.testable');
    return mod.default;
}

describe('LiveMonitoringPage (integração)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
        vi.useRealTimers();
    });

    const baseLiveActivity: MockLiveActivity = {
        activeSessions: 42,
        activeUsers: 38,
        conversionsToday: 15,
        liveConversionRate: 35.7,
        lastUpdate: new Date(),
    };

    const baseEvents: MockEvent[] = [
        { id: '1', type: 'step_completed', stepNumber: 5, timestamp: new Date() },
        { id: '2', type: 'conversion', stepNumber: 21, timestamp: new Date() },
    ];

    const baseAlerts: MockDropoffAlert[] = [
        { id: 'a1', stepNumber: 8, dropoffRate: 42.5, severity: 'high' },
        { id: 'a2', stepNumber: 14, dropoffRate: 33.0, severity: 'medium' },
    ];

    const baseStepStats: MockStepStat[] = [
        { stepNumber: 1, activeUsers: 12 },
        { stepNumber: 2, activeUsers: 10 },
        { stepNumber: 3, activeUsers: 8 },
    ];

    it('deve renderizar estado de erro de conexão', async () => {
        const reconnect = vi.fn();
        getHookMock().mockReturnValue({
            liveActivity: baseLiveActivity,
            recentEvents: [],
            dropoffAlerts: [],
            liveStepStats: [],
            isConnected: false,
            error: new Error('Falha ao conectar no Realtime'),
            reconnect,
            clearAlerts: vi.fn(),
            refresh: vi.fn(),
        });
        const LiveMonitoringPage = await loadPage();
        render(<LiveMonitoringPage />);

        expect(screen.getByText(/Erro de Conexão/i)).toBeInTheDocument();
        expect(screen.getByText(/Falha ao conectar no Realtime/i)).toBeInTheDocument();

        screen.getByRole('button', { name: /Tentar Novamente/i }).click();
        expect(reconnect).toHaveBeenCalledTimes(1);
    });

    it('deve renderizar status conectado com métricas em tempo real', async () => {
        getHookMock().mockReturnValue({
            liveActivity: baseLiveActivity,
            recentEvents: baseEvents,
            dropoffAlerts: [],
            liveStepStats: baseStepStats,
            isConnected: true,
            error: null,
            reconnect: vi.fn(),
            clearAlerts: vi.fn(),
            refresh: vi.fn(),
        });
        const LiveMonitoringPage = await loadPage();
        render(<LiveMonitoringPage />);

        expect(screen.getByText(/Monitoramento ao Vivo/i)).toBeInTheDocument();
        expect(screen.getByText(/Conectado/i)).toBeInTheDocument();
        expect(screen.getByText(/Sessões Ativas/i)).toBeInTheDocument();
        expect(screen.getByText(String(baseLiveActivity.activeSessions))).toBeInTheDocument();
        expect(screen.getByText(/usuários únicos/i)).toBeInTheDocument();
    });

    it('deve renderizar conversões de hoje', async () => {
        getHookMock().mockReturnValue({
            liveActivity: baseLiveActivity,
            recentEvents: [],
            dropoffAlerts: [],
            liveStepStats: [],
            isConnected: true,
            error: null,
            reconnect: vi.fn(),
            clearAlerts: vi.fn(),
            refresh: vi.fn(),
        });
        const LiveMonitoringPage = await loadPage();
        render(<LiveMonitoringPage />);

        expect(screen.getByText(/Conversões Hoje/i)).toBeInTheDocument();
        expect(screen.getByText(String(baseLiveActivity.conversionsToday))).toBeInTheDocument();
    });

    it('deve renderizar taxa de conversão em tempo real', async () => {
        getHookMock().mockReturnValue({
            liveActivity: baseLiveActivity,
            recentEvents: [],
            dropoffAlerts: [],
            liveStepStats: [],
            isConnected: true,
            error: null,
            reconnect: vi.fn(),
            clearAlerts: vi.fn(),
            refresh: vi.fn(),
        });
        const LiveMonitoringPage = await loadPage();
        render(<LiveMonitoringPage />);

        expect(screen.getByText(/Taxa de Conversão em Tempo Real/i)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(`${baseLiveActivity.liveConversionRate.toFixed(1)}%`))).toBeInTheDocument();
    });

    it('deve renderizar eventos recentes quando disponíveis', async () => {
        getHookMock().mockReturnValue({
            liveActivity: baseLiveActivity,
            recentEvents: baseEvents,
            dropoffAlerts: [],
            liveStepStats: [],
            isConnected: true,
            error: null,
            reconnect: vi.fn(),
            clearAlerts: vi.fn(),
            refresh: vi.fn(),
        });
        const LiveMonitoringPage = await loadPage();
        render(<LiveMonitoringPage />);

        expect(screen.getByText(/Eventos Recentes/i)).toBeInTheDocument();
        expect(screen.getByText(/Atividade dos últimos minutos/i)).toBeInTheDocument();
        // Verifica que eventos foram renderizados (pelo menos 2 baseEvents)
        const stepTexts = screen.getAllByText(/Step/i);
        expect(stepTexts.length).toBeGreaterThanOrEqual(2);
    });

    it('deve renderizar alertas de dropoff com ação de limpar', async () => {
        const clearAlerts = vi.fn();
        getHookMock().mockReturnValue({
            liveActivity: baseLiveActivity,
            recentEvents: [],
            dropoffAlerts: baseAlerts,
            liveStepStats: [],
            isConnected: true,
            error: null,
            reconnect: vi.fn(),
            clearAlerts,
            refresh: vi.fn(),
        });
        const LiveMonitoringPage = await loadPage();
        render(<LiveMonitoringPage />);

        expect(screen.getByText(/Alertas de Dropoff Crítico/i)).toBeInTheDocument();
        expect(screen.getByText(/2 alertas ativos/i)).toBeInTheDocument();
        expect(screen.getByText(/42.5% dropoff/i)).toBeInTheDocument();

        screen.getByRole('button', { name: /Limpar Alertas/i }).click();
        expect(clearAlerts).toHaveBeenCalledTimes(1);
    });

    it('deve renderizar estatísticas por step ao vivo', async () => {
        getHookMock().mockReturnValue({
            liveActivity: baseLiveActivity,
            recentEvents: [],
            dropoffAlerts: [],
            liveStepStats: baseStepStats,
            isConnected: true,
            error: null,
            reconnect: vi.fn(),
            clearAlerts: vi.fn(),
            refresh: vi.fn(),
        });
        const LiveMonitoringPage = await loadPage();
        render(<LiveMonitoringPage />);

        expect(screen.getByText(/Estatísticas por Step \(Ao Vivo\)/i)).toBeInTheDocument();
        expect(screen.getByText(/12 ativos/i)).toBeInTheDocument();
    });

    it('deve renderizar botão reconectar quando desconectado', async () => {
        const reconnect = vi.fn();
        getHookMock().mockReturnValue({
            liveActivity: baseLiveActivity,
            recentEvents: [],
            dropoffAlerts: [],
            liveStepStats: [],
            isConnected: false,
            error: null,
            reconnect,
            clearAlerts: vi.fn(),
            refresh: vi.fn(),
        });
        const LiveMonitoringPage = await loadPage();
        render(<LiveMonitoringPage />);

        expect(screen.getByText(/Desconectado/i)).toBeInTheDocument();

        screen.getByRole('button', { name: /Reconectar/i }).click();
        expect(reconnect).toHaveBeenCalledTimes(1);
    });
});
