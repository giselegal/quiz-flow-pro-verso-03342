import React from 'react';
import type { Block } from '@/types/editor';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import type { BlockRendererCommonProps } from './QuizIntroHeaderBlock';

interface QuizOptionsBlockProps extends BlockRendererCommonProps {
    block: Block;
}

const QuizOptionsBlock: React.FC<QuizOptionsBlockProps> = ({ block, isSelected, isEditable, onSelect, onOpenProperties, contextData }) => {
    const props = block.properties || {};
    const content = (block as any).content || {};
    const options: Array<{ id: string; text: string; imageUrl?: string; value?: string }> = props.options || content.options || [];
    const currentAnswers: string[] = contextData?.currentAnswers || [];
    const onAnswersChange: ((answers: string[]) => void) | undefined = contextData?.onAnswersChange;

    const toggle = (id: string) => {
        if (!onAnswersChange) return;
        const exists = currentAnswers.includes(id);
        const next = exists ? currentAnswers.filter(a => a !== id) : [...currentAnswers, id];
        onAnswersChange(next);
    };

    return (
        <SelectableBlock
            blockId={block.id}
            isSelected={!!isSelected}
            isEditable={!!isEditable}
            onSelect={() => onSelect?.(block.id)}
            blockType="Quiz Options"
            onOpenProperties={() => onOpenProperties?.(block.id)}
            isDraggable={true}
        >
            <div className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mx-auto grid grid-cols-2 gap-2">
                {options.length === 0 && (
                    <div className="col-span-2 text-xs text-gray-400 text-center py-4">Sem opções configuradas</div>
                )}
                {options.map(opt => (
                    <button
                        key={opt.id}
                        type="button"
                        className={`border rounded-md p-2 text-sm transition ${currentAnswers.includes(opt.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                        onClick={() => toggle(opt.id)}
                    >
                        {opt.imageUrl && (
                            <img src={opt.imageUrl} alt={opt.text} className="w-full h-24 object-cover rounded" />
                        )}
                        <span className="block mt-1">{opt.text}</span>
                    </button>
                ))}
            </div>
        </SelectableBlock>
    );
};

export default React.memo(QuizOptionsBlock);
