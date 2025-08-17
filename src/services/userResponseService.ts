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
        .insert([{
          session_id: userData.sessionId,
          name: userData.name,
          email: userData.email,
        }])
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
      
      // Mapear step para número
      const stepNumber = parseInt(response.step.replace(/\D/g, '')) || 1;
      
      const { data, error } = await supabase
        .from('quiz_step_responses')
        .insert({
          session_id: response.sessionId,
          step_number: stepNumber,
          component_id: response.data.componentId || 'unknown',
          component_type: response.data.componentType || 'form-input',
          response_data: {
            originalData: response.data,
            timestamp: response.timestamp,
            step: response.step
          }
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
      
      localStorage.setItem(`quiz_response_${fallbackResponse.id}`, JSON.stringify(fallbackResponse));
      console.log('📦 Saved response to localStorage as fallback');
      return fallbackResponse;
    }
  },

  async getResponse(id: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('quiz_step_responses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return (data as any)?.response_data?.value || JSON.stringify((data as any)?.response_data) || '';
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
      const { error } = await supabase
        .from('quiz_step_responses')
        .delete()
        .eq('id', id);

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
