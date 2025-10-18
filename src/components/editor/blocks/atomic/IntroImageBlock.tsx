import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function IntroImageBlock({
  block,
  isSelected,
  onClick
}: AtomicBlockProps) {
  const src = block.properties?.src || block.content?.src || '';
  const alt = block.properties?.alt || block.content?.alt || 'Imagem';
  const maxWidth = block.properties?.maxWidth || '500px';
  const rounded = block.properties?.rounded !== false;

  if (!src) return null;

  return (
    <div
      className={`flex justify-center my-6 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full object-contain ${rounded ? 'rounded-lg' : ''}`}
        style={{ maxWidth }}
      />
    </div>
  );
}
