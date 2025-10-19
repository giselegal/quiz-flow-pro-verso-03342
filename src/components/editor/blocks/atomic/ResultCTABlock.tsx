import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { Button } from '@/components/ui/button';
import { useResultOptional } from '@/contexts/ResultContext';

export default function ResultCTABlock({
  block,
  isSelected,
  onClick
}: AtomicBlockProps) {
  // Ler de content primeiro, fallback para properties
  const buttonTextRaw = block.content?.text || block.properties?.text || 'Ver Recomendações';
  const backgroundColor = block.properties?.backgroundColor || '#B89B7A';
  const textColor = block.properties?.textColor || '#FFFFFF';
  const size = block.properties?.size || 'lg';
  const result = useResultOptional();
  const buttonText = result ? result.interpolateText(buttonTextRaw) : buttonTextRaw;

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
