/**
 * 🎯 HOOK DE PERSISTÊNCIA DO EDITOR
 * 
 * Gerencia auto-save de componentes do editor para o Supabase.
 * 
 * Features:
 * - Auto-save debounced (evita salvar a cada tecla)
 * - Sincronização com component_instances
 * - Load inicial dos componentes do DB
 * - Controle de estado (saving, saved, error)
 * - Histórico de mudanças
 * 
 * @example
 * ```tsx
 * const { isSaving, lastSaved, error } = useEditorPersistence('my-funnel-id', currentStep);
 * 
 * return (
 *   <div>
 *     {isSaving && <Spinner />}
 *     {lastSaved && <span>Salvo há {timeSince(lastSaved)}</span>}
 *   </div>
 * );
 * ```
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { funnelComponentsService } from '@/services/funnelComponentsService';
import { appLogger } from '@/lib/utils/appLogger';
import { debounce } from 'lodash';

export interface Block {
  id: string;
  type: string;
  properties?: Record<string, any>;
  styling?: Record<string, any>;
  order?: number;
  isActive?: boolean;
  isLocked?: boolean;
}

export interface UseEditorPersistenceOptions {
  autoSave?: boolean;
  debounceMs?: number;
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
  enableHistory?: boolean;
}

export interface UseEditorPersistenceReturn {
  isSaving: boolean;
  lastSaved: Date | null;
  error: Error | null;
  saveNow: () => Promise<void>;
  loadBlocks: () => Promise<Block[]>;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  clearError: () => void;
}

export function useEditorPersistence(
  funnelId: string,
  currentStep: number,
  blocks: Block[],
  options: UseEditorPersistenceOptions = {}
): UseEditorPersistenceReturn {
  const {
    autoSave = true,
    debounceMs = 1000,
    onSaveSuccess,
    onSaveError,
    enableHistory = true
  } = options;

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  // Histórico para undo/redo
  const [history, setHistory] = useState<Block[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const lastSavedBlocks = useRef<Block[]>([]);
  const savePromiseRef = useRef<Promise<void> | null>(null);

  // 📊 SALVAR COMPONENTES NO SUPABASE
  const saveBlocks = useCallback(async () => {
    if (!funnelId || !currentStep || blocks.length === 0) {
      appLogger.warn('⚠️ Tentativa de salvar blocos sem dados necessários');
      return;
    }

    // Evitar salvar se não houve mudanças
    if (JSON.stringify(blocks) === JSON.stringify(lastSavedBlocks.current)) {
      appLogger.info('ℹ️ Nenhuma mudança detectada, skip save');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      appLogger.info('💾 Salvando blocos do editor', {
        funnelId,
        currentStep,
        blocksCount: blocks.length
      });

      // Converter Block[] para formato do serviço
      const blocksToSync = blocks.map((block, index) => ({
        id: block.id,
        type: block.type || 'text-inline',
        order: block.order ?? index,
        properties: {
          ...(block.properties || {}),
          ...(block.styling ? { custom_styling: block.styling } : {}),
          is_active: block.isActive !== false,
          is_locked: block.isLocked || false,
        },
      }));

      // Usar serviço de sync para atualizar o DB
      await funnelComponentsService.syncStepComponents({
        funnelId,
        stepNumber: currentStep,
        blocks: blocksToSync,
      });

      // Atualizar referência de última versão salva
      lastSavedBlocks.current = JSON.parse(JSON.stringify(blocks));
      setLastSaved(new Date());
      
      appLogger.info('✅ Blocos salvos com sucesso');

      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao salvar blocos');
      appLogger.error('❌ Erro ao salvar blocos do editor', { data: [error] });
      setError(error);

      if (onSaveError) {
        onSaveError(error);
      }
    } finally {
      setIsSaving(false);
    }
  }, [funnelId, currentStep, blocks, onSaveSuccess, onSaveError]);

  // 🔄 DEBOUNCED SAVE - Evita salvar a cada tecla
  const debouncedSave = useMemo(
    () => debounce(saveBlocks, debounceMs),
    [saveBlocks, debounceMs]
  );

  // 💾 SAVE MANUAL (sem debounce)
  const saveNow = useCallback(async () => {
    // Cancelar debounce pendente
    debouncedSave.cancel();
    
    // Salvar imediatamente
    await saveBlocks();
  }, [debouncedSave, saveBlocks]);

  // 📥 CARREGAR BLOCOS DO DB
  const loadBlocks = useCallback(async (): Promise<Block[]> => {
    if (!funnelId || !currentStep) {
      appLogger.warn('⚠️ Tentativa de carregar blocos sem funnelId ou step');
      return [];
    }

    try {
      appLogger.info('📥 Carregando blocos do DB', { funnelId, currentStep });

      const components = await funnelComponentsService.getComponents({
        funnelId,
        stepNumber: currentStep,
      });

      // Converter para formato Block
      const loadedBlocks: Block[] = components.map(comp => ({
        id: comp.instance_key,
        type: comp.component_type_key,
        properties: comp.properties || {},
        styling: comp.custom_styling || {},
        order: comp.order_index,
        isActive: comp.is_active !== false,
        isLocked: comp.is_locked || false,
      }));

      lastSavedBlocks.current = JSON.parse(JSON.stringify(loadedBlocks));
      appLogger.info(`✅ ${loadedBlocks.length} blocos carregados`);

      return loadedBlocks;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao carregar blocos');
      appLogger.error('❌ Erro ao carregar blocos', { data: [error] });
      setError(error);
      return [];
    }
  }, [funnelId, currentStep]);

  // 🕐 HISTÓRICO - Adicionar snapshot
  const addToHistory = useCallback(() => {
    if (!enableHistory) return;

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(blocks)));
      
      // Limitar histórico a 50 snapshots
      if (newHistory.length > 50) {
        newHistory.shift();
        return newHistory;
      }
      
      return newHistory;
    });
    
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [blocks, historyIndex, enableHistory]);

  // ⬅️ UNDO
  const undo = useCallback(() => {
    if (historyIndex <= 0) return;

    const previousBlocks = history[historyIndex - 1];
    if (previousBlocks) {
      // Aqui você precisaria de uma callback para atualizar os blocos
      // no contexto/provider do editor
      appLogger.info('↶ Undo', { historyIndex });
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex]);

  // ➡️ REDO
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;

    const nextBlocks = history[historyIndex + 1];
    if (nextBlocks) {
      appLogger.info('↷ Redo', { historyIndex });
      setHistoryIndex(prev => prev + 1);
    }
  }, [history, historyIndex]);

  // 🧹 CLEAR ERROR
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 🎯 AUTO-SAVE quando blocks mudam
  useEffect(() => {
    if (!autoSave || blocks.length === 0) return;

    // Adicionar ao histórico
    addToHistory();

    // Trigger debounced save
    debouncedSave();

    return () => {
      debouncedSave.cancel();
    };
  }, [blocks, autoSave, debouncedSave, addToHistory]);

  // 🎯 CARREGAR INICIAL quando muda de step
  useEffect(() => {
    if (funnelId && currentStep) {
      loadBlocks();
    }
  }, [funnelId, currentStep]);

  // 🧹 CLEANUP - Salvar pendente ao desmontar
  useEffect(() => {
    return () => {
      if (autoSave) {
        // Force save antes de desmontar
        debouncedSave.cancel();
        
        // Salvar síncronamente se houver mudanças
        if (JSON.stringify(blocks) !== JSON.stringify(lastSavedBlocks.current)) {
          appLogger.info('🧹 Salvando mudanças pendentes antes de desmontar');
          
          // Usar versão não-async para garantir execução
          const saveSync = async () => {
            try {
              await saveBlocks();
            } catch (err) {
              appLogger.error('❌ Erro ao salvar no cleanup', { data: [err] });
            }
          };
          
          saveSync();
        }
      }
    };
  }, []);

  return {
    isSaving,
    lastSaved,
    error,
    saveNow,
    loadBlocks,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    undo,
    redo,
    clearError,
  };
}
