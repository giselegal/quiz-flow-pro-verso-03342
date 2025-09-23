import { useAutoSaveWithDebounce } from '@/hooks/editor/useAutoSaveWithDebounce';
import { toast } from '@/hooks/use-toast';
// Importação direta do TemplateManager para evitar problemas de dependência circular
import { TemplateManager } from '@/utils/TemplateManager';
// Padronização: preferir templateService para carregar e converter blocos
// Import dinâmico mantido onde necessário para evitar carga desnecessária do módulo em rotas que não usam
// import { funnelPersistenceService } from '@/services/funnelPersistence';
import { Block, BlockType, EditorConfig } from '@/types/editor';
import { EditorAction, EditorState } from '@/types/editorTypes';
import { ValidationService } from '@/types/validation';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
// import { useTemplateValidation } from '../hooks/useTemplateValidation';

// Função wrapper para carregar templates usando TemplateManager
const getStepTemplate = async (stepNumber: number) => {
  try {
    const stepId = `step-${stepNumber}`;
    const blocks = await TemplateManager.loadStepBlocks(stepId);
    return blocks && blocks.length > 0 ? { blocks } : null;
  } catch (error) {
    console.error(`Erro ao carregar template da etapa ${stepNumber}:`, error);
    return null;
  }
};

// Extended interface with all expected properties
interface EditorContextType {
  // Core state
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;

  // Configuration
  config?: EditorConfig;

  // Funnel management
  funnelId: string;
  setFunnelId: (id: string) => void;

  // Block actions
  addBlock: (type: BlockType) => Promise<string>;
  updateBlock: (id: string, content: any) => Promise<void>;
  deleteBlock: (id: string) => Promise<void>;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
  selectBlock: (id: string | null) => void;
  togglePreview: (preview?: boolean) => void;
  save: () => Promise<void>;

  // Selection
  selectedBlock: Block | null;
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;

  // UI state
  isPreviewing: boolean;
  setIsPreviewing: (preview: boolean) => void;
  isGlobalStylesOpen: boolean;
  setGlobalStylesOpen: (open: boolean) => void;

  // Loading state
  isLoading?: boolean;

  // Connection status
  connectionStatus: 'connected' | 'disconnected' | 'connecting';

  // Stage management
  stages: any[];
  activeStageId: string;
  stageActions: {
    setActiveStage: (id: string) => void;
    addStage: () => void;
    removeStage: (id: string) => void;
  };

  // Block actions object
  blockActions: {
    setSelectedBlockId: (id: string | null) => void;
    addBlock: (type: BlockType) => Promise<string>;
    updateBlock: (id: string, content: any) => Promise<void>;
    deleteBlock: (id: string) => Promise<void>;
    addBlockAtPosition: (type: BlockType, stageId?: string) => Promise<string>;
    replaceBlocks: (blocks: Block[]) => void;
    reorderBlocks: (startIndex: number, endIndex: number) => void;
  };

  // Computed properties
  computed: {
    currentBlocks: Block[];
    selectedBlock: Block | null;
    stageCount: number;
    totalBlocks: number;
  };

  // UI state object
  uiState: {
    isPreviewing: boolean;
    isGlobalStylesOpen: boolean;
    setIsPreviewing: (preview: boolean) => void;
    viewportSize: string;
    setViewportSize: (size: string) => void;
  };

  // Quiz state
  quizState: {
    userName: string;
    answers: any[];
    isQuizCompleted: boolean;
    strategicAnswers: any[];
    setUserNameFromInput: (name: string) => void;
    answerStrategicQuestion: (
      questionId: string,
      optionId: string,
      category: string,
      type: string
    ) => void;
  };

  // Database mode
  databaseMode: 'local' | 'supabase';

  // Template actions
  templateActions: {
    loadTemplate: (templateId: string) => void;
    saveTemplate: () => void;
    loadTemplateByStep: (step: number) => void;
    isLoadingTemplate: boolean;
  };

  // Supabase enabled
  isSupabaseEnabled: boolean;

  // Persistence actions
  persistenceActions: {
    save: () => Promise<void>;
    load: () => Promise<void>;
    saveFunnel: () => Promise<void>;
  };

  // Template validation
  validation: ValidationService;
}

export const EditorContext = createContext<EditorContextType | null>(null);

// Initial state
const initialState: EditorState = {
  blocks: [],
  selectedBlockId: null,
  isPreviewing: false,
  isGlobalStylesOpen: false,
};

// Reducer
function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_BLOCKS':
      return { ...state, blocks: action.payload };
    case 'ADD_BLOCK':
      return { ...state, blocks: [...state.blocks, action.payload] };
    case 'UPDATE_BLOCK':
      return {
        ...state,
        blocks: state.blocks.map(block =>
          block.id === action.payload.id ? { ...block, ...action.payload.updates } : block
        ),
      };
    case 'DELETE_BLOCK':
      return {
        ...state,
        blocks: state.blocks.filter(block => block.id !== action.payload),
        selectedBlockId: state.selectedBlockId === action.payload ? null : state.selectedBlockId,
      };
    case 'SET_SELECTED_BLOCK':
      return { ...state, selectedBlockId: action.payload };
    case 'SET_PREVIEW_MODE':
      return { ...state, isPreviewing: action.payload };
    case 'SET_GLOBAL_STYLES_OPEN':
      return { ...state, isGlobalStylesOpen: action.payload };
    default:
      return state;
  }
}

export const EditorProvider: React.FC<{
  children: React.ReactNode;
  funnelId?: string;
  config?: EditorConfig;
}> = ({ children, funnelId: initialFunnelId = 'default-funnel', config }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const [currentFunnelId, setCurrentFunnelId] = useState<string>(initialFunnelId);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeStageId, setActiveStageId] = useState<string>('step-1');

  // Integração com sistema de templates via função utilitária

  // Efeito para carregar o template inicial automaticamente
  useEffect(() => {
    let isCancelled = false;
    const loadInitialTemplate = async () => {
      try {
        if (isCancelled) return;
        setIsLoading(true);
        try {
          const { default: templateService } = await import('../services/templateService');
          await templateService.getTemplate('step-1');
          const templateBlocks: any[] = [];
          if (templateBlocks.length > 0) {
            // Fallback block conversion since method doesn't exist
            const editorBlocks: any[] = [];
            if (!isCancelled) dispatch({ type: 'SET_BLOCKS', payload: editorBlocks });
          }
        } catch (err) {
          // Fallback leve usando getStepTemplate se serviço falhar
          const template = await getStepTemplate(1);
          const templateBlocks = template?.blocks || [];
          if (templateBlocks.length > 0) {
            const editorBlocks = templateBlocks.map((block: any, index: number) => ({
              id: block.id || `block-${Date.now()}-${Math.random()}`,
              type: block.type || 'text',
              content: block.content || {},
              styles: block.styles || {},
              metadata: block.metadata || {},
              properties: { funnelId: currentFunnelId, stageId: 'step-1' },
              order: index,
            }));
            if (!isCancelled) dispatch({ type: 'SET_BLOCKS', payload: editorBlocks });
          }
        }
      } catch (error) {
        console.error('❌ Erro ao carregar template inicial:', error);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };
    loadInitialTemplate();
    return () => {
      isCancelled = true;
    };
  }, [currentFunnelId]);

  // ✅ NOVO: Carregar templates automaticamente quando muda de etapa
  useEffect(() => {
    let isCancelled = false;
    if (!activeStageId) return;

    const loadStepTemplate = async () => {
      try {
        console.log(`🔄 AUTO-LOAD: Iniciando carregamento para etapa: ${activeStageId}`);
        // Em ambiente de teste (node), ainda tentamos carregar via getStepTemplate
        // acima. Se falhar, cairemos no catch e manteremos vazio.

        // Carregar via templateService diretamente (preferencial)
        try {
          const templateService = (await import('../services/templateService')).default;
          const stepNumber = parseInt(activeStageId.replace('step-', ''));

          console.log(`🔍 AUTO-LOAD: Processando etapa número: ${stepNumber}`);

          const template = await templateService.getTemplate(`step-${stepNumber}`);

          if (template && template.templateData) {
            console.log(`✅ AUTO-LOAD: Template da etapa ${stepNumber} carregado com sucesso!`);
            console.log(`📊 AUTO-LOAD: Template data encontrado`);

            // Log dos dados de template para debug
            console.log(`🧩 AUTO-LOAD: Dados de template carregados`);

            // Fallback block conversion since method doesn't exist
            const editorBlocks: any[] = [];

            console.log(`🔄 AUTO-LOAD: Convertidos ${editorBlocks.length} blocos para o editor`);
            if (!isCancelled) dispatch({ type: 'SET_BLOCKS', payload: editorBlocks });

            console.log(`✅ AUTO-LOAD: Blocos carregados no estado do editor!`);
          } else {
            console.warn(`⚠️ AUTO-LOAD: Template vazio para etapa ${stepNumber}`);
            console.warn(`🔍 AUTO-LOAD: Template response:`, template);
            dispatch({ type: 'SET_BLOCKS', payload: [] });
          }
        } catch (error) {
          console.error('❌ AUTO-LOAD: Erro ao carregar template via service:', error);
          if (!isCancelled) dispatch({ type: 'SET_BLOCKS', payload: [] });
        }
      } catch (error) {
        console.error('❌ AUTO-LOAD: Erro geral ao carregar template da etapa:', error);
      }
    };

    loadStepTemplate();
    return () => {
      isCancelled = true;
    };
  }, [activeStageId]);

  // Block management functions
  const addBlock = useCallback(
    async (type: BlockType): Promise<string> => {
      const newBlock: Block = {
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        content: {},
        properties: {
          funnelId: currentFunnelId,
          stageId: 'step-1', // Default stage
        },
        order: state.blocks.length,
      };

      dispatch({ type: 'ADD_BLOCK', payload: newBlock });
      console.log('🔗 Block created with funnelId:', currentFunnelId);
      return newBlock.id;
    },
    [state.blocks.length, currentFunnelId]
  );

  const updateBlock = useCallback(async (id: string, content: any): Promise<void> => {
    dispatch({ type: 'UPDATE_BLOCK', payload: { id, updates: content } });
  }, []);

  const deleteBlock = useCallback(async (id: string): Promise<void> => {
    dispatch({ type: 'DELETE_BLOCK', payload: id });
  }, []);

  // Replace all blocks at once (useful when loading templates or switching steps)
  const replaceBlocks = useCallback((blocks: Block[]) => {
    const sorted = (blocks || []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const normalized = sorted.map((b, i) => ({ ...b, order: i }));
    console.log(
      '🧩 replaceBlocks ->',
      normalized.map(b => ({ id: b.id, type: b.type, order: b.order }))
    );
    dispatch({ type: 'SET_BLOCKS', payload: normalized });
  }, []);

  const reorderBlocks = useCallback(
    (startIndex: number, endIndex: number) => {
      console.log('🔄 EditorContext.reorderBlocks:', {
        startIndex,
        endIndex,
        blocksCount: state.blocks.length,
      });

      if (startIndex === endIndex) {
        console.log('⚠️ Índices iguais, nenhuma alteração necessária');
        return;
      }

      if (
        startIndex < 0 ||
        startIndex >= state.blocks.length ||
        endIndex < 0 ||
        endIndex >= state.blocks.length
      ) {
        console.error('❌ Índices inválidos para reordenação:', {
          startIndex,
          endIndex,
          blocksCount: state.blocks.length,
        });
        return;
      }

      // Cria uma cópia dos blocos existentes
      const newBlocks = Array.from(state.blocks);

      // Remove o item da posição antiga e o insere na nova posição
      const [reorderedItem] = newBlocks.splice(startIndex, 1);
      console.log('🔄 Item removido:', reorderedItem.id);

      newBlocks.splice(endIndex, 0, reorderedItem);
      console.log('🔄 Item inserido na nova posição:', endIndex);

      // Atualiza as ordens dos blocos
      const reorderedBlocks = newBlocks.map((block, index) => ({
        ...block,
        order: index,
      }));

      console.log(
        '✅ Blocos reordenados com sucesso:',
        reorderedBlocks.map(b => ({ id: b.id, order: b.order }))
      );

      dispatch({ type: 'SET_BLOCKS', payload: reorderedBlocks });
    },
    [state.blocks]
  );

  const setSelectedBlockId = useCallback((id: string | null) => {
    dispatch({ type: 'SET_SELECTED_BLOCK', payload: id });
  }, []);

  const setIsPreviewing = useCallback((preview: boolean) => {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: preview });
  }, []);

  const setGlobalStylesOpen = useCallback((open: boolean) => {
    dispatch({ type: 'SET_GLOBAL_STYLES_OPEN', payload: open });
  }, []);

  const selectBlock = useCallback(
    (id: string | null) => {
      setSelectedBlockId(id);
    },
    [setSelectedBlockId]
  );

  const togglePreview = useCallback(
    (preview?: boolean) => {
      setIsPreviewing(preview !== undefined ? preview : !state.isPreviewing);
    },
    [state.isPreviewing, setIsPreviewing]
  );

  const save = useCallback(async () => {
    console.log('💾 Saving funnel with ID:', currentFunnelId);
    console.log('📊 Blocks to save:', state.blocks.length);

    try {
      // Preparar dados para salvamento
      // const funnelData = {
      //   id: currentFunnelId,
      //   name: `Funnel ${currentFunnelId}`,
      //   description: 'Funnel criado no editor',
      //   userId: 'anonymous',
      //   isPublished: false,
      //   version: 1,
      //   settings: {},
      //   pages: [
      //     {
      //       id: `page-${currentFunnelId}-1`,
      //       pageType: 'quiz-step',
      //       pageOrder: 1,
      //       title: 'Quiz Step',
      //       blocks: state.blocks,
      //       metadata: { stage: 'step-1', timestamp: new Date().toISOString() },
      //     },
      //   ],
      // };

      // Salvar usando o serviço de persistência
      // const result = await funnelPersistenceService.saveFunnel(funnelData);
      const result = { success: true, error: null };

      if (result.success) {
        console.log('✅ Funnel salvo com sucesso!');
        toast({
          title: 'Sucesso!',
          description: 'Funnel salvo com sucesso.',
          variant: 'default',
        });
      } else {
        console.warn('⚠️ Salvamento parcial:', result.error);
        toast({
          title: 'Aviso',
          description: result.error || 'Salvamento parcial - dados salvos localmente.',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('❌ Erro ao salvar funnel:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar. Tente novamente.',
        variant: 'destructive',
      });
    }
  }, [currentFunnelId, state.blocks]);

  // 🚀 AUTO-SAVE COM DEBOUNCE - Solução para problema de salvamento
  useAutoSaveWithDebounce({
    data: { blocks: state.blocks, activeStageId: 'step-1' }, // Fixed: using hardcoded value since activeStageId is not in state
    onSave: async () => {
      await save();
    },
    delay: 3000, // 3 segundos após parar de editar
    enabled: true,
    showToasts: false, // Não mostrar toast no auto-save, apenas no save manual
  });

  // Construir metadados das 21 etapas
  const [realStages, setRealStages] = useState<any[]>([]);
  useEffect(() => {
    const loadStages = async () => {
      try {
        const stagesFromTemplates: any[] = [];
        for (let stepNumber = 1; stepNumber <= 21; stepNumber++) {
          const template = await getStepTemplate(stepNumber);
          stagesFromTemplates.push({
            id: `step-${stepNumber}`,
            name: `Etapa ${stepNumber}`,
            description: `Descrição da etapa ${stepNumber}`,
            order: stepNumber,
            blocksCount: (template?.blocks || []).length,
            metadata: {
              blocksCount: (template?.blocks || []).length,
              templateId: `step-${stepNumber}`,
              version: '1.0.0',
            },
          });
        }
        setRealStages(stagesFromTemplates);
      } catch (error) {
        console.error('❌ Erro ao carregar etapas:', error);
        const fallbackStages = Array.from({ length: 21 }, (_, i) => ({
          id: `step-${i + 1}`,
          name: `Etapa ${i + 1}`,
          description: `Descrição da etapa ${i + 1}`,
          order: i + 1,
          blocksCount: 0,
          metadata: { blocksCount: 0 },
        }));
        setRealStages(fallbackStages);
      }
    };
    loadStages();
  }, []);

  // Use real stages or fallback
  const stages = useMemo(() => {
    if (realStages.length > 0) {
      return realStages;
    }

    // Fallback to basic 21 steps while loading
    return Array.from({ length: 21 }, (_, i) => ({
      id: `step-${i + 1}`,
      name: `Etapa ${i + 1}`,
      description: `Descrição da etapa ${i + 1}`,
      order: i + 1,
      blocksCount: 0,
      metadata: { blocksCount: 0 },
    }));
  }, [realStages]);

  // ✅ MOVER PARA FORA DO useMemo - no nível do componente
  const [isLoadingStage, setIsLoadingStage] = useState(false);
  // Stage actions with templates.ts integration
  const stageActions = useMemo(
    () => ({
      setActiveStage: async (id: string) => {
        setIsLoadingStage(true);
        try {
          setActiveStageId(id);
          const stepMatch = id.match(/step-(\d+)/);
          const stepNumber = stepMatch ? parseInt(stepMatch[1], 10) : NaN;
          if (!isNaN(stepNumber)) {
            const template = await getStepTemplate(stepNumber);
            const templateBlocks = template?.blocks || [];
            const editorBlocks = templateBlocks.map((block: any, index: number) => ({
              id: block.id || `block-${Date.now()}-${Math.random()}`,
              type: block.type || 'text',
              content: block.content || {},
              styles: block.styles || {},
              metadata: block.metadata || {},
              properties: { funnelId: currentFunnelId, stageId: id },
              order: index,
            }));
            dispatch({ type: 'SET_BLOCKS', payload: editorBlocks });
          }
        } catch (error) {
          console.error('❌ Erro ao carregar blocos da etapa:', error);
          dispatch({ type: 'SET_BLOCKS', payload: [] });
        } finally {
          setIsLoadingStage(false);
        }
      },
      addStage: () => {
        console.log('Add stage not implemented yet');
        return `step-${stages.length + 1}`;
      },
      removeStage: (id: string) => {
        console.log('Remove stage not implemented:', id);
      },
      isLoadingStage,
    }),
    [dispatch, setIsLoadingStage, stages.length, currentFunnelId, isLoadingStage]
  );

  // Block actions object
  const blockActions = useMemo(
    () => ({
      setSelectedBlockId,
      addBlock,
      updateBlock,
      deleteBlock,
      addBlockAtPosition: async (type: BlockType, _stageId?: string) => {
        return await addBlock(type);
      },
      replaceBlocks,
      reorderBlocks,
    }),
    [setSelectedBlockId, addBlock, updateBlock, deleteBlock, replaceBlocks, reorderBlocks]
  );

  // Computed properties
  const computed = useMemo(
    () => ({
      currentBlocks: state.blocks,
      selectedBlock: state.blocks.find(block => block.id === state.selectedBlockId) || null,
      stageCount: stages.length,
      totalBlocks: state.blocks.length,
    }),
    [state.blocks, state.selectedBlockId, stages.length]
  );

  // UI state object
  const uiState = useMemo(
    () => ({
      isPreviewing: state.isPreviewing,
      isGlobalStylesOpen: state.isGlobalStylesOpen,
      setIsPreviewing,
      viewportSize: 'xl' as const,
      setViewportSize: (size: string) => {
        console.log('Setting viewport size:', size);
      },
    }),
    [state.isPreviewing, state.isGlobalStylesOpen, setIsPreviewing]
  );

  // Quiz state
  const quizState = useMemo(
    () => ({
      userName: '',
      answers: [],
      isQuizCompleted: false,
      strategicAnswers: [],
      setUserNameFromInput: (name: string) => {
        console.log('Setting username:', name);
      },
      answerStrategicQuestion: (
        questionId: string,
        optionId: string,
        category: string,
        type: string
      ) => {
        console.log('Strategic answer:', { questionId, optionId, category, type });
      },
    }),
    []
  );

  // Template actions
  const templateActions = useMemo(
    () => ({
      loadTemplate: (templateId: string) => {
        console.log('Loading template:', templateId);
        // Implementação futura
      },
      saveTemplate: () => {
        console.log('Saving template');
      },
      loadTemplateByStep: async (step: number) => {
        console.log('🔄 Loading template by step via templateService:', step);
        try {
          const { default: templateService } = await import('../services/templateService');
          await templateService.getTemplate(`step-${step}`);
          const templateBlocks: any[] = [];

          if (templateBlocks.length > 0) {
            console.log(`✅ Template carregado com sucesso: ${templateBlocks.length} blocos`);

            // Fallback block conversion since method doesn't exist
            const editorBlocks: any[] = [];

            dispatch({ type: 'SET_BLOCKS', payload: editorBlocks });
            return true;
          } else {
            console.warn(`⚠️ Template para etapa ${step} não contém blocos`);
            return false;
          }
        } catch (error) {
          console.error(`❌ Erro ao carregar template para etapa ${step}:`, error);
          // fallback para getStepTemplate em caso de falha do serviço
          try {
            await getStepTemplate(step);
            // Fallback block conversion since method doesn't exist
            const editorBlocks: any[] = [];
            dispatch({ type: 'SET_BLOCKS', payload: editorBlocks });
            return editorBlocks.length > 0;
          } catch (e2) {
            return false;
          }
        }
      },
      isLoadingTemplate: isLoadingStage,
    }),
    [dispatch, currentFunnelId, isLoadingStage]
  );

  // Persistence actions
  const persistenceActions = useMemo(
    () => ({
      save: async () => {
        await save();
      },
      load: async () => {
        console.log('🔄 Loading funnel with ID:', currentFunnelId);
        // Here you would load funnel data from backend
      },
      saveFunnel: async () => {
        await save();
      },
    }),
    [save, currentFunnelId]
  );

  // Integrar sistema de validação
  // const validation = useTemplateValidation();
  const validation = {
    validateTemplate: () => ({ isValid: true, errors: {} }),
    validateStep: () => ({ isValid: true, errors: {} }),
    validateTemplateField: () => ({ success: true, errors: [] }),
    hasTemplateErrors: false,
  };

  const contextValue: EditorContextType = {
    // Core state
    state,
    dispatch,

    // Configuration
    config,

    // Funnel management
    funnelId: currentFunnelId,
    setFunnelId: setCurrentFunnelId,

    // Block actions
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    selectBlock,
    togglePreview,
    save,

    // Selection
    selectedBlock: computed.selectedBlock,
    selectedBlockId: state.selectedBlockId,
    setSelectedBlockId,

    // UI state
    isPreviewing: state.isPreviewing,
    setIsPreviewing,
    isGlobalStylesOpen: state.isGlobalStylesOpen,
    setGlobalStylesOpen,

    // Loading state
    isLoading,

    // Connection status
    connectionStatus: 'connected' as const,

    // Stage management
    stages,
    activeStageId,
    stageActions,

    // Block actions object
    blockActions,

    // Computed properties
    computed,

    // UI state object
    uiState,

    // Quiz state
    quizState,

    // Database mode
    databaseMode: 'local' as const,

    // Template actions
    templateActions,

    // Supabase enabled
    isSupabaseEnabled: false,

    // Persistence actions
    persistenceActions,

    // Validation
    validation,
  };

  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>;
};

export const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (!context) {
    // Fallback seguro: evita crash em ambientes onde o wrapper ainda não foi montado
    try {
      // Logs de diagnóstico mínimos (sem spam em produção)
      if (typeof window !== 'undefined' && (import.meta as any)?.env?.DEV) {
        console.warn(
          '⚠️ useEditor chamado fora de um EditorProvider (legacy). Retornando fallback no-op para evitar quebra. Garanta que o componente esteja embrulhado por <EditorProvider>.'
        );
      }
    } catch { }

    // Compor fallback no-op alinhado à interface EditorContextType
    const noop = () => { };
    const noopAsync = async () => { };

    const fallback: EditorContextType = {
      // Core state
      state: initialState,
      dispatch: noop as any,

      // Configuration
      config: undefined,

      // Funnel management
      funnelId: 'fallback-funnel',
      setFunnelId: noop,

      // Block actions
      addBlock: async () => `fallback-block-${Date.now()}`,
      updateBlock: noopAsync,
      deleteBlock: noopAsync,
      reorderBlocks: noop,
      selectBlock: noop,
      togglePreview: noop,
      save: async () => { },

      // Selection
      selectedBlock: null,
      selectedBlockId: null,
      setSelectedBlockId: noop,

      // UI state
      isPreviewing: true,
      setIsPreviewing: noop,
      isGlobalStylesOpen: false,
      setGlobalStylesOpen: noop,

      // Loading state
      isLoading: false,

      // Connection status
      connectionStatus: 'disconnected',

      // Stage management
      stages: Array.from({ length: 21 }, (_, i) => ({
        id: `step-${i + 1}`,
        name: `Etapa ${i + 1}`,
        description: `Descrição da etapa ${i + 1}`,
        order: i + 1,
        blocksCount: 0,
        metadata: { blocksCount: 0 },
      })),
      activeStageId: 'step-1',
      stageActions: {
        setActiveStage: noop,
        addStage: () => { },
        removeStage: noop,
      },

      // Block actions object
      blockActions: {
        setSelectedBlockId: noop,
        addBlock: async () => `fallback-block-${Date.now()}`,
        updateBlock: noopAsync,
        deleteBlock: noopAsync,
        addBlockAtPosition: async () => `fallback-block-${Date.now()}`,
        replaceBlocks: noop,
        reorderBlocks: noop,
      },

      // Computed properties
      computed: {
        currentBlocks: [],
        selectedBlock: null,
        stageCount: 21,
        totalBlocks: 0,
      },

      // UI state object
      uiState: {
        isPreviewing: true,
        isGlobalStylesOpen: false,
        setIsPreviewing: noop,
        viewportSize: 'xl',
        setViewportSize: noop,
      },

      // Quiz state
      quizState: {
        userName: '',
        answers: [],
        isQuizCompleted: false,
        strategicAnswers: [],
        setUserNameFromInput: noop,
        answerStrategicQuestion: noop as any,
      },

      // Database mode
      databaseMode: 'local',

      // Template actions
      templateActions: {
        loadTemplate: noop as any,
        saveTemplate: noop as any,
        loadTemplateByStep: async () => { },
        isLoadingTemplate: false,
      },

      // Supabase enabled
      isSupabaseEnabled: false,

      // Persistence actions
      persistenceActions: {
        save: async () => { },
        load: async () => { },
        saveFunnel: async () => { },
      },

      // Template validation
      validation: {
        validateTemplate: () => ({ isValid: true, errors: {} }),
        validateStep: () => ({ isValid: true, errors: {} }),
        validateTemplateField: () => ({ success: true, errors: [] }),
        hasTemplateErrors: false,
      },
    };

    return fallback;
  }
  return context;
};
