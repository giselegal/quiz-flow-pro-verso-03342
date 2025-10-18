/**
 * 🎯 QUIZ SERVICE - Integração Real com Supabase
 * 
 * Service completo para gerenciar operações de quiz:
 * - Salvar participantes
 * - Salvar respostas
 * - Calcular resultados
 * - Persistir resultados
 * 
 * SPRINT 2 - Implementação com lógica real
 */

import { supabase } from '@/integrations/supabase/client';
import type { QuizSession, QuizAnswer } from '@/store/quizStore';

// ============================================================================
// TYPES
// ============================================================================

export interface QuizParticipant {
  id: string;
  name?: string;
  email?: string;
  sessionId: string;
  funnelId: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface QuizStepResponse {
  id: string;
  sessionId: string;
  stepNumber: number;
  questionId: string;
  questionText?: string;
  answerValue: string;
  answerText?: string;
  scoreEarned?: number;
  responseTimeMs?: number;
  respondedAt: Date;
  metadata?: Record<string, any>;
}

export interface QuizResult {
  id: string;
  sessionId: string;
  resultType: string;
  resultTitle?: string;
  resultDescription?: string;
  resultData: Record<string, any>;
  recommendation?: string;
  nextSteps?: Record<string, any>;
  createdAt: Date;
}

export interface StyleScores {
  [styleKey: string]: number;
}

// ============================================================================
// SERVICE
// ============================================================================

class QuizService {
  /**
   * Salvar participante do quiz
   */
  async saveParticipant(data: {
    name?: string;
    email?: string;
    sessionId: string;
    funnelId: string;
    metadata?: Record<string, any>;
  }): Promise<QuizParticipant> {
    try {
      // Salvar em quiz_users
      const { data: user, error: userError } = await supabase
        .from('quiz_users')
        .insert({
          name: data.name,
          email: data.email,
          session_id: data.sessionId,
        })
        .select()
        .single();

      if (userError) throw userError;

      // Criar sessão
      const { data: session, error: sessionError } = await supabase
        .from('quiz_sessions')
        .insert({
          funnel_id: data.funnelId,
          quiz_user_id: user.id,
          user_name: data.name,
          session_token: data.sessionId,
          status: 'started',
          current_step: 1,
          total_steps: 0,
          metadata: data.metadata || {},
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      return {
        id: user.id,
        name: data.name,
        email: data.email,
        sessionId: data.sessionId,
        funnelId: data.funnelId,
        createdAt: new Date(user.created_at),
        metadata: data.metadata,
      };
    } catch (error) {
      console.error('Error saving participant:', error);
      throw new Error('Failed to save participant');
    }
  }

  /**
   * Salvar respostas do quiz
   */
  async saveAnswers(
    sessionId: string,
    answers: QuizAnswer[]
  ): Promise<QuizStepResponse[]> {
    try {
      // Buscar sessão
      const { data: session, error: sessionError } = await supabase
        .from('quiz_sessions')
        .select('id')
        .eq('session_token', sessionId)
        .single();

      if (sessionError) throw sessionError;

      // Preparar dados para inserção
      const responsesData = answers.map((answer) => ({
        session_id: session.id,
        step_number: parseInt(answer.stepId.replace('step-', '')),
        question_id: answer.questionId,
        question_text: answer.questionText,
        answer_value: answer.answerValue,
        answer_text: answer.answerText,
        score_earned: answer.scoreEarned || 0,
        responded_at: answer.respondedAt.toISOString(),
        metadata: {},
      }));

      // Inserir respostas em batch
      const { data: responses, error: responsesError } = await supabase
        .from('quiz_step_responses')
        .insert(responsesData)
        .select();

      if (responsesError) throw responsesError;

      // Atualizar sessão com progresso
      await supabase
        .from('quiz_sessions')
        .update({
          current_step: Math.max(...answers.map((a) => parseInt(a.stepId.replace('step-', '')))),
          last_activity: new Date().toISOString(),
        })
        .eq('id', session.id);

      return responses.map((r) => ({
        id: r.id,
        sessionId,
        stepNumber: r.step_number,
        questionId: r.question_id,
        questionText: r.question_text || undefined,
        answerValue: r.answer_value || '',
        answerText: r.answer_text || undefined,
        scoreEarned: r.score_earned || undefined,
        responseTimeMs: r.response_time_ms || undefined,
        respondedAt: new Date(r.responded_at),
        metadata: (r.metadata as Record<string, any>) || {},
      }));
    } catch (error) {
      console.error('Error saving answers:', error);
      throw new Error('Failed to save answers');
    }
  }

  /**
   * Calcular resultados do quiz baseado em respostas
   */
  calculateResults(answers: QuizAnswer[]): StyleScores {
    const styleScores: StyleScores = {};

    // Agregar pontuações por estilo
    answers.forEach((answer) => {
      // Extrair estilo da resposta (assumindo formato "style:score")
      if (answer.scoreEarned && answer.answerValue) {
        const [style, score] = answer.answerValue.split(':');
        
        if (style && score) {
          styleScores[style] = (styleScores[style] || 0) + parseInt(score);
        } else if (answer.scoreEarned) {
          // Fallback: usar scoreEarned diretamente
          const genericStyle = 'general';
          styleScores[genericStyle] = (styleScores[genericStyle] || 0) + answer.scoreEarned;
        }
      }
    });

    return styleScores;
  }

  /**
   * Determinar estilo dominante
   */
  getDominantStyle(styleScores: StyleScores): string {
    let maxScore = 0;
    let dominantStyle = 'balanced';

    Object.entries(styleScores).forEach(([style, score]) => {
      if (score > maxScore) {
        maxScore = score;
        dominantStyle = style;
      }
    });

    return dominantStyle;
  }

  /**
   * Salvar resultados finais do quiz
   */
  async saveResults(
    sessionId: string,
    styleScores: StyleScores,
    resultData?: {
      title?: string;
      description?: string;
      recommendation?: string;
      nextSteps?: Record<string, any>;
    }
  ): Promise<QuizResult> {
    try {
      // Buscar sessão
      const { data: session, error: sessionError } = await supabase
        .from('quiz_sessions')
        .select('id')
        .eq('session_token', sessionId)
        .single();

      if (sessionError) throw sessionError;

      const dominantStyle = this.getDominantStyle(styleScores);
      const totalScore = Object.values(styleScores).reduce((sum, score) => sum + score, 0);

      // Inserir resultado
      const { data: result, error: resultError } = await supabase
        .from('quiz_results')
        .insert({
          session_id: session.id,
          result_type: dominantStyle,
          result_title: resultData?.title || `Estilo: ${dominantStyle}`,
          result_description: resultData?.description,
          result_data: {
            styleScores,
            dominantStyle,
            totalScore,
            ...resultData,
          },
          recommendation: resultData?.recommendation,
          next_steps: resultData?.nextSteps || {},
        })
        .select()
        .single();

      if (resultError) throw resultError;

      // Atualizar sessão como completa
      await supabase
        .from('quiz_sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          score: totalScore,
          max_score: totalScore,
          final_result: {
            styleScores,
            dominantStyle,
            totalScore,
          },
        })
        .eq('id', session.id);

      return {
        id: result.id,
        sessionId,
        resultType: result.result_type,
        resultTitle: result.result_title ?? undefined,
        resultDescription: result.result_description ?? undefined,
        resultData: (result.result_data || {}) as Record<string, any>,
        recommendation: result.recommendation ?? undefined,
        nextSteps: result.next_steps ? (result.next_steps as Record<string, any>) : undefined,
        createdAt: new Date(result.created_at),
      };
    } catch (error) {
      console.error('Error saving results:', error);
      throw new Error('Failed to save results');
    }
  }

  /**
   * Buscar sessão completa com respostas e resultado
   */
  async getSession(sessionId: string): Promise<{
    session: QuizSession | null;
    answers: QuizAnswer[];
    result: QuizResult | null;
  }> {
    try {
      // Buscar sessão
      const { data: sessionData, error: sessionError } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('session_token', sessionId)
        .single();

      if (sessionError) throw sessionError;

      // Buscar respostas
      const { data: responsesData, error: responsesError } = await supabase
        .from('quiz_step_responses')
        .select('*')
        .eq('session_id', sessionData.id);

      if (responsesError) throw responsesError;

      // Buscar resultado
      const { data: resultData, error: resultError } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('session_id', sessionData.id)
        .maybeSingle();

      // Converter para formato da store
      const session: QuizSession = {
        sessionId: sessionData.id,
        funnelId: sessionData.funnel_id,
        userId: sessionData.quiz_user_id,
        userName: undefined,
        startedAt: new Date(sessionData.started_at),
        completedAt: sessionData.completed_at ? new Date(sessionData.completed_at) : undefined,
        currentStep: sessionData.current_step || 1,
        totalSteps: sessionData.total_steps || 0,
        answers: [],
        score: sessionData.score || 0,
        maxScore: sessionData.max_score || 0,
        metadata: (sessionData.metadata as Record<string, any>) || {},
      };

      const answers: QuizAnswer[] = (responsesData || []).map((r) => ({
        stepId: `step-${r.step_number}`,
        questionId: r.question_id,
        questionText: r.question_text || '',
        answerValue: r.answer_value || '',
        answerText: r.answer_text || '',
        scoreEarned: r.score_earned || undefined,
        respondedAt: new Date(r.responded_at),
      }));

      const result: QuizResult | null = resultData
        ? {
            id: resultData.id,
            sessionId,
            resultType: resultData.result_type,
            resultTitle: resultData.result_title || undefined,
            resultDescription: resultData.result_description || undefined,
            resultData: (resultData.result_data as Record<string, any>) || {},
            recommendation: resultData.recommendation || undefined,
            nextSteps: (resultData.next_steps as Record<string, any>) || undefined,
            createdAt: new Date(resultData.created_at),
          }
        : null;

      return { session, answers, result };
    } catch (error) {
      console.error('Error fetching session:', error);
      throw new Error('Failed to fetch session');
    }
  }

  /**
   * Analytics: Buscar todas as sessões de um funnel
   */
  async getFunnelSessions(funnelId: string): Promise<QuizSession[]> {
    try {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('funnel_id', funnelId)
        .order('started_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((s) => ({
        sessionId: s.id,
        funnelId: s.funnel_id,
        userId: s.quiz_user_id,
        userName: undefined,
        startedAt: new Date(s.started_at),
        completedAt: s.completed_at ? new Date(s.completed_at) : undefined,
        currentStep: s.current_step || 1,
        totalSteps: s.total_steps || 0,
        answers: [],
        score: s.score || 0,
        maxScore: s.max_score || 0,
        metadata: (s.metadata as Record<string, any>) || {},
      }));
    } catch (error) {
      console.error('Error fetching funnel sessions:', error);
      throw new Error('Failed to fetch funnel sessions');
    }
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export const quizService = new QuizService();
export default quizService;
