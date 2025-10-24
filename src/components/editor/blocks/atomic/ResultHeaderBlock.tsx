import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { useResultOptional } from '@/contexts/ResultContext';

export default function ResultHeaderBlock({
  block,
  isSelected,
  onClick
}: AtomicBlockProps) {
  // Ler de content primeiro, fallback para properties
  const titleRaw = block.content?.text || block.properties?.title || 'Parabéns!';
  const subtitleRaw = block.content?.subtitle || block.properties?.subtitle || 'Resultado pronto';
  const emoji = block.content?.emoji || block.properties?.emoji || '🎉';
  const titleColor = block.properties?.titleColor || '#5b4135';
  const subtitleColor = block.properties?.subtitleColor || '#8F7A6A';

  const result = useResultOptional();
  const title = result ? result.interpolateText(titleRaw) : titleRaw;
  const subtitle = result ? result.interpolateText(subtitleRaw) : subtitleRaw;

  return (
    <div
      className={`text-center mb-8 ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
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
