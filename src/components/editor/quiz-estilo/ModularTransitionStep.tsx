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
import { appLogger } from '@/utils/logger';
import { DndContext, closestCenter, PointerSensor, useSensors, useSensor, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import { useEditor } from '@/components/editor/EditorProviderUnified';
import { Block } from '@/types/editor';

interface ModularTransitionStepProps {
    data: any;
    blocks?: Block[]; // ✅ Novo: permitir injeção direta de blocos (preview/produção)
    onComplete?: () => void;
    onEdit?: (field: string, value: any) => void;
    isEditable?: boolean;
    /** Quando true, permite auto avançar mesmo em modo edição (útil no preview modular) */
    enableAutoAdvance?: boolean;
    selectedBlockId?: string;
    onBlockSelect?: (blockId: string) => void;
    onOpenProperties?: (blockId: string) => void;
    editor?: any;
    onBlocksReorder?: (stepId: string, newOrder: string[]) => void;
}

export default function ModularTransitionStep({
    data,
    blocks: blocksProp,
    onComplete,
    isEditable = false,
    enableAutoAdvance = false,
    selectedBlockId,
    onBlockSelect = () => { },
    onOpenProperties = () => { },
    editor: editorProp,
    onBlocksReorder,
}: ModularTransitionStepProps) {
    const editorContext = useEditor({ optional: true });
    const editor = editorProp || editorContext;
    const stepKey = data?.id || 'step-12';

    // Handler para clique em blocos
    const handleBlockClick = React.useCallback((blockId: string) => {
        appLogger.debug(`🎯 Bloco clicado: ${blockId}`);

        // 1. Notificar componente pai
        onBlockSelect(blockId);

        // 2. Atualizar estado no editor (se disponível)
        if (editor?.actions?.setSelectedBlockId) {
            editor.actions.setSelectedBlockId(blockId);
        }

        // 3. Abrir painel de propriedades
        onOpenProperties(blockId);
    }, [onBlockSelect, onOpenProperties, editor]);

    // ✅ FASE 1: Preferir blocos passados por props (preview/produção sem provider)
    const blocks = useMemo(() => {
        if (Array.isArray(blocksProp) && blocksProp.length > 0) {
            return blocksProp;
        }
        return editor?.state?.stepBlocks?.[stepKey] || [];
    }, [blocksProp, editor?.state?.stepBlocks, stepKey]);

    // ✅ FASE 2: Auto-load se blocos estão vazios (com guarda para evitar loops)
    const autoloadRequestedRef = React.useRef(false);
    React.useEffect(() => {
        const noBlocksInProps = !(Array.isArray(blocksProp) && blocksProp.length > 0);
        const noBlocksInState = blocks.length === 0;
        if (!autoloadRequestedRef.current && noBlocksInProps && noBlocksInState && editor?.actions?.ensureStepLoaded) {
            autoloadRequestedRef.current = true;
            appLogger.debug(`🔄 [ModularTransitionStep] Auto-loading ${stepKey} (blocks empty)`);
            editor.actions.ensureStepLoaded(stepKey).then(() => {
                appLogger.debug(`✅ [ModularTransitionStep] Loaded ${stepKey} successfully`);
            }).catch((err: Error) => {
                appLogger.error(`❌ [ModularTransitionStep] Failed to load ${stepKey}:`, err);
            });
        }
    }, [stepKey, blocksProp, blocks.length, editor?.actions?.ensureStepLoaded]);

    // ✅ FASE 3: Debug logs apenas em DEV
    React.useEffect(() => {
        if (import.meta.env.DEV) {
            appLogger.debug(`🔍 ModularTransitionStep [${stepKey}]:`, {
                blocksCount: blocks.length,
                blockTypes: blocks.map((b: any) => b.type),
                isEditable,
                enableAutoAdvance,
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
            3000,
        );

        const shouldAutoAdvance = (!!onComplete) && (enableAutoAdvance || !isEditable);
        if (shouldAutoAdvance) {
            const timer = setTimeout(() => {
                onComplete();
            }, isFinite(delay) ? delay : 3000);
            return () => clearTimeout(timer);
        }
    }, [isEditable, enableAutoAdvance, onComplete, data?.navigation?.autoAdvanceDelay, data?.metadata?.autoAdvanceDelay]);

    // Setup sensores do DnD local (para permitir reorder mesmo sem contexto global)
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    );

    const orderedBlocks = useMemo(() => {
        if (localOrder.length === 0) return blocks;
        return localOrder
            .map(id => blocks.find((b: Block) => b.id === id))
            .filter(Boolean) as Block[];
    }, [blocks, localOrder]);

    // 🎯 DROP ZONE - antes de cada bloco
    const DropZoneBefore: React.FC<{ blockId: string; blockIndex: number }> = ({ blockId }) => {
        const dropZoneId = `drop-before-${blockId}`;
        const { setNodeRef, isOver } = useDroppable({ id: dropZoneId, data: { dropZone: 'before', blockId, stepId: stepKey } });
        return (
            <div
                ref={setNodeRef}
                className={`h-8 -my-2 relative transition-all duration-200 border-2 rounded-md ${isOver
                    ? 'bg-blue-100 border-blue-400 border-dashed shadow-lg'
                    : 'bg-gray-50 border-gray-300 border-dashed opacity-40 hover:opacity-100 hover:bg-blue-50 hover:border-blue-400'
                    }`}
            >
                <div className={`absolute inset-0 flex items-center justify-center ${isOver ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <span className="text-[10px] font-medium text-blue-600 bg-white px-2 py-0.5 rounded shadow-sm">
                        {isOver ? '⬇ Soltar aqui' : '+ Soltar antes'}
                    </span>
                </div>
            </div>
        );
    };

    // 🎯 DROP ZONE - ao final do canvas
    const CanvasEndDroppable: React.FC = () => {
        const { setNodeRef, isOver } = useDroppable({ id: 'canvas-end', data: { stepId: stepKey } });
        return (
            <div
                ref={setNodeRef}
                className={`h-12 mt-2 border-2 border-dashed rounded-lg flex items-center justify-center text-xs transition-all ${isOver ? 'border-blue-400 bg-blue-50 text-blue-600' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-500'
                    }`}
            >
                <span>+ Solte componente aqui para adicionar ao final</span>
            </div>
        );
    };

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
                {/* 🎯 ZONA DROPPABLE antes do bloco (id: drop-before-{id}) */}
                <DropZoneBefore blockId={id} blockIndex={index} />

                {/* Bloco arrastável */}
                <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                    {children}
                </div>
            </div>
        );
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const ids = [...localOrder];
        const oldIndex = ids.indexOf(String(active.id));
        const newIndex = ids.indexOf(String(over.id));
        if (oldIndex >= 0 && newIndex >= 0) {
            const newIds = arrayMove(ids, oldIndex, newIndex);
            setLocalOrder(newIds);
            onBlocksReorder?.(stepKey, newIds);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <main className="w-full max-w-6xl mx-auto px-4 py-8">
                <div className="bg-card p-6 md:p-12 rounded-lg shadow-lg text-center max-w-2xl mx-auto">
                    {isEditable && orderedBlocks.length > 0 ? (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={localOrder} strategy={verticalListSortingStrategy}>
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
                                {/* 🎯 DROP ao final (id: canvas-end) */}
                                <CanvasEndDroppable />
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
