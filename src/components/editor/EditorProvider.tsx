import { useEditorSupabaseIntegration } from '@/hooks/useEditorSupabaseIntegration';
import { useHistoryState } from '@/hooks/useHistoryState';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { Block } from '@/types/editor';
import { extractStepNumberFromKey } from '@/utils/supabaseMapper';
import { arrayMove } from '@dnd-kit/sortable';
import React, { createContext, ReactNode, useCallback, useContext, useEffect } from 'react';

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
  removeBlock: (stepKey: string, blockId: string) => Promise<void>;
  reorderBlocks: (stepKey: string, oldIndex: number, newIndex: number) => Promise<void>;
  updateBlock: (stepKey: string, blockId: string, updates: Record<string, any>) => Promise<void>;

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

const mapSupabaseRecordToBlock = (c: any): Block => ({
  id: c.id,
  type: c.component_type_key || c.type || 'text',
  order: c.order_index ?? 0,
  content: c.properties?.content ?? {},
  properties: c.properties ?? {},
});

const groupByStepKey = (components: any[]): Record<string, Block[]> =>
  components.reduce<Record<string, Block[]>>((acc, comp) => {
    const stepNumber = Number(comp.step_number ?? comp.stepNumber ?? 0) || 0;
    const key = `step-${stepNumber}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(mapSupabaseRecordToBlock(comp));
    return acc;
  }, {});

export const EditorProvider: React.FC<EditorProviderProps> = ({
  children,
  initial,
  storageKey = 'quiz-editor-state',
  funnelId,
  quizId,
  enableSupabase = false,
}) => {
  // Build initial state from template
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

  // Wire supabase integration hook (it may return helpers and flags)
  const supabaseIntegration: any = useEditorSupabaseIntegration(
    setState,
    rawState,
    enableSupabase ? funnelId : undefined,
    enableSupabase ? quizId : undefined
  );

  // Compose derived state (ensure defaults)
  const state: EditorState = {
    ...rawState,
    currentStep: rawState.currentStep || 1,
    isSupabaseEnabled: supabaseIntegration?.isSupabaseEnabled ?? !!enableSupabase,
    databaseMode: supabaseIntegration?.isSupabaseEnabled
      ? 'supabase'
      : (rawState.databaseMode ?? (enableSupabase ? 'supabase' : 'local')),
  };

  // Load components from Supabase when integration becomes available / config changes
  const loadSupabaseComponents = useCallback(async () => {
    if (!supabaseIntegration || !supabaseIntegration.loadSupabaseComponents) return;
    try {
      const comps = await supabaseIntegration.loadSupabaseComponents();
      // Accept either returned list or fallback to internal property
      const components = Array.isArray(comps) ? comps : (supabaseIntegration.components ?? []);
      if (components && components.length > 0) {
        const grouped = groupByStepKey(components);
        setState({
          ...rawState,
          stepBlocks: {
            ...rawState.stepBlocks,
            ...grouped,
          },
        });
      }
    } catch (err) {
      console.error('EditorProvider: failed to load supabase components', err);
    }
  }, [supabaseIntegration, setState, rawState]);

  useEffect(() => {
    if (enableSupabase) {
      loadSupabaseComponents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableSupabase, funnelId, quizId]);

  // Actions (use functional setState to avoid races)
  const setCurrentStep = useCallback(
    (step: number) => {
      setState({
        ...rawState,
        currentStep: step,
        selectedBlockId: null,
      });
    },
    [setState, rawState]
  );

  const setSelectedBlockId = useCallback(
    (blockId: string | null) => {
      setState({
        ...rawState,
        selectedBlockId: blockId,
      });
    },
    [setState, rawState]
  );

  const addBlock = useCallback(
    async (stepKey: string, block: Block) => {
      const stepNumber = extractStepNumberFromKey(stepKey) || 0;
      console.log(
        '🔄 EditorProvider.addBlock:',
        block.type,
        '->',
        stepKey,
        '(stepNumber:',
        stepNumber,
        ')'
      );

      // Optimistic update helper: insert temp block locally
      const tempId = `temp-${Date.now()}`;
      const optimisticBlock: Block = { ...block, id: tempId };

      // Apply optimistic update
      const prevBlocks = rawState.stepBlocks[stepKey] ?? [];
      const optimisticState = {
        ...rawState,
        stepBlocks: {
          ...rawState.stepBlocks,
          [stepKey]: [...prevBlocks, optimisticBlock],
        },
      };
      setState(optimisticState);

      if (state.isSupabaseEnabled && supabaseIntegration?.addBlockToStep) {
        try {
          const created = await supabaseIntegration.addBlockToStep(block, stepNumber);
          // replace temp with real block returned by supabase (map shape to Block)
          if (created) {
            const realBlock = mapSupabaseRecordToBlock(created);
            setState({
              ...optimisticState,
              stepBlocks: {
                ...optimisticState.stepBlocks,
                [stepKey]: (optimisticState.stepBlocks[stepKey] || []).map(b =>
                  b.id === tempId ? realBlock : b
                ),
              },
            });
          } else {
            // If creation returned nothing, rollback
            setState({
              ...optimisticState,
              stepBlocks: {
                ...optimisticState.stepBlocks,
                [stepKey]: (optimisticState.stepBlocks[stepKey] || []).filter(b => b.id !== tempId),
              },
            });
            throw new Error('Supabase integration returned no created component');
          }
        } catch (err) {
          console.error('❌ addBlock supabase failed, rolling back optimistic update', err);
          // rollback optimistic insert
          setState({
            ...optimisticState,
            stepBlocks: {
              ...optimisticState.stepBlocks,
              [stepKey]: (optimisticState.stepBlocks[stepKey] || []).filter(b => b.id !== tempId),
            },
          });
          throw err;
        }
      } else {
        // Local mode already applied optimistic update — nothing else to do
      }
    },
    [setState, state.isSupabaseEnabled, supabaseIntegration, rawState]
  );

  const removeBlock = useCallback(
    async (stepKey: string, blockId: string) => {
      setState({
        ...rawState,
        stepBlocks: {
          ...rawState.stepBlocks,
          [stepKey]: (rawState.stepBlocks[stepKey] || []).filter(b => b.id !== blockId),
        },
        selectedBlockId: rawState.selectedBlockId === blockId ? null : rawState.selectedBlockId,
      });

      // If supabase mode, delegate deletion
      if (state.isSupabaseEnabled && supabaseIntegration?.deleteBlockById) {
        try {
          await supabaseIntegration.deleteBlockById(blockId);
        } catch (err) {
          console.error('Failed to delete block in supabase, consider reloading state', err);
        }
      }
    },
    [setState, state.isSupabaseEnabled, supabaseIntegration, rawState]
  );

  const reorderBlocks = useCallback(
    async (stepKey: string, oldIndex: number, newIndex: number) => {
      setState((prev: EditorState) => {
        const blocks = [...(prev.stepBlocks[stepKey] || [])];
        const reordered = arrayMove(blocks, oldIndex, newIndex);
        return {
          ...prev,
          stepBlocks: {
            ...prev.stepBlocks,
            [stepKey]: reordered,
          },
        };
      });

      // Persist order to Supabase if enabled (delegate if available)
      if (state.isSupabaseEnabled && supabaseIntegration?.reorderBlocksForStep) {
        try {
          const stepNumber = extractStepNumberFromKey(stepKey) || 0;
          await supabaseIntegration.reorderBlocksForStep(stepNumber);
        } catch (err) {
          console.error('Failed to persist reorder to supabase', err);
        }
      }
    },
    [setState, state.isSupabaseEnabled, supabaseIntegration]
  );

  const updateBlock = useCallback(
    async (stepKey: string, blockId: string, updates: Record<string, any>) => {
      setState((prev: EditorState) => ({
        ...prev,
        stepBlocks: {
          ...prev.stepBlocks,
          [stepKey]: (prev.stepBlocks[stepKey] || []).map(b =>
            b.id === blockId ? { ...b, ...updates } : b
          ),
        },
      }));

      if (state.isSupabaseEnabled && supabaseIntegration?.updateBlockById) {
        try {
          await supabaseIntegration.updateBlockById(blockId, updates);
        } catch (err) {
          console.error('Failed to update block in supabase', err);
        }
      }
    },
    [setState, state.isSupabaseEnabled, supabaseIntegration]
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
