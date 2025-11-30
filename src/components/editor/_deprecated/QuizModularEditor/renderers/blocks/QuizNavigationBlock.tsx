import React from 'react';
import type { Block } from '@/types/editor';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import type { BlockRendererCommonProps } from './QuizIntroHeaderBlock';
import { useResultOptional } from '@/contexts/ResultContext';

interface QuizNavigationBlockProps extends BlockRendererCommonProps {
    block: Block;
}

const QuizNavigationBlock: React.FC<QuizNavigationBlockProps> = ({ block, isSelected, isEditable, onSelect, onOpenProperties, contextData }) => {
    const props = block.properties || {};
    const nextTextRaw: string = props.nextText || 'Próxima';
    const prevTextRaw: string = props.prevText || 'Voltar';
    const canProceed: boolean = Boolean(contextData?.canProceed ?? true);
    const result = useResultOptional();
    const nextText = result ? result.interpolateText(nextTextRaw) : nextTextRaw;
    const prevText = result ? result.interpolateText(prevTextRaw) : prevTextRaw;

    const onNext = () => {
        contextData?.onNext?.();
    };
    const onPrev = () => {
        contextData?.onPrev?.();
    };

    return (
        <SelectableBlock
            blockId={block.id}
            isSelected={!!isSelected}
            isEditable={!!isEditable}
            onSelect={() => onSelect?.(block.id)}
            blockType="Quiz Navigation"
            onOpenProperties={() => onOpenProperties?.(block.id)}
            isDraggable={true}
        >
            <div className="flex items-center justify-center gap-3">
                <button type="button" className="py-2 px-4 rounded border text-sm" onClick={onPrev}>
                    {prevText}
                </button>
                <button
                    type="button"
                    disabled={!canProceed}
                    className={`py-2 px-4 rounded text-sm shadow ${canProceed ? 'bg-[#deac6d] text-white' : 'bg-[#e6ddd4] text-[#8a7663] opacity-50 cursor-not-allowed'}`}
                    onClick={onNext}
                >
                    {canProceed ? nextText : nextText}
                </button>
            </div>
        </SelectableBlock>
    );
};

export default React.memo(QuizNavigationBlock);
