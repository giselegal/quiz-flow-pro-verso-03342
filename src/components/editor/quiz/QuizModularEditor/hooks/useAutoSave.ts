/**
 * 🎯 FASE 3.1 - Hook de Auto-Save
 * 
 * Extrai lógica de auto-save do QuizModularEditor
 * Gerencia salvamento automático com debounce
 * 
 * RESPONSABILIDADES:
 * - Auto-save com debounce
 * - Tracking de mudanças
 * - Status de salvamento
 * - Error handling
 * 
 * @phase FASE 3.1 - Refatoração QuizModularEditor
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { appLogger } from '@/lib/utils/appLogger';
import { toast } from '@/components/ui/use-toast';

export interface UseAutoSaveOptions {
  enabled: boolean;
  debounceMs?: number;
  onSave: () => Promise<void>;
  data: any;
}

export interface UseAutoSaveReturn {
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSavedAt: Date | null;
  hasUnsavedChanges: boolean;
  triggerSave: () => Promise<void>;
  resetSaveStatus: () => void;
}

/**
 * Hook para gerenciar auto-save com debounce
 */
export function useAutoSave({
  enabled,
  debounceMs = 2000,
  onSave,
  data,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataRef = useRef<any>(null);
  const isSavingRef = useRef(false);

  /**
   * Trigger manual save
   */
  const triggerSave = useCallback(async () => {
    if (isSavingRef.current) {
      appLogger.debug('[useAutoSave] Save já em progresso, ignorando');
      return;
    }

    if (!hasUnsavedChanges && lastSavedAt) {
      appLogger.debug('[useAutoSave] Sem mudanças para salvar');
      return;
    }

    isSavingRef.current = true;
    setSaveStatus('saving');
    
    try {
      appLogger.info('💾 [useAutoSave] Iniciando salvamento...');
      
      await onSave();
      
      setSaveStatus('saved');
      setLastSavedAt(new Date());
      setHasUnsavedChanges(false);
      lastDataRef.current = data;
      
      appLogger.info('✅ [useAutoSave] Salvamento concluído');
      
      // Reset status para idle após 3 segundos
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
      
    } catch (error) {
      appLogger.error('❌ [useAutoSave] Erro ao salvar:', error);
      
      setSaveStatus('error');
      
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as alterações. Tente novamente.',
        variant: 'destructive',
      });
      
      // Reset status para idle após 5 segundos
      setTimeout(() => {
        setSaveStatus('idle');
      }, 5000);
    } finally {
      isSavingRef.current = false;
    }
  }, [hasUnsavedChanges, lastSavedAt, onSave, data]);

  /**
   * Reset save status
   */
  const resetSaveStatus = useCallback(() => {
    setSaveStatus('idle');
    setHasUnsavedChanges(false);
  }, []);

  /**
   * Detectar mudanças nos dados
   */
  useEffect(() => {
    if (!enabled) return;

    // Skip primeira renderização
    if (lastDataRef.current === null) {
      lastDataRef.current = data;
      return;
    }

    // Detectar mudanças
    const dataStr = JSON.stringify(data);
    const lastDataStr = JSON.stringify(lastDataRef.current);
    
    if (dataStr !== lastDataStr) {
      appLogger.debug('[useAutoSave] Mudanças detectadas');
      setHasUnsavedChanges(true);

      // Cancelar timeout anterior
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Agendar novo save
      saveTimeoutRef.current = setTimeout(() => {
        appLogger.info(`⏱️ [useAutoSave] Debounce completado (${debounceMs}ms), triggering save`);
        triggerSave();
      }, debounceMs);
    }
  }, [data, enabled, debounceMs, triggerSave]);

  /**
   * Cleanup
   */
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Save on unmount if há mudanças
   */
  useEffect(() => {
    return () => {
      if (hasUnsavedChanges && enabled) {
        appLogger.warn('[useAutoSave] Componente desmontando com mudanças não salvas');
        // Tentar salvar sincronamente (best effort)
        onSave().catch(err => {
          appLogger.error('[useAutoSave] Erro ao salvar no unmount:', err);
        });
      }
    };
  }, [hasUnsavedChanges, enabled, onSave]);

  return {
    saveStatus,
    lastSavedAt,
    hasUnsavedChanges,
    triggerSave,
    resetSaveStatus,
  };
}

export default useAutoSave;
