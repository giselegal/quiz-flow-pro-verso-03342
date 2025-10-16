/**
 * 🎯 BLOCO ATÔMICO: Cabeçalho de Resultado
 * Usado no step 20 para exibir título e subtítulo do resultado
 */

import React from 'react';
import { UnifiedBlockComponentProps } from '@/types/core';

export default function ResultHeaderBlock({
  properties,
  content,
}: UnifiedBlockComponentProps) {
  const title = content?.title || properties?.title || 'Parabéns!';
  const subtitle = content?.subtitle || properties?.subtitle || 'Seu resultado está pronto';
  const fontSize = properties?.fontSize || '3xl';
  const fontFamily = properties?.fontFamily || 'Playfair Display';
  const titleColor = properties?.titleColor || 'hsl(var(--primary))';
  const subtitleColor = properties?.subtitleColor || 'hsl(var(--muted-foreground))';
  const textAlign = properties?.textAlign || 'center';
  const marginBottom = properties?.marginBottom || '8';

  return (
    <div className={`mb-${marginBottom}`} style={{ textAlign }}>
      <h1
        className={`text-${fontSize} font-bold mb-2 transition-all duration-200`}
        style={{
          fontFamily: `"${fontFamily}", serif`,
          color: titleColor,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="text-lg transition-all duration-200"
          style={{
            color: subtitleColor,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
