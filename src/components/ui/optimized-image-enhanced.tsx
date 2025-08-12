import React, { useState, useEffect, useRef } from 'react';
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
}

export const OptimizedImageEnhanced: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  onLoad,
  quality = 85,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current || priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority]);

  const getOptimizedSrc = (size?: number) => {
    if (src.includes('cloudinary')) {
      const params = [`q_${quality}`, 'f_auto'];
      if (size) params.push(`w_${size}`);
      return src.replace('/upload/', `/upload/${params.join(',')}/`);
    }
    return src;
  };

  const srcSet = [320, 640, 768, 1024, 1280]
    .map(size => `${getOptimizedSrc(size)} ${size}w`)
    .join(', ');

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={isInView ? getOptimizedSrc(width) : undefined}
        srcSet={isInView ? srcSet : undefined}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
      />
    </div>
  );
};
