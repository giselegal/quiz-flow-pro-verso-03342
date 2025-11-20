import React, { createContext, useContext, useReducer, useCallback, useMemo, ReactNode } from 'react';
import type { Block } from '@/types/editor';
import { hierarchicalTemplateSource } from '@/services/core/HierarchicalTemplateSource';
import { appLogger } from '@/lib/utils/appLogger';

// Slice de estado do editor extraída de SuperUnifiedProvider
export interface EditorState {
    currentStep: number;
    selectedBlockId: string | null;
    isPreviewMode: boolean;
    isEditing: boolean;
    dragEnabled: boolean;
    clipboardData: any | null;
    stepBlocks: Record<number, any[]>;
    dirtySteps: Record<number, boolean>;
    totalSteps: number;
    funnelSettings: any;
    validationErrors: any[];
    isDirty: boolean;
    lastSaved: number | null;
    lastModified: number | null;
    modifiedSteps: Record<string, number>;
}

const initialEditorState: EditorState = {
    currentStep: 1,
    selectedBlockId: null,
    isPreviewMode: false,
    isEditing: false,
    dragEnabled: true,
    clipboardData: null,
    stepBlocks: {},
    dirtySteps: {},
    totalSteps: 21,
    funnelSettings: {},
    validationErrors: [],
    isDirty: false,
    lastSaved: null,
    lastModified: null,
    modifiedSteps: {},
};

// Actions específicas do editor
export type EditorAction =
    | { type: 'SET_EDITOR_STATE'; payload: Partial<EditorState> }
    | { type: 'SET_CURRENT_STEP'; payload: number }
    | { type: 'SELECT_BLOCK'; payload: string | null }
    | { type: 'ADD_BLOCK'; payload: { stepIndex: number; block: any } }
    | { type: 'UPDATE_BLOCK'; payload: { stepIndex: number; blockId: string; updates: any } }
    | { type: 'REMOVE_BLOCK'; payload: { stepIndex: number; blockId: string } }
    | { type: 'REORDER_BLOCKS'; payload: { stepIndex: number; blocks: any[] } }
    | { type: 'SET_STEP_BLOCKS'; payload: { stepIndex: number; blocks: any[] } }
    | { type: 'VALIDATE_STEP'; payload: { stepIndex: number; errors: any[] } }
    | { type: 'SET_STEP_DIRTY'; payload: { stepIndex: number; dirty: boolean } }
    | { type: 'MARK_MODIFIED'; payload: { stepId: string; timestamp: number } };

function editorReducer(state: EditorState, action: EditorAction): EditorState {
    switch (action.type) {
        case 'SET_EDITOR_STATE':
            return { ...state, ...action.payload };
        case 'SET_CURRENT_STEP':
            return { ...state, currentStep: action.payload };
        case 'SELECT_BLOCK':
            return { ...state, selectedBlockId: action.payload };
        case 'ADD_BLOCK': {
            const { stepIndex, block } = action.payload;
            const existing = state.stepBlocks[stepIndex] || [];
            return {
                ...state,
                stepBlocks: { ...state.stepBlocks, [stepIndex]: [...existing, block] },
                isDirty: true,
                dirtySteps: { ...state.dirtySteps, [stepIndex]: true },
            };
        }
        case 'UPDATE_BLOCK': {
            const { stepIndex, blockId, updates } = action.payload;
            const existing = state.stepBlocks[stepIndex] || [];
            return {
                ...state,
                stepBlocks: {
                    ...state.stepBlocks,
                    [stepIndex]: existing.map(b => (b.id === blockId ? { ...b, ...updates } : b)),
                },
                isDirty: true,
                dirtySteps: { ...state.dirtySteps, [stepIndex]: true },
            };
        }
        case 'REMOVE_BLOCK': {
            const { stepIndex, blockId } = action.payload;
            const existing = state.stepBlocks[stepIndex] || [];
            return {
                ...state,
                stepBlocks: {
                    ...state.stepBlocks,
                    [stepIndex]: existing.filter(b => b.id !== blockId),
                },
                isDirty: true,
                dirtySteps: { ...state.dirtySteps, [stepIndex]: true },
            };
        }
        case 'REORDER_BLOCKS': {
            const { stepIndex, blocks } = action.payload;
            return {
                ...state,
                stepBlocks: { ...state.stepBlocks, [stepIndex]: blocks },
                isDirty: true,
                dirtySteps: { ...state.dirtySteps, [stepIndex]: true },
            };
        }
        case 'SET_STEP_BLOCKS': {
            const { stepIndex, blocks } = action.payload;
            return {
                ...state,
                stepBlocks: { ...state.stepBlocks, [stepIndex]: blocks },
            };
        }
        case 'VALIDATE_STEP': {
            const { stepIndex, errors } = action.payload;
            return {
                ...state,
                validationErrors: errors,
                dirtySteps: { ...state.dirtySteps, [stepIndex]: true },
            };
        }
        case 'SET_STEP_DIRTY': {
            const { stepIndex, dirty } = action.payload;
            return {
                ...state,
                dirtySteps: { ...state.dirtySteps, [stepIndex]: dirty },
                isDirty: Object.values({ ...state.dirtySteps, [stepIndex]: dirty }).some(Boolean),
            };
        }
        case 'MARK_MODIFIED': {
            const { stepId, timestamp } = action.payload;
            return {
                ...state,
                lastModified: timestamp,
                modifiedSteps: { ...state.modifiedSteps, [stepId]: timestamp },
            };
        }
        default:
            return state;
    }
}

interface EditorContextValue {
    state: EditorState;
    dispatch: React.Dispatch<EditorAction>;
    loadStepBlocks: (stepId: string) => Promise<Block[] | null>;
    setCurrentStep: (n: number) => void;
    selectBlock: (id: string | null) => void;
}

const EditorContext = createContext<EditorContextValue | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(editorReducer, initialEditorState);

    const loadStepBlocks = useCallback(async (stepId: string) => {
        try {
            const result = await hierarchicalTemplateSource.getPrimary(stepId);
            const blocks = result.data || [];
            const stepNumber = parseInt(stepId.replace('step-', ''), 10);
            if (!isNaN(stepNumber)) {
                dispatch({ type: 'SET_STEP_BLOCKS', payload: { stepIndex: stepNumber, blocks } });
                dispatch({ type: 'MARK_MODIFIED', payload: { stepId, timestamp: Date.now() } });
            }
            return blocks;
        } catch (e) {
            appLogger.warn('[EditorProvider] Falha ao carregar blocos', { data: [{ stepId, error: (e as any)?.message }] });
            return null;
        }
    }, []);

    const setCurrentStep = useCallback((n: number) => {
        dispatch({ type: 'SET_CURRENT_STEP', payload: n });
    }, []);

    const selectBlock = useCallback((id: string | null) => {
        dispatch({ type: 'SELECT_BLOCK', payload: id });
    }, []);

    const value: EditorContextValue = useMemo(() => ({
        state,
        dispatch,
        loadStepBlocks,
        setCurrentStep,
        selectBlock,
    }), [state, loadStepBlocks, setCurrentStep, selectBlock]);

    return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};

export function useEditor() {
    const ctx = useContext(EditorContext);
    if (!ctx) throw new Error('useEditor deve ser usado dentro de EditorProvider');
    return ctx;
}
