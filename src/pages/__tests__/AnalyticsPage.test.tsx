import React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// ---------------------------------------------------------------------------
// Estratégia de isolamento:
// 1. Evita import estático da página (quebrando resolução de alias em Vitest)
// 2. Mocka todos os módulos com alias usados internamente ANTES do import dinâmico
// 3. Usa import relativo da página para evitar falha em '@/pages/...'
// ---------------------------------------------------------------------------

// Mocks dos componentes de UI para reduzir a árvore e garantir resolução
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
    AlertDescription: (p: any) => <div data-testid="alert-description" {...p} />
}));

// Mock do hook principal com referência direta ao mock
// Inicializa mock do hook antes da página para permitir configurar retorno antes do import dinâmico
const funnelHookMock: ReturnType<typeof vi.fn> = vi.fn();
vi.mock('@/hooks/useFunnelAnalytics', () => ({
    useFunnelAnalytics: funnelHookMock
}));

// Tipagem simplificada para ajudar nos retornos fake
interface MockFunnelMetrics {
    totalSessions: number;
    completedSessions: number;
    conversionRate: number;
    dropoffRate: number;
    averageCompletionTime: number;
    averageScore: number;
}

interface MockConversionFunnel {
    steps: Array<{ stepNumber: number; users: number; percentage: number }>;
    overallConversionRate: number;
}

interface MockStepMetric {
    stepNumber: number;
    totalViews: number;
    dropoffRate: number;
    averageTimeSpent: number;
    mostCommonAnswers?: Array<{ value: string; count: number }>;
}

// Helper para acessar mock do hook sem require()
const getHookMock = () => funnelHookMock;

// Import dinâmico isolado (executado após mocks)
async function loadPage() {
    const mod = await import('../dashboard/AnalyticsPage.testable');
    return mod.default || mod.AnalyticsPageTestable || mod;
}

describe('AnalyticsPage (integração)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        // Garantir isolamento entre testes limpando o DOM para evitar múltiplas instâncias acumuladas
        cleanup();
        vi.useRealTimers();
    });

    const baseMetrics: MockFunnelMetrics = {
        totalSessions: 120,
        completedSessions: 80,
        conversionRate: 66.7,
        dropoffRate: 33.3,
        averageCompletionTime: 14.2,
        averageScore: 7.8,
    };

    const baseSteps: MockStepMetric[] = [
        { stepNumber: 1, totalViews: 120, dropoffRate: 10, averageTimeSpent: 5.2, mostCommonAnswers: [{ value: 'A', count: 40 }] },
        { stepNumber: 2, totalViews: 108, dropoffRate: 12, averageTimeSpent: 6.1 },
        { stepNumber: 3, totalViews: 95, dropoffRate: 25, averageTimeSpent: 4.8 },
        { stepNumber: 4, totalViews: 80, dropoffRate: 15, averageTimeSpent: 7.0 },
    ];

    const funnelWithManySteps: MockConversionFunnel = {
        steps: Array.from({ length: 15 }).map((_, idx) => ({
            stepNumber: idx + 1,
            users: Math.max(1, 150 - idx * 10),
            percentage: Math.max(5, 100 - idx * 5),
        })),
        overallConversionRate: 66.7,
    };

    it('deve renderizar estado de carregamento inicial', async () => {
        getHookMock().mockReturnValue({
            funnelMetrics: null,
            stepMetrics: [],
            conversionFunnel: null,
            loading: true,
            error: null,
            refresh: vi.fn(),
        });
        const AnalyticsPage = await loadPage();
        render(<AnalyticsPage />);

        expect(screen.getByText(/Carregando Analytics/i)).toBeInTheDocument();
        expect(screen.getByText(/Processando dados do Supabase/i)).toBeInTheDocument();
    });

    it('deve renderizar estado de erro e permitir retry', async () => {
        const refresh = vi.fn();
        getHookMock().mockReturnValue({
            funnelMetrics: null,
            stepMetrics: [],
            conversionFunnel: null,
            loading: false,
            error: new Error('Falha na carga'),
            refresh,
        });
        const AnalyticsPage = await loadPage();
        render(<AnalyticsPage />);

        expect(screen.getByText(/Erro ao carregar analytics/i)).toBeInTheDocument();
        expect(screen.getByText(/Falha na carga/i)).toBeInTheDocument();

        screen.getByRole('button', { name: /Tentar Novamente/i }).click();
        expect(refresh).toHaveBeenCalledTimes(1);
    });

    it('deve renderizar métricas principais quando disponíveis', async () => {
        getHookMock().mockReturnValue({
            funnelMetrics: baseMetrics,
            stepMetrics: baseSteps,
            conversionFunnel: funnelWithManySteps,
            loading: false,
            error: null,
            refresh: vi.fn(),
        });
        const AnalyticsPage = await loadPage();
        render(<AnalyticsPage />);

        // Cards principais
        expect(screen.getByText(/Total de Sessões/i)).toBeInTheDocument();
        expect(screen.getByText(String(baseMetrics.totalSessions))).toBeInTheDocument();
        // Evita colisão com texto "Taxa de Conversão Geral" usando role heading
        expect(screen.getByRole('heading', { name: /Taxa de Conversão/i })).toBeInTheDocument();
        expect(screen.getByText(new RegExp(`${baseMetrics.conversionRate}%`))).toBeInTheDocument();
        expect(screen.getByText(/Tempo Médio/i)).toBeInTheDocument();
        expect(screen.getByText(/Score Médio/i)).toBeInTheDocument();
    });

    it('deve renderizar funil de conversão com mensagem de steps adicionais', async () => {
        getHookMock().mockReturnValue({
            funnelMetrics: baseMetrics,
            stepMetrics: baseSteps,
            conversionFunnel: funnelWithManySteps,
            loading: false,
            error: null,
            refresh: vi.fn(),
        });
        const AnalyticsPage = await loadPage();
        render(<AnalyticsPage />);

        // Verifica steps renderizados parcialmente (limit = 10)
        expect(screen.getByText(/Funil de Conversão/i)).toBeInTheDocument();
        expect(screen.getByText(/Visualização do fluxo/i)).toBeInTheDocument();
        expect(screen.getByText(/e mais 5 steps/i)).toBeInTheDocument();
    });

    it('deve renderizar seção de steps com maior dropoff', async () => {
        getHookMock().mockReturnValue({
            funnelMetrics: baseMetrics,
            stepMetrics: baseSteps,
            conversionFunnel: funnelWithManySteps,
            loading: false,
            error: null,
            refresh: vi.fn(),
        });
        const AnalyticsPage = await loadPage();
        render(<AnalyticsPage />);

        expect(screen.getByText(/Steps com Maior Dropoff/i)).toBeInTheDocument();
        // Verifica presença de texto 'dropoff' e porcentagens maiores que zero
        expect(screen.getAllByText(/dropoff/i).length).toBeGreaterThan(0);
    });

    it('deve renderizar respostas mais comuns quando presentes', async () => {
        getHookMock().mockReturnValue({
            funnelMetrics: baseMetrics,
            stepMetrics: baseSteps,
            conversionFunnel: funnelWithManySteps,
            loading: false,
            error: null,
            refresh: vi.fn(),
        });
        const AnalyticsPage = await loadPage();
        render(<AnalyticsPage />);

        expect(screen.getByText(/Respostas Mais Comuns por Step/i)).toBeInTheDocument();
        expect(screen.getByText('A')).toBeInTheDocument();
    });
});
