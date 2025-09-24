/**
 * 🎯 PÁGINA DE OVERVIEW DO DASHBOARD
 * 
 * Página principal com visão geral das métricas e KPIs mais importantes:
 * - Cards de métricas resumidas
 * - Gráficos de performance
 * - Atividades recentes
 * - Atalhos rápidos
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    TrendingUp,
    Target,
    Activity,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    Eye,
    Edit,
    BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
    title: string;
    value: string | number;
    change?: {
        value: string;
        trend: 'up' | 'down' | 'neutral';
    };
    icon: React.ReactNode;
    className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, className }) => (
    <Card className={cn("transition-all hover:shadow-md", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
            <div className="text-gray-400">{icon}</div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {change && (
                <div className={cn(
                    "flex items-center text-xs mt-1",
                    change.trend === 'up' && "text-green-600",
                    change.trend === 'down' && "text-red-600",
                    change.trend === 'neutral' && "text-gray-600"
                )}>
                    {change.trend === 'up' && <ArrowUpRight className="w-3 h-3 mr-1" />}
                    {change.trend === 'down' && <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {change.value}
                </div>
            )}
        </CardContent>
    </Card>
);

interface QuickActionProps {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'brand' | 'orange';
}

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

const OverviewPage: React.FC = () => {
    const [metrics, setMetrics] = useState({
        totalParticipants: 0,
        activeFunnels: 0,
        conversionRate: 0,
        totalRevenue: 0
    });

    const [recentActivity] = useState([
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
        },
        {
            id: 4,
            type: 'alert',
            title: 'Funil com baixa performance',
            description: 'Quiz de Produto precisa de revisão',
            time: '1 dia atrás',
            status: 'warning'
        }
    ]);

    // Simular carregamento de dados
    useEffect(() => {
        const loadMetrics = async () => {
            // Simular API call
            setTimeout(() => {
                setMetrics({
                    totalParticipants: 1248,
                    activeFunnels: 8,
                    conversionRate: 68.5,
                    totalRevenue: 15420
                });
            }, 1000);
        };

        loadMetrics();
    }, []);

    return (
        <div className="space-y-6">
            {/* Métricas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total de Participantes"
                    value={metrics.totalParticipants.toLocaleString()}
                    change={{ value: "+12% vs mês anterior", trend: "up" }}
                    icon={<Users className="w-4 h-4" />}
                />
                <MetricCard
                    title="Funis Ativos"
                    value={metrics.activeFunnels}
                    change={{ value: "+2 novos este mês", trend: "up" }}
                    icon={<Target className="w-4 h-4" />}
                />
                <MetricCard
                    title="Taxa de Conversão"
                    value={`${metrics.conversionRate}%`}
                    change={{ value: "+5.2% vs mês anterior", trend: "up" }}
                    icon={<TrendingUp className="w-4 h-4" />}
                />
                <MetricCard
                    title="Receita Total"
                    value={`R$ ${metrics.totalRevenue.toLocaleString()}`}
                    change={{ value: "+18% vs mês anterior", trend: "up" }}
                    icon={<BarChart3 className="w-4 h-4" />}
                />
            </div>

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

            {/* Performance por Funil */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Performance dos Funis</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { name: 'Quiz de Estilo Pessoal', participants: 487, conversion: 72, status: 'high' },
                            { name: 'Marketing Digital', participants: 324, conversion: 68, status: 'medium' },
                            { name: 'E-commerce Starter', participants: 189, conversion: 81, status: 'high' },
                            { name: 'Design Thinking', participants: 156, conversion: 45, status: 'low' },
                            { name: 'Vendas Online', participants: 92, conversion: 59, status: 'medium' }
                        ].map((funnel, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-gray-900 text-sm">{funnel.name}</h4>
                                    <Badge variant={
                                        funnel.status === 'high' ? 'default' :
                                            funnel.status === 'medium' ? 'secondary' : 'outline'
                                    } className="text-xs">
                                        {funnel.conversion}%
                                    </Badge>
                                </div>
                                <p className="text-xs text-gray-600 mb-3">{funnel.participants} participantes</p>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={cn(
                                            "h-2 rounded-full transition-all",
                                            funnel.status === 'high' && "bg-green-500",
                                            funnel.status === 'medium' && "bg-yellow-500",
                                            funnel.status === 'low' && "bg-red-500"
                                        )}
                                        style={{ width: `${funnel.conversion}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default OverviewPage;