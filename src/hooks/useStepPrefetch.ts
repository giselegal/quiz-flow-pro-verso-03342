/**
 * 🚀 USE STEP PREFETCH
 * 
 * Fase 2.4 - Performance Optimization
 * 
 * Hook para prefetch de steps adjacentes (N-1, N+1)
 * Melhora UX ao navegar entre etapas, carregando em background
 */

import { useEffect, useRef } from 'react';
import { TemplateLoader } from '@/services/editor/TemplateLoader';

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
  /** Debounce em ms (default: 500) */
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
    debounceMs = 500,
  } = options;

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const prefetchedRef = useRef<Set<string>>(new Set());
  const loaderRef = useRef<TemplateLoader | null>(null);

  // Inicializar loader (singleton)
  useEffect(() => {
    if (!loaderRef.current) {
      loaderRef.current = TemplateLoader.getInstance();
    }
  }, []);

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
   */
  const prefetchStep = async (stepId: string) => {
    if (!loaderRef.current || !enabled) return;
    if (prefetchedRef.current.has(stepId)) return; // Já prefetchado

    try {
      const mode = funnelId ? 'funnel' : 'template';
      const id = funnelId || undefined;

      console.log(`🚀 [useStepPrefetch] Prefetching ${stepId}...`);

      // Carregar step em background (usa cache se disponível)
      await loaderRef.current.loadStep(stepId);

      prefetchedRef.current.add(stepId);
      console.log(`✅ [useStepPrefetch] ${stepId} prefetched`);
    } catch (error) {
      console.warn(`⚠️ [useStepPrefetch] Erro ao prefetch ${stepId}:`, error);
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
   * Reagir a mudanças no step atual (com debounce)
   */
  useEffect(() => {
    if (!enabled || !currentStepId) return;

    // Limpar timer anterior
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Agendar prefetch com debounce
    debounceTimerRef.current = setTimeout(() => {
      prefetchAdjacent();
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [currentStepId, funnelId, enabled, radius, totalSteps]);

  /**
   * Limpar cache de prefetch ao desmontar
   */
  useEffect(() => {
    return () => {
      prefetchedRef.current.clear();
    };
  }, []);
}
