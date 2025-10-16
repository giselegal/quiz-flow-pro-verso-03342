import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function TransitionTitleBlock({
  block,
  isSelected,
  onClick
}: AtomicBlockProps) {
  const title = block.content?.text || 'Preparando...';
  const fontSize = block.properties?.fontSize || '3xl';
  const color = block.properties?.color || '#5b4135';
  const textAlign = block.properties?.textAlign || 'center';
  
  const fontSizeClasses: Record<string, string> = {
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl'
  };

  return (
    <h2
      className={`${fontSizeClasses[fontSize] || 'text-3xl'} font-bold mb-4 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={{ color, textAlign: textAlign as any }}
      onClick={onClick}
    >
      {title}
    </h2>
  );
}
