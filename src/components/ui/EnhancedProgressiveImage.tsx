import React, { useState, useEffect, useRef } from 'react';
import { optimizeCloudinaryUrl, normalizeCloudinaryUrl } from '@/utils/imageUtils';

interface EnhancedProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  loading?: 'lazy' | 'eager';
  fetchpriority?: 'high' | 'low' | 'auto';
  style?: React.CSSProperties;
  fallbackSrc?: string;
}

const EnhancedProgressiveImage: React.FC<EnhancedProgressiveImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  onLoad,
  loading = 'lazy',
  fetchpriority = 'auto',
  style,
  fallbackSrc,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const maxRetries = 2;

  // URLs otimizadas
  const normalizedSrc = normalizeCloudinaryUrl(src);
  const optimizedSrc = optimizeCloudinaryUrl(normalizedSrc, {
    quality: 85,
    format: 'auto',
  });
  const placeholderSrc = optimizeCloudinaryUrl(normalizedSrc, {
    quality: 25,
    width: 40,
    format: 'auto',
  });

  const handleLoad = () => {
    setLoaded(true);
    setError(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    console.warn(`[EnhancedProgressiveImage] Erro ao carregar: ${src}`);
    if (retryCount < maxRetries) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        if (imgRef.current) {
          imgRef.current.src = optimizedSrc + `?retry=${retryCount + 1}`;
        }
      }, 1000 * (retryCount + 1));
    } else {
      setError(true);
      if (onLoad) onLoad();
    }
  };

  // Reset states when src changes
  useEffect(() => {
    setLoaded(false);
    setError(false);
    setRetryCount(0);
  }, [src]);

  // Fallback timer to avoid hanging UI on slow networks
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loaded && !error) {
        console.warn(`[EnhancedProgressiveImage] Timeout para: ${src}`);
        setLoaded(true);
        if (onLoad) onLoad();
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [loaded, error, src, onLoad]);

  return (
    <div className={`enhanced-progressive-image relative overflow-hidden ${className}`} style={style}>
      {/* Placeholder blur */}
      {!loaded && !error && (
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src={placeholderSrc}
            alt=""
            className="w-full h-full object-cover blur-sm scale-110 transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 to-gray-200/50 animate-pulse"></div>
        </div>
      )}

      {/* Main image */}
      {!error ? (
        <img
          ref={imgRef}
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          fetchPriority={fetchpriority}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      ) : fallbackSrc ? (
        <img
          src={fallbackSrc}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full object-cover transition-opacity duration-300 opacity-100"
          onLoad={handleLoad}
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400 py-8">
          <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span style={{ color: '#8B7355' }}>Imagem não disponível</span>
          <span className="text-xs text-gray-400 mt-1">Tentativas: {retryCount}/{maxRetries}</span>
        </div>
      )}

      {/* Loading indicator */}
      {!loaded && !error && (
        <div className="absolute bottom-2 right-2">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default EnhancedProgressiveImage;
