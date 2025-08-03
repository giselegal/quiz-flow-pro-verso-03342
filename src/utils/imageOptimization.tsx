// Image optimization utilities with lazy loading and WebP support
import { useIntersection } from '@/hooks/usePerformanceOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'empty',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState<string | null>(priority ? src : null);
  
  const { ref, isVisible } = useIntersection({ threshold: 0.1 });

  // Convert to WebP if supported
  const getOptimizedSrc = (originalSrc: string) => {
    if (typeof window === 'undefined') return originalSrc;
    
    const canvas = document.createElement('canvas');
    const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    if (supportsWebP && !originalSrc.includes('.webp')) {
      // In a real app, you'd have a service that converts images
      return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    
    return originalSrc;
  };

  React.useEffect(() => {
    if ((isVisible || priority) && !imageSrc) {
      setImageSrc(getOptimizedSrc(src));
    }
  }, [isVisible, priority, src, imageSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    onError?.();
  };

  const placeholderStyle = {
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: width || '100%',
    height: height || 'auto',
    minHeight: height ? `${height}px` : '200px'
  };

  return (
    <div ref={ref} className={className}>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            width: width || '100%',
            height: height || 'auto'
          }}
        />
      ) : (
        <div style={placeholderStyle}>
          {placeholder === 'blur' ? (
            <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
          ) : (
            <div className="text-gray-400">Loading...</div>
          )}
        </div>
      )}
      
      {error && (
        <div style={placeholderStyle}>
          <span className="text-gray-500">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

// Hook for image preloading
export const useImagePreload = (srcs: string[]) => {
  React.useEffect(() => {
    srcs.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [srcs]);
};

// Utility for responsive images
export const getResponsiveImageSrc = (
  baseSrc: string,
  width: number,
  quality = 75
) => {
  // In a real app, this would integrate with a CDN like Cloudinary
  const params = new URLSearchParams({
    w: width.toString(),
    q: quality.toString(),
    f: 'auto'
  });
  
  return `${baseSrc}?${params.toString()}`;
};

// Image optimization for backgrounds
export const OptimizedBackground: React.FC<{
  src: string;
  children: React.ReactNode;
  className?: string;
}> = ({ src, children, className = '' }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const { ref, isVisible } = useIntersection({ threshold: 0.1 });

  React.useEffect(() => {
    if (isVisible) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.src = src;
    }
  }, [isVisible, src]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        backgroundImage: isLoaded ? `url(${src})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 0.3s ease-in-out'
      }}
    >
      {children}
    </div>
  );
};