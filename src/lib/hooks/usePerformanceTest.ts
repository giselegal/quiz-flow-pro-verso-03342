import { useEffect, useMemo, useRef, useState } from 'react';

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
  const metrics = useMemo(() => ({
    renderTime: typeof performance !== 'undefined' && startRef.current != null ? performance.now() - startRef.current : 0,
    memoryUsage: 0,
    reRenderCount,
    networkLatency: 0,
  }), [reRenderCount]);

  const startTest = () => {
    if (!enabled) return;
    if (typeof performance !== 'undefined') {
      startRef.current = performance.now();
    } else {
      startRef.current = Date.now();
    }
  };

  const stopTest = () => {
    if (!enabled) return;
    // naive alert when render time seems high
    const renderTime = metrics.renderTime || 0;
    if (renderTime > 200) {
      const alert: Alert = { message: `Render lento em ${component}: ${renderTime.toFixed(1)}ms`, type: 'warning', timestamp: Date.now() };
      setAlerts(prev => [...prev, alert]);
      onAlert?.(alert);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    setReRenderCount(c => c + 1);
  });

  return {
    startTest,
    stopTest,
    metrics,
    alerts,
  };
}
