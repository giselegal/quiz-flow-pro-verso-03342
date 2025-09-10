/**
 * 🔗 CONFIGURAÇÕES DE ETAPA - Integração no Painel de Propriedades
 * 
 * Este componente deve ser integrado no RegistryPropertiesPanel
 * quando uma etapa for selecionada, adicionando uma nova seção
 * para configurações específicas da etapa atual.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import {
    ArrowRight,
    Settings,
    Link as LinkIcon,
    Save,
    AlertTriangle,
    Plus,
    ExternalLink
} from 'lucide-react';

interface StepConfig {
    stepId: string;
    stepName: string;
    nextStep: string | 'conditional' | 'end';
    conditions?: {
        type: 'answer' | 'score' | 'always';
        operator?: '=' | '>' | '<' | '>=' | '<=';
        value?: string | number;
        questionId?: string;
    }[];
    requiredFields?: string[];
    isActive: boolean;
}

interface StepPropertiesSectionProps {
    currentStepId?: string;
    totalSteps?: number;
    onStepConfigChange?: (config: StepConfig) => void;
    className?: string;
}

const StepPropertiesSection: React.FC<StepPropertiesSectionProps> = ({
    currentStepId = "1",
    totalSteps = 21,
    onStepConfigChange,
    className = ""
}) => {
    const { toast } = useToast();

    const [stepConfig, setStepConfig] = useState<StepConfig>({
        stepId: currentStepId,
        stepName: `Etapa ${currentStepId}`,
        nextStep: 'linear',
        conditions: [],
        requiredFields: [],
        isActive: true
    });

    // Carregar configuração salva da etapa
    useEffect(() => {
        const savedConfig = localStorage.getItem(`step-config-${currentStepId}`);
        if (savedConfig) {
            try {
                setStepConfig(JSON.parse(savedConfig));
            } catch (error) {
                console.warn('Erro ao carregar configuração da etapa:', error);
            }
        }
    }, [currentStepId]);

    const saveStepConfig = () => {
        localStorage.setItem(`step-config-${currentStepId}`, JSON.stringify(stepConfig));
        onStepConfigChange?.(stepConfig);

        toast({
            title: "Configuração salva!",
            description: `Configurações da etapa ${currentStepId} foram salvas.`
        });
    };

    const updateStepConfig = (updates: Partial<StepConfig>) => {
        setStepConfig(prev => ({ ...prev, ...updates }));
    };

    const openGlobalConfig = () => {
        // Trigger para abrir o painel global NOCODE
        window.dispatchEvent(new CustomEvent('openNoCodePanel', {
            detail: { tab: 'connections' }
        }));
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header da Seção */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-medium text-gray-900">Configurações da Etapa</h3>
                    <Badge variant="outline">{currentStepId}</Badge>
                </div>
                <Button
                    onClick={saveStepConfig}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    <Save className="w-3 h-3 mr-1" />
                    Salvar
                </Button>
            </div>

            <Tabs defaultValue="basic" className="space-y-3">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Básico</TabsTrigger>
                    <TabsTrigger value="navigation">Navegação</TabsTrigger>
                    <TabsTrigger value="advanced">Avançado</TabsTrigger>
                </TabsList>

                {/* Configurações Básicas */}
                <TabsContent value="basic" className="space-y-3">
                    <div className="space-y-2">
                        <Label htmlFor="step-name">Nome da Etapa</Label>
                        <Input
                            id="step-name"
                            value={stepConfig.stepName}
                            onChange={(e) => updateStepConfig({ stepName: e.target.value })}
                            placeholder="Ex: Pergunta sobre personalidade"
                            className="text-sm"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={stepConfig.isActive}
                            onCheckedChange={(checked) => updateStepConfig({ isActive: checked })}
                        />
                        <Label className="text-sm">Etapa ativa</Label>
                    </div>
                </TabsContent>

                {/* Configurações de Navegação */}
                <TabsContent value="navigation" className="space-y-3">
                    <div className="space-y-2">
                        <Label htmlFor="next-step">Próxima Etapa</Label>
                        <Select
                            value={stepConfig.nextStep}
                            onValueChange={(value) => updateStepConfig({ nextStep: value })}
                        >
                            <SelectTrigger className="text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="linear">Linear (próxima em sequência)</SelectItem>
                                <SelectItem value="conditional">Condicional</SelectItem>
                                {Array.from({ length: totalSteps }, (_, i) => {
                                    const stepNum = i + 1;
                                    return (
                                        <SelectItem key={stepNum} value={stepNum.toString()}>
                                            Etapa {stepNum}
                                        </SelectItem>
                                    );
                                })}
                                <SelectItem value="end">🎯 Página de Resultado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {stepConfig.nextStep === 'conditional' && (
                        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                            <div className="flex items-center gap-2 text-amber-800 mb-2">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="text-sm font-medium">Navegação Condicional</span>
                            </div>
                            <p className="text-xs text-amber-700 mb-2">
                                A próxima etapa será determinada baseada nas respostas do usuário.
                            </p>
                            <Button
                                onClick={openGlobalConfig}
                                size="sm"
                                variant="outline"
                                className="border-amber-300 text-amber-800 hover:bg-amber-100"
                            >
                                <Settings className="w-3 h-3 mr-1" />
                                Configurar Condições
                            </Button>
                        </div>
                    )}

                    {/* Preview da navegação */}
                    <div className="p-3 rounded-lg bg-gray-50 border">
                        <div className="text-xs font-medium text-gray-700 mb-2">Preview da Navegação:</div>
                        <div className="flex items-center gap-2 text-sm">
                            <Badge variant="outline">Etapa {currentStepId}</Badge>
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                            <Badge variant={stepConfig.nextStep === 'end' ? 'destructive' : 'secondary'}>
                                {stepConfig.nextStep === 'linear' ? `Etapa ${parseInt(currentStepId) + 1}` :
                                    stepConfig.nextStep === 'conditional' ? 'Condicional' :
                                        stepConfig.nextStep === 'end' ? 'Resultado' :
                                            `Etapa ${stepConfig.nextStep}`}
                            </Badge>
                        </div>
                    </div>
                </TabsContent>

                {/* Configurações Avançadas */}
                <TabsContent value="advanced" className="space-y-3">
                    <div className="space-y-2">
                        <Label className="text-sm">Campos Obrigatórios</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Nome do campo"
                                className="text-sm"
                            />
                            <Button size="sm" variant="outline">
                                <Plus className="w-3 h-3" />
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500">
                            Campos que devem ser preenchidos antes de avançar
                        </p>
                    </div>

                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <div className="flex items-center gap-2 text-blue-800 mb-2">
                            <LinkIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Configuração Global</span>
                        </div>
                        <p className="text-xs text-blue-700 mb-2">
                            Para configurações que afetam todo o funil, use o painel de configurações globais.
                        </p>
                        <Button
                            onClick={openGlobalConfig}
                            size="sm"
                            variant="outline"
                            className="border-blue-300 text-blue-800 hover:bg-blue-100"
                        >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Abrir Configurações NOCODE
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Status da Configuração */}
            <div className="flex items-center justify-between p-2 rounded bg-gray-50 border text-xs">
                <span className="text-gray-600">
                    Status: {stepConfig.isActive ? '✅ Ativa' : '❌ Inativa'}
                </span>
                <span className="text-gray-600">
                    Próxima: {stepConfig.nextStep === 'linear' ? 'Linear' :
                        stepConfig.nextStep === 'conditional' ? 'Condicional' :
                            stepConfig.nextStep}
                </span>
            </div>
        </div>
    );
};

export default StepPropertiesSection;
