import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Bot, Target, Activity } from "lucide-react";
import { UniversalFunnelEditor } from './UniversalFunnelEditor';
import { useAnalytics } from '@/hooks/useAnalytics';
import type { UniversalFunnel } from './UniversalFunnelEditor';

// ===============================
// 🎯 TIPOS INTEGRADOS SIMPLIFICADOS
// ===============================

interface UniversalBuilderEditorProps {
    funnel: UniversalFunnel;
    onFunnelChange: (funnel: UniversalFunnel) => void;
    onSave?: (funnel: UniversalFunnel) => Promise<void>;
    enableAI?: boolean;
    enableAnalytics?: boolean;
    readOnly?: boolean;
}

// ===============================
// 🎯 UNIVERSAL BUILDER EDITOR SIMPLIFICADO
// ===============================

export const UniversalBuilderEditor: React.FC<UniversalBuilderEditorProps> = ({
    funnel: initialFunnel,
    onFunnelChange,
    onSave,
    enableAI = true,
    enableAnalytics = true,
    readOnly = false
}) => {
    const [funnel, setFunnel] = useState<UniversalFunnel>(initialFunnel);
    const analytics = useAnalytics();

    // Sincronizar mudanças
    useEffect(() => {
        onFunnelChange(funnel);

        if (enableAnalytics) {
            analytics.trackEvent('funnel_modified', {
                funnelId: funnel.id,
                stepCount: funnel.steps.length
            });
        }
    }, [funnel, onFunnelChange, enableAnalytics, analytics]);

    return (
        <div className="h-full flex flex-col">
            {/* Header Simplificado */}
            <div className="flex items-center justify-between p-4 bg-background border-b border-border">
                <div className="flex items-center gap-2">
                    <Crown className="w-6 h-6 text-primary" />
                    <span className="font-bold text-lg">Universal Builder</span>
                    <Badge variant="secondary" className="text-xs">
                        Integrado
                    </Badge>
                </div>

                <div className="flex items-center gap-2">
                    {enableAI && (
                        <Button variant="outline" size="sm">
                            <Bot className="w-4 h-4 mr-2" />
                            IA
                        </Button>
                    )}

                    <Button variant="default" size="sm" onClick={() => onSave?.(funnel)}>
                        <Target className="w-4 h-4 mr-2" />
                        Salvar
                    </Button>
                </div>
            </div>

            {/* Universal Editor */}
            <div className="flex-1 overflow-hidden">
                <UniversalFunnelEditor
                    funnel={funnel}
                    onFunnelChange={setFunnel}
                    onSave={onSave}
                    readOnly={readOnly}
                />
            </div>

            {/* Status Bar */}
            <div className="h-8 bg-muted/30 border-t border-border flex items-center justify-between px-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Activity className="w-3 h-3" />
                    <span>Universal Builder Ativo</span>
                </div>
                <div className="text-xs text-muted-foreground">
                    Funil: {funnel.name} | Steps: {funnel.steps.length}
                </div>
            </div>
        </div>
    );
};

export default UniversalBuilderEditor;