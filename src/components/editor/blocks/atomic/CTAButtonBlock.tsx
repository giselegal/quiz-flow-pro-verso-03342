import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function CTAButtonBlock({ block, isSelected, onClick }: AtomicBlockProps) {
    const label = block.content?.label || block.properties?.label || 'Continuar';
    const href = block.content?.href || block.properties?.href || '#';
    const variant = block.content?.variant || block.properties?.variant || 'primary';
    const size = block.content?.size || block.properties?.size || 'large';

    const variantClass = variant === 'primary' ? 'bg-[#B89B7A] text-white hover:opacity-90' : 'bg-gray-200 text-gray-800 hover:bg-gray-300';
    const sizeClass = size === 'large' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm';

    return (
        <a
            href={href}
            className={`inline-flex items-center justify-center rounded-md transition ${variantClass} ${sizeClass} ${isSelected ? 'ring-2 ring-primary' : ''}`}
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        >
            {label}
        </a>
    );
}
