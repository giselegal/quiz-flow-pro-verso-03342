import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SelectableBlock } from '@/components/editor/SelectableBlock';

interface ModularQuestionStepProps {
    data: any;
    currentAnswers?: string[];
    onAnswersChange?: (answers: string[]) => void;
    onEdit?: (field: string, value: any) => void;
    isEditable?: boolean;
    selectedBlockId?: string;
    onBlockSelect?: (blockId: string) => void;
    onOpenProperties?: (blockId: string) => void;
    onBlocksReorder?: (stepId: string, newOrder: string[]) => void;
    onBlockUpdate?: (blockId: string, updates: Record<string, any>) => void;
}

/**
 * ❓ QUESTION STEP MODULARIZADO
 * 
 * Cada seção é um bloco editável independente:
 * - Barra de progresso
 * - Número da pergunta
 * - Texto da pergunta
 * - Grid de opções
 * - Botão de ação
 */
export default function ModularQuestionStep({
    data,
    currentAnswers = [],
    onAnswersChange,
    onEdit,
    isEditable = false,
    selectedBlockId,
    onBlockSelect,
    onOpenProperties,
    onBlocksReorder,
    onBlockUpdate
}: ModularQuestionStepProps) {

    const safeData = {
        questionNumber: data.questionNumber || 'Pergunta 1',
        questionText: data.questionText || 'Qual é a sua preferência?',
        requiredSelections: data.requiredSelections || 1,
        options: data.options || [
            { id: 'opt1', text: 'Opção 1', image: undefined },
            { id: 'opt2', text: 'Opção 2', image: undefined },
            { id: 'opt3', text: 'Opção 3', image: undefined }
        ]
    };

    const hasImages = safeData.options[0]?.image;
    const gridClass = hasImages ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1';

    const handleOptionClick = (optionId: string) => {
        if (!onAnswersChange) return;

        const isSelected = currentAnswers.includes(optionId);
        if (isSelected) {
            const newAnswers = currentAnswers.filter(id => id !== optionId);
            onAnswersChange(newAnswers);
        } else if (currentAnswers.length < safeData.requiredSelections) {
            const newAnswers = [...currentAnswers, optionId];
            onAnswersChange(newAnswers);
        }
    };

    const canProceed = currentAnswers.length === safeData.requiredSelections;
    const selectionText = safeData.requiredSelections > 1
        ? `Selecione ${safeData.requiredSelections} opções`
        : 'Selecione uma opção';

    const stepNumber = parseInt(data.questionNumber?.replace(/\\D/g, '') || '1');
    const progress = Math.round((stepNumber / 21) * 100);

    // ===== DnD - Reordenação dos blocos (sem o progress) =====
    const stepId = data?.id || 'step-question';
    const DEFAULT_ORDER = ['question-number', 'question-text', 'question-instructions', 'question-options', 'question-button'];
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
        // Persistir no estado do editor/template
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
                blockId="question-progress"
                isSelected={selectedBlockId === 'question-progress'}
                isEditable={isEditable}
                onSelect={() => onBlockSelect?.('question-progress')}
                blockType="Barra de Progresso"
                blockIndex={0}
                onOpenProperties={() => onOpenProperties?.('question-progress')}
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

            {/* BLOCO 2: Container Principal */}
            <div className="w-full max-w-6xl mx-auto px-4">
                <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-6xl mx-auto">

                    {/* LISTA ORDENÁVEL: Número, Texto, Instruções, Opções, Botão */}
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
                                                    className="text-xl md:text-2xl font-bold text-[#deac6d] mb-4"
                                                    style={{ fontFamily: '"Playfair Display", serif' }}
                                                >
                                                    {safeData.questionText}
                                                </p>
                                            </SelectableBlock>
                                        </SortableBlock>
                                    );
                                }
                                if (blockId === 'question-instructions') {
                                    return (
                                        <SortableBlock key={blockId} id={blockId}>
                                            <SelectableBlock
                                                blockId="question-instructions"
                                                isSelected={selectedBlockId === 'question-instructions'}
                                                isEditable={isEditable}
                                                onSelect={() => onBlockSelect?.('question-instructions')}
                                                blockType="Instruções"
                                                blockIndex={index + 1}
                                                onOpenProperties={() => onOpenProperties?.('question-instructions')}
                                                isDraggable={true}
                                            >
                                                <p className="text-sm text-gray-600 mb-8">
                                                    {selectionText} ({currentAnswers.length}/{safeData.requiredSelections})
                                                    {isEditable && (
                                                        <span className="block text-blue-500 mt-1 text-xs">
                                                            ✏️ Editável via Painel de Propriedades
                                                        </span>
                                                    )}
                                                </p>
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
                                                blockType="Opções da Pergunta"
                                                blockIndex={index + 1}
                                                onOpenProperties={() => onOpenProperties?.('question-options')}
                                                isDraggable={true}
                                            >
                                                <div className={`grid ${gridClass} gap-6 mb-8 max-w-4xl mx-auto`}>
                                                    {safeData.options.map((option: any) => (
                                                        <div
                                                            key={option.id}
                                                            onClick={() => handleOptionClick(option.id)}
                                                            className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:border-[#deac6d] hover:shadow-md ${currentAnswers.includes(option.id)
                                                                ? 'border-[#5b4135] bg-gradient-to-br from-white to-[#f8f5f0] shadow-lg transform -translate-y-1'
                                                                : 'border-gray-200'
                                                                }`}
                                                        >
                                                            {option.image && (
                                                                <img
                                                                    src={option.image}
                                                                    alt={option.text}
                                                                    className="rounded-md w-full mb-2 object-cover max-h-48"
                                                                />
                                                            )}
                                                            <p className="text-center font-medium text-sm leading-relaxed text-[#432818]">
                                                                {option.text}
                                                            </p>

                                                            {currentAnswers.includes(option.id) && (
                                                                <div className="mt-2 w-6 h-6 bg-[#deac6d] rounded-full flex items-center justify-center">
                                                                    <span className="text-white text-xs font-bold">✓</span>
                                                                </div>
                                                            )}
                                                        </div>
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
                                                        ? 'bg-[#deac6d] text-white animate-pulse'
                                                        : 'bg-[#e6ddd4] text-[#8a7663] opacity-50 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {canProceed ? 'Avançando...' : 'Próxima'}
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
            </div>
        </div>
    );
}