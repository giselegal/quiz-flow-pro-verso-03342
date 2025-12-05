/**
 * 🔄 EDITOR ADAPTER - Bridge Context → Zustand
 * 
 * Hook adaptador que migra gradualmente de Context para Zustand.
 * Mantém API do Context mas usa Zustand internamente.
 * 
 * ESTRATÉGIA DE MIGRAÇÃO:
 * 1. Este adapter expõe a mesma API do EditorContextValue
 * 2. Internamente, usa useEditorStore (Zustand)
 * 3. Componentes não precisam mudar suas chamadas
 * 4. Depois que todos migrarem, removemos o Context
 * 
 * USO:
 * ```typescript
 * // Sem mudanças no código do componente
 * const editor = useEditor();
 * editor.selectBlock('block-123');
 * ```
 */

import { useCallback, useMemo } from 'react';
import { useEditorStore, useCurrentStep, useCurrentStepBlocks } from '@/contexts/store/editorStore';
import type { Block } from '@/types/editor';
import type { EditorContextValue, ValidationError, EditorState } from '@/contexts/editor/EditorStateProvider';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Hook principal que adapta Zustand Store → Context API
 */
export function useEditorAdapter(): EditorContextValue {
  const store = useEditorStore();
  const currentStep = useCurrentStep();
  const currentStepBlocks = useCurrentStepBlocks();
  
  // ========================================================================
  // MAPEAR ESTADO - Zustand → Context
  // ========================================================================
  
  const state: EditorState = useMemo(() => ({
    // Step atual como número (Context usa número, Zustand usa ID)
    currentStep: currentStep?.order ?? 1,
    
    // Seleção
    selectedBlockId: store.selectedBlockId,
    
    // Modos
    isPreviewMode: store.isPreviewMode,
    isEditing: store.isEditMode,
    dragEnabled: true, // Context tinha isso, manter compatibilidade
    
    // Clipboard (não existe no Zustand atual, manter vazio)
    clipboardData: null,
    
    // Blocos por step - converter steps array para Record<number, Block[]>
    stepBlocks: store.steps.reduce((acc, step) => {
      acc[step.order] = step.blocks;
      return acc;
    }, {} as Record<number, Block[]>),
    
    // Dirty tracking
    dirtySteps: {}, // TODO: implementar dirty tracking por step
    totalSteps: store.steps.length,
    isDirty: store.isDirty,
    
    // Timestamps
    lastSaved: null, // TODO: adicionar ao Zustand
    lastModified: null, // TODO: adicionar ao Zustand
    modifiedSteps: {}, // TODO: adicionar ao Zustand
    
    // Validações (não existe no Zustand atual)
    validationErrors: [],
    
    // Propriedade isLoading (requerida pelo EditorState canônico)
    isLoading: false,
  }), [store.selectedBlockId, store.isPreviewMode, store.isEditMode, store.isDirty, store.steps, currentStep]);
  
  // ========================================================================
  // MAPEAR AÇÕES - Context API → Zustand
  // ========================================================================
  
  // Step navigation
  const setCurrentStep = useCallback((step: number) => {
    const stepId = store.steps.find((s) => s.order === step)?.id;
    if (stepId) {
      store.setCurrentStep(stepId);
    } else {
      appLogger.warn(`⚠️ Step ${step} não encontrado`);
    }
  }, [store.steps, store.setCurrentStep]);
  
  // Block selection
  const selectBlock = useCallback((blockId: string | null) => {
    store.setSelectedBlock(blockId);
  }, [store.setSelectedBlock]);
  
  // Preview/Edit modes
  const togglePreview = useCallback((enabled?: boolean) => {
    const newValue = enabled ?? !store.isPreviewMode;
    store.setPreviewMode(newValue);
  }, [store.isPreviewMode, store.setPreviewMode]);
  
  const toggleEditing = useCallback((enabled?: boolean) => {
    const newValue = enabled ?? !store.isEditMode;
    store.setEditMode(newValue);
  }, [store.isEditMode, store.setEditMode]);
  
  const toggleDrag = useCallback((_enabled?: boolean) => {
    // Context tinha essa feature, mas não é crítica
    appLogger.debug('toggleDrag não implementado no Zustand store');
  }, []);
  
  // Clipboard operations
  const copyBlock = useCallback((_block: Block) => {
    // TODO: Implementar clipboard no Zustand
    appLogger.debug('copyBlock não implementado ainda');
  }, []);
  
  const pasteBlock = useCallback((_step: number, _index?: number) => {
    // TODO: Implementar clipboard no Zustand
    appLogger.debug('pasteBlock não implementado ainda');
  }, []);
  
  // Block management
  const setStepBlocks = useCallback((step: number, blocks: Block[]) => {
    const stepId = store.steps.find((s) => s.order === step)?.id;
    if (!stepId) {
      appLogger.warn(`⚠️ Step ${step} não encontrado`);
      return;
    }
    
    // Atualizar blocks do step
    const stepIndex = store.steps.findIndex((s) => s.id === stepId);
    if (stepIndex !== -1) {
      store.setSteps(
        store.steps.map((s, idx) =>
          idx === stepIndex ? { ...s, blocks } : s
        )
      );
    }
  }, [store.steps, store.setSteps]);
  
  const updateBlock = useCallback((step: number, blockId: string, updates: Partial<Block>) => {
    const stepId = store.steps.find((s) => s.order === step)?.id;
    if (!stepId) {
      appLogger.warn(`⚠️ Step ${step} não encontrado`);
      return;
    }
    
    // Temporariamente usar setCurrentStep + updateBlock
    const previousStep = store.currentStepId;
    store.setCurrentStep(stepId);
    store.updateBlock(blockId, updates);
    if (previousStep) store.setCurrentStep(previousStep);
  }, [store.steps, store.currentStepId, store.setCurrentStep, store.updateBlock]);
  
  const addBlock = useCallback((step: number, block: Block, index?: number) => {
    const stepId = store.steps.find((s) => s.order === step)?.id;
    if (!stepId) {
      appLogger.warn(`⚠️ Step ${step} não encontrado`);
      return;
    }
    
    const previousStep = store.currentStepId;
    store.setCurrentStep(stepId);
    
    // Se index foi especificado, precisamos inserir na posição
    if (index !== undefined) {
      const stepObj = store.steps.find((s) => s.id === stepId);
      if (stepObj) {
        const newBlocks = [...stepObj.blocks];
        newBlocks.splice(index, 0, block);
        setStepBlocks(step, newBlocks);
      }
    } else {
      // Adicionar no final
      store.addBlock(block.type, block.properties);
    }
    
    if (previousStep) store.setCurrentStep(previousStep);
  }, [store.steps, store.currentStepId, store.setCurrentStep, store.addBlock, setStepBlocks]);
  
  const removeBlock = useCallback((step: number, blockId: string) => {
    const stepId = store.steps.find((s) => s.order === step)?.id;
    if (!stepId) {
      appLogger.warn(`⚠️ Step ${step} não encontrado`);
      return;
    }
    
    const previousStep = store.currentStepId;
    store.setCurrentStep(stepId);
    store.removeBlock(blockId);
    if (previousStep) store.setCurrentStep(previousStep);
  }, [store.steps, store.currentStepId, store.setCurrentStep, store.removeBlock]);
  
  const reorderBlocks = useCallback((step: number, blocks: Block[]) => {
    setStepBlocks(step, blocks);
  }, [setStepBlocks]);
  
  // Dirty tracking
  const markSaved = useCallback(() => {
    store.markClean();
  }, [store.markClean]);
  
  const markModified = useCallback((_step: string) => {
    store.markDirty();
  }, [store.markDirty]);
  
  // Validations
  const addValidationError = useCallback((_error: ValidationError) => {
    // TODO: Implementar validations no Zustand
    appLogger.debug('addValidationError não implementado ainda');
  }, []);
  
  const clearValidationErrors = useCallback((_blockId?: string) => {
    // TODO: Implementar validations no Zustand
    appLogger.debug('clearValidationErrors não implementado ainda');
  }, []);
  
  // Reset
  const resetEditor = useCallback(() => {
    store.reset();
  }, [store.reset]);
  
  // Getters
  const getStepBlocks = useCallback((step: number): Block[] => {
    const stepObj = store.steps.find((s) => s.order === step);
    return stepObj?.blocks ?? [];
  }, [store.steps]);
  
  const isStepDirty = useCallback((_step: number): boolean => {
    // TODO: Implementar dirty tracking por step
    return store.isDirty;
  }, [store.isDirty]);

  // Métodos adicionais para compatibilidade com EditorContextValue canônico
  const loadStepBlocks = useCallback(async (_stepId: string): Promise<Block[] | null> => {
    appLogger.debug('[useEditorZustandAdapter] loadStepBlocks não implementado');
    return null;
  }, []);

  const setSelectedBlockId = useCallback((id: string | null) => {
    store.setSelectedBlock(id);
  }, [store.setSelectedBlock]);

  const deleteBlock = useCallback((blockId: string) => {
    const currentStepOrder = currentStep?.order ?? 1;
    removeBlock(currentStepOrder, blockId);
  }, [currentStep, removeBlock]);

  const addBlockAtIndex = useCallback((step: number, block: Block, index: number) => {
    addBlock(step, block, index);
  }, [addBlock]);
  
  // ========================================================================
  // RETORNAR INTERFACE COMPATÍVEL COM CONTEXT
  // ========================================================================
  
  const actions = useMemo(() => ({
    setCurrentStep,
    selectBlock,
    togglePreview,
    toggleEditing,
    toggleDrag,
    copyBlock,
    pasteBlock,
    setStepBlocks,
    updateBlock,
    addBlock,
    removeBlock,
    reorderBlocks,
    markSaved,
    markModified,
    addValidationError,
    clearValidationErrors,
    resetEditor,
    getStepBlocks,
    isStepDirty,
    // Métodos adicionais para compatibilidade
    loadStepBlocks,
    setSelectedBlockId,
    deleteBlock,
    addBlockAtIndex,
  }), [
    setCurrentStep,
    selectBlock,
    togglePreview,
    toggleEditing,
    toggleDrag,
    copyBlock,
    pasteBlock,
    setStepBlocks,
    updateBlock,
    addBlock,
    removeBlock,
    reorderBlocks,
    markSaved,
    markModified,
    addValidationError,
    clearValidationErrors,
    resetEditor,
    getStepBlocks,
    isStepDirty,
  ]);
  
  // Retornar interface flat + canonical
  return {
    ...state,
    ...actions,
    state,
    actions,
  };
}

/**
 * Alias para compatibilidade
 */
export const useEditor = useEditorAdapter;

export default useEditorAdapter;
