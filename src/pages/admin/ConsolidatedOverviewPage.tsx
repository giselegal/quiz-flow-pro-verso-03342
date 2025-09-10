import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNavigationSafe } from '@/hooks/useNavigationSafe';
import RealTimeAnalytics from '@/services/realTimeAnalytics';
import { AnalyticsService } from '@/services/analyticsService';
import { getCachedMetrics } from '@/utils/analyticsHelpers';
import {
    Activity,
    ArrowUpRight,
    BarChart3,
    Brain,
    Clock,
    Crown,
    DollarSign,
    Eye,
    Layers,
    LineChart,
    PlayCircle,
    Plus,
    Settings,
    Star,
    Target,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Link from 'wouter/link';

interface DashboardData {
    metrics: {
        totalVisitors: number;
        totalStarts: number;
        totalCompletes: number;
        completionRate: number;
        conversionRate: number;
        averageTimeSpent: number;
        totalLeads: number;
        totalSales: number;
    };
    realtimeMetrics: {
        total_sessions: number;
        completed_sessions: number;
        conversion_rate: number;
        average_completion_time: number;
        real_time_active_users: number;
    };
}

const ConsolidatedOverviewPage: React.FC = () => {
    const { navigateToEditor } = useNavigationSafe();
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        metrics: {
            totalVisitors: 0,
            totalStarts: 0,
            totalCompletes: 0,
            completionRate: 0,
            conversionRate: 0,
            averageTimeSpent: 0,
            totalLeads: 0,
            totalSales: 0,
        },
        realtimeMetrics: {
            total_sessions: 0,
            completed_sessions: 0,
            conversion_rate: 0,
            average_completion_time: 0,
            real_time_active_users: 0,
        },
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                // Carregar métricas em cache dos últimos 30 dias
                const cachedMetrics = getCachedMetrics('30d');

                // Carregar métricas em tempo real
                const realtimeMetrics = await RealTimeAnalytics.getDashboardMetrics();

                setDashboardData({
                    metrics: cachedMetrics,
                    realtimeMetrics,
                });
            } catch (error) {
                console.error('❌ Erro ao carregar dados do dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#FEFEFE] to-[#F5F2E9] p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B89B7A] mx-auto mb-4"></div>
                    <p className="text-[#6B4F43]">Carregando dados...</p>
                </div>
            </div>
        );
    }

    const { metrics, realtimeMetrics } = dashboardData;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#FEFEFE] to-[#F5F2E9] p-6 space-y-8">
            {/* Header Consolidado */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#B89B7A] to-[#432818] rounded-xl flex items-center justify-center shadow-lg">
                            <Zap className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#432818] to-[#6B4F43] bg-clip-text text-transparent">
                                Dashboard Quiz Quest
                            </h1>
                            <div className="flex items-center space-x-2 mt-1">
                                <Badge className="bg-gradient-to-r from-[#B89B7A]/20 to-[#432818]/20 text-[#432818] border-0 px-3 py-1">
                                    <Crown className="h-3 w-3 mr-1" />
                                    Pro Analytics
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="border-[#B89B7A]/40 text-[#B89B7A] bg-[#B89B7A]/10"
                                >
                                    <Activity className="h-3 w-3 mr-1" />
                                    {realtimeMetrics.real_time_active_users} usuários online
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <p className="text-lg text-[#6B4F43] max-w-2xl">
                        Visão completa dos seus quizzes, funis e performance com analytics em tempo real e IA integrada.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/admin/analytics/real-time">
                        <Button
                            variant="outline"
                            className="border-[#B89B7A]/40 text-[#432818] hover:bg-[#B89B7A]/10"
                        >
                            <LineChart className="h-4 w-4 mr-2" />
                            Analytics
                        </Button>
                    </Link>
                    <Link href="/admin/ab-testing">
                        <Button
                            variant="outline"
                            className="border-[#B89B7A]/40 text-[#432818] hover:bg-[#B89B7A]/10"
                        >
                            <Target className="h-4 w-4 mr-2" />
                            A/B Tests
                        </Button>
                    </Link>
                    <Button
                        className="bg-gradient-to-r from-[#B89B7A] to-[#432818] hover:from-[#A08766] hover:to-[#3A1F0F] text-white shadow-lg"
                        onClick={() => navigateToEditor()}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Quiz
                    </Button>
                </div>
            </div>

            {/* Ações Rápidas Consolidadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card
                    className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-[#FAF9F7] cursor-pointer"
                    onClick={() => navigateToEditor()}
                >
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#432818]">Editor Visual</p>
                                <p className="text-xs text-[#6B4F43] mt-1">Criar quiz com drag & drop</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#432818] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Plus className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Link href="/admin/funnels">
                    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-[#F5F2E9] cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-[#432818]">Meus Funis</p>
                                    <p className="text-xs text-[#6B4F43] mt-1">Gerenciar funis ativos</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#A08766] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Layers className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/ia-insights">
                    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-[#F5F2E9] cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-[#432818]">Insights de IA</p>
                                    <p className="text-xs text-[#6B4F43] mt-1">Recomendações inteligentes</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#A08766] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Brain className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/settings">
                    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-[#FAF9F7] cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-[#432818]">Configurações</p>
                                    <p className="text-xs text-[#6B4F43] mt-1">Personalizar sistema</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#A08766] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Settings className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Métricas Principais Consolidadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total de Sessões */}
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-[#B89B7A]/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-[#432818]">
                            Total de Sessões
                        </CardTitle>
                        <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#432818] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Users className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#432818] mb-1">
                            {realtimeMetrics.total_sessions || metrics.totalStarts}
                        </div>
                        <div className="flex items-center text-sm mb-3">
                            <ArrowUpRight className="h-4 w-4 text-[#B89B7A] mr-1" />
                            <span className="text-[#B89B7A] font-semibold">
                                {metrics.totalStarts > 0 ? '+' + Math.round((realtimeMetrics.total_sessions / metrics.totalStarts - 1) * 100) : 0}%
                            </span>
                            <span className="ml-1 text-[#6B4F43]">vs período anterior</span>
                        </div>
                        <div className="space-y-2">
                            <Progress value={75} className="h-2 bg-[#FAF9F7]" />
                            <p className="text-xs text-[#6B4F43]">75% da meta mensal</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Taxa de Conversão */}
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-[#B89B7A]/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-[#432818]">
                            Taxa de Conversão
                        </CardTitle>
                        <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#A08766] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Target className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#432818] mb-1">
                            {realtimeMetrics.conversion_rate || metrics.conversionRate}%
                        </div>
                        <div className="flex items-center text-sm mb-3">
                            <ArrowUpRight className="h-4 w-4 text-[#B89B7A] mr-1" />
                            <span className="text-[#B89B7A] font-semibold">+5.2%</span>
                            <span className="ml-1 text-[#6B4F43]">vs período anterior</span>
                        </div>
                        <div className="space-y-2">
                            <Progress value={Math.min(metrics.conversionRate * 2, 100)} className="h-2 bg-[#FAF9F7]" />
                            <p className="text-xs text-[#6B4F43]">
                                {metrics.conversionRate > 50 ? 'Excelente' : metrics.conversionRate > 25 ? 'Boa' : 'Pode melhorar'} performance
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Leads Gerados */}
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-[#B89B7A]/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-[#432818]">
                            Leads Gerados
                        </CardTitle>
                        <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#432818] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Star className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#432818] mb-1">
                            {metrics.totalLeads}
                        </div>
                        <div className="flex items-center text-sm mb-3">
                            <ArrowUpRight className="h-4 w-4 text-[#B89B7A] mr-1" />
                            <span className="text-[#B89B7A] font-semibold">+12.8%</span>
                            <span className="ml-1 text-[#6B4F43]">vs período anterior</span>
                        </div>
                        <div className="space-y-2">
                            <Progress value={85} className="h-2 bg-[#FAF9F7]" />
                            <p className="text-xs text-[#6B4F43]">85% da meta mensal</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Tempo Médio */}
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-[#B89B7A]/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-[#432818]">
                            Tempo Médio
                        </CardTitle>
                        <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#A08766] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Clock className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#432818] mb-1">
                            {Math.round((realtimeMetrics.average_completion_time || metrics.averageTimeSpent) / 60)}min
                        </div>
                        <div className="flex items-center text-sm mb-3">
                            <ArrowUpRight className="h-4 w-4 text-[#B89B7A] mr-1" />
                            <span className="text-[#B89B7A] font-semibold">Estável</span>
                            <span className="ml-1 text-[#6B4F43]">engajamento alto</span>
                        </div>
                        <div className="space-y-2">
                            <Progress value={70} className="h-2 bg-[#FAF9F7]" />
                            <p className="text-xs text-[#6B4F43]">Tempo ideal de engajamento</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Conteúdo Principal Consolidado */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Funcionalidades Disponíveis */}
                <div className="lg:col-span-2">
                    <Card className="border-0 shadow-lg bg-white border-[#B89B7A]/20">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold text-[#432818]">
                                        Funcionalidades Disponíveis
                                    </CardTitle>
                                    <p className="text-sm text-[#6B4F43] mt-1">Recursos ativos e integrados</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Analytics em Tempo Real */}
                                <Link href="/admin/analytics/real-time">
                                    <Card className="group hover:shadow-md transition-all duration-300 border border-[#B89B7A]/20 cursor-pointer">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#432818] rounded-lg flex items-center justify-center">
                                                    <LineChart className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-[#432818]">Analytics Real-Time</h4>
                                                    <p className="text-xs text-[#6B4F43]">Métricas ao vivo</p>
                                                </div>
                                                <Badge className="ml-auto bg-green-100 text-green-700 text-xs">Ativo</Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>

                                {/* A/B Testing */}
                                <Link href="/admin/ab-testing">
                                    <Card className="group hover:shadow-md transition-all duration-300 border border-[#B89B7A]/20 cursor-pointer">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#A08766] rounded-lg flex items-center justify-center">
                                                    <Target className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-[#432818]">Testes A/B</h4>
                                                    <p className="text-xs text-[#6B4F43]">Otimização avançada</p>
                                                </div>
                                                <Badge className="ml-auto bg-green-100 text-green-700 text-xs">Ativo</Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>

                                {/* IA Insights */}
                                <Link href="/admin/ia-insights">
                                    <Card className="group hover:shadow-md transition-all duration-300 border border-[#B89B7A]/20 cursor-pointer">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#432818] rounded-lg flex items-center justify-center">
                                                    <Brain className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-[#432818]">Insights de IA</h4>
                                                    <p className="text-xs text-[#6B4F43]">Recomendações ML</p>
                                                </div>
                                                <Badge className="ml-auto bg-purple-100 text-purple-700 text-xs">IA</Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>

                                {/* Editor Visual */}
                                <Card
                                    className="group hover:shadow-md transition-all duration-300 border border-[#B89B7A]/20 cursor-pointer"
                                    onClick={() => navigateToEditor()}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#A08766] rounded-lg flex items-center justify-center">
                                                <PlayCircle className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-[#432818]">Editor Visual</h4>
                                                <p className="text-xs text-[#6B4F43]">Drag & Drop</p>
                                            </div>
                                            <Badge className="ml-auto bg-blue-100 text-blue-700 text-xs">Core</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Status do Sistema */}
                <div className="space-y-6">
                    {/* Performance Atual */}
                    <Card className="border-0 shadow-lg bg-white border-[#B89B7A]/20">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-[#432818]">Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#6B4F43]">Taxa de Conclusão:</span>
                                    <span className="font-semibold text-[#432818]">{metrics.completionRate}%</span>
                                </div>
                                <Progress value={metrics.completionRate} className="h-2" />

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#6B4F43]">Engajamento:</span>
                                    <Badge variant={metrics.averageTimeSpent > 300 ? 'default' : 'secondary'}>
                                        {metrics.averageTimeSpent > 300 ? 'Alto' : 'Médio'}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ações Rápidas */}
                    <Card className="border-0 shadow-lg bg-white border-[#B89B7A]/20">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-[#432818]">Ações Rápidas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link href="/admin/quizzes">
                                <Button variant="outline" className="w-full justify-start border-[#B89B7A]/40">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver Todos os Quizzes
                                </Button>
                            </Link>
                            <Link href="/admin/leads">
                                <Button variant="outline" className="w-full justify-start border-[#B89B7A]/40">
                                    <Users className="h-4 w-4 mr-2" />
                                    Gerenciar Leads
                                </Button>
                            </Link>
                            <Link href="/admin/webhooks">
                                <Button variant="outline" className="w-full justify-start border-[#B89B7A]/40">
                                    <Zap className="h-4 w-4 mr-2" />
                                    Configurar Webhooks
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ConsolidatedOverviewPage;
