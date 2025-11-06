import React, { Suspense, useEffect, useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { stepKeys } from '@/api/steps/hooks';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useSuperUnified } from '@/hooks/useSuperUnified';
import { useDndSystem } from './hooks/useDndSystem';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import type { Block } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { Eye, Edit3, Play, Save, GripVertical, Download } from 'lucide-react';
import { appLogger } from '@/utils/logger';
import { templateService } from '@/services/canonical/TemplateService';
// Loading context (provider + hook)
import { EditorLoadingProvider, useEditorLoading } from '@/contexts/EditorLoadingContext';
// Arquitetura unificada de recursos
import type { EditorResource } from '@/types/editor-resource';

// Static import: navigation column
import StepNavigatorColumn from './components/StepNavigatorColumn';

// Lazy columns
const CanvasColumn = React.lazy(() => import('./components/CanvasColumn'));
const ComponentLibraryColumn = React.lazy(() => import('./components/ComponentLibraryColumn'));
const PropertiesColumn = React.lazy(() => import('./components/PropertiesColumn'));
const PreviewPanel = React.lazy(() => import('./components/PreviewPanel'));

// Error boundary
import { StepErrorBoundary } from '../StepErrorBoundary';

// Dev-only metrics panel
let MetricsPanel: React.LazyExoticComponent<React.ComponentType<any>> | null = null;
if (import.meta.env.DEV) {
    try {
        MetricsPanel = React.lazy(() => import('./components/MetricsPanel').catch(() => ({ default: () => null })));
    } catch (e) {
        console.warn('MetricsPanel failed to load:', e);
    }
}

export type QuizModularEditorProps = {
    /** ID unificado do recurso (template, funnel ou draft) */
    resourceId?: string;
    /** Metadata do recurso (fornecida por useEditorResource) */
    editorResource?: EditorResource | null;
    /** Se o recurso é somente leitura */
    isReadOnly?: boolean;
    /** @deprecated */
    funnelId?: string;
    /** @deprecated */
    templateId?: string;
    /** Step inicial (opcional) */
    initialStepKey?: string;
};

/**
 * Inner component that expects EditorLoadingProvider above it.
 * We keep the provider in the outer default export to guarantee the hook has context.
 */
function QuizModularEditorInner(props: QuizModularEditorProps) {
    // React Query client para prefetch/invalidações
    const queryClient = useQueryClient();
    // Core systems
    const unified = useSuperUnified();
    const dnd = useDndSystem();
    const { enableAutoSave } = useFeatureFlags();

    // Loading context (must be called inside provider)
    const {
        isLoadingTemplate,
        isLoadingStep,
        setTemplateLoading,
        setStepLoading
    } = useEditorLoading();

    // Unpack only what's necessary from unified to keep deps stable
    const {
        state: unifiedState,
        setCurrentStep,
        addBlock,
        saveFunnel,
        showToast,
        getStepBlocks,
        setStepBlocks,
        setSelectedBlock,
        removeBlock,
        reorderBlocks,
        updateBlock,
    } = unified;

    // Resource unification (support legacy props)
    const resourceId = props.resourceId || props.templateId || props.funnelId;
    const isReadOnly = props.isReadOnly ?? false;
    const resourceMetadata = props.editorResource ?? null;

    // Safe current step
    const safeCurrentStep = Math.max(1, unifiedState.editor.currentStep || 1);
    const currentStepKey = `step-${String(safeCurrentStep).padStart(2, '0')}`;
    const selectedBlockId = unifiedState.editor.selectedBlockId;
    const isDirty = unifiedState.editor.isDirty;

    // 🚦 Informar funnelId atual ao TemplateService para priorizar USER_EDIT no HierarchicalSource
    useEffect(() => {
        try {
            if (props.funnelId) {
                templateService.setActiveFunnel?.(props.funnelId);
            } else {
                templateService.setActiveFunnel?.(null);
            }
        } catch { /* noop */ }

        return () => {
            try { templateService.setActiveFunnel?.(null); } catch { /* noop */ }
        };
    }, [props.funnelId]);

    // Local UI state
    const [canvasMode, setCanvasMode] = useState<'edit' | 'preview'>('edit');
    const [previewMode, setPreviewMode] = useState<'live' | 'production'>('live');
    const [loadedTemplate, setLoadedTemplate] = useState<{ name: string; steps: any[] } | null>(null);
    const [templateLoadError, setTemplateLoadError] = useState(false);

    // Persist layout
    const PANEL_LAYOUT_KEY = 'qm-editor:panel-layout-v1';
    const [panelLayout, setPanelLayout] = useState<number[] | null>(null);
    useEffect(() => {
        try {
            const saved = localStorage.getItem(PANEL_LAYOUT_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length === 4) {
                    setPanelLayout(parsed);
                }
            }
        } catch { /* noop */ }
    }, []);

    // Navigation steps — derived from either loadedTemplate or editor.stepBlocks
    const stepsVersion = useMemo(() => {
        const keys = Object.keys(unifiedState.editor.stepBlocks || {});
        return keys.sort((a, b) => Number(a) - Number(b)).join('|');
    }, [unifiedState.editor.stepBlocks]);

    const navSteps = useMemo(() => {
        if (loadedTemplate?.steps?.length) {
            return loadedTemplate.steps.map((s: any) => ({
                key: s.id,
                title: `${String(s.order).padStart(2, '0')} - ${s.name}`,
            }));
        }

        const indexes = Object.keys(unifiedState.editor.stepBlocks || {})
            .map((k) => Number(k))
            .filter((n) => Number.isFinite(n) && n >= 1)
            .sort((a, b) => a - b);

        if (indexes.length === 0) {
            return [1, 2].map((i) => ({
                key: `step-${String(i).padStart(2, '0')}`,
                title: `${String(i).padStart(2, '0')} - Etapa ${i}`,
            }));
        }

        return indexes.map((i) => ({
            key: `step-${String(i).padStart(2, '0')}`,
            title: `${String(i).padStart(2, '0')} - Etapa ${i}`,
        }));
    }, [loadedTemplate, stepsVersion]);

    // Ensure initial step in free mode
    useEffect(() => {
        if (!props.templateId && !loadedTemplate && (!unifiedState.editor.currentStep || unifiedState.editor.currentStep < 1)) {
            appLogger.info('🎨 [QuizModularEditor] Modo livre - inicializando currentStep = 1');
            setCurrentStep(1);
        }
    }, [props.templateId, loadedTemplate, setCurrentStep, unifiedState.editor.currentStep]);

    // Auto-save (uses desestructured saveFunnel)
    useEffect(() => {
        if (!enableAutoSave || !isDirty) return;

        const delayMs = Number((import.meta as any).env?.VITE_AUTO_SAVE_DELAY_MS ?? 2000);
        const timer = setTimeout(async () => {
            try {
                await saveFunnel();
                console.log(`✅ Auto-save: ${currentStepKey}`);
            } catch (error) {
                console.error(`❌ Auto-save failed:`, error);
            }
        }, isNaN(delayMs) ? 2000 : delayMs);

        return () => clearTimeout(timer);
    }, [enableAutoSave, isDirty, currentStepKey, saveFunnel]);

    // DnD sensors
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    // normalize order helper
    const normalizeOrder = useCallback((list: Block[]) => list.map((b, idx) => ({ ...b, order: idx })), []);

    // Lazy template preparation when a templateId/resourceId exists
    useEffect(() => {
        if (!props.templateId && !resourceId) {
            appLogger.info('🎨 [QuizModularEditor] Modo canvas vazio - sem template');
            return;
        }

        let cancelled = false;
        async function loadTemplateOptimized() {
            setTemplateLoading(true);
            setTemplateLoadError(false);
            try {
                const svc: any = templateService;
                const tid = props.templateId ?? resourceId!;
                appLogger.info(`🔍 [QuizModularEditor] Preparando template (lazy): ${tid}`);

                const templateStepsResult = svc.steps?.list?.() ?? { success: false };
                let stepsMeta: any[] = [];
                if (templateStepsResult.success && templateStepsResult.data?.length) {
                    stepsMeta = templateStepsResult.data;
                } else {
                    stepsMeta = Array.from({ length: 21 }, (_, i) => ({
                        id: `step-${String(i + 1).padStart(2, '0')}`,
                        order: i + 1,
                        name: `Etapa ${i + 1}`,
                    }));
                }

                if (!cancelled) {
                    setLoadedTemplate({ name: `Template: ${tid}`, steps: stepsMeta });
                    setCurrentStep(1);
                }

                try {
                    await svc.prepareTemplate?.(tid);
                } catch (e) {
                    appLogger.warn('[QuizModularEditor] prepareTemplate falhou, usando fallback de 21 etapas');
                    try { svc.setActiveTemplate?.(tid, 21); } catch { /* noop */ }
                }

                try {
                    await svc.preloadTemplate?.(tid);
                } catch { /* noop */ }

                appLogger.info(`✅ [QuizModularEditor] Template preparado (lazy): ${stepsMeta.length} steps`);
            } catch (error) {
                appLogger.error('[QuizModularEditor] Erro ao carregar template:', error);
                if (!cancelled) setTemplateLoadError(true);
            } finally {
                if (!cancelled) setTemplateLoading(false);
            }
        }

        loadTemplateOptimized();
        return () => { cancelled = true; setTemplateLoading(false); };
    }, [props.templateId, resourceId, setTemplateLoading, setTemplateLoadError, setCurrentStep]);

    // Prefetch de steps críticos na montagem para navegação mais fluida
    useEffect(() => {
        const critical = ['step-01', 'step-12', 'step-19', 'step-20', 'step-21'];
        const templateOrResource = props.templateId ?? resourceId ?? null;
        const funnel = props.funnelId ?? null;
        critical.forEach((sid) => {
            queryClient.prefetchQuery({
                queryKey: stepKeys.detail(sid, templateOrResource, funnel),
                queryFn: async () => {
                    const res = await templateService.getStep(sid, templateOrResource ?? undefined);
                    if (res.success) return res.data;
                    throw res.error ?? new Error('Falha no prefetch crítico');
                },
                staleTime: 60_000,
            }).catch(() => void 0);
        });
        // sem cleanup necessário
    }, [queryClient, props.templateId, resourceId, props.funnelId]);

    // Blocks from unified
    const blocks: Block[] | null = getStepBlocks(safeCurrentStep);

    // Lazy load visible step + prefetch neighbors
    useEffect(() => {
        const stepIndex = safeCurrentStep;
        const stepId = `step-${String(stepIndex).padStart(2, '0')}`;
        let cancelled = false;

        async function ensureStepBlocks() {
            setStepLoading(true);
            // debounce small
            await new Promise(resolve => setTimeout(resolve, 50));
            if (cancelled) return;

            try {
                const svc: any = templateService;
                const result = await svc.getStep(stepId, props.templateId ?? resourceId);
                if (!cancelled && result?.success && result.data) {
                    setStepBlocks(stepIndex, result.data);
                }
            } catch (e) {
                appLogger.error('[QuizModularEditor] lazyLoadStep falhou:', e);
            } finally {
                if (!cancelled) setStepLoading(false);
            }
        }

        ensureStepBlocks();
        // Prefetch vizinhos no cache do React Query para navegação rápida
        try {
            const neighborIds = [stepIndex - 1, stepIndex + 1]
                .filter((i) => i >= 1)
                .map((i) => `step-${String(i).padStart(2, '0')}`);
            const templateOrResource = props.templateId ?? resourceId ?? null;
            const funnel = props.funnelId ?? null;
            neighborIds.forEach((nid) => {
                queryClient.prefetchQuery({
                    queryKey: stepKeys.detail(nid, templateOrResource, funnel),
                    queryFn: async () => {
                        const res = await templateService.getStep(nid, templateOrResource ?? undefined);
                        if (res.success) return res.data;
                        throw res.error ?? new Error('Falha no prefetch');
                    },
                    staleTime: 30_000,
                }).catch(() => void 0);
            });
        } catch { /* noop */ }
        return () => { cancelled = true; setStepLoading(false); };
    }, [safeCurrentStep, props.templateId, resourceId, setStepLoading, setStepBlocks, queryClient, props.funnelId]);

    // DnD handler (uses desestructured methods)
    const handleDragEnd = useCallback((event: any) => {
        const result = dnd.handlers.onDragEnd(event);
        if (!result) return;

        const { draggedItem, overId, activeId } = result as { draggedItem: any; overId: any; activeId: any };
        const stepIndex = safeCurrentStep;
        const list = blocks || [];

        if (draggedItem?.type === 'library-item') {
            if (!draggedItem.libraryType) return;

            const newBlock = {
                id: `block-${Date.now()}`,
                type: draggedItem.libraryType,
                properties: {},
                content: {},
                order: list.length,
            };

            addBlock(stepIndex, newBlock);
            return;
        }

        if (draggedItem?.type === 'block' && activeId && overId && activeId !== overId) {
            const fromIndex = list.findIndex(b => String(b.id) === String(activeId));
            const toIndex = list.findIndex(b => String(b.id) === String(overId));
            if (fromIndex >= 0 && toIndex >= 0) {
                const reordered = [...list];
                const [moved] = reordered.splice(fromIndex, 1);
                reordered.splice(toIndex, 0, moved);
                reorderBlocks(stepIndex, reordered);
            }
        }
    }, [dnd.handlers, blocks, safeCurrentStep, addBlock, reorderBlocks]);

    // Manual save
    const handleSave = useCallback(async () => {
        try {
            if (!props.templateId && !resourceId) {
                const nowId = `custom-${Date.now()}`;
                const total = loadedTemplate?.steps?.length
                    ?? Object.keys(unifiedState.editor.stepBlocks || {})
                        .map((k) => Number(k))
                        .filter((n) => Number.isFinite(n) && n >= 1)
                        .length
                    ?? 1;
                try {
                    templateService.setActiveTemplate?.(nowId, total || 1);
                } catch { /* noop */ }
            }

            showToast({
                type: 'success',
                title: 'Salvo!',
                message: 'Funil salvo com sucesso',
            });

            await saveFunnel();
        } catch (error) {
            showToast({
                type: 'error',
                title: 'Erro',
                message: 'Erro ao salvar funil',
            });
        }
    }, [props.templateId, resourceId, loadedTemplate?.steps, unifiedState.editor.stepBlocks, saveFunnel, showToast]);

    // Reload current step (retry)
    const handleReloadStep = useCallback(async () => {
        const stepIndex = safeCurrentStep;
        if (!stepIndex) return;

        appLogger.info(`🔄 [QuizModularEditor] Recarregando step após erro: step-${stepIndex}`);

        try {
            const stepKey = `step-${String(stepIndex).padStart(2, '0')}`;
            const svc: any = templateService;
            svc.invalidateTemplate?.(stepKey);

            // Invalida também o cache do React Query para o step atual
            try {
                const templateOrResource = props.templateId ?? resourceId ?? null;
                const funnel = props.funnelId ?? null;
                await queryClient.invalidateQueries({ queryKey: stepKeys.detail(stepKey, templateOrResource, funnel) });
            } catch { /* noop */ }

            const result = await svc.getStep(stepKey, props.templateId ?? resourceId);
            if (result.success && result.data) {
                setStepBlocks(stepIndex, result.data);
                appLogger.info(`✅ [QuizModularEditor] Step recarregado: ${result.data.length} blocos`);
            }
        } catch (error) {
            appLogger.error('[QuizModularEditor] Erro ao recarregar step:', error);
        }
    }, [safeCurrentStep, props.templateId, props.funnelId, resourceId, setStepBlocks, queryClient]);

    // Export JSON
    const handleExportJSON = useCallback(() => {
        try {
            const data = {
                meta: {
                    exportedAt: new Date().toISOString(),
                    currentStep: safeCurrentStep,
                    template: props.templateId || loadedTemplate?.name || resourceId || null,
                },
                stepBlocks: unifiedState.editor.stepBlocks,
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'editor-export.json';
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error('Erro ao exportar JSON:', e);
        }
    }, [unifiedState.editor.stepBlocks, safeCurrentStep, props.templateId, loadedTemplate, resourceId]);

    // Load template via button (use imported templateService)
    const handleLoadTemplate = useCallback(async () => {
        setTemplateLoading(true);
        setTemplateLoadError(false);
        try {
            const svc: any = templateService;
            const tid = props.templateId ?? resourceId ?? 'quiz21StepsComplete';
            appLogger.info(`🔍 [QuizModularEditor] Preparando template via botão (lazy): ${tid}`);
            await svc.prepareTemplate?.(tid);

            const templateStepsResult = svc.steps.list();
            if (!templateStepsResult.success) {
                throw new Error('Falha ao carregar lista de steps do template');
            }

            setLoadedTemplate({
                name: `Template: ${tid}`,
                steps: templateStepsResult.data
            });
            setCurrentStep(1);
            appLogger.info(`✅ [QuizModularEditor] Template preparado (lazy): ${templateStepsResult.data.length} steps`);

            const url = new URL(window.location.href);
            url.searchParams.set('template', tid);
            window.history.pushState({}, '', url);
        } catch (error) {
            appLogger.error('[QuizModularEditor] Erro ao carregar template:', error);
            setTemplateLoadError(true);
        } finally {
            setTemplateLoading(false);
        }
    }, [props.templateId, resourceId, setTemplateLoading, setTemplateLoadError, setCurrentStep]);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={dnd.handlers.onDragStart}
            onDragOver={dnd.handlers.onDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={dnd.handlers.onDragCancel}
        >
            <div className="qm-editor flex flex-col h-screen bg-gray-50" data-editor="modular-enhanced">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-semibold text-gray-800">Editor Modular</h1>

                        {isLoadingTemplate && (
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded animate-pulse">
                                Carregando template...
                            </span>
                        )}

                        {loadedTemplate && !isLoadingTemplate && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                                📄 {loadedTemplate.name}
                            </span>
                        )}

                        {((!loadedTemplate && !isLoadingTemplate && !props.templateId) || templateLoadError) && (
                            <span className="px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-lg border border-blue-200">
                                🎨 Modo Construção Livre
                            </span>
                        )}

                        {currentStepKey && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                                {currentStepKey}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                            <Button
                                size="sm"
                                variant={canvasMode === 'edit' ? 'default' : 'ghost'}
                                onClick={() => setCanvasMode('edit')}
                                className="h-7 px-3"
                            >
                                <Edit3 className="w-3 h-3 mr-1" />
                                Edição
                            </Button>
                            <Button
                                size="sm"
                                variant={canvasMode === 'preview' ? 'default' : 'ghost'}
                                onClick={() => setCanvasMode('preview')}
                                className="h-7 px-3"
                            >
                                <Eye className="w-3 h-3 mr-1" />
                                Preview
                            </Button>
                        </div>

                        {canvasMode === 'preview' && (
                            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                                <Button
                                    size="sm"
                                    variant={previewMode === 'live' ? 'default' : 'ghost'}
                                    onClick={() => setPreviewMode('live')}
                                    className="h-7 px-3"
                                >
                                    <Play className="w-3 h-3 mr-1" />
                                    Live
                                </Button>
                                <Button
                                    size="sm"
                                    variant={previewMode === 'production' ? 'default' : 'ghost'}
                                    onClick={() => setPreviewMode('production')}
                                    className="h-7 px-3"
                                >
                                    <Eye className="w-3 h-3 mr-1" />
                                    Produção
                                </Button>
                            </div>
                        )}

                        {enableAutoSave && (
                            <div className="text-xs flex items-center gap-2 animate-fade-in">
                                {unifiedState.ui.isLoading ? (
                                    <span className="text-blue-600 flex items-center gap-1">
                                        <span className="animate-spin">🔄</span> Salvando...
                                    </span>
                                ) : isDirty ? (
                                    <span className="text-orange-600">📝 Não salvo</span>
                                ) : (
                                    <span className="text-green-600">✅ Salvo agora</span>
                                )}
                            </div>
                        )}

                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={unifiedState.ui.isLoading || isReadOnly}
                            className="h-7"
                        >
                            <Save className="w-3 h-3 mr-1" />
                            {unifiedState.ui.isLoading ? 'Salvando...' : 'Salvar'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleExportJSON} className="h-7">
                            <Download className="w-3 h-3 mr-1" />
                            Exportar JSON
                        </Button>
                    </div>
                </div>

                {/* Panels */}
                <PanelGroup
                    direction="horizontal"
                    className="flex-1"
                    autoSaveId={PANEL_LAYOUT_KEY}
                    onLayout={(sizes: number[]) => {
                        try {
                            localStorage.setItem(PANEL_LAYOUT_KEY, JSON.stringify(sizes));
                            setPanelLayout(sizes);
                        } catch { }
                    }}
                >
                    <Panel defaultSize={15} minSize={10} maxSize={25}>
                        <div className="h-full border-r bg-white overflow-y-auto">
                            <StepNavigatorColumn
                                steps={navSteps}
                                currentStepKey={currentStepKey}
                                onSelectStep={(key: string) => {
                                    if (key === currentStepKey) return;

                                    if (loadedTemplate?.steps?.length) {
                                        const index = loadedTemplate.steps.findIndex((s: any) => s.id === key);
                                        const newStep = index >= 0 ? index + 1 : 1;
                                        if (newStep !== safeCurrentStep) setCurrentStep(newStep);
                                        return;
                                    }
                                    const match = key.match(/step-(\d{1,2})/i);
                                    const num = match ? parseInt(match[1], 10) : 1;
                                    if (num !== safeCurrentStep) setCurrentStep(num);
                                }}
                            />
                        </div>
                    </Panel>

                    <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-blue-400 transition-colors relative group">
                        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 group-hover:w-1.5 bg-gray-300 group-hover:bg-blue-500 transition-all" />
                        <GripVertical className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </PanelResizeHandle>

                    <Panel defaultSize={20} minSize={15} maxSize={30}>
                        <Suspense fallback={<div className="p-4 text-sm text-gray-500">Carregando biblioteca…</div>}>
                            <div className="h-full border-r bg-white overflow-y-auto">
                                <ComponentLibraryColumn
                                    currentStepKey={currentStepKey}
                                    onAddBlock={(type) => {
                                        const stepIndex = safeCurrentStep;
                                        addBlock(stepIndex, {
                                            type,
                                            id: `block-${Date.now()}`,
                                            properties: {},
                                            content: {},
                                            order: (blocks || []).length
                                        });
                                    }}
                                />
                            </div>
                        </Suspense>
                    </Panel>

                    <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-blue-400 transition-colors relative group">
                        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 group-hover:w-1.5 bg-gray-300 group-hover:bg-blue-500 transition-all" />
                        <GripVertical className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </PanelResizeHandle>

                    <Panel defaultSize={40} minSize={30}>
                        <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-500">Carregando canvas…</div>}>
                            <div className="h-full bg-gray-50 overflow-y-auto">
                                {isLoadingTemplate ? (
                                    <div className="h-full flex items-center justify-center">
                                        <div className="text-sm text-gray-500 animate-pulse">Carregando etapas do template…</div>
                                    </div>
                                ) : isLoadingStep ? (
                                    <div className="h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-sm text-gray-500 animate-pulse mb-2">Carregando etapa…</div>
                                            <div className="text-xs text-gray-400">{currentStepKey}</div>
                                        </div>
                                    </div>
                                ) : canvasMode === 'edit' ? (
                                    <StepErrorBoundary
                                        stepId={currentStepKey || 'unknown'}
                                        onReset={handleReloadStep}
                                    >
                                        <div className={isLoadingStep ? 'pointer-events-none opacity-50' : ''}>
                                            <CanvasColumn
                                                currentStepKey={currentStepKey}
                                                blocks={blocks}
                                                selectedBlockId={selectedBlockId}
                                                onRemoveBlock={(id) => removeBlock(safeCurrentStep, id)}
                                                onMoveBlock={(from, to) => {
                                                    const list = blocks || [];
                                                    const reordered = [...list];
                                                    const [moved] = reordered.splice(from, 1);
                                                    reordered.splice(to, 0, moved);
                                                    reorderBlocks(safeCurrentStep, normalizeOrder(reordered));
                                                }}
                                                onUpdateBlock={(id, patch) => updateBlock(safeCurrentStep, id, patch)}
                                                onBlockSelect={setSelectedBlock}
                                                hasTemplate={Boolean(loadedTemplate || props.templateId || resourceId)}
                                                onLoadTemplate={handleLoadTemplate}
                                            />
                                        </div>
                                    </StepErrorBoundary>
                                ) : (
                                    <PreviewPanel
                                        currentStepKey={currentStepKey}
                                        blocks={blocks}
                                        isVisible={true}
                                        className="h-full"
                                    />
                                )}
                            </div>
                        </Suspense>
                    </Panel>

                    <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-blue-400 transition-colors relative group">
                        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 group-hover:w-1.5 bg-gray-300 group-hover:bg-blue-500 transition-all" />
                        <GripVertical className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </PanelResizeHandle>

                    <Panel defaultSize={25} minSize={20} maxSize={35}>
                        <Suspense fallback={<div className="p-4 text-sm text-gray-500">Carregando propriedades…</div>}>
                            <div className="h-full border-l bg-white overflow-y-auto">
                                <PropertiesColumn
                                    selectedBlock={blocks?.find(b => b.id === selectedBlockId) ?? null}
                                    onBlockUpdate={(blockId: string, updates: Partial<Block>) => updateBlock(safeCurrentStep, blockId, updates)}
                                    onClearSelection={() => setSelectedBlock(null)}
                                />
                            </div>
                        </Suspense>
                    </Panel>
                </PanelGroup>

                <DragOverlay>
                    {dnd.activeId ? (
                        <div className="px-3 py-2 text-xs rounded-md border bg-white shadow-lg flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            {dnd.draggedItem?.type === 'library-item' ? `+ ${dnd.draggedItem.libraryType}` : 'Bloco'}
                        </div>
                    ) : null}
                </DragOverlay>

                {import.meta.env.DEV && MetricsPanel && (
                    <Suspense fallback={null}>
                        <MetricsPanel />
                    </Suspense>
                )}
            </div>
        </DndContext>
    );
}

/**
 * Default export wraps inner component with EditorLoadingProvider so useEditorLoading()
 * inside QuizModularEditorInner is always safe.
 */
export default function QuizModularEditor(props: QuizModularEditorProps) {
    return (
        <EditorLoadingProvider>
            <Suspense fallback={<div />}>
                <QuizModularEditorInner {...props} />
            </Suspense>
        </EditorLoadingProvider>
    );
}