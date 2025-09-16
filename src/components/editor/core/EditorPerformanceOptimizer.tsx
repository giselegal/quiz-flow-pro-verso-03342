/**
 * 🚀 EDITOR PERFORMANCE OPTIMIZER
 * 
 * Sistema de otimização de performance para o editor:
 * - Lazy loading inteligente
 * - Code splitting otimizado
 * - Memoização estratégica
 * - Bundle size optimization
 */

import React, { memo, useMemo, useCallback, lazy, Suspense } from 'react';
import type {
  PerformanceConfig,
  PerformanceMetrics,
  EditorComponentConfig
} from './EditorArchitecture';

// =====================================================
// 🎯 PERFORMANCE CONFIGURATION
// =====================================================

const DEFAULT_PERFORMANCE_CONFIG: PerformanceConfig = {
  enableLazyLoading: true,
  enableCodeSplitting: true,
  enableMemoization: true,
  enableVirtualization: false, // Para listas muito grandes
  chunkSize: 20,
  maxHistorySize: 50,
};

// =====================================================
// 🔧 LAZY LOADING FACTORY
// =====================================================

/**
 * Factory para criar componentes lazy com fallback otimizado
 */
export const createLazyComponent = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  fallback?: React.ReactNode
) => {
  const LazyComp = lazy(importFn);

  const WrappedComponent = (props: any) => (
    <Suspense fallback={fallback || <ComponentLoadingSkeleton />}>
      <LazyComp {...props} />
    </Suspense>
  );

  return memo(WrappedComponent);
};

/**
 * Skeleton de loading otimizado
 */
const ComponentLoadingSkeleton: React.FC = memo(() => (
  <div className="animate-pulse space-y-4 p-4">
    <div className="h-4 bg-muted rounded w-3/4"></div>
    <div className="h-4 bg-muted rounded w-1/2"></div>
    <div className="h-8 bg-muted rounded w-full"></div>
  </div>
));

// =====================================================
// 🎨 OPTIMIZED COMPONENTS
// =====================================================

/**
 * Editor Principal com lazy loading otimizado
 * CORRIGIDO: Agora usa UniversalStepEditorPro em vez do legacy EditorPro
 */
export const OptimizedEditorCore = createLazyComponent(
  () => import('@/components/editor/universal/UniversalStepEditorPro'),
  <div className="h-96 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <div className="text-sm text-muted-foreground">Carregando editor UniversalStepEditorPro...</div>
    </div>
  </div>
);

/**
 * Sidebars com lazy loading
 */
export const OptimizedStepSidebar = createLazyComponent(
  () => import('@/components/editor/sidebars/StepSidebar')
);

export const OptimizedComponentsSidebar = createLazyComponent(
  () => import('@/components/editor/sidebars/ComponentsSidebar')
);

export const OptimizedPropertiesColumn = createLazyComponent(
  () => import('@/components/editor/properties/PropertiesColumn')
);

/**
 * Step 20 Components com lazy loading
 */
export const OptimizedStep20Components = createLazyComponent(
  () => import('@/components/editor/blocks/Step20ModularBlocks').then(mod => ({
    default: mod.default?.Step20CompleteTemplateBlock || (() => <div>Step 20 Component</div>)
  }))
);

// =====================================================
// 🧠 MEMOIZATION HELPERS
// =====================================================

/**
 * Hook para memoização de blocos complexos
 */
export const useOptimizedBlocks = (blocks: any[], dependencies: any[] = []) => {
  return useMemo(() => {
    if (!Array.isArray(blocks)) return [];

    // Processar apenas blocos que mudaram
    return blocks.map(block => ({
      ...block,
      _optimized: true,
      _timestamp: Date.now()
    }));
  }, [blocks, ...dependencies]);
};

/**
 * Hook para callbacks otimizados
 */
export const useOptimizedCallbacks = (handlers: Record<string, any>) => {
  return useMemo(() => {
    const optimizedHandlers: Record<string, any> = {};

    Object.entries(handlers).forEach(([key, handler]) => {
      optimizedHandlers[key] = useCallback(handler, [handler]);
    });

    return optimizedHandlers;
  }, [handlers]);
};

// =====================================================
// 📊 PERFORMANCE MONITORING
// =====================================================

/**
 * Hook para monitorar performance
 */
export const usePerformanceMonitoring = (componentName: string) => {
  const metrics = useMemo<PerformanceMetrics>(() => ({
    renderTime: 0,
    blocksCount: 0,
    memoryUsage: 0,
    lastUpdate: new Date(),
  }), []);

  const startTimer = useCallback(() => {
    return performance.now();
  }, []);

  const endTimer = useCallback((startTime: number) => {
    const renderTime = performance.now() - startTime;
    metrics.renderTime = renderTime;
    metrics.lastUpdate = new Date();

    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ ${componentName} render time: ${renderTime.toFixed(2)}ms`);
    }

    return renderTime;
  }, [componentName, metrics]);

  const updateBlocksCount = useCallback((count: number) => {
    metrics.blocksCount = count;
  }, [metrics]);

  return {
    metrics,
    startTimer,
    endTimer,
    updateBlocksCount,
  };
};

// =====================================================
// 🎯 OPTIMIZED EDITOR WRAPPER
// =====================================================

interface OptimizedEditorWrapperProps extends EditorComponentConfig {
  performanceConfig?: Partial<PerformanceConfig>;
}

/**
 * Wrapper principal otimizado para performance
 */
export const OptimizedEditorWrapper: React.FC<OptimizedEditorWrapperProps> = memo(({
  className = '',
  funnelId = 'quiz-style-21-steps',
  quizId,
  enableSupabase = true,
  debugMode = false,
  stepNumber = 1,
  performanceConfig = {}
}) => {
  const config = useMemo(() => ({
    ...DEFAULT_PERFORMANCE_CONFIG,
    ...performanceConfig
  }), [performanceConfig]);

  const { metrics, startTimer, endTimer } = usePerformanceMonitoring('OptimizedEditorWrapper');

  // Timer de render
  React.useEffect(() => {
    const timer = startTimer();
    return () => {
      endTimer(timer);
    };
  });

  const optimizedProps = useMemo(() => ({
    funnelId,
    quizId,
    enableSupabase,
    debugMode,
    stepNumber,
    className
  }), [funnelId, quizId, enableSupabase, debugMode, stepNumber, className]);

  if (config.enableCodeSplitting) {
    return (
      <div className={`optimized-editor-wrapper ${className}`}>
        <OptimizedEditorCore {...optimizedProps} />

        {debugMode && (
          <PerformanceDebugPanel
            metrics={metrics}
            config={config}
          />
        )}
      </div>
    );
  }

  // Fallback para modo síncrono (se necessário)
  return (
    <div className={`editor-wrapper-sync ${className}`}>
      <div className="text-center p-8">
        <div className="text-muted-foreground">
          Modo síncrono ativo - performance reduzida
        </div>
      </div>
    </div>
  );
});

// =====================================================
// 🔍 DEBUG PANEL
// =====================================================

interface PerformanceDebugPanelProps {
  metrics: PerformanceMetrics;
  config: PerformanceConfig;
}

const PerformanceDebugPanel: React.FC<PerformanceDebugPanelProps> = memo(({
  metrics,
  config
}) => (
  <div className="fixed top-4 right-4 z-50 bg-background/95 border border-border rounded-lg p-3 text-xs space-y-2 max-w-xs shadow-lg">
    <div className="font-semibold text-primary">⚡ Performance</div>
    <div className="space-y-1 text-muted-foreground">
      <div>Render: {metrics.renderTime.toFixed(2)}ms</div>
      <div>Blocks: {metrics.blocksCount}</div>
      <div>Memory: {(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB</div>
      <div>Updated: {metrics.lastUpdate.toLocaleTimeString()}</div>
    </div>

    <div className="pt-2 border-t space-y-1">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${config.enableLazyLoading ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span>Lazy Loading</span>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${config.enableCodeSplitting ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span>Code Splitting</span>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${config.enableMemoization ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span>Memoization</span>
      </div>
    </div>
  </div>
));

export default OptimizedEditorWrapper;