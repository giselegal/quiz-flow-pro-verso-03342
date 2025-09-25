/**
 * 🏆 ADMIN DASHBOARD CONSOLIDADO - FASE 6 OTIMIZADA
 * 
 * Dashboard principal otimizado usando sistema consolidado de APIs
 * 
 * ✅ UnifiedAnalytics (sistema consolidado)
 * ✅ Dados reais do Supabase quando disponíveis
 * ✅ Dados simulados da Fase 5 como fallback inteligente
 * ✅ Performance otimizada com menos redundâncias
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'wouter';
import {
    UnifiedMetricCard,
    UnifiedMetricsGrid
} from '@/components/dashboard/core/UnifiedMetricCard';
import {
    Users,
    TrendingUp,
    Target,
    Activity,
    RefreshCw,
    Plus,
    Eye,
    Edit,
    BarChart3,
    CheckCircle,
    AlertCircle,
    Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UnifiedAnalyticsService } from '@/services/unifiedAnalytics';
import initPhase5 from '@/utils/initPhase5';

// ============================================================================
// TYPES
// ============================================================================

interface DashboardMetrics {
    totalParticipants: number;
    activeFunnels: number;
    conversionRate: number;
    totalRevenue: number;
}

interface RecentActivity {
    id: number;
    type: string;
    title: string;
    description: string;
    time: string;
    status: 'success' | 'info' | 'warning';
}

interface QuickActionProps {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'brand' | 'orange';
}

// ============================================================================
// UNIFIED ANALYTICS INSTANCE
// ============================================================================
const unifiedAnalytics = new UnifiedAnalyticsService();

const QuickAction: React.FC<QuickActionProps> = ({ title, description, href, icon, color }) => {
    const colorClasses = {
        blue: "bg-blue-50 border-blue-200 hover:bg-blue-100",
        green: "bg-green-50 border-green-200 hover:bg-green-100",
        brand: "bg-slate-50 border-slate-200 hover:bg-slate-100",
        orange: "bg-orange-50 border-orange-200 hover:bg-orange-100"
    };

    return (
        <Link href={href} className={cn("transition-all hover:shadow-md cursor-pointer", colorClasses[color])}>
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                        <div className="text-gray-600">{icon}</div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
                            <p className="text-xs text-gray-600 mt-1">{description}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'participants' | 'analytics'>('overview');
    const [metrics, setMetrics] = useState<DashboardMetrics>({
        totalParticipants: 0,
        activeFunnels: 0,
        conversionRate: 0,
        totalRevenue: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [recentActivity] = useState<RecentActivity[]>([
        {
            id: 1,
            type: 'funnel_created',
            title: 'Novo funil criado',
            description: 'Quiz de Estilo Pessoal v2',
            time: '2 horas atrás',
            status: 'success'
        },
        {
            id: 2,
            type: 'participant_joined',
            title: '12 novos participantes',
            description: 'Funil de Marketing Digital',
            time: '4 horas atrás',
            status: 'info'
        },
        {
            id: 3,
            type: 'conversion',
            title: 'Meta de conversão atingida',
            description: '85% de taxa de conversão',
            time: '6 horas atrás',
            status: 'success'
        }
    ]);

    // ============================================================================
    // DATA LOADING
    // ============================================================================

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);

            // 🎯 FASE 6: Sistema consolidado com UnifiedAnalytics
            console.log('🚀 Fase 6: Carregando dados via UnifiedAnalytics...');

            try {
                await initPhase5();
                console.log('✅ Dados da Fase 5 inicializados com sucesso!');
            } catch (phase5Error) {
                console.warn('⚠️ Erro na inicialização da Fase 5:', phase5Error);
            }

            // Usar UnifiedAnalytics (sistema consolidado com fallback automático)
            const dashboardMetrics = await unifiedAnalytics.getDashboardMetrics();

            // Calcular receita baseada em conversões
            const estimatedRevenue = dashboardMetrics.completedSessions * 45; // R$ 45 por lead convertido

            // Calcular funis ativos baseado nos dados disponíveis
            const activeFunnels = Math.max(
                dashboardMetrics.popularStyles?.length || 0,
                3 // mínimo de funis para demonstração
            );

            setMetrics({
                totalParticipants: dashboardMetrics.totalParticipants,
                activeFunnels: activeFunnels,
                conversionRate: dashboardMetrics.conversionRate,
                totalRevenue: estimatedRevenue
            });

            console.log('✅ Dashboard carregado via UnifiedAnalytics (Fase 6):', {
                participants: dashboardMetrics.totalParticipants,
                completed: dashboardMetrics.completedSessions,
                active: dashboardMetrics.activeSessions,
                conversion: dashboardMetrics.conversionRate,
                revenue: estimatedRevenue,
                source: dashboardMetrics.dataRange ? 'Supabase + Fase5' : 'Fase5 fallback'
            });

        } catch (error) {
            console.error('❌ Erro ao carregar dados do dashboard (Fase 6):', error);

            // Fallback básico para garantir funcionalidade
            setMetrics({
                totalParticipants: 0,
                activeFunnels: 0,
                conversionRate: 0,
                totalRevenue: 0
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    // ============================================================================
    // LOADING STATE
    // ============================================================================

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                        <p className="text-gray-600">Carregando dados...</p>
                    </div>
                    <div className="animate-spin">
                        <RefreshCw className="w-6 h-6" />
                    </div>
                </div>
                <UnifiedMetricsGrid>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="animate-pulse">
                            <Card>
                                <CardHeader>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </UnifiedMetricsGrid>
            </div>
        );
    }

    // ============================================================================
    // RENDER MAIN CONTENT
    // ============================================================================

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                    <p className="text-gray-600">Visão geral das suas métricas e KPIs</p>
                </div>
                <Button onClick={loadDashboardData} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Atualizar
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
                <TabsList>
                    <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                    <TabsTrigger value="participants">Participantes</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* Métricas Principais */}
                    <UnifiedMetricsGrid>
                        <UnifiedMetricCard
                            title="Total de Participantes"
                            value={metrics.totalParticipants.toLocaleString()}
                            change={{ value: "+12% vs mês anterior", trend: "up" }}
                            icon={<Users className="w-4 h-4" />}
                            color="blue"
                        />
                        <UnifiedMetricCard
                            title="Funis Ativos"
                            value={metrics.activeFunnels}
                            change={{ value: "+2 novos este mês", trend: "up" }}
                            icon={<Target className="w-4 h-4" />}
                            color="green"
                        />
                        <UnifiedMetricCard
                            title="Taxa de Conversão"
                            value={`${metrics.conversionRate}%`}
                            change={{ value: "+5.2% vs mês anterior", trend: "up" }}
                            icon={<TrendingUp className="w-4 h-4" />}
                            color="brand"
                        />
                        <UnifiedMetricCard
                            title="Receita Total"
                            value={`R$ ${metrics.totalRevenue.toLocaleString()}`}
                            change={{ value: "+18% vs mês anterior", trend: "up" }}
                            icon={<BarChart3 className="w-4 h-4" />}
                            color="orange"
                        />
                    </UnifiedMetricsGrid>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Ações Rápidas */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">Ações Rápidas</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <QuickAction
                                        title="Criar Novo Funil"
                                        description="Comece um novo funil de conversão"
                                        href="/editor"
                                        icon={<Plus className="w-5 h-5" />}
                                        color="blue"
                                    />
                                    <QuickAction
                                        title="Ver Analytics"
                                        description="Análises detalhadas de performance"
                                        href="/dashboard/analytics"
                                        icon={<BarChart3 className="w-5 h-5" />}
                                        color="green"
                                    />
                                    <QuickAction
                                        title="Gerenciar Funis"
                                        description="Editar e otimizar funis existentes"
                                        href="/dashboard/funnels"
                                        icon={<Edit className="w-5 h-5" />}
                                        color="brand"
                                    />
                                    <QuickAction
                                        title="Ver Participantes"
                                        description="Lista de leads e engajamento"
                                        href="/dashboard/participants"
                                        icon={<Users className="w-5 h-5" />}
                                        color="orange"
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Atividade Recente */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg font-semibold">Atividade Recente</CardTitle>
                                    <Button variant="outline" size="sm">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Ver Todas
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentActivity.map((activity) => (
                                            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                                                    activity.status === 'success' && "bg-green-500",
                                                    activity.status === 'info' && "bg-blue-500",
                                                    activity.status === 'warning' && "bg-orange-500"
                                                )} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                                                    <p className="text-gray-600 text-xs">{activity.description}</p>
                                                    <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                                                </div>
                                                {activity.status === 'success' && (
                                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                )}
                                                {activity.status === 'warning' && (
                                                    <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="participants" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Participantes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Total de participantes: {metrics.totalParticipants.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Funcionalidade detalhada em desenvolvimento...
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Analytics Avançados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8">
                                <Activity className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600">Analytics detalhados em desenvolvimento...</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Esta seção incluirá gráficos detalhados, funis de conversão e insights avançados.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminDashboard;