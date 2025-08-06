import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

interface ImageDisplayInlineProperties {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  alignment?: 'left' | 'center' | 'right';
  caption?: string;
  showCaption?: boolean;
  lazy?: boolean;
  quality?: 'low' | 'medium' | 'high';
  fallbackSrc?: string;
}

const ImageDisplayInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  properties,
  isSelected,
  onClick,
  onPropertyChange,
}) => {
  const {
    src = 'https://via.placeholder.com/400x300?text=Imagem',
    alt = 'Imagem',
    width = '100%',
    height = 'auto',
    objectFit = 'cover',
    borderRadius = 'md',
    alignment = 'center',
    caption,
    showCaption = false,
    lazy = true,
    quality = 'medium',
    fallbackSrc = 'https://via.placeholder.com/400x300?text=Erro+ao+carregar',
  } = (properties || {}) as ImageDisplayInlineProperties;

  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handlePropertyUpdate = (key: string, value: any) => {
    onPropertyChange?.(key, value);
  };

  const getRadiusClass = () => {
    const radiusMap = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };
    return radiusMap[borderRadius] || radiusMap.md;
  };

  const getAlignmentClass = () => {
    const alignMap = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    };
    return alignMap[alignment] || alignMap.center;
  };

  const getObjectFitClass = () => {
    const fitMap = {
      cover: 'object-cover',
      contain: 'object-contain',
      fill: 'object-fill',
      none: 'object-none',
      'scale-down': 'object-scale-down',
    };
    return fitMap[objectFit] || fitMap.cover;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const imageSrc = imageError ? fallbackSrc : src;

  return (
    <div
      className={cn(
        'image-display-inline-block w-full transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500 ring-opacity-50 rounded-md p-2'
      )}
      onClick={onClick}
    >
      <div className={cn('flex', getAlignmentClass())}>
        <div className="relative">
          {/* Loading placeholder */}
          {!imageLoaded && (
            <div
              className={cn(
                'absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center',
                getRadiusClass()
              )}
              style={{ width, height: height === 'auto' ? '200px' : height }}
            >
              <span className="text-gray-400 text-sm">Carregando...</span>
            </div>
          )}

          <img
            src={imageSrc}
            alt={alt}
            className={cn(
              'transition-all duration-200',
              getRadiusClass(),
              getObjectFitClass(),
              !imageLoaded && 'opacity-0'
            )}
            style={{
              width,
              height,
            }}
            loading={lazy ? 'lazy' : 'eager'}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />

          {/* Image controls when selected */}
          {isSelected && (
            <div className="absolute top-2 right-2 bg-white rounded-md shadow-md p-2 space-y-1">
              <input
                type="url"
                placeholder="URL da imagem"
                value={src}
                onChange={(e) => handlePropertyUpdate('src', e.target.value)}
                className="w-32 text-xs p-1 border rounded"
              />
              <input
                type="text"
                placeholder="Texto alternativo"
                value={alt}
                onChange={(e) => handlePropertyUpdate('alt', e.target.value)}
                className="w-32 text-xs p-1 border rounded"
              />
            </div>
          )}
        </div>
      </div>

      {/* Caption */}
      {showCaption && caption && (
        <div className={cn('mt-2', getAlignmentClass())}>
          <p
            className="text-sm text-gray-600 italic"
            contentEditable={isSelected}
            suppressContentEditableWarning
            onBlur={(e) => handlePropertyUpdate('caption', e.target.textContent || '')}
          >
            {caption}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageDisplayInlineBlock;
