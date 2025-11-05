/**
 * 🎯 QUIZ MODULAR EDITOR - Versão Aprimorada
 * 
 * Layout profissional com 4 colunas REDIMENSIONÁVEIS:
 * - Coluna 1: Navegação de Etapas
 * - Coluna 2: Biblioteca de Componentes
 * - Coluna 3: Canvas Visual (edição + preview)
 * - Coluna 4: Painel de Propriedades
 * 
 * Recursos:
 * - ✅ Colunas com largura ajustável
 * - ✅ Barras de rolagem vertical em cada coluna
 * - ✅ Drag & Drop entre colunas
 * - ✅ Modo edição + Modo preview
 * - ✅ Preview em tempo real (live/production)
 * - ✅ Validação Zod obrigatória
 * - ✅ Auto-save inteligente
 */

// Polyfills de teste (precisam ser carregados antes de libs que usam matchMedia)
import '@/test/polyfills/matchMedia';

import React, { Suspense, useEffect, useState, useCallback, useMemo } from 'react';
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

// Import estático de StepNavigatorColumn para evitar problemas de renderização em testes
import StepNavigatorColumn from './components/StepNavigatorColumn';

// Lazy loading de componentes pesados (exceto navegação)
const CanvasColumn = React.lazy(() => import('./components/CanvasColumn'));
const ComponentLibraryColumn = React.lazy(() => import('./components/ComponentLibraryColumn'));
const PropertiesColumn = React.lazy(() => import('./components/PropertiesColumn'));
const PreviewPanel = React.lazy(() => import('./components/PreviewPanel'));

// ✅ FASE 2.3: Error Boundary para steps
import { StepErrorBoundary } from '../StepErrorBoundary';

// ✅ FASE 3.3: Metrics Panel (dev only) - com error boundary
let MetricsPanel: React.LazyExoticComponent<React.ComponentType<any>> | null = null;

if (import.meta.env.DEV) {
    try {
        MetricsPanel = React.lazy(() => import('./components/MetricsPanel').catch(() => ({
            default: () => null // Fallback silencioso se falhar
        })));
    } catch (e) {
        console.warn('MetricsPanel failed to load:', e);
    }
}

export type QuizModularEditorProps = {
    funnelId?: string;
    initialStepKey?: string;
    templateId?: string; // ID do template JSON externo (opcional)
};

export default function QuizModularEditor(props: QuizModularEditorProps) {
    // ✅ FASE 1: Usar SuperUnifiedProvider
    const unified = useSuperUnified();
    const dnd = useDndSystem();
    const { enableAutoSave } = useFeatureFlags();

    // Mapear estado do SuperUnified para interface local
    // ✅ PROTEÇÃO: Garantir que currentStep seja sempre válido (>= 1)
    const safeCurrentStep = Math.max(1, unified.state.editor.currentStep || 1);
    const currentStepKey = `step-${String(safeCurrentStep).padStart(2, '0')}`;
    const selectedBlockId = unified.state.editor.selectedBlockId;
    const isDirty = unified.state.editor.isDirty;

    // Estados do editor
    const [canvasMode, setCanvasMode] = useState<'edit' | 'preview'>('edit');
    const [previewMode, setPreviewMode] = useState<'live' | 'production'>('live');
    const [loadedTemplate, setLoadedTemplate] = useState<{ name: string; steps: any[] } | null>(null);
    const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
    const [templateLoadError, setTemplateLoadError] = useState(false);

    // Polyfill mínimo para window.matchMedia em ambientes de teste (happy-dom/jsdom)
    useEffect(() => {
        if (typeof window !== 'undefined' && !(window as any).matchMedia) {
            (window as any).matchMedia = (query: string) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: () => { },
                removeListener: () => { },
                addEventListener: () => { },
                removeEventListener: () => { },
                dispatchEvent: () => false,
            });
        }
    }, []);

    // Persistência de layout dos painéis (larguras)
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
        } catch {
            // noop
        }
    }, []);

    // 🎯 FASE 4: Navegação dinâmica baseada no template carregado
    const stepsVersion = useMemo(() => {
        const keys = Object.keys(unified.state.editor.stepBlocks || {});
        return keys.sort((a, b) => Number(a) - Number(b)).join('|');
    }, [unified.state.editor.stepBlocks]);

    const navSteps = useMemo(() => {
        // Sempre que possível, usar fonte canônica de steps
        const res = templateService.steps.list();
        if (res.success && res.data && res.data.length > 0) {
            return res.data.map((s) => ({
                key: s.id,
                title: `${String(s.order).padStart(2, '0')} - ${s.name}`,
            }));
        }

        // Fallback: derivar de stepBlocks quando ainda não há steps canônicos
        const indexes = Object.keys(unified.state.editor.stepBlocks || {})
            .map((k) => Number(k))
            .filter((n) => Number.isFinite(n) && n >= 1)
            .sort((a, b) => a - b);
        return indexes.map((i) => ({
            key: `step-${String(i).padStart(2, '0')}`,
            title: `${String(i).padStart(2, '0')} - Etapa ${i}`,
        }));
    }, [loadedTemplate, props.templateId, stepsVersion, unified.state.editor.stepBlocks]);

    // ✅ NOVO: Garantir que currentStep seja inicializado em modo livre
    useEffect(() => {
        // Se não tem template e currentStep não está definido ou é inválido, inicializar com 1
        if (!props.templateId && !loadedTemplate && (!unified.state.editor.currentStep || unified.state.editor.currentStep < 1)) {
            appLogger.info('🎨 [QuizModularEditor] Modo livre - inicializando currentStep = 1');
            unified.setCurrentStep(1);
        }

        // Além disso, garantir que exista ao menos uma etapa canônica em modo livre e habilitar navegação padrão (21 etapas)
        if (!props.templateId && !loadedTemplate) {
            try { templateService.setActiveTemplate('free-mode', 21); } catch { /* noop */ }
            const res = templateService.steps.list();
            const hasAny = res.success && res.data && res.data.length > 0;
            if (!hasAny) {
                const firstId = `step-custom-${String(1).padStart(2, '0')}`;
                templateService.steps.add({
                    id: firstId,
                    name: 'Etapa 1 - Criação Livre',
                    order: 1,
                    type: 'custom',
                    description: 'Crie seu funil a partir daqui',
                    blocksCount: 0,
                    hasTemplate: false,
                }).then(() => {
                    appLogger.info('✅ [QuizModularEditor] Etapa inicial criada para Modo Livre');
                }).catch((err) => {
                    appLogger.error('⚠️ [QuizModularEditor] Falha ao criar etapa inicial (Modo Livre):', err);
                });
            }
        }
    }, [props.templateId, loadedTemplate, unified]);

    // ✅ FASE 1: Auto-save direto do SuperUnified
    useEffect(() => {
        if (!enableAutoSave || !isDirty) return;

        const delayMs = Number((import.meta as any).env?.VITE_AUTO_SAVE_DELAY_MS ?? 2000);
        const timer = setTimeout(async () => {
            try {
                await unified.saveFunnel();
                console.log(`✅ Auto-save: ${currentStepKey}`);
            } catch (error) {
                console.error(`❌ Auto-save failed:`, error);
            }
        }, isNaN(delayMs) ? 2000 : delayMs);

        return () => clearTimeout(timer);
    }, [enableAutoSave, isDirty, currentStepKey, unified]);

    // Configuração DnD
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    // Helper para normalizar a ordem dos blocos
    const normalizeOrder = useCallback((list: Block[]) => list.map((b, idx) => ({ ...b, order: idx })), []);


    // ✅ FASE 2: Batch loading otimizado com preload inteligente
    useEffect(() => {
        if (!props.templateId) {
            appLogger.info('🎨 [QuizModularEditor] Modo canvas vazio - sem template');
            return;
        }

        // Pré-configura template ativo com fallback de 21 etapas para habilitar navegação imediata nos testes/SSR
        try {
            templateService.setActiveTemplate(props.templateId, 21);
        } catch { /* noop */ }

        async function loadTemplateOptimized() {
            setIsLoadingTemplate(true);
            setTemplateLoadError(false);
            try {
                const tid = props.templateId!;
                appLogger.info(`🔍 [QuizModularEditor] Batch loading: ${tid}`);
                // Tentar preload, mas prosseguir mesmo em caso de falha
                try {
                    await templateService.preloadTemplate(tid);
                } catch (e) {
                    appLogger.warn('[QuizModularEditor] preloadTemplate falhou, prosseguindo com fallback');
                }

                // Tentar obter steps do service; fallback para 21 etapas padrão
                let templateStepsResult = templateService.steps.list();
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

                const stepIds = stepsMeta.map((s: any) => s.id);

                // ✅ FASE 1: Batch loading usando SuperUnified
                await Promise.all(
                    stepIds.map(async (stepId: string, idx: number) => {
                        const result = await templateService.getStep(stepId, tid);
                        if (result.success && result.data) {
                            unified.setStepBlocks(idx + 1, result.data);
                        }
                    })
                );

                // ✅ Atualizar state com número correto de steps para forçar recalcular navSteps
                setLoadedTemplate({
                    name: `Template: ${tid}`,
                    steps: stepsMeta
                });

                appLogger.info(`✅ [QuizModularEditor] Template carregado: ${stepIds.length} steps`);
            } catch (error) {
                appLogger.error('[QuizModularEditor] Erro ao carregar template:', error);
                setTemplateLoadError(true);
            } finally {
                setIsLoadingTemplate(false);
            }
        }

        loadTemplateOptimized();
    }, [props.templateId, unified]);

    // ✅ FASE 1: Obter blocos do SuperUnified (usar safeCurrentStep)
    const blocks: Block[] | null = unified.getStepBlocks(safeCurrentStep);

    // Handler de DnD consolidado
    const handleDragEnd = useCallback((event: any) => {
        const result = dnd.handlers.onDragEnd(event);
        if (!result) return;

        const { draggedItem, overId, activeId } = result as { draggedItem: any; overId: any; activeId: any };
        const stepIndex = safeCurrentStep;
        const list = blocks || [];

        // 1) Inserção de item da biblioteca no canvas
        if (draggedItem?.type === 'library-item') {
            if (!draggedItem.libraryType) return;

            const newBlock = {
                id: `block-${Date.now()}`,
                type: draggedItem.libraryType,
                properties: {},
                content: {},
                order: list.length,
            };

            unified.addBlock(stepIndex, newBlock);
            return;
        }

        // 2) Reordenação entre blocos do canvas
        if (draggedItem?.type === 'block' && activeId && overId && activeId !== overId) {
            const fromIndex = list.findIndex(b => String(b.id) === String(activeId));
            const toIndex = list.findIndex(b => String(b.id) === String(overId));
            if (fromIndex >= 0 && toIndex >= 0) {
                const reordered = [...list];
                const [moved] = reordered.splice(fromIndex, 1);
                reordered.splice(toIndex, 0, moved);
                unified.reorderBlocks(stepIndex, reordered);
            }
        }
    }, [dnd.handlers, blocks, unified]);

    // ✅ FASE 1: Save manual usando SuperUnified
    const handleSave = useCallback(async () => {
        try {
            // Em modo livre, definir um template ativo gerado se ainda não houver
            if (!props.templateId) {
                const nowId = `custom-${Date.now()}`;
                const stepsList = templateService.steps.list();
                const total = stepsList.success ? stepsList.data.length : 1;
                try { templateService.setActiveTemplate(nowId, total || 1); } catch { /* noop */ }
            }

            await unified.saveFunnel();
            unified.showToast({
                type: 'success',
                title: 'Salvo!',
                message: 'Funil salvo com sucesso',
            });
        } catch (error) {
            unified.showToast({
                type: 'error',
                title: 'Erro',
                message: 'Erro ao salvar funil',
            });
        }
    }, [unified, props.templateId]);

    // ✅ FASE 1: Handler de reload usando SuperUnified
    const handleReloadStep = useCallback(async () => {
        const stepIndex = safeCurrentStep;
        if (!stepIndex) return;

        appLogger.info(`🔄 [QuizModularEditor] Recarregando step após erro: step-${stepIndex}`);

        try {
            const stepKey = `step-${String(stepIndex).padStart(2, '0')}`;

            // Invalidar cache do step
            templateService.invalidateTemplate(stepKey);

            // Recarregar
            const result = await templateService.getStep(stepKey, props.templateId);
            if (result.success && result.data) {
                unified.setStepBlocks(stepIndex, result.data);
                appLogger.info(`✅ [QuizModularEditor] Step recarregado: ${result.data.length} blocos`);
            }
        } catch (error) {
            appLogger.error('[QuizModularEditor] Erro ao recarregar step:', error);
        }
    }, [unified, props.templateId]);

    // Exportar JSON do estado atual
    const handleExportJSON = useCallback(() => {
        try {
            const data = {
                meta: {
                    exportedAt: new Date().toISOString(),
                    currentStep: safeCurrentStep,
                    template: props.templateId || loadedTemplate?.name || null,
                },
                stepBlocks: unified.state.editor.stepBlocks,
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
    }, [unified.state.editor.stepBlocks, safeCurrentStep, props.templateId, loadedTemplate]);

    // ✅ NOVO: Handler para carregar template quando usuário clicar no botão
    const handleLoadTemplate = useCallback(async () => {
        setIsLoadingTemplate(true);
        setTemplateLoadError(false);
        try {
            const tid = props.templateId ?? 'quiz21StepsComplete';
            appLogger.info(`🔍 [QuizModularEditor] Carregando template via botão: ${tid}`);
            await templateService.preloadTemplate(tid);

            // ✅ Buscar steps dinamicamente do template
            const templateStepsResult = templateService.steps.list();
            if (!templateStepsResult.success) {
                throw new Error('Falha ao carregar lista de steps do template');
            }
            const stepIds = templateStepsResult.data.map((s: any) => s.id);

            appLogger.info(`📋 [QuizModularEditor] Carregando ${stepIds.length} steps do template`);

            await Promise.all(
                stepIds.map(async (stepId: string, idx: number) => {
                    const result = await templateService.getStep(stepId, tid);
                    if (result.success && result.data) {
                        unified.setStepBlocks(idx + 1, result.data);
                    }
                })
            );

            // ✅ Atualizar state com número correto de steps
            setLoadedTemplate({
                name: `Template: ${tid}`,
                steps: templateStepsResult.data
            });
            appLogger.info(`✅ [QuizModularEditor] Template carregado: ${stepIds.length} steps`);

            // Atualizar URL
            const url = new URL(window.location.href);
            url.searchParams.set('template', tid);
            window.history.pushState({}, '', url);

        } catch (error) {
            appLogger.error('[QuizModularEditor] Erro ao carregar template:', error);
            setTemplateLoadError(true);
        } finally {
            setIsLoadingTemplate(false);
        }
    }, [unified]);

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
                {/* Header com controles */}
                <div className="flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm">
                    {/* ✅ FASE 5: Feedback visual melhorado */}
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
                        {/* Toggle Modo Canvas */}
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

                        {/* Toggle Modo Preview (quando canvas = preview) */}
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

                        {/* ✅ FASE 1: Status do Auto-save com SuperUnified */}
                        {enableAutoSave && (
                            <div className="text-xs flex items-center gap-2 animate-fade-in">
                                {unified.state.ui.isLoading ? (
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

                        {/* Botões de ação */}
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={unified.state.ui.isLoading}
                            className="h-7"
                        >
                            <Save className="w-3 h-3 mr-1" />
                            {unified.state.ui.isLoading ? 'Salvando...' : 'Salvar'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleExportJSON} className="h-7">
                            <Download className="w-3 h-3 mr-1" />
                            Exportar JSON
                        </Button>
                    </div>
                </div>

                {/* Grid de 4 colunas REDIMENSIONÁVEIS */}
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
                    {/* Coluna 1: Navegação de Etapas */}
                    <Panel defaultSize={15} minSize={10} maxSize={25}>
                        <div className="h-full border-r bg-white overflow-y-auto">
                            <StepNavigatorColumn
                                currentStepKey={currentStepKey}
                                onSelectStep={(key: string) => {
                                    // Mapear o ID selecionado para um índice (1-based) com base na lista canônica
                                    const res = templateService.steps.list();
                                    if (res.success && res.data && res.data.length > 0) {
                                        const index = res.data.findIndex((s) => s.id === key);
                                        unified.setCurrentStep(index >= 0 ? index + 1 : 1);
                                        return;
                                    }
                                    // Fallback: tentar extrair número do padrão step-XX
                                    const match = key.match(/step-(\d{1,2})/i);
                                    const num = match ? parseInt(match[1], 10) : 1;
                                    unified.setCurrentStep(num);
                                }}
                            />
                        </div>
                    </Panel>

                    {/* Divisor 1 */}
                    <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-blue-400 transition-colors relative group">
                        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 group-hover:w-1.5 bg-gray-300 group-hover:bg-blue-500 transition-all" />
                        <GripVertical className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </PanelResizeHandle>

                    {/* Coluna 2: Biblioteca de Componentes */}
                    <Panel defaultSize={20} minSize={15} maxSize={30}>
                        <Suspense fallback={<div className="p-4 text-sm text-gray-500">Carregando biblioteca…</div>}>
                            <div className="h-full border-r bg-white overflow-y-auto">
                                <ComponentLibraryColumn
                                    currentStepKey={currentStepKey}
                                    onAddBlock={(type) => {
                                        const stepIndex = safeCurrentStep;
                                        unified.addBlock(stepIndex, {
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

                    {/* Divisor 2 */}
                    <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-blue-400 transition-colors relative group">
                        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 group-hover:w-1.5 bg-gray-300 group-hover:bg-blue-500 transition-all" />
                        <GripVertical className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </PanelResizeHandle>

                    {/* Coluna 3: Canvas com Error Boundary */}
                    <Panel defaultSize={40} minSize={30}>
                        <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-500">Carregando canvas…</div>}>
                            <div className="h-full bg-gray-50 overflow-y-auto">
                                {isLoadingTemplate ? (
                                    <div className="h-full flex items-center justify-center">
                                        <div className="text-sm text-gray-500 animate-pulse">Carregando etapas do template…</div>
                                    </div>
                                ) : canvasMode === 'edit' ? (
                                    <StepErrorBoundary
                                        stepId={currentStepKey || 'unknown'}
                                        onReset={handleReloadStep}
                                    >
                                        <CanvasColumn
                                            currentStepKey={currentStepKey}
                                            blocks={blocks}
                                            selectedBlockId={selectedBlockId}
                                            onRemoveBlock={(id) => {
                                                const stepIndex = safeCurrentStep;
                                                unified.removeBlock(stepIndex, id);
                                            }}
                                            onMoveBlock={(from, to) => {
                                                const stepIndex = safeCurrentStep;
                                                const list = blocks || [];
                                                const reordered = [...list];
                                                const [moved] = reordered.splice(from, 1);
                                                reordered.splice(to, 0, moved);
                                                unified.reorderBlocks(stepIndex, normalizeOrder(reordered));
                                            }}
                                            onUpdateBlock={(id, patch) => {
                                                const stepIndex = safeCurrentStep;
                                                unified.updateBlock(stepIndex, id, patch);
                                            }}
                                            onBlockSelect={unified.setSelectedBlock}
                                            hasTemplate={Boolean(loadedTemplate || props.templateId)}
                                            onLoadTemplate={handleLoadTemplate}
                                        />
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

                    {/* Divisor 3 */}
                    <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-blue-400 transition-colors relative group">
                        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 group-hover:w-1.5 bg-gray-300 group-hover:bg-blue-500 transition-all" />
                        <GripVertical className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </PanelResizeHandle>

                    {/* Coluna 4: Painel de Propriedades */}
                    <Panel defaultSize={25} minSize={20} maxSize={35}>
                        <Suspense fallback={<div className="p-4 text-sm text-gray-500">Carregando propriedades…</div>}>
                            <div className="h-full border-l bg-white overflow-y-auto">
                                <PropertiesColumn
                                    selectedBlock={blocks?.find(b => b.id === selectedBlockId) ?? null}
                                    onBlockUpdate={(blockId: string, updates: Partial<Block>) => {
                                        const stepIndex = safeCurrentStep;
                                        unified.updateBlock(stepIndex, blockId, updates);
                                    }}
                                    onClearSelection={() => {
                                        unified.setSelectedBlock(null);
                                    }}
                                />
                            </div>
                        </Suspense>
                    </Panel>
                </PanelGroup>
            </div>

            {/* DragOverlay para feedback visual */}
            <DragOverlay>
                {dnd.activeId ? (
                    <div className="px-3 py-2 text-xs rounded-md border bg-white shadow-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        {dnd.draggedItem?.type === 'library-item' ? `+ ${dnd.draggedItem.libraryType}` : 'Bloco'}
                    </div>
                ) : null}
            </DragOverlay>

            {/* ✅ FASE 3.3: Metrics Panel (dev mode only) */}
            {import.meta.env.DEV && MetricsPanel && (
                <Suspense fallback={null}>
                    <MetricsPanel />
                </Suspense>
            )}
        </DndContext>
    );
}
