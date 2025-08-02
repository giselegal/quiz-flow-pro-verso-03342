
import React, { useState, useEffect } from 'react';
import { getOptimizedImageUrl, getLowQualityPlaceholder } from '@/utils/imageManager';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  quality?: number;
  priority?: boolean;
  placeholderColor?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  lazy?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  quality = 80,
  priority = false,
  placeholderColor = '#f8f5f2',
  objectFit = 'cover',
  onLoad,
  lazy = !priority
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Get optimized image URLs
  const optimizedSrc = src ? getOptimizedImageUrl(src, { width, height, quality }) : '';
  const placeholderSrc = src ? getLowQualityPlaceholder(src) : '';
  
  // Handle image loading completion
  const handleImageLoaded = () => {
    setLoaded(true);
    if (onLoad) onLoad();
  };
  
  // Report load error
  const handleImageError = () => {
    console.error('Error loading image:', optimizedSrc);
    setError(true);
  };
  
  // Reset state on src change
  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  // Calculate aspect ratio for placeholder
  const aspectRatio = height && width ? (height / width) : undefined;
  const paddingBottom = aspectRatio ? `${aspectRatio * 100}%` : undefined;
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      style={{ 
        paddingBottom: paddingBottom,
        backgroundColor: placeholderColor
      }}
    >
      {/* Placeholder or fallback */}
      {!loaded && !error && placeholderSrc && (
        <img
          src={placeholderSrc}
          alt=""
          className={`absolute inset-0 w-full h-full object-${objectFit} transition-opacity blur-sm`}
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      {!error ? (
        <img
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          loading={lazy ? 'lazy' : 'eager'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleImageLoaded}
          onError={handleImageError}
          className={`absolute inset-0 w-full h-full object-${objectFit} transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-sm text-gray-500">Imagem indisponível</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
