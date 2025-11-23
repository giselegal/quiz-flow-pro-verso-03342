import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnalyticsPage from '@/pages/dashboard/AnalyticsPage';

// Mock do hook useFunnelAnalytics
vi.mock('@/hooks/useFunnelAnalytics', () => ({
    useFunnelAnalytics: vi.fn()
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

// Utilitário para acessar o mock
const getHookMock = () => (require('@/hooks/useFunnelAnalytics') as any).useFunnelAnalytics as ReturnType<typeof vi.fn>;

describe('AnalyticsPage (integração)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
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

    it('deve renderizar estado de carregamento inicial', () => {
        getHookMock().mockReturnValue({
            funnelMetrics: null,
            stepMetrics: [],
            conversionFunnel: null,
            loading: true,
            error: null,
            refresh: vi.fn(),
        });

        render(<AnalyticsPage />);

        expect(screen.getByText(/Carregando Analytics/i)).toBeInTheDocument();
        expect(screen.getByText(/Processando dados do Supabase/i)).toBeInTheDocument();
    });

    it('deve renderizar estado de erro e permitir retry', () => {
        const refresh = vi.fn();
        getHookMock().mockReturnValue({
            funnelMetrics: null,
            stepMetrics: [],
            conversionFunnel: null,
            loading: false,
            error: new Error('Falha na carga'),
            refresh,
        });

        render(<AnalyticsPage />);

        expect(screen.getByText(/Erro ao carregar analytics/i)).toBeInTheDocument();
        expect(screen.getByText(/Falha na carga/i)).toBeInTheDocument();

        screen.getByRole('button', { name: /Tentar Novamente/i }).click();
        expect(refresh).toHaveBeenCalledTimes(1);
    });

    it('deve renderizar métricas principais quando disponíveis', () => {
        getHookMock().mockReturnValue({
            funnelMetrics: baseMetrics,
            stepMetrics: baseSteps,
            conversionFunnel: funnelWithManySteps,
            loading: false,
            error: null,
            refresh: vi.fn(),
        });

        render(<AnalyticsPage />);

        // Cards principais
        expect(screen.getByText(/Total de Sessões/i)).toBeInTheDocument();
        expect(screen.getByText(String(baseMetrics.totalSessions))).toBeInTheDocument();
        expect(screen.getByText(/Taxa de Conversão/i)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(`${baseMetrics.conversionRate}%`))).toBeInTheDocument();
        expect(screen.getByText(/Tempo Médio/i)).toBeInTheDocument();
        expect(screen.getByText(/Score Médio/i)).toBeInTheDocument();
    });

    it('deve renderizar funil de conversão com mensagem de steps adicionais', () => {
        getHookMock().mockReturnValue({
            funnelMetrics: baseMetrics,
            stepMetrics: baseSteps,
            conversionFunnel: funnelWithManySteps,
            loading: false,
            error: null,
            refresh: vi.fn(),
        });

        render(<AnalyticsPage />);

        // Verifica steps renderizados parcialmente (limit = 10)
        expect(screen.getByText(/Funil de Conversão/i)).toBeInTheDocument();
        expect(screen.getByText(/Visualização do fluxo/i)).toBeInTheDocument();
        expect(screen.getByText(/e mais 5 steps/i)).toBeInTheDocument();
    });

    it('deve renderizar seção de steps com maior dropoff', () => {
        getHookMock().mockReturnValue({
            funnelMetrics: baseMetrics,
            stepMetrics: baseSteps,
            conversionFunnel: funnelWithManySteps,
            loading: false,
            error: null,
            refresh: vi.fn(),
        });

        render(<AnalyticsPage />);

        expect(screen.getByText(/Steps com Maior Dropoff/i)).toBeInTheDocument();
        // Verifica presença de texto 'dropoff' e porcentagens maiores que zero
        expect(screen.getAllByText(/dropoff/i).length).toBeGreaterThan(0);
    });

    it('deve renderizar respostas mais comuns quando presentes', () => {
        getHookMock().mockReturnValue({
            funnelMetrics: baseMetrics,
            stepMetrics: baseSteps,
            conversionFunnel: funnelWithManySteps,
            loading: false,
            error: null,
            refresh: vi.fn(),
        });

        render(<AnalyticsPage />);

        expect(screen.getByText(/Respostas Mais Comuns por Step/i)).toBeInTheDocument();
        expect(screen.getByText('A')).toBeInTheDocument();
    });
});
