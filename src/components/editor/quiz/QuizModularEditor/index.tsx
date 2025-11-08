// Aplicar polyfills React primeiro
import '@/utils/reactPolyfills';
import React, { Suspense, useEffect, useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { stepKeys } from '@/api/steps/hooks';
import { v4 as uuidv4 } from 'uuid';
import { SafeDndContext, useSafeDndSensors } from './components/SafeDndContext';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useSuperUnified } from '@/hooks/useSuperUnified';
import { useDndSystem } from './hooks/useDndSystem';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import type { Block } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { Eye, Edit3, Play, Save, GripVertical, Download, Upload } from 'lucide-react';
import { appLogger } from '@/utils/logger';
import { templateService } from '@/services/canonical/TemplateService';
// Loading context (provider + hook)
import { EditorLoadingProvider, useEditorLoading } from '@/contexts/EditorLoadingContext';
// Arquitetura unificada de recursos
import type { EditorResource } from '@/types/editor-resource';
// Validação e normalização de templates
import { validateAndNormalizeTemplate, formatValidationErrors } from '@/templates/validation/normalize';
// Import Template Dialog
import { ImportTemplateDialog } from '../dialogs/ImportTemplateDialog';
// Autosave com lock e coalescing
import { useQueuedAutosave } from '@/hooks/useQueuedAutosave';

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
        saveStepBlocks,
        publishFunnel,
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

    // � Autosave Queue com Lock (GARGALO R1)
    const { queueSave: queueAutosave, flush: flushAutosave } = useQueuedAutosave({
        saveFn: async (blocks: Block[], stepKey: string) => {
            await saveStepBlocks(parseInt(stepKey.replace(/\D/g, '')));
        },
        debounceMs: Number((import.meta as any).env?.VITE_AUTO_SAVE_DELAY_MS ?? 2000),
        maxRetries: 3,
        onSuccess: (stepKey) => {
            appLogger.info(`✅ [QueuedAutosave] Step salvo: ${stepKey}`);
        },
        onError: (stepKey, error) => {
            appLogger.error(`❌ [QueuedAutosave] Falha ao salvar ${stepKey}:`, error);
        },
    });

    // �🚦 Informar funnelId atual ao TemplateService para priorizar USER_EDIT no HierarchicalSource
    useEffect(() => {
        try {
            if (props.funnelId) {
                templateService.setActiveFunnel?.(props.funnelId);
            } else {
                templateService.setActiveFunnel?.(null);
            }
        } catch (error) {
            console.warn('[QuizModularEditor] Erro ao configurar funnel ativo:', error);
        }

        return () => {
            try {
                templateService.setActiveFunnel?.(null);
            } catch (error) {
                console.warn('[QuizModularEditor] Erro ao limpar funnel ativo:', error);
            }
        };
    }, [props.funnelId]);

    // Local UI state
    const [canvasMode, setCanvasMode] = useState<'edit' | 'preview'>('edit');
    const [previewMode, setPreviewMode] = useState<'live' | 'production'>('live');
    const [loadedTemplate, setLoadedTemplate] = useState<{ name: string; steps: any[] } | null>(null);
    const [templateLoadError, setTemplateLoadError] = useState(false);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

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
        } catch (error) {
            console.warn('[QuizModularEditor] Erro ao restaurar layout de painéis:', error);
        }
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

    // Auto-save por etapa usando Queue com Lock (evita concorrência e coalesce mudanças)
    useEffect(() => {
        if (!enableAutoSave || !isDirty) return;

        const stepBlocks = unifiedState.editor.stepBlocks as Record<string, Block[]>;
        const currentBlocks = stepBlocks[currentStepKey] || [];
        queueAutosave(currentStepKey, currentBlocks);

        // Cleanup não necessário - queueAutosave já gerencia debounce interno
    }, [enableAutoSave, isDirty, currentStepKey, unifiedState.editor.stepBlocks, queueAutosave]);

    // DnD sensors (usando hook seguro)
    const sensors = useSafeDndSensors();

    // normalize order helper
    const normalizeOrder = useCallback((list: Block[]) => list.map((b, idx) => ({ ...b, order: idx })), []);

    // Lazy template preparation when a templateId/resourceId exists
    useEffect(() => {
        if (!props.templateId && !resourceId) {
            appLogger.info('🎨 [QuizModularEditor] Modo canvas vazio - sem template');
            return;
        }

        const controller = new AbortController();
        const { signal } = controller;

        async function loadTemplateOptimized() {
            setTemplateLoading(true);
            setTemplateLoadError(false);
            try {
                const svc: any = templateService;
                const tid = props.templateId ?? resourceId!;
                appLogger.info(`🔍 [QuizModularEditor] Preparando template (lazy): ${tid}`);

                // Add await and pass signal if supported
                const templateStepsResult = await svc.steps?.list?.({ signal }) ?? { success: false };
                let stepsMeta: any[] = [];
                if (templateStepsResult.success && Array.isArray(templateStepsResult.data)) {
                    stepsMeta = templateStepsResult.data;
                } else {
                    stepsMeta = Array.from({ length: 21 }, (_, i) => ({
                        id: `step-${String(i + 1).padStart(2, '0')}`,
                        order: i + 1,
                        name: `Etapa ${i + 1}`,
                    }));
                }

                if (!signal.aborted) {
                    setLoadedTemplate({ name: `Template: ${tid} (JSON v3)`, steps: stepsMeta });
                    setCurrentStep(1);
                }

                try {
                    await svc.prepareTemplate?.(tid, { signal });
                } catch (e) {
                    if (!signal.aborted) {
                        appLogger.warn('[QuizModularEditor] prepareTemplate falhou, usando fallback de 21 etapas', e);
                        try {
                            svc.setActiveTemplate?.(tid, 21);
                        } catch (err) {
                            appLogger.warn('[QuizModularEditor] setActiveTemplate fallback failed', err);
                        }
                    }
                }

                try {
                    await svc.preloadTemplate?.(tid, { signal });
                } catch (err) {
                    if (!signal.aborted) {
                        appLogger.warn('[QuizModularEditor] preloadTemplate failed', err);
                    }
                }

                if (!signal.aborted) {
                    appLogger.info(`✅ [QuizModularEditor] Template preparado (lazy): ${stepsMeta.length} steps`);
                    
                    // Validar integridade das 21 etapas para quiz21StepsComplete
                    if (tid === 'quiz21StepsComplete' && stepsMeta.length === 21) {
                        validateTemplateIntegrity(tid, stepsMeta, signal);
                    }
                }
            } catch (error) {
                if (!signal.aborted) {
                    appLogger.error('[QuizModularEditor] Erro ao carregar template:', error);
                    setTemplateLoadError(true);
                }
            } finally {
                if (!signal.aborted) {
                    setTemplateLoading(false);
                }
            }
        }
        
        // Função auxiliar para validar integridade das 21 etapas
        async function validateTemplateIntegrity(tid: string, stepsMeta: any[], signal: AbortSignal) {
            try {
                const expectedSteps = Array.from({ length: 21 }, (_, i) => 
                    `step-${String(i + 1).padStart(2, '0')}`
                );
                
                const missingSteps: string[] = [];
                const emptySteps: string[] = [];
                
                for (const stepId of expectedSteps) {
                    if (signal.aborted) return;
                    
                    try {
                        const result = await templateService.getStep(stepId, tid, { signal });
                        if (!result.success) {
                            missingSteps.push(stepId);
                        } else if (!result.data || result.data.length === 0) {
                            emptySteps.push(stepId);
                        }
                    } catch (err) {
                        if (!signal.aborted) {
                            missingSteps.push(stepId);
                        }
                    }
                }
                
                if (!signal.aborted) {
                    if (missingSteps.length > 0 || emptySteps.length > 0) {
                        const issues = [
                            missingSteps.length > 0 ? `${missingSteps.length} steps faltando (${missingSteps.slice(0, 3).join(', ')}${missingSteps.length > 3 ? '...' : ''})` : null,
                            emptySteps.length > 0 ? `${emptySteps.length} steps vazios (${emptySteps.slice(0, 3).join(', ')}${emptySteps.length > 3 ? '...' : ''})` : null,
                        ].filter(Boolean).join('; ');
                        
                        appLogger.warn(`⚠️ [QuizModularEditor] Template incompleto: ${issues}`);
                        showToast({
                            type: 'warning',
                            title: 'Template Incompleto',
                            message: issues,
                        });
                    } else {
                        appLogger.info(`✅ [QuizModularEditor] Validação de integridade: 21/21 steps OK`);
                    }
                }
            } catch (error) {
                if (!signal.aborted) {
                    appLogger.warn('[QuizModularEditor] Erro ao validar integridade do template:', error);
                }
            }
        }

        loadTemplateOptimized();
        return () => {
            controller.abort();
            setTemplateLoading(false);
        };
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
        const controller = new AbortController();
        const { signal } = controller;

        async function ensureStepBlocks() {
            setStepLoading(true);
            // debounce small
            await new Promise(resolve => setTimeout(resolve, 50));
            if (signal.aborted) return;

            try {
                const svc: any = templateService;
                const result = await svc.getStep(stepId, props.templateId ?? resourceId, { signal });
                if (!signal.aborted && result?.success && result.data) {
                    setStepBlocks(stepIndex, result.data);
                }
            } catch (e) {
                if (!signal.aborted) {
                    appLogger.error('[QuizModularEditor] lazyLoadStep falhou:', e);
                }
            } finally {
                if (!signal.aborted) {
                    setStepLoading(false);
                }
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
                    queryFn: async ({ signal: querySignal }) => {
                        const res = await templateService.getStep(nid, templateOrResource ?? undefined, { signal: querySignal });
                        if (res.success) return res.data;
                        throw res.error ?? new Error('Falha no prefetch');
                    },
                    staleTime: 30_000,
                }).catch((err) => {
                    appLogger.warn('[QuizModularEditor] prefetch neighbor failed', err);
                });
            });
        } catch (err) {
            appLogger.warn('[QuizModularEditor] prefetch setup failed', err);
        }
        return () => {
            controller.abort();
            setStepLoading(false);
        };
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
                id: `block-${uuidv4()}`,
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
                const nowId = `custom-${uuidv4()}`;
                const total = loadedTemplate?.steps?.length
                    ?? Object.keys(unifiedState.editor.stepBlocks || {})
                        .map((k) => Number(k))
                        .filter((n) => Number.isFinite(n) && n >= 1)
                        .length
                    ?? 1;
                try {
                    templateService.setActiveTemplate?.(nowId, total || 1);
                } catch (err) {
                    appLogger.warn('[handleSave] setActiveTemplate failed', err);
                }
            }

            // Garantir persistência de todas as etapas sujas antes do snapshot global
            try {
                // Flush autosave queue para garantir que mudanças pendentes sejam salvas
                await flushAutosave();
                await (unified as any).ensureAllDirtyStepsSaved?.();
            } catch (error) {
                console.warn('[QuizModularEditor] Erro ao salvar steps pendentes antes do snapshot:', error);
            }
            await saveFunnel();

            showToast({
                type: 'success',
                title: 'Salvo!',
                message: 'Funil salvo com sucesso',
            });
        } catch (error) {
            showToast({
                type: 'error',
                title: 'Erro',
                message: 'Erro ao salvar funil',
            });
        }
    }, [props.templateId, resourceId, loadedTemplate?.steps, unifiedState.editor.stepBlocks, saveFunnel, showToast, unified]);

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
            } catch (error) {
                console.warn('[QuizModularEditor] Erro ao invalidar queries do React Query:', error);
            }

            const result = await svc.getStep(stepKey, props.templateId ?? resourceId);
            if (result.success && result.data) {
                setStepBlocks(stepIndex, result.data);
                appLogger.info(`✅ [QuizModularEditor] Step recarregado: ${result.data.length} blocos`);
            }
        } catch (error) {
            appLogger.error('[QuizModularEditor] Erro ao recarregar step:', error);
        }
    }, [safeCurrentStep, props.templateId, props.funnelId, resourceId, setStepBlocks, queryClient]);

    // Export JSON (estado bruto do editor)
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

    // Export v3 (normalizado para StepBlocksTemplate v3.1)
    const handleExportV3 = useCallback(() => {
        try {
            const stepsEntries = Object.entries(unifiedState.editor.stepBlocks || {}) as Array<[string, any[]]>;

            const steps: Record<string, any> = {};
            for (const [indexStr, blocks] of stepsEntries) {
                const indexNum = Number(indexStr);
                const stepId = `step-${String(Number.isFinite(indexNum) ? indexNum : indexStr).padStart(2, '0')}`;

                const normalizedBlocks = (blocks || []).map((b: any, i: number) => ({
                    id: b?.id || `${b?.type || 'block'}-${i}`,
                    type: b?.type || 'unknown',
                    config: {
                        ...(b?.properties || {}),
                        ...(b?.content || {}),
                        order: typeof b?.order === 'number' ? b.order : i,
                        ...(b?.parentId ? { parentId: b.parentId } : {}),
                    },
                }));

                steps[stepId] = {
                    templateVersion: '3.1',
                    metadata: {
                        id: `${stepId}-v3`,
                        name: `Etapa ${String(indexNum || indexStr)}`,
                        description: '',
                        category: '',
                        tags: [],
                    },
                    blocks: normalizedBlocks,
                };
            }

            const data = {
                meta: {
                    exportedAt: new Date().toISOString(),
                    format: 'v3.1',
                    source: 'editor-state',
                    template: props.templateId || loadedTemplate?.name || resourceId || null,
                },
                steps,
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'editor-export-v3.json';
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error('Erro ao exportar JSON v3:', e);
        }
    }, [unifiedState.editor.stepBlocks, props.templateId, loadedTemplate, resourceId]);

    // Publish funnel
    const handlePublish = useCallback(async () => {
        try {
            await publishFunnel({ ensureSaved: true });
            showToast({ type: 'success', title: 'Publicado', message: 'Seu funil foi publicado com sucesso!' });
        } catch (e) {
            showToast({ type: 'error', title: 'Erro ao publicar', message: 'Não foi possível publicar o funil. Tente novamente.' });
        }
    }, [publishFunnel, showToast]);

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

    // Import template from JSON
    const handleImportTemplate = useCallback(async (template: any, stepId?: string) => {
        try {
            appLogger.info(`📥 [QuizModularEditor] Importando template JSON: ${template?.metadata?.name || 'unknown'}`);

            // VALIDAÇÃO + NORMALIZAÇÃO: Valida estrutura e substitui IDs legados por UUIDs
            const validationResult = validateAndNormalizeTemplate(template);

            if (!validationResult.success) {
                const errorMessage = formatValidationErrors(validationResult);
                appLogger.error('[QuizModularEditor] Template inválido', {
                    errors: validationResult.errors,
                });
                throw new Error(errorMessage);
            }

            // Template válido e normalizado
            const normalizedTemplate = validationResult.data;

            // Exibir warnings se houver IDs legados substituídos
            if (validationResult.warnings && validationResult.warnings.length > 0) {
                appLogger.warn('[QuizModularEditor] IDs legados normalizados', {
                    count: validationResult.warnings.length,
                    warnings: validationResult.warnings,
                });

                // Opcional: mostrar toast informativo ao usuário
                showToast({
                    type: 'info',
                    title: 'Template normalizado',
                    message: `${validationResult.warnings.length} IDs legados foram atualizados para UUID v4`
                });
            }

            if (stepId) {
                // Import single step
                if (normalizedTemplate.steps[stepId]) {
                    const blocks = normalizedTemplate.steps[stepId];
                    const stepIndex = parseInt(stepId.replace('step-', ''), 10);

                    if (!isNaN(stepIndex)) {
                        setStepBlocks(stepIndex, blocks);
                        showToast({
                            type: 'success',
                            title: 'Step importado',
                            message: `${blocks.length} blocos importados para ${stepId}`
                        });
                        appLogger.info(`✅ [QuizModularEditor] Step ${stepId} importado: ${blocks.length} blocos`);
                    }
                } else {
                    throw new Error(`Step "${stepId}" não encontrado no template`);
                }
            } else {
                // Import full template
                const stepEntries = Object.entries(normalizedTemplate.steps);
                let totalBlocks = 0;

                for (const [key, blocks] of stepEntries) {
                    const stepIndex = parseInt(key.replace('step-', ''), 10);
                    if (!isNaN(stepIndex) && Array.isArray(blocks)) {
                        setStepBlocks(stepIndex, blocks as Block[]);
                        totalBlocks += blocks.length;
                    }
                }

                // Update loaded template metadata
                setLoadedTemplate({
                    name: normalizedTemplate.metadata.name,
                    steps: stepEntries.map(([key], index) => ({
                        id: key,
                        order: index + 1,
                        name: `Etapa ${index + 1}`
                    }))
                });

                // Navigate to first step
                setCurrentStep(1);

                showToast({
                    type: 'success',
                    title: 'Template importado',
                    message: `${stepEntries.length} steps importados com ${totalBlocks} blocos no total`
                });
                appLogger.info(`✅ [QuizModularEditor] Template completo importado: ${stepEntries.length} steps, ${totalBlocks} blocos`);
            }

            // Invalidate cache
            queryClient.invalidateQueries({ queryKey: ['templates'] });
        } catch (error) {
            appLogger.error('[QuizModularEditor] Erro ao importar template:', error);
            showToast({
                type: 'error',
                title: 'Erro ao importar',
                message: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }, [setStepBlocks, setLoadedTemplate, setCurrentStep, showToast, queryClient]);

    return (
        <SafeDndContext
            sensors={sensors}
            onDragStart={dnd.handlers.onDragStart}
            onDragOver={dnd.handlers.onDragOver}
            onDragEnd={handleDragEnd}
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
                        <Button
                            size="sm"
                            variant="default"
                            onClick={handlePublish}
                            disabled={unifiedState.ui.isLoading || isReadOnly}
                            className="h-7 bg-emerald-600 hover:bg-emerald-700"
                            title="Publicar este funil"
                        >
                            <Play className="w-3 h-3 mr-1" />
                            Publicar
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleExportJSON} className="h-7">
                            <Download className="w-3 h-3 mr-1" />
                            Exportar JSON
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleExportV3} className="h-7">
                            <Download className="w-3 h-3 mr-1" />
                            Exportar v3
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsImportDialogOpen(true)}
                            className="h-7"
                            title="Importar template JSON"
                        >
                            <Upload className="w-3 h-3 mr-1" />
                            Importar JSON
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
                        } catch (error) {
                            appLogger.warn('[QuizModularEditor] Falha ao processar blocos:', error);
                        }
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
                                            id: `block-${uuidv4()}`,
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

                {import.meta.env.DEV && MetricsPanel && (
                    <Suspense fallback={null}>
                        <MetricsPanel />
                    </Suspense>
                )}

                {/* Import Template Dialog */}
                <ImportTemplateDialog
                    open={isImportDialogOpen}
                    onClose={() => setIsImportDialogOpen(false)}
                    onImport={handleImportTemplate}
                    currentStepKey={currentStepKey}
                />
            </div>
        </SafeDndContext>
    );
}

/**
 * Default export wraps inner component with EditorLoadingProvider so useEditorLoading()
 * inside QuizModularEditorInner is always safe.
 */
export default function QuizModularEditor(props: QuizModularEditorProps) {
    return (
        <EditorLoadingProvider>
            <div data-testid="quiz-modular-production-editor-page-optimized" className="h-full w-full">
                <Suspense fallback={<div />}>
                    <QuizModularEditorInner {...props} />
                </Suspense>
            </div>
        </EditorLoadingProvider>
    );
}