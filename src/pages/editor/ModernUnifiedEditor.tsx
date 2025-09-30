
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
import { QUIZ_ESTILO_TEMPLATE_ID } from '../../domain/quiz/quiz-estilo-ids';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
    Layout, Brain, Settings, Target,
    Component, Crown, Eye, CheckCircle, Activity
} from 'lucide-react';

// 📡 Publication Settings Integration
import { PublicationSettingsButton } from '@/components/editor/publication/PublicationButton';

// 🎛️ NoCode Configuration Panel
import EditorNoCodePanel from '@/components/editor/EditorNoCodePanel';

// Lazy loading do editor principal
const EditorProUnified = React.lazy(() =>
    import('../../components/editor/EditorProUnified')
);

import PureBuilderProvider from '@/components/editor/PureBuilderProvider';

// 🔧 CORREÇÃO: Lazy loading dos componentes de error e loading
const TemplateErrorBoundary = React.lazy(() =>
    import('../../components/error/TemplateErrorBoundary')
);
const TemplateLoadingSkeleton = React.lazy(() =>
    import('../../components/ui/template-loading-skeleton')
);

// Providers necessários
import { FunnelMasterProvider } from '@/providers/FunnelMasterProvider';
import { useNotification } from '@/components/ui/Notification';
import UnifiedCRUDProvider, { useUnifiedCRUD } from '@/context/UnifiedCRUDProvider';

// 🎯 CRUD Services Integration
import { useUnifiedEditor } from '@/hooks/core/useUnifiedEditor';

// 🔄 Editor-Dashboard Sync Integration
import { EditorDashboardSyncService } from '@/services/core/EditorDashboardSyncService';
import { UnifiedRoutingService } from '@/services/core/UnifiedRoutingService';

// 🎯 TEMPLATE REGISTRY INTEGRATION
import { loadFullTemplate, convertTemplateToEditorFormat } from '@/templates/registry';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { getQuizDynamicMode } from '@/templates/quiz21StepsAdapter';

// 🧪 Development Testing
import testCRUDOperations from '@/utils/testCRUDOperations';

// 🔍 FUNNEL TYPE DETECTION
import FunnelTypeDetector from '@/components/editor/FunnelTypeDetector';
import type { FunnelType } from '@/services/FunnelTypesRegistry';

// ===============================
// 🔧 TEMPLATE CONVERSION UTILITIES
// ===============================

/**
 * Converte QUIZ_STYLE_21_STEPS_TEMPLATE para formato compatível com o editor
 */
function convertTemplateToEditorBlocks(templateData: Record<string, any[]>): any[] {
    const allBlocks: any[] = [];

    Object.entries(templateData).forEach(([stepKey, stepBlocks]) => {
        if (stepKey.startsWith('step-') && Array.isArray(stepBlocks)) {
            stepBlocks.forEach((block, index) => {
                allBlocks.push({
                    ...block,
                    id: `${stepKey}-${block.id}`,
                    stepId: stepKey,
                    stepNumber: parseInt(stepKey.replace('step-', '')),
                    order: (parseInt(stepKey.replace('step-', '')) - 1) * 100 + index
                });
            });
        }
    });

    console.log(`📊 Convertidos ${allBlocks.length} blocos de ${Object.keys(templateData).length} steps`);
    return allBlocks;
}

/**
 * Sistema de fallback para templates não encontrados
 */
function createFallbackTemplate(templateId: string) {
    console.log(`⚠️ Criando template de fallback para: ${templateId}`);
    return {
        'step-1': [
            {
                id: 'fallback-welcome',
                type: 'text-inline',
                properties: {
                    content: `Template "${templateId}" não encontrado. Este é um template de demonstração.`,
                    textAlign: 'center',
                    fontSize: 'text-xl',
                    fontWeight: 'font-bold',
                    color: '#1A365D'
                },
                content: {},
                order: 0
            },
            {
                id: 'fallback-description',
                type: 'text-inline',
                properties: {
                    content: 'Por favor, verifique se o template existe ou entre em contato com o suporte.',
                    textAlign: 'center',
                    fontSize: 'text-base',
                    color: '#718096'
                },
                content: {},
                order: 1
            }
        ]
    };
}

// ===============================
// 🎯 TYPES & INTERFACES
// ===============================

type EditorMode = 'visual' | 'builder' | 'funnel' | 'headless' | 'admin-integrated';

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
    mode?: EditorMode;
    adminReturnUrl?: string;
    onSave?: () => Promise<void>;
    onCreateNew?: () => Promise<void>;
    onDuplicate?: () => Promise<void>;
    onTestCRUD?: () => Promise<void>;
}

const ModernToolbar: React.FC<ModernToolbarProps> = ({
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
    }, [onTestCRUD, addNotification, isOperating]);

    const handleBackToAdmin = useCallback(() => {
        if (mode === 'admin-integrated' && funnelId) {
            UnifiedRoutingService.navigateEditorToAdmin(funnelId);
            addNotification('🔙 Retornando ao dashboard admin', 'info');
        }
    }, [mode, funnelId, addNotification]);

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
                {/* Botão Voltar ao Admin (apenas em modo admin-integrated) */}
                {mode === 'admin-integrated' && (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBackToAdmin}
                            disabled={isOperating}
                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                            🔙 Voltar ao Admin
                        </Button>
                        <Separator orientation="vertical" className="h-4" />
                    </>
                )}

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
                    onClick={() => {
                        console.log('🎯 [DEBUG] Clicou no botão Real. Estado atual:', editorState.realExperienceMode);
                        const newState = !editorState.realExperienceMode;
                        console.log('🎯 [DEBUG] Novo estado:', newState);
                        onStateChange({ realExperienceMode: newState });
                    }}
                    disabled={isOperating}
                    title="Ativar experiência real com QuizOrchestrator"
                    className={editorState.realExperienceMode ? "bg-green-600 hover:bg-green-700" : ""}
                >
                    <Target className="w-4 h-4 mr-2" />
                    {editorState.realExperienceMode ? "Real ✓" : "Real"}
                </Button>

                <Separator orientation="vertical" className="h-4" />

                {/* 🎛️ Configurações NoCode */}
                <EditorNoCodePanel className="gap-2" />

                {/* 📡 Configurações de Publicação */}
                {funnelId && (
                    <PublicationSettingsButton
                        funnelId={funnelId}
                        funnelTitle={`Funil ${funnelId}`}
                        className="gap-2"
                    />
                )}

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
        const urlParams = new URLSearchParams(window.location.search);
        const templateParam = urlParams.get('template');
        const funnelParam = urlParams.get('funnel');

        console.log('🔍 Analisando URL:', { path, templateParam, funnelParam });

        // 🚨 CORREÇÃO CRÍTICA: Processar query parameter funnel primeiro
        if (funnelParam) {
            console.log('✅ Funnel encontrado via query param:', funnelParam);
            return { templateId: null, funnelId: funnelParam, type: 'funnel' };
        }

        // 🚨 CORREÇÃO CRÍTICA: Processar query parameter template segundo
        if (templateParam) {
            console.log('✅ Template encontrado via query param:', templateParam);

            // 🎯 QUIZ-ESTILO: Detectar template do quiz
            // Centralização de ID via constante
            if (templateParam === QUIZ_ESTILO_TEMPLATE_ID) {
                console.log(`🎯 Detectado template ${QUIZ_ESTILO_TEMPLATE_ID}`);
                return { templateId: templateParam, funnelId: null, type: 'quiz-template' };
            }

            return { templateId: templateParam, funnelId: null, type: 'template' };
        }

        // Detectar se é template ou funil na URL path
        if (path.startsWith('/editor/') && path.length > '/editor/'.length) {
            const identifier = path.replace('/editor/', '');

            // 🎯 DETECÇÃO DINÂMICA: Verificar se existe como template ou tratar como funnel
            // Primeiro assumir que pode ser qualquer coisa
            console.log('✅ Identificador encontrado no path:', identifier);

            // 🎯 DETECÇÃO MELHORADA: Incluir mais padrões de template
            const looksLikeTemplate = /^(step-|template|quiz|test|funnel|default-|optimized-|style-)/i.test(identifier);

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

    // 🎯 QUIZ-ESTILO: Detectar e redirecionar para página especializada
    if (extractedInfo.type === 'quiz-template' && extractedInfo.templateId === QUIZ_ESTILO_TEMPLATE_ID) {
        console.log('🚀 Redirecionando para QuizEditorIntegratedPage...');

        // Importar dinamicamente a página especializada
        const QuizEditorIntegratedPage = React.lazy(() =>
            import('./QuizEditorIntegratedPage')
        );

        return (
            <div className={`modern-unified-editor ${className}`}>
                <Suspense fallback={<LoadingSpinner message="Carregando Quiz Editor..." />}>
                    <QuizEditorIntegratedPage
                        funnelId={extractedInfo.funnelId || undefined}
                    />
                </Suspense>
            </div>
        );
    }

    const pureBuilderTargetId = React.useMemo(() => {
        return extractedInfo.funnelId || extractedInfo.templateId || funnelId || templateId || 'quiz21StepsComplete';
    }, [extractedInfo.funnelId, extractedInfo.templateId, funnelId, templateId]);

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

    // 🎯 FUNNEL TYPE DETECTION STATE
    const [detectedFunnelType, setDetectedFunnelType] = useState<FunnelType | null>(null);
    const [funnelData, setFunnelData] = useState<any>(null);
    const [isDetectingType, setIsDetectingType] = useState(false);

    // 🎯 EFFECT: Iniciar detecção quando funnel for carregado
    useEffect(() => {
        if (extractedInfo.funnelId && !detectedFunnelType) {
            console.log('🔍 Iniciando detecção de tipo para funnel:', extractedInfo.funnelId);
            setIsDetectingType(true);
        }
    }, [extractedInfo.funnelId, detectedFunnelType]);

    // 🔄 EFFECT: Conectar editor ao sistema de sincronização
    useEffect(() => {
        console.log('🔗 ModernUnifiedEditor: Conectando ao EditorDashboardSyncService...');

        // Conectar editor ao serviço de sincronização
        const disconnect = EditorDashboardSyncService.connectEditor({
            funnelId: extractedInfo.funnelId,
            refresh: () => {
                // Função para atualizar o editor quando houver mudanças
                console.log('🔄 Editor: Recebida solicitação de atualização do dashboard');
                // Aqui você pode adicionar lógica para recarregar dados se necessário
            }
        });

        // Cleanup na desmontagem
        return disconnect;
    }, [extractedInfo.funnelId]);

    // 🎯 TEMPLATE LOADING EFFECT - CORREÇÃO PARA quiz21StepsComplete
    useEffect(() => {
        if (extractedInfo.type === 'template' && extractedInfo.templateId) {
            console.log('🎯 Carregando template:', extractedInfo.templateId);
            setIsLoadingTemplate(true);
            setTemplateError(null);

            // 🚨 CORREÇÃO CRÍTICA: Carregar quiz21StepsComplete diretamente
            if (extractedInfo.templateId === 'quiz21StepsComplete') {
                try {
                    console.log('🎯 Carregando QUIZ_STYLE_21_STEPS_TEMPLATE diretamente...');

                    // Verificar se o template existe e tem conteúdo
                    if (!QUIZ_STYLE_21_STEPS_TEMPLATE || Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).length === 0) {
                        throw new Error('Template quiz21StepsComplete está vazio ou não existe');
                    }

                    // Converter template para formato compatível com o editor
                    const convertedBlocks = convertTemplateToEditorBlocks(QUIZ_STYLE_21_STEPS_TEMPLATE);

                    if (convertedBlocks.length === 0) {
                        throw new Error('Template quiz21StepsComplete não produziu blocos válidos');
                    }

                    console.log('✅ Template quiz21StepsComplete convertido:', {
                        totalSteps: Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).length,
                        totalBlocks: convertedBlocks.length
                    });

                    // Simular carregamento assíncrono para consistência
                    setTimeout(() => {
                        setIsLoadingTemplate(false);
                        console.log('✅ Template quiz21StepsComplete carregado com sucesso');
                    }, 100);

                } catch (error) {
                    console.error('❌ Erro ao carregar template quiz21StepsComplete:', error);
                    console.log('🔄 Tentando sistema de fallback...');

                    const errorMessage = error instanceof Error ? error.message : String(error);

                    try {
                        // Sistema de fallback
                        const fallbackTemplate = createFallbackTemplate('quiz21StepsComplete');
                        const fallbackBlocks = convertTemplateToEditorBlocks(fallbackTemplate);
                        console.log('✅ Template de fallback criado com sucesso');
                        setTemplateError(`Template original falhou, usando fallback: ${errorMessage}`);
                    } catch (fallbackError) {
                        const fallbackErrorMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
                        console.error('❌ Erro crítico: Fallback também falhou:', fallbackError);
                        setTemplateError(`Erro crítico: ${errorMessage}. Fallback falhou: ${fallbackErrorMessage}`);
                    }

                    setIsLoadingTemplate(false);
                }
            } else {
                // Fallback para outros templates
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
        }
    }, [extractedInfo.templateId, extractedInfo.type]); // 🔧 FIXED: Removido crudContext das dependências

    // Handler para mudanças de estado
    const handleStateChange = useCallback((updates: Partial<EditorState>) => {
        // Gate de logs para evitar ruído em produção
        const DEBUG = (import.meta as any)?.env?.VITE_EDITOR_DEBUG === 'true';
        if (DEBUG) {
            console.log('🎯 [DEBUG] handleStateChange chamado:', updates);
            console.log('🎯 [DEBUG] Estado anterior:', editorState);
        }
        setEditorState(prev => {
            const newState = { ...prev, ...updates };
            if (DEBUG) console.log('🎯 [DEBUG] Novo estado:', newState);
            return newState;
        });
    }, [editorState]);

    // ========================================================================
    // 🔥 CRUD OPERATIONS - UNIFIED IMPLEMENTATION
    // ========================================================================

    const handleSave = useCallback(async () => {
        const DEBUG = (import.meta as any)?.env?.VITE_EDITOR_DEBUG === 'true';
        if (DEBUG) console.log('💾 Salvando via UnifiedCRUD...');
        await crudContext.saveFunnel();
        if (DEBUG) console.log('✅ Salvo com sucesso via UnifiedCRUD');
    }, [crudContext]);

    const handleCreateNew = useCallback(async () => {
        const DEBUG = (import.meta as any)?.env?.VITE_EDITOR_DEBUG === 'true';
        if (DEBUG) console.log('🎯 Criando novo funil via UnifiedCRUD...');
        await crudContext.createFunnel('Novo Funil', { templateId });
        if (DEBUG) console.log('✅ Novo funil criado via UnifiedCRUD');
    }, [crudContext, templateId]);

    const handleDuplicate = useCallback(async () => {
        if (!funnelId && !crudContext.currentFunnel?.id) {
            throw new Error('ID do funil necessário para duplicar');
        }

        const targetId = funnelId || crudContext.currentFunnel!.id;
        const DEBUG = (import.meta as any)?.env?.VITE_EDITOR_DEBUG === 'true';
        if (DEBUG) console.log('📋 Duplicando funil via UnifiedCRUD:', targetId);

        await crudContext.duplicateFunnel(targetId, 'Cópia de Funil');
        if (DEBUG) console.log('✅ Funil duplicado via UnifiedCRUD');
    }, [funnelId, crudContext]);

    // 🧪 DEV TESTING - Test CRUD operations
    const handleTestCRUD = useCallback(async () => {
        const DEBUG = (import.meta as any)?.env?.VITE_EDITOR_DEBUG === 'true';
        if (DEBUG) console.log('🧪 Executando testes CRUD...');
        try {
            const results = await testCRUDOperations();
            if (results.success) {
                if (DEBUG) console.log('🎉 Todos os testes CRUD passaram!', results.results);
            } else {
                if (DEBUG) console.error('❌ Falha nos testes CRUD:', results.error);
            }
        } catch (error) {
            if (DEBUG) console.error('❌ Erro ao executar testes:', error);
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
                mode={mode || editorState.mode}
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
                    {/* 🔍 FUNNEL TYPE DETECTION - apenas para funnels específicos */}
                    {extractedInfo.funnelId && (
                        <div className="p-4 border-b bg-background">
                            <FunnelTypeDetector
                                funnelId={extractedInfo.funnelId}
                                onFunnelLoaded={(data) => {
                                    console.log('✅ Funnel data loaded:', data);
                                    setFunnelData(data);
                                    setIsDetectingType(false);
                                }}
                                onTypeDetected={(type) => {
                                    console.log('✅ Funnel type detected:', type);
                                    setDetectedFunnelType(type);

                                    // Ajustar configurações do editor baseado no tipo
                                    if (type.editorConfig.showProgressBar) {
                                        console.log('🔧 Habilitando barra de progresso');
                                    }
                                    if (type.supportsAI) {
                                        console.log('🤖 Suporte a IA detectado');
                                    }
                                }}
                            />
                            {/* Exibir informações do funnel detectado */}
                            {detectedFunnelType && (
                                <div className="mt-2 p-2 bg-primary/5 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{detectedFunnelType.category}</Badge>
                                        <span className="text-sm font-medium">{detectedFunnelType.name}</span>
                                        {detectedFunnelType.supportsAI && (
                                            <Brain className="w-4 h-4 text-primary" />
                                        )}
                                    </div>
                                    {detectedFunnelType.description && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {detectedFunnelType.description}
                                        </p>
                                    )}
                                </div>
                            )}
                            {isDetectingType && (
                                <div className="mt-2 p-2 bg-muted/20 rounded-md">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        <span>Detectando tipo de funil...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <Suspense fallback={
                        <Suspense fallback={<LoadingSpinner message="Carregando componentes..." />}>
                            <TemplateLoadingSkeleton />
                        </Suspense>
                    }>
                        <Suspense fallback={<LoadingSpinner message="Carregando error boundary..." />}>
                            <PureBuilderProvider
                                key={`pure-builder-${pureBuilderTargetId}`}
                                funnelId={pureBuilderTargetId}
                                enableSupabase={false}
                            >
                                <TemplateErrorBoundary>
                                    <EditorProUnified
                                        funnelId={extractedInfo.funnelId || undefined}
                                        realExperienceMode={editorState.realExperienceMode}
                                        showProFeatures={true}
                                        className="h-full"
                                    />
                                </TemplateErrorBoundary>
                            </PureBuilderProvider>
                        </Suspense>
                    </Suspense>
                </FunnelMasterProvider>
            </div>

            {/* Status Bar com informações CRUD */}
            <div className="h-8 bg-muted/30 border-t border-border flex items-center justify-between px-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Activity className="w-3 h-3" />
                    <span>Editor ativo: {editorState.mode}</span>
                    <span className="ml-2 px-2 py-0.5 rounded bg-muted/60">Dynamic Mode: {getQuizDynamicMode()}</span>

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

                    {detectedFunnelType && (
                        <>
                            <Separator orientation="vertical" className="h-3" />
                            <Target className="w-3 h-3" />
                            <span>Tipo: {detectedFunnelType.name}</span>
                        </>
                    )}

                    {funnelData && (
                        <>
                            <Separator orientation="vertical" className="h-3" />
                            <CheckCircle className="w-3 h-3" />
                            <span>Dados carregados</span>
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