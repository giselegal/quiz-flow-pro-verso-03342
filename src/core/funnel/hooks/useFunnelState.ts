/**
 * 🏪 FUNNEL STATE HOOKS
 * 
 * Hooks especializados para gerenciamento de estado de funis
 */

import { useState, useCallback, useEffect, useReducer } from 'react';
import {
    FunnelState,
    FunnelAction,
    FunnelStatus,
    FunnelProgress,
    NavigationState,
    ValidationState
} from '../types';
import { funnelCore } from '../FunnelCore';
import { funnelEngine } from '../FunnelEngine';

// ============================================================================
// TYPES
// ============================================================================

export interface UseFunnelStateOptions {
    autoValidate?: boolean;
    autoSave?: boolean;
    debounceMs?: number;
    onStateChange?: (state: FunnelState) => void;
}

export interface UseFunnelStateReturn {
    state: FunnelState;
    dispatch: (action: FunnelAction) => void;

    // Computed properties
    progress: FunnelProgress;
    navigation: NavigationState;
    validation: ValidationState;

    // Status checks
    isActive: boolean;
    isCompleted: boolean;
    isPaused: boolean;
    hasError: boolean;
    isLoading: boolean;

    // Utilities
    reset: () => void;
    clone: () => FunnelState;
    serialize: () => string;
    deserialize: (data: string) => void;
}

// ============================================================================
// FUNNEL REDUCER
// ============================================================================

function funnelReducer(state: FunnelState, action: FunnelAction): FunnelState {
    return funnelEngine.processAction(state, action);
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useFunnelState(
    initialState: FunnelState,
    options: UseFunnelStateOptions = {}
): UseFunnelStateReturn {
    const [state, dispatch] = useReducer(funnelReducer, initialState, (initial) =>
        funnelEngine.initializeFunnel(initial)
    );

    // ============================================================================
    // COMPUTED PROPERTIES
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

    // Status checks
    const isActive = state.status === 'active';
    const isCompleted = state.status === 'completed';
    const isPaused = state.status === 'paused';
    const hasError = !!state.error;
    const isLoading = state.isLoading || false;

    // ============================================================================
    // UTILITIES
    // ============================================================================

    const reset = useCallback(() => {
        dispatch({ type: 'reset', payload: { preserveUserData: false } });
    }, []);

    const clone = useCallback(() => {
        return funnelCore.cloneState(state);
    }, [state]);

    const serialize = useCallback(() => {
        try {
            return JSON.stringify(state);
        } catch (error) {
            console.error('[useFunnelState] Serialization error:', error);
            return '{}';
        }
    }, [state]);

    const deserialize = useCallback((data: string) => {
        try {
            const parsedState = JSON.parse(data) as FunnelState;
            // Aqui você poderia validar a estrutura do estado antes de aplicar
            dispatch({ type: 'reset', payload: { preserveUserData: false } });
            // Aplicar o estado deserializado...
        } catch (error) {
            console.error('[useFunnelState] Deserialization error:', error);
        }
    }, []);

    // ============================================================================
    // EFFECTS
    // ============================================================================

    // Auto-validation
    useEffect(() => {
        if (options.autoValidate && currentStep) {
            // Executar validação automática se habilitada
            const validationResult = funnelCore.validateStep(currentStep, state);
            if (!validationResult.isValid && validationResult.errors.length > 0) {
                console.log('[useFunnelState] Validation errors:', validationResult.errors);
            }
        }
    }, [state.currentStep, state.userData, options.autoValidate, currentStep]);

    // State change callback
    useEffect(() => {
        if (options.onStateChange) {
            options.onStateChange(state);
        }
    }, [state, options]);

    // ============================================================================
    // RETURN
    // ============================================================================

    return {
        state,
        dispatch,

        // Computed
        progress,
        navigation,
        validation,

        // Status
        isActive,
        isCompleted,
        isPaused,
        hasError,
        isLoading,

        // Utils
        reset,
        clone,
        serialize,
        deserialize
    };
}

// ============================================================================
// SPECIALIZED HOOKS
// ============================================================================

/**
 * Hook para persistência automática de estado
 */
export function useFunnelPersistence(
    funnelId: string,
    state?: FunnelState,
    options: {
        autoSave?: boolean;
        saveInterval?: number;
        storageKey?: string;
    } = {}
) {
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<Error | null>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const storageKey = options.storageKey || `funnel_state_${funnelId}`;

    const saveState = useCallback(async (stateToSave: FunnelState) => {
        setIsSaving(true);
        setSaveError(null);

        try {
            const serialized = JSON.stringify(stateToSave);
            localStorage.setItem(storageKey, serialized);
            setLastSaved(new Date());
        } catch (error) {
            setSaveError(error as Error);
            console.error('[useFunnelPersistence] Save error:', error);
        } finally {
            setIsSaving(false);
        }
    }, [storageKey]);

    const loadState = useCallback((): FunnelState | null => {
        try {
            const saved = localStorage.getItem(storageKey);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('[useFunnelPersistence] Load error:', error);
            return null;
        }
    }, [storageKey]);

    const clearSaved = useCallback(() => {
        localStorage.removeItem(storageKey);
        setLastSaved(null);
    }, [storageKey]);

    // Auto-save effect
    useEffect(() => {
        if (options.autoSave && state) {
            const interval = setInterval(() => {
                saveState(state);
            }, options.saveInterval || 30000); // Default: 30 segundos

            return () => clearInterval(interval);
        }
    }, [options.autoSave, options.saveInterval, state, saveState]);

    return {
        saveState,
        loadState,
        clearSaved,
        isSaving,
        saveError,
        lastSaved,
        hasSaved: !!lastSaved
    };
}

/**
 * Hook para histórico de mudanças de estado
 */
export function useFunnelHistory(maxHistory = 50) {
    const [history, setHistory] = useState<FunnelState[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const addToHistory = useCallback((state: FunnelState) => {
        setHistory(prev => {
            const newHistory = [...prev.slice(0, currentIndex + 1), funnelCore.cloneState(state)];

            // Limitar tamanho do histórico
            if (newHistory.length > maxHistory) {
                return newHistory.slice(-maxHistory);
            }

            return newHistory;
        });

        setCurrentIndex(prev => Math.min(prev + 1, maxHistory - 1));
    }, [currentIndex, maxHistory]);

    const undo = useCallback((): FunnelState | null => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            return history[currentIndex - 1];
        }
        return null;
    }, [currentIndex, history]);

    const redo = useCallback((): FunnelState | null => {
        if (currentIndex < history.length - 1) {
            setCurrentIndex(prev => prev + 1);
            return history[currentIndex + 1];
        }
        return null;
    }, [currentIndex, history]);

    const canUndo = currentIndex > 0;
    const canRedo = currentIndex < history.length - 1;

    const clearHistory = useCallback(() => {
        setHistory([]);
        setCurrentIndex(-1);
    }, []);

    return {
        addToHistory,
        undo,
        redo,
        canUndo,
        canRedo,
        clearHistory,
        historySize: history.length,
        currentIndex
    };
}

/**
 * Hook para análise de performance de funis
 */
export function useFunnelAnalytics(state: FunnelState) {
    const [analytics, setAnalytics] = useState({
        timeSpent: 0,
        stepTimes: {} as Record<string, number>,
        interactions: 0,
        validationErrors: 0,
        completionRate: 0,
        dropOffPoints: [] as string[]
    });

    const [sessionStart] = useState(Date.now());
    const [stepStartTime, setStepStartTime] = useState(Date.now());

    // Track step changes
    useEffect(() => {
        const stepChangeTime = Date.now();
        const timeOnPreviousStep = stepChangeTime - stepStartTime;

        setAnalytics(prev => ({
            ...prev,
            stepTimes: {
                ...prev.stepTimes,
                [state.currentStep]: (prev.stepTimes[state.currentStep] || 0) + timeOnPreviousStep
            }
        }));

        setStepStartTime(stepChangeTime);
    }, [state.currentStep, stepStartTime]);

    // Track total time
    useEffect(() => {
        const interval = setInterval(() => {
            setAnalytics(prev => ({
                ...prev,
                timeSpent: Date.now() - sessionStart
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, [sessionStart]);

    // Track validation errors
    useEffect(() => {
        const currentStep = state.steps.find(step => step.id === state.currentStep);
        if (currentStep) {
            const validation = funnelCore.validateStep(currentStep, state);
            if (!validation.isValid) {
                setAnalytics(prev => ({
                    ...prev,
                    validationErrors: prev.validationErrors + validation.errors.length
                }));
            }
        }
    }, [state.userData, state.currentStep, state.steps]);

    // Calculate completion rate
    useEffect(() => {
        const progress = funnelCore.calculateProgress(state);
        setAnalytics(prev => ({
            ...prev,
            completionRate: progress.percentage
        }));
    }, [state.completedSteps, state.steps]);

    const getReport = useCallback(() => {
        return {
            ...analytics,
            averageStepTime: Object.values(analytics.stepTimes).reduce((a, b) => a + b, 0) / Object.keys(analytics.stepTimes).length || 0,
            totalSteps: state.steps.length,
            completedSteps: state.completedSteps.length,
            currentStep: state.currentStep,
            sessionDuration: Date.now() - sessionStart
        };
    }, [analytics, state, sessionStart]);

    return {
        analytics,
        getReport,
        timeSpent: analytics.timeSpent,
        completionRate: analytics.completionRate
    };
}

/**
 * Hook para comparação de estados de funil
 */
export function useFunnelComparison() {
    const compareStates = useCallback((state1: FunnelState, state2: FunnelState) => {
        const differences = {
            currentStep: state1.currentStep !== state2.currentStep,
            completedSteps: JSON.stringify(state1.completedSteps) !== JSON.stringify(state2.completedSteps),
            userData: JSON.stringify(state1.userData) !== JSON.stringify(state2.userData),
            status: state1.status !== state2.status,
            settings: JSON.stringify(state1.settings) !== JSON.stringify(state2.settings)
        };

        const hasChanges = Object.values(differences).some(Boolean);

        return {
            hasChanges,
            differences,
            summary: {
                currentStepChanged: differences.currentStep,
                progressChanged: differences.completedSteps,
                dataChanged: differences.userData,
                statusChanged: differences.status,
                settingsChanged: differences.settings
            }
        };
    }, []);

    const getStateDiff = useCallback((state1: FunnelState, state2: FunnelState) => {
        // Implementação simplificada de diff
        // Em um caso real, você usaria uma biblioteca como 'deep-diff'
        return {
            added: {},
            removed: {},
            modified: {},
            unchanged: {}
        };
    }, []);

    return {
        compareStates,
        getStateDiff
    };
}
