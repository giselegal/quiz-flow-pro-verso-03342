/**
 * 🎯 FASE 2: Sincronização WYSIWYG Otimizada com Immer
 * 
 * Substitui comparação JSON.stringify por:
 * - Atualizações imutáveis eficientes (Immer)
 * - Structural sharing (reusa referências não alteradas)
 * - Diff otimizado O(n) ao invés de O(n²)
 */

import { useEffect, useRef, useCallback } from 'react';
import { produce } from 'immer';
import type { Block } from '@/types/block';
import { appLogger } from '@/lib/utils/logger';

interface WYSIWYGState {
  blocks: Block[];
  selectedBlockId: string | null;
}

interface WYSIWYGActions {
  reset: (blocks: Block[]) => void;
  selectBlock: (blockId: string | null) => void;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  addBlock: (block: Block) => void;
  deleteBlock: (blockId: string) => void;
  reorderBlocks: (newOrder: Block[]) => void;
}

interface UseWYSIWYGSyncOptions {
  sourceBlocks: Block[];
  onBlocksChange?: (blocks: Block[]) => void;
  onSelectionChange?: (blockId: string | null) => void;
  enabled?: boolean;
}

export function useWYSIWYGSync({
  sourceBlocks,
  onBlocksChange,
  onSelectionChange,
  enabled = true,
}: UseWYSIWYGSyncOptions) {
  const stateRef = useRef<WYSIWYGState>({
    blocks: [],
    selectedBlockId: null,
  });

  const previousBlocksRef = useRef<Block[]>([]);

  /**
   * Comparação shallow eficiente (O(n))
   */
  const blocksAreEqual = useCallback((a: Block[], b: Block[]): boolean => {
    if (a.length !== b.length) return false;

    return a.every((blockA, index) => {
      const blockB = b[index];
      if (!blockB) return false;

      // Comparar IDs e referências (structural sharing)
      if (blockA === blockB) return true;
      if (blockA.id !== blockB.id) return false;

      // Comparar propriedades principais
      return (
        blockA.type === blockB.type &&
        blockA.order === blockB.order &&
        shallowEqual(blockA.properties, blockB.properties) &&
        shallowEqual(blockA.content, blockB.content)
      );
    });
  }, []);

  /**
   * Sincronizar com fonte de dados (otimizado)
   */
  const syncFromSource = useCallback((newBlocks: Block[]) => {
    if (!enabled) return;

    const currentBlocks = stateRef.current.blocks;

    // Skip se não houver mudanças reais
    if (blocksAreEqual(currentBlocks, newBlocks)) {
      return;
    }

    appLogger.debug('[WYSIWYGSync] Sincronizando blocos...', {
      data: [{ from: currentBlocks.length, to: newBlocks.length }]
    });

    // Atualizar usando Immer para structural sharing
    const nextState = produce(stateRef.current, draft => {
      // Criar map para lookup rápido
      const newBlocksMap = new Map(newBlocks.map(b => [b.id, b]));
      const currentBlocksMap = new Map(currentBlocks.map(b => [b.id, b]));

      // Detectar mudanças
      const toAdd: Block[] = [];
      const toUpdate: Array<{ index: number; block: Block }> = [];
      const toRemove = new Set(currentBlocksMap.keys());

      newBlocks.forEach((newBlock, index) => {
        const existing = currentBlocksMap.get(newBlock.id);

        if (!existing) {
          // Bloco novo
          toAdd.push(newBlock);
        } else {
          // Bloco existente - verificar se mudou
          if (!shallowEqual(existing, newBlock)) {
            toUpdate.push({ index, block: newBlock });
          }
          toRemove.delete(newBlock.id);
        }
      });

      // Aplicar mudanças de forma otimizada
      draft.blocks = newBlocks.map(b => {
        const existing = currentBlocksMap.get(b.id);
        // Reusar referência se não mudou (structural sharing)
        return existing && shallowEqual(existing, b) ? existing : b;
      });

      // Limpar seleção se bloco foi removido
      if (draft.selectedBlockId && !newBlocksMap.has(draft.selectedBlockId)) {
        draft.selectedBlockId = null;
      }
    });

    stateRef.current = nextState;
    previousBlocksRef.current = newBlocks;

    // Notificar mudanças
    if (onBlocksChange) {
      onBlocksChange(nextState.blocks);
    }
  }, [enabled, blocksAreEqual, onBlocksChange]);

  /**
   * Sincronizar quando sourceBlocks mudar
   */
  useEffect(() => {
    syncFromSource(sourceBlocks);
  }, [sourceBlocks, syncFromSource]);

  /**
   * Actions otimizadas
   */
  const actions: WYSIWYGActions = {
    reset: useCallback((blocks: Block[]) => {
      stateRef.current = produce(stateRef.current, draft => {
        draft.blocks = blocks;
        draft.selectedBlockId = null;
      });

      if (onBlocksChange) {
        onBlocksChange(blocks);
      }
    }, [onBlocksChange]),

    selectBlock: useCallback((blockId: string | null) => {
      const nextState = produce(stateRef.current, draft => {
        draft.selectedBlockId = blockId;
      });

      stateRef.current = nextState;

      if (onSelectionChange) {
        onSelectionChange(blockId);
      }
    }, [onSelectionChange]),

    updateBlock: useCallback((blockId: string, updates: Partial<Block>) => {
      const nextState = produce(stateRef.current, draft => {
        const blockIndex = draft.blocks.findIndex(b => b.id === blockId);
        
        if (blockIndex !== -1) {
          Object.assign(draft.blocks[blockIndex], updates);
        }
      });

      stateRef.current = nextState;

      if (onBlocksChange) {
        onBlocksChange(nextState.blocks);
      }
    }, [onBlocksChange]),

    addBlock: useCallback((block: Block) => {
      const nextState = produce(stateRef.current, draft => {
        draft.blocks.push(block);
      });

      stateRef.current = nextState;

      if (onBlocksChange) {
        onBlocksChange(nextState.blocks);
      }
    }, [onBlocksChange]),

    deleteBlock: useCallback((blockId: string) => {
      const nextState = produce(stateRef.current, draft => {
        draft.blocks = draft.blocks.filter(b => b.id !== blockId);
        
        if (draft.selectedBlockId === blockId) {
          draft.selectedBlockId = null;
        }
      });

      stateRef.current = nextState;

      if (onBlocksChange) {
        onBlocksChange(nextState.blocks);
      }
    }, [onBlocksChange]),

    reorderBlocks: useCallback((newOrder: Block[]) => {
      const nextState = produce(stateRef.current, draft => {
        draft.blocks = newOrder.map((b, idx) => ({
          ...b,
          order: idx,
        }));
      });

      stateRef.current = nextState;

      if (onBlocksChange) {
        onBlocksChange(nextState.blocks);
      }
    }, [onBlocksChange]),
  };

  return {
    state: stateRef.current,
    actions,
  };
}

/**
 * Comparação shallow eficiente
 */
function shallowEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return a === b;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => a[key] === b[key]);
}
