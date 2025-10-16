/**
 * 🎯 BLOCO ATÔMICO: Texto Descritivo de Transição
 * Usado em steps 12 e 19 para exibir descrição secundária
 */

import React from 'react';
import { UnifiedBlockComponentProps } from '@/types/core';

export default function TransitionTextBlock({
  properties,
  content,
}: UnifiedBlockComponentProps) {
  const text = content?.text || properties?.text || '';
  const fontSize = properties?.fontSize || 'lg';
  const fontFamily = properties?.fontFamily || 'Lato';
  const color = properties?.color || 'hsl(var(--muted-foreground))';
  const textAlign = properties?.textAlign || 'center';
  const marginBottom = properties?.marginBottom || '6';
  const maxWidth = properties?.maxWidth || '28rem'; // max-w-md = 28rem
  const lineHeight = properties?.lineHeight || 'relaxed';

  if (!text) return null;

  return (
    <div className="flex justify-center">
      <p
        className={`text-${fontSize} mb-${marginBottom} leading-${lineHeight} transition-all duration-200`}
        style={{
          fontFamily: `"${fontFamily}", sans-serif`,
          color,
          textAlign,
          maxWidth,
        }}
      >
        {text}
      </p>
    </div>
  );
}
