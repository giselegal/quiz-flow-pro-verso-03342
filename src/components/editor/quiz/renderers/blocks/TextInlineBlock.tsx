import React from 'react';
import type { Block } from '@/types/editor';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import { useResultOptional } from '@/contexts/ResultContext';
import { sanitizeHtml } from '@/lib/utils/sanitizeHtml';

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
    // Primeiro interpolamos com ResultContext (ex.: {username}) e depois tokens utilitários como {currentYear}
    const interpolated = result ? result.interpolateText(contentTextRaw) : contentTextRaw;
    const contentText = typeof interpolated === 'string' ? interpolated.replace(/\{currentYear\}/g, String(new Date().getFullYear())) : interpolated;
    const size: string = props.size || 'h2';
    // Normaliza textAlign aceitando 'center' ou 'text-center'
    const alignRaw: string = (props.textAlign || props.align || 'center') as any;
    const align: 'left' | 'center' | 'right' | 'justify' = (String(alignRaw).startsWith('text-') ? String(alignRaw).replace('text-', '') : String(alignRaw)) as any;
    const color: string = props.color || '#432818';
    const fontFamily: string | undefined = typeof (props as any).fontFamily === 'string' ? (props as any).fontFamily : undefined;
    const fontSizeClass: string | undefined = typeof (props as any).fontSize === 'string' ? (props as any).fontSize : undefined;
    const fontWeightClass: string | undefined = typeof (props as any).fontWeight === 'string' ? (props as any).fontWeight : undefined;
    const extraClassName: string = typeof (props as any).className === 'string' ? (props as any).className : '';

    // Mapear size para classes tailwind simples
    const sizeClass = fontSizeClass || (size === 'h1' ? 'text-3xl md:text-4xl' : size === 'h2' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl');

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
                    className={`${sizeClass} ${fontWeightClass || 'font-semibold'} text-${align} ${extraClassName}`}
                    style={{ color, lineHeight: 1.2, ...(fontFamily ? { fontFamily } : {}) }}
                >
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(String(contentText || '')) }} />
                </div>
            </div>
        </SelectableBlock>
    );
};

export default React.memo(TextInlineBlock);
