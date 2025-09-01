import { getBlocksForStep, mergeStepBlocks, normalizeStepBlocks } from '@/config/quizStepsComplete';
import { DraftPersistence } from '@/services/editor/DraftPersistence';
import { useEditorSupabaseIntegration } from '@/hooks/useEditorSupabaseIntegration';
import { useHistoryState } from '@/hooks/useHistoryState';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { Block } from '@/types/editor';
import { extractStepNumberFromKey } from '@/utils/supabaseMapper';
import { arrayMove } from '@dnd-kit/sortable';
import React, { createContext, ReactNode, useCallback, useContext, useEffect } from 'react';

// Utilitário simples para aguardar o próximo tick do event loop (garante flush de setState em testes)
const waitNextTick = (ms: number = 0) => new Promise<void>(resolve => setTimeout(resolve, ms));

export interface EditorState {
  stepBlocks: Record<string, Block[]>;
  currentStep: number;
  selectedBlockId: string | null;
  // Validation per step (editor-only visual/functional state)
  stepValidation: Record<number, boolean>;
  // Supabase integration state
  isSupabaseEnabled: boolean;
  databaseMode: 'local' | 'supabase';
  isLoading: boolean;
}

export interface EditorActions {
  // State management
  setCurrentStep: (step: number) => void;
  setSelectedBlockId: (blockId: string | null) => void;
  // Validation management (used by EditorPro to reflect selections)
  setStepValid: (step: number, isValid: boolean) => void;

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
    // 🔍 INVESTIGAÇÃO #1: Enhanced error reporting for context issues
    console.error('❌ ERRO DE CONTEXTO DO EDITOR:', {
      location: window.location.href,
      timestamp: new Date().toISOString(),
      reactVersion: React.version,
      contextValue: context,
      editorElements: document.querySelectorAll('[class*="editor"], [class*="Editor"]').length,
      providerElements: document.querySelectorAll('[class*="provider"], [class*="Provider"]').length
    });
    
    // Add diagnostic info to window for debugging
    window.__EDITOR_CONTEXT_ERROR__ = {
      timestamp: new Date().toISOString(),
      location: window.location.href,
      stackTrace: new Error().stack
    };
    
    throw new Error('🚨 useEditor must be used within an EditorProvider - check that EditorPro is wrapped correctly');
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
    // Em ambiente de teste, iniciamos vazio para testes previsíveis
    const isTestEnv = process.env.NODE_ENV === 'test';
    if (!isTestEnv) {
      // Normalize step blocks from template using our new utility
      const normalizedBlocks = normalizeStepBlocks(QUIZ_STYLE_21_STEPS_TEMPLATE);
      Object.entries(normalizedBlocks).forEach(([stepKey, blocks]) => {
        initialBlocks[stepKey] = Array.isArray(blocks) ? [...blocks] : [];
      });
    } else {
      // Garante pelo menos arrays vazios para as primeiras etapas usadas nos testes
      initialBlocks['step-1'] = [];
      initialBlocks['step-2'] = [];
    }

    const state: EditorState = {
      stepBlocks: initialBlocks,
      currentStep: 1,
      selectedBlockId: null,
      stepValidation: {},
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
    historyLimit: 30,
    storageKey,
    enablePersistence: true,
    persistPresentOnly: true,
    persistDebounceMs: 250,
    serialize: (present: EditorState) => {
      // Persist only minimal fields to avoid quota issues
      const minimal: any = {
        currentStep: present.currentStep || 1,
        selectedBlockId: present.selectedBlockId || null,
        // Persist only ids/types to allow lightweight restore; full templates are reloaded on mount
        stepBlocks: Object.fromEntries(
          Object.entries(present.stepBlocks || {}).map(([k, arr]) => [
            k,
            (arr || []).map(b => ({ id: b.id, type: b.type, order: b.order || 0 })),
          ])
        ),
        databaseMode: present.databaseMode,
        isSupabaseEnabled: present.isSupabaseEnabled,
      };
      return minimal;
    },
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
        setState(prev => {
          const grouped = groupByStepKey(components);
          // Normaliza e faz merge não-destrutivo por ID
          const merged = mergeStepBlocks(prev.stepBlocks, grouped);
          // Atualiza validação para todas as etapas
          const validationUpdate: Record<number, boolean> = {};
          for (let i = 1; i <= 21; i++) {
            const key = `step-${i}`;
            validationUpdate[i] = Array.isArray((merged as any)[key]) && (merged as any)[key].length > 0;
          }
          return {
            ...prev,
            stepBlocks: merged,
            stepValidation: {
              ...(prev.stepValidation || {}),
              ...validationUpdate,
            },
          };
        });
      }
    } catch (err) {
      console.error('EditorProvider: failed to load supabase components', err);
    }
  }, [supabaseIntegration, setState]);

  useEffect(() => {
    if (enableSupabase) {
      loadSupabaseComponents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableSupabase, funnelId, quizId]);

  // Ensure step is loaded - check if step exists, if not fetch and merge
  const stateRef = React.useRef(rawState);
  useEffect(() => { stateRef.current = rawState; }, [rawState]);

  const ensureStepLoaded = useCallback(
    async (step: number | string) => {
      // Em ambiente de teste, não auto-carregar templates para manter estado previsível
      if (process.env.NODE_ENV === 'test') {
        return;
      }
      const existingBlocks = getBlocksForStep(step, stateRef.current.stepBlocks);

      if (existingBlocks && existingBlocks.length > 0) {
        // Merge local draft over existing if draft is newer
        try {
          const stepNum = typeof step === 'number' ? step : parseInt(String(step), 10);
          const stepKey = Number.isFinite(stepNum) ? `step-${stepNum}` : String(step);
          const draftKey = quizId || funnelId || 'local-funnel';
          if (draftKey) {
            const draft = DraftPersistence.loadStepDraft(draftKey, stepKey);
            if (draft && Array.isArray(draft.blocks) && draft.blocks.length > 0) {
              setState(prev => {
                const prevBlocks = prev.stepBlocks[stepKey] ?? [];
                // Prefer draft by id but keep order from prev when possible
                const byId = new Map<string, any>(prevBlocks.map(b => [String(b.id), b]));
                const merged = draft.blocks.map(db => {
                  const found = byId.get(String(db.id));
                  return found
                    ? {
                      ...found,
                      ...db,
                      properties: { ...(found.properties || {}), ...(db.properties || {}) },
                      content: { ...(found.content || {}), ...(db.content || {}) },
                    }
                    : db;
                });
                return { ...prev, stepBlocks: { ...prev.stepBlocks, [stepKey]: merged } };
              });
            }
          }
        } catch { }
        return; // Step already loaded
      }

      try {
        // First try to fetch from Supabase if enabled
        if (state.isSupabaseEnabled && supabaseIntegration?.loadSupabaseComponents) {
          const comps = await supabaseIntegration.loadSupabaseComponents();
          const components = Array.isArray(comps) ? comps : (supabaseIntegration.components ?? []);
          if (components && components.length > 0) {
            setState(prev => {
              const grouped = groupByStepKey(components);
              const merged = mergeStepBlocks(prev.stepBlocks, grouped);
              return {
                ...prev,
                stepBlocks: merged,
              };
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
            setState(prev => ({
              ...prev,
              stepBlocks: {
                ...prev.stepBlocks,
                [stepKey]: defaultBlocks,
              },
              stepValidation: {
                ...(prev.stepValidation || {}),
                [stepNum]: defaultBlocks.length > 0,
              },
            }));

            // After loading defaults, merge draft if exists
            const draftKey = quizId || funnelId || 'local-funnel';
            if (draftKey) {
              const draft = DraftPersistence.loadStepDraft(draftKey, stepKey);
              if (draft && Array.isArray(draft.blocks) && draft.blocks.length > 0) {
                setState(prev => {
                  const prevBlocks = prev.stepBlocks[stepKey] ?? [];
                  const byId = new Map<string, any>(prevBlocks.map(b => [String(b.id), b]));
                  const merged = draft.blocks.map(db => {
                    const found = byId.get(String(db.id));
                    return found
                      ? {
                        ...found,
                        ...db,
                        properties: { ...(found.properties || {}), ...(db.properties || {}) },
                        content: { ...(found.content || {}), ...(db.content || {}) },
                      }
                      : db;
                  });
                  return { ...prev, stepBlocks: { ...prev.stepBlocks, [stepKey]: merged } };
                });
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to ensure step loaded:', error);
      }
    },
    [setState, state.isSupabaseEnabled, supabaseIntegration, quizId]
  );

  // Stable ref to ensureStepLoaded for effects that should not re-run on identity change
  const ensureStepLoadedRef = React.useRef<EditorActions['ensureStepLoaded']>(ensureStepLoaded);
  useEffect(() => { ensureStepLoadedRef.current = ensureStepLoaded; }, [ensureStepLoaded]);

  // Initialize step 1 automatically on mount and when template data is available
  useEffect(() => {
    // 🚨 CORREÇÃO CRÍTICA: Always force template reload on mount
    const isTestEnv = process.env.NODE_ENV === 'test';
    if (!isTestEnv) {
      // Detect minimal persisted state and rehydrate (variável removida por não uso)
      const normalizedBlocks = normalizeStepBlocks(QUIZ_STYLE_21_STEPS_TEMPLATE);
      console.log('🔧 FORCE RELOAD TEMPLATE:', {
        normalizedBlocks,
        keys: Object.keys(normalizedBlocks),
        totalSteps: Object.keys(normalizedBlocks).length,
      });

      // 🚨 FORÇA CARREGAMENTO: Aplicar template normalizado por merge não-destrutivo e computar validação
      setState(prev => {
        const mergedBlocks = mergeStepBlocks(prev.stepBlocks, normalizedBlocks);
        const initialValidation: Record<number, boolean> = {};
        for (let i = 1; i <= 21; i++) {
          const key = `step-${i}`;
          initialValidation[i] = Array.isArray((mergedBlocks as any)[key]) && (mergedBlocks as any)[key].length > 0;
        }
        return {
          ...prev,
          stepBlocks: mergedBlocks,
          stepValidation: {
            ...(prev.stepValidation || {}),
            ...initialValidation,
          },
          // Preserve any pre-set currentStep (e.g., from initial props or URL)
          currentStep: prev.currentStep || 1,
        };
      });

      // 🚨 GARANTIA DUPLA: Ensure step 1 is loaded on initialization
      setTimeout(() => {
        ensureStepLoadedRef.current?.(1);
        // Force verify all steps loaded
        for (let i = 1; i <= 21; i++) {
          ensureStepLoadedRef.current?.(i);
        }
      }, 100);
    } else {
      // Em testes, não carregar templates automaticamente nem fazer merges
      setState(prev => ({
        ...prev,
        currentStep: 1,
        // mantém stepBlocks como já inicializado vazio pelo getInitialState()
      }));
    }
  }, []); // Empty dependency array - run only once on mount

  // 🚨 CORREÇÃO: Ensure step is loaded when currentStep changes
  useEffect(() => {
    if (rawState.currentStep) {
      // Em testes, não auto-carregar templates ao mudar de etapa
      if (process.env.NODE_ENV !== 'test') {
        ensureStepLoadedRef.current?.(rawState.currentStep);
      }

      // 🚨 FORÇA VERIFICAÇÃO: If step blocks are empty, force reload template
      const currentStepBlocks = getBlocksForStep(rawState.currentStep, rawState.stepBlocks);
      if (process.env.NODE_ENV !== 'test' && (!currentStepBlocks || currentStepBlocks.length === 0)) {
        console.log('🚨 EMPTY STEP DETECTED - FORCE RELOAD:', rawState.currentStep);
        const normalizedBlocks = normalizeStepBlocks(QUIZ_STYLE_21_STEPS_TEMPLATE);
        setState(prev => {
          const mergedBlocks = mergeStepBlocks(prev.stepBlocks, normalizedBlocks);
          const validationUpdate: Record<number, boolean> = {};
          for (let i = 1; i <= 21; i++) {
            const key = `step-${i}`;
            validationUpdate[i] = Array.isArray((mergedBlocks as any)[key]) && (mergedBlocks as any)[key].length > 0;
          }
          return {
            ...prev,
            stepBlocks: mergedBlocks,
            stepValidation: {
              ...(prev.stepValidation || {}),
              ...validationUpdate,
            },
          };
        });
      }
    }
  }, [rawState.currentStep]);

  // 🔧 DIAGNÓSTICO: Expor contexto para debugging via window global
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__EDITOR_CONTEXT__ = {
        state: rawState,
        actions,
        getBlocksForStep: (step: number) => getBlocksForStep(step, rawState.stepBlocks),
        ensureStepLoaded: ensureStepLoadedRef.current,
      };
      
      // Análise de estado para diagnóstico
      const analysis = {
        timestamp: Date.now(),
        totalSteps: 21,
        currentStep: rawState.currentStep,
        stepBlocksKeys: Object.keys(rawState.stepBlocks || {}),
        stepsWithBlocks: Object.entries(rawState.stepBlocks || {}).map(([key, blocks]) => ({
          step: key,
          count: Array.isArray(blocks) ? blocks.length : 0,
          types: Array.isArray(blocks) ? blocks.map(b => b.type) : []
        })),
        validationSummary: rawState.stepValidation || {},
        contextHealth: 'healthy'
      };
      
      window.__EDITOR_STATE_ANALYSIS__ = analysis;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Editor context exposed for debugging:', analysis);
      }
    }
  }, [rawState, actions]);

  // Actions (use functional setState to avoid races)
  const setCurrentStep = useCallback(
    (step: number) => {
      // 🔍 INVESTIGAÇÃO #2: Enhanced currentStep validation
      const isValidStep = Number.isInteger(step) && step >= 1 && step <= 21;
      
      if (!isValidStep) {
        console.error('🚨 INVALID STEP DETECTED:', {
          requestedStep: step,
          type: typeof step,
          isInteger: Number.isInteger(step),
          range: `1-21`,
          currentStack: new Error().stack
        });
        
        // Track invalid attempts for debugging
        if (typeof window !== 'undefined') {
          window.__EDITOR_INVALID_STEPS__ = window.__EDITOR_INVALID_STEPS__ || [];
          window.__EDITOR_INVALID_STEPS__.push({
            timestamp: new Date(),
            requestedStep: step,
            type: typeof step,
            stack: new Error().stack
          });
        }
        
        // Auto-correct to valid range
        const correctedStep = Math.max(1, Math.min(21, Math.floor(step || 1)));
        console.warn('🔧 AUTO-CORRECTING step to:', correctedStep);
        step = correctedStep;
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 setCurrentStep called:', {
          requestedStep: step,
          isValidStep,
          currentStep: stateRef.current.currentStep,
          stepType: typeof step,
          isInteger: Number.isInteger(step),
          timestamp: new Date().toISOString()
        });
      }
      
      if (!isValidStep) {
        console.error('❌ INVESTIGAÇÃO #2: currentStep fora do intervalo válido (1-21):', {
          invalidStep: step,
          stepType: typeof step,
          isNaN: Number.isNaN(step),
          currentValidStep: stateRef.current.currentStep,
          stackTrace: new Error().stack?.split('\n').slice(0, 5)
        });
        
        // Add to window for debugging
        window.__EDITOR_INVALID_STEPS__ = window.__EDITOR_INVALID_STEPS__ || [];
        window.__EDITOR_INVALID_STEPS__.push({
          invalidStep: step,
          timestamp: new Date().toISOString(),
          currentStep: stateRef.current.currentStep
        });
        
        // Don't allow invalid steps but don't throw - use fallback
        step = Math.max(1, Math.min(21, Number.isInteger(step) ? step : 1));
        console.warn('🔧 Corrigindo para step válido:', step);
      }
      
      setState(prev => ({
        ...prev,
        currentStep: step,
        selectedBlockId: null,
      }));
      // Ensure the new step is loaded will be handled by the effect watching currentStep
    },
    [setState]
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

  // Reflect step validation for editor UX (navigation/buttons/indicators)
  const setStepValid = useCallback(
    (step: number, isValid: boolean) => {
      if (!Number.isFinite(step) || step < 1) return;
      setState(prev => ({
        ...prev,
        stepValidation: {
          ...(prev.stepValidation || {}),
          [step]: !!isValid,
        },
      }));
    },
    [setState]
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
      setState(prev => {
        const prevBlocks = prev.stepBlocks[stepKey] ?? [];
        const nextState: EditorState = {
          ...prev,
          stepBlocks: {
            ...prev.stepBlocks,
            [stepKey]: [...prevBlocks, block],
          },
        };
        // Persist draft for this step
        {
          const draftKey = quizId || funnelId || 'local-funnel';
          try { DraftPersistence.saveStepDraft(draftKey, stepKey, nextState.stepBlocks[stepKey]); } catch {}
        }
        return nextState;
      });

      // Em modo local (sem Supabase), aguarde um tick para que o React aplique o setState antes de resolver
      if (!state.isSupabaseEnabled) {
        await waitNextTick();
      }

      if (state.isSupabaseEnabled && supabaseIntegration?.addBlockToStep) {
        try {
          const created = await supabaseIntegration.addBlockToStep(block, stepNumber);
          // replace temp with real block returned by supabase (map shape to Block)
          if (created) {
            const realBlock = mapSupabaseRecordToBlock(created);
            setState(prev => {
              const currentList = prev.stepBlocks[stepKey] || [];
              // Substitui o bloco otimista pelo real mantendo a posição
              const replaced = currentList.map((b: Block) => (b.id === block.id ? realBlock : b));
              return {
                ...prev,
                stepBlocks: {
                  ...prev.stepBlocks,
                  [stepKey]: replaced,
                },
              };
            });
          } else {
            // If creation returned nothing, rollback
            setState(prev => {
              const filtered = (prev.stepBlocks[stepKey] || []).filter(
                (b: Block) => b.id !== block.id
              );
              return {
                ...prev,
                stepBlocks: {
                  ...prev.stepBlocks,
                  [stepKey]: filtered,
                },
              };
            });
            throw new Error('Supabase integration returned no created component');
          }
        } catch (err) {
          console.error('❌ addBlock supabase failed, rolling back optimistic update', err);
          // rollback to previous local state
          setState(prev => {
            const filtered = (prev.stepBlocks[stepKey] || []).filter(
              (b: Block) => b.id !== block.id
            );
            return {
              ...prev,
              stepBlocks: {
                ...prev.stepBlocks,
                [stepKey]: filtered,
              },
            };
          });
          throw err;
        }
      } else {
        // Local mode already applied optimistic update — nothing else to do
      }
    },
    [setState, state.isSupabaseEnabled, supabaseIntegration, rawState, quizId]
  );

  const addBlockAtIndex = useCallback(
    async (stepKey: string, block: Block, index: number) => {
      const stepNumber = extractStepNumberFromKey(stepKey) || 0;
      let optimisticState: EditorState | null = null;
      setState(prev => {
        const prevBlocks = prev.stepBlocks[stepKey] ?? [];
        const clampedIndex = Math.max(0, Math.min(index, prevBlocks.length));
        const nextBlocks = [...prevBlocks];
        nextBlocks.splice(clampedIndex, 0, block);
        optimisticState = {
          ...prev,
          stepBlocks: {
            ...prev.stepBlocks,
            [stepKey]: nextBlocks,
          },
        };
        // Persist draft
        {
          const draftKey = quizId || funnelId || 'local-funnel';
          try { DraftPersistence.saveStepDraft(draftKey, stepKey, nextBlocks); } catch {}
        }
        return optimisticState!;
      });

      // Em modo local (sem Supabase), aguarde um tick para que o React aplique o setState antes de resolver
      if (!state.isSupabaseEnabled) {
        await waitNextTick();
      }

      if (state.isSupabaseEnabled && supabaseIntegration?.addBlockToStep) {
        try {
          const created = await supabaseIntegration.addBlockToStep(block, stepNumber);
          if (created) {
            const realBlock = mapSupabaseRecordToBlock(created);
            // Replace the optimistic block (by id) in-place to preserve position
            setState(prev => {
              const currentList = prev.stepBlocks[stepKey] || [];
              const replaced = currentList.map((b: Block) => (b.id === block.id ? realBlock : b));
              return {
                ...prev,
                stepBlocks: {
                  ...prev.stepBlocks,
                  [stepKey]: replaced,
                },
              };
            });
          } else {
            // rollback if nothing returned
            setState(prev => {
              const filtered = (prev.stepBlocks[stepKey] || []).filter(
                (b: Block) => b.id !== block.id
              );
              return {
                ...prev,
                stepBlocks: {
                  ...prev.stepBlocks,
                  [stepKey]: filtered,
                },
              };
            });
            throw new Error('Supabase integration returned no created component');
          }
        } catch (err) {
          console.error('❌ addBlockAtIndex supabase failed, rolling back optimistic update', err);
          // rollback optimistic insert
          setState(prev => {
            const filtered = (prev.stepBlocks[stepKey] || []).filter((b: Block) => b.id !== block.id);
            return {
              ...prev,
              stepBlocks: {
                ...prev.stepBlocks,
                [stepKey]: filtered,
              },
            };
          });
          throw err;
        }
      }
    },
    [setState, state.isSupabaseEnabled, supabaseIntegration, rawState, quizId]
  );

  const removeBlock = useCallback(
    async (stepKey: string, blockId: string) => {
      const nextBlocks = (rawState.stepBlocks[stepKey] || []).filter(b => b.id !== blockId);
      setState({
        ...rawState,
        stepBlocks: {
          ...rawState.stepBlocks,
          [stepKey]: nextBlocks,
        },
        selectedBlockId: rawState.selectedBlockId === blockId ? null : rawState.selectedBlockId,
      });

      // Persist draft
      {
        const draftKey = quizId || funnelId || 'local-funnel';
        try { DraftPersistence.saveStepDraft(draftKey, stepKey, nextBlocks); } catch {}
      }

      // If supabase mode, delegate deletion
      if (state.isSupabaseEnabled && supabaseIntegration?.deleteBlockById) {
        try {
          await supabaseIntegration.deleteBlockById(blockId);
        } catch (err) {
          console.error('Failed to delete block in supabase, consider reloading state', err);
        }
      }
    },
    [setState, state.isSupabaseEnabled, supabaseIntegration, rawState, quizId]
  );

  const reorderBlocks = useCallback(
    async (stepKey: string, oldIndex: number, newIndex: number) => {
      setState(prev => {
        const blocks = [...(prev.stepBlocks[stepKey] || [])];
        const reordered = arrayMove(blocks, oldIndex, newIndex);
        // Persist draft
        {
          const draftKey = quizId || funnelId || 'local-funnel';
          try { DraftPersistence.saveStepDraft(draftKey, stepKey, reordered); } catch {}
        }
        return {
          ...prev,
          stepBlocks: {
            ...prev.stepBlocks,
            [stepKey]: reordered,
          },
        };
      });

      // Em modo local, garanta que o estado foi aplicado antes de retornar
      if (!state.isSupabaseEnabled) {
        await waitNextTick();
        await waitNextTick(); // segundo tick para garantir que efeitos dos consumidores rodem
      }

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
    [setState, state.isSupabaseEnabled, supabaseIntegration, rawState, quizId]
  );

  const updateBlock = useCallback(
    async (stepKey: string, blockId: string, updates: Record<string, any>) => {
      // Sempre mesclar alterações em properties por padrão.
      // Se o payload já vier com { properties }, respeitar e mesclar também.
      const nextBlocks = (rawState.stepBlocks[stepKey] || []).map(b => {
        if (b.id !== blockId) return b;
        const incomingProps = updates.properties ?? updates;
        const mergedProps = {
          ...(b.properties || {}),
          ...(incomingProps || {}),
        };
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

      // Persist draft
      {
        const draftKey = quizId || funnelId || 'local-funnel';
        try { DraftPersistence.saveStepDraft(draftKey, stepKey, nextBlocks); } catch {}
      }

      if (state.isSupabaseEnabled && supabaseIntegration?.updateBlockById) {
        try {
          const updated = nextBlocks.find(b => b.id === blockId);
          await supabaseIntegration.updateBlockById(blockId, {
            properties: updated?.properties,
          });
        } catch (err) {
          console.error('Failed to update block in supabase', err);
        }
      }
    },
    [setState, state.isSupabaseEnabled, supabaseIntegration, rawState, quizId]
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
      blocks.forEach(block => {
        // Type-safe access to block properties
        const blockContent = block.content || {};
        const blockProperties = block.properties || {};

        // Validate Question components have required props
        if (block.type === 'quiz-question-inline' || block.type === 'options-grid') {
          const options = (blockContent as any)?.options || (blockProperties as any)?.options;
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
        if (block.type === 'result-header-inline' || block.type === 'quiz-result-inline') {
          const outcomeMapping =
            (blockContent as any)?.outcomeMapping || (blockProperties as any)?.outcomeMapping;
          if (outcomeMapping && typeof outcomeMapping === 'object') {
            Object.values(outcomeMapping).forEach((outcomeId: any) => {
              // Check if outcome exists in schema_json (basic validation)
              const outcomeExists = Object.values(normalizedStepBlocks).some(stepBlocks =>
                stepBlocks.some(b => {
                  const bContent = b.content || {};
                  const bProperties = b.properties || {};
                  return (
                    b.id === outcomeId ||
                    (bContent as any)?.outcomeId === outcomeId ||
                    (bProperties as any)?.outcomeId === outcomeId
                  );
                })
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
        validationWarnings: warnings,
      },
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
    setStepValid,
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

  // 🔍 DIAGNÓSTICO: Expor contexto globalmente para debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__EDITOR_CONTEXT__ = {
        ...state,
        actions,
      };
      
      // Detectar erros de contexto
      if (!state || typeof state !== 'object') {
        if (!(window as any).__EDITOR_CONTEXT_ERROR__) {
          (window as any).__EDITOR_CONTEXT_ERROR__ = [];
        }
        (window as any).__EDITOR_CONTEXT_ERROR__.push({
          error: 'Estado do editor inválido',
          state: state,
          timestamp: Date.now(),
          stack: new Error().stack
        });
        console.error('🚨 ERRO DE CONTEXTO DO EDITOR: Estado inválido detectado', state);
      }
    }
  }, [state, actions]);

  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>;
};
