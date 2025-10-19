import React from 'react';
import type { Block } from '@/types/editor';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import type { BlockRendererCommonProps } from './QuizIntroHeaderBlock';
import { useResultOptional } from '@/contexts/ResultContext';

interface ButtonInlineBlockProps extends BlockRendererCommonProps {
    block: Block;
}

const ButtonInlineBlock: React.FC<ButtonInlineBlockProps> = ({ block, isSelected, isEditable, onSelect, onOpenProperties, contextData }) => {
    const props = block.properties || {};
    const text: string = props.text || block.content?.buttonText || 'Clique aqui';
    const onClick: (() => void) | undefined = contextData?.onClick;
    const result = useResultOptional();
    const label = result ? result.interpolateText(text) : text;

    return (
        <SelectableBlock
            blockId={block.id}
            isSelected={!!isSelected}
            isEditable={!!isEditable}
            onSelect={() => onSelect?.(block.id)}
            blockType="Botão Inline"
            onOpenProperties={() => onOpenProperties?.(block.id)}
            isDraggable={true}
        >
            <div className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mx-auto">
                <button
                    type="button"
                    className="w-full py-3 px-4 text-base font-semibold rounded-md shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:ring-offset-2 bg-[#B89B7A] text-white hover:bg-[#A1835D] hover:shadow-lg"
                    onClick={onClick}
                >
                    {label}
                </button>
            </div>
        </SelectableBlock>
    );
};

export default React.memo(ButtonInlineBlock);
