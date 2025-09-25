/**
 * 🎯 MODERN UNIFIED EDITOR - EDITOR DEFINITIVO
 * 
 * Editor 100% moderno que CONSOLIDA TODOS os editores em uma interface única:
 * ✅ Rota principal: /editor
 * ✅ Interface unificada baseada no EditorProUnified
 * ✅ Performance otimizada com lazy loading
 * ✅ Elimina conflitos entre editores fragmentados
 */

import React, { useState, useCallback, Suspense, useEffect } from 'react';
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

// 🔧 CORREÇÃO: Lazy loading dos componentes de error e loading
const TemplateErrorBoundary = React.lazy(() =>
    import('../../components/error/TemplateErrorBoundary')
);
const TemplateLoadingSkeleton = React.lazy(() =>
    import('../../components/ui/template-loading-skeleton')
);

// Providers necessários
import { FunnelMasterProvider } from '@/providers/FunnelMasterProvider';
import PureBuilderProvider from '@/components/editor/PureBuilderProvider';
import { useNotification } from '@/components/ui/Notification';
import UnifiedCRUDProvider, { useUnifiedCRUD } from '@/context/UnifiedCRUDProvider';

// 🎯 CRUD Services Integration
import { useUnifiedEditor } from '@/hooks/core/useUnifiedEditor';

// 🎯 TEMPLATE REGISTRY INTEGRATION
import { loadFullTemplate, convertTemplateToEditorFormat } from '@/templates/registry';

// 🧪 Development Testing
import testCRUDOperations from '@/utils/testCRUDOperations';

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
    realExperienceMode: boolean; // Novo: modo de experiência real
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
    onSave?: () => Promise<void>;
    onCreateNew?: () => Promise<void>;
    onDuplicate?: () => Promise<void>;
    onTestCRUD?: () => Promise<void>;
}

const ModernToolbar: React.FC<ModernToolbarProps> = ({
    editorState,
    onStateChange,
    funnelId,
    onSave,
    onCreateNew,
    onDuplicate,
    onTestCRUD
}) => {
    const { addNotification } = useNotification();
    const [isOperating, setIsOperating] = useState(false);

    const handleSave = useCallback(async () => {
        if (isOperating || !onSave) return;

        setIsOperating(true);
        try {
            await onSave();
            addNotification('💾 Projeto salvo com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            addNotification('❌ Erro ao salvar projeto', 'error');
        } finally {
            setIsOperating(false);
        }
    }, [onSave, addNotification, isOperating]);

    const handleCreateNew = useCallback(async () => {
        if (isOperating || !onCreateNew) return;

        setIsOperating(true);
        try {
            await onCreateNew();
            addNotification('🎉 Novo projeto criado!', 'success');
        } catch (error) {
            console.error('Erro ao criar projeto:', error);
            addNotification('❌ Erro ao criar projeto', 'error');
        } finally {
            setIsOperating(false);
        }
    }, [onCreateNew, addNotification, isOperating]);

    const handleDuplicate = useCallback(async () => {
        if (isOperating || !onDuplicate || !funnelId) return;

        setIsOperating(true);
        try {
            await onDuplicate();
            addNotification('📋 Projeto duplicado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao duplicar projeto:', error);
            addNotification('❌ Erro ao duplicar projeto', 'error');
        } finally {
            setIsOperating(false);
        }
    }, [onDuplicate, addNotification, isOperating, funnelId]);

    const handleTestCRUD = useCallback(async () => {
        if (isOperating || !onTestCRUD) return;

        setIsOperating(true);
        try {
            await onTestCRUD();
            addNotification('🧪 Testes CRUD executados - veja o console', 'info');
        } catch (error) {
            console.error('Erro ao executar testes:', error);
            addNotification('❌ Erro nos testes CRUD', 'error');
        } finally {
            setIsOperating(false);
        }
    }, [onTestCRUD, addNotification, isOperating]); const handleAIToggle = useCallback(() => {
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
                    variant="secondary"
                    size="sm"
                    onClick={handleCreateNew}
                    disabled={isOperating}
                >
                    <Target className="w-4 h-4 mr-2" />
                    Novo
                </Button>

                {funnelId && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDuplicate}
                        disabled={isOperating}
                    >
                        <Component className="w-4 h-4 mr-2" />
                        Duplicar
                    </Button>
                )}

                <Separator orientation="vertical" className="h-4" />

                {/* 🧪 Test Button (DEV) */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestCRUD}
                    disabled={isOperating}
                    title="Executar testes CRUD (Development)"
                >
                    🧪 Test
                </Button>

                <Separator orientation="vertical" className="h-4" />

                <Button
                    variant={editorState.aiAssistantActive ? "default" : "outline"}
                    size="sm"
                    onClick={handleAIToggle}
                    disabled={isOperating}
                >
                    <Brain className="w-4 h-4 mr-2" />
                    IA
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStateChange({ previewMode: !editorState.previewMode })}
                    disabled={isOperating}
                >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                </Button>

                    <Button
                        variant={editorState.realExperienceMode ? "default" : "outline"}
                        size="sm"
                        onClick={() => onStateChange({ realExperienceMode: !editorState.realExperienceMode })}
                        disabled={isOperating}
                        title="Ativar experiência real com QuizOrchestrator"
                    >
                        <Target className="w-4 h-4 mr-2" />
                        Real
                    </Button>

                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleSave}
                        disabled={isOperating || !onSave}
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {isOperating ? 'Salvando...' : 'Salvar'}
                    </Button>
            </div>
        </div>
    );
};

// ===============================
// 🎯 UNIFIED EDITOR WITH CRUD
// ===============================

const UnifiedEditorCore: React.FC<ModernUnifiedEditorProps> = ({
    funnelId,
    templateId,
    mode = 'visual',
    className = ''
}) => {
    // 🎯 EXTRAIR FUNNEL ID OU TEMPLATE ID DA URL 
    const extractedInfo = React.useMemo(() => {
        const path = window.location.pathname;
        console.log('🔍 Analisando URL:', path);

        // Detectar se é template ou funil na URL
        if (path.startsWith('/editor/') && path.length > '/editor/'.length) {
            const identifier = path.replace('/editor/', '');

            // 🎯 DETECÇÃO DINÂMICA: Verificar se existe como template ou tratar como funnel
            // Primeiro assumir que pode ser qualquer coisa
            console.log('✅ Identificador encontrado na URL:', identifier);

            // Se contém 'step-' ou 'template' ou 'quiz', provavelmente é template
            const looksLikeTemplate = /^(step-|template|quiz|test)/i.test(identifier);

            if (looksLikeTemplate) {
                console.log('✅ Identificador parece ser template:', identifier);
                return { templateId: identifier, funnelId: null, type: 'template' };
            } else {
                console.log('✅ Identificador tratado como funnelId:', identifier);
                return { templateId: null, funnelId: identifier, type: 'funnel' };
            }
        }

        console.log('⚠️ Usando props: funnelId =', funnelId, 'templateId =', templateId);

        // ⚡ DINÂMICO: Não forçar template específico, deixar o sistema detectar automaticamente
        return {
            funnelId: funnelId || null,
            templateId: templateId || null, // ⚡ Não forçar template específico
            type: templateId ? 'template' : (funnelId ? 'funnel' : 'auto') // ⚡ Modo automático
        };
    }, [funnelId, templateId]);

    // 🎯 TEMPLATE LOADING STATE
    const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
    const [templateError, setTemplateError] = useState<string | null>(null);

    // 🎯 UNIFIED CRUD CONTEXT
    const crudContext = useUnifiedCRUD();

    // 🎯 UNIFIED EDITOR HOOK - CRUD INTEGRATION
    const unifiedEditor = useUnifiedEditor();

    // Estado do editor UI
    const [editorState, setEditorState] = useState<EditorState>({
        mode,
        aiAssistantActive: false,
        previewMode: false,
        realExperienceMode: false // Inicialmente desabilitado
    });

    // 🎯 TEMPLATE LOADING EFFECT
    useEffect(() => {
        if (extractedInfo.type === 'template' && extractedInfo.templateId) {
            console.log('🎯 Carregando template:', extractedInfo.templateId);
            setIsLoadingTemplate(true);
            setTemplateError(null);

            loadFullTemplate(extractedInfo.templateId)
                .then(template => {
                    if (template) {
                        console.log('✅ Template carregado:', template);
                        const editorFormat = convertTemplateToEditorFormat(template);
                        console.log('✅ Template convertido para formato do editor:', editorFormat);

                        // Criar um novo funil baseado no template
                        return crudContext.createFunnel(template.name, { templateId: template.id });
                    } else {
                        throw new Error(`Template ${extractedInfo.templateId} não encontrado`);
                    }
                })
                .catch(error => {
                    console.error('❌ Erro ao carregar template:', error);
                    setTemplateError(error.message);
                })
                .finally(() => {
                    setIsLoadingTemplate(false);
                });
        }
    }, [extractedInfo.templateId, extractedInfo.type, crudContext]);

    // Handler para mudanças de estado
    const handleStateChange = useCallback((updates: Partial<EditorState>) => {
        setEditorState(prev => ({ ...prev, ...updates }));
    }, []);

    // ========================================================================
    // 🔥 CRUD OPERATIONS - UNIFIED IMPLEMENTATION
    // ========================================================================

    const handleSave = useCallback(async () => {
        console.log('💾 Salvando via UnifiedCRUD...');
        await crudContext.saveFunnel();
        console.log('✅ Salvo com sucesso via UnifiedCRUD');
    }, [crudContext]);

    const handleCreateNew = useCallback(async () => {
        console.log('🎯 Criando novo funil via UnifiedCRUD...');
        await crudContext.createFunnel('Novo Funil', { templateId });
        console.log('✅ Novo funil criado via UnifiedCRUD');
    }, [crudContext, templateId]);

    const handleDuplicate = useCallback(async () => {
        if (!funnelId && !crudContext.currentFunnel?.id) {
            throw new Error('ID do funil necessário para duplicar');
        }

        const targetId = funnelId || crudContext.currentFunnel!.id;
        console.log('📋 Duplicando funil via UnifiedCRUD:', targetId);

        await crudContext.duplicateFunnel(targetId, 'Cópia de Funil');
        console.log('✅ Funil duplicado via UnifiedCRUD');
    }, [funnelId, crudContext]);

    // 🧪 DEV TESTING - Test CRUD operations
    const handleTestCRUD = useCallback(async () => {
        console.log('🧪 Executando testes CRUD...');
        try {
            const results = await testCRUDOperations();
            if (results.success) {
                console.log('🎉 Todos os testes CRUD passaram!', results.results);
                alert('✅ Todos os testes CRUD passaram! Verifique o console para detalhes.');
            } else {
                console.error('❌ Falha nos testes CRUD:', results.error);
                alert('❌ Falha nos testes CRUD. Verifique o console para detalhes.');
            }
        } catch (error) {
            console.error('❌ Erro ao executar testes:', error);
            alert('❌ Erro ao executar testes CRUD.');
        }
    }, []);

    // ========================================================================
    // 🚀 INITIALIZATION
    // ========================================================================

    // Sync between UnifiedCRUD and UnifiedEditor
    useEffect(() => {
        if (crudContext.currentFunnel && !unifiedEditor.funnel) {
            console.log('� Sincronizando funnel do CRUD para Editor');
            unifiedEditor.loadFunnel(crudContext.currentFunnel.id).catch(console.error);
        }
    }, [crudContext.currentFunnel, unifiedEditor]);

    console.log('🎯 UnifiedEditorCore estado:', {
        mode: editorState.mode,
        type: extractedInfo.type,
        funnelId: extractedInfo.funnelId,
        templateId: extractedInfo.templateId,
        crudFunnelId: crudContext.currentFunnel?.id,
        editorFunnelId: unifiedEditor.funnel?.id,
        isLoading: crudContext.isLoading || unifiedEditor.isLoading,
        isLoadingTemplate,
        templateError,
        error: crudContext.error || unifiedEditor.error,
        aiActive: editorState.aiAssistantActive
    });

    // Mostrar loading se template está carregando
    if (isLoadingTemplate) {
        return (
            <div className={`h-screen w-full bg-background flex flex-col ${className}`}>
                <LoadingSpinner message="Carregando template..." />
            </div>
        );
    }

    // Mostrar erro se template falhou ao carregar
    if (templateError) {
        return (
            <div className={`h-screen w-full bg-background flex flex-col ${className}`}>
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="text-red-500 text-lg mb-4">❌ Erro ao carregar template</div>
                        <p className="text-muted-foreground">{templateError}</p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="mt-4"
                        >
                            Tentar novamente
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`h-screen w-full bg-background flex flex-col ${className}`}>
            {/* Toolbar Moderno com CRUD Actions */}
            <ModernToolbar
                editorState={editorState}
                onStateChange={handleStateChange}
                funnelId={extractedInfo.funnelId || crudContext.currentFunnel?.id}
                onSave={handleSave}
                onCreateNew={handleCreateNew}
                onDuplicate={handleDuplicate}
                onTestCRUD={handleTestCRUD}
            />

            {/* Main Editor Area - Usando EditorProUnified como base única */}
            <div className="flex-1 overflow-hidden">
                <FunnelMasterProvider
                    funnelId={extractedInfo.funnelId || undefined}
                    debugMode={false}
                    enableCache={true}
                >
                    <PureBuilderProvider funnelId={extractedInfo.funnelId || undefined}>
                        <Suspense fallback={
                            <Suspense fallback={<LoadingSpinner message="Carregando componentes..." />}>
                                <TemplateLoadingSkeleton />
                            </Suspense>
                        }>
                            <Suspense fallback={<LoadingSpinner message="Carregando error boundary..." />}>
                                <TemplateErrorBoundary>
                                    <EditorProUnified
                                        funnelId={extractedInfo.funnelId || undefined}
                                        showProFeatures={true}
                                        className="h-full"
                                    />
                                </TemplateErrorBoundary>
                            </Suspense>
                        </Suspense>
                    </PureBuilderProvider>
                </FunnelMasterProvider>
            </div>

            {/* Status Bar com informações CRUD */}
            <div className="h-8 bg-muted/30 border-t border-border flex items-center justify-between px-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Activity className="w-3 h-3" />
                    <span>Editor ativo: {editorState.mode}</span>

                    {unifiedEditor.isLoading && (
                        <>
                            <Separator orientation="vertical" className="h-3" />
                            <span>⏳ Carregando...</span>
                        </>
                    )}

                    {unifiedEditor.isDirty && (
                        <>
                            <Separator orientation="vertical" className="h-3" />
                            <span>✏️ Modificado</span>
                        </>
                    )}

                    {unifiedEditor.lastSaved && (
                        <>
                            <Separator orientation="vertical" className="h-3" />
                            <span>💾 Salvo: {new Date(unifiedEditor.lastSaved).toLocaleTimeString()}</span>
                        </>
                    )}

                    {editorState.aiAssistantActive && (
                        <>
                            <Separator orientation="vertical" className="h-3" />
                            <Brain className="w-3 h-3" />
                            <span>IA Assistente ativo</span>
                        </>
                    )}
                </div>
                <div className="text-xs text-muted-foreground">
                    Neural Editor v2.0 - CRUD Unificado ✅
                </div>
            </div>
        </div>
    );
};

// ===============================
// 🎯 WRAPPER WITH PROVIDERS
// ===============================

const ModernUnifiedEditor: React.FC<ModernUnifiedEditorProps> = (props) => {
    // Extrair info (funnelId ou templateId) da URL também no wrapper
    const extractedInfo = React.useMemo(() => {
        const path = window.location.pathname;
        if (path.startsWith('/editor/') && path.length > '/editor/'.length) {
            const identifier = path.replace('/editor/', '');

            // Verificar se é um template conhecido
            const knownTemplates = [
                'testTemplate',
                'quiz21StepsComplete',
                'leadMagnetFashion',
                'webinarSignup',
                'npseSurvey',
                'roiCalculator'
            ]; const isTemplate = knownTemplates.includes(identifier);

            if (isTemplate) {
                return { templateId: identifier, funnelId: null };
            } else {
                return { templateId: null, funnelId: identifier };
            }
        }

        return {
            funnelId: props.funnelId || null,
            templateId: props.templateId || null
        };
    }, [props.funnelId, props.templateId]);

    return (
        <UnifiedCRUDProvider
            funnelId={extractedInfo.funnelId || undefined}
            autoLoad={true}
            debug={false}
        >
            <UnifiedEditorCore {...props} />
        </UnifiedCRUDProvider>
    );
};

export default ModernUnifiedEditor;