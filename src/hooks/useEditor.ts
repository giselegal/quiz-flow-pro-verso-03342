/**
 * 🎯 USE EDITOR - HOOK CANÔNICO (FASE 2)
 * 
 * Hook consolidado que mapeia useSuperUnified() para API compatível.
 * Elimina duplicação e mantém compatibilidade com código legado.
 * 
 * API COMPLETA:
 * - state: Estado completo do editor
 * - actions: Todas as ações disponíveis (undo, redo, export, import, etc)
 * - blocks: Blocos do step atual
 * - currentStep: Step ativo
 * - selectedBlockId: Bloco selecionado
 * 
 * MIGRATION PATH:
 * Antes: import { useEditor } from '@/hooks/useEditor' (qualquer versão antiga)
 * Depois: import { useEditor } from '@/hooks/useEditor' (este arquivo)
 * 
 * @version 2.0.0 - Consolidação Fase 2
 */

import { useSuperUnified } from '@/contexts/providers/SuperUnifiedProvider';
import { useMemo, useCallback } from 'react';

export interface EditorActions {
  // Block operations
  addBlock: (stepIndex: number | string, block: any) => void;
  addBlockAtIndex: (stepIndex: number | string, block: any, index?: number) => void;
  updateBlock: (stepIndex: number | string, blockId: string, updates: any) => Promise<void>;
  removeBlock: (stepIndex: number | string, blockId: string) => Promise<void>;
  deleteBlock: (stepIndex: number | string, blockId: string) => Promise<void>;
  reorderBlocks: (stepIndex: number | string, blocks: any[]) => void;
  setStepBlocks: (stepIndex: number | string, blocks: any[]) => void;
  
  // Navigation
  setCurrentStep: (step: number) => void;
  setSelectedBlock: (blockId: string | null) => void;
  setSelectedBlockId: (blockId: string | null) => void; // Alias
  ensureStepLoaded: (stepIndex: number | string) => Promise<void>;
  
  // History
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // Export/Import
  exportJSON: () => string;
  importJSON: (json: string) => void;
  
  // Persistence
  saveFunnel: (funnel?: any) => Promise<void>;
  saveStepBlocks: (stepIndex: number | string) => Promise<void>;
}

export interface EditorState {
  currentStep: number;
  selectedBlockId: string | null;
  isPreviewMode: boolean;
  stepBlocks: Record<number | string, any[]>;
  dirtySteps: Record<number, boolean>;
  isDirty: boolean;
  lastSaved: number | null;
  totalSteps: number;
  funnelSettings: any;
  validationErrors: any[];
  databaseMode?: 'online' | 'offline';
  isLoading?: boolean;
  stepValidation?: Record<number, { isValid: boolean; errors: any[] }>;
}

export interface EditorContextValueMigrated {
  state: EditorState;
  actions: EditorActions;
  
  // Convenience accessors
  blocks: any[];
  currentStep: number;
  selectedBlockId: string | null;
  
  // Computed
  activeStageId: string;
  
  // Legacy compatibility
  computed?: {
    currentStepBlocks: any[];
    isDirty: boolean;
  };
}

/**
 * Hook principal para acessar o editor
 * Mapeia useSuperUnified() para API compatível com código legado
 */
export function useEditor(): EditorContextValueMigrated;
export function useEditor(options: { optional: true }): EditorContextValueMigrated | undefined;
export function useEditor(options?: { optional?: boolean }): EditorContextValueMigrated | undefined {
  try {
    const unified = useSuperUnified();
    
    // Helper: normalize step index
    const normalizeStepIndex = useCallback((stepIndex: number | string): number => {
      return typeof stepIndex === 'string' 
        ? parseInt(stepIndex.replace(/\D/g, ''), 10) || 1
        : stepIndex;
    }, []);
    
    // Mapear actions com API compatível
    const actions: EditorActions = useMemo(() => ({
      // Block operations
      addBlock: (stepIndex: number | string, block: any) => {
        const idx = normalizeStepIndex(stepIndex);
        unified.addBlock(idx, block);
      },
      addBlockAtIndex: (stepIndex: number | string, block: any, index?: number) => {
        const idx = normalizeStepIndex(stepIndex);
        const currentBlocks = unified.state.editor.stepBlocks[idx] || [];
        const insertIndex = index ?? currentBlocks.length;
        const newBlocks = [...currentBlocks];
        newBlocks.splice(insertIndex, 0, block);
        unified.setStepBlocks(idx, newBlocks);
      },
      updateBlock: async (stepIndex: number | string, blockId: string, updates: any) => {
        const idx = normalizeStepIndex(stepIndex);
        await unified.updateBlock(idx, blockId, updates);
      },
      removeBlock: async (stepIndex: number | string, blockId: string) => {
        const idx = normalizeStepIndex(stepIndex);
        await unified.removeBlock(idx, blockId);
      },
      deleteBlock: async (stepIndex: number | string, blockId: string) => {
        const idx = normalizeStepIndex(stepIndex);
        await unified.removeBlock(idx, blockId);
      },
      reorderBlocks: (stepIndex: number | string, blocks: any[]) => {
        const idx = normalizeStepIndex(stepIndex);
        unified.reorderBlocks(idx, blocks);
      },
      setStepBlocks: (stepIndex: number | string, blocks: any[]) => {
        const idx = normalizeStepIndex(stepIndex);
        unified.setStepBlocks(idx, blocks);
      },
      
      // Navigation
      setCurrentStep: unified.setCurrentStep,
      setSelectedBlock: unified.setSelectedBlock,
      setSelectedBlockId: unified.setSelectedBlock, // Alias
      ensureStepLoaded: async (stepIndex: number | string) => {
        // SuperUnified loads steps on demand, no explicit load needed
        return Promise.resolve();
      },
      
      // History
      undo: unified.undo,
      redo: unified.redo,
      canUndo: unified.canUndo,
      canRedo: unified.canRedo,
      
      // Export/Import
      exportJSON: unified.exportJSON,
      importJSON: unified.importJSON,
      
      // Persistence
      saveFunnel: unified.saveFunnel,
      saveStepBlocks: async (stepIndex: number | string) => {
        const idx = normalizeStepIndex(stepIndex);
        await unified.saveStepBlocks(idx);
      },
    }), [unified, normalizeStepIndex]);
    
    // Convenience: blocos do step atual
    const currentStepBlocks = useMemo(() => {
      return unified.state.editor.stepBlocks[unified.state.editor.currentStep] || [];
    }, [unified.state.editor.stepBlocks, unified.state.editor.currentStep]);
    
    return {
      state: {
        ...unified.state.editor,
        databaseMode: 'online',
        isLoading: unified.state.ui.isLoading,
        stepValidation: {},
      },
      actions,
      blocks: currentStepBlocks,
      currentStep: unified.state.editor.currentStep,
      selectedBlockId: unified.state.editor.selectedBlockId,
      activeStageId: unified.activeStageId,
      computed: {
        currentStepBlocks,
        isDirty: unified.state.editor.isDirty,
      },
    };
  } catch (error) {
    if (options?.optional) {
      return undefined;
    }
    throw error;
  }
}

/**
 * Versão opcional do useEditor que retorna undefined se não houver provider
 */
export function useEditorOptional(): EditorContextValueMigrated | undefined {
  return useEditor({ optional: true });
}

/**
 * Aliases para compatibilidade com código legado
 */
export const useUnifiedEditor = useEditor;
export const useUnifiedEditorOptional = useEditorOptional;

/**
 * Hook para acessar apenas blocos do step atual
 */
export const useEditorBlocks = () => {
  const { blocks } = useEditor();
  return blocks;
};

/**
 * Hook para acessar apenas o step atual
 */
export const useCurrentStep = () => {
  const { currentStep } = useEditor();
  return currentStep;
};

export default useEditor;
