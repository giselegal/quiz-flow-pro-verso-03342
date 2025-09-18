import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { Block } from '@/types/editor';

interface EditorState {
  // Estado do Editor
  blocks: Block[];
  selectedBlock: Block | null;
  currentStep: number;
  isPreviewMode: boolean;
  viewMode: 'desktop' | 'mobile';
  
  // Histórico (Undo/Redo)
  history: Block[][];
  historyIndex: number;
  maxHistorySize: number;
  
  // Status
  isSaving: boolean;
  isLoading: boolean;
  lastSaved: Date | null;
  
  // Seletores otimizados
  selectedBlockId: string | null;
  blocksForCurrentStep: Block[];
  
  // Actions
  setBlocks: (blocks: Block[]) => void;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (blockId: string) => void;
  selectBlock: (block: Block | null) => void;
  setCurrentStep: (step: number) => void;
  togglePreview: () => void;
  setViewMode: (mode: 'desktop' | 'mobile') => void;
  
  // History Actions
  undo: () => void;
  redo: () => void;
  pushToHistory: (blocks: Block[]) => void;
  
  // Status Actions
  setSaving: (saving: boolean) => void;
  setLoading: (loading: boolean) => void;
  markSaved: () => void;
  
  // Getters
  canUndo: () => boolean;
  canRedo: () => boolean;
  getBlocksForStep: (step: number) => Block[];
}

export const useUnifiedEditorState = create<EditorState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Estado inicial
      blocks: [],
      selectedBlock: null,
      currentStep: 1,
      isPreviewMode: false,
      viewMode: 'desktop',
      
      // Histórico
      history: [[]],
      historyIndex: 0,
      maxHistorySize: 50,
      
      // Status
      isSaving: false,
      isLoading: false,
      lastSaved: null,
      
      // Seletores computados
      get selectedBlockId() {
        return get().selectedBlock?.id || null;
      },
      
  get blocksForCurrentStep() {
    const { blocks, currentStep } = get();
    return blocks.filter(block => (block as any).step === currentStep);
  },
      
      // Actions
      setBlocks: (blocks) => {
        set({ blocks });
        get().pushToHistory(blocks);
      },
      
      updateBlock: (blockId, updates) => {
        const { blocks } = get();
        const newBlocks = blocks.map(block =>
          block.id === blockId ? { ...block, ...updates } : block
        );
        set({ blocks: newBlocks });
        get().pushToHistory(newBlocks);
      },
      
      deleteBlock: (blockId) => {
        const { blocks, selectedBlock } = get();
        const newBlocks = blocks.filter(block => block.id !== blockId);
        
        set({
          blocks: newBlocks,
          selectedBlock: selectedBlock?.id === blockId ? null : selectedBlock
        });
        get().pushToHistory(newBlocks);
      },
      
      selectBlock: (block) => set({ selectedBlock: block }),
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      togglePreview: () => set((state) => ({ 
        isPreviewMode: !state.isPreviewMode,
        selectedBlock: null // Limpar seleção no preview
      })),
      
      setViewMode: (mode) => set({ viewMode: mode }),
      
      // History Actions
      pushToHistory: (blocks) => {
        const { history, historyIndex, maxHistorySize } = get();
        
        // Remove histórico futuro se estamos no meio da timeline
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push([...blocks]);
        
        // Limita o tamanho do histórico
        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
        }
        
        set({
          history: newHistory,
          historyIndex: newHistory.length - 1
        });
      },
      
      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          set({
            blocks: [...history[newIndex]],
            historyIndex: newIndex,
            selectedBlock: null
          });
        }
      },
      
      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          set({
            blocks: [...history[newIndex]],
            historyIndex: newIndex,
            selectedBlock: null
          });
        }
      },
      
      // Status Actions
      setSaving: (saving) => set({ isSaving: saving }),
      setLoading: (loading) => set({ isLoading: loading }),
      markSaved: () => set({ lastSaved: new Date(), isSaving: false }),
      
      // Getters
      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,
      
  getBlocksForStep: (step) => {
    return get().blocks.filter(block => (block as any).step === step);
  }
    })),
    { name: 'unified-editor-state' }
  )
);

// Hook simplificado para performance monitoring
export const useEditorPerformance = () => {
  return {
    logBlocksCount: (count: number) => {
      console.log(`📊 Editor Performance: ${count} blocks in state`);
    }
  };
};