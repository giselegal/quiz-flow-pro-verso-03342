/**
 * 🎯 BLOCO ATÔMICO: Parabéns (Resultado)
 * Usado no step 20 para congratular o usuário
 */

import React from 'react';
import { UnifiedBlockComponentProps } from '@/types/core';

export default function ResultCongratsBlock({
  properties,
  content,
}: UnifiedBlockComponentProps) {
  const text = content?.text || properties?.text || 'Parabéns!';
  const showUserName = properties?.showUserName !== false;
  const userName = content?.userName || properties?.userName || '';
  const fontSize = properties?.fontSize || '2xl';
  const fontFamily = properties?.fontFamily || 'Playfair Display';
  const color = properties?.color || 'hsl(var(--primary))';
  const textAlign = properties?.textAlign || 'center';
  const marginBottom = properties?.marginBottom || '4';

  const displayText = showUserName && userName 
    ? text.replace('{userName}', userName) 
    : text.replace(', {userName}', '').replace('{userName}', '');

  return (
    <h2
      className={`text-${fontSize} font-bold mb-${marginBottom} transition-all duration-200`}
      style={{
        fontFamily: `"${fontFamily}", serif`,
        color,
        textAlign,
      }}
    >
      {displayText}
    </h2>
  );
}
