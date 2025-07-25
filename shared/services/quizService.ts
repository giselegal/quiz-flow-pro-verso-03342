// =============================================================================
// SERVIÇOS PARA OPERAÇÕES DE QUIZ
// Sistema de Quiz Quest Challenge Verse
// =============================================================================

import { supabase } from '../lib/supabase';
import {
  Quiz,
  Question,
  QuizAttempt,
  CreateQuizData,
  CreateQuestionData,
  UpdateQuizData,
  UpdateQuestionData,
  QuizFilters,
  QuizSearchResult,
  ApiResponse,
  AnalyticsEvent,
  QuizPerformanceMetrics,
} from '../types/supabase';

// =============================================================================
// SERVIÇOS DE QUIZ
// =============================================================================

export class QuizService {
  /**
   * Cria um novo quiz
   */
  static async createQuiz(data: CreateQuizData): Promise<ApiResponse<Quiz>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'Usuário não autenticado', success: false };
      }

      const { questions, ...quizData } = data;

      // Criar o quiz
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .insert([{
          ...quizData,
          author_id: user.id,
        }])
        .select()
        .single();

      if (quizError) {
        return { data: null, error: quizError.message, success: false };
      }

      // Criar as perguntas
      if (questions && questions.length > 0) {
        const questionsData = questions.map((q, index) => ({
          ...q,
          quiz_id: quiz.id,
          order_index: index,
        }));

        const { error: questionsError } = await supabase
          .from('questions')
          .insert(questionsData);

        if (questionsError) {
          // Se falhou ao criar perguntas, remover o quiz
          await supabase.from('quizzes').delete().eq('id', quiz.id);
          return { data: null, error: questionsError.message, success: false };
        }
      }

      return { data: quiz, error: null, success: true };
    } catch (error) {
      console.error('Erro ao criar quiz:', error);
      return { data: null, error: 'Erro interno do servidor', success: false };
    }
  }

  /**
   * Obtém um quiz por ID
   */
  static async getQuiz(id: string, includeQuestions = true): Promise<ApiResponse<Quiz & { questions?: Question[] }>> {
    try {
      let query = supabase
        .from('quizzes')
        .select(`
          *,
          profiles:author_id (full_name, avatar_url)
        `)
        .eq('id', id)
        .single();

      const { data: quiz, error: quizError } = await query;

      if (quizError) {
        return { data: null, error: quizError.message, success: false };
      }

      let questions: Question[] = [];
      if (includeQuestions) {
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('quiz_id', id)
          .order('order_index');

        if (questionsError) {
          return { data: null, error: questionsError.message, success: false };
        }

        questions = questionsData || [];
      }

      return {
        data: { ...quiz, questions: includeQuestions ? questions : undefined },
        error: null,
        success: true,
      };
    } catch (error) {
      console.error('Erro ao obter quiz:', error);
      return { data: null, error: 'Erro interno do servidor', success: false };
    }
  }

  /**
   * Atualiza um quiz
   */
  static async updateQuiz(data: UpdateQuizData): Promise<ApiResponse<Quiz>> {
    try {
      const { id, questions, ...updateData } = data;

      // Atualizar o quiz
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (quizError) {
        return { data: null, error: quizError.message, success: false };
      }

      // Se há perguntas para atualizar
      if (questions) {
        // Remover perguntas existentes
        await supabase.from('questions').delete().eq('quiz_id', id);

        // Inserir novas perguntas
        if (questions.length > 0) {
          const questionsData = questions.map((q, index) => ({
            ...q,
            quiz_id: id,
            order_index: index,
          }));

          const { error: questionsError } = await supabase
            .from('questions')
            .insert(questionsData);

          if (questionsError) {
            return { data: null, error: questionsError.message, success: false };
          }
        }
      }

      return { data: quiz, error: null, success: true };
    } catch (error) {
      console.error('Erro ao atualizar quiz:', error);
      return { data: null, error: 'Erro interno do servidor', success: false };
    }
  }

  /**
   * Deleta um quiz
   */
  static async deleteQuiz(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', id);

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: true, error: null, success: true };
    } catch (error) {
      console.error('Erro ao deletar quiz:', error);
      return { data: null, error: 'Erro interno do servidor', success: false };
    }
  }

  /**
   * Busca quizzes com filtros
   */
  static async searchQuizzes(filters: QuizFilters = {}): Promise<ApiResponse<QuizSearchResult>> {
    try {
      let query = supabase
        .from('quizzes')
        .select(`
          *,
          profiles:author_id (full_name, avatar_url)
        `, { count: 'exact' });

      // Aplicar filtros
      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }

      if (filters.is_public !== undefined) {
        query = query.eq('is_public', filters.is_public);
      }

      if (filters.author_id) {
        query = query.eq('author_id', filters.author_id);
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.tags && filters.tags.length > 0) {
        query = query.contains('tags', filters.tags);
      }

      // Ordenação
      const sortBy = filters.sort_by || 'updated_at';
      const sortOrder = filters.sort_order || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Paginação
      const limit = filters.limit || 20;
      const offset = filters.offset || 0;
      query = query.range(offset, offset + limit - 1);

      const { data: quizzes, error, count } = await query;

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return {
        data: {
          quizzes: quizzes || [],
          total: count || 0,
          has_more: (count || 0) > offset + limit,
        },
        error: null,
        success: true,
      };
    } catch (error) {
      console.error('Erro ao buscar quizzes:', error);
      return { data: null, error: 'Erro interno do servidor', success: false };
    }
  }

  /**
   * Obtém quizzes do usuário atual
   */
  static async getUserQuizzes(): Promise<ApiResponse<Quiz[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'Usuário não autenticado', success: false };
      }

      const { data: quizzes, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('author_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: quizzes || [], error: null, success: true };
    } catch (error) {
      console.error('Erro ao obter quizzes do usuário:', error);
      return { data: null, error: 'Erro interno do servidor', success: false };
    }
  }

  /**
   * Publica/despublica um quiz
   */
  static async togglePublish(id: string, isPublished: boolean): Promise<ApiResponse<Quiz>> {
    try {
      const { data: quiz, error } = await supabase
        .from('quizzes')
        .update({ is_published: isPublished })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: quiz, error: null, success: true };
    } catch (error) {
      console.error('Erro ao alterar status de publicação:', error);
      return { data: null, error: 'Erro interno do servidor', success: false };
    }
  }

  /**
   * Duplica um quiz
   */
  static async duplicateQuiz(id: string, newTitle?: string): Promise<ApiResponse<Quiz>> {
    try {
      const { data: originalQuiz } = await this.getQuiz(id, true);
      if (!originalQuiz) {
        return { data: null, error: 'Quiz não encontrado', success: false };
      }

      const title = newTitle || `${originalQuiz.title} (Cópia)`;
      const { questions, ...quizData } = originalQuiz;

      const createData: CreateQuizData = {
        ...quizData,
        title,
        is_published: false,
        is_public: false,
        questions: questions?.map(({ id, quiz_id, created_at, time_limit, ...q }) => ({
          ...q,
          time_limit: time_limit === null ? undefined : time_limit,
        })) || [],
      };

      return await this.createQuiz(createData);
    } catch (error) {
      console.error('Erro ao duplicar quiz:', error);
      return { data: null, error: 'Erro interno do servidor', success: false };
    }
  }
}

// =============================================================================
// SERVIÇOS DE PERGUNTAS
// =============================================================================

export class QuestionService {
  /**
   * Adiciona uma pergunta a um quiz
   */
  static async addQuestion(quizId: string, data: CreateQuestionData): Promise<ApiResponse<Question>> {
    try {
      const { data: question, error } = await supabase
        .from('questions')
        .insert([{
          ...data,
          quiz_id: quizId,
        }])
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: question, error: null, success: true };
    } catch (error) {
      console.error('Erro ao adicionar pergunta:', error);
      return { data: null, error: 'Erro interno do servidor', success: false };
    }
  }

  /**
   * Atualiza uma pergunta
   */
  static async updateQuestion(data: UpdateQuestionData): Promise<ApiResponse<Question>> {
    try {
      const { id, ...updateData } = data;

      const { data: question, error } = await supabase
        .from('questions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: question, error: null, success: true };
    } catch (error) {
      console.error('Erro ao atualizar pergunta:', error);
      return { data: null, error: 'Erro interno do servidor', success: false };
    }
  }

  /**
   * Remove uma pergunta
   */
  static async deleteQuestion(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: true, error: null, success: true };
    } catch (error) {
      console.error('Erro ao deletar pergunta:', error);
      return { data: null, error: 'Erro interno do servidor', success: false };
    }
  }

  /**
   * Reordena perguntas de um quiz
   */
  static async reorderQuestions(quizId: string, questionIds: string[]): Promise<ApiResponse<boolean>> {
    try {
      const updates = questionIds.map((id, index) => 
        supabase
          .from('questions')
          .update({ order_index: index })
          .eq('id', id)
          .eq('quiz_id', quizId)
      );

      await Promise.all(updates);

      return { data: true, error: null, success: true };
    } catch (error) {
      console.error('Erro ao reordenar perguntas:', error);
      return { data: null, error: 'Erro interno do servidor', success: false };
    }
  }
}

// =============================================================================
// SERVIÇOS DE TENTATIVAS
// =============================================================================

export class AttemptService {
  /**
   * Inicia uma nova tentativa de quiz
   */
  static async startAttempt(quizId: string): Promise<ApiResponse<QuizAttempt>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'Usuário não autenticado', success: false };
      }

      const { data: attempt, error } = await supabase
        .from('quiz_attempts')
        .insert([{
          quiz_id: quizId,
          user_id: user.id,
          answers: {},
          status: 'in_progress' as const,
        }])
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      // Registrar analytics
      await AnalyticsService.track({
        event_type: 'start',
        quiz_id: quizId,
        user_id: user.id,
      });

      return { data: attempt, error: null, success: true };
    } catch (error) {
      console.error('Erro ao iniciar tentativa:', error);
      return { data: null, error: 'Erro interno do servidor', success: false };
    }
  }

  /**
   * Atualiza uma tentativa em progresso
   */
  static async updateAttempt(
    attemptId: string,
    answers: Record<string, any>
  ): Promise<ApiResponse<QuizAttempt>> {
    try {
      const { data: attempt, error } = await supabase
        .from('quiz_attempts')
        .update({ answers })
        .eq('id', attemptId)
        .eq('status', 'in_progress')
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: attempt, error: null, success: true };
    } catch (error) {
      console.error('Erro ao atualizar tentativa:', error);
      return { data: null, error: 'Erro interno do servidor', success: false };
    }
  }

  /**
   * Finaliza uma tentativa de quiz
   */
  static async completeAttempt(
    attemptId: string,
    answers: Record<string, any>,
    score: number,
    maxScore: number,
    timeTaken: number
  ): Promise<ApiResponse<QuizAttempt>> {
    try {
      const percentageScore = (score / maxScore) * 100;
      
      const { data: attempt, error } = await supabase
        .from('quiz_attempts')
        .update({
          answers,
          score,
          max_score: maxScore,
          percentage_score: percentageScore,
          time_taken: timeTaken,
          status: 'completed' as const,
          completed_at: new Date().toISOString(),
        })
        .eq('id', attemptId)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      // Registrar analytics
      await AnalyticsService.track({
        event_type: 'complete',
        quiz_id: attempt.quiz_id,
        user_id: attempt.user_id,
        event_data: {
          score,
          max_score: maxScore,
          percentage_score: percentageScore,
          time_taken: timeTaken,
        },
      });

      return { data: attempt, error: null, success: true };
    } catch (error) {
      console.error('Erro ao finalizar tentativa:', error);
      return { data: null, error: 'Erro interno do servidor', success: false };
    }
  }

  /**
   * Obtém tentativas do usuário para um quiz
   */
  static async getUserAttempts(quizId: string): Promise<ApiResponse<QuizAttempt[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'Usuário não autenticado', success: false };
      }

      const { data: attempts, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('quiz_id', quizId)
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: attempts || [], error: null, success: true };
    } catch (error) {
      console.error('Erro ao obter tentativas do usuário:', error);
      return { data: null, error: 'Erro interno do servidor', success: false };
    }
  }
}

// =============================================================================
// SERVIÇOS DE ANALYTICS
// =============================================================================

export class AnalyticsService {
  /**
   * Registra um evento de analytics
   */
  static async track(event: AnalyticsEvent): Promise<void> {
    try {
      await supabase.from('quiz_analytics').insert([{
        ...event,
        session_id: this.getSessionId(),
        user_agent: navigator.userAgent,
      }]);
    } catch (error) {
      console.error('Erro ao registrar analytics:', error);
    }
  }

  /**
   * Obtém métricas de performance de um quiz
   */
  static async getQuizMetrics(quizId: string): Promise<ApiResponse<QuizPerformanceMetrics>> {
    try {
      // Buscar estatísticas básicas
      const { data: stats } = await supabase
        .from('quiz_stats')
        .select('*')
        .eq('id', quizId)
        .single();

      if (!stats) {
        return { data: null, error: 'Quiz não encontrado', success: false };
      }

      // Buscar analytics detalhados
      const { data: analytics } = await supabase
        .from('quiz_analytics')
        .select('*')
        .eq('quiz_id', quizId);

      const views = analytics?.filter(a => a.event_type === 'view').length || 0;
      const starts = analytics?.filter(a => a.event_type === 'start').length || 0;
      const completions = analytics?.filter(a => a.event_type === 'complete').length || 0;

      const metrics: QuizPerformanceMetrics = {
        quiz_id: quizId,
        total_views: views,
        total_starts: starts,
        total_completions: completions,
        completion_rate: starts > 0 ? (completions / starts) * 100 : 0,
        average_score: stats.avg_score || 0,
        average_time: 0, // TODO: calcular da tabela quiz_attempts
        questions_analytics: [], // TODO: implementar analytics por pergunta
      };

      return { data: metrics, error: null, success: true };
    } catch (error) {
      console.error('Erro ao obter métricas:', error);
      return { data: null, error: 'Erro interno do servidor', success: false };
    }
  }

  /**
   * Gera um ID de sessão único
   */
  private static getSessionId(): string {
    let sessionId = sessionStorage.getItem('quiz_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('quiz_session_id', sessionId);
    }
    return sessionId;
  }
}

// =============================================================================
// SERVIÇOS DE CATEGORIAS E TAGS
// =============================================================================

export class CategoryService {
  /**
   * Obtém todas as categorias
   */
  static async getCategories(): Promise<ApiResponse<any[]>> {
    try {
      const { data: categories, error } = await supabase
        .from('quiz_categories')
        .select('*')
        .order('name');

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: categories || [], error: null, success: true };
    } catch (error) {
      console.error('Erro ao obter categorias:', error);
      return { data: null, error: 'Erro interno do servidor', success: false };
    }
  }

  /**
   * Obtém todas as tags
   */
  static async getTags(): Promise<ApiResponse<any[]>> {
    try {
      const { data: tags, error } = await supabase
        .from('quiz_tags')
        .select('*')
        .order('name');

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: tags || [], error: null, success: true };
    } catch (error) {
      console.error('Erro ao obter tags:', error);
      return { data: null, error: 'Erro interno do servidor', success: false };
    }
  }
}
