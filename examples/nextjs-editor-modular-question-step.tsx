// 🎯 EXEMPLO PRÁTICO: ModularQuestionStep - Versão Editor (Client-Only)
// Localização: components/editor/steps/ModularQuestionStep.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { DndContext, SortableContext, useSortable, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditor } from '@/components/editor/EditorProviderUnified';
import { validateAnswer } from '@/lib/quiz/validation';
import { computeProgress } from '@/lib/quiz/navigation';

// ❌ Props complexas (tudo que o editor precisa)
interface ModularQuestionStepProps {
    // Dados do step
    data: {
        id: string;
        questionNumber: string;
        questionText: string;
        instructions?: string;
        options: Array<{
            id: string;
            text: string;
            image?: string;
            value?: string;
        }>;
        requiredSelections: number;
    };

    // Blocos para renderização modular
    blocks: Array<{
        id: string;
        type: string;
        content: any;
        order: number;
    }>;

    // Estado da aplicação
    currentAnswers: string[];
    totalSteps?: number;
    currentStepNumber?: number;

    // Callbacks simples
    onAnswersChange: (answers: string[]) => void;
    onNext?: () => void;
    onPrev?: () => void;

    // ✅ Callbacks de EDIÇÃO (só no editor)
    isEditable?: boolean;
    selectedBlockId?: string;
    onBlockSelect?: (blockId: string) => void;
    onEdit?: (field: string, value: any) => void;
    onBlocksReorder?: (stepId: string, newOrder: string[]) => void;
    onOpenProperties?: (blockId: string) => void;
    onBlockUpdate?: (blockId: string, updates: any) => void;
    enableAutoAdvance?: boolean;
}

export default function ModularQuestionStep({
    data,
    blocks,
    currentAnswers,
    totalSteps = 21,
    currentStepNumber = 1,
    onAnswersChange,
    onNext,
    onPrev,
    isEditable = false,
    selectedBlockId,
    onBlockSelect,
    onEdit,
    onBlocksReorder,
    onOpenProperties,
    onBlockUpdate,
    enableAutoAdvance = true,
}: ModularQuestionStepProps) {
    // ✅ Hook do editor (só disponível no editor)
    const editor = useEditor({ optional: true });

    // ✅ DnD setup (só no editor)
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
    );

    const [localBlockOrder, setLocalBlockOrder] = useState<string[]>(
        blocks.map(b => b.id)
    );

    // Lógica pura (compartilhada com versão pública)
    const progress = useMemo(
        () => computeProgress(currentStepNumber, totalSteps),
        [currentStepNumber, totalSteps]
    );

    const isValid = useMemo(
        () => validateAnswer(currentAnswers, data.requiredSelections),
        [currentAnswers, data.requiredSelections]
    );

    const handleOptionClick = (optionId: string) => {
        const isSelected = currentAnswers.includes(optionId);
        const maxSelections = data.requiredSelections;

        if (isSelected) {
            onAnswersChange(currentAnswers.filter(id => id !== optionId));
        } else if (currentAnswers.length < maxSelections) {
            onAnswersChange([...currentAnswers, optionId]);
        } else if (maxSelections === 1) {
            onAnswersChange([optionId]);

            // Auto-advance em modo editor (se habilitado)
            if (isEditable && enableAutoAdvance && onNext) {
                setTimeout(() => onNext(), 500);
            }
        }
    };

    // ✅ Drag & Drop handler (só no editor)
    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = localBlockOrder.indexOf(String(active.id));
        const newIndex = localBlockOrder.indexOf(String(over.id));

        if (oldIndex >= 0 && newIndex >= 0) {
            const newOrder = arrayMove(localBlockOrder, oldIndex, newIndex);
            setLocalBlockOrder(newOrder);

            // Notificar pai sobre nova ordem
            onBlocksReorder?.(data.id, newOrder);
            onEdit?.('blockOrder', newOrder);
        }
    };

    // Componente de bloco arrastável (só no editor)
    const SortableBlock: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.5 : 1,
        };

        return (
            <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                {children}
            </div>
        );
    };

    // Componente de bloco selecionável (só no editor)
    const SelectableBlock: React.FC<{
        blockId: string;
        blockType: string;
        children: React.ReactNode;
    }> = ({ blockId, blockType, children }) => {
        const isSelected = selectedBlockId === blockId;

        return (
            <div
                onClick={(e) => {
                    if (isEditable) {
                        e.stopPropagation();
                        onBlockSelect?.(blockId);
                    }
                }}
                onDoubleClick={(e) => {
                    if (isEditable) {
                        e.stopPropagation();
                        onOpenProperties?.(blockId);
                    }
                }}
                className={`
          relative group
          ${isEditable ? 'cursor-pointer' : ''}
          ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        `}
            >
                {/* Badge de tipo (só visível no editor) */}
                {isEditable && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        {blockType}
                    </div>
                )}

                {/* Botão de propriedades (só visível no editor) */}
                {isEditable && isSelected && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenProperties?.(blockId);
                        }}
                        className="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 z-10"
                    >
                        ⚙️ Editar
                    </button>
                )}

                {children}
            </div>
        );
    };

    // Renderizar blocos ordenados
    const orderedBlocks = useMemo(() => {
        return localBlockOrder
            .map(id => blocks.find(b => b.id === id))
            .filter(Boolean) as typeof blocks;
    }, [localBlockOrder, blocks]);

    // ✅ Renderização condicional: com ou sem DnD
    const renderContent = () => {
        const content = (
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
                {/* Progress Bar */}
                <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
                    <div
                        className="h-full bg-[#deac6d] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="container mx-auto px-4 py-8 max-w-3xl">
                    {orderedBlocks.map((block) => {
                        const BlockContent = () => {
                            switch (block.type) {
                                case 'question-header':
                                    return (
                                        <div className="mb-8">
                                            <div className="text-sm text-gray-500 mb-2">
                                                Pergunta {data.questionNumber} de {totalSteps}
                                            </div>
                                            <h2 className="text-3xl font-bold text-[#432818] mb-4">
                                                {data.questionText}
                                            </h2>
                                        </div>
                                    );

                                case 'options-grid':
                                    return (
                                        <div className={`grid gap-4 mb-8 ${data.options.length > 4 ? 'md:grid-cols-3' : 'md:grid-cols-2'
                                            }`}>
                                            {data.options.map((option) => {
                                                const isSelected = currentAnswers.includes(option.id);

                                                return (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => handleOptionClick(option.id)}
                                                        className={`
                              flex flex-col items-center p-6 border-2 rounded-xl
                              transition-all duration-200 hover:border-[#deac6d] hover:shadow-md
                              ${isSelected
                                                                ? 'border-[#5b4135] bg-gradient-to-br from-white to-[#f8f5f0] shadow-lg transform -translate-y-1'
                                                                : 'border-gray-200 bg-white'
                                                            }
                            `}
                                                    >
                                                        {option.image && (
                                                            <img
                                                                src={option.image}
                                                                alt={option.text}
                                                                className="rounded-lg w-full mb-4 object-cover max-h-48"
                                                            />
                                                        )}

                                                        <p className="text-center font-medium text-sm leading-relaxed text-[#432818]">
                                                            {option.text}
                                                        </p>

                                                        {isSelected && (
                                                            <div className="mt-3 w-6 h-6 bg-[#deac6d] rounded-full flex items-center justify-center">
                                                                <span className="text-white text-xs font-bold">✓</span>
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    );

                                case 'navigation-button':
                                    return (
                                        <div className="flex gap-4 justify-between">
                                            <button
                                                onClick={onPrev}
                                                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                ← Voltar
                                            </button>

                                            <button
                                                onClick={onNext}
                                                disabled={!isValid}
                                                className={`
                          px-8 py-3 rounded-lg font-medium transition-all
                          ${isValid
                                                        ? 'bg-[#deac6d] text-white hover:bg-[#5b4135] shadow-md'
                                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    }
                        `}
                                            >
                                                Continuar →
                                            </button>
                                        </div>
                                    );

                                default:
                                    return null;
                            }
                        };

                        // Wrapper de edição (só no editor)
                        if (isEditable) {
                            return (
                                <SortableBlock key={block.id} id={block.id}>
                                    <SelectableBlock blockId={block.id} blockType={block.type}>
                                        <BlockContent />
                                    </SelectableBlock>
                                </SortableBlock>
                            );
                        }

                        // Renderização simples (preview ou sem edição)
                        return <BlockContent key={block.id} />;
                    })}
                </div>
            </div>
        );

        // ✅ Wrappear com DnD context se editável
        if (isEditable) {
            return (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={localBlockOrder} strategy={verticalListSortingStrategy}>
                        {content}
                    </SortableContext>
                </DndContext>
            );
        }

        return content;
    };

    return renderContent();
}

// ❌ Bundle: ~580KB (com editor, com DnD, com callbacks)
// ❌ SSR: Não (client-only)
// ✅ Editor: Completo (drag & drop, seleção, propriedades)
// ✅ Funcionalidade: 100% (todas features de edição)
