/**
 * 🎯 CONTEXTO CENTRALIZADO DO EDITOR MODULAR
 * 
 * Contexto principal que gerencia todo o estado do editor de quiz modular
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import {
    ModularQuizFunnel,
    ModularQuizStep,
    ModularComponent,
    FunnelSettings,
    EditorUIState,
    QuizEditorContextType,
    StepType,
    ComponentType
} from '@/types/modular-editor';

// ============================================================================
// ESTADO INICIAL
// ============================================================================

const initialUIState: EditorUIState = {
    selectedStepId: null,
    selectedComponentId: null,
    previewMode: false,
    panelVisibility: {
        steps: true,
        properties: true,
        components: true,
        settings: false,
        preview: false,
    },
    dragMode: false,
    clipboardComponent: null,
};

const initialSettings: FunnelSettings = {
    title: 'Novo Quiz',
    description: 'Descrição do quiz',
    language: 'pt-BR',
    theme: {
        colors: {
            primary: '#0090FF',
            secondary: '#718096',
            accent: '#38A169',
            background: '#FFFFFF',
            text: '#1A202C',
        },
        fonts: {
            heading: 'Inter',
            body: 'Inter',
        },
        borderRadius: '8px',
        shadows: true,
    },
    allowBackNavigation: true,
    showProgressBar: true,
    saveProgress: true,
    resultCalculation: 'points',
};

const initialFunnel: ModularQuizFunnel = {
    id: 'new-funnel',
    name: 'Novo Funil de Quiz',
    description: 'Descrição do funil',
    status: 'draft',
    steps: [],
    settings: initialSettings,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'current-user',
    version: 1,
};

// ============================================================================
// ACTIONS
// ============================================================================

type EditorAction =
    | { type: 'SET_FUNNEL'; payload: ModularQuizFunnel }
    | { type: 'UPDATE_FUNNEL'; payload: Partial<ModularQuizFunnel> }
    | { type: 'ADD_STEP'; payload: { step: ModularQuizStep; afterIndex?: number } }
    | { type: 'UPDATE_STEP'; payload: { stepId: string; updates: Partial<ModularQuizStep> } }
    | { type: 'DELETE_STEP'; payload: { stepId: string } }
    | { type: 'REORDER_STEPS'; payload: { fromIndex: number; toIndex: number } }
    | { type: 'ADD_COMPONENT'; payload: { stepId: string; component: ModularComponent; index?: number } }
    | { type: 'UPDATE_COMPONENT'; payload: { stepId: string; componentId: string; updates: Partial<ModularComponent> } }
    | { type: 'DELETE_COMPONENT'; payload: { stepId: string; componentId: string } }
    | { type: 'REORDER_COMPONENTS'; payload: { stepId: string; fromIndex: number; toIndex: number } }
    | { type: 'UPDATE_SETTINGS'; payload: Partial<FunnelSettings> }
    | { type: 'UPDATE_UI_STATE'; payload: Partial<EditorUIState> }
    | { type: 'SELECT_STEP'; payload: { stepId: string | null } }
    | { type: 'SELECT_COMPONENT'; payload: { componentId: string | null } };

interface EditorState {
    funnel: ModularQuizFunnel;
    uiState: EditorUIState;
    history: ModularQuizFunnel[];
    historyIndex: number;
}

const initialState: EditorState = {
    funnel: initialFunnel,
    uiState: initialUIState,
    history: [initialFunnel],
    historyIndex: 0,
};

// ============================================================================
// REDUCER
// ============================================================================

function editorReducer(state: EditorState, action: EditorAction): EditorState {
    switch (action.type) {
        case 'SET_FUNNEL':
            return {
                ...state,
                funnel: action.payload,
                history: [action.payload],
                historyIndex: 0,
            };

        case 'UPDATE_FUNNEL': {
            const updatedFunnel = {
                ...state.funnel,
                ...action.payload,
                updatedAt: new Date(),
                version: state.funnel.version + 1,
            };

            const newHistory = state.history.slice(0, state.historyIndex + 1);
            newHistory.push(updatedFunnel);

            return {
                ...state,
                funnel: updatedFunnel,
                history: newHistory.slice(-50), // Manter apenas os últimos 50 estados
                historyIndex: Math.min(newHistory.length - 1, 49),
            };
        }

        case 'ADD_STEP': {
            const steps = [...state.funnel.steps];
            const insertIndex = action.payload.afterIndex !== undefined
                ? action.payload.afterIndex + 1
                : steps.length;

            steps.splice(insertIndex, 0, action.payload.step);

            return editorReducer(state, {
                type: 'UPDATE_FUNNEL',
                payload: { steps },
            });
        }

        case 'UPDATE_STEP': {
            const steps = state.funnel.steps.map(step =>
                step.id === action.payload.stepId
                    ? { ...step, ...action.payload.updates }
                    : step
            );

            return editorReducer(state, {
                type: 'UPDATE_FUNNEL',
                payload: { steps },
            });
        }

        case 'DELETE_STEP': {
            const steps = state.funnel.steps.filter(step => step.id !== action.payload.stepId);
            const newUIState = state.uiState.selectedStepId === action.payload.stepId
                ? { ...state.uiState, selectedStepId: null, selectedComponentId: null }
                : state.uiState;

            return {
                ...editorReducer(state, {
                    type: 'UPDATE_FUNNEL',
                    payload: { steps },
                }),
                uiState: newUIState,
            };
        }

        case 'REORDER_STEPS': {
            const steps = [...state.funnel.steps];
            const [movedStep] = steps.splice(action.payload.fromIndex, 1);
            steps.splice(action.payload.toIndex, 0, movedStep);

            return editorReducer(state, {
                type: 'UPDATE_FUNNEL',
                payload: { steps },
            });
        }

        case 'ADD_COMPONENT': {
            const steps = state.funnel.steps.map(step => {
                if (step.id === action.payload.stepId) {
                    const components = [...step.components];
                    const insertIndex = action.payload.index !== undefined
                        ? action.payload.index
                        : components.length;

                    components.splice(insertIndex, 0, action.payload.component);

                    return { ...step, components };
                }
                return step;
            });

            return editorReducer(state, {
                type: 'UPDATE_FUNNEL',
                payload: { steps },
            });
        }

        case 'UPDATE_COMPONENT': {
            const steps = state.funnel.steps.map(step => {
                if (step.id === action.payload.stepId) {
                    const components = step.components.map(component =>
                        component.id === action.payload.componentId
                            ? { ...component, ...action.payload.updates }
                            : component
                    );
                    return { ...step, components };
                }
                return step;
            });

            return editorReducer(state, {
                type: 'UPDATE_FUNNEL',
                payload: { steps },
            });
        }

        case 'DELETE_COMPONENT': {
            const steps = state.funnel.steps.map(step => {
                if (step.id === action.payload.stepId) {
                    const components = step.components.filter(
                        component => component.id !== action.payload.componentId
                    );
                    return { ...step, components };
                }
                return step;
            });

            const newUIState = state.uiState.selectedComponentId === action.payload.componentId
                ? { ...state.uiState, selectedComponentId: null }
                : state.uiState;

            return {
                ...editorReducer(state, {
                    type: 'UPDATE_FUNNEL',
                    payload: { steps },
                }),
                uiState: newUIState,
            };
        }

        case 'REORDER_COMPONENTS': {
            const steps = state.funnel.steps.map(step => {
                if (step.id === action.payload.stepId) {
                    const components = [...step.components];
                    const [movedComponent] = components.splice(action.payload.fromIndex, 1);
                    components.splice(action.payload.toIndex, 0, movedComponent);

                    return { ...step, components };
                }
                return step;
            });

            return editorReducer(state, {
                type: 'UPDATE_FUNNEL',
                payload: { steps },
            });
        }

        case 'UPDATE_SETTINGS': {
            const settings = { ...state.funnel.settings, ...action.payload };
            return editorReducer(state, {
                type: 'UPDATE_FUNNEL',
                payload: { settings },
            });
        }

        case 'UPDATE_UI_STATE':
            return {
                ...state,
                uiState: { ...state.uiState, ...action.payload },
            };

        case 'SELECT_STEP':
            return {
                ...state,
                uiState: {
                    ...state.uiState,
                    selectedStepId: action.payload.stepId,
                    selectedComponentId: null, // Limpar seleção de componente
                },
            };

        case 'SELECT_COMPONENT':
            return {
                ...state,
                uiState: {
                    ...state.uiState,
                    selectedComponentId: action.payload.componentId,
                },
            };

        default:
            return state;
    }
}

// ============================================================================
// CONTEXTO
// ============================================================================

const QuizEditorContext = createContext<QuizEditorContextType | null>(null);

export const useQuizEditor = (): QuizEditorContextType => {
    const context = useContext(QuizEditorContext);
    if (!context) {
        throw new Error('useQuizEditor deve ser usado dentro de QuizEditorProvider');
    }

    // Garantir que _config sempre existe no contexto
    const safeContext = {
        ...context,
        _config: context._config || {
            theme: 'modern',
            layout: 'horizontal',
            showPreview: true,
            autoSave: true,
            debug: false
        }
    };

    return safeContext as QuizEditorContextType;
};

// ============================================================================
// PROVIDER
// ============================================================================

interface QuizEditorProviderProps {
    children: React.ReactNode;
    initialFunnel?: ModularQuizFunnel;
}

export const QuizEditorProvider: React.FC<QuizEditorProviderProps> = ({
    children,
    initialFunnel,
}) => {
    const [state, dispatch] = useReducer(editorReducer, {
        ...initialState,
        funnel: initialFunnel || initialState.funnel,
    });

    // Inicializar com funnel fornecido
    useEffect(() => {
        if (initialFunnel && initialFunnel.id !== state.funnel.id) {
            dispatch({ type: 'SET_FUNNEL', payload: initialFunnel });
        }
    }, [initialFunnel, state.funnel.id]);

    // ============================================================================
    // AÇÕES DO FUNIL
    // ============================================================================

    const updateFunnel = useCallback((updates: Partial<ModularQuizFunnel>) => {
        dispatch({ type: 'UPDATE_FUNNEL', payload: updates });
    }, []);

    const saveFunnel = useCallback(async () => {
        // TODO: Implementar salvamento no backend
        console.log('Salvando funil:', state.funnel);
        // await api.saveFunnel(state.funnel);
    }, [state.funnel]);

    const publishFunnel = useCallback(async () => {
        // TODO: Implementar publicação no backend
        console.log('Publicando funil:', state.funnel);
        updateFunnel({ status: 'published' });
        // await api.publishFunnel(state.funnel);
    }, [state.funnel, updateFunnel]);

    // ============================================================================
    // AÇÕES DE ETAPAS
    // ============================================================================

    const addStep = useCallback((type: StepType, afterStepId?: string): ModularQuizStep => {
        const afterIndex = afterStepId
            ? state.funnel.steps.findIndex((step: ModularQuizStep) => step.id === afterStepId)
            : -1;

        const newStep: ModularQuizStep = {
            id: `step-${Date.now()}`,
            type,
            name: `Nova Etapa ${type}`,
            components: [],
            settings: {
                canGoBack: true,
                requireCompletion: false,
                scoringRules: [],
            },
            order: afterIndex >= 0 ? afterIndex + 1 : state.funnel.steps.length,
        };

        dispatch({
            type: 'ADD_STEP',
            payload: { step: newStep, afterIndex }
        });

        return newStep;
    }, [state.funnel.steps]);

    const updateStep = useCallback((stepId: string, updates: Partial<ModularQuizStep>) => {
        dispatch({ type: 'UPDATE_STEP', payload: { stepId, updates } });
    }, []);

    const deleteStep = useCallback((stepId: string) => {
        dispatch({ type: 'DELETE_STEP', payload: { stepId } });
    }, []);

    const duplicateStep = useCallback((stepId: string): ModularQuizStep => {
        const originalStep = state.funnel.steps.find((step: ModularQuizStep) => step.id === stepId);
        if (!originalStep) throw new Error('Etapa não encontrada');

        const duplicatedStep: ModularQuizStep = {
            ...originalStep,
            id: `step-${Date.now()}`,
            name: `${originalStep.name} (Cópia)`,
            components: originalStep.components.map((comp: ModularComponent) => ({
                ...comp,
                id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            })),
        };

        const originalIndex = state.funnel.steps.findIndex((step: ModularQuizStep) => step.id === stepId);
        dispatch({
            type: 'ADD_STEP',
            payload: { step: duplicatedStep, afterIndex: originalIndex }
        });

        return duplicatedStep;
    }, [state.funnel.steps]);

    const reorderSteps = useCallback((fromIndex: number, toIndex: number) => {
        dispatch({ type: 'REORDER_STEPS', payload: { fromIndex, toIndex } });
    }, []);

    // ============================================================================
    // AÇÕES DE COMPONENTES
    // ============================================================================

    const addComponent = useCallback((
        stepId: string,
        component: Partial<ModularComponent>,
        index?: number
    ): ModularComponent => {
        const fullComponent: ModularComponent = {
            id: `comp-${Date.now()}`,
            order: index || 0,
            isVisible: true,
            isEditable: true,
            ...component,
        } as ModularComponent;

        dispatch({
            type: 'ADD_COMPONENT',
            payload: { stepId, component: fullComponent, index }
        });

        return fullComponent;
    }, []);

    const updateComponent = useCallback((
        stepId: string,
        componentId: string,
        updates: Partial<ModularComponent>
    ) => {
        dispatch({
            type: 'UPDATE_COMPONENT',
            payload: { stepId, componentId, updates }
        });
    }, []);

    const deleteComponent = useCallback((stepId: string, componentId: string) => {
        dispatch({ type: 'DELETE_COMPONENT', payload: { stepId, componentId } });
    }, []);

    const duplicateComponent = useCallback((stepId: string, componentId: string): ModularComponent => {
        const step = state.funnel.steps.find((s: ModularQuizStep) => s.id === stepId);
        const originalComponent = step?.components.find((c: ModularComponent) => c.id === componentId);

        if (!originalComponent) throw new Error('Componente não encontrado');

        const duplicatedComponent: ModularComponent = {
            ...originalComponent,
            id: `comp-${Date.now()}`,
            order: (originalComponent.order || 0) + 1,
        };

        dispatch({
            type: 'ADD_COMPONENT',
            payload: { stepId, component: duplicatedComponent }
        });

        return duplicatedComponent;
    }, [state.funnel.steps]);

    const reorderComponents = useCallback((
        stepId: string,
        fromIndex: number,
        toIndex: number
    ) => {
        dispatch({
            type: 'REORDER_COMPONENTS',
            payload: { stepId, fromIndex, toIndex }
        });
    }, []);

    // ============================================================================
    // SELEÇÃO
    // ============================================================================

    const selectStep = useCallback((stepId: string | null) => {
        dispatch({ type: 'SELECT_STEP', payload: { stepId } });
    }, []);

    const selectComponent = useCallback((componentId: string | null) => {
        dispatch({ type: 'SELECT_COMPONENT', payload: { componentId } });
    }, []);

    // ============================================================================
    // CONFIGURAÇÕES
    // ============================================================================

    const updateSettings = useCallback((updates: Partial<FunnelSettings>) => {
        dispatch({ type: 'UPDATE_SETTINGS', payload: updates });
    }, []);

    // ============================================================================
    // UI STATE
    // ============================================================================

    const updateUIState = useCallback((updates: Partial<EditorUIState>) => {
        dispatch({ type: 'UPDATE_UI_STATE', payload: updates });
    }, []);

    // ============================================================================
    // UNDO/REDO
    // ============================================================================

    const undo = useCallback(() => {
        if (state.historyIndex > 0) {
            const newIndex = state.historyIndex - 1;
            const previousState = state.history[newIndex];
            dispatch({ type: 'SET_FUNNEL', payload: previousState });
        }
    }, [state.historyIndex, state.history]);

    const redo = useCallback(() => {
        if (state.historyIndex < state.history.length - 1) {
            const newIndex = state.historyIndex + 1;
            const nextState = state.history[newIndex];
            dispatch({ type: 'SET_FUNNEL', payload: nextState });
        }
    }, [state.historyIndex, state.history]);

    // ============================================================================
    // CLIPBOARD
    // ============================================================================

    const copyComponent = useCallback((componentId: string) => {
        const component = state.funnel.steps
            .flatMap(step => step.components)
            .find(comp => comp.id === componentId);

        if (component) {
            dispatch({
                type: 'UPDATE_UI_STATE',
                payload: { clipboardComponent: component }
            });
        }
    }, [state.funnel.steps]);

    const pasteComponent = useCallback((stepId: string, index?: number) => {
        if (state.uiState.clipboardComponent) {
            const component = {
                ...state.uiState.clipboardComponent,
                id: `comp-${Date.now()}`,
            };
            addComponent(stepId, component, index);
        }
    }, [state.uiState.clipboardComponent, addComponent]);

    // ============================================================================
    // COMPUTED VALUES
    // ============================================================================

    const currentStep = state.uiState.selectedStepId
        ? state.funnel.steps.find(step => step.id === state.uiState.selectedStepId) || null
        : null;

    const selectedComponent = state.uiState.selectedComponentId
        ? state.funnel.steps
            .flatMap(step => step.components)
            .find(comp => comp.id === state.uiState.selectedComponentId) || null
        : null;

    const canUndo = state.historyIndex > 0;
    const canRedo = state.historyIndex < state.history.length - 1;
    const canPaste = !!state.uiState.clipboardComponent;

    // ============================================================================
    // CONTEXT VALUE
    // ============================================================================

    const contextValue: QuizEditorContextType = {
        // Estado
        funnel: state.funnel,
        currentStep,
        selectedComponent,

        // Ações do funil
        updateFunnel,
        saveFunnel,
        publishFunnel,

        // Ações de etapas
        addStep,
        updateStep,
        deleteStep,
        duplicateStep,
        reorderSteps,

        // Ações de componentes
        addComponent,
        updateComponent,
        deleteComponent,
        duplicateComponent,
        reorderComponents,

        // Seleção
        selectStep,
        selectComponent,

        // Configurações
        settings: state.funnel.settings,
        updateSettings,

        // UI State
        uiState: state.uiState,
        updateUIState,

        // Utilitários
        undo,
        redo,
        canUndo,
        canRedo,

        // Clipboard
        copyComponent,
        pasteComponent,
        canPaste,

        // Configuração do editor
        _config: {
            theme: 'modern',
            layout: 'horizontal',
            showPreview: true,
            autoSave: true,
            debug: false
        }
    };

    return (
        <QuizEditorContext.Provider value={contextValue}>
            {children}
        </QuizEditorContext.Provider>
    );
};