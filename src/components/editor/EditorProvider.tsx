import { getBlocksForStep, mergeStepBlocks, normalizeStepBlocks } from '@/config/quizStepsComplete';
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
  addBlockAtIndex: (stepKey: string, block: Block, index: number) => Promise<void>;
  removeBlock: (stepKey: string, blockId: string) => Promise<void>;
  reorderBlocks: (stepKey: string, oldIndex: number, newIndex: number) => Promise<void>;
  updateBlock: (stepKey: string, blockId: string, updates: Record<string, any>) => Promise<void>;

  // Step loading
  ensureStepLoaded: (step: number | string) => Promise<void>;

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
    // Normalize step blocks from template using our new utility
    const normalizedBlocks = normalizeStepBlocks(QUIZ_STYLE_21_STEPS_TEMPLATE);

    Object.entries(normalizedBlocks).forEach(([stepKey, blocks]) => {
      initialBlocks[stepKey] = Array.isArray(blocks) ? [...blocks] : [];
    });

    const state: EditorState = {
      stepBlocks: initialBlocks,
      currentStep: 1,
      selectedBlockId: null,
      isSupabaseEnabled: enableSupabase,
      databaseMode: enableSupabase ? 'supabase' : 'local',
      isLoading: false,
      ...initial,
    };

    return state;
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
        // Normaliza e faz merge não-destrutivo por ID
        const merged = mergeStepBlocks(rawState.stepBlocks, grouped);
        setState({
          ...rawState,
          stepBlocks: merged,
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

  // Ensure step is loaded - check if step exists, if not fetch and merge
  const ensureStepLoaded = useCallback(
    async (step: number | string) => {
      const existingBlocks = getBlocksForStep(step, rawState.stepBlocks);

      if (existingBlocks && existingBlocks.length > 0) {
        return; // Step already loaded
      }

      try {
        // First try to fetch from Supabase if enabled
        if (state.isSupabaseEnabled && supabaseIntegration?.loadSupabaseComponents) {
          const comps = await supabaseIntegration.loadSupabaseComponents();
          const components = Array.isArray(comps) ? comps : (supabaseIntegration.components ?? []);
          if (components && components.length > 0) {
            const grouped = groupByStepKey(components);
            const merged = mergeStepBlocks(rawState.stepBlocks, grouped);
            setState({
              ...rawState,
              stepBlocks: merged,
            });
            return;
          }
        }

        // Fallback: Try to load from template service or use default templates
        const stepNum = typeof step === 'number' ? step : parseInt(String(step), 10);
        if (stepNum && QUIZ_STYLE_21_STEPS_TEMPLATE) {
          const stepKey = `step-${stepNum}`;
          const defaultBlocks = (QUIZ_STYLE_21_STEPS_TEMPLATE as any)[stepKey] || [];
          if (defaultBlocks.length > 0) {
            setState({
              ...rawState,
              stepBlocks: {
                ...rawState.stepBlocks,
                [stepKey]: defaultBlocks,
              },
            });
          }
        }
      } catch (error) {
        console.error('Failed to ensure step loaded:', error);
      }
    },
    [rawState, setState, state.isSupabaseEnabled, supabaseIntegration]
  );

  // Initialize step 1 automatically on mount and when template data is available
  useEffect(() => {
    // 🚨 CORREÇÃO CRÍTICA: Always force template reload on mount
    const normalizedBlocks = normalizeStepBlocks(QUIZ_STYLE_21_STEPS_TEMPLATE);
    console.log('🔧 FORCE RELOAD TEMPLATE:', {
      normalizedBlocks,
      keys: Object.keys(normalizedBlocks),
      totalSteps: Object.keys(normalizedBlocks).length,
    });

    // 🚨 FORÇA CARREGAMENTO: Aplicar template normalizado por merge não-destrutivo
    setState({
      ...rawState,
      stepBlocks: mergeStepBlocks(rawState.stepBlocks, normalizedBlocks),
      currentStep: 1,
    });

    // 🚨 GARANTIA DUPLA: Ensure step 1 is loaded on initialization
    setTimeout(() => {
      ensureStepLoaded(1);
      // Force verify all steps loaded
      for (let i = 1; i <= 21; i++) {
        ensureStepLoaded(i);
      }
    }, 100);
  }, []); // Empty dependency array - run only once on mount

  // 🚨 CORREÇÃO: Ensure step is loaded when currentStep changes
  useEffect(() => {
    if (rawState.currentStep) {
      ensureStepLoaded(rawState.currentStep);

      // 🚨 FORÇA VERIFICAÇÃO: If step blocks are empty, force reload template
      const currentStepBlocks = getBlocksForStep(rawState.currentStep, rawState.stepBlocks);
      if (!currentStepBlocks || currentStepBlocks.length === 0) {
        console.log('🚨 EMPTY STEP DETECTED - FORCE RELOAD:', rawState.currentStep);
        const normalizedBlocks = normalizeStepBlocks(QUIZ_STYLE_21_STEPS_TEMPLATE);
        setState({
          ...rawState,
          stepBlocks: mergeStepBlocks(rawState.stepBlocks, normalizedBlocks),
        });
      }
    }
  }, [rawState.currentStep, ensureStepLoaded]);

  // Actions (use functional setState to avoid races)
  const setCurrentStep = useCallback(
    (step: number) => {
      setState({
        ...rawState,
        currentStep: step,
        selectedBlockId: null,
      });
      // Ensure the new step is loaded
      ensureStepLoaded(step);
    },
    [setState, rawState, ensureStepLoaded]
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
      // Local mode: insert with real id immediately (no temp)
      const prevBlocks = rawState.stepBlocks[stepKey] ?? [];
      const optimisticStateLocal = {
        ...rawState,
        stepBlocks: {
          ...rawState.stepBlocks,
          [stepKey]: [...prevBlocks, block],
        },
      };
      setState(optimisticStateLocal);

      if (state.isSupabaseEnabled && supabaseIntegration?.addBlockToStep) {
        try {
          const created = await supabaseIntegration.addBlockToStep(block, stepNumber);
          // replace temp with real block returned by supabase (map shape to Block)
          if (created) {
            const realBlock = mapSupabaseRecordToBlock(created);
            setState({
              ...optimisticStateLocal,
              stepBlocks: {
                ...optimisticStateLocal.stepBlocks,
                [stepKey]: [...(optimisticStateLocal.stepBlocks[stepKey] || []), realBlock],
              },
            });
          } else {
            // If creation returned nothing, rollback
            setState(optimisticStateLocal);
            throw new Error('Supabase integration returned no created component');
          }
        } catch (err) {
          console.error('❌ addBlock supabase failed, rolling back optimistic update', err);
          // rollback to previous local state
          setState(rawState);
          throw err;
        }
      } else {
        // Local mode already applied optimistic update — nothing else to do
      }
    },
    [setState, state.isSupabaseEnabled, supabaseIntegration, rawState]
  );

  const addBlockAtIndex = useCallback(
    async (stepKey: string, block: Block, index: number) => {
      const stepNumber = extractStepNumberFromKey(stepKey) || 0;
      const prevBlocks = rawState.stepBlocks[stepKey] ?? [];
      const clampedIndex = Math.max(0, Math.min(index, prevBlocks.length));
      const nextBlocks = [...prevBlocks];
      nextBlocks.splice(clampedIndex, 0, block);

      const optimisticState = {
        ...rawState,
        stepBlocks: {
          ...rawState.stepBlocks,
          [stepKey]: nextBlocks,
        },
      };
      setState(optimisticState);

      if (state.isSupabaseEnabled && supabaseIntegration?.addBlockToStep) {
        try {
          const created = await supabaseIntegration.addBlockToStep(block, stepNumber);
          if (created) {
            const realBlock = mapSupabaseRecordToBlock(created);
            setState({
              ...optimisticState,
              stepBlocks: {
                ...optimisticState.stepBlocks,
                [stepKey]: (optimisticState.stepBlocks[stepKey] || []).concat([realBlock]),
              },
            });
          } else {
            // rollback if nothing returned
            setState({
              ...optimisticState,
              stepBlocks: {
                ...optimisticState.stepBlocks,
                [stepKey]: (optimisticState.stepBlocks[stepKey] || []).filter(
                  b => b.id !== block.id
                ),
              },
            });
            throw new Error('Supabase integration returned no created component');
          }
        } catch (err) {
          console.error('❌ addBlockAtIndex supabase failed, rolling back optimistic update', err);
          // rollback optimistic insert
          setState({
            ...optimisticState,
            stepBlocks: {
              ...optimisticState.stepBlocks,
              [stepKey]: (optimisticState.stepBlocks[stepKey] || []).filter(b => b.id !== block.id),
            },
          });
          throw err;
        }
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
      const blocks = [...(rawState.stepBlocks[stepKey] || [])];
      const reordered = arrayMove(blocks, oldIndex, newIndex);
      setState({
        ...rawState,
        stepBlocks: {
          ...rawState.stepBlocks,
          [stepKey]: reordered,
        },
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
    [setState, state.isSupabaseEnabled, supabaseIntegration, rawState]
  );

  const updateBlock = useCallback(
    async (stepKey: string, blockId: string, updates: Record<string, any>) => {
      // Sempre mesclar alterações em properties por padrão.
      // Se o payload já vier com { properties }, respeitar e mesclar também.
      const nextBlocks = (rawState.stepBlocks[stepKey] || []).map(b => {
        if (b.id !== blockId) return b;
        const incomingProps = updates.properties ?? updates;
        const mergedProps = { ...(b.properties || {}), ...(incomingProps || {}) };
        return { ...b, properties: mergedProps };
      });

      const nextState = {
        ...rawState,
        stepBlocks: {
          ...rawState.stepBlocks,
          [stepKey]: nextBlocks,
        },
      };
      setState(nextState);

      if (state.isSupabaseEnabled && supabaseIntegration?.updateBlockById) {
        try {
          const updated = nextBlocks.find(b => b.id === blockId);
          await supabaseIntegration.updateBlockById(blockId, { properties: updated?.properties });
        } catch (err) {
          console.error('Failed to update block in supabase', err);
        }
      }
    },
    [setState, state.isSupabaseEnabled, supabaseIntegration, rawState]
  );

  const exportJSON = useCallback(() => {
    // Normalize step keys to canonical format step-<n>
    const normalizedStepBlocks: Record<string, Block[]> = {};
    Object.entries(state.stepBlocks).forEach(([key, blocks]) => {
      const match = key.match(/(\d+)/);
      if (match) {
        const stepNumber = match[1];
        const normalizedKey = `step-${stepNumber}`;
        normalizedStepBlocks[normalizedKey] = blocks;
      } else {
        normalizedStepBlocks[key] = blocks;
      }
    });

    // Validate Question components and ResultBlock outcomes
    const warnings: string[] = [];
    Object.entries(normalizedStepBlocks).forEach(([stepKey, blocks]) => {
      blocks.forEach((block) => {
        // Validate Question components have required props
        if (block.type === 'Question' || block.type === 'options-grid') {
          const options = block.props?.options;
          if (!Array.isArray(options) || options.length === 0) {
            warnings.push(`${stepKey}: Question component missing options array`);
          } else {
            options.forEach((option: any, index: number) => {
              if (!option.value) {
                warnings.push(`${stepKey}: Question option ${index} missing value property`);
              }
            });
          }
        }
        
        // Validate ResultBlock outcomeMapping references
        if (block.type === 'ResultBlock' || block.type === 'result-header-inline') {
          const outcomeMapping = block.props?.outcomeMapping;
          if (outcomeMapping && typeof outcomeMapping === 'object') {
            Object.values(outcomeMapping).forEach((outcomeId: any) => {
              // Check if outcome exists in schema_json (basic validation)
              const outcomeExists = Object.values(normalizedStepBlocks).some(stepBlocks =>
                stepBlocks.some(b => b.id === outcomeId || b.props?.outcomeId === outcomeId)
              );
              if (!outcomeExists) {
                warnings.push(`${stepKey}: ResultBlock references undefined outcome: ${outcomeId}`);
              }
            });
          }
        }
      });
    });

    // Log warnings if any (non-blocking)
    if (warnings.length > 0) {
      console.warn('Export validation warnings:', warnings);
    }

    // Create simple hash for schema consistency
    const schemaHash = JSON.stringify(normalizedStepBlocks).length.toString(36);
    
    const exportData = {
      ...state,
      stepBlocks: normalizedStepBlocks,
      metadata: {
        engineVersion: '1.0.0',
        schemaHash,
        exportDate: new Date().toISOString(),
        validationWarnings: warnings
      }
    };

    return JSON.stringify(exportData, null, 2);
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
    addBlockAtIndex,
    removeBlock,
    reorderBlocks,
    updateBlock,
    ensureStepLoaded,
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
