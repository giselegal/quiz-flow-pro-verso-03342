import { useEffect, useMemo, useRef, useState } from 'react';

// TODO(prod): Este hook é um stub leve para apoiar debugging local.
// Critérios de remoção/substituição:
// 1) Implementação real de métricas (PerformanceObserver/Performance API) e integração opcional com Sentry/Web-Vitals
// 2) Feature flag para habilitar em dev apenas (ex.: VITE_ENABLE_PERF_HOOK)
// 3) Cobertura de testes mínimos garantindo não interferência em produção

type Alert = { message: string; type?: 'warning' | 'critical'; timestamp: number };

type Options = {
  enabled?: boolean;
  onAlert?: (alert: Alert) => void;
};

export function usePerformanceTest(component: string, options: Options = {}) {
  const { enabled = true, onAlert } = options;
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [reRenderCount, setReRenderCount] = useState(0);
  const startRef = useRef<number | null>(null);

  // Very light metrics that are safe in any environment
  const isProd = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production';
  const metrics = useMemo(() => ({
    renderTime: typeof performance !== 'undefined' && startRef.current != null ? performance.now() - startRef.current : 0,
    memoryUsage: 0,
    reRenderCount,
    networkLatency: 0,
  }), [reRenderCount]);

  const perfFlag = (() => {
    try {
      if (typeof window !== 'undefined') {
        const ls = window.localStorage.getItem('VITE_ENABLE_PERF_HOOK');
        if (ls != null) return ls === 'true';
      }
      // @ts-ignore
      const viteFlag = (import.meta?.env?.VITE_ENABLE_PERF_HOOK);
      if (typeof viteFlag === 'string') return viteFlag === 'true';
      const nodeFlag = typeof process !== 'undefined' ? process.env?.VITE_ENABLE_PERF_HOOK : undefined;
      if (typeof nodeFlag === 'string') return nodeFlag === 'true';
    } catch { /* noop */ }
    return false;
  })();

  const startTest = () => {
    if (!enabled || !perfFlag) return;
    if (typeof performance !== 'undefined') {
      startRef.current = performance.now();
    } else {
      startRef.current = Date.now();
    }
  };

  const stopTest = () => {
    if (!enabled || !perfFlag) return;
    // naive alert when render time seems high
    const renderTime = metrics.renderTime || 0;
    if (!isProd && renderTime > 200) {
      const alert: Alert = { message: `Render lento em ${component}: ${renderTime.toFixed(1)}ms`, type: 'warning', timestamp: Date.now() };
      setAlerts(prev => [...prev, alert]);
      onAlert?.(alert);
    }
  };

  useEffect(() => {
    if (!enabled || !perfFlag) return;
    setReRenderCount(c => c + 1);
  });

  return {
    startTest,
    stopTest,
    metrics,
    alerts,
    enabled: perfFlag && enabled,
  };
}
