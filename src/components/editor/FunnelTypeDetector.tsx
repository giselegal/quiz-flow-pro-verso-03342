/**
 * 🔍 DETECTOR DE TIPO DE FUNIL
 * 
 * Componente que detecta automaticamente o tipo de funil baseado no ID
 * e carrega a configuração apropriada para o editor
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    RefreshCw,
    Target,
    FileText,
    ShoppingCart,
    Users,
    HelpCircle,
    AlertCircle,
    CheckCircle,
    Settings
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

import {
    getFunnelType,
    loadFunnelConfig,
    isPredefinedFunnel,
    getPredefinedFunnelConfig,
    type FunnelType
} from '@/services/FunnelTypesRegistry';

// ============================================================================
// INTERFACES
// ============================================================================

interface FunnelDetectorProps {
    funnelId: string;
    onFunnelLoaded: (funnelData: any) => void;
    onTypeDetected: (funnelType: FunnelType) => void;
}

interface DetectedFunnel {
    id: string;
    type: FunnelType;
    config: any;
    isPredefined: boolean;
}

// ============================================================================
// ÍCONES POR CATEGORIA
// ============================================================================

const CATEGORY_ICONS = {
    'quiz': Target,
    'landing': FileText,
    'ecommerce': ShoppingCart,
    'lead-gen': Users,
    'survey': HelpCircle,
    'other': Settings
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const FunnelTypeDetector: React.FC<FunnelDetectorProps> = ({
    funnelId,
    onFunnelLoaded,
    onTypeDetected
}) => {
    const [loading, setLoading] = useState(true);
    const [detectedFunnel, setDetectedFunnel] = useState<DetectedFunnel | null>(null);
    const [error, setError] = useState<string | null>(null);

    // ========================================================================
    // DETECTAR TIPO DE FUNIL
    // ========================================================================

    useEffect(() => {
        detectFunnelType();
    }, [funnelId]);

    const detectFunnelType = async () => {
        if (!funnelId) return;

        try {
            setLoading(true);
            setError(null);

            console.log('🔍 Detectando tipo de funil para ID:', funnelId);

            let typeId: string;

            // 1. Verificar se é funil predefinido
            if (isPredefinedFunnel(funnelId)) {
                const predefined = getPredefinedFunnelConfig(funnelId);
                typeId = predefined!.typeId;
                console.log('✅ Funil predefinido detectado:', typeId);
            }
            // 2. Detectar por padrões no ID
            else if (funnelId.includes('quiz') || funnelId.includes('estilo')) {
                typeId = 'quiz-estilo-21-steps';
                console.log('✅ Quiz detectado por padrão no ID');
            }
            else if (funnelId.includes('landing')) {
                typeId = 'landing-page';
                console.log('✅ Landing page detectada por padrão no ID');
            }
            else if (funnelId.includes('sales') || funnelId.includes('vendas')) {
                typeId = 'sales-funnel';
                console.log('✅ Funil de vendas detectado por padrão no ID');
            }
            else if (funnelId.includes('lead')) {
                typeId = 'lead-magnet';
                console.log('✅ Lead magnet detectado por padrão no ID');
            }
            // 3. Default para quiz se não conseguir detectar
            else {
                typeId = 'quiz-estilo-21-steps';
                console.log('⚠️ Tipo não detectado, usando quiz como padrão');
            }

            // Obter configuração do tipo
            const funnelType = getFunnelType(typeId);
            if (!funnelType) {
                throw new Error(`Tipo de funil não encontrado: ${typeId}`);
            }

            // Carregar configuração do funil
            console.log('📖 Carregando configuração do funil...');
            const funnelConfig = await loadFunnelConfig(funnelId, typeId);

            const detected: DetectedFunnel = {
                id: funnelId,
                type: funnelType,
                config: funnelConfig,
                isPredefined: isPredefinedFunnel(funnelId)
            };

            setDetectedFunnel(detected);

            // Notificar componentes pai
            onTypeDetected(funnelType);
            onFunnelLoaded(funnelConfig);

            toast({
                title: "✅ Funil detectado com sucesso",
                description: `${funnelType.name} carregado`,
            });

        } catch (error) {
            console.error('❌ Erro na detecção do funil:', error);
            setError(error instanceof Error ? error.message : 'Erro desconhecido');

            toast({
                title: "❌ Erro na detecção",
                description: "Não foi possível detectar o tipo do funil",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    // ========================================================================
    // RENDER - LOADING
    // ========================================================================

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center">
                        <div className="text-center">
                            <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin text-blue-600" />
                            <p className="text-gray-600">Detectando tipo de funil...</p>
                            <p className="text-sm text-gray-500 mt-1">ID: {funnelId}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // ========================================================================
    // RENDER - ERROR
    // ========================================================================

    if (error) {
        return (
            <Card className="border-red-200">
                <CardContent className="p-6">
                    <div className="flex items-center justify-center">
                        <div className="text-center">
                            <AlertCircle className="w-8 h-8 mx-auto mb-3 text-red-600" />
                            <p className="text-red-800 font-medium">Erro na Detecção</p>
                            <p className="text-red-600 text-sm mt-1">{error}</p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-3"
                                onClick={detectFunnelType}
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Tentar Novamente
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // ========================================================================
    // RENDER - SUCCESS
    // ========================================================================

    if (!detectedFunnel) return null;

    const { type, config, isPredefined } = detectedFunnel;
    const IconComponent = CATEGORY_ICONS[type.category];

    return (
        <Card className="border-green-200 bg-green-50/50">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                            <IconComponent className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <CardTitle className="text-green-900">{type.name}</CardTitle>
                            <p className="text-sm text-green-700">{type.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {isPredefined && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                Predefinido
                            </Badge>
                        )}
                        <Badge variant="default" className="bg-green-100 text-green-800">
                            {type.category.charAt(0).toUpperCase() + type.category.slice(1)}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">ID do Funil</p>
                        <p className="font-medium text-gray-900 truncate">{detectedFunnel.id}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Etapas</p>
                        <p className="font-medium text-gray-900">
                            {config.totalSteps || type.defaultSteps}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500">Suporte IA</p>
                        <div className="flex items-center space-x-1">
                            {type.supportsAI ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-gray-400" />
                            )}
                            <p className="font-medium text-gray-900">
                                {type.supportsAI ? 'Sim' : 'Não'}
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500">Lógica Customizada</p>
                        <div className="flex items-center space-x-1">
                            {type.hasCustomLogic ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-gray-400" />
                            )}
                            <p className="font-medium text-gray-900">
                                {type.hasCustomLogic ? 'Sim' : 'Não'}
                            </p>
                        </div>
                    </div>
                </div>

                <Separator className="my-4" />

                <div className="text-xs text-gray-600">
                    <p><strong>Configurações do Editor:</strong></p>
                    <ul className="mt-1 space-y-1">
                        {type.editorConfig.showStepNavigation && (
                            <li>• Navegação entre etapas habilitada</li>
                        )}
                        {type.editorConfig.showProgressBar && (
                            <li>• Barra de progresso habilitada</li>
                        )}
                        {type.editorConfig.allowReordering && (
                            <li>• Reordenação de etapas permitida</li>
                        )}
                        {type.editorConfig.supportsDragDrop && (
                            <li>• Drag & Drop habilitado</li>
                        )}
                        {type.editorConfig.customComponents && (
                            <li>• Componentes customizados: {type.editorConfig.customComponents.join(', ')}</li>
                        )}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};

export default FunnelTypeDetector;