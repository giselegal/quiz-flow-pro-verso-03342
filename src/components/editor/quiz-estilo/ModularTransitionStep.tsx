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
import { useDroppable } from '@dnd-kit/core';
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <main className="w-full max-w-6xl mx-auto px-4 py-8">
                <div className="bg-card p-6 md:p-12 rounded-lg shadow-lg text-center max-w-2xl mx-auto">
                    {isEditable && orderedBlocks.length > 0 ? (
                        <div className="space-y-2">
                            {/* 🎯 ZONA DROPPABLE ao final */}
                            <DropZoneEnd insertIndex={orderedBlocks.length} />

                            {/* 🎯 ZONA DROPPABLE ao final */}
                            <div
                                className="h-16 mt-4 border-2 border-dashed border-gray-300 rounded-lg
                                          hover:border-blue-400 hover:bg-blue-50 transition-all
                                          flex items-center justify-center text-sm text-gray-500 cursor-pointer"
                                data-drop-zone="after"
                                data-step-key={stepKey}
                                data-insert-index={orderedBlocks.length}
                            >
                                <span className="font-medium">+ Solte componente aqui para adicionar ao final</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            {orderedBlocks.map((block: Block) => (
                                <UniversalBlockRenderer
                                    key={block.id}
        );
    };

                            // Componente de drop zone ao final
                            const DropZoneEnd: React.FC<{ insertIndex: number }> = ({insertIndex}) => {
        const dropZoneId = `drop-end-${stepKey}`;
                            const {setNodeRef, isOver} = useDroppable({
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

    return (                ))}
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
