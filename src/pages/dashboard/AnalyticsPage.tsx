/**
 * 📊 PÁGINA DE ANALYTICS INTEGRADA - FASE 2
 * 
 * Analytics detalhado com dados reais do Supabase:
 * - Métricas de performance de funis
 * - Análise de dropoff por step
 * - Funil de conversão visual
 * - Gráficos interativos
 * 
 * @version 2.0.0 - Integrado com Supabase
 */

import React from 'react';
import { useFunnelAnalytics } from '@/hooks/useFunnelAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    BarChart3,
    TrendingDown,
    TrendingUp,
    Users,
    Clock,
    Target,
    RefreshCw,
    AlertTriangle,
    CheckCircle2,
} from 'lucide-react';

const AnalyticsPage: React.FC = () => {
    const {
        funnelMetrics,
        stepMetrics,
        conversionFunnel,
        loading,
        error,
        refresh
    } = useFunnelAnalytics({
        funnelId: 'quiz-21-steps-integrated',
        autoRefresh: true,
        refreshInterval: 60000,
    });

    if (loading && !funnelMetrics) {
        return (
            <div className="flex items-center justify-center min-h-[600px]">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <h3 className="text-lg font-semibold mb-2">Carregando Analytics</h3>
                    <p className="text-muted-foreground">Processando dados do Supabase...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <Alert className="border-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                        <span>Erro ao carregar analytics: {error.message}</span>
                        <Button size="sm" onClick={refresh}>Tentar Novamente</Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#432818] to-[#6B4F43] bg-clip-text text-transparent">
                        Analytics Avançado
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Métricas detalhadas em tempo real do Supabase
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline">
                        {loading ? 'Atualizando...' : 'Atualizado'}
                    </Badge>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={refresh}
                        disabled={loading}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Atualizar
                    </Button>
                </div>
            </div>

            {/* Métricas Gerais */}
            {funnelMetrics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Sessões</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{funnelMetrics.totalSessions}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {funnelMetrics.completedSessions} concluídas
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{funnelMetrics.conversionRate}%</div>
                            <div className="flex items-center mt-1">
                                {funnelMetrics.conversionRate >= 50 ? (
                                    <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                                ) : (
                                    <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                                )}
                                <p className="text-xs text-muted-foreground">
                                    {funnelMetrics.dropoffRate}% dropoff
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {funnelMetrics.averageCompletionTime.toFixed(1)}min
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Por sessão completa
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Score Médio</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {funnelMetrics.averageScore.toFixed(1)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                De {funnelMetrics.totalSessions} sessões
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Funil de Conversão */}
            {conversionFunnel && (
                <Card>
                    <CardHeader>
                        <CardTitle>Funil de Conversão</CardTitle>
                        <CardDescription>
                            Visualização do fluxo de usuários através dos 21 steps
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {conversionFunnel.steps.slice(0, 10).map((step, index) => (
                                <div key={step.stepNumber} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">Step {step.stepNumber}</span>
                                        <span className="text-muted-foreground">
                                            {step.users} usuários ({step.percentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full transition-all"
                                            style={{ width: `${step.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}

                            {conversionFunnel.steps.length > 10 && (
                                <div className="text-center text-sm text-muted-foreground pt-2">
                                    ... e mais {conversionFunnel.steps.length - 10} steps
                                </div>
                            )}

                            <div className="pt-4 border-t">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">Taxa de Conversão Geral</span>
                                    <Badge variant={conversionFunnel.overallConversionRate >= 50 ? 'default' : 'destructive'}>
                                        {conversionFunnel.overallConversionRate.toFixed(1)}%
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Análise de Steps com Maior Dropoff */}
            {stepMetrics.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Steps com Maior Dropoff</CardTitle>
                        <CardDescription>
                            Identifique onde os usuários estão abandonando o funil
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stepMetrics
                                .filter(s => s.dropoffRate > 0)
                                .sort((a, b) => b.dropoffRate - a.dropoffRate)
                                .slice(0, 5)
                                .map((step) => (
                                    <div key={step.stepNumber} className="flex items-center justify-between p-3 rounded-lg border">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${step.dropoffRate > 50 ? 'bg-red-500' :
                                                    step.dropoffRate > 30 ? 'bg-yellow-500' :
                                                        'bg-green-500'
                                                }`} />
                                            <div>
                                                <div className="font-medium">Step {step.stepNumber}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {step.totalViews} visualizações • {step.averageTimeSpent.toFixed(1)}s médio
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-red-600">{step.dropoffRate.toFixed(1)}%</div>
                                            <div className="text-xs text-muted-foreground">dropoff</div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Respostas Mais Comuns */}
            {stepMetrics.some(s => s.mostCommonAnswers && s.mostCommonAnswers.length > 0) && (
                <Card>
                    <CardHeader>
                        <CardTitle>Respostas Mais Comuns por Step</CardTitle>
                        <CardDescription>
                            Análise das escolhas mais frequentes dos usuários
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {stepMetrics
                                .filter(s => s.mostCommonAnswers && s.mostCommonAnswers.length > 0)
                                .slice(0, 6)
                                .map((step) => (
                                    <div key={step.stepNumber} className="p-4 rounded-lg border">
                                        <div className="font-medium mb-3">Step {step.stepNumber}</div>
                                        <div className="space-y-2">
                                            {step.mostCommonAnswers?.map((answer, idx) => (
                                                <div key={idx} className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">{answer.value}</span>
                                                    <Badge variant="outline">{answer.count}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AnalyticsPage;