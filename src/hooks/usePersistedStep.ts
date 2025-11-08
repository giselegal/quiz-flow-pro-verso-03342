/**
 * 🆕 G19 FIX: Hook para gerenciar persistência do currentStep
 * 
 * Garante que o progresso do usuário não seja perdido ao recarregar a página.
 * 
 * Estratégia de Persistência:
 * 1. URL query params (prioridade máxima) - compartilhável
 * 2. localStorage (fallback) - persiste entre sessões
 * 3. TTL de 24h para localStorage
 * 
 * @see MAPEAMENTO_COMPLETO_GARGALOS_PONTOS_CEGOS_EDITOR_QUIZ21.md#G19
 */

import { useEffect, useCallback } from 'react';

const STORAGE_KEY = 'editor:currentStep';
const STORAGE_TIMESTAMP_KEY = 'editor:currentStep:timestamp';
const TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

export interface PersistedStepOptions {
    totalSteps: number;
    onRestore?: (step: number, source: 'url' | 'localStorage') => void;
    debugMode?: boolean;
}

export function usePersistedStep(options: PersistedStepOptions) {
    const { totalSteps, onRestore, debugMode = false } = options;

    /**
     * Persiste o step atual em URL e localStorage
     */
    const persistStep = useCallback((step: number) => {
        if (typeof window === 'undefined') return;

        try {
            // Validar step
            if (step < 1 || step > totalSteps) {
                console.warn(`⚠️ [usePersistedStep] Step ${step} fora do range válido (1-${totalSteps})`);
                return;
            }

            // Persistir em URL
            const url = new URL(window.location.href);
            url.searchParams.set('step', step.toString());
            window.history.replaceState({}, '', url.toString());

            // Persistir em localStorage
            localStorage.setItem(STORAGE_KEY, step.toString());
            localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());

            if (debugMode) {
                console.log(`💾 [usePersistedStep] Step ${step} persistido`);
            }
        } catch (error) {
            console.error('❌ [usePersistedStep] Erro ao persistir:', error);
        }
    }, [totalSteps, debugMode]);

    /**
     * Restaura o step da URL ou localStorage
     */
    const restoreStep = useCallback((): number | null => {
        if (typeof window === 'undefined') return null;

        try {
            // 1. Tentar URL (prioridade máxima)
            const urlParams = new URLSearchParams(window.location.search);
            const urlStep = urlParams.get('step');

            if (urlStep) {
                const stepNum = parseInt(urlStep, 10);
                if (!isNaN(stepNum) && stepNum >= 1 && stepNum <= totalSteps) {
                    if (debugMode) {
                        console.log(`🔄 [usePersistedStep] Step ${stepNum} restaurado da URL`);
                    }
                    onRestore?.(stepNum, 'url');
                    return stepNum;
                }
            }

            // 2. Tentar localStorage (fallback)
            const lsStep = localStorage.getItem(STORAGE_KEY);
            const lsTimestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);

            if (lsStep && lsTimestamp) {
                const stepNum = parseInt(lsStep, 10);
                const timestamp = parseInt(lsTimestamp, 10);
                const age = Date.now() - timestamp;

                // Verificar TTL
                if (!isNaN(stepNum) && stepNum >= 1 && stepNum <= totalSteps && age < TTL_MS) {
                    if (debugMode) {
                        const ageMinutes = (age / 1000 / 60).toFixed(0);
                        console.log(`🔄 [usePersistedStep] Step ${stepNum} restaurado do localStorage (${ageMinutes}min atrás)`);
                    }
                    onRestore?.(stepNum, 'localStorage');
                    return stepNum;
                } else if (age >= TTL_MS) {
                    // Expirado - limpar
                    localStorage.removeItem(STORAGE_KEY);
                    localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
                    if (debugMode) {
                        console.log('🗑️ [usePersistedStep] Step expirado removido do localStorage');
                    }
                }
            }

            if (debugMode) {
                console.log('ℹ️ [usePersistedStep] Nenhum step salvo para restaurar');
            }
            return null;
        } catch (error) {
            console.error('❌ [usePersistedStep] Erro ao restaurar:', error);
            return null;
        }
    }, [totalSteps, debugMode, onRestore]);

    /**
     * Limpa a persistência
     */
    const clearPersistedStep = useCallback(() => {
        if (typeof window === 'undefined') return;

        try {
            // Limpar localStorage
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(STORAGE_TIMESTAMP_KEY);

            // Limpar URL
            const url = new URL(window.location.href);
            url.searchParams.delete('step');
            window.history.replaceState({}, '', url.toString());

            if (debugMode) {
                console.log('🗑️ [usePersistedStep] Persistência limpa');
            }
        } catch (error) {
            console.error('❌ [usePersistedStep] Erro ao limpar:', error);
        }
    }, [debugMode]);

    /**
     * Verifica se há um step persistido válido
     */
    const hasPersistedStep = useCallback((): boolean => {
        if (typeof window === 'undefined') return false;

        try {
            // Verificar URL
            const urlParams = new URLSearchParams(window.location.search);
            const urlStep = urlParams.get('step');
            if (urlStep) {
                const stepNum = parseInt(urlStep, 10);
                if (!isNaN(stepNum) && stepNum >= 1 && stepNum <= totalSteps) {
                    return true;
                }
            }

            // Verificar localStorage
            const lsStep = localStorage.getItem(STORAGE_KEY);
            const lsTimestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
            if (lsStep && lsTimestamp) {
                const stepNum = parseInt(lsStep, 10);
                const timestamp = parseInt(lsTimestamp, 10);
                const age = Date.now() - timestamp;
                return !isNaN(stepNum) && stepNum >= 1 && stepNum <= totalSteps && age < TTL_MS;
            }

            return false;
        } catch {
            return false;
        }
    }, [totalSteps]);

    return {
        persistStep,
        restoreStep,
        clearPersistedStep,
        hasPersistedStep,
    };
}

/**
 * Hook simplificado que restaura automaticamente no mount
 */
export function useAutoRestoreStep(
    totalSteps: number,
    setStep: (step: number) => void,
    debugMode = false
) {
    const { restoreStep } = usePersistedStep({ totalSteps, debugMode });

    useEffect(() => {
        const restored = restoreStep();
        if (restored !== null) {
            setStep(restored);
        }
    }, []); // Executar apenas no mount
}
