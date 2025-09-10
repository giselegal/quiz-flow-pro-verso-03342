/**
 * 🎯 PAINEL DE GESTÃO DE FUNIL ÚNICO
 * 
 * Componente visual para verificar, limpar e gerenciar funis,
 * garantindo que apenas um esteja ativo baseado no quiz21StepsComplete.ts
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
    CheckCircle, 
    AlertTriangle, 
    Trash2, 
    RefreshCw,
    Database,
    Settings,
    Info
} from 'lucide-react';

interface FunnelInfo {
    id: string;
    name: string;
    origin: string;
    isActive: boolean;
    totalSteps: number;
    stepConfigurations: number;
}

const FunnelManager: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [funnelInfo, setFunnelInfo] = useState<FunnelInfo | null>(null);
    const [totalFunnelKeys, setTotalFunnelKeys] = useState(0);
    const [lastCleanup, setLastCleanup] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const checkFunnelStatus = () => {
        try {
            // Verificar localStorage
            const keys = Object.keys(localStorage);
            const funnelKeys = keys.filter(key => 
                key.startsWith('funnel-') || 
                key.startsWith('funnelData-') ||
                key.includes('funnel') ||
                key.includes('Funnel') ||
                key.includes('quiz') ||
                key.includes('Quiz')
            );

            setTotalFunnelKeys(funnelKeys.length);

            // Verificar funil ativo
            const activeFunnelData = localStorage.getItem('active-funnel-main');
            if (activeFunnelData) {
                try {
                    const funnel = JSON.parse(activeFunnelData);
                    setFunnelInfo({
                        id: funnel.id,
                        name: funnel.name,
                        origin: funnel.origin,
                        isActive: funnel.isActive,
                        totalSteps: funnel.totalSteps,
                        stepConfigurations: Object.keys(funnel.stepConfigurations || {}).length
                    });
                } catch (error) {
                    console.error('Erro ao parsear funil:', error);
                    setFunnelInfo(null);
                }
            } else {
                setFunnelInfo(null);
            }

            // Verificar última limpeza
            const cleanup = localStorage.getItem('funnel-cleanup-timestamp');
            setLastCleanup(cleanup);

        } catch (error) {
            console.error('Erro na verificação:', error);
        }
    };

    const performCleanup = async () => {
        setIsLoading(true);
        setProgress(0);

        try {
            // Simular progresso
            const progressSteps = [20, 40, 60, 80, 100];
            
            for (let i = 0; i < progressSteps.length; i++) {
                setProgress(progressSteps[i]);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            // Executar limpeza
            const keys = Object.keys(localStorage);
            const funnelKeys = keys.filter(key => 
                key.startsWith('funnel-') || 
                key.startsWith('funnelData-') ||
                key.includes('funnel') ||
                key.includes('Funnel') ||
                key.includes('quiz') ||
                key.includes('Quiz')
            );

            // Remover funis antigos
            funnelKeys.forEach(key => {
                localStorage.removeItem(key);
            });

            // Criar funil único
            const activeFunnelData = {
                id: 'quiz-style-main',
                name: 'Quiz de Estilo Pessoal - 21 Etapas',
                description: 'Template completo do quiz de estilo predominante',
                origin: 'quiz21StepsComplete.ts',
                isActive: true,
                version: '2.0.0',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                userId: 'demo-user',
                template: 'quiz21StepsComplete',
                totalSteps: 21,
                currentStep: 1,
                metadata: {
                    templateSource: 'quiz21StepsComplete.ts',
                    hasStepConfig: true,
                    isNoCodeEnabled: true,
                    persistenceMethod: 'localStorage'
                },
                stepConfigurations: {
                    'step-1': {
                        stepId: '1',
                        stepName: 'Coleta de Nome',
                        nextStep: 'linear',
                        isActive: true,
                        type: 'form'
                    },
                    'step-2': {
                        stepId: '2',
                        stepName: 'Questão 1 - Tipo de Roupa',
                        nextStep: 'linear',
                        isActive: true,
                        type: 'quiz',
                        requiredSelections: 3
                    },
                    'step-3': {
                        stepId: '3',
                        stepName: 'Questão 2 - Personalidade',
                        nextStep: 'linear',
                        isActive: true,
                        type: 'quiz',
                        requiredSelections: 3
                    },
                    'step-20': {
                        stepId: '20',
                        stepName: 'Página de Resultado',
                        nextStep: 'step-21',
                        isActive: true,
                        type: 'result'
                    },
                    'step-21': {
                        stepId: '21',
                        stepName: 'Página de Oferta',
                        nextStep: 'end',
                        isActive: true,
                        type: 'offer'
                    }
                },
                navigation: {
                    enableBackButton: true,
                    showProgress: true,
                    autoAdvance: true,
                    validateBeforeAdvance: true
                }
            };

            localStorage.setItem('active-funnel-main', JSON.stringify(activeFunnelData));
            localStorage.setItem('funnel-cleanup-timestamp', new Date().toISOString());

            // Verificar resultado
            checkFunnelStatus();

        } catch (error) {
            console.error('Erro na limpeza:', error);
        } finally {
            setIsLoading(false);
            setProgress(0);
        }
    };

    useEffect(() => {
        checkFunnelStatus();
        
        // Verificar a cada 5 segundos
        const interval = setInterval(checkFunnelStatus, 5000);
        
        return () => clearInterval(interval);
    }, []);

    const isValidSetup = funnelInfo && 
                        funnelInfo.origin === 'quiz21StepsComplete.ts' && 
                        totalFunnelKeys <= 1 &&
                        funnelInfo.isActive;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">
                    🎯 Gestão de Funil Único
                </h1>
                <p className="text-gray-600">
                    Mantenha apenas um funil ativo baseado no quiz21StepsComplete.ts
                </p>
            </div>

            {/* Status Principal */}
            <Card className={`border-2 ${isValidSetup ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {isValidSetup ? (
                            <>
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="text-green-800">Configuração Válida</span>
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="w-5 h-5 text-orange-600" />
                                <span className="text-orange-800">Necessária Limpeza</span>
                            </>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Informações do Funil */}
                    {funnelInfo ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-sm text-gray-600">ID do Funil</div>
                                <div className="font-mono text-xs bg-gray-100 p-1 rounded">
                                    {funnelInfo.id}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm text-gray-600">Origem</div>
                                <Badge variant={funnelInfo.origin === 'quiz21StepsComplete.ts' ? 'default' : 'destructive'}>
                                    {funnelInfo.origin}
                                </Badge>
                            </div>
                            <div className="text-center">
                                <div className="text-sm text-gray-600">Total de Etapas</div>
                                <div className="text-lg font-bold text-blue-600">
                                    {funnelInfo.totalSteps}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm text-gray-600">Configurações</div>
                                <div className="text-lg font-bold text-purple-600">
                                    {funnelInfo.stepConfigurations}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Nenhum funil ativo encontrado</p>
                        </div>
                    )}

                    {/* Estatísticas */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div className="text-center">
                            <div className="text-sm text-gray-600">Chaves de Funil no Storage</div>
                            <div className={`text-xl font-bold ${totalFunnelKeys <= 1 ? 'text-green-600' : 'text-red-600'}`}>
                                {totalFunnelKeys}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-600">Última Limpeza</div>
                            <div className="text-xs text-gray-500">
                                {lastCleanup ? new Date(lastCleanup).toLocaleString('pt-BR') : 'Nunca'}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Ações */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                    onClick={checkFunnelStatus}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Verificar Status
                </Button>

                <Button
                    onClick={performCleanup}
                    disabled={isLoading}
                    className={`flex items-center gap-2 ${isValidSetup ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}`}
                >
                    <Trash2 className="w-4 h-4" />
                    {isLoading ? 'Limpando...' : 'Executar Limpeza'}
                </Button>

                <Button
                    onClick={() => window.location.href = '/editor'}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <Settings className="w-4 h-4" />
                    Ir para Editor
                </Button>
            </div>

            {/* Progress Bar */}
            {isLoading && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Executando limpeza...</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="w-full" />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Informações Adicionais */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Info className="w-4 h-4 text-blue-600" />
                        Informações
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-2">
                    <p>• Este painel garante que apenas um funil esteja ativo no sistema</p>
                    <p>• O funil deve ser baseado no template <code className="bg-gray-100 px-1 rounded">quiz21StepsComplete.ts</code></p>
                    <p>• A limpeza remove funis duplicados e cria um funil único com configurações NOCODE</p>
                    <p>• As configurações de etapa são integradas para uso no editor</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default FunnelManager;
