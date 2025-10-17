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
import { useDroppable } from '@dnd-kit/core';
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
    onBlockSelect = () => { },
    onOpenProperties = () => { },
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

    // ✅ FASE 1.5: Auto-load se blocos estão vazios (CORREÇÃO CRÍTICA)
    React.useEffect(() => {
        if (sourceBlocks.length === 0 && editor?.actions?.ensureStepLoaded) {
            console.log(`🔄 [ModularResultStep] Auto-loading ${stepKey} (blocks empty)`);
            editor.actions.ensureStepLoaded(stepKey).then(() => {
                console.log(`✅ [ModularResultStep] Loaded ${stepKey} successfully`);
            }).catch((err: Error) => {
                console.error(`❌ [ModularResultStep] Failed to load ${stepKey}:`, err);
            });
        }
    }, [stepKey, sourceBlocks.length, editor?.actions]);

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

    // ⚠️ NOTA: DndContext removido deste componente!
    // Agora o drag & drop é gerenciado pelo QuizModularProductionEditor (contexto pai)
    // Este componente apenas renderiza drop zones visuais para o contexto pai detectar

    const orderedBlocks = useMemo(() => {
        if (localOrder.length === 0) return blocks;
        return localOrder
            .map(id => blocks.find((b: Block) => b.id === id))
            .filter(Boolean) as Block[];
    }, [blocks, localOrder]);

    // ✅ Wrapper com drop zone usando useDroppable
    const BlockWrapper: React.FC<{ id: string; children: React.ReactNode; index: number }> = ({ id, children, index }) => {
        const dropZoneId = `drop-before-${id}`;
        const { setNodeRef, isOver } = useDroppable({
            id: dropZoneId,
            data: {
                dropZone: 'before',
                blockId: id,
                stepKey: stepKey,
                insertIndex: index
            }
        });

        return (
            <div className="relative group">
                {/* 🎯 ZONA DROPPABLE antes do bloco */}
                <div
                    ref={setNodeRef}
                    className={`h-3 -my-1.5 relative transition-all duration-200 border-2 rounded ${isOver
                        ? 'bg-blue-100 border-blue-400 border-dashed'
                        : 'border-transparent hover:bg-blue-50 hover:border-blue-300 hover:border-dashed'
                        }`}
                >
                    <div className={`absolute inset-0 flex items-center justify-center ${isOver ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <span className="text-[10px] font-medium text-blue-600 bg-white px-2 py-0.5 rounded shadow-sm">
                            {isOver ? '⬇ Soltar aqui' : '+ Soltar antes'}
                        </span>
                    </div>
                </div>

                {/* Bloco */}
                <div className="my-2">
                    {children}
                </div>
            </div>
        );
    };

    // Componente de drop zone ao final
    const DropZoneEnd: React.FC<{ insertIndex: number }> = ({ insertIndex }) => {
        const dropZoneId = `drop-end-${stepKey}`;
        const { setNodeRef, isOver } = useDroppable({
            id: dropZoneId,
            data: {
                dropZone: 'after',
                stepKey: stepKey,
                insertIndex: insertIndex
            }
        });

        return (
            <div
                ref={setNodeRef}
                className={`h-16 mt-4 border-2 border-dashed rounded-lg transition-all
                          flex items-center justify-center text-sm cursor-pointer ${isOver
                        ? 'border-blue-400 bg-blue-100 text-blue-700'
                        : 'border-gray-300 text-gray-500 hover:border-blue-400 hover:bg-blue-50'
                    }`}
            >
                <span className="font-medium">
                    {isOver ? '⬇ Soltar aqui' : '+ Solte componente aqui para adicionar ao final'}
                </span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <main className="w-full max-w-6xl mx-auto px-4 py-8">
                <div className="bg-card p-6 md:p-12 rounded-lg shadow-lg max-w-4xl mx-auto">
                    {isEditable && orderedBlocks.length > 0 ? (
                        <div className="space-y-2">
                            {orderedBlocks.map((block: Block, index: number) => (
                                <BlockWrapper key={block.id} id={block.id} index={index}>
                                    <UniversalBlockRenderer
                                        block={block}
                                        mode="editor"
                                        isSelected={selectedBlockId === block.id}
                                        onSelect={() => handleBlockClick(block.id)}
                                        onClick={() => handleBlockClick(block.id)}
                                    />
                                </BlockWrapper>
                            ))}

                            {/* 🎯 ZONA DROPPABLE ao final */}
                            <DropZoneEnd insertIndex={orderedBlocks.length} />
                        </div>
                    ) : orderedBlocks.length > 0 ? (
                        <>
                            {orderedBlocks.map((block: Block) => (
                                <UniversalBlockRenderer
                                    key={block.id}
                                    block={block}
                                    mode="preview"
                                />
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
