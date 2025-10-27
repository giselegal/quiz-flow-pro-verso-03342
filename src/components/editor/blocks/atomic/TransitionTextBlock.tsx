import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { useResultOptional } from '@/contexts/ResultContext';

export default function TransitionTextBlock({
  block,
  isSelected,
  onClick,
}: AtomicBlockProps) {
  const textRaw = block.content?.text || '';
  const fontSize = block.content?.fontSize || 'lg';
  const color = block.content?.color || '#8F7A6A';
  const textAlign = block.content?.textAlign || 'center';
  const result = useResultOptional();
  const text = result ? result.interpolateText(textRaw) : textRaw;

  const fontSizeClasses: Record<string, string> = {
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
  };

  return (
    <p
      className={`${fontSizeClasses[fontSize] || 'text-lg'} mb-6 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={{ color, textAlign: textAlign as any }}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    >
      {text}
    </p>
  );
}
