
import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { optimizeCloudinaryUrl, getResponsiveImageSources, getLowQualityPlaceholder } from '@/utils/imageUtils';
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
  quality?: number;
  placeholderColor?: string;
}

/**
 * Componente de imagem otimizado com melhor experiência visual
 * - Carregamento progressivo com efeito blur
 * - Suporte para lazy loading e carregamento prioritário
 * - Tamanhos responsivos otimizados
 * - Fallback para imagens indisponíveis
 */
export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  onLoad,
  objectFit = 'cover',
  style,
  quality = 85,
  placeholderColor = '#f5f5f5'
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [blurredLoaded, setBlurredLoaded] = useState(false);

  // Obter metadados da imagem do banco de imagens
  const imageMetadata = useMemo(() => src ? getImageMetadata(src) : undefined, [src]);

  // Gerar placeholders e URLs otimizadas apenas uma vez
  const placeholderSrc = useMemo(() => {
    if (!src) return '';
    return getLowQualityPlaceholder(src);
  }, [src]);

  // Otimizar URLs do Cloudinary automaticamente
  const optimizedSrc = useMemo(() => {
    if (!src) return '';
    
    // Usar metadados width/height se disponíveis e não substituídos
    const imgWidth = width || (imageMetadata?.width || undefined);
    const imgHeight = height || (imageMetadata?.height || undefined);
    
    return getOptimizedImage(src, {
      quality: quality,
      format: 'auto',
      width: imgWidth,
      height: imgHeight
    });
  }, [src, width, height, imageMetadata, quality]);

  // Obter atributos de imagem responsiva se necessário
  const responsiveImageProps = useMemo(() => {
    if (!src) return { srcSet: '', sizes: '' };
    if (width && width > 300) {
      return getResponsiveImageSources(src, [width/2, width, width*1.5]);
    }
    return { srcSet: '', sizes: '' };
  }, [src, width]);

  // Para imagens prioritárias, verificamos se já estão pré-carregadas
  useEffect(() => {
    // Redefine estados quando src muda
    setLoaded(false);
    setBlurredLoaded(false);
    setError(false);
    
    if (src && priority) {
      if (isImagePreloaded(src)) {
        setLoaded(true);
        onLoad?.();
      } else {
        // Caso contrário, carrega-a agora
        const img = new Image();
        img.src = optimizedSrc;
        img.onload = () => {
          setLoaded(true);
          onLoad?.();
        };
        img.onerror = () => setError(true);
      }

      // Sempre carrega a versão desfocada para transições mais suaves
      const blurImg = new Image();
      blurImg.src = placeholderSrc;
      blurImg.onload = () => setBlurredLoaded(true);
    }
  }, [optimizedSrc, placeholderSrc, priority, src, onLoad]);

  // Determina a proporção de aspecto se width e height forem fornecidos
  const aspectRatio = width && height ? `${width} / ${height}` : undefined;
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden",
        className
      )}
      style={{
        aspectRatio,
        ...style
      }} 
    >
      {!loaded && !error && (
        <>
          {/* Imagem de baixa qualidade como placeholder */}
          {blurredLoaded && (
            <img 
              src={placeholderSrc} 
              alt="" 
              width={width} 
              height={height} 
              className={cn(
                "absolute inset-0 w-full h-full",
                objectFit === 'cover' && "object-cover",
                objectFit === 'contain' && "object-contain",
                objectFit === 'fill' && "object-fill",
                objectFit === 'none' && "object-none",
                objectFit === 'scale-down' && "object-scale-down",
                "blur-sm scale-105" // Reduzi o blur para melhorar a percepção de qualidade
              )}
              aria-hidden="true"
            />
          )}
          
          {/* Efeito de carregamento */}
          <div 
            className="absolute inset-0 animate-pulse" 
            style={{ backgroundColor: placeholderColor }}
          />
        </>
      )}
      
      <img 
        src={optimizedSrc} 
        alt={imageMetadata?.alt || alt}  // Usa metadados alt se disponíveis
        width={width} 
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchpriority={priority ? "high" : "auto"}
        srcSet={responsiveImageProps.srcSet || undefined}
        sizes={responsiveImageProps.sizes || undefined}
        onLoad={() => {
          setLoaded(true);
          onLoad?.();
        }}
        onError={() => setError(true)}
        className={cn(
          "w-full h-full transition-opacity duration-300",
          !loaded && "opacity-0",
          loaded && "opacity-100",
          objectFit === 'cover' && "object-cover",
          objectFit === 'contain' && "object-contain",
          objectFit === 'fill' && "object-fill",
          objectFit === 'none' && "object-none",
          objectFit === 'scale-down' && "object-scale-down"
        )}
      />
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <span className="text-sm text-gray-500">Imagem não disponível</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
