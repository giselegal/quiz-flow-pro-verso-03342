import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { Block, BlockType, FunnelStage } from '@/types/editor';
import { EditorContextType, EditorState, EditorAction } from '@/types/editorTypes';

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
};

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  // Mock stages data
  const stages: FunnelStage[] = useMemo(() => [
    {
      id: 'stage-1',
      name: 'Introduction',
      type: 'intro',
      order: 1,
      blocks: [],
      metadata: { description: 'Quiz introduction stage' }
    },
    {
      id: 'stage-2', 
      name: 'Questions',
      type: 'questions',
      order: 2,
      blocks: [],
      metadata: { description: 'Quiz questions stage' }
    },
    {
      id: 'stage-3',
      name: 'Results',
      type: 'results',
      order: 3,
      blocks: [],
      metadata: { description: 'Quiz results stage' }
    }
  ], []);

  const activeStageId = 'stage-1';

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
    dispatch({ type: 'UPDATE_BLOCK', payload: { id, updates: { content } } });
  };

  const deleteBlock = async (id: string): Promise<void> => {
    dispatch({ type: 'DELETE_BLOCK', payload: id });
  };

  const reorderBlocks = async (startIndex: number, endIndex: number): Promise<void> => {
    const newBlocks = [...state.blocks];
    const [removed] = newBlocks.splice(startIndex, 1);
    newBlocks.splice(endIndex, 0, removed);
    
    const reorderedBlocks = newBlocks.map((block, index) => ({
      ...block,
      order: index,
    }));
    
    dispatch({ type: 'SET_BLOCKS', payload: reorderedBlocks });
  };

  const addBlockAtPosition = async (type: BlockType): Promise<string> => {
    return addBlock(type);
  };

  const setSelectedBlockId = (id: string | null) => {
    dispatch({ type: 'SET_SELECTED_BLOCK', payload: id });
  };

  const setGlobalStylesOpen = (open: boolean) => {
    dispatch({ type: 'SET_GLOBAL_STYLES_OPEN', payload: open });
  };

  // Stage actions
  const stageActions = {
    setActiveStage: (stageId: string) => void console.log('Set active stage:', stageId),
    loadTemplateByStep: async (stepNumber: number) => void console.log('Load template:', stepNumber),
    isLoadingTemplate: false,
  };

  // Block actions
  const blockActions = {
    setSelectedBlockId,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    addBlockAtPosition,
  };

  // Computed values
  const computed = {
    currentBlocks: state.blocks,
    selectedBlock: state.blocks.find(block => block.id === state.selectedBlockId) || null,
    stageCount: stages.length,
    totalBlocks: state.blocks.length,
  };

  // UI state
  const uiState = {
    isPreviewing: state.isPreviewing,
    isGlobalStylesOpen: state.isGlobalStylesOpen,
    setIsPreviewing: (isPreviewing: boolean) => dispatch({ type: 'SET_PREVIEW_MODE', payload: isPreviewing }),
    viewportSize: 'desktop' as const,
    setViewportSize: (size: 'desktop' | 'tablet' | 'mobile') => void console.log('Set viewport:', size),
  };

  // Quiz state
  const quizState = {
    userName: '',
    answers: [],
    isQuizCompleted: false,
    strategicAnswers: {},
    setUserNameFromInput: (name: string) => void console.log('Set username:', name),
    answerStrategicQuestion: (questionId: string, answer: any) => void console.log('Answer:', questionId, answer),
  };

  // Template actions
  const templateActions = {
    loadTemplate: (templateId: string) => void console.log('Load template:', templateId),
    saveTemplate: () => void console.log('Save template'),
    loadTemplateByStep: async (stepNumber: number) => void console.log('Load template by step:', stepNumber),
    isLoadingTemplate: false,
  };

  // Persistence actions
  const persistenceActions = {
    save: async () => void console.log('Save'),
    load: async () => void console.log('Load'),
    saveFunnel: async () => void console.log('Save funnel'),
  };

  const contextValue: EditorContextType = {
    state,
    dispatch,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    setSelectedBlockId,
    addBlockAtPosition,
    setGlobalStylesOpen,
    selectedBlockId: state.selectedBlockId,
    stages,
    activeStageId,
    stageActions,
    blockActions,
    computed,
    uiState,
    quizState,
    databaseMode: 'memory' as const,
    templateActions,
    funnelId: 'default-funnel',
    isSupabaseEnabled: false,
    persistenceActions,
    connectionStatus: 'connected' as const,
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
