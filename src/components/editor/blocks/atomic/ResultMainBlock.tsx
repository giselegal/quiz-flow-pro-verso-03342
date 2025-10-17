import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function ResultMainBlock({
  block,
  isSelected,
  onClick
}: AtomicBlockProps) {
  // Ler de content primeiro, fallback para properties
  const styleName = block.content?.styleName || block.properties?.styleName || 'Seu Estilo';
  const percentage = block.content?.percentage || block.properties?.percentage || '85%';
  const backgroundColor = block.properties?.backgroundColor || '#F5EDE4';
  const textColor = block.properties?.textColor || '#5b4135';
  const accentColor = block.properties?.accentColor || '#B89B7A';

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
