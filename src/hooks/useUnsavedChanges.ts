import { useState, useCallback, useEffect } from 'react';

interface UnsavedChange {
  stepId: string;
  timestamp: number;
  type: 'block' | 'step' | 'property';
}

interface UseUnsavedChangesReturn {
  unsavedChanges: Map<string, UnsavedChange>;
  hasUnsavedChanges: boolean;
  markAsChanged: (stepId: string, type: UnsavedChange['type']) => void;
  markAsSaved: (stepId: string) => void;
  clearAll: () => void;
  isStepDirty: (stepId: string) => boolean;
  getDirtyStepCount: () => number;
}

/**
 * Hook para gerenciar estado de alterações não salvas no editor
 * Rastreia mudanças por step e fornece indicadores visuais
 */
export function useUnsavedChanges(): UseUnsavedChangesReturn {
  const [unsavedChanges, setUnsavedChanges] = useState<Map<string, UnsavedChange>>(
    new Map()
  );

  // Marca um step como modificado
  const markAsChanged = useCallback((stepId: string, type: UnsavedChange['type']) => {
    setUnsavedChanges((prev) => {
      const next = new Map(prev);
      next.set(stepId, {
        stepId,
        timestamp: Date.now(),
        type,
      });
      return next;
    });
  }, []);

  // Marca um step como salvo (remove da lista de dirty)
  const markAsSaved = useCallback((stepId: string) => {
    setUnsavedChanges((prev) => {
      const next = new Map(prev);
      next.delete(stepId);
      return next;
    });
  }, []);

  // Limpa todas as alterações não salvas
  const clearAll = useCallback(() => {
    setUnsavedChanges(new Map());
  }, []);

  // Verifica se um step específico tem alterações
  const isStepDirty = useCallback(
    (stepId: string) => {
      return unsavedChanges.has(stepId);
    },
    [unsavedChanges]
  );

  // Retorna número total de steps modificados
  const getDirtyStepCount = useCallback(() => {
    return unsavedChanges.size;
  }, [unsavedChanges]);

  // Aviso ao sair com alterações não salvas
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges.size > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [unsavedChanges.size]);

  return {
    unsavedChanges,
    hasUnsavedChanges: unsavedChanges.size > 0,
    markAsChanged,
    markAsSaved,
    clearAll,
    isStepDirty,
    getDirtyStepCount,
  };
}
