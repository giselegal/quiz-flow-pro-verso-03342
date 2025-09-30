import React, { useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useNotification } from '@/components/ui/Notification';
import { UnifiedRoutingService } from '@/services/core/UnifiedRoutingService';
import { Layout, Brain, Settings, Target, Component, Crown, Eye, CheckCircle, Activity } from 'lucide-react';

export type EditorMode = 'visual' | 'builder' | 'funnel' | 'headless' | 'admin-integrated';

export interface EditorStateToolbar {
    mode: EditorMode;
    aiAssistantActive: boolean;
    previewMode: boolean;
    realExperienceMode: boolean;
}

export interface ModernToolbarProps {
    editorState: EditorStateToolbar;
    onStateChange: (updates: Partial<EditorStateToolbar>) => void;
    funnelId?: string;
    mode?: EditorMode;
    adminReturnUrl?: string;
    onSave?: () => Promise<void>;
    onCreateNew?: () => Promise<void>;
    onDuplicate?: () => Promise<void>;
    onTestCRUD?: () => Promise<void>;
}

export const ModernToolbar: React.FC<ModernToolbarProps> = ({
    editorState,
    onStateChange,
    funnelId,
    mode,
    onSave,
    onCreateNew,
    onDuplicate,
    onTestCRUD
}) => {
    const { addNotification } = useNotification();
    const [isOperating, setIsOperating] = useState(false);

    const guarded = async (fn?: () => Promise<void>, success?: string, errorMsg?: string) => {
        if (!fn || isOperating) return;
        setIsOperating(true);
        try {
            await fn();
            if (success) addNotification(success, 'success');
        } catch (e) {
            console.error(errorMsg || 'Erro em operação toolbar', e);
            addNotification(errorMsg || 'Erro na operação', 'error');
        } finally {
            setIsOperating(false);
        }
    };

    const handleBackToAdmin = useCallback(() => {
        if (mode === 'admin-integrated' && funnelId) {
            UnifiedRoutingService.navigateEditorToAdmin(funnelId);
            addNotification('🔙 Retornando ao dashboard admin', 'info');
        }
    }, [mode, funnelId, addNotification]);

    const toggleAI = () => {
        const next = !editorState.aiAssistantActive;
        onStateChange({ aiAssistantActive: next });
        addNotification(next ? '🧠 Assistente IA ativado' : '🧠 Assistente IA desativado', 'info');
    };

    return (
        <div className="flex items-center justify-between p-4 bg-background border-b border-border">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Crown className="w-6 h-6 text-primary" />
                    <span className="font-bold text-lg">Editor Neural</span>
                    <Badge variant="secondary" className="text-xs">v2.0 UNIFIED</Badge>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <Tabs value={editorState.mode} onValueChange={(m) => onStateChange({ mode: m as EditorMode })}>
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="visual" className="text-xs"><Layout className="w-4 h-4 mr-1" />Visual</TabsTrigger>
                        <TabsTrigger value="builder" className="text-xs"><Component className="w-4 h-4 mr-1" />Builder</TabsTrigger>
                        <TabsTrigger value="funnel" className="text-xs"><Target className="w-4 h-4 mr-1" />Funnel</TabsTrigger>
                        <TabsTrigger value="headless" className="text-xs"><Brain className="w-4 h-4 mr-1" />Headless</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="flex items-center gap-2">
                <Button variant={editorState.aiAssistantActive ? 'default' : 'outline'} size="sm" onClick={toggleAI}>
                    <Brain className="w-4 h-4 mr-2" /> IA
                </Button>
                <Button variant={editorState.previewMode ? 'default' : 'outline'} size="sm" onClick={() => onStateChange({ previewMode: !editorState.previewMode })}>
                    <Eye className="w-4 h-4 mr-2" /> Preview
                </Button>
                <Button variant={editorState.realExperienceMode ? 'default' : 'outline'} size="sm" onClick={() => onStateChange({ realExperienceMode: !editorState.realExperienceMode })}>
                    <Activity className="w-4 h-4 mr-2" /> Experiência
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button size="sm" onClick={() => guarded(onSave, '💾 Projeto salvo com sucesso!', '❌ Erro ao salvar projeto')} disabled={isOperating}>Salvar</Button>
                <Button size="sm" onClick={() => guarded(onCreateNew, '🎉 Novo projeto criado!', '❌ Erro ao criar projeto')} disabled={isOperating}>Novo</Button>
                <Button size="sm" onClick={() => guarded(onDuplicate, '📋 Projeto duplicado!', '❌ Erro ao duplicar projeto')} disabled={isOperating || !funnelId}>Duplicar</Button>
                <Button size="sm" onClick={() => guarded(onTestCRUD, '🧪 Testes CRUD executados', '❌ Erro nos testes CRUD')} disabled={isOperating}>Testes</Button>
                {mode === 'admin-integrated' && (
                    <Button variant="outline" size="sm" onClick={handleBackToAdmin}><Settings className="w-4 h-4 mr-2" />Admin</Button>
                )}
                {editorState.previewMode && (
                    <Badge variant="outline" className="text-xs">Modo Preview</Badge>
                )}
                {editorState.realExperienceMode && (
                    <Badge variant="outline" className="text-xs">Experiência Real</Badge>
                )}
                {editorState.aiAssistantActive && (
                    <Badge variant="outline" className="text-xs">IA Ativa</Badge>
                )}
                <Badge variant="secondary" className="text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Stable</Badge>
            </div>
        </div>
    );
};

export default ModernToolbar;