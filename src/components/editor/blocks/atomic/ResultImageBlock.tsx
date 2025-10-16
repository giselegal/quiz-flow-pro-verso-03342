import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function ResultImageBlock({
  block,
  isSelected,
  onClick
}: AtomicBlockProps) {
  const imageUrl = block.content?.imageUrl || block.content?.src || '';
  const alt = block.content?.alt || 'Imagem do resultado';
  const borderRadius = block.properties?.borderRadius || '12px';
  const maxHeight = block.properties?.maxHeight || '400px';

  if (!imageUrl) {
    return (
      <div
        className={`w-full bg-muted rounded-xl flex items-center justify-center mb-6 ${isSelected ? 'ring-2 ring-primary' : ''}`}
        style={{ height: maxHeight, borderRadius }}
        onClick={onClick}
      >
        <span className="text-muted-foreground">Sem imagem</span>
      </div>
    );
  }

  return (
    <div 
      className={`mb-6 ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={alt}
        className="w-full object-cover"
        style={{ borderRadius, maxHeight }}
      />
    </div>
  );
}
