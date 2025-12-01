/**
 * 🎨 Canvas - Coluna 3: Área de Edição (Principal)
 * 
 * Funcionalidades:
 * - Renderizar blocos do step selecionado
 * - Selecionar blocos (onclick)
 * - Drop zone para DnD (Fase 3)
 * - Visual de bloco selecionado
 * 
 * ✅ AUDIT: Optimized with React.memo and useCallback
 */

import React, { memo, useCallback, useMemo } from 'react';
import { useQuizStore } from '../store/quizStore';
import { useEditorStore } from '../store/editorStore';
import type { QuizBlock } from '@/schemas/quiz-schema.zod';
import { computeQuizResult, type Answer, type Rule, type CalculationConfig } from '../utils/calculationEngine';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ValidationPanel from '../components/ValidationPanel';

// ✅ AUDIT: Debug logging only in development
const DEBUG = import.meta.env.DEV && true; // Set to true to enable debug logs

export const Canvas = memo(function Canvas() {
    const quiz = useQuizStore((state) => state.quiz);
    const selectedStepId = useEditorStore((state) => state.selectedStepId);
    const selectedBlockId = useEditorStore((state) => state.selectedBlockId);
    const selectBlock = useEditorStore((state) => state.selectBlock);

    // ✅ AUDIT: Memoize step lookup to prevent unnecessary recalculations
    const selectedStep = useMemo(() => {
        return quiz?.steps?.find((step: any) => step.id === selectedStepId);
    }, [quiz?.steps, selectedStepId]);

    // ✅ AUDIT: Conditional debug logging
    if (DEBUG) {
        console.log('🎨 Canvas render:', {
            hasQuiz: !!quiz,
            totalSteps: quiz?.steps?.length,
            selectedStepId,
            selectedStep: selectedStep?.id,
            blocksCount: selectedStep?.blocks?.length,
            blocks: selectedStep?.blocks,
            firstBlock: selectedStep?.blocks?.[0],
        });
    }

    // 🔍 DIAGNÓSTICO: Log crítico de renderização
    console.log('🔍 Canvas DIAGNÓSTICO:', {
        '1_temQuiz': !!quiz,
        '2_temSteps': !!quiz?.steps,
        '3_quantosSteps': quiz?.steps?.length || 0,
        '4_stepSelecionado': selectedStepId,
        '5_stepEncontrado': !!selectedStep,
        '6_stepId': selectedStep?.id,
        '7_temBlocks': !!selectedStep?.blocks,
        '8_quantosBlocks': selectedStep?.blocks?.length || 0,
        '9_primeiroBloco': selectedStep?.blocks?.[0] ? {
            id: selectedStep.blocks[0].id,
            type: selectedStep.blocks[0].type,
            hasProperties: !!selectedStep.blocks[0].properties
        } : null
    });

    // ✅ AUDIT: Memoize select handler
    const handleSelectBlock = useCallback((blockId: string) => {
        selectBlock(blockId);
    }, [selectBlock]);

    return (
        <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden">
            {/* Toolbar do Canvas */}
            <CanvasToolbar selectedStep={selectedStep} />

            {/* Área de renderização de blocos */}
            <div className="flex-1 overflow-y-auto p-6">
                {!selectedStep ? (
                    <EmptyState message="Selecione uma etapa no painel esquerdo" />
                ) : !selectedStep.blocks || selectedStep.blocks.length === 0 ? (
                    <EmptyState message="Esta etapa não possui blocos. Arraste um bloco da biblioteca." />
                ) : (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <ValidationPanel />
                        <ResultPreview />
                        <CanvasSortable
                            stepId={selectedStep.id}
                            blocks={selectedStep.blocks}
                            selectedBlockId={selectedBlockId}
                            onSelect={handleSelectBlock}
                        />
                    </div>
                )}
            </div>
        </div>
    );
});

// ✅ AUDIT: Memoized toolbar component
const CanvasToolbar = memo(function CanvasToolbar({ selectedStep }: { selectedStep: any }) {
    return (
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <div>
                {selectedStep ? (
                    <>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {selectedStep.title || 'Sem título'}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Etapa {selectedStep.order} • {selectedStep.blocks?.length || 0} blocos
                        </p>
                    </>
                ) : (
                    <p className="text-sm text-gray-500">Selecione uma etapa para começar</p>
                )}
            </div>

            {/* Ações rápidas */}
            <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    👁️ Preview
                </button>
                <button className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    ↩️ Desfazer
                </button>
            </div>
        </div>
    );
});

// ✅ AUDIT: Memoized empty state component
const EmptyState = memo(function EmptyState({ message }: { message: string }) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'empty-canvas-drop-zone',
    });

    return (
        <div
            ref={setNodeRef}
            className={`
                h-full flex items-center justify-center
                transition-all duration-200
                ${isOver ? 'bg-blue-50 border-2 border-dashed border-blue-400' : ''}
            `}
        >
            <div className="text-center">
                <div className="text-6xl mb-4">
                    {isOver ? '📥' : '📋'}
                </div>
                <p className={`text-gray-500 ${isOver ? 'text-blue-600 font-medium' : ''}`}>
                    {isOver ? 'Solte aqui para adicionar' : message}
                </p>
            </div>
        </div>
    );
});

// ✅ AUDIT: Memoized block preview component
interface BlockPreviewProps {
    block: QuizBlock;
    isSelected: boolean;
    onClick: () => void;
}

const BlockPreview = memo(function BlockPreview({ block, isSelected, onClick }: BlockPreviewProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: block.id,
        data: {
            block,
            isExisting: true,
        },
    });

    const style = useMemo(() => ({
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }), [transform, transition, isDragging]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            onClick={onClick}
            className={`
        p-4 bg-white rounded-lg border-2 cursor-pointer
        transition-all duration-150
        ${isSelected
                    ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                }
        ${isDragging ? 'shadow-2xl ring-4 ring-blue-400' : ''}
      `}
        >
            {/* Handle de Drag (só aparece quando hover) */}
            <div
                {...listeners}
                className="flex items-center gap-2 mb-2 opacity-0 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
            >
                <div className="flex gap-1">
                    <div className="w-1 h-4 bg-gray-300 rounded"></div>
                    <div className="w-1 h-4 bg-gray-300 rounded"></div>
                    <div className="w-1 h-4 bg-gray-300 rounded"></div>
                </div>
                <span className="text-xs text-gray-400">Arrastar para reordenar</span>
            </div>
            {/* Header do bloco */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-400">{block.type}</span>
                    {block.id && (
                        <span className="text-xs text-gray-400">#{block.id}</span>
                    )}
                </div>
                {isSelected && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                        Selecionado
                    </span>
                )}
            </div>

            {/* Toolbar de ações quando selecionado */}
            {isSelected && (
                <div className="mb-3 flex items-center gap-2">
                    <BlockActions block={block} />
                </div>
            )}

            {/* Conteúdo do bloco (preview com suporte básico por tipo) */}
            <div className="space-y-2">
                {/* Título */}
                {block.properties?.title && (
                    <h3 className="text-base font-semibold text-gray-900">
                        {block.properties.title}
                    </h3>
                )}

                {/* Subtítulo */}
                {block.properties?.subtitle && (
                    <p className="text-sm text-gray-600">
                        {block.properties.subtitle}
                    </p>
                )}

                {/* Descrição */}
                {block.properties?.description && (
                    <p className="text-sm text-gray-500">
                        {block.properties.description}
                    </p>
                )}

                {/* Opções (para perguntas) */}
                {block.properties?.options && Array.isArray(block.properties.options) && (
                    <div className="mt-3 space-y-1">
                        {block.properties.options.slice(0, 3).map((option: any, idx: number) => (
                            <div key={idx} className="p-2 bg-gray-50 rounded text-sm text-gray-700">
                                {option.label || option.text || 'Opção'}
                            </div>
                        ))}
                        {block.properties.options.length > 3 && (
                            <p className="text-xs text-gray-400">
                                +{block.properties.options.length - 3} opções
                            </p>
                        )}
                    </div>
                )}

                {/* Imagem */}
                {block.properties?.src && (
                    <div className="mt-2">
                        <img
                            src={block.properties.src}
                            alt={block.properties.alt || ''}
                            className="max-w-full rounded"
                        />
                    </div>
                )}

                {/* Badge do tipo */}
                <div className="pt-2 mt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-400">
                        Ordem: {block.order}
                    </span>
                </div>
            </div>
        </div>
    );
});

// ✅ AUDIT: Memoized block actions component
const BlockActions = memo(function BlockActions({ block }: { block: QuizBlock }) {
    const selectedStepId = useEditorStore((state) => state.selectedStepId);
    const deleteBlock = useQuizStore((s) => s.deleteBlock);
    const reorderBlocks = useQuizStore((s) => s.reorderBlocks);

    const duplicate = useCallback(() => {
        if (!selectedStepId) return;
        const duplicateBlock = useQuizStore.getState().duplicateBlock;
        duplicateBlock(selectedStepId, block.id);
    }, [selectedStepId, block.id]);

    const remove = useCallback(() => {
        if (!selectedStepId) return;
        deleteBlock(selectedStepId, block.id);
    }, [selectedStepId, block.id, deleteBlock]);

    const moveUp = useCallback(() => {
        if (!selectedStepId) return;
        const quiz = useQuizStore.getState().quiz;
        const step = quiz?.steps?.find((s: any) => s.id === selectedStepId);
        if (!step) return;
        const idx = step.blocks.findIndex((b: any) => b.id === block.id);
        if (idx <= 0) return;
        reorderBlocks(selectedStepId, idx, idx - 1);
    }, [selectedStepId, block.id, reorderBlocks]);

    const moveDown = useCallback(() => {
        if (!selectedStepId) return;
        const quiz = useQuizStore.getState().quiz;
        const step = quiz?.steps?.find((s: any) => s.id === selectedStepId);
        if (!step) return;
        const idx = step.blocks.findIndex((b: any) => b.id === block.id);
        if (idx === -1 || idx >= step.blocks.length - 1) return;
        reorderBlocks(selectedStepId, idx, idx + 1);
    }, [selectedStepId, block.id, reorderBlocks]);

    if (!selectedStepId) return null;

    return (
        <div className="flex items-center gap-2">
            <button className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded" onClick={duplicate}>Duplicar</button>
            <button className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded" onClick={moveUp}>↑ Mover</button>
            <button className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded" onClick={moveDown}>↓ Mover</button>
            <button className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded" onClick={remove}>Excluir</button>
        </div>
    );
});

// ✅ AUDIT: Memoized result preview component
const ResultPreview = memo(function ResultPreview() {
    const quiz = useQuizStore((s) => s.quiz);

    // ✅ AUDIT: Memoize complex computation
    const result = useMemo(() => {
        if (!quiz) return null;

        try {
            // Derivar respostas reais dos blocos: busca por propriedades padrão de resposta
            const answers: Answer[] = [];
            const rules: Record<string, Rule> = {};
            const config: CalculationConfig = {
                categoryThresholds: [
                    { label: 'Baixo', min: 0, max: 10 },
                    { label: 'Médio', min: 11, max: 25 },
                    { label: 'Alto', min: 26, max: 100 },
                ]
            };

            (quiz.steps || []).forEach((step: any) => {
                (step.blocks || []).forEach((b: any) => {
                    const val = b.selectedOption?.value ?? b.value ?? b.answer ?? b.properties?.value ?? b.properties?.selectedOption?.value;
                    if (val !== undefined && val !== null) {
                        answers.push({ blockId: b.id, value: val });
                        // Usar regra configurada ou fallback padrão
                        if (b.calculationRule) {
                            rules[b.id] = b.calculationRule;
                        } else if (typeof val === 'number') {
                            rules[b.id] = { weight: 1, numericScale: { mul: 1 } };
                        } else {
                            rules[b.id] = { weight: 1, pointsMap: { [String(val)]: 1 } };
                        }
                    }
                });
            });

            return computeQuizResult(quiz as any, answers, rules, config);
        } catch (error) {
            if (DEBUG) {
                console.error('❌ Erro no ResultPreview:', error);
            }
            return null;
        }
    }, [quiz]);

    if (!result) return null;

    return (
        <div className="bg-white border border-gray-200 rounded p-3 flex items-center justify-between">
            <div className="text-sm text-gray-700">
                <span className="font-medium">Resultado:</span>
                <span className="ml-2">Score total {result.totalScore}</span>
                {result.category && <span className="ml-2">• Categoria {result.category}</span>}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
                {result.byStep.map((s) => (
                    <span key={s.stepId}>Etapa {s.stepId}: {s.score}</span>
                ))}
            </div>
        </div>
    );
});

// ✅ AUDIT: Memoized sortable container
interface CanvasSortableProps {
    stepId: string;
    blocks: any[];
    selectedBlockId?: string | null;
    onSelect: (id: string) => void;
}

const CanvasSortable = memo(function CanvasSortable({ stepId, blocks, selectedBlockId, onSelect }: CanvasSortableProps) {
    // ✅ AUDIT: Memoize block IDs array
    const blockIds = useMemo(() => blocks.map((block) => block.id), [blocks]);

    if (!blocks || blocks.length === 0) {
        if (DEBUG) {
            console.warn('⚠️ CanvasSortable: Nenhum bloco para renderizar!');
        }
        return <div className="p-4 text-center text-gray-500">Nenhum bloco encontrado</div>;
    }

    return (
        <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
                {blocks.map((block: any) => (
                    <BlockPreview
                        key={block.id}
                        block={block}
                        isSelected={selectedBlockId === block.id}
                        onClick={() => onSelect(block.id)}
                    />
                ))}
            </div>
        </SortableContext>
    );
});
