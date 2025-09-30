/**
 * Bridge de compatibilidade para substituir usos do antigo analyticsEngine
 * minimizando refactors imediatos. Converte chamadas principais em eventos unificados.
 */
import { unifiedEventTracker } from '@/analytics/UnifiedEventTracker';
import { unifiedAnalyticsEngine } from '@/analytics/UnifiedAnalyticsEngine';

// API superficial replicando subset usado em código legado
export const legacyAnalyticsEngineBridge = {
  trackEvent(evt: { type: string; funnelId: string; userId?: string; sessionId?: string; stepId?: string; properties?: any; metadata?: any; }) {
    unifiedEventTracker.track({
      type: mapLegacyType(evt.type),
      funnelId: evt.funnelId,
      sessionId: evt.sessionId || generateSessionId(),
      userId: evt.userId,
      stepId: evt.stepId,
      payload: evt.properties,
      context: evt.metadata
    });
  },
  trackQuizStart(funnelId: string, userId?: string) {
    const sessionId = generateSessionId();
    unifiedEventTracker.track({ type: 'session_start', funnelId, sessionId, userId });
    unifiedEventTracker.track({ type: 'quiz_started', funnelId, sessionId, userId });
    return sessionId;
  },
  trackQuizCompletion(funnelId: string, result: any, userId?: string) {
    const sessionId = generateSessionId();
    unifiedEventTracker.track({ type: 'quiz_completed', funnelId, sessionId, userId, payload: result });
    unifiedEventTracker.track({ type: 'conversion', funnelId, sessionId, userId, payload: { result } });
    unifiedEventTracker.track({ type: 'session_end', funnelId, sessionId, userId });
  },
  async getFunnelMetrics(funnelId: string, range: any) {
    return unifiedAnalyticsEngine.getFunnelSummary(funnelId, range);
  }
};

function mapLegacyType(t: string): any {
  switch (t) {
    case 'funnel_started': return 'quiz_started';
    case 'question_answered': return 'question_answered';
    case 'conversion_completed': return 'conversion';
    default: return 'editor_action';
  }
}

function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
}

export default legacyAnalyticsEngineBridge;
