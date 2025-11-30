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
    const maxWidthRaw: any = props.maxWidth || 300;
    const maxWidth: string = typeof maxWidthRaw === 'string' ? maxWidthRaw : `${Number(maxWidthRaw)}px`;
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
                    <div className="overflow-hidden rounded-lg shadow-sm" style={{ aspectRatio, width: '100%', maxWidth }}>
                        {src ? (
                            <img src={src} alt={alt} className="w-full h-full object-contain" />
                        ) : (
                            <div className="w-full h-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs">
                                <div className="flex flex-col items-center gap-2">
                                    <span>Imagem</span>
                                    <button
                                        onClick={() => onOpenProperties?.(block.id)}
                                        className="px-2 py-1 text-[10px] bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Escolher imagem
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SelectableBlock>
    );
};

export default React.memo(ImageDisplayBlock);
