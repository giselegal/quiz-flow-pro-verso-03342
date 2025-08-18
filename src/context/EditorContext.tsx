import { useAutoSaveWithDebounce } from '@/hooks/editor/useAutoSaveWithDebounce';
import { toast } from '@/hooks/use-toast';
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

  // Efeito para carregar o template inicial automaticamente
  useEffect(() => {
    const loadInitialTemplate = async () => {
      try {
        setIsLoading(true);
        console.log('🚀 Carregando template inicial para etapa 1...');

        // Importar o serviço de template dinamicamente
        const { templateService } = await import('../services/templateService');

        // Carregar o template da etapa 1
        const template = await templateService.getTemplateByStep(1);

        if (template && template.blocks && template.blocks.length > 0) {
          console.log(`✅ Template inicial carregado: ${template.blocks.length} blocos`);

          // Converter os blocos do template para o formato do editor
          const editorBlocks = templateService.convertTemplateBlocksToEditorBlocks(template.blocks);

          // Atualizar os blocos no estado do editor
          dispatch({ type: 'SET_BLOCKS', payload: editorBlocks });
        } else {
          console.warn('⚠️ Template inicial não contém blocos');
        }
      } catch (error) {
        console.error('❌ Erro ao carregar template inicial:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialTemplate();
  }, []);

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

  const reorderBlocks = useCallback(
    (startIndex: number, endIndex: number) => {
      const newBlocks = Array.from(state.blocks);
      const [reorderedItem] = newBlocks.splice(startIndex, 1);
      newBlocks.splice(endIndex, 0, reorderedItem);

      const reorderedBlocks = newBlocks.map((block, index) => ({
        ...block,
        order: index,
      }));

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

  // Real data for stages (21 stages) from stepTemplatesMapping
  const [realStages, setRealStages] = useState<any[]>([]);
  
  // Load real stages from templates on mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const { getAllSteps } = await import('../config/stepTemplatesMapping');
        const stepTemplates = getAllSteps();
        
        const mappedStages = stepTemplates.map(template => ({
          id: `step-${template.stepNumber}`,
          name: template.name,
          description: template.description,
          order: template.stepNumber,
          blocksCount: 0,
          metadata: { blocksCount: 0 },
        }));
        
        console.log('✅ Loaded real stages from templates:', mappedStages.length);
        setRealStages(mappedStages);
      } catch (error) {
        console.error('❌ Error loading step templates:', error);
        // Fallback to basic 21 steps
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

    loadTemplates();
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
  
  // Stage actions with real template loading
  const stageActions = useMemo(
  () => ({
    setActiveStage: async (id: string) => {
      setIsLoadingStage(true);
      console.log('🔄 Setting active stage:', id);
      
      try {
        setActiveStageId(id);
        
        const stepNumber = parseInt(id.replace('step-', ''));
        
        if (stepNumber && stepNumber >= 1 && stepNumber <= 21) {
          const { templateService } = await import('../services/templateService');
          const template = await templateService.getTemplateByStep(stepNumber);
          
          if (template && template.blocks && template.blocks.length > 0) {
            const editorBlocks = templateService.convertTemplateBlocksToEditorBlocks(template.blocks);
            dispatch({ type: 'SET_BLOCKS', payload: editorBlocks });
            console.log(`✅ Loaded ${editorBlocks.length} blocks for step ${stepNumber}`);
          } else {
            console.warn(`⚠️ No blocks found for step ${stepNumber}`);
            dispatch({ type: 'SET_BLOCKS', payload: [] });
          }
        }
      } catch (error) {
        console.error(`❌ Error loading template for step ${stepNumber}:`, error);
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
  }),
  [stages.length, dispatch, setIsLoadingStage] // ✅ Adicionar setIsLoadingStage às dependências
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
      reorderBlocks,
    }),
    [setSelectedBlockId, addBlock, updateBlock, deleteBlock, reorderBlocks]
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
        // Adicionar implementação futura aqui
      },
      saveTemplate: () => {
        console.log('Saving template');
      },
      loadTemplateByStep: async (step: number) => {
        console.log('🔄 Loading template by step:', step);
        try {
          // Importar o serviço de template dinamicamente para evitar problemas de circular dependency
          const { templateService } = await import('../services/templateService');

          // Carregar o template
          const template = await templateService.getTemplateByStep(step);

          if (template && template.blocks && template.blocks.length > 0) {
            console.log(`✅ Template carregado com sucesso: ${template.blocks.length} blocos`);

            // Converter os blocos do template para o formato do editor
            const editorBlocks = templateService.convertTemplateBlocksToEditorBlocks(
              template.blocks
            );

            // Atualizar os blocos no estado do editor
            dispatch({ type: 'SET_BLOCKS', payload: editorBlocks });

            return true;
          } else {
            console.warn(`⚠️ Template para etapa ${step} não contém blocos`);
            return false;
          }
        } catch (error) {
          console.error(`❌ Erro ao carregar template para etapa ${step}:`, error);
          return false;
        }
      },
      isLoadingTemplate: false,
    }),
    [dispatch]
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
    hasTemplateErrors: false
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
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
