/**
 * 🎯 QUIZ LOGO BLOCK - Componente Modular
 * Logo isolado e 100% editável para Quiz
 */

import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

interface QuizLogoBlockProps extends BlockComponentProps {
  properties?: {
    logoUrl?: string;
    logoAlt?: string;
    width?: number;
    height?: number;
    backgroundColor?: string;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    borderRadius?: number;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  };
}

export const QuizLogoBlock: React.FC<QuizLogoBlockProps> = ({
  properties = {},
  isSelected,
  onClick,
  className,
}) => {
  const {
    logoUrl = 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=200',
    logoAlt = 'Logo',
    width = 120,
    height = 40,
    backgroundColor = 'transparent',
    marginTop = 0,
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0,
    paddingTop = 0,
    paddingBottom = 0,
    paddingLeft = 0,
    paddingRight = 0,
    borderRadius = 0,
    objectFit = 'contain',
  } = properties;

  const containerStyle: React.CSSProperties = {
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
    marginLeft: `${marginLeft}px`,
    marginRight: `${marginRight}px`,
    paddingTop: `${paddingTop}px`,
    paddingBottom: `${paddingBottom}px`,
    paddingLeft: `${paddingLeft}px`,
    paddingRight: `${paddingRight}px`,
    backgroundColor,
    borderRadius: `${borderRadius}px`,
  };

  return (
    <div
      className={cn(
        'inline-block transition-all',
        isSelected && 'ring-2 ring-primary',
        className
      )}
      style={containerStyle}
      onClick={onClick}
    >
      <img
        src={logoUrl}
        alt={logoAlt}
        width={width}
        height={height}
        className="transition-all"
        style={{ objectFit }}
      />
    </div>
  );
};

export default QuizLogoBlock;
