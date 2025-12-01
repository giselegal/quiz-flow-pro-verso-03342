/**
 * 🖼️ OptimizedImage - Componente para imagens com CDN automático
 * 
 * Integrado com v4.1-SaaS adapter para resolução automática de URLs
 * via resolveAssetUrl() + variáveis de ambiente.
 * 
 * Features:
 * - Lazy loading nativo
 * - Placeholder blur
 * - Resolução automática de CDN (/quiz-assets/ → Cloudinary)
 * - Fallback para erro
 * - Responsive srcset (futuro)
 */

import React, { useState, ImgHTMLAttributes } from 'react';
import { resolveAssetUrl } from '@/lib/quiz-v4-saas-adapter';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    /** URL da imagem (pode ser path relativo /quiz-assets/ ou URL absoluta) */
    src: string | null | undefined;
    /** Texto alternativo (obrigatório para a11y) */
    alt: string;
    /** Placeholder enquanto carrega */
    placeholder?: 'blur' | 'shimmer' | 'none';
    /** Imagem fallback em caso de erro */
    fallbackSrc?: string;
    /** Callback quando imagem carrega */
    onLoad?: () => void;
    /** Callback quando falha ao carregar */
    onError?: () => void;
    /** CDN base URL customizado (override env var) */
    cdnBaseUrl?: string;
}

/**
 * Componente OptimizedImage
 * 
 * @example
 * // Imagem do quiz (path relativo)
 * <OptimizedImage 
 *   src="/quiz-assets/questions/q1-option-1.jpg"
 *   alt="Opção 1"
 *   className="w-64 h-64 object-cover"
 * />
 * 
 * @example
 * // Imagem externa (URL absoluta)
 * <OptimizedImage 
 *   src="https://example.com/image.jpg"
 *   alt="External image"
 * />
 * 
 * @example
 * // Com fallback
 * <OptimizedImage 
 *   src="/quiz-assets/avatar.jpg"
 *   alt="User avatar"
 *   fallbackSrc="/images/default-avatar.png"
 *   placeholder="blur"
 * />
 */
export function OptimizedImage({
    src,
    alt,
    placeholder = 'blur',
    fallbackSrc,
    onLoad,
    onError,
    cdnBaseUrl,
    className = '',
    style,
    ...rest
}: OptimizedImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Resolver URL via adapter
    const resolvedSrc = resolveAssetUrl(src || null, cdnBaseUrl);
    const finalSrc = hasError && fallbackSrc ? fallbackSrc : resolvedSrc;

    const handleLoad = () => {
        setIsLoading(false);
        onLoad?.();
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
        onError?.();
    };

    // Se não tem src válida, renderizar placeholder
    if (!finalSrc) {
        return (
            <div
                className={`bg-gray-200 flex items-center justify-center ${className}`}
                style={style}
            >
                <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </div>
        );
    }

    return (
        <div className="relative inline-block">
            {/* Placeholder/Loading state */}
            {isLoading && placeholder !== 'none' && (
                <div
                    className={`absolute inset-0 ${placeholder === 'blur' ? 'backdrop-blur-sm bg-gray-100' : 'animate-pulse bg-gray-200'
                        }`}
                />
            )}

            {/* Imagem real */}
            <img
                src={finalSrc}
                alt={alt}
                loading="lazy"
                onLoad={handleLoad}
                onError={handleError}
                className={className}
                style={{
                    ...style,
                    opacity: isLoading ? 0 : 1,
                    transition: 'opacity 0.3s ease-in-out',
                }}
                {...rest}
            />
        </div>
    );
}

/**
 * Hook para pré-carregar imagens
 * Útil para garantir que imagens críticas estejam prontas
 */
export function usePreloadImages(urls: (string | null | undefined)[]) {
    React.useEffect(() => {
        const validUrls = urls.filter(Boolean) as string[];

        validUrls.forEach((url) => {
            const resolvedUrl = resolveAssetUrl(url);
            if (resolvedUrl) {
                const img = new Image();
                img.src = resolvedUrl;
            }
        });
    }, [urls]);
}

export default OptimizedImage;
