/**
 * 🎯 BLOCO ATÔMICO: Descrição de Transição
 * Usado em steps 12 e 19 para exibir texto descritivo
 */

import React from 'react';
import { UnifiedBlockComponentProps } from '@/types/core';

export default function TransitionDescriptionBlock({
  properties,
  content,
}: UnifiedBlockComponentProps) {
  const description = content?.text || properties?.text || 'Em poucos segundos você descobrirá seu estilo predominante.';
  const fontSize = properties?.fontSize || 'base';
  const fontFamily = properties?.fontFamily || 'Lato';
  const color = properties?.color || 'hsl(var(--foreground))';
  const textAlign = properties?.textAlign || 'center';
  const marginBottom = properties?.marginBottom || '6';
  const maxWidth = properties?.maxWidth || '600px';

  return (
    <div className="flex justify-center">
      <p
        className={`text-${fontSize} mb-${marginBottom} transition-all duration-200`}
        style={{
          fontFamily: `"${fontFamily}", sans-serif`,
          color,
          textAlign,
          maxWidth,
        }}
      >
        {description}
      </p>
    </div>
  );
}
