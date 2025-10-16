/**
 * 🎯 BLOCO ATÔMICO: Mensagem Contextual de Transição
 * Usado em steps 12 e 19 para exibir mensagem com emoji em caixa destacada
 */

import React from 'react';
import { UnifiedBlockComponentProps } from '@/types/core';

export default function TransitionMessageBlock({
  properties,
  content,
}: UnifiedBlockComponentProps) {
  const emoji = content?.emoji || properties?.emoji || '🧮';
  const message = content?.text || properties?.text || 'Analisando suas respostas...';
  const variant = properties?.variant || 'default'; // 'default' | 'result'
  const gradientFrom = properties?.gradientFrom || 'hsl(var(--primary) / 0.1)';
  const gradientTo = properties?.gradientTo || 'hsl(var(--primary) / 0.1)';
  const borderColor = properties?.borderColor || 'hsl(var(--primary) / 0.2)';
  const textColor = properties?.textColor || 'hsl(var(--primary-foreground))';

  return (
    <div
      className="p-6 rounded-lg border transition-all duration-200"
      style={{
        background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
        borderColor,
      }}
    >
      <div className="text-4xl mb-2 text-center">{emoji}</div>
      <p
        className="font-medium text-center"
        style={{
          color: textColor,
        }}
      >
        {message}
      </p>
    </div>
  );
}
