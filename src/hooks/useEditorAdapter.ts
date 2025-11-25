import { useMemo, useCallback } from 'react';
import { useEditor } from '@/contexts/editor/EditorContext';
import { v4 as uuidv4 } from 'uuid';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Adapter fino para padronizar o acesso ao EditorContext
 * e expor a API esperada pelos componentes do painel.
 */
export function useEditorAdapter() {
  const ctx = useEditor();

  const selectedBlock = useMemo(() => {
    if (!ctx?.state?.blocks || !ctx?.selectedBlockId) return null;
    return ctx.state.blocks.find((b: any) => b.id === ctx.selectedBlockId) || null;
  }, [ctx?.state?.blocks, ctx?.selectedBlockId]);

  const duplicateBlock = useCallback(async (id: string) => {
    if (!ctx?.state?.blocks) return;
    
    const blockToDuplicate = ctx.state.blocks.find((b: any) => b.id === id);
    if (!blockToDuplicate) {
      appLogger.warn('Block not found for duplication:', { data: [id] });
      return;
    }

    const newId = uuidv4();
    const duplicatedBlock = {
      ...blockToDuplicate,
      id: newId,
      properties: { ...blockToDuplicate.properties },
      content: { ...blockToDuplicate.content },
    };

    // Use addBlock if available, otherwise try updateBlock
    const addBlockFn = ctx?.actions?.addBlock ?? ctx?.addBlock;
    if (addBlockFn) {
      try {
        // support both APIs: addBlock(block) and addBlock(type, props, content)
        if ((addBlockFn as any).length === 1) {
          await (addBlockFn as any)(duplicatedBlock);
        } else {
          await (addBlockFn as any)(blockToDuplicate.type, duplicatedBlock.properties, duplicatedBlock.content);
        }
        appLogger.info('Block duplicated:', { data: [id, newId] });
        return newId;
      } catch (err) {
        appLogger.error('Failed to duplicate block via addBlockFn:', err);
      }
    }
    
    appLogger.warn('No addBlock function available');
  }, [ctx]);

  return {
    currentStep: ctx?.currentStep ?? 1,
    selectedBlockId: ctx?.selectedBlockId ?? null,
    selectedBlock,
    blocks: ctx?.state?.blocks ?? [],
    actions: {
      addBlock: ctx?.actions?.addBlock ?? ctx?.addBlock,
      updateBlock: ctx?.actions?.updateBlock ?? ctx?.updateBlock,
      deleteBlock: ctx?.actions?.deleteBlock ?? ctx?.deleteBlock,
      removeBlock: ctx?.actions?.deleteBlock ?? ctx?.deleteBlock,
      duplicateBlock,
      save: ctx?.actions?.save ?? ctx?.save,
      setSelectedBlockId: ctx?.actions?.setSelectedBlockId ?? ctx?.setSelectedBlockId,
    },
  } as const;
}

export default useEditorAdapter;
