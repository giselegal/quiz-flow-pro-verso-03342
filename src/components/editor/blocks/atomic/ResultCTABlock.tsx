import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { Button } from '@/components/ui/button';

export default function ResultCTABlock({
  block,
  isSelected,
  onClick
}: AtomicBlockProps) {
  const buttonText = block.content?.text || 'Ver Recomendações';
  const backgroundColor = block.properties?.backgroundColor || '#B89B7A';
  const textColor = block.properties?.textColor || '#FFFFFF';
  const size = block.properties?.size || 'lg';

  return (
    <div 
      className={`mt-8 ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <Button
        size={size as any}
        className="w-full"
        style={{ 
          backgroundColor,
          color: textColor
        }}
      >
        {buttonText}
      </Button>
    </div>
  );
}
