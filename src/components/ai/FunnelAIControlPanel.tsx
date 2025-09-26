/**
 * 🤖 PAINEL DE CONTROLE DA IA DO FUNIL
 * 
 * Componente para gerenciar e monitorar a IA do funil
 */

import React from 'react';
import { useFunnelAI } from '../../hooks/useFunnelAI';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2, Brain, Zap, Settings, AlertTriangle } from 'lucide-react';

interface FunnelAIControlPanelProps {
    className?: string;
    compact?: boolean;
}

export function FunnelAIControlPanel({ className = '', compact = false }: FunnelAIControlPanelProps) {
    const {
        aiStatus,
        enableAI,
        disableAI,
        refreshStatus,
        isAIEnabled,
        canUseAI
    } = useFunnelAI();

    const handleToggleAI = async () => {
        if (isAIEnabled) {
            disableAI();
        } else {
            await enableAI();
        }
    };

    if (compact) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <Badge
                    variant={isAIEnabled ? "default" : "secondary"}
                    className="flex items-center gap-1"
                >
                    <Brain className="w-3 h-3" />
                    IA {isAIEnabled ? 'Ativa' : 'Inativa'}
                </Badge>

                <Button
                    size="sm"
                    variant={isAIEnabled ? "secondary" : "default"}
                    onClick={handleToggleAI}
                    disabled={aiStatus.loading}
                >
                    {aiStatus.loading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                        <>
                            {isAIEnabled ? (
                                <>⏸️ Desativar</>
                            ) : (
                                <>🚀 Ativar</>
                            )}
                        </>
                    )}
                </Button>
            </div>
        );
    }

    return (
        <Card className={`p-4 ${className}`}>
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-lg">IA do Funil</h3>
                    </div>

                    <Badge
                        variant={isAIEnabled ? "default" : "secondary"}
                        className="flex items-center gap-1"
                    >
                        <div className={`w-2 h-2 rounded-full ${isAIEnabled ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                        {isAIEnabled ? 'Ativa' : 'Inativa'}
                    </Badge>
                </div>

                {/* Status */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Serviço:</span>
                        <span className={aiStatus.hasService ? 'text-green-600' : 'text-red-600'}>
                            {aiStatus.hasService ? '✅ Ativo' : '❌ Inativo'}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Provider:</span>
                        <span className="text-gray-800">
                            {aiStatus.config.provider || 'N/A'}
                        </span>
                    </div>
                </div>

                {/* Recursos */}
                <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-700">Recursos Ativos:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${aiStatus.config.personalizationEnabled ? 'bg-green-500' : 'bg-gray-300'
                                }`} />
                            <span>Personalização</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${aiStatus.config.optimizationEnabled ? 'bg-green-500' : 'bg-gray-300'
                                }`} />
                            <span>Otimização</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${aiStatus.config.contentGenerationEnabled ? 'bg-green-500' : 'bg-gray-300'
                                }`} />
                            <span>Geração de Conteúdo</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${aiStatus.config.fallbackEnabled ? 'bg-green-500' : 'bg-gray-300'
                                }`} />
                            <span>Fallback</span>
                        </div>
                    </div>
                </div>

                {/* Erro */}
                {aiStatus.error && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-center gap-2 text-red-700 text-sm">
                            <AlertTriangle className="w-4 h-4" />
                            <span>{aiStatus.error}</span>
                        </div>
                    </div>
                )}

                {/* Controles */}
                <div className="flex gap-2">
                    <Button
                        onClick={handleToggleAI}
                        disabled={aiStatus.loading}
                        className={isAIEnabled ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                    >
                        {aiStatus.loading ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <>
                                {isAIEnabled ? (
                                    <>⏸️ Desativar IA</>
                                ) : (
                                    <>🚀 Ativar IA</>
                                )}
                            </>
                        )}
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={refreshStatus}
                        disabled={aiStatus.loading}
                    >
                        <Settings className="w-4 h-4 mr-1" />
                        Atualizar
                    </Button>
                </div>

                {/* Benefícios */}
                {canUseAI && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center gap-2 text-blue-700 text-sm mb-2">
                            <Zap className="w-4 h-4" />
                            <span className="font-medium">IA Ativa - Benefícios:</span>
                        </div>
                        <ul className="text-xs text-blue-600 space-y-1">
                            <li>• 🧠 Personalização inteligente baseada no perfil</li>
                            <li>• 🚀 Otimização automática de conversão</li>
                            <li>• 📝 Geração dinâmica de textos relevantes</li>
                            <li>• 🛡️ Recuperação inteligente de erros</li>
                        </ul>
                    </div>
                )}
            </div>
        </Card>
    );
}

export default FunnelAIControlPanel;