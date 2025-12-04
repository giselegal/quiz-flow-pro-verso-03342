/**
 * 🎯 useEditorCanonical - Hook Canônico Consolidado do Editor
 * 
 * Este é o ÚNICO hook que deve ser usado para acessar funcionalidades do editor.
 * Consolida 15+ hooks fragmentados em uma única API unificada.
 * 
 * CONSOLIDA:
 * - useEditorCore (state/actions básicas)
 * - useEditorUnified (detecção automática de contexto)
 * - useEditorAdapter (DEPRECATED)
 * - useEditorActions (operações de bloco)
 * - useEditorHistory (undo/redo)
 * - useEditorPersistence (auto-save)
 * 
 * @example
 * ```typescript
 * import { useEditorCanonical } from '@/hooks/canonical';
 * 
 * function Component() {
 *   const editor = useEditorCanonical();
 *   
 *   // Estado
 *   console.log(editor.currentStep, editor.selectedBlockId);
 *   
 *   // Ações
 *   editor.selectBlock('block-123');
 *   editor.addBlock(1, { type: 'text', ... });
 *   editor.undo();
 * }
 * ```
 * 
 * @version 1.0.0
 * @status CANONICAL
 */

import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { useEditorContext } from '@/core';
import type { Block } from '@/types/editor';

// ============================================================================
// TYPES
// ============================================================================

export interface EditorCanonicalState {
  /** Step atual (1-indexed) */
  currentStep: number;
  /** ID do bloco selecionado */
  selectedBlockId: string | null;
  /** Blocos por step (Record<stepKey, Block[]>) */
  stepBlocks: Record<string, Block[]>;
  /** Indica se está salvando */
  isSaving: boolean;
  /** Última vez que salvou */
  lastSaved: Date | null;
  /** Erro de auto-save */
  autoSaveError: Error | null;
  /** Indica se está carregando */
  isLoading: boolean;
  /** Indica se está em modo preview */
  isPreviewing: boolean;
  /** Indica se há alterações não salvas */
  isDirty: boolean;
  /** Indica se pode desfazer */
  canUndo: boolean;
  /** Indica se pode refazer */
  canRedo: boolean;
}

export interface EditorCanonicalActions {
  // === Navegação ===
  /** Define o step atual */
  setCurrentStep: (step: number) => void;
  /** Navega para o próximo step */
  nextStep: () => void;
  /** Navega para o step anterior */
  previousStep: () => void;
  
  // === Seleção ===
  /** Seleciona um bloco */
  selectBlock: (id: string | null) => void;
  /** Obtém o bloco selecionado */
  getSelectedBlock: () => Block | null;
  /** Limpa a seleção */
  clearSelection: () => void;
  
  // === Blocos ===
  /** Obtém blocos de um step */
  getBlocksForStep: (stepNumber: number) => Block[];
  /** Adiciona um bloco ao step */
  addBlock: (stepNumber: number, block: Block) => void;
  /** Adiciona um bloco em índice específico */
  addBlockAtIndex: (stepNumber: number, block: Block, index: number) => void;
  /** Atualiza um bloco */
  updateBlock: (stepNumber: number, blockId: string, updates: Partial<Block>) => void;
  /** Atualiza o bloco selecionado */
  updateSelectedBlock: (updates: Partial<Block>) => void;
  /** Remove um bloco */
  removeBlock: (stepNumber: number, blockId: string) => void;
  /** Remove o bloco selecionado */
  deleteSelectedBlock: () => void;
  /** Duplica um bloco */
  duplicateBlock: (stepNumber: number, blockId: string) => string | null;
  /** Reordena blocos */
  reorderBlocks: (stepNumber: number, oldIndex: number, newIndex: number) => void;
  /** Define todos os blocos de um step */
  setStepBlocks: (stepNumber: number, blocks: Block[]) => void;
  
  // === Histórico ===
  /** Desfaz última ação */
  undo: () => void;
  /** Refaz última ação desfeita */
  redo: () => void;
  /** Limpa histórico */
  clearHistory: () => void;
  
  // === Persistência ===
  /** Salva manualmente */
  save: () => Promise<void>;
  /** Marca como sujo (alterações não salvas) */
  markDirty: () => void;
  /** Marca como limpo */
  markClean: () => void;
  
  // === Preview ===
  /** Alterna modo preview */
  togglePreview: () => void;
  /** Define modo preview */
  setPreviewMode: (preview: boolean) => void;
}

export interface UseEditorCanonicalResult {
  state: EditorCanonicalState;
  actions: EditorCanonicalActions;
  // Atalhos diretos (conveniência)
  currentStep: number;
  selectedBlockId: string | null;
  blocks: Block[];
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

export interface UseEditorCanonicalOptions {
  /** Se true, não lança erro se contexto não existir */
  optional?: boolean;
  /** Total de steps (para navegação) */
  totalSteps?: number;
}

// ============================================================================
// HISTORY MANAGER (interno)
// ============================================================================

interface HistoryEntry {
  stepBlocks: Record<string, Block[]>;
  timestamp: number;
}

const MAX_HISTORY_SIZE = 50;

function useHistoryManager() {
  const historyRef = useRef<HistoryEntry[]>([]);
  const currentIndexRef = useRef(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const pushState = useCallback((stepBlocks: Record<string, Block[]>) => {
    // Remove estados futuros se estamos no meio do histórico
    if (currentIndexRef.current < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, currentIndexRef.current + 1);
    }
    
    // Adiciona novo estado
    historyRef.current.push({
      stepBlocks: JSON.parse(JSON.stringify(stepBlocks)),
      timestamp: Date.now(),
    });
    
    // Limita tamanho do histórico
    if (historyRef.current.length > MAX_HISTORY_SIZE) {
      historyRef.current.shift();
    } else {
      currentIndexRef.current++;
    }
    
    setCanUndo(currentIndexRef.current > 0);
    setCanRedo(false);
  }, []);

  const undo = useCallback((): HistoryEntry | null => {
    if (currentIndexRef.current <= 0) return null;
    currentIndexRef.current--;
    const entry = historyRef.current[currentIndexRef.current];
    setCanUndo(currentIndexRef.current > 0);
    setCanRedo(true);
    return entry;
  }, []);

  const redo = useCallback((): HistoryEntry | null => {
    if (currentIndexRef.current >= historyRef.current.length - 1) return null;
    currentIndexRef.current++;
    const entry = historyRef.current[currentIndexRef.current];
    setCanUndo(true);
    setCanRedo(currentIndexRef.current < historyRef.current.length - 1);
    return entry;
  }, []);

  const clear = useCallback(() => {
    historyRef.current = [];
    currentIndexRef.current = -1;
    setCanUndo(false);
    setCanRedo(false);
  }, []);

  return { pushState, undo, redo, clear, canUndo, canRedo };
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useEditorCanonical(
  options: UseEditorCanonicalOptions = {}
): UseEditorCanonicalResult {
  const { optional = false, totalSteps = 21 } = options;
  
  // Tenta obter contexto do editor
  let editorContext: any = null;
  try {
    editorContext = useEditorContext();
  } catch (e) {
    if (!optional) {
      throw new Error(
        'useEditorCanonical: Nenhum EditorProvider encontrado. ' +
        'Envolva o componente com EditorStateProvider.'
      );
    }
  }

  const editor = editorContext?.editor;
  const editorState = editor?.state || editor || {};
  const editorActions = editor?.actions || editor || {};

  // Histórico interno
  const history = useHistoryManager();

  // Estado local para dirty/saving
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveError, setAutoSaveError] = useState<Error | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  // Extrai estado do contexto
  const currentStep: number = editorState?.currentStep || 1;
  const selectedBlockId: string | null = editorState?.selectedBlockId || null;
  const stepBlocks: Record<string, Block[]> = editorState?.stepBlocks || {};
  const isLoading: boolean = editorState?.isLoading || false;

  // Helper: gera stepKey
  const getStepKey = useCallback((step: number) => `step-${step}`, []);

  // Helper: obtém blocos de um step
  const getBlocksForStep = useCallback((stepNumber: number): Block[] => {
    const key = getStepKey(stepNumber);
    const blocks = stepBlocks[key];
    return Array.isArray(blocks) ? blocks : [];
  }, [stepBlocks, getStepKey]);

  // Blocos do step atual (conveniência)
  const blocks = useMemo(() => getBlocksForStep(currentStep), [getBlocksForStep, currentStep]);

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const setCurrentStep = useCallback((step: number) => {
    editorActions?.setCurrentStep?.(step);
  }, [editorActions]);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, totalSteps, setCurrentStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, setCurrentStep]);

  const selectBlock = useCallback((id: string | null) => {
    editorActions?.selectBlock?.(id);
  }, [editorActions]);

  const getSelectedBlock = useCallback((): Block | null => {
    if (!selectedBlockId) return null;
    return blocks.find(b => b.id === selectedBlockId) || null;
  }, [selectedBlockId, blocks]);

  const clearSelection = useCallback(() => {
    selectBlock(null);
  }, [selectBlock]);

  const addBlock = useCallback((stepNumber: number, block: Block) => {
    const key = getStepKey(stepNumber);
    editorActions?.addBlock?.(key, block);
    history.pushState(stepBlocks);
    setIsDirty(true);
  }, [editorActions, getStepKey, history, stepBlocks]);

  const addBlockAtIndex = useCallback((stepNumber: number, block: Block, index: number) => {
    const key = getStepKey(stepNumber);
    if (editorActions?.addBlockAtIndex) {
      editorActions.addBlockAtIndex(key, block, index);
    } else {
      // Fallback: adiciona e reordena
      const currentBlocks = getBlocksForStep(stepNumber);
      const newBlocks = [
        ...currentBlocks.slice(0, index),
        block,
        ...currentBlocks.slice(index),
      ];
      editorActions?.setStepBlocks?.(key, newBlocks);
    }
    history.pushState(stepBlocks);
    setIsDirty(true);
  }, [editorActions, getStepKey, getBlocksForStep, history, stepBlocks]);

  const updateBlock = useCallback((stepNumber: number, blockId: string, updates: Partial<Block>) => {
    editorActions?.updateBlock?.(stepNumber, blockId, updates);
    history.pushState(stepBlocks);
    setIsDirty(true);
  }, [editorActions, history, stepBlocks]);

  const updateSelectedBlock = useCallback((updates: Partial<Block>) => {
    if (selectedBlockId) {
      updateBlock(currentStep, selectedBlockId, updates);
    }
  }, [selectedBlockId, currentStep, updateBlock]);

  const removeBlock = useCallback((stepNumber: number, blockId: string) => {
    const key = getStepKey(stepNumber);
    editorActions?.removeBlock?.(key, blockId);
    if (selectedBlockId === blockId) {
      selectBlock(null);
    }
    history.pushState(stepBlocks);
    setIsDirty(true);
  }, [editorActions, getStepKey, selectedBlockId, selectBlock, history, stepBlocks]);

  const deleteSelectedBlock = useCallback(() => {
    if (selectedBlockId) {
      removeBlock(currentStep, selectedBlockId);
    }
  }, [selectedBlockId, currentStep, removeBlock]);

  const duplicateBlock = useCallback((stepNumber: number, blockId: string): string | null => {
    const currentBlocks = getBlocksForStep(stepNumber);
    const blockToDuplicate = currentBlocks.find(b => b.id === blockId);
    if (!blockToDuplicate) return null;

    const newId = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const duplicatedBlock: Block = {
      ...blockToDuplicate,
      id: newId,
      properties: { ...blockToDuplicate.properties },
      content: { ...blockToDuplicate.content },
      order: (blockToDuplicate.order ?? 0) + 1,
    };

    const blockIndex = currentBlocks.findIndex(b => b.id === blockId);
    addBlockAtIndex(stepNumber, duplicatedBlock, blockIndex + 1);
    return newId;
  }, [getBlocksForStep, addBlockAtIndex]);

  const reorderBlocks = useCallback((stepNumber: number, oldIndex: number, newIndex: number) => {
    const key = getStepKey(stepNumber);
    if (editorActions?.reorderBlocks) {
      editorActions.reorderBlocks(key, oldIndex, newIndex);
    } else {
      // Fallback manual
      const currentBlocks = [...getBlocksForStep(stepNumber)];
      const [moved] = currentBlocks.splice(oldIndex, 1);
      if (moved) {
        currentBlocks.splice(newIndex, 0, moved);
        editorActions?.setStepBlocks?.(key, currentBlocks);
      }
    }
    history.pushState(stepBlocks);
    setIsDirty(true);
  }, [editorActions, getStepKey, getBlocksForStep, history, stepBlocks]);

  const setStepBlocks = useCallback((stepNumber: number, newBlocks: Block[]) => {
    const key = getStepKey(stepNumber);
    editorActions?.setStepBlocks?.(key, newBlocks);
    history.pushState(stepBlocks);
    setIsDirty(true);
  }, [editorActions, getStepKey, history, stepBlocks]);

  const undo = useCallback(() => {
    const entry = history.undo();
    if (entry && editorActions?.setStepBlocks) {
      Object.entries(entry.stepBlocks).forEach(([key, blocks]) => {
        editorActions.setStepBlocks(key, blocks);
      });
      setIsDirty(true);
    }
  }, [history, editorActions]);

  const redo = useCallback(() => {
    const entry = history.redo();
    if (entry && editorActions?.setStepBlocks) {
      Object.entries(entry.stepBlocks).forEach(([key, blocks]) => {
        editorActions.setStepBlocks(key, blocks);
      });
      setIsDirty(true);
    }
  }, [history, editorActions]);

  const clearHistory = useCallback(() => {
    history.clear();
  }, [history]);

  const save = useCallback(async () => {
    setIsSaving(true);
    setAutoSaveError(null);
    try {
      await editorActions?.save?.();
      setLastSaved(new Date());
      setIsDirty(false);
    } catch (e) {
      setAutoSaveError(e as Error);
      throw e;
    } finally {
      setIsSaving(false);
    }
  }, [editorActions]);

  const markDirty = useCallback(() => setIsDirty(true), []);
  const markClean = useCallback(() => setIsDirty(false), []);

  const togglePreview = useCallback(() => {
    setIsPreviewing(prev => !prev);
    editorActions?.togglePreview?.();
  }, [editorActions]);

  const setPreviewMode = useCallback((preview: boolean) => {
    setIsPreviewing(preview);
    editorActions?.setPreviewMode?.(preview);
  }, [editorActions]);

  // ============================================================================
  // RETURN
  // ============================================================================

  const state: EditorCanonicalState = useMemo(() => ({
    currentStep,
    selectedBlockId,
    stepBlocks,
    isSaving,
    lastSaved,
    autoSaveError,
    isLoading,
    isPreviewing,
    isDirty,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
  }), [
    currentStep, selectedBlockId, stepBlocks, isSaving, lastSaved,
    autoSaveError, isLoading, isPreviewing, isDirty, history.canUndo, history.canRedo
  ]);

  const actions: EditorCanonicalActions = useMemo(() => ({
    setCurrentStep,
    nextStep,
    previousStep,
    selectBlock,
    getSelectedBlock,
    clearSelection,
    getBlocksForStep,
    addBlock,
    addBlockAtIndex,
    updateBlock,
    updateSelectedBlock,
    removeBlock,
    deleteSelectedBlock,
    duplicateBlock,
    reorderBlocks,
    setStepBlocks,
    undo,
    redo,
    clearHistory,
    save,
    markDirty,
    markClean,
    togglePreview,
    setPreviewMode,
  }), [
    setCurrentStep, nextStep, previousStep, selectBlock, getSelectedBlock,
    clearSelection, getBlocksForStep, addBlock, addBlockAtIndex, updateBlock,
    updateSelectedBlock, removeBlock, deleteSelectedBlock, duplicateBlock,
    reorderBlocks, setStepBlocks, undo, redo, clearHistory, save,
    markDirty, markClean, togglePreview, setPreviewMode
  ]);

  return {
    state,
    actions,
    // Atalhos diretos
    currentStep,
    selectedBlockId,
    blocks,
    isLoading,
    isSaving,
    isDirty,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
  };
}

// ============================================================================
// ALIASES E EXPORTS
// ============================================================================

/** Alias para compatibilidade */
export const useEditor = useEditorCanonical;

/** Versão opcional que não lança erro */
export function useEditorOptional(): UseEditorCanonicalResult | null {
  try {
    return useEditorCanonical({ optional: true });
  } catch {
    return null;
  }
}

export default useEditorCanonical;
