/**
 * 🎯 BLOCO ATÔMICO: Descrição do Resultado
 * Usado no step 20 para exibir texto descritivo do resultado
 */

import React from 'react';
import { UnifiedBlockComponentProps } from '@/types/core';

export default function ResultDescriptionBlock({
  properties,
  content,
}: UnifiedBlockComponentProps) {
  const description = content?.text || properties?.text || 'Você descobriu seu estilo único!';
  const fontSize = properties?.fontSize || 'lg';
  const fontFamily = properties?.fontFamily || 'Lato';
  const color = properties?.color || 'hsl(var(--foreground))';
  const textAlign = properties?.textAlign || 'center';
  const marginBottom = properties?.marginBottom || '6';
  const maxWidth = properties?.maxWidth || '700px';

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
