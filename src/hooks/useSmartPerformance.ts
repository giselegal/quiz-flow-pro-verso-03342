/**
 * 🚀 HOOKS DE PERFORMANCE COMPOSTOS
 * ===============================
 *
 * Combina múltiplos hooks de performance para criar
 * otimizações automáticas e inteligentes.
 */

import { PerformanceOptimizer } from "@/utils/performanceOptimizer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIsLowPerformanceDevice, useIsMobile } from "./use-mobile";
import { useDebounce } from "./useDebounce";
import { usePerformanceOptimization } from "./usePerformanceOptimization";

/**
 * 🎯 Hook composto para performance completa
 */
export const useSmartPerformance = (
  _componentId: string,
  options?: {
    debounceTime?: number;
    enableLazyLoading?: boolean;
    enableMemoization?: boolean;
    trackMetrics?: boolean;
  }
) => {
  const {
    debounceTime: customDebounceTime,
    enableLazyLoading = true,
    enableMemoization = true,
    trackMetrics = false,
  } = options || {};

  // 🔗 Hooks base
  const isMobile = useIsMobile();
  const isLowPerformance = useIsLowPerformanceDevice();
  usePerformanceOptimization();

  // 📊 Estados de performance
  const [metrics, setMetrics] = useState({
    renderCount: 0,
    lastRenderTime: 0,
    avgRenderTime: 0,
    isVisible: false,
    loadTime: 0,
  });

  const renderStartRef = useRef<number>(0);
  const renderTimesRef = useRef<number[]>([]);

  // ⚡ Tempo de debounce inteligente baseado no dispositivo
  const intelligentDebounceTime = useMemo(() => {
    if (customDebounceTime) return customDebounceTime;

    if (isLowPerformance) return 500;
    if (isMobile) return 300;
    return 150;
  }, [customDebounceTime, isLowPerformance, isMobile]);

  // 🎯 Otimizações automáticas baseadas no dispositivo
  const deviceOptimizations = useMemo(() => {
    const optimizations = {
      // Animações
      reduceAnimations: isLowPerformance,
      disableTransitions: isLowPerformance,

      // Renderização
      throttleRendering: isMobile || isLowPerformance,
      lazyLoadThreshold: isLowPerformance ? 50 : isMobile ? 100 : 200,

      // Interações
      debounceInputs: true,
      debounceTime: intelligentDebounceTime,

      // Cache
      enableIntelligentCaching: true,
      maxCacheSize: isLowPerformance ? 50 : isMobile ? 100 : 200,
    };

    return optimizations;
  }, [isMobile, isLowPerformance, intelligentDebounceTime]);

  // 📈 Tracking de métricas de renderização
  useEffect(() => {
    if (!trackMetrics) return;

    renderStartRef.current = performance.now();

    return () => {
      const renderTime = performance.now() - renderStartRef.current;

      setMetrics(prev => {
        const newRenderTimes = [...renderTimesRef.current, renderTime].slice(-10); // Manter últimas 10
        renderTimesRef.current = newRenderTimes;

        const avgRenderTime = newRenderTimes.reduce((a, b) => a + b, 0) / newRenderTimes.length;

        return {
          ...prev,
          renderCount: prev.renderCount + 1,
          lastRenderTime: renderTime,
          avgRenderTime,
        };
      });
    };
  });

  // 👁️ Intersection Observer para lazy loading
  const intersectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!enableLazyLoading || !intersectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setMetrics(prev => ({
          ...prev,
          isVisible: entry.isIntersecting,
        }));
      },
      {
        threshold: 0.1,
        rootMargin: `${deviceOptimizations.lazyLoadThreshold}px`,
      }
    );

    observer.observe(intersectionRef.current);

    return () => observer.disconnect();
  }, [enableLazyLoading, deviceOptimizations.lazyLoadThreshold]);

  // 🧠 Memoização inteligente
  const memoizedValue = useCallback(
    (value: any, dependencies: any[]) => {
      if (!enableMemoization) return value;

      return useMemo(() => value, dependencies);
    },
    [enableMemoization]
  );

  // 🚀 Função para aplicar otimizações CSS
  const getOptimizedClasses = useCallback(() => {
    const classes = [];

    if (deviceOptimizations.reduceAnimations) {
      classes.push("motion-reduce:transition-none");
    }

    if (deviceOptimizations.throttleRendering) {
      classes.push("will-change-auto");
    }

    if (!metrics.isVisible && enableLazyLoading) {
      classes.push("opacity-0");
    } else {
      classes.push("opacity-100 transition-opacity duration-300");
    }

    return classes.join(" ");
  }, [deviceOptimizations, metrics.isVisible, enableLazyLoading]);

  // ⚡ Função para otimizar props
  const optimizeProps = useCallback(
    (props: Record<string, any>) => {
      if (!enableMemoization) return props;

      // Remover props desnecessárias em dispositivos lentos
      if (isLowPerformance) {
        const { onMouseEnter, onMouseLeave, ...optimizedProps } = props;
        return optimizedProps;
      }

      return props;
    },
    [enableMemoization, isLowPerformance]
  );

  return {
    // 📊 Informações do dispositivo
    device: {
      isMobile,
      isLowPerformance,
      shouldOptimize: isMobile || isLowPerformance,
    },

    // ⚡ Otimizações
    optimizations: deviceOptimizations,

    // 🎨 Classes CSS otimizadas
    optimizedClasses: getOptimizedClasses(),

    // 🔧 Utilitários
    memoizedValue,
    optimizeProps,
    debounceTime: intelligentDebounceTime,

    // 👁️ Refs
    intersectionRef,

    // 📈 Métricas (se habilitado)
    metrics: trackMetrics ? metrics : null,

    // 🏃‍♂️ Status
    isVisible: metrics.isVisible,
    shouldRender: !enableLazyLoading || metrics.isVisible,
  };
};

/**
 * 🎯 Hook especializado para Steps de Quiz com performance otimizada
 */
export const useOptimizedQuizStep = (
  stepId: number,
  options?: {
    preloadNext?: boolean;
    trackProgress?: boolean;
    enableAnimations?: boolean;
  }
) => {
  const { preloadNext = true, trackProgress = true, enableAnimations = true } = options || {};

  const smartPerf = useSmartPerformance(`quiz-step-${stepId}`, {
    trackMetrics: trackProgress,
    enableLazyLoading: stepId > 1, // Não lazy load no primeiro step
    enableMemoization: true,
  });

  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadComplete, setPreloadComplete] = useState(false);

  // 🔮 Preload da próxima etapa quando esta ficar visível
  useEffect(() => {
    if (!preloadNext || !smartPerf.isVisible || isPreloading) return;

    const preloadNextStep = async () => {
      setIsPreloading(true);

      try {
        // Simular preload (aqui você pode implementar o preload real) - OTIMIZADO
        await new Promise<void>(resolve =>
          PerformanceOptimizer.schedule(() => resolve(), 100, "message")
        );
        setPreloadComplete(true);
      } catch (error) {
        console.warn(`Erro no preload do step ${stepId + 1}:`, error);
      } finally {
        setIsPreloading(false);
      }
    };

    // 🚀 OTIMIZAÇÃO: Usar PerformanceOptimizer ao invés de setTimeout
    const strategy = PerformanceOptimizer.getSuggestedStrategy(1000, false);
    PerformanceOptimizer.schedule(preloadNextStep, 1000, strategy);

    return () => {
      // Cleanup se necessário - PerformanceOptimizer gerencia automaticamente
    };
  }, [stepId, preloadNext, smartPerf.isVisible, isPreloading]);

  // 🎨 Classes específicas para quiz steps
  const quizStepClasses = useMemo(() => {
    const classes = [smartPerf.optimizedClasses];

    if (!enableAnimations || smartPerf.device.shouldOptimize) {
      classes.push("motion-reduce:transition-none");
    } else {
      classes.push("transition-all duration-300 ease-in-out");
    }

    if (smartPerf.isVisible) {
      classes.push("animate-fade-in");
    }

    return classes.join(" ");
  }, [
    smartPerf.optimizedClasses,
    smartPerf.device.shouldOptimize,
    smartPerf.isVisible,
    enableAnimations,
  ]);

  return {
    // 🎯 Performance base
    ...smartPerf,

    // 🎨 Classes específicas do quiz
    quizStepClasses,

    // 🔮 Preload status
    preloadStatus: {
      isPreloading,
      preloadComplete,
      nextStepReady: preloadComplete,
    },

    // 📊 Métricas específicas do quiz
    quizMetrics: {
      stepId,
      ...smartPerf.metrics,
    },
  };
};

/**
 * 🎯 Hook para componentes inline com performance otimizada
 */
export const useOptimizedInlineComponent = (componentType: string) => {
  const smartPerf = useSmartPerformance(`inline-${componentType}`, {
    debounceTime: 100, // Mais responsivo para inline
    enableLazyLoading: false, // Inline não precisa de lazy loading
    enableMemoization: true,
    trackMetrics: false,
  });

  // 🎨 Props otimizadas para componentes inline
  const getInlineProps = useCallback(
    (props: any) => {
      return smartPerf.optimizeProps({
        ...props,
        className: `${props.className || ""} ${smartPerf.optimizedClasses}`.trim(),
      });
    },
    [smartPerf]
  );

  return {
    ...smartPerf,
    getInlineProps,
    shouldUseReducedMotion: smartPerf.device.shouldOptimize,
  };
};

/**
 * 🔧 Hook utilitário para debounce inteligente
 */
export const useSmartDebounce = <T>(value: T, customDelay?: number): T => {
  const isMobile = useIsMobile();
  const isLowPerformance = useIsLowPerformanceDevice();

  const intelligentDelay = useMemo(() => {
    if (customDelay) return customDelay;

    if (isLowPerformance) return 500;
    if (isMobile) return 300;
    return 150;
  }, [customDelay, isLowPerformance, isMobile]);

  return useDebounce(value, intelligentDelay);
};

export { useSmartPerformance as default };
