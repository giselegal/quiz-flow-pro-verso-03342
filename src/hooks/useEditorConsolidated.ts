/**
 * 🎯 USE EDITOR CONSOLIDADO - Hook Principal
 * 
 * Hook consolidado que unifica 50+ hooks fragmentados do editor.
 * Usa as stores Zustand como fonte única de verdade.
 * 
 * SUBSTITUI:
 * - useEditor (EditorWrapper)
 * - useConsolidatedEditor
 * - useOptimizedBlockOperations
 * - useOptimizedQuizFlow
 * - useEditorIntegration
 * - useBlockOperations
 * - useStepNavigation
 * - useEditorState
 * - E 40+ outros hooks fragmentados
 * 
 * USO:
 * ```tsx
 * const editor = useEditorConsolidated();
 * 
 * // Acessar estado
 * console.log(editor.currentStep);
 * console.log(editor.selectedBlock);
 * 
 * // Executar ações
 * editor.addBlock('header', { title: 'Novo Header' });
 * editor.nextStep();
 * editor.save();
 * ```
 */

import { useCallback } from 'react';
import {
  useEditorStore,
  useCurrentStep,
  useCurrentStepBlocks,
  useSelectedBlock,
  useEditorMode,
  useEditorDirtyState,
} from '@/store/editorStore';
import type { BlockType } from '@/types/editor';

// ============================================================================
// HOOK CONSOLIDADO
// ============================================================================

export function useEditorConsolidated() {
  // Estado da store
  const store = useEditorStore();
  const currentStep = useCurrentStep();
  const currentStepBlocks = useCurrentStepBlocks();
  const selectedBlock = useSelectedBlock();
  const { isEditMode, isPreviewMode } = useEditorMode();
  const { isDirty, isSaving } = useEditorDirtyState();

  // ============================================================================
  // BLOCK OPERATIONS
  // ============================================================================

  const addBlock = useCallback(
    (type: BlockType, properties?: any) => {
      return store.addBlock(type, properties);
    },
    [store],
  );

  const updateBlock = useCallback(
    (blockId: string, updates: any) => {
      store.updateBlock(blockId, updates);
    },
    [store],
  );

  const removeBlock = useCallback(
    (blockId: string) => {
      store.removeBlock(blockId);
    },
    [store],
  );

  const duplicateBlock = useCallback(
    (blockId: string) => {
      store.duplicateBlock(blockId);
    },
    [store],
  );

  const reorderBlocks = useCallback(
    (startIndex: number, endIndex: number) => {
      store.reorderBlocks(startIndex, endIndex);
    },
    [store],
  );

  const selectBlock = useCallback(
    (blockId: string | null) => {
      store.setSelectedBlock(blockId);
    },
    [store],
  );

  // ============================================================================
  // STEP OPERATIONS
  // ============================================================================

  const addStep = useCallback(
    (name: string, position?: number) => {
      store.addStep(name, position);
    },
    [store],
  );

  const removeStep = useCallback(
    (stepId: string) => {
      store.removeStep(stepId);
    },
    [store],
  );

  const goToStep = useCallback(
    (stepId: string) => {
      store.setCurrentStep(stepId);
    },
    [store],
  );

  const nextStep = useCallback(() => {
    const currentIndex = store.steps.findIndex((s) => s.id === store.currentStepId);
    if (currentIndex < store.steps.length - 1) {
      store.setCurrentStep(store.steps[currentIndex + 1].id);
    }
  }, [store]);

  const previousStep = useCallback(() => {
    const currentIndex = store.steps.findIndex((s) => s.id === store.currentStepId);
    if (currentIndex > 0) {
      store.setCurrentStep(store.steps[currentIndex - 1].id);
    }
  }, [store]);

  const reorderSteps = useCallback(
    (startIndex: number, endIndex: number) => {
      store.reorderSteps(startIndex, endIndex);
    },
    [store],
  );

  // ============================================================================
  // MODE OPERATIONS
  // ============================================================================

  const toggleEditMode = useCallback(() => {
    store.setEditMode(!isEditMode);
  }, [store, isEditMode]);

  const togglePreviewMode = useCallback(() => {
    store.setPreviewMode(!isPreviewMode);
  }, [store, isPreviewMode]);

  const enterEditMode = useCallback(() => {
    store.setEditMode(true);
  }, [store]);

  const enterPreviewMode = useCallback(() => {
    store.setPreviewMode(true);
  }, [store]);

  // ============================================================================
  // PERSISTENCE OPERATIONS
  // ============================================================================

  const save = useCallback(async () => {
    try {
      store.setSaving(true);
      
      // TODO: Implementar chamada real ao service
      // await funnelService.saveFunnel(store.funnelId, store.steps);
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      store.markClean();
      return { success: true };
    } catch (error) {
      console.error('Error saving:', error);
      return { success: false, error };
    } finally {
      store.setSaving(false);
    }
  }, [store]);

  const autoSave = useCallback(async () => {
    if (isDirty && !isSaving) {
      await save();
    }
  }, [isDirty, isSaving, save]);

  // ============================================================================
  // HISTORY OPERATIONS
  // ============================================================================

  const undo = useCallback(() => {
    store.undo();
  }, [store]);

  const redo = useCallback(() => {
    store.redo();
  }, [store]);

  const canUndo = store.canUndo();
  const canRedo = store.canRedo();

  // ============================================================================
  // UTILITY OPERATIONS
  // ============================================================================

  const reset = useCallback(() => {
    store.reset();
  }, [store]);

  const hasUnsavedChanges = isDirty;

  const currentStepIndex = store.steps.findIndex((s) => s.id === store.currentStepId);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === store.steps.length - 1;

  // ============================================================================
  // RETURN INTERFACE
  // ============================================================================

  return {
    // Estado
    steps: store.steps,
    currentStep,
    currentStepIndex,
    currentStepBlocks,
    selectedBlock,
    selectedBlockId: store.selectedBlockId,
    
    // Modo
    isEditMode,
    isPreviewMode,
    
    // Status
    isDirty,
    isSaving,
    hasUnsavedChanges,
    
    // Navegação
    isFirstStep,
    isLastStep,
    
    // Block operations
    addBlock,
    updateBlock,
    removeBlock,
    duplicateBlock,
    reorderBlocks,
    selectBlock,
    
    // Step operations
    addStep,
    removeStep,
    goToStep,
    nextStep,
    previousStep,
    reorderSteps,
    
    // Mode operations
    toggleEditMode,
    togglePreviewMode,
    enterEditMode,
    enterPreviewMode,
    
    // Persistence
    save,
    autoSave,
    
    // History
    undo,
    redo,
    canUndo,
    canRedo,
    
    // Utility
    reset,
    
    // Funnel metadata
    funnelId: store.funnelId,
    funnelName: store.funnelName,
    funnelDescription: store.funnelDescription,
    setFunnelMetadata: store.setFunnelMetadata,
  };
}

// ============================================================================
// EXPORT ALIASES (para compatibilidade)
// ============================================================================

export { useEditorConsolidated as useEditor };
export default useEditorConsolidated;
