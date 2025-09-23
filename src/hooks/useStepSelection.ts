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
  debounceMs = 100 // ✅ OTIMIZAÇÃO: Aumentado para 100ms para melhor performance (menos calls)
}: UseStepSelectionProps) => {
  const { debounce } = useOptimizedScheduler();
  const lastSelectedRef = useRef<string | null>(null);
  const lastSelectionTimeRef = useRef<number>(0);

  // ✅ NOVA OTIMIZAÇÃO: Cache para evitar string concatenation repetida
  const stepKeyRef = useRef<string>('');
  if (stepKeyRef.current !== `step-${stepNumber}-selection`) {
    stepKeyRef.current = `step-${stepNumber}-selection`;
  }

  // Handler super otimizado com múltiplas camadas de deduplicação
  const handleBlockSelection = useCallback((blockId: string) => {
    // ✅ OTIMIZAÇÃO 1: Early return sem performance.now() custoso
    if (lastSelectedRef.current === blockId) {
      return; // Mesma seleção, skip completamente
    }

    // ✅ OTIMIZAÇÃO 2: Usar Date.now() ao invés de performance.now() (mais rápido)
    const now = Date.now();

    // ✅ OTIMIZAÇÃO 3: Threshold aumentado para 150ms (mais eficiente)
    if (now - lastSelectionTimeRef.current < 150) {
      // Muito rápido, provavelmente click/drag múltiplo - debounce mais agressivo
      lastSelectedRef.current = blockId;
      lastSelectionTimeRef.current = now;

      const cleanup = debounce(
        stepKeyRef.current,
        () => onSelectBlock(blockId),
        debounceMs + 50 // Debounce extra para clicks rápidos
      );
      return cleanup;
    }

    lastSelectedRef.current = blockId;
    lastSelectionTimeRef.current = now;

    // ✅ OTIMIZAÇÃO 4: Usar chave cached para evitar concatenation
    const cleanup = debounce(
      stepKeyRef.current,
      () => onSelectBlock(blockId),
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