/**
 * ❓ QUESTION STEP - MODULAR VERSION
 * 
 * Refatorado para usar blocos atômicos modulares
 * Reduzido de 129 linhas para ~80 linhas (-38%)
 */

import { useState } from 'react';
import type { QuizStep } from '../../data/quizSteps';
import { BlockRenderer } from '@/components/editor/blocks/BlockRenderer';
import { QUESTION_STEP_SCHEMA } from '@/data/stepBlockSchemas';

interface QuestionStepProps {
    data: QuizStep;
    currentAnswers: string[];
    onAnswersChange: (answers: string[]) => void;
    mode?: 'edit' | 'preview';
}

export default function QuestionStep({
    data,
    currentAnswers,
    onAnswersChange,
    mode = 'preview'
}: QuestionStepProps) {
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [blocks, setBlocks] = useState(QUESTION_STEP_SCHEMA.blocks);

    // Fallback seguro
    const safeOnAnswersChange = typeof onAnswersChange === 'function' ? onAnswersChange : () => {};
    const safeCurrentAnswers = currentAnswers || [];

    // Handler para seleção de opções
    const handleSelectionChange = (selectedIds: string[]) => {
        safeOnAnswersChange(selectedIds);
    };

    // Cálculo de progresso
    const progress = data.questionNumber 
        ? (parseInt(data.questionNumber.replace(/\D/g, '')) / 10) * 100
        : 0;

    // Context data para blocos dinâmicos
    const contextData = {
        questionNumber: data.questionNumber,
        questionText: data.questionText,
        requiredSelections: data.requiredSelections || 1,
        maxSelections: data.requiredSelections || 1,
        currentSelections: safeCurrentAnswers.length,
        options: data.options || [],
        canProceed: safeCurrentAnswers.length === (data.requiredSelections || 1),
        progress
    };

    // Handlers para blocos
    const handleBlockUpdate = (blockId: string, updates: any) => {
        setBlocks(prev =>
            prev.map(b => b.id === blockId ? { ...b, props: { ...b.props, ...updates } } : b)
        );
    };

    const handleBlockReorder = (blockId: string, direction: 'up' | 'down') => {
        setBlocks(prev => {
            const index = prev.findIndex(b => b.id === blockId);
            if (index === -1) return prev;

            const newIndex = direction === 'up' ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= prev.length) return prev;

            const newBlocks = [...prev];
            [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];

            return newBlocks.map((b, i) => ({ ...b, order: i }));
        });
    };

    return (
        <div className="bg-white px-1 pt-3 pb-5 sm:px-2 sm:pt-4 sm:pb-6 md:p-8 rounded-lg shadow-lg text-center max-w-6xl mx-auto">
            <div className="space-y-6">
                {blocks
                    .sort((a, b) => a.order - b.order)
                    .map(block => {
                        const blockProps = { ...block };

                        // Bloco de opções: passar handlers e dados
                        if (block.id === 'question-options') {
                            blockProps.props = {
                                ...block.props,
                                options: data.options || [],
                                selectedIds: safeCurrentAnswers,
                                onSelectionChange: handleSelectionChange,
                                maxSelections: data.requiredSelections || 1,
                                minSelections: data.requiredSelections || 1,
                                hasImages: data.options?.some(opt => !!opt.image) || true
                            };
                        }

                        return (
                            <BlockRenderer
                                key={block.id}
                                block={blockProps}
                                mode={mode}
                                isSelected={selectedBlockId === block.id}
                                onSelect={setSelectedBlockId}
                                onUpdate={handleBlockUpdate}
                                onDelete={(id) => setBlocks(prev => prev.filter(b => b.id !== id))}
                                onDuplicate={(id) => {
                                    const original = blocks.find(b => b.id === id);
                                    if (original) {
                                        setBlocks(prev => [...prev, { ...original, id: `${original.id}-copy-${Date.now()}` }]);
                                    }
                                }}
                                onReorder={handleBlockReorder}
                                contextData={contextData}
                            />
                        );
                    })}
            </div>
        </div>
    );
}