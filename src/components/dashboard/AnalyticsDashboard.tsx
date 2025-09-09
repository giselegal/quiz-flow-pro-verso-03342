/**
 * 📊 DASHBOARD DE ANALYTICS COM GRÁFICOS
 * 
 * Visualizações interativas dos dados dos participantes
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import {
    Users,
    Target,
    Clock,
    TrendingUp,
    Smartphone,
    AlertCircle
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface AnalyticsData {
    totalParticipants: number;
    completionRate: number;
    averageTime: number;
    abandonmentByStep: Array<{ step: number; count: number; percentage: number }>;
    deviceDistribution: Array<{ device: string; count: number; percentage: number }>;
    dailyActivity: Array<{ date: string; participants: number; completed: number }>;
    styleDistribution: Array<{ style: string; count: number; percentage: number }>;
    timeDistribution: Array<{ range: string; count: number }>;
}

interface KPICardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    color?: 'green' | 'red' | 'blue' | 'orange';
}

// ============================================================================
// CONSTANTES
// ============================================================================

const COLORS = {
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4',
    purple: '#8b5cf6',
    pink: '#ec4899',
    indigo: '#6366f1'
};

const DEVICE_COLORS = {
    mobile: COLORS.primary,
    tablet: COLORS.warning,
    desktop: COLORS.success
};

// ============================================================================
// COMPONENTES
// ============================================================================

const KPICard: React.FC<KPICardProps> = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    trend = 'neutral',
    color = 'blue' 
}) => {
    const colorClasses = {
        green: 'bg-green-50 border-green-200 text-green-800',
        red: 'bg-red-50 border-red-200 text-red-800',
        blue: 'bg-blue-50 border-blue-200 text-blue-800',
        orange: 'bg-orange-50 border-orange-200 text-orange-800'
    };

    const trendIcon = {
        up: <TrendingUp className="w-4 h-4 text-green-600" />,
        down: <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />,
        neutral: null
    };

    return (
        <Card className={`${colorClasses[color]} border-2`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium opacity-80">{title}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-2xl font-bold">{value}</p>
                            {trendIcon[trend]}
                        </div>
                        {subtitle && (
                            <p className="text-xs opacity-60 mt-1">{subtitle}</p>
                        )}
                    </div>
                    <div className="opacity-80">
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <p className="font-medium">{`${label}`}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ color: entry.color }}>
                        {`${entry.dataKey}: ${entry.value}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const AnalyticsDashboard: React.FC = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        totalParticipants: 0,
        completionRate: 0,
        averageTime: 0,
        abandonmentByStep: [],
        deviceDistribution: [],
        dailyActivity: [],
        styleDistribution: [],
        timeDistribution: []
    });
    const [loading, setLoading] = useState(true);

    // ========================================================================
    // FETCH DE DADOS
    // ========================================================================

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            
            // Buscar sessões
            const { data: sessions, error: sessionsError } = await supabase
                .from('quiz_sessions')
                .select('*');

            if (sessionsError) {
                console.error('Erro ao buscar sessões:', sessionsError);
                return;
            }

            // Buscar resultados
            const { data: results, error: resultsError } = await supabase
                .from('quiz_results')
                .select('*');

            if (resultsError) {
                console.error('Erro ao buscar resultados:', resultsError);
            }

            // Processar dados
            const processedData = processAnalyticsData(sessions || [], results || []);
            setAnalytics(processedData);

        } catch (error) {
            console.error('Erro ao buscar analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const processAnalyticsData = (sessions: any[], results: any[]): AnalyticsData => {
        const totalParticipants = sessions.length;
        const completedSessions = sessions.filter(s => s.status === 'completed');
        const completionRate = totalParticipants > 0 ? (completedSessions.length / totalParticipants) * 100 : 0;

        // Tempo médio (em minutos)
        const totalTime = completedSessions.reduce((acc, session) => {
            const timeSpent = session.metadata?.time_spent || 0;
            return acc + timeSpent;
        }, 0);
        const averageTime = completedSessions.length > 0 ? Math.round(totalTime / completedSessions.length / 60) : 0;

        // Abandono por etapa
        const stepCounts: { [key: number]: number } = {};
        sessions.forEach(session => {
            if (session.status === 'abandoned') {
                const step = session.current_step;
                stepCounts[step] = (stepCounts[step] || 0) + 1;
            }
        });

        const abandonmentByStep = Object.entries(stepCounts)
            .map(([step, count]) => ({
                step: parseInt(step),
                count,
                percentage: (count / totalParticipants) * 100
            }))
            .sort((a, b) => a.step - b.step);

        // Distribuição por dispositivo
        const deviceCounts: { [key: string]: number } = {};
        sessions.forEach(session => {
            const device = session.metadata?.device_type || 'unknown';
            deviceCounts[device] = (deviceCounts[device] || 0) + 1;
        });

        const deviceDistribution = Object.entries(deviceCounts)
            .map(([device, count]) => ({
                device,
                count,
                percentage: (count / totalParticipants) * 100
            }))
            .sort((a, b) => b.count - a.count);

        // Atividade diária (últimos 7 dias)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
        }).reverse();

        const dailyActivity = last7Days.map(date => {
            const dayParticipants = sessions.filter(s => 
                s.started_at.startsWith(date)
            );
            const dayCompleted = dayParticipants.filter(s => 
                s.status === 'completed'
            );

            return {
                date: date.split('-')[2] + '/' + date.split('-')[1],
                participants: dayParticipants.length,
                completed: dayCompleted.length
            };
        });

        // Distribuição por estilo
        const styleCounts: { [key: string]: number } = {};
        results.forEach(result => {
            const style = result.result_type || 'Não definido';
            styleCounts[style] = (styleCounts[style] || 0) + 1;
        });

        const styleDistribution = Object.entries(styleCounts)
            .map(([style, count]) => ({
                style,
                count,
                percentage: results.length > 0 ? (count / results.length) * 100 : 0
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8); // Top 8 estilos

        // Distribuição por tempo de conclusão
        const timeRanges = [
            { range: '< 3 min', min: 0, max: 180 },
            { range: '3-5 min', min: 180, max: 300 },
            { range: '5-10 min', min: 300, max: 600 },
            { range: '10+ min', min: 600, max: Infinity }
        ];

        const timeDistribution = timeRanges.map(({ range, min, max }) => {
            const count = completedSessions.filter(session => {
                const timeSpent = session.metadata?.time_spent || 0;
                return timeSpent >= min && timeSpent < max;
            }).length;

            return { range, count };
        });

        return {
            totalParticipants,
            completionRate: Math.round(completionRate * 100) / 100,
            averageTime,
            abandonmentByStep,
            deviceDistribution,
            dailyActivity,
            styleDistribution,
            timeDistribution
        };
    };

    useEffect(() => {
        fetchAnalyticsData();
        
        // Auto-refresh a cada 2 minutos
        const interval = setInterval(fetchAnalyticsData, 120000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="h-20 bg-gray-200 rounded"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* KPIs PRINCIPAIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Total de Participantes"
                    value={analytics.totalParticipants}
                    subtitle="Todos os tempos"
                    icon={<Users className="w-8 h-8" />}
                    color="blue"
                />
                <KPICard
                    title="Taxa de Conclusão"
                    value={`${analytics.completionRate}%`}
                    subtitle="Participantes que finalizaram"
                    icon={<Target className="w-8 h-8" />}
                    color={analytics.completionRate > 70 ? "green" : analytics.completionRate > 50 ? "orange" : "red"}
                    trend={analytics.completionRate > 70 ? "up" : analytics.completionRate < 50 ? "down" : "neutral"}
                />
                <KPICard
                    title="Tempo Médio"
                    value={`${analytics.averageTime} min`}
                    subtitle="Para conclusão"
                    icon={<Clock className="w-8 h-8" />}
                    color="orange"
                />
                <KPICard
                    title="Abandonos"
                    value={analytics.totalParticipants - Math.round(analytics.totalParticipants * analytics.completionRate / 100)}
                    subtitle="Não finalizaram"
                    icon={<AlertCircle className="w-8 h-8" />}
                    color="red"
                />
            </div>

            {/* GRÁFICOS PRINCIPAIS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ATIVIDADE DIÁRIA */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Atividade dos Últimos 7 Dias
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={analytics.dailyActivity}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Area 
                                    type="monotone" 
                                    dataKey="participants" 
                                    stackId="1"
                                    stroke={COLORS.primary} 
                                    fill={COLORS.primary}
                                    fillOpacity={0.6}
                                    name="Participantes"
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="completed" 
                                    stackId="2"
                                    stroke={COLORS.success} 
                                    fill={COLORS.success}
                                    fillOpacity={0.8}
                                    name="Completaram"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* DISTRIBUIÇÃO POR DISPOSITIVO */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Smartphone className="w-5 h-5" />
                            Dispositivos Utilizados
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analytics.deviceDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ device, percentage }) => `${device}: ${percentage.toFixed(1)}%`}
                                    outerRadius={100}
                                    fill={COLORS.primary}
                                    dataKey="count"
                                >
                                    {analytics.deviceDistribution.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={DEVICE_COLORS[entry.device as keyof typeof DEVICE_COLORS] || COLORS.info} 
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* GRÁFICOS SECUNDÁRIOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ABANDONO POR ETAPA */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            Abandono por Etapa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.abandonmentByStep}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="step" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar 
                                    dataKey="count" 
                                    fill={COLORS.danger} 
                                    name="Abandonos"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* DISTRIBUIÇÃO DE TEMPO */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Tempo de Conclusão
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.timeDistribution}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="range" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar 
                                    dataKey="count" 
                                    fill={COLORS.warning} 
                                    name="Participantes"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* ESTILOS MAIS POPULARES */}
            {analytics.styleDistribution.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Estilos Mais Descobertos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.styleDistribution} layout="horizontal">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="style" type="category" width={120} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar 
                                    dataKey="count" 
                                    fill={COLORS.purple} 
                                    name="Descobertas"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AnalyticsDashboard;
