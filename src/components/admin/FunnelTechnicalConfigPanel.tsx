/**
 * 🔧 FUNNEL TECHNICAL CONFIG PANEL
 * 
 * Painel de configurações técnicas centralizado no painel de funis
 * Move configurações técnicas do editor para separação GESTÃO vs CRIAÇÃO
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrandKitManager from './BrandKitManager';
import FunnelAnalyticsDashboard from './FunnelAnalyticsDashboard';
import {
    Settings,
    Globe,
    Link as LinkIcon,
    BarChart3 as Analytics,
    Zap,
    Save,
    RefreshCw,
    Palette
} from 'lucide-react';
import { NoCodeConfigPanel } from '@/pages/admin/NoCodeConfigPage';
import GlobalConfigPanel from '@/components/editor/GlobalConfigPanel';
import StepNoCodeConnections from '@/components/editor/StepNoCodeConnections';
import { StorageService } from '@/services/core/StorageService';

interface FunnelTechnicalConfigPanelProps {
    funnelId?: string;
    className?: string;
    onConfigUpdate?: (config: any) => void;
}

const FunnelTechnicalConfigPanel: React.FC<FunnelTechnicalConfigPanelProps> = ({
    funnelId,
    className = '',
    onConfigUpdate
}) => {
    const [activeTab, setActiveTab] = useState('connections');
    const [isLoading, setIsLoading] = useState(false);

    // Verificar se há configurações salvas
    const hasConnectionsConfig = StorageService.safeGetString('quiz-step-connections') !== null;
    const hasNoCodeConfig = StorageService.safeGetString('quiz-nocode-config') !== null;
    const hasGlobalConfig = StorageService.safeGetString('quiz-global-config') !== null;

    const configCount = [hasConnectionsConfig, hasNoCodeConfig, hasGlobalConfig].filter(Boolean).length;

    const handleSaveAll = async () => {
        setIsLoading(true);
        try {
            // Consolidar todas as configurações
            const allConfigs = {
                connections: StorageService.safeGetString('quiz-step-connections'),
                nocode: StorageService.safeGetString('quiz-nocode-config'),
                global: StorageService.safeGetString('quiz-global-config')
            };

            // Callback para notificar mudanças
            onConfigUpdate?.(allConfigs);

            // Simular save
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            console.error('Erro ao salvar configurações:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetAllConfigs = () => {
        StorageService.safeRemove('quiz-step-connections');
        StorageService.safeRemove('quiz-nocode-config');
        StorageService.safeRemove('quiz-global-config');
        window.location.reload();
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Settings className="w-5 h-5 text-blue-600" />
                            <span>Configurações Técnicas do Funil</span>
                            {configCount > 0 && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                    {configCount} configuradas
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={resetAllConfigs}
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Reset
                            </Button>
                            <Button
                                onClick={handleSaveAll}
                                disabled={isLoading || configCount === 0}
                                className="bg-blue-600 hover:bg-blue-700"
                                size="sm"
                            >
                                {isLoading ? (
                                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4 mr-1" />
                                )}
                                Salvar Tudo
                            </Button>
                        </div>
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        Configure aspectos técnicos do seu funil: fluxo, SEO, domínio, analytics e integrações.
                        {funnelId && (
                            <span className="block mt-1 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                Funil ID: {funnelId}
                            </span>
                        )}
                    </p>
                </CardHeader>
            </Card>

            {/* Tabs de Configuração */}
            <Card>
                <CardContent className="p-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="border-b px-6 pt-6">
                            <TabsList className="grid grid-cols-5 w-full max-w-3xl">
                                <TabsTrigger value="connections" className="flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4" />
                                    Fluxo
                                    {hasConnectionsConfig && (
                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    )}
                                </TabsTrigger>
                                <TabsTrigger value="nocode" className="flex items-center gap-2">
                                    <Zap className="w-4 h-4" />
                                    NoCode
                                    {hasNoCodeConfig && (
                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    )}
                                </TabsTrigger>
                                <TabsTrigger value="global" className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    Global
                                    {hasGlobalConfig && (
                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    )}
                                </TabsTrigger>
                                <TabsTrigger value="brand" className="flex items-center gap-2">
                                    <Palette className="w-4 h-4" />
                                    Brand Kit
                                </TabsTrigger>
                                <TabsTrigger value="analytics" className="flex items-center gap-2">
                                    <Analytics className="w-4 h-4" />
                                    Analytics
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="p-6">
                            {/* Aba de Conexões/Fluxo */}
                            <TabsContent value="connections" className="mt-0 space-y-4">
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <LinkIcon className="w-5 h-5 text-blue-600" />
                                        <h3 className="font-semibold text-blue-900">Fluxo Entre Etapas</h3>
                                    </div>
                                    <p className="text-sm text-blue-700 mb-4">
                                        Configure como as etapas do seu funil se conectam. Defina fluxos lineares ou condicionais baseados nas respostas dos usuários.
                                    </p>

                                    {hasConnectionsConfig && (
                                        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
                                            <div className="text-xs text-green-700 font-medium mb-1">✅ CONFIGURADO</div>
                                            <div className="text-sm text-green-800">
                                                Fluxo personalizado com conexões condicionais ativo
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <StepNoCodeConnections />
                            </TabsContent>

                            {/* Aba NoCode */}
                            <TabsContent value="nocode" className="mt-0 space-y-4">
                                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Zap className="w-5 h-5 text-purple-600" />
                                        <h3 className="font-semibold text-purple-900">Configurações NoCode</h3>
                                    </div>
                                    <p className="text-sm text-purple-700 mb-4">
                                        Configure SEO, domínio, tracking, temas e outras configurações específicas do funil.
                                    </p>
                                </div>

                                <NoCodeConfigPanel />
                            </TabsContent>

                            {/* Aba Global */}
                            <TabsContent value="global" className="mt-0 space-y-4">
                                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Globe className="w-5 h-5 text-green-600" />
                                        <h3 className="font-semibold text-green-900">Configurações Globais</h3>
                                    </div>
                                    <p className="text-sm text-green-700 mb-4">
                                        Configure pixel, UTM, webhooks e outras configurações estratégicas globais.
                                    </p>
                                </div>

                                <GlobalConfigPanel />
                            </TabsContent>

                            {/* Aba Brand Kit */}
                            <TabsContent value="brand" className="mt-0">
                                <BrandKitManager />
                            </TabsContent>

                            {/* Aba Analytics */}
                            <TabsContent value="analytics" className="mt-0">
                                <FunnelAnalyticsDashboard funnelId={funnelId} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Footer com Status */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-gray-600">
                            <span>Status: {configCount > 0 ? `${configCount}/3 configuradas` : 'Nenhuma configuração'}</span>
                            <span>•</span>
                            <span>Auto-save ativo</span>
                        </div>
                        <div className="text-xs text-gray-500">
                            Última atualização: {new Date().toLocaleTimeString()}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FunnelTechnicalConfigPanel;