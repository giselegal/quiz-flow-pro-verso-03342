import React, { useState, useEffect } from 'react';
import {
    X,
    TestTube2,
    BarChart3,
    TrendingUp,
    Users,
    Target,
    Copy,
    Play,
    Pause,
    RefreshCw,
    CheckCircle,
    AlertTriangle,
    Monitor,
    Smartphone,
    ArrowRight,
    Settings,
    Eye,
    MousePointer
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Switch } from '../ui/switch';

interface ABTestingIntegrationProps {
    onClose: () => void;
}

interface ABTestVariant {
    id: string;
    name: string;
    description: string;
    traffic: number;
    conversions: number;
    visitors: number;
    conversionRate: number;
    isWinning: boolean;
    confidence: number;
    status: 'running' | 'paused' | 'completed';
    changes: Array<{
        element: string;
        property: string;
        originalValue: string;
        newValue: string;
    }>;
}

interface ABTest {
    id: string;
    name: string;
    status: 'draft' | 'running' | 'paused' | 'completed';
    startDate: string;
    endDate?: string;
    goal: string;
    variants: ABTestVariant[];
    totalVisitors: number;
    overallLift: number;
    significance: number;
}

export function ABTestingIntegration({ onClose }: ABTestingIntegrationProps) {
    const { trackEvent } = useAnalytics();
    const [activeTab, setActiveTab] = useState<'active' | 'create' | 'results'>('active');
    const [selectedTest, setSelectedTest] = useState<string | null>(null);

    const [abTests, setAbTests] = useState<ABTest[]>([
        {
            id: 'test-1',
            name: 'Landing Page Headlines',
            status: 'running',
            startDate: '2024-01-15',
            goal: 'quiz_start',
            totalVisitors: 1250,
            overallLift: 12.5,
            significance: 95.2,
            variants: [
                {
                    id: 'control',
                    name: 'Controle (Original)',
                    description: 'Versão atual do headline',
                    traffic: 50,
                    conversions: 85,
                    visitors: 625,
                    conversionRate: 13.6,
                    isWinning: false,
                    confidence: 0,
                    status: 'running',
                    changes: []
                },
                {
                    id: 'variant-a',
                    name: 'Variant A - Urgência',
                    description: 'Headline com senso de urgência',
                    traffic: 50,
                    conversions: 110,
                    visitors: 625,
                    conversionRate: 17.6,
                    isWinning: true,
                    confidence: 95.2,
                    status: 'running',
                    changes: [
                        {
                            element: 'h1',
                            property: 'text',
                            originalValue: 'Descubra seu perfil ideal',
                            newValue: 'Apenas 2 minutos! Descubra seu perfil ideal agora'
                        }
                    ]
                }
            ]
        },
        {
            id: 'test-2',
            name: 'Call-to-Action Button',
            status: 'paused',
            startDate: '2024-01-10',
            goal: 'form_completion',
            totalVisitors: 890,
            overallLift: -2.1,
            significance: 68.5,
            variants: [
                {
                    id: 'control-2',
                    name: 'Controle',
                    description: 'Botão azul padrão',
                    traffic: 50,
                    conversions: 67,
                    visitors: 445,
                    conversionRate: 15.1,
                    isWinning: true,
                    confidence: 68.5,
                    status: 'paused',
                    changes: []
                },
                {
                    id: 'variant-b',
                    name: 'Variant B - Verde',
                    description: 'Botão verde com urgência',
                    traffic: 50,
                    conversions: 58,
                    visitors: 445,
                    conversionRate: 13.0,
                    isWinning: false,
                    confidence: 0,
                    status: 'paused',
                    changes: [
                        {
                            element: 'button.cta',
                            property: 'background',
                            originalValue: '#3B82F6',
                            newValue: '#10B981'
                        },
                        {
                            element: 'button.cta',
                            property: 'text',
                            originalValue: 'Começar Quiz',
                            newValue: 'Iniciar Agora!'
                        }
                    ]
                }
            ]
        }
    ]);

    const [newTest, setNewTest] = useState({
        name: '',
        goal: 'quiz_start',
        description: '',
        variants: [
            { name: 'Controle', description: 'Versão atual', traffic: 50 },
            { name: 'Variant A', description: 'Nova versão', traffic: 50 }
        ]
    });

    const handleStartTest = (testId: string) => {
        setAbTests(prev => prev.map(test =>
            test.id === testId ? { ...test, status: 'running' as const } : test
        ));
        trackEvent('ab_test_started', { testId });
    };

    const handlePauseTest = (testId: string) => {
        setAbTests(prev => prev.map(test =>
            test.id === testId ? { ...test, status: 'paused' as const } : test
        ));
        trackEvent('ab_test_paused', { testId });
    };

    const handleCreateTest = () => {
        const newTestData: ABTest = {
            id: `test-${Date.now()}`,
            name: newTest.name,
            status: 'draft',
            startDate: new Date().toISOString().split('T')[0],
            goal: newTest.goal,
            totalVisitors: 0,
            overallLift: 0,
            significance: 0,
            variants: newTest.variants.map((variant, index) => ({
                id: index === 0 ? 'control' : `variant-${String.fromCharCode(65 + index - 1)}`,
                name: variant.name,
                description: variant.description,
                traffic: variant.traffic,
                conversions: 0,
                visitors: 0,
                conversionRate: 0,
                isWinning: false,
                confidence: 0,
                status: 'running' as const,
                changes: []
            }))
        };

        setAbTests(prev => [...prev, newTestData]);
        setNewTest({
            name: '',
            goal: 'quiz_start',
            description: '',
            variants: [
                { name: 'Controle', description: 'Versão atual', traffic: 50 },
                { name: 'Variant A', description: 'Nova versão', traffic: 50 }
            ]
        });
        setActiveTab('active');
        trackEvent('ab_test_created', { testName: newTestData.name });
    };

    const getStatusBadge = (status: ABTest['status']) => {
        const statusConfig = {
            draft: { color: 'bg-gray-100 text-gray-800', label: 'Rascunho' },
            running: { color: 'bg-green-100 text-green-800', label: 'Rodando' },
            paused: { color: 'bg-yellow-100 text-yellow-800', label: 'Pausado' },
            completed: { color: 'bg-blue-100 text-blue-800', label: 'Finalizado' }
        };

        const config = statusConfig[status];
        return <Badge className={config.color}>{config.label}</Badge>;
    };

    const getStatusIcon = (status: ABTest['status']) => {
        switch (status) {
            case 'running': return <Play className="w-4 h-4 text-green-600" />;
            case 'paused': return <Pause className="w-4 h-4 text-yellow-600" />;
            case 'completed': return <CheckCircle className="w-4 h-4 text-blue-600" />;
            default: return <Settings className="w-4 h-4 text-gray-600" />;
        }
    };

    return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-full max-w-7xl mx-4 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-50 to-indigo-50">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg">
                            <TestTube2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">A/B Testing Suite</h2>
                            <p className="text-sm text-gray-600">Teste e otimize suas conversões em tempo real</p>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex items-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Fechar
                    </Button>
                </div>

                {/* Tabs */}
                <div className="border-b">
                    <div className="flex">
                        {[
                            { key: 'active', label: 'Testes Ativos', icon: Play },
                            { key: 'create', label: 'Criar Teste', icon: TestTube2 },
                            { key: 'results', label: 'Resultados', icon: BarChart3 }
                        ].map(({ key, label, icon: Icon }) => (
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
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
                    {activeTab === 'active' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Testes em Andamento</h3>
                                <Button
                                    onClick={() => setActiveTab('create')}
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                                >
                                    <TestTube2 className="w-4 h-4 mr-2" />
                                    Novo Teste
                                </Button>
                            </div>

                            {abTests.map((test) => (
                                <div key={test.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                {getStatusIcon(test.status)}
                                                <h4 className="text-lg font-semibold text-gray-900">{test.name}</h4>
                                                {getStatusBadge(test.status)}
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Iniciado em {new Date(test.startDate).toLocaleDateString('pt-BR')} •
                                                Meta: {test.goal} • {test.totalVisitors} visitantes
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {test.status === 'running' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handlePauseTest(test.id)}
                                                >
                                                    <Pause className="w-4 h-4 mr-1" />
                                                    Pausar
                                                </Button>
                                            )}
                                            {test.status === 'paused' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleStartTest(test.id)}
                                                >
                                                    <Play className="w-4 h-4 mr-1" />
                                                    Retomar
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Test Performance Summary */}
                                    {test.totalVisitors > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Users className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm font-medium text-blue-900">Visitantes</span>
                                                </div>
                                                <p className="text-2xl font-bold text-blue-900">{test.totalVisitors.toLocaleString()}</p>
                                            </div>

                                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                                    <span className="text-sm font-medium text-green-900">Lift Geral</span>
                                                </div>
                                                <p className={`text-2xl font-bold ${test.overallLift > 0 ? 'text-green-900' : 'text-red-900'}`}>
                                                    {test.overallLift > 0 ? '+' : ''}{test.overallLift.toFixed(1)}%
                                                </p>
                                            </div>

                                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Target className="w-4 h-4 text-purple-600" />
                                                    <span className="text-sm font-medium text-purple-900">Significância</span>
                                                </div>
                                                <p className="text-2xl font-bold text-purple-900">{test.significance.toFixed(1)}%</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Variants */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {test.variants.map((variant) => (
                                            <div
                                                key={variant.id}
                                                className={`border rounded-lg p-4 ${variant.isWinning && test.significance > 90
                                                        ? 'border-green-300 bg-green-50'
                                                        : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <h5 className="font-medium text-gray-900">{variant.name}</h5>
                                                        {variant.isWinning && test.significance > 90 && (
                                                            <Badge className="bg-green-100 text-green-800 text-xs">
                                                                Vencedor
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-gray-600">{variant.traffic}% tráfego</span>
                                                </div>

                                                <p className="text-sm text-gray-600 mb-3">{variant.description}</p>

                                                {test.totalVisitors > 0 && (
                                                    <div className="grid grid-cols-3 gap-3 text-center">
                                                        <div>
                                                            <p className="text-lg font-semibold text-gray-900">{variant.visitors}</p>
                                                            <p className="text-xs text-gray-500">Visitantes</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-lg font-semibold text-gray-900">{variant.conversions}</p>
                                                            <p className="text-xs text-gray-500">Conversões</p>
                                                        </div>
                                                        <div>
                                                            <p className={`text-lg font-semibold ${variant.isWinning ? 'text-green-600' : 'text-gray-900'
                                                                }`}>
                                                                {variant.conversionRate.toFixed(1)}%
                                                            </p>
                                                            <p className="text-xs text-gray-500">Taxa Conv.</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Changes Preview */}
                                                {variant.changes.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                                        <p className="text-xs font-medium text-gray-700 mb-2">Mudanças:</p>
                                                        {variant.changes.slice(0, 2).map((change, idx) => (
                                                            <div key={idx} className="text-xs text-gray-600">
                                                                <span className="font-medium">{change.element}</span>: {change.property}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'create' && (
                        <div className="max-w-2xl mx-auto">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Criar Novo Teste A/B</h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome do Teste
                                    </label>
                                    <Input
                                        value={newTest.name}
                                        onChange={(e) => setNewTest(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Ex: Headline da Landing Page"
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Objetivo do Teste
                                    </label>
                                    <select
                                        value={newTest.goal}
                                        onChange={(e) => setNewTest(prev => ({ ...prev, goal: e.target.value }))}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    >
                                        <option value="quiz_start">Início do Quiz</option>
                                        <option value="form_completion">Conclusão do Formulário</option>
                                        <option value="email_signup">Cadastro de Email</option>
                                        <option value="conversion">Conversão Final</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Descrição
                                    </label>
                                    <textarea
                                        value={newTest.description}
                                        onChange={(e) => setNewTest(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Descreva o que você está testando..."
                                        rows={3}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                        Variações do Teste
                                    </label>
                                    {newTest.variants.map((variant, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Nome</label>
                                                    <Input
                                                        value={variant.name}
                                                        onChange={(e) => {
                                                            const updatedVariants = [...newTest.variants];
                                                            updatedVariants[index] = { ...variant, name: e.target.value };
                                                            setNewTest(prev => ({ ...prev, variants: updatedVariants }));
                                                        }}
                                                        placeholder="Nome da variação"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Tráfego (%)
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        value={variant.traffic}
                                                        onChange={(e) => {
                                                            const updatedVariants = [...newTest.variants];
                                                            updatedVariants[index] = { ...variant, traffic: parseInt(e.target.value) || 50 };
                                                            setNewTest(prev => ({ ...prev, variants: updatedVariants }));
                                                        }}
                                                        min="0"
                                                        max="100"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Descrição</label>
                                                <Input
                                                    value={variant.description}
                                                    onChange={(e) => {
                                                        const updatedVariants = [...newTest.variants];
                                                        updatedVariants[index] = { ...variant, description: e.target.value };
                                                        setNewTest(prev => ({ ...prev, variants: updatedVariants }));
                                                    }}
                                                    placeholder="Descreva esta variação"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between pt-6">
                                    <Button
                                        variant="outline"
                                        onClick={() => setActiveTab('active')}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={handleCreateTest}
                                        disabled={!newTest.name.trim()}
                                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                                    >
                                        Criar Teste
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'results' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900">Histórico de Resultados</h3>

                            {abTests.filter(test => test.totalVisitors > 0).map((test) => (
                                <div key={test.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900">{test.name}</h4>
                                            <p className="text-sm text-gray-600">
                                                {new Date(test.startDate).toLocaleDateString('pt-BR')} •
                                                {test.totalVisitors.toLocaleString()} visitantes
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-2xl font-bold ${test.overallLift > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {test.overallLift > 0 ? '+' : ''}{test.overallLift.toFixed(1)}%
                                            </p>
                                            <p className="text-sm text-gray-500">Lift geral</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {test.variants.map((variant) => (
                                            <div
                                                key={variant.id}
                                                className={`p-4 rounded-lg border ${variant.isWinning ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <h5 className="font-medium text-gray-900">{variant.name}</h5>
                                                    {variant.isWinning && (
                                                        <Badge className="bg-green-100 text-green-800">Vencedor</Badge>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-600">Taxa de Conversão</p>
                                                        <p className="text-lg font-semibold text-gray-900">{variant.conversionRate.toFixed(1)}%</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Confiança</p>
                                                        <p className="text-lg font-semibold text-gray-900">{variant.confidence.toFixed(1)}%</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Visitantes</p>
                                                        <p className="text-lg font-semibold text-gray-900">{variant.visitors}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Conversões</p>
                                                        <p className="text-lg font-semibold text-gray-900">{variant.conversions}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}