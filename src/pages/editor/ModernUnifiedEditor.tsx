

/**
 * 🎯 MODERN UNIFIED EDITOR - EDITOR DEFINITIVO
 * 
 * Editor 100% moderno que CONSOLIDA TODOS os editores em uma interface única:
 * ✅ Rota principal: /editor
 * ✅ Interface unificada baseada no EditorProUnified
 * ✅ Performance otimizada com lazy loading
 * ✅ Elimina conflitos entre editores fragmentados
 */

import React, { useState, useCallback, Suspense, useEffect, useMemo } from 'react';
import { QUIZ_ESTILO_TEMPLATE_ID, canonicalizeQuizEstiloId, warnIfDeprecatedQuizEstilo } from '../../domain/quiz/quiz-estilo-ids';
// Core & estado
import useEditorRouteInfo from './modern/hooks/useEditorRouteInfo';
import { useUnifiedEditor } from '@/hooks';
import { useUnifiedCRUD, UnifiedCRUDProvider } from '@/context/UnifiedCRUDProvider';
import EditorRuntimeProviders from '@/context/EditorRuntimeProviders';
import useTemplateLifecycle from './modern/hooks/useTemplateLifecycle';
import useFunnelSyncLogic from './modern/hooks/useFunnelSync';
import useQuizSyncBridge from './modern/hooks/useQuizSyncBridge';
import { useEditorCrudOperations } from './modern/logic/crudOperations';
import { isEditorCoreV2Enabled } from '@/utils/editorFeatureFlags';
import { useEditorCoreSelectors } from '@/context/useEditorCoreSelectors';
import { useCoreQuizSteps } from '@/context/useCoreQuizSteps';
import { useEditorCore } from '@/context/EditorCoreProvider';
// UI Layout / painéis / canvas
import FourColumnEditorLayout from '@/components/editor/layout/FourColumnEditorLayout';
// Substituído: usar StepSidebar canônico (sidebars)
import StepSidebar from '@/components/editor/sidebars/StepSidebar';
import BlockPalette from '@/components/editor/palette/BlockPalette';
import { PropertiesPanel } from '@/components/editor/properties/PropertiesPanel';
import QuizStepPropertiesPanel from '@/components/editor/properties/QuizStepPropertiesPanel';
import RealExperienceCanvas from '@/pages/editor/modern/runtime/RealExperienceCanvas';
// Utilidades/UI básicas
// Lógica de steps extraída para hooks dedicados
import { useRuntimeSteps } from './modern/hooks/useRuntimeSteps';
import { useDerivedSteps } from './modern/hooks/useDerivedSteps';
import { useUnifiedStepsAdapter } from './modern/hooks/useUnifiedStepsAdapter';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
// Lazy heavy components
import type { EditorMode as ToolbarEditorMode } from './modern/components/ModernToolbar';
const ModernToolbar = React.lazy(() => import('./modern/components/ModernToolbar'));
const UnifiedEditorCanvas = React.lazy(() => import('./modern/components/UnifiedEditorCanvas'));
const EditorStatusBar = React.lazy(() => import('./modern/components/EditorStatusBar'));
// ✅ Mover lazy de QuizEditorIntegratedPage para topo para garantir chunk estável
const QuizEditorIntegratedPage = React.lazy(() => import('./QuizEditorIntegratedPage'));

// � ErrorBoundary local simples para evitar travar em fallback infinito silencioso
interface LocalLazyBoundaryProps { fallback?: React.ReactNode; children?: React.ReactNode }
class LocalLazyBoundary extends React.Component<LocalLazyBoundaryProps, { error: any }> {
    constructor(props: any) { super(props); this.state = { error: null }; }
    static getDerivedStateFromError(error: any) { return { error }; }
    componentDidCatch(error: any, info: any) { console.error('[Editor][LazyBoundary] erro em lazy chunk', error, info); }
    render() {
        if (this.state.error) {
            return this.props.fallback || <div className="p-2 text-xs text-red-500">Falha ao carregar componente.</div>;
        }
        return <>{this.props.children}</>;
    }
}

// 🪵 Util seguro de debug para evitar quebra fora do Vite
function isEditorDebug() {
    try { return typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_EDITOR_DEBUG === 'true'; } catch { return false; }
}
function debugLog(...args: any[]) { if (isEditorDebug()) console.log('[EditorDebug]', ...args); }

// �📡 Publication Settings Integration
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

/**
 * UnifiedEditorCore
 * Orquestra o fluxo principal do Editor:
 *  1. Resolve funnelId/templateId (useEditorRouteInfo)
 *  2. Redireciona para editor especializado se for quiz-estilo canônico
 *  3. Carrega template/contexto CRUD (useTemplateLifecycle + UnifiedCRUD)
 *  4. Sincroniza funnel (useFunnelSyncLogic) e quiz (useQuizSyncBridge)
 *  5. Deriva steps para UI (useDerivedSteps) e runtime preview (useRuntimeSteps)
 *  6. Gerencia estado de UI (toolbarState + modos realtime / preview)
 *  7. Renderiza layout em 4 colunas com sidebars, palette, canvas e properties
 */
export const UnifiedEditorCore: React.FC<ModernUnifiedEditorProps> = ({
    funnelId,
    templateId,
    mode = 'visual',
    className = ''
}) => {
    // 🎯 EXTRAIR FUNNEL ID OU TEMPLATE ID DA URL 
    const extractedInfo = useEditorRouteInfo({ funnelIdProp: funnelId, templateIdProp: templateId });

    // 🎯 QUIZ-ESTILO: Detectar e redirecionar para página especializada
    if (extractedInfo.type === 'quiz-template' && extractedInfo.templateId === QUIZ_ESTILO_TEMPLATE_ID) {
        debugLog('Redirecionando para QuizEditorIntegratedPage...');
        return (
            <div className={`modern-unified-editor ${className}`}>
                <LocalLazyBoundary fallback={<LoadingSpinner />}>
                    <Suspense fallback={<LoadingSpinner />}>
                        <QuizEditorIntegratedPage funnelId={extractedInfo.funnelId || undefined} />
                    </Suspense>
                </LocalLazyBoundary>
            </div>
        );
    }

    const pureBuilderTargetId = React.useMemo(() => {
        const raw = extractedInfo.funnelId || extractedInfo.templateId || funnelId || templateId || QUIZ_ESTILO_TEMPLATE_ID;
        warnIfDeprecatedQuizEstilo(raw);
        const canonical = canonicalizeQuizEstiloId(raw);
        if (!canonical) {
            debugLog('fallback canonical quiz-estilo aplicado', { raw });
        }
        return canonical || QUIZ_ESTILO_TEMPLATE_ID;
    }, [extractedInfo.funnelId, extractedInfo.templateId, funnelId, templateId]);

    // 🎯 UNIFIED CRUD CONTEXT
    const crudContext = useUnifiedCRUD();
    const { isLoadingTemplate, templateError } = useTemplateLifecycle({ extractedInfo: extractedInfo as any, crudContext });
    const unifiedEditor = useUnifiedEditor();
    const coreV2 = isEditorCoreV2Enabled();
    const coreSelectors = coreV2 ? useEditorCoreSelectors() : null;
    const coreQuiz = coreV2 ? useCoreQuizSteps() : null;
    const coreCtx = coreV2 ? useEditorCore() : null;

    // Estado do editor UI
    const [editorState, setEditorState] = useState<EditorState>({
        mode: mode as ToolbarEditorMode,
        aiAssistantActive: false,
        previewMode: false,
        realExperienceMode: false
    });

    // 🎯 FUNNEL SYNC
    const { detectedFunnelType, funnelData, isDetectingType, DetectorElement } = useFunnelSyncLogic({
        funnelId: extractedInfo.funnelId,
        crudContext,
        unifiedEditor
    });

    // 🎯 QUIZ SYNC BRIDGE
    const quizBridge = useQuizSyncBridge({ extractedInfo: extractedInfo as any, unifiedEditor, crudContext });

    // 🧱 DERIVAÇÃO DE STEPS PARA SIDEBAR (legacy) + Adapter unificado editável
    const derivedSteps = useDerivedSteps({ quizBridge, unifiedEditor });
    const unifiedStepsAdapter = useUnifiedStepsAdapter();

    const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
    const selectedBlock = useMemo(() => {
        if (!selectedStepId) return null;
        const blocks = (unifiedEditor as any)?.stepBlocks;
        if (Array.isArray(blocks)) {
            const found = blocks.find((b: any) => b.id === selectedStepId);
            if (found) return found;
        }
        const quizSteps: any[] = (quizBridge as any)?.steps || [];
        if (quizBridge.active && Array.isArray(quizSteps) && quizSteps.length) {
            return quizSteps.find((s: any) => (s.id || s.key) === selectedStepId) || null;
        }
        return null;
    }, [selectedStepId, unifiedEditor, quizBridge]);

    // Steps para runtime preview (Core V2 ou fallback legado)
    const runtimeSteps = useRuntimeSteps({ coreV2, coreQuiz, unifiedEditor });

    const handleSelectStep = useCallback((id: string) => {
        setSelectedStepId(id);
    }, []);

    const handleUpdateSelected = useCallback((updates: Record<string, any>) => {
        if (selectedStepId && unifiedStepsAdapter.getStep(selectedStepId)) {
            unifiedStepsAdapter.updateStep(selectedStepId, updates);
            console.log('[QuizStepPropertiesPanel] step updated', selectedStepId, updates);
        } else {
            console.log('[PropertiesPanel] updates pendentes de integração', updates);
        }
    }, [selectedStepId, unifiedStepsAdapter]);

    const handleStateChange = useCallback((updates: Partial<EditorState>) => {
        debugLog('handleStateChange chamado', { updates });
        setEditorState(prev => {
            const newState = { ...prev, ...updates };
            debugLog('novo estado', newState);
            return newState;
        });
    }, []);

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

    if (isLoadingTemplate) {
        return (
            <div className={`h-screen w-full bg-background flex flex-col ${className}`}>
                <LoadingSpinner />
            </div>
        );
    }
    if (templateError) {
        return (
            <div className={`h-screen w-full bg-background flex flex-col ${className}`}>
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="text-red-500 text-lg mb-4">❌ Erro ao carregar template</div>
                        <p className="text-muted-foreground">{templateError}</p>
                        <Button onClick={() => window.location.reload()} className="mt-4">Tentar novamente</Button>
                    </div>
                </div>
            </div>
        );
    }

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
        <div className="h-12 border-b flex items-center px-4 text-sm text-muted-foreground bg-gradient-to-r from-background to-muted/30 animate-pulse">Carregando editor…</div>
    );
    const CanvasFallback = () => (
        <div className="flex-1 flex items-center justify-center"><LoadingSpinner /></div>
    );
    const StatusFallback = () => (
        <div className="h-6 border-t text-xs px-3 flex items-center text-muted-foreground bg-background/50">Inicializando…</div>
    );

    // Exporta JSON (somente Core V2) - útil para debug/migração
    const handleExportJson = useCallback(() => {
        if (!coreV2 || !coreQuiz || !coreCtx) return;
        const payload = {
            meta: {
                generatedAt: new Date().toISOString(),
                steps: coreQuiz.steps.length,
                hash: coreQuiz.hash,
                metrics: coreCtx.state.metrics || null,
                version: coreCtx.state.version
            },
            steps: coreQuiz.steps
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quiz-export-${coreQuiz.hash}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, [coreV2, coreQuiz, coreCtx]);

    return (
        <div className={`h-screen w-full flex flex-col bg-gradient-to-br from-background via-background to-muted/30 ${className} relative`}>
            <div className="relative border-b backdrop-blur supports-[backdrop-filter]:bg-background/70 bg-background/90">
                <LocalLazyBoundary fallback={<ToolbarFallback />}>
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
                </LocalLazyBoundary>
                <div className="flex items-center gap-2 px-4 py-1 border-t bg-muted/40 text-[10px] uppercase tracking-wide font-medium text-muted-foreground">
                    <span className="px-1.5 py-0.5 rounded bg-secondary/50 border border-border/60">Core {coreV2 ? 'V2' : 'Legacy'}</span>
                    {runtimeSteps.length > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-secondary/30 border border-border/60">{runtimeSteps.length} steps</span>
                    )}
                    {coreV2 && coreQuiz && (
                        <button onClick={handleExportJson} className="px-1.5 py-0.5 rounded border border-border/60 hover:bg-accent/50 transition text-[10px]">Export JSON</button>
                    )}
                </div>
            </div>
            <FourColumnEditorLayout
                className="flex-1 relative z-[1]"
                sidebar={<StepSidebar
                    currentStep={selectedStepId ? (parseInt(selectedStepId.replace('step-', ''), 10) || 1) : 1}
                    totalSteps={(derivedSteps?.length || runtimeSteps.length || 1)}
                    stepHasBlocks={Object.fromEntries(
                        (derivedSteps || []).map((_: any, i: number) => [i + 1, true])
                    ) as Record<number, boolean>}
                    stepValidation={{}}
                    onSelectStep={(n: number) => handleSelectStep(`step-${n}`)}
                    getStepAnalysis={(n: number) => ({ icon: 'info', label: derivedSteps[n - 1]?.label || `Step ${n}`, desc: derivedSteps[n - 1]?.type || '—' })}
                    renderIcon={() => <span className="w-4 h-4 text-gray-400">ⓘ</span>}
                />}
                palette={<BlockPalette onInsert={(t) => console.log('Inserir bloco futuro', t)} />}
                canvas={
                    editorState.realExperienceMode ? (
                        <RealExperienceCanvas
                            funnelId={extractedInfo.funnelId || undefined}
                            stepsSource={runtimeSteps}
                            onExit={() => handleStateChange({ realExperienceMode: false })}
                            onReset={() => {/* noop future */ }}
                        />
                    ) : (
                        <LocalLazyBoundary fallback={<CanvasFallback />}>
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
                        </LocalLazyBoundary>
                    )
                }
                properties={(() => {
                    const quizStep = selectedStepId ? unifiedStepsAdapter.getStep(selectedStepId) : null;
                    if (quizStep) {
                        return <QuizStepPropertiesPanel step={quizStep as any} onChange={(id, u) => handleUpdateSelected(u)} />;
                    }
                    return <PropertiesPanel selectedBlock={selectedBlock as any} onUpdate={handleUpdateSelected} />;
                })()}
            />
            <div className="border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <LocalLazyBoundary fallback={<StatusFallback />}>
                    <Suspense fallback={<StatusFallback />}>
                        <EditorStatusBar
                            mode={editorState.mode}
                            unifiedEditor={unifiedEditor}
                            aiActive={editorState.aiAssistantActive}
                            detectedFunnelType={detectedFunnelType}
                            funnelData={funnelData}
                        />
                    </Suspense>
                </LocalLazyBoundary>
            </div>
            {quizBridge.active && (
                <div className="pointer-events-none select-none absolute top-[4.25rem] right-4 text-[10px] text-muted-foreground flex gap-2 items-center z-[5]">
                    <span className="px-2 py-1 rounded bg-secondary/40 border border-border shadow-sm">
                        Quiz: {quizBridge.answersCount} respostas {unifiedStepsAdapter.dirty ? '• alterações locais' : ''}
                    </span>
                </div>
            )}
        </div>
    );
};

// ===============================
// 🎯 WRAPPER WITH PROVIDERS
// ===============================

/**
 * ModernUnifiedEditor (Wrapper)
 * Adiciona providers de contexto (CRUD + Runtime) e faz detecção inicial
 * de funnelId/templateId diretamente da URL como fallback quando props não são passadas.
 */
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
            autoLoad={Boolean(extractedInfo.funnelId)}
            debug={false}
        >
            <EditorRuntimeProviders funnelId={extractedInfo.funnelId || undefined} debugMode={false}>
                <UnifiedEditorCore {...props} />
            </EditorRuntimeProviders>
        </UnifiedCRUDProvider>
    );
};

export default ModernUnifiedEditor;