import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { useResultOptional } from '@/contexts/ResultContext';

export default function ResultDescriptionBlock({
  block,
  isSelected,
  onClick,
}: AtomicBlockProps) {
  const descriptionRaw = block.content?.text || '';
  const fontSize = block.properties?.fontSize || 'base';
  const color = block.properties?.color || '#5b4135';
  const textAlign = block.properties?.textAlign || 'left';
  const result = useResultOptional();
  const description = result ? result.interpolateText(descriptionRaw) : descriptionRaw;

  const fontSizeClasses: Record<string, string> = {
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
  };

  return (
    <p
      className={`${fontSizeClasses[fontSize] || 'text-base'} mb-6 leading-relaxed transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={{ color, textAlign: textAlign as any }}
      onClick={(e) => { onClick?.(); }}
    >
      {description}
    </p>
  );
}
