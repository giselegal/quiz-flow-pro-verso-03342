/**
 * 🎯 BLOCO ATÔMICO: Barras de Progresso do Resultado
 * Usado no step 20 para exibir compatibilidade com estilos
 */

import React from 'react';
import { UnifiedBlockComponentProps } from '@/types/core';

interface StyleScore {
  name: string;
  score: number;
}

export default function ResultProgressBarsBlock({
  properties,
  content,
}: UnifiedBlockComponentProps) {
  const scores: StyleScore[] = content?.scores || properties?.scores || [
    { name: 'Clássico Elegante', score: 85 },
    { name: 'Romântico', score: 72 },
    { name: 'Natural', score: 65 }
  ];
  const showTop3 = properties?.showTop3 !== false;
  const barColor = properties?.barColor || 'hsl(var(--primary))';
  const title = properties?.title || 'Compatibilidade com estilos:';
  const marginBottom = properties?.marginBottom || '8';

  const displayScores = showTop3 ? scores.slice(0, 3) : scores;

  return (
    <div className={`mb-${marginBottom}`}>
      <h4 
        className="text-lg font-semibold mb-4 text-center"
        style={{ color: 'hsl(var(--primary))' }}
      >
        {title}
      </h4>
      <div className="space-y-4 max-w-xl mx-auto">
        {displayScores.map((style, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                {style.name}
              </span>
              <span className="text-sm font-bold" style={{ color: barColor }}>
                {style.score}%
              </span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${style.score}%`,
                  backgroundColor: barColor,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
