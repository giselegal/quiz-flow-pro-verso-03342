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
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
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
}

export default function ModularTransitionStep({
    data,
    onComplete,
    isEditable = false,
    enableAutoAdvance = false,
    selectedBlockId,
    onBlockSelect = () => { },
    onOpenProperties = () => { }
}: ModularTransitionStepProps) {
    const editor = useEditor({ optional: true });
    const stepKey = data?.id || 'step-12';

    // Buscar blocos do provider com local state para forçar re-render
    const [localBlocks, setLocalBlocks] = React.useState<any[]>([]);
    const [isLoadingBlocks, setIsLoadingBlocks] = React.useState(true);

    React.useEffect(() => {
        const currentBlocks = editor?.state?.stepBlocks?.[stepKey] || [];

        // Inicializar loading
        if (isLoadingBlocks && currentBlocks.length === 0) {
            // Tentar carregar os blocos se não existem
            if (editor?.actions?.ensureStepLoaded) {
                editor.actions.ensureStepLoaded(stepKey).then(() => {
                    setIsLoadingBlocks(false);
                }).catch(() => {
                    setIsLoadingBlocks(false);
                });
            } else {
                setIsLoadingBlocks(false);
            }
        } else if (currentBlocks.length > 0) {
            setLocalBlocks(currentBlocks);
            setIsLoadingBlocks(false);
        }
    }, [editor?.state?.stepBlocks, stepKey, editor?.state?.stepBlocks?.[stepKey]?.length, editor?.actions, isLoadingBlocks]);

    // Usar localBlocks ao invés de memoized blocks
    const blocks = localBlocks;

    // Loading state: evitar early return para manter ordem de hooks
    const showLoading = isLoadingBlocks && localBlocks.length === 0;

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
                                {orderedBlocks.map((block) => (
                                    <UniversalBlockRenderer
                                        key={block.id}
                                        block={block}
                                        mode="editor"
                                        isSelected={selectedBlockId === block.id}
                                        onSelect={() => onBlockSelect(block.id)}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    ) : (
                        <>
                            {orderedBlocks.map((block) => (
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
