import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/customClient';

interface UseAIOptions {
    model?: 'gpt-4o' | 'gpt-4o-mini' | 'claude-3.5-sonnet' | 'llama-3.1-405b';
    maxTokens?: number;
    temperature?: number;
}

interface UseAIReturn {
    // Estados
    isLoading: boolean;
    error: string | null;
    response: any | null;

    // Funções principais
    generateContent: (messages: Array<{role: string, content: string}>) => Promise<any | null>;
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
    const [response, setResponse] = useState<any | null>(null);

    // Always configured since we use Supabase edge functions
    const isConfigured = true;

    const reset = useCallback(() => {
        setError(null);
        setResponse(null);
    }, []);

    const handleRequest = useCallback(async <T>(
        action: string,
        payload: any
    ): Promise<T | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const { data, error: functionError } = await supabase.functions.invoke('github-models-ai', {
                body: { action, ...payload }
            });

            if (functionError) {
                throw new Error(functionError.message);
            }

            return data as T;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(errorMessage);
            console.error('❌ AI Request Error:', err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const generateContent = useCallback(async (
        messages: Array<{role: string, content: string}>
    ): Promise<any | null> => {
        const result = await handleRequest('generate', {
            messages,
            maxTokens: options.maxTokens,
            temperature: options.temperature,
        });
        
        if (result) {
            setResponse(result);
        }
        
        return result;
    }, [handleRequest, options.maxTokens, options.temperature]);

    const generateQuiz = useCallback(async (prompt: string): Promise<any | null> => {
        return handleRequest('generateQuiz', {
            messages: [{ role: 'user', content: prompt }]
        });
    }, [handleRequest]);

    const generateFunnel = useCallback(async (prompt: string): Promise<any[] | null> => {
        return handleRequest('generateFunnel', {
            messages: [{ role: 'user', content: prompt }]
        });
    }, [handleRequest]);

    const improveText = useCallback(async (
        text: string,
        context?: string
    ): Promise<string | null> => {
        const result = await handleRequest<{improvedText: string}>('improveText', {
            messages: [
                { role: 'user', content: text },
                { role: 'user', content: context || '' }
            ]
        });
        
        return result?.improvedText || null;
    }, [handleRequest]);

    const generateDesign = useCallback(async (
        theme: string,
        brand?: string
    ): Promise<any | null> => {
        // For now, return a mock design config
        // This could be enhanced to call a specific AI endpoint for design generation
        return {
            colors: {
                primary: '#6366F1',
                secondary: '#8B5CF6',
                accent: '#EC4899'
            },
            fonts: {
                heading: 'Inter',
                body: 'Inter'
            },
            theme,
            brand
        };
    }, []);

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