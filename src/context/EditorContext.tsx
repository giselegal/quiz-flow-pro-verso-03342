import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { EditorState, EditorAction, EditorContextType } from '@/types/editorTypes';
import { Block, BlockType } from '@/types/editor';
import { STEP_TEMPLATES_MAPPING } from '@/config/stepTemplatesMapping';
import { useEffect } from 'react';

const initialState: EditorState = {
  selectedBlockId: null,
  isPreviewing: false,
  blocks: [],
  isGlobalStylesOpen: false,
};

const EditorContext = createContext<EditorContextType | undefined>(undefined);

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
          block.id === action.payload.id ? { ...block, content: action.payload.content } : block
        ),
      };
    case 'DELETE_BLOCK':
      return { ...state, blocks: state.blocks.filter(block => block.id !== action.payload) };
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

const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  // Block Actions
  const addBlock = async (type: BlockType): Promise<string> => {
    const newId = `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newBlock: Block = {
      id: newId,
      type,
      content: {},
      order: state.blocks.length,
      properties: {}
    };

    dispatch({
      type: 'ADD_BLOCK',
      payload: newBlock
    });

    return newId;
  };

  const updateBlock = async (id: string, content: any): Promise<void> => {
    dispatch({
      type: 'UPDATE_BLOCK',
      payload: { id, content }
    });
  };

  const deleteBlock = async (id: string): Promise<void> => {
    dispatch({
      type: 'DELETE_BLOCK',
      payload: id
    });
  };

  const setSelectedBlockId = (id: string | null) => {
    dispatch({
      type: 'SET_SELECTED_BLOCK',
      payload: id
    });
  };

  const reorderBlocks = async (startIndex: number, endIndex: number): Promise<void> => {
    // Implementation for reordering blocks
    console.log('Reordering blocks:', startIndex, endIndex);
  };

  const addBlockAtPosition = async (type: BlockType, position: number): Promise<string> => {
    return addBlock(type);
  };

  // Stage Actions
  const setActiveStage = (stageId: string) => {
    console.log('Setting active stage:', stageId);
  };

  // UI Actions
  const setIsPreviewing = (isPreviewing: boolean) => {
    dispatch({
      type: 'SET_PREVIEW_MODE',
      payload: isPreviewing
    });
  };

  const setViewportSize = (size: 'desktop' | 'tablet' | 'mobile') => {
    console.log('Setting viewport size:', size);
  };

  // Template Actions
  const loadTemplateByStep = async (stepNumber: number) => {
    console.log('Loading template for step:', stepNumber);
  };

  const isLoadingTemplate = false;

  // Persistence Actions
  const saveFunnel = async (): Promise<void> => {
    console.log('Saving funnel');
  };

  const save = async (): Promise<void> => {
    console.log('Saving editor state');
  };

  const load = async (): Promise<void> => {
    console.log('Loading editor state');
  };

  // Quiz State Actions
  const setUserNameFromInput = (name: string) => {
    console.log('Setting user name:', name);
  };

  const answerStrategicQuestion = (questionId: string, answer: any) => {
    console.log('Answering strategic question:', questionId, answer);
  };

  // Computed Values
  const currentBlocks = state.blocks;
  const selectedBlock = state.blocks.find(block => block.id === state.selectedBlockId) || null;
  const stageCount = 21;
  const totalBlocks = state.blocks.length;

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

    // UI State
    selectedBlockId: state.selectedBlockId,
    setGlobalStylesOpen: (open: boolean) => {
      dispatch({ type: 'SET_GLOBAL_STYLES_OPEN', payload: open });
    },

    // Extended Properties
    stages: Array.from({ length: 21 }, (_, i) => ({
      id: `step-${i + 1}`,
      name: `Etapa ${i + 1}`,
      type: i === 0 ? 'intro' : i === 20 ? 'result' : 'question',
      order: i + 1,
      blocks: []
    })),
    activeStageId: 'step-1',
    stageActions: {
      setActiveStage,
      loadTemplateByStep,
      isLoadingTemplate
    },
    blockActions: {
      setSelectedBlockId,
      addBlock,
      updateBlock,
      deleteBlock,
      reorderBlocks,
      addBlockAtPosition
    },
    computed: {
      currentBlocks,
      selectedBlock,
      stageCount,
      totalBlocks
    },
    uiState: {
      isPreviewing: state.isPreviewing,
      isGlobalStylesOpen: state.isGlobalStylesOpen,
      setIsPreviewing,
      viewportSize: 'desktop' as const,
      setViewportSize
    },
    quizState: {
      userName: '',
      answers: [],
      isQuizCompleted: false,
      strategicAnswers: {},
      setUserNameFromInput,
      answerStrategicQuestion
    },
    databaseMode: 'memory' as const,
    templateActions: {
      loadTemplate: (templateId: string) => console.log('Loading template:', templateId),
      saveTemplate: () => console.log('Saving template'),
      loadTemplateByStep,
      isLoadingTemplate
    },
    funnelId: 'default-funnel',
    isSupabaseEnabled: false,
    persistenceActions: {
      save,
      load,
      saveFunnel
    },
    connectionStatus: 'disconnected' as const
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};

const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

export { EditorProvider, useEditor };
