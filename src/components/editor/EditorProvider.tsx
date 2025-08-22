import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { Block } from '@/types/editor';
import { useHistoryState } from '@/hooks/useHistoryState';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { arrayMove } from '@dnd-kit/sortable';

export interface EditorState {
  stepBlocks: Record<string, Block[]>;
  currentStep: number;
  selectedBlockId: string | null;
}

export interface EditorActions {
  // State management
  setCurrentStep: (step: number) => void;
  setSelectedBlockId: (blockId: string | null) => void;
  
  // Block operations
  addBlock: (stepKey: string, block: Block) => void;
  removeBlock: (stepKey: string, blockId: string) => void;
  reorderBlocks: (stepKey: string, oldIndex: number, newIndex: number) => void;
  updateBlock: (stepKey: string, blockId: string, updates: Record<string, any>) => void;
  
  // History operations
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // Import/Export
  exportJSON: () => string;
  importJSON: (json: string) => void;
}

export interface EditorContextValue {
  state: EditorState;
  actions: EditorActions;
}

const EditorContext = createContext<EditorContextValue | undefined>(undefined);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

export interface EditorProviderProps {
  children: ReactNode;
  initial?: Partial<EditorState>;
  storageKey?: string;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({
  children,
  initial,
  storageKey = 'quiz-editor-state',
}) => {
  // Initialize state with template data
  const getInitialState = (): EditorState => {
    const initialBlocks: Record<string, Block[]> = {};
    Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach(([stepKey, blocks]) => {
      initialBlocks[stepKey] = Array.isArray(blocks) ? [...blocks] : [];
    });

    return {
      stepBlocks: initialBlocks,
      currentStep: 1,
      selectedBlockId: null,
      ...initial,
    };
  };

  const {
    present: state,
    setPresent: setState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistoryState<EditorState>(getInitialState(), {
    historyLimit: 50,
    storageKey,
    enablePersistence: true,
  });

  // Actions
  const setCurrentStep = useCallback((step: number) => {
    setState({
      ...state,
      currentStep: step,
      selectedBlockId: null, // Reset selection when changing steps
    });
  }, [state, setState]);

  const setSelectedBlockId = useCallback((blockId: string | null) => {
    setState({
      ...state,
      selectedBlockId: blockId,
    });
  }, [state, setState]);

  const addBlock = useCallback((stepKey: string, block: Block) => {
    setState({
      ...state,
      stepBlocks: {
        ...state.stepBlocks,
        [stepKey]: [...(state.stepBlocks[stepKey] || []), block],
      },
    });
  }, [state, setState]);

  const removeBlock = useCallback((stepKey: string, blockId: string) => {
    setState({
      ...state,
      stepBlocks: {
        ...state.stepBlocks,
        [stepKey]: (state.stepBlocks[stepKey] || []).filter(block => block.id !== blockId),
      },
      selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId,
    });
  }, [state, setState]);

  const reorderBlocks = useCallback((stepKey: string, oldIndex: number, newIndex: number) => {
    const blocks = [...(state.stepBlocks[stepKey] || [])];
    const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex);
    
    setState({
      ...state,
      stepBlocks: {
        ...state.stepBlocks,
        [stepKey]: reorderedBlocks,
      },
    });
  }, [state, setState]);

  const updateBlock = useCallback((stepKey: string, blockId: string, updates: Record<string, any>) => {
    setState({
      ...state,
      stepBlocks: {
        ...state.stepBlocks,
        [stepKey]: (state.stepBlocks[stepKey] || []).map(block =>
          block.id === blockId ? { ...block, ...updates } : block
        ),
      },
    });
  }, [state, setState]);

  const exportJSON = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importJSON = useCallback((json: string) => {
    try {
      const importedState = JSON.parse(json) as EditorState;
      setState(importedState);
    } catch (error) {
      console.error('Failed to import JSON:', error);
      throw new Error('Invalid JSON format');
    }
  }, [setState]);

  const actions: EditorActions = {
    setCurrentStep,
    setSelectedBlockId,
    addBlock,
    removeBlock,
    reorderBlocks,
    updateBlock,
    undo,
    redo,
    canUndo,
    canRedo,
    exportJSON,
    importJSON,
  };

  const contextValue: EditorContextValue = {
    state,
    actions,
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};