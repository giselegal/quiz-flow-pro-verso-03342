// src/components/admin/QuizCalculationConfigurator.tsx
// 🎨 Interface NoCode para configuração de algoritmos de cálculo

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
    Settings,
    Calculator,
    Target,
    Shuffle,
    Eye,
    Download,
    Upload,
    AlertTriangle,
    CheckCircle,
    Play
} from 'lucide-react';
import { useQuizRulesConfig, QuizRulesConfig } from '@/hooks/useQuizRulesConfig';
import { UnifiedCalculationEngine, calculateQuizResults } from '@/utils/UnifiedCalculationEngine';

interface QuizCalculationConfiguratorProps {
    onConfigSave?: (config: QuizRulesConfig) => void;
    onTestResult?: (result: any) => void;
}

interface StyleCategory {
    id: string;
    name: string;
    description: string;
    color: string;
    weight: number;
}

interface TestScenario {
    name: string;
    description: string;
    answers: Array<{ questionId: string; optionId: string; weight: number }>;
}

export const QuizCalculationConfigurator: React.FC<QuizCalculationConfiguratorProps> = ({
    onConfigSave,
    onTestResult
}) => {
    const { config } = useQuizRulesConfig();
    const [activeTab, setActiveTab] = useState('categories');
    const [isModified, setIsModified] = useState(false);
    const [testResult, setTestResult] = useState<any>(null);
    const [isTestRunning, setIsTestRunning] = useState(false);

    // Estados para configuração
    const [categories, setCategories] = useState<StyleCategory[]>([]);
    const [algorithm, setAlgorithm] = useState({
        type: 'weighted_sum',
        normalQuestionWeight: 0.7,
        strategicQuestionWeight: 0.3,
        minimumScoreDifference: 0.1,
        tieBreaker: 'first_selection'
    });
    const [resultCalculation, setResultCalculation] = useState({
        primaryStyle: 'highest_score',
        secondaryStyles: 'top_3_excluding_primary',
        showPercentages: true,
        roundTo: 1
    });

    // Cenários de teste pré-definidos
    const testScenarios: TestScenario[] = [
        {
            name: 'Natural Predominante',
            description: '6 respostas Natural, outras distribuídas',
            answers: [
                { questionId: 'q1', optionId: 'natural_1', weight: 1 },
                { questionId: 'q2', optionId: 'natural_2', weight: 1 },
                { questionId: 'q3', optionId: 'natural_3', weight: 1 },
                { questionId: 'q4', optionId: 'natural_4', weight: 1 },
                { questionId: 'q5', optionId: 'natural_5', weight: 1 },
                { questionId: 'q6', optionId: 'natural_6', weight: 1 },
                { questionId: 'q7', optionId: 'classico_7', weight: 1 },
                { questionId: 'q8', optionId: 'romantico_8', weight: 1 },
                { questionId: 'q9', optionId: 'dramatico_9', weight: 1 },
                { questionId: 'q10', optionId: 'criativo_10', weight: 1 }
            ]
        },
        {
            name: 'Empate Natural vs Clássico',
            description: 'Cenário de empate para testar critério de desempate',
            answers: [
                { questionId: 'q1', optionId: 'natural_1', weight: 1 },
                { questionId: 'q2', optionId: 'classico_2', weight: 1 },
                { questionId: 'q3', optionId: 'natural_3', weight: 1 },
                { questionId: 'q4', optionId: 'classico_4', weight: 1 },
                { questionId: 'q5', optionId: 'natural_5', weight: 1 },
                { questionId: 'q6', optionId: 'classico_6', weight: 1 },
                { questionId: 'q7', optionId: 'romantico_7', weight: 1 },
                { questionId: 'q8', optionId: 'romantico_8', weight: 1 },
                { questionId: 'q9', optionId: 'dramatico_9', weight: 1 },
                { questionId: 'q10', optionId: 'criativo_10', weight: 1 }
            ]
        },
        {
            name: 'Distribuição Equilibrada',
            description: 'Todos os estilos com pontuação similar',
            answers: [
                { questionId: 'q1', optionId: 'natural_1', weight: 1 },
                { questionId: 'q2', optionId: 'classico_2', weight: 1 },
                { questionId: 'q3', optionId: 'contemporaneo_3', weight: 1 },
                { questionId: 'q4', optionId: 'elegante_4', weight: 1 },
                { questionId: 'q5', optionId: 'romantico_5', weight: 1 },
                { questionId: 'q6', optionId: 'sexy_6', weight: 1 },
                { questionId: 'q7', optionId: 'dramatico_7', weight: 1 },
                { questionId: 'q8', optionId: 'criativo_8', weight: 1 },
                { questionId: 'q9', optionId: 'natural_9', weight: 1 },
                { questionId: 'q10', optionId: 'classico_10', weight: 1 }
            ]
        }
    ];

    // Inicializar com configuração atual
    useEffect(() => {
        if (config?.globalScoringConfig) {
            setCategories(config.globalScoringConfig.categories || []);
            setAlgorithm(config.globalScoringConfig.algorithm || algorithm);
            setResultCalculation(config.globalScoringConfig.resultCalculation || resultCalculation);
        }
    }, [config]);

    // Adicionar nova categoria
    const addCategory = () => {
        const newCategory: StyleCategory = {
            id: `style_${Date.now()}`,
            name: 'Novo Estilo',
            description: 'Descrição do novo estilo',
            color: '#' + Math.floor(Math.random() * 16777215).toString(16),
            weight: 1.0
        };
        setCategories([...categories, newCategory]);
        setIsModified(true);
    };

    // Remover categoria
    const removeCategory = (id: string) => {
        setCategories(categories.filter(cat => cat.id !== id));
        setIsModified(true);
    };

    // Atualizar categoria
    const updateCategory = (id: string, field: keyof StyleCategory, value: any) => {
        setCategories(categories.map(cat =>
            cat.id === id ? { ...cat, [field]: value } : cat
        ));
        setIsModified(true);
    };

    // Executar teste com cenário
    const runTestScenario = async (scenario: TestScenario) => {
        setIsTestRunning(true);

        try {
            // Criar configuração de teste
            const testConfig = {
                ...config,
                globalScoringConfig: {
                    categories,
                    algorithm,
                    resultCalculation
                }
            } as QuizRulesConfig;

            // Criar engine com configuração atual
            const engine = new UnifiedCalculationEngine(testConfig);

            // Executar cálculo
            const result = engine.calculateResults(scenario.answers, {
                includeUserData: true,
                userName: 'Teste NoCode',
                debug: true,
                tieBreakStrategy: algorithm.tieBreaker === 'first_selection' ? 'first-answer' : 'highest-score'
            });

            setTestResult({
                scenario: scenario.name,
                result,
                timestamp: new Date(),
                config: {
                    categories: categories.length,
                    algorithm: algorithm.type,
                    tieBreaker: algorithm.tieBreaker
                }
            });

            onTestResult?.(result);
        } catch (error) {
            console.error('Erro ao executar teste:', error);
            setTestResult({
                error: 'Erro ao executar cálculo: ' + (error as Error).message,
                scenario: scenario.name
            });
        }

        setIsTestRunning(false);
    };

    // Salvar configuração
    const saveConfiguration = () => {
        if (!config) return;

        const updatedConfig: QuizRulesConfig = {
            ...config,
            globalScoringConfig: {
                categories,
                algorithm,
                resultCalculation
            }
        };

        onConfigSave?.(updatedConfig);
        setIsModified(false);
    };

    // Exportar configuração
    const exportConfiguration = () => {
        const exportData = {
            categories,
            algorithm,
            resultCalculation,
            exportedAt: new Date().toISOString(),
            version: '1.0.0'
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quiz-calculation-config-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Calculator className="h-8 w-8 text-blue-600" />
                        Configurador de Cálculos
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Configure visualmente os algoritmos de cálculo de resultados do quiz
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={exportConfiguration}
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Exportar
                    </Button>

                    {isModified && (
                        <Button
                            onClick={saveConfiguration}
                            className="flex items-center gap-2"
                        >
                            <CheckCircle className="h-4 w-4" />
                            Salvar Alterações
                        </Button>
                    )}
                </div>
            </div>

            {/* Status */}
            {isModified && (
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Configuração Modificada</AlertTitle>
                    <AlertDescription>
                        Você fez alterações não salvas. Lembre-se de salvar antes de testar.
                    </AlertDescription>
                </Alert>
            )}

            {/* Tabs de Configuração */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="categories">Categorias de Estilo</TabsTrigger>
                    <TabsTrigger value="algorithm">Algoritmo</TabsTrigger>
                    <TabsTrigger value="results">Resultados</TabsTrigger>
                    <TabsTrigger value="testing">Testes</TabsTrigger>
                </TabsList>

                {/* Tab: Categorias */}
                <TabsContent value="categories" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Categorias de Estilo
                            </CardTitle>
                            <CardDescription>
                                Configure os estilos disponíveis e seus pesos no cálculo
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {categories.map((category) => (
                                <div key={category.id} className="border rounded-lg p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-6 h-6 rounded-full border-2"
                                                style={{ backgroundColor: category.color }}
                                            />
                                            <div>
                                                <h4 className="font-semibold">{category.name}</h4>
                                                <p className="text-sm text-gray-600">{category.description}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeCategory(category.id)}
                                        >
                                            Remover
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor={`name-${category.id}`}>Nome</Label>
                                            <Input
                                                id={`name-${category.id}`}
                                                value={category.name}
                                                onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`color-${category.id}`}>Cor</Label>
                                            <Input
                                                id={`color-${category.id}`}
                                                type="color"
                                                value={category.color}
                                                onChange={(e) => updateCategory(category.id, 'color', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor={`description-${category.id}`}>Descrição</Label>
                                        <Input
                                            id={`description-${category.id}`}
                                            value={category.description}
                                            onChange={(e) => updateCategory(category.id, 'description', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor={`weight-${category.id}`}>
                                            Peso: {category.weight}x
                                        </Label>
                                        <Slider
                                            value={[category.weight]}
                                            onValueChange={([value]) => updateCategory(category.id, 'weight', value)}
                                            min={0.1}
                                            max={3.0}
                                            step={0.1}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            ))}

                            <Button onClick={addCategory} variant="outline" className="w-full">
                                + Adicionar Categoria
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Algoritmo */}
                <TabsContent value="algorithm" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Configurações do Algoritmo
                            </CardTitle>
                            <CardDescription>
                                Defina como os pontos são calculados e distribuídos
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="normalWeight">Peso - Questões Normais</Label>
                                    <Slider
                                        value={[algorithm.normalQuestionWeight]}
                                        onValueChange={([value]) => {
                                            setAlgorithm({ ...algorithm, normalQuestionWeight: value });
                                            setIsModified(true);
                                        }}
                                        min={0.1}
                                        max={1.0}
                                        step={0.1}
                                        className="mt-2"
                                    />
                                    <p className="text-sm text-gray-600 mt-1">
                                        {(algorithm.normalQuestionWeight * 100).toFixed(0)}%
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="strategicWeight">Peso - Questões Estratégicas</Label>
                                    <Slider
                                        value={[algorithm.strategicQuestionWeight]}
                                        onValueChange={([value]) => {
                                            setAlgorithm({ ...algorithm, strategicQuestionWeight: value });
                                            setIsModified(true);
                                        }}
                                        min={0.0}
                                        max={0.9}
                                        step={0.1}
                                        className="mt-2"
                                    />
                                    <p className="text-sm text-gray-600 mt-1">
                                        {(algorithm.strategicQuestionWeight * 100).toFixed(0)}%
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <Label htmlFor="tieBreaker">Critério de Desempate</Label>
                                <Select
                                    value={algorithm.tieBreaker}
                                    onValueChange={(value) => {
                                        setAlgorithm({ ...algorithm, tieBreaker: value });
                                        setIsModified(true);
                                    }}
                                >
                                    <SelectTrigger className="mt-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="first_selection">Primeira Seleção</SelectItem>
                                        <SelectItem value="highest_score">Maior Pontuação</SelectItem>
                                        <SelectItem value="random">Aleatório</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="minDifference">Diferença Mínima de Pontuação</Label>
                                <Slider
                                    value={[algorithm.minimumScoreDifference]}
                                    onValueChange={([value]) => {
                                        setAlgorithm({ ...algorithm, minimumScoreDifference: value });
                                        setIsModified(true);
                                    }}
                                    min={0.05}
                                    max={0.5}
                                    step={0.05}
                                    className="mt-2"
                                />
                                <p className="text-sm text-gray-600 mt-1">
                                    {(algorithm.minimumScoreDifference * 100).toFixed(1)}%
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Resultados */}
                <TabsContent value="results" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                Configuração de Resultados
                            </CardTitle>
                            <CardDescription>
                                Configure como os resultados são exibidos
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="showPercentages">Mostrar Percentuais</Label>
                                    <p className="text-sm text-gray-600">Exibir percentual de cada estilo</p>
                                </div>
                                <Switch
                                    id="showPercentages"
                                    checked={resultCalculation.showPercentages}
                                    onCheckedChange={(checked) => {
                                        setResultCalculation({ ...resultCalculation, showPercentages: checked });
                                        setIsModified(true);
                                    }}
                                />
                            </div>

                            <div>
                                <Label htmlFor="roundTo">Arredondamento</Label>
                                <Select
                                    value={resultCalculation.roundTo.toString()}
                                    onValueChange={(value) => {
                                        setResultCalculation({ ...resultCalculation, roundTo: parseInt(value) });
                                        setIsModified(true);
                                    }}
                                >
                                    <SelectTrigger className="mt-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Número inteiro</SelectItem>
                                        <SelectItem value="1">1 casa decimal</SelectItem>
                                        <SelectItem value="2">2 casas decimais</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="secondaryStyles">Estilos Secundários</Label>
                                <Select
                                    value={resultCalculation.secondaryStyles}
                                    onValueChange={(value) => {
                                        setResultCalculation({ ...resultCalculation, secondaryStyles: value });
                                        setIsModified(true);
                                    }}
                                >
                                    <SelectTrigger className="mt-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="top_3_excluding_primary">Top 3 (excluindo primário)</SelectItem>
                                        <SelectItem value="top_5_excluding_primary">Top 5 (excluindo primário)</SelectItem>
                                        <SelectItem value="all_excluding_primary">Todos (excluindo primário)</SelectItem>
                                        <SelectItem value="none">Nenhum</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Testes */}
                <TabsContent value="testing" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Play className="h-5 w-5" />
                                Simulador de Testes
                            </CardTitle>
                            <CardDescription>
                                Teste diferentes cenários com a configuração atual
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {testScenarios.map((scenario) => (
                                    <Card key={scenario.name} className="cursor-pointer hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base">{scenario.name}</CardTitle>
                                            <CardDescription className="text-sm">
                                                {scenario.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Button
                                                onClick={() => runTestScenario(scenario)}
                                                disabled={isTestRunning}
                                                className="w-full"
                                                size="sm"
                                            >
                                                {isTestRunning ? 'Testando...' : 'Executar Teste'}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Resultado do Teste */}
                            {testResult && (
                                <Card className="mt-6">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            {testResult.error ? (
                                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                            ) : (
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                            )}
                                            Resultado: {testResult.scenario}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {testResult.error ? (
                                            <Alert variant="destructive">
                                                <AlertDescription>{testResult.error}</AlertDescription>
                                            </Alert>
                                        ) : (
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-semibold mb-2">Estilo Primário</h4>
                                                    <Badge variant="default" className="text-lg p-2">
                                                        {testResult.result.primaryStyle.category} - {testResult.result.primaryStyle.percentage}%
                                                    </Badge>
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold mb-2">Estilos Secundários</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {testResult.result.secondaryStyles.map((style: any) => (
                                                            <Badge key={style.category} variant="outline">
                                                                {style.category}: {style.percentage}%
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold mb-2">Distribuição Completa</h4>
                                                    <div className="text-sm font-mono bg-gray-50 p-3 rounded">
                                                        {JSON.stringify(testResult.result.scores, null, 2)}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default QuizCalculationConfigurator;