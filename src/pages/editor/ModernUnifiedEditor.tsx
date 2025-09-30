
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
import { QUIZ_ESTILO_TEMPLATE_ID, canonicalizeQuizEstiloId, warnIfDeprecatedQuizEstilo } from '../../domain/quiz/quiz-estilo-ids';
import useEditorRouteInfo from './modern/hooks/useEditorRouteInfo';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useUnifiedCRUD, UnifiedCRUDProvider } from '@/context/UnifiedCRUDProvider';
import { useUnifiedEditor } from '@/hooks';
import useTemplateLifecycle from './modern/hooks/useTemplateLifecycle';
import useFunnelSyncLogic from './modern/hooks/useFunnelSync';
import useQuizSyncBridge from './modern/hooks/useQuizSyncBridge';
import { useEditorCrudOperations } from './modern/logic/crudOperations';
// Lazy heavy components
import type { EditorMode as ToolbarEditorMode } from './modern/components/ModernToolbar';
const ModernToolbar = React.lazy(() => import('./modern/components/ModernToolbar'));
const UnifiedEditorCanvas = React.lazy(() => import('./modern/components/UnifiedEditorCanvas'));
const EditorStatusBar = React.lazy(() => import('./modern/components/EditorStatusBar'));

// 📡 Publication Settings Integration
// PublicationSettingsButton removido (não utilizado diretamente nesta composição)
// import { PublicationSettingsButton } from '@/components/editor/publication/PublicationButton';

// 🎛️ NoCode Configuration Panel
// EditorNoCodePanel removido (não utilizado após extrações)
// import EditorNoCodePanel from '@/components/editor/EditorNoCodePanel';
// Toolbar extraída (já carregada via React.lazy acima)
// CRUD hook extraído
// Imports removidos (mantidos como comentário de referência, podem ser reintroduzidos se necessário)
// import { EditorProUnified } from '@/components/editor/EditorProUnified';
// import { TemplateLoadingSkeleton } from '@/components/ui/template-loading-skeleton';
// import { TemplateErrorBoundary } from '@/components/error/UnifiedErrorBoundary';
// import { FunnelMasterProvider } from '@/providers/FunnelMasterProvider';
// import PureBuilderProvider from '@/components/editor/PureBuilderProvider';
// import { getQuizDynamicMode } from '@/templates/quiz21StepsAdapter';

// Tipos locais (fallback simples para EditorMode caso não exista global)
interface ModernUnifiedEditorProps { funnelId?: string; templateId?: string; mode?: ToolbarEditorMode; className?: string; }
interface EditorState { mode: ToolbarEditorMode; aiAssistantActive: boolean; previewMode: boolean; realExperienceMode: boolean; }

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
    const extractedInfo = useEditorRouteInfo({ funnelIdProp: funnelId, templateIdProp: templateId });

    // 🎯 QUIZ-ESTILO: Detectar e redirecionar para página especializada
    if (extractedInfo.type === 'quiz-template' && extractedInfo.templateId === QUIZ_ESTILO_TEMPLATE_ID) {
        console.log('🚀 Redirecionando para QuizEditorIntegratedPage...');

        // Importar dinamicamente a página especializada
        const QuizEditorIntegratedPage = React.lazy(() =>
            import('./QuizEditorIntegratedPage')
        );

        return (
            <div className={`modern-unified-editor ${className}`}>
                <Suspense fallback={<LoadingSpinner />}>
                    <QuizEditorIntegratedPage
                        funnelId={extractedInfo.funnelId || undefined}
                    />
                </Suspense>
            </div>
        );
    }

    const pureBuilderTargetId = React.useMemo(() => {
        const raw = extractedInfo.funnelId || extractedInfo.templateId || funnelId || templateId || QUIZ_ESTILO_TEMPLATE_ID;
        warnIfDeprecatedQuizEstilo(raw);
        return canonicalizeQuizEstiloId(raw) || QUIZ_ESTILO_TEMPLATE_ID;
    }, [extractedInfo.funnelId, extractedInfo.templateId, funnelId, templateId]);

    // 🎯 UNIFIED CRUD CONTEXT (mover acima para uso em hooks subsequentes)
    const crudContext = useUnifiedCRUD();

    // 🎯 TEMPLATE LIFECYCLE (hook)
    const { isLoadingTemplate, templateError } = useTemplateLifecycle({ extractedInfo: extractedInfo as any, crudContext });

    // (crudContext já definido acima)

    // 🎯 UNIFIED EDITOR HOOK - CRUD INTEGRATION
    const unifiedEditor = useUnifiedEditor();

    // Estado do editor UI
    const [editorState, setEditorState] = useState<EditorState>({
        mode: mode as ToolbarEditorMode,
        aiAssistantActive: false,
        previewMode: false,
        realExperienceMode: false // Inicialmente desabilitado
    });

    // 🎯 FUNNEL SYNC & TYPE DETECTION (hook)
    const { detectedFunnelType, funnelData, isDetectingType, DetectorElement } = useFunnelSyncLogic({
        funnelId: extractedInfo.funnelId,
        crudContext,
        unifiedEditor
    });

    // 🎯 QUIZ SYNC BRIDGE
    const quizBridge = useQuizSyncBridge({ extractedInfo: extractedInfo as any, unifiedEditor, crudContext });

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

    // 🔄 CRUD OPERATIONS via hook extraído
    const {
        handleSave,
        handleCreateNew,
        handleDuplicate,
        handleTestCRUD
    } = useEditorCrudOperations(
        crudContext,
        {
            funnelId: extractedInfo.funnelId || crudContext.currentFunnel?.id,
            templateId: extractedInfo.templateId || templateId
        }
    );

    // ========================================================================
    // 🚀 INITIALIZATION
    // ========================================================================

    // (Sincronização movida para useFunnelSync)

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

    if (quizBridge.active) {
        console.log('🧩 QuizBridge:', {
            step: quizBridge.currentStepKey,
            answersCount: quizBridge.answersCount,
            scores: quizBridge.scores
        });
    }

    // Mostrar loading se template está carregando
    if (isLoadingTemplate) {
        return (
            <div className={`h-screen w-full bg-background flex flex-col ${className}`}>
                <LoadingSpinner />
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

    // Normalização de modo e estado para toolbar (evita recriar objeto grande em cada render)
    const allowed: ToolbarEditorMode[] = ['visual', 'builder', 'funnel', 'headless', 'admin-integrated'];
    const normalizedMode: ToolbarEditorMode = allowed.includes(editorState.mode as ToolbarEditorMode)
        ? editorState.mode as ToolbarEditorMode
        : 'visual';
    const toolbarState = {
        mode: normalizedMode,
        aiAssistantActive: editorState.aiAssistantActive,
        previewMode: editorState.previewMode,
        realExperienceMode: editorState.realExperienceMode
    } as const;

    const ToolbarFallback = () => (
        <div className="h-12 border-b flex items-center px-4 text-sm text-muted-foreground bg-background/60">Carregando editor…</div>
    );
    const CanvasFallback = () => (
        <div className="flex-1 flex items-center justify-center"><LoadingSpinner /></div>
    );
    const StatusFallback = () => (
        <div className="h-6 border-t text-xs px-3 flex items-center text-muted-foreground bg-background/50">Inicializando…</div>
    );

    return (
        <div className={`h-screen w-full bg-background flex flex-col ${className}`}>
            <Suspense fallback={<ToolbarFallback />}>
                <ModernToolbar
                    editorState={toolbarState as any}
                    onStateChange={handleStateChange as any}
                    funnelId={extractedInfo.funnelId || crudContext.currentFunnel?.id}
                    mode={normalizedMode}
                    onSave={handleSave}
                    onCreateNew={handleCreateNew}
                    onDuplicate={handleDuplicate}
                    onTestCRUD={handleTestCRUD}
                />
            </Suspense>

            <Suspense fallback={<CanvasFallback />}>
                <UnifiedEditorCanvas
                    extractedInfo={extractedInfo as any}
                    detectorElement={DetectorElement}
                    detectedFunnelType={detectedFunnelType}
                    isDetectingType={isDetectingType}
                    pureBuilderTargetId={pureBuilderTargetId}
                    realExperienceMode={editorState.realExperienceMode}
                />
            </Suspense>

            <Suspense fallback={<StatusFallback />}>
                <EditorStatusBar
                    mode={editorState.mode}
                    unifiedEditor={unifiedEditor}
                    aiActive={editorState.aiAssistantActive}
                    detectedFunnelType={detectedFunnelType}
                    funnelData={funnelData}
                />
            </Suspense>
            {quizBridge.active && (
                <div className="absolute top-2 right-4 text-xs text-muted-foreground flex gap-2 items-center">
                    <span className="px-2 py-1 rounded bg-secondary/40 border border-border">Quiz: {quizBridge.answersCount} respostas</span>
                </div>
            )}
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
                QUIZ_ESTILO_TEMPLATE_ID, // novo canônico
                'leadMagnetFashion',
                'webinarSignup',
                'npseSurvey',
                'roiCalculator'
            ];
            // Guard de alias legado
            warnIfDeprecatedQuizEstilo(identifier);
            const canonical = canonicalizeQuizEstiloId(identifier);
            const isTemplate = knownTemplates.includes(canonical || identifier);

            if (isTemplate) {
                return { templateId: canonical || identifier, funnelId: null };
            } else {
                return { templateId: null, funnelId: identifier };
            }
        }

        return {
            funnelId: props.funnelId || null,
            templateId: props.templateId || null
        };
    }, [props.funnelId, props.templateId]);

    // Listener para carregamento lazy de componentes via PerformanceOptimizer
    useEffect(() => {
        function handleLazy(e: Event) {
            const detail: any = (e as CustomEvent).detail;
            if (!detail?.name) return;
            // Placeholder: poderíamos injetar dinamicamente em um registry ou disparar outro evento.
            console.log('[lazy-component-loaded]', detail.name, detail);
        }
        window.addEventListener('lazy-component-loaded', handleLazy as any);
        return () => window.removeEventListener('lazy-component-loaded', handleLazy as any);
    }, []);

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