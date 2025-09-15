/**
 * 🚀 PERFORMANCE MONITOR - CLEAN ARCHITECTURE
 * 
 * Sistema de monitoramento de performance para validar
 * melhorias da Clean Architecture vs Legacy
 */

import React, { createContext, useContext, useCallback, useRef, useEffect, useState } from 'react';

// 🎯 TIPOS
interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: Date;
  context: 'clean' | 'legacy';
  metadata?: Record<string, any>;
}

interface PerformanceMonitorContextValue {
  // Medição
  startTimer: (name: string, context: 'clean' | 'legacy', metadata?: Record<string, any>) => string;
  endTimer: (timerId: string) => void;
  recordMetric: (metric: PerformanceMetric) => void;
  
  // Análise
  getMetrics: () => PerformanceMetric[];
  getAverageTime: (name: string, context?: 'clean' | 'legacy') => number;
  comparePerformance: (metricName: string) => { clean: number; legacy: number; improvement: number };
  
  // Estado
  isMonitoring: boolean;
  metricsCount: number;
}

// 🏗️ CONTEXTO
const PerformanceMonitorContext = createContext<PerformanceMonitorContextValue | null>(null);

// 🎯 PROVIDER
export const PerformanceMonitorProvider: React.FC<{ 
  children: React.ReactNode;
  enabled?: boolean;
  maxMetrics?: number;
}> = ({ 
  children, 
  enabled = true,
  maxMetrics = 1000 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isMonitoring] = useState(enabled);
  const timersRef = useRef<Map<string, { start: number; name: string; context: 'clean' | 'legacy'; metadata?: any }>>(new Map());

  // 🚀 START TIMER
  const startTimer = useCallback((name: string, context: 'clean' | 'legacy', metadata?: Record<string, any>) => {
    if (!isMonitoring) return '';
    
    const timerId = `${name}-${Date.now()}-${Math.random()}`;
    timersRef.current.set(timerId, {
      start: performance.now(),
      name,
      context,
      metadata
    });
    
    return timerId;
  }, [isMonitoring]);

  // 🏁 END TIMER
  const endTimer = useCallback((timerId: string) => {
    if (!isMonitoring) return;
    
    const timer = timersRef.current.get(timerId);
    if (!timer) return;
    
    const duration = performance.now() - timer.start;
    const metric: PerformanceMetric = {
      name: timer.name,
      duration,
      timestamp: new Date(),
      context: timer.context,
      metadata: timer.metadata
    };
    
    recordMetric(metric);
    timersRef.current.delete(timerId);
  }, [isMonitoring]);

  // 📊 RECORD METRIC
  const recordMetric = useCallback((metric: PerformanceMetric) => {
    if (!isMonitoring) return;
    
    setMetrics(prevMetrics => {
      const newMetrics = [...prevMetrics, metric];
      // Manter apenas as últimas N métricas
      return newMetrics.slice(-maxMetrics);
    });
  }, [isMonitoring, maxMetrics]);

  // 📈 GET METRICS
  const getMetrics = useCallback(() => metrics, [metrics]);

  // 📊 GET AVERAGE TIME
  const getAverageTime = useCallback((name: string, context?: 'clean' | 'legacy') => {
    const filteredMetrics = metrics.filter(m => 
      m.name === name && (!context || m.context === context)
    );
    
    if (filteredMetrics.length === 0) return 0;
    
    const totalTime = filteredMetrics.reduce((sum, m) => sum + m.duration, 0);
    return totalTime / filteredMetrics.length;
  }, [metrics]);

  // 🔍 COMPARE PERFORMANCE
  const comparePerformance = useCallback((metricName: string) => {
    const cleanAvg = getAverageTime(metricName, 'clean');
    const legacyAvg = getAverageTime(metricName, 'legacy');
    
    const improvement = legacyAvg > 0 ? ((legacyAvg - cleanAvg) / legacyAvg) * 100 : 0;
    
    return {
      clean: cleanAvg,
      legacy: legacyAvg,
      improvement: Math.round(improvement * 100) / 100
    };
  }, [getAverageTime]);

  // 🎯 CONTEXT VALUE
  const contextValue: PerformanceMonitorContextValue = {
    startTimer,
    endTimer,
    recordMetric,
    getMetrics,
    getAverageTime,
    comparePerformance,
    isMonitoring,
    metricsCount: metrics.length
  };

  return (
    <PerformanceMonitorContext.Provider value={contextValue}>
      {children}
    </PerformanceMonitorContext.Provider>
  );
};

// 🪝 HOOK
export const usePerformanceMonitor = () => {
  const context = useContext(PerformanceMonitorContext);
  if (!context) {
    throw new Error('usePerformanceMonitor must be used within PerformanceMonitorProvider');
  }
  return context;
};

// 🎯 HOC PARA MEDIR COMPONENTES
export const withPerformanceMonitoring = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string,
  context: 'clean' | 'legacy'
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    const { startTimer, endTimer } = usePerformanceMonitor();
    const [timerId, setTimerId] = useState<string>('');

    useEffect(() => {
      const id = startTimer(`${componentName}-render`, context);
      setTimerId(id);
      
      return () => {
        if (id) endTimer(id);
      };
    }, [startTimer, endTimer]);

    useEffect(() => {
      if (timerId) {
        endTimer(timerId);
      }
    });

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withPerformanceMonitoring(${componentName})`;
  return WrappedComponent;
};

// 🎯 HOOK PARA MEDIR OPERAÇÕES
export const usePerformanceTimer = (operationName: string, context: 'clean' | 'legacy') => {
  const { startTimer, endTimer } = usePerformanceMonitor();
  
  return useCallback(async <T,>(operation: () => Promise<T> | T): Promise<T> => {
    const timerId = startTimer(operationName, context);
    
    try {
      const result = await operation();
      return result;
    } finally {
      endTimer(timerId);
    }
  }, [startTimer, endTimer, operationName, context]);
};

// 🎨 PERFORMANCE DASHBOARD COMPONENT
export const PerformanceDashboard: React.FC<{ className?: string }> = ({ className }) => {
  const { getMetrics, comparePerformance, metricsCount, isMonitoring } = usePerformanceMonitor();
  const [selectedMetric, setSelectedMetric] = useState<string>('editor-render');
  
  // Métricas únicas
  const uniqueMetricNames = Array.from(new Set(getMetrics().map(m => m.name)));
  const comparison = comparePerformance(selectedMetric);
  
  if (!isMonitoring) {
    return (
      <div className={`p-4 bg-muted/20 rounded-lg ${className}`}>
        <div className="text-sm text-muted-foreground">
          Performance Monitoring desabilitado
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-muted/20 rounded-lg space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Performance Monitor</h3>
        <div className="text-sm text-muted-foreground">
          {metricsCount} métricas coletadas
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Métrica:</label>
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          className="w-full p-2 border border-muted rounded-lg bg-background"
        >
          {uniqueMetricNames.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>
      
      {comparison.legacy > 0 && comparison.clean > 0 && (
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="font-medium text-blue-900">Clean Architecture</div>
            <div className="text-xl font-bold text-blue-700">
              {comparison.clean.toFixed(2)}ms
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="font-medium text-gray-900">Legacy</div>
            <div className="text-xl font-bold text-gray-700">
              {comparison.legacy.toFixed(2)}ms
            </div>
          </div>
          
          <div className={`p-3 border rounded-lg ${
            comparison.improvement > 0 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className={`font-medium ${
              comparison.improvement > 0 ? 'text-green-900' : 'text-red-900'
            }`}>
              Melhoria
            </div>
            <div className={`text-xl font-bold ${
              comparison.improvement > 0 ? 'text-green-700' : 'text-red-700'
            }`}>
              {comparison.improvement > 0 ? '+' : ''}{comparison.improvement}%
            </div>
          </div>
        </div>
      )}
      
      <div className="text-xs text-muted-foreground">
        💡 Valores menores são melhores. Melhoria positiva indica que Clean Architecture é mais rápida.
      </div>
    </div>
  );
};

export default PerformanceMonitorProvider;