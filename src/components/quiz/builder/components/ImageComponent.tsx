import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { optimizeCloudinaryUrl } from '@/utils/imageUtils';

interface ImageComponentProps {
  data: {
    imageUrl?: string;
    alt?: string;
    caption?: string;
    [key: string]: any;
  };
  style?: {
    backgroundColor?: string;
    textColor?: string;
    [key: string]: any;
  };
  isSelected?: boolean;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ data, style, isSelected }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const optimizedImageUrl = data.imageUrl
    ? optimizeCloudinaryUrl(data.imageUrl, { quality: 95, format: 'auto' })
    : '';

  return (
    <div
      className={cn('p-4 text-center', isSelected && 'outline-dashed outline-1 outline-blue-400')}
      style={{
        backgroundColor: style?.backgroundColor || 'transparent',
        color: style?.textColor || 'inherit',
      }}
    >
      <div className="relative">
        {data.imageUrl && !imageError ? (
          <>
            {/* Loading placeholder */}
            {!imageLoaded && (
              <div style={{ backgroundColor: '#E5DDD5' }}>
                <span className="text-gray-400 text-sm">Carregando...</span>
              </div>
            )}

            {/* Actual image */}
            <img
              src={optimizedImageUrl}
              alt={data.alt || 'Imagem do quiz'}
              className={cn(
                'max-w-full mx-auto rounded-md',
                imageLoaded ? 'opacity-100' : 'opacity-0',
                'transition-opacity duration-300'
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div style={{ color: '#8B7355' }}>
            <p>Imagem não disponível</p>
          </div>
        )}
      </div>
      {data.caption && <p className="text-sm mt-2 opacity-75">{data.caption}</p>}
    </div>
  );
};

export default ImageComponent;
