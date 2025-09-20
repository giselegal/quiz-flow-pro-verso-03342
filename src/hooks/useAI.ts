import { useState, useCallback } from 'react';
import { createGitHubModelsAI, type AIRequest, type AIResponse } from '@/services/GitHubModelsAI';

interface UseAIOptions {
    model?: 'gpt-4o' | 'gpt-4o-mini' | 'claude-3.5-sonnet' | 'llama-3.1-405b';
    maxTokens?: number;
    temperature?: number;
}

interface UseAIReturn {
    // Estados
    isLoading: boolean;
    error: string | null;
    response: AIResponse | null;

    // Funções principais
    generateContent: (messages: AIRequest['messages']) => Promise<AIResponse | null>;
    generateQuiz: (prompt: string) => Promise<any | null>;
    generateFunnel: (prompt: string) => Promise<any[] | null>;
    improveText: (text: string, context?: string) => Promise<string | null>;
    generateDesign: (theme: string, brand?: string) => Promise<any | null>;

    // Utilitários
    reset: () => void;
    isConfigured: boolean;
}

export function useAI(options: UseAIOptions = {}): UseAIReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<AIResponse | null>(null);

    // Verificar se está configurado
    const isConfigured = !!import.meta.env.VITE_GITHUB_MODELS_TOKEN;

    const reset = useCallback(() => {
        setError(null);
        setResponse(null);
    }, []);

    const handleRequest = useCallback(async <T>(
        requestFn: () => Promise<T>
    ): Promise<T | null> => {
        if (!isConfigured) {
            setError('❌ GitHub Models não configurado. Configure VITE_GITHUB_MODELS_TOKEN no .env');
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await requestFn();
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(errorMessage);
            console.error('❌ AI Request Error:', err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [isConfigured]);

    const generateContent = useCallback(async (
        messages: AIRequest['messages']
    ): Promise<AIResponse | null> => {
        return handleRequest(async () => {
            const ai = createGitHubModelsAI();
            const result = await ai.generateContent({
                messages,
                maxTokens: options.maxTokens,
                temperature: options.temperature,
            });
            setResponse(result);
            return result;
        });
    }, [handleRequest, options.maxTokens, options.temperature]);

    const generateQuiz = useCallback(async (prompt: string): Promise<any | null> => {
        return handleRequest(async () => {
            const ai = createGitHubModelsAI();
            return await ai.generateQuizTemplate(prompt);
        });
    }, [handleRequest]);

    const generateFunnel = useCallback(async (prompt: string): Promise<any[] | null> => {
        return handleRequest(async () => {
            const ai = createGitHubModelsAI();
            return await ai.generateFunnelSteps(prompt);
        });
    }, [handleRequest]);

    const improveText = useCallback(async (
        text: string,
        context?: string
    ): Promise<string | null> => {
        return handleRequest(async () => {
            const ai = createGitHubModelsAI();
            return await ai.improveText(text, context);
        });
    }, [handleRequest]);

    const generateDesign = useCallback(async (
        theme: string,
        brand?: string
    ): Promise<any | null> => {
        return handleRequest(async () => {
            const ai = createGitHubModelsAI();
            return await ai.generateDesignConfig(theme, brand);
        });
    }, [handleRequest]);

    return {
        // Estados
        isLoading,
        error,
        response,

        // Funções
        generateContent,
        generateQuiz,
        generateFunnel,
        improveText,
        generateDesign,

        // Utilitários
        reset,
        isConfigured,
    };
}

export default useAI;