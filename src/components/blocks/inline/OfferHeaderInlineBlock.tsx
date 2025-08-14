import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { logBlockDebug, safeGetBlockProperties } from '@/utils/blockUtils';

/**
 * OfferHeaderInlineBlock - Header fixo com logo para página de oferta
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */

const OfferHeaderInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = '',
}) => {
  logBlockDebug('OfferHeaderInlineBlock', block);
  const properties = safeGetBlockProperties(block);

  const {
    logoUrl = "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
    logoAlt = "Logo Gisele Galvão",
    logoWidth = 180,
    logoHeight = 80,
    isSticky = true,
    backgroundColor = "rgba(255, 255, 255, 0.9)",
    backdropBlur = true,
    containerWidth = "full",
    spacing = "small"
  } = properties;

  const spacingClasses = {
    small: "py-4 px-6",
    medium: "py-6 px-8", 
    large: "py-8 px-10"
  };

  const containerClasses = {
    full: "w-full max-w-none",
    container: "max-w-7xl mx-auto",
    narrow: "max-w-4xl mx-auto"
  };

  return (
    <header
      className={cn(
        'w-full transition-all duration-200',
        isSticky && 'sticky top-0 z-50',
        backdropBlur && 'backdrop-blur-sm',
        'border-b border-gray-100',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        'cursor-pointer',
        className
      )}
      style={{
        backgroundColor
      }}
      onClick={onClick}
    >
      <div className={cn(
        spacingClasses[spacing as keyof typeof spacingClasses] || spacingClasses.small,
        containerClasses[containerWidth as keyof typeof containerClasses] || containerClasses.container,
        "flex justify-center"
      )}>
        <img
          src={logoUrl}
          alt={logoAlt}
          width={logoWidth}
          height={logoHeight}
          className="h-auto object-contain"
          loading="eager"
        />
      </div>
    </header>
  );
};

export default OfferHeaderInlineBlock;