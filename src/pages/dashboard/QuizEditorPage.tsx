/**
 * ✏️ PÁGINA DE EDIÇÃO DE QUIZ NO DASHBOARD
 * 
 * Interface para editar o modelo do quiz usando HybridTemplateService
 * com integração completa ao sistema de templates
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
    Save,
    RefreshCw,
    Eye,
    Settings,
    Palette,
    ArrowRight,
    ArrowLeft,
    Plus,
    Trash2,
    Edit3,
    Check,
    X,
    FileText,
    Zap,
    Target
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import HybridTemplateService from '@/services/HybridTemplateService';
import type { StepTemplate, MasterTemplate } from '@/services/HybridTemplateService';

// ============================================================================
// INTERFACES
// ============================================================================

interface QuizStep {
    id: string;
    number: number;
    name: string;
    description: string;
    type: string;
    category: string;
    autoAdvance: boolean;
    autoAdvanceDelay: number;
    showProgress: boolean;
    allowBack: boolean;
    validationType: string;
    required: boolean;
    message: string;
    blocksCount: number;
}

interface GlobalConfig {
    branding: {
        primaryColor: string;
        secondaryColor: string;
        backgroundColor: string;
        logoUrl: string;
        logoAlt: string;
    };
    navigation: {
        autoAdvanceSteps: number[];
        manualAdvanceSteps: number[];
        transitionSteps: number[];
        autoAdvanceDelay: number;
    };
    scoring: {
        categories: string[];
        algorithm: {
            type: string;
            normalQuestionWeight: number;
            strategicQuestionWeight: number;
            minimumScoreDifference: number;
            tieBreaker: string;
        };
    };
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const QuizEditorDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [quizSteps, setQuizSteps] = useState<QuizStep[]>([]);
    const [globalConfig, setGlobalConfig] = useState<GlobalConfig | null>(null);
    const [selectedStep, setSelectedStep] = useState<number>(1);
    const [stepConfig, setStepConfig] = useState<StepTemplate | null>(null);
    const [masterTemplate, setMasterTemplate] = useState<MasterTemplate | null>(null);

    // ========================================================================
    // CARREGAR DADOS INICIAIS
    // ========================================================================

    useEffect(() => {
        loadQuizData();
    }, []);

    const loadQuizData = async () => {
        try {
            setLoading(true);

            // Carregar estatísticas do template master
            const stats = HybridTemplateService.getMasterTemplateStats();

            // Carregar configurações globais
            const global = HybridTemplateService.getGlobalConfig();
            setGlobalConfig(global);

            // Carregar todos os steps
            const steps: QuizStep[] = [];
            for (let i = 1; i <= 21; i++) {
                const stepConfig = await HybridTemplateService.getStepConfig(i);
                steps.push({
                    id: `step-${i}`,
                    number: i,
                    name: stepConfig.metadata.name,
                    description: stepConfig.metadata.description,
                    type: stepConfig.metadata.type,
                    category: stepConfig.metadata.category,
                    autoAdvance: stepConfig.behavior.autoAdvance,
                    autoAdvanceDelay: stepConfig.behavior.autoAdvanceDelay,
                    showProgress: stepConfig.behavior.showProgress,
                    allowBack: stepConfig.behavior.allowBack,
                    validationType: stepConfig.validation.type,
                    required: stepConfig.validation.required,
                    message: stepConfig.validation.message,
                    blocksCount: stepConfig.blocks?.length || 0
                });
            }
            setQuizSteps(steps);

            // Carregar configuração do primeiro step
            const firstStep = await HybridTemplateService.getStepConfig(1);
            setStepConfig(firstStep);

            toast({
                title: "✅ Quiz carregado com sucesso",
                description: `${steps.length} etapas carregadas`,
            });

        } catch (error) {
            console.error('Erro ao carregar quiz:', error);
            toast({
                title: "❌ Erro ao carregar quiz",
                description: "Não foi possível carregar os dados do quiz",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    // ========================================================================
    // SELEÇÃO DE STEP
    // ========================================================================

    const handleStepSelect = async (stepNumber: number) => {
        try {
            setSelectedStep(stepNumber);
            const config = await HybridTemplateService.getStepConfig(stepNumber);
            setStepConfig(config);
        } catch (error) {
            console.error('Erro ao carregar step:', error);
            toast({
                title: "❌ Erro ao carregar etapa",
                description: "Não foi possível carregar a configuração da etapa",
                variant: "destructive"
            });
        }
    };

    // ========================================================================
    // SALVAR ALTERAÇÕES
    // ========================================================================

    const handleSaveStep = async () => {
        if (!stepConfig) return;

        try {
            setSaving(true);

            // Salvar via HybridTemplateService
            await HybridTemplateService.saveStepOverride(selectedStep, stepConfig);

            // Atualizar lista local
            setQuizSteps(prev => prev.map(step =>
                step.number === selectedStep
                    ? {
                        ...step,
                        name: stepConfig.metadata.name,
                        description: stepConfig.metadata.description,
                        type: stepConfig.metadata.type,
                        category: stepConfig.metadata.category,
                        autoAdvance: stepConfig.behavior.autoAdvance,
                        autoAdvanceDelay: stepConfig.behavior.autoAdvanceDelay,
                        showProgress: stepConfig.behavior.showProgress,
                        allowBack: stepConfig.behavior.allowBack,
                        validationType: stepConfig.validation.type,
                        required: stepConfig.validation.required,
                        message: stepConfig.validation.message
                    }
                    : step
            ));

            toast({
                title: "✅ Etapa salva com sucesso",
                description: `Step ${selectedStep} foi atualizada`,
            });

        } catch (error) {
            console.error('Erro ao salvar step:', error);
            toast({
                title: "❌ Erro ao salvar",
                description: "Não foi possível salvar as alterações",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    // ========================================================================
    // ATUALIZAR CONFIGURAÇÃO DO STEP
    // ========================================================================

    const updateStepConfig = (updates: Partial<StepTemplate>) => {
        setStepConfig(prev => prev ? { ...prev, ...updates } : null);
    };

    const updateMetadata = (field: string, value: string) => {
        updateStepConfig({
            metadata: {
                ...stepConfig?.metadata,
                [field]: value
            }
        });
    };

    const updateBehavior = (field: string, value: any) => {
        updateStepConfig({
            behavior: {
                ...stepConfig?.behavior,
                [field]: value
            }
        });
    };

    const updateValidation = (field: string, value: any) => {
        updateStepConfig({
            validation: {
                ...stepConfig?.validation,
                [field]: value
            }
        });
    };

    // ========================================================================
    // RENDER - LOADING
    // ========================================================================

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-600" />
                    <p className="text-gray-600">Carregando editor do quiz...</p>
                </div>
            </div>
        );
    }

    // ========================================================================
    // RENDER - PRINCIPAL
    // ========================================================================

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Editor de Quiz</h1>
                    <p className="text-gray-600">Gerencie o modelo e configurações do quiz de estilo pessoal</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" onClick={loadQuizData}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Recarregar
                    </Button>
                    <Button onClick={handleSaveStep} disabled={saving}>
                        {saving ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        Salvar Alterações
                    </Button>
                </div>
            </div>

            {/* ESTATÍSTICAS GERAIS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <FileText className="w-8 h-8 text-blue-600" />
                            <div>
                                <p className="text-2xl font-bold">{quizSteps.length}</p>
                                <p className="text-sm text-gray-600">Etapas Total</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <Zap className="w-8 h-8 text-green-600" />
                            <div>
                                <p className="text-2xl font-bold">{quizSteps.filter(s => s.autoAdvance).length}</p>
                                <p className="text-sm text-gray-600">Auto-advance</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <Target className="w-8 h-8 text-purple-600" />
                            <div>
                                <p className="text-2xl font-bold">{globalConfig?.scoring?.categories?.length || 0}</p>
                                <p className="text-sm text-gray-600">Estilos</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <Eye className="w-8 h-8 text-orange-600" />
                            <div>
                                <p className="text-2xl font-bold">{stepConfig?.blocks?.length || 0}</p>
                                <p className="text-sm text-gray-600">Blocks Selecionado</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* CONTEÚDO PRINCIPAL */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* LISTA DE STEPS */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Etapas do Quiz</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="max-h-96 overflow-y-auto">
                            {quizSteps.map((step) => (
                                <div
                                    key={step.id}
                                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${selectedStep === step.number ? 'bg-blue-50 border-blue-200' : ''
                                        }`}
                                    onClick={() => handleStepSelect(step.number)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Step {step.number}</p>
                                            <p className="text-sm text-gray-600 truncate">{step.name}</p>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Badge variant={step.autoAdvance ? "default" : "secondary"} className="text-xs">
                                                {step.type}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="mt-1">
                                        <p className="text-xs text-gray-500">{step.blocksCount} blocks</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* EDITOR DO STEP SELECIONADO */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Editando Step {selectedStep}</CardTitle>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => selectedStep > 1 && handleStepSelect(selectedStep - 1)}
                                    disabled={selectedStep <= 1}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => selectedStep < 21 && handleStepSelect(selectedStep + 1)}
                                    disabled={selectedStep >= 21}
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {stepConfig ? (
                            <Tabs defaultValue="metadata" className="space-y-4">
                                <TabsList>
                                    <TabsTrigger value="metadata">Metadados</TabsTrigger>
                                    <TabsTrigger value="behavior">Comportamento</TabsTrigger>
                                    <TabsTrigger value="validation">Validação</TabsTrigger>
                                    <TabsTrigger value="blocks">Blocks ({stepConfig.blocks?.length || 0})</TabsTrigger>
                                </TabsList>

                                <TabsContent value="metadata" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="step-name">Nome da Etapa</Label>
                                            <Input
                                                id="step-name"
                                                value={stepConfig.metadata.name}
                                                onChange={(e) => updateMetadata('name', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="step-type">Tipo</Label>
                                            <Input
                                                id="step-type"
                                                value={stepConfig.metadata.type}
                                                onChange={(e) => updateMetadata('type', e.target.value)}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label htmlFor="step-description">Descrição</Label>
                                            <Textarea
                                                id="step-description"
                                                value={stepConfig.metadata.description}
                                                onChange={(e) => updateMetadata('description', e.target.value)}
                                                rows={3}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="step-category">Categoria</Label>
                                            <Input
                                                id="step-category"
                                                value={stepConfig.metadata.category}
                                                onChange={(e) => updateMetadata('category', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="behavior" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="auto-advance">Auto Advance</Label>
                                            <Switch
                                                id="auto-advance"
                                                checked={stepConfig.behavior.autoAdvance}
                                                onCheckedChange={(checked) => updateBehavior('autoAdvance', checked)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="auto-advance-delay">Delay (ms)</Label>
                                            <Input
                                                id="auto-advance-delay"
                                                type="number"
                                                value={stepConfig.behavior.autoAdvanceDelay}
                                                onChange={(e) => updateBehavior('autoAdvanceDelay', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="show-progress">Mostrar Progresso</Label>
                                            <Switch
                                                id="show-progress"
                                                checked={stepConfig.behavior.showProgress}
                                                onCheckedChange={(checked) => updateBehavior('showProgress', checked)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="allow-back">Permitir Voltar</Label>
                                            <Switch
                                                id="allow-back"
                                                checked={stepConfig.behavior.allowBack}
                                                onCheckedChange={(checked) => updateBehavior('allowBack', checked)}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="validation" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="validation-type">Tipo de Validação</Label>
                                            <Input
                                                id="validation-type"
                                                value={stepConfig.validation.type}
                                                onChange={(e) => updateValidation('type', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="validation-required">Obrigatório</Label>
                                            <Switch
                                                id="validation-required"
                                                checked={stepConfig.validation.required}
                                                onCheckedChange={(checked) => updateValidation('required', checked)}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label htmlFor="validation-message">Mensagem de Validação</Label>
                                            <Textarea
                                                id="validation-message"
                                                value={stepConfig.validation.message}
                                                onChange={(e) => updateValidation('message', e.target.value)}
                                                rows={2}
                                            />
                                        </div>
                                        {stepConfig.validation.requiredSelections && (
                                            <div>
                                                <Label htmlFor="required-selections">Seleções Obrigatórias</Label>
                                                <Input
                                                    id="required-selections"
                                                    type="number"
                                                    value={stepConfig.validation.requiredSelections}
                                                    onChange={(e) => updateValidation('requiredSelections', parseInt(e.target.value))}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="blocks" className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-medium">Blocks da Etapa</h3>
                                            <Badge>{stepConfig.blocks?.length || 0} blocks</Badge>
                                        </div>
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {stepConfig.blocks?.map((block, index) => (
                                                <div key={index} className="bg-white p-3 rounded border">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium text-sm">{block.type}</p>
                                                            <p className="text-xs text-gray-500">ID: {block.id}</p>
                                                        </div>
                                                        <Badge variant="outline" className="text-xs">
                                                            Order: {block.order}
                                                        </Badge>
                                                    </div>
                                                    {block.content?.question && (
                                                        <p className="text-sm text-gray-700 mt-1 truncate">
                                                            {block.content.question}
                                                        </p>
                                                    )}
                                                </div>
                                            )) || (
                                                    <p className="text-gray-500 text-center py-4">Nenhum block encontrado</p>
                                                )}
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Selecione uma etapa para editar</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default QuizEditorDashboard;