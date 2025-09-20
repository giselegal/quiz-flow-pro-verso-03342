import { useState, useEffect } from 'react';
import {
    X,
    BarChart3,
    TrendingUp,
    Users,
    Target,
    Clock,
    Eye,
    MousePointer,
    Smartphone,
    Monitor,
    Tablet,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    ArrowUp,
    ArrowDown,
    Minimize2
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useAnalytics } from '../../hooks/useAnalytics';

interface AnalyticsDashboardOverlayProps {
    onClose: () => void;
}

interface RealTimeMetrics {
    currentVisitors: number;
    conversionRate: number;
    averageTime: string;
    bounceRate: number;
    deviceBreakdown: {
        desktop: number;
        mobile: number;
        tablet: number;
    };
    topPerformingSteps: Array<{
        stepName: string;
        conversionRate: number;
        visitors: number;
    }>;
    liveActivity: Array<{
        timestamp: string;
        action: string;
        step: string;
        device: string;
    }>;
}

export function AnalyticsDashboardOverlay({ onClose }: AnalyticsDashboardOverlayProps) {
    const { trackEvent } = useAnalytics();
    const [isMinimized, setIsMinimized] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics>({
        currentVisitors: 0,
        conversionRate: 0,
        averageTime: '0:00',
        bounceRate: 0,
        deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
        topPerformingSteps: [],
        liveActivity: []
    });

    // Simulate real-time data updates
    useEffect(() => {
        const generateMockData = (): RealTimeMetrics => ({
            currentVisitors: Math.floor(Math.random() * 50) + 10,
            conversionRate: Math.random() * 15 + 5,
            averageTime: `${Math.floor(Math.random() * 5) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            bounceRate: Math.random() * 30 + 20,
            deviceBreakdown: {
                desktop: Math.floor(Math.random() * 40) + 30,
                mobile: Math.floor(Math.random() * 30) + 25,
                tablet: Math.floor(Math.random() * 20) + 10
            },
            topPerformingSteps: [
                { stepName: 'Landing Page', conversionRate: Math.random() * 20 + 15, visitors: Math.floor(Math.random() * 100) + 50 },
                { stepName: 'Quiz Intro', conversionRate: Math.random() * 15 + 10, visitors: Math.floor(Math.random() * 80) + 40 },
                { stepName: 'Question 1', conversionRate: Math.random() * 25 + 20, visitors: Math.floor(Math.random() * 60) + 30 },
                { stepName: 'Results', conversionRate: Math.random() * 30 + 25, visitors: Math.floor(Math.random() * 40) + 20 },
            ],
            liveActivity: [
                { timestamp: '2s', action: 'Visited', step: 'Landing Page', device: 'Desktop' },
                { timestamp: '5s', action: 'Started Quiz', step: 'Quiz Intro', device: 'Mobile' },
                { timestamp: '8s', action: 'Answered', step: 'Question 1', device: 'Desktop' },
                { timestamp: '12s', action: 'Converted', step: 'Results', device: 'Mobile' },
                { timestamp: '15s', action: 'Shared', step: 'Results', device: 'Tablet' },
            ]
        });

        const updateMetrics = () => {
            setRealTimeMetrics(generateMockData());
        };

        // Initial load
        updateMetrics();

        // Update every 3 seconds
        const interval = setInterval(updateMetrics, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        trackEvent('analytics_dashboard_refresh', { timestamp: Date.now() });

        // Simulate API call
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    const getDeviceIcon = (device: string) => {
        switch (device.toLowerCase()) {
            case 'mobile': return <Smartphone className="w-3 h-3" />;
            case 'tablet': return <Tablet className="w-3 h-3" />;
            default: return <Monitor className="w-3 h-3" />;
        }
    };

    const getTrendIcon = (value: number) => {
        if (value > 15) return <ArrowUp className="w-3 h-3 text-green-500" />;
        if (value < 8) return <ArrowDown className="w-3 h-3 text-red-500" />;
        return <div className="w-3 h-3" />;
    };

    if (isMinimized) {
        return (
            <div className="fixed bottom-4 right-4 z-[150]">
                <Button
                    onClick={() => setIsMinimized(false)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                    <Badge className="bg-white/20 text-white text-xs ml-2">
                        {realTimeMetrics.currentVisitors}
                    </Badge>
                </Button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-full max-w-7xl mx-4 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h2>
                            <p className="text-sm text-gray-600">Métricas em tempo real do seu funil</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs text-green-600 font-medium">LIVE</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                            {refreshing ? 'Atualizando...' : 'Atualizar'}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsMinimized(true)}
                        >
                            <Minimize2 className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onClose}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                    {/* Main Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                {getTrendIcon(realTimeMetrics.currentVisitors)}
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-900">{realTimeMetrics.currentVisitors}</p>
                                <p className="text-sm text-blue-600">Visitantes Ativos</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-green-600 rounded-lg">
                                    <Target className="w-5 h-5 text-white" />
                                </div>
                                {getTrendIcon(realTimeMetrics.conversionRate)}
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-900">{realTimeMetrics.conversionRate.toFixed(1)}%</p>
                                <p className="text-sm text-green-600">Taxa de Conversão</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-purple-600 rounded-lg">
                                    <Clock className="w-5 h-5 text-white" />
                                </div>
                                <CheckCircle className="w-4 h-4 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-purple-900">{realTimeMetrics.averageTime}</p>
                                <p className="text-sm text-purple-600">Tempo Médio</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-orange-600 rounded-lg">
                                    <Eye className="w-5 h-5 text-white" />
                                </div>
                                {realTimeMetrics.bounceRate > 40 ?
                                    <AlertCircle className="w-4 h-4 text-orange-500" /> :
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                }
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-orange-900">{realTimeMetrics.bounceRate.toFixed(1)}%</p>
                                <p className="text-sm text-orange-600">Taxa de Rejeição</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Device Breakdown */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Smartphone className="w-5 h-5 text-gray-600" />
                                Breakdown por Dispositivo
                            </h3>

                            <div className="space-y-4">
                                {[
                                    { name: 'Desktop', value: realTimeMetrics.deviceBreakdown.desktop, icon: Monitor },
                                    { name: 'Mobile', value: realTimeMetrics.deviceBreakdown.mobile, icon: Smartphone },
                                    { name: 'Tablet', value: realTimeMetrics.deviceBreakdown.tablet, icon: Tablet },
                                ].map(({ name, value, icon: Icon }) => (
                                    <div key={name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm font-medium text-gray-700">{name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${(value / 70) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900 w-8">{value}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Performing Steps */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-gray-600" />
                                Steps com Melhor Performance
                            </h3>

                            <div className="space-y-3">
                                {realTimeMetrics.topPerformingSteps.map((step, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{step.stepName}</p>
                                            <p className="text-xs text-gray-500">{step.visitors} visitantes</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                className={`${step.conversionRate > 20 ? 'bg-green-100 text-green-800' :
                                                    step.conversionRate > 15 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {step.conversionRate.toFixed(1)}%
                                            </Badge>
                                            {getTrendIcon(step.conversionRate)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Live Activity Feed */}
                    <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <MousePointer className="w-5 h-5 text-gray-600" />
                            Atividade em Tempo Real
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2" />
                        </h3>

                        <div className="space-y-3 max-h-48 overflow-y-auto">
                            {realTimeMetrics.liveActivity.map((activity, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 min-w-[60px]">
                                        <Clock className="w-3 h-3" />
                                        {activity.timestamp} atrás
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {getDeviceIcon(activity.device)}
                                        <span className="text-sm text-gray-600">{activity.device}</span>
                                    </div>

                                    <div className="flex-1">
                                        <span className="text-sm font-medium text-gray-900">{activity.action}</span>
                                        <span className="text-sm text-gray-600 ml-1">em {activity.step}</span>
                                    </div>

                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {activity.action}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}