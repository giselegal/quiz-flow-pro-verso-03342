/**
 * 💾 USE AUTO-SAVE HOOK
 * 
 * Fase 2.2 - Auto-save com debounce
 * 
 * Hook para auto-save automático com debounce em funnel mode
 * 
 * Features:
 * - Debounce de 2s (configurável)
 * - Visual indicator ("Salvando..." / "Salvo")
 * - Apenas em funnel mode (não em template mode)
 * - Error handling com retry
 * - Cancela save ao unmount
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useEditor } from '@/hooks/useEditor';
import { funnelComponentsService } from '@/services/funnelComponentsService';
import { convertBlocksToComponentInstances } from '@/utils/componentInstanceConverter';
import { useToast } from '@/hooks/use-toast';
import { retryWithBackoff, isNetworkError, isSupabaseError } from '@/utils/retryWithBackoff';

export type SaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

export interface RetryInfo {
  attempt: number;
  maxAttempts: number;
}

export interface UseAutoSaveOptions {
  /** Tempo de debounce em ms (default: 2000) */
  debounceMs?: number;
  /** Funnel ID (obrigatório) */
  funnelId?: string;
  /** Habilitar auto-save (default: true em funnel mode) */
  enabled?: boolean;
  /** Suprimir toasts internos do hook (default: false) */
  suppressToast?: boolean;
  /** Callback quando save completa */
  onSave?: () => void;
  /** Callback quando save falha */
  onError?: (error: Error, retryInfo?: RetryInfo) => void;
  /** Número máximo de tentativas de retry (default: 3) */
  maxRetries?: number;
}

export interface UseAutoSaveReturn {
  /** Status atual do save */
  status: SaveStatus;
  /** Força save imediato (ignora debounce) */
  saveNow: () => Promise<void>;
  /** Cancela save pendente */
  cancel: () => void;
  /** Último erro (se houver) */
  lastError: Error | null;
  /** Info de retry (se em progresso) */
  retryInfo: RetryInfo | null;
}

/**
 * Hook useAutoSave - Auto-save com debounce em funnel mode
 */
export function useAutoSave(options: UseAutoSaveOptions = {}): UseAutoSaveReturn {
  const {
    debounceMs = 2000,
    funnelId,
    enabled = !!funnelId,
    suppressToast = false,
    onSave,
    onError,
    maxRetries = 3,
  } = options;

  const editor = useEditor({ optional: true });
  const { toast } = useToast();

  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastError, setLastError] = useState<Error | null>(null);
  const [retryInfo, setRetryInfo] = useState<RetryInfo | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const saveInProgressRef = useRef(false);
  const previousStateRef = useRef<string>('');

  /**
   * Função de save real (sem debounce)
   */
  const performSave = useCallback(async () => {
    if (!enabled || !funnelId || !editor) {
      console.log('⏭️ [useAutoSave] Save pulado (disabled, sem funnelId ou sem editor)');
      return;
    }

    if (saveInProgressRef.current) {
      console.log('⏭️ [useAutoSave] Save já em progresso, pulando');
      return;
    }

    try {
      saveInProgressRef.current = true;
      setStatus('saving');
      setLastError(null);
      setRetryInfo(null);

      const stepBlocks = editor.state.stepBlocks;
      if (!stepBlocks || Object.keys(stepBlocks).length === 0) {
        console.warn('⚠️ [useAutoSave] Sem blocos para salvar');
        setStatus('idle');
        return;
      }

      console.log(`💾 [useAutoSave] Salvando ${Object.keys(stepBlocks).length} steps...`);

      let savedCount = 0;
      let errorCount = 0;

      // Salvar cada step
      for (const stepKey of Object.keys(stepBlocks)) {
        const blocks = stepBlocks[stepKey];
        if (!blocks || blocks.length === 0) continue;

        // Extrair número do step
        const stepNumber = parseInt(stepKey.replace(/\D/g, ''), 10);
        if (isNaN(stepNumber)) {
          console.warn(`⚠️ [useAutoSave] Step number inválido: ${stepKey}`);
          continue;
        }

        try {
          // 1. Buscar componentes existentes (COM RETRY)
          const existing = await retryWithBackoff(
            () => funnelComponentsService.getComponents({ funnelId, stepNumber }),
            {
              maxAttempts: maxRetries,
              baseDelayMs: 1000,
              onRetry: (attempt, error) => {
                console.warn(`🔄 [useAutoSave] Retry ${attempt}/${maxRetries} (getComponents):`, error.message);
                setRetryInfo({ attempt, maxAttempts: maxRetries });
              },
              shouldRetry: (error) => isNetworkError(error) || isSupabaseError(error),
            }
          );

          // 2. Deletar componentes existentes (COM RETRY)
          for (const component of existing) {
            await retryWithBackoff(
              () => funnelComponentsService.deleteComponent(component.id),
              {
                maxAttempts: maxRetries,
                baseDelayMs: 1000,
                onRetry: (attempt, error) => {
                  console.warn(`🔄 [useAutoSave] Retry ${attempt}/${maxRetries} (deleteComponent):`, error.message);
                  setRetryInfo({ attempt, maxAttempts: maxRetries });
                },
                shouldRetry: (error) => isNetworkError(error) || isSupabaseError(error),
              }
            );
          }

          // 3. Converter blocos para component_instances
          const instances = convertBlocksToComponentInstances(
            blocks,
            funnelId,
            stepNumber
          );

          // 4. Salvar novos componentes (COM RETRY)
          for (const instance of instances) {
            await retryWithBackoff(
              () => funnelComponentsService.addComponent({
                funnelId: instance.funnel_id,
                stepNumber: instance.step_number,
                instanceKey: instance.instance_key,
                componentTypeKey: instance.component_type_key,
                orderIndex: instance.order_index,
                properties: instance.properties,
              }),
              {
                maxAttempts: maxRetries,
                baseDelayMs: 1000,
                onRetry: (attempt, error) => {
                  console.warn(`🔄 [useAutoSave] Retry ${attempt}/${maxRetries} (addComponent):`, error.message);
                  setRetryInfo({ attempt, maxAttempts: maxRetries });
                },
                shouldRetry: (error) => isNetworkError(error) || isSupabaseError(error),
              }
            );
          }

          savedCount++;
          console.log(`✅ [useAutoSave] Step ${stepNumber} salvo (${blocks.length} blocos)`);
        } catch (err) {
          errorCount++;
          console.error(`❌ [useAutoSave] Erro ao salvar step ${stepNumber}:`, err);
        }
      }

      // Limpar retry info após loop completo
      setRetryInfo(null);

      if (errorCount === 0) {
        setStatus('saved');
        console.log(`✅ [useAutoSave] ${savedCount} steps salvos com sucesso`);
        
        // Resetar para idle após 2s
        setTimeout(() => {
          setStatus('idle');
        }, 2000);

        onSave?.();
      } else {
        throw new Error(`Erro ao salvar ${errorCount} step(s)`);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setStatus('error');
      setLastError(err);
      setRetryInfo(null); // Limpar retry info em erro final

      console.error('❌ [useAutoSave] Erro crítico:', err);

      if (!suppressToast) {
        toast({
          variant: 'destructive',
          title: 'Erro ao salvar',
          description: err.message || 'Verifique sua conexão e tente novamente',
        });
      }

      onError?.(err, retryInfo || undefined);

      // Resetar para idle após 3s
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } finally {
      saveInProgressRef.current = false;
    }
  }, [enabled, funnelId, editor, toast, onSave, onError]);

  /**
   * Função para agendar save com debounce
   */
  const scheduleSave = useCallback(() => {
    if (!enabled || !funnelId || !editor) return;

    // Cancelar timer anterior
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setStatus('pending');

    // Agendar novo save
    debounceTimerRef.current = setTimeout(() => {
      performSave();
    }, debounceMs);
  }, [enabled, funnelId, editor, debounceMs, performSave]);

  /**
   * Save imediato (ignora debounce)
   */
  const saveNow = useCallback(async () => {
    // Cancelar qualquer save agendado
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    await performSave();
  }, [performSave]);

  /**
   * Cancelar save pendente
   */
  const cancel = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
      setStatus('idle');
      console.log('🚫 [useAutoSave] Save cancelado');
    }
  }, []);

  /**
   * Observar mudanças no editor state
   */
  useEffect(() => {
    if (!enabled || !editor) return;

    // Serializar estado atual
    const currentState = JSON.stringify(editor.state.stepBlocks);

    // Comparar com estado anterior
    if (currentState !== previousStateRef.current && previousStateRef.current !== '') {
      console.log('🔄 [useAutoSave] Mudança detectada, agendando save...');
      scheduleSave();
    }

    // Atualizar referência
    previousStateRef.current = currentState;
  }, [editor?.state.stepBlocks, enabled, scheduleSave]);

  /**
   * Cleanup ao unmount
   */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    status,
    saveNow,
    cancel,
    lastError,
    retryInfo,
  };
}
