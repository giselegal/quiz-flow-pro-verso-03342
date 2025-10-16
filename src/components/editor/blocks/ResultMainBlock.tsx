/**
 * 🎯 BLOCO ATÔMICO: Estilo Principal (Resultado)
 * Usado no step 20 para exibir o estilo predominante
 */

import React from 'react';
import { UnifiedBlockComponentProps } from '@/types/core';

export default function ResultMainBlock({
  properties,
  content,
}: UnifiedBlockComponentProps) {
  const title = content?.title || properties?.title || 'Seu Estilo Predominante:';
  const styleName = content?.styleName || properties?.styleName || 'Clássico Elegante';
  const fontSize = properties?.fontSize || '4xl';
  const fontFamily = properties?.fontFamily || 'Playfair Display';
  const textAlign = properties?.textAlign || 'center';
  const marginBottom = properties?.marginBottom || '6';
  const showGradient = properties?.showGradient !== false;
  const gradientColors = properties?.gradientColors || ['hsl(var(--primary))', 'hsl(var(--accent))'];

  const displayStyleName = styleName.replace('{resultStyle}', content?.resultStyle || styleName);

  return (
    <div className={`mb-${marginBottom} text-${textAlign}`}>
      <p 
        className="text-lg mb-2"
        style={{
          fontFamily: `"${fontFamily}", serif`,
          color: 'hsl(var(--muted-foreground))',
        }}
      >
        {title}
      </p>
      <h1
        className={`text-${fontSize} font-bold transition-all duration-200`}
        style={{
          fontFamily: `"${fontFamily}", serif`,
          background: showGradient
            ? `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`
            : gradientColors[0],
          WebkitBackgroundClip: showGradient ? 'text' : 'none',
          WebkitTextFillColor: showGradient ? 'transparent' : 'inherit',
          backgroundClip: showGradient ? 'text' : 'none',
        }}
      >
        {displayStyleName}
      </h1>
    </div>
  );
}
