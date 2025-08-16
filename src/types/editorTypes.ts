
import { Block, BlockType } from './editor';

export interface EditorState {
  selectedBlockId: string | null;
  isPreviewing: boolean;
  blocks: Block[];
  isGlobalStylesOpen: boolean;
}

export interface EditorAction {
  type: 'SET_BLOCKS' | 'ADD_BLOCK' | 'UPDATE_BLOCK' | 'DELETE_BLOCK' | 'SET_SELECTED_BLOCK' | 'SET_PREVIEW_MODE' | 'SET_GLOBAL_STYLES_OPEN';
  payload: any;
}

export interface BlockManipulationActions {
  handleAddBlock: (type: BlockType) => string;
  handleUpdateBlock: (id: string, content: any) => void;
  handleDeleteBlock: (id: string) => void;
  handleReorderBlocks: (sourceIndex: number, destinationIndex: number) => void;
}

export interface EditorProps {
  selectedStyle: {
    category: string;
    score: number;
    percentage: number;
  };
  onShowTemplates?: () => void;
  initialConfig?: any;
}

export interface EditorContextType {
  // Core State
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;

  // Basic Actions
  addBlock: (type: BlockType) => Promise<string>;
  updateBlock: (id: string, content: any) => Promise<void>;
  deleteBlock: (id: string) => Promise<void>;
  reorderBlocks: (startIndex: number, endIndex: number) => Promise<void>;
  setSelectedBlockId: (id: string | null) => void;
  addBlockAtPosition: (type: BlockType, position: number) => Promise<string>;
  setGlobalStylesOpen: (open: boolean) => void;

  // Extended Properties
  selectedBlockId: string | null;
  stages: Array<{
    id: string;
    name: string;
    type: string;
    order: number;
    blocks: Block[];
  }>;
  activeStageId: string;
  stageActions: {
    setActiveStage: (stageId: string) => void;
    loadTemplateByStep: (stepNumber: number) => Promise<void>;
    isLoadingTemplate: boolean;
  };
  blockActions: {
    setSelectedBlockId: (id: string | null) => void;
    addBlock: (type: BlockType) => Promise<string>;
    updateBlock: (id: string, content: any) => Promise<void>;
    deleteBlock: (id: string) => Promise<void>;
    reorderBlocks: (startIndex: number, endIndex: number) => Promise<void>;
    addBlockAtPosition: (type: BlockType, position: number) => Promise<string>;
  };
  computed: {
    currentBlocks: Block[];
    selectedBlock: Block | null;
    stageCount: number;
    totalBlocks: number;
  };
  uiState: {
    isPreviewing: boolean;
    isGlobalStylesOpen: boolean;
    setIsPreviewing: (isPreviewing: boolean) => void;
    viewportSize: 'desktop' | 'tablet' | 'mobile';
    setViewportSize: (size: 'desktop' | 'tablet' | 'mobile') => void;
  };
  quizState: {
    userName: string;
    answers: any[];
    isQuizCompleted: boolean;
    strategicAnswers: Record<string, any>;
    setUserNameFromInput: (name: string) => void;
    answerStrategicQuestion: (questionId: string, answer: any) => void;
  };
  databaseMode: 'memory' | 'supabase';
  templateActions: {
    loadTemplate: (templateId: string) => void;
    saveTemplate: () => void;
    loadTemplateByStep: (stepNumber: number) => Promise<void>;
    isLoadingTemplate: boolean;
  };
  funnelId: string;
  isSupabaseEnabled: boolean;
  persistenceActions: {
    save: () => Promise<void>;
    load: () => Promise<void>;
    saveFunnel: () => Promise<void>;
  };
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
}
