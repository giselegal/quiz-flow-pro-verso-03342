/**
 * ⚡ MELHORIAS DE PERFORMANCE PARA SISTEMA OTIMIZADO
 * =================================================
 */

import { useCallback, useMemo, memo } from 'react';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { useMobile } from '@/hooks/use-mobile';

/**
 * 🎯 Hook de performance otimizada para componentes inline
 */
export const useOptimizedInlinePerformance = () => {
  const performance = usePerformanceOptimization();
  const isMobile = useMobile();
  
  // Otimizações específicas para mobile
  const mobileOptimizations = useMemo(() => ({
    // Reduzir animações em dispositivos móveis
    reduceAnimations: isMobile,
    // Lazy loading mais agressivo
    lazyLoadThreshold: isMobile ? 100 : 200,
    // Debounce maior para inputs
    inputDebounce: isMobile ? 500 : 300,
    // Render menos frequente
    renderThrottle: isMobile ? 100 : 50
  }), [isMobile]);
  
  // Memoização de propriedades inline
  const memoizeInlineProps = useCallback((props: any) => {
    return useMemo(() => ({
      ...props,
      // Adicionar otimizações automáticas
      _optimized: true,
      _mobileOptimized: mobileOptimizations
    }), [props, mobileOptimizations]);
  }, [mobileOptimizations]);
  
  return {
    mobileOptimizations,
    memoizeInlineProps,
    performance
  };
};

/**
 * 🎯 HOC para otimizar componentes inline
 */
export const withOptimizedInline = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const OptimizedComponent = memo((props: P) => {
    const { memoizeInlineProps } = useOptimizedInlinePerformance();
    const optimizedProps = memoizeInlineProps(props);
    
    return <Component {...optimizedProps} />;
  });
  
  OptimizedComponent.displayName = `OptimizedInline(${Component.displayName || Component.name})`;
  
  return OptimizedComponent;
};

/**
 * 🎯 Utilitários de performance para etapas
 */
export const stepPerformanceUtils = {
  // Precarregar próxima etapa
  preloadNextStep: (currentStep: number, totalSteps: number) => {
    if (currentStep < totalSteps) {
      // Implementar preload da próxima etapa
      console.log(`⚡ Precarregando etapa ${currentStep + 1}`);
    }
  },
  
  // Limpar cache de etapas antigas
  cleanupOldSteps: (currentStep: number, keepRange: number = 3) => {
    // Implementar limpeza de cache
    console.log(`🧹 Limpando cache, mantendo etapas ${Math.max(1, currentStep - keepRange)} a ${currentStep + keepRange}`);
  },
  
  // Otimizar renderização baseada na visibilidade
  optimizeVisibility: (elementRef: React.RefObject<HTMLElement>) => {
    if ('IntersectionObserver' in window && elementRef.current) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Elemento visível - otimizar para performance
            entry.target.classList.add('optimized-visible');
          } else {
            // Elemento não visível - reduzir processamento
            entry.target.classList.remove('optimized-visible');
          }
        });
      });
      
      observer.observe(elementRef.current);
      return () => observer.disconnect();
    }
  }
};

export default {
  useOptimizedInlinePerformance,
  withOptimizedInline,
  stepPerformanceUtils
};