/**
 * 📊 FACEBOOK METRICS DASHBOARD
 * 
 * Componente para exibir métricas detalhadas das campanhas do Facebook Ads por funil
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import FacebookMetricsService, { FunnelFacebookMetrics, FacebookMetricDetailed } from '@/services/FacebookMetricsService';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    TrendingUp,
    TrendingDown,
    Eye,
    MousePointer,
    DollarSign,
    Users,
    Target,
    RefreshCw,
    Facebook,
    Activity,
    Download
} from 'lucide-react';
import { useTheme } from '@/styles/themes';

// ============================================================================
// TYPES
// ============================================================================

interface FunnelMetricsWithDetails extends FunnelFacebookMetrics {
    detailedMetrics?: FacebookMetricDetailed[];
    growth?: {
        impressions: number;
        clicks: number;
        spend: number;
        conversions: number;
        leads: number;
    };
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

interface FacebookMetricsDashboardProps {
    funnelId?: string; // Se fornecido, mostra apenas métricas deste funil
    showComparison?: boolean; // Mostrar comparação com período anterior
}

const FacebookMetricsDashboard: React.FC<FacebookMetricsDashboardProps> = ({
    funnelId,
    showComparison = true
}) => {
    const [funnelMetrics, setFunnelMetrics] = useState<FunnelMetricsWithDetails[]>([]);
    const [selectedFunnel, setSelectedFunnel] = useState<string>(funnelId || 'all');
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '14d' | '30d'>('30d');
    const [totalMetrics, setTotalMetrics] = useState({
        impressions: 0,
        clicks: 0,
        spend: 0,
        conversions: 0,
        quiz_starts: 0,
        leads: 0
    });
    const theme = useTheme();

    // ============================================================================
    // CARREGAMENTO DE DADOS
    // ============================================================================

    const loadFacebookMetrics = async () => {
        try {
            setIsLoading(true);

            const daysAgo = parseInt(selectedPeriod.replace('d', ''));
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - daysAgo);

            let metrics: FunnelFacebookMetrics[] = [];

            if (selectedFunnel === 'all') {
                // Buscar métricas de todos os funis
                metrics = await FacebookMetricsService.getAllFunnelsMetrics(
                    startDate.toISOString().split('T')[0],
                    new Date().toISOString().split('T')[0]
                );
            } else {
                // Buscar métricas de funil específico
                const funnelMetric = await FacebookMetricsService.getFunnelMetrics(
                    selectedFunnel,
                    startDate.toISOString().split('T')[0],
                    new Date().toISOString().split('T')[0]
                );
                if (funnelMetric) {
                    metrics = [funnelMetric];
                }
            }

            console.log('✅ Métricas carregadas:', metrics.length);

            // Enriquecer com métricas detalhadas e comparação
            const enrichedMetrics: FunnelMetricsWithDetails[] = await Promise.all(
                metrics.map(async (metric) => {
                    const [detailedMetrics, comparison] = await Promise.all([
                        FacebookMetricsService.getFunnelDetailedMetrics(
                            metric.funnel_id,
                            startDate.toISOString().split('T')[0],
                            new Date().toISOString().split('T')[0]
                        ),
                        showComparison
                            ? FacebookMetricsService.getComparativeMetrics(metric.funnel_id, daysAgo)
                            : Promise.resolve({ growth: { impressions: 0, clicks: 0, spend: 0, conversions: 0, leads: 0 } })
                    ]);

                    return {
                        ...metric,
                        detailedMetrics,
                        growth: comparison.growth
                    };
                })
            );

            setFunnelMetrics(enrichedMetrics);

            // Calcular totais gerais
            const totals = enrichedMetrics.reduce((acc, metric) => ({
                impressions: acc.impressions + metric.total_impressions,
                clicks: acc.clicks + metric.total_clicks,
                spend: acc.spend + metric.total_spend,
                conversions: acc.conversions + metric.total_conversions,
                quiz_starts: acc.quiz_starts + metric.total_quiz_starts,
                leads: acc.leads + metric.total_leads
            }), {
                impressions: 0,
                clicks: 0,
                spend: 0,
                conversions: 0,
                quiz_starts: 0,
                leads: 0
            });

            setTotalMetrics(totals);

        } catch (error) {
            console.error('❌ Erro ao carregar métricas:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSyncMetrics = async () => {
        setIsSyncing(true);
        try {
            const result = await FacebookMetricsService.syncFacebookMetrics(
                selectedFunnel === 'all' ? undefined : selectedFunnel
            );

            if (result.success) {
                // Recarregar métricas após sincronização
                await loadFacebookMetrics();
            }

            console.log(result.message);
        } catch (error) {
            console.error('❌ Erro na sincronização:', error);
        } finally {
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        loadFacebookMetrics();
    }, [selectedPeriod, selectedFunnel]);    // ============================================================================
    // HELPERS
    // ============================================================================

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatPercentage = (value: number): string => {
        return `${value.toFixed(2)}%`;
    };

    const formatNumber = (value: number): string => {
        return new Intl.NumberFormat('pt-BR').format(value);
    };

    // ============================================================================
    // RENDER
    // ============================================================================

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Facebook className="w-6 h-6 text-blue-600" />
                        Facebook Ads Metrics
                    </h2>
                </div>
                <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Carregando métricas do Facebook...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="space-y-6 p-6 rounded-lg"
            style={{
                background: theme.colors.background,
                color: theme.colors.text
            }}
        >
            {/* Header com Nova Identidade Visual */}
            <div className="flex items-center justify-between">
                <h2
                    className="text-2xl font-bold flex items-center gap-2 glow-text"
                    style={{
                        background: `linear-gradient(135deg, ${theme.colors.detailsMinor} 0%, ${theme.colors.buttons} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: `drop-shadow(0 0 10px ${theme.colors.detailsMinor}50)`
                    }}
                >
                    <Facebook className="w-6 h-6" style={{ color: theme.colors.buttons }} />
                    Facebook Ads Metrics
                    {selectedFunnel !== 'all' && (
                        <Badge
                            variant="outline"
                            className="ml-2 glow-card"
                            style={{
                                borderColor: theme.colors.detailsMinor,
                                backgroundColor: `${theme.colors.glowEffect}20`,
                                color: theme.colors.text
                            }}
                        >
                            {funnelMetrics[0]?.funnel_name || selectedFunnel}
                        </Badge>
                    )}
                </h2>
                <div className="flex items-center gap-2">
                    {!funnelId && (
                        <select
                            value={selectedFunnel}
                            onChange={(e) => setSelectedFunnel(e.target.value)}
                            className="px-3 py-1 border rounded-md glow-card"
                            style={{
                                backgroundColor: theme.colors.background,
                                borderColor: `${theme.colors.detailsMinor}50`,
                                color: theme.colors.text,
                                boxShadow: `0 0 10px ${theme.colors.glowEffect}20`
                            }}
                        >
                            <option value="all">Todos os Funis</option>
                            {funnelMetrics.map(metric => (
                                <option key={metric.funnel_id} value={metric.funnel_id}>
                                    {metric.funnel_name}
                                </option>
                            ))}
                        </select>
                    )}
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value as '7d' | '14d' | '30d')}
                        className="px-3 py-1 border rounded-md glow-card"
                        style={{
                            backgroundColor: theme.colors.background,
                            borderColor: `${theme.colors.detailsMinor}50`,
                            color: theme.colors.text,
                            boxShadow: `0 0 10px ${theme.colors.glowEffect}20`
                        }}
                    >
                        <option value="7d">Últimos 7 dias</option>
                        <option value="14d">Últimos 14 dias</option>
                        <option value="30d">Últimos 30 dias</option>
                    </select>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSyncMetrics}
                        disabled={isSyncing}
                        className="glow-button"
                        style={{
                            background: `linear-gradient(135deg, ${theme.colors.buttons} 0%, ${theme.colors.detailsMinor} 100%)`,
                            borderColor: theme.colors.buttons,
                            color: '#ffffff',
                            boxShadow: `0 0 15px ${theme.colors.buttons}40`
                        }}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                        {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={loadFacebookMetrics}>
                        <Download className="w-4 h-4 mr-2" />
                        Atualizar
                    </Button>
                </div>
            </div>

            {/* Cards de Métricas Totais */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Eye className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium">Impressões</span>
                        </div>
                        <p className="text-2xl font-bold">{formatNumber(totalMetrics.impressions)}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <MousePointer className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium">Cliques</span>
                        </div>
                        <p className="text-2xl font-bold">{formatNumber(totalMetrics.clicks)}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">Investimento</span>
                        </div>
                        <p className="text-2xl font-bold">{formatCurrency(totalMetrics.spend)}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-purple-500" />
                            <span className="text-sm font-medium">Conversões</span>
                        </div>
                        <p className="text-2xl font-bold">{formatNumber(totalMetrics.conversions)}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-medium">Quiz Starts</span>
                        </div>
                        <p className="text-2xl font-bold">{formatNumber(totalMetrics.quiz_starts)}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium">Leads</span>
                        </div>
                        <p className="text-2xl font-bold">{formatNumber(totalMetrics.leads)}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Performance por Funil */}
            <Card>
                <CardHeader>
                    <CardTitle>Performance por Funil</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Funil</TableHead>
                                <TableHead>Campanhas</TableHead>
                                <TableHead>Impressões</TableHead>
                                <TableHead>Cliques</TableHead>
                                <TableHead>CTR</TableHead>
                                <TableHead>CPC</TableHead>
                                <TableHead>Investimento</TableHead>
                                <TableHead>Quiz Starts</TableHead>
                                <TableHead>Leads</TableHead>
                                <TableHead>ROAS</TableHead>
                                {showComparison && <TableHead>Crescimento</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {funnelMetrics.map((funnel) => (
                                <TableRow key={funnel.funnel_id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <div className="font-semibold">{funnel.funnel_name}</div>
                                                <div className="text-sm text-gray-500">
                                                    Pixel: {funnel.facebook_pixel_id || 'Não configurado'}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {funnel.total_campaigns}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatNumber(funnel.total_impressions)}</TableCell>
                                    <TableCell>{formatNumber(funnel.total_clicks)}</TableCell>
                                    <TableCell>
                                        <Badge variant={funnel.avg_ctr > 3 ? "default" : "secondary"}>
                                            {formatPercentage(funnel.avg_ctr)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatCurrency(funnel.avg_cpc)}</TableCell>
                                    <TableCell>{formatCurrency(funnel.total_spend)}</TableCell>
                                    <TableCell>
                                        <span className="font-medium text-orange-600">
                                            {formatNumber(funnel.total_quiz_starts)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium text-green-600">
                                            {formatNumber(funnel.total_leads)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={funnel.roas > 200 ? "default" : "secondary"}>
                                            {formatPercentage(funnel.roas)}
                                        </Badge>
                                    </TableCell>
                                    {showComparison && funnel.growth && (
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className={`text-xs flex items-center ${funnel.growth.leads >= 0 ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {funnel.growth.leads >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                                    Leads: {funnel.growth.leads}%
                                                </div>
                                                <div className={`text-xs flex items-center ${funnel.growth.conversions >= 0 ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {funnel.growth.conversions >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                                    Conv: {funnel.growth.conversions}%
                                                </div>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {funnelMetrics.length === 0 && (
                        <div className="text-center py-8">
                            <Facebook className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-600 mb-2">
                                {selectedFunnel === 'all'
                                    ? 'Nenhuma métrica encontrada'
                                    : `Nenhuma métrica encontrada para o funil selecionado`
                                }
                            </p>
                            <p className="text-sm text-gray-500">
                                Configure a integração com Facebook Ads e mapeie campanhas para funis
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={handleSyncMetrics}
                                disabled={isSyncing}
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                                {isSyncing ? 'Sincronizando...' : 'Sincronizar Dados'}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default FacebookMetricsDashboard;