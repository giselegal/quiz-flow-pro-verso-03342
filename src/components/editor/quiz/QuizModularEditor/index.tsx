import React, { Suspense, useEffect } from 'react';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useEditorState } from './hooks/useEditorState';
import { useBlockOperations } from './hooks/useBlockOperations';
import { useDndSystem } from './hooks/useDndSystem';
import { useEditorPersistence } from './hooks/useEditorPersistence';
import type { Block } from '@/services/UnifiedTemplateRegistry';

// Esqueleto do novo editor modular (Fase 1.3)
// Objetivo: ser o ponto de orquestração leve e carregado sob demanda

const StepNavigatorColumn = React.lazy(() => import('./components/StepNavigatorColumn'));
const CanvasColumn = React.lazy(() => import('./components/CanvasColumn'));
const ComponentLibraryColumn = React.lazy(() => import('./components/ComponentLibraryColumn'));

export type QuizModularEditorProps = {
    funnelId?: string;
    initialStepKey?: string;
};

export default function QuizModularEditor(props: QuizModularEditorProps) {
    // Estado compartilhado do editor (step atual, undo/redo, dirty flag)
    const editor = useEditorState(props.initialStepKey);
    const ops = useBlockOperations();
    const dnd = useDndSystem();
    const persistence = useEditorPersistence({
        enableAutoSave: false, // Inicialmente manual
        onSaveSuccess: (stepKey) => console.log(`✅ Step ${stepKey} saved`),
        onSaveError: (stepKey, error) => console.error(`❌ Save failed for ${stepKey}:`, error),
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
                ops.addBlock(editor.state.currentStepKey, { type: draggedItem.libraryType as Block['type'] });
                editor.markDirty(true);
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
            <div className="qm-editor grid grid-cols-4 gap-2 h-full" data-editor="modular-experimental">
                <div className="col-span-4 px-3 py-2 text-xs text-purple-800 bg-purple-50 border border-purple-200 rounded">
                    Editor Modular (experimental) — usando serviços canônicos e carregamento sob demanda
                </div>
                <Suspense fallback={<div>Carregando navegação…</div>}>
                    <div className="col-span-1 border-r">
                        <StepNavigatorColumn
                            initialStepKey={props.initialStepKey}
                            currentStepKey={editor.state.currentStepKey}
                            onSelectStep={editor.setStep}
                        />
                    </div>
                </Suspense>

                <Suspense fallback={<div className="col-span-2 flex items-center justify-center">Carregando canvas…</div>}>
                    <div className="col-span-2">
                        <CanvasColumn
                            currentStepKey={editor.state.currentStepKey}
                            blocks={blocks}
                            onRemoveBlock={(id) => ops.removeBlock(editor.state.currentStepKey, id)}
                            onMoveBlock={(from, to) => ops.reorderBlock(editor.state.currentStepKey, from, to)}
                            onUpdateBlock={(id, patch) => ops.updateBlock(editor.state.currentStepKey, id, patch)}
                        />
                    </div>
                </Suspense>

                <Suspense fallback={<div className="col-span-1 border-l p-2 text-sm">Carregando biblioteca…</div>}>
                    <div className="col-span-1 border-l flex flex-col h-full">
                        <ComponentLibraryColumn
                            currentStepKey={editor.state.currentStepKey}
                            onAddBlock={(type) => ops.addBlock(editor.state.currentStepKey, { type })}
                        />
                        <div className="mt-auto p-2 text-sm border-t space-y-2">
                            <div>Properties Panel (placeholder)</div>
                            {/* TODO: Integrar PropertiesPanel existente quando houver bloco selecionado */}
                            <button
                                className="text-xs px-2 py-1 border rounded"
                                onClick={() => {
                                    const stepKey = editor.state.currentStepKey;
                                    const blocks = ops.getBlocks(stepKey);
                                    if (stepKey && blocks) {
                                        persistence.saveStepBlocks(stepKey, blocks);
                                    }
                                }}
                                disabled={!editor.state.currentStepKey || persistence.getSaveStatus(editor.state.currentStepKey || '').isSaving}
                            >
                                {persistence.getSaveStatus(editor.state.currentStepKey || '').isSaving ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </div>
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
