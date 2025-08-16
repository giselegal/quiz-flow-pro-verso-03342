
import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import { Block, BlockType } from '@/types/editor';
import { EditorState, EditorAction } from '@/types/editorTypes';

// Extended interface with all expected properties
interface EditorContextType {
  // Core state
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  
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
  };
  
  // Computed properties
  computed: {
    currentBlocks: Block[];
    selectedBlock: Block | null;
    stageCount: number;
  };
  
  // UI state object
  uiState: {
    isPreviewing: boolean;
    isGlobalStylesOpen: boolean;
  };
  
  // Quiz state
  quizState: {
    userName: string;
    answers: any[];
    isQuizCompleted: boolean;
  };
  
  // Database mode
  databaseMode: 'local' | 'supabase';
  
  // Template actions
  templateActions: {
    loadTemplate: (templateId: string) => void;
    saveTemplate: () => void;
  };
  
  // Funnel ID
  funnelId: string;
  
  // Supabase enabled
  isSupabaseEnabled: boolean;
  
  // Persistence actions
  persistenceActions: {
    save: () => Promise<void>;
    load: () => Promise<void>;
  };
}

const EditorContext = createContext<EditorContextType | null>(null);

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

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  // Block management functions
  const addBlock = useCallback(async (type: BlockType): Promise<string> => {
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: {},
      properties: {},
      order: state.blocks.length,
    };
    
    dispatch({ type: 'ADD_BLOCK', payload: newBlock });
    return newBlock.id;
  }, [state.blocks.length]);

  const updateBlock = useCallback(async (id: string, content: any): Promise<void> => {
    dispatch({ type: 'UPDATE_BLOCK', payload: { id, updates: content } });
  }, []);

  const deleteBlock = useCallback(async (id: string): Promise<void> => {
    dispatch({ type: 'DELETE_BLOCK', payload: id });
  }, []);

  const reorderBlocks = useCallback((startIndex: number, endIndex: number) => {
    const newBlocks = Array.from(state.blocks);
    const [reorderedItem] = newBlocks.splice(startIndex, 1);
    newBlocks.splice(endIndex, 0, reorderedItem);
    
    const reorderedBlocks = newBlocks.map((block, index) => ({
      ...block,
      order: index,
    }));
    
    dispatch({ type: 'SET_BLOCKS', payload: reorderedBlocks });
  }, [state.blocks]);

  const setSelectedBlockId = useCallback((id: string | null) => {
    dispatch({ type: 'SET_SELECTED_BLOCK', payload: id });
  }, []);

  const setIsPreviewing = useCallback((preview: boolean) => {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: preview });
  }, []);

  const setGlobalStylesOpen = useCallback((open: boolean) => {
    dispatch({ type: 'SET_GLOBAL_STYLES_OPEN', payload: open });
  }, []);

  const selectBlock = useCallback((id: string | null) => {
    setSelectedBlockId(id);
  }, [setSelectedBlockId]);

  const togglePreview = useCallback((preview?: boolean) => {
    setIsPreviewing(preview !== undefined ? preview : !state.isPreviewing);
  }, [state.isPreviewing, setIsPreviewing]);

  const save = useCallback(async () => {
    console.log('Saving editor state');
  }, []);

  // Mock data for stages (21 stages)
  const stages = useMemo(() => {
    return Array.from({ length: 21 }, (_, i) => ({
      id: `step-${i + 1}`,
      name: `Etapa ${i + 1}`,
      order: i + 1,
      blocksCount: 0,
      metadata: { blocksCount: 0 },
    }));
  }, []);

  // Stage actions
  const stageActions = useMemo(() => ({
    setActiveStage: (id: string) => {
      console.log('Setting active stage:', id);
    },
    addStage: () => {
      console.log('Add stage not implemented');
    },
    removeStage: (id: string) => {
      console.log('Remove stage not implemented:', id);
    },
  }), []);

  // Block actions object
  const blockActions = useMemo(() => ({
    setSelectedBlockId,
    addBlock,
    updateBlock,
    deleteBlock,
    addBlockAtPosition: async (type: BlockType, stageId?: string) => {
      return await addBlock(type);
    },
    reorderBlocks,
  }), [setSelectedBlockId, addBlock, updateBlock, deleteBlock, reorderBlocks]);

  // Computed properties
  const computed = useMemo(() => ({
    currentBlocks: state.blocks,
    selectedBlock: state.blocks.find(block => block.id === state.selectedBlockId) || null,
    stageCount: stages.length,
    totalBlocks: state.blocks.length,
  }), [state.blocks, state.selectedBlockId, stages.length]);

  // UI state object
  const uiState = useMemo(() => ({
    isPreviewing: state.isPreviewing,
    isGlobalStylesOpen: state.isGlobalStylesOpen,
    setIsPreviewing,
    viewportSize: 'xl' as const,
    setViewportSize: (size: string) => {
      console.log('Setting viewport size:', size);
    },
  }), [state.isPreviewing, state.isGlobalStylesOpen, setIsPreviewing]);

  // Quiz state
  const quizState = useMemo(() => ({
    userName: '',
    answers: [],
    isQuizCompleted: false,
    strategicAnswers: [],
    setUserNameFromInput: (name: string) => {
      console.log('Setting username:', name);
    },
    answerStrategicQuestion: (questionId: string, optionId: string, category: string, type: string) => {
      console.log('Strategic answer:', { questionId, optionId, category, type });
    },
  }), []);

  // Template actions
  const templateActions = useMemo(() => ({
    loadTemplate: (templateId: string) => {
      console.log('Loading template:', templateId);
    },
    saveTemplate: () => {
      console.log('Saving template');
    },
    loadTemplateByStep: (step: number) => {
      console.log('Loading template by step:', step);
    },
    isLoadingTemplate: false,
  }), []);

  // Persistence actions
  const persistenceActions = useMemo(() => ({
    save: async () => {
      console.log('Saving editor state');
    },
    load: async () => {
      console.log('Loading editor state');
    },
  }), []);

  const contextValue: EditorContextType = {
    // Core state
    state,
    dispatch,
    
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
    
    // Connection status
    connectionStatus: 'connected' as const,
    
    // Stage management
    stages,
    activeStageId: 'step-1',
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
    
    // Funnel ID
    funnelId: 'default-funnel',
    
    // Supabase enabled
    isSupabaseEnabled: false,
    
    // Persistence actions
    persistenceActions,
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
