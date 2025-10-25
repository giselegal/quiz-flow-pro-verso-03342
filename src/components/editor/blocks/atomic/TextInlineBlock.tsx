import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { useResultOptional } from '@/contexts/ResultContext';

export default function TextInlineBlock({ block, isSelected, onClick }: AtomicBlockProps) {
    const result = useResultOptional();
    const raw = block.content?.text || block.properties?.text || '';
    const text = result ? result.interpolateText(raw) : raw;
    const align = block.properties?.textAlign || block.content?.textAlign || 'left';
    const color = block.properties?.color || block.content?.color || '#432818';
    const size = block.properties?.fontSize || block.content?.fontSize || 'base';

    const sizeMap: Record<string, string> = {
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
    };

    return (
        <p
            className={`${sizeMap[size] || 'text-base'} ${isSelected ? 'ring-2 ring-primary' : ''}`}
            style={{ textAlign: align as any, color }}
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        >
            {text}
        </p>
    );
}
