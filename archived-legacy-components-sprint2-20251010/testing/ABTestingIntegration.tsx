import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Play,
  Pause,
  BarChart3,
  Settings,
  Plus,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAnalytics } from '@/hooks/useAnalytics';

export interface ABTestingIntegrationProps {
  onClose: () => void;
}

interface ABTestVariant {
  id: string;
  name: string;
  traffic: number;
  conversions: number;
  visitors: number;
  conversionRate: number;
  isControl: boolean;
}

interface ABTest {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'completed' | 'draft';
  startDate: string;
  endDate?: string;
  goal: string;
  description: string;
  totalVisitors: number;
  variants: ABTestVariant[];
  overallLift: number;
  significance: number;
}

export function ABTestingIntegration({ onClose }: ABTestingIntegrationProps) {
    const { trackEvent } = useAnalytics();
    const [activeTab, setActiveTab] = useState<'active' | 'create' | 'results'>('active');

    const [abTests] = useState<ABTest[]>([
        {
            id: 'test-1',
            name: 'Landing Page Headlines',
            status: 'running',
            startDate: '2024-01-15',
            goal: 'quiz_start',
            description: 'Testing different headline variations for the quiz landing page',
            totalVisitors: 1250,
            overallLift: 12.5,
            significance: 95.2,
            variants: [
                {
                    id: 'control',
                    name: 'Original Headline',
                    traffic: 50,
                    conversions: 125,
                    visitors: 625,
                    conversionRate: 20.0,
                    isControl: true
                },
                {
                    id: 'variant-a',
                    name: 'Action-Focused Headline',
                    traffic: 50,
                    conversions: 140,
                    visitors: 625,
                    conversionRate: 22.4,
                    isControl: false
                }
            ]
        }
    ]);

    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-200 flex flex-col z-50">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">🧪 A/B Testing</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Otimize conversões com testes controlados
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </Button>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-white rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-green-600">+12.5%</div>
                        <div className="text-xs text-gray-500">Lift Médio</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-blue-600">{abTests.length}</div>
                        <div className="text-xs text-gray-500">Testes Ativos</div>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1 flex flex-col">
                <div className="px-6 pt-4">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="active">Ativos</TabsTrigger>
                        <TabsTrigger value="create">Criar</TabsTrigger>
                        <TabsTrigger value="results">Resultados</TabsTrigger>
                    </TabsList>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Active Tests Tab */}
                    <TabsContent value="active" className="p-6 space-y-4">
                        {abTests.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-4xl mb-4">🧪</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Nenhum teste ativo
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Crie seu primeiro teste A/B para começar a otimizar
                                </p>
                                <Button
                                    onClick={() => setActiveTab('create')}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Criar Teste
                                </Button>
                            </div>
                        ) : (
                            abTests.map((test) => (
                                <Card key={test.id} className="relative">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-base">{test.name}</CardTitle>
                                                <CardDescription className="text-sm">
                                                    {test.description}
                                                </CardDescription>
                                            </div>
                                            <Badge 
                                                variant={test.status === 'running' ? 'default' : 'secondary'}
                                                className={test.status === 'running' ? 'bg-green-100 text-green-800' : ''}
                                            >
                                                {test.status === 'running' ? (
                                                    <>
                                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                                                        Rodando
                                                    </>
                                                ) : (
                                                    test.status
                                                )}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        {/* Test Stats */}
                                        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                                            <div>
                                                <div className="text-lg font-bold">{test.totalVisitors}</div>
                                                <div className="text-xs text-gray-500">Visitantes</div>
                                            </div>
                                            <div>
                                                <div className="text-lg font-bold text-green-600">+{test.overallLift}%</div>
                                                <div className="text-xs text-gray-500">Lift</div>
                                            </div>
                                            <div>
                                                <div className="text-lg font-bold">{test.significance}%</div>
                                                <div className="text-xs text-gray-500">Significância</div>
                                            </div>
                                        </div>

                                        {/* Variants Comparison */}
                                        <div className="space-y-2 mb-4">
                                            {test.variants.map((variant) => (
                                                <div
                                                    key={variant.id}
                                                    className={`p-3 rounded-lg border ${
                                                        variant.isControl 
                                                            ? 'border-gray-200 bg-gray-50' 
                                                            : 'border-blue-200 bg-blue-50'
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-sm font-medium">
                                                            {variant.name}
                                                            {variant.isControl && (
                                                                <Badge variant="outline" className="ml-2 text-xs">
                                                                    Controle
                                                                </Badge>
                                                            )}
                                                        </span>
                                                        <span className="text-sm font-bold">
                                                            {variant.conversionRate}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${
                                                                variant.isControl ? 'bg-gray-400' : 'bg-blue-500'
                                                            }`}
                                                            style={{ 
                                                                width: `${Math.max(variant.conversionRate * 4, 10)}%` 
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {variant.conversions} conversões de {variant.visitors} visitantes
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Test Actions */}
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => {
                                                    trackEvent('ab_test_paused', { testId: test.id });
                                                }}
                                            >
                                                <Pause className="w-4 h-4 mr-1" />
                                                Pausar
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => setActiveTab('results')}
                                            >
                                                <BarChart3 className="w-4 h-4 mr-1" />
                                                Ver Dados
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    // Implement settings
                                                }}
                                            >
                                                <Settings className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>

                    {/* Create Test Tab */}
                    <TabsContent value="create" className="p-6">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium mb-4">Criar Novo Teste A/B</h3>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="test-name">Nome do Teste</Label>
                                        <Input
                                            id="test-name"
                                            placeholder="Ex: Teste de Headline da Landing Page"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="test-goal">Objetivo</Label>
                                        <select 
                                            id="test-goal"
                                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                                        >
                                            <option>Início do Quiz</option>
                                            <option>Conclusão do Quiz</option>
                                            <option>Clique no CTA</option>
                                            <option>Captura de Email</option>
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="test-description">Descrição</Label>
                                        <textarea
                                            id="test-description"
                                            rows={3}
                                            placeholder="Descreva o que você está testando..."
                                            className="mt-1 w-full p-2 border border-gray-300 rounded-md resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-3">Variações</h4>
                                <div className="space-y-3">
                                    <div className="p-3 border border-gray-200 rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium">Controle (Original)</span>
                                            <Badge variant="outline">50% tráfego</Badge>
                                        </div>
                                        <Input 
                                            placeholder="Nome da variação de controle"
                                            className="text-sm"
                                        />
                                    </div>

                                    <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium">Variação A</span>
                                            <Badge variant="outline">50% tráfego</Badge>
                                        </div>
                                        <Input 
                                            placeholder="Nome da nova variação"
                                            className="text-sm"
                                        />
                                    </div>

                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full border-dashed"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Adicionar Variação
                                    </Button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <Button 
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    onClick={() => {
                                        trackEvent('ab_test_created');
                                        setActiveTab('active');
                                    }}
                                >
                                    <Play className="w-4 h-4 mr-2" />
                                    Iniciar Teste A/B
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Results Tab */}
                    <TabsContent value="results" className="p-6">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium mb-4">Análise Detalhada</h3>
                                
                                {abTests.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">{abTests[0].name}</CardTitle>
                                            <CardDescription>
                                                Análise estatística completa do teste
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-green-600">
                                                        +{abTests[0].overallLift}%
                                                    </div>
                                                    <div className="text-sm text-gray-600">Melhoria</div>
                                                </div>
                                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-blue-600">
                                                        {abTests[0].significance}%
                                                    </div>
                                                    <div className="text-sm text-gray-600">Confiança</div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span>Status do Teste:</span>
                                                    <Badge variant={abTests[0].significance >= 95 ? 'default' : 'secondary'}>
                                                        {abTests[0].significance >= 95 ? 
                                                            <><CheckCircle className="w-3 h-3 mr-1" />Significante</> : 
                                                            'Coletando dados...'
                                                        }
                                                    </Badge>
                                                </div>
                                                
                                                <div className="flex justify-between text-sm">
                                                    <span>Duração:</span>
                                                    <span>7 dias</span>
                                                </div>
                                                
                                                <div className="flex justify-between text-sm">
                                                    <span>Visitantes únicos:</span>
                                                    <span>{abTests[0].totalVisitors}</span>
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <h4 className="font-medium mb-2">Recomendação</h4>
                                                <div className="p-3 bg-green-50 border-l-4 border-green-400 text-sm">
                                                    <strong>Implementar Variação A:</strong> Com 95.2% de confiança 
                                                    estatística e +12.5% de lift, a variação A demonstra uma 
                                                    melhoria significativa na taxa de conversão.
                                                </div>
                                            </div>

                                            <div className="flex gap-2 mt-4">
                                                <Button variant="outline" className="flex-1">
                                                    <TrendingUp className="w-4 h-4 mr-1" />
                                                    Implementar Vencedor
                                                </Button>
                                                <Button variant="outline" className="flex-1">
                                                    Exportar Dados
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}