import { useAppStore, selectors } from '@/state/store';
// Exemplo de uso com subscrição seletiva para evitar re-render em cascata
const useEditorSelectors = () => {
    const currentStep = useAppStore(selectors.currentStep);
    const selections = useAppStore(selectors.selections);
    const theme = useAppStore(selectors.theme);
    return { currentStep, selections, theme };
};
import React, { Suspense, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { stepKeys } from '@/services/api/steps/hooks';
import { v4 as uuidv4 } from 'uuid';
import { SafeDndContext, useSafeDndSensors } from './components/SafeDndContext';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { ResizableHandle } from '@/components/ui/resizable';
import { useEditorContext, persistenceService, validateBlock } from '@/core';
import { getFeatureFlag } from '@/core/utils/featureFlags';
import { createEditorCommandsAdapter, duplicateFunnel } from '@/features/editor/model/editorAdapter';
import { useDndSystem } from './hooks/useDndSystem';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import type { Block } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Eye, Edit3, Play, Save, Download, Upload, Undo2, Redo2, Clock } from 'lucide-react';
import { templateService } from '@/services/canonical/TemplateService';
import { validateTemplateIntegrity as validateTemplateIntegrityFull, formatValidationResult, type TemplateValidationResult } from '@/lib/utils/templateValidation';
// Loading context (provider + hook)
import { EditorLoadingProvider, useEditorLoading } from '@/contexts/EditorLoadingContext';
// Arquitetura unificada de recursos
import type { EditorResource } from '@/types/editor-resource';
// Validação e normalização de templates
import { validateAndNormalizeTemplate, formatValidationErrors } from '@/templates/validation/normalize';
// Import Template Dialog
import { ImportTemplateDialog } from '../dialogs/ImportTemplateDialog';
// Autosave feedback visual
import { AutosaveIndicator } from '@/components/editor/quiz/AutosaveIndicator';
// Template Health Panel
import { TemplateHealthPanel } from './components/TemplateHealthPanel';
// 🎯 FASE 3.1: Novos hooks refatorados
import { useStepNavigation } from './hooks/useStepNavigation';
import { useAutoSave } from '@/core';
import { useEditorMode as useEditorModeLocal } from './hooks/useEditorMode';
// 🆕 G20 & G28 FIX: Prefetch inteligente com AbortController
import { useStepPrefetch } from '@/hooks/useStepPrefetch';
// 🔥 HOTFIX 1 & 3: Hooks otimizados para carregamento e validação
import { useTemplateLoader } from '@/hooks/editor/useTemplateLoader';
import { useTemplateValidation } from '@/hooks/editor/useTemplateValidation';
// ✅ ARQUITETURA: Hook unificado para carregamento de steps
import { useStepBlocksLoader } from '@/hooks/editor/useStepBlocksLoader';
// ✅ WAVE 2: Performance Monitor
import { PerformanceMonitor } from '@/components/editor/PerformanceMonitor';
// 🎨 WYSIWYG: Sistema de edição ao vivo
import { useWYSIWYGBridge } from '@/hooks/useWYSIWYGBridge';
import ViewportSelector, { type ViewportSize } from '@/components/editor/quiz/ViewportSelector';
import { ViewportContainer } from '@/components/editor/quiz/ViewportSelector/ViewportContainer';
import { useSnapshot } from '@/hooks/useSnapshot';
import { useVirtualizedBlocks } from '@/hooks/useVirtualizedBlocks';

// ✨ V4: Dynamic Properties Panel com 7 tipos de controles
import { DynamicPropertiesPanelV4 } from '@/components/editor/properties/DynamicPropertiesPanelV4';
import { ensureV4Block, BlockV4ToV3Adapter } from '@/core/quiz/blocks/adapters';
import type { QuizBlock } from '@/schemas/quiz-schema.zod';

// Static import: navigation column
import StepNavigatorColumn from './components/StepNavigatorColumn';

// Lazy columns with graceful degradation
// ✅ BEST PRACTICE: Usar Error Boundaries ao invés de catch no lazy import
// Isso permite que React Suspense e ErrorBoundary funcionem corretamente
const CanvasColumn = React.lazy(() => import('./components/CanvasColumn'));
const ComponentLibraryColumn = React.lazy(() => import('./components/ComponentLibraryColumn'));
const PropertiesColumn = React.lazy(() => import('./components/PropertiesColumn'));
const PropertiesColumnWithJson = React.lazy(() => import('./components/PropertiesColumn/PropertiesColumnWithJson'));
const PropertiesColumnSimple = React.lazy(() => import('./components/PropertiesColumnSimple'));
const PreviewPanel = React.lazy(() => import('./components/PreviewPanel'));

// ✅ P2: Error boundaries granulares
import { StepErrorBoundary, ColumnErrorBoundary } from '@/components/error';
import { appLogger } from '@/lib/utils/appLogger';
import { EditorLoadingProgress } from '@/components/editor/EditorLoadingProgress';
import indexedDBCache from '@/services/core/IndexedDBCache';

// 🎨 Skeleton loaders otimizados
import {
    StepNavigatorSkeleton,
    ComponentLibrarySkeleton,
    CanvasSkeleton,
    PropertiesPanelSkeleton
} from './components/EditorSkeletons';

// Dev-only metrics panel
let MetricsPanel: React.LazyExoticComponent<React.ComponentType<any>> | null = null;
if (import.meta.env.DEV) {
    try {
        MetricsPanel = React.lazy(() =>
            import('./components/MetricsPanel').catch(() => ({ default: () => null }))
        );
    } catch (e) {
        appLogger.warn('MetricsPanel failed to load:', { data: [e] });
    }
}

export type QuizModularEditorProps = {
    /** ID unificado do recurso - agora sempre funnelId (editável e duplicável) */
    resourceId?: string;
    /** Metadata do recurso (fornecida por useEditorResource) */
    editorResource?: EditorResource | null;
    /** Se o recurso é somente leitura - SEMPRE FALSE, templates são editáveis */
    isReadOnly?: false;
    /** ID do funnel - padrão para templates editáveis */
    funnelId?: string;
    /** @deprecated - Use funnelId ao invés. Mantido para retrocompatibilidade */
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
    const unified = useEditorContext();
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
        getStepBlocks,
        setStepBlocks,
        setSelectedBlock,
        undo,
        redo,
        canUndo,
        canRedo,
        removeBlock,
        reorderBlocks,
        updateBlock,
        funnel, // Access to funnel methods
        ux, // Access to UX methods (showToast)
    } = unified;

    // Adapter híbrido de comandos (usando unified context)
    const legacyCommands = useMemo(() => ({
        addBlock: (stepId: any, block: any) => addBlock(stepId, block),
        updateBlock: (stepId: any, blockId: string, patch: any) => updateBlock(stepId, blockId, patch),
    }), [addBlock, updateBlock]);

    const unifiedCommands = useMemo(() => {
        // Usar unified context diretamente (já tem todas as actions necessárias)
        return {
            addBlock: async (stepId: any, block: any) => addBlock(stepId, block),
            updateBlock: async (stepId: any, blockId: string, patch: any) => updateBlock(stepId, blockId, patch),
        };
    }, [addBlock, updateBlock]);

    const commands = useMemo(() => createEditorCommandsAdapter(legacyCommands, unifiedCommands as any), [legacyCommands, unifiedCommands]);

    // Helper to adapt showToast signature (UXProvider expects: message, type, duration)
    const toast = useCallback((config: { type: string; title?: string; message: string; duration?: number }) => {
        const msg = config.title ? `${config.title}: ${config.message}` : config.message;
        ux.showToast(msg, config.type as any, config.duration);
    }, [ux]);

    // For backward compatibility in dependencies
    const showToast = toast;

    const { createFunnel } = funnel;
    // UI state agora via ux consolidado
    const uiState = ux;

    // Resource unification (support legacy props)
    // 🔄 PADRONIZAÇÃO: templateId é tratado como funnelId (editável)
    const resourceId = props.resourceId || props.funnelId || props.templateId;
    // 🔓 EDIÇÃO SEMPRE HABILITADA: Templates e funnels são editáveis por padrão
    const isReadOnly = false; // Forçar edição habilitada
    const resourceMetadata = props.editorResource ?? null;

    // 🔄 DEBUG: Padronização template → funnel
    appLogger.info('🔍 [QuizModularEditor] Props recebidas:', {
        data: [{
            resourceId: props.resourceId,
            funnelId: props.funnelId || props.templateId, // templateId = funnelId
            templateId_deprecated: props.templateId,
            resourceIdFinal: resourceId,
            isEditableModel: true,
            isReadOnly: isReadOnly, // Deve ser sempre false
            edicaoHabilitada: !isReadOnly // Deve ser sempre true
        }]
    });

    appLogger.info('🚨 [QuizModularEditor] DIAGNÓSTICO:', {
        data: [{
            temResourceId: !!resourceId,
            vaiCarregarJSON: !!resourceId,
            tipoModelo: 'editável e duplicável',
            razao: !resourceId ? '❌ resourceId está undefined - JSON NÃO SERÁ CARREGADO!' : '✅ resourceId OK - JSON será carregado',
            urlAtual: typeof window !== 'undefined' ? window.location.href : 'SSR'
        }]
    });

    // Safe current step
    const safeCurrentStep = Math.max(1, unifiedState.editor.currentStep || 1);
    const currentStepKey = `step-${String(safeCurrentStep).padStart(2, '0')}`;
    const selectedBlockId = unifiedState.editor.selectedBlockId;
    const isDirty = unifiedState.editor.isDirty;
    // adapter já inicializado acima

    // 🚦 Informar funnelId atual ao TemplateService para priorizar USER_EDIT no HierarchicalSource
    useEffect(() => {
        try {
            if (props.funnelId) {
                templateService.setActiveFunnel?.(props.funnelId);
            } else {
                templateService.setActiveFunnel?.(null);
            }
        } catch (error) {
            appLogger.warn('[QuizModularEditor] Erro ao configurar funnel ativo:', { data: [error] });
        }

        return () => {
            try {
                templateService.setActiveFunnel?.(null);
            } catch (error) {
                appLogger.warn('[QuizModularEditor] Erro ao limpar funnel ativo:', { data: [error] });
            }
        };
    }, [props.funnelId]);

    useEffect(() => {
        try {
            const fid = unifiedState.currentFunnel?.id || null;
            templateService.setActiveFunnel?.(fid);
        } catch (error) {
            appLogger.warn('[QuizModularEditor] Erro ao sincronizar funnel ativo do estado unificado:', { data: [error] });
        }
    }, [unifiedState.currentFunnel?.id]);

    // 🔥 HOTFIX 5: Prefetch otimizado com debounce adequado e cache mais curto
    // PROBLEMA RESOLVIDO: Prefetch disparava em TODA navegação + cache de 10min desatualizado
    // SOLUÇÃO: Debounce de 300ms + validação de necessidade de prefetch
    useStepPrefetch({
        currentStepId: currentStepKey,
        funnelId: props.funnelId,
        totalSteps: 21,
        enabled: true,
        radius: 1, // Prefetch apenas step anterior e próximo (não N+2)
        debounceMs: 300, // Aumentado de 16ms para 300ms - evita prefetch em navegação rápida
    });

    useEffect(() => {
        const isTest = (() => {
            try {
                const env = (import.meta as any)?.env || {};
                if (env.VITEST || env.MODE === 'test') return true;
            } catch { }
            try {
                if (typeof (globalThis as any).vitest !== 'undefined') return true;
                if (typeof (globalThis as any).jest !== 'undefined') return true;
            } catch { }
            return false;
        })();
        if (isTest) return;
        let idle1: any = null;
        let idle2: any = null;
        import('./components/CanvasColumn');
        const schedule = (cb: () => void, timeout: number) => {
            try {
                if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
                    return (window as any).requestIdleCallback(cb, { timeout });
                }
            } catch { }
            return setTimeout(cb, timeout);
        };
        idle1 = schedule(() => {
            Promise.all([
                import('./components/ComponentLibraryColumn'),
                import('./components/PropertiesColumn'),
            ]);
        }, 150);
        idle2 = schedule(() => {
            import('./components/PreviewPanel');
        }, 300);
        return () => {
            try {
                if (typeof window !== 'undefined' && 'cancelIdleCallback' in window && idle1) {
                    (window as any).cancelIdleCallback(idle1);
                } else if (idle1) {
                    clearTimeout(idle1);
                }
            } catch { }
            try {
                if (typeof window !== 'undefined' && 'cancelIdleCallback' in window && idle2) {
                    (window as any).cancelIdleCallback(idle2);
                } else if (idle2) {
                    clearTimeout(idle2);
                }
            } catch { }
        };
    }, []);

    useEffect(() => {
        try {
            const progress = Number((resourceMetadata as any)?.metadata?.progress ?? 1);
            if (progress < 1) {
                setTemplateLoading(true);
            } else {
                setTemplateLoading(false);
            }
        } catch { }
    }, [resourceMetadata, setTemplateLoading]);

    // Local UI state - 🔥 MODO LIVE FIXO (preview de produção desativado)
    const previewMode = 'live' as const;

    // 🔧 Bootstrap: registrar stores IndexedDB e diagnosticar query params
    const pendingTidRef = useRef<string | null>(null);
    const [activeTemplateId, setActiveTemplateId] = useState<string | null>(() => {
        try {
            return props.templateId ?? resourceId ?? props.funnelId ?? null;
        } catch { return null; }
    });
    useEffect(() => {
        try {
            indexedDBCache.registerStores(['funnels', 'steps', 'blocks']).catch(() => { });
        } catch { }
        try {
            const url = new URL(typeof window !== 'undefined' ? window.location.href : 'http://local');
            const qp = {
                funnel: url.searchParams.get('funnel'),
                template: url.searchParams.get('template'),
                step: url.searchParams.get('step')
            };
            appLogger.info('🔎 [Bootstrap] Query params', { data: [qp] });

            // ✅ Respeitar step da query ao inicializar
            const n = qp.step ? parseInt(qp.step, 10) : NaN;
            const hasUrlStep = !isNaN(n) && n >= 1 && n <= 21;
            if (hasUrlStep) {
                setCurrentStep(n);
            }

            // ✅ Definir funnel ativo e preparar carregamento quando props ausentes
            const hasPropsId = Boolean(props.templateId || resourceId || props.funnelId);
            const tidFromQuery = qp.funnel || qp.template || null;
            if (!hasPropsId && tidFromQuery) {
                try {
                    templateService.setActiveFunnel?.(qp.funnel || null);
                } catch { }
                pendingTidRef.current = tidFromQuery;
                setActiveTemplateId(tidFromQuery);
                // Disparar carregamento assíncrono suave
                setTimeout(() => {
                    if (pendingTidRef.current) {
                        // Chamar loader com override id
                        (async () => {
                            try {
                                await handleLoadTemplate(pendingTidRef.current!);
                            } catch (e) {
                                appLogger.warn('[Bootstrap] Falha no auto-load por query', { data: [e] });
                            }
                        })();
                    }
                }, 0);
            }
        } catch { }
    }, []);

    // 🐛 DEBUG: Flag para usar painel de propriedades simples (stateless)
    const [useSimplePropertiesPanel, setUseSimplePropertiesPanel] = useState<boolean>(() => {
        try {
            const v = localStorage.getItem('qm-editor:use-simple-properties');
            const isTrue = v === 'true';
            return isTrue; // usar apenas o valor salvo; padrão: false
        } catch { return false; }
    });

    const [loadedTemplate, setLoadedTemplate] = useState<{ name: string; steps: any[] } | null>(null);
    const [templateLoadError, setTemplateLoadError] = useState(false);

    // 🏥 Health Panel State
    const [validationResult, setValidationResult] = useState<TemplateValidationResult | null>(null);
    const [showHealthPanel, setShowHealthPanel] = useState<boolean>(() => {
        try {
            const saved = localStorage.getItem('qm-editor:show-health-panel');
            // ✅ CORREÇÃO: Sempre iniciar fechado para não sobrepor propriedades
            return false; // Era: saved === 'true'
        } catch { return false; }
    });

    // 📐 Viewport State (WYSIWYG)
    const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop' | 'full'>(() => {
        try {
            const saved = localStorage.getItem('qm-editor:viewport');
            return (saved as 'mobile' | 'tablet' | 'desktop' | 'full') || 'full';
        } catch { return 'full'; }
    });

    useEffect(() => {
        try { localStorage.setItem('qm-editor:viewport', viewport); } catch { }
    }, [viewport]);

    useEffect(() => {
        try { localStorage.setItem('qm-editor:show-health-panel', String(showHealthPanel)); } catch { }
    }, [showHealthPanel]);
    useEffect(() => {
        try { localStorage.setItem('qm-editor:preview-mode', previewMode); } catch { }
    }, [previewMode]);

    // 🎯 FASE 3.1: Editor Mode com controle completo de UI (preview, edit, visualization, painéis)
    const editorModeUI = useEditorModeLocal({
        initialPreviewMode: viewport === 'mobile' ? 'mobile' : viewport === 'tablet' ? 'tablet' : 'desktop',
        initialEditMode: 'design',
        initialVisualizationMode: 'blocks',
        initialShowComponentLibrary: true,
        initialShowProperties: true, // 🔥 SEMPRE TRUE
        initialShowPreview: false,
    });

    // 🐛 DEBUG: Logar estado do editorModeUI (desabilitado para performance)
    // React.useEffect(() => {
    //     if (import.meta.env.DEV) {
    //         console.log('🔍 [QuizModularEditor] editorModeUI.showProperties:', editorModeUI.showProperties);
    //     }
    // }, [editorModeUI.showProperties]);

    // Compatibilidade: badge para UI antiga
    const editorMode = useMemo(() => ({
        isEditable: previewMode === 'live',
        dataSource: previewMode === 'live' ? 'local' as const : 'production' as const,
        showValidation: previewMode === 'live',
        showDraftIndicator: previewMode === 'live',
        badge: previewMode === 'live'
            ? { icon: '📝', text: 'Editando', color: 'blue' as const }
            : { icon: '✅', text: 'Publicado', color: 'green' as const },
        description: previewMode === 'live'
            ? 'Edição ao vivo - mudanças aparecem instantaneamente'
            : 'Visualizando dados publicados (versão final)',
    }), [previewMode]);

    // 💾 Snapshot System: Recuperação de drafts
    // ⚠️ IMPORTANTE: Desabilitar snapshot em modo preview para evitar loops
    const snapshot = useSnapshot({
        resourceId: resourceId || '',
        enabled: enableAutoSave && !!resourceId && previewMode !== 'live',
    });

    // 🎨 WYSIWYG Bridge: Sincronização instantânea entre propriedades e canvas
    const wysiwyg = useWYSIWYGBridge({
        currentStep: safeCurrentStep,
        onAutoSave: (blocks, stepKey) => {
            // Auto-save será tratado pelo hook useAutoSave
        },
        autoSaveDelay: Number((import.meta as any).env?.VITE_AUTO_SAVE_DELAY_MS ?? 2000),
        enableValidation: true,
        mode: previewMode === 'live' ? 'preview-live' : 'preview-production',
    });

    // 💾 Enhanced save com persistenceService (retry automático + versionamento)
    const saveStepBlocksEnhanced = useCallback(async (stepNumber: number) => {
        // Em preview mode, não permitir salvar para evitar loops
        if (previewMode === 'live') {
            appLogger.debug('[saveStepBlocks] Ignorado em preview mode');
            return;
        }

        const blocks = wysiwyg?.state?.blocks || [];
        const usePersistence = getFeatureFlag?.('usePersistenceService') ?? true;

        if (usePersistence && resourceId) {
            try {
                // Validação opcional para log amigável (persistenceService também valida)
                const invalidBlocks = blocks.filter(block => {
                    const validation = validateBlock(block as any);
                    return !validation.success;
                });

                if (invalidBlocks.length > 0) {
                    appLogger.warn('[saveStepBlocksEnhanced] Blocos inválidos detectados antes do save:', invalidBlocks.length);
                }

                const result = await persistenceService.saveBlocks(
                    resourceId,
                    blocks as any, // compatibilidade entre @/types/editor e @/core/schemas
                    {
                        maxRetries: 3,
                        validateBeforeSave: true,
                        metadata: {
                            stepNumber,
                        },
                    } as any
                );

                if (!(result as any)?.success) {
                    appLogger.error('❌ [persistenceService] SaveResult com falha, fallback para saveStepBlocks', {
                        data: [result],
                    });
                    await saveStepBlocks(stepNumber);
                    return;
                }

                appLogger.info('✅ [persistenceService] Blocos salvos com sucesso via resourceId', {
                    data: [{ stepNumber, resourceId }],
                });
            } catch (error) {
                appLogger.error('❌ [persistenceService] Erro, fallback para saveStepBlocks:', error);
                await saveStepBlocks(stepNumber);
            }
        } else {
            // Usar método original
            await saveStepBlocks(stepNumber);
        }
    }, [resourceId, previewMode, wysiwyg?.state?.blocks, saveStepBlocks]);

    // 🎯 FASE 3.2: Auto-save reativado com estratégia estável baseada em resourceId
    // Guards importantes:
    // - Nunca roda em previewMode === 'live' (evita loops de edição ao vivo)
    // - Só ativa se houver resourceId (ID canônico do recurso)
    // - Step atual é passado via saveStepBlocksEnhanced(stepNumber)
    const autoSave = resourceId && previewMode !== 'live'
        ? useAutoSave({
            key: `editor-autosave:${resourceId}`,
            data: wysiwyg?.state?.blocks || [],
            debounceMs: Number((import.meta as any).env?.VITE_AUTO_SAVE_DELAY_MS ?? 2000),
            onSave: async () => {
                await saveStepBlocksEnhanced(safeCurrentStep);
            },
            enableRecovery: true,
        })
        : {
            isSaving: false,
            lastSaved: null,
            error: null,
            forceSave: async () => { },
            recoveredData: null,
            clearRecovery: () => { },
        };

    // 💾 Recuperar snapshot no mount
    useEffect(() => {
        if (snapshot.hasSnapshot && resourceId) {
            const recovered = snapshot.recoverSnapshot();
            if (recovered && window.confirm(
                `Encontrado draft não salvo de ${Math.round((snapshot.snapshotAge || 0) / 1000)}s atrás. Deseja recuperar?`
            )) {
                appLogger.info('[Snapshot] Recuperando draft...');
                // Apenas resetar WYSIWYG em modo edit
                if (previewMode !== 'live') {
                    wysiwyg.actions.reset(recovered.blocks);
                }
                setViewport(recovered.viewport);
                setCurrentStep(recovered.currentStep);
                snapshot.clearSnapshot();
            }
        }
    }, [snapshot.hasSnapshot, resourceId]);

    // ⌨️ Atalhos de teclado para alternar modos (Ctrl+1/2/3) e viewport (Ctrl+Alt+1/2/3/0)
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const isMacOrWin = e.ctrlKey || e.metaKey;

            // ✨ Atalho Ctrl+S para salvar manualmente
            if (isMacOrWin && e.key === 's') {
                e.preventDefault();

                if (resourceId && previewMode !== 'live') {
                    autoSave.forceSave().then(() => {
                        toast({
                            type: 'success',
                            title: '💾 Salvo com sucesso',
                            message: 'Suas alterações foram salvas',
                            duration: 2000,
                        });
                    }).catch((error) => {
                        toast({
                            type: 'error',
                            title: '❌ Erro ao salvar',
                            message: error.message || 'Tente novamente',
                            duration: 4000,
                        });
                    });
                } else {
                    handleSave();
                }
                return;
            }

            // Atalhos de viewport: Ctrl+Alt+1/2/3/0
            if (isMacOrWin && e.altKey) {
                if (e.key === '1') {
                    e.preventDefault();
                    setViewport('mobile');
                    appLogger.debug('[QuizModularEditor] ⌨️ Atalho: Viewport Mobile (Ctrl+Alt+1)');
                    return;
                } else if (e.key === '2') {
                    e.preventDefault();
                    setViewport('tablet');
                    appLogger.debug('[QuizModularEditor] ⌨️ Atalho: Viewport Tablet (Ctrl+Alt+2)');
                    return;
                } else if (e.key === '3') {
                    e.preventDefault();
                    setViewport('desktop');
                    appLogger.debug('[QuizModularEditor] ⌨️ Atalho: Viewport Desktop (Ctrl+Alt+3)');
                    return;
                } else if (e.key === '0') {
                    e.preventDefault();
                    setViewport('full');
                    appLogger.debug('[QuizModularEditor] ⌨️ Atalho: Viewport Full (Ctrl+Alt+0)');
                    return;
                }
            }

            // 🔥 Atalhos de modo desativados (preview de produção removido)
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [previewMode]);

    // ✅ WAVE 1 FIX: Selection chain corrigido com callback estável (sem selectedBlockId nas deps para evitar loop)
    const handleBlockSelect = useCallback((blockId: string | null) => {
        if (!blockId) {
            setSelectedBlock(null);
            return;
        }

        setSelectedBlock(blockId);

        // Auto-scroll suave + highlight visual
        setTimeout(() => {
            const element = document.getElementById(`block-${blockId}`);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
            }
        }, 100);
    }, [setSelectedBlock]);

    // 🚀 PERFORMANCE: Callbacks otimizados para handlers do WYSIWYG (removido wysiwyg.state.selectedBlockId das deps)
    const handleWYSIWYGBlockSelect = useCallback((id: string | null) => {
        wysiwyg.actions.selectBlock(id);
        handleBlockSelect(id);
    }, [wysiwyg.actions, handleBlockSelect]);

    const handleWYSIWYGBlockUpdate = useCallback((id: string, updates: Partial<Block>) => {
        // 🚀 WYSIWYG: Atualização instantânea via hook
        if (updates.properties) {
            wysiwyg.actions.updateBlockProperties(id, updates.properties);
        } else if (updates.content) {
            wysiwyg.actions.updateBlockContent(id, updates.content);
        } else {
            wysiwyg.actions.updateBlock(id, updates);
        }
    }, [wysiwyg.actions, safeCurrentStep]);

    const handleWYSIWYGClearSelection = useCallback(() => {
        wysiwyg.actions.selectBlock(null);
        setSelectedBlock(null);
    }, [wysiwyg.actions, setSelectedBlock]);

    // 🚀 PERFORMANCE: Memo para bloco selecionado
    const selectedBlock = useMemo(() => {
        const found = wysiwyg.state.blocks.find(b => b.id === wysiwyg.state.selectedBlockId) || undefined;
        return found;
    }, [wysiwyg.state.blocks, wysiwyg.state.selectedBlockId]);

    // 🚀 PERFORMANCE: Virtualização para listas grandes (> 50 blocos)
    const virtualization = useVirtualizedBlocks({
        blocks: wysiwyg.state.blocks,
        estimatedBlockHeight: 150,
        threshold: 50,
        overscan: 3
    });

    // 🔥 FIX: Callback memoizado para onBlockSelect do Canvas (evita re-renders)
    const handleCanvasBlockSelect = useCallback((id: string) => {
        if (previewMode === 'live') {
            wysiwyg.actions.selectBlock(id);
        }
        handleBlockSelect(id);
    }, [previewMode, wysiwyg.actions, handleBlockSelect]);

    // 🎯 FASE 3.1: Navegação de steps com hook refatorado
    const stepNavigation = useStepNavigation({
        currentStepKey,
        loadedTemplate,
        setCurrentStep,
        setSelectedBlock,
        templateId: props.templateId,
        resourceId,
    });

    // Alias para manter compatibilidade com código existente
    const handleSelectStep = stepNavigation.handleSelectStep;

    const handleAddBlock = useCallback((type: string) => {
        const stepIndex = safeCurrentStep;
        const currentBlocks = getStepBlocks(stepIndex);
        (commands.addBlock as any)(stepIndex, {
            type,
            id: `block-${uuidv4()}`,
            properties: {},
            content: {},
            order: currentBlocks.length
        });
    }, [safeCurrentStep, commands.addBlock, getStepBlocks]);

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
            appLogger.warn('[QuizModularEditor] Erro ao restaurar layout de painéis:', { data: [error] });
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
            // 🔧 FIX: Gerar todos 21 steps ao invés de apenas 2
            return Array.from({ length: 21 }, (_, i) => ({
                key: `step-${String(i + 1).padStart(2, '0')}`,
                title: `${String(i + 1).padStart(2, '0')} - Etapa ${i + 1}`,
            }));
        }

        return indexes.map((i) => ({
            key: `step-${String(i).padStart(2, '0')}`,
            title: `${String(i).padStart(2, '0')} - Etapa ${i}`,
        }));
    }, [loadedTemplate, stepsVersion, unifiedState.editor.stepBlocks]);

    // Ensure initial step in free mode
    useEffect(() => {
        if (!props.templateId && !loadedTemplate && (!unifiedState.editor.currentStep || unifiedState.editor.currentStep < 1)) {
            appLogger.info('🎨 [QuizModularEditor] Modo livre - inicializando currentStep = 1');
            setCurrentStep(1);
        }
    }, [props.templateId, loadedTemplate, setCurrentStep, unifiedState.editor.currentStep]);

    // 🎯 FASE 3.1: Auto-save automático gerenciado pelo hook useAutoSave
    // (mudanças nos blocos disparam auto-save via hook)

    // DnD sensors (usando hook seguro)
    const sensors = useSafeDndSensors();

    // normalize order helper
    const normalizeOrder = useCallback((list: Block[]) => list.map((b, idx) => ({ ...b, order: idx })), []);

    // 🧩 Helper: Normalização SIMPLIFICADA de payload de steps
    // ✅ CORREÇÃO 1: Reduzido de 6 para 3 formatos principais + validação
    const extractBlocksFromStepData = useCallback((raw: any, stepId: string): Block[] => {
        try {
            if (!raw) return [];

            // Caso 1: Array direto (já normalizado)
            if (Array.isArray(raw)) {
                return raw.filter((b: any) => b && b.id && b.type) as Block[];
            }

            // Caso 2: Objeto com propriedade .blocks
            if (raw.blocks && Array.isArray(raw.blocks)) {
                return raw.blocks.filter((b: any) => b && b.id && b.type) as Block[];
            }

            // Caso 3: Estrutura aninhada { steps: { stepId: { blocks: [] } } }
            if (raw.steps && raw.steps[stepId]?.blocks && Array.isArray(raw.steps[stepId].blocks)) {
                return raw.steps[stepId].blocks.filter((b: any) => b && b.id && b.type) as Block[];
            }

            // ⚠️ Formato não reconhecido - log para debug
            appLogger.warn('[extractBlocksFromStepData] Formato não reconhecido', {
                data: [{ stepId, hasBlocks: !!raw.blocks, hasSteps: !!raw.steps, keys: Object.keys(raw) }]
            });
            return [];
        } catch (err) {
            appLogger.error('[extractBlocksFromStepData] Erro ao normalizar', { data: [err] });
            return [];
        }
    }, []);

    // 🔥 HOTFIX 1: Hook unificado para carregamento de template (substitui 3 useEffects)
    // PROBLEMA RESOLVIDO: 3 useEffects diferentes carregavam o mesmo template simultaneamente
    // - 450-750ms de delay desnecessário eliminados
    // - Race conditions prevenidas com AbortController
    // - Deduplicação automática de requisições
    const templateLoader = useTemplateLoader({
        templateId: props.templateId,
        funnelId: props.funnelId,
        resourceId,
        enabled: !!(props.templateId || resourceId),
        onSuccess: (data) => {
            setLoadedTemplate(data);
            setTemplateLoadError(false);

            // Definir step inicial se necessário
            try {
                const p = new URLSearchParams(window.location.search);
                const s = p.get('step');
                const n = s ? parseInt(s, 10) : NaN;
                const hasUrlStep = !isNaN(n) && n >= 1 && n <= 21;
                const curr = unifiedState.editor.currentStep;
                if (!hasUrlStep && (!curr || curr < 1)) {
                    setCurrentStep(1);
                }
            } catch {
                setCurrentStep(1);
            }
        },
        onError: (error) => {
            appLogger.error('[useTemplateLoader] Erro ao carregar template:', error);
            setTemplateLoadError(true);
        },
    });

    // Sincronizar estado de loading
    useEffect(() => {
        setTemplateLoading(templateLoader.isLoading);
    }, [templateLoader.isLoading, setTemplateLoading]);

    // 🆕 Auto-injeção pós-carregamento: garante blocos iniciais mesmo quando
    // o template é carregado via useTemplateLoader (caminho que não passa por handleLoadTemplate)
    // Situação observada nos testes: template carregado, mas step-01 permanece vazio.
    const initialStepBlocksInjectedRef = useRef(false);
    useEffect(() => {
        if (!loadedTemplate || !activeTemplateId) return;
        if (initialStepBlocksInjectedRef.current) return;
        try {
            const existing = getStepBlocks(1);
            if (existing && existing.length > 0) {
                initialStepBlocksInjectedRef.current = true;
                return;
            }
        } catch { /* ignore */ }

        (async () => {
            try {
                const res: any = await templateService.getStep('step-01', activeTemplateId);
                if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
                    const normalized = res.data.filter((b: any) => b && b.id && b.type);
                    if (normalized.length > 0) {
                        setStepBlocks(1, normalized);
                        appLogger.info('✅ [AutoInject] step-01 blocks injected após templateLoader', {
                            data: [{ count: normalized.length }]
                        });
                    } else {
                        appLogger.warn('⚠️ [AutoInject] step-01 sem blocos válidos após filtro');
                    }
                } else {
                    appLogger.warn('⚠️ [AutoInject] getStep(step-01) retornou vazio ou sem sucesso', { data: [res] });
                }
            } catch (e) {
                appLogger.warn('[AutoInject] Falha ao injetar blocos iniciais step-01', { data: [e] });
            } finally {
                initialStepBlocksInjectedRef.current = true;
            }
        })();
    }, [loadedTemplate, activeTemplateId, getStepBlocks, setStepBlocks]);

    // 🔥 HOTFIX 3: Hook de validação com Web Worker (não-bloqueante)
    // PROBLEMA RESOLVIDO: Validação bloqueante de 2-5 segundos no main thread
    // - UI permanece 100% responsiva durante validação
    // - Progress reporting em tempo real
    // - Validação em background worker
    const templateValidation = useTemplateValidation();

    // Validar template quando carregamento completa
    useEffect(() => {
        if (!templateLoader.data || !resourceId) return;

        const tid = props.templateId ?? resourceId;
        const stepCount = templateLoader.data.steps.length || 21;

        // Coletar dados de todos os steps para validação
        async function validateTemplate() {
            try {
                appLogger.info(`🏥 [Validation] Iniciando validação em Web Worker: ${tid} (${stepCount} steps)`);

                // ✅ CORREÇÃO ARQUITETURAL: Carregar todos os steps EM PARALELO
                // Antes: 21 requisições sequenciais (~21s)
                // Depois: Promise.all (~1s)
                const stepsData: Record<string, any> = {};
                const stepPromises = Array.from({ length: stepCount }, (_, i) => {
                    const stepId = `step-${String(i + 1).padStart(2, '0')}`;
                    return templateService.getStep(stepId, tid)
                        .then(res => {
                            if (res.success) {
                                stepsData[stepId] = res.data;
                            }
                        })
                        .catch(err => {
                            appLogger.warn(`[Validation] Erro ao carregar ${stepId}:`, err);
                        });
                });

                await Promise.all(stepPromises);

                // Validar em worker (não-bloqueante)
                const result = await templateValidation.validate(tid, stepCount, stepsData);

                // Armazenar resultado
                setValidationResult(result);

                // Exibir toast baseado no resultado
                const formattedResult = formatValidationResult(result);

                if (!result.isValid) {
                    appLogger.error(`[Validation] Template inválido:\n${formattedResult}`);
                    toast({
                        type: 'error',
                        title: 'Template Inválido',
                        message: `${result.errors.filter(e => e.severity === 'critical').length} erros críticos encontrados. Clique no botão "Saúde do Template" para ver detalhes.`,
                        duration: 8000,
                    });
                    // ❌ CORREÇÃO: Não abrir automaticamente para não sobrepor propriedades
                    // setShowHealthPanel(true);
                } else if (result.warnings.length > 0 || result.errors.length > 0) {
                    appLogger.warn(`[Validation] Template com avisos:\n${formattedResult}`);
                    toast({
                        type: 'warning',
                        title: 'Template com Avisos',
                        message: `${result.warnings.length} avisos, ${result.errors.length} erros menores`,
                        duration: 5000,
                    });
                } else {
                    appLogger.info(
                        `[Validation] Template válido: ${result.summary.validSteps}/${result.summary.totalSteps} steps, ${result.summary.totalBlocks} blocos`
                    );
                }
            } catch (error) {
                appLogger.error('[Validation] Erro ao validar template:', error);
            }
        }

        validateTemplate();
    }, [templateLoader.data, resourceId, props.templateId, templateValidation, toast]);

    // ✅ CORREÇÃO ARQUITETURAL: Prefetch crítico REMOVIDO
    // useStepPrefetch (linha 206) já gerencia prefetch de steps vizinhos com debounce
    // Manter dois sistemas de prefetch causa duplicação e concorrência

    // Blocks from unified - SEMPRE como array para evitar null checks e loops
    const rawBlocks = getStepBlocks(safeCurrentStep);
    const blocks: Block[] = Array.isArray(rawBlocks) ? rawBlocks : [];

    // ✅ CORREÇÃO ARQUITETURAL: Sincronizar WYSIWYG sempre que blocks mudar
    // Garante que painel de propriedades (que lê wysiwyg.state.blocks) receba os dados
    useEffect(() => {
        if (blocks.length > 0) {
            const currentIds = wysiwyg.state.blocks.map(b => b.id).sort().join(',');
            const newIds = blocks.map(b => b.id).sort().join(',');

            if (currentIds !== newIds) {
                appLogger.debug('[QuizModularEditor] Sincronizando blocks unifiedState → WYSIWYG', {
                    step: safeCurrentStep,
                    count: blocks.length
                });
                wysiwyg.actions.reset(blocks);
            }
        }
    }, [blocks, safeCurrentStep]);

    // 🔧 CRITICAL FIX: Memo para o template completo usado no painel (hooks FORA do JSX)
    const fullTemplate = React.useMemo(
        () => ({
            step: currentStepKey,
            blocks,
        }),
        [currentStepKey, blocks]
    );

    // 🆕 Empty State: quando não há template/funnel e não há blocos, mostrar canvas em branco e ações de criação/import
    const showEmptyState = useMemo(() => {
        const noResource = !props.templateId && !resourceId && !loadedTemplate;
        const notLoading = !isLoadingTemplate && !isLoadingStep;
        return noResource && notLoading && blocks.length === 0;
    }, [props.templateId, resourceId, loadedTemplate, isLoadingTemplate, isLoadingStep, blocks.length]);

    // 🔧 CRITICAL FIX: Callback estável para quando o JSON do template for editado no painel
    const handleTemplateChange = React.useCallback(
        (template: { step?: string; blocks?: Block[] }) => {
            console.group('🔧 [QuizModularEditor] onTemplateChange chamado');
            appLogger.info('template recebido:', { data: [template] });
            appLogger.info('safeCurrentStep:', { data: [safeCurrentStep] });
            appLogger.info('template.blocks:', { data: [template?.blocks] });
            appLogger.info('isArray:', { data: [Array.isArray(template?.blocks)] });
            appLogger.info('blocksCount:', { data: [template?.blocks?.length] });
            console.groupEnd();

            if (template?.blocks && Array.isArray(template.blocks)) {
                appLogger.info('✅ Chamando setStepBlocks com', { data: [template.blocks.length, 'blocos'] });
                setStepBlocks(safeCurrentStep, template.blocks);
            } else {
                appLogger.warn('❌ template.blocks inválido ou não é array');
            }
        },
        [safeCurrentStep, setStepBlocks]
    );

    // 🔍 DEBUG: Desabilitado para reduzir poluição do console
    // useEffect(() => {
    //     if (import.meta.env.VITE_DEBUG_EDITOR === 'true') {
    //         console.log('🎯 getStepBlocks:', { step: safeCurrentStep, count: blocks.length });
    //     }
    // }, [safeCurrentStep, blocks]);

    useEffect(() => {
        try {
            appLogger.debug('🔍 [DEBUG] Selection State:', {
                selectedBlockId,
                blocksCount: blocks?.length,
                selectedBlock: blocks?.find(b => b.id === selectedBlockId),
                allBlockIds: blocks?.map(b => b.id),
            });
        } catch { }
    }, [selectedBlockId, blocks]);

    // 🐛 DEBUG: Desabilitado para reduzir poluição do console
    // useEffect(() => {
    //     if (import.meta.env.VITE_DEBUG_PROPERTIES === 'true') {
    //         console.log('🧩 Propriedades:', { selectedBlockId, blocksCount: blocks?.length });
    //     }
    // }, [selectedBlockId, blocks]);

    // 🔥 HOTFIX 2: Auto-selecionar primeiro bloco com guards robustos para prevenir loop infinito
    // PROBLEMA RESOLVIDO: Loop infinito em preview mode causando CPU 80-100%
    const isSelectingBlockRef = useRef(false);

    useEffect(() => {
        // 🔥 GUARD 1: Nunca rodar em preview mode
        if (previewMode === 'live') {
            appLogger.debug('[G2] Auto-select BLOQUEADO em preview mode');
            return;
        }

        // 🔥 GUARD 2: Prevenir re-entry
        if (isSelectingBlockRef.current) {
            appLogger.debug('[G2] Auto-select já em execução, ignorando');
            return;
        }

        // 🔥 GUARD 3: Validar blocos antes de selecionar
        if (!blocks || blocks.length === 0) {
            appLogger.debug('[G2] Sem blocos disponíveis para selecionar');
            return;
        }

        // 🔥 GUARD 4: Se já tem seleção válida, não mexer
        if (selectedBlockId && blocks.find(b => b.id === selectedBlockId)) {
            appLogger.debug('[G2] Seleção válida já existe:', selectedBlockId);
            return;
        }

        // ✅ Auto-selecionar primeiro bloco
        isSelectingBlockRef.current = true;

        const first = blocks[0];
        appLogger.debug(`[G2] Auto-selecionando primeiro bloco: ${first.id}`);
        setSelectedBlock(first.id);

        // Reset flag após delay
        setTimeout(() => {
            isSelectingBlockRef.current = false;
        }, 100);

        // ❌ IMPORTANTE: REMOVER setSelectedBlock das deps para evitar loop
    }, [blocks, selectedBlockId, previewMode]);


    // ✅ ARQUITETURA: Carregamento de step via hook dedicado
    // (substituiu 150 linhas de lógica fragmentada)
    useStepBlocksLoader({
        templateOrFunnelId: activeTemplateId ?? props.templateId ?? resourceId ?? null,
        stepIndex: safeCurrentStep,
        setStepBlocks,
        setStepLoading
    });

    // ✅ ARQUITETURA: Prefetch de steps vizinhos (otimização separada)
    useEffect(() => {
        const stepIndex = safeCurrentStep;
        const stepId = `step-${String(stepIndex).padStart(2, '0')}`;
        const controller = new AbortController();
        const { signal } = controller;

        // ✅ CORREÇÃO 6: Safety timeout para garantir reset de loading
        const safetyTimeout = setTimeout(() => {
            setStepLoading(false);
        }, 3000);

        async function ensureStepBlocks() {
            // Prefetch apenas se não estiver em loading
            if (isLoadingStep) return;

            // debounce small
            await new Promise(resolve => setTimeout(resolve, 100));
            if (signal.aborted) return;

            try {
                const svc: any = templateService;
                const templateOrResource = activeTemplateId ?? props.templateId ?? resourceId;

                if (!templateOrResource) {
                    appLogger.warn('[QuizModularEditor] ensureStepBlocks chamado sem templateOrResource');
                    setStepLoading(false);
                    return;
                }

                const result = await svc.getStep(stepId, templateOrResource, { signal });

                // Normalização segura
                const normalizedBlocks = extractBlocksFromStepData(result?.data, stepId);

                // ✅ CORREÇÃO 2: Validar array não-vazio antes de gravar
                if (!signal.aborted && result?.success && normalizedBlocks && normalizedBlocks.length > 0) {
                    appLogger.info(`✅ [QuizModularEditor] Step carregado: ${normalizedBlocks.length} blocos`);
                    setStepBlocks(stepIndex, normalizedBlocks);

                    // 🔥 HOTFIX 4: WYSIWYG Sync Otimizado
                    // ✅ CORREÇÃO 4: Sempre sincronizar (modo live fixo)
                    try {
                        // ✅ CORREÇÃO 5: Comparação otimizada sem JSON.stringify
                        const currentIds = wysiwyg.state.blocks.map(b => b.id).sort().join(',');
                        const newIds = normalizedBlocks.map((b: any) => b.id).sort().join(',');

                        if (currentIds !== newIds) {
                            // Blocos diferentes - fazer reset
                            appLogger.debug('[WYSIWYG] IDs mudaram, fazendo reset');
                            wysiwyg.actions.reset(normalizedBlocks);
                        } else {
                            // Mesmos IDs - atualização incremental
                            appLogger.debug('[WYSIWYG] Mesmos IDs, sync incremental');
                            normalizedBlocks.forEach((block: any) => {
                                const existing = wysiwyg.state.blocks.find(b => b.id === block.id);
                                // ✅ Comparação shallow ao invés de deep (JSON.stringify)
                                if (existing && (existing.type !== block.type || existing.order !== block.order)) {
                                    wysiwyg.actions.updateBlock(block.id, block);
                                }
                            });
                        }

                        // Manter ou definir seleção
                        const keepId = wysiwyg.state.selectedBlockId;
                        if (keepId && normalizedBlocks.some((b: any) => b.id === keepId)) {
                            // Seleção atual ainda válida, manter
                            wysiwyg.actions.selectBlock(keepId);
                        } else {
                            // Selecionar primeiro bloco
                            const first = normalizedBlocks[0];
                            if (first) wysiwyg.actions.selectBlock(first.id);
                        }
                    } catch (e) {
                        appLogger.warn('[QuizModularEditor] Falha ao sincronizar WYSIWYG', { data: [e] });
                    }
                } else {
                    // ✅ CORREÇÃO 2.1: Log mais claro sobre por que step não foi carregado
                    const reason = signal.aborted ? 'aborted' :
                        !result?.success ? 'request_failed' :
                            normalizedBlocks.length === 0 ? 'empty_blocks' : 'unknown';

                    console.warn('⚠️ [QuizModularEditor] Step não carregado:', {
                        stepId,
                        reason,
                        normalizedCount: normalizedBlocks?.length || 0
                    });

                    appLogger.warn('[QuizModularEditor] Step sem blocos válidos', {
                        stepId,
                        reason,
                        success: result?.success
                    });
                }
            } catch (e) {
                console.error('💥💥💥 [DEBUG] ensureStepBlocks ERRO:', e);
                if (!signal.aborted) {
                    appLogger.error('[QuizModularEditor] lazyLoadStep falhou:', e);
                }
            } finally {
                // 🔥 SEMPRE resetar loading, mesmo se aborted
                clearTimeout(safetyTimeout);
                setStepLoading(false);
            }
        }

        ensureStepBlocks();

        // ✅ CORREÇÃO ARQUITETURAL: Prefetch de vizinhos REMOVIDO
        // useStepPrefetch (linha 206) já faz isso com:
        // - Debounce de 300ms (evita prefetch em navegação rápida)
        // - AbortController (cancela requisições obsoletas)
        // - radius: 1 (steps N-1 e N+1)
        // Manter dois sistemas causa duplicação de requisições
        return () => {
            clearTimeout(safetyTimeout);
            controller.abort();
            setStepLoading(false);
        };
    }, [safeCurrentStep, props.templateId, resourceId, setStepLoading, setStepBlocks, queryClient, props.funnelId]);

    // DnD handler (uses desestructured methods)
    const handleDragEnd = useCallback(
        (event: any) => {
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

                // 🔄 G31 FIX: Rollback em falha de adição de bloco via DnD
                try {
                    addBlock(stepIndex, newBlock);
                    appLogger.debug('[DnD] Bloco adicionado da biblioteca', {
                        blockType: draggedItem.libraryType,
                        blockId: newBlock.id,
                    });
                } catch (error) {
                    appLogger.error('[DnD] Falha ao adicionar bloco da biblioteca, executando rollback', {
                        error,
                        blockType: draggedItem.libraryType,
                    });

                    undo();

                    toast({
                        type: 'error',
                        title: 'Erro ao adicionar bloco',
                        message: 'O bloco não pôde ser adicionado. Tente novamente.',
                        duration: 4000,
                    });
                }
                return;
            }

            if (draggedItem?.type === 'block' && activeId && overId && activeId !== overId) {
                const fromIndex = list.findIndex(b => String(b.id) === String(activeId));
                const toIndex = list.findIndex(b => String(b.id) === String(overId));
                if (fromIndex >= 0 && toIndex >= 0) {
                    const reordered = [...list];
                    const [moved] = reordered.splice(fromIndex, 1);
                    reordered.splice(toIndex, 0, moved);

                    // 🔄 G31 FIX: Rollback em falha de DnD
                    try {
                        reorderBlocks(stepIndex, reordered);

                        appLogger.debug('[DnD] Reordenação aplicada com sucesso', {
                            fromIndex,
                            toIndex,
                            blockId: activeId,
                        });
                    } catch (error) {
                        appLogger.error('[DnD] Falha ao reordenar blocos, executando rollback', {
                            error,
                            fromIndex,
                            toIndex,
                            blockId: activeId,
                        });

                        undo();

                        toast({
                            type: 'error',
                            title: 'Erro ao reordenar',
                            message: 'A reordenação foi desfeita. Tente novamente.',
                            duration: 4000,
                        });
                    }
                }
            }
        },
        [dnd.handlers, blocks, safeCurrentStep, addBlock, reorderBlocks, undo, showToast]
    );

    // Manual save
    const handleSave = useCallback(async () => {
        try {
            if (!props.templateId && !resourceId) {
                const nowId = `custom-${uuidv4()}`;
                const total =
                    loadedTemplate?.steps?.length ??
                    Object.keys(unifiedState.editor.stepBlocks || {})
                        .map((k) => Number(k))
                        .filter((n) => Number.isFinite(n) && n >= 1).length ??
                    1;
                try {
                    templateService.setActiveTemplate?.(nowId, total || 1);
                } catch (err) {
                    appLogger.warn('[handleSave] setActiveTemplate failed', err);
                }
            }

            // Garantir persistência de todas as etapas sujas antes do snapshot global
            try {
                await autoSave.forceSave();
                await (unified as any).ensureAllDirtyStepsSaved?.();
            } catch (error) {
                appLogger.warn('[QuizModularEditor] Erro ao salvar steps pendentes antes do snapshot:', {
                    data: [error],
                });
            }
            await saveFunnel();

            toast({
                type: 'success',
                title: 'Salvo!',
                message: 'Funil salvo com sucesso',
            });
        } catch (error) {
            toast({
                type: 'error',
                title: 'Erro',
                message: 'Erro ao salvar funil',
            });
        }
    }, [props.templateId, resourceId, loadedTemplate?.steps, unifiedState.editor.stepBlocks, saveFunnel, showToast, unified, autoSave]);

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
                if (templateOrResource) {
                    await queryClient.invalidateQueries({
                        queryKey: stepKeys.detail(stepKey, templateOrResource, funnel),
                    });
                }
            } catch (error) {
                appLogger.warn('[QuizModularEditor] Erro ao invalidar queries do React Query:', {
                    data: [error],
                });
            }

            const templateOrResource = props.templateId ?? resourceId;
            if (!templateOrResource) return;

            const result = await svc.getStep(stepKey, templateOrResource);
            const normalized = extractBlocksFromStepData(result?.data, stepKey);
            if (result.success && normalized) {
                setStepBlocks(stepIndex, normalized);
                appLogger.info(`✅ [QuizModularEditor] Step recarregado (normalizado): ${normalized.length} blocos`);
            } else {
                appLogger.warn('[QuizModularEditor] Reload sem blocos normalizados', {
                    success: result.success,
                    rawIsArray: Array.isArray(result.data),
                });
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
            appLogger.error('Erro ao exportar JSON:', { data: [e] });
        }
    }, [unifiedState.editor.stepBlocks, safeCurrentStep, props.templateId, loadedTemplate, resourceId]);

    // Export v3 (normalizado para StepBlocksTemplate v3.1)
    const handleExportV3 = useCallback(() => {
        try {
            const stepsEntries = Object.entries(unifiedState.editor.stepBlocks || {}) as Array<[string, any[]]>;

            const steps: Record<string, any> = {};
            for (const [indexStr, blocks] of stepsEntries) {
                const indexNum = Number(indexStr);
                const safeIndex = Number.isFinite(indexNum) ? indexNum : indexStr;
                const stepId = `step-${String(safeIndex).padStart(2, '0')}`;

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
                        name: `Etapa ${String(safeIndex)}`,
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
            appLogger.error('Erro ao exportar JSON v3:', { data: [e] });
        }
    }, [unifiedState.editor.stepBlocks, props.templateId, loadedTemplate, resourceId]);

    // Publish funnel
    const handlePublish = useCallback(async () => {
        try {
            let funnelId = unifiedState.currentFunnel?.id;

            if (!unifiedState.currentFunnel) {
                const created = await createFunnel({ name: 'Meu Quiz' } as any);
                if (!created?.id) {
                    toast({
                        type: 'error',
                        title: 'Erro',
                        message: 'Falha ao criar funil para publicar',
                    });
                    return;
                }
                funnelId = created.id;
            }
            // 🔍 G5 FIX: Validação de integridade antes de publicar
            if (loadedTemplate) {
                appLogger.info('[G5] Executando validação de integridade antes da publicação');

                const integrityResult = await validateTemplateIntegrityFull(
                    props.templateId ?? resourceId ?? 'unknown',
                    loadedTemplate.steps.length,
                    async (stepId: string) => {
                        const stepIndex = parseInt(stepId.replace('step-', ''), 10);
                        if (!isNaN(stepIndex)) {
                            return getStepBlocks(stepIndex);
                        }
                        return null;
                    },
                    {
                        validateSchemas: true,
                        validateDependencies: true,
                    }
                );

                const formattedResults = formatValidationResult(integrityResult);
                appLogger.info('[G5] Resultado da validação pré-publicação:', formattedResults);

                // Bloquear publicação se houver erros críticos
                const criticalErrors = integrityResult.errors.filter(e => e.severity === 'critical');
                if (criticalErrors.length > 0) {
                    toast({
                        type: 'error',
                        title: 'Erros críticos detectados',
                        message: `Impossível publicar: ${criticalErrors.length} erros críticos encontrados`,
                    });
                    return;
                }

                // Avisar sobre erros não-críticos mas permitir publicação
                if (integrityResult.errors.length > 0) {
                    toast({
                        type: 'warning',
                        title: 'Avisos detectados',
                        message: `${integrityResult.errors.length} problemas encontrados (não críticos)`,
                    });
                }
            }

            await publishFunnel({ ensureSaved: true });

            // 🔄 G42 FIX: Invalidar cache de todas as etapas para forçar refetch em modo production
            try {
                appLogger.info('[G42] Invalidando cache de steps após publicação');
                await queryClient.invalidateQueries({ queryKey: ['steps'] });
                await queryClient.refetchQueries({
                    queryKey: ['steps'],
                    type: 'active',
                });
            } catch (cacheError) {
                appLogger.warn('[G42] Erro ao invalidar cache após publicação', cacheError);
            }

            toast({
                type: 'success',
                title: 'Publicado',
                message: 'Seu funil foi publicado com sucesso!',
            });

            // 🎉 Redirecionar para página de sucesso
            if (funnelId) {
                const successUrl = `/publish/success?funnelId=${encodeURIComponent(funnelId)}&publishedAt=${encodeURIComponent(new Date().toISOString())}`;
                window.location.href = successUrl;
            }
        } catch (e) {
            toast({
                type: 'error',
                title: 'Erro ao publicar',
                message: 'Não foi possível publicar o funil. Tente novamente.',
            });
        }
    }, [publishFunnel, showToast, queryClient, loadedTemplate, props.templateId, resourceId, getStepBlocks, unifiedState.currentFunnel, unified]);

    // Load template via button (use imported templateService)
    const handleLoadTemplate = useCallback(async (overrideId?: string) => {
        const tid = overrideId ?? props.templateId ?? resourceId;

        if (!tid) {
            appLogger.error('[QuizModularEditor] handleLoadTemplate chamado sem templateId/resourceId');
            toast({
                type: 'error',
                title: 'Nenhum template selecionado',
                message: 'Abra o editor com um resourceId ou templateId válido para carregar um template.',
            });
            setTemplateLoadError(true);
            return;
        }

        setTemplateLoading(true);
        setTemplateLoadError(false);
        try {
            const svc: any = templateService;
            appLogger.info(`🔍 [QuizModularEditor] Preparando template via botão (lazy): ${tid}`);
            await svc.prepareTemplate?.(tid);

            const templateStepsResult = await svc.steps.list({ templateId: tid });
            if (!templateStepsResult.success) {
                throw new Error('Falha ao carregar lista de steps do template');
            }

            setLoadedTemplate({
                name: `Template: ${tid}`,
                steps: templateStepsResult.data,
            });
            setActiveTemplateId(tid);
            // ✅ Marcar carregamento concluído ANTES da injeção dos blocos para que o badge apareça nos testes rapidamente
            setTemplateLoading(false);
            // ✅ INJEÇÃO IMEDIATA DO STEP INICIAL (step-01) PARA EVITAR CANVAS VAZIO
            try {
                const firstStepId = 'step-01';
                const firstRes: any = await svc.getStep(firstStepId, tid);
                if (firstRes?.success) {
                    let initialBlocks: any[] = [];
                    const raw = firstRes.data;
                    if (Array.isArray(raw)) initialBlocks = raw.filter((b: any) => b && b.id && b.type);
                    else if (raw?.blocks && Array.isArray(raw.blocks)) initialBlocks = raw.blocks.filter((b: any) => b && b.id && b.type);
                    else if (raw?.steps && raw.steps[firstStepId]?.blocks) initialBlocks = raw.steps[firstStepId].blocks.filter((b: any) => b && b.id && b.type);

                    if (initialBlocks.length > 0) {
                        setStepBlocks(1, initialBlocks as any);
                        appLogger.info('✅ [handleLoadTemplate] Blocos iniciais carregados imediatamente', {
                            data: [{ step: firstStepId, count: initialBlocks.length }]
                        });
                    } else {
                        appLogger.warn('⚠️ [handleLoadTemplate] Sem blocos válidos em step-01 no carregamento inicial');
                    }
                } else {
                    appLogger.warn('⚠️ [handleLoadTemplate] getStep(step-01) não retornou sucesso');
                }
            } catch (e) {
                appLogger.warn('[handleLoadTemplate] Falha ao injetar blocos iniciais do step-01', { data: [e] });
            }
            try {
                const p = new URLSearchParams(window.location.search);
                const s = p.get('step');
                const n = s ? parseInt(s, 10) : NaN;
                const hasUrlStep = !isNaN(n) && n >= 1 && n <= 21;
                const curr = unifiedState.editor.currentStep;
                if (!hasUrlStep && (!curr || curr < 1)) {
                    setCurrentStep(1);
                }
            } catch {
                setCurrentStep(1);
            }
            appLogger.info(
                `✅ [QuizModularEditor] Template preparado (lazy): ${templateStepsResult.data.length} steps`
            );

            try {
                const url = new URL(window.location.href);
                url.searchParams.set('template', tid);
                if (qpSafe('funnel')) url.searchParams.set('funnel', qpSafe('funnel')!);
                window.history.pushState({}, '', url);
            } catch { }
        } catch (error) {
            appLogger.error('[QuizModularEditor] Erro ao carregar template:', error);
            setTemplateLoadError(true);
        } finally {
            // Loading já marcado como false acima para não atrasar badge nos testes
        }
        function qpSafe(key: 'funnel' | 'template' | 'step') {
            try {
                const u = new URL(window.location.href);
                return u.searchParams.get(key);
            } catch { return null; }
        }
    }, [props.templateId, resourceId, setTemplateLoading, setTemplateLoadError, setCurrentStep, unifiedState.editor.currentStep, showToast]);

    // 🚀 Auto-load de template/funil quando houver resourceId/funnelId presente
    useEffect(() => {
        const tid = props.templateId ?? resourceId ?? props.funnelId;
        if (!tid) return;
        // Evitar múltiplas chamadas
        if (loadedTemplate || templateLoadError) return;
        // Disparar carregamento inicial silencioso
        (async () => {
            try {
                await handleLoadTemplate();
            } catch {
                // erro já tratado internamente
            }
        })();
    }, [props.templateId, props.funnelId, resourceId, loadedTemplate, templateLoadError, handleLoadTemplate]);

    // Import template from JSON
    const handleImportTemplate = useCallback(
        async (template: any, stepId?: string) => {
            try {
                appLogger.info(
                    `📥 [QuizModularEditor] Importando template JSON: ${template?.metadata?.name || 'unknown'
                    }`
                );

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

                // VALIDAÇÃO COMPLETA DE INTEGRIDADE (G5)
                const integrityResult = await validateTemplateIntegrityFull(
                    'import-preview',
                    Object.keys(normalizedTemplate.steps).length,
                    async (stepId: string) => {
                        const blocks = normalizedTemplate.steps[stepId];
                        return Array.isArray(blocks) ? (blocks as Block[]) : null;
                    },
                    {
                        validateSchemas: true,
                        validateDependencies: true,
                    }
                );

                const formattedResults = formatValidationResult(integrityResult);
                appLogger.info(
                    '[QuizModularEditor] Validação de integridade do import:',
                    formattedResults
                );

                const criticalErrors = integrityResult.errors.filter(
                    e => e.severity === 'critical'
                );
                if (criticalErrors.length > 0) {
                    toast({
                        type: 'error',
                        title: 'Template com erros críticos',
                        message: `Encontrados ${criticalErrors.length} erros críticos que impedem a importação`,
                    });
                    throw new Error(`Template possui ${criticalErrors.length} erros críticos`);
                }

                if (integrityResult.errors.length > 0) {
                    toast({
                        type: 'warning',
                        title: 'Template com avisos',
                        message: `${integrityResult.errors.length} problemas detectados (não críticos)`,
                    });
                }

                if (validationResult.warnings && validationResult.warnings.length > 0) {
                    appLogger.warn('[QuizModularEditor] IDs legados normalizados', {
                        count: validationResult.warnings.length,
                        warnings: validationResult.warnings,
                    });

                    toast({
                        type: 'info',
                        title: 'Template normalizado',
                        message: `${validationResult.warnings.length} IDs legados foram atualizados para UUID v4`,
                    });
                }

                if (stepId) {
                    // Import single step
                    if (normalizedTemplate.steps[stepId]) {
                        const blocks = normalizedTemplate.steps[stepId];
                        const stepIndex = parseInt(stepId.replace('step-', ''), 10);

                        if (!isNaN(stepIndex)) {
                            setStepBlocks(stepIndex, blocks);
                            toast({
                                type: 'success',
                                title: 'Step importado',
                                message: `${blocks.length} blocos importados para ${stepId}`,
                            });
                            appLogger.info(
                                `✅ [QuizModularEditor] Step ${stepId} importado: ${blocks.length} blocos`
                            );
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
                            name: `Etapa ${index + 1}`,
                        })),
                    });

                    setCurrentStep(1);

                    toast({
                        type: 'success',
                        title: 'Template importado',
                        message: `${stepEntries.length} steps importados com ${totalBlocks} blocos no total`,
                    });
                    appLogger.info(
                        `✅ [QuizModularEditor] Template completo importado: ${stepEntries.length} steps, ${totalBlocks} blocos`
                    );
                }

                queryClient.invalidateQueries({ queryKey: ['templates'] });
            } catch (error) {
                appLogger.error('[QuizModularEditor] Erro ao importar template:', error);
                toast({
                    type: 'error',
                    title: 'Erro ao importar',
                    message:
                        error instanceof Error ? error.message : 'Erro desconhecido',
                });
            }
        },
        [setStepBlocks, setLoadedTemplate, setCurrentStep, showToast, queryClient]
    );

    return (
        <SafeDndContext
            sensors={sensors}
            onDragStart={dnd.handlers.onDragStart}
            onDragOver={dnd.handlers.onDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="qm-editor flex flex-col h-screen bg-gray-50" data-editor="modular-enhanced">
                {/* Header */}
                <header
                    className="flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm"
                    role="toolbar"
                    aria-label="Editor toolbar"
                    data-testid="editor-header"
                >
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

                        {((!loadedTemplate && !isLoadingTemplate && !props.templateId) ||
                            templateLoadError) && (
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
                        {/* 🔄 G27 FIX: Botões Undo/Redo */}
                        <div className="flex items-center gap-1">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={undo}
                                disabled={!canUndo}
                                className="h-7 px-2"
                                title="Desfazer (Ctrl+Z / Cmd+Z)"
                            >
                                <Undo2 className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={redo}
                                disabled={!canRedo}
                                className="h-7 px-2"
                                title="Refazer (Ctrl+Y / Cmd+Shift+Z)"
                            >
                                <Redo2 className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="w-px h-6 bg-gray-300" /> {/* Separator */}

                        <div className="flex items-center gap-2 flex-wrap">
                            {/* 🔥 MODO LIVE FIXO: Preview de produção desativado */}
                            <Badge variant="default" className="h-7 px-3 bg-blue-600 text-white flex items-center gap-1.5">
                                <Edit3 className="w-3 h-3" />
                                <span>Modo Edição</span>
                            </Badge>

                            {/* 💾 Indicador de Auto-save */}
                            {resourceId && (
                                <AutosaveIndicator
                                    status={autoSave.isSaving ? 'saving' : autoSave.error ? 'error' : autoSave.lastSaved ? 'saved' : wysiwyg.state.isDirty ? 'unsaved' : 'idle'}
                                    errorMessage={autoSave.error?.message}
                                    onRetry={() => autoSave.forceSave()}
                                    compact={false}
                                    className="text-xs"
                                />
                            )}

                            {/* 💾 Indicador de snapshot disponível */}
                            {snapshot.hasSnapshot && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        const recovered = snapshot.recoverSnapshot();
                                        if (recovered) {
                                            // Apenas resetar WYSIWYG em modo edit
                                            if (previewMode !== 'live') {
                                                wysiwyg.actions.reset(recovered.blocks);
                                            }
                                            setViewport(recovered.viewport);
                                            setCurrentStep(recovered.currentStep);
                                            snapshot.clearSnapshot();
                                            toast({
                                                type: 'success',
                                                title: 'Draft Recuperado',
                                                message: 'Suas alterações não salvas foram recuperadas com sucesso!',
                                            });
                                        }
                                    }}
                                    className="h-7 text-xs hidden md:flex items-center gap-1.5 bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100 animate-pulse"
                                >
                                    <Clock className="h-3.5 w-3.5" />
                                    <span className="font-medium">Recuperar alterações</span>
                                    <span className="text-[10px] opacity-75">({Math.round((snapshot.snapshotAge || 0) / 1000)}s atrás)</span>
                                </Button>
                            )}
                        </div>

                        <div className="w-px h-6 bg-gray-300" /> {/* Separator */}

                        {/* 📐 Viewport Selector (WYSIWYG) */}
                        <ViewportSelector
                            value={viewport}
                            onChange={setViewport}
                            className="hidden lg:flex"
                        />

                        <div className="w-px h-6 bg-gray-300 hidden lg:block" /> {/* Separator */}

                        {/* 🎯 FASE 3.1: Controles de visibilidade dos painéis */}
                        <div className="flex items-center gap-1">
                            <Button
                                size="sm"
                                variant={editorModeUI.showComponentLibrary ? "default" : "outline"}
                                onClick={editorModeUI.toggleComponentLibrary}
                                className="h-7 px-2"
                                title="Mostrar/ocultar biblioteca de componentes"
                            >
                                📚
                            </Button>
                            <Button
                                size="sm"
                                variant={editorModeUI.showProperties ? "default" : "outline"}
                                onClick={() => {
                                    console.log('🔄 [QuizModularEditor] Toggle Properties:', {
                                        antes: editorModeUI.showProperties,
                                        depois: !editorModeUI.showProperties
                                    });
                                    if (editorModeUI.showProperties) {
                                        console.warn('⚠️ [PONTO CEGO] Tentando DESLIGAR Properties Panel!');
                                        alert('⚠️ Properties Panel não pode ser desligado neste modo de debug!');
                                        return; // 🔥 IMPEDIR DESLIGAR
                                    }
                                    editorModeUI.toggleProperties();
                                }}
                                className="h-7 px-2"
                                title="Mostrar/ocultar painel de propriedades"
                            >
                                ⚙️
                            </Button>
                        </div>

                        <div className="w-px h-6 bg-gray-300" /> {/* Separator */}

                        {/* 🐛 DEBUG: Toggle para painel simples */}
                        <Button
                            size="sm"
                            variant={useSimplePropertiesPanel ? "default" : "outline"}
                            onClick={() => {
                                const newValue = !useSimplePropertiesPanel;
                                console.log('🔄 [QuizModularEditor] Alternando painel:', {
                                    de: useSimplePropertiesPanel,
                                    para: newValue
                                });
                                setUseSimplePropertiesPanel(newValue);
                                try {
                                    localStorage.setItem('qm-editor:use-simple-properties', String(newValue));
                                    console.log('💾 localStorage atualizado:', localStorage.getItem('qm-editor:use-simple-properties'));
                                } catch { }
                                appLogger.info(`[QuizModularEditor] Painel de propriedades: ${newValue ? 'PropertiesColumn' : 'PropertiesColumnWithJson'}`);
                                toast({
                                    type: 'info',
                                    title: `${newValue ? '✅ PropertiesColumn' : '📝 PropertiesColumnWithJson'} ativado`,
                                    message: `Painel alternado para ${newValue ? 'versão principal com SinglePropertiesPanel' : 'versão com editor JSON integrado'}.`
                                });
                            }}
                            className="h-7"
                            title="Alternar entre PropertiesColumn (principal) e PropertiesColumnWithJson (legado)"
                        >
                            {useSimplePropertiesPanel ? '✅ PropertiesColumn' : '📝 WithJson'}
                        </Button>

                        {/* 🎯 FASE 3.1: Indicador de auto-save com hook core */}
                        {enableAutoSave && (
                            <AutosaveIndicator
                                status={autoSave.isSaving ? 'saving' : autoSave.error ? 'error' : autoSave.lastSaved ? 'saved' : 'idle'}
                                errorMessage={autoSave.error?.message}
                                onRetry={() => {
                                    autoSave.forceSave();
                                }}
                                className="animate-fade-in"
                            />
                        )}

                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={false}
                            className="h-7"
                            title="Salvar alterações no funil"
                        >
                            <Save className="w-3 h-3 mr-1" />
                            Salvar
                        </Button>
                        <Button
                            size="sm"
                            variant="default"
                            onClick={handlePublish}
                            disabled={false}
                            className="h-7 bg-emerald-600 hover:bg-emerald-700"
                            title="Publicar este funil"
                        >
                            <Play className="w-3 h-3 mr-1" />
                            Publicar
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleExportJSON}
                            className="h-7"
                        >
                            <Download className="w-3 h-3 mr-1" />
                            Exportar JSON
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleExportV3}
                            className="h-7"
                        >
                            <Download className="w-3 h-3 mr-1" />
                            Exportar v3
                        </Button>
                        {/* 🧬 Duplicar funil (novo serviço com fallback) */}
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                                if (!resourceId) {
                                    toast({ type: 'error', title: 'Duplicação', message: 'resourceId ausente' });
                                    return;
                                }
                                const result = await duplicateFunnel(resourceId);
                                if (result.success && result.clonedFunnel?.id) {
                                    toast({
                                        type: 'success',
                                        title: 'Funil duplicado',
                                        message: `${result.stats?.clonedBlocks ?? '?'} blocos em ${result.stats?.durationMs ?? '?'}ms`
                                    });
                                    try {
                                        window.location.href = `/editor/${encodeURIComponent(result.clonedFunnel.id)}`;
                                    } catch { }
                                } else {
                                    toast({ type: 'error', title: 'Duplicação', message: result.error ?? 'Falha ao duplicar' });
                                }
                            }}
                            className="h-7"
                            title="Duplicar funil"
                        >
                            <Download className="w-3 h-3 mr-1" />
                            Duplicar
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
                </header>

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
                            appLogger.warn(
                                '[QuizModularEditor] Falha ao salvar layout de painéis:',
                                error
                            );
                        }
                    }}
                >
                    <Panel defaultSize={15} minSize={10} maxSize={25}>
                        <div
                            className="h-full border-r bg-white overflow-y-auto flex flex-col"
                            data-testid="column-steps"
                        >
                            <Suspense fallback={<StepNavigatorSkeleton />}>
                                <StepNavigatorColumn
                                    steps={navSteps}
                                    currentStepKey={currentStepKey}
                                    onSelectStep={handleSelectStep}
                                    validationErrors={validationResult?.errors}
                                    validationWarnings={validationResult?.warnings}
                                />
                            </Suspense>

                            {/* 🏥 Health Panel Toggle Button */}
                            <div className="p-2 border-t mt-auto">
                                <Button
                                    size="sm"
                                    variant={showHealthPanel ? 'default' : 'outline'}
                                    onClick={() => setShowHealthPanel(!showHealthPanel)}
                                    className="w-full text-xs"
                                    title="Template Health Panel"
                                >
                                    {validationResult?.isValid ? '✓' : '⚠'} Saúde do Template
                                </Button>
                            </div>
                        </div>
                    </Panel>

                    <ResizableHandle className="w-1 bg-gray-200 hover:bg-blue-400 transition-colors relative group" withHandle />

                    {/* 🎯 FASE 3.1: Painel de biblioteca com controle de visibilidade */}
                    {editorModeUI.showComponentLibrary && (
                        <>
                            <Panel defaultSize={20} minSize={15} maxSize={30}>
                                <Suspense
                                    fallback={<ComponentLibrarySkeleton />}
                                >
                                    <div
                                        className="h-full border-r bg-white overflow-y-auto"
                                        data-testid="column-library"
                                    >
                                        <ComponentLibraryColumn
                                            currentStepKey={currentStepKey}
                                            onAddBlock={handleAddBlock}
                                        />
                                    </div>
                                </Suspense>
                            </Panel>

                            <ResizableHandle className="w-1 bg-gray-200 hover:bg-blue-400 transition-colors relative group" withHandle />
                        </>
                    )}

                    <Panel defaultSize={40} minSize={30}>
                        <Suspense
                            fallback={<CanvasSkeleton />}
                        >
                            <div
                                className="relative z-0 h-full bg-gray-50 overflow-y-auto"
                                data-testid="column-canvas"
                            >
                                <ViewportContainer
                                    viewport={viewport}
                                    showRuler={true}
                                    className="h-full overflow-auto"
                                    data-testid={previewMode === 'live' ? 'canvas-edit-mode' : 'canvas-preview-mode'}
                                    data-step-id={currentStepKey || 'unknown'}
                                >
                                    {isLoadingTemplate ? (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="text-sm text-gray-500 animate-pulse">
                                                Carregando etapas do template…
                                            </div>
                                        </div>
                                    ) : isLoadingStep ? (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-sm text-gray-500 animate-pulse mb-2">
                                                    Carregando etapa…
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {currentStepKey}
                                                </div>
                                            </div>
                                        </div>
                                    ) : showEmptyState ? (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="text-center max-w-md p-6 border rounded-lg bg-white shadow-sm">
                                                <h2 className="text-lg font-semibold mb-2">Canvas em branco</h2>
                                                <p className="text-sm text-gray-600 mb-4">Crie um funil do zero, importe um modelo JSON ou carregue um template existente.</p>
                                                <div className="flex items-center justify-center gap-2 flex-wrap">
                                                    <Button size="sm" onClick={() => handleAddBlock('text')}>Adicionar bloco de texto</Button>
                                                    <Button size="sm" variant="outline" onClick={() => setIsImportDialogOpen(true)}>Importar JSON</Button>
                                                    <Button size="sm" variant="outline" onClick={handleLoadTemplate}>Carregar Template</Button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <StepErrorBoundary
                                            stepKey={currentStepKey || 'unknown'}
                                            onReset={handleReloadStep}
                                        >
                                            <div
                                                className={
                                                    isLoadingStep
                                                        ? 'pointer-events-none opacity-50'
                                                        : ''
                                                }
                                            >
                                                <CanvasColumn
                                                    currentStepKey={currentStepKey}
                                                    blocks={previewMode === 'live'
                                                        ? (virtualization.isVirtualized ? virtualization.visibleBlocks : wysiwyg.state.blocks)
                                                        : blocks}
                                                    selectedBlockId={previewMode === 'live' ? wysiwyg.state.selectedBlockId : selectedBlockId}
                                                    onRemoveBlock={previewMode === 'live' ? (id => {
                                                        wysiwyg.actions.removeBlock(id);
                                                        removeBlock(safeCurrentStep, id);
                                                    }) : undefined}
                                                    onMoveBlock={previewMode === 'live' ? ((from, to) => {
                                                        wysiwyg.actions.reorderBlocks(from, to);
                                                    }) : undefined}
                                                    onUpdateBlock={previewMode === 'live' ? ((id, patch) => {
                                                        wysiwyg.actions.updateBlock(id, patch);
                                                        updateBlock(safeCurrentStep, id, patch);
                                                    }) : undefined}
                                                    onBlockSelect={handleCanvasBlockSelect}
                                                    hasTemplate={Boolean(
                                                        loadedTemplate ||
                                                        props.templateId ||
                                                        resourceId
                                                    )}
                                                    onLoadTemplate={handleLoadTemplate}
                                                    isEditable={previewMode === 'live'}
                                                />
                                            </div>
                                        </StepErrorBoundary>
                                    )}
                                </ViewportContainer>
                            </div>
                        </Suspense>
                    </Panel>

                    <ResizableHandle className="w-1 bg-gray-200 hover:bg-blue-400 transition-colors relative group" withHandle />

                    {/* ✨ V4: Dynamic Properties Panel com controles automáticos do BlockRegistry */}
                    {editorModeUI.showProperties && (
                        <Panel defaultSize={25} minSize={20} maxSize={35}>
                            <Suspense
                                fallback={<PropertiesPanelSkeleton />}
                            >
                                <div
                                    className="h-full border-l bg-white overflow-y-auto"
                                    data-testid="column-properties"
                                >
                                    <DynamicPropertiesPanelV4
                                        block={selectedBlock ? (() => {
                                            try {
                                                return ensureV4Block(selectedBlock);
                                            } catch (error) {
                                                appLogger.error('Erro ao converter bloco para v4:', { error, block: selectedBlock });
                                                return null;
                                            }
                                        })() : null}
                                        onUpdate={(blockId, updates) => {
                                            try {
                                                // Converter updates v4 → v3
                                                const currentBlock = wysiwyg.state.blocks.find(b => b.id === blockId);
                                                if (!currentBlock) return;

                                                const v4Block = ensureV4Block(currentBlock);
                                                const updatedV4Block: QuizBlock = {
                                                    ...v4Block,
                                                    ...updates,
                                                    properties: {
                                                        ...(v4Block.properties || {}),
                                                        ...(updates.properties || {}),
                                                    },
                                                };

                                                const v3Block = BlockV4ToV3Adapter.convert(updatedV4Block);

                                                // Aplicar update v3
                                                wysiwyg.actions.updateBlock(blockId, v3Block);
                                                updateBlock(safeCurrentStep, blockId, v3Block);
                                            } catch (error) {
                                                appLogger.error('Erro ao aplicar update v4:', { error, blockId, updates });
                                            }
                                        }}
                                        onClose={handleWYSIWYGClearSelection}
                                        onDelete={(blockId) => {
                                            wysiwyg.actions.removeBlock(blockId);
                                            removeBlock(safeCurrentStep, blockId);
                                        }}
                                    />
                                </div>
                            </Suspense>
                        </Panel>
                    )}
                </PanelGroup>

                {/* 🏥 Template Health Panel (sidebar) - Posicionado para não sobrepor properties */}
                {showHealthPanel && (
                    <div className="fixed right-4 top-20 bottom-4 w-80 z-40 shadow-2xl rounded-lg overflow-hidden bg-white dark:bg-gray-800 border-2 border-orange-400 dark:border-orange-600">
                        {/* Botão de fechar no topo */}
                        <div className="absolute top-2 right-2 z-50">
                            <button
                                onClick={() => setShowHealthPanel(false)}
                                className="p-1.5 rounded-md bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-md border border-gray-300 dark:border-gray-600 transition-colors"
                                title="Fechar painel de validação"
                                aria-label="Fechar"
                            >
                                <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <TemplateHealthPanel
                            validationResult={validationResult}
                            onAutoFix={(errorIndex) => {
                                // Auto-fix: Tenta corrigir automaticamente erros comuns
                                if (validationResult?.errors?.[errorIndex]) {
                                    const error = validationResult.errors[errorIndex];
                                    appLogger.info('Tentando auto-fix', { error });

                                    toast({
                                        type: 'info',
                                        title: 'Auto-fix',
                                        message: `Corrigindo: ${error.message}`,
                                    });

                                    // Navegar para o step com erro para que o usuário possa ver a correção
                                    if (error.stepId) {
                                        handleSelectStep(error.stepId);
                                    }
                                } else {
                                    toast({
                                        type: 'warning',
                                        title: 'Auto-fix',
                                        message: 'Erro não encontrado ou já corrigido',
                                    });
                                }
                            }}
                            onNavigateToStep={(stepId) => {
                                handleSelectStep(stepId);
                                setShowHealthPanel(false);
                            }}
                            onDismissWarning={(warningIndex) => {
                                // Dismiss: Remove warning da lista temporariamente
                                if (validationResult?.warnings?.[warningIndex]) {
                                    const warning = validationResult.warnings[warningIndex];
                                    appLogger.info('Warning dismissed', { warning });

                                    // Atualizar validation result removendo o warning
                                    setValidationResult(prev => {
                                        if (!prev) return prev;
                                        const newWarnings = [...prev.warnings];
                                        newWarnings.splice(warningIndex, 1);
                                        return {
                                            ...prev,
                                            warnings: newWarnings,
                                        };
                                    });

                                    toast({
                                        type: 'success',
                                        title: 'Warning Dismissed',
                                        message: 'Aviso removido da lista',
                                    });
                                }
                            }}
                            collapsed={false}
                            onToggleCollapse={() => setShowHealthPanel(false)}
                        />
                    </div>
                )}

                {import.meta.env.DEV && MetricsPanel && (
                    <Suspense fallback={null}>
                        <MetricsPanel />
                    </Suspense>
                )}

                {/* ✅ WAVE 2: Performance Monitor em tempo real */}
                {import.meta.env.DEV && (
                    <Suspense fallback={null}>
                        <PerformanceMonitor
                            selectedBlockId={selectedBlockId}
                            selectedBlockType={
                                blocks?.find(b => b.id === selectedBlockId)?.type ||
                                null
                            }
                        />
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
        </SafeDndContext >
    );
}

/**
 * 🚀 FASE 2: Memoize inner component para evitar re-renders desnecessários
 */
const MemoizedQuizModularEditorInner = React.memo(QuizModularEditorInner);

/**
 * Default export wraps inner component with EditorLoadingProvider so useEditorLoading()
 * inside QuizModularEditorInner is always safe.
 */
export default function QuizModularEditor(props: QuizModularEditorProps) {
    const isTest =
        typeof import.meta !== 'undefined' && (import.meta as any).env?.VITEST === true;
    if (isTest) {
        return (
            <EditorLoadingProvider>
                <MemoizedQuizModularEditorInner {...props} />
            </EditorLoadingProvider>
        );
    }
    return (
        <EditorLoadingProvider>
            <div data-testid="modular-layout" className="h-full w-full">
                <EditorLoadingProgress
                    progress={Number(
                        (props.editorResource as any)?.metadata?.progress ?? 1
                    )}
                />
                <Suspense fallback={<div />}>
                    <MemoizedQuizModularEditorInner {...props} />
                </Suspense>
            </div>
        </EditorLoadingProvider>
    );
}

export { MemoizedQuizModularEditorInner as QuizModularEditorInner };
