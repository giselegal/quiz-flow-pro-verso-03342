/**
 * 🤖 HOOK PARA IA DO FUNIL
 * 
 * Hook React para integração fácil com a IA do funil
 */

import { useEffect, useState, useCallback } from 'react';
import { AIEnhancedHybridTemplateService } from '../services/AIEnhancedHybridTemplateService';
import { activateFunnelAI, checkFunnelAIStatus } from '../utils/funnelAIActivator';

interface AIStatus {
    enabled: boolean;
    loading: boolean;
    error: string | null;
    hasService: boolean;
    config: any;
}

interface UseFunnelAIReturn {
    // Estado
    aiStatus: AIStatus;

    // Controles
    enableAI: () => Promise<void>;
    disableAI: () => void;
    refreshStatus: () => void;

    // Contexto
    setAIContext: (context: any) => void;

    // Templates
    getAIOptimizedStep: (stepNumber: number, context?: any) => Promise<any>;

    // Utilidades
    isAIEnabled: boolean;
    canUseAI: boolean;
}

/**
 * 🚀 Hook principal para IA do funil
 */
export function useFunnelAI(): UseFunnelAIReturn {
    const [aiStatus, setAIStatus] = useState<AIStatus>({
        enabled: false,
        loading: false,
        error: null,
        hasService: false,
        config: {}
    });

    // 📊 Atualizar status da IA
    const refreshStatus = useCallback(() => {
        try {
            const status = checkFunnelAIStatus();
            setAIStatus({
                enabled: status.enabled,
                loading: false,
                error: null,
                hasService: status.hasService,
                config: status.config
            });
        } catch (error) {
            setAIStatus(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            }));
        }
    }, []);

    // 🚀 Habilitar IA
    const enableAI = useCallback(async () => {
        setAIStatus(prev => ({ ...prev, loading: true, error: null }));

        try {
            await activateFunnelAI();
            refreshStatus();
        } catch (error) {
            setAIStatus(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'Erro ao ativar IA'
            }));
        }
    }, [refreshStatus]);

    // ⏸️ Desabilitar IA
    const disableAI = useCallback(() => {
        try {
            AIEnhancedHybridTemplateService.disableAI();
            refreshStatus();
        } catch (error) {
            setAIStatus(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Erro ao desativar IA'
            }));
        }
    }, [refreshStatus]);

    // 🧠 Definir contexto da IA
    const setAIContext = useCallback((context: any) => {
        try {
            AIEnhancedHybridTemplateService.setAIContext(context);
        } catch (error) {
            console.warn('⚠️ Erro ao definir contexto da IA:', error);
        }
    }, []);

    // 🎯 Obter step otimizado com IA
    const getAIOptimizedStep = useCallback(async (stepNumber: number, context?: any) => {
        try {
            if (context) {
                setAIContext(context);
            }

            return await AIEnhancedHybridTemplateService.getStepConfig(stepNumber, context);
        } catch (error) {
            console.error('❌ Erro ao obter step otimizado:', error);
            throw error;
        }
    }, [setAIContext]);

    // 🎬 Inicialização
    useEffect(() => {
        refreshStatus();
    }, [refreshStatus]);

    return {
        aiStatus,
        enableAI,
        disableAI,
        refreshStatus,
        setAIContext,
        getAIOptimizedStep,
        isAIEnabled: aiStatus.enabled,
        canUseAI: aiStatus.enabled && aiStatus.hasService && !aiStatus.loading
    };
}

/**
 * 🎯 Hook específico para step de quiz com IA
 */
export function useAIQuizStep(stepNumber: number) {
    const { getAIOptimizedStep, isAIEnabled, setAIContext } = useFunnelAI();
    const [stepConfig, setStepConfig] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadStep = useCallback(async (userContext?: any) => {
        if (!isAIEnabled || loading) return;

        setLoading(true);
        setError(null);

        try {
            // Definir contexto específico do quiz
            const quizContext = {
                stepNumber,
                userContext,
                quizType: 'estilo-pessoal',
                platform: 'web',
                timestamp: new Date().toISOString(),
                ...userContext
            };

            const config = await getAIOptimizedStep(stepNumber, quizContext);
            setStepConfig(config);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar step');
        } finally {
            setLoading(false);
        }
    }, [stepNumber, isAIEnabled, getAIOptimizedStep, loading]);

    useEffect(() => {
        loadStep();
    }, [stepNumber, isAIEnabled]);

    return {
        stepConfig,
        loading,
        error,
        loadStep,
        setAIContext
    };
}

export default useFunnelAI;