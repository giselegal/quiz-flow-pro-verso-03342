import React from 'react';
import type { Block } from '@/types/editor';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import type { BlockRendererCommonProps } from './QuizIntroHeaderBlock';

interface ImageDisplayBlockProps extends BlockRendererCommonProps {
    block: Block;
}

const ImageDisplayBlock: React.FC<ImageDisplayBlockProps> = ({ block, isSelected, isEditable, onSelect, onOpenProperties }) => {
    const props = block.properties || {};
    const src: string = props.src || props.url || block.content?.url || '';
    const alt: string = props.alt || block.content?.alt || 'Imagem';
    const maxWidth: number = Number(props.maxWidth || 300);
    const aspectRatio: string = String(props.aspectRatio || '1.47');

    return (
        <SelectableBlock
            blockId={block.id}
            isSelected={!!isSelected}
            isEditable={!!isEditable}
            onSelect={() => onSelect?.(block.id)}
            blockType="Imagem Inline"
            onOpenProperties={() => onOpenProperties?.(block.id)}
            isDraggable={true}
        >
            <div className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mx-auto mt-6">
                <div className="w-full mx-auto flex justify-center">
                    <div className="overflow-hidden rounded-lg shadow-sm" style={{ aspectRatio, width: '100%', maxWidth: `${maxWidth}px` }}>
                        {src ? (
                            <img src={src} alt={alt} className="w-full h-full object-contain" />
                        ) : (
                            <div className="w-full h-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs">Imagem</div>
                        )}
                    </div>
                </div>
            </div>
        </SelectableBlock>
    );
};

export default React.memo(ImageDisplayBlock);
