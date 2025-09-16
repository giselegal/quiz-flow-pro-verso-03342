/**
 * 🚀 PERFORMANCE PROVIDER - FASE 4
 * 
 * Provider React para gerenciar performance avançada:
 * - Context para todos os sistemas de performance
 * - Configuração centralizada
 * - Monitoramento automático
 * - Debug tools integradas
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAdvancedPerformance } from '@/hooks/useAdvancedPerformance';
import { PerformanceOptimizer } from '@/utils/performanceOptimizer';

interface PerformanceContextValue {
  // Estado
  isReady: boolean;
  metrics: any;
  config: any;
  
  // Cache operations
  cachedOperation: <T>(operation: any) => Promise<T | null>;
  invalidateCache: (key: string, cascade?: boolean) => void;
  
  // Recovery operations
  recoveredOperation: <T>(operation: string, executor: () => Promise<T>, options?: any) => Promise<T>;
  gracefulOperation: <T>(primary: () => Promise<T>, degraded: () => Promise<T>, offline?: () => Promise<T>) => Promise<T>;
  
  // Lazy loading
  loadComponent: (name: string) => Promise<any>;
  preloadComponents: (components: string[], strategy?: 'immediate' | 'idle' | 'intersection') => void;
  
  // Realtime
  optimisticUpdate: <T>(id: string, type: string, updateFn: (data: T) => T, originalData: T, options?: any) => Promise<boolean>;
  trackCursor: (x: number, y: number) => void;
  
  // Telemetry
  recordEvent: (type: string, category: string, action: string, metadata?: any) => void;
  
  // Controls
  reset: () => void;
  toggleDebug: () => void;
}

const PerformanceContext = createContext<PerformanceContextValue | null>(null);

interface PerformanceProviderProps {
  children: React.ReactNode;
  config?: {
    enableCache?: boolean;
    enableRecovery?: boolean;
    enableLazyLoading?: boolean;
    enableRealtime?: boolean;
    enableTelemetry?: boolean;
    enableDebug?: boolean;
    userId?: string;
    userName?: string;
  };
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({
  children,
  config = {}
}) => {
  const {
    enableCache = true,
    enableRecovery = true,
    enableLazyLoading = true,
    enableRealtime = false,
    enableTelemetry = true,
    enableDebug = process.env.NODE_ENV === 'development',
    userId = 'anonymous',
    userName = 'User'
  } = config;

  const [isDebugVisible, setIsDebugVisible] = useState(false);
  const [performanceWarnings, setPerformanceWarnings] = useState<string[]>([]);

  const performance = useAdvancedPerformance({
    enableCache,
    enableRecovery,
    enableLazyLoading,
    enableRealtime,
    enableTelemetry,
    userId,
    userName
  });

  // ==================== MONITORAMENTO AUTOMÁTICO ====================

  useEffect(() => {
    if (!performance.isInitialized) return;

    // Monitorar warnings de performance
    const checkPerformanceWarnings = () => {
      const warnings: string[] = [];
      
      if (performance.metrics) {
        const { cacheStats, recoveryStats, bundleAnalysis } = performance.metrics;
        
        // Cache warnings
        if (cacheStats && cacheStats.hitRate < 0.5) {
          warnings.push('Cache hit rate baixo (<50%) - considere otimizar estratégia de cache');
        }
        
        // Recovery warnings
        if (recoveryStats && recoveryStats.errorRate > 0.1) {
          warnings.push('Taxa de erro alta (>10%) - verificar conectividade e estabilidade');
        }
        
        // Bundle warnings
        if (bundleAnalysis && bundleAnalysis.metrics.errors.length > 0) {
          warnings.push(`${bundleAnalysis.metrics.errors.length} erros de carregamento detectados`);
        }
        
        // Memory warnings
        if (performance.metrics.memoryUsage > 100) {
          warnings.push(`Uso de memória alto (${performance.metrics.memoryUsage}MB)`);
        }
      }
      
      setPerformanceWarnings(warnings);
    };

    // Check inicial
    checkPerformanceWarnings();
    
    // Check periódico
    const warningTimer = PerformanceOptimizer.scheduleInterval(
      checkPerformanceWarnings,
      30000, // A cada 30 segundos
      'timeout'
    );

    return () => {
      if (warningTimer) {
        PerformanceOptimizer.cancelInterval(warningTimer);
      }
    };
  }, [performance.isInitialized, performance.metrics]);

  // ==================== DEBUG CONTROLS ====================

  const toggleDebug = () => {
    setIsDebugVisible(!isDebugVisible);
    
    if (enableTelemetry) {
      performance.recordEvent('user-action', 'debug', 'toggle', {
        visible: !isDebugVisible
      });
    }
  };

  // Atalho de teclado para debug (Ctrl+Shift+P)
  useEffect(() => {
    if (!enableDebug) return;

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        event.preventDefault();
        toggleDebug();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    
    return () => {
      window.removeEventListener('keydown', handleKeyboard);
    };
  }, [enableDebug, isDebugVisible]);

  // ==================== CONTEXT VALUE ====================

  const contextValue: PerformanceContextValue = {
    // Estado
    isReady: performance.isInitialized,
    metrics: performance.metrics,
    config: performance.config,
    
    // Operações
    cachedOperation: performance.cachedOperation,
    invalidateCache: performance.invalidateCache,
    recoveredOperation: performance.recoveredOperation,
    gracefulOperation: performance.gracefulOperation,
    loadComponent: performance.loadComponent,
    preloadComponents: performance.preloadComponents,
    optimisticUpdate: performance.optimisticUpdate,
    trackCursor: performance.trackCursor,
    recordEvent: performance.recordEvent,
    reset: performance.reset,
    toggleDebug
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
      
      {/* Debug Panel */}
      {enableDebug && isDebugVisible && (
        <PerformanceDebugPanel
          metrics={performance.metrics}
          warnings={performanceWarnings}
          onClose={() => setIsDebugVisible(false)}
          onReset={performance.reset}
        />
      )}
      
      {/* Performance Warnings Toast */}
      {enableDebug && performanceWarnings.length > 0 && (
        <PerformanceWarningsToast warnings={performanceWarnings} />
      )}
    </PerformanceContext.Provider>
  );
};

// ==================== DEBUG COMPONENTS ====================

const PerformanceDebugPanel: React.FC<{
  metrics: any;
  warnings: string[];
  onClose: () => void;
  onReset: () => void;
}> = ({ metrics, warnings, onClose, onReset }) => {
  return (
    <div className="fixed bottom-4 right-4 w-96 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h3 className="font-semibold text-foreground">Performance Debug</h3>
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded hover:bg-orange-200"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Warnings */}
        {warnings.length > 0 && (
          <div>
            <h4 className="font-medium text-orange-600 mb-2">⚠️ Warnings</h4>
            <ul className="text-xs space-y-1">
              {warnings.map((warning, index) => (
                <li key={index} className="text-orange-700 bg-orange-50 p-2 rounded">
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Cache Stats */}
        {metrics?.cacheStats && (
          <div>
            <h4 className="font-medium text-blue-600 mb-2">📦 Cache</h4>
            <div className="text-xs space-y-1">
              <div>Hit Rate: {(metrics.cacheStats.hitRate * 100).toFixed(1)}%</div>
              <div>Entries: {metrics.cacheStats.entriesCount}</div>
              <div>Memory: {(metrics.cacheStats.memoryUsage / 1024).toFixed(1)}KB</div>
            </div>
          </div>
        )}
        
        {/* Recovery Stats */}
        {metrics?.recoveryStats && (
          <div>
            <h4 className="font-medium text-green-600 mb-2">🔄 Recovery</h4>
            <div className="text-xs space-y-1">
              <div>Error Rate: {(metrics.recoveryStats.errorRate * 100).toFixed(1)}%</div>
              <div>Recovery Rate: {(metrics.recoveryStats.recoveryRate * 100).toFixed(1)}%</div>
              <div>Avg Time: {metrics.recoveryStats.averageOperationTime.toFixed(0)}ms</div>
            </div>
          </div>
        )}
        
        {/* Bundle Analysis */}
        {metrics?.bundleAnalysis && (
          <div>
            <h4 className="font-medium text-purple-600 mb-2">📊 Bundle</h4>
            <div className="text-xs space-y-1">
              <div>Loaded: {metrics.bundleAnalysis.metrics.loadedChunks.length} chunks</div>
              <div>Pending: {metrics.bundleAnalysis.metrics.pendingChunks.length} chunks</div>
              <div>Errors: {metrics.bundleAnalysis.metrics.errors.length}</div>
            </div>
          </div>
        )}
        
        {/* System Info */}
        <div>
          <h4 className="font-medium text-gray-600 mb-2">🖥️ System</h4>
          <div className="text-xs space-y-1">
            <div>Network: {metrics?.networkStatus}</div>
            <div>Memory: {metrics?.memoryUsage}MB</div>
            <div>User Agent: {navigator.userAgent.split(' ')[0]}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PerformanceWarningsToast: React.FC<{ warnings: string[] }> = ({ warnings }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || warnings.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 w-80 bg-orange-50 border border-orange-200 rounded-lg shadow-lg z-40">
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-orange-800">⚠️ Performance Alerts</h4>
          <button
            onClick={() => setIsVisible(false)}
            className="text-orange-600 hover:text-orange-800"
          >
            ✕
          </button>
        </div>
        <ul className="text-xs text-orange-700 space-y-1">
          {warnings.slice(0, 3).map((warning, index) => (
            <li key={index}>• {warning}</li>
          ))}
          {warnings.length > 3 && (
            <li className="font-medium">... e mais {warnings.length - 3} alertas</li>
          )}
        </ul>
      </div>
    </div>
  );
};

// ==================== HOOK ====================

export const usePerformance = (): PerformanceContextValue => {
  const context = useContext(PerformanceContext);
  
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  
  return context;
};

export default PerformanceProvider;