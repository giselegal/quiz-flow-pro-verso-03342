/**
 * 💾 useSnapshot - Sistema de Snapshots para Recuperação de Drafts
 * 
 * Salva automaticamente o estado do editor em localStorage/IndexedDB
 * para recuperação em caso de crash ou fechamento acidental.
 * 
 * Features:
 * - Auto-save antes de cada persistência
 * - Recuperação no mount
 * - Limpeza após publish
 * - Timestamp para expiração
 * 
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import { appLogger } from '@/lib/utils/appLogger';
import type { Block } from '@/types/editor';

export interface Snapshot {
  draftId: string;
  timestamp: number;
  blocks: Block[];
  viewport: 'mobile' | 'tablet' | 'desktop' | 'full';
  mode: 'edit' | 'preview-live' | 'preview-production';
  currentStep: number;
}

export interface UseSnapshotOptions {
  /** ID do recurso (template/funnel) */
  resourceId: string;
  /** Tempo de expiração em ms (default: 5min) */
  expirationMs?: number;
  /** Habilitar snapshot */
  enabled?: boolean;
}

/**
 * Hook para gerenciar snapshots do editor
 */
export function useSnapshot({ resourceId, expirationMs = 300000, enabled = true }: UseSnapshotOptions) {
  const [hasSnapshot, setHasSnapshot] = useState(false);
  const [snapshotAge, setSnapshotAge] = useState<number | null>(null);

  const getStorageKey = useCallback(() => {
    return `editor-snapshot:${resourceId}`;
  }, [resourceId]);

  // Verificar se há snapshot ao montar
  useEffect(() => {
    if (!enabled || !resourceId) return;

    try {
      const key = getStorageKey();
      const saved = localStorage.getItem(key);
      
      if (saved) {
        const snapshot = JSON.parse(saved) as Snapshot;
        const age = Date.now() - snapshot.timestamp;
        
        if (age < expirationMs) {
          setHasSnapshot(true);
          setSnapshotAge(age);
          appLogger.info('[Snapshot] Draft encontrado:', {
            age: `${Math.round(age / 1000)}s`,
            step: snapshot.currentStep,
            blocks: snapshot.blocks.length,
          });
        } else {
          // Expirado, limpar
          localStorage.removeItem(key);
          appLogger.debug('[Snapshot] Draft expirado, removido');
        }
      }
    } catch (error) {
      appLogger.error('[Snapshot] Erro ao verificar snapshot:', error);
    }
  }, [resourceId, enabled, expirationMs, getStorageKey]);

  /**
   * Salvar snapshot
   */
  const saveSnapshot = useCallback(
    (
      blocks: Block[],
      viewport: Snapshot['viewport'],
      mode: Snapshot['mode'],
      currentStep: number
    ) => {
      if (!enabled || !resourceId) return;

      try {
        const snapshot: Snapshot = {
          draftId: resourceId,
          timestamp: Date.now(),
          blocks,
          viewport,
          mode,
          currentStep,
        };

        const key = getStorageKey();
        localStorage.setItem(key, JSON.stringify(snapshot));
        setHasSnapshot(true);
        
        appLogger.debug('[Snapshot] Draft salvo:', {
          step: currentStep,
          blocks: blocks.length,
        });
      } catch (error) {
        appLogger.error('[Snapshot] Erro ao salvar snapshot:', error);
      }
    },
    [resourceId, enabled, getStorageKey]
  );

  /**
   * Recuperar snapshot
   */
  const recoverSnapshot = useCallback((): Snapshot | null => {
    if (!enabled || !resourceId) return null;

    try {
      const key = getStorageKey();
      const saved = localStorage.getItem(key);
      
      if (saved) {
        const snapshot = JSON.parse(saved) as Snapshot;
        const age = Date.now() - snapshot.timestamp;
        
        if (age < expirationMs) {
          appLogger.info('[Snapshot] Draft recuperado:', {
            age: `${Math.round(age / 1000)}s`,
            step: snapshot.currentStep,
          });
          return snapshot;
        } else {
          // Expirado
          localStorage.removeItem(key);
          return null;
        }
      }
      
      return null;
    } catch (error) {
      appLogger.error('[Snapshot] Erro ao recuperar snapshot:', error);
      return null;
    }
  }, [resourceId, enabled, expirationMs, getStorageKey]);

  /**
   * Limpar snapshot
   */
  const clearSnapshot = useCallback(() => {
    if (!resourceId) return;

    try {
      const key = getStorageKey();
      localStorage.removeItem(key);
      setHasSnapshot(false);
      setSnapshotAge(null);
      appLogger.info('[Snapshot] Draft limpo');
    } catch (error) {
      appLogger.error('[Snapshot] Erro ao limpar snapshot:', error);
    }
  }, [resourceId, getStorageKey]);

  return {
    /** Indica se há snapshot disponível */
    hasSnapshot,
    /** Idade do snapshot em ms */
    snapshotAge,
    /** Salvar snapshot atual */
    saveSnapshot,
    /** Recuperar snapshot salvo */
    recoverSnapshot,
    /** Limpar snapshot */
    clearSnapshot,
  };
}

export default useSnapshot;
