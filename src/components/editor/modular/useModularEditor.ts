/**
 * 🎛️ HOOK DE GERENCIAMENTO DE ESTADO MODULAR
 * 
 * Hook central para gerenciar o estado do editor modular.
 * Inclui reducer, ações, undo/redo e utilitários.
 */

import { useReducer, useCallback, useMemo } from 'react';
import {
    ModularStep,
    ModularComponent,
    ModularEditorState,
    EditorAction,
    ComponentType
} from './types';
import { componentFactory, reorderComponents, validateStep } from './factory';

// 🔄 Estado inicial
const createInitialState = (initialSteps: ModularStep[] = []): ModularEditorState => ({
    steps: initialSteps,
    currentStepId: initialSteps.length > 0 ? initialSteps[0].id : null,
    selectedComponentId: null,
    dragMode: false,
    previewMode: false,
    history: {
        past: [],
        present: initialSteps,
        future: []
    }
});

// 🏗️ Reducer principal
const modularEditorReducer = (state: ModularEditorState, action: EditorAction): ModularEditorState => {
    switch (action.type) {
        case 'SET_STEPS': {
            const newSteps = action.payload;
            return {
                ...state,
                steps: newSteps,
                currentStepId: newSteps.length > 0 ? newSteps[0].id : null,
                selectedComponentId: null,
                history: {
                    past: [...state.history.past, state.history.present],
                    present: newSteps,
                    future: []
                }
            };
        }

        case 'ADD_STEP': {
            const newStep = action.payload;
            const newSteps = [...state.steps, newStep];

            return {
                ...state,
                steps: newSteps,
                currentStepId: newStep.id,
                selectedComponentId: null,
                history: {
                    past: [...state.history.past, state.history.present],
                    present: newSteps,
                    future: []
                }
            };
        }

        case 'UPDATE_STEP': {
            const { stepId, updates } = action.payload;
            const newSteps = state.steps.map(step =>
                step.id === stepId ? { ...step, ...updates } : step
            );

            return {
                ...state,
                steps: newSteps,
                history: {
                    past: [...state.history.past, state.history.present],
                    present: newSteps,
                    future: []
                }
            };
        }

        case 'DELETE_STEP': {
            const stepIdToDelete = action.payload;
            const newSteps = state.steps.filter(step => step.id !== stepIdToDelete);
            const newCurrentStepId = state.currentStepId === stepIdToDelete
                ? (newSteps.length > 0 ? newSteps[0].id : null)
                : state.currentStepId;

            return {
                ...state,
                steps: newSteps,
                currentStepId: newCurrentStepId,
                selectedComponentId: null,
                history: {
                    past: [...state.history.past, state.history.present],
                    present: newSteps,
                    future: []
                }
            };
        }

        case 'REORDER_STEPS': {
            const { fromIndex, toIndex } = action.payload;
            const newSteps = [...state.steps];
            const [movedStep] = newSteps.splice(fromIndex, 1);
            newSteps.splice(toIndex, 0, movedStep);

            return {
                ...state,
                steps: newSteps,
                history: {
                    past: [...state.history.past, state.history.present],
                    present: newSteps,
                    future: []
                }
            };
        }

        case 'SELECT_STEP': {
            return {
                ...state,
                currentStepId: action.payload,
                selectedComponentId: null
            };
        }

        case 'ADD_COMPONENT': {
            const { stepId, component } = action.payload;
            const newSteps = state.steps.map(step => {
                if (step.id === stepId) {
                    const newComponents = [...step.components, component].sort((a, b) => a.order - b.order);
                    return { ...step, components: newComponents };
                }
                return step;
            });

            return {
                ...state,
                steps: newSteps,
                selectedComponentId: component.id,
                history: {
                    past: [...state.history.past, state.history.present],
                    present: newSteps,
                    future: []
                }
            };
        }

        case 'UPDATE_COMPONENT': {
            const { stepId, componentId, updates } = action.payload;
            const newSteps = state.steps.map(step => {
                if (step.id === stepId) {
                    return {
                        ...step,
                        components: step.components.map(comp =>
                            comp.id === componentId ? { ...comp, ...updates } : comp
                        )
                    };
                }
                return step;
            });

            return {
                ...state,
                steps: newSteps,
                history: {
                    past: [...state.history.past, state.history.present],
                    present: newSteps,
                    future: []
                }
            };
        }

        case 'DELETE_COMPONENT': {
            const { stepId, componentId } = action.payload;
            const newSteps = state.steps.map(step => {
                if (step.id === stepId) {
                    return {
                        ...step,
                        components: step.components.filter(comp => comp.id !== componentId)
                    };
                }
                return step;
            });

            const newSelectedComponentId = state.selectedComponentId === componentId
                ? null
                : state.selectedComponentId;

            return {
                ...state,
                steps: newSteps,
                selectedComponentId: newSelectedComponentId,
                history: {
                    past: [...state.history.past, state.history.present],
                    present: newSteps,
                    future: []
                }
            };
        }

        case 'REORDER_COMPONENTS': {
            const { stepId, fromIndex, toIndex } = action.payload;
            const newSteps = state.steps.map(step => {
                if (step.id === stepId) {
                    const reorderedComponents = reorderComponents(step.components, fromIndex, toIndex);
                    return { ...step, components: reorderedComponents };
                }
                return step;
            });

            return {
                ...state,
                steps: newSteps,
                history: {
                    past: [...state.history.past, state.history.present],
                    present: newSteps,
                    future: []
                }
            };
        }

        case 'SELECT_COMPONENT': {
            return {
                ...state,
                selectedComponentId: action.payload
            };
        }

        case 'TOGGLE_DRAG_MODE': {
            return {
                ...state,
                dragMode: !state.dragMode,
                selectedComponentId: null
            };
        }

        case 'TOGGLE_PREVIEW_MODE': {
            return {
                ...state,
                previewMode: !state.previewMode,
                selectedComponentId: null,
                dragMode: false
            };
        }

        case 'UNDO': {
            if (state.history.past.length === 0) return state;

            const previous = state.history.past[state.history.past.length - 1];
            const newPast = state.history.past.slice(0, state.history.past.length - 1);

            return {
                ...state,
                steps: previous,
                selectedComponentId: null,
                history: {
                    past: newPast,
                    present: previous,
                    future: [state.history.present, ...state.history.future]
                }
            };
        }

        case 'REDO': {
            if (state.history.future.length === 0) return state;

            const next = state.history.future[0];
            const newFuture = state.history.future.slice(1);

            return {
                ...state,
                steps: next,
                selectedComponentId: null,
                history: {
                    past: [...state.history.past, state.history.present],
                    present: next,
                    future: newFuture
                }
            };
        }

        default:
            return state;
    }
};

// 🎣 Hook principal
export const useModularEditor = (initialSteps?: ModularStep[]) => {
    const [state, dispatch] = useReducer(
        modularEditorReducer,
        createInitialState(initialSteps)
    );

    // 📝 Ações para gerenciar etapas
    const stepActions = useMemo(() => ({
        setSteps: (steps: ModularStep[]) => {
            dispatch({ type: 'SET_STEPS', payload: steps });
        },

        addStep: (step: ModularStep) => {
            dispatch({ type: 'ADD_STEP', payload: step });
        },

        updateStep: (stepId: string, updates: Partial<ModularStep>) => {
            dispatch({ type: 'UPDATE_STEP', payload: { stepId, updates } });
        },

        deleteStep: (stepId: string) => {
            dispatch({ type: 'DELETE_STEP', payload: stepId });
        },

        reorderSteps: (fromIndex: number, toIndex: number) => {
            dispatch({ type: 'REORDER_STEPS', payload: { fromIndex, toIndex } });
        },

        selectStep: (stepId: string | null) => {
            dispatch({ type: 'SELECT_STEP', payload: stepId });
        },

        duplicateStep: (stepId: string) => {
            const step = state.steps.find(s => s.id === stepId);
            if (!step) return;

            const duplicatedStep: ModularStep = {
                ...step,
                id: `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: `${step.name} (Cópia)`,
                components: step.components.map(comp => componentFactory.duplicate(comp))
            };

            dispatch({ type: 'ADD_STEP', payload: duplicatedStep });
        }
    }), [state.steps]);

    // 🧩 Ações para gerenciar componentes
    const componentActions = useMemo(() => ({
        addComponent: (stepId: string, type: ComponentType, order?: number) => {
            const step = state.steps.find(s => s.id === stepId);
            if (!step) return;

            const maxOrder = Math.max(...step.components.map(c => c.order), -1);
            const newComponent = componentFactory.create(type, {
                order: order !== undefined ? order : maxOrder + 1
            });

            dispatch({ type: 'ADD_COMPONENT', payload: { stepId, component: newComponent } });
        },

        updateComponent: (stepId: string, componentId: string, updates: Partial<ModularComponent>) => {
            dispatch({ type: 'UPDATE_COMPONENT', payload: { stepId, componentId, updates } });
        },

        deleteComponent: (stepId: string, componentId: string) => {
            dispatch({ type: 'DELETE_COMPONENT', payload: { stepId, componentId } });
        },

        reorderComponents: (stepId: string, fromIndex: number, toIndex: number) => {
            dispatch({ type: 'REORDER_COMPONENTS', payload: { stepId, fromIndex, toIndex } });
        },

        selectComponent: (componentId: string | null) => {
            dispatch({ type: 'SELECT_COMPONENT', payload: componentId });
        },

        duplicateComponent: (stepId: string, componentId: string) => {
            const step = state.steps.find(s => s.id === stepId);
            const component = step?.components.find(c => c.id === componentId);
            if (!step || !component) return;

            const duplicatedComponent = componentFactory.duplicate(component);
            dispatch({ type: 'ADD_COMPONENT', payload: { stepId, component: duplicatedComponent } });
        },

        moveComponentUp: (stepId: string, componentId: string) => {
            const step = state.steps.find(s => s.id === stepId);
            if (!step) return;

            const componentIndex = step.components.findIndex(c => c.id === componentId);
            if (componentIndex <= 0) return;

            dispatch({
                type: 'REORDER_COMPONENTS',
                payload: { stepId, fromIndex: componentIndex, toIndex: componentIndex - 1 }
            });
        },

        moveComponentDown: (stepId: string, componentId: string) => {
            const step = state.steps.find(s => s.id === stepId);
            if (!step) return;

            const componentIndex = step.components.findIndex(c => c.id === componentId);
            if (componentIndex >= step.components.length - 1) return;

            dispatch({
                type: 'REORDER_COMPONENTS',
                payload: { stepId, fromIndex: componentIndex, toIndex: componentIndex + 1 }
            });
        }
    }), [state.steps]);

    // 🎛️ Ações do editor
    const editorActions = useMemo(() => ({
        toggleDragMode: () => {
            dispatch({ type: 'TOGGLE_DRAG_MODE' });
        },

        togglePreviewMode: () => {
            dispatch({ type: 'TOGGLE_PREVIEW_MODE' });
        },

        undo: () => {
            dispatch({ type: 'UNDO' });
        },

        redo: () => {
            dispatch({ type: 'REDO' });
        }
    }), []);

    // 📊 Computed values
    const computed = useMemo(() => {
        const currentStep = state.currentStepId
            ? state.steps.find(s => s.id === state.currentStepId)
            : null;

        const selectedComponent = currentStep && state.selectedComponentId
            ? currentStep.components.find(c => c.id === state.selectedComponentId)
            : null;

        const canUndo = state.history.past.length > 0;
        const canRedo = state.history.future.length > 0;

        const validation = state.steps.reduce((acc, step) => {
            const stepValidation = validateStep(step);
            if (!stepValidation.isValid) {
                acc.errors.push({
                    stepId: step.id,
                    stepName: step.name,
                    errors: stepValidation.errors
                });
            }
            return acc;
        }, { errors: [] as Array<{ stepId: string; stepName: string; errors: string[] }> });

        return {
            currentStep,
            selectedComponent,
            canUndo,
            canRedo,
            isValid: validation.errors.length === 0,
            validationErrors: validation.errors,
            totalSteps: state.steps.length,
            hasSelectedComponent: !!state.selectedComponentId
        };
    }, [state]);

    return {
        // Estado
        state,

        // Computed values
        ...computed,

        // Ações
        stepActions,
        componentActions,
        editorActions,

        // Utilitários
        utils: {
            getStepById: (stepId: string) => state.steps.find(s => s.id === stepId),
            getComponentById: (stepId: string, componentId: string) => {
                const step = state.steps.find(s => s.id === stepId);
                return step?.components.find(c => c.id === componentId);
            },
            exportData: () => ({
                steps: state.steps,
                metadata: {
                    version: '1.0.0',
                    createdAt: new Date().toISOString(),
                    totalSteps: state.steps.length,
                    totalComponents: state.steps.reduce((acc, step) => acc + step.components.length, 0)
                }
            }),
            importData: (data: { steps: ModularStep[] }) => {
                dispatch({ type: 'SET_STEPS', payload: data.steps });
            }
        }
    };
};