import { useCallback, useMemo } from 'react';
import { useEditor } from '@/components/editor/provider-alias';
import { toStepKey } from '@/components/editor/navigation/stepMapping';

/**
 * 🎯 HOOK UNIFICADO DE NAVEGAÇÃO - SINGLE SOURCE OF TRUTH
 * 
 * Substitui os hooks conflitantes:
 * ❌ useFunnelNavigation() - navegação fragmentada
 * ❌ useQuizFlow() - duplicação de estado
 * ❌ useQuiz21Steps() - mais um sistema de etapas
 * 
 * ✅ ÚNICO hook para navegação entre etapas
 * ✅ Estado centralizado no EditorProvider
 * ✅ Conversões de formato padronizadas
 * ✅ Validação integrada
 */

export interface UseUnifiedStepNavigationReturn {
    // Estado atual
    currentStep: number;
    totalSteps: number;

    // IDs formatados (compatibilidade)
    currentStepId: string;        // "step-1"
    activeStageId: string;        // "step-1" (alias para compatibilidade)

    // Navegação
    goToStep: (step: number) => void;
    goToNext: () => void;
    goToPrevious: () => void;

    // Estado da navegação
    canGoNext: boolean;
    canGoPrevious: boolean;
    isFirstStep: boolean;
    isLastStep: boolean;

    // Progresso
    progressPercentage: number;

    // Dados do step atual
    currentStepBlocks: any[];
    isCurrentStepValid: boolean;
    isStepLoading: boolean;
}

export const useUnifiedStepNavigation = (): UseUnifiedStepNavigationReturn => {
    const { state, actions } = useEditor();
    const { currentStep, stepBlocks, stepValidation, isLoading, totalSteps: providerTotalSteps } = state as any;
    const { setCurrentStep } = actions;

    // Delegar contagem primária ao provider; fallback para tamanho de stepBlocks;
    const TOTAL_STEPS = useMemo(() => {
        if (providerTotalSteps && providerTotalSteps > 0) return providerTotalSteps;
        const count = Object.keys(stepBlocks || {}).length;
        return count > 0 ? count : 1;
    }, [providerTotalSteps, stepBlocks]);

    const currentStepId = useMemo(() => toStepKey(currentStep), [currentStep]);
    const activeStageId = currentStepId;
    const currentStepBlocks = useMemo(() => stepBlocks?.[currentStepId] || [], [stepBlocks, currentStepId]);
    const isCurrentStepValid = stepValidation?.[currentStep] !== false;

    const canGoPrevious = currentStep > 1;
    const canGoNext = currentStep < TOTAL_STEPS;
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === TOTAL_STEPS;
    const progressPercentage = useMemo(() => Math.round((currentStep / TOTAL_STEPS) * 100), [currentStep, TOTAL_STEPS]);

    const goToStep = useCallback((targetStep: number) => {
        if (targetStep < 1 || targetStep > TOTAL_STEPS) return;
        if (targetStep === currentStep) return; // evita renders desnecessários
        setCurrentStep(targetStep);
        if (process.env.NODE_ENV === 'development') {
            console.log('🧭 nav ->', { from: currentStep, to: targetStep, stepId: toStepKey(targetStep) });
        }
    }, [currentStep, setCurrentStep, TOTAL_STEPS]);

    const goToNext = useCallback(() => canGoNext && goToStep(currentStep + 1), [canGoNext, currentStep, goToStep]);
    const goToPrevious = useCallback(() => canGoPrevious && goToStep(currentStep - 1), [canGoPrevious, currentStep, goToStep]);

    return {
        currentStep,
        totalSteps: TOTAL_STEPS,
        currentStepId,
        activeStageId,
        goToStep,
        goToNext,
        goToPrevious,
        canGoNext,
        canGoPrevious,
        isFirstStep,
        isLastStep,
        progressPercentage,
        currentStepBlocks,
        isCurrentStepValid,
        isStepLoading: isLoading
    };
};

export default useUnifiedStepNavigation;