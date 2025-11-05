/**
 * 🎯 BLOCO ATÔMICO: Barras de Progresso do Resultado
 * Usado no step 20 para exibir compatibilidade com estilos
 */

import React from 'react';
import { UnifiedBlockComponentProps } from '@/types/core';
import { useResultOptional } from '@/contexts/ResultContext';

interface StyleScore {
  name: string;
  score: number;
  percentage?: number;
}

export default function ResultProgressBarsBlock({
  properties,
  content,
}: UnifiedBlockComponentProps) {
  const resultContext = useResultOptional();

  // Configurações do JSON (props)
  const props = properties?.props || properties || {};
  const topCount = props.topCount || 3;
  const showPercentage = props.showPercentage !== false;
  const percentageFormat = props.percentageFormat || '{percentage}%';
  const animationDelay = props.animationDelay || 200;
  const titleFormat = props.titleFormat || 'Além do {primaryStyle}, você também tem traços de:';

  // Cores das barras
  const colors = props.colors || {};
  const primaryColor = colors.primary || '#B89B7A';
  const secondaryColor = colors.secondary || '#a08966';
  const tertiaryColor = colors.tertiary || '#8c7757';

  // Pegar dados do contexto
  const primaryStyleName = resultContext?.styleConfig?.name || '';
  const calculations = resultContext?.calculations;

  // Montar scores dos estilos secundários (excluindo o primário)
  const scores: StyleScore[] = React.useMemo(() => {
    if (calculations?.allStyles) {
      return calculations.allStyles
        .filter((style) => style.name !== primaryStyleName)
        .map((style) => ({
          name: style.name,
          score: Math.round(style.percentage),
          percentage: Math.round(style.percentage)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topCount);
    }
    return content?.scores || properties?.scores || [];
  }, [calculations, primaryStyleName, topCount, content?.scores, properties?.scores]);

  // Substituir variável {primaryStyle} no título
  const title = primaryStyleName
    ? titleFormat.replace('{primaryStyle}', primaryStyleName)
    : titleFormat.replace('{primaryStyle}', '').trim();

  // Cores por índice
  const barColors = [primaryColor, secondaryColor, tertiaryColor];

  return (
    <div className="result-progress-bars-block mb-8">
      <h4
        className="text-lg md:text-xl font-semibold mb-6 text-center"
        style={{ color: '#432818' }}
      >
        {title}
      </h4>
      <div className="space-y-4 max-w-xl mx-auto px-4">
        {scores.map((style, index) => {
          const barColor = barColors[index] || barColors[0];
          const displayPercentage = showPercentage
            ? percentageFormat.replace('{percentage}', String(style.percentage || style.score))
            : '';

          return (
            <div
              key={style.name}
              className="space-y-2 animate-fadeIn"
              style={{ animationDelay: `${index * animationDelay}ms` }}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-base font-medium text-gray-700">
                  {style.name}
                </span>
                {displayPercentage && (
                  <span
                    className="text-sm md:text-base font-bold"
                    style={{ color: barColor }}
                  >
                    {displayPercentage}
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${style.score}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
