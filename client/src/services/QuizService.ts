import { supabase } from '../lib/supabase';
import type { 
  Quiz, 
  Question, 
  QuizAttempt, 
  InsertQuiz, 
  InsertQuestion, 
  InsertQuizAttempt,
  UpdateQuiz,
  UpdateQuestion 
} from '../types/supabase';

export interface QuizWithQuestions extends Quiz {
  questions: Question[];
}

export interface QuizStats {
  total_attempts: number;
  average_score: number;
  completion_rate: number;
  average_time: number;
}

export class QuizService {
  // ====================================
  // CRUD OPERATIONS FOR QUIZZES
  // ====================================

  /**
   * Criar um novo quiz
   */
  static async createQuiz(quizData: InsertQuiz): Promise<{ data: Quiz | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .insert([quizData])
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar quiz:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obter quiz por ID (com questões)
   */
  static async getQuizById(id: string, includeQuestions = true): Promise<{ data: QuizWithQuestions | null; error: Error | null }> {
    try {
      // Buscar quiz
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single();

      if (quizError) throw quizError;

      let questions: Question[] = [];

      if (includeQuestions) {
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('quiz_id', id)
          .order('order_index');

        if (questionsError) throw questionsError;
        questions = questionsData || [];
      }

      const quizWithQuestions: QuizWithQuestions = {
        ...quiz,
        questions
      };

      return { data: quizWithQuestions, error: null };
    } catch (error) {
      console.error('Erro ao buscar quiz:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Listar quizzes do usuário
   */
  static async getUserQuizzes(userId: string): Promise<{ data: Quiz[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('author_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar quizzes do usuário:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Listar quizzes públicos
   */
  static async getPublicQuizzes(limit = 20, offset = 0): Promise<{ data: Quiz[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('is_public', true)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar quizzes públicos:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Atualizar quiz
   */
  static async updateQuiz(id: string, updates: UpdateQuiz): Promise<{ data: Quiz | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar quiz:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Deletar quiz
   */
  static async deleteQuiz(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Erro ao deletar quiz:', error);
      return { error: error as Error };
    }
  }

  // ====================================
  // CRUD OPERATIONS FOR QUESTIONS
  // ====================================

  /**
   * Adicionar questão ao quiz
   */
  static async addQuestion(questionData: InsertQuestion): Promise<{ data: Question | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert([questionData])
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Erro ao adicionar questão:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Atualizar questão
   */
  static async updateQuestion(id: string, updates: UpdateQuestion): Promise<{ data: Question | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar questão:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Deletar questão
   */
  static async deleteQuestion(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Erro ao deletar questão:', error);
      return { error: error as Error };
    }
  }

  /**
   * Reordenar questões
   */
  static async reorderQuestions(updates: { id: string; order_index: number }[]): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('questions')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Erro ao reordenar questões:', error);
      return { error: error as Error };
    }
  }

  // ====================================
  // QUIZ ATTEMPTS
  // ====================================

  /**
   * Submeter tentativa de quiz
   */
  static async submitQuizAttempt(attemptData: InsertQuizAttempt): Promise<{ data: QuizAttempt | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert([attemptData])
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Erro ao submeter tentativa:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obter tentativas de um usuário para um quiz
   */
  static async getUserAttempts(userId: string, quizId?: string): Promise<{ data: QuizAttempt[] | null; error: Error | null }> {
    try {
      let query = supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (quizId) {
        query = query.eq('quiz_id', quizId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar tentativas:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Obter estatísticas de um quiz
   */
  static async getQuizStats(quizId: string): Promise<{ data: QuizStats | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .rpc('get_quiz_stats', { quiz_uuid: quizId });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return { data: null, error: error as Error };
    }
  }

  // ====================================
  // UTILITY FUNCTIONS
  // ====================================

  /**
   * Publicar/despublicar quiz
   */
  static async toggleQuizPublication(id: string, isPublished: boolean): Promise<{ error: Error | null }> {
    return this.updateQuiz(id, { is_published: isPublished });
  }

  /**
   * Tornar quiz público/privado
   */
  static async toggleQuizVisibility(id: string, isPublic: boolean): Promise<{ error: Error | null }> {
    return this.updateQuiz(id, { is_public: isPublic });
  }

  /**
   * Duplicar quiz
   */
  static async duplicateQuiz(originalId: string, newTitle: string): Promise<{ data: QuizWithQuestions | null; error: Error | null }> {
    try {
      // Buscar quiz original com questões
      const { data: originalQuiz, error: fetchError } = await this.getQuizById(originalId);
      
      if (fetchError || !originalQuiz) {
        throw fetchError || new Error('Quiz não encontrado');
      }

      // Criar novo quiz
      const { data: newQuiz, error: createError } = await this.createQuiz({
        title: newTitle,
        description: originalQuiz.description,
        category: originalQuiz.category,
        difficulty: originalQuiz.difficulty,
        time_limit: originalQuiz.time_limit,
        settings: originalQuiz.settings,
        is_public: false, // Sempre criar como privado
        is_published: false
      });

      if (createError || !newQuiz) {
        throw createError || new Error('Erro ao criar quiz duplicado');
      }

      // Duplicar questões
      const questionsToInsert = originalQuiz.questions.map(q => ({
        quiz_id: newQuiz.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options,
        correct_answers: q.correct_answers,
        points: q.points,
        explanation: q.explanation,
        order_index: q.order_index
      }));

      if (questionsToInsert.length > 0) {
        const { error: questionsError } = await supabase
          .from('questions')
          .insert(questionsToInsert);

        if (questionsError) throw questionsError;
      }

      // Retornar quiz duplicado com questões
      return this.getQuizById(newQuiz.id);
    } catch (error) {
      console.error('Erro ao duplicar quiz:', error);
      return { data: null, error: error as Error };
    }
  }
}
