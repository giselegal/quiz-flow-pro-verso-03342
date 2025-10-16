/**
 * 🎯 BLOCO ATÔMICO: Estilos Secundários do Resultado
 * Usado no step 20 para exibir estilos complementares
 */

import React from 'react';
import { UnifiedBlockComponentProps } from '@/types/core';

interface SecondaryStyle {
  name: string;
  description?: string;
}

export default function ResultSecondaryStylesBlock({
  properties,
  content,
}: UnifiedBlockComponentProps) {
  const styles: SecondaryStyle[] = content?.styles || properties?.styles || [
    { name: 'Romântico', description: 'Seu segundo estilo mais forte' },
    { name: 'Natural', description: 'Complementa seu estilo principal' }
  ];
  const showTop2 = properties?.showTop2 !== false;
  const title = properties?.title || 'Estilos Complementares:';
  const marginBottom = properties?.marginBottom || '8';
  const columns = properties?.columns || 2;

  const displayStyles = showTop2 ? styles.slice(0, 2) : styles;

  return (
    <div className={`mb-${marginBottom}`}>
      <h4 
        className="text-lg font-semibold mb-4 text-center"
        style={{ color: 'hsl(var(--primary))' }}
      >
        {title}
      </h4>
      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4 max-w-2xl mx-auto`}>
        {displayStyles.map((style, index) => (
          <div
            key={index}
            className="bg-muted/30 p-5 rounded-lg border-2 transition-all duration-200 hover:shadow-md"
            style={{ borderColor: 'hsl(var(--primary) / 0.3)' }}
          >
            <h5 
              className="font-bold text-lg mb-1"
              style={{ color: 'hsl(var(--primary))' }}
            >
              {style.name}
            </h5>
            {style.description && (
              <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {style.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
