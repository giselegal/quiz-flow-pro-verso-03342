/**
 * 🚀 HOOK DE PERFORMANCE PARA TEMPLATES
 * 
 * Gerencia carregamento lazy, cache e otimizações 
 * para templates de quiz com muitas etapas
 */

import { useState, useCallback, useRef, useEffect } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  cacheHits: number;
  cacheMisses: number;
  totalSteps: number;
  loadedSteps: number;
}

interface UseTemplatePerformanceOptions {
  enableCache?: boolean;
  preloadNext?: number;
  compressionEnabled?: boolean;
}

export function useTemplatePerformance(options: UseTemplatePerformanceOptions = {}) {
  const {
    enableCache = true,
    preloadNext = 2,
    compressionEnabled = true
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    cacheHits: 0,
    cacheMisses: 0,
    totalSteps: 21,
    loadedSteps: 0
  });

  const [isLoading, setIsLoading] = useState(false);
  const cacheRef = useRef(new Map<string, any>());
  const loadStartRef = useRef<number>(0);

  // 🎯 CARREGAMENTO LAZY DE TEMPLATE
  const loadTemplate = useCallback(async (stepId: string) => {
    setIsLoading(true);
    loadStartRef.current = performance.now();

    // Check cache first
    if (enableCache && cacheRef.current.has(stepId)) {
      setMetrics(prev => ({
        ...prev,
        cacheHits: prev.cacheHits + 1,
        loadTime: performance.now() - loadStartRef.current
      }));
      setIsLoading(false);
      return cacheRef.current.get(stepId);
    }

    try {
      // Simulate dynamic import for template loading
      const template = await import(`../templates/${stepId}-template.json`);
      
      if (enableCache) {
        cacheRef.current.set(stepId, template.default);
      }

      setMetrics(prev => ({
        ...prev,
        cacheMisses: prev.cacheMisses + 1,
        loadedSteps: prev.loadedSteps + 1,
        loadTime: performance.now() - loadStartRef.current
      }));

      setIsLoading(false);
      return template.default;

    } catch (error) {
      console.warn(`⚠️ Failed to load template: ${stepId}`);
      setIsLoading(false);
      return null;
    }
  }, [enableCache]);

  // 🚀 PRE-CARREGAMENTO INTELIGENTE
  const preloadTemplates = useCallback(async (currentStep: number) => {
    const stepIds = [];
    
    for (let i = 1; i <= preloadNext; i++) {
      const nextStep = currentStep + i;
      if (nextStep <= 21) {
        stepIds.push(`step-${nextStep.toString().padStart(2, '0')}`);
      }
    }

    // Preload in background without blocking
    stepIds.forEach(stepId => {
      if (!cacheRef.current.has(stepId)) {
        loadTemplate(stepId);
      }
    });
  }, [loadTemplate, preloadNext]);

  // 🧹 LIMPEZA DE CACHE
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    setMetrics(prev => ({
      ...prev,
      cacheHits: 0,
      cacheMisses: 0,
      loadedSteps: 0
    }));
  }, []);

  // 📊 RELATÓRIO DE PERFORMANCE
  const getPerformanceReport = useCallback(() => {
    const cacheEfficiency = metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses) * 100;
    const loadProgress = (metrics.loadedSteps / metrics.totalSteps) * 100;

    return {
      cacheEfficiency: isNaN(cacheEfficiency) ? 0 : cacheEfficiency,
      loadProgress,
      avgLoadTime: metrics.loadTime,
      totalCacheSize: cacheRef.current.size,
      recommendations: {
        shouldEnableCompression: compressionEnabled && metrics.loadTime > 100,
        shouldPreload: loadProgress < 50,
        cacheOptimal: cacheEfficiency > 70
      }
    };
  }, [metrics, compressionEnabled]);

  // 🎛️ AUTO CLEANUP ON UNMOUNT
  useEffect(() => {
    return () => {
      if (cacheRef.current.size > 50) { // Cleanup if cache gets too large
        clearCache();
      }
    };
  }, [clearCache]);

  return {
    loadTemplate,
    preloadTemplates,
    clearCache,
    getPerformanceReport,
    metrics,
    isLoading,
    cacheSize: cacheRef.current.size
  };
}

// 🎯 HOOK ESPECIALIZADO PARA QUIZ 21 STEPS
export function useQuiz21Performance() {
  const performance = useTemplatePerformance({
    enableCache: true,
    preloadNext: 2,
    compressionEnabled: true
  });

  const [currentStep, setCurrentStep] = useState(1);

  // 🚀 NAVEGAÇÃO OTIMIZADA COM PRELOAD
  const navigateToStep = useCallback(async (stepNumber: number) => {
    const stepId = `step-${stepNumber.toString().padStart(2, '0')}`;
    
    // Load current step
    const template = await performance.loadTemplate(stepId);
    
    // Preload next steps in background
    performance.preloadTemplates(stepNumber);
    
    setCurrentStep(stepNumber);
    return template;
  }, [performance]);

  // 📈 MÉTRICAS ESPECÍFICAS DO QUIZ
  const getQuizMetrics = useCallback(() => {
    const report = performance.getPerformanceReport();
    return {
      ...report,
      currentStep,
      stepsRemaining: 21 - currentStep,
      completionPercentage: (currentStep / 21) * 100
    };
  }, [performance, currentStep]);

  return {
    ...performance,
    navigateToStep,
    getQuizMetrics,
    currentStep,
    totalSteps: 21
  };
}