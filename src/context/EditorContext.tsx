
import React, { createContext, useContext, useReducer } from 'react';
import { Block, BlockType } from '@/types/editor';
import { EditorContextType, EditorState, EditorAction } from '@/types/editorTypes';

const EditorContext = createContext<EditorContextType | undefined>(undefined);

const initialState: EditorState = {
  selectedBlockId: null,
  isPreviewing: false,
  blocks: [],
  isGlobalStylesOpen: false,
};

const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case 'SET_BLOCKS':
      return { ...state, blocks: action.payload };
    case 'ADD_BLOCK':
      return { ...state, blocks: [...state.blocks, action.payload] };
    case 'UPDATE_BLOCK':
      return {
        ...state,
        blocks: state.blocks.map(block =>
          block.id === action.payload.id ? { ...block, content: { ...block.content, ...action.payload.content } } : block
        ),
      };
    case 'DELETE_BLOCK':
      return {
        ...state,
        blocks: state.blocks.filter(block => block.id !== action.payload),
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
};

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  // Basic block operations
  const addBlock = async (type: BlockType): Promise<string> => {
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random()}`,
      type,
      content: {},
      order: state.blocks.length,
      properties: {},
    };
    dispatch({ type: 'ADD_BLOCK', payload: newBlock });
    return newBlock.id;
  };

  const updateBlock = async (id: string, content: any): Promise<void> => {
    dispatch({ type: 'UPDATE_BLOCK', payload: { id, content } });
  };

  const deleteBlock = async (id: string): Promise<void> => {
    dispatch({ type: 'DELETE_BLOCK', payload: id });
  };

  const reorderBlocks = async (startIndex: number, endIndex: number): Promise<void> => {
    const newBlocks = Array.from(state.blocks);
    const [removed] = newBlocks.splice(startIndex, 1);
    newBlocks.splice(endIndex, 0, removed);
    dispatch({ type: 'SET_BLOCKS', payload: newBlocks });
  };

  const addBlockAtPosition = async (type: BlockType): Promise<string> => {
    return addBlock(type);
  };

  const setSelectedBlockId = (id: string | null): void => {
    dispatch({ type: 'SET_SELECTED_BLOCK', payload: id });
  };

  const setGlobalStylesOpen = (open: boolean): void => {
    dispatch({ type: 'SET_GLOBAL_STYLES_OPEN', payload: open });
  };

  // Mock stages data
  const mockStages = Array.from({ length: 21 }, (_, i) => ({
    id: `stage-${i + 1}`,
    name: i === 0 ? 'Introdução' : i === 20 ? 'Resultado' : `Pergunta ${i}`,
    type: i === 0 ? 'intro' : i === 20 ? 'result' : 'question',
    order: i + 1,
    blocks: [],
    metadata: {
      description: i === 0 ? 'Página de introdução' : i === 20 ? 'Página de resultado' : `Pergunta ${i}`,
      isActive: i === 0,
      blocksCount: 0,
    },
  }));

  const contextValue: EditorContextType = {
    // Core State
    state,
    dispatch,

    // Basic Actions
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    setSelectedBlockId,
    addBlockAtPosition,
    setGlobalStylesOpen,

    // Extended Properties
    selectedBlockId: state.selectedBlockId,
    stages: mockStages,
    activeStageId: 'stage-1',
    stageActions: {
      setActiveStage: () => {},
      loadTemplateByStep: async () => {},
      isLoadingTemplate: false,
      addStage: () => {},
      removeStage: () => {},
    },
    blockActions: {
      setSelectedBlockId,
      addBlock,
      updateBlock,
      deleteBlock,
      reorderBlocks,
      addBlockAtPosition,
    },
    computed: {
      currentBlocks: state.blocks,
      selectedBlock: state.blocks.find(b => b.id === state.selectedBlockId) || null,
      stageCount: 21,
      totalBlocks: state.blocks.length,
    },
    uiState: {
      isPreviewing: state.isPreviewing,
      isGlobalStylesOpen: state.isGlobalStylesOpen,
      setIsPreviewing: (isPreviewing: boolean) => dispatch({ type: 'SET_PREVIEW_MODE', payload: isPreviewing }),
      viewportSize: 'desktop' as const,
      setViewportSize: () => {},
    },
    quizState: {
      userName: '',
      answers: [],
      isQuizCompleted: false,
      strategicAnswers: {},
      setUserNameFromInput: () => {},
      answerStrategicQuestion: () => {},
    },
    databaseMode: 'memory' as const,
    templateActions: {
      loadTemplate: () => {},
      saveTemplate: () => {},
      loadTemplateByStep: async () => {},
      isLoadingTemplate: false,
    },
    funnelId: 'default',
    isSupabaseEnabled: false,
    persistenceActions: {
      save: async () => {},
      load: async () => {},
      saveFunnel: async () => {},
    },
    connectionStatus: 'connected' as const,
    
    // Additional methods
    selectBlock: setSelectedBlockId,
    togglePreview: () => dispatch({ type: 'SET_PREVIEW_MODE', payload: !state.isPreviewing }),
  };

  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>;
};

export const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
