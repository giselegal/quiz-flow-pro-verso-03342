import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import type {
  AnalyticsEvent,
  Block,
  BlockProperties,
  BlockType,
  CalculationResult,
  EditorAction,
  EditorActions,
  EditorComputed,
  EditorConfig,
  EditorMode,
  EditorState,
  QuizAnswer,
  UseEditorReturn,
} from './types';

// ===== INITIAL STATE =====

const initialState: EditorState = {
  currentStep: 1,
  selectedBlockId: null,
  blocks: {},
  mode: 'edit',
  isLoading: false,
  hasUnsavedChanges: false,
  lastSaved: undefined,
};

// ===== REDUCER =====

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: Math.max(1, Math.min(action.payload, 21)),
      };

    case 'SET_SELECTED_BLOCK':
      return {
        ...state,
        selectedBlockId: action.payload,
      };

    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'ADD_BLOCK': {
      const { stepKey, block } = action.payload;
      const currentBlocks = state.blocks[stepKey] || [];

      return {
        ...state,
        blocks: {
          ...state.blocks,
          [stepKey]: [...currentBlocks, block],
        },
        selectedBlockId: block.id,
        hasUnsavedChanges: true,
      };
    }

    case 'UPDATE_BLOCK': {
      const { stepKey, blockId, updates } = action.payload;
      const currentBlocks = state.blocks[stepKey] || [];

      return {
        ...state,
        blocks: {
          ...state.blocks,
          [stepKey]: currentBlocks.map(block =>
            block.id === blockId ? { ...block, ...updates } : block
          ),
        },
        hasUnsavedChanges: true,
      };
    }

    case 'DELETE_BLOCK': {
      const { stepKey, blockId } = action.payload;
      const currentBlocks = state.blocks[stepKey] || [];

      return {
        ...state,
        blocks: {
          ...state.blocks,
          [stepKey]: currentBlocks.filter(block => block.id !== blockId),
        },
        selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId,
        hasUnsavedChanges: true,
      };
    }

    case 'REORDER_BLOCKS': {
      const { stepKey, blockIds } = action.payload;
      const currentBlocks = state.blocks[stepKey] || [];
      const reorderedBlocks = blockIds
        .map((id: string) => currentBlocks.find(block => block.id === id))
        .filter(Boolean);

      return {
        ...state,
        blocks: {
          ...state.blocks,
          [stepKey]: reorderedBlocks,
        },
        hasUnsavedChanges: true,
      };
    }

    case 'LOAD_DATA':
      return {
        ...state,
        ...action.payload,
        hasUnsavedChanges: false,
        lastSaved: new Date(),
      };

    case 'SAVE_SUCCESS':
      return {
        ...state,
        hasUnsavedChanges: false,
        lastSaved: new Date(),
      };

    case 'RESET':
      return {
        ...initialState,
      };

    default:
      return state;
  }
}

// ===== CONTEXT =====

interface EditorContextValue extends UseEditorReturn {
  config: EditorConfig;
}

const EditorContext = createContext<EditorContextValue | undefined>(undefined);

// ===== PROVIDER =====

interface UnifiedEditorProviderProps {
  children: React.ReactNode;
  config?: Partial<EditorConfig>;
  funnelId?: string;
  initialData?: Partial<EditorState>;
  onSave?: (data: EditorState) => Promise<void>;
  onCalculate?: (answers: QuizAnswer[]) => Promise<CalculationResult>;
  onAnalytics?: (event: AnalyticsEvent) => Promise<void>;
}

export const UnifiedEditorProvider: React.FC<UnifiedEditorProviderProps> = ({
  children,
  config: configProp = {},
  funnelId,
  initialData = {},
  onSave,
  onCalculate,
  onAnalytics,
}) => {
  // Log para debug
  console.log('🔧 UnifiedEditorProvider inicializando com:', {
    funnelId,
    initialData,
    hasInitialBlocks: !!initialData.blocks,
  });

  const [state, dispatch] = useReducer(editorReducer, {
    ...initialState,
    ...initialData,
  });

  console.log('📊 Estado inicial do provider:', state);

  const config: EditorConfig = {
    showToolbar: true,
    showStages: true,
    showComponents: true,
    showProperties: true,
    enableAnalytics: true,
    enableAutoSave: true,
    autoSaveInterval: 30000, // 30 seconds
    enableDragDrop: true,
    enablePreview: true,
    ...configProp,
  };

  // ===== COMPUTED VALUES =====

  const computed: EditorComputed = React.useMemo(() => {
    const currentStepKey = `step_${state.currentStep}`;
    const currentStepBlocks = state.blocks[currentStepKey] || [];
    const selectedBlock = state.selectedBlockId
      ? currentStepBlocks.find(block => block.id === state.selectedBlockId) || null
      : null;

    const totalBlocks = Object.values(state.blocks).reduce(
      (total, blocks) => total + blocks.length,
      0
    );

    return {
      currentStep: state.currentStep,
      currentStepBlocks,
      selectedBlock,
      totalBlocks,
      hasUnsavedChanges: state.hasUnsavedChanges,
      canGoNext: state.currentStep < 21,
      canGoPrevious: state.currentStep > 1,
      progress: (state.currentStep / 21) * 100,
    };
  }, [state]);

  // ===== ACTIONS =====

  const actions: EditorActions = React.useMemo(
    () => ({
      // Step management
      setCurrentStep: (step: number) => {
        dispatch({ type: 'SET_CURRENT_STEP', payload: step });
        trackEvent({ event: 'step_changed', properties: { step } });
      },

      nextStep: () => {
        if (computed.canGoNext) {
          actions.setCurrentStep(state.currentStep + 1);
        }
      },

      previousStep: () => {
        if (computed.canGoPrevious) {
          actions.setCurrentStep(state.currentStep - 1);
        }
      },

      // Block management
      addBlock: async (type: BlockType, properties: BlockProperties = {}) => {
        const blockId = `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const stepKey = `step_${state.currentStep}`;

        const newBlock: Block = {
          id: blockId,
          type,
          properties,
          order: computed.currentStepBlocks.length,
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
          },
        };

        dispatch({
          type: 'ADD_BLOCK',
          payload: { stepKey, block: newBlock },
          meta: { timestamp: new Date(), step: state.currentStep },
        });

        await trackEvent({
          event: 'block_added',
          properties: { type, step: state.currentStep, blockId },
        });

        return blockId;
      },

      updateBlock: async (blockId: string, updates: Partial<Block>) => {
        const stepKey = `step_${state.currentStep}`;

        const updatedBlock = {
          ...updates,
          metadata: {
            ...updates.metadata,
            updatedAt: new Date(),
            version: (updates.metadata?.version || 1) + 1,
          },
        };

        dispatch({
          type: 'UPDATE_BLOCK',
          payload: { stepKey, blockId, updates: updatedBlock },
          meta: { timestamp: new Date(), step: state.currentStep },
        });

        await trackEvent({
          event: 'block_updated',
          properties: { blockId, step: state.currentStep },
        });
      },

      deleteBlock: async (blockId: string) => {
        const stepKey = `step_${state.currentStep}`;

        dispatch({
          type: 'DELETE_BLOCK',
          payload: { stepKey, blockId },
          meta: { timestamp: new Date(), step: state.currentStep },
        });

        await trackEvent({
          event: 'block_deleted',
          properties: { blockId, step: state.currentStep },
        });
      },

      selectBlock: (blockId: string | null) => {
        dispatch({ type: 'SET_SELECTED_BLOCK', payload: blockId });

        if (blockId) {
          trackEvent({
            event: 'block_selected',
            properties: { blockId, step: state.currentStep },
          });
        }
      },

      reorderBlocks: async (blockIds: string[]) => {
        const stepKey = `step_${state.currentStep}`;

        dispatch({
          type: 'REORDER_BLOCKS',
          payload: { stepKey, blockIds },
          meta: { timestamp: new Date(), step: state.currentStep },
        });

        await trackEvent({
          event: 'blocks_reordered',
          properties: { count: blockIds.length, step: state.currentStep },
        });
      },

      // State management
      setMode: (mode: EditorMode) => {
        dispatch({ type: 'SET_MODE', payload: mode });
        trackEvent({ event: 'mode_changed', properties: { mode } });
      },

      save: async () => {
        if (onSave) {
          dispatch({ type: 'SET_LOADING', payload: true });

          try {
            await onSave(state);
            dispatch({ type: 'SAVE_SUCCESS' });

            await trackEvent({
              event: 'data_saved',
              properties: { funnelId, totalBlocks: computed.totalBlocks },
            });
          } catch (error) {
            console.error('Erro ao salvar:', error);
            await trackEvent({
              event: 'save_error',
              properties: { error: error instanceof Error ? error.message : 'Unknown error' },
            });
          } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        }
      },

      load: async (data: any) => {
        dispatch({ type: 'SET_LOADING', payload: true });

        try {
          dispatch({ type: 'LOAD_DATA', payload: data });

          await trackEvent({
            event: 'data_loaded',
            properties: { funnelId },
          });
        } catch (error) {
          console.error('Erro ao carregar:', error);
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      },

      reset: () => {
        dispatch({ type: 'RESET' });
        trackEvent({ event: 'editor_reset' });
      },

      // Calculations
      calculateResults: async () => {
        if (onCalculate) {
          dispatch({ type: 'SET_LOADING', payload: true });

          try {
            // Extract quiz answers from blocks
            const answers: QuizAnswer[] = []; // TODO: Implement extraction logic

            const results = await onCalculate(answers);

            await trackEvent({
              event: 'calculation_completed',
              properties: {
                primaryStyle: results.styleProfile.primaryStyle.style,
                confidence: results.styleProfile.confidence,
              },
            });

            return results;
          } catch (error) {
            console.error('Erro no cálculo:', error);

            await trackEvent({
              event: 'calculation_error',
              properties: { error: error instanceof Error ? error.message : 'Unknown error' },
            });

            throw error;
          } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        }

        throw new Error('Callback de cálculo não fornecido');
      },

      // Analytics
      trackEvent: async (event: AnalyticsEvent) => {
        if (config.enableAnalytics && onAnalytics) {
          try {
            await onAnalytics({
              ...event,
              timestamp: event.timestamp || new Date(),
            });
          } catch (error) {
            console.warn('Erro ao enviar analytics:', error);
          }
        }
      },
    }),
    [state, computed, config, onSave, onCalculate, onAnalytics, funnelId]
  );

  // Helper function for tracking events
  const trackEvent = useCallback(
    (event: Omit<AnalyticsEvent, 'timestamp'>) => {
      return actions.trackEvent(event);
    },
    [actions]
  );

  // ===== AUTO SAVE =====

  useEffect(() => {
    if (config.enableAutoSave && state.hasUnsavedChanges) {
      const autoSaveTimer = setTimeout(() => {
        actions.save().catch(console.error);
      }, config.autoSaveInterval);

      return () => clearTimeout(autoSaveTimer);
    }
  }, [state.hasUnsavedChanges, config.enableAutoSave, config.autoSaveInterval, actions]);

  // ===== CONTEXT VALUE =====

  const contextValue: EditorContextValue = React.useMemo(
    () => ({
      state,
      actions,
      computed,
      config,
    }),
    [state, actions, computed, config]
  );

  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>;
};

// ===== HOOK =====

export const useUnifiedEditor = (): EditorContextValue => {
  const context = useContext(EditorContext);

  if (!context) {
    throw new Error('useUnifiedEditor must be used within a UnifiedEditorProvider');
  }

  return context;
};

// ===== EXPORTS =====

export default UnifiedEditorProvider;
export { EditorContext };
export type { EditorContextValue, UnifiedEditorProviderProps };
