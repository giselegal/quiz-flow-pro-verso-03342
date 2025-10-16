import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function TransitionTextBlock({
  block,
  isSelected,
  onClick
}: AtomicBlockProps) {
  const text = block.content?.text || '';
  const fontSize = block.properties?.fontSize || 'lg';
  const color = block.properties?.color || '#8F7A6A';
  const textAlign = block.properties?.textAlign || 'center';
  
  const fontSizeClasses: Record<string, string> = {
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl'
  };

  return (
    <p
      className={`${fontSizeClasses[fontSize] || 'text-lg'} mb-6 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={{ color, textAlign: textAlign as any }}
      onClick={onClick}
    >
      {text}
    </p>
  );
}
