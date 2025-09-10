/**
 * 🔗 DEMO DE INTEGRAÇÃO - Painel de Propriedades com Configurações de Etapa
 * 
 * Este componente demonstra como o painel de propriedades se integra
 * com as configurações NOCODE de etapas do funil.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RegistryPropertiesPanel from '@/components/universal/RegistryPropertiesPanel';
import StepPropertiesSection from '@/components/editor/StepPropertiesSection';
import { ArrowRight, Settings, Play, Eye } from 'lucide-react';

const DemoIntegracaoEtapas: React.FC = () => {
    const [selectedStepId, setSelectedStepId] = useState("3");
    const [showPropertiesPanel, setShowPropertiesPanel] = useState(true);
    const [propertiesOnly, setPropertiesOnly] = useState(false);

    // Mock de bloco/etapa selecionado
    const mockSelectedBlock = {
        id: `step-${selectedStepId}`,
        type: 'step',
        stepNumber: selectedStepId,
        totalSteps: 21,
        title: `Etapa ${selectedStepId}`,
        content: 'Configuração de etapa do funil'
    };

    const mockBlockDef = {
        title: `Quiz Etapa ${selectedStepId}`,
        icon: '❓',
        propsSchema: [
            {
                key: 'question',
                type: 'text',
                label: 'Pergunta',
                category: 'content',
                required: true
            },
            {
                key: 'options',
                type: 'array',
                label: 'Opções de Resposta',
                category: 'content',
                items: { type: 'text' }
            },
            {
                key: 'backgroundColor',
                type: 'color',
                label: 'Cor de Fundo',
                category: 'style',
                defaultValue: '#ffffff'
            },
            {
                key: 'isRequired',
                type: 'boolean',
                label: 'Campo Obrigatório',
                category: 'validation',
                defaultValue: true
            }
        ]
    };

    const handleUpdate = (blockId: string, updates: Record<string, any>) => {
        console.log('📝 Atualização do bloco:', blockId, updates);
    };

    const handleDelete = (blockId: string) => {
        console.log('🗑️ Deletar bloco:', blockId);
    };

    const handleClose = () => {
        setShowPropertiesPanel(false);
    };

    return (
        <div className="h-screen bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

                {/* Coluna 1: Controles de Demo */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Settings className="w-5 h-5 text-blue-600" />
                                Demo - Configurações NOCODE
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Etapa Selecionada:
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(step => (
                                        <Button
                                            key={step}
                                            size="sm"
                                            variant={selectedStepId === step.toString() ? "default" : "outline"}
                                            onClick={() => setSelectedStepId(step.toString())}
                                            className="text-xs"
                                        >
                                            {step}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Button
                                    onClick={() => setShowPropertiesPanel(!showPropertiesPanel)}
                                    variant={showPropertiesPanel ? "default" : "outline"}
                                    className="w-full"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    {showPropertiesPanel ? 'Ocultar' : 'Mostrar'} Painel de Propriedades
                                </Button>

                                <Button
                                    onClick={() => setPropertiesOnly(!propertiesOnly)}
                                    variant={propertiesOnly ? "default" : "outline"}
                                    className="w-full"
                                >
                                    <ArrowRight className="w-4 h-4 mr-2" />
                                    {propertiesOnly ? 'Painel Completo' : 'Só Configurações da Etapa'}
                                </Button>
                            </div>

                            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                                <div className="text-sm font-medium text-blue-800 mb-2">
                                    Status da Integração:
                                </div>
                                <div className="space-y-1 text-xs text-blue-700">
                                    <div>✅ Configurações de etapa integradas</div>
                                    <div>✅ Painel de propriedades funcional</div>
                                    <div>✅ Persistência no localStorage</div>
                                    <div>✅ UI/UX híbrida implementada</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preview das configurações salvas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                📊 Configurações Salvas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-gray-600">
                                As configurações da etapa {selectedStepId} serão exibidas aqui após serem salvas.
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Coluna 2: StepPropertiesSection isolado (se selecionado) */}
                {propertiesOnly && (
                    <div className="bg-white rounded-lg border shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <ArrowRight className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-lg font-semibold text-gray-900">
                                Configurações da Etapa (Isolado)
                            </h3>
                            <Badge variant="outline">Etapa {selectedStepId}</Badge>
                        </div>

                        <StepPropertiesSection
                            currentStepId={selectedStepId}
                            totalSteps={21}
                            onStepConfigChange={(config) => {
                                console.log('Configuração atualizada (isolado):', config);
                            }}
                        />
                    </div>
                )}

                {/* Coluna 3: RegistryPropertiesPanel completo */}
                {showPropertiesPanel && (
                    <div className={`${propertiesOnly ? 'lg:col-span-1' : 'lg:col-span-2'} bg-white rounded-lg border shadow-sm overflow-hidden`}>
                        <div className="h-full">
                            <RegistryPropertiesPanel
                                selectedBlock={mockSelectedBlock}
                                onUpdate={handleUpdate}
                                onClose={handleClose}
                                onDelete={handleDelete}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DemoIntegracaoEtapas;
