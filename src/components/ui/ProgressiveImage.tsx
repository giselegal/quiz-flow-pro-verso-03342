import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ProgressiveImageProps {
  src: string;
  lowQualitySrc?: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
  priority?: boolean;
  onLoad?: () => void;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  lowQualitySrc,
  alt,
  className,
  style,
  width,
  height,
  priority = false,
  onLoad,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLowQualityLoaded, setIsLowQualityLoaded] = useState(false);

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    setHasError(false);

    // Check if image is already in browser cache
    if (imageRef.current?.complete && imageRef.current?.naturalWidth > 0) {
      setIsLoaded(true);
      if (onLoad) onLoad();
    }
  }, [src, onLoad]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();

    // Log performance metrics for priority images only
    if (priority) {
      console.log(`Priority image loaded: ${src.substring(0, 50)}...`);

      // Report to performance observer if available
      if ('performance' in window && 'mark' in performance) {
        try {
          performance.mark(`img-loaded-${src.substring(0, 20)}`);

          // If we have the PerformanceObserver API available, use it to track LCP
          if ('PerformanceObserver' in window) {
            // This is just for monitoring, no actual dependency
            console.log('Image loaded that might affect LCP');
          }
        } catch (e) {
          // Ignore errors with performance marking
        }
      }
    }
  };

  const handleLowQualityLoad = () => {
    setIsLowQualityLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    console.error(`Failed to load image: ${src.substring(0, 50)}...`);
  };

  return (
    <div className={cn('relative overflow-hidden', className)} style={style}>
      {/* Low quality placeholder - improved for faster loading */}
      {lowQualitySrc && !isLoaded && (
        <img
          src={lowQualitySrc}
          alt={`Carregando ${alt}`}
          className={cn(
            'w-full h-full object-cover absolute inset-0 blur-sm transition-opacity duration-300',
            isLowQualityLoaded ? 'opacity-100' : 'opacity-0'
          )}
          width={width || '100%'}
          height={height || 'auto'}
          onLoad={handleLowQualityLoad}
          loading="eager"
          decoding="sync"
        />
      )}

      {/* Actual image with improved loading attributes */}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-all duration-500',
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
        )}
        width={width || '100%'}
        height={height || 'auto'}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...(priority ? { fetchpriority: 'high' } : { fetchpriority: 'auto' })}
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Error fallback */}
      {hasError && (
        <div style={{ backgroundColor: '#E5DDD5' }}>
          <span style={{ color: '#8B7355' }}>Imagem indisponível</span>
        </div>
      )}

      {/* Loading skeleton when neither image is loaded */}
      {!isLoaded && !isLowQualityLoaded && <div style={{ backgroundColor: '#E5DDD5' }} />}
    </div>
  );
};

export default ProgressiveImage;
