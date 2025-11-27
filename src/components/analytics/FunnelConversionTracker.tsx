/**
 * 📊 FUNNEL CONVERSION TRACKER
 *
 * Componente avançado para rastreamento de conversão em funis.
 * Registra eventos detalhados de navegação, abandono e conversão.
 *
 * @example
 * ```tsx
 * <FunnelConversionTracker
 *   funnelId="quiz21StepsComplete"
 *   currentStep="step-05"
 *   totalSteps={21}
 *   onMetricRecorded={(metric) => console.log('Metric:', metric)}
 * />
 * ```
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { analyticsService } from '@/services/canonical/AnalyticsService';
import { appLogger } from '@/lib/utils/appLogger';

export interface FunnelMetric {
  type: 'step_enter' | 'step_exit' | 'step_complete' | 'funnel_abandon' | 'funnel_complete';
  stepId: string;
  stepIndex: number;
  totalSteps: number;
  timeSpent: number;
  timestamp: Date;
  sessionId?: string;
  funnelId?: string;
  metadata?: Record<string, any>;
}

export interface FunnelConversionTrackerProps {
  /** ID do funil sendo rastreado */
  funnelId: string;
  /** Step atual */
  currentStep: string;
  /** Índice do step atual (1-based) */
  currentStepIndex: number;
  /** Total de steps no funil */
  totalSteps: number;
  /** Callback quando uma métrica é registrada */
  onMetricRecorded?: (metric: FunnelMetric) => void;
  /** Se deve persistir métricas em localStorage */
  persistLocal?: boolean;
  /** Se deve enviar métricas para o analytics service */
  sendToAnalytics?: boolean;
  /** Dados extras para incluir nas métricas */
  metadata?: Record<string, any>;
}

const STORAGE_KEY = 'funnel_conversion_metrics';
const MAX_STORED_METRICS = 1000;

/**
 * Gera um ID de sessão único
 */
function generateSessionId(): string {
  if (typeof sessionStorage !== 'undefined') {
    const existing = sessionStorage.getItem('funnelSessionId');
    if (existing) return existing;

    const newId = `fsess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem('funnelSessionId', newId);
    return newId;
  }
  return `fsess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Carrega métricas armazenadas
 */
function loadStoredMetrics(): FunnelMetric[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Salva métricas no localStorage
 */
function saveStoredMetrics(metrics: FunnelMetric[]): void {
  if (typeof localStorage === 'undefined') return;
  try {
    const trimmed = metrics.slice(-MAX_STORED_METRICS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    appLogger.warn('[FunnelConversionTracker] Failed to save metrics to localStorage');
  }
}

/**
 * Hook para obter métricas de conversão do funil
 */
export function useFunnelMetrics(): {
  metrics: FunnelMetric[];
  clearMetrics: () => void;
  getMetricsByFunnel: (funnelId: string) => FunnelMetric[];
  getConversionRate: (funnelId: string) => number;
  getDropOffByStep: (funnelId: string) => Record<string, number>;
  getAverageTimeByStep: (funnelId: string) => Record<string, number>;
} {
  const [metrics, setMetrics] = React.useState<FunnelMetric[]>([]);

  React.useEffect(() => {
    setMetrics(loadStoredMetrics());
  }, []);

  const clearMetrics = useCallback(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    setMetrics([]);
  }, []);

  const getMetricsByFunnel = useCallback(
    (funnelId: string) => {
      return metrics.filter((m) => m.funnelId === funnelId);
    },
    [metrics]
  );

  const getConversionRate = useCallback(
    (funnelId: string) => {
      const funnelMetrics = getMetricsByFunnel(funnelId);
      const starts = funnelMetrics.filter((m) => m.type === 'step_enter' && m.stepIndex === 1).length;
      const completes = funnelMetrics.filter((m) => m.type === 'funnel_complete').length;
      return starts > 0 ? Math.round((completes / starts) * 100 * 10) / 10 : 0;
    },
    [getMetricsByFunnel]
  );

  const getDropOffByStep = useCallback(
    (funnelId: string) => {
      const funnelMetrics = getMetricsByFunnel(funnelId);
      const dropOffs: Record<string, number> = {};

      const stepEnters = new Map<string, number>();
      const stepExits = new Map<string, number>();

      funnelMetrics.forEach((m) => {
        if (m.type === 'step_enter') {
          stepEnters.set(m.stepId, (stepEnters.get(m.stepId) || 0) + 1);
        } else if (m.type === 'step_exit' || m.type === 'step_complete') {
          stepExits.set(m.stepId, (stepExits.get(m.stepId) || 0) + 1);
        }
      });

      stepEnters.forEach((enters, stepId) => {
        const exits = stepExits.get(stepId) || 0;
        const dropOff = enters > 0 ? Math.round(((enters - exits) / enters) * 100 * 10) / 10 : 0;
        dropOffs[stepId] = dropOff;
      });

      return dropOffs;
    },
    [getMetricsByFunnel]
  );

  const getAverageTimeByStep = useCallback(
    (funnelId: string) => {
      const funnelMetrics = getMetricsByFunnel(funnelId);
      const timesByStep = new Map<string, number[]>();

      funnelMetrics.forEach((m) => {
        if ((m.type === 'step_exit' || m.type === 'step_complete') && m.timeSpent > 0) {
          const times = timesByStep.get(m.stepId) || [];
          times.push(m.timeSpent);
          timesByStep.set(m.stepId, times);
        }
      });

      const averages: Record<string, number> = {};
      timesByStep.forEach((times, stepId) => {
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        averages[stepId] = Math.round(avg * 10) / 10;
      });

      return averages;
    },
    [getMetricsByFunnel]
  );

  return {
    metrics,
    clearMetrics,
    getMetricsByFunnel,
    getConversionRate,
    getDropOffByStep,
    getAverageTimeByStep,
  };
}

/**
 * Componente principal de rastreamento de funil
 */
export const FunnelConversionTracker: React.FC<FunnelConversionTrackerProps> = ({
  funnelId,
  currentStep,
  currentStepIndex,
  totalSteps,
  onMetricRecorded,
  persistLocal = true,
  sendToAnalytics = true,
  metadata = {},
}) => {
  const sessionIdRef = useRef<string>(generateSessionId());
  const stepEnterTimeRef = useRef<number>(Date.now());
  const previousStepRef = useRef<string | null>(null);
  const isFirstRenderRef = useRef(true);

  const recordMetric = useCallback(
    (metric: Omit<FunnelMetric, 'sessionId' | 'funnelId'>) => {
      const fullMetric: FunnelMetric = {
        ...metric,
        sessionId: sessionIdRef.current,
        funnelId,
      };

      appLogger.info('[FunnelConversionTracker] Recording metric', { data: [fullMetric] });

      // Persistir localmente
      if (persistLocal) {
        const stored = loadStoredMetrics();
        stored.push(fullMetric);
        saveStoredMetrics(stored);
      }

      // Enviar para analytics
      if (sendToAnalytics) {
        analyticsService.trackEvent({
          type: 'step_changed',
          funnelId,
          properties: {
            metricType: metric.type,
            stepId: metric.stepId,
            stepIndex: metric.stepIndex,
            totalSteps: metric.totalSteps,
            timeSpent: metric.timeSpent,
            ...metric.metadata,
          },
        });
      }

      // Callback
      onMetricRecorded?.(fullMetric);
    },
    [funnelId, persistLocal, sendToAnalytics, onMetricRecorded]
  );

  // Rastrear entrada em step
  useEffect(() => {
    const now = Date.now();

    // Registrar saída do step anterior
    if (previousStepRef.current && previousStepRef.current !== currentStep) {
      const timeSpent = now - stepEnterTimeRef.current;
      const previousIndex = currentStepIndex - 1;

      recordMetric({
        type: 'step_complete',
        stepId: previousStepRef.current,
        stepIndex: previousIndex,
        totalSteps,
        timeSpent,
        timestamp: new Date(),
        metadata,
      });
    }

    // Registrar entrada no novo step
    if (!isFirstRenderRef.current || currentStep !== previousStepRef.current) {
      stepEnterTimeRef.current = now;

      recordMetric({
        type: 'step_enter',
        stepId: currentStep,
        stepIndex: currentStepIndex,
        totalSteps,
        timeSpent: 0,
        timestamp: new Date(),
        metadata,
      });
    }

    previousStepRef.current = currentStep;
    isFirstRenderRef.current = false;
  }, [currentStep, currentStepIndex, totalSteps, metadata, recordMetric]);

  // Rastrear abandono ao desmontar ou sair da página
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - stepEnterTimeRef.current;
      const metric: FunnelMetric = {
        type: 'funnel_abandon',
        stepId: currentStep,
        stepIndex: currentStepIndex,
        totalSteps,
        timeSpent,
        timestamp: new Date(),
        sessionId: sessionIdRef.current,
        funnelId,
        metadata: { ...metadata, abandonReason: 'page_unload' },
      };

      // Usar sendBeacon para garantir que o evento seja enviado
      if (navigator.sendBeacon && typeof Blob !== 'undefined') {
        const blob = new Blob([JSON.stringify(metric)], { type: 'application/json' });
        navigator.sendBeacon('/api/funnel-abandon', blob);
      }

      // Também salvar localmente
      if (persistLocal) {
        const stored = loadStoredMetrics();
        stored.push(metric);
        saveStoredMetrics(stored);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentStep, currentStepIndex, totalSteps, funnelId, metadata, persistLocal]);

  // Componente não renderiza nada visualmente
  return null;
};

/**
 * Função utilitária para registrar conclusão do funil
 */
export function recordFunnelComplete(
  funnelId: string,
  totalSteps: number,
  metadata: Record<string, any> = {}
): void {
  const sessionId =
    typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('funnelSessionId') || '' : '';

  const metric: FunnelMetric = {
    type: 'funnel_complete',
    stepId: `step-${totalSteps.toString().padStart(2, '0')}`,
    stepIndex: totalSteps,
    totalSteps,
    timeSpent: 0,
    timestamp: new Date(),
    sessionId,
    funnelId,
    metadata,
  };

  const stored = loadStoredMetrics();
  stored.push(metric);
  saveStoredMetrics(stored);

  analyticsService.trackEvent({
    type: 'quiz_completed',
    funnelId,
    properties: {
      totalSteps,
      ...metadata,
    },
  });

  appLogger.info('[FunnelConversionTracker] Funnel completed', { data: [metric] });
}

export default FunnelConversionTracker;
