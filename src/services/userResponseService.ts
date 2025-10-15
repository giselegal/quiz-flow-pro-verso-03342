// Real Supabase User Response Service (com modo offline)
import { supabase } from '@/integrations/supabase/customClient';
import { sessionService } from '@/services/sessionService';
import { StorageService } from '@/services/core/StorageService';

const OFFLINE = import.meta.env.VITE_DISABLE_SUPABASE === 'true';
const isBrowser = typeof window !== 'undefined';

// Utilitário simples para validar UUID v1-v5
function isValidUUID(value: string | null | undefined): value is string {
  if (!value) return false;
  return /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i.test(
    value
  );
}

function saveLocal<T>(key: string, value: T) {
  if (!isBrowser) return;
  // Usa StorageService para lidar com quota e fallback para sessionStorage
  StorageService.safeSetJSON(key, value);
}

function readLocal<T = any>(key: string): T | null {
  if (!isBrowser) return null;
  return StorageService.safeGetJSON<T>(key);
}

export interface UserResponse {
  id: string;
  userId: string;
  sessionId?: string;
  step: string;
  data: any;
  timestamp: string;
  created_at: Date;
}

export interface QuizUser {
  id: string;
  session_id: string;
  name?: string;
  email?: string;
  created_at: Date;
}

export const userResponseService = {
  // Empilha respostas quando não há UUID ou offline; será esvaziado por flush
  enqueuePending(response: any) {
    if (!isBrowser) return;
    try {
      const arr = StorageService.safeGetJSON<any[]>('quiz_pending_responses') || [];
      arr.push(response);
      StorageService.safeSetJSON('quiz_pending_responses', arr);
    } catch { }
  },

  async flushPending(): Promise<{ success: boolean; sent: number; remaining: number }> {
    if (OFFLINE) return { success: true, sent: 0, remaining: 0 };
    const sessionId = sessionService.getSessionId();
    if (!isValidUUID(sessionId || ''))
      return {
        success: false,
        sent: 0,
        remaining: (StorageService.safeGetJSON('quiz_pending_responses') as any[])
          .length,
      };

    const pending: any[] = StorageService.safeGetJSON<any[]>('quiz_pending_responses') || [];
    if (!pending.length) return { success: true, sent: 0, remaining: 0 };

    let sent = 0;
    const remaining: any[] = [];
    for (const item of pending) {
      try {
        await this.saveResponse({ ...item, sessionId });
        sent++;
      } catch (e) {
        remaining.push(item);
      }
    }
    StorageService.safeSetJSON('quiz_pending_responses', remaining);
    return { success: remaining.length === 0, sent, remaining: remaining.length };
  },
  async createQuizUser(userData: {
    sessionId: string;
    name?: string;
    email?: string;
  }): Promise<QuizUser> {
    if (OFFLINE || !isValidUUID(userData.sessionId)) {
      const mock: QuizUser = {
        id: `local_user_${userData.sessionId}`,
        session_id: userData.sessionId,
        name: userData.name,
        email: userData.email,
        created_at: new Date(),
      };
      saveLocal(`quiz_user_${userData.sessionId}`, mock);
      return mock;
    }
    try {
      console.log('📝 Creating quiz user in Supabase:', userData);

      const { data, error } = await supabase
        .from('quiz_users')
        .insert([
          {
            session_id: userData.sessionId,
            name: userData.name,
            email: userData.email,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating quiz user:', error);
        throw error;
      }

      console.log('✅ Quiz user created successfully:', data);
      return {
        id: data.id,
        session_id: data.session_id,
        name: data.name || undefined,
        email: data.email || undefined,
        created_at: new Date(data.created_at),
      };
    } catch (error) {
      console.error('❌ Failed to create quiz user:', error);
      throw error;
    }
  },

  async saveResponse(response: {
    userId: string;
    sessionId: string;
    step: string;
    data: any;
    timestamp: string;
  }): Promise<UserResponse> {
    if (OFFLINE) {
      const fallbackResponse: UserResponse = {
        id: `response_${Date.now()}`,
        userId: response.userId,
        sessionId: response.sessionId,
        step: response.step,
        data: response.data,
        timestamp: response.timestamp,
        created_at: new Date(),
      };
      // Indexar também por componentId para leitura simples
      const componentId =
        (response.data && (response.data.componentId || response.data.fieldName)) || 'unknown';
      saveLocal(`quiz_response_${componentId}`, fallbackResponse);
      saveLocal(`quiz_response_${fallbackResponse.id}`, fallbackResponse);
      return fallbackResponse;
    }
    // Se o sessionId não for um UUID válido (ex.: "session_..."), não tente salvar no Supabase
    if (!isValidUUID(response.sessionId)) {
      console.warn(
        '⚠️ Supabase disabled for this response: session_id is not a valid UUID, using local fallback.',
        response.sessionId
      );
      const fallbackResponse: UserResponse = {
        id: `response_${Date.now()}`,
        userId: response.userId,
        sessionId: response.sessionId,
        step: response.step,
        data: response.data,
        timestamp: response.timestamp,
        created_at: new Date(),
      };
      try {
        const componentKey =
          (response.data && (response.data.componentId || response.data.fieldName)) || undefined;
        if (componentKey) {
          StorageService.safeSetJSON(`quiz_response_${componentKey}`, fallbackResponse);
        }
        StorageService.safeSetJSON(`quiz_response_${fallbackResponse.id}`, fallbackResponse);
        // Enfileirar para tentar enviar quando obtivermos uma sessão UUID
        this.enqueuePending(response);
      } catch { }
      return fallbackResponse;
    }
    try {
      console.log('📝 Saving response to Supabase:', response);

      // Mapear step para número
      const stepNumber = parseInt(response.step.replace(/\D/g, '')) || 1;

      // Alinhar com o schema real da tabela quiz_step_responses:
      // Campos disponíveis: session_id, step_number, question_id, question_text,
      // answer_value, answer_text, score_earned, response_time_ms, metadata, responded_at
      const questionId =
        (response.data && (response.data.componentId || response.data.fieldName)) || 'unknown';
      const answerValue =
        (response.data && (response.data.value || response.data.name)) || undefined;
      const answerText =
        (typeof response.data === 'string' ? response.data : response.data?.text) || undefined;

      const { data, error } = await supabase
        .from('quiz_step_responses')
        .insert({
          session_id: response.sessionId,
          step_number: stepNumber,
          question_id: questionId,
          question_text: (response.data && response.data.label) || undefined,
          answer_value: typeof answerValue === 'string' ? answerValue : JSON.stringify(answerValue),
          answer_text: answerText,
          metadata: {
            originalData: response.data,
            timestamp: response.timestamp,
            step: response.step,
          } as any,
        } as any)
        .select();

      if (error) {
        console.error('❌ Error saving response:', error);
        throw error;
      }

      console.log('✅ Response saved successfully:', data);

      const responseRecord = Array.isArray(data) ? data[0] : data;

      return {
        id: responseRecord.id,
        userId: response.userId,
        sessionId: response.sessionId,
        step: response.step,
        data: response.data,
        timestamp: response.timestamp,
        created_at: new Date(responseRecord.responded_at),
      };
    } catch (error) {
      console.error('❌ Failed to save response:', error);
      // Fallback to local storage if Supabase fails
      const fallbackResponse: UserResponse = {
        id: `response_${Date.now()}`,
        userId: response.userId,
        sessionId: response.sessionId,
        step: response.step,
        data: response.data,
        timestamp: response.timestamp,
        created_at: new Date(),
      };
      // Salvar indexado pelo id gerado (debug) e pelo componentId/fieldName para leitura por getResponse
      try {
        StorageService.safeSetJSON(
          `quiz_response_${fallbackResponse.id}`,
          fallbackResponse
        );
        const componentKey =
          (response.data && (response.data.componentId || response.data.fieldName)) || undefined;
        if (componentKey) {
          StorageService.safeSetJSON(`quiz_response_${componentKey}`, fallbackResponse);
        }
      } catch { }
      console.log('📦 Saved response to localStorage as fallback');
      return fallbackResponse;
    }
  },

  async getResponse(componentId: string, funnelId?: string): Promise<string> {
    try {
      if (OFFLINE) {
        const stored = readLocal<any>(`quiz_response_${componentId}`);
        if (stored) {
          const data = stored.data || {};
          return (
            data?.name ||
            data?.value ||
            (typeof data === 'string' ? data : JSON.stringify(data)) ||
            ''
          );
        }
        // Fallback adicional: salvar-resposta-por-etapa com funnelId
        const stepKey = funnelId ? `quiz_step_${funnelId}_${componentId}` : `quiz_step_${componentId}`;
        const stepStored = readLocal<any>(stepKey);
        if (stepStored) {
          const d = stepStored;
          return (
            d?.name || d?.value || (typeof d === 'string' ? d : JSON.stringify(d)) || ''
          );
        }
        // Fallback final para campos de nome
        if (componentId.includes('name')) {
          return (
            StorageService.safeGetString('userName') ||
            StorageService.safeGetString('quizUserName') ||
            ''
          );
        }
        return '';
      }
      // Primeiro tentar buscar pela session_id ativa e question_id (componentId mapeia para question_id)
      const sessionId = sessionService.getSessionId() || '';

      // Evitar 400 no PostgREST: não filtrar por session_id se não for UUID válido
      if (sessionId && isValidUUID(sessionId)) {
        const { data, error } = await supabase
          .from('quiz_step_responses')
          .select('*')
          .eq('session_id', sessionId)
          .eq('question_id', componentId)
          .order('responded_at', { ascending: false })
          .limit(1)
          .single();

        if (!error && data) {
          return (
            (data as any)?.answer_value ||
            (data as any)?.answer_text ||
            (data as any)?.metadata?.originalData?.name ||
            (data as any)?.metadata?.value ||
            JSON.stringify((data as any)?.metadata) ||
            ''
          );
        }
      }

      // Fallback para armazenamento local: garantir retorno como string
      const stored = StorageService.safeGetJSON<any>(`quiz_response_${componentId}`);
      if (stored) {
        const data = stored.data ?? stored;
        return (
          data?.name ??
          data?.value ??
          (typeof data === 'string' ? data : JSON.stringify(data)) ??
          ''
        );
      }
      // Fallback adicional: resposta simples por etapa
      const stepStored = StorageService.safeGetJSON<any>(`quiz_step_${componentId}`);
      if (stepStored) {
        return (
          stepStored?.name ??
          stepStored?.value ??
          (typeof stepStored === 'string' ? stepStored : JSON.stringify(stepStored)) ??
          ''
        );
      }
      // Fallback final para campos de nome
      if (componentId.includes('name')) {
        return (
          StorageService.safeGetString('userName') ||
          StorageService.safeGetString('quizUserName') ||
          ''
        );
      }
      return '';
    } catch (error) {
      console.error('❌ Failed to get response:', error);
      // Fallback
      const stored = StorageService.safeGetJSON<any>(`quiz_response_${componentId}`);
      if (stored) {
        const data = stored.data ?? stored;
        return (
          data?.name ??
          data?.value ??
          (typeof data === 'string' ? data : JSON.stringify(data)) ??
          ''
        );
      }
      const stepStored = StorageService.safeGetJSON<any>(`quiz_step_${componentId}`);
      if (stepStored) {
        return (
          stepStored?.name ??
          stepStored?.value ??
          (typeof stepStored === 'string' ? stepStored : JSON.stringify(stepStored)) ??
          ''
        );
      }
      if (componentId.includes('name')) {
        return (
          StorageService.safeGetString('userName') ||
          StorageService.safeGetString('quizUserName') ||
          ''
        );
      }
      return '';
    }
  },

  async getResponses(userId: string): Promise<UserResponse[]> {
    try {
      if (OFFLINE) {
        // Coletar todas respostas do usuário em localStorage
        const out: UserResponse[] = [];
        if (!isBrowser) return out;
        Object.keys(localStorage)
          .concat(Object.keys(sessionStorage))
          .filter(k => k.startsWith('quiz_response_'))
          .forEach(k => {
            try {
              const val = StorageService.safeGetJSON<any>(k);
              if (val && (val.sessionId === userId || val.userId === userId)) {
                out.push(val);
              }
            } catch { }
          });
        return out;
      }
      // Evitar erro 400 por filtro inválido: se não for UUID, retornar vazio
      if (!isValidUUID(userId)) {
        console.warn('⚠️ Skipping Supabase getResponses: session_id is not a valid UUID');
        return [];
      }
      const { data, error } = await supabase
        .from('quiz_step_responses')
        .select('*')
        .eq('session_id', userId)
        .order('responded_at', { ascending: true });

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        userId: userId,
        sessionId: (item as any).session_id,
        step: `step-${item.step_number}`,
        data: (item as any).metadata || item.answer_text || item.answer_value || '',
        timestamp: item.responded_at,
        created_at: new Date(item.responded_at),
      }));
    } catch (error) {
      console.error('❌ Failed to get responses:', error);
      return [];
    }
  },

  saveStepResponse(stepId: string, response: any, funnelId?: string): void {
    // 🎯 USAR FUNNEL ID PARA CHAVE ÚNICA
    const storageKey = funnelId ? `quiz_step_${funnelId}_${stepId}` : `quiz_step_${stepId}`;
    console.log('💾 Saving step response locally with funnelId:', storageKey, response);
    StorageService.safeSetJSON(storageKey, response);
  },

  saveUserName(userId: string, name: string): void {
    console.log('👤 Saving user name:', userId, name);
    StorageService.safeSetString(`quiz_user_name_${userId}`, name);
  },

  async deleteResponse(id: string): Promise<boolean> {
    try {
      if (OFFLINE) {
        if (isBrowser) {
          // Remover tanto por id quanto por indexação de componentId (se existir)
          localStorage.removeItem(`quiz_response_${id}`);
        }
        return true;
      }
      const { error } = await supabase.from('quiz_step_responses').delete().eq('id', id);

      if (error) throw error;
      console.log('🗑️ Response deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to delete response:', error);
      return false;
    }
  },
};

export default userResponseService;

// Auto-flush quando sessão UUID é iniciada ou quando voltar online
if (typeof window !== 'undefined') {
  window.addEventListener('quiz-session-started', () => {
    setTimeout(() => {
      userResponseService.flushPending().catch(() => { });
    }, 0);
  });
  window.addEventListener('online', () => {
    setTimeout(() => {
      userResponseService.flushPending().catch(() => { });
    }, 0);
  });
}
