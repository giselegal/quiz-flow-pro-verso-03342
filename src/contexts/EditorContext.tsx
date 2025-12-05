/**
 * 🎯 UNIFIED EDITOR CONTEXT
 * 
 * Contexto centralizado que combina todas as propriedades do editor:
 * - funnelId, currentStep, selectedBlockId
 * - blocks, mode, viewportSize
 * - Actions: selectBlock, updateBlock, setCurrentStep, etc.
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { Block } from '@/types/editor';
import { appLogger } from '@/lib/utils/logger';

// ============================================================================
// TYPES
// ============================================================================

export type EditorMode = 'editor' | 'preview' | 'production';
export type ViewportSize = 'mobile' | 'tablet' | 'desktop' | 'xl';

export interface EditorState {
  // Identificação
  funnelId: string;
  currentStep: number;
  totalSteps: number;
  
  // Seleção
  selectedBlockId: string | null;
  selectedBlockIds: string[]; // Multi-select
  
  // Blocos
  blocks: Block[];
  stepBlocks: Record<string, Block[]>;
  
  // Modo e visualização
  mode: EditorMode;
  viewportSize: ViewportSize;
  isPreviewing: boolean;
  isReadOnly: boolean;
  
  // Estados de UI
  isDragging: boolean;
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  
  // Histórico
  canUndo: boolean;
  canRedo: boolean;
}

export interface EditorActions {
  // Navegação
  setCurrentStep: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  
  // Seleção
  selectBlock: (blockId: string | null) => void;
  selectBlocks: (blockIds: string[]) => void;
  clearSelection: () => void;
  
  // CRUD de blocos
  addBlock: (block: Block, index?: number) => void;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (blockId: string) => void;
  duplicateBlock: (blockId: string) => void;
  reorderBlocks: (oldIndex: number, newIndex: number) => void;
  
  // Modo e visualização
  setMode: (mode: EditorMode) => void;
  setViewportSize: (size: ViewportSize) => void;
  togglePreview: () => void;
  
  // Funil
  setFunnelId: (funnelId: string) => void;
  setStepBlocks: (stepKey: string, blocks: Block[]) => void;
  
  // Histórico
  undo: () => void;
  redo: () => void;
  
  // Persistência
  save: () => Promise<void>;
  markDirty: () => void;
  
  // Drag & Drop
  setIsDragging: (isDragging: boolean) => void;
}

export interface EditorContextValue {
  state: EditorState;
  actions: EditorActions;
}

// ============================================================================
// CONTEXT
// ============================================================================

const EditorContext = createContext<EditorContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

export interface EditorProviderProps {
  children: ReactNode;
  initialFunnelId?: string;
  initialStep?: number;
  initialBlocks?: Block[];
  initialMode?: EditorMode;
  isReadOnly?: boolean;
  onSave?: (blocks: Record<string, Block[]>) => Promise<void>;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({
  children,
  initialFunnelId = '',
  initialStep = 1,
  initialBlocks = [],
  initialMode = 'editor',
  isReadOnly = false,
  onSave,
}) => {
  // Estado principal
  const [funnelId, setFunnelId] = useState(initialFunnelId);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [totalSteps, setTotalSteps] = useState(21);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);
  const [stepBlocks, setStepBlocks] = useState<Record<string, Block[]>>({
    [`step-${initialStep}`]: initialBlocks,
  });
  const [mode, setMode] = useState<EditorMode>(initialMode);
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Histórico para undo/redo
  const [history, setHistory] = useState<Record<string, Block[]>[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Resolver funnelId de URL se não fornecido
  useEffect(() => {
    if (!funnelId && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlFunnelId = params.get('funnel') || params.get('funnelId') || '';
      if (urlFunnelId) {
        setFunnelId(urlFunnelId);
        appLogger.debug('🎯 [EditorContext] funnelId resolvido da URL:', urlFunnelId);
      }
    }
  }, [funnelId]);

  // Blocos do step atual
  const currentStepKey = `step-${currentStep}`;
  const blocks = useMemo(() => stepBlocks[currentStepKey] || [], [stepBlocks, currentStepKey]);

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const selectBlock = useCallback((blockId: string | null) => {
    setSelectedBlockId(blockId);
    setSelectedBlockIds(blockId ? [blockId] : []);
    appLogger.debug('🎯 [EditorContext] Block selecionado:', blockId);
  }, []);

  const selectBlocks = useCallback((blockIds: string[]) => {
    setSelectedBlockIds(blockIds);
    setSelectedBlockId(blockIds[0] || null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedBlockId(null);
    setSelectedBlockIds([]);
  }, []);

  const addBlock = useCallback((block: Block, index?: number) => {
    setStepBlocks(prev => {
      const currentBlocks = prev[currentStepKey] || [];
      const newBlocks = [...currentBlocks];
      
      if (index !== undefined) {
        newBlocks.splice(index, 0, block);
      } else {
        newBlocks.push(block);
      }
      
      // Reordenar
      const reordered = newBlocks.map((b, i) => ({ ...b, order: i }));
      
      return { ...prev, [currentStepKey]: reordered };
    });
    setHasUnsavedChanges(true);
    appLogger.debug('🎯 [EditorContext] Block adicionado:', block.id);
  }, [currentStepKey]);

  const updateBlock = useCallback((blockId: string, updates: Partial<Block>) => {
    setStepBlocks(prev => {
      const currentBlocks = prev[currentStepKey] || [];
      const updatedBlocks = currentBlocks.map(b => 
        b.id === blockId ? { ...b, ...updates } : b
      );
      return { ...prev, [currentStepKey]: updatedBlocks };
    });
    setHasUnsavedChanges(true);
  }, [currentStepKey]);

  const deleteBlock = useCallback((blockId: string) => {
    setStepBlocks(prev => {
      const currentBlocks = prev[currentStepKey] || [];
      const filtered = currentBlocks.filter(b => b.id !== blockId);
      const reordered = filtered.map((b, i) => ({ ...b, order: i }));
      return { ...prev, [currentStepKey]: reordered };
    });
    
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
    setSelectedBlockIds(prev => prev.filter(id => id !== blockId));
    setHasUnsavedChanges(true);
    appLogger.debug('🎯 [EditorContext] Block deletado:', blockId);
  }, [currentStepKey, selectedBlockId]);

  const duplicateBlock = useCallback((blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    const newBlock: Block = {
      ...block,
      id: `${block.type}-${Date.now()}`,
      order: block.order + 1,
    };

    const blockIndex = blocks.findIndex(b => b.id === blockId);
    addBlock(newBlock, blockIndex + 1);
    selectBlock(newBlock.id);
    appLogger.debug('🎯 [EditorContext] Block duplicado:', newBlock.id);
  }, [blocks, addBlock, selectBlock]);

  const reorderBlocks = useCallback((oldIndex: number, newIndex: number) => {
    setStepBlocks(prev => {
      const currentBlocks = [...(prev[currentStepKey] || [])];
      const [moved] = currentBlocks.splice(oldIndex, 1);
      currentBlocks.splice(newIndex, 0, moved);
      const reordered = currentBlocks.map((b, i) => ({ ...b, order: i }));
      return { ...prev, [currentStepKey]: reordered };
    });
    setHasUnsavedChanges(true);
  }, [currentStepKey]);

  const goToNextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      clearSelection();
    }
  }, [currentStep, totalSteps, clearSelection]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      clearSelection();
    }
  }, [currentStep, clearSelection]);

  const togglePreview = useCallback(() => {
    setIsPreviewing(prev => !prev);
    setMode(prev => prev === 'editor' ? 'preview' : 'editor');
  }, []);

  const setStepBlocksAction = useCallback((stepKey: string, newBlocks: Block[]) => {
    setStepBlocks(prev => ({ ...prev, [stepKey]: newBlocks }));
    setHasUnsavedChanges(true);
  }, []);

  // Undo/Redo
  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ ...stepBlocks });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex, stepBlocks]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setStepBlocks(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setStepBlocks(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const save = useCallback(async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(stepBlocks);
      setHasUnsavedChanges(false);
      saveToHistory();
      appLogger.debug('🎯 [EditorContext] Salvo com sucesso');
    } catch (error) {
      appLogger.error('🎯 [EditorContext] Erro ao salvar:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [onSave, stepBlocks, saveToHistory]);

  const markDirty = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const state: EditorState = useMemo(() => ({
    funnelId,
    currentStep,
    totalSteps,
    selectedBlockId,
    selectedBlockIds,
    blocks,
    stepBlocks,
    mode,
    viewportSize,
    isPreviewing,
    isReadOnly,
    isDragging,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  }), [
    funnelId, currentStep, totalSteps, selectedBlockId, selectedBlockIds,
    blocks, stepBlocks, mode, viewportSize, isPreviewing, isReadOnly,
    isDragging, isLoading, isSaving, hasUnsavedChanges, historyIndex, history.length,
  ]);

  const actions: EditorActions = useMemo(() => ({
    setCurrentStep,
    goToNextStep,
    goToPreviousStep,
    selectBlock,
    selectBlocks,
    clearSelection,
    addBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    reorderBlocks,
    setMode,
    setViewportSize,
    togglePreview,
    setFunnelId,
    setStepBlocks: setStepBlocksAction,
    undo,
    redo,
    save,
    markDirty,
    setIsDragging,
  }), [
    goToNextStep, goToPreviousStep, selectBlock, selectBlocks, clearSelection,
    addBlock, updateBlock, deleteBlock, duplicateBlock, reorderBlocks,
    togglePreview, setStepBlocksAction, undo, redo, save, markDirty,
  ]);

  const value: EditorContextValue = useMemo(() => ({ state, actions }), [state, actions]);

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook principal para acessar todo o contexto do editor
 */
export function useEditorContext(): EditorContextValue {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorContext must be used within EditorProvider');
  }
  return context;
}

/**
 * Hook seguro que retorna null se usado fora do provider
 */
export function useEditorContextSafe(): EditorContextValue | null {
  return useContext(EditorContext);
}

/**
 * Hook para acessar apenas o estado do editor
 */
export function useEditorState(): EditorState {
  const { state } = useEditorContext();
  return state;
}

/**
 * Hook para acessar apenas as ações do editor
 */
export function useEditorActions(): EditorActions {
  const { actions } = useEditorContext();
  return actions;
}

/**
 * Hook para acessar o funnelId
 */
export function useEditorFunnelId(): string {
  const { state } = useEditorContext();
  return state.funnelId;
}

/**
 * Hook para acessar o step atual
 */
export function useEditorCurrentStep(): number {
  const { state } = useEditorContext();
  return state.currentStep;
}

/**
 * Hook para acessar o bloco selecionado
 */
export function useSelectedBlock(): Block | null {
  const { state } = useEditorContext();
  return state.blocks.find(b => b.id === state.selectedBlockId) || null;
}

/**
 * Hook para acessar os blocos do step atual
 */
export function useCurrentStepBlocks(): Block[] {
  const { state } = useEditorContext();
  return state.blocks;
}

/**
 * Hook para seleção de bloco
 */
export function useBlockSelection() {
  const { state, actions } = useEditorContext();
  return {
    selectedBlockId: state.selectedBlockId,
    selectedBlockIds: state.selectedBlockIds,
    selectBlock: actions.selectBlock,
    selectBlocks: actions.selectBlocks,
    clearSelection: actions.clearSelection,
  };
}

/**
 * Hook para navegação entre steps
 */
export function useStepNavigation() {
  const { state, actions } = useEditorContext();
  return {
    currentStep: state.currentStep,
    totalSteps: state.totalSteps,
    setCurrentStep: actions.setCurrentStep,
    goToNextStep: actions.goToNextStep,
    goToPreviousStep: actions.goToPreviousStep,
    canGoNext: state.currentStep < state.totalSteps,
    canGoPrevious: state.currentStep > 1,
  };
}

/**
 * Hook para undo/redo
 */
export function useEditorHistory() {
  const { state, actions } = useEditorContext();
  return {
    canUndo: state.canUndo,
    canRedo: state.canRedo,
    undo: actions.undo,
    redo: actions.redo,
  };
}

export default EditorContext;
