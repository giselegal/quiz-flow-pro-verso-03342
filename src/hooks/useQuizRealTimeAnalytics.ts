/**
 * 🎯 HOOK DE ANALYTICS REAL-TIME - QUIZ
 * 
 * Analytics específicos para fluxo do quiz com métricas em tempo real
 */

import { useEffect, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface QuizAnalyticsMetrics {
  // Métricas de sessão
  sessionDuration: number;
  stepsCompleted: number;
  averageTimePerStep: number;
  
  // Métricas de engajamento
  interactionRate: number;
  dropOffRate: number;
  backtrackingCount: number;
  
  // Métricas de conversão
  completionLikelihood: number;
  currentConversionFunnel: string;
  estimatedTimeToComplete: number;
  
  // Padrões comportamentais
  mostPopularAnswers: Record<string, string[]>;
  commonDropOffPoints: number[];
  fastAnswerSteps: number[];
  slowAnswerSteps: number[];
}

interface RealTimeAlert {
  type: 'warning' | 'info' | 'success' | 'error';
  message: string;
  action?: string;
  timestamp: number;
}

export const useQuizRealTimeAnalytics = (sessionId?: string, funnelId?: string) => {
  const [metrics, setMetrics] = useState<QuizAnalyticsMetrics | null>(null);
  const [alerts, setAlerts] = useState<RealTimeAlert[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [sessionStartTime] = useState(Date.now());

  // 🎯 RASTREAMENTO DE TEMPO POR STEP
  const [stepTimes, setStepTimes] = useState<Record<number, { start: number; end?: number }>>({});

  const startStepTimer = useCallback((stepNumber: number) => {
    setStepTimes(prev => ({
      ...prev,
      [stepNumber]: { start: Date.now() }
    }));
  }, []);

  const endStepTimer = useCallback((stepNumber: number) => {
    setStepTimes(prev => {
      const current = prev[stepNumber];
      if (!current) return prev;
      
      return {
        ...prev,
        [stepNumber]: { ...current, end: Date.now() }
      };
    });
  }, []);

  // 🎯 CÁLCULO DE MÉTRICAS EM TEMPO REAL
  const calculateRealTimeMetrics = useCallback((): QuizAnalyticsMetrics => {
    const now = Date.now();
    const sessionDuration = (now - sessionStartTime) / 1000; // segundos
    
    const completedSteps = Object.values(stepTimes).filter(t => t.end).length;
    const totalStepTime = Object.values(stepTimes)
      .filter(t => t.end)
      .reduce((sum, t) => sum + (t.end! - t.start), 0);
    
    const averageTimePerStep = completedSteps > 0 ? (totalStepTime / 1000) / completedSteps : 0;
    
    // Calcular taxa de interação (baseado na velocidade de resposta)
    const fastSteps = Object.values(stepTimes)
      .filter(t => t.end && (t.end - t.start) < 10000) // < 10s
      .length;
    
    const interactionRate = completedSteps > 0 ? (fastSteps / completedSteps) * 100 : 0;
    
    // Probabilidade de conclusão baseada no progresso atual
    const progressRate = completedSteps / 21;
    const timeEfficiency = averageTimePerStep > 0 ? Math.min(60 / averageTimePerStep, 1) : 0;
    const completionLikelihood = (progressRate * 0.7 + timeEfficiency * 0.3) * 100;
    
    // Tempo estimado para completar
    const remainingSteps = 21 - completedSteps;
    const estimatedTimeToComplete = remainingSteps * averageTimePerStep;
    
    return {
      sessionDuration,
      stepsCompleted: completedSteps,
      averageTimePerStep,
      interactionRate,
      dropOffRate: 0, // TODO: Calcular baseado em dados históricos
      backtrackingCount: 0, // TODO: Rastrear navegação para trás
      completionLikelihood,
      currentConversionFunnel: completionLikelihood > 70 ? 'high' : completionLikelihood > 40 ? 'medium' : 'low',
      estimatedTimeToComplete,
      mostPopularAnswers: {}, // TODO: Implementar agregação
      commonDropOffPoints: [], // TODO: Calcular pontos de abandono
      fastAnswerSteps: Object.entries(stepTimes)
        .filter(([, t]) => t.end && (t.end - t.start) < 5000)
        .map(([step]) => parseInt(step)),
      slowAnswerSteps: Object.entries(stepTimes)
        .filter(([, t]) => t.end && (t.end - t.start) > 30000)
        .map(([step]) => parseInt(step)),
    };
  }, [sessionStartTime, stepTimes]);

  // 🎯 DETECTAR PADRÕES E GERAR ALERTAS
  const generateAlerts = useCallback((metrics: QuizAnalyticsMetrics) => {
    const newAlerts: RealTimeAlert[] = [];
    
    // Alert: Tempo muito longo em um step
    if (metrics.averageTimePerStep > 60) {
      newAlerts.push({
        type: 'warning',
        message: 'Usuário está gastando muito tempo por etapa',
        action: 'Considere simplificar as perguntas',
        timestamp: Date.now(),
      });
    }
    
    // Alert: Alta probabilidade de conversão
    if (metrics.completionLikelihood > 80) {
      newAlerts.push({
        type: 'success',
        message: 'Alta probabilidade de conclusão do quiz',
        action: 'Prepare oferta personalizada',
        timestamp: Date.now(),
      });
    }
    
    // Alert: Baixa probabilidade de conversão
    if (metrics.completionLikelihood < 30 && metrics.stepsCompleted > 5) {
      newAlerts.push({
        type: 'error',
        message: 'Risco de abandono detectado',
        action: 'Ativar estratégias de retenção',
        timestamp: Date.now(),
      });
    }
    
    // Alert: Progressão muito rápida
    if (metrics.interactionRate > 90 && metrics.averageTimePerStep < 5) {
      newAlerts.push({
        type: 'warning',
        message: 'Usuário pode estar respondendo muito rapidamente',
        action: 'Verificar qualidade das respostas',
        timestamp: Date.now(),
      });
    }
    
    setAlerts(prev => [...prev.slice(-9), ...newAlerts]); // Manter apenas os últimos 10 alerts
  }, []);

  // 🎯 SALVAR ANALYTICS NO BACKEND
  const saveAnalytics = useCallback(async (metrics: QuizAnalyticsMetrics) => {
    if (!sessionId || !funnelId) return;
    
    try {
      await supabase
        .from('quiz_analytics')
        .insert({
          funnel_id: funnelId,
          session_id: sessionId,
          event_type: 'realtime_metrics',
          event_data: {
            metrics: metrics as any,
            stepTimes: Object.fromEntries(
              Object.entries(stepTimes).map(([step, times]) => [
                step, 
                times.end ? times.end - times.start : null
              ])
            ),
            timestamp: Date.now(),
          } as any,
        });
      
      console.log('📊 Real-time Analytics: Saved to backend');
    } catch (error) {
      console.error('❌ Real-time Analytics: Save failed', error);
    }
  }, [sessionId, funnelId, stepTimes]);

  // 🎯 CICLO DE ATUALIZAÇÃO (A CADA 5 SEGUNDOS)
  useEffect(() => {
    if (!isTracking) return;
    
    const interval = setInterval(() => {
      const currentMetrics = calculateRealTimeMetrics();
      setMetrics(currentMetrics);
      generateAlerts(currentMetrics);
      
      // Salvar no backend a cada 30 segundos
      const shouldSave = Math.floor(Date.now() / 1000) % 30 === 0;
      if (shouldSave) {
        saveAnalytics(currentMetrics);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isTracking, calculateRealTimeMetrics, generateAlerts, saveAnalytics]);

  // 🎯 INICIAR TRACKING AUTOMATICAMENTE
  useEffect(() => {
    if (sessionId && funnelId) {
      setIsTracking(true);
      console.log('📊 Real-time Analytics: Started tracking');
    }
  }, [sessionId, funnelId]);

  // 🎯 API DO HOOK
  return {
    // Estado
    metrics,
    alerts,
    isTracking,
    
    // Controle de tempo por step
    startStepTimer,
    endStepTimer,
    
    // Controle de tracking
    startTracking: () => setIsTracking(true),
    stopTracking: () => setIsTracking(false),
    
    // Utilitários
    clearAlerts: () => setAlerts([]),
    getStepTime: (stepNumber: number) => {
      const times = stepTimes[stepNumber];
      return times?.end ? times.end - times.start : null;
    },
    
    // Métricas instantâneas
    getCurrentMetrics: calculateRealTimeMetrics,
    
    // Indicadores para UI
    hasWarnings: alerts.some(a => a.type === 'warning' || a.type === 'error'),
    conversionHealth: metrics ? (
      metrics.completionLikelihood > 70 ? 'high' :
      metrics.completionLikelihood > 40 ? 'medium' : 'low'
    ) : 'unknown',
  };
};

export default useQuizRealTimeAnalytics;