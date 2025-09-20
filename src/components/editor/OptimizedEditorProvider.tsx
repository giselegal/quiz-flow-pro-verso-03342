import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { Block } from '@/types/editor';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';

/**
 * 🚀 EDITOR PROVIDER OTIMIZADO - LAZY LOADING INTELIGENTE
 * 
 * Melhorias implementadas:
 * ✅ Lazy loading por step (carrega apenas quando necessário)
 * ✅ Cache inteligente com TTL (evita recarregamentos desnecessários)
 * ✅ Máximo 3 steps carregados simultaneamente (memory efficient)
 * ✅ Debounced operations (performance)
 * ✅ Single source of truth para navegação
 */

export interface OptimizedEditorState {
    stepBlocks: Record<string, Block[]>;
    currentStep: number;
    selectedBlockId: string | null;
    stepValidation: Record<number, boolean>;
    isSupabaseEnabled: boolean;
    databaseMode: 'local' | 'supabase';
    isLoading: boolean;

    // Cache control
    loadedSteps: Set<number>;
    lastLoadTime: Record<number, number>;
}

export interface OptimizedEditorActions {
    // Navigation
    setCurrentStep: (step: number) => void;
    setSelectedBlockId: (blockId: string | null) => void;

    // Step management with lazy loading
    ensureStepLoaded: (step: number) => Promise<void>;
    preloadAdjacentSteps: (currentStep: number) => Promise<void>;
    clearUnusedSteps: () => void;

    // Block operations (optimized)
    addBlock: (stepKey: string, block: Block) => Promise<void>;
    updateBlock: (stepKey: string, blockId: string, updates: Record<string, any>) => Promise<void>;
    removeBlock: (stepKey: string, blockId: string) => Promise<void>;

    // Validation
    setStepValid: (step: number, isValid: boolean) => void;

    // Utils
    exportJSON: () => string;
    importJSON: (json: string) => void;
}

export interface OptimizedEditorContextValue {
    state: OptimizedEditorState;
    actions: OptimizedEditorActions;
}

const OptimizedEditorContext = createContext<OptimizedEditorContextValue | undefined>(undefined);

export const useOptimizedEditor = () => {
    const context = useContext(OptimizedEditorContext);
    if (!context) {
        throw new Error('useOptimizedEditor must be used within an OptimizedEditorProvider');
    }
    return context;
};

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CONCURRENT_STEPS = 3;

export interface OptimizedEditorProviderProps {
    children: ReactNode;
    funnelId?: string;
    enableSupabase?: boolean;
    initial?: Partial<OptimizedEditorState>;
}

export const OptimizedEditorProvider: React.FC<OptimizedEditorProviderProps> = ({
    children,
    funnelId,
    enableSupabase = false,
    initial
}) => {

    // State with optimized initial values
    const [state, setState] = React.useState<OptimizedEditorState>(() => ({
        stepBlocks: {},
        currentStep: 1,
        selectedBlockId: null,
        stepValidation: {},
        isSupabaseEnabled: enableSupabase,
        databaseMode: enableSupabase ? 'supabase' : 'local',
        isLoading: false,
        loadedSteps: new Set(),
        lastLoadTime: {},
        ...initial
    }));

    // Refs for optimized operations
    const loadingStepsRef = useRef<Set<number>>(new Set());
    const debounceTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

    // Debug logging
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('🚀 OptimizedEditorProvider initialized:', {
                funnelId,
                enableSupabase,
                timestamp: new Date().toISOString()
            });
        }
    }, [funnelId, enableSupabase]);

    // Lazy loading with intelligent caching
    const ensureStepLoaded = useCallback(async (step: number): Promise<void> => {
        // Prevent duplicate loads
        if (loadingStepsRef.current.has(step) || state.loadedSteps.has(step)) {
            // Check cache TTL
            const lastLoad = state.lastLoadTime[step];
            const now = Date.now();
            if (lastLoad && (now - lastLoad) < CACHE_TTL) {
                return; // Cache still valid
            }
        }

        loadingStepsRef.current.add(step);

        try {
            setState(prev => ({ ...prev, isLoading: true }));

            const stepKey = `step-${step}`;

            // Load from template (in real app, this could be API call)
            const templateBlocks = QUIZ_STYLE_21_STEPS_TEMPLATE[stepKey] || [];

            if (templateBlocks.length > 0) {
                setState(prev => ({
                    ...prev,
                    stepBlocks: {
                        ...prev.stepBlocks,
                        [stepKey]: [...templateBlocks]
                    },
                    loadedSteps: new Set([...prev.loadedSteps, step]),
                    lastLoadTime: {
                        ...prev.lastLoadTime,
                        [step]: Date.now()
                    },
                    stepValidation: {
                        ...prev.stepValidation,
                        [step]: templateBlocks.length > 0
                    }
                }));

                if (process.env.NODE_ENV === 'development') {
                    console.log(`✅ Step ${step} loaded with ${templateBlocks.length} blocks`);
                }
            }

        } catch (error) {
            console.error(`❌ Failed to load step ${step}:`, error);
        } finally {
            loadingStepsRef.current.delete(step);
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, [state.loadedSteps, state.lastLoadTime]);

    // Preload adjacent steps for smoother navigation
    const preloadAdjacentSteps = useCallback(async (currentStep: number): Promise<void> => {
        const stepsToPreload = [currentStep - 1, currentStep + 1].filter(step =>
            step >= 1 && step <= 21 && !state.loadedSteps.has(step)
        );

        // Load adjacent steps in background without blocking UI
        stepsToPreload.forEach(step => {
            setTimeout(() => ensureStepLoaded(step), 100);
        });
    }, [state.loadedSteps, ensureStepLoaded]);

    // Memory management - clear unused steps
    const clearUnusedSteps = useCallback(() => {
        setState(prev => {
            const currentStep = prev.currentStep;
            const keepSteps = [currentStep - 1, currentStep, currentStep + 1].filter(s => s >= 1 && s <= 21);

            // Only keep adjacent steps in memory
            const newStepBlocks: Record<string, Block[]> = {};
            const newLoadedSteps = new Set<number>();
            const newLastLoadTime: Record<number, number> = {};

            keepSteps.forEach(step => {
                const stepKey = `step-${step}`;
                if (prev.stepBlocks[stepKey]) {
                    newStepBlocks[stepKey] = prev.stepBlocks[stepKey];
                    newLoadedSteps.add(step);
                    if (prev.lastLoadTime[step]) {
                        newLastLoadTime[step] = prev.lastLoadTime[step];
                    }
                }
            });

            if (process.env.NODE_ENV === 'development') {
                console.log(`🧹 Memory cleanup: keeping steps ${keepSteps.join(', ')}`);
            }

            return {
                ...prev,
                stepBlocks: newStepBlocks,
                loadedSteps: newLoadedSteps,
                lastLoadTime: newLastLoadTime
            };
        });
    }, []);

    // Navigation with optimizations
    const setCurrentStep = useCallback((step: number) => {
        if (step >= 1 && step <= 21 && step !== state.currentStep) {
            setState(prev => ({ ...prev, currentStep: step }));

            // Auto-load current step and preload adjacent
            ensureStepLoaded(step);
            setTimeout(() => preloadAdjacentSteps(step), 200);

            // Cleanup memory if we have too many steps loaded
            if (state.loadedSteps.size > MAX_CONCURRENT_STEPS) {
                setTimeout(() => clearUnusedSteps(), 1000);
            }
        }
    }, [state.currentStep, state.loadedSteps.size, ensureStepLoaded, preloadAdjacentSteps, clearUnusedSteps]);

    // Debounced operations for performance
    const debounce = useCallback((key: string, fn: () => void, delay: number = 300) => {
        const existingTimer = debounceTimersRef.current.get(key);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }

        const timer = setTimeout(fn, delay);
        debounceTimersRef.current.set(key, timer);
    }, []);

    // Optimized block operations
    const addBlock = useCallback(async (stepKey: string, block: Block): Promise<void> => {
        setState(prev => ({
            ...prev,
            stepBlocks: {
                ...prev.stepBlocks,
                [stepKey]: [...(prev.stepBlocks[stepKey] || []), block]
            }
        }));

        // Debounced validation update
        debounce(`validate-${stepKey}`, () => {
            const stepNum = parseInt(stepKey.replace('step-', ''));
            setState(prev => ({
                ...prev,
                stepValidation: {
                    ...prev.stepValidation,
                    [stepNum]: (prev.stepBlocks[stepKey]?.length || 0) > 0
                }
            }));
        });
    }, [debounce]);

    const updateBlock = useCallback(async (stepKey: string, blockId: string, updates: Record<string, any>): Promise<void> => {
        setState(prev => ({
            ...prev,
            stepBlocks: {
                ...prev.stepBlocks,
                [stepKey]: (prev.stepBlocks[stepKey] || []).map(block =>
                    block.id === blockId ? { ...block, ...updates } : block
                )
            }
        }));
    }, []);

    const removeBlock = useCallback(async (stepKey: string, blockId: string): Promise<void> => {
        setState(prev => ({
            ...prev,
            stepBlocks: {
                ...prev.stepBlocks,
                [stepKey]: (prev.stepBlocks[stepKey] || []).filter(block => block.id !== blockId)
            }
        }));
    }, []);

    // Load initial step on mount
    useEffect(() => {
        ensureStepLoaded(state.currentStep);
    }, []); // Only on mount

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            debounceTimersRef.current.forEach(timer => clearTimeout(timer));
            debounceTimersRef.current.clear();
        };
    }, []);

    // Context value
    const contextValue = useMemo((): OptimizedEditorContextValue => ({
        state,
        actions: {
            setCurrentStep,
            setSelectedBlockId: (blockId: string | null) => setState(prev => ({ ...prev, selectedBlockId: blockId })),
            ensureStepLoaded,
            preloadAdjacentSteps,
            clearUnusedSteps,
            addBlock,
            updateBlock,
            removeBlock,
            setStepValid: (step: number, isValid: boolean) => setState(prev => ({
                ...prev,
                stepValidation: { ...prev.stepValidation, [step]: isValid }
            })),
            exportJSON: () => JSON.stringify(state, null, 2),
            importJSON: (json: string) => {
                try {
                    const imported = JSON.parse(json);
                    setState(prev => ({ ...prev, ...imported }));
                } catch (error) {
                    console.error('Failed to import JSON:', error);
                }
            }
        }
    }), [state, setCurrentStep, ensureStepLoaded, preloadAdjacentSteps, clearUnusedSteps, addBlock, updateBlock, removeBlock]);

    return (
        <OptimizedEditorContext.Provider value={contextValue}>
            {children}
        </OptimizedEditorContext.Provider>
    );
};

export default OptimizedEditorProvider;