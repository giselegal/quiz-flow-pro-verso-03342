import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { Button } from '@/components/ui/button';

export default function ResultCTASecondaryBlock({
    block,
    isSelected,
    onClick
}: AtomicBlockProps) {
    // Ler apenas de content
    const text = block.content?.text || 'Refazer Quiz';
    const url = block.content?.url || '#';
    const variant = block.content?.variant || 'outline';
    const size = block.content?.size || 'md';

    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            onClick(e);
        }
        // Em preview mode, navegar para URL
        if (url && url !== '#' && !isSelected) {
            window.location.href = url;
        }
    };

    return (
        <div
            className={`mt-4 ${isSelected ? 'ring-2 ring-primary' : ''}`}
            onClick={handleClick}
        >
            <Button
                size={size as any}
                variant={variant as any}
                className="w-full"
            >
                {text}
            </Button>
        </div>
    );
}
