
import { createClient } from '@supabase/supabase-js';
import { Quiz, QuizQuestion, QuizWithQuestions } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class QuizService {
  static async createQuiz(quizData: Omit<Quiz, 'id' | 'created_at' | 'updated_at'>): Promise<Quiz> {
    const { data, error } = await supabase
      .from('quizzes')
      .insert([quizData])
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar quiz: ${error.message}`);
    }

    return data;
  }

  static async getQuizzes(userId: string): Promise<Quiz[]> {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar quizzes: ${error.message}`);
    }

    return data || [];
  }

  static async getQuiz(id: string): Promise<Quiz | null> {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Erro ao buscar quiz: ${error.message}`);
    }

    return data;
  }

  static async getQuizById(id: string): Promise<QuizWithQuestions | null> {
    const quiz = await this.getQuiz(id);
    if (!quiz) return null;

    const questions = await this.getQuizQuestions(id);
    return {
      ...quiz,
      questions
    };
  }

  static async updateQuiz(id: string, updates: Partial<Quiz>): Promise<Quiz> {
    const { data, error } = await supabase
      .from('quizzes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar quiz: ${error.message}`);
    }

    return data;
  }

  static async deleteQuiz(id: string): Promise<void> {
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao deletar quiz: ${error.message}`);
    }
  }

  static async duplicateQuiz(id: string): Promise<Quiz> {
    const originalQuiz = await this.getQuiz(id);
    if (!originalQuiz) {
      throw new Error('Quiz não encontrado');
    }

    const { id: _, created_at, updated_at, ...quizData } = originalQuiz;
    const duplicatedQuiz = await this.createQuiz({
      ...quizData,
      title: `${originalQuiz.title} (Cópia)`,
      is_published: false
    });

    return duplicatedQuiz;
  }

  static async getQuizQuestions(quizId: string): Promise<QuizQuestion[]> {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('order_index', { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar perguntas: ${error.message}`);
    }

    return data || [];
  }

  static async createQuestion(questionData: Omit<QuizQuestion, 'id' | 'created_at'>): Promise<QuizQuestion> {
    const { data, error } = await supabase
      .from('quiz_questions')
      .insert([questionData])
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar pergunta: ${error.message}`);
    }

    return data;
  }

  static async addQuestion(quizId: string, questionData: Partial<QuizQuestion>): Promise<QuizQuestion> {
    const questionsCount = await this.getQuizQuestions(quizId);
    
    const newQuestion: Omit<QuizQuestion, 'id' | 'created_at'> = {
      quiz_id: quizId,
      question_text: questionData.question_text || 'Nova pergunta',
      question_type: questionData.question_type || 'multiple_choice',
      options: questionData.options || [],
      correct_answers: questionData.correct_answers || [],
      points: questionData.points || 1,
      time_limit: questionData.time_limit || null,
      required: questionData.required || true,
      explanation: questionData.explanation || null,
      hint: questionData.hint || null,
      media_url: questionData.media_url || null,
      media_type: questionData.media_type || null,
      tags: questionData.tags || [],
      order_index: questionsCount.length
    };

    return this.createQuestion(newQuestion);
  }

  static async updateQuestion(id: string, updates: Partial<QuizQuestion>): Promise<QuizQuestion> {
    const { data, error } = await supabase
      .from('quiz_questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar pergunta: ${error.message}`);
    }

    return data;
  }

  static async deleteQuestion(id: string): Promise<void> {
    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao deletar pergunta: ${error.message}`);
    }
  }

  static async reorderQuestions(quizId: string, questionIds: string[]): Promise<void> {
    const updates = questionIds.map((id, index) => ({
      id,
      order_index: index
    }));

    for (const update of updates) {
      await this.updateQuestion(update.id, { order_index: update.order_index });
    }
  }

  static async getPublicQuizzes(): Promise<Quiz[]> {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('is_public', true)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar quizzes públicos: ${error.message}`);
    }

    return data || [];
  }

  static async publishQuiz(id: string): Promise<Quiz> {
    return this.updateQuiz(id, { is_published: true });
  }

  static async unpublishQuiz(id: string): Promise<Quiz> {
    return this.updateQuiz(id, { is_published: false });
  }
}

export { Quiz, QuizQuestion, QuizWithQuestions };
