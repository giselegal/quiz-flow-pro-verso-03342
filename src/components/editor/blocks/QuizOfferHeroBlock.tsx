/**
 * 🎯 QUIZ OFFER HERO BLOCK - Componente Modular
 * Hero de oferta com CTA para conversão
 */

import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

interface QuizOfferHeroBlockProps extends BlockComponentProps {
  properties?: {
    title?: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    imageAlt?: string;
    showImage?: boolean;
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

export const QuizOfferHeroBlock: React.FC<QuizOfferHeroBlockProps> = ({
  properties = {},
  isSelected,
  onClick,
  className,
}) => {
  const {
    title = 'Transforme Seu Estilo Hoje',
    subtitle = 'Oferta Exclusiva para Você',
    description = 'Com base no seu resultado, preparamos uma oferta especial',
    imageUrl = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
    imageAlt = 'Oferta Exclusiva',
    showImage = true,
    fontSize = '36px',
    fontWeight = '700',
    textAlign = 'center',
    color = 'hsl(var(--foreground))',
    accentColor = '#B89B7A',
    backgroundColor = 'transparent',
    marginTop = 0,
    marginBottom = 32,
    paddingTop = 32,
    paddingBottom = 32,
    borderRadius = 16,
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

  const subtitleStyle: React.CSSProperties = {
    fontSize: '18px',
    textAlign,
    color: accentColor,
    fontWeight: '600',
  };

  return (
    <div
      className={cn(
        'transition-all overflow-hidden',
        isSelected && 'ring-2 ring-primary rounded',
        className
      )}
      style={containerStyle}
      onClick={onClick}
    >
      <div style={subtitleStyle} className="mb-2 transition-all uppercase tracking-wide">
        {subtitle}
      </div>
      
      <h1 style={titleStyle} className="mb-4 transition-all">
        {title}
      </h1>
      
      {description && (
        <p
          className="text-lg mb-6 opacity-80 transition-all"
          style={{ textAlign, color }}
        >
          {description}
        </p>
      )}
      
      {showImage && imageUrl && (
        <div className="mt-6">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full rounded-lg object-cover"
            style={{ maxHeight: '400px' }}
          />
        </div>
      )}
    </div>
  );
};

export default QuizOfferHeroBlock;
