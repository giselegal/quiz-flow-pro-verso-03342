/**
 * 📊 DASHBOARD DE ANALYTICS CONSOLIDADO
 * Sistema unificado de visualização de métricas, experimentos e alertas
 * 
 * Cada funil possui configurações independentes e isolamento completo
 * de dados, métricas e experimentos A/B.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useFunnelAnalytics, useABTest } from '@/hooks/useAnalytics';
import { analyticsEngine, ABTestExperiment, PerformanceAlert } from '@/services/analyticsEngine';

// ============================================================================
// INTERFACES
// ============================================================================

interface AnalyticsDashboardProps {
    funnelId: string;
    userId: string;
    organizationId: string;
    workspaceId: string;
    // Configurações específicas do funil
    funnelConfig?: {
        name: string;
        category: string;
        allowExperiments: boolean;
        alertsEnabled: boolean;
        customMetrics: string[];
    };
}

interface MetricCard {
    title: string;
    value: string | number;
    change?: number;
    changeType?: 'positive' | 'negative' | 'neutral';
    description?: string;
    funnelSpecific: boolean;
}

interface FunnelConfiguration {
    id: string;
    name: string;
    category: string;
    settings: {
        tracking: {
            googleAnalytics: boolean;
            internalAnalytics: boolean;
            conversionGoals: string[];
        };
        experiments: {
            enabled: boolean;
            maxConcurrent: number;
            autoOptimization: boolean;
        };
        alerts: {
            enabled: boolean;
            thresholds: {
                conversionDrop: number;
                highDropoff: number;
                errorSpike: number;
            };
            notifications: string[];
        };
        privacy: {
            dataRetention: number; // days
            anonymizeIPs: boolean;
            cookieConsent: boolean;
        };
    };
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
    funnelId,
    userId,
    organizationId,
    workspaceId,
    funnelConfig
}) => {
    // ============================================================================
    // HOOKS E ESTADOS
    // ============================================================================

    const analytics = useFunnelAnalytics(funnelId, userId);
    const abTest = useABTest('conversion-test-1', userId);

    const [activeTab, setActiveTab] = useState<'overview' | 'experiments' | 'alerts' | 'config'>('overview');
    const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
    const [experiments, setExperiments] = useState<ABTestExperiment[]>([]);
    const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
    const [funnelSettings, setFunnelSettings] = useState<FunnelConfiguration>({
        id: funnelId,
        name: funnelConfig?.name || `Funil ${funnelId}`,
        category: funnelConfig?.category || 'general',
        settings: {
            tracking: {
                googleAnalytics: true,
                internalAnalytics: true,
                conversionGoals: ['quiz_completed', 'form_submitted']
            },
            experiments: {
                enabled: funnelConfig?.allowExperiments ?? true,
                maxConcurrent: 3,
                autoOptimization: false
            },
            alerts: {
                enabled: funnelConfig?.alertsEnabled ?? true,
                thresholds: {
                    conversionDrop: -20,
                    highDropoff: 50,
                    errorSpike: 10
                },
                notifications: [`${userId}@email.com`]
            },
            privacy: {
                dataRetention: 365,
                anonymizeIPs: true,
                cookieConsent: true
            }
        }
    });

    // ============================================================================
    // MÉTRICAS ESPECÍFICAS DO FUNIL
    // ============================================================================

    const metricCards: MetricCard[] = useMemo(() => {
        if (!analytics.funnelMetrics) return [];

        const metrics = analytics.funnelMetrics;
        return [
            {
                title: 'Taxa de Conversão',
                value: `${metrics.conversionRate.toFixed(1)}%`,
                change: 2.3,
                changeType: 'positive',
                description: `vs período anterior • Funil: ${funnelSettings.name}`,
                funnelSpecific: true
            },
            {
                title: 'Sessões Únicas',
                value: metrics.totalSessions.toLocaleString(),
                change: -5.1,
                changeType: 'negative',
                description: `últimos ${timeRange} • Isolado por funil`,
                funnelSpecific: true
            },
            {
                title: 'Usuários Únicos',
                value: metrics.uniqueUsers.toLocaleString(),
                change: 8.2,
                changeType: 'positive',
                description: `crescimento • Dados específicos do funil`,
                funnelSpecific: true
            },
            {
                title: 'Tempo Médio',
                value: `${Math.floor(metrics.averageTimeToComplete / 60)}:${(metrics.averageTimeToComplete % 60).toString().padStart(2, '0')}`,
                change: 0,
                changeType: 'neutral',
                description: `para completar • Configuração: ${funnelSettings.category}`,
                funnelSpecific: true
            },
            {
                title: 'Taxa de Abandono',
                value: `${metrics.dropoffRate.toFixed(1)}%`,
                change: -3.2,
                changeType: 'positive',
                description: `redução no período • Alertas: ${funnelSettings.settings.alerts.enabled ? 'ON' : 'OFF'}`,
                funnelSpecific: true
            },
            {
                title: 'Distribuição de Dispositivos',
                value: `${Math.round((metrics.deviceBreakdown.desktop / (metrics.deviceBreakdown.desktop + metrics.deviceBreakdown.mobile)) * 100)}% Desktop`,
                description: `${Math.round((metrics.deviceBreakdown.mobile / (metrics.deviceBreakdown.desktop + metrics.deviceBreakdown.mobile)) * 100)}% Mobile • Analytics: ${funnelSettings.settings.tracking.googleAnalytics ? 'GA4+Interno' : 'Interno'}`,
                funnelSpecific: true
            }
        ];
    }, [analytics.funnelMetrics, timeRange, funnelSettings]);

    // ============================================================================
    // EFFECTS
    // ============================================================================

    useEffect(() => {
        // Simular dados de experimentos e alertas
        setExperiments([
            {
                id: 'conversion-test-1',
                name: 'Teste CTA Principal',
                description: 'Comparação entre botão "Começar Agora" vs "Iniciar Teste"',
                funnelId,
                status: 'running',
                variants: [
                    { id: 'control', name: 'Controle', description: 'Botão original', weight: 50, changes: [], isControl: true },
                    { id: 'variant-a', name: 'Variante A', description: 'Novo texto', weight: 50, changes: [], isControl: false }
                ],
                trafficSplit: 100,
                startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                hypothesis: 'Mudança no texto do CTA aumentará conversão em 15%',
                successMetric: { type: 'conversion', name: 'Taxa de Conversão', description: 'Conversões/Sessões' },
                createdBy: userId,
                organizationId
            }
        ]);

        setAlerts([
            {
                id: 'alert-1',
                type: 'conversion_drop',
                severity: 'medium',
                title: 'Queda na Conversão Detectada',
                description: 'Conversão caiu 8% nas últimas 4 horas',
                funnelId,
                threshold: -10,
                currentValue: -8,
                triggeredAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
                resolved: false
            },
            {
                id: 'alert-2',
                type: 'high_dropoff',
                severity: 'high',
                title: 'Alta Taxa de Abandono - Step 3',
                description: 'Step 3 apresenta 65% de abandono',
                funnelId,
                stepId: 'step-3',
                threshold: 50,
                currentValue: 65,
                triggeredAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
                resolved: false
            }
        ]);
    }, [funnelId, userId, organizationId]);

    // ============================================================================
    // HANDLERS
    // ============================================================================

    const handleTimeRangeChange = (newRange: typeof timeRange) => {
        setTimeRange(newRange);
        analytics.refreshMetrics();
    };

    const handleStartExperiment = (experimentId: string) => {
        console.log(`Iniciando experimento: ${experimentId}`);
        // Em produção: analyticsEngine.startExperiment(experimentId);
    };

    const handleResolveAlert = (alertId: string) => {
        setAlerts(alerts.map(alert =>
            alert.id === alertId ? { ...alert, resolved: true, resolvedAt: new Date() } : alert
        ));
    };

    const handleTrackDemo = () => {
        analytics.trackEvent('demo_interaction', {
            action: 'dashboard_demo_clicked',
            timestamp: new Date().toISOString(),
            funnelId,
            organizationId,
            workspaceId
        });
    };

    const handleUpdateSettings = (newSettings: Partial<FunnelConfiguration['settings']>) => {
        setFunnelSettings(prev => ({
            ...prev,
            settings: { ...prev.settings, ...newSettings }
        }));

        // Track configuration changes
        analytics.trackEvent('funnel_config_updated', {
            funnelId,
            changes: Object.keys(newSettings),
            timestamp: new Date().toISOString()
        });

        // In production: save to backend
        console.log(`Configurações atualizadas para funil ${funnelId}:`, newSettings);
    };

    const handleTestAnalytics = () => {
        // Test both Google Analytics and internal tracking
        if (funnelSettings.settings.tracking.googleAnalytics) {
            analyticsEngine.trackGoogleAnalyticsEvent('dashboard_test', {
                funnel_id: funnelId,
                user_id: userId,
                test_type: 'manual_dashboard_test'
            });
        }

        if (funnelSettings.settings.tracking.internalAnalytics) {
            analytics.trackEvent('dashboard_test_internal', {
                source: 'manual_test',
                funnelName: funnelSettings.name,
                category: funnelSettings.category
            });
        }
    };

    // ============================================================================
    // RENDER FUNCTIONS
    // ============================================================================

    const renderMetricCard = (metric: MetricCard, index: number) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                {metric.change !== undefined && (
                    <span className={`text-sm font-medium px-2 py-1 rounded ${metric.changeType === 'positive' ? 'text-green-700 bg-green-100' :
                        metric.changeType === 'negative' ? 'text-red-700 bg-red-100' :
                            'text-gray-700 bg-gray-100'
                        }`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                )}
            </div>
            {metric.description && (
                <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
            )}
        </div>
    );

    const renderConfigTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                    Configurações do Funil: {funnelSettings.name}
                </h2>
                <div className="text-sm text-gray-600">
                    ID: {funnelId} • Categoria: {funnelSettings.category}
                </div>
            </div>

            {/* Informações Básicas */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">📋 Informações Básicas</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Funil</label>
                        <input
                            type="text"
                            value={funnelSettings.name}
                            onChange={(e) => setFunnelSettings(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                        <select
                            value={funnelSettings.category}
                            onChange={(e) => setFunnelSettings(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                            <option value="general">Geral</option>
                            <option value="education">Educação</option>
                            <option value="health">Saúde</option>
                            <option value="business">Negócios</option>
                            <option value="lifestyle">Estilo de Vida</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Configurações de Tracking */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">📊 Configurações de Tracking</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium">Google Analytics 4</h4>
                            <p className="text-sm text-gray-600">Integração com GA4 para tracking externo</p>
                        </div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={funnelSettings.settings.tracking.googleAnalytics}
                                onChange={(e) => handleUpdateSettings({
                                    tracking: { ...funnelSettings.settings.tracking, googleAnalytics: e.target.checked }
                                })}
                                className="mr-2"
                            />
                            <span className={`px-2 py-1 rounded text-xs font-medium ${funnelSettings.settings.tracking.googleAnalytics
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                                }`}>
                                {funnelSettings.settings.tracking.googleAnalytics ? 'ATIVO' : 'INATIVO'}
                            </span>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium">Analytics Interno</h4>
                            <p className="text-sm text-gray-600">Sistema interno avançado com A/B testing</p>
                        </div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={funnelSettings.settings.tracking.internalAnalytics}
                                onChange={(e) => handleUpdateSettings({
                                    tracking: { ...funnelSettings.settings.tracking, internalAnalytics: e.target.checked }
                                })}
                                className="mr-2"
                            />
                            <span className={`px-2 py-1 rounded text-xs font-medium ${funnelSettings.settings.tracking.internalAnalytics
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                                }`}>
                                {funnelSettings.settings.tracking.internalAnalytics ? 'ATIVO' : 'INATIVO'}
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Configurações de Experimentos */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">🧪 Experimentos A/B</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium">Experimentos Habilitados</h4>
                            <p className="text-sm text-gray-600">Permite criar e executar testes A/B</p>
                        </div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={funnelSettings.settings.experiments.enabled}
                                onChange={(e) => handleUpdateSettings({
                                    experiments: { ...funnelSettings.settings.experiments, enabled: e.target.checked }
                                })}
                                className="mr-2"
                            />
                            <span className={`px-2 py-1 rounded text-xs font-medium ${funnelSettings.settings.experiments.enabled
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-700'
                                }`}>
                                {funnelSettings.settings.experiments.enabled ? 'ATIVO' : 'INATIVO'}
                            </span>
                        </label>
                    </div>

                    {funnelSettings.settings.experiments.enabled && (
                        <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-slate-200">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Experimentos Simultâneos
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={funnelSettings.settings.experiments.maxConcurrent}
                                    onChange={(e) => handleUpdateSettings({
                                        experiments: { ...funnelSettings.settings.experiments, maxConcurrent: parseInt(e.target.value) }
                                    })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={funnelSettings.settings.experiments.autoOptimization}
                                        onChange={(e) => handleUpdateSettings({
                                            experiments: { ...funnelSettings.settings.experiments, autoOptimization: e.target.checked }
                                        })}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Auto-otimização</span>
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Configurações de Alertas */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">🚨 Sistema de Alertas</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium">Alertas Ativos</h4>
                            <p className="text-sm text-gray-600">Monitoramento proativo de performance</p>
                        </div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={funnelSettings.settings.alerts.enabled}
                                onChange={(e) => handleUpdateSettings({
                                    alerts: { ...funnelSettings.settings.alerts, enabled: e.target.checked }
                                })}
                                className="mr-2"
                            />
                            <span className={`px-2 py-1 rounded text-xs font-medium ${funnelSettings.settings.alerts.enabled
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                                }`}>
                                {funnelSettings.settings.alerts.enabled ? 'ATIVO' : 'INATIVO'}
                            </span>
                        </label>
                    </div>

                    {funnelSettings.settings.alerts.enabled && (
                        <div className="grid grid-cols-3 gap-4 pl-4 border-l-2 border-red-200">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Queda Conversão (%)
                                </label>
                                <input
                                    type="number"
                                    min="-100"
                                    max="0"
                                    value={funnelSettings.settings.alerts.thresholds.conversionDrop}
                                    onChange={(e) => handleUpdateSettings({
                                        alerts: {
                                            ...funnelSettings.settings.alerts,
                                            thresholds: {
                                                ...funnelSettings.settings.alerts.thresholds,
                                                conversionDrop: parseInt(e.target.value)
                                            }
                                        }
                                    })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Alto Abandono (%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={funnelSettings.settings.alerts.thresholds.highDropoff}
                                    onChange={(e) => handleUpdateSettings({
                                        alerts: {
                                            ...funnelSettings.settings.alerts,
                                            thresholds: {
                                                ...funnelSettings.settings.alerts.thresholds,
                                                highDropoff: parseInt(e.target.value)
                                            }
                                        }
                                    })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Spike de Erros
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={funnelSettings.settings.alerts.thresholds.errorSpike}
                                    onChange={(e) => handleUpdateSettings({
                                        alerts: {
                                            ...funnelSettings.settings.alerts,
                                            thresholds: {
                                                ...funnelSettings.settings.alerts.thresholds,
                                                errorSpike: parseInt(e.target.value)
                                            }
                                        }
                                    })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Ações de Teste */}
            <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <h4 className="font-medium text-blue-900">Testar Configurações</h4>
                        <p className="text-blue-700 text-sm">Validar tracking e alertas do funil</p>
                    </div>
                    <div className="space-x-2">
                        <button
                            onClick={handleTestAnalytics}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Testar Analytics
                        </button>
                        <button
                            onClick={() => handleUpdateSettings(funnelSettings.settings)}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                        >
                            Salvar Configurações
                        </button>
                    </div>
                </div>
            </div>

            {/* Status de Isolamento */}
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
                <h4 className="font-medium text-gray-900 mb-2">🔒 Isolamento de Dados</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                        <strong>Organização:</strong> {organizationId}<br />
                        <strong>Workspace:</strong> {workspaceId}<br />
                        <strong>Funil ID:</strong> {funnelId}
                    </div>
                    <div>
                        <strong>Dados Isolados:</strong> ✅ Sim<br />
                        <strong>Configurações Independentes:</strong> ✅ Sim<br />
                        <strong>Experimentos Separados:</strong> ✅ Sim
                    </div>
                </div>
            </div>
        </div>
    );

    const renderOverviewTab = () => (
        <div className="space-y-6">
            {/* Time Range Selector */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Visão Geral</h2>
                <div className="flex space-x-2">
                    {(['24h', '7d', '30d', '90d'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => handleTimeRangeChange(range)}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${timeRange === range
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {metricCards.map(renderMetricCard)}
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Conversões por Dia</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                        <p className="text-gray-500">📈 Gráfico de linha - Conversões diárias</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Funil de Conversão</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                        <p className="text-gray-500">🔄 Funil - Etapas do processo</p>
                    </div>
                </div>
            </div>

            {/* Demo Action */}
            <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <h4 className="font-medium text-blue-900">Sistema Analytics Ativo</h4>
                        <p className="text-blue-700 text-sm">Clique para testar o tracking de eventos</p>
                    </div>
                    <button
                        onClick={handleTrackDemo}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Testar Tracking
                    </button>
                </div>
            </div>
        </div>
    );

    const renderExperimentsTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Experimentos A/B</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Novo Experimento
                </button>
            </div>

            <div className="space-y-4">
                {experiments.map((experiment) => (
                    <div key={experiment.id} className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">{experiment.name}</h3>
                                <p className="text-gray-600">{experiment.description}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-sm font-medium ${experiment.status === 'running' ? 'bg-green-100 text-green-700' :
                                experiment.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                {experiment.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {experiment.variants.map((variant) => (
                                <div key={variant.id} className={`p-4 rounded border-2 ${abTest.variant === variant.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                    }`}>
                                    <h4 className="font-medium">
                                        {variant.name} {variant.isControl && '(Controle)'}
                                    </h4>
                                    <p className="text-sm text-gray-600">{variant.description}</p>
                                    <p className="text-xs text-gray-500 mt-2">Tráfego: {variant.weight}%</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>Hipótese: {experiment.hypothesis}</span>
                            {experiment.status === 'draft' && (
                                <button
                                    onClick={() => handleStartExperiment(experiment.id)}
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    Iniciar Experimento
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderAlertsTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Alertas de Performance</h2>
                <div className="text-sm text-gray-600">
                    {alerts.filter(a => !a.resolved).length} alertas ativos
                </div>
            </div>

            <div className="space-y-4">
                {alerts.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${alert.resolved ? 'bg-gray-50 border-gray-400' :
                        alert.severity === 'critical' ? 'bg-red-50 border-red-400' :
                            alert.severity === 'high' ? 'bg-orange-50 border-orange-400' :
                                'bg-yellow-50 border-yellow-400'
                        }`}>
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <h3 className="font-semibold">{alert.title}</h3>
                                    <span className={`text-xs px-2 py-1 rounded ${alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                        alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {alert.severity}
                                    </span>
                                    {alert.resolved && (
                                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                                            Resolvido
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600 mt-1">{alert.description}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                    {new Date(alert.triggeredAt).toLocaleString()}
                                    {alert.stepId && ` • Step: ${alert.stepId}`}
                                </p>
                            </div>
                            {!alert.resolved && (
                                <button
                                    onClick={() => handleResolveAlert(alert.id)}
                                    className="ml-4 text-blue-600 hover:text-blue-700 text-sm"
                                >
                                    Resolver
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // ============================================================================
    // RENDER PRINCIPAL
    // ============================================================================

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    📊 Analytics Dashboard
                </h1>
                <p className="text-gray-600">
                    Funil: {funnelId} • Sistema de monitoramento avançado em tempo real
                </p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {[
                            { key: 'overview', label: 'Visão Geral', icon: '📈' },
                            { key: 'experiments', label: 'Experimentos A/B', icon: '🧪' },
                            { key: 'alerts', label: 'Alertas', icon: '🚨' },
                            { key: 'config', label: 'Configurações', icon: '⚙️' }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as any)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.key
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'overview' && renderOverviewTab()}
                {activeTab === 'experiments' && renderExperimentsTab()}
                {activeTab === 'alerts' && renderAlertsTab()}
                {activeTab === 'config' && renderConfigTab()}
            </div>

            {/* Loading State */}
            {analytics.isLoadingMetrics && (
                <div className="fixed top-4 right-4 bg-blue-100 border border-blue-200 text-blue-700 px-4 py-2 rounded-md">
                    🔄 Atualizando métricas...
                </div>
            )}
        </div>
    );
};

export default AnalyticsDashboard;