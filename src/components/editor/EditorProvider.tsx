import { useHistoryState } from '@/hooks/useHistoryState';
import { useEditorSupabase } from '@/hooks/useEditorSupabase';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { Block } from '@/types/editor';
import { arrayMove } from '@dnd-kit/sortable';
import React, { createContext, ReactNode, useCallback, useContext, useEffect } from 'react';
import { 
  groupSupabaseComponentsByStep, 
  mapBlockToSupabaseComponent, 
  extractStepNumberFromKey 
} from '@/utils/supabaseMapper';

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
  const editorSupabase = useEditorSupabase(
    enableSupabase ? funnelId : undefined,
    enableSupabase ? quizId : undefined
  );

  // Ensure state integrity - fix corrupted currentStep
  const state = {
    ...rawState,
    currentStep: rawState.currentStep || 1, // Default to step 1 if undefined
  };

  // Supabase functions
  const loadSupabaseComponents = useCallback(async () => {
    if (!enableSupabase || !editorSupabase) return;
    
    try {
      setState({
        ...state,
        isLoading: true,
      });
      await editorSupabase.loadComponents();
      
      // Convert Supabase components to stepBlocks format
      const groupedBlocks = groupSupabaseComponentsByStep(editorSupabase.components);
      
      setState({
        ...state,
        stepBlocks: { ...state.stepBlocks, ...groupedBlocks },
        isLoading: false,
      });
      
      console.log('✅ Components loaded from Supabase:', editorSupabase.components.length);
    } catch (error) {
      console.error('❌ Error loading Supabase components:', error);
      setState({
        ...state,
        isLoading: false,
      });
    }
  }, [enableSupabase, editorSupabase, state, setState]);

  // Load components from Supabase on mount if enabled
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
        ...state,
        currentStep: step,
        selectedBlockId: null, // Reset selection when changing steps
      });
    },
    [state, setState]
  );

  const setSelectedBlockId = useCallback(
    (blockId: string | null) => {
      setState({
        ...state,
        selectedBlockId: blockId,
      });
    },
    [state, setState]
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

      // If Supabase is enabled, sync with database
      if (state.isSupabaseEnabled && editorSupabase) {
        try {
          const stepNumber = extractStepNumberFromKey(stepKey);
          const supabaseData = mapBlockToSupabaseComponent(block, stepNumber, funnelId, quizId);
          
          // Add to Supabase with optimistic update
          const supabaseComponent = await editorSupabase.addComponent(
            supabaseData.component_type_key!,
            supabaseData.step_number!,
            supabaseData.properties,
            supabaseData.order_index
          );

          if (supabaseComponent) {
            // Update local state with server-generated data
            const updatedBlock = { ...block, id: supabaseComponent.id };
            setState({
              ...state,
              stepBlocks: {
                ...state.stepBlocks,
                [stepKey]: [...(state.stepBlocks[stepKey] || []), updatedBlock],
              },
              isLoading: false,
            });
            console.log('✅ Block synced with Supabase:', supabaseComponent.id);
          }
        } catch (error) {
          console.error('❌ Error syncing block with Supabase:', error);
          // Fallback to local-only update on error
          setState({
            ...state,
            stepBlocks: {
              ...state.stepBlocks,
              [stepKey]: [...(state.stepBlocks[stepKey] || []), block],
            },
          });
        }
      } else {
        // Local-only mode
        setState({
          ...state,
          stepBlocks: {
            ...state.stepBlocks,
            [stepKey]: [...(state.stepBlocks[stepKey] || []), block],
          },
        });
      }
      console.log(
        '✅ Block added to step:',
        stepKey,
        'Total blocks in step:',
        (state.stepBlocks[stepKey] || []).length + 1
      );
    },
    [state, setState, editorSupabase, funnelId, quizId]
  );

  const removeBlock = useCallback(
    (stepKey: string, blockId: string) => {
      setState({
        ...state,
        stepBlocks: {
          ...state.stepBlocks,
          [stepKey]: (state.stepBlocks[stepKey] || []).filter(block => block.id !== blockId),
        },
        selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId,
      });
    },
    [state, setState]
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
