/**
 * 🔒 USE QUEUED AUTOSAVE - Autosave com Lock e Coalescing
 * 
 * Resolve GARGALO R1 (CRÍTICO): Autosave sem serialização/locks
 * 
 * PROBLEMAS RESOLVIDOS:
 * - ❌ Saves concorrentes (múltiplos setTimeout)
 * - ❌ Sobrescrita de alterações
 * - ❌ Sem retry/backoff
 * - ❌ Sem coalescing de mudanças
 * 
 * SOLUÇÃO:
 * - ✅ Fila por step (coalesce de mudanças)
 * - ✅ Lock por step (previne concorrência)
 * - ✅ Retry com backoff exponencial
 * - ✅ Feedback de erro para usuário
 * 
 * @version 1.0.0
 * @status PRODUCTION-READY
 */

import { useCallback, useRef, useEffect } from 'react';
import { appLogger } from '@/lib/utils/logger';
import { editorMetrics } from '@/lib/utils/editorMetrics';
import type { Block } from '@/types/editor';

interface SaveQueueEntry {
  stepKey: string;
  blocks: Block[];
  timestamp: number;
  retryCount: number;
}

interface UseQueuedAutosaveOptions {
  /** Função para salvar blocos (ex: saveStepBlocks do SuperUnified) */
  saveFn: (blocks: Block[], stepKey: string) => Promise<void>;
  
  /** Debounce em ms antes de processar fila (default: 2000ms) */
  debounceMs?: number;
  
  /** Máximo de retries em caso de erro (default: 3) */
  maxRetries?: number;
  
  /** Callback executado após sucesso */
  onSuccess?: (stepKey: string) => void;
  
  /** Callback executado após falha final */
  onError?: (stepKey: string, error: Error) => void;
  
  /** Callback executado quando inicia save (para feedback visual) */
  onSaving?: (stepKey: string) => void;
  
  /** Callback executado quando save entra na fila (unsaved indicator) */
  onUnsaved?: (stepKey: string) => void;
}

interface UseQueuedAutosaveReturn {
  /** Adiciona save à fila (coalesce automático) */
  queueSave: (stepKey: string, blocks: Block[]) => void;
  
  /** Força processamento imediato da fila */
  flush: () => Promise<void>;
  
  /** Limpa fila sem salvar */
  clear: () => void;
  
  /** Estado: steps sendo salvos atualmente */
  savingKeys: Set<string>;
  
  /** Estado: steps pendentes na fila */
  pendingKeys: Set<string>;
}

/**
 * Hook para autosave com lock e coalescing
 */
export function useQueuedAutosave(options: UseQueuedAutosaveOptions): UseQueuedAutosaveReturn {
  const {
    saveFn,
    debounceMs = 2000,
    maxRetries = 3,
    onSuccess,
    onError,
    onSaving,
    onUnsaved,
  } = options;

  // Fila de saves pendentes (Map para coalescing)
  const saveQueue = useRef<Map<string, SaveQueueEntry>>(new Map());
  
  // Locks por step (Set de stepKeys sendo salvos)
  const savingKeys = useRef<Set<string>>(new Set());
  
  // Timer para debounce
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Processa fila de saves
   */
  const processSaveQueue = useCallback(async () => {
    const entries = Array.from(saveQueue.current.entries());
    
    if (entries.length === 0) {
      return;
    }

    appLogger.debug(`[QueuedAutosave] Processando fila com ${entries.length} steps`);

    for (const [stepKey, entry] of entries) {
      // Lock: não salva se já está salvando
      if (savingKeys.current.has(stepKey)) {
        appLogger.debug(`🔒 [QueuedAutosave] Step ${stepKey} já está salvando, aguardando...`);
        continue;
      }

      // Remove da fila e marca como "saving"
      saveQueue.current.delete(stepKey);
      savingKeys.current.add(stepKey);
      
      // Feedback visual: iniciando save
      if (onSaving) {
        onSaving(stepKey);
      }

      try {
        // Telemetria: save iniciado
        editorMetrics.trackEvent('autosave_queued', { 
          stepKey, 
          queueSize: saveQueue.current.size,
          retryCount: entry.retryCount,
        });

        // Executa save
        await saveFn(entry.blocks, stepKey);

        // Sucesso
        appLogger.info(`✅ [QueuedAutosave] Step ${stepKey} salvo com sucesso`);
        editorMetrics.trackEvent('autosave_success', { stepKey });
        
        if (onSuccess) {
          onSuccess(stepKey);
        }
      } catch (error) {
        appLogger.error(`❌ [QueuedAutosave] Falha ao salvar ${stepKey}:`, error);

        // Retry com backoff exponencial
        if (entry.retryCount < maxRetries) {
          const retryDelay = Math.pow(2, entry.retryCount) * 1000; // 1s, 2s, 4s
          const retryCount = entry.retryCount + 1;

          appLogger.warn(`🔄 [QueuedAutosave] Retry ${retryCount}/${maxRetries} para ${stepKey} em ${retryDelay}ms`);

          setTimeout(() => {
            saveQueue.current.set(stepKey, {
              ...entry,
              retryCount,
              timestamp: Date.now(),
            });
            processSaveQueue();
          }, retryDelay);

          editorMetrics.trackEvent('autosave_retry', { 
            stepKey, 
            retryCount, 
            retryDelay,
          });
        } else {
          // Falha final
          appLogger.error(`💥 [QueuedAutosave] Falha final para ${stepKey} após ${maxRetries} retries`);
          
          editorMetrics.trackEvent('autosave_failure', { 
            stepKey, 
            retryCount: entry.retryCount,
          });

          if (onError) {
            onError(stepKey, error as Error);
          }
        }
      } finally {
        // Remove lock
        savingKeys.current.delete(stepKey);
      }
    }
  }, [saveFn, maxRetries, onSuccess, onError]);

  /**
   * Adiciona save à fila (coalesce automático)
   */
  const queueSave = useCallback((stepKey: string, blocks: Block[]) => {
    const existingEntry = saveQueue.current.get(stepKey);
    
    if (existingEntry) {
      // Coalesce: substitui save pendente
      appLogger.debug(`🔄 [QueuedAutosave] Coalescing save para ${stepKey}`);
      editorMetrics.trackEvent('autosave_coalesced', { stepKey });
    }

    // Adiciona/atualiza entrada na fila
    saveQueue.current.set(stepKey, {
      stepKey,
      blocks,
      timestamp: Date.now(),
      retryCount: 0,
    });
    
    // Feedback visual: alterações não salvas
    if (onUnsaved) {
      onUnsaved(stepKey);
    }

    // Debounce: aguarda estabilização antes de processar
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      processSaveQueue();
    }, debounceMs);

    appLogger.debug(`📝 [QueuedAutosave] Save enfileirado para ${stepKey} (queue size: ${saveQueue.current.size})`);
  }, [debounceMs, processSaveQueue, onUnsaved]);

  /**
   * Força processamento imediato da fila
   */
  const flush = useCallback(async () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    await processSaveQueue();
  }, [processSaveQueue]);

  /**
   * Limpa fila sem salvar
   */
  const clear = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    saveQueue.current.clear();
    appLogger.debug('[QueuedAutosave] Fila limpa');
  }, []);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    queueSave,
    flush,
    clear,
    savingKeys: savingKeys.current,
    pendingKeys: new Set(saveQueue.current.keys()),
  };
}
