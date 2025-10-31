/**
 * 🔍 EDITOR DIAGNOSTICS - Fase 1.5
 * 
 * Painel de diagnóstico visual para debug do editor (DEV only)
 * 
 * Mostra:
 * - Modo atual (template vs funnel)
 * - Status Supabase (local vs database)
 * - Etapas carregadas e suas origens
 * - Parâmetros da URL
 * 
 * Uso: Sempre visível em DEV mode (fixed bottom-right)
 */

import React, { useState } from 'react';
import { useEditor } from '@/components/editor/EditorProviderUnified';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bug, ChevronDown, ChevronUp, Database, FileJson } from 'lucide-react';

export const EditorDiagnostics: React.FC = () => {
    const editor = useEditor({ optional: true });
    const [isExpanded, setIsExpanded] = useState(false);

    // Apenas em modo DEV
    if (import.meta.env.PROD) return null;

    // URL params
    const params = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams();

    const templateId = params.get('template') || params.get('id');
    const funnelId = params.get('funnelId') || params.get('funnel');
    const mode = templateId ? 'template' : funnelId ? 'funnel' : 'unknown';

    // Editor state
    const stepBlocks = editor?.state.stepBlocks || {};
    const stepSources = editor?.state.stepSources || {};
    const databaseMode = editor?.state.databaseMode || 'local';
    const isSupabaseEnabled = editor?.state.isSupabaseEnabled ?? false;

    const stepKeys = Object.keys(stepBlocks);
    const totalBlocks = stepKeys.reduce((sum, key) => sum + (stepBlocks[key]?.length || 0), 0);

    return (
        <Card className="fixed bottom-4 right-4 z-[9999] w-80 shadow-xl border-2 border-blue-500 bg-white/95 backdrop-blur">
            {/* Header */}
            <div
                className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-50"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    <Bug className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-semibold">Editor Debug</span>
                </div>
                <div className="flex items-center gap-2">
                    <Badge
                        variant={mode === 'template' ? 'secondary' : mode === 'funnel' ? 'default' : 'outline'}
                        className="text-xs"
                    >
                        {mode}
                    </Badge>
                    {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                </div>
            </div>

            {/* Content (expandable) */}
            {isExpanded && (
                <div className="p-3 space-y-3 text-xs">
                    {/* Mode Section */}
                    <div>
                        <div className="font-semibold mb-1 flex items-center gap-1">
                            {mode === 'template' ? (
                                <>
                                    <FileJson className="w-3 h-3" />
                                    Modo Template
                                </>
                            ) : (
                                <>
                                    <Database className="w-3 h-3" />
                                    Modo Funnel
                                </>
                            )}
                        </div>
                        <div className="space-y-1 text-gray-600">
                            {templateId && (
                                <div className="flex justify-between">
                                    <span>Template ID:</span>
                                    <code className="text-blue-600">{templateId}</code>
                                </div>
                            )}
                            {funnelId && (
                                <div className="flex justify-between">
                                    <span>Funnel ID:</span>
                                    <code className="text-green-600">{funnelId}</code>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Database Status */}
                    <div className="border-t pt-2">
                        <div className="font-semibold mb-1">Status Supabase</div>
                        <div className="space-y-1 text-gray-600">
                            <div className="flex justify-between">
                                <span>Modo:</span>
                                <Badge
                                    variant={databaseMode === 'supabase' ? 'default' : 'secondary'}
                                    className="text-xs"
                                >
                                    {databaseMode}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span>Habilitado:</span>
                                <Badge
                                    variant={isSupabaseEnabled ? 'default' : 'secondary'}
                                    className="text-xs"
                                >
                                    {isSupabaseEnabled ? 'Sim' : 'Não'}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Steps Info */}
                    <div className="border-t pt-2">
                        <div className="font-semibold mb-1">Etapas Carregadas</div>
                        <div className="space-y-1 text-gray-600">
                            <div className="flex justify-between">
                                <span>Total:</span>
                                <span className="font-mono">{stepKeys.length} steps</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Blocos:</span>
                                <span className="font-mono">{totalBlocks} blocks</span>
                            </div>
                        </div>
                    </div>

                    {/* Step Sources */}
                    {Object.keys(stepSources).length > 0 && (
                        <div className="border-t pt-2">
                            <div className="font-semibold mb-1">Fontes por Etapa</div>
                            <div className="max-h-32 overflow-y-auto space-y-1">
                                {stepKeys.slice(0, 5).map(stepKey => {
                                    const source = stepSources[stepKey];
                                    const blockCount = stepBlocks[stepKey]?.length || 0;
                                    return (
                                        <div key={stepKey} className="flex justify-between text-gray-600">
                                            <span className="font-mono text-[10px]">{stepKey}</span>
                                            <div className="flex items-center gap-1">
                                                <span className="font-mono text-[10px]">{blockCount}x</span>
                                                <Badge variant="outline" className="text-[9px] px-1 py-0">
                                                    {source || 'unknown'}
                                                </Badge>
                                            </div>
                                        </div>
                                    );
                                })}
                                {stepKeys.length > 5 && (
                                    <div className="text-gray-400 text-center pt-1">
                                        +{stepKeys.length - 5} mais...
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="border-t pt-2 text-[10px] text-gray-400 text-center">
                        🔍 Diagnóstico ativo apenas em DEV
                    </div>
                </div>
            )}
        </Card>
    );
};
