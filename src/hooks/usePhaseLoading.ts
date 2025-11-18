/**
 * 🚀 WAVE 2: Hook para Lazy Loading Coordenado em Fases
 * 
 * Carrega componentes pesados em fases priorizadas:
 * - FASE 1 (imediato): Componentes críticos (Canvas)
 * - FASE 2 (100ms): Componentes importantes (Library, Properties)
 * - FASE 3 (300ms): Componentes complementares (Preview)
 * 
 * Benefícios:
 * - TTI reduzido (foco no crítico primeiro)
 * - UX mais fluida (progressiva)
 * - Bundle splitting otimizado
 */

import { useEffect, useState, useCallback } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

export type LoadPhase = 'idle' | 'phase1' | 'phase2' | 'phase3' | 'complete';

interface PhaseLoadingConfig {
  /** Componentes críticos (carregados imediatamente) */
  phase1Delay?: number;
  /** Componentes importantes (carregados após fase 1) */
  phase2Delay?: number;
  /** Componentes complementares (carregados após fase 2) */
  phase3Delay?: number;
  /** Callback quando fase completar */
  onPhaseComplete?: (phase: LoadPhase) => void;
  /** Habilitar em ambiente de teste */
  enableInTest?: boolean;
}

interface PhaseLoadingState {
  currentPhase: LoadPhase;
  phasesCompleted: Set<LoadPhase>;
  isPhaseReady: (phase: LoadPhase) => boolean;
  startLoading: () => void;
}

const DEFAULT_CONFIG: Required<Omit<PhaseLoadingConfig, 'onPhaseComplete'>> = {
  phase1Delay: 0,
  phase2Delay: 100,
  phase3Delay: 300,
  enableInTest: false,
};

/**
 * Hook para gerenciar carregamento em fases
 */
export function usePhaseLoading(config: PhaseLoadingConfig = {}): PhaseLoadingState {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  
  const [currentPhase, setCurrentPhase] = useState<LoadPhase>('idle');
  const [phasesCompleted, setPhasesCompleted] = useState<Set<LoadPhase>>(new Set());

  // Detectar ambiente de teste
  const isTest = !mergedConfig.enableInTest && (() => {
    try {
      if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITEST) return true;
      if (typeof (globalThis as any).vitest !== 'undefined') return true;
      if (typeof (globalThis as any).jest !== 'undefined') return true;
    } catch {}
    return false;
  })();

  const markPhaseComplete = useCallback((phase: LoadPhase) => {
    setPhasesCompleted(prev => {
      const next = new Set(prev);
      next.add(phase);
      return next;
    });
    
    appLogger.debug(`[PhaseLoading] Fase ${phase} concluída`);
    config.onPhaseComplete?.(phase);
  }, [config]);

  const isPhaseReady = useCallback((phase: LoadPhase) => {
    return phasesCompleted.has(phase);
  }, [phasesCompleted]);

  const startLoading = useCallback(() => {
    if (isTest) {
      // Em testes, carregar tudo imediatamente
      setCurrentPhase('complete');
      markPhaseComplete('phase1');
      markPhaseComplete('phase2');
      markPhaseComplete('phase3');
      markPhaseComplete('complete');
      return;
    }

    // FASE 1: Crítico (imediato)
    setCurrentPhase('phase1');
    setTimeout(() => {
      markPhaseComplete('phase1');
      
      // FASE 2: Importante (após delay)
      setCurrentPhase('phase2');
      setTimeout(() => {
        markPhaseComplete('phase2');
        
        // FASE 3: Complementar (após delay)
        setCurrentPhase('phase3');
        setTimeout(() => {
          markPhaseComplete('phase3');
          setCurrentPhase('complete');
          markPhaseComplete('complete');
          
          appLogger.info('[PhaseLoading] Todas as fases concluídas');
        }, mergedConfig.phase3Delay);
      }, mergedConfig.phase2Delay);
    }, mergedConfig.phase1Delay);
  }, [isTest, mergedConfig, markPhaseComplete]);

  return {
    currentPhase,
    phasesCompleted,
    isPhaseReady,
    startLoading,
  };
}

/**
 * Hook para prefetch inteligente de módulos
 */
export function usePrefetchModules(modules: (() => Promise<any>)[], enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const isTest = (() => {
      try {
        if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITEST) return true;
        if (typeof (globalThis as any).vitest !== 'undefined') return true;
        if (typeof (globalThis as any).jest !== 'undefined') return true;
      } catch {}
      return false;
    })();

    if (isTest) return;

    // Usar requestIdleCallback ou setTimeout
    const schedule = (cb: () => void, timeout: number) => {
      try {
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          return (window as any).requestIdleCallback(cb, { timeout });
        }
      } catch {}
      return setTimeout(cb, timeout);
    };

    const timeouts: any[] = [];

    // Prefetch cada módulo com delay incremental
    modules.forEach((moduleFn, index) => {
      const delay = index * 50; // 50ms entre cada prefetch
      const id = schedule(() => {
        moduleFn().catch(err => {
          appLogger.warn(`[Prefetch] Falha ao carregar módulo ${index}:`, err);
        });
      }, delay);
      
      timeouts.push(id);
    });

    // Cleanup
    return () => {
      timeouts.forEach(id => {
        try {
          if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
            (window as any).cancelIdleCallback(id);
          } else {
            clearTimeout(id);
          }
        } catch {}
      });
    };
  }, [modules, enabled]);
}

/**
 * Utilitário para criar função de import memoizada
 */
export function createMemoizedImport<T>(importFn: () => Promise<T>) {
  let cache: Promise<T> | null = null;
  
  return () => {
    if (!cache) {
      cache = importFn();
    }
    return cache;
  };
}
