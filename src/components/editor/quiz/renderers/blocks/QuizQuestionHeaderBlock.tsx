import React from 'react';
import type { Block } from '@/types/editor';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import { useResultOptional } from '@/contexts/ResultContext';

export interface BlockRendererCommonProps {
    isSelected?: boolean;
    isEditable?: boolean;
    onSelect?: (blockId: string) => void;
    onOpenProperties?: (blockId: string) => void;
    contextData?: Record<string, any>;
}

interface QuizQuestionHeaderRendererProps extends BlockRendererCommonProps {
    block: Block;
}

const QuizQuestionHeaderBlock: React.FC<QuizQuestionHeaderRendererProps> = ({ block, isSelected, isEditable, onSelect, onOpenProperties }) => {
    const props = block.properties || {};
    const content = (block as any).content || {};
    const questionNumber: number = Number(props.questionNumber ?? content.currentQuestion ?? 1);
    const totalQuestions: number = Number(props.totalQuestions ?? content.totalQuestions ?? 21);
    const questionTextRaw: string = String(props.questionText ?? content.questionText ?? 'Qual é a sua preferência?');
    const showProgress: boolean = Boolean(props.showProgress ?? content.showProgress ?? true);
    const result = useResultOptional();
    const questionText = result ? result.interpolateText(questionTextRaw) : questionTextRaw;

    return (
        <SelectableBlock
            blockId={block.id}
            isSelected={!!isSelected}
            isEditable={!!isEditable}
            onSelect={() => onSelect?.(block.id)}
            blockType="Cabeçalho da Pergunta"
            onOpenProperties={() => onOpenProperties?.(block.id)}
            isDraggable={true}
        >
            <div className="w-full max-w-6xl mx-auto px-4">
                {showProgress && (
                    <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                            <div
                                className="bg-[#deac6d] h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${Math.round((questionNumber / totalQuestions) * 100)}%` }}
                            />
                        </div>
                        <p className="text-sm text-center text-gray-600">Progresso: {Math.round((questionNumber / totalQuestions) * 100)}%</p>
                    </div>
                )}

                <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#432818]">
                    Pergunta {questionNumber}
                </h2>
                <p className="text-xl md:text-2xl font-bold text-[#deac6d] mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {questionText}
                </p>
            </div>
        </SelectableBlock>
    );
};

export default React.memo(QuizQuestionHeaderBlock);
