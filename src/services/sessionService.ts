import { quizSupabaseService } from '@/services/quizSupabaseService';
import { isUUID } from '@/core/utils/id';

const isBrowser = typeof window !== 'undefined';
const OFFLINE = import.meta.env.VITE_DISABLE_SUPABASE === 'true';

export const sessionService = {
  getSessionId(): string | null {
    if (!isBrowser) return null;
    return localStorage.getItem('quiz_session_id');
  },

  isUUIDSession(): boolean {
  return isUUID(this.getSessionId() || undefined);
  },

  ensureLocalSessionId(): string {
    if (!isBrowser) return 'session_local';
    const current = localStorage.getItem('quiz_session_id');
    if (current) return current;
    const localId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem('quiz_session_id', localId);
    localStorage.setItem('quiz_session_is_uuid', 'false');
    return localId;
  },

  setUUIDSessionId(uuid: string) {
    if (!isBrowser) return;
    localStorage.setItem('quiz_session_id', uuid);
  localStorage.setItem('quiz_session_is_uuid', String(isUUID(uuid)));
  },

  async startQuizSession(params: {
    name?: string;
    email?: string;
    quizId?: string;
    totalSteps?: number;
    maxScore?: number;
  }) {
    // Se offline, apenas garante um ID local
    if (OFFLINE) {
      const localId = this.ensureLocalSessionId();
      return { success: true, sessionId: localId, userId: 'local-user' } as const;
    }

    try {
      // Se quizId não for UUID, não tente criar sessão no Supabase para evitar FK inválida
  const funnelId = params.quizId;
  const quizIdIsUUID = isUUID(funnelId || undefined);

      if (!quizIdIsUUID) {
        const localId = this.ensureLocalSessionId();
        return { success: true, sessionId: localId, userId: 'local-user' } as const;
      }

      // Criar usuário
      const user = await quizSupabaseService.createQuizUser({
        name: params.name,
        email: params.email,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        utmSource: isBrowser
          ? new URLSearchParams(window.location.search).get('utm_source') || undefined
          : undefined,
        utmMedium: isBrowser
          ? new URLSearchParams(window.location.search).get('utm_medium') || undefined
          : undefined,
        utmCampaign: isBrowser
          ? new URLSearchParams(window.location.search).get('utm_campaign') || undefined
          : undefined,
      });

      // Criar sessão
      const session = await quizSupabaseService.createQuizSession({
        funnelId: funnelId!,
        quizUserId: user.id,
        totalSteps: params.totalSteps,
        maxScore: params.maxScore,
      });

      // Persistir UUID
      this.setUUIDSessionId(session.id);

      // Evento global opcional
      if (isBrowser) {
        try {
          const EVENTS = (require('@/core/constants/events') as any).default;
          window.dispatchEvent(
            new CustomEvent(EVENTS.QUIZ_SESSION_STARTED, {
              detail: { sessionId: session.id, userId: user.id },
            })
          );
        } catch { }
      }

      return { success: true, sessionId: session.id, userId: user.id } as const;
    } catch (error) {
      console.error('Erro ao iniciar sessão do quiz:', error);
      // fallback local
      const localId = this.ensureLocalSessionId();
      return { success: false, sessionId: localId } as const;
    }
  },
};

export default sessionService;
