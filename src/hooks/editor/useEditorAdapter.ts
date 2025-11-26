/**
 * @deprecated Este hook está DEPRECATED e será removido na FASE 3.
 * 
 * ⚠️ INCOMPATÍVEL com @core/contexts/EditorContext.
 * Criado para abstrair diferenças entre EditorContext.tsx e QuizV4Provider.tsx (ambos legados).
 * Com a nova arquitetura @core, este hook não é mais necessário.
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ Antigo (deprecated)
 * import { useEditorAdapter } from '@/hooks/editor/useEditorAdapter';
 * const editor = useEditorAdapter();
 * editor.deleteBlock(blockId);
 * 
 * // ✅ Novo (recomendado)
 * import { useEditor } from '@/core/hooks';
 * const editor = useEditor();
 * editor.removeBlock(step, blockId);
 * ```
 * 
 * DIFERENÇAS PRINCIPAIS:
 * - Step sempre explícito (mais claro, menos mágico)
 * - API mínima e explícita (sem métodos "helper")
 * - Type-safe (TypeScript verifica todos os argumentos)
 * 
 * @see docs/LEGACY_HOOKS_DEPRECATION.md - Guia completo de migração
 * @see docs/CORE_ARCHITECTURE_MIGRATION.md - Arquitetura @core
 * 
 * SERÁ REMOVIDO NA FASE 3.
 */

import { useMemo, useCallback } from 'react';
import { useEditor } from '@/contexts/editor/EditorContext';
import { v4 as uuidv4 } from 'uuid';

// Log de deprecação em desenvolvimento
if (import.meta.env.DEV) {
  console.warn(
    '🚨 DEPRECATED: useEditorAdapter será removido na FASE 3.\n' +
    'Migre para: import { useEditor } from "@/core/hooks";\n' +
    'Veja: docs/LEGACY_HOOKS_DEPRECATION.md'
  );
}
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
    
    // Usar deleteBlock do contexto (assinatura: deleteBlock(blockId))
    const deleteBlockFn = ctx?.actions?.deleteBlock ?? ctx?.deleteBlock;
    if (deleteBlockFn) {
      try {
        await deleteBlockFn(blockId);
        appLogger.info('[useEditorAdapter] Block deleted:', { data: [blockId] });
        return;
      } catch (err) {
        appLogger.error('[useEditorAdapter] deleteBlock failed:', err);
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

    // Use addBlock if available (assinatura: addBlock(type))
    const addBlockFn = ctx?.actions?.addBlock ?? ctx?.addBlock;
    if (addBlockFn) {
      try {
        // addBlock retorna o ID do novo bloco, mas não aceita o bloco completo
        // Precisamos criar e depois atualizar
        const newBlockId = await addBlockFn(blockToDuplicate.type);
        
        // Atualizar com as propriedades duplicadas
        const updateBlockFn = ctx?.actions?.updateBlock ?? ctx?.updateBlock;
        if (updateBlockFn) {
          await updateBlockFn(newBlockId, {
            properties: duplicatedBlock.properties,
            content: duplicatedBlock.content,
          });
        }
        
        appLogger.info('[useEditorAdapter] Block duplicated:', { data: [id, newBlockId] });
        return newBlockId;
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
    // Calculate unique order by finding the max existing order
    const existingOrders = (ctx?.state?.blocks ?? []).map((b: Block) => b.order ?? 0);
    const newOrder = existingOrders.length > 0 ? Math.max(...existingOrders) + 1 : 0;
    
    const newBlock: Block = {
      id: newId,
      type,
      properties: {},
      content: {},
      order: newOrder,
    };

    try {
      // addBlock(type) retorna o ID do bloco criado
      const blockId = await addBlockFn(type);
      appLogger.info('[useEditorAdapter] Block added:', { data: [type, blockId] });
      return blockId;
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
      // updateBlock(id, updates)
      await updateBlockFn(id, updates);
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
      // reorderBlocks(startIndex, endIndex)
      reorderFn(startIndex, endIndex);
      appLogger.debug('[useEditorAdapter] Blocks reordered');
    } catch (err) {
      appLogger.error('[useEditorAdapter] Failed to reorder blocks:', err);
    }
  }, [ctx, currentStep]);

  /**
   * selectBlock - Seleciona um bloco
   */
  const selectBlock = useCallback((id: string | null): void => {
    // selectBlock ou setSelectedBlockId (blockActions tem setSelectedBlockId)
    const setSelectedFn = ctx?.selectBlock ?? ctx?.blockActions?.setSelectedBlockId;
    
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
    // save existe no contexto legado
    const saveFn = ctx?.save;
    
    if (saveFn) {
      await saveFn();
    }
  }, [ctx]);

  /**
   * setCurrentStep - Define a etapa atual
   */
  const setCurrentStep = useCallback((step: number): void => {
    // setCurrentStep não existe no contexto, usar stageActions.setActiveStage
    const setActiveStageFn = ctx?.stageActions?.setActiveStage;
    
    if (setActiveStageFn) {
      setActiveStageFn(`step-${step}`);
    }
  }, [ctx]);

  /**
   * ensureStepLoaded - Garante que uma etapa está carregada
   */
  const ensureStepLoaded = useCallback(async (step: number): Promise<void> => {
    // ensureStepLoaded não existe, usar setActiveStage que já carrega a etapa
    const setActiveStageFn = ctx?.stageActions?.setActiveStage;
    
    if (setActiveStageFn) {
      await setActiveStageFn(`step-${step}`);
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
