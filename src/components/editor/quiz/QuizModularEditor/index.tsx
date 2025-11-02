import React, { Suspense, useEffect } from 'react';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useEditorState } from './hooks/useEditorState';
import { useBlockOperations } from './hooks/useBlockOperations';
import { useDndSystem } from './hooks/useDndSystem';
import { useEditorPersistence } from './hooks/useEditorPersistence';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import type { Block } from '@/services/UnifiedTemplateRegistry';

// Esqueleto do novo editor modular (Fase 1.3)
// Objetivo: ser o ponto de orquestração leve e carregado sob demanda

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
    // Estado compartilhado do editor (step atual, undo/redo, dirty flag)
    const editor = useEditorState(props.initialStepKey);
    const ops = useBlockOperations();
    const dnd = useDndSystem();
    const { enableAutoSave } = useFeatureFlags();

    // Estado do preview
    const [showPreview, setShowPreview] = React.useState(true);

    const persistence = useEditorPersistence({
        enableAutoSave,
        autoSaveInterval: 2000, // 2s para teste mais responsivo
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

    // Garantir carregamento inicial dos blocos locais quando step mudar
    useEffect(() => {
        ops.ensureLoaded(editor.state.currentStepKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor.state.currentStepKey]);

    const blocks: Block[] | null = ops.getBlocks(editor.state.currentStepKey);

    // Handler de DnD consolidado
    const handleDragEnd = (event: any) => {
        const result = dnd.handlers.onDragEnd(event);
        if (!result) return;

        const { draggedItem, dropzone } = result;

        if (draggedItem?.type === 'library-item' && dropzone === 'canvas') {
            // Adicionar novo bloco da biblioteca
            if (draggedItem.libraryType) {
                const addResult = ops.addBlock(editor.state.currentStepKey, { type: draggedItem.libraryType as Block['type'] });
                if (addResult.success) {
                    editor.markDirty(true);
                }
                // Erros já são mostrados via toast pelo useBlockOperations
            }
        } else if (draggedItem?.type === 'block' && dropzone === 'canvas') {
            // Reordenação dentro do canvas (implementar depois)
            console.log('Reorder blocks:', result);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={dnd.handlers.onDragStart}
            onDragOver={dnd.handlers.onDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={dnd.handlers.onDragCancel}
        >
            <div className="qm-editor flex flex-col h-full" data-editor="modular-experimental">
                {/* Header com info */}
                <div className="px-3 py-2 text-xs text-purple-800 bg-purple-50 border-b border-purple-200">
                    Editor Modular (experimental) — usando serviços canônicos e carregamento sob demanda
                </div>

                {/* Grid principal: Navegação | Canvas | Biblioteca + Propriedades */}
                <div className="grid grid-cols-4 gap-2 flex-1 overflow-hidden">
                    <Suspense fallback={<div>Carregando navegação…</div>}>
                        <div className="col-span-1 border-r overflow-y-auto">
                            <StepNavigatorColumn
                                initialStepKey={props.initialStepKey}
                                currentStepKey={editor.state.currentStepKey}
                                onSelectStep={editor.setStep}
                            />
                        </div>
                    </Suspense>

                    <Suspense fallback={<div className="col-span-2 flex items-center justify-center">Carregando canvas…</div>}>
                        <div className="col-span-2 overflow-y-auto">
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
                                    // Erros já são mostrados via toast pelo useBlockOperations
                                }}
                                onBlockSelect={editor.selectBlock}
                            />
                        </div>
                    </Suspense>

                    <Suspense fallback={<div className="col-span-1 border-l p-2 text-sm">Carregando biblioteca…</div>}>
                        <div className="col-span-1 border-l flex flex-col h-full overflow-hidden">
                            <div className="flex-1 overflow-y-auto">
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
                            <div className="mt-auto p-2 text-sm border-t space-y-2">
                                {/* Status do Auto-save */}
                                {enableAutoSave && (
                                    <div className="text-xs text-muted-foreground text-center">
                                        {persistence.hasAutoSavePending
                                            ? '🔄 Auto-save pendente...'
                                            : editor.state.isDirty
                                                ? '📝 Alterações detectadas'
                                                : '✅ Salvo automaticamente'
                                        }
                                    </div>
                                )}

                                <button
                                    className="text-xs px-2 py-1 border rounded w-full"
                                    onClick={() => {
                                        const stepKey = editor.state.currentStepKey;
                                        const blocks = ops.getBlocks(stepKey);
                                        if (stepKey && blocks) {
                                            persistence.saveStepBlocks(stepKey, blocks);
                                        }
                                    }}
                                    disabled={!editor.state.currentStepKey || persistence.getSaveStatus(editor.state.currentStepKey || '').isSaving}
                                >
                                    {persistence.getSaveStatus(editor.state.currentStepKey || '').isSaving
                                        ? 'Salvando...'
                                        : enableAutoSave
                                            ? 'Salvar Agora'
                                            : 'Salvar'
                                    }
                                </button>

                                <button
                                    className="text-xs px-2 py-1 border rounded w-full"
                                    onClick={() => setShowPreview(!showPreview)}
                                >
                                    {showPreview ? 'Ocultar' : 'Mostrar'} Preview
                                </button>
                            </div>
                        </div>
                    </Suspense>
                </div>

                {/* Preview Panel (colapsável) */}
                <Suspense fallback={<div className="border-t p-2 text-xs">Carregando preview…</div>}>
                    <PreviewPanel
                        currentStepKey={editor.state.currentStepKey}
                        blocks={blocks}
                        isVisible={showPreview}
                        onToggleVisibility={() => setShowPreview(!showPreview)}
                        className="h-[400px]"
                    />
                </Suspense>
            </div>

            {/* DragOverlay para feedback visual durante drag */}
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
