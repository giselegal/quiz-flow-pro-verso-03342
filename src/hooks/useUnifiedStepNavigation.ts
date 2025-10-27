import { useCallback, useMemo } from 'react';
import { useEditor } from '@/components/editor/EditorProviderMigrationAdapter';

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
    const editorContext = useEditor({ optional: true });

    if (!editorContext) {
        throw new Error('useUnifiedStepNavigation must be used within EditorProvider');
    }

    const { state, actions } = editorContext;
    const { currentStep, stepBlocks, stepValidation, isLoading } = state;
    const { setCurrentStep } = actions;

    // 🔧 CORREÇÃO: Constantes dinâmicas baseadas nos dados reais E template info
    const TOTAL_STEPS = useMemo(() => {
        // Primeiro tentar contar steps dos stepBlocks
        const stepsFromBlocks = Object.keys(stepBlocks).length;
        if (stepsFromBlocks > 0) return stepsFromBlocks;

        // Fallback mínimo
        return 1;
    }, [stepBlocks]);

    // IDs formatados
    // Normaliza IDs de step para formato step-XX (com zero à esquerda para 1–9)
    const currentStepId = useMemo(() => `step-${currentStep.toString().padStart(2, '0')}`, [currentStep]);
    const activeStageId = currentStepId; // Alias para compatibilidade

    // Blocos do step atual
    const currentStepBlocks = useMemo(() => {
        // Tenta chave normalizada e depois chave crua (sem padding) por compatibilidade
        const rawId = `step-${currentStep}`;
        return stepBlocks[currentStepId] || stepBlocks[rawId] || [];
    }, [stepBlocks, currentStepId, currentStep]);

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
                    stepId: `step-${targetStep.toString().padStart(2, '0')}`,
                    hasBlocks: (stepBlocks[`step-${targetStep.toString().padStart(2, '0')}`]?.length
                        || stepBlocks[`step-${targetStep}`]?.length
                        || 0),
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
        isStepLoading: isLoading,
    };
};

export default useUnifiedStepNavigation;