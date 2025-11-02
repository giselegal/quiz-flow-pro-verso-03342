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

import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useEditorState } from './hooks/useEditorState';
import { useBlockOperations } from './hooks/useBlockOperations';
import { useDndSystem } from './hooks/useDndSystem';
import { useEditorPersistence } from './hooks/useEditorPersistence';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import type { Block } from '@/services/UnifiedTemplateRegistry';
import { Button } from '@/components/ui/button';
import { Eye, Edit3, Play, Save, GripVertical } from 'lucide-react';

// Lazy loading de componentes pesados
const StepNavigatorColumn = React.lazy(() => import('./components/StepNavigatorColumn'));
const CanvasColumn = React.lazy(() => import('./components/CanvasColumn'));
const ComponentLibraryColumn = React.lazy(() => import('./components/ComponentLibraryColumn'));
const PropertiesColumn = React.lazy(() => import('./components/PropertiesColumn'));
const PreviewPanel = React.lazy(() => import('./components/PreviewPanel'));

export type QuizModularEditorProps = {
    funnelId?: string;
    initialStepKey?: string;
};

export default function QuizModularEditor(props: QuizModularEditorProps) {
    // Estado compartilhado do editor
    const editor = useEditorState(props.initialStepKey);
    const ops = useBlockOperations();
    const dnd = useDndSystem();
    const { enableAutoSave } = useFeatureFlags();

    // Estados do editor
    const [canvasMode, setCanvasMode] = useState<'edit' | 'preview'>('edit');
    const [previewMode, setPreviewMode] = useState<'live' | 'production'>('live');

    // Persistência
    const persistence = useEditorPersistence({
        enableAutoSave,
        autoSaveInterval: 2000,
        onSaveSuccess: (stepKey) => {
            console.log(`✅ Auto-save completed for step: ${stepKey}`);
            editor.markDirty(false);
        },
        onSaveError: (stepKey, error) => console.error(`❌ Auto-save failed for ${stepKey}:`, error),
        getDirtyBlocks: () => {
            const stepKey = editor.state.currentStepKey;
            if (!stepKey || !editor.state.isDirty) return null;

            const blocks = ops.getBlocks(stepKey);
            return blocks ? { stepKey, blocks } : null;
        },
    });

    // Configuração DnD
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    // Carregar blocos iniciais
    useEffect(() => {
        ops.ensureLoaded(editor.state.currentStepKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor.state.currentStepKey]);

    const blocks: Block[] | null = ops.getBlocks(editor.state.currentStepKey);

    // Handler de DnD consolidado
    const handleDragEnd = useCallback((event: any) => {
        const result = dnd.handlers.onDragEnd(event);
        if (!result) return;

        const { draggedItem, dropzone } = result;

        if (draggedItem?.type === 'library-item' && dropzone === 'canvas') {
            if (draggedItem.libraryType) {
                const addResult = ops.addBlock(editor.state.currentStepKey, {
                    type: draggedItem.libraryType as Block['type']
                });
                if (addResult.success) {
                    editor.markDirty(true);
                }
            }
        } else if (draggedItem?.type === 'block' && dropzone === 'canvas') {
            console.log('Reorder blocks:', result);
        }
    }, [dnd.handlers, ops, editor]);

    // Handler de save manual
    const handleSave = useCallback(() => {
        const stepKey = editor.state.currentStepKey;
        const blocks = ops.getBlocks(stepKey);
        if (stepKey && blocks) {
            persistence.saveStepBlocks(stepKey, blocks);
        }
    }, [editor.state.currentStepKey, ops, persistence]);

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
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-semibold text-gray-800">Editor Modular</h1>
                        {editor.state.currentStepKey && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                                {editor.state.currentStepKey}
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

                        {/* Status do Auto-save */}
                        {enableAutoSave && (
                            <div className="text-xs text-gray-500">
                                {persistence.hasAutoSavePending
                                    ? '🔄 Salvando...'
                                    : editor.state.isDirty
                                        ? '📝 Não salvo'
                                        : '✅ Salvo'
                                }
                            </div>
                        )}

                        {/* Botão Save Manual */}
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={!editor.state.currentStepKey || persistence.getSaveStatus(editor.state.currentStepKey || '').isSaving}
                            className="h-7"
                        >
                            <Save className="w-3 h-3 mr-1" />
                            {persistence.getSaveStatus(editor.state.currentStepKey || '').isSaving
                                ? 'Salvando...'
                                : 'Salvar'
                            }
                        </Button>
                    </div>
                </div>

                {/* Grid de 4 colunas REDIMENSIONÁVEIS */}
                <PanelGroup direction="horizontal" className="flex-1">
                    {/* Coluna 1: Navegação de Etapas */}
                    <Panel defaultSize={15} minSize={10} maxSize={25}>
                        <Suspense fallback={<div className="p-4 text-sm text-gray-500">Carregando navegação…</div>}>
                            <div className="h-full border-r bg-white overflow-y-auto">
                                <StepNavigatorColumn
                                    initialStepKey={props.initialStepKey}
                                    currentStepKey={editor.state.currentStepKey}
                                    onSelectStep={editor.setStep}
                                />
                            </div>
                        </Suspense>
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
                                    currentStepKey={editor.state.currentStepKey}
                                    onAddBlock={(type) => {
                                        const addResult = ops.addBlock(editor.state.currentStepKey, { type });
                                        if (addResult.success) {
                                            editor.markDirty(true);
                                        }
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

                    {/* Coluna 3: Canvas */}
                    <Panel defaultSize={40} minSize={30}>
                        <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-500">Carregando canvas…</div>}>
                            <div className="h-full bg-gray-50 overflow-y-auto">
                                {canvasMode === 'edit' ? (
                                    <CanvasColumn
                                        currentStepKey={editor.state.currentStepKey}
                                        blocks={blocks}
                                        selectedBlockId={editor.state.selectedBlockId}
                                        onRemoveBlock={(id) => {
                                            ops.removeBlock(editor.state.currentStepKey, id);
                                            editor.markDirty(true);
                                        }}
                                        onMoveBlock={(from, to) => {
                                            ops.reorderBlock(editor.state.currentStepKey, from, to);
                                            editor.markDirty(true);
                                        }}
                                        onUpdateBlock={(id, patch) => {
                                            const updateResult = ops.updateBlock(editor.state.currentStepKey, id, patch);
                                            if (updateResult.success) {
                                                editor.markDirty(true);
                                            }
                                        }}
                                        onBlockSelect={editor.selectBlock}
                                    />
                                ) : (
                                    <PreviewPanel
                                        currentStepKey={editor.state.currentStepKey}
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
                                    selectedBlock={blocks?.find(b => b.id === editor.state.selectedBlockId) || null}
                                    onBlockUpdate={(blockId, updates) => {
                                        const updateResult = ops.updateBlock(editor.state.currentStepKey, blockId, updates);
                                        if (updateResult.success) {
                                            editor.markDirty(true);
                                        }
                                    }}
                                    onClearSelection={editor.clearSelection}
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
        </DndContext>
    );
}
