/**
 * 🎯 BLOCO ATÔMICO: Título de Transição
 * Usado em steps 12 e 19 para exibir título principal
 */

import React from 'react';
import { UnifiedBlockComponentProps } from '@/types/core';

export default function TransitionTitleBlock({
  properties,
  content,
  isSelected,
}: UnifiedBlockComponentProps) {
  const title = content?.text || properties?.text || 'Preparando seu resultado...';
  const fontSize = properties?.fontSize || '3xl';
  const fontFamily = properties?.fontFamily || 'Playfair Display';
  const color = properties?.color || 'hsl(var(--primary))';
  const textAlign = properties?.textAlign || 'center';
  const marginBottom = properties?.marginBottom || '6';

  return (
    <h1
      className={`text-${fontSize} font-bold mb-${marginBottom} transition-all duration-200`}
      style={{
        fontFamily: `"${fontFamily}", serif`,
        color,
        textAlign,
      }}
    >
      {title}
    </h1>
  );
}
