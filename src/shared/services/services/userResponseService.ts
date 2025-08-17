// Real Supabase User Response Service
import { supabase } from '@/integrations/supabase/client';

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
    try {
      console.log('📝 Saving response to Supabase:', response);

      const { data, error } = await supabase
        .from('quiz_step_responses')
        .insert([
          {
            session_id: response.sessionId,
            step_number: parseInt(response.step.replace('step-', '')) || 1,
            question_id: response.step,
            answer_text:
              typeof response.data === 'string' ? response.data : JSON.stringify(response.data),
            answer_value:
              typeof response.data === 'object' ? JSON.stringify(response.data) : response.data,
            metadata: { timestamp: response.timestamp, userId: response.userId },
            responded_at: response.timestamp,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ Error saving response:', error);
        throw error;
      }

      console.log('✅ Response saved successfully:', data);
      return {
        id: data.id,
        userId: response.userId,
        sessionId: response.sessionId,
        step: response.step,
        data: response.data,
        timestamp: response.timestamp,
        created_at: new Date(data.responded_at),
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

  async getResponse(id: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('quiz_step_responses')
        .select('*')
        .eq('question_id', id)
        .single();

      if (error) throw error;
      return data?.answer_text || data?.answer_value || '';
    } catch (error) {
      console.error('❌ Failed to get response:', error);
      // Fallback to localStorage
      const stored = localStorage.getItem(`quiz_response_${id}`);
      return stored ? JSON.parse(stored).data : '';
    }
  },

  async getResponses(userId: string): Promise<UserResponse[]> {
    try {
      const { data, error } = await supabase
        .from('quiz_step_responses')
        .select('*')
        .eq('session_id', userId)
        .order('responded_at', { ascending: true });

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        userId: userId,
        sessionId: item.session_id,
        step: `step-${item.step_number}`,
        data: item.answer_text || item.answer_value || '',
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
