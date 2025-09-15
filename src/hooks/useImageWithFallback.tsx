import { useState, useEffect, useCallback } from 'react';
import { imageCache } from '../utils/imageCache';

interface UseImageWithFallbackOptions {
    width?: number;
    height?: number;
    fallbackText?: string;
    fallbackBgColor?: string;
    fallbackTextColor?: string;
    enableCache?: boolean;
    retryCount?: number;
    retryDelay?: number;
}

interface UseImageWithFallbackResult {
    src: string;
    isLoading: boolean;
    isError: boolean;
    isFallback: boolean;
    retry: () => void;
}

/**
 * Hook para gerenciar imagens com fallback automático usando IndexedDB
 */
export const useImageWithFallback = (
    originalSrc: string | undefined,
    options: UseImageWithFallbackOptions = {}
): UseImageWithFallbackResult => {
    const {
        width = 300,
        height = 200,
        fallbackText = 'Imagem',
        fallbackBgColor = '#f1f5f9',
        fallbackTextColor = '#64748b',
        enableCache = true,
        retryCount = 2,
        retryDelay = 1000,
    } = options;

    const [src, setSrc] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isFallback, setIsFallback] = useState(false);

    // Função para criar placeholder
    const createFallbackImage = useCallback(async () => {
        try {
            const placeholderSrc = await imageCache.getOrCreatePlaceholder(
                width,
                height,
                fallbackText,
                fallbackBgColor,
                fallbackTextColor
            );
            setSrc(placeholderSrc);
            setIsFallback(true);
            setIsError(false);
            setIsLoading(false);
        } catch (error) {
            console.warn('Erro ao criar placeholder:', error);
            // Fallback extremo: SVG data URL inline
            const svgContent = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="${fallbackBgColor}"/>
          <text 
            x="50%" 
            y="50%" 
            font-family="system-ui, -apple-system, sans-serif" 
            font-size="${Math.min(width, height) / 10}"
            fill="${fallbackTextColor}" 
            text-anchor="middle" 
            dominant-baseline="middle"
          >${fallbackText}</text>
        </svg>
      `;
            const fallbackDataUrl = `data:image/svg+xml;base64,${btoa(svgContent)}`;
            setSrc(fallbackDataUrl);
            setIsFallback(true);
            setIsError(false);
            setIsLoading(false);
        }
    }, [width, height, fallbackText, fallbackBgColor, fallbackTextColor]);

    // Função para tentar carregar a imagem original
    const loadOriginalImage = useCallback(async (imageUrl: string, retry: number = 0) => {
        if (!imageUrl || imageUrl.trim() === '') {
            await createFallbackImage();
            return;
        }

        setIsLoading(true);
        setIsError(false);

        try {
            // Verificar se já temos no cache
            if (enableCache) {
                const cachedSrc = await imageCache.getImage(imageUrl, width, height);
                if (cachedSrc) {
                    setSrc(cachedSrc);
                    setIsFallback(false);
                    setIsError(false);
                    setIsLoading(false);
                    return;
                }
            }

            // Tentar carregar a imagem original
            const img = new Image();
            img.crossOrigin = 'anonymous';

            const loadPromise = new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject(new Error('Falha ao carregar imagem'));
                img.src = imageUrl;
            });

            await loadPromise;

            // Se chegou até aqui, a imagem carregou com sucesso
            setSrc(imageUrl);
            setIsFallback(false);
            setIsError(false);
            setIsLoading(false);

            // Opcionalmente, armazenar no cache
            if (enableCache) {
                try {
                    // Converter imagem para blob para armazenamento
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;
                        ctx.drawImage(img, 0, 0);

                        canvas.toBlob(async (blob) => {
                            if (blob) {
                                try {
                                    await imageCache.storeImage(imageUrl, blob, {
                                        width: img.naturalWidth,
                                        height: img.naturalHeight,
                                        type: blob.type,
                                        originalUrl: imageUrl,
                                    });
                                } catch (cacheError) {
                                    console.warn('Erro ao armazenar imagem no cache:', cacheError);
                                }
                            }
                        }, 'image/png', 0.8);
                    }
                } catch (cacheError) {
                    console.warn('Erro ao processar imagem para cache:', cacheError);
                }
            }

        } catch (error) {
            console.warn(`Tentativa ${retry + 1} falhou para ${imageUrl}:`, error);

            // Tentar novamente se ainda temos tentativas
            if (retry < retryCount) {
                setTimeout(() => {
                    loadOriginalImage(imageUrl, retry + 1);
                }, retryDelay * (retry + 1)); // Backoff exponencial
                return;
            }

            // Todas as tentativas falharam, usar fallback
            setIsError(true);
            await createFallbackImage();
        }
    }, [
        enableCache,
        width,
        height,
        retryCount,
        retryDelay,
        createFallbackImage
    ]);

    // Função para retry manual
    const retry = useCallback(() => {
        if (originalSrc) {
            loadOriginalImage(originalSrc, 0);
        }
    }, [originalSrc, loadOriginalImage]);

    // Efeito para carregar a imagem quando a URL muda
    useEffect(() => {
        if (!originalSrc || originalSrc.trim() === '') {
            createFallbackImage();
            return;
        }

        // Resetar estado
        loadOriginalImage(originalSrc, 0);
    }, [originalSrc, loadOriginalImage, createFallbackImage]);

    return {
        src,
        isLoading,
        isError,
        isFallback,
        retry,
    };
};

/**
 * Hook simplificado para placeholders específicos
 */
export const usePlaceholder = (
    type: 'logo' | 'image' | 'quiz-elegant' | 'quiz-casual' | 'loading' | 'error' | 'custom',
    customOptions?: {
        width?: number;
        height?: number;
        text?: string;
        backgroundColor?: string;
        textColor?: string;
    }
) => {
    const [src, setSrc] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadPlaceholder = async () => {
            setIsLoading(true);

            try {
                let placeholderSrc: string;

                switch (type) {
                    case 'logo':
                        placeholderSrc = await imageCache.getOrCreatePlaceholder(
                            96, 96, 'Logo', '#e2e8f0', '#64748b'
                        );
                        break;
                    case 'image':
                        placeholderSrc = await imageCache.getOrCreatePlaceholder(
                            300, 200, 'Imagem', '#f1f5f9', '#64748b'
                        );
                        break;
                    case 'quiz-elegant':
                        placeholderSrc = await imageCache.getOrCreatePlaceholder(
                            300, 200, 'Elegante', '#b89b7a', '#ffffff'
                        );
                        break;
                    case 'quiz-casual':
                        placeholderSrc = await imageCache.getOrCreatePlaceholder(
                            300, 200, 'Casual', '#432818', '#ffffff'
                        );
                        break;
                    case 'loading':
                        placeholderSrc = await imageCache.getOrCreatePlaceholder(
                            400, 300, 'Carregando...', '#B89B7A', '#FFFFFF'
                        );
                        break;
                    case 'error':
                        placeholderSrc = await imageCache.getOrCreatePlaceholder(
                            400, 300, 'Erro ao carregar', '#EF4444', '#FFFFFF'
                        );
                        break;
                    case 'custom':
                    default:
                        placeholderSrc = await imageCache.getOrCreatePlaceholder(
                            customOptions?.width || 300,
                            customOptions?.height || 200,
                            customOptions?.text || 'Imagem',
                            customOptions?.backgroundColor || '#f1f5f9',
                            customOptions?.textColor || '#64748b'
                        );
                        break;
                }

                setSrc(placeholderSrc);
                setIsLoading(false);
            } catch (error) {
                console.warn('Erro ao carregar placeholder:', error);
                setIsLoading(false);
            }
        };

        loadPlaceholder();
    }, [type, customOptions]);

    return { src, isLoading };
};

/**
 * Componente de imagem com fallback automático
 */
interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src?: string;
    fallbackText?: string;
    fallbackBgColor?: string;
    fallbackTextColor?: string;
    enableCache?: boolean;
    retryCount?: number;
    showRetryButton?: boolean;
}

export const SmartImage: React.FC<SmartImageProps> = ({
    src: originalSrc,
    width = 300,
    height = 200,
    fallbackText = 'Imagem',
    fallbackBgColor = '#f1f5f9',
    fallbackTextColor = '#64748b',
    enableCache = true,
    retryCount = 2,
    showRetryButton = false,
    className = '',
    style = {},
    ...props
}) => {
    const { src, isLoading, isError, isFallback, retry } = useImageWithFallback(originalSrc, {
        width: typeof width === 'number' ? width : 300,
        height: typeof height === 'number' ? height : 200,
        fallbackText,
        fallbackBgColor,
        fallbackTextColor,
        enableCache,
        retryCount,
    });

    return (
        <div className="relative inline-block">
            <img
                {...props}
                src={src}
                width={width}
                height={height}
                className={`${className} ${isLoading ? 'opacity-75' : ''}`}
                style={{
                    ...style,
                    transition: 'opacity 0.3s ease',
                }}
                alt={props.alt || fallbackText}
            />

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            )}

            {isError && showRetryButton && (
                <button
                    onClick={retry}
                    className="absolute top-2 right-2 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    title="Tentar novamente"
                >
                    ↻
                </button>
            )}

            {isFallback && (
                <div className="absolute bottom-1 right-1 px-1 py-0.5 text-xs bg-gray-500 bg-opacity-75 text-white rounded">
                    Placeholder
                </div>
            )}
        </div>
    );
};