import { useCallback, useRef } from 'react';
import { useOptimizedScheduler } from './useOptimizedScheduler';

/**
 * 🎯 HOOK CENTRALIZADO PARA SELEÇÃO DE BLOCOS
 * 
 * Resolve problemas de seleção múltipla e debounce entre etapas
 */

interface UseStepSelectionProps {
  stepNumber: number;
  onSelectBlock: (blockId: string) => void;
  debounceMs?: number;
}

export const useStepSelection = ({
  stepNumber,
  onSelectBlock,
  debounceMs = 50
}: UseStepSelectionProps) => {
  const { debounce } = useOptimizedScheduler();
  const lastSelectedRef = useRef<string | null>(null);

  // Handler otimizado com debounce e deduplicação
  const handleBlockSelection = useCallback((blockId: string) => {
    // Evitar seleções redundantes
    if (lastSelectedRef.current === blockId) return;
    
    lastSelectedRef.current = blockId;
    
    // Debounce para evitar multiple calls durante drag/click rápido
    const cleanup = debounce(
      `step-${stepNumber}-selection`,
      () => {
        onSelectBlock(blockId);
      },
      debounceMs
    );

    return cleanup;
  }, [stepNumber, onSelectBlock, debounce, debounceMs]);

  // Limpar seleção quando trocar de etapa
  const clearSelection = useCallback(() => {
    lastSelectedRef.current = null;
  }, []);

  return {
    handleBlockSelection,
    clearSelection,
    lastSelected: lastSelectedRef.current
  };
};