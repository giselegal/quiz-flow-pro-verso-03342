/**
 * 📊 ENHANCED REAL-TIME DASHBOARD - VERSÃO ATUALIZADA
 * 
 * Dashboard moderno com métricas em tempo real conectado ao Supabase
 * Usando EnhancedUnifiedDataService para dados reais
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// MIGRATION NOTE: Migrated from EnhancedUnifiedDataService (legacy) to enhancedUnifiedDataServiceAdapter
// Adapter fornece snapshot simplificado em torno do unifiedAnalyticsEngine.
import { enhancedUnifiedDataServiceAdapter, type RealtimeMetricsSnapshot } from '@/analytics/compat/enhancedUnifiedDataServiceAdapter';
import {
    Users,
    TrendingUp,
    Clock,
    RefreshCw,
    Activity,
    Target,
    Award,
    Globe,
    Smartphone,
    Monitor,
    BarChart3
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface MetricCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    change?: string;
    color?: 'green' | 'blue' | 'brand' | 'orange' | 'purple';
    isLoading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    change,
    icon,
    trend = 'neutral',
    color = 'blue',
    isLoading = false
}) => {
    const colorClasses = {
        green: 'border-green-200 bg-gradient-to-br from-green-50 to-green-100 text-green-700',
        blue: 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700',
        brand: 'border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700',
        orange: 'border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700',
        purple: 'border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700'
    };

    const trendColors = {
        up: 'text-green-600',
        down: 'text-red-600',
        neutral: 'text-gray-600'
    };

    if (isLoading) {
        return (
            <Card className="border-2 border-gray-200 bg-gray-50">
                <CardContent className="p-6">
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
                        <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={`border-2 ${colorClasses[color]} shadow-lg hover:shadow-xl transition-all duration-200`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium opacity-70">{title}</p>
                        <p className="text-3xl font-bold">{value}</p>
                        {change && (
                            <p className={`text-sm font-medium ${trendColors[trend]}`}>
                                {trend === 'up' && '↗'} {trend === 'down' && '↘'} {change}
                            </p>
                        )}
                    </div>
                    <div className="text-3xl opacity-70">
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// ============================================================================
// SIMPLE CHART COMPONENTS
// ============================================================================

interface SimpleBarChartProps {
    data: Array<{ label: string; value: number; color?: string }>;
    height?: number;
    title?: string;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="space-y-3">
            {title && <h3 className="font-semibold text-gray-700">{title}</h3>}
            <div className="space-y-2">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <div className="w-20 text-sm text-gray-600 font-medium">
                            {item.label}
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${item.color || 'bg-blue-500'}`}
                                style={{ width: `${(item.value / maxValue) * 100}%` }}
                            />
                        </div>
                        <div className="w-12 text-sm text-gray-600 font-medium text-right">
                            {item.value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface SimpleLineChartProps {
    data: Array<{ hour: number; conversions: number }>;
    title?: string;
}

const SimpleLineChart: React.FC<SimpleLineChartProps> = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.conversions));
    const points = data.map((item, index) => ({
        x: (index / (data.length - 1)) * 100,
        y: 100 - (item.conversions / maxValue) * 80
    }));

    const pathData = points.map((point, index) =>
        `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    return (
        <div className="space-y-3">
            {title && <h3 className="font-semibold text-gray-700">{title}</h3>}
            <div className="relative">
                <svg viewBox="0 0 100 100" className="w-full h-32 border rounded-lg bg-gradient-to-br from-blue-50 to-white">
                    <path
                        d={pathData}
                        stroke="#3B82F6"
                        strokeWidth="2"
                        fill="none"
                        className="drop-shadow-sm"
                    />
                    {points.map((point, index) => (
                        <circle
                            key={index}
                            cx={point.x}
                            cy={point.y}
                            r="2"
                            fill="#3B82F6"
                            className="drop-shadow-sm"
                        />
                    ))}
                </svg>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{data[0]?.hour}:00</span>
                    <span>Conversões por hora</span>
                    <span>{data[data.length - 1]?.hour}:00</span>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

interface UnifiedDashboardMetrics extends RealtimeMetricsSnapshot {
    // Campos derivados que existiam no dashboard anterior (mantidos para não quebrar layout)
    totalSessions?: number;
    completedSessions?: number;
    conversionRate?: number;
    sessionsLastHour?: number;
    conversionsLastHour?: number;
    totalFunnels?: number;
    activeFunnels?: number;
    totalRevenue?: number;
    revenueToday?: number;
    revenueThisMonth?: number;
    topBrowsers?: Array<{ name: string; percentage: number }>;
    geographicData?: Array<{ country: string; users: number }>;
    conversionsByHour?: Array<{ hour: number; conversions: number }>;
    topDevices?: Array<{ name: string; percentage: number }>;
    // Campo derivado para compat (substitui activeUsersRealTime antigo)
    activeUsers?: number;
}

const EnhancedRealTimeDashboard: React.FC = () => {
    const [realTimeMetrics, setRealTimeMetrics] = useState<UnifiedDashboardMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [refreshing, setRefreshing] = useState(false);

    // ============================================================================
    // DATA LOADING
    // ============================================================================

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);
            console.log('📊 EnhancedRealTimeDashboard: Carregando métricas em tempo real (adapter)...');

            // Adapter retorna snapshot reduzido; enriquecemos com placeholders até consolidar fonte completa.
            const snap = await enhancedUnifiedDataServiceAdapter.getRealTimeMetrics();
            // Calcular activeUsers derivado se não vier no snapshot
            const activeUsersDerived = (snap as any).activeUsersRealTime
                || (snap as any).activeUsers
                || (snap as any).currentActiveUsers
                || 0;

            const enriched: UnifiedDashboardMetrics = {
                ...snap,
                activeUsers: activeUsersDerived,
                // Valores placeholder herdados do serviço legacy (até termos fonte unificada completa ou remover do layout)
                totalSessions: realTimeMetrics?.totalSessions || 0,
                completedSessions: realTimeMetrics?.completedSessions || 0,
                conversionRate: realTimeMetrics?.conversionRate || 0,
                sessionsLastHour: realTimeMetrics?.sessionsLastHour || 0,
                conversionsLastHour: realTimeMetrics?.conversionsLastHour || 0,
                totalFunnels: realTimeMetrics?.totalFunnels || 0,
                activeFunnels: realTimeMetrics?.activeFunnels || 0,
                totalRevenue: realTimeMetrics?.totalRevenue || 0,
                revenueToday: realTimeMetrics?.revenueToday || 0,
                revenueThisMonth: realTimeMetrics?.revenueThisMonth || 0,
                topBrowsers: realTimeMetrics?.topBrowsers || [],
                geographicData: realTimeMetrics?.geographicData || [],
                conversionsByHour: realTimeMetrics?.conversionsByHour || Array.from({ length: 24 }, (_, hour) => ({ hour, conversions: 0 })),
                topDevices: realTimeMetrics?.topDevices || []
            };
            setRealTimeMetrics(enriched);
            setLastUpdated(new Date());
            console.log('✅ Real-time metrics snapshot (adapter) loaded');

        } catch (error) {
            console.error('❌ Erro ao carregar métricas em tempo real:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadDashboardData();
        setRefreshing(false);
    };

    // ============================================================================
    // EFFECTS
    // ============================================================================

    useEffect(() => {
        loadDashboardData();
        // Polling simples a cada 30s (até termos streaming nativo no adapter)
        const interval = setInterval(loadDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    // ============================================================================
    // RENDER
    // ============================================================================

    if (isLoading && !realTimeMetrics) {
        return (
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard em Tempo Real</h1>
                    <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <MetricCard
                            key={i}
                            title=""
                            value=""
                            icon={<div />}
                            isLoading={true}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard em Tempo Real</h1>
                    <p className="text-sm text-gray-600">
                        Última atualização: {lastUpdated.toLocaleTimeString()}
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                            Ao vivo
                        </Badge>
                    </p>
                </div>
                <Button
                    onClick={handleRefresh}
                    variant="outline"
                    size="sm"
                    disabled={refreshing}
                    className="flex items-center space-x-2"
                >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>{refreshing ? 'Atualizando...' : 'Atualizar'}</span>
                </Button>
            </div>

            {/* Main Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Usuários Ativos Agora"
                    value={(realTimeMetrics?.activeUsers ?? 0).toString()}
                    icon={<Users />}
                    color="green"
                    change={`+${realTimeMetrics?.sessionsLastHour || 0} na última hora`}
                    trend="up"
                />

                <MetricCard
                    title="Sessões Totais"
                    value={(realTimeMetrics?.totalSessions ?? 0).toLocaleString()}
                    icon={<Activity />}
                    color="blue"
                    change={`${(realTimeMetrics?.conversionRate ?? 0).toFixed(1)}% conversão`}
                    trend="up"
                />

                <MetricCard
                    title="Conversões Hoje"
                    value={(realTimeMetrics?.completedSessions ?? 0).toString()}
                    icon={<Target />}
                    color="purple"
                    change={`+${realTimeMetrics?.conversionsLastHour || 0} última hora`}
                    trend="up"
                />

                <MetricCard
                    title="Receita Total"
                    value={`R$ ${(realTimeMetrics?.totalRevenue ?? 0).toLocaleString()}`}
                    icon={<Award />}
                    color="orange"
                    change={`R$ ${(realTimeMetrics?.revenueToday ?? 0).toLocaleString()} hoje`}
                    trend="up"
                />
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Taxa de Conversão"
                    value={`${(realTimeMetrics?.conversionRate ?? 0).toFixed(1)}%`}
                    icon={<TrendingUp />}
                    color="green"
                    change="Meta: 65%"
                    trend={realTimeMetrics && (realTimeMetrics.conversionRate ?? 0) > 65 ? 'up' : 'neutral'}
                />

                <MetricCard
                    title="Sessões/Hora"
                    value={(realTimeMetrics?.sessionsLastHour ?? 0).toString()}
                    icon={<Clock />}
                    color="blue"
                    change="Última hora"
                    trend="up"
                />

                <MetricCard
                    title="Funis Ativos"
                    value={(realTimeMetrics?.activeFunnels ?? 0).toString()}
                    icon={<BarChart3 />}
                    color="brand"
                    change={`${realTimeMetrics?.totalFunnels ?? 0} total`}
                    trend="neutral"
                />

                <MetricCard
                    title="Revenue/Mês"
                    value={`R$ ${(realTimeMetrics?.revenueThisMonth ?? 0).toLocaleString()}`}
                    icon={<Award />}
                    color="purple"
                    change="Estimativa"
                    trend="up"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Device Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Monitor className="h-5 w-5" />
                            <span>Dispositivos</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {realTimeMetrics && realTimeMetrics.topDevices && (
                            <SimpleBarChart
                                data={(realTimeMetrics.topDevices || []).map(device => ({
                                    label: device.name,
                                    value: device.percentage,
                                    color: device.name === 'Desktop' ? 'bg-blue-500' :
                                        device.name === 'Mobile' ? 'bg-green-500' : 'bg-purple-500'
                                }))}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Geographic Data */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Globe className="h-5 w-5" />
                            <span>Localização dos Usuários</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {realTimeMetrics && realTimeMetrics.geographicData && (
                            <SimpleBarChart
                                data={(realTimeMetrics.geographicData || []).map((country, index) => ({
                                    label: country.country,
                                    value: country.users,
                                    color: index === 0 ? 'bg-green-500' :
                                        index === 1 ? 'bg-blue-500' : 'bg-gray-500'
                                }))}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Hourly Conversions */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <TrendingUp className="h-5 w-5" />
                            <span>Conversões por Hora (Últimas 24h)</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {realTimeMetrics && realTimeMetrics.conversionsByHour && (
                            <SimpleLineChart
                                data={realTimeMetrics.conversionsByHour || []}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Browser Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Globe className="h-5 w-5" />
                        <span>Navegadores Mais Utilizados</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {realTimeMetrics && realTimeMetrics.topBrowsers && (
                        <SimpleBarChart
                            data={(realTimeMetrics.topBrowsers || []).map((browser, index) => ({
                                label: browser.name,
                                value: browser.percentage,
                                color: index === 0 ? 'bg-orange-500' :
                                    index === 1 ? 'bg-blue-500' :
                                        index === 2 ? 'bg-red-500' : 'bg-gray-500'
                            }))}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default EnhancedRealTimeDashboard;
