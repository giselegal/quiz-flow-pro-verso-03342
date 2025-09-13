// @ts-nocheck
/**
 * 🔗 INTEGRAÇÃO COMPLETA - SISTEMA DE MÉTRICAS DO EDITOR
 * 
 * Exemplo completo demonstrando a integração do sistema de métricas
 * do editor com os serviços globais de observabilidade
 */

import * as React from 'react';
import { useState } from 'react';

// Editor components
import { FunnelEditor } from '../components/FunnelEditor';
import { EditorMetricsDashboard, EditorMetricsDashboardSimple } from '../components/EditorMetricsDashboard';
import { EditorMockProvider } from '../mocks/EditorMocks';
import { EditorMetricsProviderImpl } from '../providers/EditorMetricsProvider';

// Interfaces
import {
    EditorFunnelData,
    EditorMetricsConfig
} from '../interfaces/EditorInterfaces';

// ============================================================================
// CONFIGURAÇÕES DE INTEGRAÇÃO
// ============================================================================

// Configuração de métricas para produção
const productionMetricsConfig: EditorMetricsConfig = {
    enabled: true,
    collectPerformance: true,
    collectValidation: true,
    collectUsage: true,
    collectErrors: true,
    bufferSize: 1000,
    flushInterval: 30000, // 30s
    enableRealTimeAlerts: true,
    performanceThresholds: {
        loadTime: 2000,      // 2s
        saveTime: 1000,      // 1s
        validationTime: 500, // 500ms
        renderTime: 100      // 100ms
    },
    errorThresholds: {
        maxErrorRate: 0.05,      // 5%
        maxFallbackRate: 0.02    // 2%
    }
};

// Configuração de métricas para desenvolvimento
const developmentMetricsConfig: EditorMetricsConfig = {
    ...productionMetricsConfig,
    flushInterval: 10000, // 10s (mais frequente para debug)
    enableRealTimeAlerts: true,
    performanceThresholds: {
        loadTime: 3000,      // Mais tolerante em dev
        saveTime: 1500,
        validationTime: 1000,
        renderTime: 200
    }
};

// ============================================================================
// COMPONENTE DE INTEGRAÇÃO COMPLETA
// ============================================================================

interface EditorWithMetricsProps {
    mode?: 'development' | 'production';
    showDashboard?: boolean;
    funnelId?: string;
    initialData?: EditorFunnelData;
}

export const EditorWithMetricsIntegration: React.FC<EditorWithMetricsProps> = ({
    mode = 'development',
    showDashboard = true,
    funnelId,
    initialData
}) => {
    const [currentFunnelId, setCurrentFunnelId] = useState<string | undefined>(funnelId);

    // Configurar providers baseado no modo
    const config = mode === 'production' ? productionMetricsConfig : developmentMetricsConfig;

    // Para desenvolvimento, usar mocks; para produção, usar implementações reais
    const providers = mode === 'development'
        ? EditorMockProvider.createFullMockSetup()
        : {
            // Em produção, seria algo como:
            // dataProvider: new SupabaseEditorDataProvider(),
            // metricsProvider: new EditorMetricsProviderImpl(config),
            // Para este exemplo, vamos usar mocks mesmo em "produção"
            ...EditorMockProvider.createFullMockSetup(),
            metricsProvider: new EditorMetricsProviderImpl(config)
        };

    // Handlers para demonstrar integração
    const handleFunnelLoad = (funnel: EditorFunnelData) => {
        setCurrentFunnelId(funnel.id);
        console.log('🎯 Funnel loaded for metrics tracking:', funnel.id);

        // Aqui integraríamos com outros sistemas de observabilidade
        // Por exemplo: notificar analytics, logging, etc.
    };

    const handleError = (error: string) => {
        console.error('🚨 Editor error:', error);

        // Integração com sistemas de monitoramento de erro
        // Por exemplo: Sentry, Rollbar, etc.
    };

    const handleSave = (funnel: EditorFunnelData) => {
        console.log('💾 Funnel saved:', funnel.id, funnel.metadata.version);

        // Integração com analytics de uso
        // Por exemplo: track user behavior, conversion metrics, etc.
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Header de informação */}
            <div className="bg-blue-600 text-white p-4">
                <h1 className="text-xl font-bold">
                    🔬 Editor com Observabilidade Completa
                </h1>
                <p className="text-blue-100 text-sm">
                    Modo: {mode} • Dashboard: {showDashboard ? 'Ativo' : 'Inativo'} •
                    Métricas: {config.enabled ? 'Habilitadas' : 'Desabilitadas'}
                </p>
            </div>

            <div className="flex-1 flex">
                {/* Editor principal */}
                <div className={showDashboard ? 'flex-1' : 'w-full'}>
                    <FunnelEditor
                        funnelId={currentFunnelId}
                        initialData={initialData}
                        dataProvider={providers.dataProvider}
                        templateProvider={providers.templateProvider}
                        validator={providers.validator}
                        eventHandler={providers.eventHandler}
                        metricsProvider={providers.metricsProvider}
                        config={{
                            mode: 'edit',
                            features: {
                                canAddPages: true,
                                canRemovePages: true,
                                canReorderPages: true,
                                canEditBlocks: true,
                                canPreview: true,
                                canPublish: true,
                                canDuplicate: true,
                                canExport: true
                            },
                            autoSave: {
                                enabled: true,
                                interval: 30000,
                                onUserInput: false,
                                showIndicator: true
                            },
                            validation: {
                                realTime: true,
                                onSave: true,
                                showWarnings: true,
                                strictMode: false
                            },
                            ui: {
                                theme: 'light',
                                layout: 'sidebar',
                                showMinimap: false,
                                showGridlines: true,
                                showRulers: false
                            }
                        }}
                        onLoad={handleFunnelLoad}
                        onSave={handleSave}
                        onError={handleError}
                    />
                </div>

                {/* Dashboard de métricas */}
                {showDashboard && (
                    <div className="w-1/3 border-l border-gray-200 bg-white">
                        <EditorMetricsDashboard
                            metricsProvider={providers.metricsProvider!}
                            funnelId={currentFunnelId}
                            refreshInterval={config.flushInterval}
                            showRealTimeData={true}
                            showPerformanceChart={true}
                            showErrorAnalysis={true}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// COMPONENTE SIMPLIFICADO PARA TESTES
// ============================================================================

export const EditorMetricsDemo: React.FC = () => {
    const [showDashboard, setShowDashboard] = useState(true);
    const [mode, setMode] = useState<'development' | 'production'>('development');

    const mockProvider = EditorMockProvider.createMetricsTestSetup();

    return (
        <div className="p-8 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">🧪 Demo de Métricas do Editor</h2>

                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setMode(mode === 'development' ? 'production' : 'development')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Modo: {mode}
                    </button>

                    <button
                        onClick={() => setShowDashboard(!showDashboard)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Dashboard: {showDashboard ? 'ON' : 'OFF'}
                    </button>

                    <button
                        onClick={() => {
                            // Simular operações para gerar métricas
                            mockProvider.metricsProvider.simulateSlowOperation('load_funnel', 1800);
                            mockProvider.metricsProvider.simulateError('save_funnel', 'Validation failed');
                        }}
                        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                    >
                        🚀 Simular Métricas
                    </button>
                </div>

                {/* Dashboard simplificado */}
                <EditorMetricsDashboardSimple
                    metricsProvider={mockProvider.metricsProvider}
                />
            </div>

            {/* Exemplo de integração completa */}
            <div className="bg-gray-100 rounded-lg p-4">
                <EditorWithMetricsIntegration
                    mode={mode}
                    showDashboard={showDashboard}
                    initialData={mockProvider.dataProvider.getMockData()[0]}
                />
            </div>
        </div>
    );
};

// ============================================================================
// HOOK PERSONALIZADO PARA MÉTRICAS
// ============================================================================

export const useEditorMetrics = (config?: Partial<EditorMetricsConfig>) => {
    const [metricsProvider] = useState(() =>
        new EditorMetricsProviderImpl(config)
    );

    // Cleanup quando componente é desmontado
    React.useEffect(() => {
        return () => {
            if (metricsProvider && typeof (metricsProvider as any).dispose === 'function') {
                (metricsProvider as any).dispose();
            }
        };
    }, [metricsProvider]);

    return metricsProvider;
};

// ============================================================================
// UTILITÁRIOS DE CONFIGURAÇÃO
// ============================================================================

export class EditorMetricsIntegration {
    static createProductionSetup(customConfig?: Partial<EditorMetricsConfig>) {
        const config = { ...productionMetricsConfig, ...customConfig };
        return new EditorMetricsProviderImpl(config);
    }

    static createDevelopmentSetup(customConfig?: Partial<EditorMetricsConfig>) {
        const config = { ...developmentMetricsConfig, ...customConfig };
        return EditorMockProvider.createMetricsTestSetup();
    }

    static createTestingSetup() {
        return EditorMockProvider.createMetricsTestSetup();
    }

    static async exportAllMetrics(providers: any[], format: 'json' | 'csv' = 'json') {
        const allMetrics = await Promise.all(
            providers.map(provider => provider.exportMetrics(format))
        );

        if (format === 'json') {
            return JSON.stringify({
                exportedAt: new Date(),
                providers: allMetrics.map(JSON.parse)
            }, null, 2);
        }

        return allMetrics.join('\n\n');
    }

    static getRecommendedThresholds(environment: 'development' | 'staging' | 'production') {
        const baseThresholds = productionMetricsConfig.performanceThresholds;

        switch (environment) {
            case 'development':
                return {
                    loadTime: baseThresholds.loadTime * 2,
                    saveTime: baseThresholds.saveTime * 2,
                    validationTime: baseThresholds.validationTime * 2,
                    renderTime: baseThresholds.renderTime * 2
                };
            case 'staging':
                return {
                    loadTime: baseThresholds.loadTime * 1.5,
                    saveTime: baseThresholds.saveTime * 1.5,
                    validationTime: baseThresholds.validationTime * 1.5,
                    renderTime: baseThresholds.renderTime * 1.5
                };
            case 'production':
            default:
                return baseThresholds;
        }
    }
}

export default EditorWithMetricsIntegration;
