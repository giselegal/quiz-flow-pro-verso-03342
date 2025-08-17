import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { getResponsiveImageSources, getLowQualityPlaceholder } from '@/utils/imageUtils';
import { getImageMetadata, isImagePreloaded, getOptimizedImage } from '@/utils/imageManager';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  style?: React.CSSProperties;
}

/**
 * Componente de imagem otimizado que implementa:
 * - Lazy loading
 * - Carregamento prioritário opcional
 * - Fallback para imagens que falham
 * - Estado de carregamento com placeholder
 * - Otimização automática de URLs do Cloudinary
 * - Carregamento progressivo com efeito blur
 * - Integração com o banco de imagens
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  onLoad,
  objectFit = 'cover',
  style,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [blurredLoaded, setBlurredLoaded] = useState(false);

  // Check if this image has metadata in our image bank
  const imageMetadata = useMemo(() => (src ? getImageMetadata(src) : undefined), [src]);

  // Generate placeholders and optimized URLs only once
  const placeholderSrc = useMemo(() => {
    if (!src) return '';
    return getLowQualityPlaceholder(src);
  }, [src]);

  // Otimizar URLs do Cloudinary automaticamente
  const optimizedSrc = useMemo(() => {
    if (!src) return '';

    // Use metadata width/height if available and not overridden
    const imgWidth = width || imageMetadata?.width || undefined;
    const imgHeight = height || imageMetadata?.height || undefined;

    return getOptimizedImage(src, {
      quality: 75, // Reduzido de 95 para 75
      format: 'auto',
      width: imgWidth,
      height: imgHeight,
    });
  }, [src, width, height, imageMetadata]);

  // Get responsive image attributes if needed
  const responsiveImageProps = useMemo(() => {
    if (!src) return { srcSet: '', sizes: '' };
    if (width && width > 300) {
      return getResponsiveImageSources(src, [width / 2, width, width * 1.5]);
    }
    return { srcSet: '', sizes: '' };
  }, [src, width]);

  // For priority images, we check if they're already preloaded and update state accordingly
  useEffect(() => {
    // Reset states when src changes
    setLoaded(false);
    setBlurredLoaded(false);
    setError(false);

    if (src && priority) {
      if (isImagePreloaded(src)) {
        // If already preloaded, mark as loaded
        setLoaded(true);
        onLoad?.();
      } else {
        // Otherwise load it now
        const img = new Image();
        img.src = optimizedSrc;
        img.onload = () => {
          setLoaded(true);
          onLoad?.();
        };
        img.onerror = () => setError(true);
      }

      // Always load the blurred version for smoother transitions
      const blurImg = new Image();
      blurImg.src = placeholderSrc;
      blurImg.onload = () => setBlurredLoaded(true);
    }
  }, [optimizedSrc, placeholderSrc, priority, src, onLoad]);

  return (
    <div
      className="relative"
      style={{
        width: style?.width || '100%', // Prioriza style.width, senão 100% para responsividade
        height: style?.height || (height ? `${height}px` : 'auto'), // Prioriza style.height, senão a prop height em pixels, senão auto
        ...style, // Aplica o resto do style original passado via props
      }}
    >
      {!loaded && !error && (
        <>
          {/* Low quality placeholder image */}
          {blurredLoaded && (
            <img
              src={placeholderSrc}
              alt=""
              width={width}
              height={height}
              className={cn(
                'absolute inset-0 w-full h-full',
                objectFit === 'cover' && 'object-cover',
                objectFit === 'contain' && 'object-contain',
                objectFit === 'fill' && 'object-fill',
                objectFit === 'none' && 'object-none',
                objectFit === 'scale-down' && 'object-scale-down',
                'blur-xl scale-110' // Blur effect for placeholders
              )}
              aria-hidden="true"
            />
          )}

          {/* Shimmer loading effect */}
          <div style={{ backgroundColor: '#E5DDD5' }} />
        </>
      )}

      <img
        src={optimizedSrc}
        alt={imageMetadata?.alt || alt} // Use metadata alt if available
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...(priority ? { fetchpriority: 'high' } : { fetchpriority: 'auto' })}
        srcSet={responsiveImageProps.srcSet || undefined}
        sizes={responsiveImageProps.sizes || undefined}
        onLoad={() => {
          setLoaded(true);
          onLoad?.();
        }}
        onError={() => setError(true)}
        className={cn(
          'w-full h-full transition-opacity duration-300',
          !loaded && 'opacity-0',
          loaded && 'opacity-100',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'fill' && 'object-fill',
          objectFit === 'none' && 'object-none',
          objectFit === 'scale-down' && 'object-scale-down',
          className
        )}
        style={style}
      />

      {error && (
        <div style={{ backgroundColor: '#E5DDD5' }}>
          <span style={{ color: '#8B7355' }}>Imagem não disponível</span>
        </div>
      )}
    </div>
  );
}
