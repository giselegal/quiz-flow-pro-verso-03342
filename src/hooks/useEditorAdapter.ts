import { useMemo } from 'react';
import { useEditor } from '@/contexts/editor/EditorContext';

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
      duplicateBlock: async (_id: string) => {
        // Implementação futura; mantendo API compatível
        return;
      },
      save: ctx?.actions?.save ?? ctx?.save,
      setSelectedBlockId: ctx?.actions?.setSelectedBlockId ?? ctx?.setSelectedBlockId,
    },
  } as const;
}

export default useEditorAdapter;
