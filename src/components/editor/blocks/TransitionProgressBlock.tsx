/**
 * 🎯 BLOCO ATÔMICO: Progress Dots de Transição
 * Usado em steps 12 e 19 para exibir animação de progresso com dots
 */

import React from 'react';
import { UnifiedBlockComponentProps } from '@/types/core';

export default function TransitionProgressBlock({
  properties,
}: UnifiedBlockComponentProps) {
  const dots = properties?.dots || 3;
  const color = properties?.color || '#deac6d';
  const animationDelay = properties?.animationDelay || 0.2;
  const animationDuration = properties?.animationDuration || '1.2s';
  const spacing = properties?.spacing || '0.5rem';
  const size = properties?.size || '0.75rem';

  return (
    <div className="flex justify-center items-center mb-8" style={{ gap: spacing }}>
      {Array.from({ length: dots }).map((_, index) => (
        <div
          key={index}
          className="rounded-full animate-pulse"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            animationDelay: `${index * animationDelay}s`,
            animationDuration,
          }}
        />
      ))}
    </div>
  );
}
