import { useState, useCallback } from 'react';
import { FashionImageAI, FashionImageRequest, ImageGenerationResponse } from '../services/FashionImageAI';
import { appLogger } from '@/lib/utils/appLogger';

interface UseFashionAIConfig {
    provider: 'dalle3' | 'gemini' | 'stable-diffusion' | 'midjourney';
    apiKey: string;
    style?: 'realistic' | 'artistic' | 'minimalist' | 'vintage' | 'modern';
}

interface UseFashionAI {
    generateOutfit: (request: FashionImageRequest) => Promise<ImageGenerationResponse>;
    generateVariations: (request: FashionImageRequest, count?: number) => Promise<ImageGenerationResponse[]>;
    isGenerating: boolean;
    error: string | null;
    lastGenerated: ImageGenerationResponse | null;
    providerStatus: any;
}

export function useFashionAI(config: UseFashionAIConfig): UseFashionAI {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastGenerated, setLastGenerated] = useState<ImageGenerationResponse | null>(null);
    const [providerStatus, setProviderStatus] = useState<any>(null);

    // Instância do serviço de IA
    const fashionAI = new FashionImageAI({
        provider: config.provider,
        apiKey: config.apiKey,
        style: config.style || 'realistic',
    });

    /**
     * 🎨 Gerar uma imagem de roupa
     */
    const generateOutfit = useCallback(async (request: FashionImageRequest): Promise<ImageGenerationResponse> => {
        setIsGenerating(true);
        setError(null);

        try {
            appLogger.info('🎨 Gerando imagem de roupa:', { data: [request] });
            const result = await fashionAI.generateOutfitImage(request);

            if (result.success) {
                setLastGenerated(result);
                appLogger.info('✅ Imagem gerada com sucesso:', { data: [result.url] }); // Mudado de 'imageUrl' para 'url'
            } else {
                setError(result.error || 'Erro desconhecido');
                appLogger.error('❌ Erro ao gerar imagem:', { data: [result.error] });
            }

            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(errorMessage);
            appLogger.error('❌ Erro na geração:', { data: [err] });

            return {
                url: '',
                created: Date.now(),
                success: false,
                error: errorMessage,
            } as ImageGenerationResponse;
        } finally {
            setIsGenerating(false);
        }
    }, [fashionAI, config.provider]);

    /**
     * 🎭 Gerar múltiplas variações de um look
     */
    const generateVariations = useCallback(async (request: FashionImageRequest, count: number = 3): Promise<ImageGenerationResponse[]> => {
        setIsGenerating(true);
        setError(null);

        try {
            appLogger.info('🎭 Gerando variações de roupa:', { data: [{ request, count }] });
            const results = await fashionAI.generateOutfitVariations(request, count);

            const successful = results.filter((r: any) => r.success);
            if (successful.length > 0) {
                setLastGenerated(successful[0]);
                appLogger.info('✅ Variações geradas:', { data: [successful.length] });
            } else {
                const firstError = results.find((r: any) => r.error)?.error || 'Nenhuma imagem gerada';
                setError(firstError);
                appLogger.error('❌ Erro ao gerar variações:', { data: [firstError] });
            }

            return results;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(errorMessage);
            appLogger.error('❌ Erro nas variações:', { data: [err] });

            return [];
        } finally {
            setIsGenerating(false);
        }
    }, [fashionAI]);

    /**
     * 📊 Verificar status do provider
     */
    const checkProviderStatus = useCallback(async () => {
        try {
            const status = await fashionAI.checkProviderStatus();
            setProviderStatus(status);
            return status;
        } catch (err) {
            appLogger.error('Erro ao verificar status:', { data: [err] });
            return null;
        }
    }, [fashionAI]);

    // Verificar status na inicialização
    useState(() => {
        checkProviderStatus();
    });

    return {
        generateOutfit,
        generateVariations,
        isGenerating,
        error,
        lastGenerated,
        providerStatus,
    };
}

/**
 * 🎯 Prompts pré-definidos para diferentes tipos de looks
 */
export const FASHION_PROMPTS = {
    casual: {
        prompt: 'Casual comfortable outfit for daily wear',
        occasion: 'casual' as const,
        style: 'moderno' as const,
    },
    work: {
        prompt: 'Professional business attire for office work',
        occasion: 'trabalho' as const,
        style: 'clássico' as const,
    },
    party: {
        prompt: 'Elegant party outfit for evening event',
        occasion: 'festa' as const,
        style: 'romântico' as const,
    },
    weekend: {
        prompt: 'Relaxed weekend outfit for leisure activities',
        occasion: 'casual' as const,
        style: 'minimalista' as const,
    },
    date: {
        prompt: 'Stylish romantic outfit for dinner date',
        occasion: 'festa' as const,
        style: 'romântico' as const,
    },
    travel: {
        prompt: 'Comfortable travel outfit for long journey',
        occasion: 'viagem' as const,
        style: 'moderno' as const,
    },
};

/**
 * 🎨 Paletas de cores para moda
 */
export const FASHION_COLORS = {
    neutral: ['black', 'white', 'gray', 'beige', 'navy'],
    warm: ['red', 'orange', 'yellow', 'coral', 'burgundy'],
    cool: ['blue', 'green', 'purple', 'turquoise', 'mint'],
    earth: ['brown', 'tan', 'olive', 'rust', 'terracotta'],
    pastel: ['pink', 'lavender', 'peach', 'mint', 'cream'],
    bold: ['emerald', 'royal blue', 'magenta', 'gold', 'crimson'],
};

export default useFashionAI;