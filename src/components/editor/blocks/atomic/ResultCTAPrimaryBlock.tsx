import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { Button } from '@/components/ui/button';

export default function ResultCTAPrimaryBlock({
    block,
    isSelected,
    onClick
}: AtomicBlockProps) {
    // Ler apenas de content
    const text = block.content?.text || 'Ver Oferta Personalizada';
    const url = block.content?.url || '#';
    const backgroundColor = block.content?.backgroundColor || '#3B82F6';
    const textColor = block.content?.textColor || '#FFFFFF';
    const size = block.content?.size || 'lg';

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
            className={`mt-6 ${isSelected ? 'ring-2 ring-primary' : ''}`}
            onClick={handleClick}
        >
            <Button
                size={size as any}
                className="w-full text-lg font-semibold"
                style={{
                    backgroundColor,
                    color: textColor
                }}
            >
                {text}
            </Button>
        </div>
    );
}
