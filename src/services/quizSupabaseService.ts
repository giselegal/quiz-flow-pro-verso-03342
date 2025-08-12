import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Type definitions
type QuizUser = Database['public']['Tables']['quiz_users']['Row'];
type QuizSession = Database['public']['Tables']['quiz_sessions']['Row'];
type QuizStepResponse = Database['public']['Tables']['quiz_step_responses']['Row'];
type QuizResult = Database['public']['Tables']['quiz_results']['Row'];
type QuizAnalytics = Database['public']['Tables']['quiz_analytics']['Row'];
type QuizConversion = Database['public']['Tables']['quiz_conversions']['Row'];

type InsertQuizUser = Database['public']['Tables']['quiz_users']['Insert'];
type InsertQuizSession = Database['public']['Tables']['quiz_sessions']['Insert'];
type InsertQuizStepResponse = Database['public']['Tables']['quiz_step_responses']['Insert'];
type InsertQuizResult = Database['public']['Tables']['quiz_results']['Insert'];
type InsertQuizAnalytics = Database['public']['Tables']['quiz_analytics']['Insert'];
type InsertQuizConversion = Database['public']['Tables']['quiz_conversions']['Insert'];

export interface QuizParticipant {
  id: string;
  sessionId: string;
  email?: string;
  name?: string;
  ipAddress?: string;
  userAgent?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  createdAt: Date;
}

export interface QuizSessionData {
  id: string;
  funnelId: string;
  userId: string;
  status: 'started' | 'in_progress' | 'completed' | 'abandoned';
  currentStep: number;
  totalSteps: number;
  score: number;
  maxScore: number;
  startedAt: Date;
  completedAt?: Date;
  lastActivity: Date;
  metadata?: any;
}

export interface QuizResponse {
  id: string;
  sessionId: string;
  stepNumber: number;
  questionId: string;
  questionText?: string;
  answerValue?: string;
  answerText?: string;
  scoreEarned: number;
  responseTimeMs?: number;
  respondedAt: Date;
  metadata?: any;
}

const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const quizSupabaseService = {
  // ========== USER MANAGEMENT ==========
  async createQuizUser(userData: {
    sessionId?: string;
    email?: string;
    name?: string;
    ipAddress?: string;
    userAgent?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  }): Promise<QuizParticipant> {
    try {
      const sessionId = userData.sessionId || generateSessionId();

      const insertData: InsertQuizUser = {
        session_id: sessionId,
        email: userData.email,
        name: userData.name,
        ip_address: userData.ipAddress,
        user_agent: userData.userAgent,
        utm_source: userData.utmSource,
        utm_medium: userData.utmMedium,
        utm_campaign: userData.utmCampaign,
      };

      const { data, error } = await supabase
        .from('quiz_users')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        sessionId: data.session_id,
        email: data.email || undefined,
        name: data.name || undefined,
        ipAddress: data.ip_address?.toString(),
        userAgent: data.user_agent || undefined,
        utmSource: data.utm_source || undefined,
        utmMedium: data.utm_medium || undefined,
        utmCampaign: data.utm_campaign || undefined,
        createdAt: new Date(data.created_at!),
      };
    } catch (error) {
      console.error('Erro ao criar usuário de quiz:', error);
      throw error;
    }
  },

  async getQuizUserBySessionId(sessionId: string): Promise<QuizParticipant | null> {
    try {
      const { data, error } = await supabase
        .from('quiz_users')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;

      return {
        id: data.id,
        sessionId: data.session_id,
        email: data.email || undefined,
        name: data.name || undefined,
        ipAddress: data.ip_address?.toString(),
        userAgent: data.user_agent || undefined,
        utmSource: data.utm_source || undefined,
        utmMedium: data.utm_medium || undefined,
        utmCampaign: data.utm_campaign || undefined,
        createdAt: new Date(data.created_at!),
      };
    } catch (error) {
      console.error('Erro ao buscar usuário por session ID:', error);
      return null;
    }
  },

  // ========== SESSION MANAGEMENT ==========
  async createQuizSession(sessionData: {
    funnelId: string;
    quizUserId: string;
    totalSteps?: number;
    maxScore?: number;
    metadata?: any;
  }): Promise<QuizSessionData> {
    try {
      const insertData: InsertQuizSession = {
        funnel_id: sessionData.funnelId,
        quiz_user_id: sessionData.quizUserId,
        status: 'started',
        current_step: 0,
        total_steps: sessionData.totalSteps || 0,
        score: 0,
        max_score: sessionData.maxScore || 0,
        metadata: sessionData.metadata || {},
      };

      const { data, error } = await supabase
        .from('quiz_sessions')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        funnelId: data.funnel_id,
        userId: data.quiz_user_id,
        status: data.status as any,
        currentStep: data.current_step || 0,
        totalSteps: data.total_steps || 0,
        score: data.score || 0,
        maxScore: data.max_score || 0,
        startedAt: new Date(data.started_at!),
        completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
        lastActivity: new Date(data.last_activity!),
        metadata: data.metadata,
      };
    } catch (error) {
      console.error('Erro ao criar sessão de quiz:', error);
      throw error;
    }
  },

  async updateQuizSession(
    sessionId: string,
    updates: {
      status?: 'started' | 'in_progress' | 'completed' | 'abandoned';
      currentStep?: number;
      score?: number;
      completedAt?: Date;
      metadata?: any;
    }
  ): Promise<boolean> {
    try {
      const updateData: any = {};

      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.currentStep !== undefined) updateData.current_step = updates.currentStep;
      if (updates.score !== undefined) updateData.score = updates.score;
      if (updates.completedAt !== undefined)
        updateData.completed_at = updates.completedAt.toISOString();
      if (updates.metadata !== undefined) updateData.metadata = updates.metadata;

      const { error } = await supabase.from('quiz_sessions').update(updateData).eq('id', sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao atualizar sessão:', error);
      return false;
    }
  },

  async getQuizSession(sessionId: string): Promise<QuizSessionData | null> {
    try {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;

      return {
        id: data.id,
        funnelId: data.funnel_id,
        userId: data.quiz_user_id,
        status: data.status as any,
        currentStep: data.current_step || 0,
        totalSteps: data.total_steps || 0,
        score: data.score || 0,
        maxScore: data.max_score || 0,
        startedAt: new Date(data.started_at!),
        completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
        lastActivity: new Date(data.last_activity!),
        metadata: data.metadata,
      };
    } catch (error) {
      console.error('Erro ao buscar sessão:', error);
      return null;
    }
  },

  // ========== RESPONSE MANAGEMENT ==========
  async saveQuizResponse(responseData: {
    sessionId: string;
    stepNumber: number;
    questionId: string;
    questionText?: string;
    answerValue?: string;
    answerText?: string;
    scoreEarned?: number;
    responseTimeMs?: number;
    metadata?: any;
  }): Promise<QuizResponse> {
    try {
      const insertData: InsertQuizStepResponse = {
        session_id: responseData.sessionId,
        step_number: responseData.stepNumber,
        question_id: responseData.questionId,
        question_text: responseData.questionText,
        answer_value: responseData.answerValue,
        answer_text: responseData.answerText,
        score_earned: responseData.scoreEarned || 0,
        response_time_ms: responseData.responseTimeMs,
        metadata: responseData.metadata || {},
      };

      const { data, error } = await supabase
        .from('quiz_step_responses')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        sessionId: data.session_id,
        stepNumber: data.step_number,
        questionId: data.question_id,
        questionText: data.question_text || undefined,
        answerValue: data.answer_value || undefined,
        answerText: data.answer_text || undefined,
        scoreEarned: data.score_earned || 0,
        responseTimeMs: data.response_time_ms || undefined,
        respondedAt: new Date(data.responded_at!),
        metadata: data.metadata,
      };
    } catch (error) {
      console.error('Erro ao salvar resposta:', error);
      throw error;
    }
  },

  async getQuizResponses(sessionId: string): Promise<QuizResponse[]> {
    try {
      const { data, error } = await supabase
        .from('quiz_step_responses')
        .select('*')
        .eq('session_id', sessionId)
        .order('step_number');

      if (error) throw error;

      return (data || []).map(response => ({
        id: response.id,
        sessionId: response.session_id,
        stepNumber: response.step_number,
        questionId: response.question_id,
        questionText: response.question_text || undefined,
        answerValue: response.answer_value || undefined,
        answerText: response.answer_text || undefined,
        scoreEarned: response.score_earned || 0,
        responseTimeMs: response.response_time_ms || undefined,
        respondedAt: new Date(response.responded_at!),
        metadata: response.metadata,
      }));
    } catch (error) {
      console.error('Erro ao buscar respostas:', error);
      return [];
    }
  },

  // ========== RESULTS MANAGEMENT ==========
  async saveQuizResult(resultData: {
    sessionId: string;
    resultType: string;
    resultTitle?: string;
    resultDescription?: string;
    resultData?: any;
    recommendation?: string;
    nextSteps?: any[];
  }): Promise<string> {
    try {
      const insertData: InsertQuizResult = {
        session_id: resultData.sessionId,
        result_type: resultData.resultType,
        result_title: resultData.resultTitle,
        result_description: resultData.resultDescription,
        result_data: resultData.resultData || {},
        recommendation: resultData.recommendation,
        next_steps: resultData.nextSteps || [],
      };

      const { data, error } = await supabase
        .from('quiz_results')
        .insert([insertData])
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Erro ao salvar resultado:', error);
      throw error;
    }
  },

  async getQuizResult(resultId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('id', resultId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar resultado:', error);
      return null;
    }
  },

  // ========== ANALYTICS ==========
  async trackEvent(eventData: {
    funnelId: string;
    eventType: string;
    eventData?: any;
    sessionId?: string;
    userId?: string;
  }): Promise<void> {
    try {
      const insertData: InsertQuizAnalytics = {
        funnel_id: eventData.funnelId,
        event_type: eventData.eventType,
        event_data: eventData.eventData || {},
        session_id: eventData.sessionId,
        user_id: eventData.userId,
      };

      const { error } = await supabase.from('quiz_analytics').insert([insertData]);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao rastrear evento:', error);
      // Não fazer throw aqui para não quebrar o fluxo principal
    }
  },

  // ========== CONVERSIONS ==========
  async recordConversion(conversionData: {
    sessionId: string;
    conversionType: string;
    conversionValue?: number;
    currency?: string;
    productId?: string;
    productName?: string;
    commissionRate?: number;
    affiliateId?: string;
    conversionData?: any;
  }): Promise<string> {
    try {
      const insertData: InsertQuizConversion = {
        session_id: conversionData.sessionId,
        conversion_type: conversionData.conversionType,
        conversion_value: conversionData.conversionValue,
        currency: conversionData.currency || 'BRL',
        product_id: conversionData.productId,
        product_name: conversionData.productName,
        commission_rate: conversionData.commissionRate,
        affiliate_id: conversionData.affiliateId,
        conversion_data: conversionData.conversionData || {},
      };

      const { data, error } = await supabase
        .from('quiz_conversions')
        .insert([insertData])
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Erro ao registrar conversão:', error);
      throw error;
    }
  },
};

// Legacy functions for backwards compatibility
export const saveUserSession = async (sessionData: any) => {
  try {
    const user = await quizSupabaseService.createQuizUser({
      sessionId: sessionData.sessionId,
      email: sessionData.email,
      name: sessionData.name,
      utmSource: sessionData.utmSource,
      utmMedium: sessionData.utmMedium,
      utmCampaign: sessionData.utmCampaign,
    });

    const session = await quizSupabaseService.createQuizSession({
      funnelId: sessionData.funnelId,
      quizUserId: user.id,
      totalSteps: sessionData.totalSteps,
      maxScore: sessionData.maxScore,
    });

    return { success: true, userId: user.id, sessionId: session.id };
  } catch (error) {
    console.error('Erro ao salvar sessão:', error);
    return { success: false, error: error };
  }
};

export const saveQuizResponse = async (responseData: any) => {
  try {
    await quizSupabaseService.saveQuizResponse(responseData);
    return { success: true };
  } catch (error) {
    console.error('Erro ao salvar resposta:', error);
    return { success: false, error: error };
  }
};

export const getQuizAnalytics = async (funnelId: string) => {
  try {
    // Implementar analytics básicas baseadas nas tabelas criadas
    const { data: sessions, error } = await supabase
      .from('quiz_sessions')
      .select('status, score, max_score')
      .eq('funnel_id', funnelId);

    if (error) throw error;

    const totalSessions = sessions?.length || 0;
    const completedSessions = sessions?.filter(s => s.status === 'completed').length || 0;
    const averageScore = sessions?.length
      ? sessions.reduce((acc, s) => acc + (s.score || 0), 0) / sessions.length
      : 0;

    return {
      totalResponses: totalSessions,
      averageScore: Math.round(averageScore * 100) / 100,
      completionRate: totalSessions ? Math.round((completedSessions / totalSessions) * 100) : 0,
    };
  } catch (error) {
    console.error('Erro ao buscar analytics:', error);
    return {
      totalResponses: 0,
      averageScore: 0,
      completionRate: 0,
    };
  }
};
