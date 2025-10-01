'use client';

/**
 * 📊 QUIZ ANALYTICS DASHBOARD - FASE 4
 * 
 * Dashboard completo com visualização de dados, gráficos e KPIs
 * para análise detalhada do comportamento dos usuários no quiz.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    BarChart3, TrendingUp, Users, Clock, Target, Download,
    Activity, Zap, AlertCircle, CheckCircle, PieChart,
    LineChart, MousePointer, Smartphone, Monitor
} from 'lucide-react';

// Analytics Service
import { analyticsService, UserEvent, QuizMetrics, UserSession } from '@/services/AnalyticsService';
import { QUIZ_STEPS, getStepById } from '@/data/quizSteps';
import { styleConfigGisele } from '@/data/styles';
import type { QuizStep } from '@/data/quizSteps';

// ===============================
// 🎯 INTERFACES DO DASHBOARD
// ===============================

interface DashboardProps {
    className?: string;
    autoRefresh?: boolean;
    refreshInterval?: number;
}

interface KPICardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ComponentType<any>;
    trend?: 'up' | 'down' | 'stable';
    color?: 'blue' | 'green' | 'red' | 'yellow';
}

interface ChartData {
    labels: string[];
    datasets: Array<{
        label: string;
        data: number[];
        backgroundColor?: string[];
        borderColor?: string;
        tension?: number;
    }>;
}

// ===============================
// 📊 COMPONENTE PRINCIPAL
// ===============================

export default function QuizAnalyticsDashboard({
    className = '',
    autoRefresh = true,
    refreshInterval = 30000
}: DashboardProps) {
    const [metrics, setMetrics] = useState<QuizMetrics | null>(null);
    const [events, setEvents] = useState<UserEvent[]>([]);
    const [sessions, setSessions] = useState<UserSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTimeRange, setActiveTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
    const [realTimeUpdates, setRealTimeUpdates] = useState(autoRefresh);

    // ===============================
    // 🔄 EFEITOS E ATUALIZAÇÕES
    // ===============================

    useEffect(() => {
        loadAnalyticsData();

        if (realTimeUpdates) {
            const interval = setInterval(loadAnalyticsData, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [activeTimeRange, realTimeUpdates, refreshInterval]);

    useEffect(() => {
        const handleAnalyticsEvent = (event: UserEvent) => {
            setEvents(prev => [...prev, event]);
            loadAnalyticsData(); // Refresh metrics
        };

        analyticsService.addEventListener(handleAnalyticsEvent);
        return () => analyticsService.removeEventListener(handleAnalyticsEvent);
    }, []);

    const loadAnalyticsData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Carregar métricas em tempo real
            const currentMetrics = analyticsService.getRealTimeMetrics();
            setMetrics(currentMetrics);

            // Carregar eventos no período selecionado
            const timeRange = getTimeRangeForPeriod(activeTimeRange);
            const periodEvents = analyticsService.getEventsInTimeRange(
                timeRange.start,
                timeRange.end
            );
            setEvents(periodEvents);

            // Simular sessions (em implementação real, viria do analytics service)
            setSessions([]);

        } catch (error) {
            console.error('Erro ao carregar dados de analytics:', error);
        } finally {
            setIsLoading(false);
        }
    }, [activeTimeRange]);

    // ===============================
    // 📈 PROCESSAMENTO DE DADOS
    // ===============================

    const getTimeRangeForPeriod = (period: string) => {
        const end = new Date().toISOString();
        const start = new Date();

        switch (period) {
            case '1h':
                start.setHours(start.getHours() - 1);
                break;
            case '24h':
                start.setDate(start.getDate() - 1);
                break;
            case '7d':
                start.setDate(start.getDate() - 7);
                break;
            case '30d':
                start.setDate(start.getDate() - 30);
                break;
        }

        return { start: start.toISOString(), end };
    };

    const getStepCompletionData = (): ChartData => {
        const stepNavEvents = events.filter(e => e.type === 'step_navigation');
        const stepCounts: Record<string, number> = {};

        stepNavEvents.forEach(event => {
            const { toStep } = event.data;
            stepCounts[toStep] = (stepCounts[toStep] || 0) + 1;
        });

        const labels = Object.keys(QUIZ_STEPS).slice(0, 10); // Primeiros 10 steps
        const data = labels.map(stepId => stepCounts[stepId] || 0);

        return {
            labels: labels.map(id => `Step ${id.split('-')[1]}`),
            datasets: [{
                label: 'Usuários por Etapa',
                data,
                backgroundColor: 'rgba(139, 92, 246, 0.8)',
                borderColor: 'rgb(139, 92, 246)',
                tension: 0.3
            }]
        };
    };

    const getStyleDistributionData = (): ChartData => {
        if (!metrics?.styleDistribution) return { labels: [], datasets: [] };

        const styles = Object.entries(metrics.styleDistribution);
        const labels = styles.map(([style]) => style);
        const data = styles.map(([, count]) => count);

        const colors = [
            '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B',
            '#EF4444', '#EC4899', '#6366F1', '#84CC16'
        ];

        return {
            labels,
            datasets: [{
                label: 'Distribuição de Estilos',
                data,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: colors.slice(0, labels.length)
            }]
        };
    };

    const getAnswerHeatmapData = () => {
        const heatmap = analyticsService.getAnswerHeatmap();
        return Object.entries(heatmap).slice(0, 5); // Top 5 questões
    };

    const getDropOffAnalysis = () => {
        return analyticsService.getDropOffAnalysis();
    };

    // ===============================
    // 🎨 COMPONENTES UI
    // ===============================

    const KPICard: React.FC<KPICardProps> = ({
        title,
        value,
        change,
        icon: Icon,
        trend = 'stable',
        color = 'blue'
    }) => {
        const colorClasses = {
            blue: 'text-blue-600 bg-blue-50',
            green: 'text-green-600 bg-green-50',
            red: 'text-red-600 bg-red-50',
            yellow: 'text-yellow-600 bg-yellow-50'
        };

        const trendClasses = {
            up: 'text-green-600',
            down: 'text-red-600',
            stable: 'text-gray-600'
        };

        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            {title}
                        </CardTitle>
                        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                            <Icon className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <div className="text-2xl font-bold">
                                {typeof value === 'number' ? value.toLocaleString() : value}
                            </div>
                            {change !== undefined && (
                                <div className={`text-xs ${trendClasses[trend]} flex items-center mt-1`}>
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    {change > 0 ? '+' : ''}{change}%
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const SimpleChart: React.FC<{ data: ChartData; type: 'bar' | 'line' | 'pie' }> = ({
        data,
        type
    }) => {
        if (!data.datasets[0]?.data.length) {
            return (
                <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Sem dados disponíveis</p>
                    </div>
                </div>
            );
        }

        const maxValue = Math.max(...data.datasets[0].data);

        return (
            <div className="space-y-4">
                {data.labels.map((label, index) => {
                    const value = data.datasets[0].data[index];
                    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

                    return (
                        <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">{label}</span>
                                <span className="text-gray-600">{value}</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                        </div>
                    );
                })}
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p>Carregando analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header e Controles */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
                    <p className="text-gray-600">Métricas em tempo real do quiz-editor</p>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Time Range Selector */}
                    <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                        {(['1h', '24h', '7d', '30d'] as const).map((period) => (
                            <Button
                                key={period}
                                variant={activeTimeRange === period ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveTimeRange(period)}
                                className="px-3 py-1"
                            >
                                {period}
                            </Button>
                        ))}
                    </div>

                    {/* Auto Refresh Toggle */}
                    <Button
                        variant={realTimeUpdates ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setRealTimeUpdates(!realTimeUpdates)}
                    >
                        <Activity className={`h-4 w-4 mr-2 ${realTimeUpdates ? 'animate-pulse' : ''}`} />
                        Real-time
                    </Button>

                    {/* Export Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            const data = analyticsService.exportMetricsAsJSON();
                            const blob = new Blob([data], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `quiz-analytics-${new Date().toISOString().split('T')[0]}.json`;
                            a.click();
                        }}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                    </Button>
                </div>
            </div>

            {/* KPIs Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Total de Sessões"
                    value={metrics?.totalSessions || 0}
                    change={12}
                    trend="up"
                    icon={Users}
                    color="blue"
                />
                <KPICard
                    title="Taxa de Conclusão"
                    value={metrics ? `${(metrics.completionRate * 100).toFixed(1)}%` : '0%'}
                    change={-5}
                    trend="down"
                    icon={Target}
                    color="green"
                />
                <KPICard
                    title="Tempo Médio"
                    value={metrics ? `${Math.round(metrics.averageTimeToComplete / 60)}min` : '0min'}
                    change={8}
                    trend="up"
                    icon={Clock}
                    color="yellow"
                />
                <KPICard
                    title="Performance"
                    value={metrics ? `${Math.round(metrics.performanceMetrics.averageLoadTime)}ms` : '0ms'}
                    change={-15}
                    trend="down"
                    icon={Zap}
                    color="red"
                />
            </div>

            {/* Tabs com Análises Detalhadas */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                    <TabsTrigger value="completion">Progresso</TabsTrigger>
                    <TabsTrigger value="styles">Estilos</TabsTrigger>
                    <TabsTrigger value="answers">Respostas</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <BarChart3 className="h-5 w-5 mr-2" />
                                    Progresso por Etapa
                                </CardTitle>
                                <CardDescription>
                                    Número de usuários em cada etapa do quiz
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SimpleChart data={getStepCompletionData()} type="bar" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Activity className="h-5 w-5 mr-2" />
                                    Eventos Recentes
                                </CardTitle>
                                <CardDescription>
                                    Últimas atividades dos usuários
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {events.slice(-10).reverse().map((event, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <div className="flex items-center space-x-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {event.type}
                                                </Badge>
                                                <span className="text-sm">
                                                    {event.type === 'step_navigation'
                                                        ? `${event.data.fromStep} → ${event.data.toStep}`
                                                        : event.data.questionId || 'Ação'
                                                    }
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {new Date(event.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Completion Analysis Tab */}
                <TabsContent value="completion" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Análise de Drop-off</CardTitle>
                            <CardDescription>
                                Pontos onde usuários abandonam o quiz
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {Object.entries(getDropOffAnalysis()).slice(0, 6).map(([stepId, analysis]) => (
                                    <div key={stepId} className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium">Step {stepId.split('-')[1]}</h4>
                                            <Badge variant={analysis.dropRate > 0.3 ? 'destructive' : 'secondary'}>
                                                {(analysis.dropRate * 100).toFixed(1)}%
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">
                                            Taxa de abandono
                                        </p>
                                        <div className="text-xs text-gray-500">
                                            Tempo médio: {Math.round(analysis.avgTimeSpent / 1000)}s
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Styles Distribution Tab */}
                <TabsContent value="styles" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <PieChart className="h-5 w-5 mr-2" />
                                Distribuição de Estilos
                            </CardTitle>
                            <CardDescription>
                                Frequência dos resultados finais
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SimpleChart data={getStyleDistributionData()} type="pie" />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Answer Heatmap Tab */}
                <TabsContent value="answers" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <MousePointer className="h-5 w-5 mr-2" />
                                Heatmap de Respostas
                            </CardTitle>
                            <CardDescription>
                                Respostas mais populares por questão
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {getAnswerHeatmapData().map(([questionId, answers]) => (
                                    <div key={questionId} className="p-4 border rounded-lg">
                                        <h4 className="font-medium mb-3">Questão {questionId}</h4>
                                        <div className="grid gap-2">
                                            {Object.entries(answers).slice(0, 3).map(([answer, count]) => {
                                                const total = Object.values(answers).reduce((a: number, b: number) => a + b, 0);
                                                const percentage = (count / total) * 100;

                                                return (
                                                    <div key={answer} className="flex items-center justify-between">
                                                        <span className="text-sm truncate max-w-xs">
                                                            {JSON.parse(answer)}
                                                        </span>
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-16 bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-blue-600 h-2 rounded-full"
                                                                    style={{ width: `${percentage}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs text-gray-600 w-12 text-right">
                                                                {count}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Performance Tab */}
                <TabsContent value="performance" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Zap className="h-5 w-5 mr-2" />
                                    Métricas de Performance
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Tempo de Carregamento</span>
                                    <span className="font-medium">
                                        {Math.round(metrics?.performanceMetrics.averageLoadTime || 0)}ms
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Tempo de Resposta</span>
                                    <span className="font-medium">
                                        {Math.round(metrics?.performanceMetrics.averageResponseTime || 0)}ms
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Taxa de Erro</span>
                                    <span className="font-medium">
                                        {(metrics?.performanceMetrics.errorRate || 0).toFixed(2)}%
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Monitor className="h-5 w-5 mr-2" />
                                    Dispositivos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Monitor className="h-4 w-4" />
                                            <span className="text-sm">Desktop</span>
                                        </div>
                                        <span className="text-sm font-medium">65%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Smartphone className="h-4 w-4" />
                                            <span className="text-sm">Mobile</span>
                                        </div>
                                        <span className="text-sm font-medium">35%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Status Footer */}
            <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                    Dashboard atualizado em tempo real.
                    Última atualização: {new Date().toLocaleTimeString()}
                </AlertDescription>
            </Alert>
        </div>
    );
}