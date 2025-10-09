/**
 * 🎯 HOOK: Operações de Blocos
 * Gerencia adição, remoção, edição e reordenação de blocos
 */

import { useCallback } from 'react';
import { nanoid } from 'nanoid';
import { arrayMove } from '@dnd-kit/sortable';
// Usar tipos centrais do editor para evitar import de hooks
import type { BlockComponent, EditableQuizStep } from '../types';

interface BlockOperationsProps {
  steps: EditableQuizStep[];
  setSteps: (steps: EditableQuizStep[]) => void;
  selectedStepId: string | null;
  setSelectedBlockId: (id: string | null) => void;
}

export function useBlockOperations({
  steps,
  setSteps,
  selectedStepId,
  setSelectedBlockId,
}: BlockOperationsProps) {

  const addBlock = useCallback((type: string, properties: Record<string, any> = {}) => {
    if (!selectedStepId) return;

    const updated = steps.map(step => {
      if (step.id !== selectedStepId) return step;

      const newBlock: BlockComponent = {
        id: nanoid(),
        type,
        order: step.blocks.length,
        properties,
        content: {},
      };

      return {
        ...step,
        blocks: [...step.blocks, newBlock],
      };
    });

    setSteps(updated);

    // Seleciona o novo bloco
    const newBlock = updated.find(s => s.id === selectedStepId)?.blocks.slice(-1)[0];
    if (newBlock) setSelectedBlockId(newBlock.id);
  }, [steps, selectedStepId, setSteps, setSelectedBlockId]);

  const deleteBlock = useCallback((blockId: string) => {
    if (!selectedStepId) return;

    const updated = steps.map(step => {
      if (step.id !== selectedStepId) return step;

      const filtered = step.blocks.filter((b: BlockComponent) => b.id !== blockId);
      const reordered = filtered.map((b: BlockComponent, idx: number) => ({ ...b, order: idx }));

      return {
        ...step,
        blocks: reordered,
      };
    });

    setSteps(updated);
    setSelectedBlockId(null);
  }, [steps, selectedStepId, setSteps, setSelectedBlockId]);

  const duplicateBlock = useCallback((blockId: string) => {
    if (!selectedStepId) return;

    const updated = steps.map(step => {
      if (step.id !== selectedStepId) return step;

      const original = step.blocks.find((b: BlockComponent) => b.id === blockId);
      if (!original) return step;

      const duplicate: BlockComponent = {
        ...original,
        id: nanoid(),
        order: step.blocks.length,
      };

      return {
        ...step,
        blocks: [...step.blocks, duplicate],
      };
    });

    setSteps(updated);
  }, [steps, selectedStepId, setSteps]);

  const updateBlockProperty = useCallback((
    blockId: string,
    key: string,
    value: any
  ) => {
    if (!selectedStepId) return;

    const updated = steps.map(step => {
      if (step.id !== selectedStepId) return step;

      return {
        ...step,
        blocks: step.blocks.map((block: BlockComponent) =>
          block.id === blockId
            ? { ...block, properties: { ...block.properties, [key]: value } }
            : block
        ),
      };
    });

    setSteps(updated);
  }, [steps, selectedStepId, setSteps]);

  const reorderBlocks = useCallback((oldIndex: number, newIndex: number) => {
    if (!selectedStepId) return;

    const updated = steps.map(step => {
      if (step.id !== selectedStepId) return step;

      const reordered = arrayMove(step.blocks, oldIndex, newIndex);
      return {
        ...step,
        blocks: reordered.map((b, idx) => ({ ...b, order: idx })),
      };
    });

    setSteps(updated);
  }, [steps, selectedStepId, setSteps]);

  return {
    addBlock,
    deleteBlock,
    duplicateBlock,
    updateBlockProperty,
    reorderBlocks,
  };
}
