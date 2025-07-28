import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

/**
 * ImageDisplayInlineBlock - Componente modular inline horizontal
 * Imagem responsiva com aspectos configuráveis
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const ImageDisplayInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = ''
}) => {
  const {
    src = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp',
    alt = 'Imagem',
    aspectRatio = 'square', // square, portrait, landscape, auto
    size = 'medium',
    showBadge = false,
    badgeText = 'Destaque',
    objectFit = 'cover',
    borderRadius = 'lg'
  } = block.properties;

  // Tamanhos modulares responsivos
  const sizeClasses = {
    small: 'w-full sm:w-48 md:w-56',
    medium: 'w-full max-w-md mx-auto',
    large: 'w-full sm:w-80 md:w-96 lg:w-[28rem]'
  };

  // Aspect ratios
  const aspectRatioClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    auto: 'h-auto'
  };

  // Object fit
  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none'
  };

  // Border radius
  const borderRadiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl'
  };

  return (
    <div
      className={cn(
        // INLINE HORIZONTAL: Flexível e quebra linha automaticamente
        'flex-shrink-0 flex-grow-0 relative',
        // Responsivo modular
        sizeClasses[size as keyof typeof sizeClasses],
        // Estados do editor
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        'cursor-pointer transition-all duration-200',
        className
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          'relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300',
          aspectRatioClasses[aspectRatio as keyof typeof aspectRatioClasses],
          borderRadiusClasses[borderRadius as keyof typeof borderRadiusClasses]
        )}
      >
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full transition-transform duration-500 hover:scale-105',
            objectFitClasses[objectFit as keyof typeof objectFitClasses]
          )}
        />
        
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Badge flutuante */}
        {showBadge && badgeText && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
            <span className="text-sm font-medium text-[#432818]">{badgeText}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDisplayInlineBlock;
