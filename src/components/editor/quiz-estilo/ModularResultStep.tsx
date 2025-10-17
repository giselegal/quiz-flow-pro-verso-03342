/**
 * 🏆 RESULT STEP 100% MODULARIZADO
 * 
 * Agora usa blocos atômicos do registry (result-congrats, result-main, etc.)
 * - 100% editável via painel de propriedades
 * - Reordenável via drag-and-drop (@dnd-kit)
 * - Persistente via EditorProvider
 * - Injeção dinâmica de dados do usuário ({userName}, {resultStyle})
 */

import React, { useMemo } from 'react';
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import { useEditor } from '@/components/editor/EditorProviderUnified';
import { Block } from '@/types/editor';

interface ModularResultStepProps {
    data: any;
    userProfile?: {
        userName: string;
        resultStyle: string;
        secondaryStyles?: string[];
        scores?: Array<{ name: string; score: number }>;
    };
    onEdit?: (field: string, value: any) => void;
    isEditable?: boolean;
    selectedBlockId?: string;
    onBlockSelect?: (blockId: string) => void;
    onOpenProperties?: (blockId: string) => void;
    editor?: any;
}

/**
 * Injeta dados dinâmicos do usuário nos blocos
 * Substitui placeholders como {userName}, {resultStyle}
 */
function injectDynamicData(block: Block, userProfile?: ModularResultStepProps['userProfile']): Block {
    if (!userProfile) return block;

    const injectedBlock = { ...block };
    const blockType = String(injectedBlock.type);

    // Injetar no content.text
    if (injectedBlock.content?.text) {
        injectedBlock.content.text = injectedBlock.content.text
            .replace(/{userName}/g, userProfile.userName || 'Visitante')
            .replace(/{resultStyle}/g, userProfile.resultStyle || 'Clássico Elegante');
    }

    // Injetar no content.styleName
    if (injectedBlock.content?.styleName) {
        injectedBlock.content.styleName = injectedBlock.content.styleName
            .replace(/{resultStyle}/g, userProfile.resultStyle || 'Clássico Elegante');
    }

    // Injetar dados no content para blocos específicos
    if (blockType === 'result-congrats') {
        injectedBlock.content = {
            ...injectedBlock.content,
            userName: userProfile.userName,
        };
    }

    if (blockType === 'result-main') {
        injectedBlock.content = {
            ...injectedBlock.content,
            resultStyle: userProfile.resultStyle,
        };
    }

    if (blockType === 'result-progress-bars' && userProfile.scores) {
        injectedBlock.content = {
            ...injectedBlock.content,
            scores: userProfile.scores,
        };
    }

    if (blockType === 'result-secondary-styles' && userProfile.secondaryStyles) {
        injectedBlock.content = {
            ...injectedBlock.content,
            styles: userProfile.secondaryStyles.map(name => ({ name })),
        };
    }

    // Injetar no content.url (para imagens dinâmicas)
    if (injectedBlock.content?.url) {
        injectedBlock.content.url = injectedBlock.content.url
            .replace(/{resultStyle}/g, (userProfile.resultStyle || 'natural').toLowerCase().replace(/\s+/g, '-'));
    }

    return injectedBlock;
}

export default function ModularResultStep({
    data,
    userProfile,
    isEditable = false,
    selectedBlockId,
    onBlockSelect = () => {},
    onOpenProperties = () => {},
    editor: editorProp
}: ModularResultStepProps) {
    const editorContext = useEditor({ optional: true });
    const editor = editorProp || editorContext;
    const computedId = data?.id as string | undefined;
    const isStandardStepId = typeof computedId === 'string' && /^step-\d{1,2}$/.test(computedId);
    const stepKey = isStandardStepId ? (computedId as string) : 'step-20';

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
    const sourceBlocks = useMemo(() => {
        return editor?.state?.stepBlocks?.[stepKey] || [];
    }, [editor?.state?.stepBlocks, stepKey]);
    
    // Injetar dados dinâmicos nos blocos
    const blocks = useMemo(() => {
        return sourceBlocks.map((block: Block) => injectDynamicData(block, userProfile));
    }, [sourceBlocks, userProfile]);

    // ✅ FASE 2: Debug logs apenas em DEV
    React.useEffect(() => {
        if (import.meta.env.DEV) {
            console.log(`🔍 ModularResultStep [${stepKey}]:`, {
                blocksCount: blocks.length,
                blockTypes: blocks.map((b: Block) => b.type),
                blockIds: blocks.map((b: Block) => b.id),
                userProfile: userProfile ? {
                    userName: userProfile.userName,
                    resultStyle: userProfile.resultStyle,
                    hasScores: !!userProfile.scores,
                    hasSecondaryStyles: !!userProfile.secondaryStyles
                } : 'none'
            });
        }
    }, [stepKey, blocks.length, userProfile]);

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
                <div className="bg-card p-6 md:p-12 rounded-lg shadow-lg max-w-4xl mx-auto">
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
                                {orderedBlocks.map((block: Block) => (
                                    <UniversalBlockRenderer
                                        key={block.id}
                                        block={block}
                                        mode="editor"
                                        isSelected={selectedBlockId === block.id}
                                        onSelect={() => handleBlockClick(block.id)}
                                        onClick={() => handleBlockClick(block.id)}
                                    />
                                ))}
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
