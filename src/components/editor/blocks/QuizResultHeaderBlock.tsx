/**
 * 🎯 QUIZ RESULT HEADER BLOCK - Componente Modular
 * Cabeçalho de resultado com estilo descoberto
 */

import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

interface QuizResultHeaderBlockProps extends BlockComponentProps {
  properties?: {
    title?: string;
    subtitle?: string;
    styleName?: string;
    showBadge?: boolean;
    badgeText?: string;
    fontSize?: string | number;
    fontWeight?: string | number;
    textAlign?: 'left' | 'center' | 'right';
    color?: string;
    accentColor?: string;
    backgroundColor?: string;
    marginTop?: number;
    marginBottom?: number;
    paddingTop?: number;
    paddingBottom?: number;
    borderRadius?: number;
  };
}

export const QuizResultHeaderBlock: React.FC<QuizResultHeaderBlockProps> = ({
  properties = {},
  isSelected,
  onClick,
  className,
}) => {
  const {
    title = 'Seu Estilo Predominante é:',
    subtitle = 'Descubra como valorizar sua essência',
    styleName = 'Clássico',
    showBadge = true,
    badgeText = 'Resultado',
    fontSize = '32px',
    fontWeight = '700',
    textAlign = 'center',
    color = 'hsl(var(--foreground))',
    accentColor = '#B89B7A',
    backgroundColor = 'transparent',
    marginTop = 0,
    marginBottom = 32,
    paddingTop = 24,
    paddingBottom = 24,
    borderRadius = 0,
  } = properties;

  const containerStyle: React.CSSProperties = {
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
    paddingTop: `${paddingTop}px`,
    paddingBottom: `${paddingBottom}px`,
    backgroundColor,
    borderRadius: `${borderRadius}px`,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    fontWeight: typeof fontWeight === 'number' ? fontWeight : fontWeight,
    textAlign,
    color,
  };

  const styleNameStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: '800',
    textAlign,
    color: accentColor,
  };

  return (
    <div
      className={cn(
        'transition-all',
        isSelected && 'ring-2 ring-primary rounded',
        className
      )}
      style={containerStyle}
      onClick={onClick}
    >
      {showBadge && (
        <div className="flex justify-center mb-4">
          <span
            className="px-4 py-1 text-xs font-semibold rounded-full"
            style={{
              backgroundColor: `${accentColor}20`,
              color: accentColor,
            }}
          >
            {badgeText}
          </span>
        </div>
      )}
      
      <h1 style={titleStyle} className="mb-4 transition-all">
        {title}
      </h1>
      
      <div style={styleNameStyle} className="mb-4 transition-all">
        {styleName}
      </div>
      
      {subtitle && (
        <p
          className="text-lg opacity-80 transition-all"
          style={{ textAlign, color }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default QuizResultHeaderBlock;
