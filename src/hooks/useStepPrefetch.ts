/**
 * 🚀 USE STEP PREFETCH - G20 & G28 FIX
 * 
 * Fase 2.4 - Performance Optimization
 * 
 * Hook para prefetch de steps adjacentes (N-1, N+1)
 * Melhora UX ao navegar entre etapas, carregando em background
 * 
 * 🆕 G20 FIX: Intelligent prefetch para navegação instantânea
 * 🆕 G28 FIX: AbortController para cancelar requests obsoletos
 */

import { useEffect, useRef } from 'react';
import { hierarchicalTemplateSource } from '@/services/core/HierarchicalTemplateSourceMigration';
import { appLogger } from '@/lib/utils/appLogger';

export interface UseStepPrefetchOptions {
  /** Step atual (formato: 'step-01') */
  currentStepId?: string;
  /** Funnel ID (para carregar do Supabase) */
  funnelId?: string;
  /** Número total de steps */
  totalSteps?: number;
  /** Habilitar prefetch (default: true) */
  enabled?: boolean;
  /** Raio de prefetch (quantos steps antes/depois, default: 1) */
  radius?: number;
  /** Debounce em ms (default: 100 - reduzido para prefetch mais rápido) */
  debounceMs?: number;
}

/**
 * Hook para prefetch inteligente de steps adjacentes
 * 
 * @example
 * ```tsx
 * useStepPrefetch({
 *   currentStepId: 'step-05',
 *   funnelId: 'funnel-123',
 *   totalSteps: 21,
 *   enabled: true,
 *   radius: 1, // prefetch step-04 e step-06
 * });
 * ```
 */
export function useStepPrefetch(options: UseStepPrefetchOptions = {}) {
  const {
    currentStepId,
    funnelId,
    totalSteps = 21,
    enabled = true,
    radius = 1,
    debounceMs = 16,
  } = options;

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const prefetchedRef = useRef<Set<string>>(new Set());
  // 🆕 G28 FIX: AbortController para cancelar requests obsoletos
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Extrair número do step (step-05 → 5)
   */
  const getStepNumber = (stepId: string): number => {
    const match = stepId.match(/step-(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  /**
   * Gerar ID do step (5 → step-05)
   */
  const getStepId = (stepNumber: number): string => {
    return `step-${String(stepNumber).padStart(2, '0')}`;
  };

  /**
   * Prefetch de um step específico
   * 🆕 G20 FIX: Usa HierarchicalTemplateSource para cache unificado
   */
  const prefetchStep = async (stepId: string) => {
    if (!enabled) return;
    if (prefetchedRef.current.has(stepId)) return; // Já prefetchado

    try {
      appLogger.info(`🚀 [G20] Prefetching ${stepId}...`);

      // 🆕 G20: Usar HierarchicalTemplateSource (SSOT)
      await hierarchicalTemplateSource.getPrimary(stepId, funnelId);

      prefetchedRef.current.add(stepId);
      appLogger.info(`✅ [G20] ${stepId} prefetched e em cache`);
    } catch (error) {
      // Ignorar erros de prefetch (não afetar UX)
      appLogger.debug(`⚠️ [G20] Erro ao prefetch ${stepId}:`, { data: [error] });
    }
  };

  /**
   * Prefetch de steps adjacentes
   */
  const prefetchAdjacent = async () => {
    if (!currentStepId || !enabled) return;

    const currentNumber = getStepNumber(currentStepId);
    if (currentNumber === 0) return;

    const stepsToPrefetch: string[] = [];

    // Steps anteriores (N-radius até N-1)
    for (let i = currentNumber - radius; i < currentNumber; i++) {
      if (i >= 1) {
        stepsToPrefetch.push(getStepId(i));
      }
    }

    // Steps posteriores (N+1 até N+radius)
    for (let i = currentNumber + 1; i <= currentNumber + radius; i++) {
      if (i <= totalSteps) {
        stepsToPrefetch.push(getStepId(i));
      }
    }

    // Prefetch em paralelo
    await Promise.all(stepsToPrefetch.map(prefetchStep));
  };

  /**
   * Reagir a mudanças no step atual (com debounce + AbortController)
   * 🆕 G28 FIX: Cancelar prefetch anterior ao mudar de step
   */
  useEffect(() => {
    if (!enabled || !currentStepId) return;

    // 🆕 G28: Cancelar prefetch anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      appLogger.info('🚫 [G28] Prefetch anterior cancelado');
    }

    // Criar novo AbortController
    abortControllerRef.current = new AbortController();

    // Limpar timer anterior
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Agendar prefetch com debounce (reduzido para 100ms)
    debounceTimerRef.current = setTimeout(() => {
      if (!abortControllerRef.current?.signal.aborted) {
        prefetchAdjacent();
      }
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentStepId, funnelId, enabled, radius, totalSteps, debounceMs]);

  /**
   * Limpar cache de prefetch ao desmontar
   */
  useEffect(() => {
    return () => {
      prefetchedRef.current.clear();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
}
