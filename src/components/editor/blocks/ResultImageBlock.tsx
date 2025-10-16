/**
 * 🎯 BLOCO ATÔMICO: Imagem do Resultado
 * Usado no step 20 para exibir imagem do estilo
 */

import React from 'react';
import { UnifiedBlockComponentProps } from '@/types/core';

export default function ResultImageBlock({
  properties,
  content,
}: UnifiedBlockComponentProps) {
  const imageUrl = content?.url || properties?.url || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400';
  const alt = content?.alt || properties?.alt || 'Resultado do estilo';
  const width = properties?.width || '300px';
  const height = properties?.height || 'auto';
  const borderRadius = properties?.borderRadius || '8px';
  const marginY = properties?.marginY || '6';
  const shadow = properties?.shadow || 'lg';

  const displayUrl = imageUrl.replace('{resultStyle}', content?.resultStyle || '');

  return (
    <div className={`flex justify-center my-${marginY}`}>
      <img
        src={displayUrl}
        alt={alt}
        style={{
          width,
          height,
          borderRadius,
          maxWidth: '100%',
          objectFit: 'cover',
        }}
        className={`transition-all duration-200 shadow-${shadow}`}
      />
    </div>
  );
}
