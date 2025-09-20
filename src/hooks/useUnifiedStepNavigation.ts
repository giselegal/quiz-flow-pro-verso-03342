import { useCallback, useMemo } from 'react';
import { useEditor } from '@/components/editor/EditorProvider';

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
    const { currentStep, stepBlocks, stepValidation, isLoading } = state;
    const { setCurrentStep } = actions;

    // Constantes
    const TOTAL_STEPS = 21;

    // IDs formatados
    const currentStepId = useMemo(() => `step-${currentStep}`, [currentStep]);
    const activeStageId = currentStepId; // Alias para compatibilidade

    // Blocos do step atual
    const currentStepBlocks = useMemo(() => {
        return stepBlocks[currentStepId] || [];
    }, [stepBlocks, currentStepId]);

    // Estado de validação
    const isCurrentStepValid = useMemo(() => {
        return stepValidation[currentStep] !== false; // Default true se não definido
    }, [stepValidation, currentStep]);

    // Estados de navegação
    const canGoPrevious = currentStep > 1;
    const canGoNext = currentStep < TOTAL_STEPS;
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === TOTAL_STEPS;

    // Progresso percentual
    const progressPercentage = useMemo(() => {
        return Math.round((currentStep / TOTAL_STEPS) * 100);
    }, [currentStep, TOTAL_STEPS]);

    // Navegação principal
    const goToStep = useCallback((targetStep: number) => {
        if (targetStep >= 1 && targetStep <= TOTAL_STEPS) {
            setCurrentStep(targetStep);

            if (process.env.NODE_ENV === 'development') {
                console.log('🧭 useUnifiedStepNavigation: Navegando para step', {
                    from: currentStep,
                    to: targetStep,
                    stepId: `step-${targetStep}`,
                    hasBlocks: stepBlocks[`step-${targetStep}`]?.length || 0
                });
            }
        }
    }, [currentStep, setCurrentStep, stepBlocks]);

    const goToNext = useCallback(() => {
        if (canGoNext) {
            goToStep(currentStep + 1);
        }
    }, [canGoNext, currentStep, goToStep]);

    const goToPrevious = useCallback(() => {
        if (canGoPrevious) {
            goToStep(currentStep - 1);
        }
    }, [canGoPrevious, currentStep, goToStep]);

    return {
        // Estado atual
        currentStep,
        totalSteps: TOTAL_STEPS,

        // IDs formatados
        currentStepId,
        activeStageId,

        // Navegação
        goToStep,
        goToNext,
        goToPrevious,

        // Estado da navegação
        canGoNext,
        canGoPrevious,
        isFirstStep,
        isLastStep,

        // Progresso
        progressPercentage,

        // Dados do step atual
        currentStepBlocks,
        isCurrentStepValid,
        isStepLoading: isLoading
    };
};

export default useUnifiedStepNavigation;