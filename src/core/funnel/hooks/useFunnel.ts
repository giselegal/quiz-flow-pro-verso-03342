/**
 * 🪝 FUNNEL HOOKS
 * 
 * Hooks especializados para gerenciamento de funis
 * Separados dos hooks de quiz para melhor organização
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import {
    FunnelState,
    FunnelAction,
    FunnelEvent,
    FunnelProgress,
    NavigationState,
    ValidationState
} from '../types';
import { funnelEngine, FunnelActions } from '../FunnelEngine';
import { funnelCore } from '../FunnelCore';

// ============================================================================
// MAIN FUNNEL HOOK
// ============================================================================

export interface UseFunnelOptions {
    autoSave?: boolean;
    persistProgress?: boolean;
    onStepChange?: (stepId: string) => void;
    onComplete?: (data: Record<string, any>) => void;
    onError?: (error: Error) => void;
}

export interface UseFunnelReturn {
    // Estado atual
    state: FunnelState;

    // Informações calculadas
    progress: FunnelProgress;
    navigation: NavigationState;
    validation: ValidationState;

    // Ações de navegação
    goForward: () => void;
    goBackward: () => void;
    goToStep: (stepId: string) => void;
    goToFirst: () => void;
    goToLast: () => void;

    // Ações de dados
    updateData: (data: Record<string, any>, merge?: boolean) => void;
    resetData: () => void;

    // Ações de controle
    completeStep: (stepId?: string) => void;
    resetFunnel: (preserveData?: boolean) => void;
    pauseFunnel: () => void;
    resumeFunnel: () => void;

    // Estados utilitários
    isLoading: boolean;
    hasError: boolean;
    error: Error | null;

    // Validação
    validateCurrentStep: () => boolean;
    canAdvance: boolean;
    canGoBack: boolean;
}

/**
 * Hook principal para gerenciamento de funis
 */
export function useFunnel(
    initialState: FunnelState,
    options: UseFunnelOptions = {}
): UseFunnelReturn {
    const [state, setState] = useState<FunnelState>(() =>
        funnelEngine.initializeFunnel(initialState)
    );

    const optionsRef = useRef(options);
    optionsRef.current = options;

    // ============================================================================
    // COMPUTED VALUES
    // ============================================================================

    const progress = funnelCore.calculateProgress(state);
    const navigation = funnelCore.calculateNavigationState(state);
    const currentStep = state.steps.find(step => step.id === state.currentStep);
    const validation = currentStep ? funnelCore.validateStep(currentStep, state) : {
        isValid: false,
        errors: [],
        warnings: [],
        currentStepValid: false
    };

    const isLoading = state.isLoading || false;
    const hasError = !!state.error;
    const error = state.error as Error | null;
    const canAdvance = funnelEngine.canAdvance(state);
    const canGoBack = funnelEngine.canGoBack(state);

    // ============================================================================
    // ACTION CREATORS
    // ============================================================================

    const dispatch = useCallback((action: FunnelAction) => {
        setState(prevState => {
            const newState = funnelEngine.processAction(prevState, action);

            // Auto-save se habilitado
            if (optionsRef.current.autoSave) {
                // Implementar auto-save aqui
                saveProgressToStorage(newState);
            }

            return newState;
        });
    }, []);

    // ============================================================================
    // NAVIGATION ACTIONS
    // ============================================================================

    const goForward = useCallback(() => {
        if (canAdvance) {
            dispatch(FunnelActions.navigate('forward'));
        }
    }, [canAdvance, dispatch]);

    const goBackward = useCallback(() => {
        if (canGoBack) {
            dispatch(FunnelActions.navigate('backward'));
        }
    }, [canGoBack, dispatch]);

    const goToStep = useCallback((stepId: string) => {
        dispatch(FunnelActions.navigate('forward', stepId));
    }, [dispatch]);

    const goToFirst = useCallback(() => {
        dispatch(FunnelActions.navigate('first'));
    }, [dispatch]);

    const goToLast = useCallback(() => {
        dispatch(FunnelActions.navigate('last'));
    }, [dispatch]);

    // ============================================================================
    // DATA ACTIONS
    // ============================================================================

    const updateData = useCallback((data: Record<string, any>, merge = true) => {
        dispatch(FunnelActions.updateUserData(data, merge));
    }, [dispatch]);

    const resetData = useCallback(() => {
        dispatch(FunnelActions.updateUserData({}, false));
    }, [dispatch]);

    // ============================================================================
    // CONTROL ACTIONS
    // ============================================================================

    const completeStep = useCallback((stepId?: string) => {
        dispatch(FunnelActions.completeStep(stepId));
    }, [dispatch]);

    const resetFunnel = useCallback((preserveData = false) => {
        dispatch(FunnelActions.reset(preserveData));
    }, [dispatch]);

    const pauseFunnel = useCallback(() => {
        const pausedState = funnelEngine.pauseFunnel(state);
        setState(pausedState);
    }, [state]);

    const resumeFunnel = useCallback(() => {
        const resumedState = funnelEngine.resumeFunnel(state);
        setState(resumedState);
    }, [state]);

    // ============================================================================
    // VALIDATION
    // ============================================================================

    const validateCurrentStep = useCallback(() => {
        return validation.isValid;
    }, [validation.isValid]);

    // ============================================================================
    // EFFECTS
    // ============================================================================

    // Listener para mudanças de passo
    useEffect(() => {
        const handleStepChange = (event: FunnelEvent) => {
            if (event.type === 'step-change' && optionsRef.current.onStepChange) {
                optionsRef.current.onStepChange(event.payload.to);
            }
        };

        funnelCore.addEventListener('step-change', handleStepChange);
        return () => funnelCore.removeEventListener('step-change', handleStepChange);
    }, []);

    // Listener para conclusão
    useEffect(() => {
        const handleComplete = (event: FunnelEvent) => {
            if (event.type === 'complete' && optionsRef.current.onComplete) {
                optionsRef.current.onComplete(event.payload.results);
            }
        };

        funnelCore.addEventListener('complete', handleComplete);
        return () => funnelCore.removeEventListener('complete', handleComplete);
    }, []);

    // Listener para erros
    useEffect(() => {
        const handleError = (event: FunnelEvent) => {
            if (event.type === 'error' && optionsRef.current.onError) {
                optionsRef.current.onError(event.payload.error);
            }
        };

        funnelCore.addEventListener('error', handleError);
        return () => funnelCore.removeEventListener('error', handleError);
    }, []);

    // ============================================================================
    // RETURN OBJECT
    // ============================================================================

    return {
        // Estado
        state,
        progress,
        navigation,
        validation,

        // Navegação
        goForward,
        goBackward,
        goToStep,
        goToFirst,
        goToLast,

        // Dados
        updateData,
        resetData,

        // Controle
        completeStep,
        resetFunnel,
        pauseFunnel,
        resumeFunnel,

        // Estados
        isLoading,
        hasError,
        error,

        // Validação
        validateCurrentStep,
        canAdvance,
        canGoBack
    };
}

// ============================================================================
// SPECIALIZED HOOKS
// ============================================================================

/**
 * Hook para navegação simplificada de funis
 */
export function useFunnelNavigation(state: FunnelState) {
    const navigation = funnelCore.calculateNavigationState(state);
    const progress = funnelCore.calculateProgress(state);

    return {
        ...navigation,
        progress,
        currentStepIndex: progress.currentStepIndex,
        totalSteps: progress.totalSteps,
        percentage: progress.percentage
    };
}

/**
 * Hook para validação de funis
 */
export function useFunnelValidation(state: FunnelState) {
    const currentStep = state.steps.find(step => step.id === state.currentStep);
    const validation = currentStep ? funnelCore.validateStep(currentStep, state) : {
        isValid: false,
        errors: [],
        warnings: [],
        currentStepValid: false
    };

    return {
        ...validation,
        validateStep: (stepId: string) => {
            const step = state.steps.find(s => s.id === stepId);
            return step ? funnelCore.validateStep(step, state) : validation;
        },
        hasErrors: validation.errors.length > 0,
        hasWarnings: validation.warnings.length > 0,
        isCurrentStepValid: validation.currentStepValid
    };
}

/**
 * Hook para dados de usuário do funil
 */
export function useFunnelData(state: FunnelState) {
    return {
        userData: state.userData,
        getFieldValue: (field: string) => state.userData[field],
        hasData: Object.keys(state.userData).length > 0,
        dataKeys: Object.keys(state.userData),
        isEmpty: Object.keys(state.userData).length === 0
    };
}

/**
 * Hook para progresso do funil
 */
export function useFunnelProgress(state: FunnelState) {
    const progress = funnelCore.calculateProgress(state);

    return {
        ...progress,
        isComplete: progress.percentage === 100,
        isStarted: progress.completedSteps > 0,
        remainingSteps: progress.totalSteps - progress.completedSteps,
        completionRate: progress.percentage / 100
    };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Salva progresso no localStorage
 */
function saveProgressToStorage(state: FunnelState) {
    try {
        const key = `funnel_progress_${state.id}`;
        const data = {
            currentStep: state.currentStep,
            completedSteps: state.completedSteps,
            userData: state.userData,
            timestamp: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.warn('[useFunnel] Failed to save progress:', error);
    }
}

/**
 * Carrega progresso do localStorage
 */
export function loadProgressFromStorage(funnelId: string) {
    try {
        const key = `funnel_progress_${funnelId}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.warn('[useFunnel] Failed to load progress:', error);
        return null;
    }
}
