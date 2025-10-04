import { useState, useCallback, useMemo, useEffect } from 'react';

/**
 * 🎯 HOOK CENTRAL DO QUIZ EDITOR
 * 
 * Extrai todo o gerenciamento de estado do QuizFunnelEditorWYSIWYG.tsx
 * Consolida lógica dispersa em um local centralizado
 * Implementa selectors otimizados para performance
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

export const useQuizEditorState = () => {
    const [state, setState] = useState<QuizEditorState>(INITIAL_STATE);

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

    // Initialize effect
    useEffect(() => {
        // Inicializar com dados padrão se necessário
        if (state.steps.length === 0) {
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
    }, [state.steps.length]);

    return {
        // State
        ...state,

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
    };
};