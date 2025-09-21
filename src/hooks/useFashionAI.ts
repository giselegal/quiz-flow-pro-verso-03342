import { useState, useCallback } from 'react';
import { FashionImageAI, FashionImageRequest, ImageGenerationResponse } from '../services/FashionImageAI';

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
        size: '1024x1024',
        quality: 'hd'
    });

    /**
     * 🎨 Gerar uma imagem de roupa
     */
    const generateOutfit = useCallback(async (request: FashionImageRequest): Promise<ImageGenerationResponse> => {
        setIsGenerating(true);
        setError(null);

        try {
            console.log('🎨 Gerando imagem de roupa:', request);
            const result = await fashionAI.generateOutfitImage(request);

            if (result.success) {
                setLastGenerated(result);
                console.log('✅ Imagem gerada com sucesso:', result.imageUrl);
            } else {
                setError(result.error || 'Erro desconhecido');
                console.error('❌ Erro ao gerar imagem:', result.error);
            }

            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(errorMessage);
            console.error('❌ Erro na geração:', err);

            return {
                success: false,
                error: errorMessage,
                prompt: request.prompt,
                provider: config.provider
            };
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
            console.log('🎭 Gerando variações de roupa:', { request, count });
            const results = await fashionAI.generateOutfitVariations(request, count);

            const successful = results.filter(r => r.success);
            if (successful.length > 0) {
                setLastGenerated(successful[0]);
                console.log('✅ Variações geradas:', successful.length);
            } else {
                const firstError = results.find(r => r.error)?.error || 'Nenhuma imagem gerada';
                setError(firstError);
                console.error('❌ Erro ao gerar variações:', firstError);
            }

            return results;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(errorMessage);
            console.error('❌ Erro nas variações:', err);

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
            console.error('Erro ao verificar status:', err);
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
        providerStatus
    };
}

/**
 * 🎯 Prompts pré-definidos para diferentes tipos de looks
 */
export const FASHION_PROMPTS = {
    casual: {
        prompt: "Casual comfortable outfit for daily wear",
        occasion: "casual" as const,
        style: "moderno" as const
    },
    work: {
        prompt: "Professional business attire for office work",
        occasion: "trabalho" as const,
        style: "clássico" as const
    },
    party: {
        prompt: "Elegant party outfit for evening event",
        occasion: "festa" as const,
        style: "romântico" as const
    },
    weekend: {
        prompt: "Relaxed weekend outfit for leisure activities",
        occasion: "casual" as const,
        style: "minimalista" as const
    },
    date: {
        prompt: "Stylish romantic outfit for dinner date",
        occasion: "festa" as const,
        style: "romântico" as const
    },
    travel: {
        prompt: "Comfortable travel outfit for long journey",
        occasion: "viagem" as const,
        style: "moderno" as const
    }
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
    bold: ['emerald', 'royal blue', 'magenta', 'gold', 'crimson']
};

export default useFashionAI;