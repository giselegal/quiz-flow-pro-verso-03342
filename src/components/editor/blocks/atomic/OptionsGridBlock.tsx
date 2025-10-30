import React from 'react';
import type { Block } from '@/types/editor';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import { useResultOptional } from '@/contexts/ResultContext';

interface OptionsGridBlockProps {
    block: Block;
    isSelected?: boolean;
    isEditable?: boolean;
    onSelect?: (blockId: string) => void;
    onOpenProperties?: (blockId: string) => void;
    contextData?: Record<string, any>;
}

const OptionsGridBlock: React.FC<OptionsGridBlockProps> = ({ block, isSelected, isEditable, onSelect, onOpenProperties, contextData }) => {
    const ensureArray = <T,>(val: unknown): T[] => Array.isArray(val) ? (val as T[]) : [];
    const props = block?.properties || {};
    const content = (block as any)?.content || {};
    // Normalizar opções aceitando alias 'image' -> 'imageUrl'
    const rawOptions = ensureArray<{ id: string; text: string; imageUrl?: string; image?: string; value?: string }>(props.options || content.options);
    const options = rawOptions.map(opt => ({
        ...opt,
        imageUrl: opt.imageUrl || (opt as any).image || undefined,
    }));
    const currentAnswers = ensureArray<string>(contextData?.currentAnswers);
    const onAnswersChange: ((answers: string[]) => void) | undefined = contextData?.onAnswersChange;
    const result = useResultOptional();

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
                        <span className="block mt-1">{result ? result.interpolateText(opt.text) : opt.text}</span>
                    </button>
                ))}
            </div>
        </SelectableBlock>
    );
};

export default React.memo(OptionsGridBlock);
