/**
 * 🎯 BLOCO ATÔMICO: Parabéns (Resultado)
 * Usado no step 20 para congratular o usuário
 */

import React from 'react';
import { UnifiedBlockComponentProps } from '@/types/core';
import { useResultOptional } from '@/contexts/ResultContext';

export default function ResultCongratsBlock({
  properties,
  content,
}: UnifiedBlockComponentProps) {
  const resultContext = useResultOptional();

  // Dados do contexto (prioridade)
  const userName = resultContext?.userProfile?.userName || content?.userName || properties?.userName || '';
  const styleName = resultContext?.styleConfig?.name || content?.styleName || properties?.styleName || '';  // Configurações do JSON (props)
  const props = properties?.props || properties || {};
  const showCelebration = props.showCelebration !== false;
  const celebrationEmoji = props.celebrationEmoji || '🎉';
  const greetingFormat = props.greetingFormat || 'Olá, {userName}!';
  const titleFormat = props.titleFormat || 'Seu Estilo Predominante é:';
  const styleNameDisplay = props.styleNameDisplay || '{styleName}';

  // Cores
  const colors = props.colors || {};
  const greetingColor = colors.greeting || '#432818';
  const greetingHighlight = colors.greetingHighlight || '#B89B7A';
  const titleColor = colors.title || '#432818';
  const styleNameColor = colors.styleName || '#B89B7A';

  // Spacing
  const spacing = props.spacing || {};
  const padding = spacing.padding || '3rem 1.5rem';
  const marginBottom = spacing.marginBottom || '2.5rem';

  // Substituir variáveis dinâmicas
  const greeting = userName
    ? greetingFormat.replace('{userName}', userName)
    : greetingFormat.replace('{userName}', '').replace(', {userName}', '').trim();

  const styleDisplay = styleName
    ? styleNameDisplay.replace('{styleName}', styleName)
    : styleNameDisplay.replace('{styleName}', '').trim();

  return (
    <div
      className="result-congrats-block"
      style={{
        padding,
        marginBottom,
        textAlign: 'center'
      }}
    >
      {showCelebration && celebrationEmoji && (
        <div
          className="celebration-emoji text-6xl mb-4 animate-bounce"
          role="img"
          aria-label="celebration"
        >
          {celebrationEmoji}
        </div>
      )}

      {greeting && (
        <h2
          className="greeting text-2xl md:text-3xl font-semibold mb-4"
          style={{ color: greetingColor }}
        >
          {userName ? (
            greeting.split(userName).map((part: string, index: number, array: string[]) => (
              <React.Fragment key={index}>
                {part}
                {index < array.length - 1 && (
                  <span style={{ color: greetingHighlight, fontWeight: 'bold' }}>
                    {userName}
                  </span>
                )}
              </React.Fragment>
            ))
          ) : (
            greeting
          )}
        </h2>
      )}

      {titleFormat && (
        <h3
          className="title text-xl md:text-2xl font-medium mb-2"
          style={{ color: titleColor }}
        >
          {titleFormat}
        </h3>
      )}

      {styleDisplay && (
        <h1
          className="style-name text-4xl md:text-5xl lg:text-6xl font-bold mt-4"
          style={{
            color: styleNameColor,
            fontFamily: '"Playfair Display", serif'
          }}
        >
          {styleDisplay}
        </h1>
      )}
    </div>
  );
}