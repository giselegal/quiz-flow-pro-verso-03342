/**
 * 🎯 BLOCO ATÔMICO: Características do Resultado
 * Usado no step 20 para listar características do estilo
 */

import React from 'react';
import { UnifiedBlockComponentProps } from '@/types/core';

export default function ResultCharacteristicsBlock({
  properties,
  content,
}: UnifiedBlockComponentProps) {
  const characteristics = content?.items || properties?.characteristics || [
    'Elegante e refinado',
    'Atemporal e sofisticado',
    'Valoriza qualidade'
  ];
  const title = properties?.title || 'Suas principais características:';
  const columns = properties?.columns || 3;
  const marginBottom = properties?.marginBottom || '8';
  const borderColor = properties?.borderColor || 'hsl(var(--primary))';

  return (
    <div className={`mb-${marginBottom}`}>
      <h4 
        className="text-lg font-semibold mb-4 text-center"
        style={{ color: 'hsl(var(--primary))' }}
      >
        {title}
      </h4>
      <div 
        className="bg-muted/30 p-6 rounded-lg"
      >
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-4`}>
          {characteristics.map((item: string, index: number) => (
            <div
              key={index}
              className="bg-background p-3 rounded-md shadow-sm transition-all duration-200 hover:shadow-md"
              style={{
                borderLeft: `4px solid ${borderColor}`,
              }}
            >
              <p className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
