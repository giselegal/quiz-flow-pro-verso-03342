/**
 * 🎯 BLOCK OPERATIONS MANAGER (Sprint 2 - TK-ED-04)
 * 
 * Wrapper que conecta useUnifiedBlockOperations ao state do editor
 * Simplifica o uso do hook em componentes
 */

import { useCallback } from 'react';
import { useUnifiedBlockOperations } from '../hooks/useUnifiedBlockOperations';
import type { EditableQuizStep } from '../types';

interface BlockOperationsManagerProps {
  steps: EditableQuizStep[];
  currentStepId: string | null;
  setSteps: (steps: EditableQuizStep[] | ((prev: EditableQuizStep[]) => EditableQuizStep[])) => void;
  setSelectedBlockId?: (id: string | null) => void;
  pushHistory?: (steps: EditableQuizStep[]) => void;
  setDirty?: (dirty: boolean) => void;
}

/**
 * Hook que gerencia operações de bloco no contexto do editor
 */
export function useBlockOperationsManager({
  steps,
  currentStepId,
  setSteps,
  setSelectedBlockId,
  pushHistory,
  setDirty,
}: BlockOperationsManagerProps) {
  // Hook unificado de operações
  const blockOps = useUnifiedBlockOperations({
    steps,
    setSteps,
    pushHistory,
    setDirty,
  });

  /**
   * Adicionar bloco ao step atual
   */
  const addBlockToCurrentStep = useCallback((
    type: string,
    properties: Record<string, any> = {},
    content: Record<string, any> = {}
  ) => {
    if (!currentStepId) return null;

    const blockId = blockOps.addBlock(currentStepId, type, properties, content);

    // Auto-selecionar bloco criado
    if (blockId && setSelectedBlockId) {
      setSelectedBlockId(blockId);
    }

    return blockId;
  }, [currentStepId, blockOps, setSelectedBlockId]);

  /**
   * Atualizar bloco do step atual
   */
  const updateBlockInCurrentStep = useCallback((
    blockId: string,
    updates: {
      properties?: Partial<Record<string, any>>;
      content?: Partial<Record<string, any>>;
    }
  ) => {
    if (!currentStepId) return false;
    return blockOps.updateBlock(currentStepId, blockId, updates);
  }, [currentStepId, blockOps]);

  /**
   * Atualizar propriedade específica do bloco atual
   */
  const updateCurrentBlockProperty = useCallback((
    blockId: string,
    key: string,
    value: any
  ) => {
    if (!currentStepId) return false;
    return blockOps.updateBlockProperty(currentStepId, blockId, key, value);
  }, [currentStepId, blockOps]);

  /**
   * Deletar bloco do step atual
   */
  const deleteBlockFromCurrentStep = useCallback((blockId: string) => {
    if (!currentStepId) return false;

    const success = blockOps.deleteBlock(currentStepId, blockId);

    // Limpar seleção após deletar
    if (success && setSelectedBlockId) {
      setSelectedBlockId(null);
    }

    return success;
  }, [currentStepId, blockOps, setSelectedBlockId]);

  /**
   * Duplicar bloco no step atual
   */
  const duplicateBlockInCurrentStep = useCallback((blockId: string) => {
    if (!currentStepId) return null;

    const newBlockId = blockOps.duplicateBlock(currentStepId, blockId);

    // Auto-selecionar duplicata
    if (newBlockId && setSelectedBlockId) {
      setSelectedBlockId(newBlockId);
    }

    return newBlockId;
  }, [currentStepId, blockOps, setSelectedBlockId]);

  /**
   * Reordenar blocos no step atual
   */
  const reorderBlocksInCurrentStep = useCallback((
    oldIndex: number,
    newIndex: number
  ) => {
    if (!currentStepId) return false;
    return blockOps.reorderBlocks(currentStepId, oldIndex, newIndex);
  }, [currentStepId, blockOps]);

  /**
   * Inserir snippet no step atual
   */
  const insertSnippetInCurrentStep = useCallback((
    snippetBlocks: any[]
  ) => {
    if (!currentStepId) return [];
    return blockOps.insertSnippetBlocks(currentStepId, snippetBlocks);
  }, [currentStepId, blockOps]);

  return {
    // Operações no step atual (simplificadas)
    addBlock: addBlockToCurrentStep,
    updateBlock: updateBlockInCurrentStep,
    updateProperty: updateCurrentBlockProperty,
    deleteBlock: deleteBlockFromCurrentStep,
    duplicateBlock: duplicateBlockInCurrentStep,
    reorderBlocks: reorderBlocksInCurrentStep,
    insertSnippet: insertSnippetInCurrentStep,

    // Operações completas (acesso direto)
    operations: blockOps,
  };
}
