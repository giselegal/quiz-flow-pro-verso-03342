/**
 * 🖼️ ENHANCED OPTIMIZED IMAGE COMPONENT
 * 
 * Componente que integra o sistema de otimização avançado
 * com o OptimizedImage existente, fornecendo:
 * - Responsive images automático
 * - Multiple formats (AVIF, WebP, JPEG)
 * - Lazy loading inteligente
 * - Performance monitoring
 * - Fallbacks robustos
 */

import React, { useState, useEffect, useRef, memo } from 'react';
import { useResponsiveOptimization } from '../../utils/imageOptimizationManager';

interface EnhancedOptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    aspectRatio?: number;
    className?: string;
    placeholder?: 'blur' | 'skeleton' | 'none';
    priority?: boolean; // Para imagens above-the-fold
    onLoad?: () => void;
    onError?: () => void;
    sizes?: string; // Para responsive images
    quality?: number;
    formats?: ('avif' | 'webp' | 'jpeg' | 'png')[];
}

/**
 * 🎨 PLACEHOLDER COMPONENTS
 */
const BlurPlaceholder: React.FC<{ width?: number; height?: number; aspectRatio?: number }> = ({
    width,
    height,
    aspectRatio = 16 / 9
}) => {
    const calculatedHeight = height || (width ? width / aspectRatio : 200);

    return (
        <div
            className="animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]"
            style={{
                width: width || '100%',
                height: calculatedHeight,
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite'
            }}
            aria-label="Carregando imagem..."
        />
    );
};

const SkeletonPlaceholder: React.FC<{ width?: number; height?: number; aspectRatio?: number }> = ({
    width,
    height,
    aspectRatio = 16 / 9
}) => {
    const calculatedHeight = height || (width ? width / aspectRatio : 200);

    return (
        <div
            className="bg-gray-200 rounded animate-pulse flex items-center justify-center"
            style={{ width: width || '100%', height: calculatedHeight }}
        >
            <svg
                className="w-12 h-12 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                />
            </svg>
        </div>
    );
};

/**
 * 🖼️ ENHANCED OPTIMIZED IMAGE COMPONENT
 */
const EnhancedOptimizedImage: React.FC<EnhancedOptimizedImageProps> = memo(({
    src,
    alt,
    width,
    height,
    aspectRatio = 16 / 9,
    className = '',
    placeholder = 'blur',
    priority = false,
    onLoad,
    onError,
    sizes
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isInView, setIsInView] = useState(priority); // Priority images são carregadas imediatamente
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Calcula largura base para otimização responsiva
    const baseWidth = width || 1200;

    // Hook para otimização responsiva
    const { optimizedImages, isLoading } = useResponsiveOptimization(
        src,
        baseWidth,
        aspectRatio
    );

    /**
     * 👁️ INTERSECTION OBSERVER PARA LAZY LOADING
     */
    useEffect(() => {
        if (priority || isInView) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '50px', // Carrega 50px antes de entrar na viewport
                threshold: 0.1
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [priority, isInView]);

    /**
     * 🔄 HANDLERS DE CARREGAMENTO
     */
    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();

        // Registra métricas de performance
        if (import.meta.env.DEV) {
            console.log(`✅ Image loaded: ${src}`);
        }
    };

    const handleError = () => {
        setHasError(true);
        setIsLoaded(true); // Para esconder o placeholder
        onError?.();

        console.warn(`❌ Failed to load image: ${src}`);
    };

    /**
     * 🖼️ GERAÇÃO DE SRCSET E SIZES
     */
    const generateSrcSet = () => {
        if (isLoading || Object.keys(optimizedImages).length === 0) {
            return undefined;
        }

        const srcSetEntries: string[] = [];

        // Gera srcset para cada formato
        Object.entries(optimizedImages).forEach(([key, url]) => {
            const match = key.match(/(\d+)w_(\w+)/);
            if (match) {
                const [, width, format] = match;
                if (format === 'webp' || format === 'avif') {
                    srcSetEntries.push(`${url} ${width}w`);
                }
            }
        });

        return srcSetEntries.length > 0 ? srcSetEntries.join(', ') : undefined;
    };

    const defaultSizes = sizes || `
    (max-width: 640px) 100vw,
    (max-width: 768px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  `.replace(/\s+/g, ' ').trim();

    /**
     * 🎨 RENDERIZAÇÃO CONDICIONAL
     */
    const renderPlaceholder = () => {
        if (isLoaded || hasError) return null;

        switch (placeholder) {
            case 'blur':
                return <BlurPlaceholder width={width} height={height} aspectRatio={aspectRatio} />;
            case 'skeleton':
                return <SkeletonPlaceholder width={width} height={height} aspectRatio={aspectRatio} />;
            default:
                return null;
        }
    };

    const renderFallback = () => {
        if (!hasError) return null;

        return (
            <div
                className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-500 ${className}`}
                style={{
                    width: width || '100%',
                    height: height || (width ? width / aspectRatio : 200)
                }}
            >
                <div className="text-center p-4">
                    <svg className="mx-auto h-8 w-8 mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zM11 8a1 1 0 112 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs">Erro ao carregar</p>
                    <p className="text-xs text-gray-400 mt-1">{alt}</p>
                </div>
            </div>
        );
    };

    // Calcula altura automaticamente se não especificada
    const calculatedHeight = height || (width ? width / aspectRatio : undefined);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${isLoaded ? '' : 'animate-pulse'}`}
            style={{ width: width || '100%', height: calculatedHeight }}
        >
            {/* Placeholder enquanto carrega */}
            {renderPlaceholder()}

            {/* Fallback em caso de erro */}
            {renderFallback()}

            {/* Imagem principal (só renderiza quando entra na viewport ou é priority) */}
            {(isInView || priority) && !hasError && (
                <picture>
                    {/* AVIF source (melhor compressão) */}
                    {!isLoading && Object.keys(optimizedImages).some(key => key.includes('avif')) && (
                        <source
                            srcSet={generateSrcSet()?.replace(/webp/g, 'avif')}
                            sizes={defaultSizes}
                            type="image/avif"
                        />
                    )}

                    {/* WebP source (boa compressão, amplo suporte) */}
                    {!isLoading && generateSrcSet() && (
                        <source
                            srcSet={generateSrcSet()}
                            sizes={defaultSizes}
                            type="image/webp"
                        />
                    )}

                    {/* Fallback JPEG/PNG */}
                    <img
                        ref={imgRef}
                        src={src}
                        alt={alt}
                        width={width}
                        height={calculatedHeight}
                        sizes={defaultSizes}
                        className={`
              transition-opacity duration-300 object-cover
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
              ${className}
            `}
                        onLoad={handleLoad}
                        onError={handleError}
                        loading={priority ? 'eager' : 'lazy'}
                        decoding="async"
                        style={{
                            width: width || '100%',
                            height: calculatedHeight || 'auto',
                            aspectRatio: `${aspectRatio}`,
                        }}
                    />
                </picture>
            )}
        </div>
    );
});

EnhancedOptimizedImage.displayName = 'EnhancedOptimizedImage';

/**
 * 🎯 CONVENIENCE WRAPPERS
 */

// Para imagens hero/banner (priority)
export const HeroImage: React.FC<Omit<EnhancedOptimizedImageProps, 'priority'>> = (props) => (
    <EnhancedOptimizedImage {...props} priority={true} />
);

// Para avatares/thumbs pequenos
export const ThumbnailImage: React.FC<Omit<EnhancedOptimizedImageProps, 'aspectRatio' | 'placeholder'>> = (props) => (
    <EnhancedOptimizedImage {...props} aspectRatio={1} placeholder="skeleton" />
);

// Para imagens de conteúdo
export const ContentImage: React.FC<EnhancedOptimizedImageProps> = (props) => (
    <EnhancedOptimizedImage {...props} />
);

export default EnhancedOptimizedImage;
