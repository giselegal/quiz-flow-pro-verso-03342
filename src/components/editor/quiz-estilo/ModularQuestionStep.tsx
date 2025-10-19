import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import type { BlockComponent } from '@/components/editor/quiz/types';
import type { Block } from '@/types/editor';
import { BlockTypeRenderer } from '@/components/editor/quiz/renderers/BlockTypeRenderer';
import { cn } from '@/lib/utils';
import { blockComponentsToBlocks, convertTemplateToBlocks } from '@/utils/templateConverter';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { Question } from '@/core/domains/quiz/entities/Question';
import { Answer } from '@/core/domains/quiz/entities/Answer';
import { templateLoader } from '@/services/TemplateLoader';

interface ModularQuestionStepProps {
    data: any;
    blocks?: Block[]; // NOVO: suportar blocos reais
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
    blocks = [],
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

    // Estado local para feedback de validação (fallback UI)
    const [validationMessage, setValidationMessage] = React.useState<string | null>(null);

    const hasImages = !!(safeData.options[0]?.image || safeData.options[0]?.imageUrl);
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
    // Passo atual real do quiz (parse do id ex.: "step-02") para navegação global
    const currentStepReal = React.useMemo(() => {
        try {
            const id = String(data?.id || '');
            const n = parseInt(id.replace(/\D/g, ''), 10);
            return isNaN(n) ? undefined : n;
        } catch {
            return undefined;
        }
    }, [data?.id]);

    const emitNavigate = (target: number) => {
        try {
            window.dispatchEvent(new CustomEvent('quiz-navigate-to-step', {
                detail: { step: target, stepId: `step-${String(target).padStart(2, '0')}`, source: 'modular-question-step' }
            }));
        } catch { }
    };

    // ===== Integração: construir Question do domínio a partir dos dados do step =====
    const domainQuestion = React.useMemo(() => {
        const qType: Question['type'] = safeData.requiredSelections > 1 ? 'multiple-choice' : 'single-choice';
        const qOptions = (safeData.options || []).map((o: any) => ({
            id: String(o.id),
            text: String(o.text ?? o.label ?? o.id),
            value: String(o.value ?? o.id),
            // Se houver peso opcional vindo do template, preserve
            weight: typeof o.weight === 'number' ? o.weight : undefined,
            image: o.image || o.imageUrl,
        }));
        const logic = (data?.logic && typeof data.logic === 'object') ? data.logic : undefined;
        return new Question(
            String(data?.id || `step-${stepNumber.toString().padStart(2, '0')}`),
            qType,
            String(safeData.questionText),
            undefined,
            qOptions,
            undefined,
            { required: true },
            logic as any,
            {
                order: stepNumber || 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?.id, data?.logic, safeData.requiredSelections, safeData.questionText, JSON.stringify(safeData.options)]);

    // Helper: validar seleção atual contra a Question do domínio
    const validateCurrentAnswer = React.useCallback((): { ok: boolean; message?: string } => {
        // Regra de contagem mínima/exata
        if (safeData.requiredSelections > 1) {
            if (currentAnswers.length < safeData.requiredSelections) {
                return { ok: false, message: `Selecione mais ${safeData.requiredSelections - currentAnswers.length}` };
            }
        } else {
            if (currentAnswers.length !== 1) {
                return { ok: false, message: 'Selecione uma opção' };
            }
        }

        // Validar contra o domínio
        const ans = new Answer(
            `${domainQuestion.id}-attempt`,
            domainQuestion.id,
            'participant-temp',
            safeData.requiredSelections > 1 ? [...currentAnswers] : currentAnswers[0] || '',
            { submittedAt: new Date(), timeSpent: 0, attemptNumber: 1 }
        );
        const res = ans.validateAgainst(domainQuestion);
        if (!res.isValid) {
            return { ok: false, message: res.message || 'Resposta inválida' };
        }
        return { ok: true };
    }, [currentAnswers, domainQuestion, safeData.requiredSelections]);

    // Navegar respeitando lógica skipTo quando definida
    const navigateWithLogic = React.useCallback(() => {
        const valid = validateCurrentAnswer();
        if (!valid.ok) {
            setValidationMessage(valid.message || 'Resposta inválida');
            // Disparar evento global opcional para UI
            try {
                window.dispatchEvent(new CustomEvent('quiz-validation-error', { detail: { stepId: domainQuestion.id, message: valid.message } }));
            } catch { }
            return;
        }

        setValidationMessage(null);

        // Skip condicional (apenas quando seleção única faz sentido)
        if (domainQuestion?.logic?.skipTo && currentAnswers.length > 0) {
            const selected = currentAnswers[0];
            const targetId = domainQuestion.getNextQuestionId(String(selected));
            if (targetId) {
                const n = parseInt(String(targetId).replace(/\D/g, ''), 10);
                if (!isNaN(n)) {
                    emitNavigate(n);
                    return;
                }
            }
        }

        // Fallback: próximo step sequencial
        if (typeof currentStepReal === 'number') emitNavigate(currentStepReal + 1);
    }, [currentAnswers, currentStepReal, domainQuestion, validateCurrentAnswer]);

    // ===== DnD - Reordenação dos blocos (sem o progress) =====
    const stepId = data?.id || 'step-question';

    // Fallback: carregar blocos do template v3 quando props.blocks vier vazio
    const [fallbackBlocks, setFallbackBlocks] = React.useState<Block[]>([]);
    const effectiveBlocks = React.useMemo(() => (Array.isArray(blocks) && blocks.length > 0) ? blocks : fallbackBlocks, [blocks, fallbackBlocks]);
    React.useEffect(() => {
        if (Array.isArray(blocks) && blocks.length > 0) return;
        const match = String(data?.id || '').match(/step-\d{2}/);
        const stepKey = match ? match[0] : 'step-02';
        const funnelId = data?.funnelId || data?.funnel_id || undefined;
        let disposed = false;

        const applyBlocks = (components: BlockComponent[] | undefined | null) => {
            if (disposed || !components || components.length === 0) return;
            const asBlocks = blockComponentsToBlocks(components);
            if (asBlocks.length > 0) {
                setFallbackBlocks(asBlocks);
            }
        };

        try {
            const sync = templateLoader.getTemplateSync(stepKey, { funnelId });
            if (sync?.blocks?.length) {
                applyBlocks(sync.blocks);
            } else {
                const staticComponents = convertTemplateToBlocks(QUIZ_STYLE_21_STEPS_TEMPLATE[stepKey]);
                applyBlocks(staticComponents);
            }
        } catch { /* noop */ }

        templateLoader.getTemplate(stepKey, { funnelId }).then(result => {
            applyBlocks(result.blocks);
        }).catch(() => {
            const staticComponents = convertTemplateToBlocks(QUIZ_STYLE_21_STEPS_TEMPLATE[stepKey]);
            applyBlocks(staticComponents);
        });

        return () => {
            disposed = true;
        };
    }, [data?.id, blocks, data?.funnelId, data?.funnel_id]);

    const hasRealBlocks = Array.isArray(effectiveBlocks) && effectiveBlocks.length > 0;
    const topLevelBlocks: Block[] = React.useMemo(() => {
        if (!hasRealBlocks) return [];
        const all = (effectiveBlocks as Block[]);
        // Conjunto de tipos relevantes para perguntas (inclui options-grid e navegação)
        const relevantTypes = new Set([
            'question-progress', 'question-number', 'question-text', 'question-instructions',
            'options-grid', 'quiz-options', 'question-navigation', 'quiz-navigation', 'button-inline'
        ]);
        // 1) Tente extrair diretamente blocos relevantes dentre TODOS (inclui filhos)
        const relevant = all.filter(b => relevantTypes.has(String((b as any).type || '').toLowerCase()));
        if (relevant.length > 0) {
            if (import.meta?.env?.DEV) {
                try {
                    console.log('🔎 [ModularQuestionStep] Relevant blocks', {
                        count: relevant.length,
                        types: relevant.map(r => String((r as any).type || '').toLowerCase())
                    });
                } catch { /* noop */ }
            }
            return relevant.sort((a, b) => (a.order || 0) - (b.order || 0));
        }
        // 2) Caso contrário, use a estratégia anterior: top-level ou todos
        const topOnly = all.filter(b => !('parentId' in (b as any)) || !(b as any).parentId);
        const list = topOnly.length > 0 ? topOnly : all;
        if (import.meta?.env?.DEV) {
            try {
                console.log('🔎 [ModularQuestionStep] Top-level/all blocks used', {
                    count: list.length,
                    types: list.map(r => String((r as any).type || '').toLowerCase())
                });
            } catch { /* noop */ }
        }
        return list.sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [effectiveBlocks, hasRealBlocks]);
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
            // Persistir no estado do editor/template
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

    // Render com blocos reais se disponíveis
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

        // Fallback: se nenhum bloco options-grid/quix-options for encontrado, injetar um bloco sintético com base em safeData
        const hasOptionsGridBlock = topLevelBlocks.some(b => ['options-grid', 'quiz-options'].includes(String((b as any).type || '').toLowerCase()));
        const renderBlocks: Block[] = hasOptionsGridBlock ? topLevelBlocks : [
            ...topLevelBlocks,
            {
                id: `${stepId}-synthetic-options` as any,
                type: 'options-grid' as any,
                order: (topLevelBlocks[topLevelBlocks.length - 1]?.order || 0) + 1,
                properties: {
                    options: safeData.options,
                    columns: hasImages ? 2 : 1,
                    multipleSelection: safeData.requiredSelections > 1,
                    maxSelections: safeData.requiredSelections,
                    requiredSelections: safeData.requiredSelections,
                    showImages: hasImages
                },
                content: {}
            } as any
        ];

        if (import.meta?.env?.DEV) {
            try {
                console.log('🔎 [ModularQuestionStep] Render blocks', {
                    injectedSynthetic: !hasOptionsGridBlock,
                    count: renderBlocks.length,
                    types: renderBlocks.map(r => String((r as any).type || '').toLowerCase())
                });
            } catch { /* noop */ }
        }

        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={renderBlocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                        {renderBlocks.map((block, index) => (
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
                                            currentAnswers,
                                            onAnswersChange,
                                            requiredSelections: safeData.requiredSelections,
                                            canProceed,
                                            onNext: () => navigateWithLogic(),
                                            onPrev: () => {
                                                if (typeof currentStepReal === 'number') emitNavigate(currentStepReal - 1);
                                            },
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

    // Fallback legado (layout hard-coded)
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
                                                    onClick={() => navigateWithLogic()}
                                                >
                                                    {canProceed ? 'Avançando...' : 'Próxima'}
                                                </button>
                                                {validationMessage && (
                                                    <p className="mt-2 text-sm text-red-600" role="alert" aria-live="polite">{validationMessage}</p>
                                                )}
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