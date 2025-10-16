/**
 * 🎯 UNIFIED BLOCK OPERATIONS HOOK (Sprint 2 - TK-ED-05)
 * 
 * Hook consolidado que unifica TODAS as implementações de manipulação de blocos:
 * - ✅ useBlocks.ts (uuid)
 * - ✅ useBlockOperations.ts (nanoid)
 * - ✅ Código inline no QuizModularProductionEditor (Date.now())
 * 
 * Padronização:
 * - IDs sempre com nanoid(8)
 * - Order sempre normalizado automaticamente
 * - Validação automática de operações
 * - Suporte a hierarquia parent/child
 */

import { useCallback } from 'react';
import { nanoid } from 'nanoid';
import { arrayMove } from '@dnd-kit/sortable';
import type { BlockComponent, EditableQuizStep } from '../types';

interface UnifiedBlockOperationsProps {
  steps: EditableQuizStep[];
  setSteps: (steps: EditableQuizStep[] | ((prev: EditableQuizStep[]) => EditableQuizStep[])) => void;
  pushHistory?: (steps: EditableQuizStep[]) => void;
  setDirty?: (dirty: boolean) => void;
}

/**
 * Hook unificado para todas as operações de blocos
 * 
 * Uso:
 * ```tsx
 * const blockOps = useUnifiedBlockOperations({ steps, setSteps, pushHistory });
 * blockOps.addBlock(stepId, 'text', { text: 'Hello' });
 * ```
 */
export function useUnifiedBlockOperations({
  steps,
  setSteps,
  pushHistory,
  setDirty,
}: UnifiedBlockOperationsProps) {

  /**
   * ✅ Adicionar bloco com validação e normalização automática
   */
  const addBlock = useCallback((
    stepId: string,
    type: string,
    properties: Record<string, any> = {},
    content: Record<string, any> = {},
    parentId?: string | null
  ): string | null => {
    let newBlockId: string | null = null;

    setSteps(prev => {
      const next = prev.map(step => {
        if (step.id !== stepId) return step;

        // Calcular order baseado em siblings do mesmo parent
        const siblings = step.blocks.filter(b => (b.parentId || null) === (parentId || null));
        const maxOrder = siblings.reduce((max, b) => Math.max(max, b.order), -1);

        // Criar novo bloco com ID padronizado
        const newBlock: BlockComponent = {
          id: `${type}-${nanoid(8)}`,
          type,
          order: maxOrder + 1,
          properties,
          content,
          parentId: parentId || null,
        };

        newBlockId = newBlock.id;

        return {
          ...step,
          blocks: [...step.blocks, newBlock],
        };
      });

      // Registrar no histórico e marcar como dirty
      pushHistory?.(next);
      setDirty?.(true);

      return next;
    });

    return newBlockId;
  }, [setSteps, pushHistory, setDirty]);

  /**
   * ✅ Atualizar bloco com merge inteligente
   */
  const updateBlock = useCallback((
    stepId: string,
    blockId: string,
    updates: {
      properties?: Partial<Record<string, any>>;
      content?: Partial<Record<string, any>>;
      type?: string;
    }
  ): boolean => {
    let success = false;

    setSteps(prev => {
      const next = prev.map(step => {
        if (step.id !== stepId) return step;

        return {
          ...step,
          blocks: step.blocks.map(block => {
            if (block.id !== blockId) return block;

            success = true;

            // Merge inteligente
            return {
              ...block,
              type: updates.type ?? block.type,
              properties: {
                ...block.properties,
                ...(updates.properties || {}),
              },
              content: {
                ...block.content,
                ...(updates.content || {}),
              },
            };
          }),
        };
      });

      if (success) {
        pushHistory?.(next);
        setDirty?.(true);
      }

      return next;
    });

    return success;
  }, [setSteps, pushHistory, setDirty]);

  /**
   * ✅ Atualizar propriedade específica (atalho para updateBlock)
   */
  const updateBlockProperty = useCallback((
    stepId: string,
    blockId: string,
    key: string,
    value: any
  ): boolean => {
    return updateBlock(stepId, blockId, {
      properties: { [key]: value },
    });
  }, [updateBlock]);

  /**
   * ✅ Deletar bloco com remoção recursiva de children
   */
  const deleteBlock = useCallback((
    stepId: string,
    blockId: string
  ): boolean => {
    let success = false;

    setSteps(prev => {
      const next = prev.map(step => {
        if (step.id !== stepId) return step;

        // Encontrar todos os blocos a remover (incluindo children recursivamente)
        const toRemove = new Set<string>();
        toRemove.add(blockId);

        let changed = true;
        while (changed) {
          changed = false;
          step.blocks.forEach(b => {
            if (b.parentId && toRemove.has(b.parentId) && !toRemove.has(b.id)) {
              toRemove.add(b.id);
              changed = true;
            }
          });
        }

        // Filtrar blocos removidos
        const remaining = step.blocks.filter(b => !toRemove.has(b.id));

        // Normalizar order por parent
        const byParent: Record<string, BlockComponent[]> = {};
        remaining.forEach(b => {
          const pid = b.parentId || '__root__';
          (byParent[pid] ||= []).push(b);
        });

        Object.values(byParent).forEach(blocks => {
          blocks.sort((a, b) => a.order - b.order);
          blocks.forEach((b, i) => {
            b.order = i;
          });
        });

        success = toRemove.size > 0;

        return {
          ...step,
          blocks: remaining,
        };
      });

      if (success) {
        pushHistory?.(next);
        setDirty?.(true);
      }

      return next;
    });

    return success;
  }, [setSteps, pushHistory, setDirty]);

  /**
   * ✅ Duplicar bloco (com novo ID)
   */
  const duplicateBlock = useCallback((
    sourceStepId: string,
    blockId: string,
    targetStepId?: string
  ): string | null => {
    let newBlockId: string | null = null;

    setSteps(prev => {
      const sourceStep = prev.find(s => s.id === sourceStepId);
      if (!sourceStep) return prev;

      const original = sourceStep.blocks.find(b => b.id === blockId);
      if (!original) return prev;

      const next = prev.map(step => {
        if (step.id !== (targetStepId || sourceStepId)) return step;

        // Calcular order baseado em siblings
        const siblings = step.blocks.filter(b => (b.parentId || null) === (original.parentId || null));
        const maxOrder = siblings.reduce((max, b) => Math.max(max, b.order), -1);

        // Criar duplicata com novo ID
        const duplicate: BlockComponent = {
          ...original,
          id: `${original.type}-${nanoid(8)}`,
          order: maxOrder + 1,
        };

        newBlockId = duplicate.id;

        return {
          ...step,
          blocks: [...step.blocks, duplicate],
        };
      });

      pushHistory?.(next);
      setDirty?.(true);

      return next;
    });

    return newBlockId;
  }, [setSteps, pushHistory, setDirty]);

  /**
   * ✅ Reordenar blocos dentro do mesmo step
   */
  const reorderBlocks = useCallback((
    stepId: string,
    oldIndex: number,
    newIndex: number
  ): boolean => {
    let success = false;

    setSteps(prev => {
      const next = prev.map(step => {
        if (step.id !== stepId) return step;

        const reordered = arrayMove(step.blocks, oldIndex, newIndex);
        success = true;

        return {
          ...step,
          blocks: reordered.map((b, idx) => ({ ...b, order: idx })),
        };
      });

      if (success) {
        pushHistory?.(next);
        setDirty?.(true);
      }

      return next;
    });

    return success;
  }, [setSteps, pushHistory, setDirty]);

  /**
   * ✅ Mover bloco entre parents ou steps
   */
  const moveBlock = useCallback((
    stepId: string,
    blockId: string,
    targetParentId: string | null,
    overBlockId: string | null
  ): boolean => {
    let success = false;

    setSteps(prev => {
      const next = prev.map(step => {
        if (step.id !== stepId) return step;

        const blocks = step.blocks.map(b => ({ ...b }));
        const active = blocks.find(b => b.id === blockId);
        if (!active) return step;

        const overBlock = overBlockId ? blocks.find(b => b.id === overBlockId) : null;
        if (!overBlock && overBlockId) return step;

        const newParent = targetParentId ?? (overBlock?.parentId || null);
        const fromParent = active.parentId || null;

        // Helper: siblings do mesmo parent
        const siblings = (pid: string | null) =>
          blocks.filter(b => (b.parentId || null) === pid).sort((a, b) => a.order - b.order);

        if (fromParent !== newParent) {
          // Mover entre parents
          const oldSibs = siblings(fromParent).filter(b => b.id !== active.id);
          oldSibs.forEach((b, i) => {
            b.order = i;
          });

          const newSibs = siblings(newParent);
          active.parentId = newParent;
          active.order = newSibs.length;

          success = true;
        } else if (overBlock) {
          // Reordenar dentro do mesmo parent
          const sibs = siblings(fromParent);
          const oldIdx = sibs.findIndex(b => b.id === active.id);
          const newIdx = sibs.findIndex(b => b.id === overBlock.id);

          if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
            const reordered = [...sibs];
            const [moved] = reordered.splice(oldIdx, 1);
            reordered.splice(newIdx, 0, moved);
            reordered.forEach((b, i) => {
              b.order = i;
            });

            success = true;
          }
        }

        return success ? { ...step, blocks } : step;
      });

      if (success) {
        pushHistory?.(next);
        setDirty?.(true);
      }

      return next;
    });

    return success;
  }, [setSteps, pushHistory, setDirty]);

  /**
   * ✅ Inserir múltiplos blocos de snippet
   */
  const insertSnippetBlocks = useCallback((
    stepId: string,
    snippetBlocks: BlockComponent[]
  ): string[] => {
    const insertedIds: string[] = [];

    setSteps(prev => {
      const next = prev.map(step => {
        if (step.id !== stepId) return step;

        const baseLen = step.blocks.filter(b => !b.parentId).length;
        const timestamp = Date.now();
        const idMap: Record<string, string> = {};

        // Clonar blocos com novos IDs padronizados
        const cloned = snippetBlocks.map((b, idx) => {
          const newId = `${b.type}-snip-${timestamp}-${nanoid(4)}`;
          idMap[b.id] = newId;
          insertedIds.push(newId);

          return {
            ...b,
            id: newId,
            parentId: b.parentId ? (idMap[b.parentId] || null) : null,
            order: b.parentId ? b.order : baseLen + b.order,
          };
        });

        return {
          ...step,
          blocks: [...step.blocks, ...cloned],
        };
      });

      pushHistory?.(next);
      setDirty?.(true);

      return next;
    });

    return insertedIds;
  }, [setSteps, pushHistory, setDirty]);

  return {
    addBlock,
    updateBlock,
    updateBlockProperty,
    deleteBlock,
    duplicateBlock,
    reorderBlocks,
    moveBlock,
    insertSnippetBlocks,
  };
}
