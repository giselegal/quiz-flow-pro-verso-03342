/**
 * ⏳ TRANSITION STEP 100% MODULARIZADO
 * 
 * Agora usa blocos atômicos do registry (transition-title, transition-image, etc.)
 * - 100% editável via painel de propriedades
 * - Reordenável via drag-and-drop (@dnd-kit)
 * - Persistente via EditorProvider
 * - Mesma fonte de dados em edit/preview
 */

import React, { useMemo } from 'react';
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import { useEditor } from '@/components/editor/EditorProviderUnified';
import { Block } from '@/types/editor';

interface ModularTransitionStepProps {
    data: any;
    onComplete?: () => void;
    onEdit?: (field: string, value: any) => void;
    isEditable?: boolean;
    /** Quando true, permite auto avançar mesmo em modo edição (útil no preview modular) */
    enableAutoAdvance?: boolean;
    selectedBlockId?: string;
    onBlockSelect?: (blockId: string) => void;
    onOpenProperties?: (blockId: string) => void;
    editor?: any;
}

export default function ModularTransitionStep({
    data,
    onComplete,
    isEditable = false,
    enableAutoAdvance = false,
    selectedBlockId,
    onBlockSelect = () => { },
    onOpenProperties = () => { },
    editor: editorProp
}: ModularTransitionStepProps) {
    const editorContext = useEditor({ optional: true });
    const editor = editorProp || editorContext;
    const stepKey = data?.id || 'step-12';

    // Handler para clique em blocos
    const handleBlockClick = React.useCallback((blockId: string) => {
        console.log(`🎯 Bloco clicado: ${blockId}`);

        // 1. Notificar componente pai
        onBlockSelect(blockId);

        // 2. Atualizar estado no editor (se disponível)
        if (editor?.actions?.setSelectedBlockId) {
            editor.actions.setSelectedBlockId(blockId);
        }

        // 3. Abrir painel de propriedades
        onOpenProperties(blockId);
    }, [onBlockSelect, onOpenProperties, editor]);

    // ✅ FASE 1: Buscar blocos diretamente sem disparar carregamento
    const blocks = useMemo(() => {
        return editor?.state?.stepBlocks?.[stepKey] || [];
    }, [editor?.state?.stepBlocks, stepKey]);

    // ✅ FASE 2: Auto-load se blocos estão vazios (CORREÇÃO CRÍTICA)
    React.useEffect(() => {
        if (blocks.length === 0 && editor?.actions?.ensureStepLoaded) {
            console.log(`🔄 [ModularTransitionStep] Auto-loading ${stepKey} (blocks empty)`);
            editor.actions.ensureStepLoaded(stepKey).then(() => {
                console.log(`✅ [ModularTransitionStep] Loaded ${stepKey} successfully`);
            }).catch((err: Error) => {
                console.error(`❌ [ModularTransitionStep] Failed to load ${stepKey}:`, err);
            });
        }
    }, [stepKey, blocks.length, editor?.actions]);

    // ✅ FASE 3: Debug logs apenas em DEV
    React.useEffect(() => {
        if (import.meta.env.DEV) {
            console.log(`🔍 ModularTransitionStep [${stepKey}]:`, {
                blocksCount: blocks.length,
                blockTypes: blocks.map((b: any) => b.type),
                isEditable,
                enableAutoAdvance
            });
        }
    }, [stepKey, blocks.length, isEditable, enableAutoAdvance]);

    // Ordenação dos blocos via metadata
    const [localOrder, setLocalOrder] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (blocks.length > 0) {
            const orderFromMetadata = data?.metadata?.blockOrder;
            if (orderFromMetadata && Array.isArray(orderFromMetadata)) {
                setLocalOrder(orderFromMetadata);
            } else {
                setLocalOrder(blocks.map((b: Block) => b.id));
            }
        }
    }, [blocks, data?.metadata?.blockOrder]);

    // Timer de transição usando delay do template (fallback 3000ms)
    React.useEffect(() => {
        const delay = Number(
            data?.navigation?.autoAdvanceDelay ??
            data?.metadata?.autoAdvanceDelay ??
            3000
        );

        const shouldAutoAdvance = (!!onComplete) && (enableAutoAdvance || !isEditable);
        if (shouldAutoAdvance) {
            const timer = setTimeout(() => {
                onComplete();
            }, isFinite(delay) ? delay : 3000);
            return () => clearTimeout(timer);
        }
    }, [isEditable, enableAutoAdvance, onComplete, data?.navigation?.autoAdvanceDelay, data?.metadata?.autoAdvanceDelay]);

    // Configurar sensores de drag
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 4 }
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = localOrder.indexOf(active.id as string);
        const newIndex = localOrder.indexOf(over.id as string);

        if (oldIndex !== -1 && newIndex !== -1) {
            const newOrder = arrayMove(localOrder, oldIndex, newIndex);
            setLocalOrder(newOrder);

            // Persistir no editor
            if (editor?.actions?.reorderBlocks) {
                editor.actions.reorderBlocks(stepKey, oldIndex, newIndex);
            }
        }
    };

    const orderedBlocks = useMemo(() => {
        if (localOrder.length === 0) return blocks;
        return localOrder
            .map(id => blocks.find((b: Block) => b.id === id))
            .filter(Boolean) as Block[];
    }, [blocks, localOrder]);

    // ✅ Wrapper para tornar blocos individuais arrastáveis E droppable
    const SortableBlock: React.FC<{ id: string; children: React.ReactNode; index: number }> = ({ id, children, index }) => {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({ id });
        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.7 : 1,
        } as React.CSSProperties;

        return (
            <div className="relative">
                {/* 🎯 ZONA DROPPABLE antes do bloco */}
                <div
                    className={`
                        h-8 -my-4 relative
                        transition-all duration-200
                        ${isOver ? 'bg-blue-100 border-2 border-dashed border-blue-400' : 'hover:bg-gray-100'}
                    `}
                    data-drop-zone="before"
                    data-block-index={index}
                >
                    {isOver && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">
                                Solte aqui para inserir antes
                            </span>
                        </div>
                    )}
                </div>

                {/* Bloco arrastável */}
                <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                    {children}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <main className="w-full max-w-6xl mx-auto px-4 py-8">
                <div className="bg-card p-6 md:p-12 rounded-lg shadow-lg text-center max-w-2xl mx-auto">
                    {isEditable && orderedBlocks.length > 0 ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={localOrder}
                                strategy={verticalListSortingStrategy}
                            >
                                {orderedBlocks.map((block: Block, index: number) => (
                                    <SortableBlock key={block.id} id={block.id} index={index}>
                                        <UniversalBlockRenderer
                                            block={block}
                                            mode="editor"
                                            isSelected={selectedBlockId === block.id}
                                            onSelect={() => handleBlockClick(block.id)}
                                            onClick={() => handleBlockClick(block.id)}
                                        />
                                    </SortableBlock>
                                ))}

                                {/* 🎯 ZONA DROPPABLE ao final */}
                                <div
                                    className="h-12 mt-2 border-2 border-dashed border-gray-300 rounded-lg
                                              hover:border-gray-400 hover:bg-gray-50 transition-all
                                              flex items-center justify-center text-xs text-gray-500"
                                    data-drop-zone="after"
                                    data-block-index={orderedBlocks.length}
                                >
                                    <span>+ Solte componente aqui para adicionar ao final</span>
                                </div>
                            </SortableContext>
                        </DndContext>
                    ) : (
                        <>
                            {orderedBlocks.map((block: Block) => (
                                <UniversalBlockRenderer
                                    key={block.id}
                                    block={block}
                                    mode="preview"
                                />
                            ))}
                        </>
                    )}

                    {orderedBlocks.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground mb-4">
                                Nenhum bloco configurado para este step.
                            </p>
                            {isEditable && (
                                <p className="text-sm text-primary">
                                    Adicione blocos usando o template JSON ou via editor.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
