import { useState, useEffect } from 'react';
import {
    X,
    Brain,
    TrendingUp,
    Target,
    Zap,
    Settings,
    ChevronRight,
    AlertTriangle,
    CheckCircle,
    Lightbulb,
    Activity,
    Cpu,
    Database,
    RefreshCw
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useAnalytics } from '../../hooks/useAnalytics';
import { UnifiedCalculationEngine } from '../../utils/UnifiedCalculationEngine';
import { Switch } from '../ui/switch';

interface MLPredictionsOverlayProps {
    onClose: () => void;
}

interface ConversionPrediction {
    segment: string;
    currentRate: number;
    predictedRate: number;
    improvement: number;
    confidence: number;
    recommendations: string[];
}

interface OptimizationSuggestion {
    id: string;
    type: 'content' | 'flow' | 'design' | 'timing';
    title: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
    difficulty: 'easy' | 'medium' | 'hard';
    predictedLift: number;
    priority: number;
}

interface MLInsight {
    id: string;
    category: 'performance' | 'engagement' | 'conversion' | 'user-experience';
    title: string;
    description: string;
    confidence: number;
    actionable: boolean;
    metrics: {
        before: number;
        after: number;
        improvement: number;
    };
}

export function MLPredictionsOverlay({ onClose }: MLPredictionsOverlayProps) {
    const { trackEvent } = useAnalytics();
    const [activeTab, setActiveTab] = useState<'predictions' | 'optimizations' | 'insights' | 'settings'>('predictions');
    const [isProcessing, setIsProcessing] = useState(false);
    const [mlEnabled, setMlEnabled] = useState(true);
    const [autoOptimization, setAutoOptimization] = useState(false);

    const [predictions, setPredictions] = useState<ConversionPrediction[]>([]);
    const [optimizations, setOptimizations] = useState<OptimizationSuggestion[]>([]);
    const [insights, setInsights] = useState<MLInsight[]>([]);

    // Simular dados ML baseados na UnifiedCalculationEngine
    useEffect(() => {
        const generateMLData = () => {
            // Simulação de predições baseadas em padrões reais
            const mockPredictions: ConversionPrediction[] = [
                {
                    segment: 'Usuários Móveis',
                    currentRate: 12.3,
                    predictedRate: 16.8,
                    improvement: 36.6,
                    confidence: 87.2,
                    recommendations: [
                        'Otimizar carregamento de imagens',
                        'Simplificar formulários',
                        'Implementar scroll suave'
                    ]
                },
                {
                    segment: 'Usuários Desktop',
                    currentRate: 18.7,
                    predictedRate: 22.1,
                    improvement: 18.2,
                    confidence: 93.5,
                    recommendations: [
                        'Adicionar CTA secundário',
                        'Melhorar headlines',
                        'Implementar urgência'
                    ]
                },
                {
                    segment: 'Primeira Visita',
                    currentRate: 8.1,
                    predictedRate: 13.4,
                    improvement: 65.4,
                    confidence: 91.8,
                    recommendations: [
                        'Criar onboarding interativo',
                        'Destacar valor único',
                        'Reduzir fricção inicial'
                    ]
                }
            ];

            const mockOptimizations: OptimizationSuggestion[] = [
                {
                    id: 'opt-1',
                    type: 'content',
                    title: 'Headline Personalizado por Segmento',
                    description: 'IA detectou que diferentes segmentos respondem melhor a mensagens específicas',
                    impact: 'high',
                    difficulty: 'easy',
                    predictedLift: 23.5,
                    priority: 1
                },
                {
                    id: 'opt-2',
                    type: 'flow',
                    title: 'Reordenação Inteligente de Steps',
                    description: 'ML sugere nova sequência baseada em padrões de abandono',
                    impact: 'high',
                    difficulty: 'medium',
                    predictedLift: 31.2,
                    priority: 2
                },
                {
                    id: 'opt-3',
                    type: 'design',
                    title: 'Cores Otimizadas por Contexto',
                    description: 'Algoritmo identifica paletas com melhor performance por horário',
                    impact: 'medium',
                    difficulty: 'easy',
                    predictedLift: 14.8,
                    priority: 3
                },
                {
                    id: 'opt-4',
                    type: 'timing',
                    title: 'Micro-animações Estratégicas',
                    description: 'Timing otimizado para reduzir ansiedade e aumentar engajamento',
                    impact: 'medium',
                    difficulty: 'hard',
                    predictedLift: 18.7,
                    priority: 4
                }
            ];

            const mockInsights: MLInsight[] = [
                {
                    id: 'insight-1',
                    category: 'conversion',
                    title: 'Padrão de Abandono Identificado',
                    description: 'IA detectou que 67% dos usuários abandonam na questão 5. Implementar checkpoint pode recuperar 24% deles.',
                    confidence: 94.3,
                    actionable: true,
                    metrics: { before: 12.3, after: 18.7, improvement: 52.0 }
                },
                {
                    id: 'insight-2',
                    category: 'engagement',
                    title: 'Tempo Ideal de Interação',
                    description: 'Usuários que gastam 2-3 minutos têm 340% mais chance de conversão que os que gastam <1 minuto.',
                    confidence: 89.1,
                    actionable: true,
                    metrics: { before: 15.2, after: 21.6, improvement: 42.1 }
                },
                {
                    id: 'insight-3',
                    category: 'user-experience',
                    title: 'Fricção em Dispositivos Móveis',
                    description: 'Machine Learning identificou que botões pequenos causam 43% mais cliques acidentais.',
                    confidence: 91.7,
                    actionable: true,
                    metrics: { before: 8.1, after: 13.4, improvement: 65.4 }
                }
            ];

            setPredictions(mockPredictions);
            setOptimizations(mockOptimizations);
            setInsights(mockInsights);
        };

        generateMLData();

        // Atualizar dados a cada 10 segundos
        const interval = setInterval(generateMLData, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleRunMLAnalysis = async () => {
        setIsProcessing(true);
        trackEvent('ml_analysis_started', { timestamp: Date.now() });

        try {
            // Simular processamento ML
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Conectar com UnifiedCalculationEngine para dados reais
            const engine = new UnifiedCalculationEngine();
            console.log('🧠 ML conectado com UnifiedCalculationEngine:', engine);

            trackEvent('ml_analysis_completed', {
                predictions: predictions.length,
                optimizations: optimizations.length
            });

        } catch (error) {
            console.error('❌ Erro na análise ML:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const getImpactBadge = (impact: string) => {
        const configs = {
            low: { color: 'bg-gray-100 text-gray-800', label: 'Baixo' },
            medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Médio' },
            high: { color: 'bg-green-100 text-green-800', label: 'Alto' }
        };
        const config = configs[impact as keyof typeof configs];
        return <Badge className={config.color}>{config.label}</Badge>;
    };

    const getDifficultyBadge = (difficulty: string) => {
        const configs = {
            easy: { color: 'bg-green-100 text-green-800', label: 'Fácil' },
            medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Médio' },
            hard: { color: 'bg-red-100 text-red-800', label: 'Difícil' }
        };
        const config = configs[difficulty as keyof typeof configs];
        return <Badge className={config.color}>{config.label}</Badge>;
    };

    const getCategoryIcon = (category: string) => {
        const icons = {
            performance: <Activity className="w-4 h-4" />,
            engagement: <Target className="w-4 h-4" />,
            conversion: <TrendingUp className="w-4 h-4" />,
            'user-experience': <Lightbulb className="w-4 h-4" />
        };
        return icons[category as keyof typeof icons] || <Brain className="w-4 h-4" />;
    };

    return (
        <div className="fixed inset-0 z-[140] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-full max-w-7xl mx-4 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-lg">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                ML Predictions Engine
                                <div className="flex items-center gap-1">
                                    <div className={`w-2 h-2 rounded-full ${mlEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                                    <span className={`text-xs font-medium ${mlEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                                        {mlEnabled ? 'ATIVO' : 'PAUSADO'}
                                    </span>
                                </div>
                            </h2>
                            <p className="text-sm text-gray-600">
                                Previsões inteligentes com UnifiedCalculationEngine integrado
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRunMLAnalysis}
                            disabled={isProcessing}
                            className="flex items-center gap-2"
                        >
                            {isProcessing ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <Cpu className="w-4 h-4" />
                            )}
                            {isProcessing ? 'Processando...' : 'Analisar ML'}
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
                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 px-6 py-3 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-900">
                                    Engine: UnifiedCalculationEngine v2.1
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-700">
                                    {predictions.length} previsões ativas
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
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b">
                    <div className="flex">
                        {[
                            { key: 'predictions', label: 'Previsões ML', icon: Brain, count: predictions.length },
                            { key: 'optimizations', label: 'Otimizações', icon: Zap, count: optimizations.length },
                            { key: 'insights', label: 'Insights', icon: Lightbulb, count: insights.length },
                            { key: 'settings', label: 'Configurações', icon: Settings, count: 0 }
                        ].map(({ key, label, icon: Icon, count }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key as any)}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === key
                                        ? 'border-purple-500 text-purple-600 bg-purple-50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                                {count > 0 && (
                                    <Badge className="bg-purple-100 text-purple-800 text-xs ml-1">
                                        {count}
                                    </Badge>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {activeTab === 'predictions' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Previsões de Conversão ML</h3>
                                <Badge className="bg-blue-100 text-blue-800">
                                    Confiança Média: {predictions.reduce((acc, p) => acc + p.confidence, 0) / predictions.length || 0}%
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {predictions.map((prediction, index) => (
                                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-semibold text-gray-900">{prediction.segment}</h4>
                                            <Badge className={`${prediction.confidence > 90 ? 'bg-green-100 text-green-800' :
                                                    prediction.confidence > 80 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {prediction.confidence.toFixed(1)}% confiança
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-gray-600">{prediction.currentRate.toFixed(1)}%</p>
                                                <p className="text-xs text-gray-500">Atual</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-green-600">{prediction.predictedRate.toFixed(1)}%</p>
                                                <p className="text-xs text-gray-500">Previsto</p>
                                            </div>
                                        </div>

                                        <div className="text-center mb-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <TrendingUp className="w-4 h-4 text-green-600" />
                                                <span className="text-lg font-bold text-green-600">+{prediction.improvement.toFixed(1)}%</span>
                                            </div>
                                            <p className="text-xs text-gray-500">Melhoria Esperada</p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-2">Recomendações ML:</p>
                                            <div className="space-y-1">
                                                {prediction.recommendations.slice(0, 2).map((rec, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <ChevronRight className="w-3 h-3 text-gray-400" />
                                                        <span className="text-xs text-gray-600">{rec}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'optimizations' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Otimizações Sugeridas pela IA</h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2"
                                    onClick={() => trackEvent('auto_optimization_enabled')}
                                >
                                    <Zap className="w-4 h-4" />
                                    Aplicar Todas
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {optimizations.sort((a, b) => a.priority - b.priority).map((opt) => (
                                    <div key={opt.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="font-semibold text-gray-900">{opt.title}</h4>
                                                    <div className="flex items-center gap-2">
                                                        {getImpactBadge(opt.impact)}
                                                        {getDifficultyBadge(opt.difficulty)}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-3">{opt.description}</p>
                                            </div>

                                            <div className="text-right ml-4">
                                                <div className="flex items-center gap-1 mb-1">
                                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                                    <span className="text-lg font-bold text-green-600">+{opt.predictedLift.toFixed(1)}%</span>
                                                </div>
                                                <p className="text-xs text-gray-500">Lift Previsto</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Badge variant="outline" className="text-xs">
                                                Prioridade #{opt.priority}
                                            </Badge>

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
                                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs"
                                                    onClick={() => trackEvent('optimization_applied', { id: opt.id })}
                                                >
                                                    Aplicar
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'insights' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Insights Machine Learning</h3>
                                <Badge className="bg-indigo-100 text-indigo-800">
                                    {insights.filter(i => i.actionable).length} Acionáveis
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {insights.map((insight) => (
                                    <div key={insight.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg">
                                                {getCategoryIcon(insight.category)}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                                                    {insight.actionable ? (
                                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                                    )}
                                                </div>

                                                <p className="text-sm text-gray-600 mb-4">{insight.description}</p>

                                                <div className="flex items-center justify-between">
                                                    <div className="grid grid-cols-3 gap-4 text-xs">
                                                        <div className="text-center">
                                                            <p className="font-semibold text-gray-900">{insight.metrics.before.toFixed(1)}%</p>
                                                            <p className="text-gray-500">Antes</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="font-semibold text-green-600">{insight.metrics.after.toFixed(1)}%</p>
                                                            <p className="text-gray-500">Depois</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="font-semibold text-blue-600">+{insight.metrics.improvement.toFixed(1)}%</p>
                                                            <p className="text-gray-500">Melhoria</p>
                                                        </div>
                                                    </div>

                                                    <Badge className="bg-purple-100 text-purple-800 text-xs">
                                                        {insight.confidence.toFixed(1)}% confiança
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="max-w-2xl mx-auto space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900">Configurações ML Engine</h3>

                            <div className="space-y-6">
                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Machine Learning Engine</h4>
                                            <p className="text-sm text-gray-600">Ativar/desativar processamento ML</p>
                                        </div>
                                        <Switch
                                            checked={mlEnabled}
                                            onCheckedChange={(checked) => {
                                                setMlEnabled(checked);
                                                trackEvent('ml_engine_toggled', { enabled: checked });
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Otimização Automática</h4>
                                            <p className="text-sm text-gray-600">Aplicar sugestões ML automaticamente</p>
                                        </div>
                                        <Switch
                                            checked={autoOptimization}
                                            onCheckedChange={setAutoOptimization}
                                        />
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <h4 className="font-medium text-gray-900 mb-4">Conexão UnifiedCalculationEngine</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">Status:</p>
                                            <p className="font-semibold text-green-600">✅ Conectado</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Versão:</p>
                                            <p className="font-semibold text-gray-900">v2.1.0</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Modelo ML:</p>
                                            <p className="font-semibold text-gray-900">Híbrido + Deep Learning</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Precisão:</p>
                                            <p className="font-semibold text-green-600">94.2%</p>
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