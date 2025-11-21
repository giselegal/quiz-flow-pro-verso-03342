/**
 * 🧭 NavigationProvider - Gerenciamento de Navegação
 * 
 * Responsabilidades:
 * - Navegação entre steps do quiz/funnel
 * - Histórico de navegação
 * - Validação de transições
 * - Estado de navegação (current, previous, next)
 * 
 * Fase 2.1 - Provider Modular Independente
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface NavigationState {
    currentStepId: string | null;
    previousStepId: string | null;
    visitedSteps: string[];
    canGoBack: boolean;
    canGoNext: boolean;
    isNavigating: boolean;
    totalSteps: number;
    currentStepIndex: number;
}

export interface NavigationContextValue {
    // State
    state: NavigationState;

    // Navigation methods
    goToStep: (stepId: string, options?: NavigationOptions) => Promise<void>;
    goToNext: () => Promise<void>;
    goToPrevious: () => Promise<void>;
    goToFirst: () => Promise<void>;
    goToLast: () => Promise<void>;

    // History methods
    getHistory: () => string[];
    clearHistory: () => void;
    canNavigateToStep: (stepId: string) => boolean;

    // Configuration
    setTotalSteps: (total: number) => void;
    setStepOrder: (steps: string[]) => void;
}

export interface NavigationOptions {
    replace?: boolean;
    skipValidation?: boolean;
    animate?: boolean;
}

interface NavigationProviderProps {
    children: ReactNode;
    initialStepId?: string;
    totalSteps?: number;
    onBeforeNavigate?: (from: string | null, to: string) => Promise<boolean>;
    onAfterNavigate?: (stepId: string) => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

export function NavigationProvider({
    children,
    initialStepId = null,
    totalSteps = 0,
    onBeforeNavigate,
    onAfterNavigate,
}: NavigationProviderProps) {
    // State
    const [currentStepId, setCurrentStepId] = useState<string | null>(initialStepId);
    const [previousStepId, setPreviousStepId] = useState<string | null>(null);
    const [visitedSteps, setVisitedSteps] = useState<string[]>(initialStepId ? [initialStepId] : []);
    const [isNavigating, setIsNavigating] = useState(false);
    const [stepOrder, setStepOrder] = useState<string[]>([]);
    const [totalStepsCount, setTotalStepsCount] = useState(totalSteps);

    // Derived state
    const currentStepIndex = useMemo(() => {
        if (!currentStepId || stepOrder.length === 0) return 0;
        return stepOrder.indexOf(currentStepId);
    }, [currentStepId, stepOrder]);

    const canGoBack = useMemo(() => {
        return visitedSteps.length > 1 && !isNavigating;
    }, [visitedSteps, isNavigating]);

    const canGoNext = useMemo(() => {
        if (isNavigating) return false;
        if (stepOrder.length === 0) return false;
        return currentStepIndex < stepOrder.length - 1;
    }, [currentStepIndex, stepOrder, isNavigating]);

    // Navigation methods
    const goToStep = useCallback(async (
        stepId: string,
        options: NavigationOptions = {}
    ): Promise<void> => {
        const { replace = false, skipValidation = false, animate = true } = options;

        if (isNavigating) {
            appLogger.warn('Navigation already in progress', 'NavigationProvider');
            return;
        }

        try {
            setIsNavigating(true);

            // Validation hook
            if (!skipValidation && onBeforeNavigate) {
                const canNavigate = await onBeforeNavigate(currentStepId, stepId);
                if (!canNavigate) {
                    appLogger.info('Navigation cancelled by validation', 'NavigationProvider', { from: currentStepId, to: stepId });
                    return;
                }
            }

            // Update state
            setPreviousStepId(currentStepId);
            setCurrentStepId(stepId);

            // Update history
            if (replace) {
                setVisitedSteps(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1] = stepId;
                    return newHistory;
                });
            } else {
                setVisitedSteps(prev => {
                    const newHistory = prev.includes(stepId) ? prev : [...prev, stepId];
                    return newHistory;
                });
            }

            // After navigation hook
            if (onAfterNavigate) {
                onAfterNavigate(stepId);
            }

            appLogger.info('Navigation completed', 'NavigationProvider', {
                from: currentStepId,
                to: stepId,
                animate
            });

        } catch (error) {
            appLogger.error('Navigation failed', 'NavigationProvider', { error, stepId });
            throw error;
        } finally {
            setIsNavigating(false);
        }
    }, [currentStepId, isNavigating, onBeforeNavigate, onAfterNavigate]);

    const goToNext = useCallback(async () => {
        if (!canGoNext || stepOrder.length === 0) return;

        const nextIndex = currentStepIndex + 1;
        if (nextIndex < stepOrder.length) {
            await goToStep(stepOrder[nextIndex]);
        }
    }, [canGoNext, currentStepIndex, stepOrder, goToStep]);

    const goToPrevious = useCallback(async () => {
        if (!canGoBack) return;

        const previousIndex = visitedSteps.length - 2;
        if (previousIndex >= 0) {
            const prevStepId = visitedSteps[previousIndex];
            await goToStep(prevStepId, { replace: true });
            setVisitedSteps(prev => prev.slice(0, -1));
        }
    }, [canGoBack, visitedSteps, goToStep]);

    const goToFirst = useCallback(async () => {
        if (stepOrder.length > 0) {
            await goToStep(stepOrder[0], { replace: true });
        }
    }, [stepOrder, goToStep]);

    const goToLast = useCallback(async () => {
        if (stepOrder.length > 0) {
            await goToStep(stepOrder[stepOrder.length - 1]);
        }
    }, [stepOrder, goToStep]);

    // History methods
    const getHistory = useCallback(() => {
        return [...visitedSteps];
    }, [visitedSteps]);

    const clearHistory = useCallback(() => {
        setVisitedSteps(currentStepId ? [currentStepId] : []);
        setPreviousStepId(null);
        appLogger.info('Navigation history cleared', 'NavigationProvider');
    }, [currentStepId]);

    const canNavigateToStep = useCallback((stepId: string) => {
        if (!stepId) return false;
        if (stepOrder.length === 0) return true; // No restrictions if no order defined
        return stepOrder.includes(stepId);
    }, [stepOrder]);

    // Configuration methods
    const setTotalSteps = useCallback((total: number) => {
        setTotalStepsCount(total);
    }, []);

    const setStepOrderCallback = useCallback((steps: string[]) => {
        setStepOrder(steps);
        appLogger.info('Step order updated', 'NavigationProvider', { count: steps.length });
    }, []);

    // Build state object
    const state: NavigationState = useMemo(() => ({
        currentStepId,
        previousStepId,
        visitedSteps,
        canGoBack,
        canGoNext,
        isNavigating,
        totalSteps: totalStepsCount,
        currentStepIndex,
    }), [
        currentStepId,
        previousStepId,
        visitedSteps,
        canGoBack,
        canGoNext,
        isNavigating,
        totalStepsCount,
        currentStepIndex,
    ]);

    // Context value with memoization
    const contextValue = useMemo<NavigationContextValue>(() => ({
        state,
        goToStep,
        goToNext,
        goToPrevious,
        goToFirst,
        goToLast,
        getHistory,
        clearHistory,
        canNavigateToStep,
        setTotalSteps,
        setStepOrder: setStepOrderCallback,
    }), [
        state,
        goToStep,
        goToNext,
        goToPrevious,
        goToFirst,
        goToLast,
        getHistory,
        clearHistory,
        canNavigateToStep,
        setTotalSteps,
        setStepOrderCallback,
    ]);

    return (
        <NavigationContext.Provider value={contextValue}>
            {children}
        </NavigationContext.Provider>
    );
}

// ============================================================================
// HOOK
// ============================================================================

export function useNavigation(): NavigationContextValue {
    const context = useContext(NavigationContext);

    if (!context) {
        throw new Error('useNavigation must be used within NavigationProvider');
    }

    return context;
}

// Display name for debugging
NavigationProvider.displayName = 'NavigationProvider';
