/**
 * 🎯 BLOCO ATÔMICO: Subtítulo de Transição
 * Usado em steps 12 e 19 para exibir subtítulo/descrição secundária
 */

import React from 'react';
import { UnifiedBlockComponentProps } from '@/types/core';

export default function TransitionSubtitleBlock({
  properties,
  content,
}: UnifiedBlockComponentProps) {
  const subtitle = content?.text || properties?.text || 'Analisando suas respostas...';
  const fontSize = properties?.fontSize || 'xl';
  const fontFamily = properties?.fontFamily || 'Lato';
  const color = properties?.color || 'hsl(var(--muted-foreground))';
  const textAlign = properties?.textAlign || 'center';
  const marginBottom = properties?.marginBottom || '4';

  return (
    <p
      className={`text-${fontSize} mb-${marginBottom} transition-all duration-200`}
      style={{
        fontFamily: `"${fontFamily}", sans-serif`,
        color,
        textAlign,
      }}
    >
      {subtitle}
    </p>
  );
}
