
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  author_id: string;
  category: string;
  difficulty: string | null;
  time_limit: number | null;
  settings: any;
  is_public: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: string;
  options: any;
  correct_answers: any;
  points: number | null;
  time_limit: number | null;
  required: boolean | null;
  explanation: string | null;
  hint: string | null;
  media_url: string | null;
  media_type: string | null;
  tags: string[];
  order_index: number;
  created_at: string;
}

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

  static async publishQuiz(id: string): Promise<Quiz> {
    return this.updateQuiz(id, { is_published: true });
  }

  static async unpublishQuiz(id: string): Promise<Quiz> {
    return this.updateQuiz(id, { is_published: false });
  }
}
