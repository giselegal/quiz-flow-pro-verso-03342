/**
 * 🚀 USE LAZY STEP HOOK
 * 
 * Hook React para lazy loading inteligente de steps
 * 
 * @example
 * ```tsx
 * const { step, isLoading, error, loadStep } = useLazyStep('step-05');
 * 
 * // Navegar para outro step
 * await loadStep('step-06');
 * ```
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { lazyStepLoader, LazyLoadConfig, LoadStepOptions } from '@/services/lazy/LazyStepLoader';
import { appLogger } from '@/lib/utils/logger';

export interface UseLazyStepOptions {
  /** Step ID inicial (opcional) */
  initialStepId?: string;
  /** Auto-carregar step inicial (default: true) */
  autoLoad?: boolean;
  /** Configuração do loader */
  loaderConfig?: Partial<LazyLoadConfig>;
  /** Callback após load bem-sucedido */
  onLoad?: (stepId: string, step: any) => void;
  /** Callback em caso de erro */
  onError?: (stepId: string, error: Error) => void;
}

export function useLazyStep(options: UseLazyStepOptions = {}) {
  const {
    initialStepId,
    autoLoad = true,
    loaderConfig,
    onLoad,
    onError,
  } = options;
  
  const [currentStepId, setCurrentStepId] = useState<string | null>(initialStepId || null);
  const [step, setStep] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const loaderRef = useRef(lazyStepLoader);
  const mountedRef = useRef(true);
  
  // Atualizar config do loader se fornecida
  useEffect(() => {
    if (loaderConfig) {
      loaderRef.current.updateConfig(loaderConfig);
    }
  }, [loaderConfig]);
  
  /**
   * Carregar step
   */
  const loadStep = useCallback(async (
    stepId: string,
    loadOptions: LoadStepOptions = {}
  ) => {
    if (!stepId) {
      appLogger.warn('[useLazyStep] Empty stepId provided');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setCurrentStepId(stepId);
    
    try {
      const loadedStep = await loaderRef.current.loadStep(stepId, {
        prefetchAdjacent: true,
        ...loadOptions,
      });
      
      if (!mountedRef.current) return;
      
      setStep(loadedStep);
      setIsLoading(false);
      
      onLoad?.(stepId, loadedStep);
      
      appLogger.debug(`[useLazyStep] Loaded ${stepId}`);
      
    } catch (err) {
      if (!mountedRef.current) return;
      
      const error = err as Error;
      setError(error);
      setIsLoading(false);
      setStep(null);
      
      onError?.(stepId, error);
      
      appLogger.error(`[useLazyStep] Error loading ${stepId}:`, error);
    }
  }, [onLoad, onError]);
  
  /**
   * Navegar para step anterior
   */
  const goToPrevious = useCallback(async () => {
    if (!currentStepId) return;
    
    const currentNumber = parseInt(currentStepId.match(/\d+/)?.[0] || '0', 10);
    if (currentNumber <= 1) return;
    
    const previousStepId = `step-${String(currentNumber - 1).padStart(2, '0')}`;
    await loadStep(previousStepId);
  }, [currentStepId, loadStep]);
  
  /**
   * Navegar para próximo step
   */
  const goToNext = useCallback(async () => {
    if (!currentStepId) return;
    
    const currentNumber = parseInt(currentStepId.match(/\d+/)?.[0] || '0', 10);
    if (currentNumber >= 21) return;
    
    const nextStepId = `step-${String(currentNumber + 1).padStart(2, '0')}`;
    await loadStep(nextStepId);
  }, [currentStepId, loadStep]);
  
  /**
   * Recarregar step atual
   */
  const reload = useCallback(async () => {
    if (!currentStepId) return;
    await loadStep(currentStepId, { forceReload: true });
  }, [currentStepId, loadStep]);
  
  /**
   * Auto-load step inicial
   */
  useEffect(() => {
    if (autoLoad && initialStepId) {
      loadStep(initialStepId);
    }
  }, [autoLoad, initialStepId, loadStep]);
  
  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  return {
    // Estado
    step,
    currentStepId,
    isLoading,
    error,
    
    // Ações
    loadStep,
    goToPrevious,
    goToNext,
    reload,
    
    // Helpers
    canGoBack: currentStepId ? parseInt(currentStepId.match(/\d+/)?.[0] || '0', 10) > 1 : false,
    canGoForward: currentStepId ? parseInt(currentStepId.match(/\d+/)?.[0] || '0', 10) < 21 : false,
  };
}

/**
 * Hook para métricas de performance do lazy loading
 */
export function useLazyLoadMetrics() {
  const [metrics, setMetrics] = useState(() => lazyStepLoader.getMetrics());
  
  useEffect(() => {
    // Atualizar métricas a cada 2 segundos
    const interval = setInterval(() => {
      setMetrics(lazyStepLoader.getMetrics());
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  const resetMetrics = useCallback(() => {
    lazyStepLoader.resetMetrics();
    setMetrics(lazyStepLoader.getMetrics());
  }, []);
  
  return {
    metrics,
    resetMetrics,
  };
}
