/**
 * 🎯 HOOK DE ANALYTICS DE FUNIL INTEGRADO
 * 
 * Busca e processa métricas avançadas de analytics do Supabase:
 * - Performance de funis
 * - Análise de dropoff por step
 * - Funil de conversão
 * - Métricas de tempo real
 * 
 * @example
 * ```tsx
 * const { 
 *   funnelMetrics, 
 *   stepMetrics, 
 *   conversionFunnel,
 *   loading 
 * } = useFunnelAnalytics({ funnelId: 'my-funnel' });
 * ```
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/integrations/supabase/customClient';
import { appLogger } from '@/lib/utils/appLogger';

export interface FunnelMetrics {
  funnelId: string;
  funnelName: string;
  totalSessions: number;
  completedSessions: number;
  abandonedSessions: number;
  conversionRate: number;
  averageCompletionTime: number; // em minutos
  averageScore: number;
  dropoffRate: number;
  lastUpdated: Date;
}

export interface StepMetrics {
  stepNumber: number;
  totalViews: number;
  completions: number;
  dropoffs: number;
  dropoffRate: number;
  averageTimeSpent: number; // em segundos
  conversionToNext: number;
  mostCommonAnswers?: { value: string; count: number }[];
}

export interface ConversionFunnelData {
  steps: {
    stepNumber: number;
    label: string;
    users: number;
    percentage: number;
  }[];
  totalEntered: number;
  totalCompleted: number;
  overallConversionRate: number;
}

export interface UseFunnelAnalyticsOptions {
  funnelId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface UseFunnelAnalyticsReturn {
  funnelMetrics: FunnelMetrics | null;
  stepMetrics: StepMetrics[];
  conversionFunnel: ConversionFunnelData | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useFunnelAnalytics(options: UseFunnelAnalyticsOptions = {}): UseFunnelAnalyticsReturn {
  const { funnelId = 'quiz-21-steps-integrated', autoRefresh = false, refreshInterval = 60000 } = options;

  const [funnelMetrics, setFunnelMetrics] = useState<FunnelMetrics | null>(null);
  const [stepMetrics, setStepMetrics] = useState<StepMetrics[]>([]);
  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 📊 BUSCAR MÉTRICAS DE FUNIL
  const fetchFunnelMetrics = useCallback(async (): Promise<FunnelMetrics | null> => {
    try {
      appLogger.info('📊 Buscando métricas de funil', { funnelId });

      // Buscar sessões do funil
      const { data: sessions, error: sessionsError } = await supabase
        .from('quiz_sessions')
        .select('id, status, started_at, completed_at, score, total_steps')
        .eq('funnel_id', funnelId);

      if (sessionsError) throw sessionsError;

      const totalSessions = sessions?.length || 0;
      const completedSessions = sessions?.filter((s: any) => s.status === 'completed').length || 0;
      const abandonedSessions = sessions?.filter((s: any) => s.status === 'abandoned').length || 0;
      const conversionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
      const dropoffRate = 100 - conversionRate;

      // Calcular tempo médio de conclusão
      let totalTime = 0;
      let completedCount = 0;
      let totalScore = 0;

      sessions?.forEach((session: any) => {
        if (session.completed_at && session.started_at) {
          const start = new Date(session.started_at).getTime();
          const end = new Date(session.completed_at).getTime();
          totalTime += (end - start) / 60000; // minutos
          completedCount++;
        }
        if (session.score) {
          totalScore += session.score;
        }
      });

      const averageCompletionTime = completedCount > 0 ? totalTime / completedCount : 0;
      const averageScore = totalSessions > 0 ? totalScore / totalSessions : 0;

      const metrics: FunnelMetrics = {
        funnelId,
        funnelName: 'Quiz de Estilo Pessoal',
        totalSessions,
        completedSessions,
        abandonedSessions,
        conversionRate: Math.round(conversionRate * 100) / 100,
        averageCompletionTime: Math.round(averageCompletionTime * 10) / 10,
        averageScore: Math.round(averageScore * 100) / 100,
        dropoffRate: Math.round(dropoffRate * 100) / 100,
        lastUpdated: new Date(),
      };

      appLogger.info('✅ Métricas de funil calculadas', { metrics });
      return metrics;
    } catch (err) {
      appLogger.error('❌ Erro ao buscar métricas de funil', { data: [err] });
      throw err;
    }
  }, [funnelId]);

  // 📊 BUSCAR MÉTRICAS POR STEP
  const fetchStepMetrics = useCallback(async (): Promise<StepMetrics[]> => {
    try {
      appLogger.info('📊 Buscando métricas por step');

      // Buscar respostas agrupadas por step
      const { data: responses, error: responsesError } = await supabase
        .from('quiz_step_responses')
        .select('step_number, response_time_ms, answer_value')
        .order('step_number');

      if (responsesError) throw responsesError;

      // Agrupar por step
      const stepGroups: Record<number, any[]> = {};
      responses?.forEach((response: any) => {
        const step = response.step_number;
        if (!stepGroups[step]) {
          stepGroups[step] = [];
        }
        stepGroups[step].push(response);
      });

      // Calcular métricas para cada step
      const metrics: StepMetrics[] = [];

      for (let step = 1; step <= 21; step++) {
        const stepResponses = stepGroups[step] || [];
        const totalViews = stepResponses.length;
        
        // Contar respostas do próximo step para calcular dropoff
        const nextStepResponses = stepGroups[step + 1] || [];
        const completions = nextStepResponses.length;
        const dropoffs = totalViews - completions;
        const dropoffRate = totalViews > 0 ? (dropoffs / totalViews) * 100 : 0;
        const conversionToNext = totalViews > 0 ? (completions / totalViews) * 100 : 0;

        // Calcular tempo médio
        let totalTime = 0;
        stepResponses.forEach((r: any) => {
          if (r.response_time_ms) {
            totalTime += r.response_time_ms / 1000; // converter para segundos
          }
        });
        const averageTimeSpent = totalViews > 0 ? totalTime / totalViews : 0;

        // Contar respostas mais comuns
        const answerCounts: Record<string, number> = {};
        stepResponses.forEach((r: any) => {
          if (r.answer_value) {
            answerCounts[r.answer_value] = (answerCounts[r.answer_value] || 0) + 1;
          }
        });

        const mostCommonAnswers = Object.entries(answerCounts)
          .map(([value, count]) => ({ value, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);

        metrics.push({
          stepNumber: step,
          totalViews,
          completions,
          dropoffs,
          dropoffRate: Math.round(dropoffRate * 100) / 100,
          averageTimeSpent: Math.round(averageTimeSpent * 10) / 10,
          conversionToNext: Math.round(conversionToNext * 100) / 100,
          mostCommonAnswers,
        });
      }

      appLogger.info(`✅ Métricas de ${metrics.length} steps calculadas`);
      return metrics;
    } catch (err) {
      appLogger.error('❌ Erro ao buscar métricas por step', { data: [err] });
      throw err;
    }
  }, []);

  // 📊 CALCULAR FUNIL DE CONVERSÃO
  const calculateConversionFunnel = useCallback((stepMetrics: StepMetrics[]): ConversionFunnelData => {
    const steps = stepMetrics.slice(0, 21).map((metric, index) => ({
      stepNumber: metric.stepNumber,
      label: `Step ${metric.stepNumber}`,
      users: metric.totalViews,
      percentage: index === 0 && metric.totalViews > 0 ? 100 : stepMetrics[0]?.totalViews > 0 ? (metric.totalViews / stepMetrics[0].totalViews) * 100 : 0,
    }));

    const totalEntered = steps[0]?.users || 0;
    const totalCompleted = steps[steps.length - 1]?.users || 0;
    const overallConversionRate = totalEntered > 0 ? (totalCompleted / totalEntered) * 100 : 0;

    return {
      steps,
      totalEntered,
      totalCompleted,
      overallConversionRate: Math.round(overallConversionRate * 100) / 100,
    };
  }, []);

  // 🔄 REFRESH DE DADOS
  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [funnel, steps] = await Promise.all([
        fetchFunnelMetrics(),
        fetchStepMetrics(),
      ]);

      setFunnelMetrics(funnel);
      setStepMetrics(steps);

      if (steps.length > 0) {
        const funnelData = calculateConversionFunnel(steps);
        setConversionFunnel(funnelData);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao buscar analytics');
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [fetchFunnelMetrics, fetchStepMetrics, calculateConversionFunnel]);

  // 🎯 INICIALIZAÇÃO
  useEffect(() => {
    refresh();
  }, [refresh]);

  // 🔄 AUTO-REFRESH
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refresh]);

  return {
    funnelMetrics,
    stepMetrics,
    conversionFunnel,
    loading,
    error,
    refresh,
  };
}
