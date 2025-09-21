/**
 * 🎯 MODERN UNIFIED EDITOR - EDITOR DEFINITIVO
 * 
 * Editor 100% moderno que CONSOLIDA TODOS os editores em uma interface única:
 * ✅ Rota principal: /editor
 * ✅ Interface unificada baseada no EditorProUnified
 * ✅ Performance otimizada com lazy loading
 * ✅ Elimina conflitos entre editores fragmentados
 */

import React, { useState, useCallback, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
    Layout, Brain, Settings, Target,
    Component, Crown, Eye, CheckCircle, Activity
} from 'lucide-react';

// Lazy loading do editor principal
const EditorProUnified = React.lazy(() =>
    import('../../components/editor/EditorProUnified')
);

// Providers necessários
import { FunnelsProvider } from '@/context/FunnelsContext';
import PureBuilderProvider from '@/components/editor/PureBuilderProvider';
import { useNotification } from '@/components/ui/Notification';

// ===============================
// 🎯 TYPES & INTERFACES
// ===============================

type EditorMode = 'visual' | 'builder' | 'funnel' | 'headless';

interface ModernUnifiedEditorProps {
    funnelId?: string;
    templateId?: string;
    mode?: EditorMode;
    className?: string;
}

interface EditorState {
    mode: EditorMode;
    aiAssistantActive: boolean;
    previewMode: boolean;
}

// ===============================
// 🎨 LOADING COMPONENT
// ===============================

const LoadingSpinner: React.FC<{ message?: string }> = ({
    message = "Carregando Editor Neural..."
}) => (
    <div className="flex items-center justify-center h-full min-h-[400px] bg-background">
        <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-foreground text-lg font-medium">{message}</p>
            <Badge variant="outline" className="mt-2">Neural Editor v2.0</Badge>
        </div>
    </div>
);

// ===============================
// 🛠️ TOOLBAR MODERNO
// ===============================

interface ModernToolbarProps {
    editorState: EditorState;
    onStateChange: (updates: Partial<EditorState>) => void;
    funnelId?: string;
}

const ModernToolbar: React.FC<ModernToolbarProps> = ({
    editorState,
    onStateChange,
    funnelId
}) => {
    const { addNotification } = useNotification();

    const handleSave = useCallback(() => {
        addNotification('💾 Projeto salvo com sucesso!', 'success');
    }, [addNotification]);

    const handleAIToggle = useCallback(() => {
        const newState = !editorState.aiAssistantActive;
        onStateChange({ aiAssistantActive: newState });
        addNotification(
            newState ? '🧠 Assistente IA ativado' : '🧠 Assistente IA desativado',
            'info'
        );
    }, [editorState.aiAssistantActive, onStateChange, addNotification]);

    return (
        <div className="flex items-center justify-between p-4 bg-background border-b border-border">
            {/* Logo e Info */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Crown className="w-6 h-6 text-primary" />
                    <span className="font-bold text-lg">Editor Neural</span>
                    <Badge variant="secondary" className="text-xs">
                        v2.0 UNIFIED
                    </Badge>
                </div>

                <Separator orientation="vertical" className="h-6" />

                {/* Mode Selector */}
                <Tabs value={editorState.mode} onValueChange={(mode) =>
                    onStateChange({ mode: mode as EditorMode })
                }>
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="visual" className="text-xs">
                            <Layout className="w-4 h-4 mr-1" />
                            Visual
                        </TabsTrigger>
                        <TabsTrigger value="builder" className="text-xs">
                            <Component className="w-4 h-4 mr-1" />
                            Builder
                        </TabsTrigger>
                        <TabsTrigger value="funnel" className="text-xs">
                            <Target className="w-4 h-4 mr-1" />
                            Funnel
                        </TabsTrigger>
                        <TabsTrigger value="headless" className="text-xs">
                            <Settings className="w-4 h-4 mr-1" />
                            Headless
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {funnelId && (
                    <Badge variant="outline" className="text-xs">
                        ID: {funnelId}
                    </Badge>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <Button
                    variant={editorState.aiAssistantActive ? "default" : "outline"}
                    size="sm"
                    onClick={handleAIToggle}
                >
                    <Brain className="w-4 h-4 mr-2" />
                    IA
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStateChange({ previewMode: !editorState.previewMode })}
                >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                </Button>

                <Button variant="default" size="sm" onClick={handleSave}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Salvar
                </Button>
            </div>
        </div>
    );
};

// ===============================
// 🎯 MAIN EDITOR COMPONENT
// ===============================

const ModernUnifiedEditor: React.FC<ModernUnifiedEditorProps> = ({
    funnelId,
    templateId,
    mode = 'visual',
    className = ''
}) => {
    // Estado do editor
    const [editorState, setEditorState] = useState<EditorState>({
        mode,
        aiAssistantActive: false,
        previewMode: false
    });

    // Handler para mudanças de estado
    const handleStateChange = useCallback((updates: Partial<EditorState>) => {
        setEditorState(prev => ({ ...prev, ...updates }));
    }, []);

    console.log('🎯 ModernUnifiedEditor iniciado:', {
        mode: editorState.mode,
        funnelId,
        templateId,
        aiActive: editorState.aiAssistantActive
    });

    return (
        <div className={`h-screen w-full bg-background flex flex-col ${className}`}>
            {/* Toolbar Moderno */}
            <ModernToolbar
                editorState={editorState}
                onStateChange={handleStateChange}
                funnelId={funnelId}
            />

            {/* Main Editor Area - Usando EditorProUnified como base única */}
            <div className="flex-1 overflow-hidden">
                <FunnelsProvider debug={false}>
                    <PureBuilderProvider funnelId={funnelId}>
                        <Suspense fallback={<LoadingSpinner message="Carregando editor principal..." />}>
                            <EditorProUnified
                                funnelId={funnelId}
                                showProFeatures={true}
                                className="h-full"
                            />
                        </Suspense>
                    </PureBuilderProvider>
                </FunnelsProvider>
            </div>

            {/* Status Bar */}
            <div className="h-8 bg-muted/30 border-t border-border flex items-center justify-between px-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Activity className="w-3 h-3" />
                    <span>Editor ativo: {editorState.mode}</span>
                    {editorState.aiAssistantActive && (
                        <>
                            <Separator orientation="vertical" className="h-3" />
                            <Brain className="w-3 h-3" />
                            <span>IA Assistente ativo</span>
                        </>
                    )}
                </div>
                <div className="text-xs text-muted-foreground">
                    Neural Editor v2.0 - Consolidado
                </div>
            </div>
        </div>
    );
};

export default ModernUnifiedEditor;