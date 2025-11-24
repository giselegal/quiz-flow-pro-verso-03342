/**
 * 🔗 useWYSIWYGBridge - Ponte entre useWYSIWYG e useSuperUnified
 * 
 * Conecta o sistema WYSIWYG local com o state management global do editor.
 * Sincroniza mudanças bidirecionalmente:
 * - WYSIWYG → SuperUnified (auto-save)
 * - SuperUnified → WYSIWYG (quando step muda ou dados carregam)
 * 
 * @version 1.0.0
 */

import { useEffect, useCallback, useRef } from 'react';
import { useWYSIWYG } from './useWYSIWYG';
import { useSuperUnified } from './useSuperUnified';
import { appLogger } from '@/lib/utils/appLogger';
import type { Block } from '@/types/editor';

export interface WYSIWYGBridgeOptions {
  /** Step atual (1-based) */
  currentStep: number;
  /** Callback para auto-save */
  onAutoSave?: (blocks: Block[], stepKey: string) => void | Promise<void>;
  /** Debounce para auto-save (ms) */
  autoSaveDelay?: number;
  /** Habilitar validação */
  enableValidation?: boolean;
  /** Modo de operação */
  mode?: 'edit' | 'preview-live' | 'preview-production';
}

/**
 * Hook que une WYSIWYG com SuperUnified
 */
export function useWYSIWYGBridge(options: WYSIWYGBridgeOptions) {
  const {
    currentStep,
    onAutoSave,
    autoSaveDelay = 2000,
    enableValidation = true,
    mode = 'edit',
  } = options;

  const unified = useSuperUnified();
  const { getStepBlocks, setStepBlocks, updateBlock: unifiedUpdateBlock } = unified;

  // Ref para evitar loops infinitos
  const isSyncingRef = useRef(false);
  const lastSyncedStepRef = useRef<number>(currentStep);

  // Obter blocos do step atual
  const currentBlocks = getStepBlocks(currentStep);

  // Inicializar WYSIWYG com blocos do step
  const [wysiwygState, wysiwygActions] = useWYSIWYG(currentBlocks, {
    autoSaveDelay,
    enableValidation,
    mode,
    onBlockUpdate: (blockId, updates) => {
      // Sincronizar com SuperUnified em modo edit
      if (mode === 'edit' && !isSyncingRef.current) {
        try {
          isSyncingRef.current = true;
          const block = wysiwygState.blocks.find((b) => b.id === blockId);
          if (block) {
            unifiedUpdateBlock(currentStep, block.order, { ...block, ...updates });
          }
        } catch (error) {
          appLogger.error('[WYSIWYGBridge] Erro ao sincronizar com SuperUnified:', error);
        } finally {
          isSyncingRef.current = false;
        }
      }
    },
    onAutoSave: async (blocks) => {
      if (onAutoSave) {
        const stepKey = `step-${String(currentStep).padStart(2, '0')}`;
        await onAutoSave(blocks, stepKey);
      }
      // Sincronizar com SuperUnified
      if (!isSyncingRef.current) {
        try {
          isSyncingRef.current = true;
          setStepBlocks(currentStep, blocks);
          appLogger.debug('[WYSIWYGBridge] Auto-save sincronizado com SuperUnified');
        } catch (error) {
          appLogger.error('[WYSIWYGBridge] Erro ao sincronizar auto-save:', error);
        } finally {
          isSyncingRef.current = false;
        }
      }
    },
  });

  // Sincronizar quando step muda ou blocos mudam externamente
  useEffect(() => {
    const shouldSync =
      lastSyncedStepRef.current !== currentStep ||
      JSON.stringify(currentBlocks) !== JSON.stringify(wysiwygState.blocks);

    if (shouldSync && !isSyncingRef.current) {
      isSyncingRef.current = true;
      wysiwygActions.reset(currentBlocks);
      lastSyncedStepRef.current = currentStep;
      appLogger.debug('[WYSIWYGBridge] Blocos resetados:', {
        step: currentStep,
        count: currentBlocks.length,
      });
      isSyncingRef.current = false;
    }
  }, [currentStep, currentBlocks, wysiwygState.blocks, wysiwygActions]);

  // Actions estendidas com sincronização
  const bridgedActions = {
    ...wysiwygActions,

    // Override updateBlockProperties para sincronização instantânea
    updateBlockProperties: useCallback(
      (blockId: string, properties: Partial<Block['properties']>) => {
        wysiwygActions.updateBlockProperties(blockId, properties);

        // Em modo edit, sincronizar imediatamente com SuperUnified
        if (mode === 'edit' && !isSyncingRef.current) {
          try {
            isSyncingRef.current = true;
            const blockIndex = wysiwygState.blocks.findIndex((b) => b.id === blockId);
            if (blockIndex !== -1) {
              const block = wysiwygState.blocks[blockIndex];
              unifiedUpdateBlock(currentStep, blockIndex, {
                ...block,
                properties: { ...block.properties, ...properties },
              });
            }
          } catch (error) {
            appLogger.error('[WYSIWYGBridge] Erro ao sincronizar updateBlockProperties:', error);
          } finally {
            isSyncingRef.current = false;
          }
        }
      },
      [wysiwygActions, mode, currentStep, wysiwygState.blocks, unifiedUpdateBlock]
    ),

    // Sincronizar mudanças com SuperUnified
    syncToUnified: useCallback(() => {
      if (!isSyncingRef.current) {
        try {
          isSyncingRef.current = true;
          setStepBlocks(currentStep, wysiwygState.blocks);
          appLogger.info('[WYSIWYGBridge] Sincronização manual com SuperUnified realizada');
        } catch (error) {
          appLogger.error('[WYSIWYGBridge] Erro na sincronização manual:', error);
        } finally {
          isSyncingRef.current = false;
        }
      }
    }, [currentStep, wysiwygState.blocks, setStepBlocks]),
  };

  return {
    state: wysiwygState,
    actions: bridgedActions,
    unified,
  };
}

export default useWYSIWYGBridge;
