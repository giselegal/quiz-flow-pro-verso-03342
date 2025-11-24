// Aplicar polyfills React primeiro
import '@/lib/utils/reactPolyfills';
import React, { Suspense, useEffect, useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { stepKeys } from '@/services/api/steps/hooks';
import { v4 as uuidv4 } from 'uuid';
import { SafeDndContext, useSafeDndSensors } from './components/SafeDndContext';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { ResizableHandle } from '@/components/ui/resizable';
import { useSuperUnified } from '@/hooks/useSuperUnified';
import { useUI } from '@/contexts/providers/UIProvider';
import { useDndSystem } from './hooks/useDndSystem';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import type { Block } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Eye, Edit3, Play, Save, Download, Upload, Undo2, Redo2 } from 'lucide-react';
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
// Autosave com lock e coalescing
import { useQueuedAutosave } from '@/hooks/useQueuedAutosave';
// Autosave feedback visual
import { AutosaveIndicator } from '../AutosaveIndicator';
// Template Health Panel
import { TemplateHealthPanel } from './components/TemplateHealthPanel';
import { useAutosaveIndicator } from '../AutosaveIndicator.hook';
// 🆕 G20 & G28 FIX: Prefetch inteligente com AbortController
import { useStepPrefetch } from '@/hooks/useStepPrefetch';
// ✅ WAVE 2: Performance Monitor
import { PerformanceMonitor } from '@/components/editor/PerformanceMonitor';
// 🎨 WYSIWYG: Sistema de edição ao vivo
import { useWYSIWYGBridge } from '@/hooks/useWYSIWYGBridge';
import ViewportSelector, { type ViewportSize } from '@/components/editor/quiz/ViewportSelector';
import { ViewportContainer } from '@/components/editor/quiz/ViewportSelector/ViewportContainer';
import { useEditorMode } from '@/hooks/useEditorMode';
import { useSnapshot } from '@/hooks/useSnapshot';
import { useVirtualizedBlocks } from '@/hooks/useVirtualizedBlocks';

// Static import: navigation column
import StepNavigatorColumn from './components/StepNavigatorColumn';

// Lazy columns
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
        undo,
        redo,
        canUndo,
        canRedo,
        removeBlock,
        reorderBlocks,
        updateBlock,
    } = unified;
    // UI slice agora via UIProvider
    const { state: uiState } = useUI();

    // Resource unification (support legacy props)
    const resourceId = props.resourceId || props.templateId || props.funnelId;
    const isReadOnly = props.isReadOnly ?? false;
    const resourceMetadata = props.editorResource ?? null;

    // 🐛 DEBUG: Verificar se resourceId está chegando e se vai carregar JSON
    appLogger.info('🔍 [QuizModularEditor] Props recebidas:', {
        data: [{
            resourceId: props.resourceId,
            templateId: props.templateId,
            funnelId: props.funnelId,
            resourceIdFinal: resourceId
        }]
    });

    appLogger.info('🚨 [QuizModularEditor] DIAGNÓSTICO CRÍTICO:', {
        data: [{
            temResourceId: !!resourceId,
            vaiCarregarJSON: !!(props.templateId || resourceId),
            razao: !resourceId ? '❌ resourceId está undefined - JSON NÃO SERÁ CARREGADO!' : '✅ resourceId OK - JSON será carregado',
            urlAtual: typeof window !== 'undefined' ? window.location.href : 'SSR'
        }]
    });

    // Safe current step
    const safeCurrentStep = Math.max(1, unifiedState.editor.currentStep || 1);
    const currentStepKey = `step-${String(safeCurrentStep).padStart(2, '0')}`;
    const selectedBlockId = unifiedState.editor.selectedBlockId;
    const isDirty = unifiedState.editor.isDirty;

    // 💾 Autosave Indicator (Feedback Visual)
    const autosaveIndicator = useAutosaveIndicator();

    // 🔒 Autosave Queue com Lock (GARGALO R1 + G35)
    const { queueSave: queueAutosave, flush: flushAutosave } = useQueuedAutosave({
        // Mantemos a assinatura de saveStepBlocks compatível (stepNumber é derivado do stepKey)
        saveFn: async (_blocks: Block[], stepKey: string) => {
            const stepNumber = parseInt(stepKey.replace(/\D/g, ''), 10) || 1;
            await saveStepBlocks(stepNumber);
        },
        debounceMs: Number((import.meta as any).env?.VITE_AUTO_SAVE_DELAY_MS ?? 2000),
        maxRetries: 3,
        onUnsaved: (stepKey) => {
            appLogger.debug(`⏱️ [Autosave] Alterações não salvas em ${stepKey}`);
            autosaveIndicator.setUnsaved();
        },
        onSaving: (stepKey) => {
            appLogger.debug(`💾 [Autosave] Salvando ${stepKey}...`);
            autosaveIndicator.setSaving();
        },
        onSuccess: (stepKey) => {
            appLogger.info(`✅ [Autosave] Step salvo: ${stepKey}`);
            autosaveIndicator.setSaved();
        },
        onError: (stepKey, error) => {
            appLogger.error(`❌ [Autosave] Falha ao salvar ${stepKey}:`, error);
            autosaveIndicator.setError(error.message);
        },
    });

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

    // 🆕 G20 & G28 FIX: Prefetch inteligente de steps adjacentes
    useStepPrefetch({
        currentStepId: currentStepKey,
        funnelId: props.funnelId,
        totalSteps: 21,
        enabled: true,
        radius: 1, // Prefetch step anterior e próximo
        debounceMs: 16,
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

    // Local UI state
    const [previewMode, setPreviewMode] = useState<'live' | 'production'>(() => {
        try {
            const v = localStorage.getItem('qm-editor:preview-mode');
            return v === 'production' ? 'production' : 'live';
        } catch { return 'live'; }
    });

    // 🐛 DEBUG: Flag para usar painel de propriedades simples (stateless)
    const [useSimplePropertiesPanel, setUseSimplePropertiesPanel] = useState<boolean>(() => {
        try {
            const v = localStorage.getItem('qm-editor:use-simple-properties');
            return v === 'true';
        } catch { return false; }
    });

    const [loadedTemplate, setLoadedTemplate] = useState<{ name: string; steps: any[] } | null>(null);
    const [templateLoadError, setTemplateLoadError] = useState(false);

    // 🏥 Health Panel State
    const [validationResult, setValidationResult] = useState<TemplateValidationResult | null>(null);
    const [showHealthPanel, setShowHealthPanel] = useState<boolean>(() => {
        try {
            const saved = localStorage.getItem('qm-editor:show-health-panel');
            return saved === 'true';
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

    // 🎮 Editor Mode: State machine para modos
    const editorMode = useEditorMode({
        canvasMode,
        previewMode,
    });

    // 💾 Snapshot System: Recuperação de drafts
    const snapshot = useSnapshot({
        resourceId: resourceId || '',
        enabled: enableAutoSave && !!resourceId,
    });

    // 🎨 WYSIWYG Bridge: Sincronização instantânea entre propriedades e canvas
    const wysiwyg = useWYSIWYGBridge({
        currentStep: safeCurrentStep,
        onAutoSave: (blocks, stepKey) => {
            // Salvar snapshot antes do auto-save
            if (snapshot.saveSnapshot) {
                snapshot.saveSnapshot(blocks, viewport, editorMode.dataSource as any, safeCurrentStep);
            }
            queueAutosave(stepKey, blocks);
        },
        autoSaveDelay: Number((import.meta as any).env?.VITE_AUTO_SAVE_DELAY_MS ?? 2000),
        enableValidation: true,
        mode: previewMode === 'live' ? 'edit-live' : 'preview-production',
    });

    // 💾 Recuperar snapshot no mount
    useEffect(() => {
        if (snapshot.hasSnapshot && resourceId) {
            const recovered = snapshot.recoverSnapshot();
            if (recovered && window.confirm(
                `Encontrado draft não salvo de ${Math.round((snapshot.snapshotAge || 0) / 1000)}s atrás. Deseja recuperar?`
            )) {
                appLogger.info('[Snapshot] Recuperando draft...');
                wysiwyg.actions.reset(recovered.blocks);
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

            // Atalhos simples: Ctrl+1/2 (sem Alt)
            if (isMacOrWin && !e.altKey) {
                if (e.key === '1') {
                    e.preventDefault();
                    setPreviewMode('live');
                    appLogger.debug('[QuizModularEditor] ⌨️ Atalho: Edição ao vivo (Ctrl+1)');
                    return;
                } else if (e.key === '2') {
                    e.preventDefault();
                    setPreviewMode('production');
                    appLogger.debug('[QuizModularEditor] ⌨️ Atalho: Preview Publicado (Ctrl+2)');
                    return;
                }
            }

            // Atalho legado: Ctrl+Shift+P para toggle entre modos
            if (!e.ctrlKey || !e.shiftKey) return;
            const k = String(e.key || '').toLowerCase();
            if (k === 'p') {
                e.preventDefault();
                setPreviewMode(prev => prev === 'live' ? 'production' : 'live');
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [previewMode]);

    // ✅ WAVE 1 FIX: Selection chain corrigido com callback estável
    const handleBlockSelect = useCallback((blockId: string | null) => {
        appLogger.info('🎯 [handleBlockSelect] CHAMADO com:', {
            data: [{
                blockId,
                isNull: blockId === null,
                selectedBlockIdAtual: selectedBlockId
            }]
        });

        if (!blockId) {
            appLogger.info('❌ blockId null, limpando seleção');
            setSelectedBlock(null);
            return;
        }

        appLogger.info('✅ [handleBlockSelect] Definindo selectedBlock:', { data: [blockId] });
        appLogger.info(`📍 [WAVE1] Selecionando bloco: ${blockId}`);
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
    }, [setSelectedBlock, selectedBlockId]);

    // 🚀 PERFORMANCE: Callbacks otimizados para handlers do WYSIWYG
    const handleWYSIWYGBlockSelect = useCallback((id: string | null) => {
        wysiwyg.actions.selectBlock(id);
        handleBlockSelect(id);
    }, [wysiwyg.actions, handleBlockSelect]);

    const handleWYSIWYGBlockUpdate = useCallback((id: string, updates: Partial<Block>) => {
        console.group('🎨 [WYSIWYG] onBlockUpdate chamado');
        appLogger.info('blockId:', { data: [id] });
        appLogger.info('updates:', { data: [updates] });
        appLogger.info('currentStep:', { data: [safeCurrentStep] });
        console.groupEnd();

        // 🚀 WYSIWYG: Atualização instantânea via hook
        if (updates.properties) {
            wysiwyg.actions.updateBlockProperties(id, updates.properties);
        } else if (updates.content) {
            wysiwyg.actions.updateBlockContent(id, updates.content);
        } else {
            wysiwyg.actions.updateBlock(id, updates);
        }

        appLogger.info('✨ [WYSIWYG] Atualização instantânea aplicada');
    }, [wysiwyg.actions, safeCurrentStep]);

    const handleWYSIWYGClearSelection = useCallback(() => {
        wysiwyg.actions.selectBlock(null);
        setSelectedBlock(null);
    }, [wysiwyg.actions, setSelectedBlock]);

    // 🚀 PERFORMANCE: Memo para bloco selecionado
    const selectedBlock = useMemo(
        () => wysiwyg.state.blocks.find(b => b.id === wysiwyg.state.selectedBlockId) || undefined,
        [wysiwyg.state.blocks, wysiwyg.state.selectedBlockId]
    );

    // 🚀 PERFORMANCE: Virtualização para listas grandes (> 50 blocos)
    const virtualization = useVirtualizedBlocks({
        blocks: wysiwyg.state.blocks,
        estimatedBlockHeight: 150,
        threshold: 50,
        overscan: 3
    });

    // ✅ WAVE 1: Navegação instantânea - UI update imediato, lazy load em background
    const handleSelectStep = useCallback((key: string) => {
        appLogger.info('🔵 [handleSelectStep] Iniciando navegação:', { data: [{ key, currentStepKey }] });

        if (key === currentStepKey) {
            appLogger.info('⚠️ [handleSelectStep] Step já está selecionado, ignorando');
            return;
        }

        // 🎯 FASE 1 CRÍTICO: Limpar selectedBlockId ao mudar de step (evita bloco órfão)
        appLogger.info('🧹 [handleSelectStep] Limpando selectedBlockId ao navegar para:', { data: [key] });
        setSelectedBlock(null);
        appLogger.info(`🧹 [FASE1] selectedBlockId resetado ao navegar: ${currentStepKey} → ${key}`);

        // 🎯 WAVE 1 FIX: Atualizar UI IMEDIATAMENTE (não bloqueia)
        if (loadedTemplate?.steps?.length) {
            const index = loadedTemplate.steps.findIndex((s: any) => s.id === key);
            const newStep = index >= 0 ? index + 1 : 1;
            appLogger.info('🔵 [handleSelectStep] Calculado newStep:', { data: [{ index, newStep, safeCurrentStep }] });

            if (newStep !== safeCurrentStep) {
                appLogger.info('✅ [handleSelectStep] Chamando setCurrentStep:', { data: [newStep] });
                setCurrentStep(newStep);
                appLogger.info(`⚡ [WAVE1] Navegação instantânea: ${currentStepKey} → ${key}`);
            } else {
                appLogger.info('⚠️ [handleSelectStep] newStep === safeCurrentStep, pulando');
            }
        } else {
            // Fallback: extrair número do step-XX
            const match = key.match(/step-(\d{1,2})/i);
            const num = match ? parseInt(match[1], 10) : 1;
            appLogger.info('🔵 [handleSelectStep] Fallback:', { data: [{ match, num }] });
            setCurrentStep(num);
            appLogger.info(`⚡ [WAVE1] Navegação instantânea (fallback): step ${num}`);
        }

        // 🔄 Lazy load em BACKGROUND (não bloqueia UI)
        const tid = props.templateId ?? resourceId;
        if (tid) {
            templateService.getStep(key, tid)
                .then(stepResult => {
                    if (stepResult.success) {
                        appLogger.info(`✅ [WAVE1] Step ${key} carregado em background`);
                    }
                })
                .catch(error => {
                    appLogger.warn(`⚠️ [WAVE1] Erro ao carregar step ${key}:`, { data: [error] });
                });
        }
    }, [currentStepKey, loadedTemplate, safeCurrentStep, setCurrentStep, setSelectedBlock, props.templateId, resourceId]);

    const handleAddBlock = useCallback((type: string) => {
        const stepIndex = safeCurrentStep;
        const currentBlocks = getStepBlocks(stepIndex);
        addBlock(stepIndex, {
            type,
            id: `block-${uuidv4()}`,
            properties: {},
            content: {},
            order: currentBlocks.length
        });
    }, [safeCurrentStep, addBlock, getStepBlocks]);

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
        console.log('🔥🔥🔥 [DEBUG] navSteps recalculando:', {
            hasLoadedTemplate: !!loadedTemplate,
            stepsLength: loadedTemplate?.steps?.length || 0,
            stepBlocksKeys: Object.keys(unifiedState.editor.stepBlocks || {}).length
        });

        if (loadedTemplate?.steps?.length) {
            console.log('🔥 [DEBUG] Usando loadedTemplate.steps:', loadedTemplate.steps.length);
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
            console.log('🔥 [DEBUG] Usando fallback de 21 steps');
            // 🔧 FIX: Gerar todos 21 steps ao invés de apenas 2
            return Array.from({ length: 21 }, (_, i) => ({
                key: `step-${String(i + 1).padStart(2, '0')}`,
                title: `${String(i + 1).padStart(2, '0')} - Etapa ${i + 1}`,
            }));
        }

        console.log('🔥 [DEBUG] Usando stepBlocks indexes:', indexes);
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

    // ✅ G4 FIX: Template preparation agora é feito APENAS em useEditorResource.loadResource()
    // Mantemos aqui APENAS a validação e setup de steps metadata
    // ✅ FASE 2: Adicionar warmup automático de cache no mount
    useEffect(() => {
        if (!props.templateId && !resourceId) {
            appLogger.info('🎨 [QuizModularEditor] Modo canvas vazio - sem template');
            return;
        }

        const controller = new AbortController();
        const { signal } = controller;

        async function loadTemplateOptimized() {
            const tid = props.templateId ?? resourceId!;
            setTemplateLoading(true);
            setTemplateLoadError(false);
            try {
                const svc: any = templateService;
                appLogger.info(`🔍 [QuizModularEditor] Carregando metadata do template: ${tid}`);

                // 🔥 FASE 2: Warmup de cache - prefetch steps iniciais (1, 2, 3)
                const { cacheManager } = await import('@/lib/cache/CacheManager');
                const { loadStepFromJson } = await import('@/templates/loaders/jsonStepLoader');
                cacheManager
                    .warmup('step-01', tid, 21, loadStepFromJson)
                    .catch((err: Error) => {
                        appLogger.debug('[QuizModularEditor] Warmup failed:', err);
                    });

                // 🎯 CRÍTICO: Definir template ativo ANTES de chamar steps.list()
                // Isso garante que o TemplateService retorne os steps corretos
                const defaultStepCount = 21;
                try {
                    if (typeof svc.setActiveTemplate === 'function') {
                        svc.setActiveTemplate(tid, defaultStepCount);
                        appLogger.info(`✅ [QuizModularEditor] Template ativo definido: ${tid} (${defaultStepCount} steps)`);
                    } else {
                        appLogger.warn('[QuizModularEditor] setActiveTemplate não disponível');
                    }
                } catch (err) {
                    appLogger.error('[QuizModularEditor] Erro ao definir template ativo:', err);
                }

                // Buscar lista de steps (método síncrono, sem parâmetros)
                let stepsMeta: any[] = [];
                try {
                    const templateStepsResult = svc.steps?.list?.() ?? { success: false, data: [] };

                    if (templateStepsResult.success && Array.isArray(templateStepsResult.data)) {
                        stepsMeta = templateStepsResult.data;
                        appLogger.info(`✅ [QuizModularEditor] Steps carregados: ${stepsMeta.length} steps`);
                    } else {
                        throw new Error('steps.list() retornou resultado inválido');
                    }
                } catch (err) {
                    // Fallback: criar array padrão de 21 steps
                    appLogger.warn('[QuizModularEditor] Usando fallback de steps:', err);
                    stepsMeta = Array.from({ length: defaultStepCount }, (_, i) => ({
                        id: `step-${String(i + 1).padStart(2, '0')}`,
                        order: i + 1,
                        name: `Etapa ${i + 1}`,
                    }));
                }

                if (!signal.aborted) {
                    console.log('🔥🔥🔥 [DEBUG] setLoadedTemplate CHAMADO:', {
                        tid,
                        stepsMetaLength: stepsMeta.length,
                        primeiros3: stepsMeta.slice(0, 3).map(s => ({ id: s.id, name: s.name }))
                    });
                    setLoadedTemplate({ name: `Template: ${tid} (JSON v3)`, steps: stepsMeta });
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
                }

                if (!signal.aborted) {
                    appLogger.info(`✅ [QuizModularEditor] Metadata carregada: ${stepsMeta.length} steps`);

                    // 🔍 G5 FIX: Validar integridade completa das etapas
                    // Sempre valida, mesmo se metadata está vazia (usa 21 steps como default)
                    const stepsToValidate = stepsMeta.length > 0 ? stepsMeta.length : 21;
                    runFullValidation(tid, stepsToValidate, signal);
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

        // 🔍 G5 FIX: Validação completa de integridade
        async function runFullValidation(tid: string, stepCount: number, signal: AbortSignal) {
            try {
                appLogger.info(`[G5] 🏥 Iniciando validação completa: ${tid} (${stepCount} steps)`);
                console.log('🏥 [HealthPanel] Validação iniciada:', { tid, stepCount });

                const result = await validateTemplateIntegrityFull(
                    tid,
                    stepCount,
                    async (stepId: string) => {
                        if (signal.aborted) return null;
                        const res = await templateService.getStep(stepId, tid, { signal });
                        return res.success ? res.data : null;
                    },
                    {
                        signal,
                        validateSchemas: true,
                        validateDependencies: true,
                    }
                );

                console.log('🏥 [HealthPanel] Validação concluída:', {
                    isValid: result.isValid,
                    errorsCount: result.errors.length,
                    warningsCount: result.warnings.length,
                    summary: result.summary
                });

                if (!signal.aborted) {
                    const formattedResult = formatValidationResult(result);

                    // 🏥 Armazenar resultado para TemplateHealthPanel
                    setValidationResult(result);

                    if (!result.isValid) {
                        // Erros críticos encontrados
                        appLogger.error(`[G5] Template inválido:\n${formattedResult}`);
                        showToast({
                            type: 'error',
                            title: 'Template Inválido',
                            message: `${result.errors.filter(e => e.severity === 'critical').length} erros críticos encontrados. Clique no ícone de saúde para ver detalhes.`,
                            duration: 6000,
                        });
                        // Auto-abrir painel de saúde em caso de erros críticos
                        setShowHealthPanel(true);
                    } else if (result.warnings.length > 0 || result.errors.length > 0) {
                        // Warnings ou erros não-críticos
                        appLogger.warn(`[G5] Template com avisos:\n${formattedResult}`);
                        showToast({
                            type: 'warning',
                            title: 'Template com Avisos',
                            message: `${result.warnings.length} avisos, ${result.errors.length} erros menores`,
                            duration: 5000,
                        });
                    } else {
                        // Template perfeito
                        appLogger.info(
                            `[G5] Template válido: ${result.summary.validSteps}/${result.summary.totalSteps} steps, ${result.summary.totalBlocks} blocos`
                        );
                    }
                }
            } catch (error) {
                if (!signal.aborted) {
                    appLogger.error('[G5] Erro ao validar integridade do template:', error);
                }
            }
        }

        loadTemplateOptimized();
        return () => {
            controller.abort();
            setTemplateLoading(false);
        };
    }, [props.templateId, resourceId, setTemplateLoading, setTemplateLoadError, setCurrentStep, showToast, unifiedState.editor.currentStep]);

    // Prefetch de steps críticos na montagem para navegação mais fluida
    useEffect(() => {
        const critical = ['step-01', 'step-12', 'step-19', 'step-20', 'step-21'];
        const templateOrResource = props.templateId ?? resourceId ?? null;
        const funnel = props.funnelId ?? null;
        if (!templateOrResource) return;

        critical.forEach((sid) => {
            queryClient
                .prefetchQuery({
                    queryKey: stepKeys.detail(sid, templateOrResource, funnel),
                    queryFn: async () => {
                        const res = await templateService.getStep(sid, templateOrResource);
                        if (res.success) return res.data;
                        throw res.error ?? new Error('Falha no prefetch crítico');
                    },
                    staleTime: 60_000,
                })
                .catch(() => void 0);
        });
        // sem cleanup necessário
    }, [queryClient, props.templateId, resourceId, props.funnelId]);

    // Blocks from unified - SEMPRE como array para evitar null checks e loops
    const rawBlocks = getStepBlocks(safeCurrentStep);
    const blocks: Block[] = Array.isArray(rawBlocks) ? rawBlocks : [];

    // 🔧 CRITICAL FIX: Memo para o template completo usado no painel (hooks FORA do JSX)
    const fullTemplate = React.useMemo(
        () => ({
            step: currentStepKey,
            blocks,
        }),
        [currentStepKey, blocks]
    );

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

    // ✅ G1 FIX: Auto-selecionar primeiro bloco se selectedBlockId for null ou inválido
    useEffect(() => {
        if (previewMode === 'live' && (!selectedBlockId || !blocks?.find(b => b.id === selectedBlockId))) {
            const first = blocks && blocks[0];
            if (first) {
                appLogger.debug(`[G1] Auto-selecionando primeiro bloco: ${first.id}`);
                setSelectedBlock(first.id);
            }
        }
    }, [blocks, selectedBlockId, previewMode, setSelectedBlock]);

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
                const templateOrResource = props.templateId ?? resourceId;

                // 🔥 DEBUG FORÇADO
                console.log('🔥🔥🔥 [DEBUG] ensureStepBlocks INICIOU', {
                    stepId,
                    stepIndex,
                    templateId: props.templateId,
                    resourceId,
                    templateOrResource,
                    temResourceId: !!templateOrResource
                });

                if (!templateOrResource) {
                    console.error('❌❌❌ [DEBUG] templateOrResource é UNDEFINED!', {
                        propsTemplateId: props.templateId,
                        propsResourceId: props.resourceId,
                        propsFunnelId: props.funnelId,
                        resourceId
                    });
                    appLogger.warn('[QuizModularEditor] ensureStepBlocks chamado sem templateOrResource');
                    setStepLoading(false);
                    return;
                }

                console.log(`🔍🔍🔍 [DEBUG] Chamando templateService.getStep('${stepId}', '${templateOrResource}')`);
                appLogger.info(`🔍 [QuizModularEditor] Chamando getStep para ${stepId}, template: ${templateOrResource}`);

                const result = await svc.getStep(stepId, templateOrResource, { signal });

                console.log('📦📦📦 [DEBUG] getStep retornou:', {
                    success: result?.success,
                    hasData: !!result?.data,
                    blocksCount: result?.data?.length || 0,
                    firstBlock: result?.data?.[0],
                    blockIds: result?.data?.map((b: any) => b.id).slice(0, 5) || []
                });

                appLogger.info(`📦 [QuizModularEditor] getStep retornou:`, {
                    success: result?.success,
                    blocksCount: result?.data?.length || 0,
                    blockIds: result?.data?.map((b: any) => b.id).slice(0, 5) || []
                });

                if (!signal.aborted && result?.success && result.data) {
                    console.log(`✅✅✅ [DEBUG] Chamando setStepBlocks(${stepIndex}, ${result.data.length} blocos)`);
                    appLogger.info(`✅ [QuizModularEditor] Chamando setStepBlocks com ${result.data.length} blocos`);
                    setStepBlocks(stepIndex, result.data);

                    console.log('🎯🎯🎯 [DEBUG] setStepBlocks COMPLETO - Estado deve ter sido atualizado');
                } else {
                    console.warn('⚠️⚠️⚠️ [DEBUG] getStep NÃO retornou dados válidos:', {
                        aborted: signal.aborted,
                        success: result?.success,
                        hasData: !!result?.data,
                        dataLength: result?.data?.length
                    });
                    appLogger.warn(`⚠️ [QuizModularEditor] getStep não retornou dados válidos`, {
                        aborted: signal.aborted,
                        success: result?.success,
                        hasData: !!result?.data
                    });
                }
            } catch (e) {
                console.error('💥💥💥 [DEBUG] ensureStepBlocks ERRO:', e);
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
        // ✅ FASE 2: Prefetch melhorado com warmup automático de cache
        try {
            // Prefetch vizinhos: N-1, N+1, N+2 (lookahead)
            const neighborIds = [stepIndex - 1, stepIndex + 1, stepIndex + 2]
                .filter((i) => i >= 1)
                .map((i) => `step-${String(i).padStart(2, '0')}`);
            const templateOrResource = props.templateId ?? resourceId ?? null;
            const funnel = props.funnelId ?? null;

            if (templateOrResource) {
                neighborIds.forEach((nid) => {
                    queryClient
                        .prefetchQuery({
                            queryKey: stepKeys.detail(nid, templateOrResource, funnel),
                            queryFn: async ({ signal: querySignal }) => {
                                const res = await templateService.getStep(nid, templateOrResource, { signal: querySignal });
                                if (res.success) return res.data;
                                throw res.error ?? new Error('Falha no prefetch');
                            },
                            staleTime: 10 * 60 * 1000, // FASE 2: 10min (aumentado de 30s)
                        })
                        .catch((err) => {
                            appLogger.warn('[QuizModularEditor] prefetch neighbor failed', err);
                        });
                });
            }
        } catch (err) {
            appLogger.warn('[QuizModularEditor] prefetch setup failed', err);
        }
        return () => {
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

                    showToast({
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

                        showToast({
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
                await flushAutosave();
                await (unified as any).ensureAllDirtyStepsSaved?.();
            } catch (error) {
                appLogger.warn('[QuizModularEditor] Erro ao salvar steps pendentes antes do snapshot:', {
                    data: [error],
                });
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
    }, [props.templateId, resourceId, loadedTemplate?.steps, unifiedState.editor.stepBlocks, saveFunnel, showToast, unified, flushAutosave]);

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
            if (!unifiedState.currentFunnel) {
                const created = await unified.createFunnel('Meu Quiz');
                if (!created?.id) {
                    showToast({
                        type: 'error',
                        title: 'Erro',
                        message: 'Falha ao criar funil para publicar',
                    });
                    return;
                }
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
                    showToast({
                        type: 'error',
                        title: 'Erros críticos detectados',
                        message: `Impossível publicar: ${criticalErrors.length} erros críticos encontrados`,
                    });
                    return;
                }

                // Avisar sobre erros não-críticos mas permitir publicação
                if (integrityResult.errors.length > 0) {
                    showToast({
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

            showToast({
                type: 'success',
                title: 'Publicado',
                message: 'Seu funil foi publicado com sucesso!',
            });
        } catch (e) {
            showToast({
                type: 'error',
                title: 'Erro ao publicar',
                message: 'Não foi possível publicar o funil. Tente novamente.',
            });
        }
    }, [publishFunnel, showToast, queryClient, loadedTemplate, props.templateId, resourceId, getStepBlocks, unifiedState.currentFunnel, unified]);

    // Load template via button (use imported templateService)
    const handleLoadTemplate = useCallback(async () => {
        const tid = props.templateId ?? resourceId;

        if (!tid) {
            appLogger.error('[QuizModularEditor] handleLoadTemplate chamado sem templateId/resourceId');
            showToast({
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

            const url = new URL(window.location.href);
            url.searchParams.set('template', tid);
            window.history.pushState({}, '', url);
        } catch (error) {
            appLogger.error('[QuizModularEditor] Erro ao carregar template:', error);
            setTemplateLoadError(true);
        } finally {
            setTemplateLoading(false);
        }
    }, [props.templateId, resourceId, setTemplateLoading, setTemplateLoadError, setCurrentStep, unifiedState.editor.currentStep, showToast]);

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
                    showToast({
                        type: 'error',
                        title: 'Template com erros críticos',
                        message: `Encontrados ${criticalErrors.length} erros críticos que impedem a importação`,
                    });
                    throw new Error(`Template possui ${criticalErrors.length} erros críticos`);
                }

                if (integrityResult.errors.length > 0) {
                    showToast({
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

                    showToast({
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
                            showToast({
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

                    showToast({
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
                showToast({
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
                            <ToggleGroup
                                type="single"
                                value={previewMode}
                                onValueChange={(val: string) => {
                                    // ✅ FIX: Sempre manter um valor selecionado (não permitir desmarcação)
                                    if (!val) return;

                                    // Aplicar mudança de modo
                                    if (val === 'live') {
                                        setPreviewMode('live');
                                        appLogger.debug('[QuizModularEditor] Modo alterado para: Edição ao vivo');
                                    } else if (val === 'production') {
                                        setPreviewMode('production');
                                        appLogger.debug('[QuizModularEditor] Modo alterado para: Publicado');
                                    }
                                }}
                                size="sm"
                                className="gap-1.5"
                                aria-label="Modo do canvas"
                            >
                                <ToggleGroupItem
                                    value="live"
                                    title="Edição ao vivo - mudanças instantâneas (Ctrl+1)"
                                    aria-label="Edição ao vivo"
                                    className="min-w-[110px]"
                                >
                                    <Edit3 className="w-3 h-3 mr-1" />
                                    <span className="hidden sm:inline">Edição ao vivo</span>
                                    <span className="sm:hidden">Live</span>
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value="production"
                                    title="Visualizar dados publicados (Ctrl+2)"
                                    aria-label="Visualizar publicado"
                                    className="min-w-[90px]"
                                >
                                    <Play className="w-3 h-3 mr-1" />
                                    <span className="hidden sm:inline">Publicado</span>
                                    <span className="sm:hidden">Pub</span>
                                </ToggleGroupItem>
                            </ToggleGroup>

                            {/* 🎮 Indicador de modo usando state machine */}
                            <div
                                className="text-xs px-2 py-1 rounded-md transition-colors hidden md:flex items-center gap-1"
                                style={{
                                    backgroundColor: editorMode.badge.color === 'blue' ? 'rgb(219 234 254)' : 'rgb(209 250 229)',
                                    color: editorMode.badge.color === 'blue' ? 'rgb(30 58 138)' : 'rgb(6 78 59)'
                                }}
                                title={editorMode.description}
                            >
                                <span>{editorMode.badge.icon}</span>
                                <span>{editorMode.badge.text}</span>
                                {editorMode.showDraftIndicator && wysiwyg.state.isDirty && (
                                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" title="Mudanças não salvas" />
                                )}
                            </div>

                            {/* 💾 Indicador de snapshot disponível */}
                            {snapshot.hasSnapshot && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        const recovered = snapshot.recoverSnapshot();
                                        if (recovered) {
                                            wysiwyg.actions.reset(recovered.blocks);
                                            setViewport(recovered.viewport);
                                            setCurrentStep(recovered.currentStep);
                                            snapshot.clearSnapshot();
                                            showToast({
                                                type: 'success',
                                                title: 'Draft Recuperado',
                                                message: 'Suas alterações não salvas foram recuperadas com sucesso!',
                                            });
                                        }
                                    }}
                                    className="h-7 text-xs hidden md:flex items-center gap-1"
                                >
                                    <span>💾</span>
                                    <span>Recuperar draft ({Math.round((snapshot.snapshotAge || 0) / 1000)}s)</span>
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

                        {/* 🐛 DEBUG: Toggle para painel simples */}
                        <Button
                            size="sm"
                            variant={useSimplePropertiesPanel ? "default" : "outline"}
                            onClick={() => {
                                const newValue = !useSimplePropertiesPanel;
                                setUseSimplePropertiesPanel(newValue);
                                try {
                                    localStorage.setItem('qm-editor:use-simple-properties', String(newValue));
                                } catch { }
                                appLogger.info(`[QuizModularEditor] Painel de propriedades: ${newValue ? 'SIMPLES' : 'COMPLETO'}`);
                            }}
                            className="h-7"
                            title="Alternar entre painel simples (debug) e completo"
                        >
                            {useSimplePropertiesPanel ? '🐛 Debug' : '⚙️ Full'}
                        </Button>

                        {enableAutoSave && (
                            <AutosaveIndicator
                                status={autosaveIndicator.status}
                                errorMessage={autosaveIndicator.errorMessage}
                                onRetry={() => {
                                    const stepBlocks = unifiedState.editor.stepBlocks as Record<string, Block[]>;
                                    const blocks = stepBlocks[currentStepKey] || [];
                                    if (currentStepKey && blocks.length > 0) {
                                        queueAutosave(currentStepKey, blocks);
                                    }
                                }}
                                className="animate-fade-in"
                            />
                        )}

                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={uiState.isLoading || isReadOnly}
                            className="h-7"
                        >
                            <Save className="w-3 h-3 mr-1" />
                            {uiState.isLoading ? 'Salvando...' : 'Salvar'}
                        </Button>
                        <Button
                            size="sm"
                            variant="default"
                            onClick={handlePublish}
                            disabled={uiState.isLoading || isReadOnly}
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
                            <StepNavigatorColumn
                                steps={navSteps}
                                currentStepKey={currentStepKey}
                                onSelectStep={handleSelectStep}
                                validationErrors={validationResult?.errors}
                                validationWarnings={validationResult?.warnings}
                            />

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

                    <Panel defaultSize={20} minSize={15} maxSize={30}>
                        <Suspense
                            fallback={
                                <div className="p-4 text-sm text-gray-500">
                                    Carregando biblioteca…
                                </div>
                            }
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

                    <Panel defaultSize={40} minSize={30}>
                        <Suspense
                            fallback={
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    Carregando canvas…
                                </div>
                            }
                        >
                            <div
                                className="h-full bg-gray-50 overflow-y-auto"
                                data-testid="column-canvas"
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
                                ) : canvasMode === 'edit' ? (
                                    <StepErrorBoundary
                                        stepKey={currentStepKey || 'unknown'}
                                        onReset={handleReloadStep}
                                    >
                                        <ViewportContainer
                                            viewport={viewport}
                                            showRuler={true}
                                            className="h-full overflow-auto"
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
                                                    blocks={virtualization.isVirtualized ? virtualization.visibleBlocks : wysiwyg.state.blocks}
                                                    selectedBlockId={wysiwyg.state.selectedBlockId}
                                                    onRemoveBlock={id => {
                                                        wysiwyg.actions.removeBlock(id);
                                                        removeBlock(safeCurrentStep, id);
                                                    }}
                                                    onMoveBlock={(from, to) => {
                                                        wysiwyg.actions.reorderBlocks(from, to);
                                                    }}
                                                    onUpdateBlock={(id, patch) => {
                                                        wysiwyg.actions.updateBlock(id, patch);
                                                        updateBlock(safeCurrentStep, id, patch);
                                                    }}
                                                    onBlockSelect={(id) => {
                                                        wysiwyg.actions.selectBlock(id);
                                                        handleBlockSelect(id);
                                                    }}
                                                    hasTemplate={Boolean(
                                                        loadedTemplate ||
                                                        props.templateId ||
                                                        resourceId
                                                    )}
                                                    onLoadTemplate={handleLoadTemplate}
                                                />
                                            </div>
                                        </ViewportContainer>
                                    </StepErrorBoundary>
                                ) : (
                                    <StepErrorBoundary
                                        stepKey={currentStepKey || 'unknown'}
                                        onReset={() => handleReloadStep()}
                                    >
                                        <ViewportContainer
                                            viewport={viewport}
                                            showRuler={true}
                                            className="h-full overflow-auto"
                                        >
                                            <PreviewPanel
                                                currentStepKey={currentStepKey}
                                                blocks={previewMode === 'live' ? wysiwyg.state.blocks : blocks}
                                                selectedBlockId={selectedBlockId}
                                                onBlockSelect={handleBlockSelect}
                                                isVisible={true}
                                                className="h-full"
                                                previewMode={previewMode}
                                                funnelId={
                                                    unifiedState.currentFunnel?.id || null
                                                }
                                                onStepChange={sid => {
                                                    const match = String(sid || '').match(
                                                        /step-(\d{1,2})/i
                                                    );
                                                    const num = match
                                                        ? parseInt(match[1], 10)
                                                        : safeCurrentStep;
                                                    if (
                                                        Number.isFinite(num) &&
                                                        num !== safeCurrentStep
                                                    )
                                                        setCurrentStep(num);
                                                }}
                                            />
                                        </ViewportContainer>
                                    </StepErrorBoundary>
                                )}
                            </div>
                        </Suspense>
                    </Panel>

                    <ResizableHandle className="w-1 bg-gray-200 hover:bg-blue-400 transition-colors relative group" withHandle />

                    <Panel defaultSize={25} minSize={20} maxSize={35}>
                        <Suspense
                            fallback={
                                <div className="p-4 text-sm text-gray-500">
                                    Carregando propriedades…
                                </div>
                            }
                        >
                            <div
                                className="h-full border-l bg-white overflow-y-auto"
                                data-testid="column-properties"
                            >
                                {/* DEBUG removido para limpar console */}

                                {/* ✅ WAVE 1: Usar PropertiesColumn principal com todas as features */}
                                {useSimplePropertiesPanel ? (
                                    <PropertiesColumn
                                        selectedBlock={selectedBlock}
                                        blocks={wysiwyg.state.blocks}
                                        onBlockSelect={handleWYSIWYGBlockSelect}
                                        onBlockUpdate={handleWYSIWYGBlockUpdate}
                                        onClearSelection={handleWYSIWYGClearSelection}
                                    />
                                ) : (
                                    <PropertiesColumnWithJson
                                        selectedBlock={selectedBlock}
                                        blocks={wysiwyg.state.blocks}
                                        onBlockSelect={handleWYSIWYGBlockSelect}
                                        onBlockUpdate={handleWYSIWYGBlockUpdate}
                                        onClearSelection={handleWYSIWYGClearSelection}
                                        fullTemplate={fullTemplate}
                                        onTemplateChange={handleTemplateChange}
                                        templateId={currentStepKey}
                                    />
                                )}
                            </div>
                        </Suspense>
                    </Panel>
                </PanelGroup>

                {/* 🏥 Template Health Panel (sidebar) */}
                {showHealthPanel && (
                    <div className="fixed right-4 top-20 bottom-4 w-96 z-50 shadow-2xl rounded-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <TemplateHealthPanel
                            validationResult={validationResult}
                            onAutoFix={(errorIndex) => {
                                // TODO: Implementar auto-fix
                                showToast({
                                    type: 'info',
                                    title: 'Auto-fix',
                                    message: 'Funcionalidade de auto-fix em desenvolvimento',
                                });
                            }}
                            onNavigateToStep={(stepId) => {
                                handleSelectStep(stepId);
                                setShowHealthPanel(false);
                            }}
                            onDismissWarning={(warningIndex) => {
                                // TODO: Implementar dismiss de warnings
                                console.log('Dismiss warning:', warningIndex);
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
        </SafeDndContext>
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
