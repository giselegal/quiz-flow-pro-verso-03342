import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function IntroImageBlock({
  block,
  isSelected,
  onClick,
}: AtomicBlockProps) {
  // Compatibilidade JSON v3: content.imageUrl, imageAlt, width/height
  const src = (block as any)?.content?.imageUrl || block.properties?.src || (block as any)?.content?.src || '';
  const alt = (block as any)?.content?.imageAlt || block.properties?.alt || (block as any)?.content?.alt || 'Imagem';
  const maxWidth = (block as any)?.content?.maxWidth || block.properties?.maxWidth || '500px';
  const rounded = block.properties?.rounded !== false;

  if (!src) return null;

  return (
    <div
      className={`flex justify-center my-6 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
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
