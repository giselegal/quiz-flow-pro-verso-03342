import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import React from 'react';

/**
 * ImageDisplayInlineBlock - Versão Limpa
 * Componente de imagem simples sem dependências problemáticas
 */
const ImageDisplayInlineBlockClean: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = '',
}) => {
  const {
    src = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp',
    alt = 'Imagem',
    width = 'auto',
    height = 'auto',
    aspectRatio = '16/9',
    objectFit = 'cover',
  } = block?.properties || {};

  return (
    <div
      className={cn('relative inline-block', isSelected && 'ring-2 ring-blue-500', className)}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          'rounded-lg shadow-md',
          objectFit === 'cover' ? 'object-cover' : 'object-contain'
        )}
        style={{
          width: width === 'auto' ? 'auto' : width,
          height: height === 'auto' ? 'auto' : height,
          aspectRatio: aspectRatio,
        }}
      />
    </div>
  );
};

export default ImageDisplayInlineBlockClean;
