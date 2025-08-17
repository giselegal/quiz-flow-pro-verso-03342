import { supabase } from '../lib/supabase';

export interface QuizData {
  id?: string;
  title: string;
  description?: string;
  author_id: string;
  category?: string;
  difficulty?: string;
  time_limit?: number;
  settings?: any;
  is_public?: boolean;
  is_published?: boolean;
}

export interface CreateQuestionData {
  quiz_id: string;
  question_text: string;
  question_type: string;
  options: any;
  correct_answers: any;
  points: number;
  time_limit?: number;
  required?: boolean;
  explanation?: string;
  hint?: string;
  media_url?: string;
  media_type?: string;
  tags: string[];
  order_index: number;
}

export class QuizService {
  static async createQuiz(quizData: QuizData) {
    const { data, error } = await supabase
      .from('quizzes')
      .insert([
        {
          title: quizData.title,
          description: quizData.description || null,
          author_id: quizData.author_id,
          category: quizData.category || 'general',
          difficulty: quizData.difficulty || null,
          time_limit: quizData.time_limit || null,
          settings: quizData.settings || {},
          is_public: quizData.is_public || false,
          is_published: quizData.is_published || false,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar quiz: ${error.message}`);
    }

    return data;
  }

  static async getQuizzes(userId: string) {
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

  static async getQuiz(id: string) {
    const { data, error } = await supabase.from('quizzes').select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Erro ao buscar quiz: ${error.message}`);
    }

    return data;
  }

  static async updateQuiz(id: string, updates: Partial<QuizData>) {
    const processedUpdates = {
      ...updates,
      difficulty: updates.difficulty || null,
    };

    const { data, error } = await supabase
      .from('quizzes')
      .update(processedUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar quiz: ${error.message}`);
    }

    return data;
  }

  static async deleteQuiz(id: string) {
    const { error } = await supabase.from('quizzes').delete().eq('id', id);

    if (error) {
      throw new Error(`Erro ao deletar quiz: ${error.message}`);
    }
  }

  static async createQuestions(questions: CreateQuestionData[]) {
    const questionsData = questions.map(q => ({
      quiz_id: q.quiz_id,
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options,
      correct_answers: q.correct_answers,
      points: q.points,
      time_limit: q.time_limit,
      required: q.required || false,
      explanation: q.explanation || '',
      hint: q.hint || '',
      media_url: q.media_url || null,
      media_type: q.media_type || null,
      tags: q.tags,
      order_index: q.order_index,
    }));

    const { data, error } = await supabase.from('quiz_questions').insert(questionsData).select();

    if (error) {
      throw new Error(`Erro ao criar perguntas: ${error.message}`);
    }

    return data;
  }

  static async getQuizQuestions(quizId: string) {
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

  static async updateQuestion(id: string, updates: Partial<CreateQuestionData>) {
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

  static async deleteQuestion(id: string) {
    const { error } = await supabase.from('quiz_questions').delete().eq('id', id);

    if (error) {
      throw new Error(`Erro ao deletar pergunta: ${error.message}`);
    }
  }

  static async publishQuiz(id: string) {
    return this.updateQuiz(id, { is_published: true });
  }

  static async unpublishQuiz(id: string) {
    return this.updateQuiz(id, { is_published: false });
  }
}
