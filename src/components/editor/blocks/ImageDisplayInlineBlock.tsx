/**
 * 🎯 IMAGE DISPLAY INLINE BLOCK - Componente Modular Completo
 * Imagem com propriedades universais e 100% editável
 */

import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

interface ImageDisplayInlineBlockProps extends BlockComponentProps {
  properties?: {
    src?: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    maxWidth?: number | string;
    minHeight?: number | string;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    borderRadius?: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    boxShadow?: string;
    opacity?: number;
  };
}

export const ImageDisplayInlineBlock: React.FC<ImageDisplayInlineBlockProps> = ({
  properties = {},
  isSelected,
  onClick,
  className,
}) => {
  const {
    src = '',
    alt = 'Imagem',
    width = 'auto',
    height = 'auto',
    maxWidth = '100%',
    minHeight = 'auto',
    objectFit = 'cover',
    borderRadius = 8,
    marginTop = 0,
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0,
    paddingTop = 0,
    paddingBottom = 0,
    paddingLeft = 0,
    paddingRight = 0,
    backgroundColor = 'transparent',
    borderColor,
    borderWidth = 0,
    boxShadow,
    opacity = 1,
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
    ...(borderColor && borderWidth && {
      border: `${borderWidth}px solid ${borderColor}`,
    }),
    ...(boxShadow && { boxShadow }),
    opacity,
  };

  const imageStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
    objectFit,
    borderRadius: `${borderRadius}px`,
  };

  if (!src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted rounded-lg transition-all',
          isSelected && 'ring-2 ring-primary',
          className
        )}
        style={{
          ...containerStyle,
          minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight || '200px',
        }}
        onClick={onClick}
      >
        <span className="text-muted-foreground text-sm">Selecione uma imagem</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative transition-all',
        isSelected && 'ring-2 ring-primary rounded',
        className
      )}
      style={containerStyle}
      onClick={onClick}
    >
      <img src={src} alt={alt} style={imageStyle} className="transition-all" />
    </div>
  );
};

export default ImageDisplayInlineBlock;
