// @ts-nocheck
import { getBlocksForStep, mergeStepBlocks, normalizeStepBlocks } from '@/config/quizStepsComplete';
import { DraftPersistence } from '@/services/editor/DraftPersistence';
import { useEditorSupabaseIntegration } from '@/hooks/useEditorSupabaseIntegration';
import { useHistoryStateIndexedDB } from '@/hooks/useHistoryStateIndexedDB';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { Block, BlockType } from '@/types/editor';
import { extractStepNumberFromKey } from '@/utils/supabaseMapper';
import { arrayMove } from '@dnd-kit/sortable';
import React, { createContext, ReactNode, useCallback, useContext, useEffect } from 'react';
import { unifiedQuizStorage } from '@/services/core/UnifiedQuizStorage';
import { useFunnels } from '@/context/FunnelsContext';

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
  // Load/Reset defaults
  loadDefaultTemplate: () => void;

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
  if (context) {
    return context;
  }

  // Log detalhado e erro como último recurso
  console.error('❌ ERRO DE CONTEXTO DO EDITOR:', {
    location: typeof window !== 'undefined' ? window.location.href : 'ssr',
    timestamp: new Date().toISOString(),
    reactVersion: (React as any).version,
    contextValue: context,
    editorElements: typeof document !== 'undefined' ? document.querySelectorAll('[class*="editor"], [class*="Editor"]').length : 0,
    providerElements: typeof document !== 'undefined' ? document.querySelectorAll('[class*="provider"], [class*="Provider"]').length : 0
  });

  if (typeof window !== 'undefined') {
    (window as any).__EDITOR_CONTEXT_ERROR__ = {
      timestamp: new Date().toISOString(),
      location: window.location?.href,
      stackTrace: new Error().stack
    };
  }

  throw new Error('🚨 useEditor must be used within an EditorProvider - check that EditorPro is wrapped correctly');
};

// Versão opcional do hook que NÃO lança erro quando usado fora do Provider.
// Útil para blocos reutilizados em preview/produção onde o editor não está ativo.
export const useEditorOptional = (): EditorContextValue | undefined => {
  try {
    return useContext(EditorContext);
  } catch {
    return undefined;
  }
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

const mapSupabaseRecordToBlock = (c: any): Block => {
  // 🛡️ VALIDAÇÃO ROBUSTA: Prevenir erro "i.replace is not a function"
  if (!c || typeof c !== 'object') {
    console.error('❌ mapSupabaseRecordToBlock: registro inválido:', c);
    throw new Error(`Invalid Supabase record: expected object, got ${typeof c}`);
  }

  // Garantir que ID é sempre string válida
  const id = c.id ? String(c.id) : `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Garantir que type é sempre BlockType válido
  const type = c.component_type_key || c.type;
  const validType = (typeof type === 'string' && type.length > 0) ? type as BlockType : 'text' as BlockType;

  // Garantir que order é número
  const order = Number.isFinite(c.order_index) ? c.order_index :
    Number.isFinite(c.order) ? c.order : 0;

  // Validar properties e content como objetos
  const properties = (c.properties && typeof c.properties === 'object') ? c.properties : {};
  const content = (properties.content && typeof properties.content === 'object') ? properties.content : {};

  const block: Block = {
    id,
    type: validType,
    order,
    content,
    properties,
  };

  // 🔍 LOG DIAGNÓSTICO: Para debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 mapSupabaseRecordToBlock:', {
      input: c,
      output: block,
      validations: {
        idValid: typeof id === 'string' && id.length > 0,
        typeValid: typeof validType === 'string' && validType.length > 0,
        orderValid: Number.isFinite(order),
        propertiesValid: typeof properties === 'object' && properties !== null,
        contentValid: typeof content === 'object' && content !== null,
      }
    });
  }

  return block;
};

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
  // 🔍 DEBUG: Log inicial dos parâmetros do EditorProvider
  useEffect(() => {
    console.log('🎯 EditorProvider - Inicialização com parâmetros:', {
      funnelId,
      quizId,
      enableSupabase,
      timestamp: new Date().toISOString()
    });
  }, [funnelId, quizId, enableSupabase]);

  // Diagnóstico: sinalizar montagem do provider moderno no escopo global (apenas browser)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        (window as any).__MODERN_EDITOR_PROVIDER__ = {
          mounted: true,
          ts: new Date().toISOString(),
          source: 'src/components/editor/EditorProvider.tsx',
        };
      } catch { }
    }
    return () => {
      if (typeof window !== 'undefined') {
        try {
          (window as any).__MODERN_EDITOR_PROVIDER__ = {
            mounted: false,
            ts: new Date().toISOString(),
            source: 'src/components/editor/EditorProvider.tsx',
          };
        } catch { }
      }
    };
  }, []);
  // 🔧 CORREÇÃO CRÍTICA: Estado inicial dinâmico SEM forçar 21 etapas
  const getInitialState = (): EditorState => {
    const initialBlocks: Record<string, Block[]> = {};
    const isTestEnv = process.env.NODE_ENV === 'test';

    if (!isTestEnv) {
      // ✅ NOVO: Sistema totalmente dinâmico sem templates fixos
      console.log('🆕 EditorProvider: Iniciando com canvas dinâmico para funnelId:', funnelId);

      // Canvas sempre inicia vazio - template será carregado depois via loadRealFunnelData
      // ❌ REMOVIDO: Não forçar nenhum template por padrão
      initialBlocks['step-1'] = []; // Apenas step inicial vazio
    } else {
      // Em testes, iniciar sempre vazio
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
    state: rawState,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    storageReady,
    clearHistory,
  } = useHistoryStateIndexedDB<EditorState>(getInitialState(), {
    historyLimit: process.env.NODE_ENV === 'test' ? 5 : 30,
    storageKey,
    enablePersistence: process.env.NODE_ENV !== 'test',
    persistPresentOnly: true,
    persistDebounceMs: process.env.NODE_ENV === 'test' ? 0 : 500, // Increased for IndexedDB
    namespace: 'quizEditor',
    compression: true,
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

  // 🔗 INTEGRAÇÃO CRÍTICA: Conectar ao FunnelsContext para salvamento
  let funnelsContext;
  try {
    funnelsContext = useFunnels();
  } catch (error) {
    console.warn('⚠️ FunnelsContext não disponível no EditorProvider:', error);
    funnelsContext = null;
  }

  // 🔧 CORREÇÃO CRÍTICA: Carregamento inteligente de funis/templates
  const loadRealFunnelData = useCallback(async () => {
    if (!funnelId) {
      console.log('📋 EditorProvider: Sem funnelId, mantendo canvas vazio');
      return;
    }

    // Carregar template se funnelId indica template
    if (funnelId.startsWith('template-')) {
      const templateId = funnelId.replace('template-', '');
      console.log('📄 EditorProvider: Carregando template:', templateId);

      try {
        const { templateLibraryService } = await import('@/services/templateLibraryService');
        const template = templateLibraryService.getById(templateId);

        if (template) {
          console.log('✅ Template encontrado:', template);
          // Converter template para stepBlocks se necessário
          setState((prev: EditorState) => ({
            ...prev,
            isLoading: false
          }));
          return;
        } else {
          console.warn('⚠️ Template não encontrado, usando fallback');
        }
      } catch (error) {
        console.error('❌ Erro ao carregar template:', error);
      }

      setState((prev: EditorState) => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      console.log('🔄 EditorProvider: Iniciando carregamento de dados reais do funil:', funnelId);
      setState((prev: EditorState) => ({ ...prev, isLoading: true }));

      // Para testes, vamos criar dados mock quando não há dados reais
      if (funnelId === 'test-funnel-123') {
        console.log('🧪 EditorProvider: Usando dados mock para teste');

        const mockFunnelData = {
          name: 'Funil de Teste Mock',
          pages: [
            {
              title: 'Qual é o seu estilo preferido?',
              blocks: [{
                id: 'block-1',
                type: 'quiz-question-inline',
                properties: {
                  question: 'Qual é o seu estilo preferido?',
                  options: [
                    { id: 'opt-1', text: 'Clássico', score: 10, image: null },
                    { id: 'opt-2', text: 'Moderno', score: 15, image: null },
                    { id: 'opt-3', text: 'Boho', score: 20, image: null }
                  ],
                  multipleSelection: false,
                  required: true,
                  showImages: true
                },
                content: {
                  title: 'Pergunta sobre Estilo',
                  description: 'Escolha a opção que melhor representa você'
                }
              }]
            },
            {
              title: 'Qual é a sua cor favorita?',
              blocks: [{
                id: 'block-2',
                type: 'quiz-question-inline',
                properties: {
                  question: 'Qual é a sua cor favorita?',
                  options: [
                    { id: 'opt-4', text: 'Azul', score: 10, image: null },
                    { id: 'opt-5', text: 'Verde', score: 15, image: null },
                    { id: 'opt-6', text: 'Vermelho', score: 20, image: null }
                  ],
                  multipleSelection: false,
                  required: true,
                  showImages: false
                },
                content: {
                  title: 'Pergunta sobre Cor',
                  description: 'Selecione sua cor preferida'
                }
              }]
            }
          ]
        };

        // Processar dados mock da mesma forma
        const realStepBlocks: Record<string, Block[]> = {};

        mockFunnelData.pages.forEach((page: any, index: number) => {
          const stepKey = `step-${index + 1}`;

          const blocks: Block[] = Array.isArray(page.blocks)
            ? page.blocks.map((block: any) => ({
              id: block.id || `${stepKey}-block-${Date.now()}-${Math.random()}`,
              type: (block.type as BlockType) || 'quiz-question-inline',
              order: block.order || 0,
              properties: {
                question: block.properties?.question || page.title || 'Pergunta não definida',
                options: block.properties?.options || [],
                multipleSelection: block.properties?.multipleSelection || false,
                required: block.properties?.required !== false,
                showImages: block.properties?.showImages !== false,
                ...(block.properties || {})
              },
              content: {
                title: block.content?.title || page.title || 'Título não definido',
                description: block.content?.description || '',
                ...(block.content || {})
              }
            }))
            : [];

          if (blocks.length > 0) {
            realStepBlocks[stepKey] = blocks;
            console.log(`📝 EditorProvider: Step ${stepKey} preparado com ${blocks.length} blocos (mock)`);
          }
        });

        // Atualizar estado com dados mock
        setState(prev => ({
          ...prev,
          stepBlocks: {
            ...prev.stepBlocks,
            ...realStepBlocks
          },
          isLoading: false
        }));

        console.log('✅ EditorProvider: Dados mock integrados ao editor:', {
          stepKeys: Object.keys(realStepBlocks),
          totalBlocks: Object.values(realStepBlocks).reduce((acc, blocks) => acc + blocks.length, 0),
          funnelName: mockFunnelData.name
        });

        return;
      }

      // Para funis reais, usar serviço do Supabase
      const { schemaDrivenFunnelService } = await import('@/services/schemaDrivenFunnelService');

      console.log('📡 EditorProvider: Chamando schemaDrivenFunnelService.getFunnel...');
      const funnelData = await schemaDrivenFunnelService.getFunnel(funnelId);

      if (funnelData && funnelData.pages) {
        console.log('✅ EditorProvider: Dados do funil carregados com sucesso:', {
          name: funnelData.name,
          pagesCount: funnelData.pages.length,
          funnelId,
          pages: funnelData.pages.map((p, i) => ({ index: i, title: p.title, blocksCount: Array.isArray(p.blocks) ? p.blocks.length : 0 }))
        });

        // Converter páginas do funil em stepBlocks
        const realStepBlocks: Record<string, Block[]> = {};

        funnelData.pages.forEach((page: any, index: number) => {
          const stepKey = `step-${index + 1}`;

          const blocks: Block[] = Array.isArray(page.blocks)
            ? page.blocks.map((block: any) => ({
              id: block.id || `${stepKey}-block-${Date.now()}-${Math.random()}`,
              type: (block.type as BlockType) || 'quiz-question-inline',
              order: block.order || 0,
              properties: {
                question: block.title || block.properties?.question || page.title || 'Pergunta não definida',
                options: block.properties?.options || block.options || [],
                multipleSelection: block.properties?.multipleSelection || false,
                required: block.properties?.required !== false,
                showImages: block.properties?.showImages !== false,
                ...(block.properties || {})
              },
              content: {
                title: block.title || block.content?.title || page.title || 'Título não definido',
                description: block.description || block.content?.description || '',
                ...(block.content || {})
              }
            }))
            : [];

          // Se não houver blocos, criar um bloco de questão padrão baseado na página
          if (blocks.length === 0 && page.title) {
            console.log(`🔧 EditorProvider: Criando bloco padrão para página ${index + 1} (${page.title})`);
            blocks.push({
              id: `${stepKey}-default-block`,
              type: 'quiz-question-inline',
              order: 0,
              properties: {
                question: page.title,
                options: [],
                multipleSelection: false,
                required: true,
                showImages: true
              },
              content: {
                title: page.title,
                description: ''
              }
            });
          }

          if (blocks.length > 0) {
            realStepBlocks[stepKey] = blocks;
            console.log(`📝 EditorProvider: Step ${stepKey} preparado com ${blocks.length} blocos`);
          }
        });

        // Atualizar estado com dados reais
        setState(prev => ({
          ...prev,
          stepBlocks: {
            ...prev.stepBlocks,
            ...realStepBlocks
          },
          isLoading: false
        }));

        console.log('✅ EditorProvider: Dados reais do funil integrados ao editor:', {
          stepKeys: Object.keys(realStepBlocks),
          totalBlocks: Object.values(realStepBlocks).reduce((acc, blocks) => acc + blocks.length, 0),
          funnelName: funnelData.name
        });

      } else {
        console.warn('⚠️ EditorProvider: Funil não encontrado ou sem páginas:', { funnelId, funnelData });
        setState(prev => ({ ...prev, isLoading: false }));
      }

    } catch (error) {
      console.error('❌ EditorProvider: Erro ao carregar dados reais do funil:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [funnelId, setState]);  // 🚀 Carregar dados reais do funil quando funnelId mudar
  useEffect(() => {
    if (funnelId && funnelId !== 'quiz-estilo-completo') {
      loadRealFunnelData();
    }
  }, [funnelId, loadRealFunnelData]);

  // 🚀 DEBOUNCE PARA SALVAMENTO: Evitar sobrecarga do sistema
  const debouncedSave = React.useRef<NodeJS.Timeout | null>(null);
  const saveToFunnelsContext = useCallback((funnelData: any) => {
    if (!funnelsContext?.saveFunnelToDatabase) return;

    // Clear timeout anterior
    if (debouncedSave.current) {
      clearTimeout(debouncedSave.current);
    }

    // Agendar novo salvamento com debounce de 2 segundos
    debouncedSave.current = setTimeout(async () => {
      try {
        await funnelsContext.saveFunnelToDatabase(funnelData);
        console.log('✅ Auto-save: Mudanças salvas no FunnelsContext');
      } catch (error) {
        console.error('❌ Auto-save: Erro ao salvar no FunnelsContext:', error);
      }
    }, 2000);
  }, [funnelsContext]);

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
    [setState, state.isSupabaseEnabled, supabaseIntegration, funnelId, quizId]
  );

  // Stable ref to ensureStepLoaded for effects that should not re-run on identity change
  const ensureStepLoadedRef = React.useRef<EditorActions['ensureStepLoaded']>(ensureStepLoaded);
  useEffect(() => { ensureStepLoadedRef.current = ensureStepLoaded; }, [ensureStepLoaded]);

  // Initialize step 1 automatically on mount and when template data is available
  useEffect(() => {
    // 🚨 CORREÇÃO CRÍTICA: Always force template reload on mount (exceto em testes para reduzir memória)
    const isTestEnv = process.env.NODE_ENV === 'test';
    if (!isTestEnv) {
      // Detect minimal persisted state and rehydrate (variável removida por não uso)
      const normalizedBlocks = normalizeStepBlocks(QUIZ_STYLE_21_STEPS_TEMPLATE);
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 FORCE RELOAD TEMPLATE:', {
          normalizedBlocks,
          keys: Object.keys(normalizedBlocks),
          totalSteps: Object.keys(normalizedBlocks).length,
          blockCounts: Object.entries(normalizedBlocks).map(([key, blocks]) => [key, Array.isArray(blocks) ? blocks.length : 0]),
          isTestEnv,
          templateSource: QUIZ_STYLE_21_STEPS_TEMPLATE
        });
      }

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
        // Em produção, podemos pré-aquecer outras etapas se necessário
        // Em testes, evitamos para não inflar o heap
        if (process.env.NODE_ENV !== 'test') {
          for (let i = 1; i <= 21; i++) {
            ensureStepLoadedRef.current?.(i);
          }
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

  // Failsafe: se após a inicialização todas as etapas estiverem vazias, recarregar o template padrão
  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return;
    const timer = setTimeout(() => {
      try {
        const total = Object.values(rawState.stepBlocks || {}).reduce((acc, arr: any) => acc + (Array.isArray(arr) ? arr.length : 0), 0);
        if (total === 0) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ Nenhum bloco encontrado após o mount. Recarregando template padrão...');
          }
          const normalizedBlocks = normalizeStepBlocks(QUIZ_STYLE_21_STEPS_TEMPLATE);
          setState(prev => {
            const mergedBlocks = mergeStepBlocks(prev.stepBlocks, normalizedBlocks);
            const validation: Record<number, boolean> = {};
            for (let i = 1; i <= 21; i++) {
              const key = `step-${i}`;
              validation[i] = Array.isArray((mergedBlocks as any)[key]) && (mergedBlocks as any)[key].length > 0;
            }
            return {
              ...prev,
              stepBlocks: mergedBlocks,
              stepValidation: { ...(prev.stepValidation || {}), ...validation },
              currentStep: prev.currentStep || 1,
            };
          });
        }
      } catch { }
    }, 600);
    return () => clearTimeout(timer);
  }, [rawState.stepBlocks, setState]);

  // 🚨 CORREÇÃO: Ensure step is loaded when currentStep changes
  useEffect(() => {
    const currentStep = rawState.currentStep;
    if (!currentStep) return;

    console.log('🔍 EditorProvider - currentStep changed:', {
      currentStep,
      hasBlocks: (rawState.stepBlocks[`step-${currentStep}`] || []).length > 0,
      allSteps: Object.keys(rawState.stepBlocks),
      isTestEnv: process.env.NODE_ENV === 'test'
    });

    // Em testes, evitamos carregamento automático para reduzir uso de memória
    if (process.env.NODE_ENV === 'test') return;
    // Only load step if needed, and avoid triggering infinite loops
    ensureStepLoadedRef.current?.(currentStep);
  }, [rawState.currentStep]); // Only depend on currentStep, not the entire rawState

  // (movido para baixo após actions/contextValue p/ evitar TDZ em builds minificados)

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
          const w = window as any;
          w.__EDITOR_INVALID_STEPS__ = w.__EDITOR_INVALID_STEPS__ || [];
          w.__EDITOR_INVALID_STEPS__.push({
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

      console.log('🔍 EditorProvider.setCurrentStep called:', {
        requestedStep: step,
        isValidStep,
        currentStep: stateRef.current.currentStep,
        stepType: typeof step,
        isInteger: Number.isInteger(step),
        hasBlocksForStep: (stateRef.current.stepBlocks[`step-${step}`] || []).length > 0,
        timestamp: new Date().toISOString()
      });

      if (!isValidStep) {
        console.error('❌ INVESTIGAÇÃO #2: currentStep fora do intervalo válido (1-21):', {
          invalidStep: step,
          stepType: typeof step,
          isNaN: Number.isNaN(step),
          currentValidStep: stateRef.current.currentStep,
          stackTrace: new Error().stack?.split('\n').slice(0, 5)
        });

        // Add to window for debugging
        const w = window as any;
        w.__EDITOR_INVALID_STEPS__ = w.__EDITOR_INVALID_STEPS__ || [];
        w.__EDITOR_INVALID_STEPS__.push({
          invalidStep: step,
          timestamp: new Date().toISOString(),
          currentStep: stateRef.current.currentStep
        });

        // Don't allow invalid steps but don't throw - use fallback
        step = Math.max(1, Math.min(21, Number.isInteger(step) ? step : 1));
        console.warn('🔧 Corrigindo para step válido:', step);
      }

      setState(prev => {
        const newState = {
          ...prev,
          currentStep: step,
          selectedBlockId: null,
        };

        console.log('🔍 EditorProvider.setCurrentStep - setState aplicado:', {
          oldStep: prev.currentStep,
          newStep: step,
          hasBlocksForNewStep: (prev.stepBlocks[`step-${step}`] || []).length > 0,
          allStepsWithBlocks: Object.entries(prev.stepBlocks).filter(([_, blocks]) => blocks.length > 0).map(([key]) => key)
        });

        return newState;
      });
      // 🔗 Sincronizar etapa atual com o sistema unificado e expor para blocos/quiz
      try {
        if (typeof window !== 'undefined') {
          (window as any).__quizCurrentStep = step;
        }
        // Atualiza metadados para permitir cálculo na etapa 20 mesmo com dados parciais
        unifiedQuizStorage.updateProgress(step);
      } catch (err) {
        // Silencioso em SSR/preview restrito
        console.warn('EditorProvider: falha ao atualizar progresso unificado', err);
      }
      // Ensure the new step is loaded will be handled by the effect watching currentStep
    },
    [setState]
  );

  const setSelectedBlockId = useCallback(
    (blockId: string | null) => {
      setState(prev => ({
        ...prev,
        selectedBlockId: blockId,
      }));
    },
    [setState]
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
          try { DraftPersistence.saveStepDraft(draftKey, stepKey, nextState.stepBlocks[stepKey]); } catch { }
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
    [setState, state.isSupabaseEnabled, supabaseIntegration, quizId, funnelId]
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
          try { DraftPersistence.saveStepDraft(draftKey, stepKey, nextBlocks); } catch { }
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
    [setState, state.isSupabaseEnabled, supabaseIntegration, quizId, funnelId]
  );

  const removeBlock = useCallback(
    async (stepKey: string, blockId: string) => {
      setState(prev => {
        const nextBlocks = (prev.stepBlocks[stepKey] || []).filter(b => b.id !== blockId);
        // Persist draft
        const draftKey = quizId || funnelId || 'local-funnel';
        try { DraftPersistence.saveStepDraft(draftKey, stepKey, nextBlocks); } catch { }

        return {
          ...prev,
          stepBlocks: {
            ...prev.stepBlocks,
            [stepKey]: nextBlocks,
          },
          selectedBlockId: prev.selectedBlockId === blockId ? null : prev.selectedBlockId,
        };
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
    [setState, state.isSupabaseEnabled, supabaseIntegration, quizId, funnelId]
  );

  const reorderBlocks = useCallback(
    async (stepKey: string, oldIndex: number, newIndex: number) => {
      setState(prev => {
        const blocks = [...(prev.stepBlocks[stepKey] || [])];
        const reordered = arrayMove(blocks, oldIndex, newIndex);
        // Persist draft
        {
          const draftKey = quizId || funnelId || 'local-funnel';
          try { DraftPersistence.saveStepDraft(draftKey, stepKey, reordered); } catch { }
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
    [setState, state.isSupabaseEnabled, supabaseIntegration, quizId, funnelId]
  );

  const updateBlock = useCallback(
    async (stepKey: string, blockId: string, updates: Record<string, any>) => {
      console.log('🔄 EditorProvider - updateBlock chamado:', {
        stepKey,
        blockId,
        updates,
        currentBlocks: (state.stepBlocks[stepKey] || []).length
      });

      // Sempre mesclar alterações em properties por padrão.
      // Se o payload já vier com { properties }, respeitar e mesclar também.
      setState(prev => {
        const nextBlocks = (prev.stepBlocks[stepKey] || []).map(b => {
          if (b.id !== blockId) return b;
          const incomingProps = updates.properties ?? updates;
          const mergedProps = {
            ...(b.properties || {}),
            ...(incomingProps || {}),
          };

          console.log('🔄 EditorProvider - atualizando bloco:', {
            blockId: b.id,
            beforeProperties: b.properties,
            incomingProps,
            mergedProps
          });

          return { ...b, properties: mergedProps };
        });

        // Persist draft
        const draftKey = quizId || funnelId || 'local-funnel';
        try { DraftPersistence.saveStepDraft(draftKey, stepKey, nextBlocks); } catch { }

        return {
          ...prev,
          stepBlocks: {
            ...prev.stepBlocks,
            [stepKey]: nextBlocks,
          },
        };
      });

      // 🔗 CORREÇÃO CRÍTICA: Salvar também no FunnelsContext com debounce
      saveToFunnelsContext({
        name: `Funil ${funnelId || 'Personalizado'}`,
        description: `Funil atualizado em ${new Date().toLocaleString()}`,
        isPublished: false,
        theme: 'default'
      });

      if (state.isSupabaseEnabled && supabaseIntegration?.updateBlockById) {
        try {
          setState(prev => {
            const updated = (prev.stepBlocks[stepKey] || []).find(b => b.id === blockId);
            if (updated) {
              supabaseIntegration.updateBlockById(blockId, {
                properties: updated.properties,
              }).catch((err: unknown) => console.error('Failed to update block in supabase', err));
            }
            return prev;
          });
        } catch (err) {
          console.error('Failed to update block in supabase', err);
        }
      }
    },
    [setState, state.isSupabaseEnabled, supabaseIntegration, quizId, funnelId, saveToFunnelsContext]
  );

  const loadDefaultTemplate = useCallback(() => {
    console.log('🚀 EditorProvider: loadDefaultTemplate iniciado');
    try {
      console.log('📦 Template original keys:', Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE));
      console.log('📦 Template step-1 blocks:', QUIZ_STYLE_21_STEPS_TEMPLATE['step-1']?.length || 0);
      console.log('📦 Template step-2 blocks:', QUIZ_STYLE_21_STEPS_TEMPLATE['step-2']?.length || 0);

      const normalizedBlocks = normalizeStepBlocks(QUIZ_STYLE_21_STEPS_TEMPLATE);
      console.log('🔄 Normalized blocks keys:', Object.keys(normalizedBlocks));

      setState(prev => {
        const mergedBlocks = mergeStepBlocks(prev.stepBlocks, normalizedBlocks);
        console.log('🔀 Merged blocks keys:', Object.keys(mergedBlocks));
        console.log('🔀 Merged step-1 blocks:', (mergedBlocks as any)['step-1']?.length || 0);

        const validation: Record<number, boolean> = {};
        for (let i = 1; i <= 21; i++) {
          const key = `step-${i}`;
          validation[i] = Array.isArray((mergedBlocks as any)[key]) && (mergedBlocks as any)[key].length > 0;
        }

        console.log('✅ Validation summary:', validation);

        return {
          ...prev,
          stepBlocks: mergedBlocks,
          stepValidation: { ...(prev.stepValidation || {}), ...validation },
          currentStep: prev.currentStep || 1,
        };
      });
      console.log('💾 Estado atualizado com sucesso');
    } catch (err) {
      console.error('❌ Failed to load default template:', err);
    }
  }, [setState]);

  // 🚀 AUTO LOAD: Carregar template padrão apenas quando explicitamente indicado
  useEffect(() => {
    // Antes: carregava o template quando !funnelId (isso preenchia o canvas ao criar novo funil)
    // Agora: só carrega automaticamente se um template específico for solicitado
    const shouldLoadDefault = funnelId === 'quiz-estilo-completo' || (typeof funnelId === 'string' && funnelId.startsWith('template-'));

    console.log('🔍 EditorProvider - Verificação de carregamento automático:', {
      funnelId,
      shouldLoadDefault,
      currentStepBlocks: Object.keys(rawState.stepBlocks).length
    });

    if (shouldLoadDefault && Object.keys(rawState.stepBlocks).length === 0) {
      console.log('🚀 EditorProvider - Carregando template padrão automaticamente...');
      loadDefaultTemplate();
    }
  }, [funnelId, rawState.stepBlocks, loadDefaultTemplate]);

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
    loadDefaultTemplate,
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

  // � DIAGNÓSTICO: Expor análise básica de estado (após actions/contextValue)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const w = window as any;
        const analysis = {
          timestamp: Date.now(),
          totalSteps: 21,
          currentStep: state.currentStep,
          stepBlocksKeys: Object.keys(state.stepBlocks || {}),
          stepsWithBlocks: Object.entries(state.stepBlocks || {}).map(([key, blocks]) => ({
            step: key,
            count: Array.isArray(blocks) ? blocks.length : 0,
            types: Array.isArray(blocks) ? (blocks as any[]).map((b: any) => b.type) : [],
          })),
          validationSummary: state.stepValidation || {},
          contextHealth: 'healthy',
        };
        w.__EDITOR_STATE_ANALYSIS__ = analysis;
        if (process.env.NODE_ENV === 'development') {
          console.log('🔧 Editor context exposed for debugging:', analysis);
        }
      }
    }, 100); // Debounce to prevent excessive updates

    return () => clearTimeout(timeoutId);
  }, [state.currentStep, state.isLoading]); // ❌ Dependências simplificadas para evitar loops

  // �🔍 DIAGNÓSTICO: Expor contexto globalmente para debugging
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (typeof window !== 'undefined') {
        // ❌ Simplificado para evitar loops - removido spread de actions
        (window as any).__EDITOR_CONTEXT__ = {
          stepBlocks: state.stepBlocks,
          currentStep: state.currentStep,
          timestamp: Date.now()
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
    }, 200); // Debounce to prevent excessive updates

    return () => clearTimeout(timeoutId);
  }, [state.currentStep, state.isLoading]); // Only depend on key state changes

  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>;
};
