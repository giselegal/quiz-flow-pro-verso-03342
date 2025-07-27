import React from 'react';
import { cn } from '../../../lib/utils';

interface ImageDisplayInlineBlockProps {
  block: {
    id: string;
    type: string;
    properties: {
      src?: string;
      alt?: string;
      width?: number | string;
      height?: number | string;
      objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
      borderRadius?: string;
      className?: string;
    };
  };
  isSelected?: boolean;
  onClick?: () => void;
  onSaveInline?: (blockId: string, updates: any) => void;
  disabled?: boolean;
  className?: string;
}

const ImageDisplayInlineBlock: React.FC<ImageDisplayInlineBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  onSaveInline,
  disabled = false,
  className
}) => {
  const {
    src = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
    alt = 'Imagem',
    width = 'auto',
    height = 'auto',
    objectFit = 'cover',
    borderRadius = '8px',
    className: imageClassName = ''
  } = block.properties;

  return (
    <div
      className={cn(
        'relative inline-block',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        className
      )}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'max-w-full h-auto',
          imageClassName
        )}
        style={{
          objectFit,
          borderRadius,
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height
        }}
        onError={(e) => {
          // Fallback para imagem quebrada
          const target = e.target as HTMLImageElement;
          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbTwvdGV4dD48L3N2Zz4=';
        }}
      />
    </div>
  );
};

export default ImageDisplayInlineBlock;
