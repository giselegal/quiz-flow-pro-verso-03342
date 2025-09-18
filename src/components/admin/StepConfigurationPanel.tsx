/**
 * 🎛️ STEP BEHAVIOR CONFIGURATION PANEL
 * 
 * Interface NoCode para configurar comportamentos das etapas do quiz:
 * - Auto-avanço por etapa
 * - Delays personalizados
 * - Validações
 * - Regras de navegação
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import {
    Play,
    Pause,
    RotateCcw,
    Save,
    Zap,
    Shield
} from 'lucide-react';
import HybridTemplateService from '@/services/HybridTemplateService';

interface StepBehaviorConfig {
    stepNumber: number;
    autoAdvance: boolean;
    autoAdvanceDelay: number;
    showProgress: boolean;
    allowBack: boolean;
    validationType: 'input' | 'selection' | 'none';
    required: boolean;
    requiredSelections?: number;
    maxSelections?: number;
    minLength?: number;
    validationMessage: string;
}

interface StepConfigPanelProps {
    className?: string;
}

export const StepConfigurationPanel: React.FC<StepConfigPanelProps> = ({ className = '' }) => {
    const { toast } = useToast();
    const [configurations, setConfigurations] = useState<StepBehaviorConfig[]>([]);
    const [selectedStep, setSelectedStep] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Carregar configurações iniciais
    useEffect(() => {
        loadAllConfigurations();
    }, []);

    const loadAllConfigurations = async () => {
        setLoading(true);
        const configs: StepBehaviorConfig[] = [];

        try {
            for (let step = 1; step <= 21; step++) {
                const config = await HybridTemplateService.getStepConfig(step);
                configs.push({
                    stepNumber: step,
                    autoAdvance: config.behavior.autoAdvance,
                    autoAdvanceDelay: config.behavior.autoAdvanceDelay,
                    showProgress: config.behavior.showProgress,
                    allowBack: config.behavior.allowBack,
                    validationType: config.validation.type,
                    required: config.validation.required,
                    requiredSelections: config.validation.requiredSelections,
                    maxSelections: config.validation.maxSelections,
                    minLength: config.validation.minLength,
                    validationMessage: config.validation.message
                });
            }
            setConfigurations(configs);
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
            toast({
                title: "Erro",
                description: "Não foi possível carregar as configurações das etapas.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const updateStepConfig = (stepNumber: number, updates: Partial<StepBehaviorConfig>) => {
        setConfigurations(prev =>
            prev.map(config =>
                config.stepNumber === stepNumber
                    ? { ...config, ...updates }
                    : config
            )
        );
    };

    const saveConfiguration = async (stepNumber: number) => {
        setSaving(true);
        try {
            const config = configurations.find(c => c.stepNumber === stepNumber);
            if (!config) return;

            const stepTemplate = {
                behavior: {
                    autoAdvance: config.autoAdvance,
                    autoAdvanceDelay: config.autoAdvanceDelay,
                    showProgress: config.showProgress,
                    allowBack: config.allowBack,
                },
                validation: {
                    type: config.validationType,
                    required: config.required,
                    requiredSelections: config.requiredSelections,
                    maxSelections: config.maxSelections,
                    minLength: config.minLength,
                    message: config.validationMessage,
                }
            };

            await HybridTemplateService.saveStepOverride(stepNumber, stepTemplate);

            toast({
                title: "Configuração Salva!",
                description: `Etapa ${stepNumber} configurada com sucesso.`,
            });
        } catch (error) {
            console.error('Erro ao salvar:', error);
            toast({
                title: "Erro",
                description: "Não foi possível salvar a configuração.",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    const saveAllConfigurations = async () => {
        setSaving(true);
        try {
            for (const config of configurations) {
                await saveConfiguration(config.stepNumber);
            }
            toast({
                title: "Todas as Configurações Salvas!",
                description: "Todas as 21 etapas foram configuradas com sucesso.",
            });
        } catch (error) {
            console.error('Erro ao salvar todas:', error);
            toast({
                title: "Erro",
                description: "Erro ao salvar algumas configurações.",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    const resetToDefaults = async () => {
        HybridTemplateService.clearCache();
        await loadAllConfigurations();
        toast({
            title: "Configurações Resetadas",
            description: "Todas as configurações foram restauradas para o padrão.",
        });
    };

    const currentConfig = configurations.find(c => c.stepNumber === selectedStep);
    const autoAdvanceSteps = configurations.filter(c => c.autoAdvance).length;
    const manualSteps = configurations.filter(c => !c.autoAdvance).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B89B7A] mx-auto mb-4"></div>
                    <p className="text-[#8F7A6A]">Carregando configurações...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header com estatísticas */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#432818]">
                        <Zap className="w-5 h-5 text-[#B89B7A]" />
                        Configuração de Comportamentos das Etapas
                    </CardTitle>
                    <div className="flex gap-4 mt-4">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <Play className="w-3 h-3 mr-1" />
                            {autoAdvanceSteps} com Auto-avanço
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            <Pause className="w-3 h-3 mr-1" />
                            {manualSteps} Manuais
                        </Badge>
                        <Badge variant="outline">
                            Total: 21 etapas
                        </Badge>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lista de Etapas */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg text-[#432818]">
                            Selecionar Etapa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px]">
                            <div className="space-y-2">
                                {configurations.map((config) => (
                                    <Button
                                        key={config.stepNumber}
                                        variant={selectedStep === config.stepNumber ? "default" : "ghost"}
                                        onClick={() => setSelectedStep(config.stepNumber)}
                                        className="w-full justify-between"
                                        style={{
                                            backgroundColor: selectedStep === config.stepNumber ? '#B89B7A' : 'transparent',
                                            color: selectedStep === config.stepNumber ? 'white' : '#432818'
                                        }}
                                    >
                                        <span>Etapa {config.stepNumber}</span>
                                        <div className="flex items-center gap-1">
                                            {config.autoAdvance ? (
                                                <Play className="w-3 h-3 text-green-500" />
                                            ) : (
                                                <Pause className="w-3 h-3 text-blue-500" />
                                            )}
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Configurações da Etapa Selecionada */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between text-[#432818]">
                            <span>Configurar Etapa {selectedStep}</span>
                            <Button
                                onClick={() => saveConfiguration(selectedStep)}
                                disabled={saving}
                                className="bg-[#B89B7A] hover:bg-[#A0895B]"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Salvar
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {currentConfig && (
                            <Tabs defaultValue="behavior" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="behavior">
                                        <Zap className="w-4 h-4 mr-2" />
                                        Comportamento
                                    </TabsTrigger>
                                    <TabsTrigger value="validation">
                                        <Shield className="w-4 h-4 mr-2" />
                                        Validação
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="behavior" className="space-y-4">
                                    {/* Auto-avanço */}
                                    <div className="flex items-center justify-between p-4 border rounded">
                                        <div>
                                            <Label className="text-sm font-medium">Auto-avanço</Label>
                                            <p className="text-xs text-[#8F7A6A]">
                                                Avança automaticamente após seleção
                                            </p>
                                        </div>
                                        <Switch
                                            checked={currentConfig.autoAdvance}
                                            onCheckedChange={(checked) =>
                                                updateStepConfig(selectedStep, { autoAdvance: checked })
                                            }
                                        />
                                    </div>

                                    {/* Delay do Auto-avanço */}
                                    {currentConfig.autoAdvance && (
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">
                                                Delay do Auto-avanço: {currentConfig.autoAdvanceDelay}ms
                                            </Label>
                                            <Slider
                                                value={[currentConfig.autoAdvanceDelay]}
                                                onValueChange={(value) =>
                                                    updateStepConfig(selectedStep, { autoAdvanceDelay: value[0] })
                                                }
                                                min={500}
                                                max={5000}
                                                step={250}
                                                className="w-full"
                                            />
                                            <div className="flex justify-between text-xs text-[#8F7A6A]">
                                                <span>500ms (Rápido)</span>
                                                <span>5000ms (Lento)</span>
                                            </div>
                                        </div>
                                    )}

                                    <Separator />

                                    {/* Outras opções de comportamento */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="text-sm font-medium">Mostrar Progresso</Label>
                                                <p className="text-xs text-[#8F7A6A]">Exibir barra de progresso</p>
                                            </div>
                                            <Switch
                                                checked={currentConfig.showProgress}
                                                onCheckedChange={(checked) =>
                                                    updateStepConfig(selectedStep, { showProgress: checked })
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="text-sm font-medium">Permitir Voltar</Label>
                                                <p className="text-xs text-[#8F7A6A]">Usuário pode voltar à etapa anterior</p>
                                            </div>
                                            <Switch
                                                checked={currentConfig.allowBack}
                                                onCheckedChange={(checked) =>
                                                    updateStepConfig(selectedStep, { allowBack: checked })
                                                }
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="validation" className="space-y-4">
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-sm font-medium">Tipo de Validação</Label>
                                            <Select
                                                value={currentConfig.validationType}
                                                onValueChange={(value: 'input' | 'selection' | 'none') =>
                                                    updateStepConfig(selectedStep, { validationType: value })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="input">Campo de Entrada</SelectItem>
                                                    <SelectItem value="selection">Seleção de Opções</SelectItem>
                                                    <SelectItem value="none">Sem Validação</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm font-medium">Obrigatório</Label>
                                            <Switch
                                                checked={currentConfig.required}
                                                onCheckedChange={(checked) =>
                                                    updateStepConfig(selectedStep, { required: checked })
                                                }
                                            />
                                        </div>

                                        {currentConfig.validationType === 'selection' && (
                                            <>
                                                <div>
                                                    <Label className="text-sm font-medium">Seleções Obrigatórias</Label>
                                                    <Input
                                                        type="number"
                                                        value={currentConfig.requiredSelections || 1}
                                                        onChange={(e) =>
                                                            updateStepConfig(selectedStep, {
                                                                requiredSelections: parseInt(e.target.value) || 1
                                                            })
                                                        }
                                                        min={1}
                                                        max={10}
                                                    />
                                                </div>

                                                <div>
                                                    <Label className="text-sm font-medium">Máximo de Seleções</Label>
                                                    <Input
                                                        type="number"
                                                        value={currentConfig.maxSelections || 3}
                                                        onChange={(e) =>
                                                            updateStepConfig(selectedStep, {
                                                                maxSelections: parseInt(e.target.value) || 3
                                                            })
                                                        }
                                                        min={1}
                                                        max={10}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {currentConfig.validationType === 'input' && (
                                            <div>
                                                <Label className="text-sm font-medium">Tamanho Mínimo</Label>
                                                <Input
                                                    type="number"
                                                    value={currentConfig.minLength || 2}
                                                    onChange={(e) =>
                                                        updateStepConfig(selectedStep, {
                                                            minLength: parseInt(e.target.value) || 2
                                                        })
                                                    }
                                                    min={1}
                                                    max={100}
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <Label className="text-sm font-medium">Mensagem de Validação</Label>
                                            <Input
                                                value={currentConfig.validationMessage}
                                                onChange={(e) =>
                                                    updateStepConfig(selectedStep, { validationMessage: e.target.value })
                                                }
                                                placeholder="Mensagem exibida ao usuário"
                                            />
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Ações Globais */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={resetToDefaults}
                            className="border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A] hover:text-white"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Restaurar Padrões
                        </Button>

                        <Button
                            onClick={saveAllConfigurations}
                            disabled={saving}
                            className="bg-[#B89B7A] hover:bg-[#A0895B]"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Salvar Todas as Configurações
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StepConfigurationPanel;