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
  debounceMs = 25 // ✅ OTIMIZAÇÃO: Reduzido de 50ms para 25ms para melhor responsividade
}: UseStepSelectionProps) => {
  const { debounce } = useOptimizedScheduler();
  const lastSelectedRef = useRef<string | null>(null);
  const lastSelectionTimeRef = useRef<number>(0); // ✅ OTIMIZAÇÃO: Timestamp da última seleção

  // Handler otimizado com debounce e deduplicação aprimorada
  const handleBlockSelection = useCallback((blockId: string) => {
    const now = performance.now();
    
    // ✅ OTIMIZAÇÃO: Early return mais eficiente
    // Evita seleções redundantes e chamadas muito próximas (< 50ms)
    if (lastSelectedRef.current === blockId && 
        now - lastSelectionTimeRef.current < 50) {
      return;
    }
    
    lastSelectedRef.current = blockId;
    lastSelectionTimeRef.current = now;
    
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
    lastSelectionTimeRef.current = 0; // ✅ OTIMIZAÇÃO: Reset do timestamp
  }, []);

  return {
    handleBlockSelection,
    clearSelection,
    lastSelected: lastSelectedRef.current
  };
};