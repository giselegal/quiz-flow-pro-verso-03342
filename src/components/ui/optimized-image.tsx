import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  onLoad,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  sizes = '100vw',
  fill = false,
  style = {},
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  // Define shouldLoad based on priority or if image is in view
  const shouldLoad = priority || isInView;

  // Setup intersection observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const currentImgRef = imgRef.current;
    if (!currentImgRef) return;

    observerRef.current = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    observerRef.current.observe(currentImgRef);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority]);

  // Generate optimized image URLs for different providers
  const getOptimizedSrc = (originalSrc: string, targetWidth?: number) => {
    if (originalSrc.includes('cloudinary.com')) {
      const baseUrl = originalSrc.split('/upload/')[0];
      const imagePath = originalSrc.split('/upload/')[1];

      const transformations = [
        `q_${quality}`,
        'f_auto',
        ...(targetWidth ? [`w_${targetWidth}`] : []),
        'c_limit',
      ].join(',');

      return `${baseUrl}/upload/${transformations}/${imagePath}`;
    }

    return originalSrc;
  };

  // Generate srcSet for responsive images
  const generateSrcSet = () => {
    if (!width || hasError) return undefined;

    const breakpoints = [480, 640, 768, 1024, 1280, 1536];
    const relevantBreakpoints = breakpoints.filter(bp => bp <= width * 2);

    return relevantBreakpoints.map(bp => `${getOptimizedSrc(src, bp)} ${bp}w`).join(', ');
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    console.warn(`Failed to load image: ${src}`);
  };

  // Don't render anything if not in view and not priority
  if (!isInView && !priority) {
    return (
      <div
        ref={imgRef}
        className={cn('bg-gray-200 animate-pulse', fill ? 'absolute inset-0' : '', className)}
        style={fill ? { ...style } : { width, height, ...style }}
      />
    );
  }

  // Show error state
  if (hasError) {
    return (
      <div
        className={cn(
          'bg-gray-100 flex items-center justify-center text-gray-400',
          fill ? 'absolute inset-0' : '',
          className
        )}
        style={fill ? { ...style } : { width, height, ...style }}
      >
        <span className="text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <div
      className={cn('relative overflow-hidden', fill ? 'absolute inset-0' : '', className)}
      style={fill ? { ...style } : { width, height, ...style }}
    >
      {/* Placeholder/blur effect */}
      {placeholder === 'blur' && blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-105"
          aria-hidden="true"
        />
      )}

      {/* Loading placeholder */}
      {!isLoaded && placeholder === 'empty' && <div style={{ backgroundColor: '#E5DDD5' }} />}

      {/* Main image - VERSÃO CORRIGIDA */}
      <img
        ref={imgRef}
        src={shouldLoad ? src : undefined}
        srcSet={shouldLoad ? generateSrcSet() : undefined}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={cn(
          'transition-opacity duration-300',
          fill ? 'absolute inset-0 w-full h-full object-cover' : 'w-full h-auto',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={{
          ...style,
          ...(fill && { objectFit: 'cover', width: '100%', height: '100%' }),
        }}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default OptimizedImage;
