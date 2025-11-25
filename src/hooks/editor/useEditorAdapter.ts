/**
 * 🎯 useEditorAdapter - Hook CANÔNICO para gerenciamento de blocos
 * 
 * ⚠️ IMPORTANTE: Este é o hook OFICIAL para acessar e gerenciar blocos no editor.
 * Fornece uma interface padronizada que abstrai o contexto subjacente (legado ou atual).
 * 
 * Interface pública:
 * - state: { currentStep, selectedBlockId, selectedBlock, blocks, isPreviewing, isLoading }
 * - actions: { addBlock, updateBlock, deleteBlock, removeBlock, duplicateBlock, save, setSelectedBlockId }
 * 
 * A ação pública é `deleteBlock(blockId)`, que internamente faz a ponte para 
 * `removeBlock(stepKey, blockId)` quando necessário para contextos legados.
 * 
 * @see EditorAdapter - Interface de tipos
 * @see PropertiesPanelTypes.ts - Tipos canônicos
 */

import { useMemo, useCallback } from 'react';
import { useEditor } from '@/contexts/editor/EditorContext';
import { v4 as uuidv4 } from 'uuid';
import { appLogger } from '@/lib/utils/appLogger';
import type { EditorAdapter } from '@/types/editor/PropertiesPanelTypes';
import type { Block, BlockType } from '@/types/editor';

/**
 * Hook canônico para acessar o EditorContext com interface padronizada.
 * Abstrai diferenças entre contextos legado e atual.
 * 
 * @returns {EditorAdapter} Interface padronizada do editor
 */
export function useEditorAdapter(): EditorAdapter {
  const ctx = useEditor();

  // Derive selected block from blocks array
  const selectedBlock = useMemo(() => {
    if (!ctx?.state?.blocks || !ctx?.selectedBlockId) return null;
    return ctx.state.blocks.find((b: Block) => b.id === ctx.selectedBlockId) || null;
  }, [ctx?.state?.blocks, ctx?.selectedBlockId]);

  // Current step with safe default
  const currentStep = ctx?.currentStep ?? 1;
  
  // Build stepKey for legacy context bridge
  const currentStepKey = useMemo(() => 
    `step-${String(currentStep).padStart(2, '0')}`, 
    [currentStep]
  );

  /**
   * deleteBlock - Ação pública canônica para deletar blocos
   * Internamente faz ponte para removeBlock(stepKey, blockId) se necessário
   */
  const deleteBlock = useCallback(async (blockId: string): Promise<void> => {
    appLogger.debug('[useEditorAdapter] deleteBlock called:', { blockId, currentStepKey });
    
    // Tentar usar deleteBlock direto (API nova)
    const deleteBlockFn = ctx?.actions?.deleteBlock ?? ctx?.deleteBlock;
    if (deleteBlockFn) {
      try {
        await deleteBlockFn(blockId);
        appLogger.info('[useEditorAdapter] Block deleted via deleteBlock:', { data: [blockId] });
        return;
      } catch (err) {
        appLogger.warn('[useEditorAdapter] deleteBlock failed, trying removeBlock:', err);
      }
    }

    // Fallback: usar removeBlock(stepKey, blockId) - API legada
    const removeBlockFn = ctx?.actions?.removeBlock ?? ctx?.removeBlock;
    if (removeBlockFn) {
      try {
        // Verificar se a API requer stepKey (legada) ou apenas blockId
        if (removeBlockFn.length >= 2) {
          // API legada: removeBlock(stepKey, blockId)
          await removeBlockFn(currentStepKey, blockId);
        } else {
          // API nova: removeBlock(blockId)
          await removeBlockFn(blockId);
        }
        appLogger.info('[useEditorAdapter] Block deleted via removeBlock:', { data: [blockId] });
        return;
      } catch (err) {
        appLogger.error('[useEditorAdapter] removeBlock failed:', err);
      }
    }

    appLogger.warn('[useEditorAdapter] No delete function available');
  }, [ctx, currentStepKey]);

  /**
   * removeBlock - Alias para deleteBlock (compatibilidade)
   * @deprecated Use deleteBlock ao invés
   */
  const removeBlock = deleteBlock;

  /**
   * duplicateBlock - Duplica um bloco existente
   */
  const duplicateBlock = useCallback(async (id: string): Promise<string | undefined> => {
    if (!ctx?.state?.blocks) return;
    
    const blockToDuplicate = ctx.state.blocks.find((b: Block) => b.id === id);
    if (!blockToDuplicate) {
      appLogger.warn('[useEditorAdapter] Block not found for duplication:', { data: [id] });
      return;
    }

    const newId = uuidv4();
    const duplicatedBlock: Block = {
      ...blockToDuplicate,
      id: newId,
      properties: { ...blockToDuplicate.properties },
      content: { ...blockToDuplicate.content },
      order: (blockToDuplicate.order ?? 0) + 1,
    };

    // Use addBlock if available
    const addBlockFn = ctx?.actions?.addBlock ?? ctx?.addBlock;
    if (addBlockFn) {
      try {
        // Support different API signatures
        if (addBlockFn.length === 1) {
          await addBlockFn(duplicatedBlock);
        } else if (addBlockFn.length === 2) {
          // addBlock(stepIndex, block)
          await addBlockFn(currentStep, duplicatedBlock);
        } else {
          // addBlock(type, props, content)
          await addBlockFn(blockToDuplicate.type, duplicatedBlock.properties, duplicatedBlock.content);
        }
        appLogger.info('[useEditorAdapter] Block duplicated:', { data: [id, newId] });
        return newId;
      } catch (err) {
        appLogger.error('[useEditorAdapter] Failed to duplicate block:', err);
      }
    }
    
    appLogger.warn('[useEditorAdapter] No addBlock function available');
    return undefined;
  }, [ctx, currentStep]);

  /**
   * addBlock - Adiciona um novo bloco
   */
  const addBlock = useCallback(async (type: BlockType): Promise<string> => {
    const addBlockFn = ctx?.actions?.addBlock ?? ctx?.addBlock;
    
    if (!addBlockFn) {
      appLogger.warn('[useEditorAdapter] No addBlock function available');
      throw new Error('addBlock not available');
    }

    const newId = uuidv4();
    const newBlock: Block = {
      id: newId,
      type,
      properties: {},
      content: {},
      order: (ctx?.state?.blocks?.length ?? 0),
    };

    try {
      if (addBlockFn.length === 1) {
        await addBlockFn(newBlock);
      } else if (addBlockFn.length === 2) {
        await addBlockFn(currentStep, newBlock);
      } else {
        await addBlockFn(type, {}, {});
      }
      appLogger.info('[useEditorAdapter] Block added:', { data: [type, newId] });
      return newId;
    } catch (err) {
      appLogger.error('[useEditorAdapter] Failed to add block:', err);
      throw err;
    }
  }, [ctx, currentStep]);

  /**
   * updateBlock - Atualiza um bloco existente
   */
  const updateBlock = useCallback(async (id: string, updates: Partial<Block>): Promise<void> => {
    const updateBlockFn = ctx?.actions?.updateBlock ?? ctx?.updateBlock;
    
    if (!updateBlockFn) {
      appLogger.warn('[useEditorAdapter] No updateBlock function available');
      return;
    }

    try {
      // Support different API signatures
      if (updateBlockFn.length === 2) {
        await updateBlockFn(id, updates);
      } else if (updateBlockFn.length === 3) {
        // updateBlock(stepIndex, blockId, updates)
        await updateBlockFn(currentStep, id, updates);
      }
      appLogger.debug('[useEditorAdapter] Block updated:', { data: [id] });
    } catch (err) {
      appLogger.error('[useEditorAdapter] Failed to update block:', err);
    }
  }, [ctx, currentStep]);

  /**
   * reorderBlocks - Reordena blocos
   */
  const reorderBlocks = useCallback((startIndex: number, endIndex: number): void => {
    const reorderFn = ctx?.actions?.reorderBlocks ?? ctx?.reorderBlocks;
    
    if (!reorderFn) {
      appLogger.warn('[useEditorAdapter] No reorderBlocks function available');
      return;
    }

    try {
      if (reorderFn.length === 2) {
        reorderFn(startIndex, endIndex);
      } else if (reorderFn.length === 3) {
        // reorderBlocks(stepIndex, startIndex, endIndex)
        reorderFn(currentStep, startIndex, endIndex);
      }
      appLogger.debug('[useEditorAdapter] Blocks reordered');
    } catch (err) {
      appLogger.error('[useEditorAdapter] Failed to reorder blocks:', err);
    }
  }, [ctx, currentStep]);

  /**
   * selectBlock - Seleciona um bloco
   */
  const selectBlock = useCallback((id: string | null): void => {
    const setSelectedFn = ctx?.actions?.setSelectedBlockId ?? ctx?.setSelectedBlockId ?? ctx?.selectBlock;
    
    if (setSelectedFn) {
      setSelectedFn(id);
    }
  }, [ctx]);

  /**
   * togglePreview - Alterna modo de preview
   */
  const togglePreview = useCallback((preview?: boolean): void => {
    const toggleFn = ctx?.actions?.togglePreview ?? ctx?.togglePreview;
    
    if (toggleFn) {
      toggleFn(preview);
    }
  }, [ctx]);

  /**
   * save - Salva o estado atual
   */
  const save = useCallback(async (): Promise<void> => {
    const saveFn = ctx?.actions?.save ?? ctx?.save;
    
    if (saveFn) {
      await saveFn();
    }
  }, [ctx]);

  /**
   * setCurrentStep - Define a etapa atual
   */
  const setCurrentStep = useCallback((step: number): void => {
    const setStepFn = ctx?.actions?.setCurrentStep ?? ctx?.setCurrentStep;
    
    if (setStepFn) {
      setStepFn(step);
    }
  }, [ctx]);

  /**
   * ensureStepLoaded - Garante que uma etapa está carregada
   */
  const ensureStepLoaded = useCallback(async (step: number): Promise<void> => {
    const ensureFn = ctx?.actions?.ensureStepLoaded ?? ctx?.ensureStepLoaded;
    
    if (ensureFn) {
      await ensureFn(step);
    }
  }, [ctx]);

  return {
    currentStep,
    selectedBlockId: ctx?.selectedBlockId ?? null,
    selectedBlock,
    blocks: ctx?.state?.blocks ?? [],
    isPreviewing: ctx?.isPreviewing ?? false,
    isLoading: ctx?.isLoading ?? false,
    
    actions: {
      addBlock,
      updateBlock,
      deleteBlock,
      removeBlock, // Alias for backwards compatibility
      reorderBlocks,
      selectBlock,
      setSelectedBlockId: selectBlock, // Alias
      togglePreview,
      save,
      setCurrentStep,
    },
  };
}

export default useEditorAdapter;
