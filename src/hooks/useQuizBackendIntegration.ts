/**
 * 🎯 HOOK DE INTEGRAÇÃO BACKEND COMPLETA - QUIZ FLOW
 * 
 * Conecta completamente o quiz com:
 * - Edge Functions (monitoring, AI, backup)
 * - Supabase analytics
 * - Real-time monitoring
 * - AI optimization em tempo real
 */

import { useEffect, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/customClient';
import { useUnifiedQuizState } from './useUnifiedQuizState';

interface QuizBackendMetrics {
  sessionId?: string;
  totalResponses: number;
  completionRate: number;
  averageTimePerStep: number;
  dropOffSteps: number[];
  lastActivity: string;
}

interface AIOptimizationSuggestion {
  stepNumber: number;
  type: 'question_text' | 'options_order' | 'ui_improvement';
  suggestion: string;
  expectedImprovement: number;
  priority: 'high' | 'medium' | 'low';
}

export const useQuizBackendIntegration = (funnelId?: string) => {
  const unifiedState = useUnifiedQuizState();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [metrics, setMetrics] = useState<QuizBackendMetrics | null>(null);
  const [aiSuggestions, setAISuggestions] = useState<AIOptimizationSuggestion[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // 🎯 FASE 1: CRIAR/CONECTAR SESSÃO DO QUIZ
  const initializeSession = useCallback(async () => {
    if (!funnelId) return;

    try {
      const { data: session, error } = await supabase
        .from('quiz_sessions')
        .insert({
          funnel_id: funnelId,
          quiz_user_id: crypto.randomUUID(),
          status: 'started',
          current_step: unifiedState.metadata.currentStep,
          total_steps: 21,
        })
        .select()
        .single();

      if (error) throw error;

      setSessionId(session.id);
      setIsBackendConnected(true);

      console.log('🎯 Quiz Backend: Session created', session.id);
      return session.id;
    } catch (error) {
      console.error('❌ Quiz Backend: Session creation failed', error);
      return null;
    }
  }, [funnelId, unifiedState.metadata.currentStep]);

  // 🎯 FASE 2: MONITORAMENTO EM TEMPO REAL
  const startRealtimeMonitoring = useCallback(async () => {
    if (!sessionId) return;

    try {
      setIsMonitoring(true);

      // Chamar security-monitor para rastrear saúde da sessão
      const { data, error } = await supabase.functions.invoke('security-monitor', {
        body: {
          action: 'monitor_quiz_session',
          sessionId,
          funnelId,
          currentStep: unifiedState.metadata.currentStep,
          totalResponses: Object.keys(unifiedState.selections).length,
        },
      });

      if (error) throw error;

      console.log('🔍 Quiz Monitoring: Active', data);
    } catch (error) {
      console.error('❌ Quiz Monitoring: Failed', error);
      setIsMonitoring(false);
    }
  }, [sessionId, funnelId, unifiedState]);

  // 🎯 FASE 3: SALVAMENTO AUTOMÁTICO DE RESPOSTAS
  const saveStepResponse = useCallback(async (
    stepNumber: number,
    questionId: string,
    response: any
  ) => {
    if (!sessionId) return;

    try {
      const { error } = await supabase
        .from('quiz_step_responses')
        .insert({
          session_id: sessionId,
          step_number: stepNumber,
          question_id: questionId,
          answer_value: JSON.stringify(response),
          answer_text: Array.isArray(response) ? response.join(', ') : String(response),
          response_time_ms: Date.now(),
        });

      if (error) throw error;

      // Atualizar atividade da sessão
      await supabase
        .from('quiz_sessions')
        .update({ 
          last_activity: new Date().toISOString(),
          current_step: stepNumber,
        })
        .eq('id', sessionId);

      console.log('💾 Quiz Response: Saved', { stepNumber, questionId });
    } catch (error) {
      console.error('❌ Quiz Response: Save failed', error);
    }
  }, [sessionId]);

  // 🎯 FASE 4: OBTER RECOMENDAÇÕES DE IA
  const getAIOptimizations = useCallback(async () => {
    if (!sessionId || !funnelId) return;

    try {
      const { data, error } = await supabase.functions.invoke('ai-optimization-engine', {
        body: {
          action: 'analyze_quiz_performance',
          funnelId,
          sessionId,
          currentData: {
            selections: unifiedState.selections,
            formData: unifiedState.formData,
            metadata: unifiedState.metadata,
          },
        },
      });

      if (error) throw error;

      setAISuggestions(data.suggestions || []);
      console.log('🤖 AI Optimization: Suggestions received', data.suggestions?.length);
    } catch (error) {
      console.error('❌ AI Optimization: Failed', error);
    }
  }, [sessionId, funnelId, unifiedState]);

  // 🎯 FASE 5: ANALYTICS EM TEMPO REAL
  const trackQuizEvent = useCallback(async (
    eventType: string,
    eventData?: Record<string, any>
  ) => {
    if (!sessionId || !funnelId) return;

    try {
      await supabase
        .from('quiz_analytics')
        .insert({
          funnel_id: funnelId,
          session_id: sessionId,
          event_type: eventType,
          event_data: eventData || {},
          user_id: undefined, // Public quiz
        });

      console.log('📊 Quiz Analytics: Event tracked', eventType);
    } catch (error) {
      console.error('❌ Quiz Analytics: Failed', error);
    }
  }, [sessionId, funnelId]);

  // 🎯 FASE 6: CÁLCULO DE MÉTRICAS
  const calculateMetrics = useCallback(async () => {
    if (!sessionId) return;

    try {
      const totalResponses = Object.keys(unifiedState.selections).length;
      const completionRate = (unifiedState.metadata.currentStep / 21) * 100;
      
      const startTime = new Date(unifiedState.metadata.startedAt).getTime();
      const currentTime = Date.now();
      const totalTimeMinutes = (currentTime - startTime) / 60000;
      const averageTimePerStep = totalTimeMinutes / Math.max(unifiedState.metadata.currentStep, 1);

      const newMetrics: QuizBackendMetrics = {
        sessionId,
        totalResponses,
        completionRate,
        averageTimePerStep,
        dropOffSteps: [], // TODO: Calcular baseado em analytics
        lastActivity: new Date().toISOString(),
      };

      setMetrics(newMetrics);

      // Salvar métricas no backend
      await supabase.functions.invoke('security-monitor', {
        body: {
          action: 'record_quiz_metrics',
          sessionId,
          metrics: newMetrics,
        },
      });

    } catch (error) {
      console.error('❌ Quiz Metrics: Calculation failed', error);
    }
  }, [sessionId, unifiedState]);

  // 🎯 FASE 7: FINALIZAÇÃO DO QUIZ
  const finalizeQuiz = useCallback(async (result: any) => {
    if (!sessionId) return;

    try {
      // Salvar resultado final
      const { error: resultError } = await supabase
        .from('quiz_results')
        .insert({
          session_id: sessionId,
          result_type: result.style || 'unknown',
          result_title: result.name || 'Resultado',
          result_description: result.description || '',
          result_data: result,
        });

      if (resultError) throw resultError;

      // Marcar sessão como completada
      await supabase
        .from('quiz_sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          score: result.score || 0,
        })
        .eq('id', sessionId);

      // Criar backup automático
      await supabase.functions.invoke('backup-system', {
        body: {
          action: 'backup_quiz_session',
          sessionId,
          result,
        },
      });

      await trackQuizEvent('quiz_completed', { result });
      console.log('🏁 Quiz Backend: Finalized successfully');

    } catch (error) {
      console.error('❌ Quiz Finalization: Failed', error);
    }
  }, [sessionId, trackQuizEvent]);

  // 🎯 INICIALIZAÇÃO AUTOMÁTICA
  useEffect(() => {
    if (funnelId && !sessionId && !isBackendConnected) {
      initializeSession();
    }
  }, [funnelId, sessionId, isBackendConnected, initializeSession]);

  // 🎯 MONITORAMENTO AUTOMÁTICO
  useEffect(() => {
    if (sessionId && isBackendConnected && !isMonitoring) {
      startRealtimeMonitoring();
    }
  }, [sessionId, isBackendConnected, isMonitoring, startRealtimeMonitoring]);

  // 🎯 AUTO-SAVE DE RESPOSTAS
  useEffect(() => {
    if (sessionId && unifiedState.selections) {
      const currentStep = unifiedState.metadata.currentStep;
      const stepKey = `step-${currentStep}`;
      const currentSelections = unifiedState.selections[stepKey];

      if (currentSelections && currentSelections.length > 0) {
        saveStepResponse(currentStep, stepKey, currentSelections);
      }
    }
  }, [sessionId, unifiedState.selections, unifiedState.metadata.currentStep, saveStepResponse]);

  // 🎯 ANALYTICS AUTOMÁTICO
  useEffect(() => {
    if (sessionId) {
      trackQuizEvent('step_viewed', {
        stepNumber: unifiedState.metadata.currentStep,
        timestamp: Date.now(),
      });
    }
  }, [sessionId, unifiedState.metadata.currentStep, trackQuizEvent]);

  // 🎯 MÉTRICAS AUTOMÁTICAS (A CADA 30s)
  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(calculateMetrics, 30000); // 30 segundos
    calculateMetrics(); // Executar imediatamente

    return () => clearInterval(interval);
  }, [sessionId, calculateMetrics]);

  // 🎯 AI SUGGESTIONS AUTOMÁTICAS (A CADA 2 MINUTOS)
  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(getAIOptimizations, 120000); // 2 minutos
    
    // Executar após 10 segundos da primeira inicialização
    const timeout = setTimeout(getAIOptimizations, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [sessionId, getAIOptimizations]);

  return {
    // Estado da integração
    sessionId,
    isBackendConnected,
    isMonitoring,
    metrics,
    aiSuggestions,

    // Ações manuais
    initializeSession,
    startRealtimeMonitoring,
    saveStepResponse,
    trackQuizEvent,
    getAIOptimizations,
    calculateMetrics,
    finalizeQuiz,

    // Utilitários
    getSessionStats: () => ({
      connected: isBackendConnected,
      monitoring: isMonitoring,
      responsesCount: Object.keys(unifiedState.selections).length,
      currentStep: unifiedState.metadata.currentStep,
      progress: (unifiedState.metadata.currentStep / 21) * 100,
    }),

    // Indicadores visuais
    hasActiveBackend: isBackendConnected && isMonitoring,
    needsAttention: aiSuggestions.some(s => s.priority === 'high'),
  };
};

export default useQuizBackendIntegration;