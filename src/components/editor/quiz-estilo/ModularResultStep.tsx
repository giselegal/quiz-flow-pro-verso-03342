/**
 * 🏆 RESULT STEP 100% MODULARIZADO
 * 
 * Agora usa blocos atômicos do registry (result-congrats, result-main, etc.)
 * - 100% editável via painel de propriedades
 * - Reordenável via drag-and-drop (@dnd-kit)
 * - Persistente via EditorProvider
 * - Injeção dinâmica de dados do usuário ({userName}, {resultStyle})
 */

import React, { useMemo, useRef } from 'react';
import { appLogger } from '@/utils/logger';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import { useResultOptional } from '@/contexts/ResultContext';
import { interpolateDeep } from '@/utils/interpolate';
import { useEditor } from '@/components/editor/EditorProviderUnified';
import { Block } from '@/types/editor';

interface ModularResultStepProps {
    data: any;
    blocks?: Block[]; // ✅ Novo: permitir injeção direta de blocos (preview/produção)
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
    onBlocksReorder?: (stepId: string, newOrder: string[]) => void;
}

/**
 * Injeta dados dinâmicos do usuário nos blocos
 * Substitui placeholders como {userName}, {resultStyle}
 */
function injectDynamicData(block: Block, userProfile?: ModularResultStepProps['userProfile']): Block {
    if (!userProfile) return block;

    const injectedBlock = { ...block } as Block & { content?: any };
    const blockType = String(injectedBlock.type);

    // Injetar no content.text
    if ((injectedBlock as any).content?.text) {
        (injectedBlock as any).content.text = (injectedBlock as any).content.text
            .replace(/{userName}/g, userProfile.userName || 'Visitante')
            .replace(/{resultStyle}/g, userProfile.resultStyle || 'Clássico Elegante');
    }

    // Injetar no content.styleName
    if ((injectedBlock as any).content?.styleName) {
        (injectedBlock as any).content.styleName = (injectedBlock as any).content.styleName
            .replace(/{resultStyle}/g, userProfile.resultStyle || 'Clássico Elegante');
    }

    // Injetar dados no content para blocos específicos
    if (blockType === 'result-congrats') {
        (injectedBlock as any).content = {
            ...(injectedBlock as any).content,
            userName: userProfile.userName,
        };
    }

    if (blockType === 'result-main') {
        (injectedBlock as any).content = {
            ...(injectedBlock as any).content,
            resultStyle: userProfile.resultStyle,
        };
    }

    if (blockType === 'result-progress-bars' && userProfile.scores) {
        (injectedBlock as any).content = {
            ...(injectedBlock as any).content,
            scores: userProfile.scores,
        };
    }

    if (blockType === 'result-secondary-styles' && userProfile.secondaryStyles) {
        (injectedBlock as any).content = {
            ...(injectedBlock as any).content,
            styles: userProfile.secondaryStyles.map(name => ({ name })),
        };
    }

    // Injetar no content.url (para imagens dinâmicas)
    if ((injectedBlock as any).content?.url) {
        (injectedBlock as any).content.url = (injectedBlock as any).content.url
            .replace(/{resultStyle}/g, (userProfile.resultStyle || 'natural').toLowerCase().replace(/\s+/g, '-'));
    }

    return injectedBlock;
}

export default function ModularResultStep({
    data,
    blocks: blocksProp,
    userProfile,
    isEditable = false,
    selectedBlockId,
    onBlockSelect = () => { },
    onOpenProperties = () => { },
    editor: editorProp,
    onBlocksReorder,
}: ModularResultStepProps) {
    const editorContext = useEditor({ optional: true });
    const resultCtx = useResultOptional();
    const editor = editorProp || editorContext;
    const computedId = data?.id as string | undefined;
    const isStandardStepId = typeof computedId === 'string' && /^step-\d{1,2}$/.test(computedId);
    const stepKey = isStandardStepId ? (computedId as string) : 'step-20';

    // Clique em blocos: seleciona e abre propriedades
    const handleBlockClick = React.useCallback((blockId: string) => {
        appLogger.debug(`🎯 Bloco clicado: ${blockId}`);
        onBlockSelect(blockId);
        if (editor?.actions?.setSelectedBlockId) editor.actions.setSelectedBlockId(blockId);
        onOpenProperties(blockId);
    }, [onBlockSelect, onOpenProperties, editor]);

    // Fonte de blocos (props → editor.state)
    const sourceBlocks = useMemo(() => {
        if (Array.isArray(blocksProp) && blocksProp.length > 0) return blocksProp;
        return editor?.state?.stepBlocks?.[stepKey] || [];
    }, [blocksProp, editor?.state?.stepBlocks, stepKey]);

    // Injeção dinâmica (userProfile + resultCtx)
    const blocks = useMemo(() => {
        const injected = sourceBlocks.map((block: Block) => injectDynamicData(block, userProfile));
        if (!resultCtx) return injected;
        const ctx = {
            username: resultCtx.userProfile.userName,
            style: resultCtx.styleConfig?.name,
            user: { name: resultCtx.userProfile.userName },
            result: { styleName: resultCtx.styleConfig?.name },
            calculations: resultCtx.calculations,
            styleConfig: resultCtx.styleConfig,
        };
        return injected.map((b: Block) => ({
            ...b,
            content: interpolateDeep((b as any).content, ctx),
            properties: interpolateDeep((b as any).properties, ctx),
        }));
    }, [sourceBlocks, userProfile, resultCtx]);

    // Auto-load se vazio (garantir apenas uma chamada por step para evitar loops)
    const autoloadRequestedRef = useRef(false);
    React.useEffect(() => {
        const noBlocksInProps = !(Array.isArray(blocksProp) && blocksProp.length > 0);
        const noBlocksInState = sourceBlocks.length === 0;
        if (!autoloadRequestedRef.current && noBlocksInProps && noBlocksInState && editor?.actions?.ensureStepLoaded) {
            autoloadRequestedRef.current = true;
            appLogger.debug(`🔄 [ModularResultStep] Auto-loading ${stepKey} (blocks empty)`);
            editor.actions.ensureStepLoaded(stepKey).catch((err: Error) => appLogger.error(`❌ [ModularResultStep] Failed to load ${stepKey}:`, err));
        }
    }, [stepKey, blocksProp, sourceBlocks.length, editor?.actions?.ensureStepLoaded]);

    // Debug (DEV)
    React.useEffect(() => {
        if (import.meta.env.DEV) {
            appLogger.debug(`🔍 ModularResultStep [${stepKey}]:`, {
                blocksCount: blocks.length,
                blockTypes: blocks.map((b: Block) => b.type),
                blockIds: blocks.map((b: Block) => b.id),
                userProfile: userProfile ? {
                    userName: userProfile.userName,
                    resultStyle: userProfile.resultStyle,
                    hasScores: !!userProfile.scores,
                    hasSecondaryStyles: !!userProfile.secondaryStyles,
                } : 'none',
            });
        }
    }, [stepKey, blocks.length, userProfile]);

    // Ordenação
    const [localOrder, setLocalOrder] = React.useState<string[]>([]);
    const arraysEqual = (a: string[], b: string[]) => a.length === b.length && a.every((v, i) => v === b[i]);
    React.useEffect(() => {
        if (blocks.length === 0) return;
        const orderFromMetadata = (data as any)?.metadata?.blockOrder as string[] | undefined;
        const desired = (orderFromMetadata && Array.isArray(orderFromMetadata) && orderFromMetadata.length > 0)
            ? orderFromMetadata
            : blocks.map((b: Block) => b.id);
        if (!arraysEqual(localOrder, desired)) {
            setLocalOrder(desired);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blocks.map((b: Block) => b.id).join('|'), (data as any)?.metadata?.blockOrder?.join?.('|')]);

    const orderedBlocks = useMemo(() => {
        if (localOrder.length === 0) return blocks;
        return localOrder
            .map(id => blocks.find((b: Block) => b.id === id))
            .filter(Boolean) as Block[];
    }, [blocks, localOrder]);

    // DnD config (faltava DndContext para reordenação funcionar)
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    );

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

    // Drop zones
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

    // Bloco arrastável
    const SortableBlock: React.FC<{ id: string; children: React.ReactNode; index: number }> = ({ id, children, index }) => {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.7 : 1,
        } as React.CSSProperties;
        return (
            <div className="relative">
                <DropZoneBefore blockId={id} blockIndex={index} />
                <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                    {children}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <main className="w-full max-w-6xl mx-auto px-4 py-8">
                <div className="bg-card p-6 md:p-12 rounded-lg shadow-lg max-w-4xl mx-auto">
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
                                <CanvasEndDroppable />
                            </SortableContext>
                        </DndContext>
                    ) : orderedBlocks.length > 0 ? (
                        <>
                            {orderedBlocks.map((block: Block) => (
                                <UniversalBlockRenderer key={block.id} block={block} mode="preview" />
                            ))}
                        </>
                    ) : null}

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
