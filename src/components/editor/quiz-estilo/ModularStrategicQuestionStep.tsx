import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SelectableBlock } from '@/components/editor/SelectableBlock';

interface ModularStrategicQuestionStepProps {
    data: any;
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

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = order.indexOf(String(active.id));
        const newIndex = order.indexOf(String(over.id));
        const newOrder = arrayMove(order, oldIndex, newIndex);
        setOrder(newOrder);
        onBlocksReorder?.(stepId, newOrder);
        onEdit?.('blockOrder', newOrder);
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