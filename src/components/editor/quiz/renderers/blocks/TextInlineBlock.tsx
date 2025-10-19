import React from 'react';
import type { Block } from '@/types/editor';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import { useResultOptional } from '@/contexts/ResultContext';

import type { BlockRendererCommonProps } from './QuizIntroHeaderBlock';

interface TextInlineBlockProps extends BlockRendererCommonProps {
    block: Block;
}

const TextInlineBlock: React.FC<TextInlineBlockProps> = ({ block, isSelected, isEditable, onSelect, onOpenProperties }) => {
    const props = block.properties || {};
    // Resolver conteúdo de múltiplas fontes para compatibilidade com v3/legacy/modular
    const resolveContent = (): string => {
        const propsContent = (props as any)?.content;
        if (typeof propsContent === 'string' && propsContent) return propsContent;
        if (propsContent && typeof propsContent === 'object') {
            if (typeof propsContent.text === 'string' && propsContent.text) return propsContent.text;
            if (typeof propsContent.content === 'string' && propsContent.content) return propsContent.content;
        }

        const c: any = (block as any).content;
        if (c && typeof c === 'object') {
            if (typeof c.text === 'string' && c.text) return c.text;
            if (typeof c.content === 'string' && c.content) return c.content;
        }
        if (typeof c === 'string' && c) return c;
        return '';
    };
    const contentTextRaw: string = resolveContent();
    const result = useResultOptional();
    const contentText = result ? result.interpolateText(contentTextRaw) : contentTextRaw;
    const size: string = props.size || 'h2';
    const align: 'left' | 'center' | 'right' | 'justify' = (props.textAlign || props.align || 'center') as any;
    const color: string = props.color || '#432818';

    // Mapear size para classes tailwind simples
    const sizeClass = size === 'h1' ? 'text-3xl md:text-4xl' : size === 'h2' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl';

    return (
        <SelectableBlock
            blockId={block.id}
            isSelected={!!isSelected}
            isEditable={!!isEditable}
            onSelect={() => onSelect?.(block.id)}
            blockType="Texto Inline"
            onOpenProperties={() => onOpenProperties?.(block.id)}
            isDraggable={true}
        >
            <div className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mx-auto">
                <div
                    className={`${sizeClass} font-semibold text-${align}`}
                    style={{ color, lineHeight: 1.2 }}
                >
                    <span dangerouslySetInnerHTML={{ __html: contentText }} />
                </div>
            </div>
        </SelectableBlock>
    );
};

export default React.memo(TextInlineBlock);
