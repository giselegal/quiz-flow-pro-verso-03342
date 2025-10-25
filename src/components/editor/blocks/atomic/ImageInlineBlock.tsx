import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function ImageInlineBlock({ block, isSelected, onClick }: AtomicBlockProps) {
    const src = block.content?.imageUrl || block.properties?.url || '';
    const alt = block.content?.imageAlt || block.properties?.alt || 'Imagem';
    const width = block.properties?.width || 300;
    const height = block.properties?.height || undefined;

    if (!src) return null;

    return (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`object-contain mx-auto ${isSelected ? 'ring-2 ring-primary' : ''}`}
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}
            style={{ maxWidth: '100%', height: 'auto' }}
        />
    );
}
