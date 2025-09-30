/**
 * Hook de alto nível para consumir métricas unificadas de um funil.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { unifiedAnalyticsEngine } from '@/analytics/UnifiedAnalyticsEngine';

export interface UseFunnelAnalyticsOptions {
  funnelId: string;
  realtime?: boolean;
  realtimeIntervalMs?: number;
  preloadOnMount?: boolean;
}

export interface FunnelAnalyticsState {
  summary: any | null;
  realtime: any | null;
  styleDistribution: any[];
  dropoff: any[];
  deviceBreakdown: any | null;
  answerDistribution: Record<string, any>;
  loading: boolean;
  error?: any;
}

export function useFunnelAnalytics(options: UseFunnelAnalyticsOptions) {
  const { funnelId, realtime = true, realtimeIntervalMs = 15000, preloadOnMount = true } = options;
  const [state, setState] = useState<FunnelAnalyticsState>({
    summary: null,
    realtime: null,
    styleDistribution: [],
    dropoff: [],
    deviceBreakdown: null,
    answerDistribution: {},
    loading: preloadOnMount,
  });
  const timerRef = useRef<any>(null);

  const load = useCallback(async () => {
    try {
      const [summary, realtimeSnap, styleDist, dropoff, device, answerDist] = await Promise.all([
        unifiedAnalyticsEngine.getFunnelSummary(funnelId),
        unifiedAnalyticsEngine.getRealtimeSnapshot(funnelId),
        unifiedAnalyticsEngine.getStyleDistribution(funnelId),
        unifiedAnalyticsEngine.getStepDropoff(funnelId),
        unifiedAnalyticsEngine.getDeviceBreakdown(funnelId),
        // Para simplificar, não passamos stepId específico aqui
        unifiedAnalyticsEngine.getAnswerDistribution(funnelId, 'global')
      ]);
      setState(s => ({
        ...s,
        summary,
        realtime: realtimeSnap,
        styleDistribution: styleDist,
        dropoff,
        deviceBreakdown: device,
        answerDistribution: { global: answerDist },
        loading: false,
        error: undefined
      }));
    } catch (error) {
      setState(s => ({ ...s, error, loading: false }));
    }
  }, [funnelId]);

  useEffect(() => {
    if (preloadOnMount) load();
    if (realtime) {
      timerRef.current = setInterval(() => {
        unifiedAnalyticsEngine.getRealtimeSnapshot(funnelId).then(realtimeSnap => {
          setState(s => ({ ...s, realtime: realtimeSnap }));
        }).catch(() => {});
      }, realtimeIntervalMs);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [funnelId, load, preloadOnMount, realtime, realtimeIntervalMs]);

  return {
    ...state,
    reload: load
  };
}

export default useFunnelAnalytics;
