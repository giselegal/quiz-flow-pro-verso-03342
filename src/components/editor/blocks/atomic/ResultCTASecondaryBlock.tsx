import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { Button } from '@/components/ui/button';

export default function ResultCTASecondaryBlock({
  block,
  isSelected,
  onClick
}: AtomicBlockProps) {
  // Ler de content primeiro, fallback para properties
  const text = block.content?.text || block.properties?.text || 'Refazer Quiz';
  const url = block.content?.url || block.properties?.url || '#';
  const variant = block.properties?.variant || 'outline';
  const size = block.properties?.size || 'md';

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
