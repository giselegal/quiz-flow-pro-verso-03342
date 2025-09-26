/**
 * 🖼️ OPTIMIZED IMAGE COMPONENT
 * 
 * Componente React para exibir imagens otimizadas do IndexedDB
 * com loading states, fallbacks e lazy loading
 */

import React, { useState, useRef, useEffect } from 'react';
import { useOptimizedImage } from '../services/OptimizedImageStorage';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'png' | 'jpeg';
    lazy?: boolean;
    placeholder?: React.ReactNode;
    errorFallback?: React.ReactNode;
    onLoad?: () => void;
    onError?: (error: string) => void;
    style?: React.CSSProperties;
}

interface ImageLoadingProps {
    width?: number;
    height?: number;
    className?: string;
}

// ============================================================================
// COMPONENTES DE LOADING E PLACEHOLDER
// ============================================================================

const ImageSkeleton: React.FC<ImageLoadingProps> = ({ width, height, className }) => (
    <div
        className={`bg-gray-200 animate-pulse rounded ${className}`}
        style={{
            width: width || '100%',
            height: height || '200px',
            minHeight: '100px'
        }}
    >
        <div className="flex items-center justify-center h-full text-gray-400">
            <svg
                className="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
        </div>
    </div>
);

const ImageError: React.FC<ImageLoadingProps & { error: string }> = ({
    width,
    height,
    className
}) => (
    <div
        className={`bg-red-50 border border-red-200 rounded flex flex-col items-center justify-center text-red-500 ${className}`}
        style={{
            width: width || '100%',
            height: height || '200px',
            minHeight: '100px'
        }}
    >
        <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
        </svg>
        <span className="text-xs text-center px-2">
            Erro ao carregar imagem
        </span>
    </div>
);

// ============================================================================
// HOOK PARA INTERSECTION OBSERVER (LAZY LOADING)
// ============================================================================

function useIntersectionObserver(
    elementRef: React.RefObject<Element>,
    { threshold = 0.1, root = null, rootMargin = '0%' }
): boolean {
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
            },
            { threshold, root, rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [elementRef, threshold, root, rootMargin]);

    return isIntersecting;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className = '',
    width,
    height,
    quality = 0.8,
    format = 'webp',
    lazy = true,
    placeholder,
    errorFallback,
    onLoad,
    onError,
    style,
    ...props
}) => {
    const imgRef = useRef<HTMLDivElement>(null);
    const [shouldLoad, setShouldLoad] = useState(!lazy);

    // Usar Intersection Observer para lazy loading
    const isInView = useIntersectionObserver(imgRef, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    // Determinar se deve carregar a imagem
    useEffect(() => {
        if (!lazy || isInView) {
            setShouldLoad(true);
        }
    }, [lazy, isInView]);

    // Hook para imagem otimizada
    const { imageUrl, loading, error, reload } = useOptimizedImage(
        shouldLoad ? src : '',
        {
            quality,
            format,
            maxWidth: width,
            maxHeight: height
        }
    );

    // Callbacks
    useEffect(() => {
        if (imageUrl && !loading && onLoad) {
            onLoad();
        }
    }, [imageUrl, loading, onLoad]);

    useEffect(() => {
        if (error && onError) {
            onError(error);
        }
    }, [error, onError]);

    // ========================================================================
    // RENDERIZAÇÃO CONDICIONAL
    // ========================================================================

    // Se não deve carregar ainda (lazy loading)
    if (!shouldLoad) {
        return (
            <div ref={imgRef} className={className} style={{ width, height, ...style }}>
                {placeholder ? (
                    placeholder
                ) : (
                    <ImageSkeleton width={width} height={height} className="w-full h-full" />
                )}
            </div>
        );
    }

    // Se está carregando
    if (loading) {
        return (
            <div ref={imgRef} className={className} style={{ width, height, ...style }}>
                <ImageSkeleton width={width} height={height} className="w-full h-full" />
            </div>
        );
    }

    // Se deu erro
    if (error) {
        if (errorFallback) {
            return <div ref={imgRef} className={className}>{errorFallback}</div>;
        }

        return (
            <div ref={imgRef} className={`relative ${className}`} style={{ width, height, ...style }}>
                <ImageError
                    width={width}
                    height={height}
                    error={error}
                    className="w-full h-full"
                />
                <button
                    onClick={reload}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600 transition-colors"
                >
                    Tentar novamente
                </button>
            </div>
        );
    }

    // Renderizar imagem otimizada
    return (
        <div ref={imgRef} className={`relative ${className}`} style={style}>
            <img
                src={imageUrl || src}
                alt={alt}
                width={width}
                height={height}
                className="w-full h-full object-cover"
                style={{ width, height }}
                {...props}
            />

            {/* Indicador de imagem otimizada */}
            <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded opacity-75">
                ⚡
            </div>
        </div>
    );
};

export default OptimizedImage;