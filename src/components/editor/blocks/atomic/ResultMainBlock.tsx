import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function ResultMainBlock({
  block,
  isSelected,
  onClick
}: AtomicBlockProps) {
  // ✅ Ler apenas de content
  const styleName = block.content?.styleName || 'Seu Estilo';
  const percentage = block.content?.percentage || '85%';
  const backgroundColor = block.content?.backgroundColor || '#F5EDE4';
  const textColor = block.content?.textColor || '#5b4135';
  const accentColor = block.content?.accentColor || '#B89B7A';

  return (
    <div
      className={`p-8 rounded-xl mb-6 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={{ backgroundColor }}
      onClick={onClick}
    >
      <h2 className="text-3xl font-bold mb-3" style={{ color: textColor }}>
        {styleName}
      </h2>
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-bold" style={{ color: accentColor }}>
          {percentage}
        </span>
        <span className="text-xl" style={{ color: textColor }}>
          compatibilidade
        </span>
      </div>
    </div>
  );
}
