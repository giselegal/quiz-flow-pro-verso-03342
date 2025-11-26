/**
 * 🔗 useWYSIWYGBridge - Wrapper simplificado para useWYSIWYG
 * 
 * Conecta o sistema WYSIWYG local com callbacks externos para auto-save.
 * Gerencia sincronização de blocos entre steps.
 * 
 * @version 2.0.0 - Removida dependência do useSuperUnified deprecated
 */

import { useEffect, useCallback, useRef } from 'react';
import { useWYSIWYG } from './useWYSIWYG';
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
 * Hook que une WYSIWYG com callbacks externos
 */
export function useWYSIWYGBridge(options: WYSIWYGBridgeOptions) {
  const {
    currentStep,
    onAutoSave,
    autoSaveDelay = 2000,
    enableValidation = true,
    mode = 'edit',
  } = options;

  // Ref para evitar loops infinitos
  const isSyncingRef = useRef(false);
  const lastSyncedStepRef = useRef<number>(currentStep);

  // Inicializar blocos vazios (serão populados externamente)
  const initialBlocks: Block[] = [];

  // 🚨 DEBUG: Log da inicialização
  console.log('🔗 [WYSIWYGBridge] Inicialização/Re-render:', {
    currentStep,
    mode,
  });

  // Inicializar WYSIWYG com blocos vazios
  const [wysiwygState, wysiwygActions] = useWYSIWYG(initialBlocks, {
    autoSaveDelay,
    enableValidation,
    mode,
    onBlockUpdate: (blockId, updates) => {
      // Callback opcional para notificar mudanças
      if (mode === 'edit' && !isSyncingRef.current) {
        try {
          isSyncingRef.current = true;
          appLogger.debug('[WYSIWYGBridge] Block atualizado:', { blockId, updates });
        } catch (error) {
          appLogger.error('[WYSIWYGBridge] Erro ao processar atualização:', error);
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
      appLogger.debug('[WYSIWYGBridge] Auto-save executado');
    },
  });

  // Sincronizar quando step muda (apenas em modo edit)
  useEffect(() => {
    if (mode !== 'edit') return; // Prevenir resets em preview
    
    if (lastSyncedStepRef.current !== currentStep) {
      console.log('🔗 [WYSIWYGBridge] Step mudou:', {
        from: lastSyncedStepRef.current,
        to: currentStep,
      });
      lastSyncedStepRef.current = currentStep;
      // Reset será feito externamente via resetBlocks
    }
  }, [currentStep, mode]);

  // Actions estendidas
  const bridgedActions = {
    ...wysiwygActions,

    // Override updateBlockProperties com logging
    updateBlockProperties: useCallback(
      (blockId: string, properties: Partial<Block['properties']>) => {
        console.log('🔗 [WYSIWYGBridge] updateBlockProperties chamado:', { blockId, properties, mode });
        wysiwygActions.updateBlockProperties(blockId, properties);
      },
      [wysiwygActions, mode]
    ),

    // Método para resetar blocos externamente
    resetBlocks: useCallback((newBlocks: Block[]) => {
      if (!isSyncingRef.current) {
        try {
          isSyncingRef.current = true;
          console.log('🔄 [WYSIWYGBridge] RESETANDO blocos:', newBlocks.length);
          wysiwygActions.reset(newBlocks);
        } catch (error) {
          appLogger.error('[WYSIWYGBridge] Erro ao resetar blocos:', error);
        } finally {
          isSyncingRef.current = false;
        }
      }
    }, [wysiwygActions]),
  };

  return {
    state: wysiwygState,
    actions: bridgedActions,
  };
}

export default useWYSIWYGBridge;
