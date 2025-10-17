import React from 'react';
import type { Block } from '@/types/editor';
import QuizIntroHeaderBlock from './blocks/QuizIntroHeaderBlock';
import TextInlineBlock from './blocks/TextInlineBlock';
import ImageDisplayBlock from './blocks/ImageDisplayBlock';
import QuizOptionsBlock from './blocks/QuizOptionsBlock';
import ButtonInlineBlock from './blocks/ButtonInlineBlock';
import FormInputBlock from './blocks/FormInputBlock';

export interface BlockRendererProps {
    block: Block;
    isSelected?: boolean;
    isEditable?: boolean;
    onSelect?: (blockId: string) => void;
    onOpenProperties?: (blockId: string) => void;
    contextData?: Record<string, any>;
}

const GenericBlock: React.FC<BlockRendererProps> = ({ block, isSelected, isEditable, onSelect, onOpenProperties }) => {
    const id = block?.id || 'unknown';
    const type = block?.type || 'unknown';
    return (
        <div
            className={`p-3 border rounded bg-white ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
            onClick={() => onSelect?.(id)}
            role="group"
            aria-label={`Bloco ${type}`}
        >
            <div className="text-xs text-gray-500 mb-1">{type}</div>
            <pre className="text-[10px] text-gray-400 overflow-auto max-h-40">{JSON.stringify(block.properties || {}, null, 2)}</pre>
            {isEditable && (
                <button
                    type="button"
                    className="mt-2 text-xs text-blue-600 underline"
                    onClick={(e) => { e.stopPropagation(); onOpenProperties?.(id); }}
                >
                    Abrir propriedades
                </button>
            )}
        </div>
    );
};

export const BlockTypeRenderer: React.FC<BlockRendererProps> = ({ block, ...rest }) => {
    switch (String(block.type)) {
        case 'quiz-intro-header':
            return <QuizIntroHeaderBlock block={block} {...rest} />;
        case 'text-inline':
            return <TextInlineBlock block={block} {...rest} />;
        case 'image-display-inline':
        case 'image-inline':
        case 'image':
            return <ImageDisplayBlock block={block} {...rest} />;
        case 'form-input':
        case 'input-field':
            return <FormInputBlock block={block} {...rest} />;
        case 'button-inline':
        case 'button':
            return <ButtonInlineBlock block={block} {...rest} />;
        case 'quiz-options':
        case 'options-grid':
            return <QuizOptionsBlock block={block} {...rest} />;
        default:
            return <GenericBlock block={block} {...rest} />;
    }
};

export default React.memo(BlockTypeRenderer);
