import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import type { Block } from '@/types/editor';
import { BlockTypeRenderer } from '@/components/editor/quiz/renderers/BlockTypeRenderer';
import { cn } from '@/lib/utils';
import { safeGetTemplateBlocks, blockComponentsToBlocks } from '@/utils/templateConverter';
import { getQuiz21StepsTemplate } from '@/templates/imports';

interface ModularStrategicQuestionStepProps {
    data: any;
    blocks?: Block[];
    currentAnswer?: string;
    onAnswerChange?: (answer: string) => void;
    onEdit?: (field: string, value: any) => void;
    isEditable?: boolean;
    selectedBlockId?: string;
    onBlockSelect?: (blockId: string) => void;
    onOpenProperties?: (blockId: string) => void;
    onBlocksReorder?: (stepId: string, newOrder: string[]) => void;
    onBlockUpdate?: (blockId: string, updates: Record<string, any>) => void;
}

/**
 * 🎯 STRATEGIC QUESTION STEP MODULARIZADO
 * 
 * Cada seção é um bloco editável independente:
 * - Barra de progresso
 * - Número da pergunta
 * - Texto da pergunta
 * - Grid de opções
 * - Botão de ação
 */
export default function ModularStrategicQuestionStep({
    data,
    blocks = [],
    currentAnswer = '',
    onAnswerChange,
    onEdit,
    isEditable = false,
    selectedBlockId,
    onBlockSelect = () => { },
    onOpenProperties = () => { },
    onBlocksReorder,
    onBlockUpdate
}: ModularStrategicQuestionStepProps) {

    const safeData = {
        questionNumber: data.questionNumber || 'Pergunta Estratégica',
        questionText: data.questionText || 'Qual é sua resposta?',
        options: data.options || [
            { id: 'opt1', text: 'Opção A' },
            { id: 'opt2', text: 'Opção B' },
            { id: 'opt3', text: 'Opção C' }
        ]
    };

    const handleOptionClick = (optionId: string) => {
        if (onAnswerChange) {
            onAnswerChange(optionId);
        }
    };

    // Block IDs
    const progressBlockId = `${data.id}-progress`;
    const questionNumberBlockId = `${data.id}-question-number`;
    const questionTextBlockId = `${data.id}-question-text`;
    const optionsBlockId = `${data.id}-options`;
    const buttonBlockId = `${data.id}-button`;

    const progress = Math.round((15 / 21) * 100);
    const canProceed = Boolean(currentAnswer);

    // ===== DnD - Reordenação dos blocos =====
    const stepId = data?.id || 'step-strategic-question';
    const DEFAULT_ORDER = ['question-number', 'question-text', 'question-options', 'question-button'];
    const initialOrder: string[] = (data?.metadata?.blockOrder && Array.isArray(data.metadata.blockOrder))
        ? data.metadata.blockOrder
        : DEFAULT_ORDER;
    const [order, setOrder] = React.useState<string[]>(initialOrder);

    // Fallback: carregar blocos do template v3 quando props.blocks vier vazio
    const [fallbackBlocks, setFallbackBlocks] = React.useState<Block[]>([]);
    const effectiveBlocks = React.useMemo(() => (Array.isArray(blocks) && blocks.length > 0) ? blocks : fallbackBlocks, [blocks, fallbackBlocks]);
    React.useEffect(() => {
        if (Array.isArray(blocks) && blocks.length > 0) return;
        const m = String(data?.id || '').match(/step-\d{2}/);
        const stepKey = m ? m[0] : 'step-13';
        try {
            // Usar getQuiz21StepsTemplate() em vez de importar diretamente
            const template = getQuiz21StepsTemplate();
            const comps = safeGetTemplateBlocks(stepKey, template);
            const asBlocks = blockComponentsToBlocks(comps);
            if (asBlocks.length) setFallbackBlocks(asBlocks as any);
        } catch (error) {
            console.error(`❌ Erro ao carregar fallback blocks para ${stepKey}:`, error);
        }
    }, [data?.id, blocks]);

    // Suporte a blocos reais (Block[])
    const hasRealBlocks = Array.isArray(effectiveBlocks) && effectiveBlocks.length > 0;
    const topLevelBlocks: Block[] = React.useMemo(() => {
        if (!hasRealBlocks) return [];
        const list = (effectiveBlocks as Block[]).filter(b => !(b as any).parentId);
        return list.sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [effectiveBlocks, hasRealBlocks]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        if (hasRealBlocks) {
            const ids = topLevelBlocks.map(b => b.id);
            const oldIndex = ids.indexOf(String(active.id));
            const newIndex = ids.indexOf(String(over.id));
            if (oldIndex >= 0 && newIndex >= 0) {
                const newIds = arrayMove(ids, oldIndex, newIndex);
                onBlocksReorder?.(stepId, newIds);
            }
        } else {
            const oldIndex = order.indexOf(String(active.id));
            const newIndex = order.indexOf(String(over.id));
            const newOrder = arrayMove(order, oldIndex, newIndex);
            setOrder(newOrder);
            onBlocksReorder?.(stepId, newOrder);
            onEdit?.('blockOrder', newOrder);
        }
    };

    const SortableBlock: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.7 : 1,
        } as React.CSSProperties;
        return (
            <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                {children}
            </div>
        );
    };

    // Renderização com blocos reais (novo sistema)
    if (hasRealBlocks) {
        const SortableItem: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
            const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
            const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.7 : 1 } as React.CSSProperties;
            return (
                <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                    {children}
                </div>
            );
        };

        const DropZoneBefore: React.FC<{ blockId: string; insertIndex: number }> = ({ blockId, insertIndex }) => {
            const dropZoneId = `drop-before-${blockId}`;
            const { setNodeRef, isOver } = useDroppable({ id: dropZoneId, data: { dropZone: 'before', blockId, stepId, insertIndex } });
            return <div ref={setNodeRef} className={cn('h-4 -my-1 transition-all border-2 border-dashed rounded', isOver ? 'bg-blue-100 border-blue-400' : 'bg-gray-50 border-gray-300 opacity-60 hover:opacity-100 hover:bg-blue-50 hover:border-blue-400')} />;
        };

        // Navegação global para próximo/anterior (emite evento)
        const currentStepReal = React.useMemo(() => {
            try {
                const id = String(data?.id || '');
                const n = parseInt(id.replace(/\D/g, ''), 10);
                return isNaN(n) ? undefined : n;
            } catch { return undefined; }
        }, [data?.id]);

        const emitNavigate = (target: number) => {
            try {
                window.dispatchEvent(new CustomEvent('quiz-navigate-to-step', {
                    detail: { step: target, stepId: `step-${String(target).padStart(2, '0')}`, source: 'modular-strategic-question-step' }
                }));
            } catch { }
        };

        const canProceed = Boolean(currentAnswer);

        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={topLevelBlocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                        {topLevelBlocks.map((block, index) => (
                            <React.Fragment key={block.id}>
                                <DropZoneBefore blockId={block.id} insertIndex={index} />
                                <SortableItem id={block.id}>
                                    <BlockTypeRenderer
                                        block={block}
                                        isSelected={selectedBlockId === block.id}
                                        isEditable={isEditable}
                                        onSelect={onBlockSelect}
                                        onOpenProperties={onOpenProperties}
                                        contextData={{
                                            currentAnswer,
                                            onAnswerChange,
                                            canProceed,
                                            onNext: () => { if (typeof currentStepReal === 'number') emitNavigate(currentStepReal + 1); },
                                            onPrev: () => { if (typeof currentStepReal === 'number') emitNavigate(currentStepReal - 1); },
                                        }}
                                    />
                                </SortableItem>
                            </React.Fragment>
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* BLOCO 1: Barra de Progresso */}
            <SelectableBlock
                blockId={progressBlockId}
                isSelected={selectedBlockId === progressBlockId}
                isEditable={isEditable}
                onSelect={onBlockSelect}
                blockType="Barra de Progresso"
                onOpenProperties={onOpenProperties}
                isDraggable={false}
            >
                <div className="mb-6 max-w-6xl mx-auto px-4 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div
                            className="bg-[#deac6d] h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-center mb-4 text-gray-600">Progresso: {progress}%</p>
                </div>
            </SelectableBlock>

            <main className="w-full max-w-6xl mx-auto px-4">
                <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-4xl mx-auto">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={order} strategy={verticalListSortingStrategy}>
                            {order.map((blockId, index) => {
                                if (blockId === 'question-number') {
                                    return (
                                        <SortableBlock key={blockId} id={blockId}>
                                            <SelectableBlock
                                                blockId="question-number"
                                                isSelected={selectedBlockId === 'question-number'}
                                                isEditable={isEditable}
                                                onSelect={() => onBlockSelect?.('question-number')}
                                                blockType="Número da Pergunta"
                                                blockIndex={index + 1}
                                                onOpenProperties={() => onOpenProperties?.('question-number')}
                                                isDraggable={true}
                                            >
                                                <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#432818]">
                                                    {safeData.questionNumber}
                                                </h2>
                                            </SelectableBlock>
                                        </SortableBlock>
                                    );
                                }
                                if (blockId === 'question-text') {
                                    return (
                                        <SortableBlock key={blockId} id={blockId}>
                                            <SelectableBlock
                                                blockId="question-text"
                                                isSelected={selectedBlockId === 'question-text'}
                                                isEditable={isEditable}
                                                onSelect={() => onBlockSelect?.('question-text')}
                                                blockType="Texto da Pergunta"
                                                blockIndex={index + 1}
                                                onOpenProperties={() => onOpenProperties?.('question-text')}
                                                isDraggable={true}
                                            >
                                                <p
                                                    className="text-xl md:text-2xl font-bold text-[#deac6d] mb-8"
                                                    style={{ fontFamily: '"Playfair Display", serif' }}
                                                >
                                                    {safeData.questionText}
                                                </p>
                                                {isEditable && (
                                                    <p className="text-xs text-blue-500 mb-4">
                                                        ✏️ Editável via Painel de Propriedades
                                                    </p>
                                                )}
                                            </SelectableBlock>
                                        </SortableBlock>
                                    );
                                }
                                if (blockId === 'question-options') {
                                    return (
                                        <SortableBlock key={blockId} id={blockId}>
                                            <SelectableBlock
                                                blockId="question-options"
                                                isSelected={selectedBlockId === 'question-options'}
                                                isEditable={isEditable}
                                                onSelect={() => onBlockSelect?.('question-options')}
                                                blockType="Opções de Resposta"
                                                blockIndex={index + 1}
                                                onOpenProperties={() => onOpenProperties?.('question-options')}
                                                isDraggable={true}
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
                                                    {safeData.options.map((option: any) => (
                                                        <button
                                                            key={option.id}
                                                            onClick={() => handleOptionClick(option.id)}
                                                            className={`p-4 border-2 rounded-lg transition-all duração-200 hover:border-[#deac6d] hover:shadow-md ${currentAnswer === option.id
                                                                ? 'border-[#5b4135] bg-gradient-to-br from-white to-[#f8f5f0] shadow-lg'
                                                                : 'border-gray-200'
                                                                }`}
                                                        >
                                                            <p className="font-medium text-sm text-[#432818]">
                                                                {option.text}
                                                            </p>
                                                            {currentAnswer === option.id && (
                                                                <div className="mt-2 w-6 h-6 bg-[#deac6d] rounded-full flex items-center justify-center mx-auto">
                                                                    <span className="text-white text-xs font-bold">✓</span>
                                                                </div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </SelectableBlock>
                                        </SortableBlock>
                                    );
                                }
                                if (blockId === 'question-button') {
                                    return (
                                        <SortableBlock key={blockId} id={blockId}>
                                            <SelectableBlock
                                                blockId="question-button"
                                                isSelected={selectedBlockId === 'question-button'}
                                                isEditable={isEditable}
                                                onSelect={() => onBlockSelect?.('question-button')}
                                                blockType="Botão de Ação"
                                                blockIndex={index + 1}
                                                onOpenProperties={() => onOpenProperties?.('question-button')}
                                                isDraggable={true}
                                            >
                                                <button
                                                    disabled={!canProceed}
                                                    className={`font-bold py-3 px-6 rounded-full shadow-md transition-all ${canProceed
                                                        ? 'bg-[#deac6d] text-white hover:bg-[#c19a5d]'
                                                        : 'bg-[#e6ddd4] text-[#8a7663] opacity-50 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {canProceed ? 'Próxima' : 'Selecione uma opção'}
                                                </button>
                                            </SelectableBlock>
                                        </SortableBlock>
                                    );
                                }
                                return null;
                            })}
                        </SortableContext>
                    </DndContext>
                </div>
            </main>
        </div>
    );
}