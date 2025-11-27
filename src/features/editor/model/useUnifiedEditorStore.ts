/**
 * 🎯 FASE 2: Hook para integrar UnifiedEditorStore com React
 * 
 * Sincronização automática entre store e componentes React
 */

import { useEffect, useState, useCallback } from 'react';
import { unifiedEditorStore, type EditorState } from '@/lib/editor/store/UnifiedEditorStore';
import type { Block } from '@/types/block';

export function useUnifiedEditorStore() {
  const [state, setState] = useState<EditorState>(() => unifiedEditorStore.getState());

  // Subscribir a mudanças do store
  useEffect(() => {
    const unsubscribe = unifiedEditorStore.subscribe(newState => {
      setState(newState);
    });

    return unsubscribe;
  }, []);

  // Comandos (wrapper para métodos do store)
  const commands = {
    addBlock: useCallback((stepIndex: number, block: Block) => {
      return unifiedEditorStore.addBlock(stepIndex, block);
    }, []),

    updateBlock: useCallback((blockId: string, updates: Partial<Block>) => {
      return unifiedEditorStore.updateBlock(blockId, updates);
    }, []),

    deleteBlock: useCallback((blockId: string) => {
      return unifiedEditorStore.deleteBlock(blockId);
    }, []),

    reorderBlocks: useCallback((stepIndex: number, newOrder: Block[]) => {
      return unifiedEditorStore.reorderBlocks(stepIndex, newOrder);
    }, []),

    setCurrentStep: useCallback((stepIndex: number) => {
      return unifiedEditorStore.setCurrentStep(stepIndex);
    }, []),

    setSelectedBlock: useCallback((blockId: string | null) => {
      return unifiedEditorStore.setSelectedBlock(blockId);
    }, []),
  };

  // Queries (acesso otimizado ao estado)
  const queries = {
    getBlocks: useCallback((stepIndex: number) => {
      return unifiedEditorStore.getBlocks(stepIndex);
    }, []),

    getSelectedBlock: useCallback(() => {
      return unifiedEditorStore.getSelectedBlock();
    }, []),
  };

  return {
    state,
    commands,
    queries,
  };
}
