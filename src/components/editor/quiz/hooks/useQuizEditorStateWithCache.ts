import { useState, useCallback, useMemo, useEffect } from 'react';
import { useIntelligentCache } from '@/providers/IntelligentCacheProvider';

/**
 * 🎯 HOOK CENTRAL DO QUIZ EDITOR COM CACHE INTELIGENTE
 * 
 * Versão otimizada que integra com IntelligentCacheProvider
 * ✅ Auto-save com cache
 * ✅ Estado persistente
 * ✅ Performance otimizada
 */

export interface EditableQuizStep {
    id: string;
    type: 'intro' | 'question' | 'strategic-question' | 'transition' | 'transition-result' | 'result' | 'offer';
    title?: string;
    questionNumber?: string;
    questionText?: string;
    formQuestion?: string;
    placeholder?: string;
    buttonText?: string;
    description?: string;
    subtitle?: string;
    image?: string;
    options?: Array<{
        id: string;
        text: string;
        image?: string;
    }>;
    requiredSelections?: number;
    characteristics?: string[];
    benefits?: string[];
    price?: string;
    originalPrice?: string;
}

export interface ModularStep {
    id: string;
    type: 'intro' | 'question' | 'result' | 'custom';
    name: string;
    components: Array<{
        id: string;
        type: string;
        props: any;
        order: number;
    }>;
}

export interface QuizEditorState {
    // Core state
    steps: EditableQuizStep[];
    modularSteps: ModularStep[];
    selectedId: string;
    selectedBlockId: string;

    // UI state
    previewMode: 'edit' | 'preview';
    showPropertiesPanel: boolean;
    dragEnabled: boolean;
    useModularSystem: boolean;

    // Editor state
    selectedComponentId: string | null;
    activeInsertDropdown: string | null;
    isSaving: boolean;
    isPreviewMode: boolean;
}

const INITIAL_STATE: QuizEditorState = {
    steps: [],
    modularSteps: [],
    selectedId: '',
    selectedBlockId: '',
    previewMode: 'edit',
    showPropertiesPanel: false,
    dragEnabled: true,
    useModularSystem: false,
    selectedComponentId: null,
    activeInsertDropdown: null,
    isSaving: false,
    isPreviewMode: false,
};

export const useQuizEditorStateWithCache = (funnelId?: string) => {
    const cache = useIntelligentCache();
    const [state, setState] = useState<QuizEditorState>(INITIAL_STATE);
    const [initialized, setInitialized] = useState(false);

    // Cache keys
    const stateKey = `quiz-editor-state-${funnelId || 'default'}`;
    const stepsKey = `quiz-steps-${funnelId || 'default'}`;
    const modularStepsKey = `modular-steps-${funnelId || 'default'}`;

    // Load state from cache on mount
    useEffect(() => {
        const loadFromCache = async () => {
            try {
                const cachedState = await cache.get<QuizEditorState>(stateKey);
                if (cachedState) {
                    setState(cachedState);
                }
                setInitialized(true);
            } catch (error) {
                console.warn('Failed to load state from cache:', error);
                setInitialized(true);
            }
        };

        loadFromCache();
    }, [cache, stateKey]);

    // Auto-save to cache with debouncing
    useEffect(() => {
        if (!initialized) return;

        const timeoutId = setTimeout(async () => {
            try {
                await cache.set(stateKey, state, {
                    ttl: 300000, // 5 minutes
                    persistent: true,
                    priority: 'high'
                });

                // Cache steps separately for better performance
                await cache.set(stepsKey, state.steps, {
                    ttl: 300000,
                    persistent: true,
                    tags: ['steps', funnelId || 'default']
                });

                await cache.set(modularStepsKey, state.modularSteps, {
                    ttl: 300000,
                    persistent: true,
                    tags: ['modular-steps', funnelId || 'default']
                });
            } catch (error) {
                console.warn('Failed to save state to cache:', error);
            }
        }, 1000); // 1 second debounce

        return () => clearTimeout(timeoutId);
    }, [cache, state, initialized, stateKey, stepsKey, modularStepsKey, funnelId]);

    // Selectors otimizados com useMemo
    const selectedStep = useMemo(() =>
        state.steps.find(step => step.id === state.selectedId),
        [state.steps, state.selectedId]
    );

    const selectedModularStep = useMemo(() =>
        state.modularSteps.find(step => step.id === state.selectedId),
        [state.modularSteps, state.selectedId]
    );

    const currentSteps = useMemo(() =>
        state.useModularSystem ? state.modularSteps : state.steps,
        [state.useModularSystem, state.modularSteps, state.steps]
    );

    // Actions otimizadas com useCallback
    const setSelectedId = useCallback((id: string) => {
        setState(prev => ({ ...prev, selectedId: id }));
    }, []);

    const setSelectedBlockId = useCallback((blockId: string) => {
        setState(prev => ({ ...prev, selectedBlockId: blockId }));
    }, []);

    const setPreviewMode = useCallback((mode: 'edit' | 'preview') => {
        setState(prev => ({ ...prev, previewMode: mode }));
    }, []);

    const setShowPropertiesPanel = useCallback((show: boolean) => {
        setState(prev => ({ ...prev, showPropertiesPanel: show }));
    }, []);

    const setDragEnabled = useCallback((enabled: boolean) => {
        setState(prev => ({ ...prev, dragEnabled: enabled }));
    }, []);

    const setUseModularSystem = useCallback((use: boolean) => {
        setState(prev => ({ ...prev, useModularSystem: use }));
    }, []);

    const setSelectedComponentId = useCallback((id: string | null) => {
        setState(prev => ({ ...prev, selectedComponentId: id }));
    }, []);

    const setActiveInsertDropdown = useCallback((dropdown: string | null) => {
        setState(prev => ({ ...prev, activeInsertDropdown: dropdown }));
    }, []);

    const setIsSaving = useCallback((saving: boolean) => {
        setState(prev => ({ ...prev, isSaving: saving }));
    }, []);

    const setIsPreviewMode = useCallback((preview: boolean) => {
        setState(prev => ({ ...prev, isPreviewMode: preview }));
    }, []);

    const updateSteps = useCallback((newSteps: EditableQuizStep[]) => {
        setState(prev => ({ ...prev, steps: newSteps }));
    }, []);

    const updateModularSteps = useCallback((newSteps: ModularStep[]) => {
        setState(prev => ({ ...prev, modularSteps: newSteps }));
    }, []);

    // State updating helper
    const updateState = useCallback((updates: Partial<QuizEditorState>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    // Force save to cache
    const saveToCache = useCallback(async () => {
        try {
            await cache.set(stateKey, state, {
                ttl: 300000,
                persistent: true,
                priority: 'high'
            });
            return true;
        } catch (error) {
            console.error('Failed to force save state:', error);
            return false;
        }
    }, [cache, state, stateKey]);

    // Clear cache
    const clearCache = useCallback(async () => {
        try {
            await cache.delete(stateKey);
            await cache.delete(stepsKey);
            await cache.delete(modularStepsKey);
            return true;
        } catch (error) {
            console.error('Failed to clear cache:', error);
            return false;
        }
    }, [cache, stateKey, stepsKey, modularStepsKey]);

    // Load specific data from cache
    const loadStepsFromCache = useCallback(async () => {
        try {
            const steps = await cache.get<EditableQuizStep[]>(stepsKey);
            const modularSteps = await cache.get<ModularStep[]>(modularStepsKey);

            if (steps || modularSteps) {
                setState(prev => ({
                    ...prev,
                    ...(steps && { steps }),
                    ...(modularSteps && { modularSteps })
                }));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to load steps from cache:', error);
            return false;
        }
    }, [cache, stepsKey, modularStepsKey]);

    // Initialize default state if needed
    useEffect(() => {
        if (initialized && state.steps.length === 0 && state.modularSteps.length === 0) {
            const defaultStep: EditableQuizStep = {
                id: 'step-1',
                type: 'intro',
                title: 'Bem-vindo ao Quiz',
                formQuestion: 'Como posso te chamar?',
                placeholder: 'Digite seu nome',
                buttonText: 'Começar Quiz'
            };
            setState(prev => ({
                ...prev,
                steps: [defaultStep],
                selectedId: 'step-1'
            }));
        }
    }, [initialized, state.steps.length, state.modularSteps.length]);

    return {
        // State
        ...state,
        initialized,

        // Computed
        selectedStep,
        selectedModularStep,
        currentSteps,

        // Actions
        setSelectedId,
        setSelectedBlockId,
        setPreviewMode,
        setShowPropertiesPanel,
        setDragEnabled,
        setUseModularSystem,
        setSelectedComponentId,
        setActiveInsertDropdown,
        setIsSaving,
        setIsPreviewMode,
        updateSteps,
        updateModularSteps,
        updateState,

        // Cache actions
        saveToCache,
        clearCache,
        loadStepsFromCache,
    };
};

// Export both hooks for flexibility
export { useQuizEditorState } from './useQuizEditorState';