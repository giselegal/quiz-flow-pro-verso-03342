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
    UnifiedMetricsGrid
} from '@/components/dashboard/core/UnifiedMetricCard';
import { ModernMetricCard } from '@/components/admin/ModernMetricCard';
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
    // Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UnifiedDataService } from '@/services/core/UnifiedDataService';
import { EditorDashboardSyncService } from '@/services/core/EditorDashboardSyncService';

// ============================================================================
// TYPES
// ============================================================================

interface DashboardMetrics {
    totalFunnels: number;
    activeFunnels: number;
    draftFunnels: number;
    totalSessions: number;
    completedSessions: number;
    conversionRate: number;
    totalRevenue: number;
    activeUsersNow: number;
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
        totalFunnels: 0,
        activeFunnels: 0,
        draftFunnels: 0,
        totalSessions: 0,
        completedSessions: 0,
        conversionRate: 0,
        totalRevenue: 0,
        activeUsersNow: 0
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

            console.log('🚀 AdminDashboard: Carregando dados reais via UnifiedDataService...');

            // Usar UnifiedDataService para dados reais do Supabase
            const dashboardMetrics = await UnifiedDataService.getDashboardMetrics();

            setMetrics({
                totalFunnels: dashboardMetrics.totalFunnels,
                activeFunnels: dashboardMetrics.activeFunnels,
                draftFunnels: dashboardMetrics.draftFunnels,
                totalSessions: dashboardMetrics.totalSessions,
                completedSessions: dashboardMetrics.completedSessions,
                conversionRate: dashboardMetrics.conversionRate,
                totalRevenue: dashboardMetrics.totalRevenue,
                activeUsersNow: dashboardMetrics.activeUsersNow
            });

            console.log('✅ Dashboard carregado com dados reais:', {
                totalFunnels: dashboardMetrics.totalFunnels,
                activeFunnels: dashboardMetrics.activeFunnels,
                totalSessions: dashboardMetrics.totalSessions,
                completedSessions: dashboardMetrics.completedSessions,
                conversionRate: dashboardMetrics.conversionRate,
                totalRevenue: dashboardMetrics.totalRevenue,
                source: 'UnifiedDataService (Supabase + fallback)'
            });

        } catch (error) {
            console.error('❌ Erro ao carregar dados do dashboard:', error);

            // Fallback básico para garantir funcionalidade
            setMetrics({
                totalFunnels: 0,
                activeFunnels: 0,
                draftFunnels: 0,
                totalSessions: 0,
                completedSessions: 0,
                conversionRate: 0,
                totalRevenue: 0,
                activeUsersNow: 0
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    // 🔄 EFFECT: Conectar dashboard ao sistema de sincronização
    useEffect(() => {
        console.log('🔗 AdminDashboard: Conectando ao EditorDashboardSyncService...');

        // Conectar dashboard ao serviço de sincronização
        const disconnect = EditorDashboardSyncService.connectDashboard({
            refresh: () => {
                console.log('🔄 Dashboard: Recebida atualização do editor, recarregando dados...');
                loadDashboardData(); // Recarregar dados quando houver mudanças no editor
            }
        });

        // Escutar eventos de sincronização específicos
        const unsubscribeSync = EditorDashboardSyncService.onSync((event) => {
            console.log(`📡 Dashboard: Evento de sincronização recebido:`, event);

            // Recarregar dados para refletir mudanças
            if (event.type === 'publish' || event.type === 'save' || event.type === 'create' || event.type === 'delete') {
                setTimeout(() => {
                    loadDashboardData();
                }, 1000); // Pequeno delay para garantir que os dados foram salvos
            }
        });

        // Cleanup na desmontagem
        return () => {
            disconnect();
            unsubscribeSync();
        };
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
        <div className="p-8 space-y-8 bg-gradient-to-br from-slate-50/50 to-blue-50/30 min-h-screen">
            {/* Header Modernizado */}
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        Dashboard Executivo
                    </h1>
                    <p className="text-gray-500 text-lg font-medium">
                        Visão estratégica dos seus resultados
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-medium text-gray-700">Dados em tempo real</span>
                    </div>
                    <Button
                        onClick={loadDashboardData}
                        variant="outline"
                        className="bg-white/60 backdrop-blur-sm border-white/40 hover:bg-white/80 shadow-sm"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Atualizar
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur-sm border border-white/40 shadow-sm p-1 rounded-2xl max-w-md">
                    <TabsTrigger
                        value="overview"
                        className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-200 font-medium"
                    >
                        Visão Geral
                    </TabsTrigger>
                    <TabsTrigger
                        value="participants"
                        className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-200 font-medium"
                    >
                        Participantes
                    </TabsTrigger>
                    <TabsTrigger
                        value="analytics"
                        className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-200 font-medium"
                    >
                        Analytics
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-8 mt-8">
                    {/* Métricas Principais - Design Premium */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                            Métricas Principais
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <ModernMetricCard
                                title="Total de Sessões"
                                value={metrics.totalSessions.toLocaleString()}
                                change={{ value: "+12% vs mês anterior", trend: "up" }}
                                icon={<Users className="w-6 h-6" />}
                                color="blue"
                            />
                            <ModernMetricCard
                                title="Total de Funis"
                                value={metrics.totalFunnels}
                                change={{ value: `${metrics.draftFunnels} rascunhos`, trend: "neutral" }}
                                icon={<Target className="w-6 h-6" />}
                                color="green"
                            />
                            <ModernMetricCard
                                title="Taxa de Conversão"
                                value={`${metrics.conversionRate.toFixed(1)}%`}
                                change={{ value: "+5.2% vs mês anterior", trend: "up" }}
                                icon={<TrendingUp className="w-6 h-6" />}
                                color="purple"
                            />
                            <ModernMetricCard
                                title="Receita Total"
                                value={`R$ ${metrics.totalRevenue.toLocaleString()}`}
                                change={{ value: "+18% vs mês anterior", trend: "up" }}
                                icon={<BarChart3 className="w-6 h-6" />}
                                color="orange"
                            />
                        </div>

                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Ações Rápidas - Design Modernizado */}
                        <div className="lg:col-span-1">
                            <Card className="bg-white/60 backdrop-blur-sm border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <Target className="w-5 h-5 text-blue-600" />
                                        Ações Rápidas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
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

                        {/* Atividade Recente - Design Premium */}
                        <div className="lg:col-span-2">
                            <Card className="bg-white/60 backdrop-blur-sm border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
                                <CardHeader className="flex flex-row items-center justify-between pb-4">
                                    <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-green-600" />
                                        Atividades Recentes
                                    </CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="bg-white/60 backdrop-blur-sm border-white/40 hover:bg-white/80 shadow-sm"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Ver Todas
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentActivity.map((activity) => (
                                            <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-white/40 to-gray-50/40 hover:from-white/60 hover:to-gray-50/60 transition-all duration-200 border border-white/30">
                                                <div className={cn(
                                                    "w-3 h-3 rounded-full mt-1.5 flex-shrink-0 shadow-sm",
                                                    activity.status === 'success' && "bg-green-500 shadow-green-200",
                                                    activity.status === 'info' && "bg-blue-500 shadow-blue-200",
                                                    activity.status === 'warning' && "bg-orange-500 shadow-orange-200"
                                                )} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 text-sm">{activity.title}</p>
                                                    <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                                                    <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
                                                        <div className="w-1 h-1 rounded-full bg-gray-400" />
                                                        {activity.time}
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    {activity.status === 'success' && (
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                        </div>
                                                    )}
                                                    {activity.status === 'warning' && (
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100">
                                                            <AlertCircle className="w-4 h-4 text-orange-600" />
                                                        </div>
                                                    )}
                                                    {activity.status === 'info' && (
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                                                            <Activity className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="participants" className="space-y-8 mt-8">
                    <Card className="bg-white/60 backdrop-blur-sm border-white/40 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                <Users className="w-6 h-6 text-blue-600" />
                                Participantes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-blue-800">Total de Sessões</p>
                                            <p className="text-2xl font-bold text-blue-900">{metrics.totalSessions.toLocaleString()}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                                            <Users className="w-6 h-6 text-blue-700" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200/50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-green-800">Sessões Completadas</p>
                                            <p className="text-2xl font-bold text-green-900">{metrics.completedSessions.toLocaleString()}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-6 h-6 text-green-700" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-purple-800">Usuários Ativos</p>
                                            <p className="text-2xl font-bold text-purple-900">{metrics.activeUsersNow}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                                            <Activity className="w-6 h-6 text-purple-700" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center py-6">
                                <p className="text-gray-600 mb-4">Funcionalidades avançadas de participantes em desenvolvimento</p>
                                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Ver Detalhes dos Participantes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-8 mt-8">
                    <Card className="bg-white/60 backdrop-blur-sm border-white/40 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                <BarChart3 className="w-6 h-6 text-purple-600" />
                                Analytics Avançados
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12">
                                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                                    <BarChart3 className="w-10 h-10 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Analytics Detalhados em Desenvolvimento
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Em breve você terá acesso a gráficos detalhados, funis de conversão e insights avançados sobre o desempenho dos seus funis.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg">
                                        <Activity className="w-4 h-4 mr-2" />
                                        Solicitar Preview
                                    </Button>
                                    <Button variant="outline" className="bg-white/60 backdrop-blur-sm border-white/40 hover:bg-white/80">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Ver Roadmap
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminDashboard;