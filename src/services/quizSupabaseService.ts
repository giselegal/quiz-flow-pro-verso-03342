import { supabase } from '../integrations/supabase/client';
import type { Database } from '../integrations/supabase/types';

// =============================================================================
// TIPOS E INTERFACES COMPATÍVEIS COM SUPABASE
// =============================================================================

type QuizUserRow = Database['public']['Tables']['quiz_users']['Row'];
type QuizSessionRow = Database['public']['Tables']['quiz_sessions']['Row'];
type QuizStepResponseRow = Database['public']['Tables']['quiz_step_responses']['Row'];
type QuizResultRow = Database['public']['Tables']['quiz_results']['Row'];
type QuizAnalyticsRow = Database['public']['Tables']['quiz_analytics']['Row'];
type QuizConversionRow = Database['public']['Tables']['quiz_conversions']['Row'];

// Tipos Insert para Supabase
type QuizUserInsert = Database['public']['Tables']['quiz_users']['Insert'];
type QuizSessionInsert = Database['public']['Tables']['quiz_sessions']['Insert'];
type QuizStepResponseInsert = Database['public']['Tables']['quiz_step_responses']['Insert'];
type QuizResultInsert = Database['public']['Tables']['quiz_results']['Insert'];
type QuizAnalyticsInsert = Database['public']['Tables']['quiz_analytics']['Insert'];
type QuizConversionInsert = Database['public']['Tables']['quiz_conversions']['Insert'];

// =============================================================================
// INTERFACES INTERNAS (conversão de null para undefined)
// =============================================================================

export interface QuizUser {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  user_agent?: string;
  ip_address?: string;
  session_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuizSession {
  id?: string;
  session_id: string;
  user_id?: string;
  status: 'started' | 'in_progress' | 'completed' | 'abandoned';
  current_step: number;
  quiz_type: string;
  version: string;
  started_at?: string;
  completed_at?: string;
  last_activity_at?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface QuizStepResponse {
  id?: string;
  session_id: string;
  step_number: number;
  step_id: string;
  question_id?: string;
  selected_options: string[];
  response_data: Record<string, any>;
  style_category?: string;
  strategic_category?: string;
  time_taken_seconds?: number;
  answered_at?: string;
  metadata?: Record<string, any>;
}

export interface QuizResult {
  id?: string;
  session_id: string;
  predominant_style: string;
  predominant_percentage: number;
  complementary_styles: Array<{
    style: string;
    percentage: number;
  }>;
  style_scores: Record<string, number>;
  calculation_details?: Record<string, any>;
  strategic_data?: Record<string, any>;
  lead_score?: number;
  recommended_products?: any[];
  personalized_message?: string;
  calculated_at?: string;
  created_at?: string;
}

// =============================================================================
// UTILITÁRIOS DE CONVERSÃO
// =============================================================================

function convertNullToUndefined<T>(obj: any): T {
  if (obj === null) return undefined as T;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(convertNullToUndefined) as T;
  
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = value === null ? undefined : 
                  (typeof value === 'object' ? convertNullToUndefined(value) : value);
  }
  return result as T;
}

// =============================================================================
// SERVIÇO PRINCIPAL
// =============================================================================

class QuizSupabaseService {
  private sessionId: string;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
  }

  // =========================================================================
  // GESTÃO DE SESSÃO
  // =========================================================================

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('quiz_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('quiz_session_id', sessionId);
    }
    return sessionId;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  // =========================================================================
  // USUÁRIOS
  // =========================================================================

  async createOrUpdateUser(userData: Partial<QuizUser>): Promise<QuizUser | null> {
    try {
      // Tentar encontrar usuário existente por session_id
      const { data: existingUser } = await supabase
        .from('quiz_users')
        .select('*')
        .eq('session_id', this.sessionId)
        .single();

      if (existingUser) {
        // Atualizar usuário existente
        const updateData: Partial<QuizUserInsert> = {
          ...userData,
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('quiz_users')
          .update(updateData)
          .eq('session_id', this.sessionId)
          .select()
          .single();

        if (error) throw error;
        return convertNullToUndefined<QuizUser>(data);
      } else {
        // Criar novo usuário
        const userPayload: QuizUserInsert = {
          session_id: this.sessionId,
          user_agent: navigator.userAgent,
          ...userData
        };

        const { data, error } = await supabase
          .from('quiz_users')
          .insert(userPayload)
          .select()
          .single();

        if (error) throw error;
        return convertNullToUndefined<QuizUser>(data);
      }
    } catch (error) {
      console.error('❌ Erro ao criar/atualizar usuário:', error);
      return null;
    }
  }

  async getUser(): Promise<QuizUser | null> {
    try {
      const { data, error } = await supabase
        .from('quiz_users')
        .select('*')
        .eq('session_id', this.sessionId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data ? convertNullToUndefined<QuizUser>(data) : null;
    } catch (error) {
      console.error('❌ Erro ao buscar usuário:', error);
      return null;
    }
  }

  // =========================================================================
  // SESSÕES
  // =========================================================================

  async startQuizSession(metadata?: Record<string, any>): Promise<QuizSession | null> {
    try {
      // Verificar se já existe uma sessão ativa
      const { data: existingSession } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('session_id', this.sessionId)
        .single();

      if (existingSession) {
        // Atualizar sessão existente para 'in_progress'
        const updateData: Partial<QuizSessionInsert> = {
          status: 'in_progress',
          last_activity_at: new Date().toISOString(),
          metadata: { 
            ...(existingSession.metadata as Record<string, any> || {}), 
            ...metadata 
          }
        };

        const { data, error } = await supabase
          .from('quiz_sessions')
          .update(updateData)
          .eq('session_id', this.sessionId)
          .select()
          .single();

        if (error) throw error;
        return convertNullToUndefined<QuizSession>(data);
      } else {
        // Criar nova sessão
        const sessionPayload: QuizSessionInsert = {
          session_id: this.sessionId,
          status: 'started',
          current_step: 1,
          quiz_type: 'style_quiz',
          version: 'v1.0',
          started_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString(),
          metadata: metadata || {}
        };

        const { data, error } = await supabase
          .from('quiz_sessions')
          .insert(sessionPayload)
          .select()
          .single();

        if (error) throw error;
        return convertNullToUndefined<QuizSession>(data);
      }
    } catch (error) {
      console.error('❌ Erro ao iniciar sessão do quiz:', error);
      return null;
    }
  }

  async updateSessionProgress(currentStep: number, status?: QuizSession['status']): Promise<QuizSession | null> {
    try {
      const updateData: Partial<QuizSessionInsert> = {
        current_step: currentStep,
        last_activity_at: new Date().toISOString()
      };

      if (status) {
        updateData.status = status;
        if (status === 'completed') {
          updateData.completed_at = new Date().toISOString();
        }
      }

      const { data, error } = await supabase
        .from('quiz_sessions')
        .update(updateData)
        .eq('session_id', this.sessionId)
        .select()
        .single();

      if (error) throw error;
      return convertNullToUndefined<QuizSession>(data);
    } catch (error) {
      console.error('❌ Erro ao atualizar progresso da sessão:', error);
      return null;
    }
  }

  async getSession(): Promise<QuizSession | null> {
    try {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('session_id', this.sessionId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data ? convertNullToUndefined<QuizSession>(data) : null;
    } catch (error) {
      console.error('❌ Erro ao buscar sessão:', error);
      return null;
    }
  }

  // =========================================================================
  // RESPOSTAS POR ETAPA
  // =========================================================================

  async saveStepResponse(response: Partial<QuizStepResponse>): Promise<QuizStepResponse | null> {
    try {
      // Verificar se já existe resposta para esta etapa
      const { data: existingResponse } = await supabase
        .from('quiz_step_responses')
        .select('*')
        .eq('session_id', this.sessionId)
        .eq('step_id', response.step_id!)
        .single();

      const responsePayload: QuizStepResponseInsert = {
        session_id: this.sessionId,
        answered_at: new Date().toISOString(),
        response_data: response.response_data || {},
        selected_options: response.selected_options || [],
        step_number: response.step_number!,
        step_id: response.step_id!,
        ...response
      };

      if (existingResponse) {
        // Atualizar resposta existente
        const { data, error } = await supabase
          .from('quiz_step_responses')
          .update(responsePayload)
          .eq('session_id', this.sessionId)
          .eq('step_id', response.step_id!)
          .select()
          .single();

        if (error) throw error;
        return convertNullToUndefined<QuizStepResponse>(data);
      } else {
        // Criar nova resposta
        const { data, error } = await supabase
          .from('quiz_step_responses')
          .insert(responsePayload)
          .select()
          .single();

        if (error) throw error;
        return convertNullToUndefined<QuizStepResponse>(data);
      }
    } catch (error) {
      console.error('❌ Erro ao salvar resposta da etapa:', error);
      return null;
    }
  }

  async getStepResponses(): Promise<QuizStepResponse[]> {
    try {
      const { data, error } = await supabase
        .from('quiz_step_responses')
        .select('*')
        .eq('session_id', this.sessionId)
        .order('step_number', { ascending: true });

      if (error) throw error;
      return data?.map(item => convertNullToUndefined<QuizStepResponse>(item)) || [];
    } catch (error) {
      console.error('❌ Erro ao buscar respostas das etapas:', error);
      return [];
    }
  }

  async getStepResponse(stepId: string): Promise<QuizStepResponse | null> {
    try {
      const { data, error } = await supabase
        .from('quiz_step_responses')
        .select('*')
        .eq('session_id', this.sessionId)
        .eq('step_id', stepId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data ? convertNullToUndefined<QuizStepResponse>(data) : null;
    } catch (error) {
      console.error('❌ Erro ao buscar resposta da etapa:', error);
      return null;
    }
  }

  // =========================================================================
  // RESULTADOS
  // =========================================================================

  async saveQuizResult(result: Partial<QuizResult>): Promise<QuizResult | null> {
    try {
      // Verificar se já existe resultado
      const { data: existingResult } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('session_id', this.sessionId)
        .single();

      const resultPayload: QuizResultInsert = {
        session_id: this.sessionId,
        calculated_at: new Date().toISOString(),
        predominant_style: result.predominant_style!,
        predominant_percentage: result.predominant_percentage!,
        complementary_styles: result.complementary_styles || [],
        style_scores: result.style_scores || {},
        ...result
      };

      if (existingResult) {
        // Atualizar resultado existente
        const { data, error } = await supabase
          .from('quiz_results')
          .update(resultPayload)
          .eq('session_id', this.sessionId)
          .select()
          .single();

        if (error) throw error;
        return convertNullToUndefined<QuizResult>(data);
      } else {
        // Criar novo resultado
        const { data, error } = await supabase
          .from('quiz_results')
          .insert(resultPayload)
          .select()
          .single();

        if (error) throw error;
        return convertNullToUndefined<QuizResult>(data);
      }
    } catch (error) {
      console.error('❌ Erro ao salvar resultado do quiz:', error);
      return null;
    }
  }

  async getQuizResult(): Promise<QuizResult | null> {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('session_id', this.sessionId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data ? convertNullToUndefined<QuizResult>(data) : null;
    } catch (error) {
      console.error('❌ Erro ao buscar resultado do quiz:', error);
      return null;
    }
  }

  // =========================================================================
  // ANALYTICS
  // =========================================================================

  async trackEvent(
    eventType: 'quiz_start' | 'step_view' | 'step_complete' | 'quiz_complete' | 'quiz_abandon' | 'button_click' | 'option_select' | 'checkout_click' | 'result_view',
    eventData?: {
      step_number?: number;
      step_id?: string;
      event_data?: Record<string, any>;
      ga4_tracked?: boolean;
      facebook_tracked?: boolean;
    }
  ): Promise<any> {
    try {
      const analyticsPayload: QuizAnalyticsInsert = {
        session_id: this.sessionId,
        event_type: eventType,
        event_timestamp: new Date().toISOString(),
        ...eventData
      };

      const { data, error } = await supabase
        .from('quiz_analytics')
        .insert(analyticsPayload)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Erro ao registrar evento de analytics:', error);
      return null;
    }
  }

  // =========================================================================
  // CONVERSÕES
  // =========================================================================

  async trackConversion(
    conversionType: 'checkout_click' | 'email_capture' | 'whatsapp_click' | 'product_view' | 'purchase',
    conversionData?: {
      conversion_value?: number;
      currency?: string;
      product_id?: string;
      product_name?: string;
      product_category?: string;
      conversion_data?: Record<string, any>;
    }
  ): Promise<any> {
    try {
      const conversionPayload: QuizConversionInsert = {
        session_id: this.sessionId,
        conversion_type: conversionType,
        converted_at: new Date().toISOString(),
        currency: 'BRL',
        ...conversionData
      };

      const { data, error } = await supabase
        .from('quiz_conversions')
        .insert(conversionPayload)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Erro ao registrar conversão:', error);
      return null;
    }
  }

  // =========================================================================
  // CÁLCULO DE RESULTADOS
  // =========================================================================

  async calculateStyleResults(): Promise<QuizResult | null> {
    try {
      // Buscar todas as respostas da sessão
      const responses = await this.getStepResponses();
      
      if (responses.length === 0) {
        console.warn('⚠️ Nenhuma resposta encontrada para calcular resultado');
        return null;
      }

      // Contar estilos
      const styleCounts: Record<string, number> = {};
      let totalStyleResponses = 0;

      responses.forEach(response => {
        if (response.style_category) {
          styleCounts[response.style_category] = (styleCounts[response.style_category] || 0) + 1;
          totalStyleResponses++;
        }
      });

      if (totalStyleResponses === 0) {
        console.warn('⚠️ Nenhuma resposta de estilo encontrada');
        return null;
      }

      // Calcular percentuais
      const styleScores: Record<string, number> = {};
      Object.keys(styleCounts).forEach(style => {
        styleScores[style] = Math.round((styleCounts[style] / totalStyleResponses) * 100);
      });

      // Encontrar estilo predominante
      const sortedStyles = Object.entries(styleScores)
        .sort(([, a], [, b]) => b - a);

      const [predominantStyle, predominantPercentage] = sortedStyles[0];

      // Estilos complementares (excluindo o predominante)
      const complementaryStyles = sortedStyles
        .slice(1)
        .map(([style, percentage]) => ({ style, percentage }));

      // Calcular lead score baseado em respostas estratégicas
      const strategicResponses = responses.filter(r => r.strategic_category);
      const leadScore = Math.min(strategicResponses.length * 20, 100);

      // Criar resultado
      const result: Partial<QuizResult> = {
        predominant_style: predominantStyle,
        predominant_percentage: predominantPercentage,
        complementary_styles: complementaryStyles,
        style_scores: styleScores,
        calculation_details: {
          total_responses: responses.length,
          style_responses: totalStyleResponses,
          strategic_responses: strategicResponses.length,
          raw_counts: styleCounts
        },
        strategic_data: {
          strategic_responses: strategicResponses.map(r => ({
            step_id: r.step_id,
            category: r.strategic_category,
            response: r.response_data
          }))
        },
        lead_score: leadScore
      };

      // Salvar resultado
      return await this.saveQuizResult(result);
    } catch (error) {
      console.error('❌ Erro ao calcular resultados:', error);
      return null;
    }
  }

  // =========================================================================
  // UTILITÁRIOS
  // =========================================================================

  async getFullQuizData(): Promise<{
    user: QuizUser | null;
    session: QuizSession | null;
    responses: QuizStepResponse[];
    result: QuizResult | null;
  }> {
    const [user, session, responses, result] = await Promise.all([
      this.getUser(),
      this.getSession(),
      this.getStepResponses(),
      this.getQuizResult()
    ]);

    return { user, session, responses, result };
  }

  // Limpar dados locais e criar nova sessão
  async resetQuizSession(): Promise<void> {
    localStorage.removeItem('quiz_session_id');
    localStorage.removeItem('quiz_user_responses');
    localStorage.removeItem('quiz_start_time');
    localStorage.removeItem('quiz_start_tracked');
    localStorage.removeItem('userName');
    
    this.sessionId = this.getOrCreateSessionId();
  }
}

// Instância singleton
export const quizSupabaseService = new QuizSupabaseService();
export default quizSupabaseService;
