/**
 * 📊 BUSINESS METRICS TRACKING - Sprint 1
 * 
 * Sistema de rastreamento de métricas de negócio para Sentry
 * 
 * MÉTRICAS RASTREADAS:
 * ✅ Taxa de conversão (quiz completado)
 * ✅ Tempo médio de conclusão
 * ✅ Drop-off rate por step
 * ✅ Engajamento do usuário
 * ✅ Erros por funnel/step
 * 
 * @module BusinessMetrics
 */

import * as Sentry from '@sentry/react';
import { addSentryBreadcrumb, captureSentryMessage } from '@/config/sentry.config';

interface QuizSession {
  funnelId: string;
  sessionId: string;
  startTime: number;
  currentStep: number;
  totalSteps: number;
}

interface ConversionMetrics {
  funnelId: string;
  sessionId: string;
  completed: boolean;
  duration: number;
  stepsCompleted: number;
  dropOffStep?: number;
}

class BusinessMetricsTracker {
  private sessions: Map<string, QuizSession> = new Map();
  private readonly STORAGE_KEY = 'quiz_metrics_session';

  /**
   * Iniciar rastreamento de sessão
   */
  startSession(sessionId: string, funnelId: string, totalSteps: number): void {
    const session: QuizSession = {
      funnelId,
      sessionId,
      startTime: Date.now(),
      currentStep: 1,
      totalSteps,
    };

    this.sessions.set(sessionId, session);

    // Persistir no localStorage para sobreviver reloads
    try {
      localStorage.setItem(
        `${this.STORAGE_KEY}_${sessionId}`,
        JSON.stringify(session)
      );
    } catch (error) {
      console.warn('Falha ao persistir sessão:', error);
    }

    // Breadcrumb no Sentry
    addSentryBreadcrumb({
      category: 'quiz',
      message: 'Quiz session started',
      level: 'info',
      data: {
        funnelId,
        sessionId,
        totalSteps,
      },
    });

    // Tag no Sentry
    Sentry.setTag('current_funnel', funnelId);
    Sentry.setContext('quiz_session', {
      sessionId,
      funnelId,
      totalSteps,
      startTime: new Date(session.startTime).toISOString(),
    });
  }

  /**
   * Atualizar progresso do step
   */
  trackStepProgress(sessionId: string, stepNumber: number): void {
    const session = this.getSession(sessionId);
    if (!session) return;

    session.currentStep = stepNumber;
    this.sessions.set(sessionId, session);

    // Atualizar localStorage
    try {
      localStorage.setItem(
        `${this.STORAGE_KEY}_${sessionId}`,
        JSON.stringify(session)
      );
    } catch (error) {
      console.warn('Falha ao atualizar sessão:', error);
    }

    // Breadcrumb
    addSentryBreadcrumb({
      category: 'quiz',
      message: `Step ${stepNumber} reached`,
      level: 'info',
      data: {
        sessionId,
        stepNumber,
        progress: `${stepNumber}/${session.totalSteps}`,
      },
    });

    // Atualizar contexto
    Sentry.setContext('quiz_session', {
      sessionId,
      funnelId: session.funnelId,
      currentStep: stepNumber,
      totalSteps: session.totalSteps,
      progressPercent: Math.round((stepNumber / session.totalSteps) * 100),
    });
  }

  /**
   * Registrar conclusão do quiz
   */
  trackCompletion(sessionId: string): void {
    const session = this.getSession(sessionId);
    if (!session) return;

    const duration = Date.now() - session.startTime;
    const durationMinutes = Math.round(duration / 60000);

    const metrics: ConversionMetrics = {
      funnelId: session.funnelId,
      sessionId,
      completed: true,
      duration,
      stepsCompleted: session.totalSteps,
    };

    // Enviar métrica para Sentry
    captureSentryMessage('Quiz completed', 'info');

    // Transaction customizada
    Sentry.startSpan(
      {
        name: 'quiz.completion',
        op: 'conversion',
      },
      (span) => {
        span?.setData('funnel_id', session.funnelId);
        span?.setData('duration_ms', duration);
        span?.setData('duration_minutes', durationMinutes);
        span?.setData('steps_completed', session.totalSteps);
      }
    );

    // Limpar sessão
    this.endSession(sessionId);

    // Breadcrumb
    addSentryBreadcrumb({
      category: 'conversion',
      message: 'Quiz completed successfully',
      level: 'info',
      data: metrics,
    });
  }

  /**
   * Registrar abandono (drop-off)
   */
  trackDropOff(sessionId: string, dropOffStep: number, reason?: string): void {
    const session = this.getSession(sessionId);
    if (!session) return;

    const duration = Date.now() - session.startTime;

    const metrics: ConversionMetrics = {
      funnelId: session.funnelId,
      sessionId,
      completed: false,
      duration,
      stepsCompleted: dropOffStep - 1,
      dropOffStep,
    };

    // Enviar métrica para Sentry
    captureSentryMessage(`Quiz abandoned at step ${dropOffStep}`, 'warning');

    // Transaction customizada
    Sentry.startSpan(
      {
        name: 'quiz.dropoff',
        op: 'abandonment',
      },
      (span) => {
        span?.setData('funnel_id', session.funnelId);
        span?.setData('drop_off_step', dropOffStep);
        span?.setData('duration_ms', duration);
        span?.setData('reason', reason || 'unknown');
      }
    );

    // Limpar sessão
    this.endSession(sessionId);

    // Breadcrumb
    addSentryBreadcrumb({
      category: 'conversion',
      message: 'Quiz abandoned',
      level: 'warning',
      data: { ...metrics, reason },
    });
  }

  /**
   * Rastrear erro específico de step
   */
  trackStepError(sessionId: string, stepNumber: number, error: Error): void {
    const session = this.getSession(sessionId);

    Sentry.withScope((scope) => {
      scope.setContext('quiz_error', {
        sessionId,
        funnelId: session?.funnelId,
        stepNumber,
        stepName: `step-${String(stepNumber).padStart(2, '0')}`,
      });

      scope.setTag('quiz_step', String(stepNumber));
      scope.setLevel('error');

      Sentry.captureException(error);
    });

    addSentryBreadcrumb({
      category: 'error',
      message: `Error at step ${stepNumber}`,
      level: 'error',
      data: {
        sessionId,
        stepNumber,
        errorMessage: error.message,
      },
    });
  }

  /**
   * Rastrear tempo de carregamento de step
   */
  trackStepLoadTime(sessionId: string, stepNumber: number, loadTime: number): void {
    Sentry.startSpan(
      {
        name: `step.${stepNumber}.load`,
        op: 'performance',
      },
      (span) => {
        span?.setData('session_id', sessionId);
        span?.setData('step_number', stepNumber);
        span?.setData('load_time_ms', loadTime);
      }
    );

    // Alertar se load time for muito alto
    if (loadTime > 3000) {
      captureSentryMessage(
        `Slow step load: ${loadTime}ms at step ${stepNumber}`,
        'warning'
      );
    }
  }

  /**
   * Obter sessão ativa
   */
  private getSession(sessionId: string): QuizSession | null {
    let session = this.sessions.get(sessionId);

    // Tentar recuperar do localStorage se não estiver em memória
    if (!session) {
      try {
        const stored = localStorage.getItem(`${this.STORAGE_KEY}_${sessionId}`);
        if (stored) {
          session = JSON.parse(stored);
          if (session) {
            this.sessions.set(sessionId, session);
          }
        }
      } catch (error) {
        console.warn('Falha ao recuperar sessão:', error);
      }
    }

    return session || null;
  }

  /**
   * Finalizar e limpar sessão
   */
  private endSession(sessionId: string): void {
    this.sessions.delete(sessionId);

    try {
      localStorage.removeItem(`${this.STORAGE_KEY}_${sessionId}`);
    } catch (error) {
      console.warn('Falha ao limpar sessão:', error);
    }
  }

  /**
   * Limpar todas as sessões (útil para logout)
   */
  clearAllSessions(): void {
    this.sessions.clear();

    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.STORAGE_KEY)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Falha ao limpar sessões:', error);
    }
  }
}

// Export singleton
export const businessMetrics = new BusinessMetricsTracker();
