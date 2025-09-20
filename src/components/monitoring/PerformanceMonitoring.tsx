import { useState, useEffect } from 'react';
import {
    X,
    Activity,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    TrendingDown,
    Zap,
    Users,
    Target,
    Cpu,
    RefreshCw,
    Settings,
    Bell,
    Shield,
    BarChart3,
    Gauge,
    Server
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Switch } from '../ui/switch';

interface PerformanceMonitoringProps {
    onClose: () => void;
}

interface PerformanceMetric {
    id: string;
    name: string;
    value: number;
    unit: string;
    threshold: number;
    status: 'excellent' | 'good' | 'warning' | 'critical';
    trend: 'up' | 'down' | 'stable';
    change: number;
    description: string;
    category: 'speed' | 'efficiency' | 'reliability' | 'user-experience';
}

interface PerformanceAlert {
    id: string;
    type: 'warning' | 'error' | 'info' | 'success';
    title: string;
    message: string;
    timestamp: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    resolved: boolean;
    actions: Array<{
        label: string;
        action: string;
    }>;
}

interface OptimizationRecommendation {
    id: string;
    title: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
    effort: 'easy' | 'medium' | 'hard';
    category: 'performance' | 'security' | 'ux' | 'seo';
    expectedGain: string;
    priority: number;
    automated: boolean;
}

export function PerformanceMonitoring({ onClose }: PerformanceMonitoringProps) {
    const { trackEvent } = useAnalytics();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'alerts' | 'optimizations' | 'settings'>('dashboard');
    const [realTimeMonitoring, setRealTimeMonitoring] = useState(true);
    const [autoOptimization, setAutoOptimization] = useState(false);
    const [alertsEnabled, setAlertsEnabled] = useState(true);

    const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([
        {
            id: 'loading-time',
            name: 'Tempo de Carregamento',
            value: 1.2,
            unit: 's',
            threshold: 2.0,
            status: 'excellent',
            trend: 'down',
            change: -15.3,
            description: 'Tempo médio de carregamento da página inicial',
            category: 'speed'
        },
        {
            id: 'bundle-size',
            name: 'Tamanho do Bundle',
            value: 284,
            unit: 'KB',
            threshold: 500,
            status: 'good',
            trend: 'stable',
            change: 2.1,
            description: 'Tamanho total dos arquivos JavaScript',
            category: 'efficiency'
        },
        {
            id: 'memory-usage',
            name: 'Uso de Memória',
            value: 45,
            unit: 'MB',
            threshold: 100,
            status: 'excellent',
            trend: 'up',
            change: 8.7,
            description: 'Consumo de memória durante a execução',
            category: 'efficiency'
        },
        {
            id: 'error-rate',
            name: 'Taxa de Erro',
            value: 0.3,
            unit: '%',
            threshold: 1.0,
            status: 'excellent',
            trend: 'down',
            change: -42.1,
            description: 'Percentual de erros JavaScript',
            category: 'reliability'
        },
        {
            id: 'bounce-rate',
            name: 'Taxa de Rejeição',
            value: 12.4,
            unit: '%',
            threshold: 25.0,
            status: 'good',
            trend: 'down',
            change: -18.6,
            description: 'Usuários que saem sem interagir',
            category: 'user-experience'
        },
        {
            id: 'api-response',
            name: 'Resposta da API',
            value: 89,
            unit: 'ms',
            threshold: 200,
            status: 'excellent',
            trend: 'stable',
            change: -1.2,
            description: 'Tempo médio de resposta das APIs',
            category: 'speed'
        }
    ]);

    const [alerts, setAlerts] = useState<PerformanceAlert[]>([
        {
            id: '1',
            type: 'warning',
            title: 'Uso de Memória Elevado',
            message: 'O consumo de memória aumentou 15% nas últimas 2 horas. Considere otimizar componentes pesados.',
            timestamp: '5 min atrás',
            severity: 'medium',
            resolved: false,
            actions: [
                { label: 'Analisar Componentes', action: 'analyze' },
                { label: 'Otimizar Automaticamente', action: 'auto-optimize' }
            ]
        },
        {
            id: '2',
            type: 'success',
            title: 'Otimização Aplicada',
            message: 'Bundle size reduzido em 23% através da otimização automática de imagens.',
            timestamp: '1 hora atrás',
            severity: 'low',
            resolved: true,
            actions: []
        },
        {
            id: '3',
            type: 'info',
            title: 'Nova Recomendação',
            message: 'Detectamos oportunidade de lazy loading que pode melhorar o desempenho em 18%.',
            timestamp: '2 horas atrás',
            severity: 'low',
            resolved: false,
            actions: [
                { label: 'Ver Detalhes', action: 'details' },
                { label: 'Aplicar Recomendação', action: 'apply' }
            ]
        }
    ]);

    const [optimizations, setOptimizations] = useState<OptimizationRecommendation[]>([
        {
            id: 'opt-1',
            title: 'Implementar Lazy Loading',
            description: 'Carregamento sob demanda de componentes não-críticos pode reduzir tempo inicial em 18%',
            impact: 'high',
            effort: 'medium',
            category: 'performance',
            expectedGain: '18% melhoria no carregamento',
            priority: 1,
            automated: true
        },
        {
            id: 'opt-2',
            title: 'Otimizar Imagens',
            description: 'Compressão e formato WebP podem reduzir transferência de dados em 45%',
            impact: 'high',
            effort: 'easy',
            category: 'performance',
            expectedGain: '45% redução no tráfego',
            priority: 2,
            automated: true
        },
        {
            id: 'opt-3',
            title: 'Cache Strategy',
            description: 'Implementar estratégia de cache agressiva para recursos estáticos',
            impact: 'medium',
            effort: 'medium',
            category: 'performance',
            expectedGain: '25% menos requisições',
            priority: 3,
            automated: false
        },
        {
            id: 'opt-4',
            title: 'Security Headers',
            description: 'Adicionar headers de segurança para melhorar score de SEO e confiança',
            impact: 'medium',
            effort: 'easy',
            category: 'security',
            expectedGain: 'Score SEO +15 pontos',
            priority: 4,
            automated: true
        }
    ]);

    // Simulação de atualizações em tempo real
    useEffect(() => {
        if (!realTimeMonitoring) return;

        const interval = setInterval(() => {
            setPerformanceMetrics(prev => prev.map(metric => ({
                ...metric,
                value: metric.value + (Math.random() - 0.5) * 0.1,
                change: metric.change + (Math.random() - 0.5) * 2
            })));
        }, 3000);

        return () => clearInterval(interval);
    }, [realTimeMonitoring]);

    const getStatusColor = (status: string) => {
        const colors = {
            excellent: 'text-green-600 bg-green-50',
            good: 'text-blue-600 bg-blue-50',
            warning: 'text-yellow-600 bg-yellow-50',
            critical: 'text-red-600 bg-red-50'
        };
        return colors[status as keyof typeof colors] || colors.good;
    };

    const getStatusIcon = (status: string) => {
        const icons = {
            excellent: <CheckCircle className="w-4 h-4" />,
            good: <CheckCircle className="w-4 h-4" />,
            warning: <AlertTriangle className="w-4 h-4" />,
            critical: <AlertTriangle className="w-4 h-4" />
        };
        return icons[status as keyof typeof icons] || icons.good;
    };

    const getTrendIcon = (trend: string, change: number) => {
        if (trend === 'up') {
            return change > 0 ?
                <TrendingUp className="w-4 h-4 text-green-600" /> :
                <TrendingUp className="w-4 h-4 text-red-600" />;
        }
        if (trend === 'down') {
            return change < 0 ?
                <TrendingDown className="w-4 h-4 text-green-600" /> :
                <TrendingDown className="w-4 h-4 text-red-600" />;
        }
        return <Activity className="w-4 h-4 text-gray-600" />;
    };

    const getCategoryIcon = (category: string) => {
        const icons = {
            speed: <Zap className="w-4 h-4" />,
            efficiency: <Gauge className="w-4 h-4" />,
            reliability: <Shield className="w-4 h-4" />,
            'user-experience': <Users className="w-4 h-4" />,
            performance: <Activity className="w-4 h-4" />,
            security: <Shield className="w-4 h-4" />,
            ux: <Users className="w-4 h-4" />,
            seo: <Target className="w-4 h-4" />
        };
        return icons[category as keyof typeof icons] || icons.performance;
    };

    const getAlertIcon = (type: string) => {
        const icons = {
            warning: <AlertTriangle className="w-4 h-4 text-yellow-600" />,
            error: <AlertTriangle className="w-4 h-4 text-red-600" />,
            info: <Bell className="w-4 h-4 text-blue-600" />,
            success: <CheckCircle className="w-4 h-4 text-green-600" />
        };
        return icons[type as keyof typeof icons] || icons.info;
    };

    const handleOptimizationApply = (optimizationId: string) => {
        trackEvent('optimization_applied', { optimizationId });

        // Simular aplicação da otimização
        setOptimizations(prev => prev.filter(opt => opt.id !== optimizationId));

        // Adicionar alerta de sucesso
        const newAlert: PerformanceAlert = {
            id: Date.now().toString(),
            type: 'success',
            title: 'Otimização Aplicada',
            message: 'Otimização aplicada com sucesso. Os resultados serão visíveis em alguns minutos.',
            timestamp: 'Agora',
            severity: 'low',
            resolved: true,
            actions: []
        };

        setAlerts(prev => [newAlert, ...prev]);
    };

    return (
        <div className="fixed inset-0 z-[160] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-full max-w-7xl mx-4 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-orange-50 via-red-50 to-pink-50">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-lg">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                Performance Monitoring
                                <div className="flex items-center gap-1">
                                    <div className={`w-2 h-2 rounded-full ${realTimeMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                                    <span className={`text-xs font-medium ${realTimeMonitoring ? 'text-green-600' : 'text-gray-500'}`}>
                                        {realTimeMonitoring ? 'REAL-TIME' : 'PAUSADO'}
                                    </span>
                                </div>
                            </h2>
                            <p className="text-sm text-gray-600">
                                Monitoramento inteligente com otimizações automáticas
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setRealTimeMonitoring(!realTimeMonitoring);
                                trackEvent('monitoring_toggled', { enabled: !realTimeMonitoring });
                            }}
                            className="flex items-center gap-2"
                        >
                            {realTimeMonitoring ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <Activity className="w-4 h-4" />
                            )}
                            {realTimeMonitoring ? 'Pausar' : 'Iniciar'}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Fechar
                        </Button>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="bg-gradient-to-r from-orange-100 to-red-100 px-6 py-3 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-medium text-orange-900">
                                    Sistema: Excelente Performance
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Server className="w-4 h-4 text-red-600" />
                                <span className="text-sm text-gray-700">
                                    {alerts.filter(a => !a.resolved).length} alertas ativos
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-700">Auto-Otimização:</span>
                                <Switch
                                    checked={autoOptimization}
                                    onCheckedChange={setAutoOptimization}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-700">Alertas:</span>
                                <Switch
                                    checked={alertsEnabled}
                                    onCheckedChange={setAlertsEnabled}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b">
                    <div className="flex">
                        {[
                            { key: 'dashboard', label: 'Dashboard', icon: BarChart3, count: performanceMetrics.length },
                            { key: 'alerts', label: 'Alertas', icon: Bell, count: alerts.filter(a => !a.resolved).length },
                            { key: 'optimizations', label: 'Otimizações', icon: Zap, count: optimizations.length },
                            { key: 'settings', label: 'Configurações', icon: Settings, count: 0 }
                        ].map(({ key, label, icon: Icon, count }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key as any)}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === key
                                        ? 'border-orange-500 text-orange-600 bg-orange-50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                                {count > 0 && (
                                    <Badge className={`text-xs ml-1 ${key === 'alerts' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                                        }`}>
                                        {count}
                                    </Badge>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {performanceMetrics.map((metric) => (
                                    <div key={metric.id} className={`p-6 rounded-xl border-2 ${getStatusColor(metric.status)}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                {getCategoryIcon(metric.category)}
                                                <h4 className="font-semibold text-gray-900">{metric.name}</h4>
                                            </div>
                                            {getStatusIcon(metric.status)}
                                        </div>

                                        <div className="flex items-end justify-between mb-2">
                                            <div>
                                                <span className="text-3xl font-bold text-gray-900">
                                                    {metric.value.toFixed(metric.unit === 's' ? 1 : 0)}
                                                </span>
                                                <span className="text-lg text-gray-600 ml-1">{metric.unit}</span>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                {getTrendIcon(metric.trend, metric.change)}
                                                <span className={`text-sm font-medium ${(metric.change > 0 && (metric.category === 'speed' || metric.category === 'efficiency')) ||
                                                        (metric.change < 0 && (metric.category === 'reliability' || metric.category === 'user-experience'))
                                                        ? 'text-red-600' : 'text-green-600'
                                                    }`}>
                                                    {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600">{metric.description}</p>

                                        <div className="mt-3">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>Atual</span>
                                                <span>Limite: {metric.threshold}{metric.unit}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-500 ${metric.value / metric.threshold > 0.8 ? 'bg-red-500' :
                                                            metric.value / metric.threshold > 0.6 ? 'bg-yellow-500' :
                                                                'bg-green-500'
                                                        }`}
                                                    style={{
                                                        width: `${Math.min((metric.value / metric.threshold) * 100, 100)}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'alerts' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Alertas do Sistema</h3>
                                <Badge className="bg-red-100 text-red-800">
                                    {alerts.filter(a => !a.resolved).length} Não Resolvidos
                                </Badge>
                            </div>

                            <div className="space-y-4">
                                {alerts.map((alert) => (
                                    <div key={alert.id} className={`p-6 rounded-xl border ${alert.resolved ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300 shadow-sm'
                                        }`}>
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-start gap-3">
                                                {getAlertIcon(alert.type)}
                                                <div>
                                                    <h4 className={`font-semibold ${alert.resolved ? 'text-gray-600' : 'text-gray-900'}`}>
                                                        {alert.title}
                                                    </h4>
                                                    <p className={`text-sm ${alert.resolved ? 'text-gray-500' : 'text-gray-600'} mt-1`}>
                                                        {alert.message}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Badge className={
                                                    alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                                                        alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                                                            alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-blue-100 text-blue-800'
                                                }>
                                                    {alert.severity}
                                                </Badge>
                                                {alert.resolved && (
                                                    <Badge className="bg-green-100 text-green-800">
                                                        Resolvido
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">{alert.timestamp}</span>

                                            {alert.actions.length > 0 && !alert.resolved && (
                                                <div className="flex items-center gap-2">
                                                    {alert.actions.map((action, idx) => (
                                                        <Button
                                                            key={idx}
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-xs"
                                                            onClick={() => trackEvent('alert_action', { alertId: alert.id, action: action.action })}
                                                        >
                                                            {action.label}
                                                        </Button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'optimizations' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Recomendações de Otimização</h3>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-green-100 text-green-800">
                                        {optimizations.filter(o => o.automated).length} Automáticas
                                    </Badge>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            optimizations.filter(o => o.automated).forEach(o => handleOptimizationApply(o.id));
                                        }}
                                        disabled={optimizations.filter(o => o.automated).length === 0}
                                    >
                                        Aplicar Todas Automáticas
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {optimizations.sort((a, b) => a.priority - b.priority).map((optimization) => (
                                    <div key={optimization.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-start gap-3">
                                                {getCategoryIcon(optimization.category)}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="font-semibold text-gray-900">{optimization.title}</h4>
                                                        <Badge className={`text-xs ${optimization.impact === 'high' ? 'bg-green-100 text-green-800' :
                                                                optimization.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {optimization.impact} impacto
                                                        </Badge>
                                                        <Badge className={`text-xs ${optimization.effort === 'easy' ? 'bg-green-100 text-green-800' :
                                                                optimization.effort === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-red-100 text-red-800'
                                                            }`}>
                                                            {optimization.effort}
                                                        </Badge>
                                                        {optimization.automated && (
                                                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                                                                Automática
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-2">{optimization.description}</p>
                                                    <p className="text-sm font-medium text-green-700">{optimization.expectedGain}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    Prioridade #{optimization.priority}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {optimization.category}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs"
                                                >
                                                    Ver Detalhes
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs"
                                                    onClick={() => handleOptimizationApply(optimization.id)}
                                                >
                                                    {optimization.automated ? 'Aplicar Auto' : 'Aplicar Manual'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="max-w-2xl mx-auto space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900">Configurações de Monitoramento</h3>

                            <div className="space-y-6">
                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Monitoramento em Tempo Real</h4>
                                            <p className="text-sm text-gray-600">Atualização contínua das métricas</p>
                                        </div>
                                        <Switch
                                            checked={realTimeMonitoring}
                                            onCheckedChange={setRealTimeMonitoring}
                                        />
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Otimização Automática</h4>
                                            <p className="text-sm text-gray-600">Aplicar otimizações sem intervenção manual</p>
                                        </div>
                                        <Switch
                                            checked={autoOptimization}
                                            onCheckedChange={setAutoOptimization}
                                        />
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Alertas do Sistema</h4>
                                            <p className="text-sm text-gray-600">Notificações sobre problemas de performance</p>
                                        </div>
                                        <Switch
                                            checked={alertsEnabled}
                                            onCheckedChange={setAlertsEnabled}
                                        />
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <h4 className="font-medium text-gray-900 mb-4">Status do Sistema</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">CPU:</p>
                                            <p className="font-semibold text-green-600">12% - Normal</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Memória:</p>
                                            <p className="font-semibold text-green-600">45MB - Otimizada</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Rede:</p>
                                            <p className="font-semibold text-green-600">284KB/s - Excelente</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Storage:</p>
                                            <p className="font-semibold text-green-600">2.1MB - Comprimido</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PerformanceMonitoring;