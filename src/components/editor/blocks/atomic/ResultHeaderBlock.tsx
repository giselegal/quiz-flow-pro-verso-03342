import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function ResultHeaderBlock({
  block,
  isSelected,
  onClick
}: AtomicBlockProps) {
  const title = block.content?.text || 'Parabéns!';
  const subtitle = block.content?.subtitle || 'Resultado pronto';
  const emoji = block.content?.emoji || '🎉';
  const titleColor = block.properties?.titleColor || '#5b4135';
  const subtitleColor = block.properties?.subtitleColor || '#8F7A6A';

  return (
    <div 
      className={`text-center mb-8 ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <div className="text-5xl mb-4">{emoji}</div>
      <h1 className="text-4xl font-bold mb-2" style={{ color: titleColor }}>
        {title}
      </h1>
      <p className="text-lg" style={{ color: subtitleColor }}>
        {subtitle}
      </p>
    </div>
  );
}
