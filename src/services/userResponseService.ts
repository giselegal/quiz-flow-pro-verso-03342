// Real Supabase User Response Service (com modo offline)
import { supabase } from '@/integrations/supabase/client';

const OFFLINE = import.meta.env.VITE_DISABLE_SUPABASE === 'true';
const isBrowser = typeof window !== 'undefined';

function saveLocal<T>(key: string, value: T) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function readLocal<T = any>(key: string): T | null {
  if (!isBrowser) return null;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
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
  async createQuizUser(userData: {
    sessionId: string;
    name?: string;
    email?: string;
  }): Promise<QuizUser> {
    if (OFFLINE) {
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
    try {
      console.log('📝 Saving response to Supabase:', response);

      // Mapear step para número
      const stepNumber = parseInt(response.step.replace(/\D/g, '')) || 1;

      const { data, error } = await supabase
        .from('quiz_step_responses')
        .insert({
          session_id: response.sessionId,
          step_number: stepNumber,
          component_id: response.data.componentId || response.data.fieldName || 'unknown',
          component_type: response.data.componentType || 'form-input',
          response_data: {
            originalData: response.data,
            timestamp: response.timestamp,
            step: response.step,
          },
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

      localStorage.setItem(
        `quiz_response_${fallbackResponse.id}`,
        JSON.stringify(fallbackResponse)
      );
      console.log('📦 Saved response to localStorage as fallback');
      return fallbackResponse;
    }
  },

  async getResponse(componentId: string): Promise<string> {
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
        return '';
      }
      // Primeiro tentar buscar pela session_id ativa e component_id
      const sessionId = localStorage.getItem('quiz_session_id') || '';

      if (sessionId) {
        const { data, error } = await supabase
          .from('quiz_step_responses')
          .select('*')
          .eq('session_id', sessionId)
          .eq('component_id', componentId)
          .order('responded_at', { ascending: false })
          .limit(1)
          .single();

        if (!error && data) {
          return (
            (data as any)?.response_data?.originalData?.name ||
            (data as any)?.response_data?.value ||
            JSON.stringify((data as any)?.response_data) ||
            ''
          );
        }
      }

      // Fallback to localStorage
      const stored = localStorage.getItem(`quiz_response_${componentId}`);
      return stored ? JSON.parse(stored).data : '';
    } catch (error) {
      console.error('❌ Failed to get response:', error);
      // Fallback to localStorage
      const stored = localStorage.getItem(`quiz_response_${componentId}`);
      return stored ? JSON.parse(stored).data : '';
    }
  },

  async getResponses(userId: string): Promise<UserResponse[]> {
    try {
      if (OFFLINE) {
        // Coletar todas respostas do usuário em localStorage
        const out: UserResponse[] = [];
        if (!isBrowser) return out;
        Object.keys(localStorage)
          .filter(k => k.startsWith('quiz_response_'))
          .forEach(k => {
            try {
              const val = JSON.parse(localStorage.getItem(k) || 'null');
              if (val && (val.sessionId === userId || val.userId === userId)) {
                out.push(val);
              }
            } catch {}
          });
        return out;
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
        data: (item as any).response_data || item.answer_text || item.answer_value || '',
        timestamp: item.responded_at,
        created_at: new Date(item.responded_at),
      }));
    } catch (error) {
      console.error('❌ Failed to get responses:', error);
      return [];
    }
  },

  saveStepResponse(stepId: string, response: any): void {
    console.log('💾 Saving step response locally:', stepId, response);
    localStorage.setItem(`quiz_step_${stepId}`, JSON.stringify(response));
  },

  saveUserName(userId: string, name: string): void {
    console.log('👤 Saving user name:', userId, name);
    localStorage.setItem(`quiz_user_name_${userId}`, name);
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
