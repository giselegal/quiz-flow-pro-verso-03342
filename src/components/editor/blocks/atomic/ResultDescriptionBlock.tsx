import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function ResultDescriptionBlock({
  block,
  isSelected,
  onClick
}: AtomicBlockProps) {
  const description = block.content?.text || '';
  const fontSize = block.properties?.fontSize || 'base';
  const color = block.properties?.color || '#5b4135';
  const textAlign = block.properties?.textAlign || 'left';
  
  const fontSizeClasses: Record<string, string> = {
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg'
  };

  return (
    <p
      className={`${fontSizeClasses[fontSize] || 'text-base'} mb-6 leading-relaxed transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={{ color, textAlign: textAlign as any }}
      onClick={onClick}
    >
      {description}
    </p>
  );
}
