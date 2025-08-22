import { useEditorSupabaseIntegration } from '@/hooks/useEditorSupabaseIntegration';
import { useHistoryState } from '@/hooks/useHistoryState';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { Block } from '@/types/editor';
import {
  extractStepNumberFromKey,
} from '@/utils/supabaseMapper';
import { arrayMove } from '@dnd-kit/sortable';
import React, { createContext, ReactNode, useCallback, useContext } from 'react';

export interface EditorState {
  stepBlocks: Record<string, Block[]>;
  currentStep: number;
  selectedBlockId: string | null;
  // Supabase integration state
  isSupabaseEnabled: boolean;
  databaseMode: 'local' | 'supabase';
  isLoading: boolean;
}

export interface EditorActions {
  // State management
  setCurrentStep: (step: number) => void;
  setSelectedBlockId: (blockId: string | null) => void;

  // Block operations
  addBlock: (stepKey: string, block: Block) => Promise<void>;
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

  // Supabase operations
  loadSupabaseComponents?: () => Promise<void>;
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
  // Supabase configuration
  funnelId?: string;
  quizId?: string;
  enableSupabase?: boolean;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({
  children,
  initial,
  storageKey = 'quiz-editor-state',
  funnelId,
  quizId,
  enableSupabase = false,
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
      isSupabaseEnabled: enableSupabase,
      databaseMode: enableSupabase ? 'supabase' : 'local',
      isLoading: false,
      ...initial,
    };
  };

  const {
    present: rawState,
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

  // Initialize Supabase integration if enabled
  const supabaseIntegration = useEditorSupabaseIntegration(
    setState,
    rawState,
    enableSupabase ? funnelId : undefined,
    enableSupabase ? quizId : undefined
  );

  // Ensure state integrity - fix corrupted currentStep
  const state = {
    ...rawState,
    currentStep: rawState.currentStep || 1, // Default to step 1 if undefined
  };

    // Ensure state integrity - fix corrupted currentStep
  const state = {
    ...rawState,
    currentStep: rawState.currentStep || 1, // Default to step 1 if undefined
    isSupabaseEnabled: supabaseIntegration.isSupabaseEnabled,
    databaseMode: supabaseIntegration.isSupabaseEnabled ? 'supabase' : 'local',
  };  // Load components from Supabase on mount if enabled
  useEffect(() => {
    if (enableSupabase && (funnelId || quizId)) {
      console.log('🔄 Loading components from Supabase...');
      loadSupabaseComponents();
    }
  }, [enableSupabase, funnelId, quizId, loadSupabaseComponents]);

  // Actions
  const setCurrentStep = useCallback(
    (step: number) => {
      setState({
        ...rawState,
        currentStep: step,
        selectedBlockId: null, // Reset selection when changing steps
      });
    },
    [rawState, setState]
  );

  const setSelectedBlockId = useCallback(
    (blockId: string | null) => {
      setState({
        ...rawState,
        selectedBlockId: blockId,
      });
    },
    [rawState, setState]
  );

  const addBlock = useCallback(
    async (stepKey: string, block: Block) => {
      console.log('🔧 EditorProvider.addBlock:', {
        stepKey,
        blockId: block.id,
        blockType: block.type,
        databaseMode: state.databaseMode,
        isSupabaseEnabled: state.isSupabaseEnabled,
      });

      // If Supabase is enabled, use optimistic update pattern
      if (state.isSupabaseEnabled && editorSupabase) {
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const tempBlock = { ...block, id: tempId };
        
        // 1. Optimistic update - Add immediately to UI
        setState({
          ...rawState,
          stepBlocks: {
            ...rawState.stepBlocks,
            [stepKey]: [...(rawState.stepBlocks[stepKey] || []), tempBlock],
          },
          isLoading: true,
        });

        try {
          const stepNumber = extractStepNumberFromKey(stepKey);
          const supabaseData = mapBlockToSupabaseComponent(block, stepNumber, funnelId, quizId);
          
          // 2. Persist to Supabase
          const supabaseComponent = await editorSupabase.addComponent(
            supabaseData.component_type_key!,
            supabaseData.step_number!,
            supabaseData.properties,
            supabaseData.order_index
          );

          if (supabaseComponent) {
            // 3. Replace temp block with real data from server
            const realBlock = { ...block, id: supabaseComponent.id };
            const currentBlocks = rawState.stepBlocks[stepKey] || [];
            setState({
              ...rawState,
              stepBlocks: {
                ...rawState.stepBlocks,
                [stepKey]: currentBlocks.map(b => 
                  b.id === tempId ? realBlock : b
                ),
              },
              isLoading: false,
            });
            console.log('✅ Block synced with Supabase:', supabaseComponent.id);
          } else {
            throw new Error('Supabase addComponent returned null');
          }
        } catch (error) {
          console.error('❌ Error syncing block with Supabase, rolling back:', error);
          
          // 4. Rollback optimistic update on error
          const currentBlocks = rawState.stepBlocks[stepKey] || [];
          setState({
            ...rawState,
            stepBlocks: {
              ...rawState.stepBlocks,
              [stepKey]: currentBlocks.filter(b => b.id !== tempId),
            },
            isLoading: false,
          });
          
          // Show error feedback but don't throw to prevent UI crashes
          console.error('Block addition failed, rolled back optimistic update');
        }
      } else {
        // Local-only mode - simple append
        setState({
          ...rawState,
          stepBlocks: {
            ...rawState.stepBlocks,
            [stepKey]: [...(rawState.stepBlocks[stepKey] || []), block],
          },
        });
      }
      
      console.log(
        '✅ Block added to step:',
        stepKey,
        'New total blocks in step:',
        (rawState.stepBlocks[stepKey] || []).length + 1
      );
    },
    [rawState, setState, editorSupabase, funnelId, quizId, state.databaseMode, state.isSupabaseEnabled]
  );

  const removeBlock = useCallback(
    (stepKey: string, blockId: string) => {
      setState({
        ...rawState,
        stepBlocks: {
          ...rawState.stepBlocks,
          [stepKey]: (rawState.stepBlocks[stepKey] || []).filter(block => block.id !== blockId),
        },
        selectedBlockId: rawState.selectedBlockId === blockId ? null : rawState.selectedBlockId,
      });
    },
    [rawState, setState]
  );

  const reorderBlocks = useCallback(
    (stepKey: string, oldIndex: number, newIndex: number) => {
      const blocks = [...(state.stepBlocks[stepKey] || [])];
      const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex);

      setState({
        ...state,
        stepBlocks: {
          ...state.stepBlocks,
          [stepKey]: reorderedBlocks,
        },
      });
    },
    [state, setState]
  );

  const updateBlock = useCallback(
    (stepKey: string, blockId: string, updates: Record<string, any>) => {
      setState({
        ...state,
        stepBlocks: {
          ...state.stepBlocks,
          [stepKey]: (state.stepBlocks[stepKey] || []).map(block =>
            block.id === blockId ? { ...block, ...updates } : block
          ),
        },
      });
    },
    [state, setState]
  );

  const exportJSON = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importJSON = useCallback(
    (json: string) => {
      try {
        const importedState = JSON.parse(json) as EditorState;
        setState(importedState);
      } catch (error) {
        console.error('Failed to import JSON:', error);
        throw new Error('Invalid JSON format');
      }
    },
    [setState]
  );

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
    loadSupabaseComponents,
  };

  const contextValue: EditorContextValue = {
    state,
    actions,
  };

  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>;
};
