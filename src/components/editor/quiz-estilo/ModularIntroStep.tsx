import React, { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import { useEditor } from '@/components/editor/EditorProviderUnified';
import { Block } from '@/types/editor';

interface ModularIntroStepProps {
    data: any;
    onEdit?: (field: string, value: any) => void;
    isEditable?: boolean;
    selectedBlockId?: string;
    onBlockSelect?: (blockId: string) => void;
    onOpenProperties?: (blockId: string) => void;
    onBlocksReorder?: (stepId: string, newOrder: string[]) => void;
    /** Emite o nome digitado quando o botão do formulário é clicado */
    onNameSubmit?: (name: string) => void;
    editor?: any;
}

/**
 * 🏠 INTRO STEP 100% MODULARIZADO
 * 
 * Agora usa blocos atômicos do registry (intro-header, intro-title, etc.)
 * - 100% editável via painel de propriedades
 * - Drop zones para drag-and-drop de componentes
 * - Persistente via EditorProvider
 * - Mesma fonte de dados em edit/preview
 */
export default function ModularIntroStep({
    data,
    isEditable = false,
    selectedBlockId,
    onBlockSelect = () => { },
    onOpenProperties = () => { },
    onNameSubmit,
    editor: editorProp
}: ModularIntroStepProps) {
    const editorContext = useEditor({ optional: true });
    const editor = editorProp || editorContext;
    const stepKey = data?.id || 'step-intro';

    const handleBlockClick = React.useCallback((blockId: string) => {
        console.log(`🎯 Bloco clicado: ${blockId}`);
        onBlockSelect(blockId);
        if (editor?.actions?.setSelectedBlockId) {
            editor.actions.setSelectedBlockId(blockId);
        }
        onOpenProperties(blockId);
    }, [onBlockSelect, onOpenProperties, editor]);

    const blocks = useMemo(() => {
        return editor?.state?.stepBlocks?.[stepKey] || [];
    }, [editor?.state?.stepBlocks, stepKey]);

    React.useEffect(() => {
        if (blocks.length === 0 && editor?.actions?.ensureStepLoaded) {
            console.log(`🔄 [ModularIntroStep] Auto-loading ${stepKey}`);
            editor.actions.ensureStepLoaded(stepKey).catch((err: Error) => {
                console.error(`❌ [ModularIntroStep] Failed to load ${stepKey}:`, err);
            });
        }
    }, [stepKey, blocks.length, editor?.actions]);

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

    const orderedBlocks = useMemo(() => {
        if (localOrder.length === 0) return blocks;
        return localOrder.map(id => blocks.find((b: Block) => b.id === id)).filter(Boolean) as Block[];
    }, [blocks, localOrder]);

    const BlockWrapper: React.FC<{ id: string; children: React.ReactNode; index: number }> = ({ id, children, index }) => {
        const dropZoneId = `drop-before-${id}`;
        const { setNodeRef, isOver } = useDroppable({
            id: dropZoneId,
            data: { dropZone: 'before', blockId: id, stepKey: stepKey, insertIndex: index }
        });

        return (
            <div className="relative group">
                <div
                    ref={setNodeRef}
                    className={`h-3 -my-1.5 relative transition-all duration-200 border-2 rounded ${isOver ? 'bg-blue-100 border-blue-400 border-dashed' : 'border-transparent hover:bg-blue-50 hover:border-blue-300 hover:border-dashed'
                        }`}
                >
                    <div className={`absolute inset-0 flex items-center justify-center ${isOver ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <span className="text-[10px] font-medium text-blue-600 bg-white px-2 py-0.5 rounded shadow-sm">
                            {isOver ? '⬇ Soltar aqui' : '+ Soltar antes'}
                        </span>
                    </div>
                </div>
                <div className="my-2">{children}</div>
            </div>
        );
    };

    const DropZoneEnd: React.FC<{ insertIndex: number }> = ({ insertIndex }) => {
        const dropZoneId = `drop-end-${stepKey}`;
        const { setNodeRef, isOver } = useDroppable({
            id: dropZoneId,
            data: { dropZone: 'after', stepKey: stepKey, insertIndex: insertIndex }
        });

        return (
            <div
                ref={setNodeRef}
                className={`h-16 mt-4 border-2 border-dashed rounded-lg transition-all flex items-center justify-center text-sm cursor-pointer ${isOver ? 'border-blue-400 bg-blue-100 text-blue-700' : 'border-gray-300 text-gray-500 hover:border-blue-400 hover:bg-blue-50'
                    }`}
            >
                <span className="font-medium">{isOver ? '⬇ Soltar aqui' : '+ Solte componente aqui para adicionar ao final'}</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            <main className="w-full max-w-6xl mx-auto px-4 py-8">
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
                        <DropZoneEnd insertIndex={orderedBlocks.length} />
                    </div>
                ) : (
                    <>
                        {orderedBlocks.map((block: Block) => (
                            <UniversalBlockRenderer key={block.id} block={block} mode="preview" />
                        ))}
                    </>
                )}

                {orderedBlocks.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">Nenhum bloco configurado para este step.</p>
                        {isEditable && <p className="text-sm text-primary">Adicione blocos usando o template JSON ou via editor.</p>}
                    </div>
                )}
            </main>
        </div>
    );
}
