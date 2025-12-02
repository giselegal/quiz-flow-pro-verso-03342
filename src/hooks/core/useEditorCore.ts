import { useMemo, useCallback } from 'react';
import { useEditorContext } from '@/core';
import type { Block } from '@/types/editor';

export interface EditorCoreState {
  currentStep: number;
  selectedBlockId: string | null;
  stepBlocks: Record<string, Block[]> | undefined;
  isSaving?: boolean;
  lastSaved?: string | number | Date | null;
  autoSaveError?: any;
}

export interface EditorCoreActions {
  setCurrentStep: (step: number) => void;
  selectBlock: (id: string | null) => void;
  updateSelectedBlock: (updates: Partial<Block>) => void;
  deleteSelectedBlock: () => void;
  getBlocksForStepNumber: (stepNumber: number) => Block[];
  addBlock: (stepNumber: number, block: Block) => void;
  reorderBlocks: (stepNumber: number, oldIndex: number, newIndex: number) => void;
  addBlockAtIndex: (stepNumber: number, block: Block, index: number) => void;
  setStepBlocks: (stepNumber: number, blocks: Block[]) => void;
}

export function useEditorCore(): { state: EditorCoreState; actions: EditorCoreActions } {
  const { editor } = useEditorContext();
  const editorState = (editor as any)?.state || editor;
  const editorActions = (editor as any)?.actions || editor;

  const safeCurrentStep: number = editorState?.currentStep || 1;
  const selectedBlockId: string | null = editorState?.selectedBlockId || null;
  const stepBlocks: Record<string, Block[]> | undefined = editorState?.stepBlocks as any;

  const actions: EditorCoreActions = {
    setCurrentStep: (step: number) => {
      const fn = editorActions?.setCurrentStep || (() => {});
      fn(step);
    },
    selectBlock: (id: string | null) => {
      const fn = editorActions?.selectBlock || (() => {});
      fn(id);
    },
    updateSelectedBlock: (updates: Partial<Block>) => {
      if (!selectedBlockId) return;
      const fn = editorActions?.updateBlock || (() => {});
      fn(safeCurrentStep, selectedBlockId, updates);
    },
    deleteSelectedBlock: () => {
      if (!selectedBlockId) return;
      const selectFn = editorActions?.selectBlock || (() => {});
      const removeFn = editorActions?.removeBlock || (() => {});
      selectFn(null);
      removeFn(safeCurrentStep, selectedBlockId);
    },
    getBlocksForStepNumber: (stepNumber: number) => {
      const key = `step-${stepNumber}`;
      const list = (stepBlocks as any)?.[key] as Block[] | undefined;
      return Array.isArray(list) ? list : [];
    },
    addBlock: (stepNumber: number, block: Block) => {
      const stepKey = `step-${stepNumber}`;
      // Tentar assinatura (stepKey, block)
      if (typeof editorActions?.addBlock === 'function') {
        try {
          editorActions.addBlock(stepKey, block);
          return;
        } catch {}
        try {
          // Fallback: algumas implementações aceitam (block, stepKey)
          editorActions.addBlock(block, stepKey);
          return;
        } catch {}
      }
      // Fallback final: mutação direta no estado (não ideal, apenas emergência)
      const current = ((editorState as any).stepBlocks?.[stepKey] || []) as Block[];
      const next = [...current, block];
      // Tentar setStepBlocks com stepKey e com stepNumber
      try {
        editorActions?.setStepBlocks?.(stepKey, next);
        return;
      } catch {}
      try {
        editorActions?.setStepBlocks?.(stepNumber, next);
        return;
      } catch {}
    },
    reorderBlocks: (stepNumber: number, oldIndex: number, newIndex: number) => {
      const stepKey = `step-${stepNumber}`;
      if (typeof editorActions?.reorderBlocks === 'function') {
        try {
          editorActions.reorderBlocks(stepKey, oldIndex, newIndex);
          return;
        } catch {}
      }
      // Fallback: calcular novo array e aplicar via setStepBlocks
      const arr = [...(actions.getBlocksForStepNumber(stepNumber) || [])];
      const [moved] = arr.splice(oldIndex, 1);
      if (moved) {
        arr.splice(newIndex, 0, moved);
        try {
          editorActions?.setStepBlocks?.(stepKey, arr);
          return;
        } catch {}
        try {
          editorActions?.setStepBlocks?.(stepNumber, arr);
          return;
        } catch {}
      }
    },
    addBlockAtIndex: (stepNumber: number, block: Block, index: number) => {
      const stepKey = `step-${stepNumber}`;
      // Prefer addBlockAtIndex se existir
      if (typeof (editorActions as any)?.addBlockAtIndex === 'function') {
        try {
          (editorActions as any).addBlockAtIndex(stepKey, block, index);
          return;
        } catch {}
        try {
          (editorActions as any).addBlockAtIndex(stepNumber, block, index);
          return;
        } catch {}
      }
      // Tentar addBlock com índice
      if (typeof editorActions?.addBlock === 'function') {
        try {
          (editorActions as any).addBlock(stepKey, block, index);
          return;
        } catch {}
        try {
          (editorActions as any).addBlock(stepNumber, block, index);
          return;
        } catch {}
      }
      // Fallback: construir novo array e aplicar via setStepBlocks
      const current = actions.getBlocksForStepNumber(stepNumber) || [];
      const clamped = Math.max(0, Math.min(current.length, index));
      const next = [...current.slice(0, clamped), block, ...current.slice(clamped)];
      try {
        (editorActions as any)?.setStepBlocks?.(stepKey, next);
        return;
      } catch {}
      try {
        (editorActions as any)?.setStepBlocks?.(stepNumber, next);
        return;
      } catch {}
    },
    setStepBlocks: (stepNumber: number, blocks: Block[]) => {
      const stepKey = `step-${stepNumber}`;
      try {
        (editorActions as any)?.setStepBlocks?.(stepKey, blocks);
        return;
      } catch {}
      try {
        (editorActions as any)?.setStepBlocks?.(stepNumber, blocks);
        return;
      } catch {}
    },
  };

  const state: EditorCoreState = useMemo(
    () => ({
      currentStep: safeCurrentStep,
      selectedBlockId,
      stepBlocks,
      isSaving: (editorState as any)?.isSaving,
      lastSaved: (editorState as any)?.lastSaved,
      autoSaveError: (editorState as any)?.autoSaveError,
    }),
    [safeCurrentStep, selectedBlockId, stepBlocks, editorState]
  );

  return { state, actions };
}

export type UseEditorCore = ReturnType<typeof useEditorCore>;
