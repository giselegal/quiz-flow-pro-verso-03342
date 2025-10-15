/**
 * ⚠️ DEPRECATED - ARQUIVO LEGACY
 * 
 * Este arquivo foi substituído por ConsolidatedOverviewPage.tsx
 * As rotas /admin/dashboard foram redirecionadas para /admin no App.tsx
 * ModernDashboardPage.tsx agora carrega ConsolidatedOverviewPage
 * 
 * TODO: Remover este arquivo após validação completa da migração
 * 
 * ---
 * 
 * 🏆 ADMIN DASHBOARD CONSOLIDADO - FASE 6 OTIMIZADA
 * 
 * Dashboard principal otimizado usando sistema consolidado de APIs
 * Nova Identidade Visual Implementada
 * 
 * ✅ UnifiedAnalytics (sistema consolidado)
 * ✅ Dados reais do Supabase quando disponíveis
 * ✅ Dados simulados da Fase 5 como fallback inteligente
 * ✅ Performance otimizada com menos redundâncias
 * ✅ Nova identidade visual com efeitos glow
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'wouter';
import { ModernMetricCard } from '@/components/admin/ModernMetricCard';
import FunnelModelsCard from '@/components/admin/FunnelModelsCard';
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
    Brain,
    Zap,
    Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UnifiedDataService } from '@/services/core/UnifiedDataService';
import { EditorDashboardSyncService } from '@/services/core/EditorDashboardSyncService';
import { useTheme } from '@/styles/themes';
import '@/styles/global-effects.css';

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
// QUICK ACTION COMPONENT  
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
    const theme = useTheme();
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                </div>
            </div>
        );
    }

    // ============================================================================
    // RENDER MAIN CONTENT
    // ============================================================================

    return (
        <div
            className="p-8 space-y-8 min-h-screen animated-bg particles-bg"
            style={{
                background: theme.colors.background,
                color: theme.colors.text
            }}
        >
            {/* Header Modernizado com Nova Identidade Visual */}
            <div className="flex justify-between items-start fade-in-up">
                <div className="space-y-1">
                    <h1
                        className="text-3xl font-bold glow-text"
                        style={{
                            background: `linear-gradient(135deg, ${theme.colors.detailsMinor} 0%, ${theme.colors.buttons} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            filter: `drop-shadow(0 0 15px ${theme.colors.detailsMinor}50)`
                        }}
                    >
                        Dashboard Executivo
                    </h1>
                    <p
                        className="text-lg font-medium"
                        style={{ color: `${theme.colors.text}80` }}
                    >
                        Visão estratégica dos seus resultados
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div
                        className="flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-xl border shadow-sm glow-card"
                        style={{
                            backgroundColor: `${theme.colors.background}60`,
                            borderColor: `${theme.colors.detailsMinor}40`,
                            boxShadow: `0 0 20px ${theme.colors.glowEffect}20`
                        }}
                    >
                        <div
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{ backgroundColor: theme.colors.detailsMinor }}
                        />
                        <span
                            className="text-sm font-medium"
                            style={{ color: theme.colors.text }}
                        >
                            Dados em tempo real
                        </span>
                    </div>
                    <Button
                        onClick={loadDashboardData}
                        variant="outline"
                        className="backdrop-blur-sm shadow-sm glow-button"
                        style={{
                            backgroundColor: `${theme.colors.background}60`,
                            borderColor: `${theme.colors.detailsMinor}40`,
                            color: theme.colors.text,
                            background: `linear-gradient(135deg, ${theme.colors.buttons}20, ${theme.colors.detailsMinor}20)`,
                            boxShadow: `0 0 15px ${theme.colors.glowEffect}30`
                        }}
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Atualizar
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full">
                <TabsList
                    className="grid w-full grid-cols-3 backdrop-blur-sm border shadow-sm p-1 rounded-2xl max-w-md glass-effect glow-card"
                    style={{
                        backgroundColor: `${theme.colors.background}60`,
                        borderColor: `${theme.colors.detailsMinor}40`
                    }}
                >
                    <TabsTrigger
                        value="overview"
                        className="rounded-xl transition-all duration-200 font-medium glow-button"
                        style={{
                            background: activeTab === 'overview'
                                ? `linear-gradient(135deg, ${theme.colors.buttons} 0%, ${theme.colors.detailsMinor} 100%)`
                                : 'transparent',
                            color: activeTab === 'overview' ? '#ffffff' : theme.colors.text,
                            boxShadow: activeTab === 'overview'
                                ? `0 0 15px ${theme.colors.buttons}40`
                                : 'none'
                        }}
                    >
                        Visão Geral
                    </TabsTrigger>
                    <TabsTrigger
                        value="participants"
                        className="rounded-xl transition-all duration-200 font-medium glow-button"
                        style={{
                            background: activeTab === 'participants'
                                ? `linear-gradient(135deg, ${theme.colors.buttons} 0%, ${theme.colors.detailsMinor} 100%)`
                                : 'transparent',
                            color: activeTab === 'participants' ? '#ffffff' : theme.colors.text,
                            boxShadow: activeTab === 'participants'
                                ? `0 0 15px ${theme.colors.buttons}40`
                                : 'none'
                        }}
                    >
                        Participantes
                    </TabsTrigger>
                    <TabsTrigger
                        value="analytics"
                        className="rounded-xl transition-all duration-200 font-medium glow-button"
                        style={{
                            background: activeTab === 'analytics'
                                ? `linear-gradient(135deg, ${theme.colors.buttons} 0%, ${theme.colors.detailsMinor} 100%)`
                                : 'transparent',
                            color: activeTab === 'analytics' ? '#ffffff' : theme.colors.text,
                            boxShadow: activeTab === 'analytics'
                                ? `0 0 15px ${theme.colors.buttons}40`
                                : 'none'
                        }}
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
                        {/* Modelos de Funis - Card Dedicado */}
                        <div className="lg:col-span-1">
                            <FunnelModelsCard />
                        </div>

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
                                        title="🛠️ Editar Funil (quiz-estilo)"
                                        description="Abrir o editor já com o template de estilo pessoal"
                                        href="/editor?template=quiz-estilo"
                                        icon={<Edit className="w-5 h-5" />}
                                        color="brand"
                                    />
                                    <QuickAction
                                        title="🎯 Funil em Produção"
                                        description="Ver Quiz de Estilo Pessoal (publicado)"
                                        href="/admin/funil-atual"
                                        icon={<Target className="w-5 h-5" />}
                                        color="green"
                                    />
                                    <QuickAction
                                        title="📋 Modelos de Funis"
                                        description="Templates prontos: Quiz 21 Etapas, Lead Magnets e mais"
                                        href="/admin/modelos"
                                        icon={<Plus className="w-5 h-5" />}
                                        color="blue"
                                    />
                                    <QuickAction
                                        title="Criar Novo Funil"
                                        description="Comece um novo funil de conversão"
                                        href="/editor"
                                        icon={<Edit className="w-5 h-5" />}
                                        color="orange"
                                    />
                                    <QuickAction
                                        title="Meus Funis"
                                        description="Gerencie seus funis existentes"
                                        href="/admin/funnels"
                                        icon={<Eye className="w-5 h-5" />}
                                        color="brand"
                                    />
                                    <QuickAction
                                        title="🤖 AI Insights"
                                        description="Recomendações IA e otimizações automáticas"
                                        href="/admin/ai-insights"
                                        icon={<BarChart3 className="w-5 h-5" />}
                                        color="orange"
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recursos Avançados Descobertos */}
                        <div className="lg:col-span-1">
                            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                                <CardHeader className="flex flex-row items-center justify-between pb-4">
                                    <CardTitle className="text-lg font-semibold text-purple-900 flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-purple-600" />
                                        Recursos Avançados Disponíveis
                                    </CardTitle>
                                    <Badge className="bg-purple-100 text-purple-700">Novos!</Badge>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <QuickAction
                                        title="🤖 AI Insights & Optimization"
                                        description="Sistema IA com recomendações automáticas (antes oculto)"
                                        href="/admin/ai-insights"
                                        icon={<Brain className="w-5 h-5" />}
                                        color="blue"
                                    />
                                    <QuickAction
                                        title="📊 Analytics Avançadas"
                                        description="Dados comportamentais e insights profundos"
                                        href="/admin/analytics-advanced"
                                        icon={<BarChart3 className="w-5 h-5" />}
                                        color="green"
                                    />
                                    <QuickAction
                                        title="⚡ Performance Monitor"
                                        description="Monitoramento sistema em tempo real"
                                        href="/admin/performance-monitor"
                                        icon={<Activity className="w-5 h-5" />}
                                        color="brand"
                                    />
                                    <QuickAction
                                        title="🛡️ Security Dashboard"
                                        description="Logs de auditoria e monitoramento segurança"
                                        href="/admin/security"
                                        icon={<Shield className="w-5 h-5" />}
                                        color="orange"
                                    />
                                    <QuickAction
                                        title="🎯 Funis Quiz"
                                        description="Gerenciar e editar funis de quiz de estilo"
                                        href="/dashboard/quiz-funnels"
                                        icon={<Target className="w-5 h-5" />}
                                        color="brand"
                                    />
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
                    {/* Link para Analytics Avançadas */}
                    <div className="mb-6">
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-blue-900">📊 Analytics Avançadas Disponíveis</h3>
                                        <p className="text-blue-800 text-sm">Dados comportamentais detalhados, análise por etapa e insights profundos</p>
                                    </div>
                                    <Button
                                        onClick={() => window.open('/admin/analytics-advanced', '_blank')}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        Ver Analytics Completas
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Analytics Premium - Design Modernizado */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Chart de Conversões */}
                        <Card className="bg-white/60 backdrop-blur-sm border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                    Conversões por Período
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                                    <div className="text-center">
                                        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500 text-sm">Gráfico de conversões</p>
                                        <p className="text-xs text-gray-400">Ver analytics avançadas para mais detalhes</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Atividade Recente */}
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
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminDashboard;