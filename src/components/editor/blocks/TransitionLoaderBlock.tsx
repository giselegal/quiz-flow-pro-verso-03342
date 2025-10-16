/**
 * 🎯 BLOCO ATÔMICO: Loader de Transição
 * Usado em steps 12 e 19 para exibir animação de loading
 */

import React from 'react';
import { UnifiedBlockComponentProps } from '@/types/core';

export default function TransitionLoaderBlock({
  properties,
}: UnifiedBlockComponentProps) {
  const color = properties?.color || 'hsl(var(--primary))';
  const dots = properties?.dots || 3;
  const size = properties?.size || '12px';
  const animationDelay = properties?.animationDelay || 0.1;

  return (
    <div className="flex justify-center items-center gap-2 my-8">
      {Array.from({ length: dots }).map((_, index) => (
        <div
          key={index}
          className="rounded-full animate-pulse"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            animationDelay: `${index * animationDelay}s`,
            animationDuration: '1.4s',
          }}
        />
      ))}
    </div>
  );
}
