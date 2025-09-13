/**
 * 🚀 OTIMIZAÇÕES ESPECÍFICAS PARA EDITORPRO
 * 
 * Configurações e melhorias de performance para o EditorPro legacy
 */

import React from 'react';

// Configurações de performance para componentes específicos
export const PERFORMANCE_CONFIG = {
  // Thresholds específicos por componente
  RENDER_THRESHOLDS: {
    'UnifiedEditor-Container': 80, // 80ms para container principal
    'EditorPro-Unified': 60,       // 60ms para EditorPro
    'EnhancedComponentsSidebar': 30, // 30ms para sidebar
    'PropertiesColumn': 40,        // 40ms para properties
  },

  // Configurações de debounce
  DEBOUNCE_DELAYS: {
    property_updates: 300,    // 300ms para updates de propriedades
    block_movements: 100,     // 100ms para movimento de blocos
    text_changes: 200,        // 200ms para mudanças de texto
  },

  // Configurações de lazy loading
  LAZY_LOADING: {
    preload_delay: 1000,      // 1s para preload de componentes
    retry_attempts: 3,        // 3 tentativas de retry
    timeout: 15000,          // 15s timeout
  }
};

// HOC para otimizar componentes do editor
export function withEditorOptimizations<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  displayName: string
) {
  const OptimizedComponent = React.memo(Component, (prevProps, nextProps) => {
    // Comparação shallow customizada para props do editor
    const keys = Object.keys(nextProps) as Array<keyof T>;
    
    for (const key of keys) {
      if (prevProps[key] !== nextProps[key]) {
        // Ignorar mudanças específicas que não afetam o render
        if (key === 'timestamp' || key === 'lastUpdate' || key === 'renderCount') {
          continue;
        }
        return false;
      }
    }
    
    return true;
  });

  OptimizedComponent.displayName = `Optimized(${displayName})`;
  
  return OptimizedComponent;
}

// Hook para debounce de updates frequentes
export function useEditorDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook para throttle de eventos de drag & drop
export function useEditorThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const lastRun = React.useRef(Date.now());

  return React.useCallback(
    ((...args: any[]) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
}

// Configurações otimizadas para React DnD
export const DND_OPTIMIZATIONS = {
  // Reduzir frequência de updates durante drag
  dragUpdateDelay: 16, // ~60fps
  
  // Usar transform ao invés de position para melhor performance
  useTransform: true,
  
  // Configurações de preview otimizadas
  previewConfig: {
    captureDraggingState: false,
    dropEffect: 'move' as const,
  },
  
  // Reduzir re-renders durante hover
  hoverThrottleMs: 50,
};

// Utilitário para lazy loading de componentes pesados
export function createOptimizedLazy<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = React.lazy(importFn);
  
  return React.forwardRef<any, React.ComponentProps<T>>((props, ref) => (
    <React.Suspense 
      fallback={
        fallback ? (
          <fallback />
        ) : (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )
      }
    >
      <LazyComponent ref={ref} {...props} />
    </React.Suspense>
  ));
}

// Configurações de memory cleanup
export const MEMORY_OPTIMIZATIONS = {
  // Limpar métricas antigas a cada X renders
  cleanupInterval: 100,
  
  // Manter apenas N renders recentes por componente
  maxMetricsPerComponent: 50,
  
  // Intervalo para garbage collection manual
  gcInterval: 30000, // 30 segundos
};

// Utilitário para detectar memory leaks
export function useMemoryMonitor(componentName: string) {
  const renderCount = React.useRef(0);
  const startTime = React.useRef(Date.now());

  React.useEffect(() => {
    renderCount.current++;
    
    // Log warning se componente renderizar muito frequentemente
    const elapsed = Date.now() - startTime.current;
    if (renderCount.current > 20 && elapsed < 5000) {
      console.warn(`⚠️ Possible memory leak in ${componentName}: ${renderCount.current} renders in ${elapsed}ms`);
    }
  });

  // Cleanup ao desmontar
  React.useEffect(() => {
    return () => {
      if (renderCount.current > 50) {
        console.info(`📊 ${componentName} cleanup: ${renderCount.current} total renders`);
      }
    };
  }, [componentName]);
}

export default {
  PERFORMANCE_CONFIG,
  withEditorOptimizations,
  useEditorDebounce,
  useEditorThrottle,
  DND_OPTIMIZATIONS,
  createOptimizedLazy,
  MEMORY_OPTIMIZATIONS,
  useMemoryMonitor,
};