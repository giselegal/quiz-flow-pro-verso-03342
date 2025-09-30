import React from 'react';
import { Activity, Brain, Target, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getQuizDynamicMode } from '@/templates/quiz21StepsAdapter';

interface EditorStatusBarProps {
    mode: string;
    unifiedEditor: any;
    aiActive: boolean;
    detectedFunnelType: any;
    funnelData: any;
}

const EditorStatusBar: React.FC<EditorStatusBarProps> = ({
    mode,
    unifiedEditor,
    aiActive,
    detectedFunnelType,
    funnelData
}) => {
    return (
        <div className="h-8 bg-muted/30 border-t border-border flex items-center justify-between px-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="w-3 h-3" />
                <span>Editor ativo: {mode}</span>
                <span className="ml-2 px-2 py-0.5 rounded bg-muted/60">Dynamic Mode: {getQuizDynamicMode()}</span>
                {unifiedEditor.isLoading && (<><Separator orientation="vertical" className="h-3" /><span>⏳ Carregando...</span></>)}
                {unifiedEditor.isDirty && (<><Separator orientation="vertical" className="h-3" /><span>✏️ Modificado</span></>)}
                {unifiedEditor.lastSaved && (<><Separator orientation="vertical" className="h-3" /><span>💾 Salvo: {new Date(unifiedEditor.lastSaved).toLocaleTimeString()}</span></>)}
                {aiActive && (<><Separator orientation="vertical" className="h-3" /><Brain className="w-3 h-3" /><span>IA Assistente ativo</span></>)}
                {detectedFunnelType && (<><Separator orientation="vertical" className="h-3" /><Target className="w-3 h-3" /><span>Tipo: {detectedFunnelType.name}</span></>)}
                {funnelData && (<><Separator orientation="vertical" className="h-3" /><CheckCircle className="w-3 h-3" /><span>Dados carregados</span></>)}
            </div>
            <div className="text-xs text-muted-foreground">
                Neural Editor v2.0 - CRUD Unificado ✅
            </div>
        </div>
    );
};

export default EditorStatusBar;
