/**
 * @deprecated Este hook está DEPRECATED e será removido na FASE 3.
 * 
 * ⚠️ INCOMPATÍVEL com @core/contexts/EditorContext.
 * Criado para abstrair API "PureBuilder" (legada).
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ Antigo (deprecated)
 * import { usePureBuilder } from '@/hooks/usePureBuilderCompat';
 * const { actions } = usePureBuilder();
 * actions.addBlock(stepKey, block);
 * 
 * // ✅ Novo (recomendado)
 * import { useEditor } from '@/core/hooks';
 * const editor = useEditor();
 * editor.addBlock(step, block);
 * ```
 * 
 * @see docs/LEGACY_HOOKS_DEPRECATION.md - Guia completo de migração
 * SERÁ REMOVIDO NA FASE 3.
 */

import { useCallback, useMemo } from 'react';
import { useEditor } from '@/contexts/editor/EditorContext';
import type { Block } from '@/types/editor';

// Log de deprecação em desenvolvimento
if (import.meta.env.DEV) {
  console.warn(
    '🚨 DEPRECATED: usePureBuilderCompat será removido na FASE 3.\n' +
    'Migre para: import { useEditor } from "@/core/hooks";\n' +
    'Veja: docs/LEGACY_HOOKS_DEPRECATION.md'
  );
}
import { appLogger } from '@/lib/utils/appLogger';

interface PureBuilderState {
  currentStep: number;
  selectedBlockId: string | null;
  stepBlocks: Record<string, Block[]>;
  isLoading: boolean;
  totalSteps: number;
}

interface PureBuilderActions {
  setCurrentStep: (stepNumber: number) => Promise<void> | void;
  setSelectedBlockId: (blockId: string | null) => void;
  addBlock: (stepKey: string, block: Partial<Block> & { type: string }) => Promise<string | null>;
  updateBlock: (stepKey: string, blockId: string, updates: Partial<Block>) => Promise<void>;
  removeBlock: (stepKey: string, blockId: string) => Promise<void>;
  createFirstStep: () => Promise<void>;
}

export interface PureBuilderAPI {
  state: PureBuilderState;
  actions: PureBuilderActions;
}

const normalizeStepKey = (stepKey: string, fallbackStep: number): string => {
  if (!stepKey) return `step-${fallbackStep}`;
  if (stepKey.startsWith('step-')) return stepKey;
  const asNumber = Number(stepKey);
  if (!Number.isNaN(asNumber) && asNumber > 0) {
    return `step-${asNumber}`;
  }
  return `step-${fallbackStep}`;
};

export const usePureBuilder = (): PureBuilderAPI => {
  const editor = useEditor();
  const activeStepKey = editor.activeStageId ?? 'step-1';
  const currentStep = useMemo(() => {
    const match = activeStepKey.match(/step-(\d+)/);
    return match ? Number(match[1]) : 1;
  }, [activeStepKey]);

  const stepBlocks = useMemo(() => {
    const map: Record<string, Block[]> = {};
    if (Array.isArray(editor.stages)) {
      editor.stages.forEach(stage => {
        map[stage.id] = stage.id === activeStepKey ? editor.state.blocks : (stage.metadata?.blocks as Block[] | undefined) ?? [];
      });
    }
    if (!map[activeStepKey]) {
      map[activeStepKey] = editor.state.blocks;
    }
    return map;
  }, [editor.stages, activeStepKey, editor.state.blocks]);

  const ensureStepLoaded = useCallback(async (stepKey: string) => {
    const normalized = normalizeStepKey(stepKey, currentStep);
    if (normalized !== activeStepKey && editor.stageActions?.setActiveStage) {
      await editor.stageActions.setActiveStage(normalized);
    }
    return normalized;
  }, [activeStepKey, currentStep, editor.stageActions]);

  const addBlock = useCallback(async (
    stepKey: string,
    block: Partial<Block> & { type: string },
  ): Promise<string | null> => {
    try {
      await ensureStepLoaded(stepKey);
      const add = editor.blockActions?.addBlock ?? editor.addBlock;
      if (!add) {
        appLogger.warn('[PureBuilderCompat] addBlock não disponível');
        return null;
      }
      // addBlock aceita apenas type, retorna o ID
      const newId = await add(block.type as any);
      // Atualizar bloco com content e properties
      if (newId && (block.content || block.properties)) {
        const updateFn = editor.updateBlock;
        if (updateFn) {
          await updateFn(newId, {
            content: block.content,
            properties: block.properties,
          });
        }
      }
      if (editor.setSelectedBlockId) {
        editor.setSelectedBlockId(newId);
      }
      return newId ?? null;
    } catch (error) {
      appLogger.error('[PureBuilderCompat] Falha ao adicionar bloco', { data: [error] });
      return null;
    }
  }, [ensureStepLoaded, editor.blockActions, editor.addBlock, editor.updateBlock, editor.setSelectedBlockId]);

  const updateBlock = useCallback(async (stepKey: string, blockId: string, updates: Partial<Block>) => {
    try {
      await ensureStepLoaded(stepKey);
      // updateBlock aceita (id, updates) - 2 parâmetros
      if (editor.updateBlock) {
        await editor.updateBlock(blockId, updates);
      }
    } catch (error) {
      appLogger.error('[PureBuilderCompat] Falha ao atualizar bloco', { data: [error] });
    }
  }, [ensureStepLoaded, editor.updateBlock]);

  const removeBlock = useCallback(async (stepKey: string, blockId: string) => {
    try {
      await ensureStepLoaded(stepKey);
      await editor.deleteBlock(blockId);
    } catch (error) {
      appLogger.error('[PureBuilderCompat] Falha ao remover bloco', { data: [error] });
    }
  }, [ensureStepLoaded, editor.deleteBlock]);

  const createFirstStep = useCallback(async () => {
    const stepKey = 'step-1';
    await ensureStepLoaded(stepKey);
    if (!editor.state.blocks.length) {
      await addBlock(stepKey, { type: 'text-inline', content: { text: 'Novo bloco' } } as any);
    }
  }, [ensureStepLoaded, editor.state.blocks.length, addBlock]);

  const actions: PureBuilderActions = {
    setCurrentStep: async (stepNumber: number) => {
      const target = `step-${Math.max(1, stepNumber)}`;
      if (editor.stageActions?.setActiveStage) {
        await editor.stageActions.setActiveStage(target);
      }
    },
    setSelectedBlockId: (blockId: string | null) => {
      editor.setSelectedBlockId(blockId);
    },
    addBlock,
    updateBlock,
    removeBlock,
    createFirstStep,
  };

  const state: PureBuilderState = {
    currentStep,
    selectedBlockId: editor.state.selectedBlockId,
    stepBlocks,
    isLoading: Boolean(editor.isLoading),
    totalSteps: editor.stages?.length ?? 0,
  };

  return { state, actions };
};

export const usePureBuilderCompat = usePureBuilder;

export default usePureBuilder;
