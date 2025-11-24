/**
 * ✏️ EDITOR STATE PROVIDER - Gerenciamento do Estado do Editor
 * 
 * Provider independente para estado do editor modular.
 * Extraído do SuperUnifiedProvider para isolamento e performance.
 * 
 * RESPONSABILIDADES:
 * - Step atual
 * - Bloco selecionado
 * - Modo de edição/preview
 * - Drag & drop
 * - Clipboard
 * - Estado de blocos por step
 * - Dirty tracking
 * - Validações
 * 
 * BENEFÍCIOS:
 * - Re-render apenas quando editor muda
 * - Isolamento de lógica complexa
 * - Fácil de debugar
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { Block } from '@/types/editor';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES
// ============================================================================

export interface ValidationError {
    blockId: string;
    field: string;
    message: string;
    severity: 'error' | 'warning';
}

export interface EditorState {
    currentStep: number;
    selectedBlockId: string | null;
    isPreviewMode: boolean;
    isEditing: boolean;
    dragEnabled: boolean;
    clipboardData: Block | null;
    stepBlocks: Record<number, Block[]>;
    dirtySteps: Record<number, boolean>;
    totalSteps: number;
    validationErrors: ValidationError[];
    isDirty: boolean;
    lastSaved: number | null;
    lastModified: number | null;
    modifiedSteps: Record<string, number>;
}

type EditorAction =
    | { type: 'SET_CURRENT_STEP'; payload: number }
    | { type: 'SELECT_BLOCK'; payload: string | null }
    | { type: 'TOGGLE_PREVIEW'; payload?: boolean }
    | { type: 'TOGGLE_EDITING'; payload?: boolean }
    | { type: 'TOGGLE_DRAG'; payload?: boolean }
    | { type: 'SET_CLIPBOARD'; payload: Block | null }
    | { type: 'SET_STEP_BLOCKS'; payload: { step: number; blocks: Block[] } }
    | { type: 'UPDATE_BLOCK'; payload: { step: number; blockId: string; updates: Partial<Block> } }
    | { type: 'ADD_BLOCK'; payload: { step: number; block: Block; index?: number } }
    | { type: 'REMOVE_BLOCK'; payload: { step: number; blockId: string } }
    | { type: 'REORDER_BLOCKS'; payload: { step: number; blocks: Block[] } }
    | { type: 'SET_DIRTY'; payload: { step: number; dirty: boolean } }
    | { type: 'MARK_SAVED'; payload: number }
    | { type: 'MARK_MODIFIED'; payload: { step: string; timestamp: number } }
    | { type: 'ADD_VALIDATION_ERROR'; payload: ValidationError }
    | { type: 'CLEAR_VALIDATION_ERRORS'; payload?: string }
    | { type: 'RESET_EDITOR' };

// Interface de contexto unificada que oferece duas camadas de acesso:
// 1. Propriedades flat (back-compat com código já migrado parcialmente)
// 2. Estrutura canonical { state, actions } para novos componentes e para alinhamento com EditorContextType legado.
export interface EditorContextValue extends EditorState {
    // ===== CAMADA LEGADO (flat) =====
    setCurrentStep: (step: number) => void;
    selectBlock: (blockId: string | null) => void;
    togglePreview: (enabled?: boolean) => void;
    toggleEditing: (enabled?: boolean) => void;
    toggleDrag: (enabled?: boolean) => void;
    copyBlock: (block: Block) => void;
    pasteBlock: (step: number, index?: number) => void;
    setStepBlocks: (step: number, blocks: Block[]) => void;
    updateBlock: (step: number, blockId: string, updates: Partial<Block>) => void;
    addBlock: (step: number, block: Block, index?: number) => void;
    removeBlock: (step: number, blockId: string) => void;
    reorderBlocks: (step: number, blocks: Block[]) => void;
    markSaved: () => void;
    markModified: (step: string) => void;
    addValidationError: (error: ValidationError) => void;
    clearValidationErrors: (blockId?: string) => void;
    resetEditor: () => void;
    getStepBlocks: (step: number) => Block[];
    isStepDirty: (step: number) => boolean;
    // ===== CAMADA UNIFICADA (canonical) =====
    state: EditorState; // espelha o estado completo
    actions: {
        setCurrentStep: (step: number) => void;
        selectBlock: (blockId: string | null) => void;
        togglePreview: (enabled?: boolean) => void;
        toggleEditing: (enabled?: boolean) => void;
        toggleDrag: (enabled?: boolean) => void;
        copyBlock: (block: Block) => void;
        pasteBlock: (step: number, index?: number) => void;
        setStepBlocks: (step: number, blocks: Block[]) => void;
        updateBlock: (step: number, blockId: string, updates: Partial<Block>) => void;
        addBlock: (step: number, block: Block, index?: number) => void;
        removeBlock: (step: number, blockId: string) => void;
        reorderBlocks: (step: number, blocks: Block[]) => void;
        markSaved: () => void;
        markModified: (step: string) => void;
        addValidationError: (error: ValidationError) => void;
        clearValidationErrors: (blockId?: string) => void;
        resetEditor: () => void;
        getStepBlocks: (step: number) => Block[];
        isStepDirty: (step: number) => boolean;
    };
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const INITIAL_STATE: EditorState = {
    currentStep: 1,
    selectedBlockId: null,
    isPreviewMode: false,
    isEditing: false,
    dragEnabled: true,
    clipboardData: null,
    stepBlocks: {},
    dirtySteps: {},
    totalSteps: 21,
    validationErrors: [],
    isDirty: false,
    lastSaved: null,
    lastModified: null,
    modifiedSteps: {},
};

// ============================================================================
// REDUCER
// ============================================================================

function editorReducer(state: EditorState, action: EditorAction): EditorState {
    switch (action.type) {
        case 'SET_CURRENT_STEP':
            return { ...state, currentStep: action.payload };

        case 'SELECT_BLOCK':
            return { ...state, selectedBlockId: action.payload };

        case 'TOGGLE_PREVIEW':
            return {
                ...state,
                isPreviewMode: action.payload ?? !state.isPreviewMode,
            };

        case 'TOGGLE_EDITING':
            return {
                ...state,
                isEditing: action.payload ?? !state.isEditing,
            };

        case 'TOGGLE_DRAG':
            return {
                ...state,
                dragEnabled: action.payload ?? !state.dragEnabled,
            };

        case 'SET_CLIPBOARD':
            return { ...state, clipboardData: action.payload };

        case 'SET_STEP_BLOCKS':
            return {
                ...state,
                stepBlocks: {
                    ...state.stepBlocks,
                    [action.payload.step]: action.payload.blocks,
                },
            };

        case 'UPDATE_BLOCK': {
            const { step, blockId, updates } = action.payload;
            const blocks = state.stepBlocks[step] || [];
            const updatedBlocks = blocks.map(block =>
                block.id === blockId ? { ...block, ...updates } : block
            );

            return {
                ...state,
                stepBlocks: {
                    ...state.stepBlocks,
                    [step]: updatedBlocks,
                },
                dirtySteps: {
                    ...state.dirtySteps,
                    [step]: true,
                },
                isDirty: true,
                lastModified: Date.now(),
            };
        }

        case 'ADD_BLOCK': {
            const { step, block, index } = action.payload;
            const blocks = state.stepBlocks[step] || [];
            const newBlocks = [...blocks];

            if (index !== undefined && index >= 0 && index <= blocks.length) {
                newBlocks.splice(index, 0, block);
            } else {
                newBlocks.push(block);
            }

            // Recalcular order
            const reorderedBlocks = newBlocks.map((b, i) => ({ ...b, order: i }));

            return {
                ...state,
                stepBlocks: {
                    ...state.stepBlocks,
                    [step]: reorderedBlocks,
                },
                dirtySteps: {
                    ...state.dirtySteps,
                    [step]: true,
                },
                isDirty: true,
                lastModified: Date.now(),
                selectedBlockId: block.id,
            };
        }

        case 'REMOVE_BLOCK': {
            const { step, blockId } = action.payload;
            const blocks = state.stepBlocks[step] || [];
            const filteredBlocks = blocks.filter(b => b.id !== blockId);

            // Recalcular order
            const reorderedBlocks = filteredBlocks.map((b, i) => ({ ...b, order: i }));

            return {
                ...state,
                stepBlocks: {
                    ...state.stepBlocks,
                    [step]: reorderedBlocks,
                },
                dirtySteps: {
                    ...state.dirtySteps,
                    [step]: true,
                },
                isDirty: true,
                lastModified: Date.now(),
                selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId,
            };
        }

        case 'REORDER_BLOCKS': {
            const { step, blocks } = action.payload;

            // Garantir order correto
            const reorderedBlocks = blocks.map((b, i) => ({ ...b, order: i }));

            return {
                ...state,
                stepBlocks: {
                    ...state.stepBlocks,
                    [step]: reorderedBlocks,
                },
                dirtySteps: {
                    ...state.dirtySteps,
                    [step]: true,
                },
                isDirty: true,
                lastModified: Date.now(),
            };
        }

        case 'SET_DIRTY':
            return {
                ...state,
                dirtySteps: {
                    ...state.dirtySteps,
                    [action.payload.step]: action.payload.dirty,
                },
                isDirty: Object.values({
                    ...state.dirtySteps,
                    [action.payload.step]: action.payload.dirty,
                }).some(Boolean),
            };

        case 'MARK_SAVED':
            return {
                ...state,
                isDirty: false,
                dirtySteps: {},
                lastSaved: action.payload,
            };

        case 'MARK_MODIFIED':
            return {
                ...state,
                modifiedSteps: {
                    ...state.modifiedSteps,
                    [action.payload.step]: action.payload.timestamp,
                },
                lastModified: action.payload.timestamp,
            };

        case 'ADD_VALIDATION_ERROR':
            return {
                ...state,
                validationErrors: [...state.validationErrors, action.payload],
            };

        case 'CLEAR_VALIDATION_ERRORS':
            return {
                ...state,
                validationErrors: action.payload
                    ? state.validationErrors.filter(e => e.blockId !== action.payload)
                    : [],
            };

        case 'RESET_EDITOR':
            return INITIAL_STATE;

        default:
            return state;
    }
}

// ============================================================================
// CONTEXT
// ============================================================================

const EditorContext = createContext<EditorContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

interface EditorProviderProps {
    children: ReactNode;
    initialState?: Partial<EditorState>;
}

export const EditorStateProvider: React.FC<EditorProviderProps> = ({
    children,
    initialState,
}) => {
    const [state, dispatch] = useReducer(
        editorReducer,
        { ...INITIAL_STATE, ...initialState }
    );

    // ============================================================================
    // METHODS
    // ============================================================================

    const setCurrentStep = useCallback((step: number) => {
        dispatch({ type: 'SET_CURRENT_STEP', payload: step });
        appLogger.debug(`✏️ Step atual: ${step}`);
    }, []);

    const selectBlock = useCallback((blockId: string | null) => {
        dispatch({ type: 'SELECT_BLOCK', payload: blockId });
    }, []);

    const togglePreview = useCallback((enabled?: boolean) => {
        dispatch({ type: 'TOGGLE_PREVIEW', payload: enabled });
    }, []);

    const toggleEditing = useCallback((enabled?: boolean) => {
        dispatch({ type: 'TOGGLE_EDITING', payload: enabled });
    }, []);

    const toggleDrag = useCallback((enabled?: boolean) => {
        dispatch({ type: 'TOGGLE_DRAG', payload: enabled });
    }, []);

    const copyBlock = useCallback((block: Block) => {
        dispatch({ type: 'SET_CLIPBOARD', payload: block });
        appLogger.debug('📋 Bloco copiado:', block.id);
    }, []);

    const pasteBlock = useCallback((step: number, index?: number) => {
        if (state.clipboardData) {
            const newBlock = {
                ...state.clipboardData,
                id: `${state.clipboardData.id}-copy-${Date.now()}`,
            };
            dispatch({ type: 'ADD_BLOCK', payload: { step, block: newBlock, index } });
            appLogger.debug('📋 Bloco colado:', newBlock.id);
        }
    }, [state.clipboardData]);

    const setStepBlocks = useCallback((step: number, blocks: Block[]) => {
        dispatch({ type: 'SET_STEP_BLOCKS', payload: { step, blocks } });
    }, []);

    const updateBlock = useCallback((step: number, blockId: string, updates: Partial<Block>) => {
        dispatch({ type: 'UPDATE_BLOCK', payload: { step, blockId, updates } });
    }, []);

    const addBlock = useCallback((step: number, block: Block, index?: number) => {
        dispatch({ type: 'ADD_BLOCK', payload: { step, block, index } });
    }, []);

    const removeBlock = useCallback((step: number, blockId: string) => {
        dispatch({ type: 'REMOVE_BLOCK', payload: { step, blockId } });
    }, []);

    const reorderBlocks = useCallback((step: number, blocks: Block[]) => {
        dispatch({ type: 'REORDER_BLOCKS', payload: { step, blocks } });
    }, []);

    const markSaved = useCallback(() => {
        dispatch({ type: 'MARK_SAVED', payload: Date.now() });
        appLogger.info('💾 Editor marcado como salvo');
    }, []);

    const markModified = useCallback((step: string) => {
        dispatch({ type: 'MARK_MODIFIED', payload: { step, timestamp: Date.now() } });
    }, []);

    const addValidationError = useCallback((error: ValidationError) => {
        dispatch({ type: 'ADD_VALIDATION_ERROR', payload: error });
    }, []);

    const clearValidationErrors = useCallback((blockId?: string) => {
        dispatch({ type: 'CLEAR_VALIDATION_ERRORS', payload: blockId });
    }, []);

    const resetEditor = useCallback(() => {
        dispatch({ type: 'RESET_EDITOR' });
        appLogger.info('🔄 Editor resetado');
    }, []);

    const getStepBlocks = useCallback((step: number): Block[] => {
        return state.stepBlocks[step] || [];
    }, [state.stepBlocks]);

    const isStepDirty = useCallback((step: number): boolean => {
        return state.dirtySteps[step] || false;
    }, [state.dirtySteps]);

    // ============================================================================
    // EFFECTS
    // ============================================================================

    // Log performance metrics (dev only)
    useEffect(() => {
        if (import.meta.env.DEV) {
            const blockCount = Object.values(state.stepBlocks).reduce(
                (sum, blocks) => sum + blocks.length,
                0
            );

            appLogger.debug('✏️ Editor stats:', {
                currentStep: state.currentStep,
                totalBlocks: blockCount,
                dirtySteps: Object.keys(state.dirtySteps).filter(k => state.dirtySteps[parseInt(k)]).length,
                validationErrors: state.validationErrors.length,
            });
        }
    }, [state.currentStep, state.stepBlocks, state.dirtySteps, state.validationErrors]);

    // ============================================================================
    // CONTEXT VALUE
    // ============================================================================

    const contextValue = useMemo<EditorContextValue>(
        () => {
            // Agrupamento canonical de actions
            const actions = {
                setCurrentStep,
                selectBlock,
                togglePreview,
                toggleEditing,
                toggleDrag,
                copyBlock,
                pasteBlock,
                setStepBlocks,
                updateBlock,
                addBlock,
                removeBlock,
                reorderBlocks,
                markSaved,
                markModified,
                addValidationError,
                clearValidationErrors,
                resetEditor,
                getStepBlocks,
                isStepDirty,
            };
            return {
                ...state, // exposição flat (legado)
                ...actions, // métodos flat
                state, // acesso canonical state
                actions, // acesso canonical actions
            };
        },
        [
            state,
            setCurrentStep,
            selectBlock,
            togglePreview,
            toggleEditing,
            toggleDrag,
            copyBlock,
            pasteBlock,
            setStepBlocks,
            updateBlock,
            addBlock,
            removeBlock,
            reorderBlocks,
            markSaved,
            markModified,
            addValidationError,
            clearValidationErrors,
            resetEditor,
            getStepBlocks,
            isStepDirty,
        ]
    );

    return (
        <EditorContext.Provider value={contextValue}>
            {children}
        </EditorContext.Provider>
    );
};

// ============================================================================
// HOOK
// ============================================================================

export const useEditorState = (): EditorContextValue => {
    const context = useContext(EditorContext);

    if (!context) {
        throw new Error('useEditorState deve ser usado dentro de um EditorStateProvider');
    }

    return context;
};
