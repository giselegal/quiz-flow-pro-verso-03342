/**
 * 🎯 BLOCO ATÔMICO: Imagem de Transição
 * Usado em steps 12 e 19 para exibir imagem visual
 */

import React from 'react';
import { UnifiedBlockComponentProps } from '@/types/core';

export default function TransitionImageBlock({
  properties,
  content,
}: UnifiedBlockComponentProps) {
  const imageUrl = content?.url || properties?.url || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400';
  const alt = content?.alt || properties?.alt || 'Transição';
  const width = properties?.width || '300px';
  const height = properties?.height || 'auto';
  const borderRadius = properties?.borderRadius || '8px';
  const marginX = properties?.marginX || 'auto';
  const marginY = properties?.marginY || '6';

  return (
    <div className={`flex justify-center my-${marginY}`}>
      <img
        src={imageUrl}
        alt={alt}
        style={{
          width,
          height,
          borderRadius,
          maxWidth: '100%',
          objectFit: 'cover',
        }}
        className="transition-all duration-200"
      />
    </div>
  );
}
